import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
} from '../../renew/constants/product-status.constants';
import {
  isOngoingRenewalProduct,
  ONGOING_RENEWAL_URN_STATUSES,
} from './certified-product.filter';
import { PRODUCT_RENEW_STATUS } from '../../renew/constants/renewal-urn-status.constants';

/**
 * Mongo match for expired/discontinued certified products.
 * Ongoing renewals are excluded — they remain on Certified Products until renewal completes.
 */
export function matchExpiredProducts(now = new Date()): Record<string, unknown> {
  return {
    $or: [
      { productStatus: PRODUCT_STATUS_DISCONTINUED },
      {
        $and: [
          { productStatus: PRODUCT_STATUS_CERTIFIED },
          { validtillDate: { $exists: true, $ne: null, $lt: now } },
          { urnStatus: { $nin: [...ONGOING_RENEWAL_URN_STATUSES] } },
          { productRenewStatus: { $ne: PRODUCT_RENEW_STATUS.IN_PROGRESS } },
        ],
      },
    ],
  };
}

export function isExpiredProduct(
  productStatus: number,
  validtillDate: Date | null | undefined,
  now = new Date(),
  renewal?: {
    urnStatus?: number | null;
    productRenewStatus?: number | null;
  },
): boolean {
  if (renewal && isOngoingRenewalProduct(renewal)) {
    return false;
  }
  if (productStatus === PRODUCT_STATUS_DISCONTINUED) {
    return true;
  }
  return (
    productStatus === PRODUCT_STATUS_CERTIFIED &&
    validtillDate != null &&
    new Date(validtillDate).getTime() < now.getTime()
  );
}
