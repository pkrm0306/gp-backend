/**
 * MongoDB filters for non–soft-deleted Product / ProductPlant records.
 * Treats missing flags as active for backward compatibility with legacy rows.
 */
export const ACTIVE_PRODUCT_FILTER = {
  $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
} as const;

export const ACTIVE_PRODUCT_PLANT_FILTER = {
  $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
} as const;

/** Merge additional match criteria with the active-product predicate. */
export function matchActiveProducts(
  criteria: Record<string, unknown> = {},
): Record<string, unknown> {
  return { ...criteria, ...ACTIVE_PRODUCT_FILTER };
}

export function matchActiveProductPlants(
  criteria: Record<string, unknown> = {},
): Record<string, unknown> {
  return { ...criteria, ...ACTIVE_PRODUCT_PLANT_FILTER };
}
