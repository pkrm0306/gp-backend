import {
  assertWmManufacturingUnitNonNegativeNumbers,
  normalizeWmManufacturingUnitNumericInputs,
} from './wm-manufacturing-unit-numeric-fields.util';

describe('wm-manufacturing-unit-numeric-fields', () => {
  it('normalizes decimal string inputs', () => {
    const normalized = normalizeWmManufacturingUnitNumericInputs({
      hazardousWasteQuantityYear1: '15.25',
      nonHazardousWasteWaterYear3: '12.5',
    });

    expect(normalized.hazardousWasteQuantityYear1).toBe(15.25);
    expect(normalized.nonHazardousWasteWaterYear3).toBe(12.5);
  });

  it('allows zero and rejects negative values', () => {
    expect(() =>
      assertWmManufacturingUnitNonNegativeNumbers({
        hazardousWasteProductionYear1: 0,
      }),
    ).not.toThrow();

    expect(() =>
      assertWmManufacturingUnitNonNegativeNumbers({
        hazardousWasteProductionYear1: -1.5,
      }),
    ).toThrow();
  });
});
