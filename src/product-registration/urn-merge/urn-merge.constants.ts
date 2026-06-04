/** Mongo collection names re-keyed during URN merge (certification scope, not renew). */

/** One logical row per URN (or per urnNo+vendorId); target wins if both exist. */
export const URN_MERGE_SINGLETON_COLLECTIONS: readonly {
  collection: string;
  scopeVendor: boolean;
}[] = [
  { collection: 'process_product_design', scopeVendor: true },
  { collection: 'process_product_performance', scopeVendor: true },
  { collection: 'process_manufacturing', scopeVendor: false },
  { collection: 'process_waste_management', scopeVendor: false },
  { collection: 'process_life_cycle_approach', scopeVendor: false },
  { collection: 'process_product_stewardship', scopeVendor: false },
  { collection: 'process_innovation', scopeVendor: false },
  { collection: 'process_comments', scopeVendor: false },
] as const;

/** Multiple rows per URN — always re-key source rows to target. */
export const URN_MERGE_MULTI_ROW_COLLECTIONS: readonly string[] = [
  'process_mp_manufacturing_units',
  'process_wm_manufacturing_units',
  'process_pp_test_reports',
  'process_pd_measures',
  'process_ps_stakeholder_edu_awarness',
  'raw_materials_hazardous',
  'raw_materials_hazardous_products',
  'raw_materials_additives',
  'raw_materials_recycled_content',
  'raw_materials_regional_materials',
  'raw_materials_rapidly_renewable_materials',
  'raw_materials_recovery',
  'raw_materials_reduce_environmental',
  'raw_materials_green_supply',
  'raw_materials_optimization_of_raw_mix',
  'raw_materials_elimination_of_formaldehyde',
  'raw_materials_utilization',
  'raw_materials_utilization_manufacturing_units',
  'raw_materials_utilization_rmc',
  'raw_materials_elimination_of_prohibited_flame',
  'raw_materials_elimination_of_prohibited_flame_solvents',
  'raw_materials_elimination_of_prohibited_flame_solvents_products',
] as const;

export const URN_MERGE_STRATEGY_FILL_GAPS = 'fill_gaps_keep_target' as const;

export type UrnMergeBlockerCode =
  | 'SAME_URN'
  | 'SOURCE_URN_NOT_FOUND'
  | 'TARGET_URN_NOT_FOUND'
  | 'NO_CERTIFIED_ON_SOURCE'
  | 'NO_CERTIFIED_ON_TARGET'
  | 'CATEGORY_MISMATCH'
  | 'VENDOR_MISMATCH'
  | 'MANUFACTURER_MISMATCH'
  | 'RENEWAL_URN_STATUS_ACTIVE'
  | 'PRODUCT_RENEW_IN_PROGRESS'
  | 'RENEWAL_CYCLE_IN_PROGRESS'
  | 'EOI_COLLISION'
  | 'NO_PRODUCTS_SELECTED'
  | 'UNSUPPORTED_STRATEGY';
