import { Types } from 'mongoose';
import { PRODUCT_STATUS_CERTIFIED } from '../../../renew/constants/product-status.constants';
import { UrnMergeBlockerCode } from '../urn-merge.constants';
import {
  buildRenewalWorkflowBlockers,
  categoryIdKey,
  normalizeTrimmedValue,
  objectIdKey,
} from '../../helpers/merge-eligibility.shared';

export type UrnMergeBlocker = {
  code: UrnMergeBlockerCode;
  message: string;
};

export type UrnMergeProductRow = {
  _id: Types.ObjectId;
  productId: number;
  eoiNo: string;
  productName: string;
  productStatus: number;
  categoryId: Types.ObjectId;
  vendorId: Types.ObjectId;
  manufacturerId: Types.ObjectId;
  urnStatus: number;
  productRenewStatus: number;
  validtillDate?: Date;
  firstNotifyDate?: Date;
  secondNotifyDate?: Date;
  thirdNotifyDate?: Date;
  renewCycleNo?: number;
};

export function normalizeUrnMergeNo(value: string): string {
  return normalizeTrimmedValue(value);
}

export { categoryIdKey, objectIdKey };

export const URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE =
  'Source and Target URNs must belong to the same Manufacturer and Vendor.';

export function buildOwnershipMismatchBlocker(
  source: Pick<UrnMergeProductRow, 'vendorId' | 'manufacturerId'>,
  target: Pick<UrnMergeProductRow, 'vendorId' | 'manufacturerId'>,
): UrnMergeBlocker[] {
  const hasVendorMismatch =
    objectIdKey(source.vendorId) !== objectIdKey(target.vendorId);
  const hasManufacturerMismatch =
    objectIdKey(source.manufacturerId) !== objectIdKey(target.manufacturerId);

  if (!hasVendorMismatch && !hasManufacturerMismatch) {
    return [];
  }

  return [
    {
      code: hasVendorMismatch ? 'VENDOR_MISMATCH' : 'MANUFACTURER_MISMATCH',
      message: URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE,
    },
  ];
}

export function buildRenewalBlockers(
  urnLabel: string,
  rows: Array<{ urnStatus?: number; productRenewStatus?: number }>,
): UrnMergeBlocker[] {
  return buildRenewalWorkflowBlockers(urnLabel, rows, {
    renewalUrnStatusActive: 'RENEWAL_URN_STATUS_ACTIVE',
    productRenewInProgress: 'PRODUCT_RENEW_IN_PROGRESS',
  });
}

export function findEoiCollisions(
  targetEoiNos: Set<string>,
  eoisToMove: Array<{ eoiNo: string }>,
): UrnMergeBlocker[] {
  const collisions = eoisToMove
    .map((row) => String(row.eoiNo ?? '').trim())
    .filter((eoiNo) => eoiNo && targetEoiNos.has(eoiNo));
  if (collisions.length === 0) {
    return [];
  }
  return [
    {
      code: 'EOI_COLLISION',
      message: `Target URN already has EOI number(s): ${collisions.join(', ')}`,
    },
  ];
}

export function selectCertifiedProductsToMove(
  sourceProducts: UrnMergeProductRow[],
  moveAllCertifiedEois: boolean,
  productIds: number[] | undefined,
): UrnMergeProductRow[] {
  const certified = sourceProducts.filter(
    (p) => Number(p.productStatus) === PRODUCT_STATUS_CERTIFIED,
  );
  if (moveAllCertifiedEois !== false) {
    return certified;
  }
  const idSet = new Set((productIds ?? []).map((id) => Number(id)));
  return certified.filter((p) => idSet.has(Number(p.productId)));
}
