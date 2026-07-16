"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MP_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS = void 0;
exports.assertMpManufacturingUnitNonNegativeNumbers = assertMpManufacturingUnitNonNegativeNumbers;
var common_1 = require("@nestjs/common");
/** Numeric columns on process_mp_manufacturing_units (energy / water / renewable). Excludes **calculateBulkSec** / **calculateBulkSwc** / **calculateBulkStec** — those may be negative from auto-calculation. */
exports.MP_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS = [
    'ecdProductionYear1',
    'ecdProductionYear2',
    'ecdProductionYear3',
    'ecdElectricYear1',
    'ecdElectricYear2',
    'ecdElectricYear3',
    'ecdThermalFuel1Year1',
    'ecdThermalFuel1Year2',
    'ecdThermalFuel1Year3',
    'ecdThermalFuel2Year1',
    'ecdThermalFuel2Year2',
    'ecdThermalFuel2Year3',
    'ecdThermalFuel3Year1',
    'ecdThermalFuel3Year2',
    'ecdThermalFuel3Year3',
    'ecdCalorificFuel1Year1',
    'ecdCalorificFuel1Year2',
    'ecdCalorificFuel1Year3',
    'ecdCalorificFuel2Year1',
    'ecdCalorificFuel2Year2',
    'ecdCalorificFuel2Year3',
    'ecdCalorificFuel3Year1',
    'ecdCalorificFuel3Year2',
    'ecdCalorificFuel3Year3',
    'wcdProductionYear1',
    'wcdProductionYear2',
    'wcdProductionYear3',
    'wcdWaterYear1',
    'wcdWaterYear2',
    'wcdWaterYear3',
    'reSolarPhotovoltaic',
    'reWind',
    'reBiomass',
    'reSolarThermal',
    'reOthers',
    'offsiteRenewablePower',
];
var FIELD_LABELS = {
    ecdProductionYear1: 'Production year 1',
    ecdProductionYear2: 'Production year 2',
    ecdProductionYear3: 'Production year 3',
    ecdElectricYear1: 'Electric energy year 1',
    ecdElectricYear2: 'Electric energy year 2',
    ecdElectricYear3: 'Electric energy year 3',
};
function labelForField(field) {
    var _a;
    return ((_a = FIELD_LABELS[field]) !== null && _a !== void 0 ? _a : field.replace(/([A-Z])/g, ' $1').replace(/^./, function (c) { return c.toUpperCase(); }));
}
/** Rejects negative numbers on energy-consumption table fields (vendor save). */
function assertMpManufacturingUnitNonNegativeNumbers(payload) {
    var fieldErrors = {};
    var issues = [];
    for (var _i = 0, MP_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS_1 = exports.MP_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS; _i < MP_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS_1.length; _i++) {
        var field = MP_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS_1[_i];
        var raw = payload[field];
        if (raw === undefined || raw === null || raw === '')
            continue;
        var n = typeof raw === 'number' ? raw : Number(raw);
        if (!Number.isFinite(n)) {
            var message = "".concat(labelForField(field), " must be a valid number");
            fieldErrors[field] = message;
            issues.push({ field: field, message: message });
            continue;
        }
        if (n < 0) {
            var message = "".concat(labelForField(field), " cannot be negative");
            fieldErrors[field] = message;
            issues.push({ field: field, message: message });
        }
    }
    if (issues.length > 0) {
        throw new common_1.BadRequestException({
            code: 'VALIDATION_ERROR',
            message: issues.length === 1
                ? issues[0].message
                : 'Values in the energy consumption table cannot be negative',
            fieldErrors: fieldErrors,
            issues: issues,
        });
    }
}
