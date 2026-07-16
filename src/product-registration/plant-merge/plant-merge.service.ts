import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../schemas/product-plant.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
} from '../../renew/schemas/renewal-cycle.schema';
import {
  PlantMergeAudit,
  PlantMergeAuditDocument,
} from './schemas/plant-merge-audit.schema';
import { matchActiveProducts } from '../constants/active-product.filter';
import { matchActiveProductPlants } from '../constants/active-product.filter';
import { runInTransactionIfSupported } from '../../renew/helpers/mongo-session.util';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import { PlantMergeExecuteDto } from './dto/plant-merge-execute.dto';
import {
  PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS,
  PLANT_MERGE_STATUS,
  PLANT_MERGE_STRATEGY_ABSORB,
} from './plant-merge.constants';
import {
  PlantMergeBlocker,
  PlantMergePlantRow,
  PlantMergeProductRow,
  buildProductRenewalBlockers,
  derivePlantLocationLabel,
  isCertifiedProduct,
  normalizePlantNameKey,
  plantBelongsToProduct,
  validateRemainingPlantCount,
  validateSourcePlantSelection,
} from './helpers/plant-merge-eligibility.util';
import {
  normalizeTrimmedValue,
  parseObjectId,
} from '../helpers/merge-eligibility.shared';
import { hasInProgressRenewalCycle } from '../helpers/renewal-cycle-eligibility.util';
import {
  syncProductPlantCount,
} from '../helpers/sync-product-plant-count.util';
import { LifecycleNotificationService } from '../../notifications/lifecycle-notification.service';

export type PlantMergeSectionPlan = {
  collection: string;
  unitName: string;
  action: string;
};

export type PlantMergePreviewPlant = {
  plantId: string;
  productPlantId: number;
  plantName: string;
  location: string;
};

export type PlantMergePreviewResult = {
  success: true;
  canMerge: boolean;
  urnNo: string;
  eoiNo: string;
  productId: string;
  productIdNumeric: number;
  productName: string;
  targetPlant: PlantMergePreviewPlant;
  sourcePlants: PlantMergePreviewPlant[];
  plantCountBefore: number;
  plantCountAfter: number;
  blockers: PlantMergeBlocker[];
  manufacturingUnitRemovals: PlantMergeSectionPlan[];
  manufacturingUnitConflicts: PlantMergeSectionPlan[];
  warnings: string[];
};

export type PlantMergeExecuteResult = {
  success: true;
  mergeId: string;
  urnNo: string;
  eoiNo: string;
  targetPlantId: string;
  absorbedPlantIds: string[];
  plantCountAfter: number;
  manufacturingUnitsRemoved: string[];
  manufacturingUnitsSkipped: string[];
  targetDetailsUrl: string;
};

@Injectable()
export class PlantMergeService {
  private readonly logger = new Logger(PlantMergeService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private readonly productPlantModel: Model<ProductPlantDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(PlantMergeAudit.name)
    private readonly plantMergeAuditModel: Model<PlantMergeAuditDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly activityLogService: ActivityLogService,
    private readonly lifecycleNotification: LifecycleNotificationService,
  ) {}

