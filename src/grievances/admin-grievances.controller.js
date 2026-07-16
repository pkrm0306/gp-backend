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
exports.AdminGrievancesController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var permissions_decorator_1 = require("../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../common/constants/permissions.constants");
var respond_grievance_dto_1 = require("./dto/respond-grievance.dto");
var AdminGrievancesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin Grievances'), (0, common_1.Controller)('api/admin/grievances'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _findOne_decorators;
    var _respond_decorators;
    var AdminGrievancesController = _classThis = /** @class */ (function () {
        function AdminGrievancesController_1(grievancesService) {
            this.grievancesService = (__runInitializers(this, _instanceExtraInitializers), grievancesService);
        }
        AdminGrievancesController_1.prototype.requireAdminUserId = function (user) {
            var userId = (user === null || user === void 0 ? void 0 : user.userId) || (user === null || user === void 0 ? void 0 : user.id);
            if (!userId) {
                throw new common_1.BadRequestException('Admin user ID not found in token');
            }
            return String(userId);
        };
        AdminGrievancesController_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.grievancesService.findAllForAdmin(query)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Grievances retrieved successfully',
                                    data: result.items,
                                    total: result.total,
                                    page: result.page,
                                    limit: result.limit,
                                    totalPages: result.totalPages,
                                    pagination: {
                                        page: result.page,
                                        limit: result.limit,
                                        total: result.total,
                                        totalPages: result.totalPages,
                                    },
                                }];
                    }
                });
            });
        };
        AdminGrievancesController_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.grievancesService.findOneForAdmin(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Grievance retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminGrievancesController_1.prototype.respond = function (user, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var adminUserId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            adminUserId = this.requireAdminUserId(user);
                            return [4 /*yield*/, this.grievancesService.respondForAdmin(id, dto, adminUserId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Grievance response saved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        return AdminGrievancesController_1;
    }());
    __setFunctionName(_classThis, "AdminGrievancesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GRIEVANCES_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List all grievances (admin)',
                description: 'Supports pagination, search, status, category, and createdAt date range (from/to).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Grievances retrieved successfully' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GRIEVANCES_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Get grievance by id (admin)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Grievance MongoDB ObjectId' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Grievance retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Grievance not found' })];
        _respond_decorators = [(0, common_1.Patch)(':id/respond'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.GRIEVANCES_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Respond to a grievance (admin)',
                description: 'Saves adminResponse, respondedBy, respondedAt, and status (Responded or Closed).',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Grievance MongoDB ObjectId' }), (0, swagger_1.ApiBody)({ type: respond_grievance_dto_1.RespondGrievanceDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Grievance response saved' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }), (0, swagger_1.ApiResponse)({
                status: 409,
                description: 'Grievance is closed and cannot be modified',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Grievance not found' })];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _respond_decorators, { kind: "method", name: "respond", static: false, private: false, access: { has: function (obj) { return "respond" in obj; }, get: function (obj) { return obj.respond; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminGrievancesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminGrievancesController = _classThis;
}();
exports.AdminGrievancesController = AdminGrievancesController;
