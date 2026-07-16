import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../../schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../../schemas/product-plant.schema';
import {
  PlantMergeAudit,
  PlantMergeAuditDocument,
} from '../schemas/plant-merge-audit.schema';
import { runInTransactionIfSupported } from '../../../renew/helpers/mongo-session.util';
import { ActivityLogService } from '../../../activity-log/activity-log.service';
import { RedisService } from '../../../common/redis/redis.service';
import { invalidateProductListingsCache } from '../../helpers/invalidate-product-listings-cache.util';
import { SequenceHelper } from '../../helpers/sequence.helper';
import { normalizeTrimmedValue } from '../../helpers/merge-eligibility.shared';
import { syncProductPlantCount, countActivePlantsForProduct } from '../../helpers/sync-product-plant-count.util';
import {
  PLANT_MERGE_STATUS,
  PLANT_MERGE_STRATEGY_URN_COPY,
} from '../plant-merge.constants';
import { PLANT_MERGE_URN_PREVIEW_STATUS } from '../plant-merge-urn-preview.constants';
import {
  PlantMergeUrnExecuteDto,
  PlantMergeUrnExecutePairDto,
} from '../dto/plant-merge-urn-execute.dto';
import { PlantMergeUrnValidationService } from './plant-merge-urn-validation.service';
import { PlantMergeUrnPreviewService } from './plant-merge-urn-preview.service';
import { copyActivePlantsToTargetProduct } from '../helpers/copy-product-plants.util';
import {
  findActiveProductOnUrn,
  PLANT_MERGE_URN_EXECUTE_PRODUCT_SELECT,
} from '../helpers/plant-merge-product-lookup.util';
import { PlantMergeUrnValidationResult } from './plant-merge-urn-validation.service';
import { LifecycleNotificationService } from '../../../notifications/lifecycle-notification.service';

export type PlantMergeUrnExecutePairResult = {
  sourceEoiNo: string;
  targetUrnNo: string;
  targetEoiNo: string;
  productName: string;
  mergeId: string;
  mergeStatus: string;
  plantsCopied: number;
  plantsSkipped: number;
  plantCountBefore: number;
  plantCountAfter: number;
  sourcePlantIds: string[];
  copiedPlantIds: string[];
  skippedPlantNames: string[];
};

export type PlantMergeUrnExecuteResult = {
  success: true;
  sourceUrnNo: string;
  pairsExecuted: number;
  results: PlantMergeUrnExecutePairResult[];
};

type ResolvedExecutePair = PlantMergeUrnExecutePairDto & {
  productName: string;
};

type ExecuteProductRow = {
  _id: Types.ObjectId;
  productId: number;
  productName: string;
  eoiNo: string;
  urnNo: string;
  vendorId: Types.ObjectId;
  categoryId: Types.ObjectId;
  manufacturerId: Types.ObjectId;
};

@Injectable()
export class PlantMergeUrnExecuteService {
  private readonly logger = new Logger(PlantMergeUrnExecuteService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private readonly productPlantModel: Model<ProductPlantDocument>,
    @InjectModel(PlantMergeAudit.name)
    private readonly plantMergeAuditModel: Model<PlantMergeAuditDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly plantMergeUrnValidationService: PlantMergeUrnValidationService,
    private readonly plantMergeUrnPreviewService: PlantMergeUrnPreviewService,
    private readonly sequenceHelper: SequenceHelper,
    private readonly activityLogService: ActivityLogService,
    private readonly redisService: RedisService,
    private readonly lifecycleNotification: LifecycleNotificationService,
  ) {}

