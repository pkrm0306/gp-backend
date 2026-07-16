"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyPermissions = exports.PERMISSIONS_MATCH_MODE_KEY = void 0;
var common_1 = require("@nestjs/common");
var permissions_decorator_1 = require("./permissions.decorator");
exports.PERMISSIONS_MATCH_MODE_KEY = 'permissions_match_mode';
/** User needs at least one of the listed permissions (OR). */
var AnyPermissions = function () {
    var permissions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        permissions[_i] = arguments[_i];
    }
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(permissions_decorator_1.PERMISSIONS_KEY, permissions), (0, common_1.SetMetadata)(exports.PERMISSIONS_MATCH_MODE_KEY, 'any'));
};
exports.AnyPermissions = AnyPermissions;
