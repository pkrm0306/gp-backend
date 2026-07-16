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
exports.ProductsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var multer_universal_config_1 = require("../common/upload/multer-universal.config");
var urn_renew_process_documents_util_1 = require("./utils/urn-renew-process-documents.util");
var urn_product_performance_documents_util_1 = require("./utils/urn-product-performance-documents.util");
var ProductsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Products'), (0, common_1.Controller)('products'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getRenewList_decorators;
    var _vendorPatchCertifiedProduct_decorators;
    var _getVendorUrnTabReviewGuidance_decorators;
    var _getVendorUrnTabAccess_decorators;
    var _getProductDetailsByUrn_decorators;
    var _updateUrnStatus_decorators;
    var _listEoiPlantCertificates_decorators;
    var _downloadEoiPlantCertificate_decorators;
    var _downloadEoiCertificate_decorators;
    var _countVendorPlantCertificates_decorators;
    var _downloadVendorAllCertifiedCertificates_decorators;
    var _downloadUrnCertificatesPdf_decorators;
    var ProductsController = _classThis = /** @class */ (function () {
        function ProductsController_1(productRegistrationService, urnTabReviewService, vendorCertificateService, processRenewProductPerformanceService, renewDetailsService) {
            this.productRegistrationService = (__runInitializers(this, _instanceExtraInitializers), productRegistrationService);
            this.urnTabReviewService = urnTabReviewService;
            this.vendorCertificateService = vendorCertificateService;
            this.processRenewProductPerformanceService = processRenewProductPerformanceService;
            this.renewDetailsService = renewDetailsService;
        }
        ProductsController_1.prototype.getRenewList = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.productRegistrationService.getRenewList(user.manufacturerId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    data: data,
                                }];
                        case 2:
                            error_1 = _a.sent();
                            console.error('Controller error:', error_1);
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ProductsController_1.prototype.vendorPatchCertifiedProduct = function (user, productId, dto, productImage) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.productRegistrationService.vendorPatchCertifiedProduct(productId.trim(), dto, user.manufacturerId, productImage)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Certified product updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        ProductsController_1.prototype.getVendorUrnTabReviewGuidance = function (user, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.urnTabReviewService.getVendorUrnTabReviewGuidance(urnNo, user.manufacturerId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Vendor URN tab review guidance retrieved',
                                    data: data,
                                    tabAccess: data.tabAccess,
                                }];
                    }
                });
            });
        };
        ProductsController_1.prototype.getVendorUrnTabAccess = function (user, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.urnTabReviewService.getVendorUrnTabAccess(urnNo, user.manufacturerId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Vendor URN tab access retrieved',
                                    data: data,
                                    tabAccess: data,
                                }];
                    }
                });
            });
        };
        ProductsController_1.prototype.getProductDetailsByUrn = function (urnNo, user) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, data, resolvedData, renewProcessDocuments, renewPerformance, _a, _b, siteVisits, firstDetails, visibleRawMaterialSteps, urnStatus, productRenewStatus, tabAccess, _c, error_2;
                var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                return __generator(this, function (_r) {
                    switch (_r.label) {
                        case 0:
                            _r.trys.push([0, 12, , 13]);
                            if (!urnNo || urnNo.trim() === '') {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.productRegistrationService.getProductDetailsByUrn(trimmedUrn, { excludeExpired: true })];
                        case 1:
                            data = _r.sent();
                            resolvedData = data;
                            renewProcessDocuments = null;
                            _r.label = 2;
                        case 2:
                            _r.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.processRenewProductPerformanceService.loadRenewProductPerformanceReadPayload(trimmedUrn)];
                        case 3:
                            renewPerformance = _r.sent();
                            resolvedData = (0, urn_product_performance_documents_util_1.mergeRenewProductPerformanceDocumentsOntoDetailRows)(resolvedData, renewPerformance);
                            return [3 /*break*/, 5];
                        case 4:
                            _a = _r.sent();
                            return [3 /*break*/, 5];
                        case 5:
                            _r.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.renewDetailsService.loadRenewProcessDocumentsReadPayload(trimmedUrn)];
                        case 6:
                            renewProcessDocuments =
                                _r.sent();
                            resolvedData = (0, urn_renew_process_documents_util_1.mergeAllRenewProcessDocumentsOntoDetailRows)(resolvedData, renewProcessDocuments);
                            return [3 /*break*/, 8];
                        case 7:
                            _b = _r.sent();
                            return [3 /*break*/, 8];
                        case 8:
                            resolvedData = (0, urn_renew_process_documents_util_1.finalizeUrnProcessDocumentFieldsOnDetailRows)(resolvedData, renewProcessDocuments ? [renewProcessDocuments] : []);
                            siteVisits = (_e = (_d = resolvedData[0]) === null || _d === void 0 ? void 0 : _d.siteVisits) !== null && _e !== void 0 ? _e : [];
                            firstDetails = resolvedData[0];
                            visibleRawMaterialSteps = (_j = (_g = (_f = firstDetails === null || firstDetails === void 0 ? void 0 : firstDetails.product_details) === null || _f === void 0 ? void 0 : _f.visibleRawMaterialSteps) !== null && _g !== void 0 ? _g : (_h = firstDetails === null || firstDetails === void 0 ? void 0 : firstDetails.category) === null || _h === void 0 ? void 0 : _h.visibleRawMaterialSteps) !== null && _j !== void 0 ? _j : [];
                            urnStatus = Number((_m = (_k = firstDetails === null || firstDetails === void 0 ? void 0 : firstDetails.urnStatus) !== null && _k !== void 0 ? _k : (_l = firstDetails === null || firstDetails === void 0 ? void 0 : firstDetails.product_details) === null || _l === void 0 ? void 0 : _l.urnStatus) !== null && _m !== void 0 ? _m : 0);
                            productRenewStatus = Number((_q = (_o = firstDetails === null || firstDetails === void 0 ? void 0 : firstDetails.productRenewStatus) !== null && _o !== void 0 ? _o : (_p = firstDetails === null || firstDetails === void 0 ? void 0 : firstDetails.product_details) === null || _p === void 0 ? void 0 : _p.productRenewStatus) !== null && _q !== void 0 ? _q : 0);
                            if (!((user === null || user === void 0 ? void 0 : user.manufacturerId) != null)) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.urnTabReviewService.getVendorUrnTabAccess(trimmedUrn, String(user.manufacturerId))];
                        case 9:
                            _c = _r.sent();
                            return [3 /*break*/, 11];
                        case 10:
                            _c = undefined;
                            _r.label = 11;
                        case 11:
                            tabAccess = _c;
                            return [2 /*return*/, {
                                    success: true,
                                    data: resolvedData,
                                    siteVisits: siteVisits,
                                    site_visits: siteVisits,
                                    visibleRawMaterialSteps: visibleRawMaterialSteps,
                                    urnContext: {
                                        urnNo: trimmedUrn,
                                        urnStatus: urnStatus || null,
                                        productRenewStatus: productRenewStatus || null,
                                    },
                                    tabAccess: tabAccess,
                                }];
                        case 12:
                            error_2 = _r.sent();
                            console.error('Controller error:', error_2);
                            throw error_2;
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        ProductsController_1.prototype.updateUrnStatus = function (user, updateUrnStatusDto) {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.productRegistrationService.updateUrnStatus(updateUrnStatusDto, user.manufacturerId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    data: {
                                        _id: data._id,
                                        productId: data.productId,
                                        vendorId: data.vendorId,
                                        manufacturerId: data.manufacturerId,
                                        urnNo: data.urnNo,
                                        eoiNo: data.eoiNo,
                                        productName: data.productName,
                                        urnStatus: data.urnStatus,
                                        productStatus: data.productStatus,
                                        updatedDate: data.updatedDate,
                                    },
                                    message: 'URN status updated successfully',
                                }];
                        case 2:
                            error_3 = _a.sent();
                            console.error('Controller error:', error_3);
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ProductsController_1.prototype.listEoiPlantCertificates = function (user, productId) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.vendorCertificateService.listEoiPlantCertificates(user.manufacturerId, productId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Plant certificates retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        ProductsController_1.prototype.downloadEoiPlantCertificate = function (user, productId, plantId) {
            return __awaiter(this, void 0, void 0, function () {
                var file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.vendorCertificateService.downloadEoiPlantCertificate(user.manufacturerId, productId, plantId)];
                        case 1:
                            file = _a.sent();
                            return [2 /*return*/, new common_1.StreamableFile(file.buffer, {
                                    type: file.contentType,
                                    disposition: "attachment; filename=\"".concat(file.fileName, "\""),
                                })];
                    }
                });
            });
        };
        ProductsController_1.prototype.downloadEoiCertificate = function (user, productId, format) {
            return __awaiter(this, void 0, void 0, function () {
                var resolvedFormat, file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            resolvedFormat = format === 'zip' ? 'zip' : 'merged';
                            return [4 /*yield*/, this.vendorCertificateService.downloadEoiCertificate(user.manufacturerId, productId, resolvedFormat)];
                        case 1:
                            file = _a.sent();
                            return [2 /*return*/, new common_1.StreamableFile(file.buffer, {
                                    type: file.contentType,
                                    disposition: "attachment; filename=\"".concat(file.fileName, "\""),
                                })];
                    }
                });
            });
        };
        ProductsController_1.prototype.countVendorPlantCertificates = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var plantCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.vendorCertificateService.countVendorCertifiedPlantCertificates(user.manufacturerId)];
                        case 1:
                            plantCount = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Vendor plant certificate count retrieved successfully',
                                    data: { plantCount: plantCount },
                                }];
                    }
                });
            });
        };
        ProductsController_1.prototype.downloadVendorAllCertifiedCertificates = function (user, _format, res) {
            return __awaiter(this, void 0, void 0, function () {
                var file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.vendorCertificateService.downloadVendorAllCertifiedCertificates(user.manufacturerId, 'zip')];
                        case 1:
                            file = _a.sent();
                            if (res) {
                                if (file.certificateCount != null) {
                                    res.setHeader('X-GreenPro-Certificate-Count', String(file.certificateCount));
                                }
                                res.setHeader('Content-Type', 'application/zip');
                                res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Type, X-GreenPro-Certificate-Count');
                            }
                            return [2 /*return*/, new common_1.StreamableFile(file.buffer, {
                                    type: 'application/zip',
                                    disposition: "attachment; filename=\"".concat(file.fileName, "\""),
                                })];
                    }
                });
            });
        };
        ProductsController_1.prototype.downloadUrnCertificatesPdf = function (user, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.manufacturerId)) {
                                throw new common_1.BadRequestException('Manufacturer ID not found in token');
                            }
                            return [4 /*yield*/, this.vendorCertificateService.downloadUrnCertificatesPdf(user.manufacturerId, urnNo)];
                        case 1:
                            file = _a.sent();
                            return [2 /*return*/, new common_1.StreamableFile(file.buffer, {
                                    type: file.contentType,
                                    disposition: "attachment; filename=\"".concat(file.fileName, "\""),
                                })];
                    }
                });
            });
        };
        return ProductsController_1;
    }());
    __setFunctionName(_classThis, "ProductsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getRenewList_decorators = [(0, common_1.Get)('renew-list'), (0, swagger_1.ApiOperation)({
                summary: 'Get products eligible for renewal',
                description: 'Returns a list of certified products (product_status = 2) for the logged-in manufacturer that are expiring within 60 days (validtill_date < current_date + 60 days). Products are joined with categories collection to get category_name. Results are sorted by created_date DESC.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Renew list retrieved successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    product_id: { type: 'number', example: 1 },
                                    eoi_no: { type: 'string', example: 'GPMN012001' },
                                    urn_no: { type: 'string', example: 'URN-20240302120000' },
                                    product_name: { type: 'string', example: 'Solar Panel 100W' },
                                    product_details: {
                                        type: 'string',
                                        example: 'High-efficiency monocrystalline panel',
                                    },
                                    unit_count: {
                                        type: 'number',
                                        description: 'Manufacturing unit / plant count for this EOI',
                                        example: 2,
                                    },
                                    category_name: { type: 'string', example: 'Solar Panels' },
                                    validtill_date: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2024-05-15T10:30:00.000Z',
                                    },
                                    product_status: { type: 'number', example: 2 },
                                    created_date: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2024-03-02T12:00:00.000Z',
                                    },
                                },
                            },
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Bad request - Manufacturer ID not found in token',
            })];
        _vendorPatchCertifiedProduct_decorators = [(0, common_1.Patch)('certified/:productId'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('productImage', (0, multer_universal_config_1.adminImageMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Vendor edit certified product',
                description: 'Vendor-only patch endpoint for certified list edit popup. Allows updating product name, description, and optional image for the logged-in vendor.',
            }), (0, swagger_1.ApiParam)({
                name: 'productId',
                description: 'MongoDB product document _id',
            }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        productName: { type: 'string' },
                        productDetails: { type: 'string' },
                        productImage: {
                            type: 'string',
                            format: 'binary',
                            description: 'Optional product image (JPEG, PNG, GIF, WebP)',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Certified product updated' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Not certified or no editable fields provided',
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Product not found for this vendor',
            })];
        _getVendorUrnTabReviewGuidance_decorators = [(0, common_1.Get)('urn-tab-review/:urn_no'), (0, swagger_1.ApiOperation)({
                summary: 'Get vendor Save & Next guidance after admin resend',
                description: 'When urnStatus is 5 (admin sent back for corrections), returns which process tabs and raw material steps may be saved. ' +
                    'Includes `tabAccess` — when urnStatus is 6–10 (after admin final submit, before certification fee approval), all process tabs are disabled except Quick View and Payment.',
            }), (0, swagger_1.ApiParam)({
                name: 'urn_no',
                description: 'URN number',
                example: 'URN-20240302120000',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor tab review guidance' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'URN not found for this vendor' })];
        _getVendorUrnTabAccess_decorators = [(0, common_1.Get)('vendor-tab-access/:urn_no'), (0, swagger_1.ApiOperation)({
                summary: 'Vendor URN process tab enable/disable map',
                description: 'Returns which vendor URN workspace tabs are enabled. After admin final submit (urnStatus 6–10), only `quick_view` and `payment` are enabled until certification fee is approved (urnStatus 11).',
            }), (0, swagger_1.ApiParam)({
                name: 'urn_no',
                description: 'URN number',
                example: 'URN-20240302120000',
            })];
        _getProductDetailsByUrn_decorators = [(0, common_1.Get)('details/:urn_no'), (0, swagger_1.ApiOperation)({
                summary: 'Get complete product details by URN (vendor)',
                description: 'Returns complete product details for all products with the specified URN, including categories, manufacturers, vendors, plants, payments, and **siteVisits** (admin-managed site visit locations for this URN). Each item in `data[]` also includes the same `siteVisits` array; top-level `siteVisits` / `site_visits` is provided for the URN process UI.',
            }), (0, swagger_1.ApiParam)({
                name: 'urn_no',
                description: 'URN number',
                example: 'URN-20240302120000',
                type: String,
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Product details retrieved successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        siteVisits: {
                            type: 'array',
                            description: 'Site visit locations for this URN (read-only)',
                        },
                        site_visits: {
                            type: 'array',
                            description: 'Snake_case alias of siteVisits',
                        },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    siteVisits: {
                                        type: 'array',
                                        description: 'Same as top-level siteVisits',
                                    },
                                    product_details: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string' },
                                            productId: { type: 'number' },
                                            eoiNo: { type: 'string' },
                                            urnNo: { type: 'string' },
                                            productName: { type: 'string' },
                                            productImage: { type: 'string' },
                                            plantCount: { type: 'number' },
                                            productDetails: { type: 'string' },
                                            productType: { type: 'number' },
                                            productStatus: { type: 'number' },
                                            productRenewStatus: { type: 'number' },
                                            urnStatus: { type: 'number' },
                                            createdDate: { type: 'string', format: 'date-time' },
                                            updatedDate: { type: 'string', format: 'date-time' },
                                        },
                                    },
                                    category: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string' },
                                            categoryName: { type: 'string' },
                                            categoryCode: { type: 'string' },
                                        },
                                        additionalProperties: true,
                                        description: 'Complete category document from categories collection (includes all available fields).',
                                    },
                                    manufacturer: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string' },
                                            manufacturerName: { type: 'string' },
                                            gpInternalId: { type: 'string' },
                                            manufacturerInitial: { type: 'string' },
                                        },
                                    },
                                    vendor: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string' },
                                            vendorName: { type: 'string' },
                                            vendorEmail: { type: 'string' },
                                            vendorPhone: { type: 'string' },
                                        },
                                    },
                                    plants: {
                                        type: 'array',
                                        items: { type: 'object' },
                                    },
                                    payments: {
                                        type: 'array',
                                        items: { type: 'object' },
                                    },
                                    product_design: {
                                        type: 'object',
                                        nullable: true,
                                        properties: {
                                            _id: { type: 'string' },
                                            productDesignId: { type: 'number' },
                                            urnNo: { type: 'string' },
                                            ecoVisionUpload: {
                                                type: 'number',
                                                description: '0=No File Available, 1=File Available',
                                            },
                                            statergies: {
                                                type: 'string',
                                                description: 'Product design strategies text (DB field name)',
                                            },
                                            strategies: {
                                                type: 'string',
                                                description: 'Same value as statergies (alias for clients)',
                                            },
                                            productDesignSupportingDocument: {
                                                type: 'number',
                                                description: '0=No File Available, 1=File Available',
                                            },
                                            productDesignStatus: {
                                                type: 'number',
                                                description: '0=Pending, 1=Completed',
                                            },
                                            measuresAndBenefits: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        measuresImplemented: { type: 'string' },
                                                        benefitsAchieved: { type: 'string' },
                                                    },
                                                },
                                            },
                                            createdDate: { type: 'string', format: 'date-time' },
                                            updatedDate: { type: 'string', format: 'date-time' },
                                        },
                                    },
                                    product_performance: {
                                        type: 'object',
                                        nullable: true,
                                        properties: {
                                            _id: { type: 'string' },
                                            processProductPerformanceId: { type: 'number' },
                                            urnNo: { type: 'string' },
                                            eoiNo: { type: 'string' },
                                            productName: { type: 'string' },
                                            testReportFileName: { type: 'string' },
                                            testReportFiles: {
                                                type: 'number',
                                                description: '0=No File Available, 1=File Available',
                                            },
                                            renewalType: {
                                                type: 'number',
                                                description: '0=Not Renewed, >0 = Renewed no of times',
                                            },
                                            productPerformanceStatus: {
                                                type: 'number',
                                                description: '0=Pending, 1=Completed',
                                            },
                                            createdDate: { type: 'string', format: 'date-time' },
                                            updatedDate: { type: 'string', format: 'date-time' },
                                        },
                                    },
                                    product_performance_documents: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                _id: { type: 'string' },
                                                productDocumentId: { type: 'number' },
                                                documentForm: { type: 'string' },
                                                documentFormSubsection: { type: 'string' },
                                                documentName: { type: 'string' },
                                                documentOriginalName: { type: 'string' },
                                                documentLink: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'No products found with the specified URN',
            }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Bad request - URN number is required',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _updateUrnStatus_decorators = [(0, common_1.Patch)('urn-status'), (0, swagger_1.ApiOperation)({
                summary: 'Update URN status',
                description: 'Updates the URN status for a product matching the logged-in manufacturer and urnNo. Activity logging is automatically performed for the status change.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'URN status updated successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'object',
                            properties: {
                                _id: { type: 'string' },
                                productId: { type: 'number' },
                                vendorId: { type: 'string' },
                                manufacturerId: { type: 'string' },
                                urnNo: { type: 'string' },
                                eoiNo: { type: 'string' },
                                productName: { type: 'string' },
                                urnStatus: {
                                    type: 'number',
                                    description: 'Updated URN status (0-11)',
                                },
                                productStatus: {
                                    type: 'number',
                                    description: 'Updated product status when optional `productStatus` is sent in request body',
                                },
                                updatedDate: { type: 'string', format: 'date-time' },
                            },
                        },
                        message: { type: 'string', example: 'URN status updated successfully' },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 404,
                description: 'Product not found with the given manufacturer and urnNo',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid input data' }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized - Invalid or missing token',
            })];
        _listEoiPlantCertificates_decorators = [(0, common_1.Get)('certificates/eoi/:productId/plants'), (0, swagger_1.ApiOperation)({
                summary: 'List plant certificates for a certified EOI',
                description: 'Vendor-only. Returns each manufacturing plant under the EOI with individual download paths.',
            }), (0, swagger_1.ApiParam)({
                name: 'productId',
                description: 'MongoDB product document _id from certified list',
            })];
        _downloadEoiPlantCertificate_decorators = [(0, common_1.Get)('certificates/eoi/:productId/plants/:plantId'), (0, swagger_1.ApiOperation)({
                summary: 'Download one plant certificate for a certified EOI',
                description: 'Vendor-only. Downloads a single GreenPro certificate PDF for one manufacturing plant under the EOI.',
            }), (0, swagger_1.ApiParam)({ name: 'productId', description: 'MongoDB product _id' }), (0, swagger_1.ApiParam)({ name: 'plantId', description: 'MongoDB product_plants _id' })];
        _downloadEoiCertificate_decorators = [(0, common_1.Get)('certificates/eoi/:productId'), (0, swagger_1.ApiOperation)({
                summary: 'Download certified product certificate(s) for one EOI',
                description: 'Vendor-only. Downloads GreenPro certificate PDF(s) for one certified product (`productStatus = 2`). ' +
                    '**Default (`format=merged`)**: one PDF with one page per manufacturing plant. ' +
                    '**`format=zip`**: separate PDF file per plant inside a ZIP archive.',
            }), (0, swagger_1.ApiParam)({
                name: 'productId',
                description: 'MongoDB product document _id from certified list',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Certificate PDF or ZIP download' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Certified product not found' })];
        _countVendorPlantCertificates_decorators = [(0, common_1.Get)('certificates/vendor/plant-count'), (0, swagger_1.ApiOperation)({
                summary: 'Count all plant certificates for certified vendor portfolio',
                description: 'Vendor-only. Returns the total number of manufacturing plants across all certified EOIs for the logged-in vendor.',
            })];
        _downloadVendorAllCertifiedCertificates_decorators = [(0, common_1.Get)('certificates/vendor/download'), (0, swagger_1.ApiOperation)({
                summary: 'Download all plant certificates for the vendor portfolio',
                description: 'Vendor-only. Always returns a ZIP with one PDF per manufacturing plant across **active** certified EOIs ' +
                    '(productStatus = 2, not past validtillDate) — same scope as the vendor certified list. ' +
                    'Merged PDF is not used for portfolio downloads (it truncates around ~200 pages).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'ZIP of plant certificate PDFs' })];
        _downloadUrnCertificatesPdf_decorators = [(0, common_1.Get)('certificates/urn/:urnNo/download'), (0, swagger_1.ApiOperation)({
                summary: 'Download all certificates for a URN (single PDF)',
                description: 'Vendor-only. Merges all certified EOI certificates under the given URN into one PDF file (certificates appended page-by-page).',
            }), (0, swagger_1.ApiParam)({
                name: 'urnNo',
                description: 'URN number',
                example: 'URN-20260527122016',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Merged certificate PDF download' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'No certified certificates found' })];
        __esDecorate(_classThis, null, _getRenewList_decorators, { kind: "method", name: "getRenewList", static: false, private: false, access: { has: function (obj) { return "getRenewList" in obj; }, get: function (obj) { return obj.getRenewList; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _vendorPatchCertifiedProduct_decorators, { kind: "method", name: "vendorPatchCertifiedProduct", static: false, private: false, access: { has: function (obj) { return "vendorPatchCertifiedProduct" in obj; }, get: function (obj) { return obj.vendorPatchCertifiedProduct; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVendorUrnTabReviewGuidance_decorators, { kind: "method", name: "getVendorUrnTabReviewGuidance", static: false, private: false, access: { has: function (obj) { return "getVendorUrnTabReviewGuidance" in obj; }, get: function (obj) { return obj.getVendorUrnTabReviewGuidance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVendorUrnTabAccess_decorators, { kind: "method", name: "getVendorUrnTabAccess", static: false, private: false, access: { has: function (obj) { return "getVendorUrnTabAccess" in obj; }, get: function (obj) { return obj.getVendorUrnTabAccess; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProductDetailsByUrn_decorators, { kind: "method", name: "getProductDetailsByUrn", static: false, private: false, access: { has: function (obj) { return "getProductDetailsByUrn" in obj; }, get: function (obj) { return obj.getProductDetailsByUrn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateUrnStatus_decorators, { kind: "method", name: "updateUrnStatus", static: false, private: false, access: { has: function (obj) { return "updateUrnStatus" in obj; }, get: function (obj) { return obj.updateUrnStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listEoiPlantCertificates_decorators, { kind: "method", name: "listEoiPlantCertificates", static: false, private: false, access: { has: function (obj) { return "listEoiPlantCertificates" in obj; }, get: function (obj) { return obj.listEoiPlantCertificates; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadEoiPlantCertificate_decorators, { kind: "method", name: "downloadEoiPlantCertificate", static: false, private: false, access: { has: function (obj) { return "downloadEoiPlantCertificate" in obj; }, get: function (obj) { return obj.downloadEoiPlantCertificate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadEoiCertificate_decorators, { kind: "method", name: "downloadEoiCertificate", static: false, private: false, access: { has: function (obj) { return "downloadEoiCertificate" in obj; }, get: function (obj) { return obj.downloadEoiCertificate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _countVendorPlantCertificates_decorators, { kind: "method", name: "countVendorPlantCertificates", static: false, private: false, access: { has: function (obj) { return "countVendorPlantCertificates" in obj; }, get: function (obj) { return obj.countVendorPlantCertificates; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadVendorAllCertifiedCertificates_decorators, { kind: "method", name: "downloadVendorAllCertifiedCertificates", static: false, private: false, access: { has: function (obj) { return "downloadVendorAllCertifiedCertificates" in obj; }, get: function (obj) { return obj.downloadVendorAllCertifiedCertificates; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadUrnCertificatesPdf_decorators, { kind: "method", name: "downloadUrnCertificatesPdf", static: false, private: false, access: { has: function (obj) { return "downloadUrnCertificatesPdf" in obj; }, get: function (obj) { return obj.downloadUrnCertificatesPdf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductsController = _classThis;
}();
exports.ProductsController = ProductsController;
