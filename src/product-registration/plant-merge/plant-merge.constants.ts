/** Mongo collection names reconciled when plants are merged (URN-level unit rows). */
export const PLANT_MERGE_MANUFACTURING_UNIT_COLLECTIONS: readonly string[] = [
  'process_mp_manufacturing_units',
  'process_wm_manufacturing_units',
  'raw_materials_utilization_manufacturing_units',
] as const;

export const PLANT_MERGE_STRATEGY_ABSORB = 'absorb_soft_delete_source' as const;

/** Copy source product plants onto a target product (URN-level merge). */
export const PLANT_MERGE_STRATEGY_URN_COPY = 'urn_copy_plants' as const;

export const PLANT_MERGE_STATUS = {
  COMPLETED: 'completed',
} as const;

export type PlantMergeBlockerCode =
  | 'PRODUCT_NOT_FOUND'
  | 'PRODUCT_NOT_CERTIFIED'
  | 'TARGET_PLANT_NOT_FOUND'
  | 'SOURCE_PLANTS_NOT_FOUND'
  | 'TARGET_IN_SOURCE_LIST'
  | 'SAME_PLANT'
  | 'MIN_PLANTS_REQUIRED'
  | 'NO_SOURCES_SELECTED'
  | 'RENEWAL_URN_STATUS_ACTIVE'
  | 'PRODUCT_RENEW_IN_PROGRESS'
  | 'RENEWAL_CYCLE_IN_PROGRESS'
  | 'PLANT_PRODUCT_MISMATCH'
  | 'UNSUPPORTED_STRATEGY'
  | 'INVALID_PRODUCT_ID'
  | 'INVALID_PLANT_ID';
