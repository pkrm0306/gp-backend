import { PRODUCT_STATUS_CERTIFIED } from '../../renew/constants/product-status.constants';
import {
  PRODUCT_RENEW_STATUS,
  RENEWAL_URN_STATUS,
} from '../../renew/constants/renewal-urn-status.constants';

/** Open renewal workflow statuses (payment pending → final verification). */
export const ONGOING_RENEWAL_URN_STATUSES = [
  RENEWAL_URN_STATUS.PAYMENT_PENDING,
  RENEWAL_URN_STATUS.PAYMENT_SUBMITTED,
  RENEWAL_URN_STATUS.PAYMENT_APPROVED,
  RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
  RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING,
  RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
] as const;

export function isOngoingRenewalProduct(params: {
  urnStatus?: number | null;
  productRenewStatus?: number | null;
}): boolean {
  const urnStatus = Number(params.urnStatus ?? 0);
  const productRenewStatus = Number(params.productRenewStatus ?? 0);
  if (
    urnStatus >= RENEWAL_URN_STATUS.PAYMENT_PENDING &&
    urnStatus <= RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING
  ) {
    return true;
  }
  return productRenewStatus === PRODUCT_RENEW_STATUS.IN_PROGRESS;
}

/**
 * Mongo clause: product is mid-renewal (not yet completed).
 * Used so Certified Products keeps the previous completed certification visible.
 */
export function matchOngoingRenewalClause(): Record<string, unknown> {
  return {
    $or: [
      { urnStatus: { $in: [...ONGOING_RENEWAL_URN_STATUSES] } },
      { productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS },
    ],
  };
}

/**
 * Certified Products list eligibility.
 * Ongoing renewal must NOT remove a previously completed certification from the list,
 * even when `validtillDate` has already passed (common for renew eligibility).
 */
export function matchCertifiedProductsList(now = new Date()): Record<string, unknown> {
  return {
    productStatus: PRODUCT_STATUS_CERTIFIED,
    $or: [
      { validtillDate: null },
      { validtillDate: { $exists: false } },
      { validtillDate: { $gte: now } },
      { urnStatus: { $in: [...ONGOING_RENEWAL_URN_STATUSES] } },
      { productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS },
    ],
  };
}

/** Validity still active (no ongoing-renewal override). */
export function matchNonExpiredValidityClause(now = new Date()): Record<string, unknown> {
  return {
    $or: [
      { validtillDate: null },
      { validtillDate: { $exists: false } },
      { validtillDate: { $gte: now } },
    ],
  };
}
