/** Coerce optional form/JSON values to a finite number (supports decimals). */
export function parseOptionalDecimalNumber(
  value: unknown,
): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  const n = Number(String(value).trim());
  return Number.isFinite(n) ? n : undefined;
}
