"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateUrnAddProductEligibility = evaluateUrnAddProductEligibility;
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
var renewal_urn_status_constants_1 = require("../../renew/constants/renewal-urn-status.constants");
function evaluateUrnAddProductEligibility(input) {
    var statuses = input.siblingProductStatuses.map(function (s) { return Number(s); });
    if ((0, renewal_urn_status_constants_1.isRenewalUrnStatus)(Number(input.urnStatus))) {
        return {
            canAddProduct: false,
            blockReason: 'Cannot add products while renewal is in progress',
            defaultProductStatus: product_status_constants_1.PRODUCT_STATUS_PENDING,
        };
    }
    if (input.hasCertificationFee) {
        return {
            canAddProduct: false,
            blockReason: 'Cannot add products after a certification fee has been raised for this URN',
            defaultProductStatus: product_status_constants_1.PRODUCT_STATUS_PENDING,
        };
    }
    if (statuses.some(function (s) { return s === product_status_constants_1.PRODUCT_STATUS_CERTIFIED; })) {
        return {
            canAddProduct: false,
            blockReason: 'URN has certified products',
            defaultProductStatus: product_status_constants_1.PRODUCT_STATUS_PENDING,
        };
    }
    var uncertified = statuses.filter(function (s) { return s === product_status_constants_1.PRODUCT_STATUS_PENDING || s === product_status_constants_1.PRODUCT_STATUS_SUBMITTED; });
    if (uncertified.length === 0) {
        if (statuses.length > 0 && statuses.every(function (s) { return s === product_status_constants_1.PRODUCT_STATUS_REJECTED; })) {
            return {
                canAddProduct: true,
                blockReason: null,
                defaultProductStatus: product_status_constants_1.PRODUCT_STATUS_PENDING,
            };
        }
        if (statuses.length > 0 && statuses.every(function (s) { return s === product_status_constants_1.PRODUCT_STATUS_DISCONTINUED; })) {
            return {
                canAddProduct: false,
                blockReason: 'URN has no active un-certified products',
                defaultProductStatus: product_status_constants_1.PRODUCT_STATUS_PENDING,
            };
        }
        if (statuses.some(function (s) { return s === product_status_constants_1.PRODUCT_STATUS_DISCONTINUED; })) {
            return {
                canAddProduct: false,
                blockReason: 'URN has no active un-certified products',
                defaultProductStatus: product_status_constants_1.PRODUCT_STATUS_PENDING,
            };
        }
    }
    var defaultProductStatus = uncertified.length > 0 && uncertified.every(function (s) { return s === product_status_constants_1.PRODUCT_STATUS_SUBMITTED; })
        ? product_status_constants_1.PRODUCT_STATUS_SUBMITTED
        : product_status_constants_1.PRODUCT_STATUS_PENDING;
    return {
        canAddProduct: true,
        blockReason: null,
        defaultProductStatus: defaultProductStatus,
    };
}
