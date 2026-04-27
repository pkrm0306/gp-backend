export enum DocumentSectionKey {
  PRODUCT_DESIGN = 'product_design',
  PRODUCT_PERFORMANCE = 'product_performance',
  RAW_MATERIALS_HAZARDOUS_PRODUCTS = 'raw_materials_hazardous_products',
  RAW_MATERIALS_RECYCLED_CONTENT = 'raw_materials_recycled_content',
  RAW_MATERIALS_REGIONAL_MATERIALS = 'raw_materials_regional_materials',
  RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS = 'raw_materials_rapidly_renewable_materials',
  RAW_MATERIALS_UTILIZATION = 'raw_materials_utilization',
  RAW_MATERIALS_GREEN_SUPPLY = 'raw_materials_green_supply',
  RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE = 'raw_materials_elimination_of_formaldehyde',
  RAW_MATERIALS_RECOVERY = 'raw_materials_recovery',
  RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES = 'raw_materials_elimination_of_ozone_depleting_global_warming_substances',
  RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME = 'raw_materials_elimination_of_prohibited_flame',
  RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS = 'raw_materials_elimination_of_prohibited_flame_solvents',
  RAW_MATERIALS_REDUCE_ENVIROMENTAL = 'raw_materials_reduce_enviromental',
  RAW_MATERIALS_REDUCE_ENVIRONMENTAL = 'raw_materials_reduce_environmental',
  RAW_MATERIALS_ALTERNATIVE_RAW_MATERIALS = 'raw_materials_alternative_raw_materials',
  RAW_MATERIALS_RAW_MIX_OPTIMIZATION = 'raw_materials_raw_mix_optimization',
  RAW_MATERIALS_ADDITIVES = 'raw_materials_additives',
  RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS = 'raw_materials_rmc_alternative_raw_materials',
  PROCESS_MANUFACTURING = 'process_manufacturing',
  PROCESS_WASTE_MANAGEMENT = 'process_waste_management',
  PROCESS_LIFE_CYCLE_APPROACH = 'process_life_cycle_approach',
  PROCESS_PRODUCT_STEWARDSHIP = 'process_product_stewardship',
  PROCESS_INNOVATION = 'process_innovation',
}

export const DOCUMENT_SECTION_KEY_VALUES = Object.values(DocumentSectionKey);

export const DOCUMENT_SECTION_KEY_ALIASES: Record<string, string> = {
  [DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL]:
    DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
};

export const ACCEPTED_DOCUMENT_SECTION_KEYS = [
  ...DOCUMENT_SECTION_KEY_VALUES,
  ...Object.keys(DOCUMENT_SECTION_KEY_ALIASES),
];

export function normalizeDocumentSectionKey(sectionKey: string): string {
  const key = sectionKey?.trim();
  if (!key) {
    return '';
  }

  return DOCUMENT_SECTION_KEY_ALIASES[key] || key;
}
