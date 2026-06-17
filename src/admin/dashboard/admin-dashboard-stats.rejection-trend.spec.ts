import { AdminDashboardStatsService } from './admin-dashboard-stats.service';

describe('AdminDashboardStatsService rejection trend', () => {
  const service = Object.create(
    AdminDashboardStatsService.prototype,
  ) as AdminDashboardStatsService;

  const suggestMax = (service as any).suggestRejectionTrendYMax.bind(service);

  it('keeps y-axis max at 1 for low counts', () => {
    expect(suggestMax(0)).toBe(1);
    expect(suggestMax(1)).toBe(1);
  });

  it('scales y-axis max for larger counts', () => {
    expect(suggestMax(3)).toBe(4);
    expect(suggestMax(7)).toBe(10);
  });
});
