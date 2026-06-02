import type { DashboardProductStatusBreakdown } from '../admin-dashboard-metrics.types';

export function emptyProductStatusBreakdown(): DashboardProductStatusBreakdown {
  return {
    totals: {
      certified: 0,
      uncertified: 0,
      expired: 0,
      renewed: 0,
      rejected: 0,
      total: 0,
    },
    chart: [
      { key: 'certified', label: 'Certified', count: 0 },
      { key: 'uncertified', label: 'Uncertified', count: 0 },
      { key: 'expired', label: 'Expired', count: 0 },
      { key: 'renewed', label: 'Renewed', count: 0 },
    ],
  };
}

export function buildProductStatusBreakdownFromCounts(input: {
  certified: number;
  uncertified: number;
  expired: number;
  renewed: number;
  rejected: number;
}): DashboardProductStatusBreakdown {
  const total =
    input.certified +
    input.uncertified +
    input.expired +
    input.renewed +
    input.rejected;
  return {
    totals: {
      certified: input.certified,
      uncertified: input.uncertified,
      expired: input.expired,
      renewed: input.renewed,
      rejected: input.rejected,
      total,
    },
    chart: [
      { key: 'certified', label: 'Certified', count: input.certified },
      { key: 'uncertified', label: 'Uncertified', count: input.uncertified },
      { key: 'expired', label: 'Expired', count: input.expired },
      { key: 'renewed', label: 'Renewed', count: input.renewed },
    ],
  };
}
