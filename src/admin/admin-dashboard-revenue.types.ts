import type { AppliedDashboardFilters } from './admin-dashboard-metrics.types';
import type { DashboardGranularity } from './utils/dashboard-metrics-filters.util';

export type RevenuePaymentTypeKey = 'registration' | 'certification' | 'renew';

export interface RevenueTypeTotals {
  /** Sum of `quoteTotal` for completed payments */
  amount: number;
  /** Sum of `quoteGstAmount` */
  gstAmount: number;
  /** Sum of `quoteTdsAmount` */
  tdsAmount: number;
  /** Number of completed payment records */
  count: number;
}

export interface RevenueChartSlice {
  key: RevenuePaymentTypeKey;
  label: string;
  amount: number;
  count: number;
  /** Share of total revenue in the selected period (0–100) */
  percentage?: number;
}

/** Donut / stage-distribution widget */
export interface RevenueDistributionWidget {
  totalRevenue: number;
  totalCount: number;
  currency: 'INR';
  centerLabel: string;
  segments: RevenueChartSlice[];
}

export interface RevenueWeeklyComparisonPoint {
  week: string;
  currentAmount: number;
  previousAmount: number;
  currentCount: number;
  previousCount: number;
}

/** Line chart: current period vs previous period by week (W1–W5) */
export interface RevenueWeeklyComparisonWidget {
  currentPeriodLabel: string;
  previousPeriodLabel: string;
  buckets: RevenueWeeklyComparisonPoint[];
}

export interface RevenueTimeSeriesPoint {
  bucket: string;
  amount: number;
  count: number;
}

export interface RevenueTimeSeries {
  key: RevenuePaymentTypeKey | 'total';
  label: string;
  points: RevenueTimeSeriesPoint[];
}

export interface AdminDashboardRevenueAnalytics {
  appliedFilters: AppliedDashboardFilters & {
    revenueScope: string;
  };
  totals: {
    registration: RevenueTypeTotals;
    certification: RevenueTypeTotals;
    renewal: RevenueTypeTotals;
    all: RevenueTypeTotals;
  };
  /** Same as `totals` — explicit alias for KPI cards in the selected period */
  periodTotals: {
    registration: RevenueTypeTotals;
    certification: RevenueTypeTotals;
    renewal: RevenueTypeTotals;
    all: RevenueTypeTotals;
  };
  charts: {
    granularity: DashboardGranularity;
    byType: RevenueChartSlice[];
    timeSeries: RevenueTimeSeries[];
    /** Weekly buckets with all payment types (use when granularity=weekly) */
    weeklyByType: Array<{
      bucket: string;
      registration: number;
      certification: number;
      renewal: number;
      total: number;
    }>;
  };
  /** UI-ready donut: total in centre + fee breakdown with % */
  distribution: RevenueDistributionWidget;
  /** UI-ready weekly line chart (current vs previous period) */
  weeklyComparison: RevenueWeeklyComparisonWidget;
}
