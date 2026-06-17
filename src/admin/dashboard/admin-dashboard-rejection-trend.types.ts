export interface DashboardRejectionTrendPoint {
  /** Short bucket label, e.g. `Feb`, `W12 2026`, `Q1 2026` */
  label: string;
  year: number;
  month?: number;
  quarter?: number;
  week?: number;
  count: number;
}

export interface AdminDashboardRejectionTrend {
  title: string;
  subtitle: string;
  unit: 'products';
  granularity: 'monthly' | 'weekly' | 'quarterly';
  totals: {
    /** Rejected products in the applied date window */
    rejectedInRange: number;
    /** Current platform snapshot — all active rejected products */
    totalRejected: number;
  };
  chart: DashboardRejectionTrendPoint[];
  yAxis: {
    min: number;
    suggestedMax: number;
  };
}
