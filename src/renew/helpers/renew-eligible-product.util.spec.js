"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renew_eligible_product_util_1 = require("./renew-eligible-product.util");
describe('renew-eligible-product.util', function () {
    it('allows only certified status', function () {
        expect(renew_eligible_product_util_1.RENEW_ELIGIBLE_PRODUCT_STATUS).toBe(2);
        expect((0, renew_eligible_product_util_1.isRenewEligibleProduct)({ productStatus: 2 })).toBe(true);
        expect((0, renew_eligible_product_util_1.isRenewEligibleProduct)({ productStatus: 3 })).toBe(false);
        expect((0, renew_eligible_product_util_1.isRenewEligibleProduct)({ productStatus: 0 })).toBe(false);
        expect((0, renew_eligible_product_util_1.isRenewEligibleProduct)({ productStatus: 4 })).toBe(false);
    });
    it('filters product rows', function () {
        var rows = [
            { eoiNo: 'A', productStatus: 2 },
            { eoiNo: 'B', productStatus: 3 },
            { eoiNo: 'C', productStatus: 1 },
        ];
        expect((0, renew_eligible_product_util_1.filterRenewEligibleProducts)(rows).map(function (r) { return r.eoiNo; })).toEqual(['A']);
    });
    it('filters renew details rows by nested product_details', function () {
        var rows = [
            { product_details: { eoiNo: 'A', productStatus: 2 } },
            { product_details: { eoiNo: 'B', productStatus: 3 } },
        ];
        expect((0, renew_eligible_product_util_1.filterRenewDetailsRows)(rows)).toHaveLength(1);
        expect((0, renew_eligible_product_util_1.filterRenewDetailsRows)(rows)[0].product_details.eoiNo).toBe('A');
    });
    it('limits urnStatus updates to certified products for renew payment / status 12–17', function () {
        expect((0, renew_eligible_product_util_1.shouldLimitUrnStatusUpdateToCertifiedProducts)('renew', 14)).toBe(true);
        expect((0, renew_eligible_product_util_1.shouldLimitUrnStatusUpdateToCertifiedProducts)('certification', 17)).toBe(true);
        expect((0, renew_eligible_product_util_1.shouldLimitUrnStatusUpdateToCertifiedProducts)('certification', 7)).toBe(false);
        expect((0, renew_eligible_product_util_1.matchRenewUrnStatusUpdateProducts)({ urnNo: 'URN-1' })).toEqual(expect.objectContaining({ productStatus: 2, urnNo: 'URN-1' }));
        expect((0, renew_eligible_product_util_1.buildProductFilterForUrnStatusUpdate)({ urnNo: 'URN-1' }, 'renew', 13)).toEqual(expect.objectContaining({ productStatus: 2 }));
    });
    it('filterRenewRowsByCertifiedEoi keeps URN-level and certified EOI rows', function () {
        var certified = new Set(['EOI-A']);
        var rows = [
            { documentForm: 'process_innovation', eoiNo: 'EOI-A' },
            { documentForm: 'process_innovation', eoiNo: 'EOI-B' },
            { documentForm: 'process_manufacturing' },
        ];
        expect((0, renew_eligible_product_util_1.filterRenewRowsByCertifiedEoi)(rows, certified)).toHaveLength(2);
    });
});
