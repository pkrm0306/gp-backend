import { Types } from 'mongoose';
import { PRODUCT_STATUS_CERTIFIED } from '../../../renew/constants/product-status.constants';
import { PlantMergeBlockerCode } from '../plant-merge.constants';
import {
  buildRenewalWorkflowBlockers,
  normalizeTrimmedValue,
  objectIdKey,
} from '../../helpers/merge-eligibility.shared';

export type PlantMergeBlocker = {
  code: PlantMergeBlockerCode;
  message: string;
};

export type PlantMergePlantRow = {
  _id: Types.ObjectId;
  productPlantId: number;
  productId: Types.ObjectId;
  urnNo: string;
  eoiNo: string;
  plantName: string;
  plantLocation: string;
  city: string;
  stateId?: Types.ObjectId;
  vendorId: Types.ObjectId;
  manufacturerId: Types.ObjectId;
  categoryId: Types.ObjectId;
};

export type PlantMergeProductRow = {
  _id: Types.ObjectId;
  productId: number;
  eoiNo: string;
  productName: string;
  productStatus: number;
  urnNo: string;
  plantCount: number;
  categoryId: Types.ObjectId;
  vendorId: Types.ObjectId;
  manufacturerId: Types.ObjectId;
  urnStatus: number;
  productRenewStatus: number;
};

export function normalizePlantNameKey(value: string | undefined): string {
  return normalizeTrimmedValue(String(value ?? '')).toLowerCase();
}

export function buildPlantDuplicateKey(plant: {
  eoiNo?: string;
  plantName?: string;
  plantLocation?: string;
  city?: string;
}): string {
  return [
    normalizeTrimmedValue(String(plant.eoiNo ?? '')).toLowerCase(),
    normalizePlantNameKey(plant.plantName),
    normalizeTrimmedValue(String(plant.plantLocation ?? plant.city ?? '')).toLowerCase(),
  ].join('|');
}

/** Plant identity on a single product (name + location), used when copying plants to a target EOI. */
export function buildPlantIdentityKey(plant: {
  plantName?: string;
  plantLocation?: string;
  city?: string;
}): string {
  return [
    normalizePlantNameKey(plant.plantName),
    normalizeTrimmedValue(String(plant.plantLocation ?? plant.city ?? '')).toLowerCase(),
  ].join('|');
}

export function derivePlantLocationLabel(plant: {
  plantName?: string;
  plantLocation?: string;
  city?: string;
  stateName?: string | null;
}): string {
  const city = normalizeTrimmedValue(plant.city ?? '');
  const location = normalizeTrimmedValue(plant.plantLocation ?? '');
  const state = normalizeTrimmedValue(String(plant.stateName ?? ''));
  const parts = [location || city, state].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(', ');
  }
  return normalizeTrimmedValue(plant.plantName ?? '');
}

export function buildProductRenewalBlockers(
  productLabel: string,
  product: Pick<PlantMergeProductRow, 'urnStatus' | 'productRenewStatus'>,
): PlantMergeBlocker[] {
  return buildRenewalWorkflowBlockers(productLabel, [product], {
    renewalUrnStatusActive: 'RENEWAL_URN_STATUS_ACTIVE',
    productRenewInProgress: 'PRODUCT_RENEW_IN_PROGRESS',
  });
}

export function validateSourcePlantSelection(
  targetPlantId: string,
  sourcePlantIds: string[],
): PlantMergeBlocker[] {
  const blockers: PlantMergeBlocker[] = [];
  const normalizedTarget = normalizeTrimmedValue(targetPlantId);
  const normalizedSources = sourcePlantIds
    .map((id) => normalizeTrimmedValue(id))
    .filter(Boolean);

  if (normalizedSources.length === 0) {
    blockers.push({
      code: 'NO_SOURCES_SELECTED',
      message: 'Select at least one source plant to absorb',
    });
    return blockers;
  }

  const uniqueSources = new Set(normalizedSources);
  if (uniqueSources.size !== normalizedSources.length) {
    blockers.push({
      code: 'SAME_PLANT',
      message: 'Duplicate source plant ids in request',
    });
  }

  if (normalizedTarget && uniqueSources.has(normalizedTarget)) {
    blockers.push({
      code: 'TARGET_IN_SOURCE_LIST',
      message: 'Target plant cannot also be listed as a source plant',
    });
  }

  return blockers;
}

export function validateRemainingPlantCount(
  activePlantCount: number,
  sourceCount: number,
): PlantMergeBlocker[] {
  const plantCountAfter = activePlantCount - sourceCount;
  if (plantCountAfter < 1) {
    return [
      {
        code: 'MIN_PLANTS_REQUIRED',
        message: 'At least one manufacturing plant must remain on the EOI after merge',
      },
    ];
  }
  return [];
}

export function isCertifiedProduct(product: Pick<PlantMergeProductRow, 'productStatus'>): boolean {
  return Number(product.productStatus) === PRODUCT_STATUS_CERTIFIED;
}

export function plantBelongsToProduct(
  plant: Pick<PlantMergePlantRow, 'productId'>,
  productObjectId: Types.ObjectId,
): boolean {
  return objectIdKey(plant.productId) === objectIdKey(productObjectId);
}
