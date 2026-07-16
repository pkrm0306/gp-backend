/**
 * Standardized audit instant formatting for API responses.
 * Storage retains BSON Date / ISO strings as written; presentation uses this helper.
 */

/** Display timezone for GreenPro admin audit surfaces (India). */
export const AUDIT_DISPLAY_TIME_ZONE = 'Asia/Kolkata';

export function formatAuditInstant(value: unknown): string | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? trimmed : parsed.toISOString();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }
  return null;
}

/**
 * User-facing date/time for audit value snapshots (en-IN, consistent across modules).
 * Date-only midnights (e.g. validtillDate) omit the time component.
 * Top-level `occurred_at` stays ISO via {@link formatAuditInstant} for API compatibility.
 */
export function formatAuditDisplayDateTime(value: unknown): string | null {
  const iso = formatAuditInstant(value);
  if (!iso || !/^\d{4}-\d{2}-\d{2}T/.test(iso)) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const isUtcMidnight =
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0;

  if (isUtcMidnight) {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: AUDIT_DISPLAY_TIME_ZONE,
  }).format(date);
}

/** True when a snapshot key represents a date/time field suitable for display formatting. */
export function isAuditDateFieldKey(key: string): boolean {
  const normalized = key
    .replace(/\[\]$/g, '')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();
  if (!normalized) {
    return false;
  }
  if (
    normalized === 'validtill' ||
    normalized.includes('validtill') ||
    normalized.includes('notifydate')
  ) {
    return true;
  }
  return (
    normalized.endsWith('date') ||
    normalized.endsWith('datetime') ||
    normalized.endsWith('timestamp') ||
    normalized.endsWith('at')
  );
}

/** Parse query range bounds while preserving existing month-back default semantics. */
export function resolveAuditQueryRange(params: {
  from?: string;
  to?: string;
}): { from: Date; to: Date } {
  const to = params.to ? new Date(params.to) : new Date();
  const from = params.from ? new Date(params.from) : new Date(to);
  if (!params.from) {
    from.setMonth(from.getMonth() - 1);
  }
  return { from, to };
}
