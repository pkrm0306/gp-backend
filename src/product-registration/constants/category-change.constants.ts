/**
 * Category is locked once admin clicks **Submit Final** on the URN tab review
 * (`urnStatus` becomes 6 — "final verification pending" onward).
 */
export const CATEGORY_CHANGE_LOCKED_MIN_URN_STATUS = 6;

/** `urnStatus` written when admin submits final review for the URN. */
export const ADMIN_FINAL_SUBMIT_URN_STATUS = CATEGORY_CHANGE_LOCKED_MIN_URN_STATUS;

export const CATEGORY_CHANGE_LOCKED_MESSAGE =
  'Product category cannot be changed after admin final submit. All forms have been sent for final review (urnStatus >= 6).';

export const CATEGORY_CHANGE_CERTIFIED_MESSAGE =
  'Product category cannot be changed for certified products. Category is read-only on certified product edit.';

export const CATEGORY_CHANGE_RENEWAL_MESSAGE =
  'Product category cannot be changed while the URN is in renewal workflow';
