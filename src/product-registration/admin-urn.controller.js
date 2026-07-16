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
exports.AdminUrnController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var permissions_decorator_1 = require("../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../common/constants/permissions.constants");
var admin_patch_urn_status_body_dto_1 = require("./dto/admin-patch-urn-status-body.dto");
/**
 * REST-style admin URN routes used by the admin portal env:
 * `NEXT_PUBLIC_PATCH_URN_STATUS_PATH=/admin/urn/{urn}/status`
 * `NEXT_PUBLIC_ADMIN_URN_DETAILS_GET_PATH=/admin/urn/{urn}`
 */
var AdminUrnController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin URN'), (0, common_1.Controller)('admin/urn'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDetailsByUrn_decorators;
    var _patchUrnStatus_decorators;
    var AdminUrnController = _classThis = /** @class */ (function () {
        function AdminUrnController_1(productRegistrationService) {
            this.productRegistrationService = (__runInitializers(this, _instanceExtraInitializers), productRegistrationService);
        }
        AdminUrnController_1.prototype.getDetailsByUrn = function (urn) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = decodeURIComponent(String(urn !== null && urn !== void 0 ? urn : '')).trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            return [4 /*yield*/, this.productRegistrationService.getProductDetailsByUrn(urnNo)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { success: true, data: data }];
                    }
                });
            });
        };
        AdminUrnController_1.prototype.patchUrnStatus = function (urn, body) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = decodeURIComponent(String(urn !== null && urn !== void 0 ? urn : '')).trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            return [4 /*yield*/, this.productRegistrationService.adminUpdateUrnStatus({
                                    urnNo: urnNo,
                                    updateStatusType: body.updateStatusType,
                                    updateStatusTo: body.updateStatusTo,
                                })];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'URN status updated',
                                    data: data,
                                }];
                    }
                });
            });
        };
        return AdminUrnController_1;
    }());
    __setFunctionName(_classThis, "AdminUrnController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDetailsByUrn_decorators = [(0, common_1.Get)(':urn'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({
                summary: 'Get product details by URN (platform admin, REST path)',
                description: 'Alias for **GET /api/admin/products/details/:urn** — lookup by URN only.',
            }), (0, swagger_1.ApiParam)({
                name: 'urn',
                description: 'Full URN (e.g. URN-20260303140911)',
                example: 'URN-20260303140911',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Product details for the URN' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'No products for this URN' })];
        _patchUrnStatus_decorators = [(0, common_1.Patch)(':urn/status'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Update URN status (platform admin, REST path)',
                description: 'Alias for **PATCH /api/admin/products/urn-status**. URN is taken from the path; body fields **updateStatusType** and **updateStatusTo** are required.',
            }), (0, swagger_1.ApiParam)({
                name: 'urn',
                description: 'Full URN (e.g. URN-20260303140911)',
                example: 'URN-20260303140911',
            }), (0, swagger_1.ApiBody)({ type: admin_patch_urn_status_body_dto_1.AdminPatchUrnStatusBodyDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Unknown URN' })];
        __esDecorate(_classThis, null, _getDetailsByUrn_decorators, { kind: "method", name: "getDetailsByUrn", static: false, private: false, access: { has: function (obj) { return "getDetailsByUrn" in obj; }, get: function (obj) { return obj.getDetailsByUrn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _patchUrnStatus_decorators, { kind: "method", name: "patchUrnStatus", static: false, private: false, access: { has: function (obj) { return "patchUrnStatus" in obj; }, get: function (obj) { return obj.patchUrnStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminUrnController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminUrnController = _classThis;
}();
exports.AdminUrnController = AdminUrnController;
