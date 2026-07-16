"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin_add_product_to_urn_util_1 = require("./admin-add-product-to-urn.util");
var product_status_constants_1 = require("../../renew/constants/product-status.constants");
describe('admin-add-product-to-urn.util', function () {
    it('blocks when certification fee has been raised', function () {
        var result = (0, admin_add_product_to_urn_util_1.evaluateUrnAddProductEligibility)({
            urnStatus: 7,
            siblingProductStatuses: [0, 1],
            hasCertificationFee: true,
        });
        expect(result.canAddProduct).toBe(false);
        expect(result.blockReason).toContain('certification fee');
    });
    it('blocks when URN is in renewal', function () {
        var result = (0, admin_add_product_to_urn_util_1.evaluateUrnAddProductEligibility)({
            urnStatus: 15,
            siblingProductStatuses: [0, 1],
        });
        expect(result.canAddProduct).toBe(false);
        expect(result.blockReason).toContain('renewal');
    });
    it('blocks when URN has certified sibling', function () {
        var result = (0, admin_add_product_to_urn_util_1.evaluateUrnAddProductEligibility)({
            urnStatus: 1,
            siblingProductStatuses: [0, 2],
        });
        expect(result.canAddProduct).toBe(false);
        expect(result.blockReason).toBe('URN has certified products');
    });
    it('defaults new status to 0 when siblings are all pending', function () {
        var result = (0, admin_add_product_to_urn_util_1.evaluateUrnAddProductEligibility)({
            urnStatus: 1,
            siblingProductStatuses: [0, 0],
        });
        expect(result.canAddProduct).toBe(true);
        expect(result.defaultProductStatus).toBe(product_status_constants_1.PRODUCT_STATUS_PENDING);
    });
    it('defaults new status to 1 when siblings are all submitted', function () {
        var result = (0, admin_add_product_to_urn_util_1.evaluateUrnAddProductEligibility)({
            urnStatus: 1,
            siblingProductStatuses: [1, 1],
        });
        expect(result.defaultProductStatus).toBe(product_status_constants_1.PRODUCT_STATUS_SUBMITTED);
    });
    it('defaults new status to 0 for mixed pending and submitted', function () {
        var result = (0, admin_add_product_to_urn_util_1.evaluateUrnAddProductEligibility)({
            urnStatus: 1,
            siblingProductStatuses: [0, 1],
        });
        expect(result.defaultProductStatus).toBe(product_status_constants_1.PRODUCT_STATUS_PENDING);
    });
    it('allows add when only rejected siblings exist', function () {
        var result = (0, admin_add_product_to_urn_util_1.evaluateUrnAddProductEligibility)({
            urnStatus: 1,
            siblingProductStatuses: [3, 3],
        });
        expect(result.canAddProduct).toBe(true);
        expect(result.defaultProductStatus).toBe(product_status_constants_1.PRODUCT_STATUS_PENDING);
    });
    it('blocks when only expired siblings exist', function () {
        var result = (0, admin_add_product_to_urn_util_1.evaluateUrnAddProductEligibility)({
            urnStatus: 1,
            siblingProductStatuses: [4],
        });
        expect(result.canAddProduct).toBe(false);
        expect(result.blockReason).toBe('URN has no active un-certified products');
    });
});
