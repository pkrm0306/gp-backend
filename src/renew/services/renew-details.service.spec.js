"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renew_eligible_product_util_1 = require("../helpers/renew-eligible-product.util");
describe('RenewDetailsService renew eligibility filtering', function () {
    it('excludes rejected EOIs from details rows (certified-only)', function () {
        var rows = (0, renew_eligible_product_util_1.filterRenewDetailsRows)([
            {
                product_details: { eoiNo: 'GPPMI001', productStatus: 2, productName: 'Certified' },
            },
            {
                product_details: { eoiNo: 'GPPMI002', productStatus: 3, productName: 'Rejected' },
            },
        ]);
        expect(rows).toHaveLength(1);
        expect(rows[0].product_details.eoiNo).toBe('GPPMI001');
    });
});
