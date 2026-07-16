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
exports.normalizeNumberArray = normalizeNumberArray;
exports.normalizeStatusLabels = normalizeStatusLabels;
exports.resolveVendorStatusFilter = resolveVendorStatusFilter;
exports.resolveManufacturerScopeFilter = resolveManufacturerScopeFilter;
function normalizeNumberArray(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    var source = Array.isArray(value) ? value : String(value).split(',');
    var parsed = source
        .map(function (v) { return Number(String(v).trim()); })
        .filter(function (v) { return Number.isFinite(v); });
    return parsed.length > 0 ? parsed : undefined;
}
/** UI labels from verified-manufacturers status multiselect. */
function normalizeStatusLabels(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    var source = Array.isArray(value) ? value : String(value).split(',');
    var out = new Set();
    for (var _i = 0, source_1 = source; _i < source_1.length; _i++) {
        var raw = source_1[_i];
        var v = String(raw).trim().toLowerCase();
        if (v === 'active' || v === '1' || v === 'on') {
            out.add('active');
        }
        else if (v === 'inactive' || v === '0' || v === 'off' || v === '2') {
            out.add('inactive');
        }
    }
    return out.size > 0 ? __spreadArray([], out, true) : undefined;
}
function resolveVendorStatusFilter(query) {
    var _a;
    var labels = query.status;
    if (labels === null || labels === void 0 ? void 0 : labels.length) {
        var wantsActive = labels.includes('active');
        var wantsInactive = labels.includes('inactive');
        if (wantsActive && wantsInactive) {
            return null;
        }
        if (wantsActive) {
            return { vendor_status: 1 };
        }
        if (wantsInactive) {
            return { vendor_status: { $ne: 1 } };
        }
    }
    var fromNumeric = ((_a = query.vendor_status_list) === null || _a === void 0 ? void 0 : _a.length)
        ? query.vendor_status_list
        : query.vendor_status !== undefined
            ? [query.vendor_status]
            : undefined;
    if (!(fromNumeric === null || fromNumeric === void 0 ? void 0 : fromNumeric.length)) {
        return null;
    }
    var codes = fromNumeric.filter(function (n) { return [0, 1, 2].includes(n); });
    if (!codes.length) {
        return null;
    }
    if (codes.length === 1) {
        return { vendor_status: codes[0] };
    }
    return { vendor_status: { $in: codes } };
}
function resolveManufacturerScopeFilter(query) {
    var _a;
    var scope = (_a = query.scope) !== null && _a !== void 0 ? _a : 'all';
    if (scope === 'verified') {
        return { manufacturerStatus: 1 };
    }
    if (scope === 'unverified') {
        return {
            manufacturerStatus: { $in: [0, 2] },
            /** Hide manufacturers still on the registration OTP step (`vendorPortalEmailVerified === false`). */
            vendorPortalEmailVerified: { $ne: false },
        };
    }
    if (query.manufacturerStatus !== undefined) {
        return { manufacturerStatus: query.manufacturerStatus };
    }
    return null;
}
