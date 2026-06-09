import { matchActiveProducts } from './active-product.filter';

/** Certified EOI rows shown on the public website product grid. */
export const WEBSITE_PUBLIC_CERTIFIED_PRODUCT_STATUS = 2;

export function matchWebsitePublicCertifiedProducts(
  criteria: Record<string, unknown> = {},
): Record<string, unknown> {
  return matchActiveProducts({
    productStatus: WEBSITE_PUBLIC_CERTIFIED_PRODUCT_STATUS,
    ...criteria,
  });
}

/** Certified EOIs shown on the public website (active certificate, not past validtillDate). */
export function matchWebsitePublicActiveCertifiedProducts(
  criteria: Record<string, unknown> = {},
): Record<string, unknown> {
  const now = new Date();
  return matchActiveProducts({
    productStatus: WEBSITE_PUBLIC_CERTIFIED_PRODUCT_STATUS,
    $or: [
      { validtillDate: null },
      { validtillDate: { $exists: false } },
      { validtillDate: { $gte: now } },
    ],
    ...criteria,
  });
}
