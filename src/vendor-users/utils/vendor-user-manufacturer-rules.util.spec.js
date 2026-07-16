"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@nestjs/common");
var vendor_user_manufacturer_rules_util_1 = require("./vendor-user-manufacturer-rules.util");
describe('assertVendorUserManufacturerRules', function () {
    it('requires manufacturer for vendor accounts', function () {
        expect(function () {
            return (0, vendor_user_manufacturer_rules_util_1.assertVendorUserManufacturerRules)({ type: 'vendor' });
        }).toThrow(common_1.BadRequestException);
    });
    it('allows vendor with manufacturerId', function () {
        expect(function () {
            return (0, vendor_user_manufacturer_rules_util_1.assertVendorUserManufacturerRules)({
                type: 'vendor',
                manufacturerId: '507f1f77bcf86cd799439011',
            });
        }).not.toThrow();
    });
    it('rejects manufacturerId on staff accounts', function () {
        expect(function () {
            return (0, vendor_user_manufacturer_rules_util_1.assertVendorUserManufacturerRules)({
                type: 'staff',
                manufacturerId: '507f1f77bcf86cd799439011',
            });
        }).toThrow(common_1.BadRequestException);
    });
    it('allows admin without manufacturerId', function () {
        expect(function () {
            return (0, vendor_user_manufacturer_rules_util_1.assertVendorUserManufacturerRules)({ type: 'admin' });
        }).not.toThrow();
    });
});
