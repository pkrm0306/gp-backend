export const RENEWAL_URN_STATUS = {
  COMPLETED: 11,
  PAYMENT_PENDING: 12,
  PAYMENT_SUBMITTED: 13,
  PAYMENT_APPROVED: 14,
  CHECK_PROCESS_FORMS: 15,
  VENDOR_RESPONSE_PENDING: 16,
  FINAL_VERIFICATION_PENDING: 17,
} as const;

/** Valid `updateStatusTo` values for PATCH /renew/urn-status only. */
export const RENEWAL_URN_STATUS_ALLOWED_VALUES = [
  11, 12, 13, 14, 15, 16, 17,
] as const;

export const RENEWAL_URN_STATUS_LABELS: Record<number, string> = {
  11: 'Renewal Completed',
  12: 'Renewal Payment Pending',
  13: 'Renewal Payment Submitted',
  14: 'Renewal Payment Approved',
  15: 'Check Process Forms',
  16: 'Vendor Response Pending',
  17: 'Final Verification Pending',
};

export const PRODUCT_RENEW_STATUS = {
  NOT_RENEWED: 0,
  IN_PROGRESS: 1,
  RENEWED: 2,
} as const;

export function isRenewalUrnStatus(status: number): boolean {
  return status === RENEWAL_URN_STATUS.COMPLETED || (status >= 12 && status <= 17);
}

/** Vendor cannot edit renew process tabs when URN is in these statuses. */
export const RENEW_VENDOR_PROCESS_LOCK_STATUSES = new Set<number>([
  RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
  RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
  RENEWAL_URN_STATUS.COMPLETED,
]);

export function getRenewalUrnStatusLabel(status: number): string {
  return RENEWAL_URN_STATUS_LABELS[status] ?? `Unknown renewal status (${status})`;
}
