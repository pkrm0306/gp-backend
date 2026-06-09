import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_REJECTED,
  PRODUCT_STATUS_SUBMITTED,
} from '../../renew/constants/product-status.constants';
import { isRenewalUrnStatus } from '../../renew/constants/renewal-urn-status.constants';

export type UrnAddProductEligibility = {
  canAddProduct: boolean;
  blockReason: string | null;
  defaultProductStatus: number;
};

export function evaluateUrnAddProductEligibility(input: {
  urnStatus: number;
  siblingProductStatuses: number[];
}): UrnAddProductEligibility {
  const statuses = input.siblingProductStatuses.map((s) => Number(s));

  if (isRenewalUrnStatus(Number(input.urnStatus))) {
    return {
      canAddProduct: false,
      blockReason: 'Cannot add products while renewal is in progress',
      defaultProductStatus: PRODUCT_STATUS_PENDING,
    };
  }

  if (statuses.some((s) => s === PRODUCT_STATUS_CERTIFIED)) {
    return {
      canAddProduct: false,
      blockReason: 'URN has certified products',
      defaultProductStatus: PRODUCT_STATUS_PENDING,
    };
  }

  const uncertified = statuses.filter(
    (s) => s === PRODUCT_STATUS_PENDING || s === PRODUCT_STATUS_SUBMITTED,
  );

  if (uncertified.length === 0) {
    if (statuses.length > 0 && statuses.every((s) => s === PRODUCT_STATUS_REJECTED)) {
      return {
        canAddProduct: true,
        blockReason: null,
        defaultProductStatus: PRODUCT_STATUS_PENDING,
      };
    }
    if (statuses.length > 0 && statuses.every((s) => s === PRODUCT_STATUS_DISCONTINUED)) {
      return {
        canAddProduct: false,
        blockReason: 'URN has no active un-certified products',
        defaultProductStatus: PRODUCT_STATUS_PENDING,
      };
    }
    if (statuses.some((s) => s === PRODUCT_STATUS_DISCONTINUED)) {
      return {
        canAddProduct: false,
        blockReason: 'URN has no active un-certified products',
        defaultProductStatus: PRODUCT_STATUS_PENDING,
      };
    }
  }

  const defaultProductStatus =
    uncertified.length > 0 && uncertified.every((s) => s === PRODUCT_STATUS_SUBMITTED)
      ? PRODUCT_STATUS_SUBMITTED
      : PRODUCT_STATUS_PENDING;

  return {
    canAddProduct: true,
    blockReason: null,
    defaultProductStatus,
  };
}
