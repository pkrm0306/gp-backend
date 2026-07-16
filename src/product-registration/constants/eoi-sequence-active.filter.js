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
exports.EOI_SEQUENCE_ACTIVE_STATUSES = void 0;
exports.matchEoiSequenceActiveProducts = matchEoiSequenceActiveProducts;
var active_product_filter_1 = require("./active-product.filter");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
/** Products that participate in manufacturer EOI max-sequence calculation. */
exports.EOI_SEQUENCE_ACTIVE_STATUSES = [
    product_status_constants_1.PRODUCT_STATUS_PENDING,
    product_status_constants_1.PRODUCT_STATUS_SUBMITTED,
    product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
];
function matchEoiSequenceActiveProducts(criteria) {
    if (criteria === void 0) { criteria = {}; }
    return __assign(__assign(__assign({}, criteria), active_product_filter_1.ACTIVE_PRODUCT_FILTER), { productStatus: { $in: __spreadArray([], exports.EOI_SEQUENCE_ACTIVE_STATUSES, true) } });
}
