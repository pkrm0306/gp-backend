export interface DashboardKpiSubMetrics {
  [key: string]: number;
}

export interface DashboardKpiCard {
  key: string;
  label: string;
  value: number;
  /** Human-readable breakdown for the card footer, e.g. "8 registered · 6 verified". */
  subMetrics: DashboardKpiSubMetrics;
}

export interface AdminDashboardKpiCards {
  activeManufacturers: DashboardKpiCard;
  certifiedProducts: DashboardKpiCard;
  pendingApplications: DashboardKpiCard;
  transactions: DashboardKpiCard;
  certificationSuccessRate: DashboardKpiCard;
  totalRevenue: DashboardKpiCard & { currency: 'INR' };
  pendingRenewals: DashboardKpiCard;
  expiredCertifications: DashboardKpiCard;
  totalInquiries: DashboardKpiCard;
  productInquiries: DashboardKpiCard;
}

export interface AdminDashboardKpiBundle {
  cards: AdminDashboardKpiCards;
  certificationTiming: import('./admin-dashboard-certification-timing.types').AdminDashboardCertificationTiming;
}

/** Executive KPI strip keys (admin dashboard home). */
export type ExecutiveKpiKey =
  | 'totalManufacturers'
  | 'activeUrns'
  | 'registeredProducts'
  | 'certifiedProducts'
  | 'pendingProducts'
  | 'underReview'
  | 'renewalsDue'
  | 'pendingPayments'
  | 'totalRevenue'
  | 'todaysCollection'
  | 'monthlyCollection'
  | 'yearlyCollection';

export type ExecutiveKpiFormat = 'number' | 'currency';

export type ExecutiveKpiCard = {
  key: ExecutiveKpiKey;
  label: string;
  value: number;
  changePercent: number;
  higherIsBetter: boolean;
  format: ExecutiveKpiFormat;
  href: string;
  sparkline: number[];
};

export type ExecutiveKpiPayload = {
  cards: ExecutiveKpiCard[];
  generatedAt: string;
};
