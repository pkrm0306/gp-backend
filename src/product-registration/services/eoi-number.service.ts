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

export type EoiManufacturerProfile = {
  manufacturerInitial: string;
  gpInternalId: string;
};

/** Build EOI synchronously when manufacturer profile is already loaded (bulk / resequence). */
export function buildEoiNoFromManufacturerProfile(
  profile: EoiManufacturerProfile,
  manufacturerProductCount: number,
): string {
  if (
    !Number.isFinite(manufacturerProductCount) ||
    manufacturerProductCount < 1 ||
    manufacturerProductCount > 999
  ) {
    throw new BadRequestException(
      'Manufacturer product sequence must be between 1 and 999',
    );
  }

  const manufacturerInitial = profile.manufacturerInitial?.trim();
  if (!manufacturerInitial) {
    throw new BadRequestException('Manufacturer does not have manufacturerInitial set.');
  }

  const gpInternalId = profile.gpInternalId?.trim();
  if (!gpInternalId) {
    throw new BadRequestException('Manufacturer does not have gpInternalId set.');
  }

  const internalIdMatch = gpInternalId.match(/-(\d+)$/);
  const internalId = internalIdMatch
    ? internalIdMatch[1].padStart(3, '0')
    : '000';
  const paddedCount = manufacturerProductCount.toString().padStart(3, '0');
  return `GP${manufacturerInitial}${internalId}${paddedCount}`;
}

