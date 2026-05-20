/** Strip zero-width / BOM chars that sometimes appear after admin copy/resend flows. */
function cleanUiString(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

/**
 * Maps vendor / admin UI values to stored enum `yes` | `no`.
 * Supports 1/0, 2 (some forms use 2 = No), booleans, common synonyms, and punctuation variants.
 */
export function normalizeRenewableEnergyUtilization(
  value: unknown,
): 'yes' | 'no' | undefined {
  if (value === undefined || value === null || value === '') return undefined;

  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no';
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return undefined;
    if (value === 1) return 'yes';
    if (value === 0 || value === 2) return 'no';
    return undefined;
  }

  const raw = cleanUiString(value);
  if (raw === '') return undefined;

  const normalized = raw.toLowerCase();

  if (
    normalized === '1' ||
    normalized === 'yes' ||
    normalized === 'true' ||
    normalized === 'y' ||
    normalized === 'on'
  ) {
    return 'yes';
  }
  if (
    normalized === '0' ||
    normalized === '2' ||
    normalized === '02' ||
    normalized === 'no' ||
    normalized === 'false' ||
    normalized === 'n' ||
    normalized === 'off' ||
    normalized === 'none'
  ) {
    return 'no';
  }

  const noPunct = normalized.replace(/[.:;,\s]+$/g, '');
  if (noPunct === 'no' || noPunct === 'n') return 'no';
  if (noPunct === 'yes' || noPunct === 'y') return 'yes';

  return undefined;
}
