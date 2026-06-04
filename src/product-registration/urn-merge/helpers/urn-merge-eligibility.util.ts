import { Types } from 'mongoose';
import { PRODUCT_RENEW_STATUS } from '../../../renew/constants/renewal-urn-status.constants';
import { PRODUCT_STATUS_CERTIFIED } from '../../../renew/constants/product-status.constants';
import { UrnMergeBlockerCode } from '../urn-merge.constants';

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
  return String(value ?? '').trim();
}

export function categoryIdKey(id: Types.ObjectId | string | undefined): string {
  if (!id) return '';
  return id instanceof Types.ObjectId ? id.toHexString() : String(id);
}

export function objectIdKey(id: Types.ObjectId | string | undefined): string {
  return categoryIdKey(id);
}

export function buildRenewalBlockers(
  urnLabel: string,
  rows: Array<{ urnStatus?: number; productRenewStatus?: number }>,
): UrnMergeBlocker[] {
  const blockers: UrnMergeBlocker[] = [];
  for (const row of rows) {
    const urnStatus = Number(row.urnStatus ?? 0);
    if (urnStatus >= 12 && urnStatus <= 17) {
      blockers.push({
        code: 'RENEWAL_URN_STATUS_ACTIVE',
        message: `${urnLabel} has active renewal urnStatus ${urnStatus}`,
      });
      break;
    }
    if (Number(row.productRenewStatus) === PRODUCT_RENEW_STATUS.IN_PROGRESS) {
      blockers.push({
        code: 'PRODUCT_RENEW_IN_PROGRESS',
        message: `${urnLabel} has product renew in progress`,
      });
      break;
    }
  }
  return blockers;
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
