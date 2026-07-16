"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("@nestjs/common/constants");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../common/guards/permissions.guard");
var permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../../common/constants/permissions.constants");
var urn_merge_controller_1 = require("./urn-merge.controller");
describe('UrnMergeController auth metadata', function () {
    it('enforces JwtAuthGuard + PermissionsGuard', function () {
        var guards = Reflect.getMetadata(constants_1.GUARDS_METADATA, urn_merge_controller_1.UrnMergeController);
        expect(guards).toEqual(expect.arrayContaining([jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard]));
    });
    it('requires PRODUCTS_UPDATE on execute', function () {
        var permissions = Reflect.getMetadata(permissions_decorator_1.PERMISSIONS_KEY, urn_merge_controller_1.UrnMergeController.prototype.execute);
        expect(permissions).toEqual([permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE]);
    });
});