/**
 * Manufacturer-scoped EOI assignment.
 * Active pool = productStatus 0/1/2 and not soft-deleted.
 * Inactive rows (rejected, expired, soft-deleted) keep their stored eoiNo.
 * New products receive max(active suffix) + 1 — never reclaim holes.
 * Rejected restore may reuse the previous sequence when it is free among active products
 * (see assignEoiForRejectedRestore).
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
   * Active EOI suffixes for a manufacturer (status 0/1/2, not soft-deleted).
   * Source of truth is the numeric suffix of eoiNo (last 3 digits).
   * Falls back to eoiSequence only when eoiNo cannot be parsed.
   * Rejected (status 3) rows are excluded by matchEoiSequenceActiveProducts.
   * `excludeProductIds` omits rows being restored so they cannot block their own sequence.
   */
  async getActiveSequenceSuffixes(
    manufacturerId: string | Types.ObjectId,
    session?: ClientSession,
    options?: { excludeProductIds?: ReadonlyArray<string | Types.ObjectId> },
  ): Promise<Set<number>> {
    const manufacturerObjectId =
      manufacturerId instanceof Types.ObjectId
        ? manufacturerId
        : new Types.ObjectId(String(manufacturerId));

    const useSession = session && session.inTransaction() ? session : undefined;

    const criteria: Record<string, unknown> = {
      manufacturerId: manufacturerObjectId,
    };
    const excludeIds = (options?.excludeProductIds ?? [])
      .map((id) =>
        id instanceof Types.ObjectId ? id : new Types.ObjectId(String(id)),
      )
      .filter((id) => Types.ObjectId.isValid(id));
    if (excludeIds.length === 1) {
      criteria._id = { $ne: excludeIds[0] };
    } else if (excludeIds.length > 1) {
      criteria._id = { $nin: excludeIds };
    }

    const rows = await this.productModel
      .find(matchEoiSequenceActiveProducts(criteria), {
        eoiNo: 1,
        eoiSequence: 1,
      })
      .session(useSession ?? null)
      .lean()
      .exec();

    const suffixes = new Set<number>();
    for (const row of rows) {
      const fromEoi = parseEoiSequenceSuffix(row.eoiNo);
      const fromField =
        row.eoiSequence != null && Number.isFinite(Number(row.eoiSequence))
          ? Number(row.eoiSequence)
          : null;
      // eoiNo suffix is authoritative for "is sequence N occupied?"
      const suffix = fromEoi ?? fromField;
      if (suffix != null && suffix >= 1) {
        suffixes.add(suffix);
      }
    }
    return suffixes;
  }

  /**
   * Max numeric EOI suffix among active (0/1/2, non-deleted) products for a manufacturer.
   */
  async getMaxActiveSequenceSuffix(
    manufacturerId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const suffixes = await this.getActiveSequenceSuffixes(
      manufacturerId,
      session,
    );
    let maxSuffix = 0;
    for (const suffix of suffixes) {
      if (suffix > maxSuffix) {
        maxSuffix = suffix;
      }
    }
    return maxSuffix;
  }

  /**
   * Whether sequence N is occupied by an ACTIVE product (0/1/2, not soft-deleted)
   * for the manufacturer. Rejected products do not count.
   * `reservedSequences` covers EOIs already assigned earlier in the same restore txn.
   */
  async isActiveSequenceOccupied(
    manufacturerId: string | Types.ObjectId,
    sequence: number,
    session?: ClientSession,
    options?: {
      reservedSequences?: ReadonlySet<number>;
      excludeProductIds?: ReadonlyArray<string | Types.ObjectId>;
    },
  ): Promise<boolean> {
    if (!Number.isFinite(sequence) || sequence < 1) {
      return true;
    }
    if (options?.reservedSequences?.has(sequence)) {
      return true;
    }
    const suffixes = await this.getActiveSequenceSuffixes(
      manufacturerId,
      session,
      { excludeProductIds: options?.excludeProductIds },
    );
    return suffixes.has(sequence);
  }

  /**
   * Rejected-restore EOI assignment only:
   * - If previous sequence from previousEoiNo is free among ACTIVE products → reuse it.
   * - Else → MAX(active ∪ reserved) + 1.
   * The product being restored must be excluded from the active occupancy check so it
   * cannot block reuse of its own previous sequence (status races / stale reads).
   * New registration must continue to use assignNextActiveEoiNo / generateNextEoiNo (max+1 only).
   */
  async assignEoiForRejectedRestore(
    manufacturerId: string,
    previousEoiNo: string,
    session?: ClientSession,
    options?: {
      reservedSequences?: Set<number>;
      excludeProductId?: string | Types.ObjectId;
    },
  ): Promise<NextActiveEoiAssignment> {
    return this.withManufacturerLock(manufacturerId, async () => {
      const previousSequence = parseEoiSequenceSuffix(previousEoiNo);
      const excludeProductIds = options?.excludeProductId
        ? [options.excludeProductId]
        : undefined;
      const activeSuffixes = await this.getActiveSequenceSuffixes(
        manufacturerId,
        session,
        { excludeProductIds },
      );
      const reserved = options?.reservedSequences;

      let nextSequence: number;
      if (
        previousSequence != null &&
        !activeSuffixes.has(previousSequence) &&
        !reserved?.has(previousSequence)
      ) {
        nextSequence = previousSequence;
      } else {
        let maxSuffix = 0;
        for (const suffix of activeSuffixes) {
          if (suffix > maxSuffix) maxSuffix = suffix;
        }
        if (reserved) {
          for (const suffix of reserved) {
            if (suffix > maxSuffix) maxSuffix = suffix;
          }
        }
        nextSequence = maxSuffix + 1;
      }

      reserved?.add(nextSequence);

      const eoiNo = await this.buildEoiNo(
        manufacturerId,
        nextSequence,
        session,
      );
      return {
        eoiNo,
        eoiSequence: nextSequence,
        previousEoiNo,
      };
    });
  }

  /** Load manufacturer fields needed to build EOIs (call once per bulk/resequence batch). */
  async loadManufacturerEoiProfile(
    manufacturerId: string,
  ): Promise<EoiManufacturerProfile> {
    const manufacturer = await this.manufacturersService.findById(manufacturerId);
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    const manufacturerInitial = String(
      manufacturer.manufacturerInitial ?? '',
    ).trim();
    if (!manufacturerInitial) {
      throw new BadRequestException(
        `Manufacturer ${manufacturerId} does not have manufacturerInitial set.`,
      );
    }

    const gpInternalId = String(manufacturer.gpInternalId ?? '').trim();
    if (!gpInternalId) {
      throw new BadRequestException(
        `Manufacturer ${manufacturerId} does not have gpInternalId set.`,
      );
    }

    return { manufacturerInitial, gpInternalId };
  }

  /**
   * Build EOI for the given manufacturer and 1-based manufacturer product sequence.
   */
  async buildEoiNo(
    manufacturerId: string,
    manufacturerProductCount: number,
    _session?: ClientSession,
  ): Promise<string> {
    const profile = await this.loadManufacturerEoiProfile(manufacturerId);
    return buildEoiNoFromManufacturerProfile(profile, manufacturerProductCount);
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
