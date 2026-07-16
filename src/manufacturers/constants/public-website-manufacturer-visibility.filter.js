"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchPublicWebsiteManufacturerVisibility = matchPublicWebsiteManufacturerVisibility;
/**
 * Public website visibility for a manufacturer document (or nested `manufacturer.*`).
 * Inactive / soft-deleted accounts must not appear with certified products on the website.
 */
function matchPublicWebsiteManufacturerVisibility(fieldPrefix) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (fieldPrefix === void 0) { fieldPrefix = 'manufacturer'; }
    var p = fieldPrefix ? "".concat(fieldPrefix, ".") : '';
    var statusField = "".concat(p, "manufacturerStatus");
    var vendorStatusField = "".concat(p, "vendor_status");
    var vendorStatusAltField = "".concat(p, "vendorStatus");
    var deletedAtField = "".concat(p, "accountDeletedAt");
    return {
        $and: [
            {
                $or: [
                    (_a = {}, _a[statusField] = { $exists: false }, _a),
                    (_b = {}, _b[statusField] = null, _b),
                    (_c = {}, _c[statusField] = 1, _c),
                    (_d = {}, _d[statusField] = true, _d),
                ],
            },
            {
                $nor: [
                    (_e = {}, _e[vendorStatusField] = 0, _e),
                    (_f = {}, _f[vendorStatusField] = '0', _f),
                    (_g = {}, _g[vendorStatusField] = false, _g),
                    (_h = {}, _h[vendorStatusAltField] = 0, _h),
                    (_j = {}, _j[vendorStatusAltField] = '0', _j),
                    (_k = {}, _k[vendorStatusAltField] = false, _k),
                ],
            },
            {
                $or: [
                    (_l = {}, _l[deletedAtField] = { $exists: false }, _l),
                    (_m = {}, _m[deletedAtField] = null, _m),
                ],
            },
        ],
    };
}
