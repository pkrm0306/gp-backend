"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wm_waste_disposal_calculations_util_1 = require("./wm-waste-disposal-calculations.util");
describe('wm-waste-disposal-calculations', function () {
    it('computes hazardous row 4 with vendor-style year fallback', function () {
        var derived = (0, wm_waste_disposal_calculations_util_1.computeWmWasteDisposalDerivedFields)({
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
    it('enriches unit with wasteDisposalDetails', function () {
        var enriched = (0, wm_waste_disposal_calculations_util_1.enrichWmManufacturingUnitCalculations)({
            hazardousWasteProductionYear1: 12,
            hazardousWasteProductionYear3: 14,
            hazardousWasteQuantityYear1: 34,
            hazardousWasteQuantityYear3: 34,
        });
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
    it('keeps persisted vendor bulk fields on enrich', function () {
        var enriched = (0, wm_waste_disposal_calculations_util_1.enrichWmManufacturingUnitCalculations)({
            hazardousWasteProductionYear3: 14,
            hazardousWasteQuantityYear1: 15,
            hazardousWasteQuantityYear3: 17,
            calculateBulkRshwd: 3.1428571428571,
            calculateBulkRshwdMultipled: '44',
        });
        expect(enriched.calculateBulkRshwd).toBe(3.1428571428571);
        expect(enriched.calculateBulkRshwdMultipled).toBe('44');
    });
});
