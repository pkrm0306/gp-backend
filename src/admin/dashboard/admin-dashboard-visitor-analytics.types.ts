export type VisitorAnalyticsSeriesKey = 'pageViews' | 'visitors' | 'signUps';

export interface VisitorAnalyticsChartPoint {
  label: string;
  year: number;
  month?: number;
  quarter?: number;
  week?: number;
  pageViews: number;
  visitors: number;
  signUps: number;
}

export interface VisitorAnalyticsSeriesMeta {
  key: VisitorAnalyticsSeriesKey;
  label: string;
  color: string;
  order: number;
}

export interface AdminDashboardVisitorAnalytics {
  title: string;
  subtitle: string;
  granularity: 'monthly' | 'weekly' | 'quarterly';
  /** `website` when events are collected from the public site; `estimated` for legacy Mongo proxy. */
  source?: 'website' | 'estimated';
  series: VisitorAnalyticsSeriesMeta[];
  chart: VisitorAnalyticsChartPoint[];
  totals: {
    pageViews: number;
    visitors: number;
    signUps: number;
  };
  yAxis: {
    min: number;
    suggestedMax: number;
  };
  methodology: {
    pageViews: string;
    visitors: string;
    signUps: string;
  };
}
