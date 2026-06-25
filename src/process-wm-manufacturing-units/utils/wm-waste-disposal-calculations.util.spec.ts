import {
  computeWmWasteDisposalDerivedFields,
  enrichWmManufacturingUnitCalculations,
} from './wm-waste-disposal-calculations.util';

describe('wm-waste-disposal-calculations', () => {
  it('computes hazardous row 4 with vendor-style year fallback', () => {
    const derived = computeWmWasteDisposalDerivedFields({
      hazardousWasteProductionYear1: 12,
      hazardousWasteProductionYear2: 13,
      hazardousWasteProductionYear3: 14,
      hazardousWasteQuantityYear1: 34,
      hazardousWasteQuantityYear2: 23,
      hazardousWasteQuantityYear3: 34,
    });

    expect(derived.calculateBulkRshwd).toBe(14.13);
    expect(derived.calculateBulkRshwdMultipled).toBe('197.82');
  });

  it('enriches unit with wasteDisposalDetails', () => {
    const enriched = enrichWmManufacturingUnitCalculations({
      hazardousWasteProductionYear1: 12,
      hazardousWasteProductionYear3: 14,
      hazardousWasteQuantityYear1: 34,
      hazardousWasteQuantityYear3: 34,
    }) as Record<string, unknown>;

    expect(enriched.calculateBulkRshwd).toBe(14.13);
    expect(enriched.wasteDisposalDetails).toEqual({
      specificHazardousWasteDisposal: {
        year1: 2.83,
        year2: null,
        year3: 2.43,
      },
      reductionInSpecificHazardousWasteDisposal: {
        year1: 14.13,
        year2: null,
        year3: null,
      },
      specificNonHazardousWasteDisposal: {
        year1: null,
        year2: null,
        year3: null,
      },
      reductionInSpecificNonHazardousWasteDisposal: {
        year1: null,
        year2: null,
        year3: null,
      },
    });
  });

  it('keeps persisted vendor bulk fields on enrich', () => {
    const enriched = enrichWmManufacturingUnitCalculations({
      hazardousWasteProductionYear3: 14,
      hazardousWasteQuantityYear1: 15,
      hazardousWasteQuantityYear3: 17,
      calculateBulkRshwd: 3.1428571428571,
      calculateBulkRshwdMultipled: '44',
    }) as Record<string, unknown>;

    expect(enriched.calculateBulkRshwd).toBe(3.1428571428571);
    expect(enriched.calculateBulkRshwdMultipled).toBe('44');
  });
});
