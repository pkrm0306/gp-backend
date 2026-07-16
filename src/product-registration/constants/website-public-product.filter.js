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
exports.WEBSITE_PUBLIC_CERTIFIED_PRODUCT_STATUS = void 0;
exports.matchWebsitePublicCertifiedProducts = matchWebsitePublicCertifiedProducts;
exports.matchWebsitePublicActiveCertifiedProducts = matchWebsitePublicActiveCertifiedProducts;
var active_product_filter_1 = require("./active-product.filter");
/** Certified EOI rows shown on the public website product grid. */
exports.WEBSITE_PUBLIC_CERTIFIED_PRODUCT_STATUS = 2;
function matchWebsitePublicCertifiedProducts(criteria) {
    if (criteria === void 0) { criteria = {}; }
    return (0, active_product_filter_1.matchActiveProducts)(__assign({ productStatus: exports.WEBSITE_PUBLIC_CERTIFIED_PRODUCT_STATUS }, criteria));
}
/** Certified EOIs shown on the public website (active certificate, not past validtillDate). */
function matchWebsitePublicActiveCertifiedProducts(criteria) {
    if (criteria === void 0) { criteria = {}; }
    var now = new Date();
    return (0, active_product_filter_1.matchActiveProducts)(__assign({ productStatus: exports.WEBSITE_PUBLIC_CERTIFIED_PRODUCT_STATUS, $or: [
            { validtillDate: null },
            { validtillDate: { $exists: false } },
            { validtillDate: { $gte: now } },
        ] }, criteria));
}
