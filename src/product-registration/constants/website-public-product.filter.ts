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
