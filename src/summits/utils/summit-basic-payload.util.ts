import type { UpdateSummitPayloadDto } from '../dto/summit-payload.dto';

export type SummitBasicInput = NonNullable<UpdateSummitPayloadDto['basic']>;

const BASIC_KEYS = [
  'year',
  'title',
  'slug',
  'date',
  'location',
  'status',
] as const;

/**
 * Accepts flat `{ year, title, ... }` or nested `{ basic: { year, ... } }`
 * (admin section save and some full PATCH clients).
 */
export function normalizeSummitBasicInput(
  body: unknown,
): SummitBasicInput | undefined {
  if (!body || typeof body !== 'object') return undefined;

  const root = body as Record<string, unknown>;
  const nested =
    root.basic && typeof root.basic === 'object' && !Array.isArray(root.basic)
      ? (root.basic as Record<string, unknown>)
      : undefined;

  const merged: SummitBasicInput = {};
  for (const key of BASIC_KEYS) {
    const value = nested?.[key] ?? root[key];
    if (value !== undefined && value !== null && value !== '') {
      (merged as Record<string, unknown>)[key] = value;
    }
  }

  return Object.keys(merged).length > 0 ? merged : undefined;
}
