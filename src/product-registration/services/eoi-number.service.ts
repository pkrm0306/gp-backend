import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { ManufacturersService } from '../../manufacturers/manufacturers.service';
import { matchActiveProducts } from '../constants/active-product.filter';

/**
 * Centralized EOI number generation and active-product counting.
 * Soft-deleted products are excluded so future EOIs never reuse deleted sequence slots incorrectly.
 */
@Injectable()
export class EoiNumberService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly manufacturersService: ManufacturersService,
  ) {}

  /**
   * Count active (non–soft-deleted) products for a manufacturer.
   */
  async countActiveProductsByManufacturer(
    manufacturerId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const manufacturerObjectId =
      manufacturerId instanceof Types.ObjectId
        ? manufacturerId
        : new Types.ObjectId(String(manufacturerId));

    const useSession = session && session.inTransaction() ? session : undefined;

    return this.productModel
      .countDocuments(
        matchActiveProducts({ manufacturerId: manufacturerObjectId }),
        { session: useSession },
      )
      .exec();
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
   * Next EOI for a new registration (active count + 1).
   */
  async generateNextEoiNo(
    manufacturerId: string,
    session?: ClientSession,
  ): Promise<string> {
    const count = await this.countActiveProductsByManufacturer(
      manufacturerId,
      session,
    );
    return this.buildEoiNo(manufacturerId, count + 1, session);
  }
}
