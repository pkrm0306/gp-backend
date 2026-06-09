import { ACTIVE_PRODUCT_FILTER } from './active-product.filter';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_SUBMITTED,
} from '../../renew/constants/product-status.constants';

/** Products that participate in manufacturer EOI max-sequence calculation. */
export const EOI_SEQUENCE_ACTIVE_STATUSES = [
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_SUBMITTED,
  PRODUCT_STATUS_CERTIFIED,
] as const;

export function matchEoiSequenceActiveProducts(
  criteria: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...criteria,
    ...ACTIVE_PRODUCT_FILTER,
    productStatus: { $in: [...EOI_SEQUENCE_ACTIVE_STATUSES] },
  };
}
