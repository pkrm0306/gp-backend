/** Vendor submitted certification payment for admin review (`urnStatus` 8). */
export const PROCESS_COMMENTS_LOCKED_MIN_URN_STATUS = 8;

export const PROCESS_COMMENTS_LOCKED_MESSAGE =
  'Admin technical/final advise cannot be saved after the vendor has submitted certification payment for review (urnStatus >= 8)';

/**
 * Uncertified URN process tabs: admin may save technical/final advise only before
 * the vendor submits certification payment for review.
 */
export function canAdminSaveUncertifiedProcessComments(params: {
  urnStatus?: number | null;
  productStatus?: number | null;
}): boolean {
  const urnStatus = Number(params.urnStatus ?? 0);
  const productStatus = Number(params.productStatus ?? 0);

  if (productStatus === 2) {
    return false;
  }

  return urnStatus < PROCESS_COMMENTS_LOCKED_MIN_URN_STATUS;
}

export function resolveProcessCommentsBlockReason(params: {
  urnStatus?: number | null;
  productStatus?: number | null;
}): string | null {
  if (canAdminSaveUncertifiedProcessComments(params)) {
    return null;
  }

  const productStatus = Number(params.productStatus ?? 0);
  if (productStatus === 2) {
    return 'Process comments are read-only for certified products on this screen';
  }

  return PROCESS_COMMENTS_LOCKED_MESSAGE;
}