  async execute(
    dto: PlantMergeUrnExecuteDto,
    adminUserId: string,
  ): Promise<PlantMergeUrnExecuteResult> {
    const sourceUrnNo = normalizeTrimmedValue(dto.sourceUrnNo);
    if (!sourceUrnNo) {
      throw new BadRequestException('sourceUrnNo is required');
    }

    const pairs = await this.resolveExecutePairs(sourceUrnNo, dto.pairs);
    if (pairs.length === 0) {
      throw new BadRequestException(
        'No eligible product pairs found for plant merge execution',
      );
    }

    await this.assertAllPairsValid(sourceUrnNo, pairs);

    const pairContexts = await Promise.all(
      pairs.map((pair) => this.loadPairContext(sourceUrnNo, pair)),
    );

    const adminObjectId = new Types.ObjectId(adminUserId);
    const now = new Date();

    const results = await runInTransactionIfSupported(
      this.connection,
      async (session) => {
        const sessionOpts = session ? { session } : {};
        const executed: PlantMergeUrnExecutePairResult[] = [];

        for (const context of pairContexts) {
          await this.assertPairValidInTransaction(sourceUrnNo, context.pair);

          const plantCountBefore = await countActivePlantsForProduct(
            this.productPlantModel,
            context.targetProduct._id,
            session,
          );

          const copyResult = await copyActivePlantsToTargetProduct(
            this.productPlantModel,
            this.sequenceHelper,
            context.sourceProduct._id,
            context.targetProduct,
            now,
            session,
          );

          const plantCountAfter = await syncProductPlantCount(
            this.productModel,
            this.productPlantModel,
            context.targetProduct._id,
            now,
            session,
          );

          const audit = await this.plantMergeAuditModel.create(
            [
              {
                sourcePlantIds: copyResult.sourcePlantIds,
                sourceProductPlantIds: copyResult.sourceProductPlantIds,
                copiedPlantIds: copyResult.copiedPlantIds,
                copiedProductPlantIds: copyResult.copiedProductPlantIds,
                productId: context.sourceProduct._id,
                targetProductId: context.targetProduct._id,
                productIdNumeric: context.sourceProduct.productId,
                eoiNo: context.sourceProduct.eoiNo,
                urnNo: context.sourceProduct.urnNo,
                targetUrnNo: context.targetProduct.urnNo,
                targetEoiNo: context.targetProduct.eoiNo,
                categoryId: context.sourceProduct.categoryId,
                vendorId: context.sourceProduct.vendorId,
                manufacturerId: context.sourceProduct.manufacturerId,
                manufacturingUnitsRemoved: [],
                manufacturingUnitsSkipped: copyResult.manufacturingUnitsSkipped,
                plantCountBefore,
                plantCountAfter,
                mergeStrategy: PLANT_MERGE_STRATEGY_URN_COPY,
                mergeStatus: PLANT_MERGE_STATUS.COMPLETED,
                mergedBy: adminObjectId,
                mergedAt: now,
              },
            ],
            sessionOpts,
          );

          executed.push({
            sourceEoiNo: context.pair.sourceEoiNo,
            targetUrnNo: context.pair.targetUrnNo,
            targetEoiNo: context.pair.targetEoiNo,
            productName: context.pair.productName,
            mergeId: String(audit[0]._id),
            mergeStatus: PLANT_MERGE_STATUS.COMPLETED,
            plantsCopied: copyResult.copiedPlantIds.length,
            plantsSkipped: copyResult.manufacturingUnitsSkipped.length,
            plantCountBefore,
            plantCountAfter,
            sourcePlantIds: copyResult.sourcePlantIds.map((id) => String(id)),
            copiedPlantIds: copyResult.copiedPlantIds.map((id) => String(id)),
            skippedPlantNames: [...copyResult.manufacturingUnitsSkipped],
          });
        }

        return executed;
      },
    );

    for (const result of results) {
      const context = pairContexts.find(
        (row) => row.pair.sourceEoiNo === result.sourceEoiNo,
      );
      if (!context) continue;

      try {
        await this.activityLogService.logActivity({
          vendor_id: context.sourceProduct.vendorId,
          manufacturer_id: context.sourceProduct.manufacturerId,
          urn_no: context.sourceProduct.urnNo,
          activities_id: 0,
          activity: `Admin copied ${result.plantsCopied} plant(s) from EOI ${result.sourceEoiNo} (URN ${sourceUrnNo}) to EOI ${result.targetEoiNo} (URN ${result.targetUrnNo})`,
          activity_status: 1,
          responsibility: 'Admin',
        });
      } catch (logError) {
        this.logger.warn(
          `Activity log failed after URN plant merge for EOI ${result.sourceEoiNo}`,
          logError instanceof Error ? logError.stack : String(logError),
        );
      }

      this.lifecycleNotification
        .notifyPlantMerged({
          manufacturerId: String(context.targetProduct.manufacturerId),
          urnNo: result.targetUrnNo,
          eoiNo: result.targetEoiNo,
          productName: result.productName,
          mergeSummary: `${result.plantsCopied} plant(s) were copied from URN ${sourceUrnNo} / EOI ${result.sourceEoiNo} into URN ${result.targetUrnNo} / EOI ${result.targetEoiNo}.`,
        })
        .catch((err) =>
          this.logger.warn(
            `Plant merge notification failed for EOI ${result.sourceEoiNo}: ${(err as Error).message}`,
          ),
        );
    }

    await invalidateProductListingsCache(this.redisService, this.logger);

    return {
      success: true,
      sourceUrnNo,
      pairsExecuted: results.length,
      results,
    };
  }

