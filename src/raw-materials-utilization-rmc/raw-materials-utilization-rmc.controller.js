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
exports.RawMaterialsUtilizationRmcController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var raw_materials_upload_util_1 = require("../common/raw-materials/raw-materials-upload.util");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var raw_materials_upload_util_2 = require("../common/raw-materials/raw-materials-upload.util");
var RawMaterialsUtilizationRmcController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Raw Materials Utilization RMC'), (0, common_1.Controller)('raw-materials-utilization-rmc'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _upsertByUrn_decorators;
    var _listByUrn_decorators;
    var RawMaterialsUtilizationRmcController = _classThis = /** @class */ (function () {
        function RawMaterialsUtilizationRmcController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        RawMaterialsUtilizationRmcController_1.prototype.create = function (user, body, uploadedFiles) {
            return __awaiter(this, void 0, void 0, function () {
                var file1, file2, stepFiles, data;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.vendorId)) {
                                throw new common_1.BadRequestException('Vendor ID not found in token');
                            }
                            if (!(body === null || body === void 0 ? void 0 : body.urnNo) || String(body.urnNo).trim() === '') {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            file1 = (_a = uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles.find(function (f) {
                                return ['utilizationRmcFile', 'step15File1', 'rawMaterials3151File'].includes(f.fieldname);
                            })) !== null && _a !== void 0 ? _a : uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles[0];
                            file2 = uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles.find(function (f) {
                                return ['utilizationRmcFile2', 'step15File2', 'rawMaterials3152File'].includes(f.fieldname);
                            });
                            stepFiles = [file1, file2].filter(Boolean);
                            if (stepFiles.length > 0) {
                                (0, raw_materials_upload_util_2.assertRawMaterialsDocumentTypes)(stepFiles);
                            }
                            return [4 /*yield*/, this.service.create(body, user.vendorId, { file1: file1, file2: file2 })];
                        case 1:
                            data = _b.sent();
                            return [2 /*return*/, { success: true, data: data }];
                    }
                });
            });
        };
        RawMaterialsUtilizationRmcController_1.prototype.upsertByUrn = function (user, urnNo, body, uploadedFiles) {
            return __awaiter(this, void 0, void 0, function () {
                var file1, file2, stepFiles, data;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.vendorId)) {
                                throw new common_1.BadRequestException('Vendor ID not found in token');
                            }
                            if (!urnNo || urnNo.trim() === '') {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            file1 = (_a = uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles.find(function (f) {
                                return ['utilizationRmcFile', 'step15File1', 'rawMaterials3151File'].includes(f.fieldname);
                            })) !== null && _a !== void 0 ? _a : uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles[0];
                            file2 = uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles.find(function (f) {
                                return ['utilizationRmcFile2', 'step15File2', 'rawMaterials3152File'].includes(f.fieldname);
                            });
                            stepFiles = [file1, file2].filter(Boolean);
                            if (stepFiles.length > 0) {
                                (0, raw_materials_upload_util_2.assertRawMaterialsDocumentTypes)(stepFiles);
                            }
                            return [4 /*yield*/, this.service.create(body, user.vendorId, { file1: file1, file2: file2 }, urnNo.trim())];
                        case 1:
                            data = _b.sent();
                            return [2 /*return*/, { success: true, data: data }];
                    }
                });
            });
        };
        RawMaterialsUtilizationRmcController_1.prototype.listByUrn = function (user, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.vendorId)) {
                                throw new common_1.BadRequestException('Vendor ID not found in token');
                            }
                            if (!urnNo || urnNo.trim() === '') {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            return [4 /*yield*/, this.service.listByUrn(urnNo.trim(), user.vendorId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { success: true, data: data }];
                    }
                });
            });
        };
        return RawMaterialsUtilizationRmcController_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsUtilizationRmcController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({
                summary: 'Create raw materials utilization RMC record (per URN)',
            }), (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)((0, raw_materials_upload_util_1.rawMaterialsMultipartMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data', 'application/json'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        urnNo: { type: 'string', example: 'URN-20260305124230' },
                        utilizationRmcFileName: {
                            type: 'string',
                            example: 'RMC Utilization Supporting Document - 2026',
                        },
                        utilizationRmcFile: { type: 'string', format: 'binary' },
                        utilizationRmcFile2: { type: 'string', format: 'binary' },
                    },
                    additionalProperties: true,
                },
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Created successfully' })];
        _upsertByUrn_decorators = [(0, common_1.Put)(':urnNo'), (0, swagger_1.ApiOperation)({ summary: 'Upsert raw materials step-15 payload by URN' }), (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)((0, raw_materials_upload_util_1.rawMaterialsMultipartMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data', 'application/json'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        utilizationRmcFileName: {
                            type: 'string',
                            example: 'RMC Utilization Supporting Document - 2026',
                        },
                        utilizationRmcFile: { type: 'string', format: 'binary' },
                        utilizationRmcFile2: { type: 'string', format: 'binary' },
                    },
                    additionalProperties: true,
                },
            })];
        _listByUrn_decorators = [(0, common_1.Get)(':urn_no'), (0, swagger_1.ApiOperation)({
                summary: 'List raw materials utilization RMC records by URN',
            }), (0, swagger_1.ApiParam)({ name: 'urn_no', example: 'URN-20260305124230' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Retrieved successfully' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _upsertByUrn_decorators, { kind: "method", name: "upsertByUrn", static: false, private: false, access: { has: function (obj) { return "upsertByUrn" in obj; }, get: function (obj) { return obj.upsertByUrn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listByUrn_decorators, { kind: "method", name: "listByUrn", static: false, private: false, access: { has: function (obj) { return "listByUrn" in obj; }, get: function (obj) { return obj.listByUrn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsUtilizationRmcController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsUtilizationRmcController = _classThis;
}();
exports.RawMaterialsUtilizationRmcController = RawMaterialsUtilizationRmcController;
