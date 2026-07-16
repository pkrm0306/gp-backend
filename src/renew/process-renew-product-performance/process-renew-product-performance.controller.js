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
exports.ProcessRenewProductPerformanceController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var multer_universal_config_1 = require("../../common/upload/multer-universal.config");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var renew_process_controller_util_1 = require("../helpers/renew-process-controller.util");
var product_performance_upload_util_1 = require("../../product-performance/product-performance-upload.util");
var renew_product_performance_payload_util_1 = require("./renew-product-performance-payload.util");
function bodyHasTestReportsField(body) {
    return 'testReports' in body || 'test_reports' in body;
}
var ProcessRenewProductPerformanceController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Renew - Product Performance'), (0, common_1.Controller)('renew/process-product-performance'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _listByUrn_decorators;
    var ProcessRenewProductPerformanceController = _classThis = /** @class */ (function () {
        function ProcessRenewProductPerformanceController_1(processRenewProductPerformanceService, productModel) {
            this.processRenewProductPerformanceService = (__runInitializers(this, _instanceExtraInitializers), processRenewProductPerformanceService);
            this.productModel = productModel;
        }
        ProcessRenewProductPerformanceController_1.prototype.create = function (user, body, files) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, cycle, renewalCycleId, hasTestReportsPayload, testReports, uploadFiles, existingDocumentIds, retainedDocumentCount, _a, payload, filesUploaded, publicTestReports;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            urnNo = String((_b = body.urnNo) !== null && _b !== void 0 ? _b : '').trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            return [4 /*yield*/, (0, renew_process_controller_util_1.assertRenewProcessActorForUrn)(this.productModel, user, urnNo)];
                        case 1:
                            _f.sent();
                            return [4 /*yield*/, this.processRenewProductPerformanceService.resolveRenewalCycle(urnNo, body.renewalCycleId ? String(body.renewalCycleId) : undefined)];
                        case 2:
                            cycle = _f.sent();
                            renewalCycleId = String(cycle._id);
                            hasTestReportsPayload = bodyHasTestReportsField(body);
                            testReports = hasTestReportsPayload
                                ? (0, renew_product_performance_payload_util_1.parseIncomingRenewTestReports)((_c = body.testReports) !== null && _c !== void 0 ? _c : body.test_reports, undefined, body.eoiNo ? String(body.eoiNo).trim() : undefined)
                                : undefined;
                            uploadFiles = (0, product_performance_upload_util_1.collectProductPerformanceUploadFiles)(files);
                            (0, product_performance_upload_util_1.assertProductPerformanceTestReportFileTypes)(uploadFiles);
                            existingDocumentIds = (0, product_performance_upload_util_1.parseMultipartJsonIdArray)((_d = body.existingDocumentIds) !== null && _d !== void 0 ? _d : body.existing_document_ids);
                            return [4 /*yield*/, this.processRenewProductPerformanceService.countRetainedRenewPerformanceDocuments(urnNo, renewalCycleId, existingDocumentIds)];
                        case 3:
                            retainedDocumentCount = _f.sent();
                            if (!(0, product_performance_upload_util_1.hasAtLeastOneProductPerformanceContent)({
                                testReports: hasTestReportsPayload ? testReports : undefined,
                                uploadedFiles: uploadFiles,
                                retainedDocumentCount: retainedDocumentCount,
                            })) {
                                throw new common_1.BadRequestException(product_performance_upload_util_1.PRODUCT_PERFORMANCE_EMPTY_FORM_MESSAGE);
                            }
                            return [4 /*yield*/, this.processRenewProductPerformanceService.save({
                                    urnNo: urnNo,
                                    renewalCycleId: renewalCycleId,
                                    eoiNo: body.eoiNo ? String(body.eoiNo) : undefined,
                                    productPerformanceStatus: body.productPerformanceStatus !== undefined &&
                                        body.productPerformanceStatus !== ''
                                        ? parseInt(String(body.productPerformanceStatus), 10)
                                        : undefined,
                                    renewalType: body.renewalType !== undefined && body.renewalType !== ''
                                        ? parseInt(String(body.renewalType), 10)
                                        : undefined,
                                    testReports: hasTestReportsPayload ? testReports : undefined,
                                    existingDocumentIds: existingDocumentIds,
                                }, uploadFiles)];
                        case 4:
                            _a = _f.sent(), payload = _a.payload, filesUploaded = _a.filesUploaded;
                            publicTestReports = (0, renew_product_performance_payload_util_1.toPublicRenewTestReports)((_e = payload.testReports) !== null && _e !== void 0 ? _e : []);
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Product performance saved successfully',
                                    data: {
                                        urnNo: payload.urnNo,
                                        renewalCycleId: payload.renewalCycleId,
                                        productPerformanceStatus: payload.productPerformanceStatus,
                                        renewalType: payload.renewalType,
                                        testReportFiles: payload.testReportFiles,
                                        testReports: publicTestReports,
                                        updatedDate: payload.updatedDate,
                                    },
                                    meta: {
                                        filesUploaded: filesUploaded,
                                        testReports: publicTestReports,
                                    },
                                }];
                    }
                });
            });
        };
        ProcessRenewProductPerformanceController_1.prototype.listByUrn = function (user, urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, renew_process_controller_util_1.assertRenewProcessActorCanReadUrn)(this.productModel, user, urnNo)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.processRenewProductPerformanceService.getFormPayloadByUrn(urnNo, renewalCycleId)];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Renew product performance fetched successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        return ProcessRenewProductPerformanceController_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewProductPerformanceController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)((0, multer_universal_config_1.productPerformanceMultipartMemoryMulterOptions)(20))), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Save renewal product performance (full replace testReports per URN+cycle)',
                description: 'Multipart save scoped by urnNo + renewalCycleId. testReports/test_reports fully replaces metadata rows for the cycle. existingDocumentIds retains listed performance documents; files appends new uploads only.',
            })];
        _listByUrn_decorators = [(0, common_1.Get)(':urnNo'), (0, swagger_1.ApiOperation)({
                summary: 'Full renewal product performance form payload',
                description: 'Authoritative testReports and documents for urnNo + renewalCycleId (defaults to cycle with saved data, else active in-progress cycle).',
            }), (0, swagger_1.ApiParam)({ name: 'urnNo', type: String }), (0, swagger_1.ApiQuery)({ name: 'renewalCycleId', required: false, type: String }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Full product performance form payload' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listByUrn_decorators, { kind: "method", name: "listByUrn", static: false, private: false, access: { has: function (obj) { return "listByUrn" in obj; }, get: function (obj) { return obj.listByUrn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewProductPerformanceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewProductPerformanceController = _classThis;
}();
exports.ProcessRenewProductPerformanceController = ProcessRenewProductPerformanceController;
