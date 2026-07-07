import { Types } from 'mongoose';
import { PRODUCT_STATUS_CERTIFIED } from '../../../renew/constants/product-status.constants';
import {
  PLANT_MERGE_URN_VALIDATION_BLOCKER,
  PLANT_MERGE_URN_VALIDATION_MESSAGE,
  PlantMergeUrnValidationBlockerCode,
} from '../plant-merge-urn-validation.constants';
import {
  categoryIdKey,
  normalizeTrimmedValue,
  objectIdKey,
} from '../../helpers/merge-eligibility.shared';
import { isTargetOlderThanSource } from './plant-merge-urn-target.util';

export type PlantMergeUrnValidationBlocker = {
  code: PlantMergeUrnValidationBlockerCode;
  message: string;
};

export type PlantMergeUrnValidationProductRow = {
  _id: Types.ObjectId;
  productName: string;
  eoiNo: string;
  urnNo: string;
  productStatus: number;
  categoryId: Types.ObjectId;
  manufacturerId: Types.ObjectId;
  certifiedDate?: Date;
  createdDate: Date;
};

export function exactProductNamesMatch(
  left: string | undefined,
  right: string | undefined,
): boolean {
  return (
    normalizeTrimmedValue(String(left ?? '')) ===
    normalizeTrimmedValue(String(right ?? ''))
  );
}

export function isCertifiedProductRow(
  product: Pick<PlantMergeUrnValidationProductRow, 'productStatus'>,
): boolean {
  return Number(product.productStatus) === PRODUCT_STATUS_CERTIFIED;
}

export { isTargetOlderThanSource } from './plant-merge-urn-target.util';

export function isSameSourceAndTargetPair(input: {
  sourceUrnNo: string;
  targetUrnNo: string;
  sourceEoiNo: string;
  targetEoiNo: string;
  sourceProductId?: Types.ObjectId;
  targetProductId?: Types.ObjectId;
}): boolean {
  const sourceUrn = normalizeTrimmedValue(input.sourceUrnNo);
  const targetUrn = normalizeTrimmedValue(input.targetUrnNo);
  const sourceEoi = normalizeTrimmedValue(input.sourceEoiNo);
  const targetEoi = normalizeTrimmedValue(input.targetEoiNo);

  if (
    input.sourceProductId &&
    input.targetProductId &&
    objectIdKey(input.sourceProductId) === objectIdKey(input.targetProductId)
  ) {
    return true;
  }

  if (sourceUrn === targetUrn && sourceEoi === targetEoi) {
    return true;
  }

  return false;
}

export function buildPlantMergeUrnPairValidationBlockers(
  source: PlantMergeUrnValidationProductRow,
  target: PlantMergeUrnValidationProductRow,
): PlantMergeUrnValidationBlocker[] {
  const blockers: PlantMergeUrnValidationBlocker[] = [];

  if (isSameSourceAndTargetPair({
    sourceUrnNo: source.urnNo,
    targetUrnNo: target.urnNo,
    sourceEoiNo: source.eoiNo,
    targetEoiNo: target.eoiNo,
    sourceProductId: source._id,
    targetProductId: target._id,
  })) {
    blockers.push({
      code: PLANT_MERGE_URN_VALIDATION_BLOCKER.SAME_SOURCE_TARGET,
      message: PLANT_MERGE_URN_VALIDATION_MESSAGE.SAME_SOURCE_TARGET,
    });
    return blockers;
  }

  if (!isCertifiedProductRow(source)) {
    blockers.push({
      code: PLANT_MERGE_URN_VALIDATION_BLOCKER.SOURCE_EOI_NOT_CERTIFIED,
      message: PLANT_MERGE_URN_VALIDATION_MESSAGE.SOURCE_EOI_NOT_CERTIFIED,
    });
  }

  if (!isCertifiedProductRow(target)) {
    blockers.push({
      code: PLANT_MERGE_URN_VALIDATION_BLOCKER.TARGET_NOT_CERTIFIED,
      message: PLANT_MERGE_URN_VALIDATION_MESSAGE.TARGET_NOT_CERTIFIED,
    });
  }

  if (!exactProductNamesMatch(source.productName, target.productName)) {
    blockers.push({
      code: PLANT_MERGE_URN_VALIDATION_BLOCKER.PRODUCT_NAME_MISMATCH,
      message: PLANT_MERGE_URN_VALIDATION_MESSAGE.PRODUCT_NAME_MISMATCH,
    });
  }

  if (objectIdKey(source.manufacturerId) !== objectIdKey(target.manufacturerId)) {
    blockers.push({
      code: PLANT_MERGE_URN_VALIDATION_BLOCKER.MANUFACTURER_MISMATCH,
      message: PLANT_MERGE_URN_VALIDATION_MESSAGE.MANUFACTURER_MISMATCH,
    });
  }

  if (categoryIdKey(source.categoryId) !== categoryIdKey(target.categoryId)) {
    blockers.push({
      code: PLANT_MERGE_URN_VALIDATION_BLOCKER.CATEGORY_MISMATCH,
      message: PLANT_MERGE_URN_VALIDATION_MESSAGE.CATEGORY_MISMATCH,
    });
  }

  if (!isTargetOlderThanSource(target, source)) {
    blockers.push({
      code: PLANT_MERGE_URN_VALIDATION_BLOCKER.TARGET_NOT_OLDER,
      message: PLANT_MERGE_URN_VALIDATION_MESSAGE.TARGET_NOT_OLDER,
    });
  }

  return blockers;
}
