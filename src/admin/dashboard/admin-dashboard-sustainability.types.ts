import type { SustainabilityContributionKey } from '../utils/admin-dashboard-sustainability.util';

export interface SustainabilityContributionItem {
  key: SustainabilityContributionKey;
  label: string;
  order: number;
  percent: number;
  color: string;
  sampleCount: number;
}

export interface AdminDashboardSustainabilityContributions {
  title: string;
  subtitle: string;
  unit: 'percent';
  totals: {
    certifiedUrns: number;
    certifiedProducts: number;
  };
  items: SustainabilityContributionItem[];
}
