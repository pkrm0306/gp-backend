import { Types } from 'mongoose';
import { PRODUCT_RENEW_STATUS } from '../../renew/constants/renewal-urn-status.constants';

export const RENEWAL_URN_STATUS_ACTIVE_MIN = 12;
export const RENEWAL_URN_STATUS_ACTIVE_MAX = 17;

export type RenewalStatusRow = {
  urnStatus?: number;
  productRenewStatus?: number;
};

export function normalizeTrimmedValue(value: string): string {
  return String(value ?? '').trim();
}

export function objectIdKey(id: Types.ObjectId | string | undefined): string {
  if (!id) return '';
  return id instanceof Types.ObjectId ? id.toHexString() : String(id);
}

export function categoryIdKey(id: Types.ObjectId | string | undefined): string {
  return objectIdKey(id);
}

export function parseObjectId(
  value: string,
  fieldLabel: string,
): Types.ObjectId | null {
  const trimmed = normalizeTrimmedValue(value);
  if (!trimmed) return null;
  if (!Types.ObjectId.isValid(trimmed)) {
    return null;
  }
  return new Types.ObjectId(trimmed);
}

export function buildRenewalWorkflowBlockers<TCode extends string>(
  label: string,
  rows: RenewalStatusRow[],
  codes: {
    renewalUrnStatusActive: TCode;
    productRenewInProgress: TCode;
  },
): Array<{ code: TCode; message: string }> {
  const blockers: Array<{ code: TCode; message: string }> = [];
  for (const row of rows) {
    const urnStatus = Number(row.urnStatus ?? 0);
    if (
      urnStatus >= RENEWAL_URN_STATUS_ACTIVE_MIN &&
      urnStatus <= RENEWAL_URN_STATUS_ACTIVE_MAX
    ) {
      blockers.push({
        code: codes.renewalUrnStatusActive,
        message: `${label} has an active renewal process`,
      });
      break;
    }
    if (Number(row.productRenewStatus) === PRODUCT_RENEW_STATUS.IN_PROGRESS) {
      blockers.push({
        code: codes.productRenewInProgress,
        message: `${label} has product renew in progress`,
      });
      break;
    }
  }
  return blockers;
}

export function isRenewalWorkflowUrnStatus(urnStatus: number | null | undefined): boolean {
  const status = Number(urnStatus ?? 0);
  return (
    status >= RENEWAL_URN_STATUS_ACTIVE_MIN &&
    status <= RENEWAL_URN_STATUS_ACTIVE_MAX
  );
}
