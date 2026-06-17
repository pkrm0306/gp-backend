export interface DashboardPaymentStatusItem {
  key: 'paid' | 'pending';
  label: string;
  count: number;
  percent: number;
}

export interface DashboardPaymentStatusWidget {
  total: number;
  items: DashboardPaymentStatusItem[];
  chart: DashboardPaymentStatusItem[];
}

export interface DashboardRecentPaymentRow {
  paymentId: number;
  transactionId: string;
  companyName: string;
  manufacturerName: string;
  urnNo: string;
  paymentType: string;
  paymentTypeLabel: string;
  paymentMode: string | null;
  paymentModeLabel: string | null;
  amount: number;
  currency: 'INR';
  date: string;
  status: 'paid' | 'pending';
  statusLabel: string;
}

export interface DashboardRecentApplicationRow {
  productId: number;
  eoiNo: string;
  productName: string;
  manufacturerName: string;
  categoryName: string;
  date: string;
  status: string;
  statusLabel: string;
}

export interface DashboardAlertItem {
  key: string;
  label: string;
  count: number;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

export interface AdminDashboardOverview {
  kpiCards: import('./admin-dashboard-kpi.types').AdminDashboardKpiCards;
  certificationTiming: import('./admin-dashboard-certification-timing.types').AdminDashboardCertificationTiming;
  paymentStatus: DashboardPaymentStatusWidget;
  recentPayments: DashboardRecentPaymentRow[];
  recentApplications: DashboardRecentApplicationRow[];
  alerts: DashboardAlertItem[];
  charts: {
    products: Awaited<
      ReturnType<
        import('./admin-dashboard-stats.service').AdminDashboardStatsService['getProductWidgetStats']
      >
    >;
    trends: Awaited<
      ReturnType<
        import('./admin-dashboard-stats.service').AdminDashboardStatsService['getTrendCharts']
      >
    >;
    rejectionTrend: import('./admin-dashboard-rejection-trend.types').AdminDashboardRejectionTrend;
  };
  sustainabilityContributions: import('./admin-dashboard-sustainability.types').AdminDashboardSustainabilityContributions;
  visitorAnalytics: import('./admin-dashboard-visitor-analytics.types').AdminDashboardVisitorAnalytics;
}
