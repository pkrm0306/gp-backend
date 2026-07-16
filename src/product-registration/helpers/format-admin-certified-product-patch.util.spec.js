"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var format_admin_certified_product_patch_util_1 = require("./format-admin-certified-product-patch.util");
describe('normalizeValidTillForApiResponse', function () {
    it('returns ISO string for Date instances', function () {
        var d = new Date('2028-12-31T00:00:00.000Z');
        expect((0, format_admin_certified_product_patch_util_1.normalizeValidTillForApiResponse)(d)).toBe(d.toISOString());
    });
    it('returns null for empty values', function () {
        expect((0, format_admin_certified_product_patch_util_1.normalizeValidTillForApiResponse)(null)).toBeNull();
        expect((0, format_admin_certified_product_patch_util_1.normalizeValidTillForApiResponse)('')).toBeNull();
    });
});
describe('formatAdminCertifiedProductPatchResponse', function () {
    var toId = function (v) { return (v == null ? undefined : String(v)); };
    it('includes valid-till aliases from validtillDate', function () {
        var iso = '2028-12-31T00:00:00.000Z';
        var out = (0, format_admin_certified_product_patch_util_1.formatAdminCertifiedProductPatchResponse)({
            _id: '507f1f77bcf86cd799439011',
            productName: 'Test',
            validtillDate: new Date(iso),
            productStatus: 2,
        }, toId);
        expect(out.validtillDate).toBe(iso);
        expect(out.validTill).toBe(iso);
        expect(out.validTillDate).toBe(iso);
        expect(out.valid_till_date).toBe(iso);
    });
    it('reads validTillDate alias when validtillDate is absent', function () {
        var iso = '2027-06-15T00:00:00.000Z';
        var out = (0, format_admin_certified_product_patch_util_1.formatAdminCertifiedProductPatchResponse)({ _id: 'abc', validTillDate: iso }, toId);
        expect(out.validTill).toBe(iso);
    });
});
