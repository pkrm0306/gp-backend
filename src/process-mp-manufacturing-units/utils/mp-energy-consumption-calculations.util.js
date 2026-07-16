"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENERGY_CONSUMPTION_RATIO_DECIMALS = void 0;
exports.roundFixed = roundFixed;
exports.normalizeMpManufacturingUnitEnergyInputs = normalizeMpManufacturingUnitEnergyInputs;
exports.computeTotalThermalEnergyConsumptionForYear = computeTotalThermalEnergyConsumptionForYear;
exports.computeSpecificConsumptionRatio = computeSpecificConsumptionRatio;
exports.computeReductionInSpecificConsumptionPercent = computeReductionInSpecificConsumptionPercent;
exports.computeTotalEnergyConsumptionForYear = computeTotalEnergyConsumptionForYear;
exports.computeOverallSpecificEnergyConsumptionForYear = computeOverallSpecificEnergyConsumptionForYear;
exports.computeReductionWithFallbackPercent = computeReductionWithFallbackPercent;
exports.formatMultipledConsumptionValues = formatMultipledConsumptionValues;
exports.parseMultipledConsumptionValues = parseMultipledConsumptionValues;
exports.computeEnergyConsumptionDerivedFields = computeEnergyConsumptionDerivedFields;
exports.enrichMpManufacturingUnitCalculations = enrichMpManufacturingUnitCalculations;
exports.pickPersistedEnergyCalculationFields = pickPersistedEnergyCalculationFields;
exports.ENERGY_CONSUMPTION_RATIO_DECIMALS = 2;
var ECD_NUMERIC_FIELDS = [
    'ecdProductionYear1',
    'ecdProductionYear2',
    'ecdProductionYear3',
    'ecdElectricYear1',
    'ecdElectricYear2',
    'ecdElectricYear3',
    'wcdProductionYear1',
    'wcdProductionYear2',
    'wcdProductionYear3',
    'wcdWaterYear1',
    'wcdWaterYear2',
    'wcdWaterYear3',
];
function roundFixed(value, decimals) {
    if (!Number.isFinite(value))
        return NaN;
    var factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
}
function toPositiveNumber(raw) {
    if (raw === undefined || raw === null || raw === '')
        return null;
    var n = typeof raw === 'number' ? raw : Number(String(raw).trim());
    if (!Number.isFinite(n) || n < 0)
        return null;
    return n;
}
var THERMAL_FUEL_INDICES = [1, 2, 3];
var THERMAL_YEAR_SUFFIXES = [1, 2, 3];
/** Coerce string/number year columns before ratio math. */
function normalizeMpManufacturingUnitEnergyInputs(unit) {
    var out = __assign({}, unit);
    for (var _i = 0, ECD_NUMERIC_FIELDS_1 = ECD_NUMERIC_FIELDS; _i < ECD_NUMERIC_FIELDS_1.length; _i++) {
        var field = ECD_NUMERIC_FIELDS_1[_i];
        var raw = out[field];
        if (raw === undefined || raw === null || raw === '')
            continue;
        var n = typeof raw === 'number' ? raw : Number(String(raw).trim());
        if (Number.isFinite(n)) {
            out[field] = n;
        }
    }
    for (var _a = 0, THERMAL_YEAR_SUFFIXES_1 = THERMAL_YEAR_SUFFIXES; _a < THERMAL_YEAR_SUFFIXES_1.length; _a++) {
        var year = THERMAL_YEAR_SUFFIXES_1[_a];
        for (var _b = 0, THERMAL_FUEL_INDICES_1 = THERMAL_FUEL_INDICES; _b < THERMAL_FUEL_INDICES_1.length; _b++) {
            var fuel = THERMAL_FUEL_INDICES_1[_b];
            for (var _c = 0, _d = ['ecdThermalFuel', 'ecdCalorificFuel']; _c < _d.length; _c++) {
                var prefix = _d[_c];
                var field = "".concat(prefix).concat(fuel, "Year").concat(year);
                var raw = out[field];
                if (raw === undefined || raw === null || raw === '')
                    continue;
                var n = typeof raw === 'number' ? raw : Number(String(raw).trim());
                if (Number.isFinite(n)) {
                    out[field] = n;
                }
            }
        }
    }
    return out;
}
/** Row 11 — sum(thermal fuel × calorific value) per year, rounded to 2 decimals. */
function computeTotalThermalEnergyConsumptionForYear(unit, year) {
    var total = 0;
    var hasAny = false;
    for (var _i = 0, THERMAL_FUEL_INDICES_2 = THERMAL_FUEL_INDICES; _i < THERMAL_FUEL_INDICES_2.length; _i++) {
        var fuel = THERMAL_FUEL_INDICES_2[_i];
        var thermal = toPositiveNumber(unit["ecdThermalFuel".concat(fuel, "Year").concat(year)]);
        var calorific = toPositiveNumber(unit["ecdCalorificFuel".concat(fuel, "Year").concat(year)]);
        if (thermal === null || calorific === null)
            continue;
        total += thermal * calorific;
        hasAny = true;
    }
    if (!hasAny)
        return null;
    return roundFixed(total, exports.ENERGY_CONSUMPTION_RATIO_DECIMALS);
}
/** Specific consumption = numerator / denominator, rounded to 2 decimals (row 3). */
function computeSpecificConsumptionRatio(numerator, denominator) {
    var n = toPositiveNumber(numerator);
    var d = toPositiveNumber(denominator);
    if (n === null || d === null || d === 0)
        return null;
    return roundFixed(n / d, exports.ENERGY_CONSUMPTION_RATIO_DECIMALS);
}
/**
 * Row 4 — reduction in specific consumption (%), shown in the first year column only.
 * Uses **rounded** row-3 values (year 1 vs year 3), not full-precision ratios.
 */