  private async resolveExecutePairs(
    sourceUrnNo: string,
    explicitPairs?: PlantMergeUrnExecutePairDto[],
  ): Promise<ResolvedExecutePair[]> {
    if (explicitPairs && explicitPairs.length > 0) {
      return explicitPairs.map((pair) => ({
        sourceEoiNo: normalizeTrimmedValue(pair.sourceEoiNo),
        targetUrnNo: normalizeTrimmedValue(pair.targetUrnNo),
        targetEoiNo: normalizeTrimmedValue(pair.targetEoiNo),
        productName: '',
      }));
    }

    const preview =
      await this.plantMergeUrnPreviewService.previewBySourceUrn(sourceUrnNo);

    return preview.items
      .filter(
        (item) =>
          item.mergeStatus === PLANT_MERGE_URN_PREVIEW_STATUS.READY &&
          item.targetUrn &&
          item.targetEoi,
      )
      .map((item) => ({
        sourceEoiNo: item.sourceEoi,
        targetUrnNo: String(item.targetUrn),
        targetEoiNo: String(item.targetEoi),
        productName: item.productName,
      }));
  }

  private async assertAllPairsValid(
    sourceUrnNo: string,
    pairs: ResolvedExecutePair[],
  ): Promise<void> {
    const blockers: string[] = [];

    for (const pair of pairs) {
      const validation = await this.validatePair(sourceUrnNo, pair);

      if (!validation.canMerge) {
        blockers.push(this.formatPairValidationError(pair, validation));
      } else if (!pair.productName && validation.productName) {
        pair.productName = validation.productName;
      }
    }

    if (blockers.length > 0) {
      throw new BadRequestException(blockers.join(' | '));
    }
  }

  private async assertPairValidInTransaction(
    sourceUrnNo: string,
    pair: ResolvedExecutePair,
  ): Promise<void> {
    const validation = await this.validatePair(sourceUrnNo, pair);

    if (!validation.canMerge) {
      throw new BadRequestException(this.formatPairValidationError(pair, validation));
    }
  }

  private validatePair(
    sourceUrnNo: string,
    pair: ResolvedExecutePair,
  ): Promise<PlantMergeUrnValidationResult> {
    return this.plantMergeUrnValidationService.validate({
      sourceUrnNo,
      targetUrnNo: pair.targetUrnNo,
      sourceEoiNo: pair.sourceEoiNo,
      targetEoiNo: pair.targetEoiNo,
    });
  }

  private formatPairValidationError(
    pair: ResolvedExecutePair,
    validation: PlantMergeUrnValidationResult,
  ): string {
    const messages = validation.blockers.map((blocker) => blocker.message);
    return `EOI ${pair.sourceEoiNo} → ${pair.targetUrnNo}/${pair.targetEoiNo}: ${messages.join('; ')}`;
  }

  private async loadPairContext(
    sourceUrnNo: string,
    pair: ResolvedExecutePair,
  ): Promise<{
    pair: ResolvedExecutePair;
    sourceProduct: ExecuteProductRow;
    targetProduct: ExecuteProductRow;
  }> {
    const sourceProduct = await this.findProduct(sourceUrnNo, pair.sourceEoiNo);
    const targetProduct = await this.findProduct(
      pair.targetUrnNo,
      pair.targetEoiNo,
    );

    if (!sourceProduct || !targetProduct) {
      throw new BadRequestException(
        `Product not found for plant merge pair EOI ${pair.sourceEoiNo}`,
      );
    }

    if (!pair.productName) {
      pair.productName = sourceProduct.productName;
    }

    return { pair, sourceProduct, targetProduct };
  }

  private async findProduct(
    urnNo: string,
    eoiNo: string,
  ): Promise<ExecuteProductRow | null> {
    return findActiveProductOnUrn<ExecuteProductRow>(
      this.productModel,
      urnNo,
      eoiNo,
      PLANT_MERGE_URN_EXECUTE_PRODUCT_SELECT,
    );
  }
}
