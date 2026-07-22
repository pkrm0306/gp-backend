import type {
  AdminDashboardCharts,
  AppliedDashboardFilters,
} from '../admin-dashboard-metrics.types';
import type { AdminDashboardRevenueAnalytics } from '../admin-dashboard-revenue.types';
import type { DashboardProductStatusBreakdown } from '../admin-dashboard-metrics.types';

export interface AdminDashboardStatsBundle {
  appliedFilters: AppliedDashboardFilters & {
    productsScope: string;
    countsScope: string;
  };
  products: {
    statusBreakdown: DashboardProductStatusBreakdown;
    certifiedVsUncertified: AdminDashboardCharts['certifiedVsUncertified'];
    urnPipeline: AdminDashboardCharts['urnPipeline'];
    categoryCertified: AdminDashboardCharts['categoryCertified'];
    /** Raw status histogram aligned with admin product list `statusCounts` */
    statusCounts: {
      pending: number;
      approved: number;
      /** productStatus ∈ {0, 1} */
      uncertified: number;
      certified: number;
      rejected: number;
      expired: number;
      /**
       * Registered products = uncertified + certified + expired + rejected
       * (non-deleted snapshot only; deleted products are excluded upstream).
       */
      total: number;
    };
  };
  charts: Pick<
    AdminDashboardCharts,
    'monthlySubmissions' | 'monthlyCertified' | 'onlineOffline'
  >;
  revenue?: AdminDashboardRevenueAnalytics;
}
