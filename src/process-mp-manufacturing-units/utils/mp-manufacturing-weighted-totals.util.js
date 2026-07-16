"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MANUFACTURING_RENEWABLE_WEIGHTED_FORMULA = exports.MANUFACTURING_WATER_WEIGHTED_FORMULA = exports.MANUFACTURING_ENERGY_WEIGHTED_FORMULA = void 0;
exports.computeTotalEnergyRow14Kcal = computeTotalEnergyRow14Kcal;
exports.renewableOnsiteRow6Kcal = renewableOnsiteRow6Kcal;
exports.renewableOffsiteRow2Kcal = renewableOffsiteRow2Kcal;
exports.energyConsumptionRow16Percent = energyConsumptionRow16Percent;
exports.waterConsumptionRow4Percent = waterConsumptionRow4Percent;
exports.buildManufacturingWeightedTotals = buildManufacturingWeightedTotals;
var mp_energy_consumption_calculations_util_1 = require("./mp-energy-consumption-calculations.util");
exports.MANUFACTURING_ENERGY_WEIGHTED_FORMULA = 'Weighted average of Row 16 (Reduction in Overall SEC) by sum of ecd production in reporting year';
exports.MANUFACTURING_WATER_WEIGHTED_FORMULA = 'Weighted average of Row 4 (Reduction in Specific Water Consumption) by sum of wcd production in reporting year';
exports.MANUFACTURING_RENEWABLE_WEIGHTED_FORMULA = '[(Sum of row 2 (Offsite Renewable Energy Consumed) & row 6 (Total Renewable Energy Consumed) from Table: Renewable Energy) / (Sum of row 14 (Total Energy Consumption) from Energy Consumption Details for reporting year)] × 100';
function yearNumber(unit, key) {
    var raw = unit[key];
    var n = typeof raw === 'number' ? raw : Number(String(raw !== null && raw !== void 0 ? raw : '').trim());
    return Number.isFinite(n) ? n : 0;
}
function readStoredBulkNumber(unit, camelKey, snakeKey) {
    var _a;
    var raw = (_a = unit[camelKey]) !== null && _a !== void 0 ? _a : unit[snakeKey];
    if (raw == null || raw === '')
        return null;
    var n = typeof raw === 'number' ? raw : Number(String(raw).trim());
    return Number.isFinite(n) ? n : null;
}
function specificRatio(numerator, denominator) {
    if (!denominator || !Number.isFinite(numerator))
        return null;
    return (0, mp_energy_consumption_calculations_util_1.roundFixed)(numerator / denominator, mp_energy_consumption_calculations_util_1.ENERGY_CONSUMPTION_RATIO_DECIMALS);
}
function electricToKcal(electric, unit) {
    var normalized = String(unit !== null && unit !== void 0 ? unit : 'kWh')
        .trim()
        .toLowerCase();
    var kwh = normalized === 'mwh' ? electric * 1000 : electric;
    return kwh * 2750;
}
/** Row 14 — total energy (kCal), unrounded sum-friendly (matches admin/vendor tables). */
function computeTotalEnergyRow14Kcal(unit, year) {
    var thermal = 0;
    for (var _i = 0, _a = [1, 2, 3]; _i < _a.length; _i++) {
        var fuel = _a[_i];
        thermal +=
            yearNumber(unit, "ecdThermalFuel".concat(fuel, "Year").concat(year)) *
                yearNumber(unit, "ecdCalorificFuel".concat(fuel, "Year").concat(year));
    }
    var electric = yearNumber(unit, "ecdElectricYear".concat(year));
    return thermal + electricToKcal(electric, unit.ecdElectricUnit);
}
/** Renewable table row 6 — onsite total renewable energy consumed (kCal). */
function renewableOnsiteRow6Kcal(unit) {
    var _a;
    var baseKwh = yearNumber(unit, 'reSolarPhotovoltaic') + yearNumber(unit, 'reWind');
    var others = yearNumber(unit, 'reOthers');
    var othersUnit = String((_a = unit.reOthersUnit) !== null && _a !== void 0 ? _a : 'kWh')
        .trim()
        .toLowerCase();
    var othersKwh = othersUnit === 'kcal' ? 0 : others;
    var othersKcal = othersUnit === 'kcal' ? others : 0;
    return ((baseKwh + othersKwh) * 2750 +
        yearNumber(unit, 'reBiomass') +
        yearNumber(unit, 'reSolarThermal') +
        othersKcal);
}
/** Renewable table row 2 — offsite renewable energy consumed (kCal). */
function renewableOffsiteRow2Kcal(unit) {
    return yearNumber(unit, 'offsiteRenewablePower') * 2750;
}
/** Row 16 — reduction in overall SEC (%), prefer persisted `calculateBulkSec`. */
function energyConsumptionRow16Percent(unit) {
    var _a;
    var stored = readStoredBulkNumber(unit, 'calculateBulkSec', 'calculate_bulk_sec');
    if (stored != null)
        return stored;
    var sec1 = specificRatio(computeTotalEnergyRow14Kcal(unit, 1), yearNumber(unit, 'ecdProductionYear1'));
    var sec2 = specificRatio(computeTotalEnergyRow14Kcal(unit, 2), yearNumber(unit, 'ecdProductionYear2'));
    var sec3 = specificRatio(computeTotalEnergyRow14Kcal(unit, 3), yearNumber(unit, 'ecdProductionYear3'));
    return (_a = (0, mp_energy_consumption_calculations_util_1.computeReductionWithFallbackPercent)(sec1, sec2, sec3)) !== null && _a !== void 0 ? _a : 0;
}
/** Row 4 — reduction in specific water consumption (%), prefer persisted `calculateBulkSwc`. */
function waterConsumptionRow4Percent(unit) {
    var _a;
    var stored = readStoredBulkNumber(unit, 'calculateBulkSwc', 'calculate_bulk_swc');
    if (stored != null)
        return stored;
    var sw1 = specificRatio(yearNumber(unit, 'wcdWaterYear1'), yearNumber(unit, 'wcdProductionYear1'));
    var sw2 = specificRatio(yearNumber(unit, 'wcdWaterYear2'), yearNumber(unit, 'wcdProductionYear2'));
    var sw3 = specificRatio(yearNumber(unit, 'wcdWaterYear3'), yearNumber(unit, 'wcdProductionYear3'));
    return (_a = (0, mp_energy_consumption_calculations_util_1.computeReductionWithFallbackPercent)(sw1, sw2, sw3)) !== null && _a !== void 0 ? _a : 0;
}
function weightedAverageRowByReportingProduction(units, rowPercent, productionYearKey) {
    var weightedSum = 0;
    var weightTotal = 0;
    for (var _i = 0, units_1 = units; _i < units_1.length; _i++) {
        var unit = units_1[_i];
        var weight = yearNumber(unit, productionYearKey);
        if (weight <= 0)
            continue;
        weightedSum += rowPercent(unit) * weight;
        weightTotal += weight;
    }
    if (weightTotal <= 0)
        return 0;
    return (0, mp_energy_consumption_calculations_util_1.roundFixed)(weightedSum / weightTotal, mp_energy_consumption_calculations_util_1.ENERGY_CONSUMPTION_RATIO_DECIMALS);
}
/** URN-level manufacturing footer metrics (admin read model). */
function buildManufacturingWeightedTotals(units) {
    if (units.length === 0) {
        return {
            overallEnergyReductionPercent: 0,
            overallWaterReductionPercent: 0,
            overallRenewablePercent: 0,
        };
    }
    var sumRenewableKcal = 0;
    var sumTotalEnergyYear3 = 0;
    for (var _i = 0, units_2 = units; _i < units_2.length; _i++) {
        var unit = units_2[_i];
        sumRenewableKcal +=
            renewableOnsiteRow6Kcal(unit) + renewableOffsiteRow2Kcal(unit);
        sumTotalEnergyYear3 += computeTotalEnergyRow14Kcal(unit, 3);
    }
    return {
        overallEnergyReductionPercent: weightedAverageRowByReportingProduction(units, energyConsumptionRow16Percent, 'ecdProductionYear3'),
        overallWaterReductionPercent: weightedAverageRowByReportingProduction(units, waterConsumptionRow4Percent, 'wcdProductionYear3'),
        overallRenewablePercent: sumTotalEnergyYear3 > 0
            ? (0, mp_energy_consumption_calculations_util_1.roundFixed)((sumRenewableKcal / sumTotalEnergyYear3) * 100, mp_energy_consumption_calculations_util_1.ENERGY_CONSUMPTION_RATIO_DECIMALS)
            : 0,
    };
}
