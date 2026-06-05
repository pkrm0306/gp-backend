import { Types } from 'mongoose';

export const PRODUCT_NAME_ALREADY_EXISTS_MESSAGE =
  'Product Name already exists. Please enter a unique Product Name.';

/** Trim and collapse internal whitespace for stable comparisons. */
export function normalizeProductNameForComparison(name: unknown): string {
  return String(name ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Case-insensitive exact match filter for MongoDB `productName` / `requestedName`. */
export function productNameEqualsFilter(
  name: unknown,
): { $regex: string; $options: string } | null {
  const normalized = normalizeProductNameForComparison(name);
  if (!normalized) {
    return null;
  }
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return { $regex: `^${escaped}$`, $options: 'i' };
}

export type ProductNameConflictOptions = {
  excludeProductId?: Types.ObjectId | string | null;
};
