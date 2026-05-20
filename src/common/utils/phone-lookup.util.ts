/** Strip to digits only for cross-format comparison. */
export function normalizePhoneDigits(mobile: string): string {
  return String(mobile ?? '').replace(/\D/g, '');
}

/** Common stored formats for the same mobile (e.g. +91…, digits-only). */
export function buildPhoneLookupVariants(mobile: string): string[] {
  const trimmed = String(mobile ?? '').trim();
  const digits = normalizePhoneDigits(trimmed);
  const variants = new Set<string>();
  if (trimmed) {
    variants.add(trimmed);
  }
  if (digits) {
    variants.add(digits);
    variants.add(`+${digits}`);
    if (digits.length === 10) {
      variants.add(`+91${digits}`);
      variants.add(`91${digits}`);
    }
    if (digits.length === 12 && digits.startsWith('91')) {
      const local = digits.slice(2);
      variants.add(local);
      variants.add(`+91${local}`);
    }
  }
  return [...variants];
}

/**
 * MongoDB $or clauses for a phone field: exact variants plus flexible match on
 * the last 10 digits (catches +91 / spaces vs vendor panel storage).
 */
export function buildPhoneFieldMatchClauses(
  fieldName: string,
  mobile: string,
): Record<string, unknown>[] {
  const clauses: Record<string, unknown>[] = [];
  const variants = buildPhoneLookupVariants(mobile);
  if (variants.length) {
    clauses.push({ [fieldName]: { $in: variants } });
  }
  const digits = normalizePhoneDigits(mobile);
  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    const flex = last10.split('').join('\\D*');
    clauses.push({
      [fieldName]: {
        $regex: new RegExp(`(^|\\+|\\d)${flex}\\s*$`, 'i'),
      },
    });
  }
  return clauses;
}