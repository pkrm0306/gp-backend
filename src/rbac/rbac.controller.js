"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var permissions_decorator_1 = require("../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../common/constants/permissions.constants");
var allow_staff_self_role_read_decorator_1 = require("../common/decorators/allow-staff-self-role-read.decorator");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var platform_admin_util_1 = require("../common/utils/platform-admin.util");
/** Admin portal RBAC is platform-scoped (not tied to a manufacturer). */
var PLATFORM_RBAC_SCOPE = undefined;
var RbacController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin RBAC'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)('admin/rbac'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _listPermissionCatalog_decorators;
    var _createRole_decorators;
    var _listRoles_decorators;
    var _updateRole_decorators;
    var _updateRoleStatus_decorators;
    var _deleteRole_decorators;
    var _createStaff_decorators;
    var _listStaff_decorators;
    var _assignRole_decorators;
    var _updateRoleAssignment_decorators;
    var _unassignRole_decorators;
    var _getStaffPermissionContext_decorators;
    var _getStaffWithRoles_decorators;
    var RbacController = _classThis = /** @class */ (function () {
        function RbacController_1(rbacService) {
            this.rbacService = (__runInitializers(this, _instanceExtraInitializers), rbacService);
        }
        RbacController_1.prototype.listPermissionCatalog = function () {
            return {
                message: 'Permission catalog retrieved successfully',
                data: {
                    dashboard: permissions_constants_1.DASHBOARD_PERMISSION_CATALOG,
                    allPermissions: permissions_constants_1.ALL_KNOWN_PERMISSION_VALUES,
                },
            };
        };
        RbacController_1.prototype.createRole = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.createRole(PLATFORM_RBAC_SCOPE, dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Role created successfully', data: data }];
                    }
                });
            });
        };
        RbacController_1.prototype.listRoles = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.listRoles(PLATFORM_RBAC_SCOPE, query)];
                        case 1:
                            result = _a.sent();
                            if (result.paged) {
                                return [2 /*return*/, {
                                        message: 'Roles retrieved successfully',
                                        success: true,
                                        data: result.data,
                                        total: result.total,
                                        page: result.page,
                                        limit: result.limit,
                                    }];
                            }
                            return [2 /*return*/, {
                                    message: 'Roles retrieved successfully',
                                    data: result.data,
                                    total: result.total,
                                }];
                    }
                });
            });
        };
        RbacController_1.prototype.updateRole = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.updateRole(PLATFORM_RBAC_SCOPE, id, dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Role updated successfully', data: data }];
                    }
                });
            });
        };
        RbacController_1.prototype.updateRoleStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var desired, status, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            desired = (dto === null || dto === void 0 ? void 0 : dto.status) !== undefined ? String(dto.status).trim().toLowerCase() : undefined;
                            status = undefined;
                            if (desired === 'active' || desired === '1')
                                status = 1;
                            if (desired === 'inactive' || desired === '0')
                                status = 0;
                            return [4 /*yield*/, this.rbacService.setOrToggleRoleStatus(PLATFORM_RBAC_SCOPE, id, status)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Role status updated successfully', data: data }];
                    }
                });
            });
        };
        RbacController_1.prototype.deleteRole = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.deleteRole(PLATFORM_RBAC_SCOPE, id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Role deleted successfully', data: data }];
                    }
                });
            });
        };
        RbacController_1.prototype.createStaff = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.createStaff(PLATFORM_RBAC_SCOPE, dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Staff user created successfully', data: data }];
                    }
                });
            });
        };
        RbacController_1.prototype.listStaff = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.listStaff(PLATFORM_RBAC_SCOPE)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Staff users retrieved successfully', data: data }];
                    }
                });
            });
        };
        RbacController_1.prototype.assignRole = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.assignRole(PLATFORM_RBAC_SCOPE, dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Role assigned successfully', data: data }];
                    }
                });
            });
        };
        RbacController_1.prototype.updateRoleAssignment = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedRoleIds, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedRoleIds = Array.isArray(dto.roleIds) && dto.roleIds.length > 0
                                ? dto.roleIds
                                : dto.roleId
                                    ? [dto.roleId]
                                    : [];
                            return [4 /*yield*/, this.rbacService.replaceStaffRoles(PLATFORM_RBAC_SCOPE, {
                                    vendorUserId: dto.vendorUserId,
                                    roleIds: normalizedRoleIds,
                                })];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Staff role updated successfully', data: data }];
                    }
                });
            });
        };
        RbacController_1.prototype.unassignRole = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.rbacService.unassignStaffRole(PLATFORM_RBAC_SCOPE, dto.vendorUserId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Staff role unassigned successfully', data: data }];
                    }
                });
            });
        };
        RbacController_1.prototype.getStaffPermissionContext = function (user, vendorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var data_1, data_2, targetId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(0, platform_admin_util_1.isPlatformAdminUser)(user)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.rbacService.getStaffPermissionContext(PLATFORM_RBAC_SCOPE, user.userId)];
                        case 1:
                            data_1 = _a.sent();
                            return [2 /*return*/, { message: 'Permission context retrieved successfully', data: data_1 }];
                        case 2:
                            if (!(user.role === 'staff')) return [3 /*break*/, 4];
                            if (vendorUserId && vendorUserId !== user.userId) {
                                throw new common_1.ForbiddenException('Staff can access only their own permission context');
                            }
                            return [4 /*yield*/, this.rbacService.getStaffPermissionContext(PLATFORM_RBAC_SCOPE, user.userId)];
                        case 3:
                            data_2 = _a.sent();
                            return [2 /*return*/, { message: 'Permission context retrieved successfully', data: data_2 }];
                        case 4:
                            targetId = String(vendorUserId !== null && vendorUserId !== void 0 ? vendorUserId : '').trim();
                            if (!targetId) {
                                throw new common_1.BadRequestException('vendorUserId query parameter is required when viewing another staff member');
                            }
                            return [4 /*yield*/, this.rbacService.getStaffPermissionContext(PLATFORM_RBAC_SCOPE, targetId)];
                        case 5:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Permission context retrieved successfully', data: data }];
                    }
                });
            });
        };
        RbacController_1.prototype.getStaffWithRoles = function (user, vendorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var data_3, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user.role === 'staff')) return [3 /*break*/, 2];
                            if (vendorUserId && vendorUserId !== user.userId) {
                                throw new common_1.ForbiddenException('Staff can access only own role mapping');
                            }
                            return [4 /*yield*/, this.rbacService.getStaffWithRoles(PLATFORM_RBAC_SCOPE, user.userId)];
                        case 1:
                            data_3 = _a.sent();
                            return [2 /*return*/, { message: 'Staff roles retrieved successfully', data: data_3 }];
                        case 2: return [4 /*yield*/, this.rbacService.getStaffWithRoles(PLATFORM_RBAC_SCOPE, vendorUserId)];
                        case 3:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Staff roles retrieved successfully', data: data }];
                    }
                });
            });
        };
        return RbacController_1;
    }());
    __setFunctionName(_classThis, "RbacController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _listPermissionCatalog_decorators = [(0, common_1.Get)('permissions/catalog'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_ROLES_MANAGE), (0, swagger_1.ApiOperation)({
                summary: 'Permission catalog for role add/edit UI',
                description: 'Returns dashboard section permissions (nested under Dashboard) plus all known permission keys for module checkboxes.',
            })];
        _createRole_decorators = [(0, common_1.Post)('roles'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_ROLES_MANAGE)];
        _listRoles_decorators = [(0, common_1.Get)(['roles', 'roles/list']), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_ROLES_MANAGE), (0, swagger_1.ApiOperation)({
                summary: 'List roles',
                description: 'Omit **page** and **limit** to return every role (backward compatible envelope with **message** + **data** + **total**). ' +
                    'Send **page** and/or **limit** for server-side pagination (**success**, **data**, **total**, **page**, **limit**). ' +
                    'Optional **search** matches name, description, or permission strings (case-insensitive). ' +
                    'Optional **sort** = `name` | `id` | `createdAt` and **order** = `asc` | `desc` (stable tie-break on `_id`).',
            }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: '1-based page (enables paging when set with limit or alone)' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Page size, max 100 (default 10 when paging)' }), (0, swagger_1.ApiQuery)({ name: 'search', required: false }), (0, swagger_1.ApiQuery)({ name: 'sort', required: false, enum: ['name', 'id', 'createdAt'] }), (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['asc', 'desc'] }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Unpaged: { message, data, total }. Paged: { success, data, total, page, limit }.',
            })];
        _updateRole_decorators = [(0, common_1.Patch)('roles/:id'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_ROLES_MANAGE)];
        _updateRoleStatus_decorators = [(0, common_1.Patch)('roles/:id/status'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_ROLES_MANAGE)];
        _deleteRole_decorators = [(0, common_1.Delete)('roles/:id/delete'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_ROLES_MANAGE)];
        _createStaff_decorators = [(0, common_1.Post)('staff'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_STAFF_MANAGE)];
        _listStaff_decorators = [(0, common_1.Get)('staff'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_STAFF_MANAGE)];
        _assignRole_decorators = [(0, common_1.Post)('staff/roles'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_STAFF_MANAGE)];
        _updateRoleAssignment_decorators = [(0, common_1.Patch)('staff/roles'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_STAFF_MANAGE)];
        _unassignRole_decorators = [(0, common_1.Delete)('staff/roles'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_STAFF_MANAGE)];
        _getStaffPermissionContext_decorators = [(0, common_1.Get)('staff/permission-context'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_STAFF_MANAGE), (0, allow_staff_self_role_read_decorator_1.AllowStaffSelfRoleRead)()];
        _getStaffWithRoles_decorators = [(0, common_1.Get)('staff/roles'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.RBAC_STAFF_MANAGE), (0, allow_staff_self_role_read_decorator_1.AllowStaffSelfRoleRead)()];
        __esDecorate(_classThis, null, _listPermissionCatalog_decorators, { kind: "method", name: "listPermissionCatalog", static: false, private: false, access: { has: function (obj) { return "listPermissionCatalog" in obj; }, get: function (obj) { return obj.listPermissionCatalog; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createRole_decorators, { kind: "method", name: "createRole", static: false, private: false, access: { has: function (obj) { return "createRole" in obj; }, get: function (obj) { return obj.createRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listRoles_decorators, { kind: "method", name: "listRoles", static: false, private: false, access: { has: function (obj) { return "listRoles" in obj; }, get: function (obj) { return obj.listRoles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateRole_decorators, { kind: "method", name: "updateRole", static: false, private: false, access: { has: function (obj) { return "updateRole" in obj; }, get: function (obj) { return obj.updateRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateRoleStatus_decorators, { kind: "method", name: "updateRoleStatus", static: false, private: false, access: { has: function (obj) { return "updateRoleStatus" in obj; }, get: function (obj) { return obj.updateRoleStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteRole_decorators, { kind: "method", name: "deleteRole", static: false, private: false, access: { has: function (obj) { return "deleteRole" in obj; }, get: function (obj) { return obj.deleteRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createStaff_decorators, { kind: "method", name: "createStaff", static: false, private: false, access: { has: function (obj) { return "createStaff" in obj; }, get: function (obj) { return obj.createStaff; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listStaff_decorators, { kind: "method", name: "listStaff", static: false, private: false, access: { has: function (obj) { return "listStaff" in obj; }, get: function (obj) { return obj.listStaff; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignRole_decorators, { kind: "method", name: "assignRole", static: false, private: false, access: { has: function (obj) { return "assignRole" in obj; }, get: function (obj) { return obj.assignRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateRoleAssignment_decorators, { kind: "method", name: "updateRoleAssignment", static: false, private: false, access: { has: function (obj) { return "updateRoleAssignment" in obj; }, get: function (obj) { return obj.updateRoleAssignment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unassignRole_decorators, { kind: "method", name: "unassignRole", static: false, private: false, access: { has: function (obj) { return "unassignRole" in obj; }, get: function (obj) { return obj.unassignRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStaffPermissionContext_decorators, { kind: "method", name: "getStaffPermissionContext", static: false, private: false, access: { has: function (obj) { return "getStaffPermissionContext" in obj; }, get: function (obj) { return obj.getStaffPermissionContext; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStaffWithRoles_decorators, { kind: "method", name: "getStaffWithRoles", static: false, private: false, access: { has: function (obj) { return "getStaffWithRoles" in obj; }, get: function (obj) { return obj.getStaffWithRoles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RbacController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RbacController = _classThis;
}();
exports.RbacController = RbacController;