  async preview(
    productId: string,
    targetPlantId: string,
    sourcePlantIds: string[],
  ): Promise<PlantMergePreviewResult> {
    const context = await this.buildMergeContext(
      productId,
      targetPlantId,
      sourcePlantIds,
    );
    const hasValidPlants =
      Boolean(context.targetPlant?._id) && context.sourcePlants.length > 0;
    const { manufacturingUnitRemovals, manufacturingUnitConflicts } =
      hasValidPlants
        ? await this.planManufacturingUnitChanges(
            context.product.urnNo,
            context.targetPlant,
            context.sourcePlants,
          )
        : {
            manufacturingUnitRemovals: [] as PlantMergeSectionPlan[],
            manufacturingUnitConflicts: [] as PlantMergeSectionPlan[],
          };

    const emptyPlant: PlantMergePreviewPlant = {
      plantId: '',
      productPlantId: 0,
      plantName: '',
      location: '',
    };

    return {
      success: true,
      canMerge: context.blockers.length === 0,
      urnNo: context.product.urnNo,
      eoiNo: context.product.eoiNo,
      productId: String(context.product._id),
      productIdNumeric: context.product.productId,
      productName: context.product.productName,
      targetPlant: hasValidPlants
        ? this.toPreviewPlant(context.targetPlant)
        : emptyPlant,
      sourcePlants: context.sourcePlants.map((plant) =>
        this.toPreviewPlant(plant),
      ),
      plantCountBefore: context.plantCountBefore,
      plantCountAfter: context.plantCountAfter,
      blockers: context.blockers,
      manufacturingUnitRemovals,
      manufacturingUnitConflicts,
      warnings: context.warnings,
    };
  }

  async execute(
    dto: PlantMergeExecuteDto,
    adminUserId: string,
  ): Promise<PlantMergeExecuteResult> {
    const strategy = String(dto.mergeStrategy ?? PLANT_MERGE_STRATEGY_ABSORB);
    if (strategy !== PLANT_MERGE_STRATEGY_ABSORB) {
      throw new BadRequestException(`Unsupported mergeStrategy: ${strategy}`);
    }

    const preview = await this.preview(
      dto.productId,
      dto.targetPlantId,
      dto.sourcePlantIds,
    );

    if (!preview.canMerge) {
      const firstBlockerMessage = String(preview.blockers?.[0]?.message ?? '').trim();
      throw new BadRequestException(
        firstBlockerMessage || 'Merge cannot be completed due to validation rules.',
      );
    }

    const context = await this.buildMergeContext(
      dto.productId,
      dto.targetPlantId,
      dto.sourcePlantIds,
    );

    const adminObjectId = new Types.ObjectId(adminUserId);
    const now = new Date();
    const sourceObjectIds = context.sourcePlants.map((plant) => plant._id);
    const sourceProductPlantIds = context.sourcePlants.map(
      (plant) => plant.productPlantId,
    );

    let manufacturingUnitsRemoved: string[] = [];
    let manufacturingUnitsSkipped: string[] = [];
    let plantCountAfter = context.plantCountAfter;

    const mergeId = await runInTransactionIfSupported(
      this.connection,
      async (session) => {
        const sessionOpts = session ? { session } : {};

        await this.productPlantModel.updateMany(
          matchActiveProductPlants({ _id: { $in: sourceObjectIds } }),
          {
            $set: {
              is_deleted: true,
              deleted_at: now,
              deleted_by: adminObjectId,
              mergedIntoPlantId: context.targetPlant._id,
              mergedAt: now,
            },
          },
          sessionOpts,
        );

        plantCountAfter = await syncProductPlantCount(
          this.productModel,
          this.productPlantModel,
          context.product._id,
          now,
          session,
        );

        const unitResult = await this.applyManufacturingUnitChanges(
          context.product.urnNo,
          context.targetPlant,
          context.sourcePlants,
          session,
        );
        manufacturingUnitsRemoved = unitResult.removed;
        manufacturingUnitsSkipped = unitResult.skipped;

        const audit = await this.plantMergeAuditModel.create(
          [
            {
              sourcePlantIds: sourceObjectIds,
              sourceProductPlantIds,
              targetPlantId: context.targetPlant._id,
              targetProductPlantId: context.targetPlant.productPlantId,
              productId: context.product._id,
              productIdNumeric: context.product.productId,
              eoiNo: context.product.eoiNo,
              urnNo: context.product.urnNo,
              categoryId: context.product.categoryId,
              vendorId: context.product.vendorId,
              manufacturerId: context.product.manufacturerId,
              manufacturingUnitsRemoved,
              manufacturingUnitsSkipped,
              plantCountBefore: context.plantCountBefore,
              plantCountAfter,
              mergeStrategy: strategy,
              mergeStatus: PLANT_MERGE_STATUS.COMPLETED,
              mergedBy: adminObjectId,
              mergedAt: now,
            },
          ],
          sessionOpts,
        );

        return String(audit[0]._id);
      },
    );

    const targetPlantName = normalizeTrimmedValue(context.targetPlant.plantName);
    try {
      await this.activityLogService.logActivity({
        vendor_id: context.product.vendorId,
        manufacturer_id: context.product.manufacturerId,
        urn_no: context.product.urnNo,
        activities_id: 0,
        activity: `Admin merged ${sourceObjectIds.length} plant(s) into "${targetPlantName}" for EOI ${context.product.eoiNo} (URN ${context.product.urnNo})`,
        activity_status: 1,
        responsibility: 'Admin',
      });
    } catch (logError) {
      this.logger.warn(
        `Activity log failed after plant merge on EOI ${context.product.eoiNo}`,
        logError instanceof Error ? logError.stack : String(logError),
      );
    }

    this.lifecycleNotification
      .notifyPlantMerged({
        manufacturerId: String(context.product.manufacturerId),
        urnNo: context.product.urnNo,
        eoiNo: context.product.eoiNo,
        productName: context.product.productName,
        mergeSummary: `${sourceObjectIds.length} plant(s) were merged into "${targetPlantName}".`,
      })
      .catch((err) =>
        this.logger.warn(
          `Plant merge notification failed: ${(err as Error).message}`,
        ),
      );

    return {
      success: true,
      mergeId,
      urnNo: context.product.urnNo,
      eoiNo: context.product.eoiNo,
      targetPlantId: String(context.targetPlant._id),
      absorbedPlantIds: sourceObjectIds.map((id) => String(id)),
      plantCountAfter,
      manufacturingUnitsRemoved,
      manufacturingUnitsSkipped,
      targetDetailsUrl: `/api/admin/products/details/${context.product.urnNo}`,
    };
  }

