export type VendorDashboardKpiKey =
  | 'totalProducts'
  | 'pendingApprovals'
  | 'eoisSubmitted'
  | 'urnsGenerated'
  | 'certifiedProducts'
  | 'paymentsDue';

export interface VendorDashboardKpiCard {
  key: VendorDashboardKpiKey;
  label: string;
  value: number;
  trendPercent: number;
  trendDirection: 'up' | 'down' | 'flat';
  subLabel?: string;
  currency?: 'INR';
  format?: 'number' | 'currency';
}

export interface VendorDashboardTrendPoint {
  label: string;
  month: number;
  year: number;
  registrations: number;
  certifications: number;
}

export interface VendorDashboardStatusSlice {
  key: 'certified' | 'pending' | 'underReview' | 'rejected';
  label: string;
  count: number;
  color: string;
}

export interface VendorDashboardCategoryBar {
  name: string;
  count: number;
}

export interface VendorDashboardProductOutcomePoint {
  label: string;
  month: number;
  year: number;
  registered: number;
  certified: number;
  rejected: number;
}

export interface VendorDashboardProductOutcomesChart {
  title: string;
  subtitle: string;
  year: number;
  availableYears: number[];
  chart: VendorDashboardProductOutcomePoint[];
  totals: {
    registered: number;
    certified: number;
    rejected: number;
  };
  yAxis: { min: number; suggestedMax: number };
}

export interface VendorDashboardRecentEoiRow {
  productId: number;
  eoiNo: string;
  productName: string;
  categoryName: string;
  date: string;
  status: string;
  statusKey: string;
  statusVariant: 'success' | 'warning' | 'danger' | 'info';
  urnNo: string;
}

export type VendorRecentActivityType =
  | 'productApproval'
  | 'submission'
  | 'payment'
  | 'requirement'
  | 'alert';

export interface VendorDashboardRecentActivityItem {
  id: string;
  type: VendorRecentActivityType;
  message: string;
  occurredAt: string;
  relativeTimeLabel: string;
  metadata?: Record<string, string | number | null>;
}

export interface VendorDashboardOverview {
  kpiCards: VendorDashboardKpiCard[];
  registrationCertificationTrend: {
    title: string;
    subtitle: string;
    year: number;
    chart: VendorDashboardTrendPoint[];
    yAxis: { min: number; suggestedMax: number };
  };
  productStatus: {
    title: string;
    subtitle: string;
    total: number;
    chart: VendorDashboardStatusSlice[];
  };
  productsByCategory: {
    title: string;
    subtitle: string;
    chart: VendorDashboardCategoryBar[];
    xAxis: { min: number; suggestedMax: number };
  };
  recentEois: {
    title: string;
    subtitle: string;
    viewAllPath: string;
    items: VendorDashboardRecentEoiRow[];
  };
  recentActivity: {
    title: string;
    subtitle: string;
    days: number;
    items: VendorDashboardRecentActivityItem[];
  };
  productOutcomesChart: VendorDashboardProductOutcomesChart;
}
