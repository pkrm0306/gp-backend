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
exports.AdminVendorUserController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var permissions_decorator_1 = require("../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../common/constants/permissions.constants");
var update_manufacturer_profile_dto_1 = require("../manufacturers/dto/update-manufacturer-profile.dto");
var vendor_profile_upload_config_1 = require("../manufacturers/vendor-profile-upload.config");
var AdminVendorUserController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin Vendor User'), (0, common_1.Controller)('admin/vendor-user'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getVendorUserProfile_decorators;
    var _updateVendorUserProfile_decorators;
    var AdminVendorUserController = _classThis = /** @class */ (function () {
        function AdminVendorUserController_1(manufacturersService) {
            this.manufacturersService = (__runInitializers(this, _instanceExtraInitializers), manufacturersService);
        }
        AdminVendorUserController_1.prototype.getVendorUserProfile = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.getVendorDetailsByAuthUserId(user.userId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Vendor profile retrieved successfully', data: data }];
                    }
                });
            });
        };
        AdminVendorUserController_1.prototype.updateVendorUserProfile = function (user, req, updateDto, files) {
            return __awaiter(this, void 0, void 0, function () {
                var raw, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            raw = typeof req.body === 'object' && req.body !== null && !Array.isArray(req.body)
                                ? req.body
                                : undefined;
                            return [4 /*yield*/, this.manufacturersService.editProfileWithOptionalBrandingFiles(user, updateDto, files, raw)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Profile updated successfully', data: data }];
                    }
                });
            });
        };
        return AdminVendorUserController_1;
    }());
    __setFunctionName(_classThis, "AdminVendorUserController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getVendorUserProfile_decorators = [(0, common_1.Get)('profile'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PROFILE_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Get vendor user profile (admin portal)',
                description: 'Returns vendor/company profile for the logged-in admin-portal user, resolved via vendor-users → manufacturer (same payload as GET /api/vendor/profile).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' })];
        _updateVendorUserProfile_decorators = [(0, common_1.Patch)('profile'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PROFILE_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'gst', maxCount: 1 },
                { name: 'gstDocument', maxCount: 1 },
                { name: 'companyLogo', maxCount: 1 },
                { name: 'pan', maxCount: 1 },
                { name: 'panDocument', maxCount: 1 },
            ], (0, vendor_profile_upload_config_1.vendorProfileBrandingMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('application/json', 'multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Update vendor user profile (admin portal)',
                description: 'Updates vendor/company profile for the logged-in admin-portal user (same behavior as PATCH /api/vendor/profile). ' +
                    'Supports JSON or multipart with optional GST, company logo, and PAN uploads.',
            }), (0, swagger_1.ApiBody)({ type: update_manufacturer_profile_dto_1.UpdateProfileDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' })];
        __esDecorate(_classThis, null, _getVendorUserProfile_decorators, { kind: "method", name: "getVendorUserProfile", static: false, private: false, access: { has: function (obj) { return "getVendorUserProfile" in obj; }, get: function (obj) { return obj.getVendorUserProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateVendorUserProfile_decorators, { kind: "method", name: "updateVendorUserProfile", static: false, private: false, access: { has: function (obj) { return "updateVendorUserProfile" in obj; }, get: function (obj) { return obj.updateVendorUserProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminVendorUserController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminVendorUserController = _classThis;
}();
exports.AdminVendorUserController = AdminVendorUserController;
