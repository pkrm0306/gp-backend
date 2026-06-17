import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';
import { PRODUCT_STATUS_CERTIFIED } from '../../renew/constants/product-status.constants';
import { isRenewalUrnStatus } from '../../renew/constants/renewal-urn-status.constants';
import {
  CATEGORY_CHANGE_CERTIFIED_MESSAGE,
  CATEGORY_CHANGE_LOCKED_MESSAGE,
  CATEGORY_CHANGE_LOCKED_MIN_URN_STATUS,
  CATEGORY_CHANGE_RENEWAL_MESSAGE,
} from '../constants/category-change.constants';
import { parseVisibleRawMaterialSteps } from './urn-tab-review.util';

export type RawMaterialStepPurgeTarget = {
  collections: readonly string[];
  documentForms: readonly string[];
};

/** Raw materials review steps 1–15 → Mongo collections + document section keys. */
export const RAW_MATERIAL_STEP_PURGE_TARGETS: Record<
  number,
  RawMaterialStepPurgeTarget
> = {
  1: {
    collections: ['raw_materials_hazardous', 'raw_materials_hazardous_products'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS],
  },
  2: {
    collections: ['raw_materials_recycled_content'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_RECYCLED_CONTENT],
  },
  3: {
    collections: ['raw_materials_regional_materials'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS],
  },
  4: {
    collections: ['raw_materials_rapidly_renewable_materials'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS],
  },
  5: {
    collections: ['raw_materials_green_supply'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY],
  },
  6: {
    collections: ['raw_materials_elimination_of_formaldehyde'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE],
  },
  7: {
    collections: ['raw_materials_recovery'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_RECOVERY],
  },
  8: {
    collections: [],
    documentForms: [
      DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES,
    ],
  },
  9: {
    collections: ['raw_materials_elimination_of_prohibited_flame'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME],
  },
  10: {
    collections: [
      'raw_materials_elimination_of_prohibited_flame_solvents',
      'raw_materials_elimination_of_prohibited_flame_solvents_products',
    ],
    documentForms: [
      DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
      DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS,
    ],
  },
  11: {
    collections: ['raw_materials_reduce_environmental'],
    documentForms: [
      DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
      DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL,
    ],
  },
  12: {
    collections: [
      'raw_materials_utilization',
      'raw_materials_utilization_manufacturing_units',
    ],
    documentForms: [
      DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
      DocumentSectionKey.RAW_MATERIALS_ALTERNATIVE_RAW_MATERIALS,
    ],
  },
  13: {
    collections: ['raw_materials_optimization_of_raw_mix'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION],
  },
  14: {
    collections: ['raw_materials_additives'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_ADDITIVES],
  },
  15: {
    collections: ['raw_materials_utilization_rmc'],
    documentForms: [DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS],
  },
};

export const ALL_RAW_MATERIAL_STEP_IDS = Array.from(
  { length: 15 },
  (_, index) => index + 1,
);

export function categoryObjectIdsEqual(
  left: unknown,
  right: unknown,
): boolean {
  const a = left == null ? '' : String(left).trim();
  const b = right == null ? '' : String(right).trim();
  if (!a || !b) {
    return a === b;
  }
  return a === b;
}

export function resolveCategoryChangeBlockReason(params: {
  productStatus?: number | null;
  urnStatus?: number | null;
}): string | null {
  const productStatus = Number(params.productStatus ?? 0);
  const urnStatus = Number(params.urnStatus ?? 0);

  if (productStatus === PRODUCT_STATUS_CERTIFIED) {
    return CATEGORY_CHANGE_CERTIFIED_MESSAGE;
  }
  if (isRenewalUrnStatus(urnStatus)) {
    return CATEGORY_CHANGE_RENEWAL_MESSAGE;
  }
  if (urnStatus >= CATEGORY_CHANGE_LOCKED_MIN_URN_STATUS) {
    return CATEGORY_CHANGE_LOCKED_MESSAGE;
  }
  return null;
}

