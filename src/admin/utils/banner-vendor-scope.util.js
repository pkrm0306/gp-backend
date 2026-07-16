"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformBannerVendorId = getPlatformBannerVendorId;
exports.resolveBannerVendorScope = resolveBannerVendorScope;
exports.buildBannerVendorScopeFilter = buildBannerVendorScopeFilter;
exports.resolveBannerPersistVendorObjectId = resolveBannerPersistVendorObjectId;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var platform_rbac_scope_util_1 = require("../../common/utils/platform-rbac-scope.util");
/** Valid ObjectId used when platform admins create CMS banners (schema requires vendorId). */
var DEFAULT_PLATFORM_BANNER_VENDOR_ID = '66a000000000000000000001';
function getPlatformBannerVendorId() {
    var _a;
    var fromEnv = String((_a = process.env.PLATFORM_BANNER_VENDOR_ID) !== null && _a !== void 0 ? _a : '').trim();
    if (fromEnv && mongoose_1.Types.ObjectId.isValid(fromEnv)) {
        return fromEnv;
    }
    return DEFAULT_PLATFORM_BANNER_VENDOR_ID;
}
/**
 * Vendor-scoped operators (vendor portal) return their manufacturer id.
 * Platform admin/staff return null → manage all CMS banners.
 */
function resolveBannerVendorScope(user) {
    var _a, _b;
    var scoped = String((_b = (_a = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.manufacturerId) !== null && _b !== void 0 ? _b : '').trim();
    if (scoped)
        return scoped;
    if ((0, platform_rbac_scope_util_1.isPlatformPortalJwtUser)(user))
        return null;
    throw new common_1.BadRequestException('Vendor ID not found in token');
}
function buildBannerVendorScopeFilter(vendorScope) {
    if (!vendorScope)
        return {};
    try {
        var vendorObjectId = new mongoose_1.Types.ObjectId(vendorScope);
        return { $or: [{ vendorId: vendorObjectId }, { vendorId: vendorScope }] };
    }
    catch (_a) {
        throw new common_1.BadRequestException('Invalid vendor ID format');
    }
}
function resolveBannerPersistVendorObjectId(vendorScope) {
    var raw = vendorScope !== null && vendorScope !== void 0 ? vendorScope : getPlatformBannerVendorId();
    try {
        return new mongoose_1.Types.ObjectId(raw);
    }
    catch (_a) {
        throw new common_1.BadRequestException('Invalid vendor ID format');
    }
}
