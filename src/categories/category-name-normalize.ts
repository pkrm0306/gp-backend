/** Trim, collapse internal whitespace to single spaces (display-safe). */
export function formatCategoryDisplayName(name: string): string {
  return String(name ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Same rules as display, then lowercase — used for global uniqueness. */
export function normalizeCategoryNameKey(name: string): string {
  return formatCategoryDisplayName(name).toLowerCase();
}
