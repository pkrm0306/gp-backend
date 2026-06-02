import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import type { DashboardMetricsQueryDto } from '../dto/dashboard-metrics-query.dto';
import type { AppliedDashboardFilters } from '../admin-dashboard-metrics.types';

export type DashboardGranularity = 'monthly' | 'weekly' | 'quarterly';

export interface DashboardDateRange {
  from: Date;
  to: Date;
}

export interface ResolvedDashboardFilters {
  dateRange?: DashboardDateRange;
  granularity: DashboardGranularity;
  categoryObjectId?: Types.ObjectId;
  region?: 'north' | 'south' | 'east' | 'west';
  productStatusFilter?: DashboardMetricsQueryDto['productStatus'];
  manufacturerIdsForRegion?: Types.ObjectId[];
}

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** State name substrings mapped to dashboard regions (India). */
const REGION_STATE_KEYWORDS: Record<
  'north' | 'south' | 'east' | 'west',
  string[]
> = {
  north: [
    'delhi',
    'punjab',
    'haryana',
    'rajasthan',
    'uttar pradesh',
    'himachal',
    'jammu',
    'kashmir',
    'chandigarh',
    'uttarakhand',
  ],
  south: [
    'karnataka',
    'kerala',
    'tamil nadu',
    'andhra',
    'telangana',
    'puducherry',
    'pondicherry',
  ],
  east: [
    'west bengal',
    'bihar',
    'odisha',
    'orissa',
    'jharkhand',
    'assam',
    'sikkim',
    'meghalaya',
    'tripura',
    'manipur',
    'nagaland',
    'mizoram',
    'arunachal',
  ],
  west: ['maharashtra', 'gujarat', 'goa', 'dadra', 'daman'],
};

export function stateNameMatchesRegion(
  stateName: string,
  region: 'north' | 'south' | 'east' | 'west',
): boolean {
  const normalized = String(stateName ?? '').trim().toLowerCase();
  if (!normalized) return false;
  return REGION_STATE_KEYWORDS[region].some((kw) => normalized.includes(kw));
}

/** Parse month from 1–12, "3", or short name ("Mar", "mar"). */
export function parseDashboardMonth(raw: unknown): number | undefined {
  if (raw === undefined || raw === null || raw === '') return undefined;
  const s = String(raw).trim().toLowerCase();
  if (s === 'all' || s === 'all months') return undefined;
  const n = Number(s);
  if (Number.isFinite(n) && n >= 1 && n <= 12) return Math.floor(n);
  const byName: Record<string, number> = {
    jan: 1,
    january: 1,
    feb: 2,
    february: 2,
    mar: 3,
    march: 3,
    apr: 4,
    april: 4,
    may: 5,
    jun: 6,
    june: 6,
    jul: 7,
    july: 7,
    aug: 8,
    august: 8,
    sep: 9,
    sept: 9,
    september: 9,
    oct: 10,
    october: 10,
    nov: 11,
    november: 11,
    dec: 12,
    december: 12,
  };
  return byName[s];
}

/** Parse year; "all" / empty → undefined. */
export function parseDashboardYear(raw: unknown): number | undefined {
  if (raw === undefined || raw === null || raw === '') return undefined;
  const s = String(raw).trim().toLowerCase();
  if (s === 'all' || s === 'all years') return undefined;
  const n = Number(s);
  if (Number.isFinite(n) && n >= 2000 && n <= 2100) return Math.floor(n);
  return undefined;
}

function endOfCalendarYear(year: number, now: Date): Date {
  if (year === now.getFullYear()) {
    return now;
  }
  return new Date(year, 11, 31, 23, 59, 59, 999);
}

/**
 * Resolves the product date window for dashboard filters.
 * Priority: month → quarter → year (+ period) → period alone → no filter.
 */
