type UrnDetailRow = Record<string, unknown>;

const SHARED_URN_OBJECT_KEYS = [
  'category',
  'manufacturer',
  'vendor',
  'product_design',
  'product_performance',
  'process_manufacturing',
  'process_waste_management',
  'process_life_cycle_approach',
  'process_product_stewardship',
  'process_innovation',
  'process_comments',
] as const;

const SHARED_URN_ARRAY_KEYS = [
  'plants',
  'payments',
  'product_design_measures',
  'product_design_documents',
  'product_performance_documents',
  'process_manufacturing_documents',
  'process_mp_manufacturing_units',
  'process_waste_management_documents',
  'process_wm_manufacturing_units',
  'process_life_cycle_approach_documents',
  'process_product_stewardship_documents',
  'process_innovation_documents',
  'raw_materials_hazardous_products',
  'raw_materials_hazardous_products_documents',
  'raw_materials_additives',
  'raw_materials_additives_documents',
  'raw_materials_recycled_content',
  'raw_materials_recycled_content_documents',
  'raw_materials_regional_materials',
  'raw_materials_regional_materials_documents',
  'raw_materials_rapidly_renewable_materials',
  'raw_materials_rapidly_renewable_materials_documents',
  'raw_materials_recovery',
  'raw_materials_recovery_documents',
  'raw_materials_elimination_of_ozone_depleting_global_warming_substances',
  'raw_materials_elimination_of_ozone_depleting_global_warming_substances_documents',
  'raw_materials_elimination_of_prohibited_flame',
  'raw_materials_elimination_of_prohibited_flame_documents',
  'raw_materials_elimination_of_prohibited_flame_solvents',
  'raw_materials_elimination_of_prohibited_flame_solvents_documents',
  'raw_materials_reduce_environmental',
  'raw_materials_reduce_environmental_documents',
  'raw_materials_green_supply',
  'raw_materials_green_supply_documents',
  'raw_materials_alternative_raw_materials',
  'raw_materials_alternative_raw_materials_documents',
  'raw_materials_raw_mix_optimization',
  'raw_materials_raw_mix_optimization_documents',
  'raw_materials_elimination_of_formaldehyde',
  'raw_materials_elimination_of_formaldehyde_documents',
  'raw_materials_utilization',
  'raw_materials_utilization_documents',
  'raw_materials_utilization_manufacturing_units',
  'raw_materials_utilization_rmc',
  'raw_materials_rmc_alternative_raw_materials_documents',
  'raw_materials_documents_bucket',
] as const;

function isEmptyValue(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as object).length === 0;
  return false;
}

function mergeObjectsPreferFilled(
  base: Record<string, unknown>,
  incoming: Record<string, unknown>,
): Record<string, unknown> {
  const merged = { ...base };
  for (const [key, value] of Object.entries(incoming)) {
    const current = merged[key];
    if (isEmptyValue(current) && !isEmptyValue(value)) {
      merged[key] = value;
      continue;
    }
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      current &&
      typeof current === 'object' &&
      !Array.isArray(current)
    ) {
      merged[key] = mergeObjectsPreferFilled(
        current as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    }
  }
  return merged;
}

function dedupeArrayByKey(arr: unknown[], keyFields: string[]): unknown[] {
  const seen = new Set<string>();
  const out: unknown[] = [];
  for (const entry of arr) {
    if (!entry || typeof entry !== 'object') continue;
    const key = keyFields
      .map((field) => String((entry as Record<string, unknown>)[field] ?? ''))
      .join('|');
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }
  return out;
}

function pickBestObject(rows: UrnDetailRow[], key: string): unknown {
  let best: unknown = null;
  for (const row of rows) {
    const value = row[key];
    if (isEmptyValue(value)) continue;
    if (isEmptyValue(best)) {
      best = value;
      continue;
    }
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      best &&
      typeof best === 'object' &&
      !Array.isArray(best)
    ) {
      best = mergeObjectsPreferFilled(
        best as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    }
  }
  return best;
}

function pickMergedArray(rows: UrnDetailRow[], key: string): unknown[] {
  const merged: unknown[] = [];
  for (const row of rows) {
    const value = row[key];
    if (!Array.isArray(value) || value.length === 0) continue;
    merged.push(...value);
  }
  if (key.includes('document')) {
    return dedupeArrayByKey(merged, [
      '_id',
      'productDocumentId',
      'documentLink',
      'documentName',
    ]);
  }
  return dedupeArrayByKey(merged, ['_id', 'processMpManufacturingUnitId', 'processWmManufacturingUnitId']);
}

/**
 * When multiple EOIs share one URN, copy shared process/category data onto every row
 * so vendor/admin clients always see saved form data after resend.
 */
export function enrichUrnDetailRowsWithSharedProcessData<T extends UrnDetailRow>(
  rows: T[],
): T[] {
  if (rows.length <= 1) return rows;

  const shared: UrnDetailRow = {};
  for (const key of SHARED_URN_OBJECT_KEYS) {
    const value = pickBestObject(rows, key);
    if (!isEmptyValue(value)) {
      shared[key] = value;
    }
  }
  for (const key of SHARED_URN_ARRAY_KEYS) {
    const value = pickMergedArray(rows, key);
    if (value.length > 0) {
      shared[key] = value;
    }
  }

  return rows.map((row) => {
    const next = { ...row } as UrnDetailRow;
    for (const [key, value] of Object.entries(shared)) {
      if (isEmptyValue(next[key])) {
        next[key] = value;
      } else if (
        Array.isArray(value) &&
        Array.isArray(next[key]) &&
        (next[key] as unknown[]).length < value.length
      ) {
        next[key] = value;
      } else if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        next[key] &&
        typeof next[key] === 'object' &&
        !Array.isArray(next[key])
      ) {
        next[key] = mergeObjectsPreferFilled(
          next[key] as Record<string, unknown>,
          value as Record<string, unknown>,
        );
      }
    }
    return next as T;
  });
}