  private toPreviewPlant(
    plant: PlantMergePlantRow & { stateName?: string | null },
  ): PlantMergePreviewPlant {
    return {
      plantId: String(plant._id),
      productPlantId: plant.productPlantId,
      plantName: plant.plantName,
      location: derivePlantLocationLabel(plant),
    };
  }

  private async fetchProduct(
    productObjectId: Types.ObjectId,
  ): Promise<PlantMergeProductRow | null> {
    const row = await this.productModel
      .findOne({ _id: productObjectId, ...matchActiveProducts() })
      .select(
        '_id productId eoiNo productName productStatus urnNo plantCount categoryId vendorId manufacturerId urnStatus productRenewStatus',
      )
      .lean()
      .exec();
    return row as PlantMergeProductRow | null;
  }

  private async fetchActivePlantsForProduct(
    productObjectId: Types.ObjectId,
  ): Promise<Array<PlantMergePlantRow & { stateName?: string | null }>> {
    const rows = await this.productPlantModel
      .aggregate([
        {
          $match: matchActiveProductPlants({ productId: productObjectId }),
        },
        {
          $lookup: {
            from: 'states',
            localField: 'stateId',
            foreignField: '_id',
            as: 'state',
          },
        },
        { $sort: { createdDate: 1 } },
      ])
      .exec();

    return rows.map((row) => {
      const stateDoc = Array.isArray(row.state)
        ? (row.state[0] as Record<string, unknown> | undefined)
        : undefined;
      return {
        _id: row._id as Types.ObjectId,
        productPlantId: Number(row.productPlantId ?? 0),
        productId: row.productId as Types.ObjectId,
        urnNo: String(row.urnNo ?? ''),
        eoiNo: String(row.eoiNo ?? ''),
        plantName: String(row.plantName ?? ''),
        plantLocation: String(row.plantLocation ?? ''),
        city: String(row.city ?? ''),
        stateId: row.stateId as Types.ObjectId | undefined,
        vendorId: row.vendorId as Types.ObjectId,
        manufacturerId: row.manufacturerId as Types.ObjectId,
        categoryId: row.categoryId as Types.ObjectId,
        stateName:
          (stateDoc?.stateName as string | undefined) ??
          (stateDoc?.name as string | undefined) ??
          null,
      };
    });
  }

