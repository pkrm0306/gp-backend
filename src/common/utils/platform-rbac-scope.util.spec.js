"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_rbac_scope_util_1 = require("./platform-rbac-scope.util");
describe('platform-rbac-scope.util', function () {
    it('classifies portal account types', function () {
        expect((0, platform_rbac_scope_util_1.isPlatformPortalAccountType)('admin')).toBe(true);
        expect((0, platform_rbac_scope_util_1.isPlatformPortalAccountType)('staff')).toBe(true);
        expect((0, platform_rbac_scope_util_1.isPlatformPortalAccountType)('vendor')).toBe(false);
        expect((0, platform_rbac_scope_util_1.isVendorPortalAccountType)('partner')).toBe(true);
        expect((0, platform_rbac_scope_util_1.isVendorPortalAccountType)('staff')).toBe(false);
    });
    it('uses platform filter when manufacturerId is omitted', function () {
        expect((0, platform_rbac_scope_util_1.rbacScopeFilter)(undefined)).toEqual((0, platform_rbac_scope_util_1.platformRbacManufacturerFilter)());
        expect((0, platform_rbac_scope_util_1.rbacScopeFilter)('')).toEqual((0, platform_rbac_scope_util_1.platformRbacManufacturerFilter)());
        expect((0, platform_rbac_scope_util_1.resolveRbacCacheScope)(undefined)).toBe('platform');
    });
    it('scopes to manufacturer when id is provided', function () {
        var id = '507f1f77bcf86cd799439011';
        expect((0, platform_rbac_scope_util_1.rbacScopeFilter)(id)).toEqual({
            manufacturerId: expect.any(Object),
        });
        expect((0, platform_rbac_scope_util_1.resolveRbacCacheScope)(id)).toBe(id);
    });
});
