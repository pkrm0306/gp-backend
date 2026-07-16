"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@nestjs/common");
var banner_vendor_scope_util_1 = require("./banner-vendor-scope.util");
describe('banner-vendor-scope.util', function () {
    it('returns vendor scope for vendor tokens', function () {
        expect((0, banner_vendor_scope_util_1.resolveBannerVendorScope)({ vendorId: '507f1f77bcf86cd799439011' })).toBe('507f1f77bcf86cd799439011');
    });
    it('returns null for platform admin/staff', function () {
        expect((0, banner_vendor_scope_util_1.resolveBannerVendorScope)({ role: 'admin' })).toBeNull();
        expect((0, banner_vendor_scope_util_1.resolveBannerVendorScope)({ type: 'staff' })).toBeNull();
    });
    it('throws for non-platform users without vendor id', function () {
        expect(function () { return (0, banner_vendor_scope_util_1.resolveBannerVendorScope)({ role: 'vendor' }); }).toThrow(common_1.BadRequestException);
    });
    it('builds empty filter for platform scope', function () {
        expect((0, banner_vendor_scope_util_1.buildBannerVendorScopeFilter)(null)).toEqual({});
    });
});
