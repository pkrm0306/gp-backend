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
exports.ProductPerformanceController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var multer_universal_config_1 = require("../common/upload/multer-universal.config");
var product_performance_upload_util_1 = require("./product-performance-upload.util");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var ProductPerformanceController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Product Performance'), (0, common_1.Controller)('product-performance'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createProductPerformance_decorators;
    var ProductPerformanceController = _classThis = /** @class */ (function () {
        function ProductPerformanceController_1(productPerformanceService) {
            this.productPerformanceService = (__runInitializers(this, _instanceExtraInitializers), productPerformanceService);
        }
        ProductPerformanceController_1.prototype.createProductPerformance = function (user, body, files) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorId, testReports, rawReports, trimmed, parsed, createProductPerformanceDto, urnNo, uploadFiles, retainedDocumentCount, result, performancePlain, testReportsResponse, error_1;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 4, , 5]);
                            vendorId = (_a = user === null || user === void 0 ? void 0 : user.vendorId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.manufacturerId;
                            if (!vendorId) {
                                throw new common_1.BadRequestException('Vendor ID not found in token');
                            }
                            testReports = void 0;
                            rawReports = body.testReports;
                            if (rawReports !== undefined && rawReports !== null) {
                                if (Array.isArray(rawReports)) {
                                    testReports = rawReports;
                                }
                                else if (typeof rawReports === 'string') {
                                    trimmed = rawReports.trim();
                                    if (trimmed === '') {
                                        testReports = [];
                                    }
                                    else {
                                        try {
                                            parsed = JSON.parse(trimmed);
                                            if (Array.isArray(parsed)) {
                                                testReports = parsed;
                                            }
                                            else if (parsed && typeof parsed === 'object') {
                                                testReports = [parsed];
                                            }
                                            else {
                                                testReports = [];
                                            }
                                        }
                                        catch (_e) {
                                            testReports = [];
                                        }
                                    }
                                }
                                else if (typeof rawReports === 'object') {
                                    testReports = [rawReports];
                                }
                            }
                            if (testReports !== undefined) {
                                testReports = (0, product_performance_upload_util_1.normalizeTestReportRows)(testReports);
                            }
                            createProductPerformanceDto = {
                                urnNo: String((_b = body.urnNo) !== null && _b !== void 0 ? _b : ''),
                                renewalType: body.renewalType !== undefined && body.renewalType !== ''
                                    ? parseInt(String(body.renewalType), 10)
                                    : undefined,
                                productPerformanceStatus: body.productPerformanceStatus !== undefined &&
                                    body.productPerformanceStatus !== ''
                                    ? parseInt(String(body.productPerformanceStatus), 10)
                                    : undefined,
                                testReports: testReports,
                                testReportFileName: body.testReportFileName !== undefined
                                    ? String(body.testReportFileName)
                                    : undefined,
                                productName: body.productName !== undefined ? String(body.productName) : undefined,
                                existingDocumentIds: (0, product_performance_upload_util_1.parseMultipartJsonIdArray)(body.existingDocumentIds),
                            };
                            if (!((_c = createProductPerformanceDto.urnNo) === null || _c === void 0 ? void 0 : _c.trim())) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            urnNo = createProductPerformanceDto.urnNo.trim();
                            return [4 /*yield*/, this.productPerformanceService.assertVendorCanEditUrn(String(vendorId), urnNo)];
                        case 1:
                            _d.sent();
                            uploadFiles = (0, product_performance_upload_util_1.collectProductPerformanceUploadFiles)(files);
                            (0, product_performance_upload_util_1.assertProductPerformanceTestReportFileTypes)(uploadFiles);
                            return [4 /*yield*/, this.productPerformanceService.countRetainedProductPerformanceDocuments(urnNo, String(vendorId), createProductPerformanceDto.existingDocumentIds)];
                        case 2:
                            retainedDocumentCount = _d.sent();
                            if (!(0, product_performance_upload_util_1.hasAtLeastOneProductPerformanceContent)({
                                testReports: testReports,
                                uploadedFiles: uploadFiles,
                                retainedDocumentCount: retainedDocumentCount,
                            })) {
                                throw new common_1.BadRequestException(product_performance_upload_util_1.PRODUCT_PERFORMANCE_EMPTY_FORM_MESSAGE);
                            }
                            return [4 /*yield*/, this.productPerformanceService.createProductPerformance(createProductPerformanceDto, String(vendorId), uploadFiles)];
                        case 3:
                            result = _d.sent();
                            performancePlain = typeof result.productPerformance.toObject === 'function'
                                ? result.productPerformance.toObject()
                                : result.productPerformance;
                            testReportsResponse = result.savedTestReports.map(function (row) { return ({
                                _id: row._id,
                                productPerformanceTestReportId: row.productPerformanceTestReportId,
                                productName: row.productName,
                                testReportFileName: row.testReportFileName,
                            }); });
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Product performance saved successfully',
                                    data: __assign(__assign({}, performancePlain), { testReports: testReportsResponse, testReportFiles: result.totalDocumentCount, filesUploaded: result.filesUploaded }),
                                }];
                        case 4:
                            error_1 = _d.sent();
                            console.error('Controller error:', error_1);
                            if (error_1 instanceof common_1.BadRequestException ||
                                error_1 instanceof common_1.NotFoundException) {
                                throw error_1;
                            }
                            throw new common_1.InternalServerErrorException(error_1 instanceof Error
                                ? error_1.message
                                : 'Failed to save product performance');
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return ProductPerformanceController_1;
    }());
    __setFunctionName(_classThis, "ProductPerformanceController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createProductPerformance_decorators = [(0, common_1.Post)(), (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)((0, multer_universal_config_1.productPerformanceMultipartMemoryMulterOptions)(20))), (0, swagger_1.ApiOperation)({
                summary: 'Create or update product performance data',
                description: 'Saves product performance for a URN. **testReports** and **files** are each optional; vendor requires at least one field (including saved performance documents on the URN). ' +
                    '**testReports** replaces all rows (full list each save). Rows may have only productName or only testReportFileName filled. ' +
                    '**files** — new uploads only (max 20, PDF/Excel). **existingDocumentIds** controls which prior documents are kept.',
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
                        renewalType: {
                            type: 'number',
                            description: 'Renewal type (0=Not Renewed, >0 = Renewed no of times)',
                            example: 0,
                            minimum: 0,
                        },
                        productPerformanceStatus: {
                            type: 'number',
                            description: 'Product performance status (0=Pending, 1=Completed)',
                            example: 0,
                            enum: [0, 1],
                        },
                        testReports: {
                            type: 'string',
                            description: 'JSON array — **replaces** all test report rows (optional). Format: [{"productName":"...","testReportFileName":"..."}]',
                            example: '[{"productName":"Solar Panel 100W","testReportFileName":"IEC Test Report - March 2026"}]',
                        },
                        existingDocumentIds: {
                            type: 'string',
                            description: 'JSON array of productDocumentId (or _id) to keep. Omit = keep all; [] = remove unlisted.',
                            example: '[201,202,203]',
                        },
                        files: {
                            type: 'array',
                            items: { type: 'string', format: 'binary' },
                            description: 'New test report files, optional (repeat per file, max 20). PDF/Excel only (.pdf, .xls, .xlsx). Stored in performance documents only.',
                        },
                        testReportFile: {
                            type: 'array',
                            items: { type: 'string', format: 'binary' },
                            description: 'Legacy alias for files',
                        },
                        testReportFileName: {
                            type: 'string',
                            description: 'Deprecated — use testReports[]',
                        },
                        productName: {
                            type: 'string',
                            description: 'Deprecated — use testReports[].productName',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Product performance saved successfully',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data or file format' })];
        __esDecorate(_classThis, null, _createProductPerformance_decorators, { kind: "method", name: "createProductPerformance", static: false, private: false, access: { has: function (obj) { return "createProductPerformance" in obj; }, get: function (obj) { return obj.createProductPerformance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductPerformanceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductPerformanceController = _classThis;
}();
exports.ProductPerformanceController = ProductPerformanceController;