  private resolvePlantById(
    plants: PlantMergePlantRow[],
    plantId: string,
  ): PlantMergePlantRow | undefined {
    const key = normalizeTrimmedValue(plantId);
    return plants.find((plant) => String(plant._id) === key);
  }

  private resolvePlantsByIds(
    plants: PlantMergePlantRow[],
    plantIds: string[],
  ): { found: PlantMergePlantRow[]; missing: string[] } {
    const found: PlantMergePlantRow[] = [];
    const missing: string[] = [];
    for (const plantId of plantIds) {
      const row = this.resolvePlantById(plants, plantId);
      if (row) {
        found.push(row);
      } else {
        missing.push(plantId);
      }
    }
    return { found, missing };
  }

  private async buildMergeContext(
    productId: string,
    targetPlantId: string,
    sourcePlantIds: string[],
  ) {
    const blockers: PlantMergeBlocker[] = [];
    const warnings: string[] = [];

    const productObjectId = parseObjectId(productId, 'productId');
    if (!productObjectId) {
      throw new BadRequestException('Invalid productId');
    }

    const normalizedTargetId = normalizeTrimmedValue(targetPlantId);
    const normalizedSourceIds = sourcePlantIds
      .map((id) => normalizeTrimmedValue(id))
      .filter(Boolean);

    blockers.push(...validateSourcePlantSelection(normalizedTargetId, normalizedSourceIds));

    const product = await this.fetchProduct(productObjectId);
    if (!product) {
      blockers.push({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Active product not found for plant merge',
      });
      return this.emptyContext(blockers, warnings);
    }

    if (!isCertifiedProduct(product)) {
      blockers.push({
        code: 'PRODUCT_NOT_CERTIFIED',
        message: 'Plant merge is only allowed for certified products',
      });
    }

    blockers.push(...buildProductRenewalBlockers('Product', product));

    if (await hasInProgressRenewalCycle(this.renewalCycleModel, product.urnNo)) {
      blockers.push({
        code: 'RENEWAL_CYCLE_IN_PROGRESS',
        message: `URN ${product.urnNo} has an in-progress renewal cycle`,
      });
    }

    const activePlants = await this.fetchActivePlantsForProduct(productObjectId);
    const plantCountBefore = activePlants.length;

    if (plantCountBefore < 2) {
      blockers.push({
        code: 'MIN_PLANTS_REQUIRED',
        message: 'At least two active plants are required to perform a plant merge',
      });
    }

    const targetPlant = this.resolvePlantById(activePlants, normalizedTargetId);
    if (!targetPlant) {
      blockers.push({
        code: 'TARGET_PLANT_NOT_FOUND',
        message: 'Target plant not found on this product',
      });
    }

    const { found: sourcePlants, missing } = this.resolvePlantsByIds(
      activePlants,
      normalizedSourceIds,
    );
    if (missing.length > 0) {
      blockers.push({
        code: 'SOURCE_PLANTS_NOT_FOUND',
        message: `Source plant(s) not found: ${missing.join(', ')}`,
      });
    }

    if (targetPlant) {
      for (const source of sourcePlants) {
        if (!plantBelongsToProduct(source, productObjectId)) {
          blockers.push({
            code: 'PLANT_PRODUCT_MISMATCH',
            message: 'All plants must belong to the same product',
          });
          break;
        }
      }
    }

    blockers.push(
      ...validateRemainingPlantCount(plantCountBefore, sourcePlants.length),
    );

    if (Number(product.plantCount) !== plantCountBefore) {
      warnings.push(
        `Product plantCount (${product.plantCount}) differs from active plant rows (${plantCountBefore}); count will be reconciled on merge`,
      );
    }

    const plantCountAfter = plantCountBefore - sourcePlants.length;

    return {
      blockers,
      warnings,
      product,
      targetPlant: targetPlant!,
      sourcePlants,
      plantCountBefore,
      plantCountAfter,
    };
  }