function computeReductionInSpecificConsumptionPercent(firstYearRatio, lastYearRatio) {
    if (firstYearRatio === null ||
        lastYearRatio === null ||
        firstYearRatio <= 0) {
        return null;
    }
    return roundFixed(((firstYearRatio - lastYearRatio) / firstYearRatio) * 100, exports.ENERGY_CONSUMPTION_RATIO_DECIMALS);
}
function electricConsumptionToKcal(electric, unit) {
    var normalized = String(unit !== null && unit !== void 0 ? unit : 'kWh')
        .trim()
        .toLowerCase();
    var kwh = normalized === 'mwh' ? electric * 1000 : electric;
    return kwh * 2750;
}
/** Row 14 — total energy (electric kCal + thermal kCal) per year. */
function computeTotalEnergyConsumptionForYear(unit, year) {
    var thermal = computeTotalThermalEnergyConsumptionForYear(unit, year);
    var electric = toPositiveNumber(unit["ecdElectricYear".concat(year)]);
    if (thermal === null && electric === null) {
        return null;
    }
    var electricKcal = electric === null
        ? 0
        : electricConsumptionToKcal(electric, unit.ecdElectricUnit);
    return roundFixed((thermal !== null && thermal !== void 0 ? thermal : 0) + electricKcal, exports.ENERGY_CONSUMPTION_RATIO_DECIMALS);
}
/** Row 15 — overall specific energy consumption (kCal / production unit). */
function computeOverallSpecificEnergyConsumptionForYear(unit, year) {
    return computeSpecificConsumptionRatio(computeTotalEnergyConsumptionForYear(unit, year), unit["ecdProductionYear".concat(year)]);
}
/** Vendor-aligned reduction: prefer base year 1, else year 2, vs reporting year. */
function computeReductionWithFallbackPercent(baseYear1, baseYear2, reportingYear) {
    if (baseYear1 !== null && baseYear1 > 0 && reportingYear !== null) {
        return computeReductionInSpecificConsumptionPercent(baseYear1, reportingYear);
    }
    if (baseYear2 !== null && baseYear2 > 0 && reportingYear !== null) {
        return computeReductionInSpecificConsumptionPercent(baseYear2, reportingYear);
    }
    return null;
}
function formatMultipledConsumptionValues(values) {
    return values
        .map(function (value) {
        return value === null ? '' : value.toFixed(exports.ENERGY_CONSUMPTION_RATIO_DECIMALS);
    })
        .join(',');
}
function parseMultipledConsumptionValues(raw) {
    if (!raw || !String(raw).trim())
        return [null, null, null];
    return String(raw)
        .split(',')
        .map(function (part) {
        var trimmed = part.trim();
        if (!trimmed)
            return null;
        var n = Number(trimmed);
        return Number.isFinite(n) ? n : null;
    });
}
function computeEnergyConsumptionDerivedFields(unit) {
    var normalized = normalizeMpManufacturingUnitEnergyInputs(unit);
    var totalThermalYear1 = computeTotalThermalEnergyConsumptionForYear(normalized, 1);
    var totalThermalYear2 = computeTotalThermalEnergyConsumptionForYear(normalized, 2);
    var totalThermalYear3 = computeTotalThermalEnergyConsumptionForYear(normalized, 3);
    var stecYear1 = computeSpecificConsumptionRatio(totalThermalYear1, normalized.ecdProductionYear1);
    var stecYear2 = computeSpecificConsumptionRatio(totalThermalYear2, normalized.ecdProductionYear2);
    var stecYear3 = computeSpecificConsumptionRatio(totalThermalYear3, normalized.ecdProductionYear3);
    var stecReduction = computeReductionInSpecificConsumptionPercent(stecYear1, stecYear3);
    var secYear1 = computeSpecificConsumptionRatio(normalized.ecdElectricYear1, normalized.ecdProductionYear1);
    var secYear2 = computeSpecificConsumptionRatio(normalized.ecdElectricYear2, normalized.ecdProductionYear2);
    var secYear3 = computeSpecificConsumptionRatio(normalized.ecdElectricYear3, normalized.ecdProductionYear3);
    var swcYear1 = computeSpecificConsumptionRatio(normalized.wcdWaterYear1, normalized.wcdProductionYear1);
    var swcYear2 = computeSpecificConsumptionRatio(normalized.wcdWaterYear2, normalized.wcdProductionYear2);
    var swcYear3 = computeSpecificConsumptionRatio(normalized.wcdWaterYear3, normalized.wcdProductionYear3);
    var secReduction = computeReductionInSpecificConsumptionPercent(secYear1, secYear3);
    var overallSecYear1 = computeOverallSpecificEnergyConsumptionForYear(normalized, 1);
    var overallSecYear2 = computeOverallSpecificEnergyConsumptionForYear(normalized, 2);
    var overallSecYear3 = computeOverallSpecificEnergyConsumptionForYear(normalized, 3);
    var overallSecReduction = computeReductionWithFallbackPercent(overallSecYear1, overallSecYear2, overallSecYear3);
    var swcReduction = computeReductionWithFallbackPercent(swcYear1, swcYear2, swcYear3);
    return {
        calculateBulkTecMultipled: formatMultipledConsumptionValues([
            totalThermalYear1,
            totalThermalYear2,
            totalThermalYear3,
        ]),
        calculateBulkStecMultipled: formatMultipledConsumptionValues([
            stecYear1,
            stecYear2,
            stecYear3,
        ]),
        calculateBulkStec: stecReduction,
        calculateBulkSecMultipled: formatMultipledConsumptionValues([
            overallSecYear1,
            overallSecYear2,
            overallSecYear3,
        ]),
        calculateBulkSec: overallSecReduction,
        calculateBulkSwcMultipled: formatMultipledConsumptionValues([
            swcYear1,
            swcYear2,
            swcYear3,
        ]),
        calculateBulkSwc: swcReduction,
        totalThermalEnergyConsumptionYear1: totalThermalYear1,
        totalThermalEnergyConsumptionYear2: totalThermalYear2,
        totalThermalEnergyConsumptionYear3: totalThermalYear3,
        specificThermalEnergyConsumptionYear1: stecYear1,
        specificThermalEnergyConsumptionYear2: stecYear2,
        specificThermalEnergyConsumptionYear3: stecYear3,
        reductionInSpecificThermalEnergyConsumptionYear1: stecReduction,
        reductionInSpecificThermalEnergyConsumptionYear2: null,
        reductionInSpecificThermalEnergyConsumptionYear3: null,
        specificElectricalEnergyConsumptionYear1: secYear1,
        specificElectricalEnergyConsumptionYear2: secYear2,
        specificElectricalEnergyConsumptionYear3: secYear3,
        reductionInSpecificElectricalEnergyConsumptionYear1: secReduction,
        reductionInSpecificElectricalEnergyConsumptionYear2: null,
        reductionInSpecificElectricalEnergyConsumptionYear3: null,
        specificWaterConsumptionYear1: swcYear1,
        specificWaterConsumptionYear2: swcYear2,
        specificWaterConsumptionYear3: swcYear3,
        reductionInSpecificWaterConsumptionYear1: swcReduction,
        reductionInSpecificWaterConsumptionYear2: null,
        reductionInSpecificWaterConsumptionYear3: null,
    };
}
/** Apply derived SEC/SWC fields on save and API responses. */
function enrichMpManufacturingUnitCalculations(unit) {
    var derived = computeEnergyConsumptionDerivedFields(unit);
    return __assign(__assign({}, unit), { calculateBulkTecMultipled: derived.calculateBulkTecMultipled, calculateBulkStecMultipled: derived.calculateBulkStecMultipled, calculateBulkStec: derived.calculateBulkStec, calculateBulkSecMultipled: derived.calculateBulkSecMultipled, calculateBulkSec: derived.calculateBulkSec, calculateBulkSwcMultipled: derived.calculateBulkSwcMultipled, calculateBulkSwc: derived.calculateBulkSwc, energyConsumptionDetails: {
            totalThermalEnergyConsumption: {
                year1: derived.totalThermalEnergyConsumptionYear1,
                year2: derived.totalThermalEnergyConsumptionYear2,
                year3: derived.totalThermalEnergyConsumptionYear3,
            },
            specificThermalEnergyConsumption: {
                year1: derived.specificThermalEnergyConsumptionYear1,
                year2: derived.specificThermalEnergyConsumptionYear2,
                year3: derived.specificThermalEnergyConsumptionYear3,
            },
            reductionInSpecificThermalEnergyConsumption: {
                year1: derived.reductionInSpecificThermalEnergyConsumptionYear1,
                year2: derived.reductionInSpecificThermalEnergyConsumptionYear2,
                year3: derived.reductionInSpecificThermalEnergyConsumptionYear3,
            },
            specificElectricalEnergyConsumption: {
                year1: derived.specificElectricalEnergyConsumptionYear1,
                year2: derived.specificElectricalEnergyConsumptionYear2,
                year3: derived.specificElectricalEnergyConsumptionYear3,
            },
            reductionInSpecificElectricalEnergyConsumption: {
                year1: derived.reductionInSpecificElectricalEnergyConsumptionYear1,
                year2: derived.reductionInSpecificElectricalEnergyConsumptionYear2,
                year3: derived.reductionInSpecificElectricalEnergyConsumptionYear3,
            },
            specificWaterConsumption: {
                year1: derived.specificWaterConsumptionYear1,
                year2: derived.specificWaterConsumptionYear2,
                year3: derived.specificWaterConsumptionYear3,
            },
            reductionInSpecificWaterConsumption: {
                year1: derived.reductionInSpecificWaterConsumptionYear1,
                year2: derived.reductionInSpecificWaterConsumptionYear2,
                year3: derived.reductionInSpecificWaterConsumptionYear3,
            },
        } });
}
function pickPersistedEnergyCalculationFields(unit) {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        calculateBulkTecMultipled: (_a = unit.calculateBulkTecMultipled) !== null && _a !== void 0 ? _a : '',
        calculateBulkStec: (_b = unit.calculateBulkStec) !== null && _b !== void 0 ? _b : null,
        calculateBulkStecMultipled: (_c = unit.calculateBulkStecMultipled) !== null && _c !== void 0 ? _c : '',
        calculateBulkSec: (_d = unit.calculateBulkSec) !== null && _d !== void 0 ? _d : null,
        calculateBulkSecMultipled: (_e = unit.calculateBulkSecMultipled) !== null && _e !== void 0 ? _e : '',
        calculateBulkSwc: (_f = unit.calculateBulkSwc) !== null && _f !== void 0 ? _f : null,
        calculateBulkSwcMultipled: (_g = unit.calculateBulkSwcMultipled) !== null && _g !== void 0 ? _g : '',
    };
}
