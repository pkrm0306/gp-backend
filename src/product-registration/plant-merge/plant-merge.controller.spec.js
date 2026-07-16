"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("@nestjs/common/constants");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../common/guards/permissions.guard");
var permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../../common/constants/permissions.constants");
var plant_merge_controller_1 = require("./plant-merge.controller");
describe('PlantMergeController auth metadata', function () {
    it('enforces JwtAuthGuard + PermissionsGuard', function () {
        var guards = Reflect.getMetadata(constants_1.GUARDS_METADATA, plant_merge_controller_1.PlantMergeController);
        expect(guards).toEqual(expect.arrayContaining([jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard]));
    });
    it('requires PRODUCTS_UPDATE on validate', function () {
        var permissions = Reflect.getMetadata(permissions_decorator_1.PERMISSIONS_KEY, plant_merge_controller_1.PlantMergeController.prototype.validate);
        expect(permissions).toEqual([permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE]);
    });
    it('requires PRODUCTS_UPDATE on execute', function () {
        var permissions = Reflect.getMetadata(permissions_decorator_1.PERMISSIONS_KEY, plant_merge_controller_1.PlantMergeController.prototype.execute);
        expect(permissions).toEqual([permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE]);
    });
    it('requires PRODUCTS_UPDATE on urnExecute', function () {
        var permissions = Reflect.getMetadata(permissions_decorator_1.PERMISSIONS_KEY, plant_merge_controller_1.PlantMergeController.prototype.urnExecute);
        expect(permissions).toEqual([permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE]);
    });
});
