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
exports.ProductDesignController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var multer_universal_config_1 = require("../common/upload/multer-universal.config");
var product_design_upload_util_1 = require("./product-design-upload.util");
var product_design_strategies_validation_1 = require("./product-design-strategies.validation");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var ProductDesignController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Product Design'), (0, common_1.Controller)('product-design'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createProductDesign_decorators;
    var ProductDesignController = _classThis = /** @class */ (function () {
        function ProductDesignController_1(productDesignService) {
            this.productDesignService = (__runInitializers(this, _instanceExtraInitializers), productDesignService);
        }
        ProductDesignController_1.prototype.createProductDesign = function (user, body, files) {
            return __awaiter(this, void 0, void 0, function () {
                var measuresAndBenefits, rawMeasures, trimmed, parsed, strategiesRaw, createProductDesignDto, _a, ecoVisionFiles, supportingDocumentFiles, retained, hasDocumentUpload, result, plain, strategiesText, error_1;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 3, , 4]);
                            if (!(user === null || user === void 0 ? void 0 : user.vendorId)) {
                                throw new common_1.BadRequestException('Vendor ID not found in token');
                            }
                            measuresAndBenefits = void 0;
                            rawMeasures = body.measuresAndBenefits;
                            if (rawMeasures !== undefined && rawMeasures !== null) {
                                if (Array.isArray(rawMeasures)) {
                                    measuresAndBenefits = rawMeasures;
                                }
                                else if (typeof rawMeasures === 'string') {
                                    trimmed = rawMeasures.trim();
                                    if (trimmed === '') {
                                        measuresAndBenefits = [];
                                    }
                                    else {
                                        try {
                                            parsed = JSON.parse(trimmed);
                                            if (Array.isArray(parsed)) {
                                                measuresAndBenefits = parsed;
                                            }
                                            else if (parsed && typeof parsed === 'object') {
                                                measuresAndBenefits = [parsed];
                                            }
                                            else {
                                                measuresAndBenefits = [];
                                            }
                                        }
                                        catch (_e) {
                                            measuresAndBenefits = [];
                                        }
                                    }
                                }
                                else if (typeof rawMeasures === 'object') {
                                    measuresAndBenefits = [rawMeasures];
                                }
                            }
                            if (measuresAndBenefits !== undefined) {
                                measuresAndBenefits = (0, product_design_upload_util_1.normalizeMeasureBenefitRows)(measuresAndBenefits);
                            }
                            strategiesRaw = body.strategies !== undefined && body.strategies !== null
                                ? String(body.strategies)
                                : body.statergies !== undefined && body.statergies !== null
                                    ? String(body.statergies)
                                    : undefined;
                            createProductDesignDto = {
                                urnNo: body.urnNo,
                                strategies: strategiesRaw,
                                statergies: strategiesRaw,
                                productDesignStatus: body.productDesignStatus !== undefined &&
                                    body.productDesignStatus !== null &&
                                    body.productDesignStatus !== ''
                                    ? parseInt(String(body.productDesignStatus), 10)
                                    : undefined,
                                measuresAndBenefits: measuresAndBenefits,
                                existingEcoVisionDocumentIds: (0, product_design_upload_util_1.parseMultipartJsonIdArray)(body.existingEcoVisionDocumentIds),
                                existingSupportingDocumentIds: (0, product_design_upload_util_1.parseMultipartJsonIdArray)(body.existingSupportingDocumentIds),
                            };
                            if (!((_b = createProductDesignDto.urnNo) === null || _b === void 0 ? void 0 : _b.trim())) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            _a = (0, product_design_upload_util_1.collectProductDesignUploadFiles)(files, {
                                ecoVisionFilesCount: (0, product_design_upload_util_1.parseMultipartNonNegativeInt)(body.ecoVisionFilesCount),
                                supportingDesignFilesCount: (0, product_design_upload_util_1.parseMultipartNonNegativeInt)(body.supportingDesignFilesCount),
                            }), ecoVisionFiles = _a.ecoVisionFiles, supportingDocumentFiles = _a.supportingDocumentFiles;
                            (0, product_design_upload_util_1.assertSupportingDesignFileTypes)(supportingDocumentFiles);
                            return [4 /*yield*/, this.productDesignService.countRetainedProductDesignDocuments(createProductDesignDto.urnNo.trim(), user.vendorId, createProductDesignDto.existingEcoVisionDocumentIds, createProductDesignDto.existingSupportingDocumentIds)];
                        case 1:
                            retained = _d.sent();
                            if (!(0, product_design_upload_util_1.hasAtLeastOneProductDesignContent)({
                                strategies: strategiesRaw,
                                measuresAndBenefits: measuresAndBenefits,
                                ecoVisionFiles: ecoVisionFiles,
                                supportingDocumentFiles: supportingDocumentFiles,
                                allUploadFiles: files,
                                retainedEcoVisionDocumentCount: retained.ecoVision,
                                retainedSupportingDocumentCount: retained.supporting,
                            })) {
                                throw new common_1.BadRequestException(product_design_upload_util_1.PRODUCT_DESIGN_EMPTY_FORM_MESSAGE);
                            }
                            hasDocumentUpload = (0, product_design_upload_util_1.hasProductDesignDocumentUpload)({
                                ecoVisionFiles: ecoVisionFiles,
                                supportingDocumentFiles: supportingDocumentFiles,
                                allUploadFiles: files,
                                retainedEcoVisionDocumentCount: retained.ecoVision,
                                retainedSupportingDocumentCount: retained.supporting,
                            });
                            if (!hasDocumentUpload) {
                                (0, product_design_strategies_validation_1.assertProductDesignStrategiesValid)(strategiesRaw);
                            }
                            return [4 /*yield*/, this.productDesignService.createProductDesign(createProductDesignDto, user.vendorId, { ecoVisionFiles: ecoVisionFiles, supportingDocumentFiles: supportingDocumentFiles })];
                        case 2:
                            result = _d.sent();
                            plain = typeof result.productDesign.toObject === 'function'
                                ? result.productDesign.toObject()
                                : result.productDesign;
                            strategiesText = String((_c = plain.statergies) !== null && _c !== void 0 ? _c : '').trim();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Product design saved successfully',
                                    data: __assign(__assign({}, plain), { strategies: strategiesText, statergies: strategiesText, measuresAndBenefits: result.measuresAndBenefits.map(function (row) { return ({
                                            _id: row._id,
                                            productDesignMeasureId: row.productDesignMeasureId,
                                            measuresImplemented: row.measuresImplemented,
                                            benefitsAchieved: row.benefitsAchieved,
                                        }); }), ecoVisionUpload: result.ecoVisionDocumentCount, productDesignSupportingDocument: result.supportingDocumentCount }),
                                }];
                        case 3:
                            error_1 = _d.sent();
                            console.error('Controller error:', error_1);
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return ProductDesignController_1;
    }());
    __setFunctionName(_classThis, "ProductDesignController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createProductDesign_decorators = [(0, common_1.Post)(), (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)((0, multer_universal_config_1.productDesignMultipartMemoryMulterOptions)(40))), (0, swagger_1.ApiOperation)({
                summary: 'Create or update product design data',
                description: 'Saves product design for a URN. **strategies**, **measuresAndBenefits**, **ecoVisionFile**, and **supportingDesignFile** are each optional; vendor requires at least one field (including saved documents on the URN). ' +
                    '**measuresAndBenefits** replaces all measure rows (send the full list). **supportingDesignFile** = PDF/Excel only. ' +
                    '**existingEcoVisionDocumentIds** / **existingSupportingDocumentIds** control which prior uploads are kept.',
            }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['urnNo'],
                    properties: {
                        urnNo: {
                            type: 'string',
                            description: 'URN number',
                            example: 'URN-20260305124230',
                        },
                        strategies: {
                            type: 'string',
                            description: 'Strategies text (optional). No minimum length.',
                            example: 'Product design strategies and approach',
                        },
                        statergies: {
                            type: 'string',
                            description: 'Legacy alias for strategies',
                        },
                        productDesignStatus: {
                            type: 'number',
                            description: 'Product design status (0=Pending, 1=Completed)',
                            example: 0,
                            enum: [0, 1],
                        },
                        measuresAndBenefits: {
                            type: 'string',
                            description: 'JSON array — **replaces** all measures for this URN. Format: [{"measuresImplemented":"...","benefitsAchieved":"..."}]',
                            example: '[{"measuresImplemented":"Use of renewable energy","benefitsAchieved":"Reduced carbon footprint"}]',
                        },
                        ecoVisionFile: {
                            type: 'array',
                            items: { type: 'string', format: 'binary' },
                            description: 'Eco vision file(s), optional. PDF/Excel only (.pdf, .xls, .xlsx). Max 20.',
                        },
                        supportingDesignFile: {
                            type: 'array',
                            items: { type: 'string', format: 'binary' },
                            description: 'Supporting design file(s), optional. PDF/Excel only (.pdf, .xls, .xlsx). Max 20.',
                        },
                        ecoVisionFilesCount: {
                            type: 'number',
                            description: 'Legacy `files`: count of leading eco-vision parts',
                            example: 2,
                        },
                        supportingDesignFilesCount: {
                            type: 'number',
                            description: 'Legacy `files`: supporting parts after eco (optional hint)',
                            example: 1,
                        },
                        existingEcoVisionDocumentIds: {
                            type: 'string',
                            description: 'JSON array of productDocumentId (or _id) to keep for eco vision. Omit = keep all; [] = remove all not re-uploaded.',
                            example: '[168,166]',
                        },
                        existingSupportingDocumentIds: {
                            type: 'string',
                            description: 'JSON array of productDocumentId (or _id) to keep for supporting docs.',
                            example: '[169,167]',
                        },
                        files: {
                            type: 'array',
                            items: { type: 'string', format: 'binary' },
                            description: 'Legacy: eco parts first (ecoVisionFilesCount), then supporting.',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Product design saved successfully',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data or file format' })];
        __esDecorate(_classThis, null, _createProductDesign_decorators, { kind: "method", name: "createProductDesign", static: false, private: false, access: { has: function (obj) { return "createProductDesign" in obj; }, get: function (obj) { return obj.createProductDesign; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductDesignController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductDesignController = _classThis;
}();
exports.ProductDesignController = ProductDesignController;
