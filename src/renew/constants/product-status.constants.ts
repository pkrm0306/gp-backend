/** EOI / product lifecycle status codes used across certification and renewal flows. */
export const PRODUCT_STATUS_PENDING = 0;
export const PRODUCT_STATUS_SUBMITTED = 1;
export const PRODUCT_STATUS_CERTIFIED = 2;
export const PRODUCT_STATUS_REJECTED = 3;
export const PRODUCT_STATUS_DISCONTINUED = 4;

export const TOGGLEABLE_DISCONTINUE_STATUSES = [
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
] as const;
