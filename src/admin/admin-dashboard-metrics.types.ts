import type { DashboardVisibleSections } from '../common/constants/permissions.constants';

export interface DashboardChartCountSlice {
  key: string;
  label: string;
  count: number;
}

export interface DashboardProductStatusBreakdown {
  totals: {
    certified: number;
    uncertified: number;
    expired: number;
    renewed: number;
    rejected: number;
    total: number;
  };
  chart: DashboardChartCountSlice[];
}

export interface DashboardCertifiedVsUncertifiedChart {
  totals: {
    totalProducts: number;
    certifiedProducts: number;
    uncertifiedProducts: number;
  };
  chart: DashboardChartCountSlice[];
}

export interface DashboardUrnPipelineStep {
  key: string;
  label: string;
  order: number;
  count: number;
}

export interface DashboardCategoryCertifiedItem {
  name: string;
  /** Certified & not expired product count in this category */
  certifiedProducts: number;
  /** @deprecated use certifiedProducts — kept for older clients */
  products: number;
}

export interface DashboardCategoryDistributionItem {
  name: string;
  products: number;
  sales: number;
}

export interface DashboardMonthlyCertifiedItem {
  month: string;
  certified: number;
  uncertified: number;
}

export interface DashboardMonthlyCountItem {
  month: string;
  count: number;
}

export interface DashboardOnlineOfflineItem {
  month: string;
  online: number;
  offline: number;
}

export interface AdminDashboardCharts {
  /** Certified products per category (for category bar chart) */
  categoryDistribution: DashboardCategoryDistributionItem[];
  /** Alias with explicit field names */
  categoryCertified: DashboardCategoryCertifiedItem[];
  /** Certified / uncertified / expired / renewed counts */
  productStatusBreakdown: DashboardProductStatusBreakdown;
  /** Certified vs uncertified share (pie / donut) */
  certifiedVsUncertified: DashboardCertifiedVsUncertifiedChart;
  /** Uncertified + in-progress URNs grouped by admin pipeline step */
  urnPipeline: DashboardUrnPipelineStep[];
  monthlyCertified: DashboardMonthlyCertifiedItem[];
  monthlySubmissions: DashboardMonthlyCountItem[];
  onlineOffline: DashboardOnlineOfflineItem[];
}

export interface AdminDashboardMetrics {
  totalManufacturers: number;
  manufacturers: {
    verified: number;
    unverified: number;
    inactivePending: number;
    verifiedActive: number;
    verifiedInactive: number;
  };
  productSubmissions: {
    total: number;
    totalUrns: number;
  };
  certificationProgress: {
    byProductStatus: {
      pending: number;
      approved: number;
      certified: number;
      rejected: number;
      expired: number;
    };
    byUrnStatus: Array<{ status: number; label: string; count: number }>;
    summary: {
      certifiedProducts: number;
      inCertificationPipeline: number;
      proposalPending: number;
      certificatePublished: number;
    };
  };
  charts: AdminDashboardCharts;
}

export interface AppliedDashboardFilters {
  period: string | null;
  year: number | null;
  month: number | null;
  quarter: number | null;
  productStatus: string | null;
  categoryId: string | null;
  region: string | null;
  granularity: string;
  dateRange: { from: string; to: string } | null;
  manufacturersScope: string;
  productsScope: string;
  countsScope?: string;
}

export type AdminDashboardMetricsResponse = AdminDashboardMetrics & {
  visibleSections: DashboardVisibleSections;
  appliedFilters: AppliedDashboardFilters;
};
