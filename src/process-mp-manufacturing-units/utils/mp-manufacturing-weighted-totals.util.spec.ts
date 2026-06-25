import {
  buildManufacturingWeightedTotals,
  energyConsumptionRow16Percent,
  renewableOffsiteRow2Kcal,
  renewableOnsiteRow6Kcal,
  waterConsumptionRow4Percent,
} from './mp-manufacturing-weighted-totals.util';

describe('mp-manufacturing-weighted-totals', () => {
  it('card 1 uses production-weighted row 16', () => {
    const totals = buildManufacturingWeightedTotals([
      {
        calculateBulkSec: 3,
        ecdProductionYear3: 70,
      },
      {
        calculateBulkSec: 10,
        ecdProductionYear3: 30,
      },
    ]);

    expect(totals.overallEnergyReductionPercent).toBeCloseTo(5.1, 1);
  });

  it('card 2 uses production-weighted row 4', () => {
    const units = [
      { calculateBulkSwc: -24, wcdProductionYear3: 70 },
      { calculateBulkSwc: 10, wcdProductionYear3: 30 },
    ];
    const totals = buildManufacturingWeightedTotals(units);
    expect(totals.overallWaterReductionPercent).toBeCloseTo(-13.8, 1);
  });

  it('single unit cards match row 16 and row 4', () => {
    const unit = {
      calculateBulkSec: 3,
      ecdProductionYear3: 10,
      calculateBulkSwc: -24,
      wcdProductionYear3: 11,
    };
    const totals = buildManufacturingWeightedTotals([unit]);
    expect(totals.overallEnergyReductionPercent).toBe(
      energyConsumptionRow16Percent(unit),
    );
    expect(totals.overallWaterReductionPercent).toBe(
      waterConsumptionRow4Percent(unit),
    );
  });

  it('renewable percent uses row 6 + row 2 over row 14 year 3', () => {
    const totals = buildManufacturingWeightedTotals([
      {
        reSolarPhotovoltaic: 1,
        offsiteRenewablePower: 0,
        ecdElectricYear3: 1,
      },
    ]);

    const renewable =
      renewableOnsiteRow6Kcal({ reSolarPhotovoltaic: 1 }) +
      renewableOffsiteRow2Kcal({ offsiteRenewablePower: 0 });
    expect(totals.overallRenewablePercent).toBeCloseTo(
      (renewable / 2750) * 100,
      1,
    );
  });
});