  private emptyContext(blockers: PlantMergeBlocker[], warnings: string[]) {
    return {
      blockers,
      warnings,
      product: {
        _id: new Types.ObjectId(),
        productId: 0,
        eoiNo: '',
        productName: '',
        productStatus: 0,
        urnNo: '',
        plantCount: 0,
        categoryId: new Types.ObjectId(),
        vendorId: new Types.ObjectId(),
        manufacturerId: new Types.ObjectId(),
        urnStatus: 0,
        productRenewStatus: 0,
      } as PlantMergeProductRow,
      targetPlant: {
        _id: new Types.ObjectId(),
        productPlantId: 0,
        productId: new Types.ObjectId(),
        urnNo: '',
        eoiNo: '',
        plantName: '',
        plantLocation: '',
        city: '',
        vendorId: new Types.ObjectId(),
        manufacturerId: new Types.ObjectId(),
        categoryId: new Types.ObjectId(),
      } as PlantMergePlantRow,
      sourcePlants: [] as PlantMergePlantRow[],
      plantCountBefore: 0,
      plantCountAfter: 0,
    };
  }

  private unitNameFromPlant(plant: PlantMergePlantRow): string {
    return normalizeTrimmedValue(plant.plantName);
  }

  private async planManufacturingUnitChanges(
    urnNo: string,
    targetPlant: PlantMergePlantRow,
    sourcePlants: PlantMergePlantRow[],
  ): Promise<{
    manufacturingUnitRemovals: PlantMergeSectionPlan[];
    manufacturingUnitConflicts: PlantMergeSectionPlan[];
  }> {
    const manufacturingUnitRemovals: PlantMergeSectionPlan[] = [];
    const manufacturingUnitConflicts: PlantMergeSectionPlan[] = [];
    const targetUnitName = normalizePlantNameKey(targetPlant.plantName);

    for (const collection of PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS) {
      for (const source of sourcePlants) {
        const unitName = this.unitNameFromPlant(source);
        if (!unitName) continue;

        const sourceRows = await this.connection.db
          .collection(collection)
          .find({ urnNo, unitName })
          .toArray();

        if (sourceRows.length === 0) {
          continue;
        }

        const sameNameAsTarget =
          normalizePlantNameKey(source.plantName) === targetUnitName;

        if (sameNameAsTarget) {
          manufacturingUnitConflicts.push({
            collection,
            unitName,
            action: 'keep_target_unit_rows',
          });
        } else {
          manufacturingUnitRemovals.push({
            collection,
            unitName,
            action: 'remove_source_unit_rows',
          });
        }
      }
    }

    return { manufacturingUnitRemovals, manufacturingUnitConflicts };
  }

  private async applyManufacturingUnitChanges(
    urnNo: string,
    targetPlant: PlantMergePlantRow,
    sourcePlants: PlantMergePlantRow[],
    session?: import('mongoose').ClientSession,
  ): Promise<{ removed: string[]; skipped: string[] }> {
    const removed: string[] = [];
    const skipped: string[] = [];
    const sessionOpts = session ? { session } : {};
    const targetUnitName = normalizePlantNameKey(targetPlant.plantName);

    for (const collection of PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS) {
      for (const source of sourcePlants) {
        const unitName = this.unitNameFromPlant(source);
        if (!unitName) continue;

        const sameNameAsTarget =
          normalizePlantNameKey(source.plantName) === targetUnitName;

        if (sameNameAsTarget) {
          skipped.push(`${collection}:${unitName}`);
          continue;
        }

        const deleteResult = await this.connection.db
          .collection(collection)
          .deleteMany({ urnNo, unitName }, sessionOpts);

        if (deleteResult.deletedCount > 0) {
          removed.push(`${collection}:${unitName}`);
        }
      }
    }

    return { removed, skipped };
  }
}
