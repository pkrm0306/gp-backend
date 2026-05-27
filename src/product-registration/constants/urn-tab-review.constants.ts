/** Admin review: `0` = pending, `1` = approved, `2` = rejected */
export const URN_TAB_REVIEW_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
} as const;

/** Admin sent URN back to vendor for corrections — vendor may edit rejected tabs only. */
export const VENDOR_RESUBMIT_URN_STATUS = 5;

/** Admin review in progress — vendor process tabs locked. */
export const ADMIN_REVIEW_URN_STATUS = 4;

export const RAW_MATERIALS_TAB_KEY = 'raw-materials';

export const PROCESS_TAB_REVIEW_KEYS = [
  'product-design',
  'product-performance',
  'manufacturing-process',
  'waste-management',
  'life-cycle-approach',
  'product-stewardship',
  'innovation',
] as const;

export type ProcessTabReviewKey = (typeof PROCESS_TAB_REVIEW_KEYS)[number];

/** Stored `stepId` for process tabs (API omits or sends null). */
export const PROCESS_TAB_STEP_ID = 0;

export const RAW_MATERIAL_STEP_TITLES: Record<number, string> = {
  1: 'Elimination of Hazardous Substances',
  2: 'Recycled Content',
  3: 'Regional Materials',
  4: 'Rapidly Renewable Materials',
  5: 'Green Supply Chain Management',
  6: 'Elimination of Formaldehyde',
  7: 'Recovery',
  8: 'Elimination of Ozone Depleting / Global Warming Substances',
  9: 'Elimination of Prohibited Flame Retardants',
  10: 'Elimination of Prohibited Flame Solvents',
  11: 'Reduce Environmental Impacts',
  12: 'Utilization of Alternative Raw Materials',
  13: 'Optimization of Raw Mix',
  14: 'Additives',
  15: 'Utilization RMC Alternative Raw Materials',
};

export const PROCESS_TAB_LABELS: Record<ProcessTabReviewKey, string> = {
  'product-design': 'Product Design',
  'product-performance': 'Product Performance',
  'manufacturing-process': 'Manufacturing Process',
  'waste-management': 'Waste Management',
  'life-cycle-approach': 'Life Cycle Approach',
  'product-stewardship': 'Product Stewardship',
  innovation: 'Innovation',
};
