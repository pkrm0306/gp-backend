import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import {
  ClientSession,
  Connection,
  Model,
  Types,
} from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../schemas/product-plant.schema';
import { ManufacturersService } from '../../manufacturers/manufacturers.service';
import { RedisService } from '../../common/redis/redis.service';
import {
  matchActiveProductPlants,
  matchActiveProducts,
} from '../constants/active-product.filter';
import {
  compareProductsForResequence,
  findDuplicateEoiSequenceSuffixes,
} from '../helpers/eoi-sequence.helper';
import { matchEoiSequenceActiveProducts } from '../constants/eoi-sequence-active.filter';
import {
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_SUBMITTED,
} from '../../renew/constants/product-status.constants';
import { EoiNumberService } from './eoi-number.service';
import { invalidateProductListingsCache as invalidateAllProductListingsCache } from '../helpers/invalidate-product-listings-cache.util';

export type SoftDeleteProductResult = {
  success: true;
  message: string;
  deleted_product_id: string;
  deleted_plant_count: number;
  updated_sequence_count: number;
  manufacturer_id: string;
};

const MAX_TRANSACTION_RETRIES = 5;
const MANUFACTURER_LOCK_TTL_MS = 60_000;

@Injectable()
export class ProductSoftDeleteService {
  private readonly logger = new Logger(ProductSoftDeleteService.name);

  /** In-process manufacturer locks (supplements MongoDB transactions for same-instance races). */
  private readonly manufacturerLocks = new Map<string, Promise<void>>();

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private readonly productPlantModel: Model<ProductPlantDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly manufacturersService: ManufacturersService,
    private readonly eoiNumberService: EoiNumberService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Soft-delete one EOI product and cascade to plants.
   * Deleting an uncertified product (pending/submitted) re-sequences active EOIs
   * (status 0/1/2) for the manufacturer. Rejected, discontinued, and soft-deleted
   * rows keep their stored eoiNo.
   */
  async softDeleteProduct(
    productId: string,
    deletedByUserId: string,
  ): Promise<SoftDeleteProductResult> {
    if (!deletedByUserId) {
      throw new BadRequestException('User ID not found in token');
    }

    const productObjectId = this.toObjectId(productId, 'productId');

    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= MAX_TRANSACTION_RETRIES; attempt++) {
      try {
        return await this.runSoftDeleteWithManufacturerLock(
          productObjectId,
          deletedByUserId,
        );
      } catch (error) {
        lastError = error as Error;
        if (
          this.isTransientTransactionError(error) &&
          attempt < MAX_TRANSACTION_RETRIES
        ) {
          this.logger.warn(
            `Soft delete retry ${attempt}/${MAX_TRANSACTION_RETRIES} for product ${productId}: ${lastError.message}`,
          );
          await this.delay(50 * attempt);
          continue;
        }
        throw error;
      }
    }

