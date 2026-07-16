"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("@nestjs/common/constants");
var admin_products_controller_1 = require("./admin-products.controller");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var permissions_decorator_1 = require("../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../common/constants/permissions.constants");
describe('AdminProductsController renew-validity auth metadata', function () {
    it('enforces JwtAuthGuard + PermissionsGuard at controller level', function () {
        var guards = Reflect.getMetadata(constants_1.GUARDS_METADATA, admin_products_controller_1.AdminProductsController);
        expect(guards).toBeDefined();
        expect(guards).toEqual(expect.arrayContaining([jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard]));
    });
    it('requires PRODUCTS_UPDATE permission on renew-validity endpoint', function () {
        var handler = admin_products_controller_1.AdminProductsController.prototype.adminRenewValidity;
        var permissions = Reflect.getMetadata(permissions_decorator_1.PERMISSIONS_KEY, handler);
        expect(permissions).toEqual([permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE]);
    });
});
