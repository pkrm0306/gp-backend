/**
 * Vendor dashboard — Applications & URNs table display labels.
 * Source of truth: products.productStatus, products.urnStatus (productType = 0).
 */

export type VendorApplicationProductApproval =
  | 'Pending'
  | 'Submitted'
  | 'Approved'
  | 'Rejected'
  | 'Expired';
export type VendorApplicationCertification = 'Not certified' | 'Certified';
export type VendorApplicationOverall =
  | 'Pending'
  | 'Submitted'
  | 'Certified'
  | 'Rejected'
  | 'Expired';
export type VendorApplicationOverallVariant =
  | 'pending'
  | 'submitted'
  | 'certified'
  | 'rejected'
  | 'expired';

export type VendorApplicationRow = {
  product_id: number;
  urn_no: string | null;
  eoi_no: string;
  product_name: string;
  product_approval: VendorApplicationProductApproval;
  site_visit: string | null;
  certification: VendorApplicationCertification;
  overall: VendorApplicationOverall;
  overall_variant: VendorApplicationOverallVariant;
  product_status: number;
  urn_status: number;
  /** ISO date string when certification expires; used for pending-renewal KPIs. */
  validtill_date: string | null;
};

export function mapProductApproval(
  productStatus: number,
): VendorApplicationProductApproval {
  if (productStatus === 3) return 'Rejected';
  if (productStatus === 4) return 'Expired';
  if (productStatus === 0) return 'Pending';
  if (productStatus === 1) return 'Submitted';
  if (productStatus === 2) return 'Approved';
  return 'Pending';
}

export function mapCertification(
  productStatus: number,
): VendorApplicationCertification {
  return productStatus === 2 ? 'Certified' : 'Not certified';
}

export function mapOverall(productStatus: number): {
  overall: VendorApplicationOverall;
  overall_variant: VendorApplicationOverallVariant;
} {
  if (productStatus === 2) {
    return { overall: 'Certified', overall_variant: 'certified' };
  }
  if (productStatus === 3) {
    return { overall: 'Rejected', overall_variant: 'rejected' };
  }
  if (productStatus === 4) {
    return { overall: 'Expired', overall_variant: 'expired' };
  }
  if (productStatus === 1) {
    return { overall: 'Submitted', overall_variant: 'submitted' };
  }
  return { overall: 'Pending', overall_variant: 'pending' };
}

/** Site visit column — derived from URN lifecycle (no dedicated DB field). */
export function mapSiteVisit(urnStatus: number): string | null {
  if (urnStatus >= 6) return 'Completed';
  if (urnStatus === 5) return 'In progress';
  return null;
}

export function formatUrnForDisplay(urnNo: string | null | undefined): string | null {
  const v = String(urnNo ?? '').trim();
  return v.length > 0 ? v : null;
}

function formatValidTillDate(value: unknown): string | null {
  if (value == null || value === '') return null;
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function buildVendorApplicationRow(input: {
  productId: number;
  urnNo?: string | null;
  eoiNo: string;
  productName: string;
  productStatus: number;
  urnStatus: number;
  validtillDate?: Date | string | null;
}): VendorApplicationRow {
  const product_status = Number(input.productStatus ?? 0);
  const urn_status = Number(input.urnStatus ?? 0);
  const { overall, overall_variant } = mapOverall(product_status);

  return {
    product_id: input.productId,
    urn_no: formatUrnForDisplay(input.urnNo),
    eoi_no: String(input.eoiNo ?? '').trim(),
    product_name: String(input.productName ?? '').trim(),
    product_approval: mapProductApproval(product_status),
    site_visit: mapSiteVisit(urn_status),
    certification: mapCertification(product_status),
    overall,
    overall_variant,
    product_status,
    urn_status,
    validtill_date: formatValidTillDate(input.validtillDate),
  };
}
