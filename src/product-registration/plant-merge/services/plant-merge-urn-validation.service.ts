import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../schemas/product.schema';
import {
  PlantMergeAudit,
  PlantMergeAuditDocument,
} from '../schemas/plant-merge-audit.schema';
import { matchActiveProducts } from '../../constants/active-product.filter';
import { PRODUCT_STATUS_CERTIFIED } from '../../../renew/constants/product-status.constants';
import { normalizeTrimmedValue } from '../../helpers/merge-eligibility.shared';
import { PlantMergeValidateDto } from '../dto/plant-merge-validate.dto';
import {
  PLANT_MERGE_URN_VALIDATION_BLOCKER,
  PLANT_MERGE_URN_VALIDATION_MESSAGE,
} from '../plant-merge-urn-validation.constants';
import {
  PlantMergeUrnValidationBlocker,
  PlantMergeUrnValidationProductRow,
  buildPlantMergeUrnPairValidationBlockers,
  isSameSourceAndTargetPair,
} from '../helpers/plant-merge-urn-validation.util';
import {
  findActiveProductOnUrn,
  PLANT_MERGE_URN_VALIDATION_PRODUCT_SELECT,
} from '../helpers/plant-merge-product-lookup.util';

export type PlantMergeUrnValidationResult = {
  success: true;
  canMerge: boolean;
  sourceUrnNo: string;
  targetUrnNo: string;
  sourceEoiNo: string;
  targetEoiNo: string;
  productName?: string;
  blockers: PlantMergeUrnValidationBlocker[];
};

@Injectable()
export class PlantMergeUrnValidationService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(PlantMergeAudit.name)
    private readonly plantMergeAuditModel: Model<PlantMergeAuditDocument>,
  ) {}

  async validate(dto: PlantMergeValidateDto): Promise<PlantMergeUrnValidationResult> {
    const sourceUrnNo = normalizeTrimmedValue(dto.sourceUrnNo);
    const targetUrnNo = normalizeTrimmedValue(dto.targetUrnNo);
    const sourceEoiNo = normalizeTrimmedValue(dto.sourceEoiNo);
    const targetEoiNo = normalizeTrimmedValue(dto.targetEoiNo);

    const blockers: PlantMergeUrnValidationBlocker[] = [];

    if (
      isSameSourceAndTargetPair({
        sourceUrnNo,
        targetUrnNo,
        sourceEoiNo,
        targetEoiNo,
      })
    ) {
      blockers.push({
        code: PLANT_MERGE_URN_VALIDATION_BLOCKER.SAME_SOURCE_TARGET,
        message: PLANT_MERGE_URN_VALIDATION_MESSAGE.SAME_SOURCE_TARGET,
      });
    }

    await this.appendSourceUrnCertifiedBlocker(sourceUrnNo, blockers);

    const sourceProduct = await this.findProductOnUrn(sourceUrnNo, sourceEoiNo);
    if (!sourceProduct) {
      blockers.push({
        code: PLANT_MERGE_URN_VALIDATION_BLOCKER.SOURCE_EOI_NOT_FOUND,
        message: PLANT_MERGE_URN_VALIDATION_MESSAGE.SOURCE_EOI_NOT_FOUND,
      });
    }

    const targetProduct = await this.findProductOnUrn(targetUrnNo, targetEoiNo);
    if (!targetProduct) {
      blockers.push({
        code: PLANT_MERGE_URN_VALIDATION_BLOCKER.TARGET_EOI_NOT_FOUND,
        message: PLANT_MERGE_URN_VALIDATION_MESSAGE.TARGET_EOI_NOT_FOUND,
      });
    }

    if (sourceProduct && targetProduct) {
      blockers.push(
        ...buildPlantMergeUrnPairValidationBlockers(sourceProduct, targetProduct),
      );
      await this.appendDuplicateMergeBlocker(
        sourceUrnNo,
        sourceEoiNo,
        targetUrnNo,
        targetEoiNo,
        blockers,
      );
    }

    const uniqueBlockers = this.deduplicateBlockers(blockers);

    return {
      success: true,
      canMerge: uniqueBlockers.length === 0,
      sourceUrnNo,
      targetUrnNo,
      sourceEoiNo,
      targetEoiNo,
      productName: sourceProduct?.productName ?? targetProduct?.productName,
      blockers: uniqueBlockers,
    };
  }

  async validateResolvedPair(
    source: PlantMergeUrnValidationProductRow,
    target: PlantMergeUrnValidationProductRow,
    sourceUrnNo: string,
  ): Promise<PlantMergeUrnValidationBlocker[]> {
    const blockers: PlantMergeUrnValidationBlocker[] = [];

    await this.appendSourceUrnCertifiedBlocker(sourceUrnNo, blockers);
    blockers.push(...buildPlantMergeUrnPairValidationBlockers(source, target));
    await this.appendDuplicateMergeBlocker(
      source.urnNo,
      source.eoiNo,
      target.urnNo,
      target.eoiNo,
      blockers,
    );

    return this.deduplicateBlockers(blockers);
  }

  private async findProductOnUrn(
    urnNo: string,
    eoiNo: string,
  ): Promise<PlantMergeUrnValidationProductRow | null> {
    return findActiveProductOnUrn<PlantMergeUrnValidationProductRow>(
      this.productModel,
      urnNo,
      eoiNo,
      PLANT_MERGE_URN_VALIDATION_PRODUCT_SELECT,
    );
  }

  private async appendSourceUrnCertifiedBlocker(
    sourceUrnNo: string,
    blockers: PlantMergeUrnValidationBlocker[],
  ): Promise<void> {
    const sourceUrnCertifiedCount = await this.productModel.countDocuments(
      matchActiveProducts({
        urnNo: sourceUrnNo,
        productStatus: PRODUCT_STATUS_CERTIFIED,
      }),
    );
    if (sourceUrnCertifiedCount === 0) {
      blockers.push({
        code: PLANT_MERGE_URN_VALIDATION_BLOCKER.SOURCE_URN_NOT_CERTIFIED,
        message: PLANT_MERGE_URN_VALIDATION_MESSAGE.SOURCE_URN_NOT_CERTIFIED,
      });
    }
  }

  private async appendDuplicateMergeBlocker(
    sourceUrnNo: string,
    sourceEoiNo: string,
    targetUrnNo: string,
    targetEoiNo: string,
    blockers: PlantMergeUrnValidationBlocker[],
  ): Promise<void> {
    if (await this.hasDuplicateMerge(sourceUrnNo, sourceEoiNo, targetUrnNo, targetEoiNo)) {
      blockers.push({
        code: PLANT_MERGE_URN_VALIDATION_BLOCKER.DUPLICATE_MERGE,
        message: PLANT_MERGE_URN_VALIDATION_MESSAGE.DUPLICATE_MERGE,
      });
    }
  }

  private async hasDuplicateMerge(
    sourceUrnNo: string,
    sourceEoiNo: string,
    targetUrnNo: string,
    targetEoiNo: string,
  ): Promise<boolean> {
    const count = await this.plantMergeAuditModel.countDocuments({
      urnNo: sourceUrnNo,
      eoiNo: sourceEoiNo,
      targetUrnNo,
      targetEoiNo,
    });
    return count > 0;
  }

  private deduplicateBlockers(
    blockers: PlantMergeUrnValidationBlocker[],
  ): PlantMergeUrnValidationBlocker[] {
    const seen = new Set<string>();
    const out: PlantMergeUrnValidationBlocker[] = [];
    for (const blocker of blockers) {
      const key = `${blocker.code}:${blocker.message}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(blocker);
    }
    return out;
  }
}