export function resolveDashboardDateRange(
  query: Pick<
    DashboardMetricsQueryDto,
    'period' | 'year' | 'month' | 'quarter'
  >,
  now = new Date(),
): DashboardDateRange | undefined {
  const selectedYear = query.year ?? now.getFullYear();

  if (query.month !== undefined) {
    const m = query.month - 1;
    const y = query.year ?? now.getFullYear();
    return {
      from: new Date(y, m, 1, 0, 0, 0, 0),
      to: new Date(y, m + 1, 0, 23, 59, 59, 999),
    };
  }

  if (query.quarter !== undefined) {
    const q = query.quarter;
    if (q < 1 || q > 4) {
      throw new BadRequestException('quarter must be between 1 and 4');
    }
    const y = query.year ?? now.getFullYear();
    const startMonth = (q - 1) * 3;
    return {
      from: new Date(y, startMonth, 1, 0, 0, 0, 0),
      to: new Date(y, startMonth + 3, 0, 23, 59, 59, 999),
    };
  }

  if (query.year !== undefined) {
    const y = query.year;
    if (!query.period || query.period === 'this_year') {
      return {
        from: new Date(y, 0, 1, 0, 0, 0, 0),
        to: endOfCalendarYear(y, now),
      };
    }
    if (query.period === 'this_month') {
      const monthIndex = now.getMonth();
      return {
        from: new Date(y, monthIndex, 1, 0, 0, 0, 0),
        to: new Date(y, monthIndex + 1, 0, 23, 59, 59, 999),
      };
    }
    if (query.period === 'this_quarter') {
      const qStart = Math.floor(now.getMonth() / 3) * 3;
      return {
        from: new Date(y, qStart, 1, 0, 0, 0, 0),
        to: new Date(y, qStart + 3, 0, 23, 59, 59, 999),
      };
    }
    if (query.period === 'this_week') {
      if (y !== now.getFullYear()) {
        throw new BadRequestException(
          'this_week is only valid for the current calendar year',
        );
      }
    }
  }

  if (!query.period) {
    return undefined;
  }

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const endOfDay = now;
  const y = query.year ?? now.getFullYear();

  switch (query.period) {
    case 'last_week': {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() - diff);
      const from = new Date(thisWeekStart);
      from.setDate(from.getDate() - 7);
      const to = new Date(thisWeekStart);
      to.setMilliseconds(-1);
      return { from: startOfDay(from), to };
    }
    case 'last_month': {
      const monthIndex = now.getMonth() - 1;
      const year =
        monthIndex < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const m = monthIndex < 0 ? 11 : monthIndex;
      return {
        from: new Date(year, m, 1, 0, 0, 0, 0),
        to: new Date(year, m + 1, 0, 23, 59, 59, 999),
      };
    }
    case 'last_year': {
      const year = now.getFullYear() - 1;
      return {
        from: new Date(year, 0, 1, 0, 0, 0, 0),
        to: new Date(year, 11, 31, 23, 59, 59, 999),
      };
    }
    case 'this_week': {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const from = new Date(now);
      from.setDate(now.getDate() - diff);
      return { from: startOfDay(from), to: endOfDay };
    }
    case 'this_month':
      return {
        from: new Date(y, now.getMonth(), 1, 0, 0, 0, 0),
        to: query.year !== undefined && query.year !== now.getFullYear()
          ? new Date(y, now.getMonth() + 1, 0, 23, 59, 59, 999)
          : endOfDay,
      };
    case 'this_quarter': {
      const qStart = Math.floor(now.getMonth() / 3) * 3;
      return {
        from: new Date(y, qStart, 1, 0, 0, 0, 0),
        to: query.year !== undefined && query.year !== now.getFullYear()
          ? new Date(y, qStart + 3, 0, 23, 59, 59, 999)
          : endOfDay,
      };
    }
    case 'this_year':
      return {
        from: new Date(y, 0, 1, 0, 0, 0, 0),
        to: endOfCalendarYear(y, now),
      };
    default:
      return undefined;
  }
}

