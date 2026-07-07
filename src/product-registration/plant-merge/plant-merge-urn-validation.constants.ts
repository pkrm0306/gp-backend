export const PLANT_MERGE_URN_VALIDATION_BLOCKER = {
  SAME_SOURCE_TARGET: 'SAME_SOURCE_TARGET',
  SOURCE_URN_NOT_CERTIFIED: 'SOURCE_URN_NOT_CERTIFIED',
  SOURCE_EOI_NOT_FOUND: 'SOURCE_EOI_NOT_FOUND',
  SOURCE_EOI_NOT_CERTIFIED: 'SOURCE_EOI_NOT_CERTIFIED',
  TARGET_EOI_NOT_FOUND: 'TARGET_EOI_NOT_FOUND',
  TARGET_NOT_CERTIFIED: 'TARGET_NOT_CERTIFIED',
  PRODUCT_NAME_MISMATCH: 'PRODUCT_NAME_MISMATCH',
  MANUFACTURER_MISMATCH: 'MANUFACTURER_MISMATCH',
  CATEGORY_MISMATCH: 'CATEGORY_MISMATCH',
  TARGET_NOT_OLDER: 'TARGET_NOT_OLDER',
  DUPLICATE_MERGE: 'DUPLICATE_MERGE',
} as const;

export type PlantMergeUrnValidationBlockerCode =
  (typeof PLANT_MERGE_URN_VALIDATION_BLOCKER)[keyof typeof PLANT_MERGE_URN_VALIDATION_BLOCKER];

export const PLANT_MERGE_URN_VALIDATION_MESSAGE = {
  SAME_SOURCE_TARGET:
    'Source and target must be different URNs (and different EOIs when on the same URN)',
  SOURCE_URN_NOT_CERTIFIED:
    'Source URN must have at least one certified product',
  SOURCE_EOI_NOT_FOUND:
    'Source EOI was not found on the source URN',
  SOURCE_EOI_NOT_CERTIFIED:
    'Source EOI must be certified before plant merge',
  TARGET_EOI_NOT_FOUND:
    'Target EOI was not found on the target URN',
  TARGET_NOT_CERTIFIED:
    'Target EOI must be certified before plant merge',
  PRODUCT_NAME_MISMATCH:
    'Product name on source and target must match exactly',
  MANUFACTURER_MISMATCH:
    'Source and target must belong to the same manufacturer',
  CATEGORY_MISMATCH:
    'Source and target must belong to the same category',
  TARGET_NOT_OLDER:
    'Target certified product must be older than the source certified product',
  DUPLICATE_MERGE:
    'This source EOI has already been merged into the selected target EOI',
} as const;
