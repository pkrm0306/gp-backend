/**
 * Shared URL slug helpers for public website entities
 * (categories, manufacturers, certified/ecolabelled products).
 *
 * Rules: lowercase kebab-case; strip quotes; non-alphanumeric → `-`;
 * uniqueness via `-2`, `-3`, … suffixes (never Mongo ObjectIds).
 */

export function slugifyPublicName(raw: string): string {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/['"`´''""]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Public URL slug: lowercase kebab segments, min length 1. */
export function isValidPublicSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(slug ?? '').trim());
}

/**
 * Collision suffix: base, base-2, base-3, … (attempt 1 = base).
 */
export function collisionSlug(base: string, attempt: number): string {
  const normalized = slugifyPublicName(base) || 'item';
  if (attempt <= 1) {
    return normalized;
  }
  return `${normalized}-${attempt}`;
}

/**
 * Allocate a globally unique slug for an entity type.
 * `isTaken` should return true when another document already uses the candidate.
 */
export async function allocateUniqueSlug(
  name: string,
  isTaken: (slug: string) => Promise<boolean>,
  options?: { fallback?: string; maxAttempts?: number },
): Promise<string> {
  const fallback = options?.fallback ?? 'item';
  const maxAttempts = options?.maxAttempts ?? 10_000;
  const base = slugifyPublicName(name) || slugifyPublicName(fallback) || 'item';

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const candidate = collisionSlug(base, attempt);
    if (!(await isTaken(candidate))) {
      return candidate;
    }
  }

  throw new Error(`Unable to allocate unique slug for "${base}"`);
}
