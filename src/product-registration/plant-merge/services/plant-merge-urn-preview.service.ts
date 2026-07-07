import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../../schemas/product-plant.schema';
import {
  matchActiveProducts,
} from '../../constants/active-product.filter';
import { PRODUCT_STATUS_CERTIFIED } from '../../../renew/constants/product-status.constants';
import { normalizeTrimmedValue } from '../../helpers/merge-eligibility.shared';
import {
  PLANT_MERGE_URN_PREVIEW_FAILURE,
  PLANT_MERGE_URN_PREVIEW_STATUS,
  PlantMergeUrnPreviewStatus,
} from '../plant-merge-urn-preview.constants';
import {
  PlantMergeSourceProductRow,
  PlantMergeTargetProductRow,
  findOldestMatchingCertifiedTarget,
  exactProductNameKey,
  hasNewerMatchingCertifiedCandidate,
} from '../helpers/plant-merge-urn-target.util';
import { PlantMergeUrnValidationService } from './plant-merge-urn-validation.service';
import { PlantMergeUrnValidationProductRow } from '../helpers/plant-merge-urn-validation.util';
import { countActivePlantsForProduct } from '../../helpers/sync-product-plant-count.util';

export type PlantMergeUrnPreviewItem = {
  productName: string;
  sourceEoi: string;
  sourceUrn: string;
  targetUrn: string | null;
  targetEoi: string | null;
  mergeStatus: PlantMergeUrnPreviewStatus;
  failureReason: string | null;
  sourcePlantCount: number;
};

export type PlantMergeUrnPreviewSummary = {
  total: number;
  ready: number;
  blocked: number;
  noTarget: number;
};

export type PlantMergeUrnPreviewResult = {
  success: true;
  sourceUrnNo: string;
  items: PlantMergeUrnPreviewItem[];
  summary: PlantMergeUrnPreviewSummary;
};

