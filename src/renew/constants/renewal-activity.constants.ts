export const RENEWAL_ACTIVITY = {
  CYCLE_STARTED: 'Renewal payment cycle started',
  PAYMENT_SUBMITTED: 'Vendor submitted renewal payment',
  PAYMENT_APPROVED: 'Renewal payment approved by admin',
  PROCESS_FORMS_IN_PROGRESS: 'Renewal process forms in progress',
  PROCESS_FORMS_SUBMITTED: 'Renewal process forms submitted for review',
  RENEWAL_COMPLETED: 'Product renewal completed',
  PAYMENT_REJECTED: 'Renewal payment rejected by admin',
} as const;

export const RENEWAL_NEXT_ACTIVITY = {
  VENDOR_SUBMIT_PAYMENT: 'Vendor submits renewal payment proof',
  ADMIN_APPROVE_PAYMENT: 'Admin approves renewal payment',
  VENDOR_COMPLETE_FORMS: 'Vendor completes renewal process forms',
  ADMIN_REVIEW_FORMS: 'Admin reviews renewal process forms',
  ADMIN_FINAL_VERIFICATION: 'Admin final verification',
  CERTIFICATE_PUBLISHED: 'Certificate published',
} as const;
