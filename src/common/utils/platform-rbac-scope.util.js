"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_RBAC_CACHE_KEY = void 0;
exports.isPlatformPortalAccountType = isPlatformPortalAccountType;
exports.isVendorPortalAccountType = isVendorPortalAccountType;
exports.isPlatformPortalJwtUser = isPlatformPortalJwtUser;
exports.platformRbacManufacturerFilter = platformRbacManufacturerFilter;
exports.platformPortalUserManufacturerFilter = platformPortalUserManufacturerFilter;
exports.manufacturerRbacFilter = manufacturerRbacFilter;
exports.rbacScopeFilter = rbacScopeFilter;
exports.resolveRbacCacheScope = resolveRbacCacheScope;
exports.platformRbacScopeDocument = platformRbacScopeDocument;
var mongoose_1 = require("mongoose");
var platform_admin_util_1 = require("./platform-admin.util");
exports.PLATFORM_RBAC_CACHE_KEY = 'platform';
function isPlatformPortalAccountType(type) {
    var t = String(type !== null && type !== void 0 ? type : '')
        .trim()
        .toLowerCase();
    return t === 'admin' || t === 'staff';
}
function isVendorPortalAccountType(type) {
    var t = String(type !== null && type !== void 0 ? type : '')
        .trim()
        .toLowerCase();
    return t === 'vendor' || t === 'partner';
}
function isPlatformPortalJwtUser(user) {
    var _a, _b;
    if ((0, platform_admin_util_1.isPlatformAdminUser)(user)) {
        return true;
    }
    return String((_b = (_a = user === null || user === void 0 ? void 0 : user.role) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.type) !== null && _b !== void 0 ? _b : '')
        .trim()
        .toLowerCase() === 'staff';
}
/** Mongo filter for platform-scoped RBAC rows (roles, staff_role_mappings). */
function platformRbacManufacturerFilter() {
    return {
        $or: [
            { manufacturerId: null },
            { manufacturerId: { $exists: false } },
        ],
    };
}
function platformPortalUserManufacturerFilter() {
    return platformRbacManufacturerFilter();
}
function manufacturerRbacFilter(manufacturerId) {
    return { manufacturerId: new mongoose_1.Types.ObjectId(manufacturerId) };
}
/** RBAC tenant filter: platform scope when manufacturerId is omitted. */
function rbacScopeFilter(manufacturerId) {
    var id = String(manufacturerId !== null && manufacturerId !== void 0 ? manufacturerId : '').trim();
    if (!id) {
        return platformRbacManufacturerFilter();
    }
    return manufacturerRbacFilter(id);
}
function resolveRbacCacheScope(manufacturerId) {
    return String(manufacturerId !== null && manufacturerId !== void 0 ? manufacturerId : '').trim() || exports.PLATFORM_RBAC_CACHE_KEY;
}
/** Stored on platform-scoped Role / StaffRoleMapping documents. */
function platformRbacScopeDocument() {
    return { manufacturerId: null };
}