/** Calendar period immediately before `current` (same duration). */
export function resolvePreviousDashboardDateRange(
  current: DashboardDateRange,
): DashboardDateRange {
  const durationMs = current.to.getTime() - current.from.getTime();
  const to = new Date(current.from.getTime() - 1);
  const from = new Date(to.getTime() - durationMs);
  return { from, to };
}

export function resolveRevenueDashboardGranularity(
  period?: DashboardMetricsQueryDto['period'],
  explicit?: DashboardGranularity,
): DashboardGranularity {
  if (explicit) return explicit;
  switch (period) {
    case 'this_week':
    case 'last_week':
      return 'weekly';
    case 'this_month':
    case 'last_month':
      return 'weekly';
    case 'this_quarter':
      return 'quarterly';
    default:
      return 'monthly';
  }
}

export function revenuePeriodDisplayLabel(
  period?: DashboardMetricsQueryDto['period'] | null,
): string {
  switch (period) {
    case 'this_week':
      return 'This Week';
    case 'last_week':
      return 'Last Week';
    case 'this_month':
      return 'This Month';
    case 'last_month':
      return 'Last Month';
    case 'this_quarter':
      return 'This Quarter';
    case 'this_year':
      return 'This Year';
    case 'last_year':
      return 'Last Year';
    default:
      return 'All Time';
  }
}

/** Human-readable summary of applied filters (for API + frontend). */
export function buildAppliedDashboardFilters(
  query: DashboardMetricsQueryDto,
  resolved: ResolvedDashboardFilters,
): AppliedDashboardFilters {
  return {
    period: query.period ?? null,
    year: query.year ?? null,
    month: query.month ?? null,
    quarter: query.quarter ?? null,
    productStatus: query.productStatus ?? null,
    categoryId: query.categoryId ?? null,
    region: query.region ?? null,
    granularity: resolved.granularity,
    dateRange: resolved.dateRange
      ? {
          from: resolved.dateRange.from.toISOString(),
          to: resolved.dateRange.to.toISOString(),
        }
      : null,
    manufacturersScope:
      'snapshot (current platform totals; not limited by product date range)',
    productsScope: resolved.dateRange
      ? 'time-series charts only: createdDate within dateRange'
      : 'all time for trend charts',
    countsScope:
      'current active products (non-deleted); not limited by period/year filters',
  };
}

/**
 * Manufacturer KPI cards use current platform snapshot (status counts),
 * optionally scoped by region only — not by registration date.
 */
export function buildManufacturerSnapshotMatch(
  filters: ResolvedDashboardFilters,
): Record<string, unknown> {
  const match: Record<string, unknown> = {};
  if (filters.manufacturerIdsForRegion?.length) {
    match._id = { $in: filters.manufacturerIdsForRegion };
  }
  return match;
}

/**
 * Current platform product counts (matches admin product list).
 * Uses active (non-deleted) products only. Does **not** filter by registration date.
 */
export function buildProductSnapshotMatch(
  filters: ResolvedDashboardFilters,
  now: Date,
): Record<string, unknown> {
  const match: Record<string, unknown> = {
    $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
  };

  if (filters.categoryObjectId) {
    match.categoryId = filters.categoryObjectId;
  }
  if (filters.manufacturerIdsForRegion?.length) {
    match.manufacturerId = { $in: filters.manufacturerIdsForRegion };
  }

  const statusFilter = filters.productStatusFilter;
  if (statusFilter) {
    Object.assign(match, productStatusFilterToMatch(statusFilter, now));
  }

  return match;
}

/** Time-series charts: snapshot filters + optional createdDate window. */
export function buildProductTrendMatch(
  filters: ResolvedDashboardFilters,
  now: Date,
): Record<string, unknown> {
  const match = buildProductSnapshotMatch(filters, now);
  if (filters.dateRange) {
    match.createdDate = {
      $gte: filters.dateRange.from,
      $lte: filters.dateRange.to,
    };
  }
  return match;
}

