import type { SummitStatus } from '../constants/summit.constants';

/** API + UI values */
export const SUMMIT_STATUS_LABELS: Record<SummitStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

/** Normalize stored/API values (supports legacy draft / published). */
export function normalizeSummitStatus(raw: unknown): SummitStatus {
  const s = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (s === 'active' || s === 'published') return 'active';
  if (s === 'inactive' || s === 'draft') return 'inactive';
  return 'inactive';
}

export function isSummitActiveStatus(raw: unknown): boolean {
  return normalizeSummitStatus(raw) === 'active';
}

/** Mongo filter for list/public when UI sends active | inactive. */
export function summitStatusDbMatch(
  status: SummitStatus,
): { status: SummitStatus } | { status: { $in: string[] } } {
  if (status === 'active') {
    return { status: { $in: ['active', 'published'] } };
  }
  return { status: { $in: ['inactive', 'draft'] } };
}
