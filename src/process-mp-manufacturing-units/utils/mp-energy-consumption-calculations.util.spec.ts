import {
  computeEnergyConsumptionDerivedFields,
  computeReductionInSpecificConsumptionPercent,
  computeSpecificConsumptionRatio,
  computeTotalThermalEnergyConsumptionForYear,
  enrichMpManufacturingUnitCalculations,
} from './mp-energy-consumption-calculations.util';

describe('mp-energy-consumption-calculations', () => {
  it('computes row 3 SEC values rounded to 2 decimals', () => {
    expect(computeSpecificConsumptionRatio(10, 23)).toBe(0.43);
    expect(computeSpecificConsumptionRatio(4, 12)).toBe(0.33);
    expect(computeSpecificConsumptionRatio(3, 15)).toBe(0.2);
  });

  it('computes row 4 reduction using rounded row 3 values (53.49, not 54.00)', () => {
    const secYear1 = computeSpecificConsumptionRatio(10, 23);
    const secYear3 = computeSpecificConsumptionRatio(3, 15);
    expect(
      computeReductionInSpecificConsumptionPercent(secYear1, secYear3),
    ).toBe(53.49);
  });

  it('computes water row 4 using rounded row 3 values (-53.85, not -53.33)', () => {
    const swcYear1 = computeSpecificConsumptionRatio(15, 23);
    const swcYear2 = computeSpecificConsumptionRatio(16, 13);
    const swcYear3 = computeSpecificConsumptionRatio(12, 12);
    expect(swcYear1).toBe(0.65);
    expect(swcYear2).toBe(1.23);
    expect(swcYear3).toBe(1);
    expect(
      computeReductionInSpecificConsumptionPercent(swcYear1, swcYear3),
    ).toBe(-53.85);
  });

  it('returns derived water bulk fields for sample water table', () => {
    const derived = computeEnergyConsumptionDerivedFields({
      wcdProductionYear1: 23,
      wcdProductionYear2: 13,
      wcdProductionYear3: 12,
      wcdWaterYear1: 15,
      wcdWaterYear2: 16,
      wcdWaterYear3: 12,
    });

    expect(derived.calculateBulkSwcMultipled).toBe('0.65,1.23,1.00');
    expect(derived.calculateBulkSwc).toBe(-53.85);
  });

  it('returns derived bulk fields for sample energy table', () => {
    const derived = computeEnergyConsumptionDerivedFields({
      ecdProductionYear1: 23,
      ecdProductionYear2: 12,
      ecdProductionYear3: 15,
      ecdElectricYear1: 10,
      ecdElectricYear2: 4,
      ecdElectricYear3: 3,
    });

    expect(derived.calculateBulkSecMultipled).toBe('1195.65,916.67,550.00');
    expect(derived.calculateBulkSec).toBe(54);
  });

  it('computes thermal rows 11–13 using rounded row-12 values (-96.32, not -96.27)', () => {
    const derived = computeEnergyConsumptionDerivedFields({
      ecdProductionYear1: 23,
      ecdProductionYear2: 12,
      ecdProductionYear3: 15,
      ecdThermalFuel1Year1: 10,
      ecdThermalFuel1Year2: 11,
      ecdThermalFuel1Year3: 12,
      ecdCalorificFuel1Year1: 10,
      ecdCalorificFuel1Year2: 11,
      ecdCalorificFuel1Year3: 12,
      ecdThermalFuel2Year1: 10,
      ecdThermalFuel2Year2: 10,
      ecdThermalFuel2Year3: 10,
      ecdCalorificFuel2Year1: 11,
      ecdCalorificFuel2Year2: 12,
      ecdCalorificFuel2Year3: 13,
      ecdThermalFuel3Year1: 9,
      ecdThermalFuel3Year2: 10,
      ecdThermalFuel3Year3: 11,
      ecdCalorificFuel3Year1: 10,
      ecdCalorificFuel3Year2: 10,
      ecdCalorificFuel3Year3: 10,
    });

    expect(derived.calculateBulkTecMultipled).toBe('300.00,341.00,384.00');
    expect(derived.calculateBulkStecMultipled).toBe('13.04,28.42,25.60');
    expect(derived.calculateBulkStec).toBe(-96.32);
  });

  it('computes total thermal energy per year', () => {
    expect(
      computeTotalThermalEnergyConsumptionForYear(
        {
          ecdThermalFuel1Year1: 10,
          ecdCalorificFuel1Year1: 10,
          ecdThermalFuel2Year1: 10,
          ecdCalorificFuel2Year1: 11,
          ecdThermalFuel3Year1: 9,
          ecdCalorificFuel3Year1: 10,
        },
        1,
      ),
    ).toBe(300);
  });

  it('coerces string inputs before calculating', () => {
    const enriched = enrichMpManufacturingUnitCalculations({
      ecdProductionYear1: '23',
      ecdProductionYear2: '12',
      ecdProductionYear3: '15',
      ecdElectricYear1: '10',
      ecdElectricYear2: '4',
      ecdElectricYear3: '3',
    }) as Record<string, unknown>;

    expect(enriched.calculateBulkSecMultipled).toBe('1195.65,916.67,550.00');
    expect(enriched.calculateBulkSec).toBe(54);
    expect(enriched.energyConsumptionDetails).toEqual({
      totalThermalEnergyConsumption: {
        year1: null,
        year2: null,
        year3: null,
      },
      specificThermalEnergyConsumption: {
        year1: null,
        year2: null,
        year3: null,
      },
      reductionInSpecificThermalEnergyConsumption: {
        year1: null,
        year2: null,
        year3: null,
      },
      specificElectricalEnergyConsumption: {
        year1: 0.43,
        year2: 0.33,
        year3: 0.2,
      },
      reductionInSpecificElectricalEnergyConsumption: {
        year1: 53.49,
        year2: null,
        year3: null,
      },
      specificWaterConsumption: {
        year1: null,
        year2: null,
        year3: null,
      },
      reductionInSpecificWaterConsumption: {
        year1: null,
        year2: null,
        year3: null,
      },
    });
  });
});
