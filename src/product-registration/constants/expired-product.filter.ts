import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
} from '../../renew/constants/product-status.constants';

/** Mongo match for expired/discontinued certified products. */
export function matchExpiredProducts(now = new Date()): Record<string, unknown> {
  return {
    $or: [
      { productStatus: PRODUCT_STATUS_DISCONTINUED },
      {
        productStatus: PRODUCT_STATUS_CERTIFIED,
        validtillDate: { $exists: true, $ne: null, $lt: now },
      },
    ],
  };
}

export function isExpiredProduct(
  productStatus: number,
  validtillDate: Date | null | undefined,
  now = new Date(),
): boolean {
  if (productStatus === PRODUCT_STATUS_DISCONTINUED) {
    return true;
  }
  return (
    productStatus === PRODUCT_STATUS_CERTIFIED &&
    validtillDate != null &&
    new Date(validtillDate).getTime() < now.getTime()
  );
}
