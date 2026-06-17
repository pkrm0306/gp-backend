import { CRON_TIMEZONE } from '../../cron/utils/cron-date.util';

export type AdminListValidTillMonthYearFilter =
  | { kind: 'single'; yearMonth: string }
  | { kind: 'range'; from?: string; to?: string };

const YEAR_MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;
const YEAR_MONTH_DAY_RE = /^(\d{4})-(0[1-9]|1[0-2])-\d{2}/;

/** Normalize filter input to `YYYY-MM` (business calendar in Asia/Kolkata). */
export function normalizeAdminListFilterYearMonth(value: unknown): string | null {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return null;
  }
  const yearMonth = YEAR_MONTH_RE.exec(trimmed);
  if (yearMonth) {
    return yearMonth[0];
  }
  const yearMonthDay = YEAR_MONTH_DAY_RE.exec(trimmed);
  if (yearMonthDay) {
    return `${yearMonthDay[1]}-${yearMonthDay[2]}`;
  }
  const d = new Date(trimmed.includes('T') ? trimmed : `${trimmed}T12:00:00.000Z`);
  if (!Number.isFinite(d.getTime())) {
    return null;
  }
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CRON_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(d);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  return year && month ? `${year}-${month}` : null;
}

export function buildYearMonthFromParts(
  year: unknown,
  month: unknown,
): string | null {
  const y = Number(year);
  const m = Number(month);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) {
    return null;
  }
  return `${y}-${String(m).padStart(2, '0')}`;
}

export function resolveAdminListValidTillMonthYearFilter(input: {
  validTillMonthYear?: string;
  valid_till_month_year?: string;
  validTillDate?: string;
  validTill?: string;
  valid_till?: string;
  valid_till_date?: string;
  validtillDate?: string;
  validtill_date?: string;
  validTillMonth?: number;
  valid_till_month?: number;
  validTillYear?: number;
  valid_till_year?: number;
  validTillFrom?: string;
  valid_till_from?: string;
  validTillTo?: string;
  valid_till_to?: string;
}): AdminListValidTillMonthYearFilter | null {
  const fromRaw = input.validTillFrom ?? input.valid_till_from;
  const toRaw = input.validTillTo ?? input.valid_till_to;

  if (fromRaw || toRaw) {
    const from = fromRaw ? normalizeAdminListFilterYearMonth(fromRaw) : undefined;
    const to = toRaw ? normalizeAdminListFilterYearMonth(toRaw) : undefined;
    if (!from && !to) {
      return null;
    }
    return { kind: 'range', from, to };
  }

  const singleRaw = [
    input.validTillMonthYear,
    input.valid_till_month_year,
    input.validTillDate,
    input.validTill,
    input.valid_till,
    input.valid_till_date,
    input.validtillDate,
    input.validtill_date,
  ]
    .map((value) => (value != null ? String(value).trim() : ''))
    .find((text) => text.length > 0);

  if (singleRaw) {
    const yearMonth = normalizeAdminListFilterYearMonth(singleRaw);
    if (yearMonth) {
      return { kind: 'single', yearMonth };
    }
  }

  const month = input.validTillMonth ?? input.valid_till_month;
  const year = input.validTillYear ?? input.valid_till_year;
  if (month != null) {
    const yearMonth = buildYearMonthFromParts(year, month);
    if (yearMonth) {
      return { kind: 'single', yearMonth };
    }
  }

  return null;
}

/** @deprecated Use resolveAdminListValidTillMonthYearFilter */
export const resolveAdminListValidTillCalendarFilter =
  resolveAdminListValidTillMonthYearFilter;

function validTillYearMonthStringExpr(timeZone: string) {
  return {
    $dateToString: {
      format: '%Y-%m',
      date: '$validtillDate',
      timezone: timeZone,
    },
  };
}

/** Mongo `$expr` matching valid-till by calendar month+year in the business timezone. */
export function buildValidTillMonthYearExpr(
  filter: AdminListValidTillMonthYearFilter,
  timeZone = CRON_TIMEZONE,
): Record<string, unknown> {
  const yearMonthStr = validTillYearMonthStringExpr(timeZone);
  const base = [{ $ne: ['$validtillDate', null] }];

  if (filter.kind === 'single') {
    return { $and: [...base, { $eq: [yearMonthStr, filter.yearMonth] }] };
  }

  const conditions: Record<string, unknown>[] = [...base];
  if (filter.from) {
    conditions.push({ $gte: [yearMonthStr, filter.from] });
  }
  if (filter.to) {
    conditions.push({ $lte: [yearMonthStr, filter.to] });
  }
  return { $and: conditions };
}

/** @deprecated Use buildValidTillMonthYearExpr */
export const buildValidTillCalendarExpr = buildValidTillMonthYearExpr;

export function buildValidTillYearsExpr(
  years: number[],
  timeZone = CRON_TIMEZONE,
): Record<string, unknown> {
  return {
    $and: [
      { $ne: ['$validtillDate', null] },
      {
        $in: [{ $year: { date: '$validtillDate', timezone: timeZone } }, years],
      },
    ],
  };
}

export function mergeMongoExpr(
  nativeMatch: Record<string, unknown>,
  expr: Record<string, unknown>,
): void {
  const existing = nativeMatch.$expr as Record<string, unknown> | undefined;
  if (!existing) {
    nativeMatch.$expr = expr;
    return;
  }
  if (existing.$and && Array.isArray(existing.$and)) {
    const add = expr.$and && Array.isArray(expr.$and) ? expr.$and : [expr];
    nativeMatch.$expr = { $and: [...existing.$and, ...add] };
    return;
  }
  const add = expr.$and && Array.isArray(expr.$and) ? expr.$and : [expr];
  nativeMatch.$expr = { $and: [existing, ...add] };
}
