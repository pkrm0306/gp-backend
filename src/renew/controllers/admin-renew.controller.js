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
exports.AdminRenewController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../common/guards/permissions.guard");
var permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../../common/constants/permissions.constants");
var renew_details_response_util_1 = require("../utils/renew-details-response.util");
var StartRenewalCycleDto = /** @class */ (function () {
    function StartRenewalCycleDto() {
    }
    return StartRenewalCycleDto;
}());
var AdminRenewController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Renew - Admin'), (0, common_1.Controller)(['renew/admin', 'admin/renew/admin']), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _patchTestValidity_decorators;
    var _getQuickView_decorators;
    var _getRenewDetails_decorators;
    var _getRenewList_decorators;
    var _completeRenewal_decorators;
    var _startRenewalCycle_decorators;
    var AdminRenewController = _classThis = /** @class */ (function () {
        function AdminRenewController_1(renewQuickViewService, renewDetailsService, renewalOrchestrationService, renewAdminTestValidityService, productRegistrationService) {
            this.renewQuickViewService = (__runInitializers(this, _instanceExtraInitializers), renewQuickViewService);
            this.renewDetailsService = renewDetailsService;
            this.renewalOrchestrationService = renewalOrchestrationService;
            this.renewAdminTestValidityService = renewAdminTestValidityService;
            this.productRegistrationService = productRegistrationService;
        }
        AdminRenewController_1.prototype.patchTestValidity = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var userId;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    userId = String((_c = (_b = (_a = user === null || user === void 0 ? void 0 : user.userId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.sub) !== null && _b !== void 0 ? _b : user === null || user === void 0 ? void 0 : user._id) !== null && _c !== void 0 ? _c : '').trim();
                    if (!userId) {
                        throw new common_1.BadRequestException('User ID not found in token');
                    }
                    return [2 /*return*/, this.renewAdminTestValidityService.applyTestValidity(dto, userId)];
                });
            });
        };
        AdminRenewController_1.prototype.getQuickView = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.renewQuickViewService.buildQuickView(urnNo, undefined, renewalCycleId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { success: true, message: 'Renewal quick view fetched successfully', data: data }];
                    }
                });
            });
        };
        AdminRenewController_1.prototype.getRenewDetails = function (urnNo, renewalCycleId, include) {
            return __awaiter(this, void 0, void 0, function () {
                var includeMode, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(urnNo === null || urnNo === void 0 ? void 0 : urnNo.trim())) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            includeMode = (0, renew_details_response_util_1.parseRenewDetailsInclude)(include);
                            return [4 /*yield*/, this.renewDetailsService.getRenewDetailsByUrn(urnNo.trim(), renewalCycleId, { role: 'admin', include: includeMode })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, (0, renew_details_response_util_1.buildRenewDetailsHttpResponse)(result, includeMode)];
                    }
                });
            });
        };
        AdminRenewController_1.prototype.getRenewList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, data, total;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.productRegistrationService.adminListRenewProducts()];
                        case 1:
                            _a = _b.sent(), data = _a.data, total = _a.total;
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Renew list fetched successfully',
                                    data: data,
                                    total: total,
                                }];
                    }
                });
            });
        };
        AdminRenewController_1.prototype.completeRenewal = function (user, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var userId;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            userId = (_b = (_a = user === null || user === void 0 ? void 0 : user.userId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.sub) !== null && _b !== void 0 ? _b : user === null || user === void 0 ? void 0 : user._id;
                            if (!userId) {
                                throw new common_1.BadRequestException('User ID not found in token');
                            }
                            return [4 /*yield*/, this.renewalOrchestrationService.completeRenewal(urnNo, userId)];
                        case 1:
                            _c.sent();
                            return [2 /*return*/, { success: true, message: 'Renewal completed successfully' }];
                    }
                });
            });
        };
        AdminRenewController_1.prototype.startRenewalCycle = function (user, body) {
            return __awaiter(this, void 0, void 0, function () {
                var userId;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!((_a = body === null || body === void 0 ? void 0 : body.urnNo) === null || _a === void 0 ? void 0 : _a.trim())) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            userId = (_c = (_b = user === null || user === void 0 ? void 0 : user.userId) !== null && _b !== void 0 ? _b : user === null || user === void 0 ? void 0 : user.sub) !== null && _c !== void 0 ? _c : user === null || user === void 0 ? void 0 : user._id;
                            if (!userId) {
                                throw new common_1.BadRequestException('User ID not found in token');
                            }
                            return [4 /*yield*/, this.renewalOrchestrationService.startRenewalCycle(body.urnNo, userId, body.paymentId)];
                        case 1:
                            _d.sent();
                            return [2 /*return*/, { success: true, message: 'Renewal cycle started', data: { urnNo: body.urnNo.trim() } }];
                    }
                });
            });
        };
        return AdminRenewController_1;
    }());
    __setFunctionName(_classThis, "AdminRenewController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _patchTestValidity_decorators = [(0, common_1.Patch)('test-validity'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, swagger_1.ApiOperation)({
                summary: 'Test renewal — change valid till and start a new renewal cycle',
                description: 'Admin-only. Updates validtillDate, completes any in-progress cycle, creates cycleNo+1, sets urn_status=12 and product_renew_status=0. Does not copy prior-cycle process or payment data.',
            })];
        _getQuickView_decorators = [(0, common_1.Get)('quick-view/:urnNo'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({ summary: 'Admin renewal quick view for a URN' }), (0, swagger_1.ApiParam)({ name: 'urnNo', type: String })];
        _getRenewDetails_decorators = [(0, common_1.Get)('details/:urnNo'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({
                summary: 'Full renewal URN details (admin — same shape as uncertified GET /products/details)',
                description: 'Use include=full for a single workspace payload (process sections, payment, tabReviews, processComments).',
            }), (0, swagger_1.ApiParam)({ name: 'urnNo', type: String })];
        _getRenewList_decorators = [(0, common_1.Get)('renew-list'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({
                summary: 'Admin renew products list (grouped by manufacturer)',
                description: 'Returns manufacturer groups with manufacturer_name, nested urns and certified EOIs only (excludes rejected).',
            })];
        _completeRenewal_decorators = [(0, common_1.Post)('complete-renewal/:urnNo'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, swagger_1.ApiOperation)({ summary: 'Complete renewal for a URN' }), (0, swagger_1.ApiParam)({ name: 'urnNo', type: String })];
        _startRenewalCycle_decorators = [(0, common_1.Post)('start-renewal-cycle'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, swagger_1.ApiOperation)({ summary: 'Start a renewal cycle for a URN' })];
        __esDecorate(_classThis, null, _patchTestValidity_decorators, { kind: "method", name: "patchTestValidity", static: false, private: false, access: { has: function (obj) { return "patchTestValidity" in obj; }, get: function (obj) { return obj.patchTestValidity; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getQuickView_decorators, { kind: "method", name: "getQuickView", static: false, private: false, access: { has: function (obj) { return "getQuickView" in obj; }, get: function (obj) { return obj.getQuickView; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRenewDetails_decorators, { kind: "method", name: "getRenewDetails", static: false, private: false, access: { has: function (obj) { return "getRenewDetails" in obj; }, get: function (obj) { return obj.getRenewDetails; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRenewList_decorators, { kind: "method", name: "getRenewList", static: false, private: false, access: { has: function (obj) { return "getRenewList" in obj; }, get: function (obj) { return obj.getRenewList; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _completeRenewal_decorators, { kind: "method", name: "completeRenewal", static: false, private: false, access: { has: function (obj) { return "completeRenewal" in obj; }, get: function (obj) { return obj.completeRenewal; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _startRenewalCycle_decorators, { kind: "method", name: "startRenewalCycle", static: false, private: false, access: { has: function (obj) { return "startRenewalCycle" in obj; }, get: function (obj) { return obj.startRenewalCycle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminRenewController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminRenewController = _classThis;
}();
exports.AdminRenewController = AdminRenewController;
