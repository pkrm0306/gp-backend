"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertVendorUserManufacturerRules = assertVendorUserManufacturerRules;
var common_1 = require("@nestjs/common");
var platform_rbac_scope_util_1 = require("../../common/utils/platform-rbac-scope.util");
function assertVendorUserManufacturerRules(input) {
    var _a;
    var type = String((_a = input.type) !== null && _a !== void 0 ? _a : '').trim().toLowerCase();
    var hasManufacturer = Boolean(input.manufacturerId != null && String(input.manufacturerId).trim() !== '');
    var hasVendor = Boolean(input.vendorId != null && String(input.vendorId).trim() !== '');
    if ((0, platform_rbac_scope_util_1.isVendorPortalAccountType)(type)) {
        if (!hasManufacturer && !hasVendor) {
            throw new common_1.BadRequestException('manufacturerId is required for vendor and partner accounts');
        }
        return;
    }
    if ((0, platform_rbac_scope_util_1.isPlatformPortalAccountType)(type)) {
        if (hasManufacturer || hasVendor) {
            throw new common_1.BadRequestException('manufacturerId and vendorId must not be set for admin and staff accounts');
        }
    }
}
