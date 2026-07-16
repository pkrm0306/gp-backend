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
exports.WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS = void 0;
exports.normalizeWmManufacturingUnitNumericInputs = normalizeWmManufacturingUnitNumericInputs;
exports.assertWmManufacturingUnitNonNegativeNumbers = assertWmManufacturingUnitNonNegativeNumbers;
var common_1 = require("@nestjs/common");
var parse_optional_number_util_1 = require("../../common/utils/parse-optional-number.util");
/** Numeric columns on process_wm_manufacturing_units (waste tables). */
exports.WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS = [
    'hazardousWasteProductionYear1',
    'hazardousWasteProductionYear2',
    'hazardousWasteProductionYear3',
    'hazardousWasteQuantityYear1',
    'hazardousWasteQuantityYear2',
    'hazardousWasteQuantityYear3',
    'nonHazardousWasteProductionYear1',
    'nonHazardousWasteProductionYear2',
    'nonHazardousWasteProductionYear3',
    'nonHazardousWasteWaterYear1',
    'nonHazardousWasteWaterYear2',
    'nonHazardousWasteWaterYear3',
];
function labelForField(field) {
    return field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function (c) { return c.toUpperCase(); });
}
function normalizeWmManufacturingUnitNumericInputs(unit) {
    var out = __assign({}, unit);
    for (var _i = 0, WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS_1 = exports.WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS; _i < WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS_1.length; _i++) {
        var field = WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS_1[_i];
        var parsed = (0, parse_optional_number_util_1.parseOptionalDecimalNumber)(out[field]);
        if (parsed !== undefined) {
            out[field] = parsed;
        }
    }
    return out;
}
/** Rejects negative numbers on waste-management table fields (vendor save). */
function assertWmManufacturingUnitNonNegativeNumbers(payload) {
    var fieldErrors = {};
    var issues = [];
    for (var _i = 0, WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS_2 = exports.WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS; _i < WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS_2.length; _i++) {
        var field = WM_MANUFACTURING_UNIT_NON_NEGATIVE_NUMBER_FIELDS_2[_i];
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
                : 'Values in the waste management table cannot be negative',
            fieldErrors: fieldErrors,
            issues: issues,
        });
    }
}