    throw lastError ?? new ConflictException('Soft delete failed after retries');
  }

  private async runSoftDeleteWithManufacturerLock(
    productObjectId: Types.ObjectId,
    deletedByUserId: string,
  ): Promise<SoftDeleteProductResult> {
    const product = await this.productModel
      .findById(productObjectId)
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.is_deleted === true) {
      throw new BadRequestException('Product is already deleted');
    }

    const productManufacturerId = String(product.manufacturerId);

    const manufacturer = await this.manufacturersService.findById(
      productManufacturerId,
    );
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    return this.withManufacturerLock(productManufacturerId, () =>
      this.executeSoftDeleteTransaction(
        productObjectId,
        productManufacturerId,
        deletedByUserId,
      ),
    );
  }

  private async executeSoftDeleteTransaction(
    productObjectId: Types.ObjectId,
    manufacturerId: string,
    deletedByUserId: string,
  ): Promise<SoftDeleteProductResult> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const now = new Date();
      const deletedByObjectId = this.toObjectId(deletedByUserId, 'deletedBy');
      const manufacturerObjectId = this.toObjectId(
        manufacturerId,
        'manufacturerId',
      );

      const product = await this.productModel
        .findOne(
          matchActiveProducts({
            _id: productObjectId,
            manufacturerId: manufacturerObjectId,
          }),
        )
        .session(session)
        .exec();

      if (!product) {
        throw new NotFoundException(
          'Product not found, already deleted, or no longer active',
        );
      }

      const plantSoftDeleteResult = await this.productPlantModel
        .updateMany(
          matchActiveProductPlants({ productId: productObjectId }),
          {
            $set: {
              is_deleted: true,
              deleted_at: now,
              deleted_by: deletedByObjectId,
            },
          },
          { session },
        )
        .exec();

      await this.productModel
        .updateOne(
          { _id: productObjectId, ...matchActiveProducts() },
          {
            $set: {
              is_deleted: true,
              deleted_at: now,
              deleted_by: deletedByObjectId,
              updatedDate: now,
            },
          },
          { session },
        )
        .exec();

      const deletedStatus = Number(product.productStatus);
      const shouldResequence =
        deletedStatus === PRODUCT_STATUS_PENDING ||
        deletedStatus === PRODUCT_STATUS_SUBMITTED;

      const updatedSequenceCount = shouldResequence
        ? await this.resequenceActiveEoisForManufacturer(manufacturerId, session)
        : 0;

      await session.commitTransaction();

      await this.invalidateProductListingsCache();

      return {
        success: true,
        message: shouldResequence
          ? 'EOI deleted and sequences rearranged successfully'
          : 'EOI deleted successfully',
        deleted_product_id: String(productObjectId),
        deleted_plant_count: plantSoftDeleteResult.modifiedCount ?? 0,
        updated_sequence_count: updatedSequenceCount,
        manufacturer_id: manufacturerId,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Re-number active EOIs 1..n for the manufacturer; sync eoiNo on all active plants per product.
   */
  private async resequenceActiveEoisForManufacturer(
    manufacturerId: string,
    session: ClientSession,
  ): Promise<number> {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );

    const activeProducts = await this.productModel
      .find(
        matchEoiSequenceActiveProducts({
          manufacturerId: manufacturerObjectId,
        }),
        { _id: 1, eoiNo: 1, createdDate: 1, productId: 1 },
      )
      .sort({ createdDate: 1, productId: 1 })
      .session(session)
      .lean()
      .exec();

    if (activeProducts.length === 0) {
      return 0;
    }

    const sorted = [...activeProducts].sort(compareProductsForResequence);

    const duplicates = findDuplicateEoiSequenceSuffixes(sorted);
    if (duplicates.length > 0) {
      this.logger.warn(
        `Duplicate EOI sequence suffixes detected for manufacturer ${manufacturerId}: [${duplicates.join(', ')}]. Re-sequencing will normalize order.`,
      );
    }

    const now = new Date();
    let updatedSequenceCount = 0;

    for (let index = 0; index < sorted.length; index++) {
      const sequenceNumber = index + 1;
      const newEoiNo = await this.eoiNumberService.buildEoiNo(
        manufacturerId,
        sequenceNumber,
        session,
      );

      if (sorted[index].eoiNo === newEoiNo) {
        continue;
      }

      await this.productModel
        .updateOne(
          { _id: sorted[index]._id },
          {
            $set: {
              eoiNo: newEoiNo,
              eoiSequence: sequenceNumber,
              updatedDate: now,
            },
          },
          { session },
        )
        .exec();

      const plantUpdate = await this.productPlantModel
        .updateMany(
          matchActiveProductPlants({ productId: sorted[index]._id }),
          { $set: { eoiNo: newEoiNo } },
          { session },
        )
        .exec();

      updatedSequenceCount += 1 + (plantUpdate.modifiedCount ?? 0);
    }

    return updatedSequenceCount;
  }

  /**
   * Re-sequence helper reused by non-delete flows that already run in a transaction.
   * Uses the exact same algorithm as delete flow.
   */
  async resequenceForManufacturerInSession(
    manufacturerId: string,
    session: ClientSession,
  ): Promise<number> {
    return this.resequenceActiveEoisForManufacturer(manufacturerId, session);
  }

  /**
   * Serialize delete/re-sequence operations per manufacturer (same Node process).
   * MongoDB transactions handle cross-document atomicity; this reduces write conflicts.
   */
  private async withManufacturerLock<T>(
    manufacturerId: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    const previous = this.manufacturerLocks.get(manufacturerId) ?? Promise.resolve();

    let releaseLock!: () => void;
    const current = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    const chained = previous
      .catch(() => undefined)
      .then(() =>
        Promise.race([
          operation(),
          this.delay(MANUFACTURER_LOCK_TTL_MS).then(() => {
            throw new ConflictException(
              'EOI delete operation timed out while waiting for manufacturer lock',
            );
          }),
        ]),
      )
      .finally(() => {
        releaseLock();
        if (this.manufacturerLocks.get(manufacturerId) === current) {
          this.manufacturerLocks.delete(manufacturerId);
        }
      });

    this.manufacturerLocks.set(manufacturerId, current);
    return chained as Promise<T>;
  }

  private async invalidateProductListingsCache(): Promise<void> {
    await invalidateAllProductListingsCache(this.redisService, this.logger);
  }

  private toObjectId(
    id: string | Types.ObjectId,
    fieldName: string,
  ): Types.ObjectId {
    if (!id) {
      throw new BadRequestException(`${fieldName} is required`);
    }
    if (id instanceof Types.ObjectId) {
      return id;
    }
    const idString = String(id).trim();
    if (!/^[0-9a-fA-F]{24}$/.test(idString)) {
      throw new BadRequestException(
        `Invalid ${fieldName} format. Must be a valid 24-character MongoDB ObjectId.`,
      );
    }
    return new Types.ObjectId(idString);
  }

  private isTransientTransactionError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }
    const err = error as { code?: number; errorLabels?: string[]; message?: string };
    if (err.code === 112) {
      return true;
    }
    if (Array.isArray(err.errorLabels) && err.errorLabels.includes('TransientTransactionError')) {
      return true;
    }
    const message = String(err.message ?? '');
    return (
      message.includes('WriteConflict') ||
      message.includes('TransientTransactionError')
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
