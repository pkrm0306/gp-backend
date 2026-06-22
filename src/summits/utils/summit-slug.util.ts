export function slugifySummitInput(raw: string): string {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidSummitSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 2;
}

/**
 * Server-generated summit URL slug (admin no longer sends slug).
 * Includes calendar year so different years with the same title stay unique.
 */
export function buildSummitSlug(title: string, year?: string): string {
  const base = slugifySummitInput(title);
  const normalizedYear = String(year ?? '').trim();
  if (!normalizedYear) {
    return base;
  }
  if (base === normalizedYear || base.endsWith(`-${normalizedYear}`)) {
    return base;
  }
  return `${base}-${normalizedYear}`;
}
