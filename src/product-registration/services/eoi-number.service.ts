import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../schemas/product-plant.schema';
import { ManufacturersService } from '../../manufacturers/manufacturers.service';
import { matchEoiSequenceActiveProducts } from '../constants/eoi-sequence-active.filter';
import { matchActiveProductPlants } from '../constants/active-product.filter';
import { parseEoiSequenceSuffix } from '../helpers/eoi-sequence.helper';

export type NextActiveEoiAssignment = {
  eoiNo: string;
  eoiSequence: number;
  previousEoiNo?: string;
};

/**
 * Manufacturer-scoped EOI assignment.
 * Active pool = productStatus 0/1/2 and not soft-deleted.
 * Inactive rows (rejected, expired, soft-deleted) keep their stored eoiNo.
 * New/restored active products receive max(active suffix) + 1 — never compact siblings.
 */
@Injectable()
export class EoiNumberService {
  private readonly manufacturerLocks = new Map<string, Promise<void>>();

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private readonly productPlantModel: Model<ProductPlantDocument>,
    private readonly manufacturersService: ManufacturersService,
  ) {}

  /**
   * Max numeric EOI suffix among active (0/1/2, non-deleted) products for a manufacturer.
   */
  async getMaxActiveSequenceSuffix(
    manufacturerId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const manufacturerObjectId =
      manufacturerId instanceof Types.ObjectId
        ? manufacturerId
        : new Types.ObjectId(String(manufacturerId));

    const useSession = session && session.inTransaction() ? session : undefined;

    const rows = await this.productModel
      .find(
        matchEoiSequenceActiveProducts({
          manufacturerId: manufacturerObjectId,
        }),
        { eoiNo: 1, eoiSequence: 1 },
      )
      .session(useSession ?? null)
      .lean()
      .exec();

    let maxSuffix = 0;
    for (const row of rows) {
      const fromField =
        row.eoiSequence != null && Number.isFinite(Number(row.eoiSequence))
          ? Number(row.eoiSequence)
          : null;
      const fromEoi = parseEoiSequenceSuffix(row.eoiNo);
      const suffix = fromField ?? fromEoi ?? 0;
      if (suffix > maxSuffix) {
        maxSuffix = suffix;
      }
    }
    return maxSuffix;
  }

  /**
   * Build EOI for the given manufacturer and 1-based manufacturer product sequence.
   */
  async buildEoiNo(
    manufacturerId: string,
    manufacturerProductCount: number,
    _session?: ClientSession,
  ): Promise<string> {
    if (
      !Number.isFinite(manufacturerProductCount) ||
      manufacturerProductCount < 1 ||
      manufacturerProductCount > 999
    ) {
      throw new BadRequestException(
        'Manufacturer product sequence must be between 1 and 999',
      );
    }

    const manufacturer = await this.manufacturersService.findById(manufacturerId);
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    const manufacturerInitial = manufacturer.manufacturerInitial;
    if (!manufacturerInitial?.trim()) {
      throw new BadRequestException(
        `Manufacturer ${manufacturerId} does not have manufacturerInitial set.`,
      );
    }

    const gpInternalId = manufacturer.gpInternalId;
    if (!gpInternalId?.trim()) {
      throw new BadRequestException(
        `Manufacturer ${manufacturerId} does not have gpInternalId set.`,
      );
    }

    const internalIdMatch = gpInternalId.match(/-(\d+)$/);
    let internalId: string;
    if (internalIdMatch) {
      internalId = internalIdMatch[1].padStart(3, '0');
    } else {
      internalId = '000';
    }

    const paddedCount = manufacturerProductCount.toString().padStart(3, '0');
    return `GP${manufacturerInitial}${internalId}${paddedCount}`;
  }

  /**
   * Next EOI for a new registration: max active suffix + 1.
   */
  async generateNextEoiNo(
    manufacturerId: string,
    session?: ClientSession,
  ): Promise<string> {
    const assignment = await this.assignNextActiveEoiNo(
      manufacturerId,
      session,
    );
    return assignment.eoiNo;
  }

  /**
   * Assign next active EOI within a transaction, optionally from a running max
   * (for bulk restore / bulk register in one txn).
   */
  async assignNextActiveEoiNo(
    manufacturerId: string,
    session?: ClientSession,
    options?: {
      runningMaxSuffix?: number;
      previousEoiNo?: string;
    },
  ): Promise<NextActiveEoiAssignment> {
    return this.withManufacturerLock(manufacturerId, async () => {
      const baseMax =
        options?.runningMaxSuffix ??
        (await this.getMaxActiveSequenceSuffix(manufacturerId, session));
      const nextSequence = baseMax + 1;
      const eoiNo = await this.buildEoiNo(
        manufacturerId,
        nextSequence,
        session,
      );
      return {
        eoiNo,
        eoiSequence: nextSequence,
        previousEoiNo: options?.previousEoiNo,
      };
    });
  }

  /**
   * Apply a new EOI to a product row and sync active plants.
   */
  async applyEoiReassignment(
    productObjectId: Types.ObjectId,
    assignment: NextActiveEoiAssignment,
    now: Date,
    session?: ClientSession,
  ): Promise<void> {
    const useSession = session && session.inTransaction() ? session : undefined;
    const update: Record<string, unknown> = {
      eoiNo: assignment.eoiNo,
      eoiSequence: assignment.eoiSequence,
      updatedDate: now,
      eoiReassignedAt: now,
    };
    if (assignment.previousEoiNo) {
      update.previousEoiNo = assignment.previousEoiNo;
    }

    await this.productModel
      .updateOne({ _id: productObjectId }, { $set: update }, { session: useSession })
      .exec();

    await this.productPlantModel
      .updateMany(
        matchActiveProductPlants({ productId: productObjectId }),
        { $set: { eoiNo: assignment.eoiNo } },
        { session: useSession },
      )
      .exec();
  }

  private async withManufacturerLock<T>(
    manufacturerId: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    const previous = this.manufacturerLocks.get(manufacturerId) ?? Promise.resolve();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const current = previous.then(() => gate);
    this.manufacturerLocks.set(manufacturerId, current);
    try {
      await previous;
      return await operation();
    } finally {
      release();
      if (this.manufacturerLocks.get(manufacturerId) === current) {
        this.manufacturerLocks.delete(manufacturerId);
      }
    }
  }
}
