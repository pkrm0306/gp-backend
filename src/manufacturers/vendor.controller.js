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
exports.VendorController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var change_password_dto_1 = require("./dto/change-password.dto");
var update_manufacturer_profile_dto_1 = require("./dto/update-manufacturer-profile.dto");
var update_vendor_contacts_dto_1 = require("./dto/update-vendor-contacts.dto");
var vendor_profile_upload_config_1 = require("./vendor-profile-upload.config");
var VendorController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Vendor'), (0, common_1.Controller)('api/vendor'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _uploadVendorProfileBranding_decorators;
    var _getVendorProfile_decorators;
    var _updateVendorProfile_decorators;
    var _getVendorContacts_decorators;
    var _updateVendorContacts_decorators;
    var _changeVendorPassword_decorators;
    var VendorController = _classThis = /** @class */ (function () {
        function VendorController_1(manufacturersService) {
            this.manufacturersService = (__runInitializers(this, _instanceExtraInitializers), manufacturersService);
        }
        VendorController_1.prototype.uploadVendorProfileBranding = function (user, files) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.uploadVendorProfileBranding(user, files)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Vendor profile files updated successfully', data: data }];
                    }
                });
            });
        };
        VendorController_1.prototype.getVendorProfile = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.getVendorDetailsByAuthUserId(user.userId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Vendor details retrieved successfully', data: data }];
                    }
                });
            });
        };
        VendorController_1.prototype.updateVendorProfile = function (user, req, updateDto, files) {
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
                            return [2 /*return*/, { message: 'Vendor profile updated successfully', data: data }];
                    }
                });
            });
        };
        VendorController_1.prototype.getVendorContacts = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.getVendorContactsByAuthUserId(user.userId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Vendor contacts retrieved successfully', data: data }];
                    }
                });
            });
        };
        VendorController_1.prototype.updateVendorContacts = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.updateVendorContacts(user, dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Vendor contacts updated successfully', data: data }];
                    }
                });
            });
        };
        VendorController_1.prototype.changeVendorPassword = function (user, changePasswordDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.changePassword(user.userId, changePasswordDto)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Password changed successfully' }];
                    }
                });
            });
        };
        return VendorController_1;
    }());
    __setFunctionName(_classThis, "VendorController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _uploadVendorProfileBranding_decorators = [(0, common_1.Post)('profile/upload'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'gst', maxCount: 1 },
                { name: 'gstDocument', maxCount: 1 },
                { name: 'companyLogo', maxCount: 1 },
                { name: 'pan', maxCount: 1 },
                { name: 'panDocument', maxCount: 1 },
            ], (0, vendor_profile_upload_config_1.vendorProfileBrandingMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Upload GST certificate and/or company logo',
                description: 'Multipart: **gst** or **gstDocument** = one **PDF, JPG, or PNG** (GST certificate); **companyLogo** = one image (jpeg/png/gif/webp); **pan** or **panDocument** = one **PDF, JPG, or PNG** (PAN card scan). ' +
                    'At least one file is required. Files are stored only through the shared **uploadFile()** helper in `src/utils/upload-file.util.ts` (local `uploads/manufacturers/` or S3 when configured).',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Returns updated profile payload (same shape as PATCH profile)',
            })];
        _getVendorProfile_decorators = [(0, common_1.Get)('profile'), (0, swagger_1.ApiOperation)({
                summary: 'Get vendor details from manufacturer table (auth user based)',
                description: 'Uses logged-in user id from JWT, resolves manufacturer mapping via vendor-users, and returns vendor details from manufacturer record. ' +
                    'Includes **gstPdf**, **companyLogo**, **pan** (PAN document URL), and **panNumber** (PAN id text) when set.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Vendor details retrieved successfully',
            })];
        _updateVendorProfile_decorators = [(0, common_1.Patch)('profile'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
                { name: 'gst', maxCount: 1 },
                { name: 'gstDocument', maxCount: 1 },
                { name: 'companyLogo', maxCount: 1 },
                { name: 'pan', maxCount: 1 },
                { name: 'panDocument', maxCount: 1 },
            ], (0, vendor_profile_upload_config_1.vendorProfileBrandingMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('application/json', 'multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Update vendor profile (auth user based)',
                description: 'Updates vendor/company fields on the linked **manufacturer** for the logged-in vendor user. ' +
                    'Send **application/json** with URL fields, or **multipart/form-data** with the same text fields plus optional files. ' +
                    'File fields: **gst** or **gstDocument** (**PDF, JPG, or PNG only**), **companyLogo** (image), **pan** or **panDocument** (**PDF, JPG, or PNG only**). If the form sends both **pan** and **panDocument**, use **panDocument** for the real file (an empty **pan** slot is ignored when **panDocument** has content). Uploaded files use the shared **uploadFile()** helper in `src/utils/upload-file.util.ts` (local or S3). ' +
                    '**gst** (JSON): GST certificate document URL path or `https://…`; use **gstNumber** for GST id text. ' +
                    'Alternatively use **POST /api/vendor/profile/upload** for file-only updates.',
            }), (0, swagger_1.ApiBody)({ type: update_manufacturer_profile_dto_1.UpdateProfileDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Vendor profile updated successfully',
            })];
        _getVendorContacts_decorators = [(0, common_1.Get)('contacts'), (0, swagger_1.ApiOperation)({
                summary: 'Get technical and marketing contacts (vendor manufacturer)',
                description: 'Returns **technicalContact** and **marketingContact**, each with **name**, **email_id**, **phone_number**, **designation** (empty strings if never set).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Contacts retrieved successfully' })];
        _updateVendorContacts_decorators = [(0, common_1.Patch)('contacts'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Update technical and marketing contacts',
                description: 'JSON body with **technicalContact** and **marketingContact** objects. Each must include **name**, **email_id**, **phone_number**, and **designation** (all required).',
            }), (0, swagger_1.ApiBody)({ type: update_vendor_contacts_dto_1.UpdateVendorContactsDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Contacts updated successfully' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Validation error or no linked manufacturer',
            })];
        _changeVendorPassword_decorators = [(0, common_1.Patch)('change-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Vendor change password',
                description: 'Changes password for the logged-in vendor user.',
            }), (0, swagger_1.ApiBody)({ type: change_password_dto_1.ChangePasswordDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully' })];
        __esDecorate(_classThis, null, _uploadVendorProfileBranding_decorators, { kind: "method", name: "uploadVendorProfileBranding", static: false, private: false, access: { has: function (obj) { return "uploadVendorProfileBranding" in obj; }, get: function (obj) { return obj.uploadVendorProfileBranding; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVendorProfile_decorators, { kind: "method", name: "getVendorProfile", static: false, private: false, access: { has: function (obj) { return "getVendorProfile" in obj; }, get: function (obj) { return obj.getVendorProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateVendorProfile_decorators, { kind: "method", name: "updateVendorProfile", static: false, private: false, access: { has: function (obj) { return "updateVendorProfile" in obj; }, get: function (obj) { return obj.updateVendorProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVendorContacts_decorators, { kind: "method", name: "getVendorContacts", static: false, private: false, access: { has: function (obj) { return "getVendorContacts" in obj; }, get: function (obj) { return obj.getVendorContacts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateVendorContacts_decorators, { kind: "method", name: "updateVendorContacts", static: false, private: false, access: { has: function (obj) { return "updateVendorContacts" in obj; }, get: function (obj) { return obj.updateVendorContacts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changeVendorPassword_decorators, { kind: "method", name: "changeVendorPassword", static: false, private: false, access: { has: function (obj) { return "changeVendorPassword" in obj; }, get: function (obj) { return obj.changeVendorPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorController = _classThis;
}();
exports.VendorController = VendorController;
