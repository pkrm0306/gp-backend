"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var permission_hierarchy_1 = require("../common/permissions/permission-hierarchy");
var permissions_constants_1 = require("../common/constants/permissions.constants");
var platform_admin_util_1 = require("../common/utils/platform-admin.util");
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var platform_rbac_scope_util_1 = require("../common/utils/platform-rbac-scope.util");
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/**
 * Tenant RBAC: **Role** documents hold `permissions[]`. **StaffRoleMapping** links staff
 * `VendorUser` ↔ `Role` (many-to-many). Effective rights are always derived from current
 * role rows + active mappings — nothing permission-related is snapshotted on the user.
 *
 * **Caching:** `getStaffPermissions` caches a minimized grant union per user (`RBAC_CACHE_TTL_SECONDS`).
 * Call `invalidateRbacCache` whenever role definitions or assignments change so checks stay fresh.
 *
 * **JWT:** Access tokens carry identity (`userId`, `manufacturerId`, `role` type only), not permission
 * claims. `PermissionsGuard` resolves grants via `getStaffPermissions` on each request (subject to cache TTL).
 */
var RbacService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RbacService = _classThis = /** @class */ (function () {
        function RbacService_1(roleModel, mappingModel, vendorUserModel, vendorUsersService, emailService, configService, redisService) {
            this.roleModel = roleModel;
            this.mappingModel = mappingModel;
            this.vendorUserModel = vendorUserModel;
            this.vendorUsersService = vendorUsersService;
            this.emailService = emailService;
            this.configService = configService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(RbacService.name);
        }
        RbacService_1.prototype.getRbacCacheTtlSeconds = function () {
            var ttl = parseInt(this.configService.get('RBAC_CACHE_TTL_SECONDS') ||
                this.configService.get('CACHE_TTL_SECONDS') ||
                '120', 10);
            return Number.isFinite(ttl) && ttl > 0 ? ttl : 120;
        };
        RbacService_1.prototype.invalidateRbacCache = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var scope;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            scope = (0, platform_rbac_scope_util_1.resolveRbacCacheScope)(manufacturerId);
                            return [4 /*yield*/, this.redisService
                                    .deleteByPattern(this.redisService.buildKey('rbac', scope, '*'))
                                    .catch(function (error) {
                                    _this.logger.warn("RBAC cache invalidation failed for scope=".concat(scope, ": ").concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RbacService_1.prototype.rbacScope = function (manufacturerId) {
            return (0, platform_rbac_scope_util_1.rbacScopeFilter)(manufacturerId);
        };
        RbacService_1.prototype.scopeDocument = function (manufacturerId) {
            var id = String(manufacturerId !== null && manufacturerId !== void 0 ? manufacturerId : '').trim();
            if (!id) {
                return (0, platform_rbac_scope_util_1.platformRbacScopeDocument)();
            }
            return { manufacturerId: new mongoose_1.Types.ObjectId(id) };
        };
        RbacService_1.prototype.hasAnyActiveStaffRoleMapping = function (manufacturerId, vendorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorUserObjectId, count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');
                            return [4 /*yield*/, this.mappingModel
                                    .countDocuments(__assign(__assign({}, this.rbacScope(manufacturerId)), { vendorUserId: vendorUserObjectId, status: 1 }))
                                    .exec()];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, count > 0];
                    }
                });
            });
        };
        RbacService_1.prototype.toObjectId = function (id, field) {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(field));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        RbacService_1.prototype.findStaffUserById = function (vendorUserId, manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, scope, mfgObjectId;
                return __generator(this, function (_a) {
                    filter = {
                        _id: vendorUserId,
                        type: 'staff',
                        status: { $ne: 2 },
                    };
                    scope = String(manufacturerId !== null && manufacturerId !== void 0 ? manufacturerId : '').trim();
                    if (scope) {
                        mfgObjectId = this.toObjectId(scope, 'manufacturerId');
                        filter.$or = [{ manufacturerId: mfgObjectId }, { vendorId: mfgObjectId }];
                    }
                    return [2 /*return*/, this.vendorUserModel.findOne(filter).exec()];
                });
            });
        };
        RbacService_1.prototype.sendFirstRoleAssignmentCredentialsIfNeeded = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var email, name, password, passwordHash, error_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            email = String((_a = input.user.email) !== null && _a !== void 0 ? _a : '').trim().toLowerCase();
                            name = String((_b = input.user.name) !== null && _b !== void 0 ? _b : '').trim();
                            if (!email)
                                return [2 /*return*/, undefined];
                            password = crypto.randomBytes(8).toString('hex');
                            return [4 /*yield*/, bcrypt.hash(password, 10)];
                        case 1:
                            passwordHash = _c.sent();
                            return [4 /*yield*/, this.vendorUserModel
                                    .updateOne({ _id: input.vendorUserId }, { $set: { password: passwordHash, updatedAt: new Date() } })
                                    .exec()];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            _c.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.emailService.sendStaffCredentialsEmail(email, password, name)];
                        case 4:
                            _c.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _c.sent();
                            this.logger.warn("First role assignment credentials email failed for ".concat(email, ": ").concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/, { temporaryPassword: password, email: email }];
                    }
                });
            });
        };
        RbacService_1.prototype.canonicalizePermission = function (permission) {
            var raw = String(permission || '').trim().toLowerCase();
            if (!raw)
                return raw;
            // Canonical namespace: inquiries:*
            if (raw === 'inquiries.view' || raw === 'contacts.view' || raw === 'contact.view') {
                return 'inquiries:view';
            }
            if (raw === 'inquiries.reply' ||
                raw === 'contacts.reply' ||
                raw === 'contact.reply' ||
                raw === 'inquiries.update') {
                return 'inquiries:reply';
            }
            if (raw === 'inquiries.delete' ||
                raw === 'contacts.delete' ||
                raw === 'contact.delete') {
                return 'inquiries:delete';
            }
            // Generic normalization for old dot-style keys.
            return raw.replace(/\./g, ':');
        };
        /**
         * Canonical permission strings for storage. Redundant child grants are dropped when
         * a parent grant already implies them (minimal storage; see docs/permission-hierarchy.md).
         */
        RbacService_1.prototype.normalizePermissions = function (permissions) {
            var _this = this;
            var normalized = Array.from(new Set((permissions || [])
                .map(function (permission) { return _this.canonicalizePermission(permission); })
                .filter(Boolean)));
            return (0, permission_hierarchy_1.minimizePermissionSet)(normalized);
        };
        /** Effective permissions for UI: known keys implied by stored role grants. */
        RbacService_1.prototype.effectivePermissionsFromRaw = function (rawPermissions) {
            return (0, permission_hierarchy_1.expandEffectivePermissions)(rawPermissions, permissions_constants_1.ALL_KNOWN_PERMISSION_VALUES);
        };
        RbacService_1.prototype.createRole = function (manufacturerId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var role, error_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.roleModel.create(__assign(__assign({}, this.scopeDocument(manufacturerId)), { name: dto.name.trim(), description: ((_a = dto.description) === null || _a === void 0 ? void 0 : _a.trim()) || '', permissions: this.normalizePermissions(dto.permissions || []), status: 1 }))];
                        case 1:
                            role = _b.sent();
                            return [4 /*yield*/, this.invalidateRbacCache(manufacturerId)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, role];
                        case 3:
                            error_2 = _b.sent();
                            if ((error_2 === null || error_2 === void 0 ? void 0 : error_2.code) === 11000) {
                                throw new common_1.ConflictException('Role name already exists');
                            }
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RbacService_1.prototype.buildRolesSort = function (sort, order) {
            var dir = function (o) {
                return o === 'asc' ? 1 : -1;
            };
            if (!sort) {
                return { createdAt: -1, _id: 1 };
            }
            var primary = sort === 'name'
                ? dir(order !== null && order !== void 0 ? order : 'asc')
                : sort === 'id'
                    ? dir(order !== null && order !== void 0 ? order : 'desc')
                    : dir(order !== null && order !== void 0 ? order : 'desc');
            switch (sort) {
                case 'name':
                    return { name: primary, _id: 1 };
                case 'id':
                    return { _id: primary };
                case 'createdAt':
                    return { createdAt: primary, _id: 1 };
                default:
                    return { createdAt: -1, _id: 1 };
            }
        };
        /**
         * List roles for a manufacturer.
         * - No `page`/`limit` and no `search`: full list (Redis-cached), backward compatible.
         * - `page` and/or `limit` set: paged DB query; caller should return `{ success, data, total, page, limit }`.
         * - `search` only: all matches, no cache.
         */
        RbacService_1.prototype.listRoles = function (manufacturerId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var search, pagingRequested, sortSpec, filter, rx, sortOrOrder, cacheKey, cached, error_3, rows_1, rows_2, page, limit, skip, _a, total, rows;
                var _this = this;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            search = (_b = query === null || query === void 0 ? void 0 : query.search) === null || _b === void 0 ? void 0 : _b.trim();
                            pagingRequested = (query === null || query === void 0 ? void 0 : query.page) !== undefined || (query === null || query === void 0 ? void 0 : query.limit) !== undefined;
                            sortSpec = this.buildRolesSort(query === null || query === void 0 ? void 0 : query.sort, query === null || query === void 0 ? void 0 : query.order);
                            filter = __assign({}, this.rbacScope(manufacturerId));
                            if (search) {
                                rx = new RegExp(escapeRegex(search), 'i');
                                filter.$or = [{ name: rx }, { description: rx }, { permissions: rx }];
                            }
                            sortOrOrder = (query === null || query === void 0 ? void 0 : query.sort) !== undefined ||
                                ((query === null || query === void 0 ? void 0 : query.order) !== undefined && String(query.order).trim() !== '');
                            if (!(!pagingRequested && !search && !sortOrOrder)) return [3 /*break*/, 6];
                            cacheKey = this.redisService.buildKey('rbac', (0, platform_rbac_scope_util_1.resolveRbacCacheScope)(manufacturerId), 'roles', 'list');
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _e.sent();
                            if (Array.isArray(cached)) {
                                return [2 /*return*/, { paged: false, data: cached, total: cached.length }];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _e.sent();
                            this.logger.warn("RBAC roles cache read failed: ".concat((error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.roleModel
                                .find(this.rbacScope(manufacturerId))
                                .sort(sortSpec)
                                .lean()
                                .exec()];
                        case 5:
                            rows_1 = _e.sent();
                            this.redisService
                                .set(cacheKey, rows_1, this.getRbacCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("RBAC roles cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, { paged: false, data: rows_1, total: rows_1.length }];
                        case 6:
                            if (!(!pagingRequested && search)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.roleModel
                                    .find(filter)
                                    .sort(sortSpec)
                                    .lean()
                                    .exec()];
                        case 7:
                            rows_2 = _e.sent();
                            return [2 /*return*/, { paged: false, data: rows_2, total: rows_2.length }];
                        case 8:
                            page = Math.max(1, (_c = query === null || query === void 0 ? void 0 : query.page) !== null && _c !== void 0 ? _c : 1);
                            limit = Math.min(100, Math.max(1, (_d = query === null || query === void 0 ? void 0 : query.limit) !== null && _d !== void 0 ? _d : 10));
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.roleModel.countDocuments(filter).exec(),
                                    this.roleModel
                                        .find(filter)
                                        .sort(sortSpec)
                                        .skip(skip)
                                        .limit(limit)
                                        .lean()
                                        .exec(),
                                ])];
                        case 9:
                            _a = _e.sent(), total = _a[0], rows = _a[1];
                            return [2 /*return*/, {
                                    paged: true,
                                    data: rows,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                }];
                    }
                });
            });
        };
        RbacService_1.prototype.updateRole = function (manufacturerId, roleId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var roleObjectId, updateDoc, row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            roleObjectId = this.toObjectId(roleId, 'roleId');
                            updateDoc = {};
                            if (dto.name !== undefined)
                                updateDoc.name = dto.name.trim();
                            if (dto.description !== undefined)
                                updateDoc.description = dto.description.trim();
                            if (dto.permissions !== undefined) {
                                updateDoc.permissions = this.normalizePermissions(dto.permissions);
                            }
                            return [4 /*yield*/, this.roleModel
                                    .findOneAndUpdate(__assign({ _id: roleObjectId }, this.rbacScope(manufacturerId)), { $set: updateDoc }, { new: true })
                                    .exec()];
                        case 1:
                            row = _a.sent();
                            if (!row)
                                throw new common_1.NotFoundException('Role not found');
                            return [4 /*yield*/, this.invalidateRbacCache(manufacturerId)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, row];
                    }
                });
            });
        };
        RbacService_1.prototype.disableRole = function (manufacturerId, roleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.setOrToggleRoleStatus(manufacturerId, roleId, 0)];
                });
            });
        };
        RbacService_1.prototype.setOrToggleRoleStatus = function (manufacturerId, roleId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var roleObjectId, nextStatus, current, row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            roleObjectId = this.toObjectId(roleId, 'roleId');
                            if (!(status === 0 || status === 1)) return [3 /*break*/, 1];
                            nextStatus = status;
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.roleModel
                                .findOne(__assign({ _id: roleObjectId }, this.rbacScope(manufacturerId)))
                                .select('status')
                                .lean()
                                .exec()];
                        case 2:
                            current = _a.sent();
                            if (!current)
                                throw new common_1.NotFoundException('Role not found');
                            nextStatus = Number(current.status) === 1 ? 0 : 1;
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.roleModel
                                .findOneAndUpdate(__assign({ _id: roleObjectId }, this.rbacScope(manufacturerId)), { $set: { status: nextStatus } }, { new: true })
                                .lean()
                                .exec()];
                        case 4:
                            row = _a.sent();
                            if (!row)
                                throw new common_1.NotFoundException('Role not found');
                            return [4 /*yield*/, this.invalidateRbacCache(manufacturerId)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {
                                    id: String(row._id),
                                    status: Number(row.status) === 1 ? 'active' : 'inactive',
                                    is_active: Number(row.status) === 1,
                                }];
                    }
                });
            });
        };
        RbacService_1.prototype.deleteRole = function (manufacturerId, roleId) {
            return __awaiter(this, void 0, void 0, function () {
                var roleObjectId, role, activeMappings, mappedUserIds, activeUsersCount, res;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            roleObjectId = this.toObjectId(roleId, 'roleId');
                            return [4 /*yield*/, this.roleModel
                                    .findOne(__assign({ _id: roleObjectId }, this.rbacScope(manufacturerId)))
                                    .select('_id name')
                                    .lean()
                                    .exec()];
                        case 1:
                            role = _b.sent();
                            if (!role)
                                throw new common_1.NotFoundException('Role not found');
                            return [4 /*yield*/, this.mappingModel
                                    .find(__assign(__assign({}, this.rbacScope(manufacturerId)), { roleId: roleObjectId, status: 1 }))
                                    .select('vendorUserId')
                                    .lean()
                                    .exec()];
                        case 2:
                            activeMappings = _b.sent();
                            if (!(activeMappings.length > 0)) return [3 /*break*/, 5];
                            mappedUserIds = activeMappings.map(function (m) { return m.vendorUserId; });
                            return [4 /*yield*/, this.vendorUserModel
                                    .countDocuments({
                                    _id: { $in: mappedUserIds },
                                    status: { $ne: 2 },
                                })
                                    .exec()];
                        case 3:
                            activeUsersCount = _b.sent();
                            if (activeUsersCount > 0) {
                                throw new common_1.BadRequestException('Cannot delete role while assigned to staff. Reassign/remove mappings first.');
                            }
                            return [4 /*yield*/, this.mappingModel
                                    .deleteMany(__assign(__assign({}, this.rbacScope(manufacturerId)), { roleId: roleObjectId, vendorUserId: { $in: mappedUserIds } }))
                                    .exec()];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [4 /*yield*/, this.roleModel
                                .deleteOne(__assign({ _id: roleObjectId }, this.rbacScope(manufacturerId)))
                                .exec()];
                        case 6:
                            res = _b.sent();
                            if (!res || res.deletedCount === 0) {
                                throw new common_1.NotFoundException('Role not found');
                            }
                            return [4 /*yield*/, this.mappingModel
                                    .deleteMany(__assign(__assign({}, this.rbacScope(manufacturerId)), { roleId: roleObjectId }))
                                    .exec()];
                        case 7:
                            _b.sent();
                            return [4 /*yield*/, this.invalidateRbacCache(manufacturerId)];
                        case 8:
                            _b.sent();
                            return [2 /*return*/, { id: String(roleObjectId), name: String((_a = role.name) !== null && _a !== void 0 ? _a : '') }];
                    }
                });
            });
        };
        RbacService_1.prototype.createStaff = function (_manufacturerId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, createdStaff, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.vendorUsersService.findByEmail(dto.email)];
                        case 1:
                            existing = _a.sent();
                            if (existing)
                                throw new common_1.ConflictException('Email already exists');
                            return [4 /*yield*/, this.vendorUsersService.create({
                                    name: dto.name.trim(),
                                    email: dto.email.trim().toLowerCase(),
                                    phone: dto.phone.trim(),
                                    password: dto.password,
                                    type: 'staff',
                                    status: 1,
                                    isVerified: true,
                                })];
                        case 2:
                            createdStaff = _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.emailService.sendStaffCredentialsEmail(dto.email.trim().toLowerCase(), dto.password, dto.name.trim())];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            error_4 = _a.sent();
                            this.logger.warn("Staff created but credentials email failed for ".concat(dto.email.trim().toLowerCase(), ": ").concat((error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || 'unknown error'));
                            return [3 /*break*/, 6];
                        case 6: return [4 /*yield*/, this.invalidateRbacCache(undefined)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/, createdStaff];
                    }
                });
            });
        };
        RbacService_1.prototype.listStaff = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_5, rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.redisService.buildKey('rbac', (0, platform_rbac_scope_util_1.resolveRbacCacheScope)(manufacturerId), 'staff', 'list');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _a.sent();
                            if (Array.isArray(cached))
                                return [2 /*return*/, cached];
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            this.logger.warn("RBAC staff cache read failed: ".concat((error_5 === null || error_5 === void 0 ? void 0 : error_5.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.vendorUserModel
                                .find(__assign({ type: 'staff', status: { $ne: 2 } }, (0, platform_rbac_scope_util_1.platformPortalUserManufacturerFilter)()))
                                .sort({ createdAt: -1 })
                                .lean()
                                .exec()];
                        case 5:
                            rows = _a.sent();
                            this.redisService
                                .set(cacheKey, rows, this.getRbacCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("RBAC staff cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, rows];
                    }
                });
            });
        };
        RbacService_1.prototype.assignRole = function (manufacturerId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorUserId, roleId, scopeDoc, _a, user, role, hadAnyRoleBefore, mapping;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
                            if (!dto.roleId) {
                                throw new common_1.BadRequestException('roleId is required');
                            }
                            roleId = this.toObjectId(dto.roleId, 'roleId');
                            scopeDoc = this.scopeDocument(manufacturerId);
                            return [4 /*yield*/, Promise.all([
                                    this.findStaffUserById(vendorUserId, manufacturerId),
                                    this.roleModel
                                        .findOne(__assign(__assign({ _id: roleId }, this.rbacScope(manufacturerId)), { status: 1 }))
                                        .exec(),
                                    this.mappingModel
                                        .countDocuments(__assign(__assign({}, this.rbacScope(manufacturerId)), { vendorUserId: vendorUserId, status: 1 }))
                                        .exec()
                                        .then(function (c) { return c > 0; }),
                                ])];
                        case 1:
                            _a = _b.sent(), user = _a[0], role = _a[1], hadAnyRoleBefore = _a[2];
                            if (!user)
                                throw new common_1.NotFoundException('Staff user not found');
                            if (!role)
                                throw new common_1.NotFoundException('Role not found');
                            return [4 /*yield*/, this.mappingModel
                                    .findOneAndUpdate(__assign(__assign({}, scopeDoc), { vendorUserId: vendorUserId, roleId: roleId }), { $set: { status: 1 } }, { upsert: true, new: true })
                                    .exec()];
                        case 2:
                            mapping = _b.sent();
                            if (!!hadAnyRoleBefore) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.sendFirstRoleAssignmentCredentialsIfNeeded({
                                    manufacturerId: manufacturerId,
                                    vendorUserId: vendorUserId,
                                    user: user,
                                })];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [4 /*yield*/, this.invalidateRbacCache(manufacturerId)];
                        case 5:
                            _b.sent();
                            return [2 /*return*/, mapping];
                    }
                });
            });
        };
        RbacService_1.prototype.updateStaffRole = function (manufacturerId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorUserId, roleId, scopeDoc, _a, role, user, hadAnyRoleBefore, mapping;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!dto.roleId) {
                                throw new common_1.BadRequestException('roleId is required');
                            }
                            vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
                            roleId = this.toObjectId(dto.roleId, 'roleId');
                            scopeDoc = this.scopeDocument(manufacturerId);
                            return [4 /*yield*/, Promise.all([
                                    this.roleModel
                                        .findOne(__assign(__assign({ _id: roleId }, this.rbacScope(manufacturerId)), { status: 1 }))
                                        .exec(),
                                    this.findStaffUserById(vendorUserId, manufacturerId),
                                    this.mappingModel
                                        .countDocuments(__assign(__assign({}, this.rbacScope(manufacturerId)), { vendorUserId: vendorUserId, status: 1 }))
                                        .exec()
                                        .then(function (c) { return c > 0; }),
                                ])];
                        case 1:
                            _a = _b.sent(), role = _a[0], user = _a[1], hadAnyRoleBefore = _a[2];
                            if (!role)
                                throw new common_1.NotFoundException('Role not found');
                            if (!user)
                                throw new common_1.NotFoundException('Staff user not found');
                            return [4 /*yield*/, this.mappingModel.deleteMany(__assign(__assign({}, this.rbacScope(manufacturerId)), { vendorUserId: vendorUserId }))];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, this.mappingModel.create(__assign(__assign({}, scopeDoc), { vendorUserId: vendorUserId, roleId: roleId, status: 1 }))];
                        case 3:
                            mapping = _b.sent();
                            if (!!hadAnyRoleBefore) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.sendFirstRoleAssignmentCredentialsIfNeeded({
                                    manufacturerId: manufacturerId,
                                    vendorUserId: vendorUserId,
                                    user: user,
                                })];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [4 /*yield*/, this.invalidateRbacCache(manufacturerId)];
                        case 6:
                            _b.sent();
                            return [2 /*return*/, mapping];
                    }
                });
            });
        };
        RbacService_1.prototype.replaceStaffRoles = function (manufacturerId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorUserId, roleIds, roleObjectIds, scopeDoc, _a, user, hadAnyRoleBefore, validRolesCount, session, createdCount_1, credentialDelivery;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
                            roleIds = Array.from(new Set((dto.roleIds || []).map(function (r) { return String(r); })));
                            roleObjectIds = roleIds.map(function (id) { return _this.toObjectId(id, 'roleIds'); });
                            scopeDoc = this.scopeDocument(manufacturerId);
                            return [4 /*yield*/, Promise.all([
                                    this.findStaffUserById(vendorUserId, manufacturerId),
                                    this.mappingModel
                                        .countDocuments(__assign(__assign({}, this.rbacScope(manufacturerId)), { vendorUserId: vendorUserId, status: 1 }))
                                        .exec()
                                        .then(function (c) { return c > 0; }),
                                ])];
                        case 1:
                            _a = _b.sent(), user = _a[0], hadAnyRoleBefore = _a[1];
                            if (!user)
                                throw new common_1.NotFoundException('Staff user not found');
                            if (!(roleObjectIds.length > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.roleModel
                                    .countDocuments(__assign(__assign({ _id: { $in: roleObjectIds } }, this.rbacScope(manufacturerId)), { status: 1 }))
                                    .exec()];
                        case 2:
                            validRolesCount = _b.sent();
                            if (validRolesCount !== roleObjectIds.length) {
                                throw new common_1.NotFoundException('One or more roles not found');
                            }
                            _b.label = 3;
                        case 3: return [4 /*yield*/, this.mappingModel.db.startSession()];
                        case 4:
                            session = _b.sent();
                            _b.label = 5;
                        case 5:
                            _b.trys.push([5, , 10, 12]);
                            createdCount_1 = 0;
                            return [4 /*yield*/, session.withTransaction(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.mappingModel
                                                    .deleteMany(__assign(__assign({}, this.rbacScope(manufacturerId)), { vendorUserId: vendorUserId }))
                                                    .session(session)
                                                    .exec()];
                                            case 1:
                                                _a.sent();
                                                if (!(roleObjectIds.length > 0)) return [3 /*break*/, 3];
                                                return [4 /*yield*/, this.mappingModel.insertMany(roleObjectIds.map(function (roleId) { return (__assign(__assign({}, scopeDoc), { vendorUserId: vendorUserId, roleId: roleId, status: 1 })); }), { session: session, ordered: true })];
                                            case 2:
                                                _a.sent();
                                                createdCount_1 = roleObjectIds.length;
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 6:
                            _b.sent();
                            credentialDelivery = void 0;
                            if (!(!hadAnyRoleBefore && createdCount_1 > 0)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.sendFirstRoleAssignmentCredentialsIfNeeded({
                                    manufacturerId: manufacturerId,
                                    vendorUserId: vendorUserId,
                                    user: user,
                                })];
                        case 7:
                            credentialDelivery = _b.sent();
                            _b.label = 8;
                        case 8: return [4 /*yield*/, this.invalidateRbacCache(manufacturerId)];
                        case 9:
                            _b.sent();
                            return [2 /*return*/, __assign({ vendorUserId: String(vendorUserId), roleIds: roleIds, createdCount: createdCount_1 }, (credentialDelivery
                                    ? {
                                        temporaryPassword: credentialDelivery.temporaryPassword,
                                        email: credentialDelivery.email,
                                    }
                                    : {}))];
                        case 10: return [4 /*yield*/, session.endSession()];
                        case 11:
                            _b.sent();
                            return [7 /*endfinally*/];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        RbacService_1.prototype.unassignStaffRole = function (manufacturerId, vendorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorUserObjectId, res;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');
                            return [4 /*yield*/, this.mappingModel
                                    .deleteMany(__assign(__assign({}, this.rbacScope(manufacturerId)), { vendorUserId: vendorUserObjectId }))
                                    .exec()];
                        case 1:
                            res = _b.sent();
                            return [4 /*yield*/, this.invalidateRbacCache(manufacturerId)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, {
                                    vendorUserId: vendorUserId,
                                    deletedCount: (_a = res === null || res === void 0 ? void 0 : res.deletedCount) !== null && _a !== void 0 ? _a : 0,
                                }];
                    }
                });
            });
        };
        RbacService_1.prototype.getStaffWithRoles = function (manufacturerId, vendorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_6, where, rows, mapped;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.redisService.buildKey('rbac', (0, platform_rbac_scope_util_1.resolveRbacCacheScope)(manufacturerId), 'staff-roles', vendorUserId || 'all');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _a.sent();
                            if (Array.isArray(cached))
                                return [2 /*return*/, cached];
                            return [3 /*break*/, 4];
                        case 3:
                            error_6 = _a.sent();
                            this.logger.warn("RBAC staff-roles cache read failed: ".concat((error_6 === null || error_6 === void 0 ? void 0 : error_6.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            where = __assign(__assign({}, this.rbacScope(manufacturerId)), { status: 1 });
                            if (vendorUserId) {
                                where.vendorUserId = this.toObjectId(vendorUserId, 'vendorUserId');
                            }
                            return [4 /*yield*/, this.mappingModel
                                    .find(where)
                                    .populate('vendorUserId')
                                    .populate('roleId')
                                    .lean()
                                    .exec()];
                        case 5:
                            rows = _a.sent();
                            mapped = rows.map(function (row) {
                                var _a, _b, _c, _d;
                                var role = row.roleId;
                                var vendorUser = row.vendorUserId;
                                var roleActive = role && role.status !== 0;
                                var raw = roleActive
                                    ? _this.normalizePermissions(role.permissions || [])
                                    : [];
                                var effective = roleActive ? _this.effectivePermissionsFromRaw(raw) : [];
                                var roleIdValue = role && typeof role === 'object'
                                    ? String((_a = role._id) !== null && _a !== void 0 ? _a : '')
                                    : String((_b = row.roleId) !== null && _b !== void 0 ? _b : '');
                                var vendorUserIdValue = vendorUser && typeof vendorUser === 'object'
                                    ? String((_c = vendorUser._id) !== null && _c !== void 0 ? _c : '')
                                    : String((_d = row.vendorUserId) !== null && _d !== void 0 ? _d : '');
                                var roleIdPayload = role && typeof role === 'object'
                                    ? __assign(__assign({}, role), { effectivePermissions: effective }) : role;
                                return __assign(__assign({}, row), { vendorUserId: vendorUserIdValue, roleId: roleIdValue, vendorUser: vendorUser, role: roleIdPayload, effectivePermissions: effective });
                            });
                            this.redisService
                                .set(cacheKey, mapped, this.getRbacCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("RBAC staff-roles cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, mapped];
                    }
                });
            });
        };
        RbacService_1.prototype.vendorUserIsPlatformAdmin = function (vendorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorUserObjectId, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');
                            return [4 /*yield*/, this.vendorUserModel
                                    .findById(vendorUserObjectId)
                                    .select('type')
                                    .lean()
                                    .exec()];
                        case 1:
                            user = _a.sent();
                            return [2 /*return*/, (0, platform_admin_util_1.isPlatformAdminUser)({ type: user === null || user === void 0 ? void 0 : user.type })];
                    }
                });
            });
        };
        /** Full grant list for platform admin users (unrestricted portal). */
        RbacService_1.prototype.allPlatformAdminGrants = function () {
            return (0, permission_hierarchy_1.minimizePermissionSet)(__spreadArray([], permissions_constants_1.ALL_KNOWN_PERMISSION_VALUES, true));
        };
        RbacService_1.prototype.getStaffPermissions = function (manufacturerId, vendorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_7, vendorUserObjectId, mappings, permissions, _i, mappings_1, mapping, role, _a, _b, permission, minimized;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.vendorUserIsPlatformAdmin(vendorUserId)];
                        case 1:
                            if (_c.sent()) {
                                return [2 /*return*/, this.allPlatformAdminGrants()];
                            }
                            cacheKey = this.redisService.buildKey('rbac', (0, platform_rbac_scope_util_1.resolveRbacCacheScope)(manufacturerId), 'staff-permissions', vendorUserId);
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 3:
                            cached = _c.sent();
                            if (Array.isArray(cached))
                                return [2 /*return*/, cached];
                            return [3 /*break*/, 5];
                        case 4:
                            error_7 = _c.sent();
                            this.logger.warn("RBAC staff-permissions cache read failed: ".concat((error_7 === null || error_7 === void 0 ? void 0 : error_7.message) || 'unknown error'));
                            return [3 /*break*/, 5];
                        case 5:
                            vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');
                            return [4 /*yield*/, this.mappingModel
                                    .find(__assign(__assign({}, this.rbacScope(manufacturerId)), { vendorUserId: vendorUserObjectId, status: 1 }))
                                    .populate('roleId')
                                    .lean()
                                    .exec()];
                        case 6:
                            mappings = _c.sent();
                            permissions = new Set();
                            for (_i = 0, mappings_1 = mappings; _i < mappings_1.length; _i++) {
                                mapping = mappings_1[_i];
                                role = mapping.roleId;
                                if ((role === null || role === void 0 ? void 0 : role.status) === 0)
                                    continue;
                                for (_a = 0, _b = this.normalizePermissions((role === null || role === void 0 ? void 0 : role.permissions) || []); _a < _b.length; _a++) {
                                    permission = _b[_a];
                                    permissions.add(permission);
                                }
                            }
                            minimized = (0, permission_hierarchy_1.minimizePermissionSet)(Array.from(permissions));
                            this.redisService
                                .set(cacheKey, minimized, this.getRbacCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("RBAC staff-permissions cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, minimized];
                    }
                });
            });
        };
        /**
         * Admin / staff UI: **union** of all assigned roles’ grants, expanded to known permission keys.
         * Always reflects current `Role.permissions` in the database (same source as `getStaffPermissions` + guard).
         */
        RbacService_1.prototype.getStaffPermissionContext = function (manufacturerId, vendorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var grants_1, vendorUserObjectId, _a, grants, mappings, roleIds, effectivePermissions;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.vendorUserIsPlatformAdmin(vendorUserId)];
                        case 1:
                            if (_b.sent()) {
                                grants_1 = this.allPlatformAdminGrants();
                                return [2 /*return*/, {
                                        roleIds: [],
                                        grants: grants_1,
                                        effectivePermissions: this.effectivePermissionsFromRaw(grants_1),
                                        isPlatformAdmin: true,
                                    }];
                            }
                            vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');
                            return [4 /*yield*/, Promise.all([
                                    this.getStaffPermissions(manufacturerId, vendorUserId),
                                    this.mappingModel
                                        .find(__assign(__assign({}, this.rbacScope(manufacturerId)), { vendorUserId: vendorUserObjectId, status: 1 }))
                                        .select('roleId')
                                        .lean()
                                        .exec(),
                                ])];
                        case 2:
                            _a = _b.sent(), grants = _a[0], mappings = _a[1];
                            roleIds = mappings.map(function (m) { return String(m.roleId); });
                            effectivePermissions = this.effectivePermissionsFromRaw(grants);
                            return [2 /*return*/, {
                                    roleIds: roleIds,
                                    grants: grants,
                                    effectivePermissions: effectivePermissions,
                                    isPlatformAdmin: false,
                                }];
                    }
                });
            });
        };
        return RbacService_1;
    }());
    __setFunctionName(_classThis, "RbacService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RbacService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RbacService = _classThis;
}();
exports.RbacService = RbacService;