@Injectable()
export class PlantMergeUrnPreviewService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private readonly productPlantModel: Model<ProductPlantDocument>,
    private readonly plantMergeUrnValidationService: PlantMergeUrnValidationService,
  ) {}

  /**
   * Read-only preview: for each certified EOI on the source URN, resolve the oldest
   * certified matching product on a different URN (same name, manufacturer, category).
   */
  async previewBySourceUrn(sourceUrnNo: string): Promise<PlantMergeUrnPreviewResult> {
    const sourceUrn = normalizeTrimmedValue(sourceUrnNo);
    if (!sourceUrn) {
      throw new BadRequestException('sourceUrnNo is required');
    }

    const sourceProducts = await this.fetchCertifiedProductsOnUrn(sourceUrn);
    if (sourceProducts.length === 0) {
      return {
        success: true,
        sourceUrnNo: sourceUrn,
        items: [],
        summary: { total: 0, ready: 0, blocked: 0, noTarget: 0 },
      };
    }

    const candidates = await this.fetchCertifiedTargetCandidates(sourceProducts);

    const items = await Promise.all(
      sourceProducts.map((source) =>
        this.buildPreviewItem(source, candidates, sourceUrn),
      ),
    );

    return {
      success: true,
      sourceUrnNo: sourceUrn,
      items,
      summary: this.buildSummary(items),
    };
  }

  private buildSummary(items: PlantMergeUrnPreviewItem[]): PlantMergeUrnPreviewSummary {
    return {
      total: items.length,
      ready: items.filter(
        (item) => item.mergeStatus === PLANT_MERGE_URN_PREVIEW_STATUS.READY,
      ).length,
      blocked: items.filter(
        (item) => item.mergeStatus === PLANT_MERGE_URN_PREVIEW_STATUS.BLOCKED,
      ).length,
      noTarget: items.filter(
        (item) => item.mergeStatus === PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET,
      ).length,
    };
  }

  private async fetchCertifiedProductsOnUrn(
    urnNo: string,
  ): Promise<PlantMergeSourceProductRow[]> {
    const rows = await this.productModel
      .find(
        matchActiveProducts({
          urnNo,
          productStatus: PRODUCT_STATUS_CERTIFIED,
        }),
      )
      .select(
        '_id productId productName eoiNo urnNo categoryId manufacturerId productStatus certifiedDate createdDate',
      )
      .sort({ eoiNo: 1 })
      .lean()
      .exec();

    return rows as PlantMergeSourceProductRow[];
  }

  private async fetchCertifiedTargetCandidates(
    sourceProducts: PlantMergeSourceProductRow[],
  ): Promise<PlantMergeTargetProductRow[]> {
    const nameKeys = new Set(
      sourceProducts
        .map((product) => exactProductNameKey(product.productName))
        .filter(Boolean),
    );
    const manufacturerIds = [
      ...new Map(
        sourceProducts.map((product) => [
          String(product.manufacturerId),
          product.manufacturerId,
        ]),
      ).values(),
    ];
    const categoryIds = [
      ...new Map(
        sourceProducts.map((product) => [
          String(product.categoryId),
          product.categoryId,
        ]),
      ).values(),
    ];

    if (nameKeys.size === 0 || manufacturerIds.length === 0 || categoryIds.length === 0) {
      return [];
    }

    const rows = await this.productModel
      .find(
        matchActiveProducts({
          productStatus: PRODUCT_STATUS_CERTIFIED,
          manufacturerId: { $in: manufacturerIds },
          categoryId: { $in: categoryIds },
        }),
      )
      .select(
        '_id productName urnNo eoiNo categoryId manufacturerId productStatus certifiedDate createdDate',
      )
      .lean()
      .exec();

    return (rows as PlantMergeTargetProductRow[]).filter((row) =>
      nameKeys.has(exactProductNameKey(row.productName)),
    );
  }

  private async buildPreviewItem(
    source: PlantMergeSourceProductRow,
    candidates: PlantMergeTargetProductRow[],
    sourceUrn: string,
  ): Promise<PlantMergeUrnPreviewItem> {
    const sourcePlantCount = await countActivePlantsForProduct(
      this.productPlantModel,
      source._id,
    );

    if (sourcePlantCount === 0) {
      return {
        productName: source.productName,
        sourceEoi: source.eoiNo,
        sourceUrn,
        targetUrn: null,
        targetEoi: null,
        mergeStatus: PLANT_MERGE_URN_PREVIEW_STATUS.BLOCKED,
        failureReason: PLANT_MERGE_URN_PREVIEW_FAILURE.SOURCE_NO_PLANTS,
        sourcePlantCount,
      };
    }

    const target = findOldestMatchingCertifiedTarget(source, candidates, sourceUrn);

    if (!target) {
      const failureReason = hasNewerMatchingCertifiedCandidate(
        source,
        candidates,
        sourceUrn,
      )
        ? PLANT_MERGE_URN_PREVIEW_FAILURE.BRAND_NEW_PRODUCT
        : PLANT_MERGE_URN_PREVIEW_FAILURE.NO_MATCHING_TARGET;

      return {
        productName: source.productName,
        sourceEoi: source.eoiNo,
        sourceUrn,
        targetUrn: null,
        targetEoi: null,
        mergeStatus: PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET,
        failureReason,
        sourcePlantCount,
      };
    }

    const blockers = await this.plantMergeUrnValidationService.validateResolvedPair(
      this.toValidationProduct(source),
      this.toValidationProduct({
        ...target,
        productStatus: target.productStatus ?? PRODUCT_STATUS_CERTIFIED,
      }),
      sourceUrn,
    );

    if (blockers.length > 0) {
      return {
        productName: source.productName,
        sourceEoi: source.eoiNo,
        sourceUrn,
        targetUrn: target.urnNo,
        targetEoi: target.eoiNo,
        mergeStatus: PLANT_MERGE_URN_PREVIEW_STATUS.BLOCKED,
        failureReason: blockers.map((blocker) => blocker.message).join('; '),
        sourcePlantCount,
      };
    }

    return {
      productName: source.productName,
      sourceEoi: source.eoiNo,
      sourceUrn,
      targetUrn: target.urnNo,
      targetEoi: target.eoiNo,
      mergeStatus: PLANT_MERGE_URN_PREVIEW_STATUS.READY,
      failureReason: null,
      sourcePlantCount,
    };
  }

  private toValidationProduct(
    product: PlantMergeSourceProductRow | PlantMergeTargetProductRow,
  ): PlantMergeUrnValidationProductRow {
    if (!product._id) {
      throw new Error('Product row is missing _id for plant merge validation');
    }
    return {
      _id: product._id,
      productName: product.productName,
      eoiNo: product.eoiNo,
      urnNo: product.urnNo,
      productStatus: Number(product.productStatus ?? PRODUCT_STATUS_CERTIFIED),
      categoryId: product.categoryId,
      manufacturerId: product.manufacturerId,
      certifiedDate: product.certifiedDate,
      createdDate: product.createdDate,
    };
  }
}
