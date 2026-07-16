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
exports.ACTIVE_PRODUCT_PLANT_FILTER = exports.ACTIVE_PRODUCT_FILTER = void 0;
exports.matchActiveProducts = matchActiveProducts;
exports.matchActiveProductPlants = matchActiveProductPlants;
/**
 * MongoDB filters for non–soft-deleted Product / ProductPlant records.
 * Treats missing flags as active for backward compatibility with legacy rows.
 */
exports.ACTIVE_PRODUCT_FILTER = {
    $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
};
exports.ACTIVE_PRODUCT_PLANT_FILTER = {
    $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
};
/** Merge additional match criteria with the active-product predicate. */
function matchActiveProducts(criteria) {
    if (criteria === void 0) { criteria = {}; }
    return __assign(__assign({}, criteria), exports.ACTIVE_PRODUCT_FILTER);
}
function matchActiveProductPlants(criteria) {
    if (criteria === void 0) { criteria = {}; }
    return __assign(__assign({}, criteria), exports.ACTIVE_PRODUCT_PLANT_FILTER);
}
