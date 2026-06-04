import { Model } from 'mongoose';
import { matchActiveProducts } from '../../product-registration/constants/active-product.filter';
import { PRODUCT_STATUS_CERTIFIED } from '../constants/product-status.constants';
import { isRenewalUrnStatus } from '../constants/renewal-urn-status.constants';

/**
 * Renewal under a URN only includes certified EOIs (`product_status === 2`).
 * Rejected (3), discontinued (4), pending (0/1), etc. are excluded from lists,
 * details, status updates, completion, and EOI-scoped renew documents.
 */
export const RENEW_ELIGIBLE_PRODUCT_STATUS = PRODUCT_STATUS_CERTIFIED;

export function isRenewEligibleProduct(row: {
  productStatus?: unknown;
}): boolean {
  return Number(row.productStatus) === RENEW_ELIGIBLE_PRODUCT_STATUS;
}

/** Mongo match: active, non-deleted products with certified status only. */
export function matchRenewEligibleProducts(
  criteria: Record<string, unknown> = {},
): Record<string, unknown> {
  return matchActiveProducts({
    ...criteria,
    productStatus: RENEW_ELIGIBLE_PRODUCT_STATUS,
  });
}

/**
 * Same as {@link matchRenewEligibleProducts} — use for PATCH /renew/urn-status and any
 * renewal `urnStatus` write so rejected (3) / discontinued (4) EOIs are never updated.
 */
export function matchRenewUrnStatusUpdateProducts(
  criteria: Record<string, unknown> = {},
): Record<string, unknown> {
  return matchRenewEligibleProducts(criteria);
}

/** Whether a products.urnStatus patch must be limited to certified EOIs only. */
export function shouldLimitUrnStatusUpdateToCertifiedProducts(
  paymentType?: string | null,
  urnStatus?: number | null,
): boolean {
  if (String(paymentType ?? '').toLowerCase() === 'renew') {
    return true;
  }
  if (urnStatus != null && isRenewalUrnStatus(Number(urnStatus))) {
    return true;
  }
  return false;
}

export function buildProductFilterForUrnStatusUpdate(
  criteria: Record<string, unknown>,
  paymentType?: string | null,
  urnStatus?: number | null,
): Record<string, unknown> {
  if (shouldLimitUrnStatusUpdateToCertifiedProducts(paymentType, urnStatus)) {
    return matchRenewUrnStatusUpdateProducts(criteria);
  }
  return matchActiveProducts(criteria);
}

export function filterRenewEligibleProducts<T extends { productStatus?: unknown }>(
  rows: T[],
): T[] {
  return rows.filter(isRenewEligibleProduct);
}

/** Product row from GET /products/details or renew details bundle. */
export function getProductStatusFromDetailsRow(
  row: Record<string, unknown>,
): number | null {
  const productDetails = row.product_details as Record<string, unknown> | undefined;
  if (productDetails?.productStatus != null) {
    return Number(productDetails.productStatus);
  }
  if (row.productStatus != null) {
    return Number(row.productStatus);
  }
  return null;
}

export function isRenewEligibleDetailsRow(row: Record<string, unknown>): boolean {
  const status = getProductStatusFromDetailsRow(row);
  if (status == null || Number.isNaN(status)) {
    return false;
  }
  return isRenewEligibleProduct({ productStatus: status });
}

export function filterRenewDetailsRows(
  rows: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return rows.filter(isRenewEligibleDetailsRow);
}

/** Certified EOI numbers on a URN (for filtering per-EOI renew rows/documents). */
export async function fetchRenewCertifiedEoiSet(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productModel: Model<any>,
  urnNo: string,
): Promise<Set<string>> {
  const rows = await productModel
    .find({ urnNo: urnNo.trim(), ...matchRenewEligibleProducts() })
    .select('eoiNo')
    .lean()
    .exec();

  return new Set(
    rows
      .map((row) => String(row.eoiNo ?? '').trim())
      .filter((eoiNo) => eoiNo.length > 0),
  );
}

/**
 * Keep URN-level rows (no eoiNo) and rows whose eoiNo is certified on this URN.
 */
export function filterRenewRowsByCertifiedEoi<T extends Record<string, unknown>>(
  rows: T[],
  certifiedEoiNos: Set<string>,
): T[] {
  if (certifiedEoiNos.size === 0) {
    return [];
  }
  return rows.filter((row) => {
    const eoiNo = row.eoiNo != null ? String(row.eoiNo).trim() : '';
    if (!eoiNo) {
      return true;
    }
    return certifiedEoiNos.has(eoiNo);
  });
}
