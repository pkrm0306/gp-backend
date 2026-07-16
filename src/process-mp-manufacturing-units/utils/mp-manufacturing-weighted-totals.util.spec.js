"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mp_manufacturing_weighted_totals_util_1 = require("./mp-manufacturing-weighted-totals.util");
describe('mp-manufacturing-weighted-totals', function () {
    it('card 1 uses production-weighted row 16', function () {
        var totals = (0, mp_manufacturing_weighted_totals_util_1.buildManufacturingWeightedTotals)([
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
    it('card 2 uses production-weighted row 4', function () {
        var units = [
            { calculateBulkSwc: -24, wcdProductionYear3: 70 },
            { calculateBulkSwc: 10, wcdProductionYear3: 30 },
        ];
        var totals = (0, mp_manufacturing_weighted_totals_util_1.buildManufacturingWeightedTotals)(units);
        expect(totals.overallWaterReductionPercent).toBeCloseTo(-13.8, 1);
    });
    it('single unit cards match row 16 and row 4', function () {
        var unit = {
            calculateBulkSec: 3,
            ecdProductionYear3: 10,
            calculateBulkSwc: -24,
            wcdProductionYear3: 11,
        };
        var totals = (0, mp_manufacturing_weighted_totals_util_1.buildManufacturingWeightedTotals)([unit]);
        expect(totals.overallEnergyReductionPercent).toBe((0, mp_manufacturing_weighted_totals_util_1.energyConsumptionRow16Percent)(unit));
        expect(totals.overallWaterReductionPercent).toBe((0, mp_manufacturing_weighted_totals_util_1.waterConsumptionRow4Percent)(unit));
    });
    it('renewable percent uses row 6 + row 2 over row 14 year 3', function () {
        var totals = (0, mp_manufacturing_weighted_totals_util_1.buildManufacturingWeightedTotals)([
            {
                reSolarPhotovoltaic: 1,
                offsiteRenewablePower: 0,
                ecdElectricYear3: 1,
            },
        ]);
        var renewable = (0, mp_manufacturing_weighted_totals_util_1.renewableOnsiteRow6Kcal)({ reSolarPhotovoltaic: 1 }) +
            (0, mp_manufacturing_weighted_totals_util_1.renewableOffsiteRow2Kcal)({ offsiteRenewablePower: 0 });
        expect(totals.overallRenewablePercent).toBeCloseTo((renewable / 2750) * 100, 1);
    });
});
