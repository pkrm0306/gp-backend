/** Admin renewal section review: `0` pending, `1` approved, `2` rejected */
export const RENEW_TAB_REVIEW_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
} as const;

/** Vendor may re-edit rejected tabs only. */
export const RENEW_VENDOR_RESUBMIT_URN_STATUS = 16;

/** Admin section review enabled. */
export const RENEW_ADMIN_REVIEW_URN_STATUS = 15;

export const RENEW_PROCESS_TAB_REVIEW_KEYS = [
  'product-performance',
  'manufacturing-process',
  'waste-management',
  'innovation',
] as const;

export type RenewProcessTabReviewKey =
  (typeof RENEW_PROCESS_TAB_REVIEW_KEYS)[number];

export const RENEW_PROCESS_TAB_LABELS: Record<RenewProcessTabReviewKey, string> =
  {
    'product-performance': 'Product Performance',
    'manufacturing-process': 'Manufacturing Process',
    'waste-management': 'Waste Management',
    innovation: 'Innovation',
  };

export const RENEW_PROCESS_TAB_STEP_ID = 0;

export function isRenewProcessTabKey(tabKey: string): tabKey is RenewProcessTabReviewKey {
  return (RENEW_PROCESS_TAB_REVIEW_KEYS as readonly string[]).includes(tabKey);
}

export function buildRenewRequiredReviewSlots() {
  return RENEW_PROCESS_TAB_REVIEW_KEYS.map((tabKey) => ({
    tabKey,
    stepId: null as number | null,
    label: RENEW_PROCESS_TAB_LABELS[tabKey],
  }));
}
