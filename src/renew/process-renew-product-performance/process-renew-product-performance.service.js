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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.ProcessRenewProductPerformanceService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var upload_file_util_1 = require("../../utils/upload-file.util");
var product_document_version_integration_1 = require("../../documents/helpers/product-document-version.integration");
var certification_document_version_util_1 = require("../../documents/helpers/certification-document-version.util");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renew_eligible_product_util_1 = require("../../renew/helpers/renew-eligible-product.util");
var renew_product_performance_payload_util_1 = require("./renew-product-performance-payload.util");
var renew_details_format_util_1 = require("../utils/renew-details-format.util");
var path = require("path");
var product_performance_upload_util_1 = require("../../product-performance/product-performance-upload.util");
var RENEW_PERFORMANCE_DOC_SUBSECTION = product_performance_upload_util_1.PERFORMANCE_TEST_REPORT_SUBSECTION;
var ProcessRenewProductPerformanceService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessRenewProductPerformanceService = _classThis = /** @class */ (function () {
        function ProcessRenewProductPerformanceService_1(renewPerformanceModel, renewTestReportModel, renewDocumentModel, renewalCycleModel, productModel, connection, sequenceHelper, documentVersioningService) {
            this.renewPerformanceModel = renewPerformanceModel;
            this.renewTestReportModel = renewTestReportModel;
            this.renewDocumentModel = renewDocumentModel;
            this.renewalCycleModel = renewalCycleModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentVersioningService = documentVersioningService;
        }
        ProcessRenewProductPerformanceService_1.prototype.resolveDocumentIdRefs = function (ids) {
            var objectIds = [];
            var productDocumentIds = [];
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var raw = ids_1[_i];
                var value = String(raw).trim();
                if (!value)
                    continue;
                if (mongoose_1.Types.ObjectId.isValid(value)) {
                    objectIds.push(new mongoose_1.Types.ObjectId(value));
                    continue;
                }
                var numericId = Number(value);
                if (Number.isFinite(numericId)) {
                    productDocumentIds.push(numericId);
                }
            }
            return { objectIds: objectIds, productDocumentIds: productDocumentIds };
        };
        ProcessRenewProductPerformanceService_1.prototype.docMatchesIdRefs = function (doc, refs) {
            if (doc._id &&
                refs.objectIds.some(function (id) { return id.equals(doc._id); })) {
                return true;
            }
            return (doc.productDocumentId !== undefined &&
                refs.productDocumentIds.includes(doc.productDocumentId));
        };
        ProcessRenewProductPerformanceService_1.prototype.performanceDocFilter = function (urnNo, renewalCycleObjectId) {
            return {
                urnNo: urnNo,
                documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                isDeleted: { $ne: true },
                renewalCycleId: renewalCycleObjectId,
            };
        };
        /** Cycle-scoped docs plus legacy rows without renewalCycleId (migrated on retain). */
        ProcessRenewProductPerformanceService_1.prototype.performanceDocMigrationFilter = function (urnNo, renewalCycleObjectId) {
            return {
                urnNo: urnNo,
                documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                isDeleted: { $ne: true },
                $or: [
                    { renewalCycleId: renewalCycleObjectId },
                    { renewalCycleId: null },
                    { renewalCycleId: { $exists: false } },
                ],
            };
        };
        ProcessRenewProductPerformanceService_1.prototype.resolveRenewalCycle = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, cycle_1, cycle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findById(renewalCycleId.trim())
                                    .exec()];
                        case 1:
                            cycle_1 = _a.sent();
                            if (!cycle_1 || cycle_1.urnNo !== trimmedUrn) {
                                throw new common_1.BadRequestException('renewalCycleId does not match this URN');
                            }
                            return [2 /*return*/, cycle_1];
                        case 2: return [4 /*yield*/, (0, renew_common_util_1.assertRenewProcessEditable)(this.productModel, this.renewalCycleModel, trimmedUrn)];
                        case 3:
                            cycle = (_a.sent()).cycle;
                            return [2 /*return*/, cycle];
                    }
                });
            });
        };
        /**
         * GET: explicit renewalCycleId, else active in-progress cycle, else latest saved performance cycle.
         */
        ProcessRenewProductPerformanceService_1.prototype.resolveRenewalCycleForRead = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, activeCycle, latestReport, cycle, latestHeader, cycle, latestCycle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim()) {
                                return [2 /*return*/, this.resolveRenewalCycle(urnNo, renewalCycleId)];
                            }
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findOne({ urnNo: trimmedUrn, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS })
                                    .sort({ cycleNo: -1 })
                                    .exec()];
                        case 1:
                            activeCycle = _a.sent();
                            if (activeCycle) {
                                return [2 /*return*/, activeCycle];
                            }
                            return [4 /*yield*/, this.renewTestReportModel
                                    .findOne({ urnNo: trimmedUrn })
                                    .sort({ updatedDate: -1 })
                                    .select('renewalCycleId')
                                    .lean()
                                    .exec()];
                        case 2:
                            latestReport = _a.sent();
                            if (!(latestReport === null || latestReport === void 0 ? void 0 : latestReport.renewalCycleId)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findById(latestReport.renewalCycleId)
                                    .exec()];
                        case 3:
                            cycle = _a.sent();
                            if (cycle && cycle.urnNo === trimmedUrn) {
                                return [2 /*return*/, cycle];
                            }
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.renewPerformanceModel
                                .findOne({
                                urnNo: trimmedUrn,
                                renewalCycleId: { $exists: true, $ne: null },
                            })
                                .sort({ updatedDate: -1 })
                                .select('renewalCycleId')
                                .lean()
                                .exec()];
                        case 5:
                            latestHeader = _a.sent();
                            if (!(latestHeader === null || latestHeader === void 0 ? void 0 : latestHeader.renewalCycleId)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findById(latestHeader.renewalCycleId)
                                    .exec()];
                        case 6:
                            cycle = _a.sent();
                            if (cycle && cycle.urnNo === trimmedUrn) {
                                return [2 /*return*/, cycle];
                            }
                            _a.label = 7;
                        case 7: return [4 /*yield*/, this.renewalCycleModel
                                .findOne({ urnNo: trimmedUrn })
                                .sort({ cycleNo: -1 })
                                .exec()];
                        case 8:
                            latestCycle = _a.sent();
                            if (latestCycle) {
                                return [2 /*return*/, latestCycle];
                            }
                            throw new common_1.BadRequestException('No renewal cycle found for this URN');
                    }
                });
            });
        };
        ProcessRenewProductPerformanceService_1.prototype.countRetainedRenewPerformanceDocuments = function (urnNo, renewalCycleId, existingDocumentIds) {
            return __awaiter(this, void 0, void 0, function () {
                var cycle, keepRefs, existingDocs, retained, _i, existingDocs_1, doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resolveRenewalCycle(urnNo, renewalCycleId)];
                        case 1:
                            cycle = _a.sent();
                            keepRefs = existingDocumentIds !== undefined
                                ? this.resolveDocumentIdRefs(existingDocumentIds)
                                : null;
                            return [4 /*yield*/, this.renewDocumentModel
                                    .find(this.performanceDocMigrationFilter(urnNo.trim(), cycle._id))
                                    .lean()
                                    .exec()];
                        case 2:
                            existingDocs = _a.sent();
                            retained = 0;
                            for (_i = 0, existingDocs_1 = existingDocs; _i < existingDocs_1.length; _i++) {
                                doc = existingDocs_1[_i];
                                if (keepRefs === null || this.docMatchesIdRefs(doc, keepRefs)) {
                                    retained += 1;
                                }
                            }
                            return [2 /*return*/, retained];
                    }
                });
            });
        };
        ProcessRenewProductPerformanceService_1.prototype.replaceRenewTestReportsTable = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, vendorObjectId, manufacturerObjectId, renewalCycleObjectId, processRenewProductPerformanceId, normalizedReports, now, session, docs, _i, normalizedReports_1, row, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            urnNo = params.urnNo, vendorObjectId = params.vendorObjectId, manufacturerObjectId = params.manufacturerObjectId, renewalCycleObjectId = params.renewalCycleObjectId, processRenewProductPerformanceId = params.processRenewProductPerformanceId, normalizedReports = params.normalizedReports, now = params.now, session = params.session;
                            return [4 /*yield*/, this.renewTestReportModel.deleteMany({ urnNo: urnNo, renewalCycleId: renewalCycleObjectId }, { session: session })];
                        case 1:
                            _d.sent();
                            if (!normalizedReports.length) {
                                return [2 /*return*/, []];
                            }
                            docs = [];
                            _i = 0, normalizedReports_1 = normalizedReports;
                            _d.label = 2;
                        case 2:
                            if (!(_i < normalizedReports_1.length)) return [3 /*break*/, 5];
                            row = normalizedReports_1[_i];
                            _b = (_a = docs).push;
                            _c = {};
                            return [4 /*yield*/, this.sequenceHelper.getProcessRenewProductPerformanceTestReportId()];
                        case 3:
                            _b.apply(_a, [(_c.processRenewProductPerformanceTestReportId = _d.sent(),
                                    _c.urnNo = urnNo,
                                    _c.renewalCycleId = renewalCycleObjectId,
                                    _c.vendorId = vendorObjectId,
                                    _c.manufacturerId = manufacturerObjectId,
                                    _c.processRenewProductPerformanceId = processRenewProductPerformanceId,
                                    _c.eoiNo = row.eoiNo,
                                    _c.productName = row.productName,
                                    _c.testReportFileName = row.testReportFileName,
                                    _c.normalizedProductName = row.normalizedProductName,
                                    _c.normalizedTestReportFileName = row.normalizedTestReportFileName,
                                    _c.createdDate = now,
                                    _c.updatedDate = now,
                                    _c)]);
                            _d.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [4 /*yield*/, this.renewTestReportModel.insertMany(docs, { session: session })];
                        case 6:
                            _d.sent();
                            return [2 /*return*/, normalizedReports.map(function (r) { return (__assign({ productName: r.productName, testReportFileName: r.testReportFileName }, (r.eoiNo ? { eoiNo: r.eoiNo } : {}))); })];
                    }
                });
            });
        };
        ProcessRenewProductPerformanceService_1.prototype.purgeLegacyPerEoiPerformanceRows = function (urnNo, renewalCycleObjectId, session) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.renewPerformanceModel.deleteMany({
                                urnNo: urnNo,
                                $or: [
                                    { renewalCycleId: { $exists: false } },
                                    { renewalCycleId: null },
                                    {
                                        renewalCycleId: renewalCycleObjectId,
                                        eoiNo: { $exists: true, $nin: [null, ''] },
                                    },
                                ],
                            }, { session: session })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProcessRenewProductPerformanceService_1.prototype.syncRenewPerformanceDocuments = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, vendorObjectId, manufacturerObjectId, renewalCycleObjectId, urnStatus, eoiNo, formPrimaryId, now, session, uploadedFiles, existingDocumentIds, createdFileFullPaths, baseFilter, keepRefs, existingDocs, retainIds, deleteIds, docsToDelete, oldFileLinksToDeleteAfterCommit, _i, existingDocs_2, doc, retain, docsToInsert, i, file, uploaded, _a, _b, inserted, totalDocumentCount;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            urnNo = params.urnNo, vendorObjectId = params.vendorObjectId, manufacturerObjectId = params.manufacturerObjectId, renewalCycleObjectId = params.renewalCycleObjectId, urnStatus = params.urnStatus, eoiNo = params.eoiNo, formPrimaryId = params.formPrimaryId, now = params.now, session = params.session, uploadedFiles = params.uploadedFiles, existingDocumentIds = params.existingDocumentIds, createdFileFullPaths = params.createdFileFullPaths;
                            baseFilter = this.performanceDocMigrationFilter(urnNo, renewalCycleObjectId);
                            keepRefs = existingDocumentIds !== undefined
                                ? this.resolveDocumentIdRefs(existingDocumentIds)
                                : null;
                            return [4 /*yield*/, this.renewDocumentModel
                                    .find(baseFilter)
                                    .session(session)];
                        case 1:
                            existingDocs = _d.sent();
                            retainIds = [];
                            deleteIds = [];
                            docsToDelete = [];
                            oldFileLinksToDeleteAfterCommit = [];
                            for (_i = 0, existingDocs_2 = existingDocs; _i < existingDocs_2.length; _i++) {
                                doc = existingDocs_2[_i];
                                retain = keepRefs === null || this.docMatchesIdRefs(doc, keepRefs);
                                if (retain) {
                                    retainIds.push(doc._id);
                                }
                                else {
                                    deleteIds.push(doc._id);
                                    docsToDelete.push(doc);
                                    if (doc.documentLink) {
                                        oldFileLinksToDeleteAfterCommit.push(doc.documentLink);
                                    }
                                }
                            }
                            if (!deleteIds.length) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.renewDocumentModel.updateMany({ _id: { $in: deleteIds } }, {
                                    $set: {
                                        isDeleted: true,
                                        deletedAt: now,
                                        deletedBy: vendorObjectId,
                                        updatedDate: now,
                                    },
                                }, { session: session })];
                        case 2:
                            _d.sent();
                            if (!(0, certification_document_version_util_1.isRenewVendorResubmitCycle)(urnStatus)) return [3 /*break*/, 4];
                            return [4 /*yield*/, (0, product_document_version_integration_1.trackProductDocumentDeleteBatch)({
                                    versioning: this.documentVersioningService,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                                    userId: vendorObjectId,
                                    docs: docsToDelete,
                                    slotKeyMode: 'productDocumentId',
                                    processType: 'renewal',
                                    renewalCycleId: renewalCycleObjectId,
                                    session: session,
                                })];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4:
                            if (!retainIds.length) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.renewDocumentModel.updateMany({ _id: { $in: retainIds } }, {
                                    $set: {
                                        formPrimaryId: formPrimaryId,
                                        renewalCycleId: renewalCycleObjectId,
                                        updatedDate: now,
                                    },
                                }, { session: session })];
                        case 5:
                            _d.sent();
                            _d.label = 6;
                        case 6:
                            if (!uploadedFiles.length) return [3 /*break*/, 14];
                            docsToInsert = [];
                            i = 0;
                            _d.label = 7;
                        case 7:
                            if (!(i < uploadedFiles.length)) return [3 /*break*/, 11];
                            file = uploadedFiles[i];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, (0, renew_common_util_1.renewUploadPath)(urnNo))];
                        case 8:
                            uploaded = _d.sent();
                            createdFileFullPaths.push(uploaded.fileUrl);
                            _b = (_a = docsToInsert).push;
                            _c = {};
                            return [4 /*yield*/, this.sequenceHelper.getRenewProductDocumentId()];
                        case 9:
                            _b.apply(_a, [(_c.productDocumentId = _d.sent(),
                                    _c.vendorId = vendorObjectId,
                                    _c.manufacturerId = manufacturerObjectId,
                                    _c.urnNo = urnNo,
                                    _c.renewalCycleId = renewalCycleObjectId,
                                    _c.eoiNo = eoiNo,
                                    _c.documentForm = document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                                    _c.documentFormSubsection = RENEW_PERFORMANCE_DOC_SUBSECTION,
                                    _c.formPrimaryId = formPrimaryId,
                                    _c.documentName = path.basename(uploaded.fileUrl) || "Test report ".concat(i + 1),
                                    _c.documentOriginalName = file.originalname,
                                    _c.documentLink = uploaded.fileUrl,
                                    _c.createdDate = now,
                                    _c.updatedDate = now,
                                    _c)]);
                            _d.label = 10;
                        case 10:
                            i++;
                            return [3 /*break*/, 7];
                        case 11: return [4 /*yield*/, this.renewDocumentModel.insertMany(docsToInsert, {
                                session: session,
                            })];
                        case 12:
                            inserted = _d.sent();
                            if (!(0, certification_document_version_util_1.isRenewVendorResubmitCycle)(urnStatus)) return [3 /*break*/, 14];
                            return [4 /*yield*/, (0, product_document_version_integration_1.trackProductDocumentBatch)({
                                    versioning: this.documentVersioningService,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                                    userId: vendorObjectId,
                                    docs: inserted,
                                    slotKeyMode: 'productDocumentId',
                                    processType: 'renewal',
                                    renewalCycleId: renewalCycleObjectId,
                                    session: session,
                                })];
                        case 13:
                            _d.sent();
                            _d.label = 14;
                        case 14: return [4 /*yield*/, this.renewDocumentModel
                                .countDocuments(this.performanceDocFilter(urnNo, renewalCycleObjectId))
                                .session(session)];
                        case 15:
                            totalDocumentCount = _d.sent();
                            return [2 /*return*/, { totalDocumentCount: totalDocumentCount, oldFileLinksToDeleteAfterCommit: oldFileLinksToDeleteAfterCommit }];
                    }
                });
            });
        };
        ProcessRenewProductPerformanceService_1.prototype.loadAuthoritativeTestReports = function (urnNo, renewalCycleObjectId, certifiedEoiNos) {
            return __awaiter(this, void 0, void 0, function () {
                var fromChild, mapped, header, legacyRows, aggregated, _i, legacyRows_1, row, eoiNo;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.renewTestReportModel
                                .find({
                                urnNo: urnNo,
                                renewalCycleId: renewalCycleObjectId,
                            })
                                .sort({ createdDate: 1, _id: 1 })
                                .lean()
                                .exec()];
                        case 1:
                            fromChild = _b.sent();
                            if (fromChild.length) {
                                mapped = fromChild.map(function (r) {
                                    var _a, _b;
                                    return (__assign({ productName: String((_a = r.productName) !== null && _a !== void 0 ? _a : ''), testReportFileName: String((_b = r.testReportFileName) !== null && _b !== void 0 ? _b : '') }, (r.eoiNo ? { eoiNo: r.eoiNo } : {})));
                                });
                                return [2 /*return*/, certifiedEoiNos
                                        ? (0, renew_eligible_product_util_1.filterRenewRowsByCertifiedEoi)(mapped, certifiedEoiNos)
                                        : mapped];
                            }
                            return [4 /*yield*/, this.renewPerformanceModel
                                    .findOne({
                                    urnNo: urnNo,
                                    renewalCycleId: renewalCycleObjectId,
                                    $or: [{ eoiNo: { $exists: false } }, { eoiNo: null }, { eoiNo: '' }],
                                })
                                    .lean()
                                    .exec()];
                        case 2:
                            header = _b.sent();
                            if (Array.isArray(header === null || header === void 0 ? void 0 : header.testReports) && header.testReports.length) {
                                return [2 /*return*/, header.testReports
                                        .map(function (entry) {
                                        var _a, _b;
                                        var productName = String((_a = entry.productName) !== null && _a !== void 0 ? _a : '').trim();
                                        var testReportFileName = String((_b = entry.testReportFileName) !== null && _b !== void 0 ? _b : '').trim();
                                        var eoiNo = entry.eoiNo ? String(entry.eoiNo).trim() : undefined;
                                        return __assign({ productName: productName, testReportFileName: testReportFileName }, (eoiNo ? { eoiNo: eoiNo } : {}));
                                    })
                                        .filter(function (r) { return r.productName || r.testReportFileName; })];
                            }
                            return [4 /*yield*/, this.renewPerformanceModel
                                    .find({
                                    urnNo: urnNo,
                                    eoiNo: { $exists: true, $nin: [null, ''] },
                                    $or: [
                                        { renewalCycleId: { $exists: false } },
                                        { renewalCycleId: null },
                                        { renewalCycleId: renewalCycleObjectId },
                                    ],
                                })
                                    .lean()
                                    .exec()];
                        case 3:
                            legacyRows = _b.sent();
                            aggregated = [];
                            for (_i = 0, legacyRows_1 = legacyRows; _i < legacyRows_1.length; _i++) {
                                row = legacyRows_1[_i];
                                eoiNo = String((_a = row.eoiNo) !== null && _a !== void 0 ? _a : '').trim();
                                if (certifiedEoiNos && eoiNo && !certifiedEoiNos.has(eoiNo)) {
                                    continue;
                                }
                                aggregated.push.apply(aggregated, (0, renew_product_performance_payload_util_1.resolveRowTestReports)(row, row.eoiNo));
                            }
                            return [2 /*return*/, aggregated];
                    }
                });
            });
        };
        /**
         * Single read path for renew product performance (details GET + section GET).
         * Child table first; falls back to embedded header.testReports[].
         */
        ProcessRenewProductPerformanceService_1.prototype.loadRenewProductPerformanceReadPayload = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, cycle, renewalCycleObjectId, certifiedEoiNos, _a, headerPrimary, childRows, documents, header, documentRows, section, authoritativeTestReports, publicTestReports, productPerformance, syntheticChildRows;
                var _b, _c, _d, _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.resolveRenewalCycleForRead(trimmedUrn, renewalCycleId)];
                        case 1:
                            cycle = _k.sent();
                            renewalCycleObjectId = cycle._id;
                            return [4 /*yield*/, (0, renew_eligible_product_util_1.fetchRenewCertifiedEoiSet)(this.productModel, trimmedUrn)];
                        case 2:
                            certifiedEoiNos = _k.sent();
                            return [4 /*yield*/, Promise.all([
                                    this.renewPerformanceModel
                                        .findOne({
                                        urnNo: trimmedUrn,
                                        renewalCycleId: renewalCycleObjectId,
                                        $or: [{ eoiNo: { $exists: false } }, { eoiNo: null }, { eoiNo: '' }],
                                    })
                                        .lean()
                                        .exec(),
                                    this.renewTestReportModel
                                        .find({ urnNo: trimmedUrn, renewalCycleId: renewalCycleObjectId })
                                        .sort({ processRenewProductPerformanceTestReportId: 1 })
                                        .lean()
                                        .exec(),
                                    this.renewDocumentModel
                                        .find(this.performanceDocMigrationFilter(trimmedUrn, renewalCycleObjectId))
                                        .lean()
                                        .exec(),
                                ])];
                        case 3:
                            _a = _k.sent(), headerPrimary = _a[0], childRows = _a[1], documents = _a[2];
                            header = headerPrimary;
                            if (!!header) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.renewPerformanceModel
                                    .findOne({
                                    urnNo: trimmedUrn,
                                    renewalCycleId: renewalCycleObjectId,
                                })
                                    .sort({ updatedDate: -1 })
                                    .lean()
                                    .exec()];
                        case 4:
                            header = _k.sent();
                            _k.label = 5;
                        case 5:
                            documentRows = (0, renew_eligible_product_util_1.filterRenewRowsByCertifiedEoi)(documents.map(function (d) { return (0, renew_product_performance_payload_util_1.mapRenewProductDocument)(d); }), certifiedEoiNos);
                            section = (0, renew_details_format_util_1.buildPerformanceSection)((_b = header) !== null && _b !== void 0 ? _b : null, childRows, documentRows, renewalCycleObjectId);
                            return [4 /*yield*/, this.loadAuthoritativeTestReports(trimmedUrn, renewalCycleObjectId, certifiedEoiNos)];
                        case 6:
                            authoritativeTestReports = _k.sent();
                            publicTestReports = (0, renew_product_performance_payload_util_1.toPublicRenewTestReports)(authoritativeTestReports);
                            productPerformance = section.product_performance;
                            if (publicTestReports.length > 0) {
                                syntheticChildRows = authoritativeTestReports.map(function (row, index) { return (__assign(__assign({}, row), { urnNo: trimmedUrn, processRenewProductPerformanceTestReportId: index + 1, productPerformanceTestReportId: index + 1 })); });
                                productPerformance =
                                    (_d = (0, renew_details_format_util_1.formatRenewProductPerformance)((_c = header) !== null && _c !== void 0 ? _c : null, syntheticChildRows)) !== null && _d !== void 0 ? _d : productPerformance;
                                if (productPerformance) {
                                    productPerformance.testReports = publicTestReports;
                                    productPerformance.testReportFiles = Math.max(Number((_e = productPerformance.testReportFiles) !== null && _e !== void 0 ? _e : 0), publicTestReports.length);
                                }
                            }
                            return [2 /*return*/, {
                                    urnNo: trimmedUrn,
                                    renewalCycleId: String(cycle._id),
                                    testReports: publicTestReports,
                                    productPerformanceStatus: Number((_f = productPerformance === null || productPerformance === void 0 ? void 0 : productPerformance.productPerformanceStatus) !== null && _f !== void 0 ? _f : 0),
                                    renewalType: Number((_g = productPerformance === null || productPerformance === void 0 ? void 0 : productPerformance.renewalType) !== null && _g !== void 0 ? _g : 0),
                                    testReportFiles: Number((_h = productPerformance === null || productPerformance === void 0 ? void 0 : productPerformance.testReportFiles) !== null && _h !== void 0 ? _h : publicTestReports.length),
                                    updatedDate: (_j = header === null || header === void 0 ? void 0 : header.updatedDate) !== null && _j !== void 0 ? _j : null,
                                    product_performance: productPerformance,
                                    product_performance_test_reports: section.product_performance_test_reports,
                                    product_performance_documents: section.product_performance_documents,
                                }];
                    }
                });
            });
        };
        ProcessRenewProductPerformanceService_1.prototype.save = function (input, files) {
            return __awaiter(this, void 0, void 0, function () {
                var ownership, _a, _b, cycle, urnStatus, belongs, session, createdFileFullPaths, oldFileLinksToDeleteAfterCommit, vendorObjectId, manufacturerObjectId, trimmedUrn, renewalCycleObjectId, now, uploadedFiles, replacingTestReports, existingHeader, processRenewProductPerformanceId, _c, renewalType, productPerformanceStatus, authoritativeTestReports, normalized, documentSync, _i, oldFileLinksToDeleteAfterCommit_1, fileLink, _d, payload, error_1, _e, createdFileFullPaths_1, fileLink, _f;
                var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                return __generator(this, function (_v) {
                    switch (_v.label) {
                        case 0:
                            if (!((_g = input.urnNo) === null || _g === void 0 ? void 0 : _g.trim())) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            _a = renew_common_util_1.renewOwnershipFields;
                            return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, input.urnNo)];
                        case 1:
                            ownership = _a.apply(void 0, [_v.sent()]);
                            return [4 /*yield*/, (0, renew_common_util_1.assertRenewProcessEditable)(this.productModel, this.renewalCycleModel, input.urnNo.trim(), input.renewalCycleId)];
                        case 2:
                            _b = _v.sent(), cycle = _b.cycle, urnStatus = _b.urnStatus;
                            if (!((_h = input.eoiNo) === null || _h === void 0 ? void 0 : _h.trim())) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.productModel.exists(__assign({ urnNo: input.urnNo.trim(), eoiNo: input.eoiNo.trim() }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))];
                        case 3:
                            belongs = _v.sent();
                            if (!belongs) {
                                throw new common_1.BadRequestException('eoiNo does not belong to this URN');
                            }
                            _v.label = 4;
                        case 4: return [4 /*yield*/, this.connection.startSession()];
                        case 5:
                            session = _v.sent();
                            session.startTransaction();
                            createdFileFullPaths = [];
                            oldFileLinksToDeleteAfterCommit = [];
                            _v.label = 6;
                        case 6:
                            _v.trys.push([6, 27, , 35]);
                            vendorObjectId = ownership.vendorId;
                            manufacturerObjectId = ownership.manufacturerId;
                            trimmedUrn = ownership.urnNo;
                            renewalCycleObjectId = cycle._id;
                            now = new Date();
                            uploadedFiles = Array.isArray(files) ? files : [];
                            replacingTestReports = input.testReports !== undefined;
                            if (!replacingTestReports) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.purgeLegacyPerEoiPerformanceRows(trimmedUrn, renewalCycleObjectId, session)];
                        case 7:
                            _v.sent();
                            _v.label = 8;
                        case 8: return [4 /*yield*/, this.renewPerformanceModel
                                .findOne({
                                urnNo: trimmedUrn,
                                renewalCycleId: renewalCycleObjectId,
                                $or: [{ eoiNo: { $exists: false } }, { eoiNo: null }, { eoiNo: '' }],
                            })
                                .session(session)
                                .exec()];
                        case 9:
                            existingHeader = _v.sent();
                            if (!((_j = existingHeader === null || existingHeader === void 0 ? void 0 : existingHeader.processRenewProductPerformanceId) !== null && _j !== void 0)) return [3 /*break*/, 10];
                            _c = _j;
                            return [3 /*break*/, 12];
                        case 10: return [4 /*yield*/, this.sequenceHelper.getProcessRenewProductPerformanceId()];
                        case 11:
                            _c = (_v.sent());
                            _v.label = 12;
                        case 12:
                            processRenewProductPerformanceId = _c;
                            renewalType = (_l = (_k = input.renewalType) !== null && _k !== void 0 ? _k : existingHeader === null || existingHeader === void 0 ? void 0 : existingHeader.renewalType) !== null && _l !== void 0 ? _l : 0;
                            productPerformanceStatus = (_o = (_m = input.productPerformanceStatus) !== null && _m !== void 0 ? _m : existingHeader === null || existingHeader === void 0 ? void 0 : existingHeader.productPerformanceStatus) !== null && _o !== void 0 ? _o : 0;
                            authoritativeTestReports = void 0;
                            if (!replacingTestReports) return [3 /*break*/, 14];
                            normalized = (0, renew_product_performance_payload_util_1.normalizeIncomingRenewTestReportsForReplace)(input.testReports, (_p = input.eoiNo) === null || _p === void 0 ? void 0 : _p.trim());
                            return [4 /*yield*/, this.replaceRenewTestReportsTable({
                                    urnNo: trimmedUrn,
                                    vendorObjectId: vendorObjectId,
                                    manufacturerObjectId: manufacturerObjectId,
                                    renewalCycleObjectId: renewalCycleObjectId,
                                    processRenewProductPerformanceId: processRenewProductPerformanceId,
                                    normalizedReports: normalized,
                                    now: now,
                                    session: session,
                                })];
                        case 13:
                            authoritativeTestReports = _v.sent();
                            return [3 /*break*/, 16];
                        case 14: return [4 /*yield*/, this.loadAuthoritativeTestReports(trimmedUrn, renewalCycleObjectId)];
                        case 15:
                            authoritativeTestReports = _v.sent();
                            _v.label = 16;
                        case 16: return [4 /*yield*/, this.syncRenewPerformanceDocuments({
                                urnNo: trimmedUrn,
                                vendorObjectId: vendorObjectId,
                                manufacturerObjectId: manufacturerObjectId,
                                renewalCycleObjectId: renewalCycleObjectId,
                                urnStatus: urnStatus,
                                eoiNo: (_q = input.eoiNo) === null || _q === void 0 ? void 0 : _q.trim(),
                                formPrimaryId: processRenewProductPerformanceId,
                                now: now,
                                session: session,
                                uploadedFiles: uploadedFiles,
                                existingDocumentIds: input.existingDocumentIds,
                                createdFileFullPaths: createdFileFullPaths,
                            })];
                        case 17:
                            documentSync = _v.sent();
                            oldFileLinksToDeleteAfterCommit =
                                documentSync.oldFileLinksToDeleteAfterCommit;
                            return [4 /*yield*/, this.renewPerformanceModel
                                    .findOneAndUpdate({
                                    urnNo: trimmedUrn,
                                    renewalCycleId: renewalCycleObjectId,
                                }, {
                                    $set: {
                                        vendorId: vendorObjectId,
                                        manufacturerId: manufacturerObjectId,
                                        renewalCycleId: renewalCycleObjectId,
                                        testReports: authoritativeTestReports,
                                        testReportFileName: (_s = (_r = authoritativeTestReports[0]) === null || _r === void 0 ? void 0 : _r.testReportFileName) !== null && _s !== void 0 ? _s : '',
                                        productName: (_u = (_t = authoritativeTestReports[0]) === null || _t === void 0 ? void 0 : _t.productName) !== null && _u !== void 0 ? _u : '',
                                        testReportFiles: documentSync.totalDocumentCount,
                                        renewalType: renewalType,
                                        productPerformanceStatus: productPerformanceStatus,
                                        updatedDate: now,
                                    },
                                    $unset: { eoiNo: '' },
                                    $setOnInsert: {
                                        processRenewProductPerformanceId: processRenewProductPerformanceId,
                                        createdDate: now,
                                    },
                                }, { upsert: true, new: true, session: session })
                                    .exec()];
                        case 18:
                            _v.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 19:
                            _v.sent();
                            session.endSession();
                            _i = 0, oldFileLinksToDeleteAfterCommit_1 = oldFileLinksToDeleteAfterCommit;
                            _v.label = 20;
                        case 20:
                            if (!(_i < oldFileLinksToDeleteAfterCommit_1.length)) return [3 /*break*/, 25];
                            fileLink = oldFileLinksToDeleteAfterCommit_1[_i];
                            _v.label = 21;
                        case 21:
                            _v.trys.push([21, 23, , 24]);
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(fileLink)];
                        case 22:
                            _v.sent();
                            return [3 /*break*/, 24];
                        case 23:
                            _d = _v.sent();
                            return [3 /*break*/, 24];
                        case 24:
                            _i++;
                            return [3 /*break*/, 20];
                        case 25: return [4 /*yield*/, this.getFormPayloadByUrn(trimmedUrn, String(cycle._id))];
                        case 26:
                            payload = _v.sent();
                            return [2 /*return*/, {
                                    payload: payload,
                                    filesUploaded: uploadedFiles.length,
                                }];
                        case 27:
                            error_1 = _v.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 28:
                            _v.sent();
                            session.endSession();
                            _e = 0, createdFileFullPaths_1 = createdFileFullPaths;
                            _v.label = 29;
                        case 29:
                            if (!(_e < createdFileFullPaths_1.length)) return [3 /*break*/, 34];
                            fileLink = createdFileFullPaths_1[_e];
                            _v.label = 30;
                        case 30:
                            _v.trys.push([30, 32, , 33]);
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(fileLink)];
                        case 31:
                            _v.sent();
                            return [3 /*break*/, 33];
                        case 32:
                            _f = _v.sent();
                            return [3 /*break*/, 33];
                        case 33:
                            _e++;
                            return [3 /*break*/, 29];
                        case 34:
                            if (error_1 instanceof common_1.BadRequestException ||
                                error_1 instanceof common_1.NotFoundException) {
                                throw error_1;
                            }
                            throw new common_1.InternalServerErrorException(error_1.message || 'Failed to save renew product performance');
                        case 35: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessRenewProductPerformanceService_1.prototype.upsert = function (input, testReportFiles) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.save({
                                urnNo: input.urnNo,
                                renewalCycleId: input.renewalCycleId,
                                eoiNo: input.eoiNo,
                                productPerformanceStatus: input.productPerformanceStatus,
                                testReports: input.testReportFileName || input.productName
                                    ? [
                                        {
                                            productName: (_a = input.productName) !== null && _a !== void 0 ? _a : '',
                                            testReportFileName: (_b = input.testReportFileName) !== null && _b !== void 0 ? _b : '',
                                            eoiNo: input.eoiNo,
                                        },
                                    ]
                                    : undefined,
                            }, testReportFiles)];
                        case 1:
                            result = _c.sent();
                            return [2 /*return*/, result.payload];
                    }
                });
            });
        };
        ProcessRenewProductPerformanceService_1.prototype.getFormPayloadByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, performancePayload, products, publicTestReports, mappedDocuments, header, rows;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.loadRenewProductPerformanceReadPayload(trimmedUrn, renewalCycleId)];
                        case 1:
                            performancePayload = _c.sent();
                            return [4 /*yield*/, this.productModel
                                    .find(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                    .select('eoiNo productName productStatus')
                                    .sort({ createdDate: 1 })
                                    .lean()
                                    .exec()];
                        case 2:
                            products = _c.sent();
                            publicTestReports = (_a = performancePayload.testReports) !== null && _a !== void 0 ? _a : [];
                            mappedDocuments = (_b = performancePayload.product_performance_documents) !== null && _b !== void 0 ? _b : [];
                            header = performancePayload.product_performance;
                            rows = (0, renew_product_performance_payload_util_1.buildRowsFromAuthoritativeTestReports)(products.map(function (p) {
                                var _a;
                                return ({
                                    eoiNo: p.eoiNo,
                                    productName: p.productName,
                                    productStatus: Number((_a = p.productStatus) !== null && _a !== void 0 ? _a : 0),
                                });
                            }), publicTestReports, header, mappedDocuments, trimmedUrn);
                            return [2 /*return*/, __assign(__assign({}, performancePayload), { products: products.map(function (p) {
                                        var _a;
                                        return ({
                                            eoiNo: p.eoiNo,
                                            productName: p.productName,
                                            productStatus: Number((_a = p.productStatus) !== null && _a !== void 0 ? _a : 0),
                                        });
                                    }), rows: rows, all_renew_product_documents: mappedDocuments })];
                    }
                });
            });
        };
        ProcessRenewProductPerformanceService_1.prototype.listByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getFormPayloadByUrn(urnNo, renewalCycleId)];
                });
            });
        };
        return ProcessRenewProductPerformanceService_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewProductPerformanceService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewProductPerformanceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewProductPerformanceService = _classThis;
}();
exports.ProcessRenewProductPerformanceService = ProcessRenewProductPerformanceService;
