"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowStaffSelfRoleRead = exports.ALLOW_STAFF_SELF_ROLE_READ_KEY = void 0;
var common_1 = require("@nestjs/common");
exports.ALLOW_STAFF_SELF_ROLE_READ_KEY = 'allowStaffSelfRoleRead';
var AllowStaffSelfRoleRead = function () {
    return (0, common_1.SetMetadata)(exports.ALLOW_STAFF_SELF_ROLE_READ_KEY, true);
};
exports.AllowStaffSelfRoleRead = AllowStaffSelfRoleRead;
