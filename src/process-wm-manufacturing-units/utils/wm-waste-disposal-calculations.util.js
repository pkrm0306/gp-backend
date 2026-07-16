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
exports.computeWmWasteDisposalDerivedFields = computeWmWasteDisposalDerivedFields;
exports.enrichWmManufacturingUnitCalculations = enrichWmManufacturingUnitCalculations;
exports.pickPersistedWmCalculationFields = pickPersistedWmCalculationFields;
var mp_energy_consumption_calculations_util_1 = require("../../process-mp-manufacturing-units/utils/mp-energy-consumption-calculations.util");
var wm_manufacturing_unit_numeric_fields_util_1 = require("./wm-manufacturing-unit-numeric-fields.util");
function computeWmWasteDisposalDerivedFields(unit) {
    var normalized = (0, wm_manufacturing_unit_numeric_fields_util_1.normalizeWmManufacturingUnitNumericInputs)(unit);
    var shwdYear1 = (0, mp_energy_consumption_calculations_util_1.computeSpecificConsumptionRatio)(normalized.hazardousWasteQuantityYear1, normalized.hazardousWasteProductionYear1);
    var shwdYear2 = (0, mp_energy_consumption_calculations_util_1.computeSpecificConsumptionRatio)(normalized.hazardousWasteQuantityYear2, normalized.hazardousWasteProductionYear2);
    var shwdYear3 = (0, mp_energy_consumption_calculations_util_1.computeSpecificConsumptionRatio)(normalized.hazardousWasteQuantityYear3, normalized.hazardousWasteProductionYear3);
    var snhwdYear1 = (0, mp_energy_consumption_calculations_util_1.computeSpecificConsumptionRatio)(normalized.nonHazardousWasteWaterYear1, normalized.nonHazardousWasteProductionYear1);
    var snhwdYear2 = (0, mp_energy_consumption_calculations_util_1.computeSpecificConsumptionRatio)(normalized.nonHazardousWasteWaterYear2, normalized.nonHazardousWasteProductionYear2);
    var snhwdYear3 = (0, mp_energy_consumption_calculations_util_1.computeSpecificConsumptionRatio)(normalized.nonHazardousWasteWaterYear3, normalized.nonHazardousWasteProductionYear3);
    var rshwdReduction = (0, mp_energy_consumption_calculations_util_1.computeReductionWithFallbackPercent)(shwdYear1, shwdYear2, shwdYear3);
    var rsnhwdReduction = (0, mp_energy_consumption_calculations_util_1.computeReductionWithFallbackPercent)(snhwdYear1, snhwdYear2, snhwdYear3);
    var hazProd3 = normalized.hazardousWasteProductionYear3;
    var nonHazProd3 = normalized.nonHazardousWasteProductionYear3;
    return {
        calculateBulkRshwdMultipled: formatVendorWasteBulkMultipled(rshwdReduction, hazProd3, [shwdYear1, shwdYear2, shwdYear3]),
        calculateBulkRshwd: rshwdReduction,
        calculateBulkRsnhwdMultipled: formatVendorWasteBulkMultipled(rsnhwdReduction, nonHazProd3, [snhwdYear1, snhwdYear2, snhwdYear3]),
        calculateBulkRsnhwd: rsnhwdReduction,
        specificHazardousWasteDisposalYear1: shwdYear1,
        specificHazardousWasteDisposalYear2: shwdYear2,
        specificHazardousWasteDisposalYear3: shwdYear3,
        reductionInSpecificHazardousWasteDisposalYear1: rshwdReduction,
        reductionInSpecificHazardousWasteDisposalYear2: null,
        reductionInSpecificHazardousWasteDisposalYear3: null,
        specificNonHazardousWasteDisposalYear1: snhwdYear1,
        specificNonHazardousWasteDisposalYear2: snhwdYear2,
        specificNonHazardousWasteDisposalYear3: snhwdYear3,
        reductionInSpecificNonHazardousWasteDisposalYear1: rsnhwdReduction,
        reductionInSpecificNonHazardousWasteDisposalYear2: null,
        reductionInSpecificNonHazardousWasteDisposalYear3: null,
    };
}
function readPersistedBulkNumber(raw) {
    if (raw == null || raw === '')
        return null;
    var n = typeof raw === 'number' ? raw : Number(String(raw).trim());
    return Number.isFinite(n) ? n : null;
}
function readPersistedBulkMultipled(raw) {
    if (raw == null)
        return null;
    var value = String(raw).trim();
    return value ? value : null;
}
/** Vendor stores `bulkReduction × productionYear3` as a single number string. */
function formatVendorWasteBulkMultipled(reduction, productionYear3, specificYearCsvFallback) {
    var prod = readPersistedBulkNumber(productionYear3);
    if (reduction !== null && prod !== null && prod > 0) {
        return String((0, mp_energy_consumption_calculations_util_1.roundFixed)(reduction * prod, 4));
    }
    return (0, mp_energy_consumption_calculations_util_1.formatMultipledConsumptionValues)(specificYearCsvFallback);
}
function enrichWmManufacturingUnitCalculations(unit) {
    var derived = computeWmWasteDisposalDerivedFields(unit);
    var persistedRshwd = readPersistedBulkNumber(unit.calculateBulkRshwd);
    var persistedRsnhwd = readPersistedBulkNumber(unit.calculateBulkRsnhwd);
    var persistedRshwdMultipled = readPersistedBulkMultipled(unit.calculateBulkRshwdMultipled);
    var persistedRsnhwdMultipled = readPersistedBulkMultipled(unit.calculateBulkRsnhwdMultipled);
    return __assign(__assign({}, unit), { calculateBulkRshwdMultipled: persistedRshwdMultipled !== null && persistedRshwdMultipled !== void 0 ? persistedRshwdMultipled : derived.calculateBulkRshwdMultipled, calculateBulkRshwd: persistedRshwd !== null && persistedRshwd !== void 0 ? persistedRshwd : derived.calculateBulkRshwd, calculateBulkRsnhwdMultipled: persistedRsnhwdMultipled !== null && persistedRsnhwdMultipled !== void 0 ? persistedRsnhwdMultipled : derived.calculateBulkRsnhwdMultipled, calculateBulkRsnhwd: persistedRsnhwd !== null && persistedRsnhwd !== void 0 ? persistedRsnhwd : derived.calculateBulkRsnhwd, wasteDisposalDetails: {
            specificHazardousWasteDisposal: {
                year1: derived.specificHazardousWasteDisposalYear1,
                year2: derived.specificHazardousWasteDisposalYear2,
                year3: derived.specificHazardousWasteDisposalYear3,
            },
            reductionInSpecificHazardousWasteDisposal: {
                year1: derived.reductionInSpecificHazardousWasteDisposalYear1,
                year2: derived.reductionInSpecificHazardousWasteDisposalYear2,
                year3: derived.reductionInSpecificHazardousWasteDisposalYear3,
            },
            specificNonHazardousWasteDisposal: {
                year1: derived.specificNonHazardousWasteDisposalYear1,
                year2: derived.specificNonHazardousWasteDisposalYear2,
                year3: derived.specificNonHazardousWasteDisposalYear3,
            },
            reductionInSpecificNonHazardousWasteDisposal: {
                year1: derived.reductionInSpecificNonHazardousWasteDisposalYear1,
                year2: derived.reductionInSpecificNonHazardousWasteDisposalYear2,
                year3: derived.reductionInSpecificNonHazardousWasteDisposalYear3,
            },
        } });
}
function pickPersistedWmCalculationFields(unit) {
    var _a, _b, _c, _d;
    return {
        calculateBulkRshwd: (_a = unit.calculateBulkRshwd) !== null && _a !== void 0 ? _a : null,
        calculateBulkRshwdMultipled: (_b = unit.calculateBulkRshwdMultipled) !== null && _b !== void 0 ? _b : '',
        calculateBulkRsnhwd: (_c = unit.calculateBulkRsnhwd) !== null && _c !== void 0 ? _c : null,
        calculateBulkRsnhwdMultipled: (_d = unit.calculateBulkRsnhwdMultipled) !== null && _d !== void 0 ? _d : '',
    };
}
