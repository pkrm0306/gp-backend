import {
  averagePositivePercent,
  clampPercent,
  maxRecycledPercentFromRmcRow,
  renewableCarbonScore,
} from './admin-dashboard-sustainability.util';

describe('admin-dashboard-sustainability.util', () => {
  it('averages positive percentages', () => {
    expect(averagePositivePercent([80, 90, -5, 0])).toBe(85);
    expect(averagePositivePercent([])).toBe(0);
  });

  it('clamps percent values', () => {
    expect(clampPercent(120)).toBe(100);
    expect(clampPercent(-10)).toBe(0);
  });

  it('reads max recycled percent from RMC row', () => {
    expect(
      maxRecycledPercentFromRmcRow({
        percentYear1Recycled: 10,
        percentYear3Recycled: 68,
      }),
    ).toBe(68);
  });

  it('scores renewable carbon utilization', () => {
    expect(renewableCarbonScore({ renewableEnergyUtilization: 'yes' })).toBe(100);
    expect(
      renewableCarbonScore({
        reWind: 40,
        offsiteRenewablePower: 30,
      }),
    ).toBe(70);
  });
});
