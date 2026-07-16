"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhoneDigits = normalizePhoneDigits;
exports.buildPhoneLookupVariants = buildPhoneLookupVariants;
exports.buildPhoneFieldMatchClauses = buildPhoneFieldMatchClauses;
/** Strip to digits only for cross-format comparison. */
function normalizePhoneDigits(mobile) {
    return String(mobile !== null && mobile !== void 0 ? mobile : '').replace(/\D/g, '');
}
/** Common stored formats for the same mobile (e.g. +91…, digits-only). */
function buildPhoneLookupVariants(mobile) {
    var trimmed = String(mobile !== null && mobile !== void 0 ? mobile : '').trim();
    var digits = normalizePhoneDigits(trimmed);
    var variants = new Set();
    if (trimmed) {
        variants.add(trimmed);
    }
    if (digits) {
        variants.add(digits);
        variants.add("+".concat(digits));
        if (digits.length === 10) {
            variants.add("+91".concat(digits));
            variants.add("91".concat(digits));
        }
        if (digits.length === 12 && digits.startsWith('91')) {
            var local = digits.slice(2);
            variants.add(local);
            variants.add("+91".concat(local));
        }
    }
    return __spreadArray([], variants, true);
}
/**
 * MongoDB $or clauses for a phone field: exact variants plus flexible match on
 * the last 10 digits (catches +91 / spaces vs vendor panel storage).
 */
function buildPhoneFieldMatchClauses(fieldName, mobile) {
    var _a, _b;
    var clauses = [];
    var variants = buildPhoneLookupVariants(mobile);
    if (variants.length) {
        clauses.push((_a = {}, _a[fieldName] = { $in: variants }, _a));
    }
    var digits = normalizePhoneDigits(mobile);
    if (digits.length >= 10) {
        var last10 = digits.slice(-10);
        var flex = last10.split('').join('\\D*');
        clauses.push((_b = {},
            _b[fieldName] = {
                $regex: new RegExp("(^|\\+|\\d)".concat(flex, "\\s*$"), 'i'),
            },
            _b));
    }
    return clauses;
}
