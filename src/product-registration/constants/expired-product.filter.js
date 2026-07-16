"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchExpiredProducts = matchExpiredProducts;
exports.isExpiredProduct = isExpiredProduct;
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
/** Mongo match for expired/discontinued certified products. */
function matchExpiredProducts(now) {
    if (now === void 0) { now = new Date(); }
    return {
        $or: [
            { productStatus: product_status_constants_1.PRODUCT_STATUS_DISCONTINUED },
            {
                productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
                validtillDate: { $exists: true, $ne: null, $lt: now },
            },
        ],
    };
}
function isExpiredProduct(productStatus, validtillDate, now) {
    if (now === void 0) { now = new Date(); }
    if (productStatus === product_status_constants_1.PRODUCT_STATUS_DISCONTINUED) {
        return true;
    }
    return (productStatus === product_status_constants_1.PRODUCT_STATUS_CERTIFIED &&
        validtillDate != null &&
        new Date(validtillDate).getTime() < now.getTime());
}
