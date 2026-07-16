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
exports.RawMaterialsRecycledContentController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var raw_materials_upload_util_1 = require("../common/raw-materials/raw-materials-upload.util");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var raw_materials_upload_util_2 = require("../common/raw-materials/raw-materials-upload.util");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var RECYCLED_UNIT_ROW_KEYS = [
    'unitName',
    'year',
    'unit1',
    'yeardata1',
    'unit2',
    'yeardata2',
];
var RawMaterialsRecycledContentController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Raw Materials Recycled Content'), (0, common_1.Controller)('raw-materials-recycled-content'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _listByUrn_decorators;
    var RawMaterialsRecycledContentController = _classThis = /** @class */ (function () {
        function RawMaterialsRecycledContentController_1(service, stepGate) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
            this.stepGate = stepGate;
        }
        RawMaterialsRecycledContentController_1.prototype.create = function (user, body, uploadedFiles) {
            return __awaiter(this, void 0, void 0, function () {
                var units, recycledContentFile, urnNo, persistedRecordCount, dto, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.vendorId)) {
                                throw new common_1.BadRequestException('Vendor ID not found in token');
                            }
                            units = (0, raw_materials_upload_util_2.parseMultipartJsonArray)(body.units, 'units');
                            recycledContentFile = (0, raw_materials_upload_util_2.pickUploadFile)(uploadedFiles, [
                                'recycledContentFile',
                                'file',
                                'supportingDocument',
                                'document',
                            ]);
                            if (recycledContentFile) {
                                (0, raw_materials_upload_util_2.assertRawMaterialsDocumentTypes)([recycledContentFile]);
                            }
                            urnNo = (0, raw_materials_upload_util_2.parseRequiredRawMaterialsUrn)(body);
                            return [4 /*yield*/, this.service.countPersistedByUrn(urnNo, user.vendorId)];
                        case 1:
                            persistedRecordCount = _a.sent();
                            return [4 /*yield*/, this.stepGate.assertStepSubmitAllowed({
                                    vendorId: user.vendorId,
                                    urnNo: urnNo,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RECYCLED_CONTENT,
                                    files: recycledContentFile ? [recycledContentFile] : [],
                                    rows: units,
                                    rowKeys: RECYCLED_UNIT_ROW_KEYS,
                                    persistedRecordCount: persistedRecordCount,
                                })];
                        case 2:
                            _a.sent();
                            dto = {
                                urnNo: urnNo,
                                vendorId: body.vendorId,
                                recycledContentFileName: body.recycledContentFileName,
                                units: units,
                            };
                            return [4 /*yield*/, this.service.create(dto, user.vendorId, recycledContentFile)];
                        case 3:
                            data = _a.sent();
                            return [2 /*return*/, { success: true, data: data }];
                    }
                });
            });
        };
        RawMaterialsRecycledContentController_1.prototype.listByUrn = function (user, urnNo) {
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
        return RawMaterialsRecycledContentController_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsRecycledContentController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({
                summary: 'Create raw materials recycled content units (per URN)',
                description: '**units** and **recycledContentFile** are optional individually; at least one non-empty unit row or file is required (vendor enforces in UI). **units** replaces all rows for the URN.',
            }), (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)((0, raw_materials_upload_util_1.rawMaterialsMultipartMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data', 'application/json'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['urnNo'],
                    properties: {
                        urnNo: { type: 'string', example: 'URN-20260305124230' },
                        vendorId: { type: 'string', example: '66f1abcdef1234567890abcd' },
                        recycledContentFileName: {
                            type: 'string',
                            example: 'Recycled Content Supporting Document - 2026',
                        },
                        units: {
                            oneOf: [
                                {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            unitName: { type: 'string', example: 'Test Unit 1' },
                                            year: { type: 'number', example: 2024 },
                                            unit1: { type: 'number', example: 1 },
                                            yeardata1: { type: 'number', example: 10 },
                                            unit2: { type: 'number', example: 1 },
                                            yeardata2: { type: 'number', example: 5 },
                                        },
                                    },
                                },
                                {
                                    type: 'string',
                                    description: 'JSON stringified units array for multipart/form-data',
                                },
                            ],
                        },
                        recycledContentFile: { type: 'string', format: 'binary' },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Created successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'object',
                            properties: {
                                urnNo: { type: 'string', example: 'URN-XXXX' },
                                vendorId: { type: 'string', example: '66f1abcdef1234567890abcd' },
                                units: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            rawMaterialsRecycledContentId: { type: 'number', example: 101 },
                                            unitName: { type: 'string', example: 'Test Unit 1' },
                                            year: { type: 'number', example: 2024 },
                                            unit1: { type: 'number', example: 1 },
                                            yeardata1: { type: 'number', example: 10 },
                                            unit2: { type: 'number', example: 1 },
                                            yeardata2: { type: 'number', example: 5 },
                                            yeardata3: { type: 'number', example: 50 },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            })];
        _listByUrn_decorators = [(0, common_1.Get)(':urn_no'), (0, swagger_1.ApiOperation)({
                summary: 'Get all raw materials recycled content units by URN',
            }), (0, swagger_1.ApiParam)({ name: 'urn_no', example: 'URN-20260305124230' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Retrieved successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'object',
                            properties: {
                                urnNo: { type: 'string', example: 'URN-XXXX' },
                                vendorId: { type: 'string', example: '66f1abcdef1234567890abcd' },
                                units: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            rawMaterialsRecycledContentId: { type: 'number', example: 101 },
                                            unitName: { type: 'string', example: 'Test Unit 1' },
                                            year: { type: 'number', example: 2024 },
                                            unit1: { type: 'number', example: 1 },
                                            yeardata1: { type: 'number', example: 10 },
                                            unit2: { type: 'number', example: 1 },
                                            yeardata2: { type: 'number', example: 5 },
                                            yeardata3: { type: 'number', example: 50 },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listByUrn_decorators, { kind: "method", name: "listByUrn", static: false, private: false, access: { has: function (obj) { return "listByUrn" in obj; }, get: function (obj) { return obj.listByUrn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsRecycledContentController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsRecycledContentController = _classThis;
}();
exports.RawMaterialsRecycledContentController = RawMaterialsRecycledContentController;
