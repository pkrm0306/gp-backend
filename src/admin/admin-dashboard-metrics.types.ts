import type { DashboardVisibleSections } from '../common/constants/permissions.constants';

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
  categoryDistribution: DashboardCategoryDistributionItem[];
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
}

export type AdminDashboardMetricsResponse = AdminDashboardMetrics & {
  visibleSections: DashboardVisibleSections;
  appliedFilters: AppliedDashboardFilters;
};
