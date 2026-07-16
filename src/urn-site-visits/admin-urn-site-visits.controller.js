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
exports.AdminUrnSiteVisitsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var permissions_decorator_1 = require("../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../common/constants/permissions.constants");
var create_urn_site_visit_dto_1 = require("./dto/create-urn-site-visit.dto");
var update_urn_site_visit_dto_1 = require("./dto/update-urn-site-visit.dto");
var AdminUrnSiteVisitsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin URN Site Visits'), (0, common_1.Controller)('api/admin/urn-site-visits'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _list_decorators;
    var _plantOptions_decorators;
    var _getOne_decorators;
    var _create_decorators;
    var _update_decorators;
    var _remove_decorators;
    var AdminUrnSiteVisitsController = _classThis = /** @class */ (function () {
        function AdminUrnSiteVisitsController_1(urnSiteVisitsService) {
            this.urnSiteVisitsService = (__runInitializers(this, _instanceExtraInitializers), urnSiteVisitsService);
        }
        AdminUrnSiteVisitsController_1.prototype.actorId = function (user) {
            var _a, _b;
            var id = (_b = (_a = user === null || user === void 0 ? void 0 : user.userId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.sub) !== null && _b !== void 0 ? _b : user === null || user === void 0 ? void 0 : user.id;
            return id !== undefined && id !== null ? String(id) : undefined;
        };
        AdminUrnSiteVisitsController_1.prototype.list = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.urnSiteVisitsService.list(query)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Site visits listed successfully',
                                    data: result.data,
                                    total: result.total,
                                    page: result.page,
                                    limit: result.limit,
                                }];
                    }
                });
            });
        };
        AdminUrnSiteVisitsController_1.prototype.plantOptions = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var options;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.urnSiteVisitsService.listPlantOptionsForUrn(query.urnNo)];
                        case 1:
                            options = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Plant options retrieved successfully',
                                    data: options,
                                    options: options,
                                }];
                    }
                });
            });
        };
        AdminUrnSiteVisitsController_1.prototype.getOne = function (id, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.urnSiteVisitsService.getById(id, urnNo)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Site visit fetched successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminUrnSiteVisitsController_1.prototype.create = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.urnSiteVisitsService.create(dto, this.actorId(user))];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Site visit created successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminUrnSiteVisitsController_1.prototype.update = function (user, id, body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.urnSiteVisitsService.update(id, body, this.actorId(user), body)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Site visit updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminUrnSiteVisitsController_1.prototype.remove = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.urnSiteVisitsService.softDelete(id, this.actorId(user))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Site visit deleted successfully',
                                    data: { id: id },
                                }];
                    }
                });
            });
        };
        return AdminUrnSiteVisitsController_1;
    }());
    __setFunctionName(_classThis, "AdminUrnSiteVisitsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _list_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({ summary: 'List site visits for a URN (admin)' }), (0, swagger_1.ApiQuery)({ name: 'urnNo', required: true }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Site visits listed' })];
        _plantOptions_decorators = [(0, common_1.Get)('plant-options'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({
                summary: 'Plant name options for site visit form (admin)',
                description: 'Returns distinct manufacturing **plantName** values for the URN (single-select `name` on create/update).',
            }), (0, swagger_1.ApiQuery)({ name: 'urnNo', required: true }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Plant options for dropdown' })];
        _getOne_decorators = [(0, common_1.Get)(':id'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({ summary: 'Get one site visit by id (admin)' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Site visit MongoDB id' }), (0, swagger_1.ApiQuery)({ name: 'urnNo', required: false })];
        _create_decorators = [(0, common_1.Post)(), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({
                summary: 'Create site visit for a URN (admin)',
                description: 'Address fields: plant `name`, `addressLine1`, optional `addressLine2`, `city`, `state`, `country`. Postal code is not collected.',
            }), (0, swagger_1.ApiBody)({ type: create_urn_site_visit_dto_1.CreateUrnSiteVisitDto }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Site visit created' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, swagger_1.ApiOperation)({
                summary: 'Update site visit (admin)',
                description: 'Updatable address fields exclude postal code (not collected on site visits).',
            }), (0, swagger_1.ApiParam)({ name: 'id' }), (0, swagger_1.ApiBody)({ type: update_urn_site_visit_dto_1.UpdateUrnSiteVisitDto })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Soft-delete site visit (admin)' }), (0, swagger_1.ApiParam)({ name: 'id' })];
        __esDecorate(_classThis, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: function (obj) { return "list" in obj; }, get: function (obj) { return obj.list; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _plantOptions_decorators, { kind: "method", name: "plantOptions", static: false, private: false, access: { has: function (obj) { return "plantOptions" in obj; }, get: function (obj) { return obj.plantOptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOne_decorators, { kind: "method", name: "getOne", static: false, private: false, access: { has: function (obj) { return "getOne" in obj; }, get: function (obj) { return obj.getOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminUrnSiteVisitsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminUrnSiteVisitsController = _classThis;
}();
exports.AdminUrnSiteVisitsController = AdminUrnSiteVisitsController;
