"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wm_manufacturing_unit_numeric_fields_util_1 = require("./wm-manufacturing-unit-numeric-fields.util");
describe('wm-manufacturing-unit-numeric-fields', function () {
    it('normalizes decimal string inputs', function () {
        var normalized = (0, wm_manufacturing_unit_numeric_fields_util_1.normalizeWmManufacturingUnitNumericInputs)({
            hazardousWasteQuantityYear1: '15.25',
            nonHazardousWasteWaterYear3: '12.5',
        });
        expect(normalized.hazardousWasteQuantityYear1).toBe(15.25);
        expect(normalized.nonHazardousWasteWaterYear3).toBe(12.5);
    });
    it('allows zero and rejects negative values', function () {
        expect(function () {
            return (0, wm_manufacturing_unit_numeric_fields_util_1.assertWmManufacturingUnitNonNegativeNumbers)({
                hazardousWasteProductionYear1: 0,
            });
        }).not.toThrow();
        expect(function () {
            return (0, wm_manufacturing_unit_numeric_fields_util_1.assertWmManufacturingUnitNonNegativeNumbers)({
                hazardousWasteProductionYear1: -1.5,
            });
        }).toThrow();
    });
});
