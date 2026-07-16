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
exports.AuditLogAdminController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var audit_log_response_dto_1 = require("./dto/audit-log-response.dto");
var mongoose_1 = require("mongoose");
var AuditLogAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin Audit Log'), (0, common_1.Controller)('admin/audit-log'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('admin', 'staff'), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _list_decorators;
    var _filters_decorators;
    var _detail_decorators;
    var AuditLogAdminController = _classThis = /** @class */ (function () {
        function AuditLogAdminController_1(auditLogService) {
            this.auditLogService = (__runInitializers(this, _instanceExtraInitializers), auditLogService);
            this.logger = new common_1.Logger(AuditLogAdminController.name);
        }
        AuditLogAdminController_1.prototype.list = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var result, data, pagination, meta;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.auditLogService.list(query)];
                        case 1:
                            result = _a.sent();
                            data = result.items.map(function (doc) {
                                return (0, audit_log_response_dto_1.toAuditLogResponseDto)(doc);
                            });
                            pagination = {
                                totalCount: result.total,
                                page: result.page,
                                limit: result.limit,
                                totalPages: result.pages,
                            };
                            meta = __assign(__assign({}, pagination), { from: result.from.toISOString(), to: result.to.toISOString() });
                            return [2 /*return*/, (0, audit_log_response_dto_1.assertJsonSafe)({
                                    success: true,
                                    message: 'Audit log retrieved',
                                    data: data,
                                    pagination: pagination,
                                    meta: meta,
                                    totalCount: pagination.totalCount,
                                    page: pagination.page,
                                    limit: pagination.limit,
                                    totalPages: pagination.totalPages,
                                })];
                    }
                });
            });
        };
        AuditLogAdminController_1.prototype.filters = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.auditLogService.filterOptions(query)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, (0, audit_log_response_dto_1.assertJsonSafe)({
                                    success: true,
                                    message: 'Audit filter options retrieved',
                                    data: {
                                        modules: result.modules,
                                        action_types: result.action_types,
                                        actions: result.actions,
                                        users: result.users,
                                    },
                                    pagination: result.pagination,
                                    meta: __assign(__assign({}, result.pagination), { from: result.from.toISOString(), to: result.to.toISOString() }),
                                })];
                    }
                });
            });
        };
        AuditLogAdminController_1.prototype.detail = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, error_1, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                                this.logger.warn("Invalid audit detail id requested: ".concat(id));
                                throw new common_1.BadRequestException('Invalid audit log id');
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.auditLogService.findById(id)];
                        case 2:
                            doc = _a.sent();
                            if (!doc) {
                                this.logger.warn("Audit detail not found: ".concat(id));
                                throw new common_1.NotFoundException('Audit log entry not found');
                            }
                            return [2 /*return*/, (0, audit_log_response_dto_1.assertJsonSafe)({
                                    success: true,
                                    message: 'Audit log detail retrieved',
                                    data: (0, audit_log_response_dto_1.toAuditLogResponseDto)(doc),
                                })];
                        case 3:
                            error_1 = _a.sent();
                            if (error_1 instanceof common_1.BadRequestException ||
                                error_1 instanceof common_1.NotFoundException) {
                                throw error_1;
                            }
                            message = error_1 instanceof Error ? error_1.message : String(error_1);
                            this.logger.error("Failed to retrieve audit detail ".concat(id, ": ").concat(message));
                            throw new common_1.InternalServerErrorException('Audit log detail could not be retrieved');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return AuditLogAdminController_1;
    }());
    __setFunctionName(_classThis, "AuditLogAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _list_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({
                summary: 'List audit log entries (admin)',
                description: 'Append-only audit trail. Each row includes user-facing **module**, **action_type**, **description**, **performed_by**, and technical fields (**route**, **http_method**, **request.ip**, **status_code**). ' +
                    'By default this endpoint returns the latest one month of data with pagination. ' +
                    'For admin grids: **occurred_at** | **user_display** | **module** | **action_type** | **description** | **new_values** | **request.ip**.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated audit entries' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' })];
        _filters_decorators = [(0, common_1.Get)('filters'), (0, swagger_1.ApiOperation)({
                summary: 'Get active audit filter options (admin)',
                description: 'Returns filter options derived from audit rows in the selected date range. Modules are active-only, so unused module buckets are omitted.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit filter options' })];
        _detail_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({
                summary: 'Get audit log entry details (admin)',
                description: 'Returns a single append-only audit record with JSON-safe old_values/new_values. Missing snapshots are returned as null.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit entry details' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid audit log id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Audit entry not found' })];
        __esDecorate(_classThis, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: function (obj) { return "list" in obj; }, get: function (obj) { return obj.list; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _filters_decorators, { kind: "method", name: "filters", static: false, private: false, access: { has: function (obj) { return "filters" in obj; }, get: function (obj) { return obj.filters; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _detail_decorators, { kind: "method", name: "detail", static: false, private: false, access: { has: function (obj) { return "detail" in obj; }, get: function (obj) { return obj.detail; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditLogAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditLogAdminController = _classThis;
}();
exports.AuditLogAdminController = AuditLogAdminController;