/** @deprecated Prefer buildProductSnapshotMatch or buildProductTrendMatch */
export function buildProductBaseMatch(
  filters: ResolvedDashboardFilters,
  now: Date,
): Record<string, unknown> {
  return buildProductTrendMatch(filters, now);
}

/**
 * UI productStatus filter → Mongo match (aligned with admin product list tabs).
 */
export function productStatusFilterToMatch(
  filter: NonNullable<DashboardMetricsQueryDto['productStatus']>,
  now: Date,
): Record<string, unknown> {
  switch (filter) {
    case 'pending':
      return { productStatus: { $in: [0, 1] } };
    case 'completed':
      return {
        productStatus: 2,
        $or: [
          { validtillDate: { $exists: false } },
          { validtillDate: null },
          { validtillDate: { $gte: now } },
        ],
      };
    case 'overdue':
      return {
        productStatus: 2,
        validtillDate: { $exists: true, $ne: null, $lt: now },
      };
    case 'active':
      return {
        $or: [
          { productStatus: 1 },
          { urnStatus: { $gte: 1, $lte: 10 } },
        ],
      };
    default:
      return {};
  }
}

export function isProductExpired(
  productStatus: number,
  validtillDate: Date | null | undefined,
  now: Date,
): boolean {
  return (
    productStatus === 2 &&
    validtillDate != null &&
    new Date(validtillDate).getTime() < now.getTime()
  );
}

export function bucketDateExpression(
  granularity: DashboardGranularity,
  dateField: string,
): Record<string, unknown> {
  switch (granularity) {
    case 'weekly':
      return {
        year: { $isoWeekYear: `$${dateField}` },
        week: { $isoWeek: `$${dateField}` },
      };
    case 'quarterly':
      return {
        year: { $year: `$${dateField}` },
        quarter: {
          $ceil: { $divide: [{ $add: [{ $month: `$${dateField}` }, 0] }, 3] },
        },
      };
    default:
      return {
        year: { $year: `$${dateField}` },
        month: { $month: `$${dateField}` },
      };
  }
}

export function formatBucketLabel(
  granularity: DashboardGranularity,
  bucket: { year?: number; month?: number; quarter?: number; week?: number },
): string {
  const year = bucket.year ?? 0;
  if (granularity === 'weekly' && bucket.week) {
    return `W${bucket.week} ${year}`;
  }
  if (granularity === 'quarterly' && bucket.quarter) {
    return `Q${bucket.quarter} ${year}`;
  }
  if (bucket.month && bucket.month >= 1 && bucket.month <= 12) {
    return MONTH_SHORT[bucket.month - 1] ?? `M${bucket.month}`;
  }
  return String(year);
}

export function emptyDashboardCharts(): {
  categoryDistribution: [];
  categoryCertified: [];
  productStatusBreakdown: {
    totals: {
      certified: 0;
      uncertified: 0;
      expired: 0;
      renewed: 0;
      rejected: 0;
      total: 0;
    };
    chart: [];
  };
  certifiedVsUncertified: {
    totals: {
      totalProducts: 0;
      certifiedProducts: 0;
      uncertifiedProducts: 0;
    };
    chart: [];
  };
  urnPipeline: [];
  monthlyCertified: [];
  monthlySubmissions: [];
  onlineOffline: [];
} {
  return {
    categoryDistribution: [],
    categoryCertified: [],
    productStatusBreakdown: {
      totals: {
        certified: 0,
        uncertified: 0,
        expired: 0,
        renewed: 0,
        rejected: 0,
        total: 0,
      },
      chart: [],
    },
    certifiedVsUncertified: {
      totals: {
        totalProducts: 0,
        certifiedProducts: 0,
        uncertifiedProducts: 0,
      },
      chart: [],
    },
    urnPipeline: [],
    monthlyCertified: [],
    monthlySubmissions: [],
    onlineOffline: [],
  };
}
