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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDesignService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var upload_file_util_1 = require("../utils/upload-file.util");
var product_design_upload_util_1 = require("./product-design-upload.util");
var form_partial_field_util_1 = require("../common/form-partial-field.util");
var product_document_version_integration_1 = require("../documents/helpers/product-document-version.integration");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var vendor_urn_edit_util_1 = require("../common/vendor/vendor-urn-edit.util");
var ProductDesignService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductDesignService = _classThis = /** @class */ (function () {
        function ProductDesignService_1(productDesignModel, pdMeasureModel, allProductDocumentModel, productModel, connection, sequenceHelper, documentUploadNotification, documentVersioningService) {
            this.productDesignModel = productDesignModel;
            this.pdMeasureModel = pdMeasureModel;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentUploadNotification = documentUploadNotification;
            this.documentVersioningService = documentVersioningService;
        }
        ProductDesignService_1.prototype.onModuleInit = function () {
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
                            return [4 /*yield*/, this.productDesignModel.syncIndexes()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.pdMeasureModel.syncIndexes()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error('[product-design] syncIndexes failed (check existing duplicates):', error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Safely convert string to ObjectId with validation
         */
        ProductDesignService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        /**
         * Normalize and deduplicate measures rows from multipart payload.
         * This prevents duplicate inserts when clients accidentally append
         * the same measures for each uploaded file.
         */
        ProductDesignService_1.prototype.normalizeUniqueMeasures = function (rows) {
            if (!Array.isArray(rows) || rows.length === 0)
                return [];
            var seen = new Set();
            var unique = [];
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                var normalized = (0, form_partial_field_util_1.normalizeMeasureBenefitRow)(row);
                var measuresImplemented = normalized.measuresImplemented;
                var benefitsAchieved = normalized.benefitsAchieved;
                var normalizedMeasures = measuresImplemented.toLowerCase();
                var normalizedBenefits = benefitsAchieved.toLowerCase();
                // Skip fully empty rows
                if (!measuresImplemented && !benefitsAchieved)
                    continue;
                var key = "".concat(normalizedMeasures, "__").concat(normalizedBenefits);
                if (seen.has(key))
                    continue;
                seen.add(key);
                unique.push({
                    measuresImplemented: measuresImplemented,
                    benefitsAchieved: benefitsAchieved,
                    normalizedMeasures: normalizedMeasures,
                    normalizedBenefits: normalizedBenefits,
                });
            }
            return unique;
        };
        ProductDesignService_1.prototype.toEmbeddedMeasures = function (rows) {
            return rows.map(function (row) { return ({
                measuresImplemented: row.measuresImplemented,
                benefitsAchieved: row.benefitsAchieved,
            }); });
        };
        /**
         * Replace all measure rows for this URN/vendor with the POST payload (no merge).
         */
        ProductDesignService_1.prototype.replaceMeasuresByUrn = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, vendorObjectId, effectiveProductDesignId, normalizedMeasures, now, session, measureDocs, _i, normalizedMeasures_1, row, productDesignMeasureId, inserted;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = params.urnNo, vendorObjectId = params.vendorObjectId, effectiveProductDesignId = params.effectiveProductDesignId, normalizedMeasures = params.normalizedMeasures, now = params.now, session = params.session;
                            return [4 /*yield*/, this.pdMeasureModel.deleteMany({ urnNo: urnNo, vendorId: vendorObjectId }, { session: session })];
                        case 1:
                            _a.sent();
                            if (!normalizedMeasures.length) {
                                return [2 /*return*/, []];
                            }
                            measureDocs = [];
                            _i = 0, normalizedMeasures_1 = normalizedMeasures;
                            _a.label = 2;
                        case 2:
                            if (!(_i < normalizedMeasures_1.length)) return [3 /*break*/, 5];
                            row = normalizedMeasures_1[_i];
                            return [4 /*yield*/, this.sequenceHelper.getProductDesignMeasureId()];
                        case 3:
                            productDesignMeasureId = _a.sent();
                            measureDocs.push({
                                productDesignMeasureId: productDesignMeasureId,
                                urnNo: urnNo,
                                vendorId: vendorObjectId,
                                productDesignId: effectiveProductDesignId,
                                measures: row.measuresImplemented,
                                benefits: row.benefitsAchieved,
                                normalizedMeasures: row.normalizedMeasures,
                                normalizedBenefits: row.normalizedBenefits,
                                createdDate: now,
                                updatedDate: now,
                            });
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [4 /*yield*/, this.pdMeasureModel.insertMany(measureDocs, {
                                session: session,
                            })];
                        case 6:
                            inserted = _a.sent();
                            return [2 /*return*/, inserted.map(function (row) {
                                    var _a, _b;
                                    return ({
                                        _id: row._id,
                                        productDesignMeasureId: row.productDesignMeasureId,
                                        measuresImplemented: String((_a = row.measures) !== null && _a !== void 0 ? _a : ''),
                                        benefitsAchieved: String((_b = row.benefits) !== null && _b !== void 0 ? _b : ''),
                                    });
                                })];
                    }
                });
            });
        };
        ProductDesignService_1.prototype.saveFileToUrnFolder = function (file, urnNo) {
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
        ProductDesignService_1.prototype.resolveDocumentIdRefs = function (ids) {
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
         * Count product_design documents that would remain after applying retention lists.
         * `existing*DocumentIds` omitted → keep all docs of that subsection (vendor text-only save).
         */
        ProductDesignService_1.prototype.countRetainedProductDesignDocuments = function (urnNo, vendorId, existingEcoVisionDocumentIds, existingSupportingDocumentIds) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, ecoKeepRefs, supportingKeepRefs, existingDocs, ecoVision, supporting, _i, existingDocs_1, doc, subsection, retain, retain;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            ecoKeepRefs = existingEcoVisionDocumentIds !== undefined
                                ? this.resolveDocumentIdRefs(existingEcoVisionDocumentIds)
                                : null;
                            supportingKeepRefs = existingSupportingDocumentIds !== undefined
                                ? this.resolveDocumentIdRefs(existingSupportingDocumentIds)
                                : null;
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .find({
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                                    isDeleted: { $ne: true },
                                })
                                    .lean()
                                    .exec()];
                        case 1:
                            existingDocs = _b.sent();
                            ecoVision = 0;
                            supporting = 0;
                            for (_i = 0, existingDocs_1 = existingDocs; _i < existingDocs_1.length; _i++) {
                                doc = existingDocs_1[_i];
                                subsection = String((_a = doc.documentFormSubsection) !== null && _a !== void 0 ? _a : '');
                                if (subsection === product_design_upload_util_1.ECO_VISION_SUBSECTION) {
                                    retain = ecoKeepRefs === null || this.docMatchesIdRefs(doc, ecoKeepRefs);
                                    if (retain)
                                        ecoVision += 1;
                                }
                                else if (subsection === product_design_upload_util_1.SUPPORTING_SUBSECTION) {
                                    retain = supportingKeepRefs === null ||
                                        this.docMatchesIdRefs(doc, supportingKeepRefs);
                                    if (retain)
                                        supporting += 1;
                                }
                            }
                            return [2 /*return*/, { ecoVision: ecoVision, supporting: supporting }];
                    }
                });
            });
        };
        ProductDesignService_1.prototype.docMatchesIdRefs = function (doc, refs) {
            if (doc._id &&
                refs.objectIds.some(function (id) { return id.equals(doc._id); })) {
                return true;
            }
            return (doc.productDocumentId !== undefined &&
                refs.productDocumentIds.includes(doc.productDocumentId));
        };
        ProductDesignService_1.prototype.syncProductDesignDocuments = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, vendorObjectId, eoiNo, formPrimaryId, now, session, ecoVisionFiles, supportingDocumentFiles, existingEcoVisionDocumentIds, existingSupportingDocumentIds, createdFileFullPaths, ecoKeepRefs, supportingKeepRefs, existingDocs, retainIds, deleteIds, docsToDelete, oldFileLinksToDeleteAfterCommit, _i, existingDocs_2, doc, subsection, isEco, isSupporting, retain, docRows, _a, ecoVisionFiles_1, file, uploaded, _b, supportingDocumentFiles_1, file, uploaded, isResubmitCycle, docsToInsert, _c, docRows_1, row, productDocumentId, insertedDocs, baseDocFilter, ecoCount, supportingCount;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            urnNo = params.urnNo, vendorObjectId = params.vendorObjectId, eoiNo = params.eoiNo, formPrimaryId = params.formPrimaryId, now = params.now, session = params.session, ecoVisionFiles = params.ecoVisionFiles, supportingDocumentFiles = params.supportingDocumentFiles, existingEcoVisionDocumentIds = params.existingEcoVisionDocumentIds, existingSupportingDocumentIds = params.existingSupportingDocumentIds, createdFileFullPaths = params.createdFileFullPaths;
                            ecoKeepRefs = existingEcoVisionDocumentIds !== undefined
                                ? this.resolveDocumentIdRefs(existingEcoVisionDocumentIds)
                                : null;
                            supportingKeepRefs = existingSupportingDocumentIds !== undefined
                                ? this.resolveDocumentIdRefs(existingSupportingDocumentIds)
                                : null;
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .find({
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                                    isDeleted: { $ne: true },
                                })
                                    .session(session)];
                        case 1:
                            existingDocs = _e.sent();
                            retainIds = [];
                            deleteIds = [];
                            docsToDelete = [];
                            oldFileLinksToDeleteAfterCommit = [];
                            for (_i = 0, existingDocs_2 = existingDocs; _i < existingDocs_2.length; _i++) {
                                doc = existingDocs_2[_i];
                                subsection = String((_d = doc.documentFormSubsection) !== null && _d !== void 0 ? _d : '');
                                isEco = subsection === product_design_upload_util_1.ECO_VISION_SUBSECTION;
                                isSupporting = subsection === product_design_upload_util_1.SUPPORTING_SUBSECTION;
                                if (!isEco && !isSupporting) {
                                    retainIds.push(doc._id);
                                    continue;
                                }
                                retain = isEco
                                    ? ecoKeepRefs === null || this.docMatchesIdRefs(doc, ecoKeepRefs)
                                    : supportingKeepRefs === null ||
                                        this.docMatchesIdRefs(doc, supportingKeepRefs);
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
                            _e.sent();
                            return [4 /*yield*/, (0, product_document_version_integration_1.trackProductDocumentDeleteBatch)({
                                    versioning: this.documentVersioningService,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                                    userId: vendorObjectId,
                                    docs: docsToDelete,
                                    slotKeyMode: 'subsection',
                                    session: session,
                                })];
                        case 3:
                            _e.sent();
                            _e.label = 4;
                        case 4:
                            if (!retainIds.length) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.allProductDocumentModel.updateMany({ _id: { $in: retainIds } }, { $set: { formPrimaryId: formPrimaryId, updatedDate: now } }, { session: session })];
                        case 5:
                            _e.sent();
                            _e.label = 6;
                        case 6:
                            docRows = [];
                            _a = 0, ecoVisionFiles_1 = ecoVisionFiles;
                            _e.label = 7;
                        case 7:
                            if (!(_a < ecoVisionFiles_1.length)) return [3 /*break*/, 10];
                            file = ecoVisionFiles_1[_a];
                            return [4 /*yield*/, this.saveFileToUrnFolder(file, urnNo)];
                        case 8:
                            uploaded = _e.sent();
                            createdFileFullPaths.push(uploaded.fileUrl);
                            docRows.push({
                                subsection: product_design_upload_util_1.ECO_VISION_SUBSECTION,
                                filePath: uploaded.fileUrl,
                                fileName: uploaded.fileName,
                                originalName: file.originalname,
                            });
                            _e.label = 9;
                        case 9:
                            _a++;
                            return [3 /*break*/, 7];
                        case 10:
                            _b = 0, supportingDocumentFiles_1 = supportingDocumentFiles;
                            _e.label = 11;
                        case 11:
                            if (!(_b < supportingDocumentFiles_1.length)) return [3 /*break*/, 14];
                            file = supportingDocumentFiles_1[_b];
                            return [4 /*yield*/, this.saveFileToUrnFolder(file, urnNo)];
                        case 12:
                            uploaded = _e.sent();
                            createdFileFullPaths.push(uploaded.fileUrl);
                            docRows.push({
                                subsection: product_design_upload_util_1.SUPPORTING_SUBSECTION,
                                filePath: uploaded.fileUrl,
                                fileName: uploaded.fileName,
                                originalName: file.originalname,
                            });
                            _e.label = 13;
                        case 13:
                            _b++;
                            return [3 /*break*/, 11];
                        case 14:
                            if (!docRows.length) return [3 /*break*/, 22];
                            return [4 /*yield*/, (0, certification_document_version_util_1.isVendorResubmitCycle)(this.productModel, urnNo, session)];
                        case 15:
                            isResubmitCycle = _e.sent();
                            docsToInsert = [];
                            _c = 0, docRows_1 = docRows;
                            _e.label = 16;
                        case 16:
                            if (!(_c < docRows_1.length)) return [3 /*break*/, 19];
                            row = docRows_1[_c];
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 17:
                            productDocumentId = _e.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId,
                                urnNo: urnNo,
                                eoiNo: eoiNo,
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                                documentFormSubsection: row.subsection,
                                formPrimaryId: formPrimaryId,
                                documentName: row.fileName,
                                documentOriginalName: row.originalName,
                                documentLink: row.filePath,
                                createdDate: now,
                                updatedDate: now,
                            });
                            _e.label = 18;
                        case 18:
                            _c++;
                            return [3 /*break*/, 16];
                        case 19: return [4 /*yield*/, this.allProductDocumentModel.insertMany(docsToInsert, { session: session })];
                        case 20:
                            insertedDocs = _e.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackInsertedCertificationDocuments)({
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    insertedDocs: insertedDocs,
                                    isResubmitCycle: isResubmitCycle,
                                    session: session,
                                    filesByIndex: __spreadArray(__spreadArray([], ecoVisionFiles, true), supportingDocumentFiles, true),
                                })];
                        case 21:
                            _e.sent();
                            _e.label = 22;
                        case 22:
                            baseDocFilter = {
                                vendorId: vendorObjectId,
                                urnNo: urnNo,
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN,
                                isDeleted: { $ne: true },
                            };
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .countDocuments(__assign(__assign({}, baseDocFilter), { documentFormSubsection: product_design_upload_util_1.ECO_VISION_SUBSECTION }))
                                    .session(session)];
                        case 23:
                            ecoCount = _e.sent();
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .countDocuments(__assign(__assign({}, baseDocFilter), { documentFormSubsection: product_design_upload_util_1.SUPPORTING_SUBSECTION }))
                                    .session(session)];
                        case 24:
                            supportingCount = _e.sent();
                            return [2 /*return*/, {
                                    ecoVisionUpload: ecoCount,
                                    productDesignSupportingDocument: supportingCount,
                                    oldFileLinksToDeleteAfterCommit: oldFileLinksToDeleteAfterCommit,
                                }];
                    }
                });
            });
        };
        /**
         * Create product design with file uploads
         */
        ProductDesignService_1.prototype.createProductDesign = function (createProductDesignDto, vendorId, uploadParts) {
            return __awaiter(this, void 0, void 0, function () {
                var session, createdFileFullPaths, oldFileLinksToDeleteAfterCommit, vendorObjectId, now, normalizedMeasures, ecoVisionFiles, supportingDocumentFiles, productRow, eoiNo, productDesignId, strategiesText, embeddedMeasures, productDesignData, createdProductDesign, savedProductDesign, effectiveProductDesignId, savedMeasures, documentSync, newUploadCount, _i, oldFileLinksToDeleteAfterCommit_1, fileLink, _a, error_2, _b, createdFileFullPaths_1, fileLink, cleanupError_1;
                var _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0: return [4 /*yield*/, (0, vendor_urn_edit_util_1.assertVendorCanEditUrn)(this.productModel, vendorId, createProductDesignDto.urnNo)];
                        case 1:
                            _j.sent();
                            return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            session = _j.sent();
                            session.startTransaction();
                            createdFileFullPaths = [];
                            oldFileLinksToDeleteAfterCommit = [];
                            _j.label = 3;
                        case 3:
                            _j.trys.push([3, 19, , 28]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            now = new Date();
                            normalizedMeasures = this.normalizeUniqueMeasures(createProductDesignDto.measuresAndBenefits);
                            ecoVisionFiles = (_c = uploadParts === null || uploadParts === void 0 ? void 0 : uploadParts.ecoVisionFiles) !== null && _c !== void 0 ? _c : [];
                            supportingDocumentFiles = (_d = uploadParts === null || uploadParts === void 0 ? void 0 : uploadParts.supportingDocumentFiles) !== null && _d !== void 0 ? _d : [];
                            return [4 /*yield*/, this.connection
                                    .collection('products')
                                    .findOne({ urnNo: createProductDesignDto.urnNo, vendorId: vendorObjectId }, { projection: { eoiNo: 1 } })];
                        case 4:
                            productRow = _j.sent();
                            if (!productRow) {
                                throw new common_1.NotFoundException('URN not found or does not belong to this vendor');
                            }
                            eoiNo = productRow === null || productRow === void 0 ? void 0 : productRow.eoiNo;
                            return [4 /*yield*/, this.sequenceHelper.getProductDesignId()];
                        case 5:
                            productDesignId = _j.sent();
                            strategiesText = String((_f = (_e = createProductDesignDto.strategies) !== null && _e !== void 0 ? _e : createProductDesignDto.statergies) !== null && _f !== void 0 ? _f : '').trim();
                            // Replace master product-design row for this URN + vendor.
                            return [4 /*yield*/, this.productDesignModel.deleteMany({ urnNo: createProductDesignDto.urnNo, vendorId: vendorObjectId }, { session: session })];
                        case 6:
                            // Replace master product-design row for this URN + vendor.
                            _j.sent();
                            embeddedMeasures = this.toEmbeddedMeasures(normalizedMeasures);
                            productDesignData = {
                                productDesignId: productDesignId,
                                urnNo: createProductDesignDto.urnNo,
                                vendorId: vendorObjectId,
                                ecoVisionUpload: null,
                                statergies: strategiesText,
                                productDesignSupportingDocument: null,
                                productDesignStatus: (_g = createProductDesignDto.productDesignStatus) !== null && _g !== void 0 ? _g : 0,
                                measuresAndBenefits: embeddedMeasures,
                                createdDate: now,
                                updatedDate: now,
                            };
                            createdProductDesign = new this.productDesignModel(productDesignData);
                            return [4 /*yield*/, createdProductDesign.save({ session: session })];
                        case 7:
                            savedProductDesign = _j.sent();
                            if (!savedProductDesign) {
                                throw new common_1.InternalServerErrorException('Failed to save product design record');
                            }
                            effectiveProductDesignId = savedProductDesign.productDesignId;
                            return [4 /*yield*/, this.replaceMeasuresByUrn({
                                    urnNo: createProductDesignDto.urnNo,
                                    vendorObjectId: vendorObjectId,
                                    effectiveProductDesignId: effectiveProductDesignId,
                                    normalizedMeasures: normalizedMeasures,
                                    now: now,
                                    session: session,
                                })];
                        case 8:
                            savedMeasures = _j.sent();
                            return [4 /*yield*/, this.productDesignModel.updateOne({ _id: savedProductDesign._id }, { $set: { measuresAndBenefits: this.toEmbeddedMeasures(savedMeasures) } }, { session: session })];
                        case 9:
                            _j.sent();
                            savedProductDesign.measuresAndBenefits =
                                this.toEmbeddedMeasures(savedMeasures);
                            return [4 /*yield*/, this.syncProductDesignDocuments({
                                    urnNo: createProductDesignDto.urnNo,
                                    vendorObjectId: vendorObjectId,
                                    eoiNo: eoiNo,
                                    formPrimaryId: effectiveProductDesignId,
                                    now: now,
                                    session: session,
                                    ecoVisionFiles: ecoVisionFiles,
                                    supportingDocumentFiles: supportingDocumentFiles,
                                    existingEcoVisionDocumentIds: createProductDesignDto.existingEcoVisionDocumentIds,
                                    existingSupportingDocumentIds: createProductDesignDto.existingSupportingDocumentIds,
                                    createdFileFullPaths: createdFileFullPaths,
                                })];
                        case 10:
                            documentSync = _j.sent();
                            oldFileLinksToDeleteAfterCommit =
                                documentSync.oldFileLinksToDeleteAfterCommit;
                            return [4 /*yield*/, this.productDesignModel.updateOne({ _id: savedProductDesign._id }, {
                                    $set: {
                                        ecoVisionUpload: documentSync.ecoVisionUpload,
                                        productDesignSupportingDocument: documentSync.productDesignSupportingDocument,
                                        updatedDate: now,
                                    },
                                }, { session: session })];
                        case 11:
                            _j.sent();
                            savedProductDesign.ecoVisionUpload = documentSync.ecoVisionUpload;
                            savedProductDesign.productDesignSupportingDocument =
                                documentSync.productDesignSupportingDocument;
                            return [4 /*yield*/, session.commitTransaction()];
                        case 12:
                            _j.sent();
                            session.endSession();
                            newUploadCount = ecoVisionFiles.length + supportingDocumentFiles.length;
                            this.documentUploadNotification.notifyAfterDocumentsUploaded(vendorId, newUploadCount, createProductDesignDto.urnNo);
                            _i = 0, oldFileLinksToDeleteAfterCommit_1 = oldFileLinksToDeleteAfterCommit;
                            _j.label = 13;
                        case 13:
                            if (!(_i < oldFileLinksToDeleteAfterCommit_1.length)) return [3 /*break*/, 18];
                            fileLink = oldFileLinksToDeleteAfterCommit_1[_i];
                            _j.label = 14;
                        case 14:
                            _j.trys.push([14, 16, , 17]);
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(fileLink)];
                        case 15:
                            _j.sent();
                            return [3 /*break*/, 17];
                        case 16:
                            _a = _j.sent();
                            return [3 /*break*/, 17];
                        case 17:
                            _i++;
                            return [3 /*break*/, 13];
                        case 18: return [2 /*return*/, {
                                productDesign: savedProductDesign,
                                measuresAndBenefits: savedMeasures,
                                ecoVisionDocumentCount: documentSync.ecoVisionUpload,
                                supportingDocumentCount: documentSync.productDesignSupportingDocument,
                            }];
                        case 19:
                            error_2 = _j.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 20:
                            _j.sent();
                            session.endSession();
                            _j.label = 21;
                        case 21:
                            _j.trys.push([21, 26, , 27]);
                            _b = 0, createdFileFullPaths_1 = createdFileFullPaths;
                            _j.label = 22;
                        case 22:
                            if (!(_b < createdFileFullPaths_1.length)) return [3 /*break*/, 25];
                            fileLink = createdFileFullPaths_1[_b];
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(fileLink)];
                        case 23:
                            _j.sent();
                            _j.label = 24;
                        case 24:
                            _b++;
                            return [3 /*break*/, 22];
                        case 25: return [3 /*break*/, 27];
                        case 26:
                            cleanupError_1 = _j.sent();
                            // Ignore cleanup errors
                            console.warn('File cleanup error:', cleanupError_1);
                            return [3 /*break*/, 27];
                        case 27:
                            if (error_2 instanceof common_1.NotFoundException ||
                                error_2 instanceof common_1.BadRequestException) {
                                console.error('Validation error:', error_2.message);
                                throw error_2;
                            }
                            // Log the actual error for debugging
                            console.error('Product design creation error:', error_2);
                            console.error('Error name:', error_2.name);
                            console.error('Error message:', error_2.message);
                            console.error('Error code:', error_2.code);
                            console.error('Error stack:', error_2.stack);
                            // Check for specific error types
                            if (error_2.name === 'CastError' ||
                                ((_h = error_2.message) === null || _h === void 0 ? void 0 : _h.includes('Cast to ObjectId'))) {
                                throw new common_1.BadRequestException("Invalid ID format provided: ".concat(error_2.message));
                            }
                            throw new common_1.InternalServerErrorException(error_2.message ||
                                'Failed to create product design. Please check the logs for details.');
                        case 28: return [2 /*return*/];
                    }
                });
            });
        };
        return ProductDesignService_1;
    }());
    __setFunctionName(_classThis, "ProductDesignService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductDesignService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductDesignService = _classThis;
}();
exports.ProductDesignService = ProductDesignService;
