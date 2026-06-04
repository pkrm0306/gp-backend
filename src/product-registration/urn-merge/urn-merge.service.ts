import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../schemas/product-plant.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../../product-design/schemas/all-product-document.schema';
import {
  Category,
  CategoryDocument,
} from '../../categories/schemas/category.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
  RenewalCycleStatus,
} from '../../renew/schemas/renewal-cycle.schema';
import {
  UrnMergeAudit,
  UrnMergeAuditDocument,
} from './schemas/urn-merge-audit.schema';
import { matchActiveProducts } from '../constants/active-product.filter';
import { matchActiveProductPlants } from '../constants/active-product.filter';
import { runInTransactionIfSupported } from '../../renew/helpers/mongo-session.util';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import { UrnMergeExecuteDto } from './dto/urn-merge-execute.dto';
import {
  URN_MERGE_MULTI_ROW_COLLECTIONS,
  URN_MERGE_SINGLETON_COLLECTIONS,
  URN_MERGE_STRATEGY_FILL_GAPS,
  UrnMergeBlockerCode,
} from './urn-merge.constants';
import {
  UrnMergeBlocker,
  UrnMergeProductRow,
  buildRenewalBlockers,
  categoryIdKey,
  findEoiCollisions,
  normalizeUrnMergeNo,
  objectIdKey,
  selectCertifiedProductsToMove,
} from './helpers/urn-merge-eligibility.util';

export type UrnMergeSectionPlan = {
  collection: string;
  sourceHasData: boolean;
  targetHasData: boolean;
  action: string;
};

export type UrnMergePreviewResult = {
  success: true;
  canMerge: boolean;
  sourceUrnNo: string;
  targetUrnNo: string;
  categoryId?: string;
  categoryName?: string;
  blockers: UrnMergeBlocker[];
  eoisToMove: Array<{
    productId: number;
    eoiNo: string;
    productName: string;
    productStatus: number;
  }>;
  urnLevelConflicts: UrnMergeSectionPlan[];
  urnLevelMoves: UrnMergeSectionPlan[];
  warnings: string[];
};

export type UrnMergeExecuteResult = {
  success: true;
  mergeId: string;
  sourceUrnNo: string;
  targetUrnNo: string;
  movedProductIds: number[];
  movedEoiNos: string[];
  urnSectionsRekeyed: string[];
  urnSectionsSkipped: string[];
  targetDetailsUrl: string;
};

