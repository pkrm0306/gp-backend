/**
 * Canonical audit action names. Prefer adding here instead of string literals.
 * HTTP mutations default to HTTP_MUTATION unless a route-specific mapping applies.
 */
export const AUDIT_ACTION = {
  HTTP_MUTATION: 'HTTP_MUTATION',
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_REFRESH: 'AUTH_REFRESH',
  AUTH_REGISTER_VENDOR: 'AUTH_REGISTER_VENDOR',
  AUTH_VERIFY_OTP: 'AUTH_VERIFY_OTP',
  AUTH_FORGOT_PASSWORD: 'AUTH_FORGOT_PASSWORD',
  PAYMENT_CREATED: 'PAYMENT_CREATED',
  PAYMENT_UPDATED: 'PAYMENT_UPDATED',
  PRODUCT_URN_STATUS_UPDATED: 'PRODUCT_URN_STATUS_UPDATED',
  EXPIRED_REACTIVATE_PRODUCT: 'expired_reactivate_product',
  EXPIRED_REACTIVATE_URN: 'expired_reactivate_urn',
  REJECTED_RESTORE_PRODUCT: 'rejected_restore_product',
  REJECTED_RESTORE_URN: 'rejected_restore_urn',
  EOI_REASSIGNED_ON_RESTORE: 'eoi_reassigned_on_restore',
  PRODUCT_DISCONTINUED: 'product_discontinued',
  ADMIN_ADD_PRODUCT_TO_URN: 'admin_add_product_to_urn',
  CERTIFIED_REJECT_PRODUCT: 'certified_reject_product',
  ACTIVITY_LOG_CREATED: 'ACTIVITY_LOG_CREATED',
  RAW_MATERIALS_DELETED: 'RAW_MATERIALS_DELETED',
} as const;

export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];
