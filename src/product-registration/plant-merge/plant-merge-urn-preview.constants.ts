export const PLANT_MERGE_URN_PREVIEW_STATUS = {
  READY: 'READY',
  NO_TARGET: 'NO_TARGET',
  BLOCKED: 'BLOCKED',
} as const;

export type PlantMergeUrnPreviewStatus =
  (typeof PLANT_MERGE_URN_PREVIEW_STATUS)[keyof typeof PLANT_MERGE_URN_PREVIEW_STATUS];

export const PLANT_MERGE_URN_PREVIEW_FAILURE = {
  NO_CERTIFIED_ON_SOURCE:
    'Source URN has no certified products to evaluate for plant merge targets',
  NO_MATCHING_TARGET:
    'No certified product found with the same product name, manufacturer, and category on another URN',
  SOURCE_NO_PLANTS:
    'Source EOI has no active manufacturing plants to copy',
  BRAND_NEW_PRODUCT:
    'Source product is newer than any matching certified product on another URN',
} as const;