/** Highest workflow step on the URN — used to lock category after admin final submit. */
export function maxUrnStatusForCategoryLock(urnStatuses: number[]): number {
  if (!urnStatuses.length) {
    return 0;
  }
  return Math.max(...urnStatuses.map((status) => Number(status ?? 0)));
}

/**
 * Category edit eligibility for a URN (all EOIs share one lock once any row hits final submit).
 */
export function resolveCategoryChangeBlockReasonForUrn(params: {
  productStatus?: number | null;
  urnStatuses: number[];
  anyProductCertified?: boolean;
}): string | null {
  if (
    params.anyProductCertified ||
    Number(params.productStatus ?? 0) === PRODUCT_STATUS_CERTIFIED
  ) {
    return CATEGORY_CHANGE_CERTIFIED_MESSAGE;
  }
  const urnStatus = maxUrnStatusForCategoryLock(params.urnStatuses);
  return resolveCategoryChangeBlockReason({
    productStatus: params.productStatus,
    urnStatus,
  });
}

export function isProductCategoryEditableForUrn(params: {
  productStatus?: number | null;
  urnStatuses: number[];
  anyProductCertified?: boolean;
}): boolean {
  return resolveCategoryChangeBlockReasonForUrn(params) == null;
}

export function isProductCategoryEditable(params: {
  productStatus?: number | null;
  urnStatus?: number | null;
}): boolean {
  return resolveCategoryChangeBlockReason(params) == null;
}

export function stepsToPurgeOnCategoryChange(
  previousCategoryRawMaterialForms: string | null | undefined,
  newCategoryRawMaterialForms: string | null | undefined,
): number[] {
  const previousVisible = visibleStepsForCategory(previousCategoryRawMaterialForms);
  const newVisibleSet = new Set(
    visibleStepsForCategory(newCategoryRawMaterialForms),
  );
  // Remove only criteria that applied to the old category but not the new one.
  return previousVisible.filter((stepId) => !newVisibleSet.has(stepId));
}

/** Raw material steps whose vendor data is kept when both categories include the step. */
export function retainedRawMaterialStepsOnCategoryChange(
  previousCategoryRawMaterialForms: string | null | undefined,
  newCategoryRawMaterialForms: string | null | undefined,
): number[] {
  const previousVisible = visibleStepsForCategory(previousCategoryRawMaterialForms);
  const newVisibleSet = new Set(
    visibleStepsForCategory(newCategoryRawMaterialForms),
  );
  return previousVisible.filter((stepId) => newVisibleSet.has(stepId));
}

/** New criteria in the target category that the vendor still needs to complete. */
export function addedRawMaterialStepsOnCategoryChange(
  previousCategoryRawMaterialForms: string | null | undefined,
  newCategoryRawMaterialForms: string | null | undefined,
): number[] {
  const newVisible = visibleStepsForCategory(newCategoryRawMaterialForms);
  const previousVisibleSet = new Set(
    visibleStepsForCategory(previousCategoryRawMaterialForms),
  );
  return newVisible.filter((stepId) => !previousVisibleSet.has(stepId));
}

export function visibleStepsForCategory(
  categoryRawMaterialForms?: string | null,
): number[] {
  return parseVisibleRawMaterialSteps(categoryRawMaterialForms);
}

/** Category payload for URN details — includes raw-material step visibility for vendor UI. */
export function formatCategoryWithRawMaterialVisibility(
  category: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!category) {
    return null;
  }
  const name =
    category.categoryName ?? category.category_name ?? null;
  const categoryRawMaterialForms = String(
    category.category_raw_material_forms ??
      category.categoryRawMaterialForms ??
      '',
  ).trim();
  return {
    _id: category._id,
    categoryId: category._id,
    categoryName: name,
    category_name: name,
    sector: category.sector ?? null,
    category_raw_material_forms: categoryRawMaterialForms || null,
    visibleRawMaterialSteps: visibleStepsForCategory(
      categoryRawMaterialForms || null,
    ),
  };
}