@Injectable()
export class UrnMergeService {
  private readonly logger = new Logger(UrnMergeService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private readonly productPlantModel: Model<ProductPlantDocument>,
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(UrnMergeAudit.name)
    private readonly urnMergeAuditModel: Model<UrnMergeAuditDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async preview(
    sourceUrnNo: string,
    targetUrnNo: string,
    options?: { moveAllCertifiedEois?: boolean; productIds?: number[] },
  ): Promise<UrnMergePreviewResult> {
    const context = await this.buildMergeContext(
      sourceUrnNo,
      targetUrnNo,
      options,
    );
    const { urnLevelConflicts, urnLevelMoves } = await this.planUrnLevelSections(
      context.sourceUrnNo,
      context.targetUrnNo,
      context.vendorId,
    );

    return {
      success: true,
      canMerge: context.blockers.length === 0,
      sourceUrnNo: context.sourceUrnNo,
      targetUrnNo: context.targetUrnNo,
      categoryId: context.categoryId,
      categoryName: context.categoryName,
      blockers: context.blockers,
      eoisToMove: context.eoisToMove.map((row) => ({
        productId: row.productId,
        eoiNo: row.eoiNo,
        productName: row.productName,
        productStatus: row.productStatus,
      })),
      urnLevelConflicts,
      urnLevelMoves,
      warnings: context.warnings,
    };
  }

  async execute(
    dto: UrnMergeExecuteDto,
    adminUserId: string,
  ): Promise<UrnMergeExecuteResult> {
    const strategy = String(dto.urnLevelStrategy ?? URN_MERGE_STRATEGY_FILL_GAPS);
    if (strategy !== URN_MERGE_STRATEGY_FILL_GAPS) {
      throw new BadRequestException(
        `Unsupported urnLevelStrategy: ${strategy}`,
      );
    }

    const preview = await this.preview(dto.sourceUrnNo, dto.targetUrnNo, {
      moveAllCertifiedEois: dto.moveAllCertifiedEois,
      productIds: dto.productIds,
    });

    if (!preview.canMerge) {
      const codes = preview.blockers.map((b) => b.code).join(', ');
      throw new BadRequestException(
        `URN merge blocked: ${codes || 'validation failed'}`,
      );
    }

    const context = await this.buildMergeContext(
      dto.sourceUrnNo,
      dto.targetUrnNo,
      {
        moveAllCertifiedEois: dto.moveAllCertifiedEois,
        productIds: dto.productIds,
      },
    );

    const adminObjectId = new Types.ObjectId(adminUserId);
    const now = new Date();
    const targetSample = context.targetProducts[0];
    const alignment = {
      urnStatus: Number(targetSample?.urnStatus ?? 0),
      productRenewStatus: Number(targetSample?.productRenewStatus ?? 0),
      validtillDate: targetSample?.validtillDate,
      firstNotifyDate: targetSample?.firstNotifyDate,
      secondNotifyDate: targetSample?.secondNotifyDate,
      thirdNotifyDate: targetSample?.thirdNotifyDate,
      renewCycleNo: targetSample?.renewCycleNo,
      updatedDate: now,
    };

    const productObjectIds = context.eoisToMove.map((p) => p._id);
    const movedProductIds = context.eoisToMove.map((p) => p.productId);
    const movedEoiNos = context.eoisToMove.map((p) => p.eoiNo);
    const movedEoiSet = new Set(movedEoiNos);

    let urnSectionsRekeyed: string[] = [];
    let urnSectionsSkipped: string[] = [];

    const mergeId = await runInTransactionIfSupported(
      this.connection,
      async (session) => {
        const sessionOpts = session ? { session } : {};

        await this.productModel.updateMany(
          { _id: { $in: productObjectIds } },
          {
            $set: {
              urnNo: context.targetUrnNo,
              mergedFromUrnNo: context.sourceUrnNo,
              ...alignment,
            },
          },
          sessionOpts,
        );

        await this.productPlantModel.updateMany(
          matchActiveProductPlants({ productId: { $in: productObjectIds } }),
          { $set: { urnNo: context.targetUrnNo } },
          sessionOpts,
        );

        await this.allProductDocumentModel.updateMany(
          {
            urnNo: context.sourceUrnNo,
            isDeleted: { $ne: true },
            $or: [
              { eoiNo: { $in: [...movedEoiSet] } },
              { eoiNo: { $exists: false } },
              { eoiNo: null },
              { eoiNo: '' },
            ],
          },
          { $set: { urnNo: context.targetUrnNo } },
          sessionOpts,
        );

        const sectionResult = await this.applyUrnLevelRekeys(
          context.sourceUrnNo,
          context.targetUrnNo,
          context.vendorId,
          session,
        );
        urnSectionsRekeyed = sectionResult.rekeyed;
        urnSectionsSkipped = sectionResult.skipped;

        const audit = await this.urnMergeAuditModel.create(
          [
            {
              sourceUrnNo: context.sourceUrnNo,
              targetUrnNo: context.targetUrnNo,
              categoryId: new Types.ObjectId(context.categoryId!),
              vendorId: new Types.ObjectId(context.vendorId),
              manufacturerId: new Types.ObjectId(context.manufacturerId),
              movedProductIds,
              movedEoiNos,
              urnSectionsRekeyed,
              urnSectionsSkipped,
              urnLevelStrategy: strategy,
              mergedBy: adminObjectId,
              mergedAt: now,
            },
          ],
          sessionOpts,
        );

        return String(audit[0]._id);
      },
    );

    try {
      await this.activityLogService.logActivity({
        vendor_id: context.vendorId,
        manufacturer_id: context.manufacturerId,
        urn_no: context.targetUrnNo,
        activities_id: 0,
        activity: `Admin merged URN ${context.sourceUrnNo} into ${context.targetUrnNo} — ${movedProductIds.length} EOIs moved`,
        activity_status: 1,
        responsibility: 'Admin',
      });
    } catch (logError) {
      this.logger.warn(
        `Activity log failed after URN merge ${context.sourceUrnNo} → ${context.targetUrnNo}`,
        logError instanceof Error ? logError.stack : String(logError),
      );
    }

    return {
      success: true,
      mergeId,
      sourceUrnNo: context.sourceUrnNo,
      targetUrnNo: context.targetUrnNo,
      movedProductIds,
      movedEoiNos,
      urnSectionsRekeyed,
      urnSectionsSkipped,
      targetDetailsUrl: `/api/admin/products/details/${context.targetUrnNo}`,
    };
  }

  private async fetchUrnProducts(urnNo: string): Promise<UrnMergeProductRow[]> {
    const rows = await this.productModel
      .find({ urnNo, ...matchActiveProducts() })
      .select(
        '_id productId eoiNo productName productStatus categoryId vendorId manufacturerId urnStatus productRenewStatus validtillDate firstNotifyDate secondNotifyDate thirdNotifyDate renewCycleNo',
      )
      .lean()
      .exec();
    return rows as unknown as UrnMergeProductRow[];
  }

  private async hasInProgressRenewalCycle(urnNo: string): Promise<boolean> {
    const count = await this.renewalCycleModel.countDocuments({
      urnNo,
      status: RenewalCycleStatus.IN_PROGRESS,
    });
    return count > 0;
  }

  private async countCollectionRows(
    collection: string,
    urnNo: string,
    vendorId?: Types.ObjectId,
  ): Promise<number> {
    const filter: Record<string, unknown> = { urnNo };
    if (vendorId) {
      filter.vendorId = vendorId;
    }
    return this.connection.db.collection(collection).countDocuments(filter);
  }

  private async planUrnLevelSections(
    sourceUrnNo: string,
    targetUrnNo: string,
    vendorId: Types.ObjectId,
  ): Promise<{
    urnLevelConflicts: UrnMergeSectionPlan[];
    urnLevelMoves: UrnMergeSectionPlan[];
  }> {
    const urnLevelConflicts: UrnMergeSectionPlan[] = [];
    const urnLevelMoves: UrnMergeSectionPlan[] = [];

    for (const entry of URN_MERGE_SINGLETON_COLLECTIONS) {
      const vendorScope = entry.scopeVendor ? vendorId : undefined;
      const sourceCount = await this.countCollectionRows(
        entry.collection,
        sourceUrnNo,
        vendorScope,
      );
      const targetCount = await this.countCollectionRows(
        entry.collection,
        targetUrnNo,
        vendorScope,
      );
      const sourceHasData = sourceCount > 0;
      const targetHasData = targetCount > 0;
      if (!sourceHasData) {
        continue;
      }
      if (targetHasData) {
        urnLevelConflicts.push({
          collection: entry.collection,
          sourceHasData: true,
          targetHasData: true,
          action: 'keep_target_skip_source',
        });
      } else {
        urnLevelMoves.push({
          collection: entry.collection,
          sourceHasData: true,
          targetHasData: false,
          action: 'rekey_source_to_target',
        });
      }
    }

    for (const collection of URN_MERGE_MULTI_ROW_COLLECTIONS) {
      const sourceCount = await this.countCollectionRows(collection, sourceUrnNo);
      if (sourceCount > 0) {
        urnLevelMoves.push({
          collection,
          sourceHasData: true,
          targetHasData:
            (await this.countCollectionRows(collection, targetUrnNo)) > 0,
          action: 'rekey_source_to_target',
        });
      }
    }

    return { urnLevelConflicts, urnLevelMoves };
  }

  private async applyUrnLevelRekeys(
    sourceUrnNo: string,
    targetUrnNo: string,
    vendorId: Types.ObjectId,
    session?: import('mongoose').ClientSession,
  ): Promise<{ rekeyed: string[]; skipped: string[] }> {
    const rekeyed: string[] = [];
    const skipped: string[] = [];
    const sessionOpts = session ? { session } : {};

    for (const entry of URN_MERGE_SINGLETON_COLLECTIONS) {
      const vendorScope = entry.scopeVendor ? vendorId : undefined;
      const sourceCount = await this.countCollectionRows(
        entry.collection,
        sourceUrnNo,
        vendorScope,
      );
      if (sourceCount === 0) {
        continue;
      }
      const targetCount = await this.countCollectionRows(
        entry.collection,
        targetUrnNo,
        vendorScope,
      );
      if (targetCount > 0) {
        skipped.push(entry.collection);
        continue;
      }
      const filter: Record<string, unknown> = { urnNo: sourceUrnNo };
      if (vendorScope) {
        filter.vendorId = vendorScope;
      }
      await this.connection.db
        .collection(entry.collection)
        .updateMany(filter, { $set: { urnNo: targetUrnNo } }, sessionOpts);
      rekeyed.push(entry.collection);
    }

    for (const collection of URN_MERGE_MULTI_ROW_COLLECTIONS) {
      const sourceCount = await this.countCollectionRows(collection, sourceUrnNo);
      if (sourceCount === 0) {
        continue;
      }
      await this.connection.db
        .collection(collection)
        .updateMany(
          { urnNo: sourceUrnNo },
          { $set: { urnNo: targetUrnNo } },
          sessionOpts,
        );
      rekeyed.push(collection);
    }

    return { rekeyed, skipped };
  }

  private async buildMergeContext(
    sourceUrnNo: string,
    targetUrnNo: string,
    options?: { moveAllCertifiedEois?: boolean; productIds?: number[] },
  ) {
    const source = normalizeUrnMergeNo(sourceUrnNo);
    const target = normalizeUrnMergeNo(targetUrnNo);
    const blockers: UrnMergeBlocker[] = [];
    const warnings: string[] = [];

    if (!source || !target) {
      throw new BadRequestException('sourceUrnNo and targetUrnNo are required');
    }

    if (source === target) {
      blockers.push({
        code: 'SAME_URN',
        message: 'Source and target URN must be different',
      });
    }

    const sourceProducts = await this.fetchUrnProducts(source);
    const targetProducts = await this.fetchUrnProducts(target);

    const sourceCertified = sourceProducts.filter(
      (p) => Number(p.productStatus) === 2,
    );
    const targetCertified = targetProducts.filter(
      (p) => Number(p.productStatus) === 2,
    );

    if (sourceProducts.length === 0) {
      blockers.push({
        code: 'SOURCE_URN_NOT_FOUND',
        message: `No active products found for source URN ${source}`,
      });
    } else if (sourceCertified.length === 0) {
      blockers.push({
        code: 'NO_CERTIFIED_ON_SOURCE',
        message: `Source URN ${source} has no certified products to move`,
      });
    }

    if (targetProducts.length === 0) {
      blockers.push({
        code: 'TARGET_URN_NOT_FOUND',
        message: `No active products found for target URN ${target}`,
      });
    } else if (targetCertified.length === 0) {
      blockers.push({
        code: 'NO_CERTIFIED_ON_TARGET',
        message: `Target URN ${target} has no certified products`,
      });
    }

    const eoisToMove = selectCertifiedProductsToMove(
      sourceProducts,
      options?.moveAllCertifiedEois,
      options?.productIds,
    );

    if (
      sourceCertified.length > 0 &&
      eoisToMove.length === 0 &&
      options?.moveAllCertifiedEois === false
    ) {
      blockers.push({
        code: 'NO_PRODUCTS_SELECTED',
        message: 'No certified productIds selected to move',
      });
    }

    const sourceRep = sourceCertified[0] ?? sourceProducts[0];
    const targetRep = targetCertified[0] ?? targetProducts[0];

    if (sourceRep && targetRep) {
      if (categoryIdKey(sourceRep.categoryId) !== categoryIdKey(targetRep.categoryId)) {
        blockers.push({
          code: 'CATEGORY_MISMATCH',
          message: 'Source and target must belong to the same category',
        });
      }
      if (objectIdKey(sourceRep.vendorId) !== objectIdKey(targetRep.vendorId)) {
        blockers.push({
          code: 'VENDOR_MISMATCH',
          message: 'Source and target must belong to the same vendor',
        });
      }
      if (
        objectIdKey(sourceRep.manufacturerId) !==
        objectIdKey(targetRep.manufacturerId)
      ) {
        blockers.push({
          code: 'MANUFACTURER_MISMATCH',
          message: 'Source and target must belong to the same manufacturer',
        });
      }
    }

    blockers.push(
      ...buildRenewalBlockers('Source URN', sourceProducts),
      ...buildRenewalBlockers('Target URN', targetProducts),
    );

    if (await this.hasInProgressRenewalCycle(source)) {
      blockers.push({
        code: 'RENEWAL_CYCLE_IN_PROGRESS',
        message: `Source URN ${source} has an in-progress renewal cycle`,
      });
    }
    if (await this.hasInProgressRenewalCycle(target)) {
      blockers.push({
        code: 'RENEWAL_CYCLE_IN_PROGRESS',
        message: `Target URN ${target} has an in-progress renewal cycle`,
      });
    }

    const targetEoiSet = new Set(
      targetProducts.map((p) => String(p.eoiNo ?? '').trim()).filter(Boolean),
    );
    blockers.push(...findEoiCollisions(targetEoiSet, eoisToMove));

    let categoryName: string | undefined;
    const categoryId = sourceRep
      ? categoryIdKey(sourceRep.categoryId)
      : undefined;
    if (sourceRep?.categoryId) {
      const category = await this.categoryModel
        .findById(sourceRep.categoryId)
        .select('category_name')
        .lean()
        .exec();
      categoryName = (category as { category_name?: string } | null)
        ?.category_name;
    }

    return {
      sourceUrnNo: source,
      targetUrnNo: target,
      blockers,
      warnings,
      eoisToMove,
      sourceProducts,
      targetProducts,
      categoryId,
      categoryName,
      vendorId: sourceRep?.vendorId as Types.ObjectId,
      manufacturerId: sourceRep?.manufacturerId as Types.ObjectId,
    };
  }
}
