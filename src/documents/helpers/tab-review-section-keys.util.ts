import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';
import { RAW_MATERIALS_TAB_KEY } from '../../product-registration/constants/urn-tab-review.constants';

/** Admin process tabKey → document stream sectionKey(s). */
const PROCESS_TAB_TO_SECTION_KEYS: Record<string, string[]> = {
  'product-design': [DocumentSectionKey.PRODUCT_DESIGN],
  'product-performance': [DocumentSectionKey.PRODUCT_PERFORMANCE],
  'manufacturing-process': [DocumentSectionKey.PROCESS_MANUFACTURING],
  'waste-management': [DocumentSectionKey.PROCESS_WASTE_MANAGEMENT],
  'life-cycle-approach': [DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH],
  'product-stewardship': [DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP],
  innovation: [DocumentSectionKey.PROCESS_INNOVATION],
};

/** Raw-materials stepId → documentForm / sectionKey values used on streams. */
const RAW_MATERIAL_STEP_TO_SECTION_KEYS: Record<number, string[]> = {
  1: [DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS],
  2: [DocumentSectionKey.RAW_MATERIALS_RECYCLED_CONTENT],
  3: [DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS],
  4: [DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS],
  5: [DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY],
  6: [DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE],
  7: [DocumentSectionKey.RAW_MATERIALS_RECOVERY],
  8: [
    DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES,
  ],
  9: [DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME],
  10: [
    DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
    DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS,
  ],
  11: [
    DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
    DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL,
  ],
  12: [
    DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
    DocumentSectionKey.RAW_MATERIALS_ALTERNATIVE_RAW_MATERIALS,
  ],
  13: [DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION],
  14: [DocumentSectionKey.RAW_MATERIALS_ADDITIVES],
  15: [
    DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
    'raw_materials_utilization_rmc',
  ],
};

/**
 * Resolve document stream sectionKey values affected by an admin tab/step reject or resend.
 */
export function sectionKeysForTabReviewSlot(
  tabKey: string,
  stepId?: number | null,
): string[] {
  const key = String(tabKey ?? '').trim();
  if (key === RAW_MATERIALS_TAB_KEY) {
    const step = Number(stepId);
    if (!Number.isFinite(step) || step < 1 || step > 15) {
      return [];
    }
    return RAW_MATERIAL_STEP_TO_SECTION_KEYS[step] ?? [];
  }
  return PROCESS_TAB_TO_SECTION_KEYS[key] ?? [];
}

/** All renew process section keys (renew form set). */
export function renewProcessSectionKeys(): string[] {
  return [
    DocumentSectionKey.PRODUCT_PERFORMANCE,
    DocumentSectionKey.PROCESS_MANUFACTURING,
    DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
    DocumentSectionKey.PROCESS_INNOVATION,
  ];
}
