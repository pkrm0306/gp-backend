/** Earliest year offered in summit basic-info year dropdowns. */
export const SUMMIT_YEAR_MIN = 2019;

/** Year dropdown options for summit basic info (newest first). */
export function getSummitYearOptions(
  now = new Date(),
  futureCount = 2,
): Array<{ value: string; label: string }> {
  const current = now.getFullYear();
  const years: number[] = [];
  for (let y = current + futureCount; y >= SUMMIT_YEAR_MIN; y--) {
    years.push(y);
  }
  return years.map((y) => ({ value: String(y), label: String(y) }));
}

export function isValidSummitYear(year: string): boolean {
  return /^(19|20)\d{2}$/.test(String(year).trim());
}
