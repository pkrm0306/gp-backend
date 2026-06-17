import {
  calcTrendPercent,
  mapRecentEoiStatus,
  trendDirection,
} from './vendor-dashboard.util';

describe('vendor-dashboard.util', () => {
  it('calculates trend percent', () => {
    expect(calcTrendPercent(12, 10)).toBe(20);
    expect(calcTrendPercent(0, 0)).toBe(0);
    expect(trendDirection(5)).toBe('up');
    expect(trendDirection(-3)).toBe('down');
  });

  it('maps recent EOI statuses', () => {
    expect(mapRecentEoiStatus(2, 11).status).toBe('Certified');
    expect(mapRecentEoiStatus(3, 11).status).toBe('Rejected');
    expect(mapRecentEoiStatus(1, 6).status).toBe('Under Review');
    expect(mapRecentEoiStatus(1, 2).status).toBe('Approved');
  });
});
