"use strict";
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
exports.ProductPerformanceService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var form_partial_field_util_1 = require("../common/form-partial-field.util");
var upload_file_util_1 = require("../utils/upload-file.util");
var product_performance_upload_util_1 = require("./product-performance-upload.util");
var vendor_urn_edit_util_1 = require("../common/vendor/vendor-urn-edit.util");
var product_document_version_integration_1 = require("../documents/helpers/product-document-version.integration");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var ProductPerformanceService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductPerformanceService = _classThis = /** @class */ (function () {
        function ProductPerformanceService_1(productPerformanceModel, ppTestReportModel, allProductDocumentModel, productModel, connection, sequenceHelper, documentVersioningService) {
            this.productPerformanceModel = productPerformanceModel;
            this.ppTestReportModel = ppTestReportModel;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentVersioningService = documentVersioningService;
        }
        ProductPerformanceService_1.prototype.assertVendorCanEditUrn = function (vendorId, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, vendor_urn_edit_util_1.assertVendorCanEditUrn)(this.productModel, vendorId, urnNo)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProductPerformanceService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var shouldSyncIndexes, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            shouldSyncIndexes = String(process.env.SYNC_INDEXES_ON_BOOT || 'false').toLowerCase() ===
                                'true';
                            if (!shouldSyncIndexes)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.productPerformanceModel.syncIndexes()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.ppTestReportModel.syncIndexes()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error('[product-performance] syncIndexes failed (check existing duplicates):', error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        ProductPerformanceService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        ProductPerformanceService_1.prototype.normalizeText = function (value) {
            return String(value !== null && value !== void 0 ? value : '').trim().toLowerCase();
        };
        ProductPerformanceService_1.prototype.normalizedProductNameKey = function (productName) {
            return (this.normalizeText(productName) ||
                ProductPerformanceService.EMPTY_PRODUCT_NORMALIZED_KEY);
        };
        ProductPerformanceService_1.prototype.normalizedTestReportFileNameKey = function (testReportFileName) {
            return (this.normalizeText(testReportFileName) ||
                ProductPerformanceService.EMPTY_TEST_REPORT_FILE_NORMALIZED_KEY);
        };
        ProductPerformanceService_1.prototype.isMeaningfulTestReportRow = function (productName, testReportFileName) {
            return Boolean(productName.trim() || testReportFileName.trim());
        };
        ProductPerformanceService_1.prototype.dedupeTestReportRows = function (rows) {
            var seen = new Set();
            var unique = [];
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                if (!this.isMeaningfulTestReportRow(row.productName, row.testReportFileName)) {
                    continue;
                }
                var key = "".concat(row.normalizedProductName, "__").concat(row.normalizedTestReportFileName);
                if (seen.has(key))
                    continue;
                seen.add(key);
                unique.push(row);
            }
            return unique;
        };
        /** Full replace list from request body only (never from upload filenames). */
        ProductPerformanceService_1.prototype.parseIncomingTestReportRows = function (dto) {
            var _a, _b;
            var defaultProductName = String((_a = dto.productName) !== null && _a !== void 0 ? _a : '').trim();
            var rawRows = Array.isArray(dto.testReports) && dto.testReports.length > 0
                ? dto.testReports
                : ((_b = dto.testReportFileName) === null || _b === void 0 ? void 0 : _b.trim())
                    ? [
                        {
                            productName: dto.productName,
                            testReportFileName: dto.testReportFileName,
                        },
                    ]
                    : [];
            var parsedRows = [];
            for (var _i = 0, rawRows_1 = rawRows; _i < rawRows_1.length; _i++) {
                var row = rawRows_1[_i];
                var normalized = (0, form_partial_field_util_1.normalizeTestReportRow)(row);
                var productName = (normalized.productName || defaultProductName).trim();
                var testReportFileName = normalized.testReportFileName.trim();
                if (!this.isMeaningfulTestReportRow(productName, testReportFileName)) {
                    continue;
                }
                parsedRows.push({
                    productName: productName,
                    testReportFileName: testReportFileName,
                    normalizedProductName: this.normalizedProductNameKey(productName),
                    normalizedTestReportFileName: this.normalizedTestReportFileNameKey(testReportFileName),
                });
            }
            return this.dedupeTestReportRows(parsedRows);
        };
        ProductPerformanceService_1.prototype.resolveDocumentIdRefs = function (ids) {
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
        /**
         * Count performance documents retained after applying existingDocumentIds.
         * Omit existingDocumentIds → keep all docs on URN (vendor text-only save).
         */
        ProductPerformanceService_1.prototype.countRetainedProductPerformanceDocuments = function (urnNo, vendorId, existingDocumentIds) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, keepRefs, existingDocs, retained, _i, existingDocs_1, doc, keep;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            keepRefs = existingDocumentIds !== undefined
                                ? this.resolveDocumentIdRefs(existingDocumentIds)
                                : null;
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .find({
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                                    isDeleted: { $ne: true },
                                })
                                    .lean()
                                    .exec()];
                        case 1:
                            existingDocs = _a.sent();
                            retained = 0;
                            for (_i = 0, existingDocs_1 = existingDocs; _i < existingDocs_1.length; _i++) {
                                doc = existingDocs_1[_i];
                                keep = keepRefs === null || this.docMatchesIdRefs(doc, keepRefs);
                                if (keep)
                                    retained += 1;
                            }
                            return [2 /*return*/, retained];
                    }
                });
            });
        };
        ProductPerformanceService_1.prototype.docMatchesIdRefs = function (doc, refs) {
            if (doc._id &&
                refs.objectIds.some(function (id) { return id.equals(doc._id); })) {
                return true;
            }
            return (doc.productDocumentId !== undefined &&
                refs.productDocumentIds.includes(doc.productDocumentId));
        };
        ProductPerformanceService_1.prototype.syncPerformanceDocuments = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, vendorObjectId, eoiNo, formPrimaryId, now, session, uploadedFiles, incomingRows, existingDocumentIds, createdFileFullPaths, keepRefs, existingDocs, retainIds, deleteIds, docsToDelete, oldFileLinksToDeleteAfterCommit, _i, existingDocs_2, doc, retain, isResubmitCycle, docsToInsert, i, file, uploaded, productDocumentId, insertedDocs, totalDocumentCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = params.urnNo, vendorObjectId = params.vendorObjectId, eoiNo = params.eoiNo, formPrimaryId = params.formPrimaryId, now = params.now, session = params.session, uploadedFiles = params.uploadedFiles, incomingRows = params.incomingRows, existingDocumentIds = params.existingDocumentIds, createdFileFullPaths = params.createdFileFullPaths;
                            keepRefs = existingDocumentIds !== undefined
                                ? this.resolveDocumentIdRefs(existingDocumentIds)
                                : null;
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .find({
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                                    isDeleted: { $ne: true },
                                })
                                    .session(session)];
                        case 1:
                            existingDocs = _a.sent();
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
                            return [4 /*yield*/, this.allProductDocumentModel.updateMany({ _id: { $in: deleteIds } }, {
                                    $set: {
                                        isDeleted: true,
                                        deletedAt: now,
                                        deletedBy: vendorObjectId,
                                        updatedDate: now,
                                    },
                                }, { session: session })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, product_document_version_integration_1.trackProductDocumentDeleteBatch)({
                                    versioning: this.documentVersioningService,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                                    userId: vendorObjectId,
                                    docs: docsToDelete,
                                    slotKeyMode: 'subsection',
                                    session: session,
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (!retainIds.length) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.allProductDocumentModel.updateMany({ _id: { $in: retainIds } }, { $set: { formPrimaryId: formPrimaryId, updatedDate: now } }, { session: session })];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            if (!uploadedFiles.length) return [3 /*break*/, 15];
                            return [4 /*yield*/, (0, certification_document_version_util_1.isVendorResubmitCycle)(this.productModel, urnNo, session)];
                        case 7:
                            isResubmitCycle = _a.sent();
                            docsToInsert = [];
                            i = 0;
                            _a.label = 8;
                        case 8:
                            if (!(i < uploadedFiles.length)) return [3 /*break*/, 12];
                            file = uploadedFiles[i];
                            return [4 /*yield*/, this.saveFileToUrnFolder(file, urnNo)];
                        case 9:
                            uploaded = _a.sent();
                            createdFileFullPaths.push(uploaded.fileUrl);
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 10:
                            productDocumentId = _a.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId,
                                urnNo: urnNo,
                                eoiNo: eoiNo,
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                                documentFormSubsection: product_performance_upload_util_1.PERFORMANCE_TEST_REPORT_SUBSECTION,
                                formPrimaryId: formPrimaryId,
                                documentName: uploaded.fileName || "Test report ".concat(i + 1),
                                documentOriginalName: file.originalname,
                                documentLink: uploaded.fileUrl,
                                createdDate: now,
                                updatedDate: now,
                            });
                            _a.label = 11;
                        case 11:
                            i++;
                            return [3 /*break*/, 8];
                        case 12: return [4 /*yield*/, this.allProductDocumentModel.insertMany(docsToInsert, { session: session })];
                        case 13:
                            insertedDocs = _a.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackInsertedCertificationDocuments)({
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    insertedDocs: insertedDocs,
                                    isResubmitCycle: isResubmitCycle,
                                    session: session,
                                    filesByIndex: uploadedFiles,
                                })];
                        case 14:
                            _a.sent();
                            _a.label = 15;
                        case 15: return [4 /*yield*/, this.allProductDocumentModel
                                .countDocuments({
                                vendorId: vendorObjectId,
                                urnNo: urnNo,
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE,
                                isDeleted: { $ne: true },
                            })
                                .session(session)];
                        case 16:
                            totalDocumentCount = _a.sent();
                            return [2 /*return*/, { totalDocumentCount: totalDocumentCount, oldFileLinksToDeleteAfterCommit: oldFileLinksToDeleteAfterCommit }];
                    }
                });
            });
        };
        ProductPerformanceService_1.prototype.replaceTestReportsTable = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, vendorObjectId, processProductPerformanceId, normalizedReports, now, session, docs, _i, normalizedReports_1, row, productPerformanceTestReportId, inserted;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = params.urnNo, vendorObjectId = params.vendorObjectId, processProductPerformanceId = params.processProductPerformanceId, normalizedReports = params.normalizedReports, now = params.now, session = params.session;
                            return [4 /*yield*/, this.ppTestReportModel.deleteMany({ urnNo: urnNo, vendorId: vendorObjectId }, { session: session })];
                        case 1:
                            _a.sent();
                            if (!normalizedReports.length) {
                                return [2 /*return*/, []];
                            }
                            docs = [];
                            _i = 0, normalizedReports_1 = normalizedReports;
                            _a.label = 2;
                        case 2:
                            if (!(_i < normalizedReports_1.length)) return [3 /*break*/, 5];
                            row = normalizedReports_1[_i];
                            return [4 /*yield*/, this.sequenceHelper.getProductPerformanceTestReportId()];
                        case 3:
                            productPerformanceTestReportId = _a.sent();
                            docs.push({
                                productPerformanceTestReportId: productPerformanceTestReportId,
                                urnNo: urnNo,
                                vendorId: vendorObjectId,
                                processProductPerformanceId: processProductPerformanceId,
                                productName: row.productName,
                                testReportFileName: row.testReportFileName,
                                normalizedProductName: row.normalizedProductName ||
                                    ProductPerformanceService.EMPTY_PRODUCT_NORMALIZED_KEY,
                                normalizedTestReportFileName: row.normalizedTestReportFileName ||
                                    ProductPerformanceService.EMPTY_TEST_REPORT_FILE_NORMALIZED_KEY,
                                createdDate: now,
                                updatedDate: now,
                            });
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [4 /*yield*/, this.ppTestReportModel.insertMany(docs, { session: session })];
                        case 6:
                            inserted = _a.sent();
                            return [2 /*return*/, inserted.map(function (row) {
                                    var _a, _b;
                                    return ({
                                        _id: row._id,
                                        productPerformanceTestReportId: row.productPerformanceTestReportId,
                                        productName: String((_a = row.productName) !== null && _a !== void 0 ? _a : ''),
                                        testReportFileName: String((_b = row.testReportFileName) !== null && _b !== void 0 ? _b : ''),
                                    });
                                })];
                    }
                });
            });
        };
        ProductPerformanceService_1.prototype.saveFileToUrnFolder = function (file, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var uploaded;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, "urns/".concat(urnNo))];
                        case 1:
                            uploaded = _a.sent();
                            return [2 /*return*/, { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName }];
                    }
                });
            });
        };
        ProductPerformanceService_1.prototype.toPublicTestReports = function (rows) {
            return rows.map(function (r) { return ({
                _id: r._id,
                productPerformanceTestReportId: r.productPerformanceTestReportId,
                productName: r.productName,
                testReportFileName: r.testReportFileName,
            }); });
        };
        ProductPerformanceService_1.prototype.createProductPerformance = function (createProductPerformanceDto, vendorId, files) {
            return __awaiter(this, void 0, void 0, function () {
                var session, createdFileFullPaths, oldFileLinksToDeleteAfterCommit, vendorObjectId, urnNo, now, uploadedFiles, incomingRows, embeddedTestReports, productRow, eoiNo, existingProductPerformance, processProductPerformanceId, _a, documentSync, renewalType, productPerformanceStatus, savedProductPerformance, savedTestReports, _i, oldFileLinksToDeleteAfterCommit_1, fileLink, _b, error_2, _c, createdFileFullPaths_1, fileLink, _d;
                var _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0: return [4 /*yield*/, this.connection.startSession()];
                        case 1:
                            session = _j.sent();
                            session.startTransaction();
                            createdFileFullPaths = [];
                            oldFileLinksToDeleteAfterCommit = [];
                            _j.label = 2;
                        case 2:
                            _j.trys.push([2, 18, , 27]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            urnNo = createProductPerformanceDto.urnNo;
                            now = new Date();
                            uploadedFiles = (0, product_performance_upload_util_1.collectProductPerformanceUploadFiles)(files);
                            incomingRows = this.parseIncomingTestReportRows(createProductPerformanceDto);
                            embeddedTestReports = incomingRows.map(function (r) { return ({
                                productName: r.productName,
                                testReportFileName: r.testReportFileName,
                            }); });
                            return [4 /*yield*/, this.connection
                                    .collection('products')
                                    .findOne({ urnNo: urnNo, vendorId: vendorObjectId }, { projection: { eoiNo: 1 } })];
                        case 3:
                            productRow = _j.sent();
                            if (!productRow) {
                                throw new common_1.NotFoundException('URN not found or does not belong to this vendor');
                            }
                            eoiNo = productRow === null || productRow === void 0 ? void 0 : productRow.eoiNo;
                            return [4 /*yield*/, this.productPerformanceModel
                                    .findOne({ urnNo: urnNo, vendorId: vendorObjectId })
                                    .sort({ updatedDate: -1, createdDate: -1, _id: -1 })
                                    .session(session)];
                        case 4:
                            existingProductPerformance = _j.sent();
                            if (!((_e = existingProductPerformance === null || existingProductPerformance === void 0 ? void 0 : existingProductPerformance.processProductPerformanceId) !== null && _e !== void 0)) return [3 /*break*/, 5];
                            _a = _e;
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.sequenceHelper.getProductPerformanceId()];
                        case 6:
                            _a = (_j.sent());
                            _j.label = 7;
                        case 7:
                            processProductPerformanceId = _a;
                            return [4 /*yield*/, this.syncPerformanceDocuments({
                                    urnNo: urnNo,
                                    vendorObjectId: vendorObjectId,
                                    eoiNo: eoiNo,
                                    formPrimaryId: processProductPerformanceId,
                                    now: now,
                                    session: session,
                                    uploadedFiles: uploadedFiles,
                                    incomingRows: embeddedTestReports,
                                    existingDocumentIds: createProductPerformanceDto.existingDocumentIds,
                                    createdFileFullPaths: createdFileFullPaths,
                                })];
                        case 8:
                            documentSync = _j.sent();
                            oldFileLinksToDeleteAfterCommit =
                                documentSync.oldFileLinksToDeleteAfterCommit;
                            renewalType = (_f = createProductPerformanceDto.renewalType) !== null && _f !== void 0 ? _f : null;
                            productPerformanceStatus = (_g = createProductPerformanceDto.productPerformanceStatus) !== null && _g !== void 0 ? _g : 0;
                            return [4 /*yield*/, this.productPerformanceModel
                                    .findOneAndUpdate({ urnNo: urnNo, vendorId: vendorObjectId }, {
                                    $set: {
                                        urnNo: urnNo,
                                        vendorId: vendorObjectId,
                                        testReportFiles: documentSync.totalDocumentCount,
                                        renewalType: renewalType,
                                        productPerformanceStatus: productPerformanceStatus,
                                        testReports: embeddedTestReports,
                                        updatedDate: now,
                                    },
                                    $setOnInsert: {
                                        processProductPerformanceId: processProductPerformanceId,
                                        createdDate: now,
                                    },
                                }, { upsert: true, new: true, session: session })
                                    .exec()];
                        case 9:
                            savedProductPerformance = _j.sent();
                            if (!savedProductPerformance) {
                                throw new common_1.InternalServerErrorException('Failed to save product performance record');
                            }
                            return [4 /*yield*/, this.replaceTestReportsTable({
                                    urnNo: urnNo,
                                    vendorObjectId: vendorObjectId,
                                    processProductPerformanceId: processProductPerformanceId,
                                    normalizedReports: incomingRows,
                                    now: now,
                                    session: session,
                                })];
                        case 10:
                            savedTestReports = _j.sent();
                            savedProductPerformance.testReports = embeddedTestReports;
                            savedProductPerformance.testReportFiles = documentSync.totalDocumentCount;
                            return [4 /*yield*/, session.commitTransaction()];
                        case 11:
                            _j.sent();
                            session.endSession();
                            _i = 0, oldFileLinksToDeleteAfterCommit_1 = oldFileLinksToDeleteAfterCommit;
                            _j.label = 12;
                        case 12:
                            if (!(_i < oldFileLinksToDeleteAfterCommit_1.length)) return [3 /*break*/, 17];
                            fileLink = oldFileLinksToDeleteAfterCommit_1[_i];
                            _j.label = 13;
                        case 13:
                            _j.trys.push([13, 15, , 16]);
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(fileLink)];
                        case 14:
                            _j.sent();
                            return [3 /*break*/, 16];
                        case 15:
                            _b = _j.sent();
                            return [3 /*break*/, 16];
                        case 16:
                            _i++;
                            return [3 /*break*/, 12];
                        case 17: return [2 /*return*/, {
                                productPerformance: savedProductPerformance,
                                filesUploaded: uploadedFiles.length,
                                totalDocumentCount: documentSync.totalDocumentCount,
                                savedTestReports: savedTestReports,
                            }];
                        case 18:
                            error_2 = _j.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 19:
                            _j.sent();
                            session.endSession();
                            _j.label = 20;
                        case 20:
                            _j.trys.push([20, 25, , 26]);
                            _c = 0, createdFileFullPaths_1 = createdFileFullPaths;
                            _j.label = 21;
                        case 21:
                            if (!(_c < createdFileFullPaths_1.length)) return [3 /*break*/, 24];
                            fileLink = createdFileFullPaths_1[_c];
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(fileLink)];
                        case 22:
                            _j.sent();
                            _j.label = 23;
                        case 23:
                            _c++;
                            return [3 /*break*/, 21];
                        case 24: return [3 /*break*/, 26];
                        case 25:
                            _d = _j.sent();
                            return [3 /*break*/, 26];
                        case 26:
                            if (error_2 instanceof common_1.NotFoundException ||
                                error_2 instanceof common_1.BadRequestException) {
                                throw error_2;
                            }
                            console.error('Product performance creation error:', error_2);
                            if (error_2.name === 'CastError' ||
                                ((_h = error_2.message) === null || _h === void 0 ? void 0 : _h.includes('Cast to ObjectId'))) {
                                throw new common_1.BadRequestException("Invalid ID format provided: ".concat(error_2.message));
                            }
                            throw new common_1.InternalServerErrorException(error_2.message ||
                                'Failed to create product performance. Please check the logs for details.');
                        case 27: return [2 /*return*/];
                    }
                });
            });
        };
        return ProductPerformanceService_1;
    }());
    __setFunctionName(_classThis, "ProductPerformanceService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductPerformanceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.EMPTY_PRODUCT_NORMALIZED_KEY = '__default__';
    _classThis.EMPTY_TEST_REPORT_FILE_NORMALIZED_KEY = '__unnamed__';
    (function () {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductPerformanceService = _classThis;
}();
exports.ProductPerformanceService = ProductPerformanceService;
