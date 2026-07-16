"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSummitBasicInput = normalizeSummitBasicInput;
var summit_status_util_1 = require("./summit-status.util");
var BASIC_KEYS = [
    'year',
    'title',
    'date',
    'location',
    'status',
];
/**
 * Accepts flat `{ year, title, ... }` or nested `{ basic: { year, ... } }`
 * (admin section save and some full PATCH clients).
 */
function normalizeSummitBasicInput(body) {
    var _a;
    if (!body || typeof body !== 'object')
        return undefined;
    var root = body;
    var nested = root.basic && typeof root.basic === 'object' && !Array.isArray(root.basic)
        ? root.basic
        : undefined;
    var merged = {};
    for (var _i = 0, BASIC_KEYS_1 = BASIC_KEYS; _i < BASIC_KEYS_1.length; _i++) {
        var key = BASIC_KEYS_1[_i];
        var value = (_a = nested === null || nested === void 0 ? void 0 : nested[key]) !== null && _a !== void 0 ? _a : root[key];
        if (key === 'status') {
            if (value !== undefined && value !== null) {
                merged.status = (0, summit_status_util_1.normalizeSummitStatus)(value);
            }
            continue;
        }
        if (value !== undefined && value !== null && value !== '') {
            merged[key] = value;
        }
    }
    return Object.keys(merged).length > 0 ? merged : undefined;
}
