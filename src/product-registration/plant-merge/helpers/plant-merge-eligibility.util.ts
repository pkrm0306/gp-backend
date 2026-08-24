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

function emptyAsMissing(value: string | undefined | null): string {
  return normalizeTrimmedValue(String(value ?? '')).toLowerCase();
}

function plantStateKey(plant: {
  stateId?: Types.ObjectId | string;
  stateName?: string | null;
}): string {
  const stateId = objectIdKey(plant.stateId);
  if (stateId) {
    return `id:${stateId}`;
  }
  return `name:${emptyAsMissing(plant.stateName)}`;
}

export type PlantIdentityFields = {
  plantName?: string;
  plantLocation?: string;
  city?: string;
  stateId?: Types.ObjectId | string;
  stateName?: string | null;
};

export function buildPlantDuplicateKey(plant: PlantIdentityFields & { eoiNo?: string }): string {
  return [emptyAsMissing(plant.eoiNo), buildPlantIdentityKey(plant)].join('|');
}

/**
 * Plant identity on a single product when copying plants to a target EOI.
 * Same plant only when name, city, and state all match (address is a 4th part).
 */
export function buildPlantIdentityKey(plant: PlantIdentityFields): string {
  return [
    normalizePlantNameKey(plant.plantName),
    emptyAsMissing(plant.city),
    plantStateKey(plant),
    emptyAsMissing(plant.plantLocation),
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
