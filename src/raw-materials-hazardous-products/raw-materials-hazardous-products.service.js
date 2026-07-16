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
exports.RawMaterialsHazardousProductsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var form_partial_field_util_1 = require("../common/form-partial-field.util");
var raw_materials_hazardous_display_util_1 = require("../common/raw-materials/raw-materials-hazardous-display.util");
var upload_file_util_1 = require("../utils/upload-file.util");
var path = require("path");
var product_document_version_integration_1 = require("../documents/helpers/product-document-version.integration");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var audit_actions_1 = require("../audit-log/audit-actions");
var audit_friendlies_1 = require("../audit-log/audit-friendlies");
var RawMaterialsHazardousProductsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RawMaterialsHazardousProductsService = _classThis = /** @class */ (function () {
        function RawMaterialsHazardousProductsService_1(model, allProductDocumentModel, productModel, connection, sequenceHelper, documentVersioningService, auditLogService) {
            this.model = model;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentVersioningService = documentVersioningService;
            this.auditLogService = auditLogService;
        }
        RawMaterialsHazardousProductsService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId)
                return id;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        RawMaterialsHazardousProductsService_1.prototype.saveFileToUrnFolder = function (file, urnNo) {
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
        RawMaterialsHazardousProductsService_1.prototype.mapDocument = function (doc) {
            var o = typeof doc.toObject === 'function' ? doc.toObject() : doc;
            return {
                _id: o._id,
                productDocumentId: o.productDocumentId,
                vendorId: o.vendorId,
                urnNo: o.urnNo,
                eoiNo: o.eoiNo,
                documentForm: o.documentForm,
                documentFormSubsection: o.documentFormSubsection,
                formPrimaryId: o.formPrimaryId,
                documentName: o.documentName,
                documentOriginalName: o.documentOriginalName,
                documentLink: o.documentLink,
                createdDate: o.createdDate,
                updatedDate: o.updatedDate,
            };
        };
        RawMaterialsHazardousProductsService_1.prototype.toPublicProductRow = function (row) {
            var _a, _b, _c;
            var o = typeof row.toObject ===
                'function'
                ? row.toObject()
                : row;
            return {
                _id: o._id,
                rawMaterialsHazardousProductsId: o
                    .rawMaterialsHazardousProductsId,
                urnNo: o.urnNo,
                vendorId: o.vendorId,
                productsName: String((_a = o.productsName) !== null && _a !== void 0 ? _a : ''),
                productsTestReport: String((_b = o.productsTestReport) !== null && _b !== void 0 ? _b : ''),
                productsTestReportFileName: String((_c = o.productsTestReport) !== null && _c !== void 0 ? _c : ''),
                createdDate: o.createdDate,
                updatedDate: o.updatedDate,
            };
        };
        RawMaterialsHazardousProductsService_1.prototype.parseMeaningfulProductRows = function (products) {
            if (!Array.isArray(products)) {
                return [];
            }
            var rows = [];
            for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
                var item = products_1[_i];
                var normalized = (0, form_partial_field_util_1.normalizeRawMaterialsProductRow)(item);
                if ((0, form_partial_field_util_1.hasPartialRawMaterialsProductRow)(normalized)) {
                    rows.push(normalized);
                }
            }
            return rows;
        };
        RawMaterialsHazardousProductsService_1.prototype.resolveDocumentIdRefs = function (ids) {
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
        RawMaterialsHazardousProductsService_1.prototype.docMatchesIdRefs = function (doc, refs) {
            if (doc._id &&
                refs.objectIds.some(function (id) { return id.equals(doc._id); })) {
                return true;
            }
            return (doc.productDocumentId !== undefined &&
                refs.productDocumentIds.includes(doc.productDocumentId));
        };
        RawMaterialsHazardousProductsService_1.prototype.deleteAllProductsForUrn = function (urnNo, vendorId, session, actor) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, normalizedUrn, filter, existingRows;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            normalizedUrn = urnNo.trim();
                            filter = { urnNo: normalizedUrn, vendorId: vendorObjectId };
                            return [4 /*yield*/, this.model
                                    .find(filter)
                                    .lean()
                                    .session(session !== null && session !== void 0 ? session : null)
                                    .exec()];
                        case 1:
                            existingRows = _d.sent();
                            return [4 /*yield*/, this.model.deleteMany(filter, { session: session })];
                        case 2:
                            _d.sent();
                            if (!existingRows.length) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.auditLogService.record({
                                    action: audit_actions_1.AUDIT_ACTION.RAW_MATERIALS_DELETED,
                                    outcome: 'success',
                                    module: audit_friendlies_1.AUDIT_MODULE.RAW_MATERIALS,
                                    action_type: audit_friendlies_1.AUDIT_ACTION_TYPE.DELETE,
                                    entity_name: normalizedUrn,
                                    description: 'Raw materials hazardous product rows deleted',
                                    performed_by: {
                                        user_id: (_b = (_a = actor === null || actor === void 0 ? void 0 : actor.user_id) !== null && _a !== void 0 ? _a : actor === null || actor === void 0 ? void 0 : actor.vendor_id) !== null && _b !== void 0 ? _b : vendorId,
                                        name: actor === null || actor === void 0 ? void 0 : actor.name,
                                        email: actor === null || actor === void 0 ? void 0 : actor.email,
                                    },
                                    old_values: {
                                        records: existingRows.map(function (row) { return _this.toAuditSnapshot(row); }),
                                        count: existingRows.length,
                                    },
                                    actor: {
                                        user_id: actor === null || actor === void 0 ? void 0 : actor.user_id,
                                        role: actor === null || actor === void 0 ? void 0 : actor.role,
                                        vendor_id: (_c = actor === null || actor === void 0 ? void 0 : actor.vendor_id) !== null && _c !== void 0 ? _c : vendorId,
                                        manufacturer_id: actor === null || actor === void 0 ? void 0 : actor.manufacturer_id,
                                    },
                                    resource: {
                                        type: 'RawMaterialsHazardousProducts',
                                        id: normalizedUrn,
                                        urn_no: normalizedUrn,
                                    },
                                    changes: {
                                        records: {
                                            before: existingRows.length,
                                            after: 0,
                                        },
                                    },
                                    metadata: {
                                        tab: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                        documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                        deletion_type: 'replace_or_clear',
                                    },
                                }, { session: session })];
                        case 3:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Remove all product metadata rows for URN (details-only save / explicit clear). */
        RawMaterialsHazardousProductsService_1.prototype.clearAllProductsForUrn = function (urnNo, vendorId, actor) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.deleteAllProductsForUrn(urnNo, vendorId, undefined, actor)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RawMaterialsHazardousProductsService_1.prototype.toAuditSnapshot = function (row) {
            return JSON.parse(JSON.stringify(row, function (_key, value) {
                if (value instanceof Date) {
                    return value.toISOString();
                }
                if (value &&
                    typeof value === 'object' &&
                    value._bsontype === 'ObjectId') {
                    return String(value);
                }
                return value;
            }));
        };
        RawMaterialsHazardousProductsService_1.prototype.syncHazardousProductDocuments = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, vendorObjectId, eoiNo, now, session, uploadedFiles, existingDocumentIds, firstProductRowId, createdFileFullPaths, keepRefs, existingDocs, retainIds, deleteIds, docsToDelete, oldFileLinksToDeleteAfterCommit, _i, existingDocs_1, doc, retain, formPrimaryId, documents, i, file, uploaded, productDocumentId, linkFormPrimaryId, inserted;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnNo = params.urnNo, vendorObjectId = params.vendorObjectId, eoiNo = params.eoiNo, now = params.now, session = params.session, uploadedFiles = params.uploadedFiles, existingDocumentIds = params.existingDocumentIds, firstProductRowId = params.firstProductRowId, createdFileFullPaths = params.createdFileFullPaths;
                            keepRefs = existingDocumentIds !== undefined
                                ? this.resolveDocumentIdRefs(existingDocumentIds)
                                : null;
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .find({
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                    isDeleted: { $ne: true },
                                })
                                    .session(session)];
                        case 1:
                            existingDocs = _a.sent();
                            retainIds = [];
                            deleteIds = [];
                            docsToDelete = [];
                            oldFileLinksToDeleteAfterCommit = [];
                            for (_i = 0, existingDocs_1 = existingDocs; _i < existingDocs_1.length; _i++) {
                                doc = existingDocs_1[_i];
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
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                    userId: vendorObjectId,
                                    docs: docsToDelete,
                                    session: session,
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            formPrimaryId = firstProductRowId !== null && firstProductRowId !== void 0 ? firstProductRowId : 0;
                            if (!retainIds.length) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.allProductDocumentModel.updateMany({ _id: { $in: retainIds } }, { $set: { formPrimaryId: formPrimaryId, eoiNo: eoiNo, updatedDate: now } }, { session: session })];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            documents = [];
                            i = 0;
                            _a.label = 7;
                        case 7:
                            if (!(i < uploadedFiles.length)) return [3 /*break*/, 13];
                            file = uploadedFiles[i];
                            return [4 /*yield*/, this.saveFileToUrnFolder(file, urnNo)];
                        case 8:
                            uploaded = _a.sent();
                            createdFileFullPaths.push(uploaded.fileUrl);
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 9:
                            productDocumentId = _a.sent();
                            linkFormPrimaryId = i === 0 && firstProductRowId ? firstProductRowId : productDocumentId;
                            return [4 /*yield*/, this.allProductDocumentModel.create([
                                    {
                                        productDocumentId: productDocumentId,
                                        vendorId: vendorObjectId,
                                        urnNo: urnNo,
                                        eoiNo: eoiNo,
                                        documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                        documentFormSubsection: 'products_test_report',
                                        formPrimaryId: linkFormPrimaryId,
                                        documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
                                        documentOriginalName: file.originalname,
                                        documentLink: uploaded.fileUrl,
                                        createdDate: now,
                                        updatedDate: now,
                                    },
                                ], { session: session })];
                        case 10:
                            inserted = _a.sent();
                            documents.push(this.mapDocument(inserted[0]));
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackCertificationDocumentAfterCreate)({
                                    productModel: this.productModel,
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    doc: inserted[0],
                                    file: file,
                                    session: session,
                                })];
                        case 11:
                            _a.sent();
                            _a.label = 12;
                        case 12:
                            i++;
                            return [3 /*break*/, 7];
                        case 13: return [2 /*return*/, { documents: documents, oldFileLinksToDeleteAfterCommit: oldFileLinksToDeleteAfterCommit }];
                    }
                });
            });
        };
        /**
         * Full replace: product table snapshot + document sync (Product Performance pattern).
         */
        RawMaterialsHazardousProductsService_1.prototype.replaceByUrn = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var session, createdFileFullPaths, oldFileLinksToDeleteAfterCommit, vendorObjectId, urnNo, eoiNo, now, meaningfulRows, uploadFiles, existingDocCount, docsToInsert, _i, meaningfulRows_1, row, id, insertedProducts, _a, firstProductRowId, docSync, _b, oldFileLinksToDeleteAfterCommit_1, link, _c, retainedDocs, _d, error_1, _e, createdFileFullPaths_1, link, _f;
                var _this = this;
                var _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, this.connection.startSession()];
                        case 1:
                            session = _k.sent();
                            session.startTransaction();
                            createdFileFullPaths = [];
                            oldFileLinksToDeleteAfterCommit = [];
                            _k.label = 2;
                        case 2:
                            _k.trys.push([2, 24, , 32]);
                            vendorObjectId = this.toObjectId(params.vendorId, 'vendorId');
                            urnNo = params.urnNo.trim();
                            eoiNo = String((_g = params.eoiNo) !== null && _g !== void 0 ? _g : '').trim();
                            now = new Date();
                            meaningfulRows = this.parseMeaningfulProductRows(params.products);
                            uploadFiles = (_h = params.uploadedFiles) !== null && _h !== void 0 ? _h : [];
                            if (!(meaningfulRows.length === 0 &&
                                uploadFiles.length === 0 &&
                                params.existingDocumentIds === undefined)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .countDocuments({
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                    isDeleted: { $ne: true },
                                })
                                    .session(session)];
                        case 3:
                            existingDocCount = _k.sent();
                            if (existingDocCount === 0) {
                                throw new common_1.BadRequestException('Please fill in at least one field in the form before continuing.');
                            }
                            _k.label = 4;
                        case 4: return [4 /*yield*/, this.deleteAllProductsForUrn(urnNo, params.vendorId, session, params.actor)];
                        case 5:
                            _k.sent();
                            docsToInsert = [];
                            _i = 0, meaningfulRows_1 = meaningfulRows;
                            _k.label = 6;
                        case 6:
                            if (!(_i < meaningfulRows_1.length)) return [3 /*break*/, 9];
                            row = meaningfulRows_1[_i];
                            return [4 /*yield*/, this.sequenceHelper.getRawMaterialsHazardousProductsId()];
                        case 7:
                            id = _k.sent();
                            docsToInsert.push({
                                rawMaterialsHazardousProductsId: id,
                                urnNo: urnNo,
                                vendorId: vendorObjectId,
                                productsName: row.productName,
                                productsTestReport: row.testReportReference,
                                createdDate: now,
                                updatedDate: now,
                            });
                            _k.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 6];
                        case 9:
                            if (!(docsToInsert.length > 0)) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.model.insertMany(docsToInsert, { session: session })];
                        case 10:
                            _a = _k.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            _a = [];
                            _k.label = 12;
                        case 12:
                            insertedProducts = _a;
                            firstProductRowId = (_j = insertedProducts[0]) === null || _j === void 0 ? void 0 : _j.rawMaterialsHazardousProductsId;
                            return [4 /*yield*/, this.syncHazardousProductDocuments({
                                    urnNo: urnNo,
                                    vendorObjectId: vendorObjectId,
                                    eoiNo: eoiNo,
                                    now: now,
                                    session: session,
                                    uploadedFiles: uploadFiles,
                                    existingDocumentIds: params.existingDocumentIds,
                                    firstProductRowId: firstProductRowId,
                                    createdFileFullPaths: createdFileFullPaths,
                                })];
                        case 13:
                            docSync = _k.sent();
                            oldFileLinksToDeleteAfterCommit = docSync.oldFileLinksToDeleteAfterCommit;
                            return [4 /*yield*/, session.commitTransaction()];
                        case 14:
                            _k.sent();
                            session.endSession();
                            _b = 0, oldFileLinksToDeleteAfterCommit_1 = oldFileLinksToDeleteAfterCommit;
                            _k.label = 15;
                        case 15:
                            if (!(_b < oldFileLinksToDeleteAfterCommit_1.length)) return [3 /*break*/, 20];
                            link = oldFileLinksToDeleteAfterCommit_1[_b];
                            _k.label = 16;
                        case 16:
                            _k.trys.push([16, 18, , 19]);
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(link)];
                        case 17:
                            _k.sent();
                            return [3 /*break*/, 19];
                        case 18:
                            _c = _k.sent();
                            return [3 /*break*/, 19];
                        case 19:
                            _b++;
                            return [3 /*break*/, 15];
                        case 20:
                            if (!(docSync.documents.length > 0)) return [3 /*break*/, 21];
                            _d = docSync.documents;
                            return [3 /*break*/, 23];
                        case 21: return [4 /*yield*/, this.allProductDocumentModel
                                .find({
                                vendorId: vendorObjectId,
                                urnNo: urnNo,
                                documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                isDeleted: { $ne: true },
                            })
                                .sort({ productDocumentId: -1 })
                                .exec()];
                        case 22:
                            _d = (_k.sent()).map(function (d) { return _this.mapDocument(d); });
                            _k.label = 23;
                        case 23:
                            retainedDocs = _d;
                            return [2 /*return*/, {
                                    urnNo: urnNo,
                                    vendorId: vendorObjectId.toString(),
                                    products: insertedProducts.map(function (r) { return _this.toPublicProductRow(r); }),
                                    documents: retainedDocs,
                                }];
                        case 24:
                            error_1 = _k.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 25:
                            _k.sent();
                            session.endSession();
                            _e = 0, createdFileFullPaths_1 = createdFileFullPaths;
                            _k.label = 26;
                        case 26:
                            if (!(_e < createdFileFullPaths_1.length)) return [3 /*break*/, 31];
                            link = createdFileFullPaths_1[_e];
                            _k.label = 27;
                        case 27:
                            _k.trys.push([27, 29, , 30]);
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(link)];
                        case 28:
                            _k.sent();
                            return [3 /*break*/, 30];
                        case 29:
                            _f = _k.sent();
                            return [3 /*break*/, 30];
                        case 30:
                            _e++;
                            return [3 /*break*/, 26];
                        case 31:
                            if (error_1 instanceof common_1.BadRequestException ||
                                error_1 instanceof common_1.NotFoundException) {
                                throw error_1;
                            }
                            console.error('[Raw Materials Hazardous Products] Replace error:', error_1);
                            throw new common_1.InternalServerErrorException(error_1 instanceof Error
                                ? error_1.message
                                : 'Failed to replace hazardous product records.');
                        case 32: return [2 /*return*/];
                    }
                });
            });
        };
        /** Persist upload metadata only — no product table row. */
        RawMaterialsHazardousProductsService_1.prototype.saveDocumentOnly = function (urnNo_1, vendorObjectId_1, file_1) {
            return __awaiter(this, arguments, void 0, function (urnNo, vendorObjectId, file, eoiNo) {
                var now, uploaded, productDocumentId, doc;
                if (eoiNo === void 0) { eoiNo = ''; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            return [4 /*yield*/, this.saveFileToUrnFolder(file, urnNo)];
                        case 1:
                            uploaded = _a.sent();
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 2:
                            productDocumentId = _a.sent();
                            return [4 /*yield*/, this.allProductDocumentModel.create({
                                    productDocumentId: productDocumentId,
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    eoiNo: eoiNo,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                    documentFormSubsection: 'products_test_report',
                                    formPrimaryId: productDocumentId,
                                    documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
                                    documentOriginalName: file.originalname,
                                    documentLink: uploaded.fileUrl,
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 3:
                            doc = _a.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackCertificationDocumentAfterCreate)({
                                    productModel: this.productModel,
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    doc: doc,
                                    file: file,
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, {
                                    documentOnly: true,
                                    documents: [this.mapDocument(doc)],
                                }];
                    }
                });
            });
        };
        RawMaterialsHazardousProductsService_1.prototype.create = function (dto, vendorId, productsTestReportFile, options) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, urnNo, productRow, hasProductText, id, now, storedRelativePath, uploaded, doc, saved, productDocumentId, createdDoc, error_2;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 11, , 12]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            urnNo = dto.urnNo.trim();
                            productRow = (0, form_partial_field_util_1.normalizeRawMaterialsProductRow)({
                                productsName: dto.productsName,
                                productsTestReport: dto.productsTestReport,
                            });
                            hasProductText = (0, form_partial_field_util_1.hasPartialRawMaterialsProductRow)(productRow);
                            if (!(options === null || options === void 0 ? void 0 : options.replaceTableBeforeInsert)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.deleteAllProductsForUrn(urnNo, vendorId, undefined, options.actor)];
                        case 1:
                            _c.sent();
                            _c.label = 2;
                        case 2:
                            if (!hasProductText && productsTestReportFile) {
                                return [2 /*return*/, this.saveDocumentOnly(urnNo, vendorObjectId, productsTestReportFile, String((_a = dto.eoiNo) !== null && _a !== void 0 ? _a : '').trim())];
                            }
                            if (!hasProductText && !productsTestReportFile) {
                                return [2 /*return*/, { skipped: true }];
                            }
                            return [4 /*yield*/, this.sequenceHelper.getRawMaterialsHazardousProductsId()];
                        case 3:
                            id = _c.sent();
                            now = new Date();
                            storedRelativePath = '';
                            if (!productsTestReportFile) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.saveFileToUrnFolder(productsTestReportFile, urnNo)];
                        case 4:
                            uploaded = _c.sent();
                            storedRelativePath = uploaded.fileUrl;
                            _c.label = 5;
                        case 5:
                            doc = new this.model({
                                rawMaterialsHazardousProductsId: id,
                                urnNo: urnNo,
                                vendorId: vendorObjectId,
                                productsName: productRow.productName,
                                productsTestReport: productRow.testReportReference,
                                createdDate: now,
                                updatedDate: now,
                            });
                            return [4 /*yield*/, doc.save()];
                        case 6:
                            saved = _c.sent();
                            if (!(productsTestReportFile && storedRelativePath)) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 7:
                            productDocumentId = _c.sent();
                            return [4 /*yield*/, this.allProductDocumentModel.create({
                                    productDocumentId: productDocumentId,
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    eoiNo: String((_b = dto.eoiNo) !== null && _b !== void 0 ? _b : '').trim(),
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                    documentFormSubsection: 'products_test_report',
                                    formPrimaryId: id,
                                    documentName: path.basename(storedRelativePath),
                                    documentOriginalName: productsTestReportFile.originalname,
                                    documentLink: storedRelativePath,
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 8:
                            createdDoc = _c.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackCertificationDocumentAfterCreate)({
                                    productModel: this.productModel,
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    doc: createdDoc,
                                    file: productsTestReportFile,
                                })];
                        case 9:
                            _c.sent();
                            _c.label = 10;
                        case 10: return [2 /*return*/, saved];
                        case 11:
                            error_2 = _c.sent();
                            console.error('[Raw Materials Hazardous Products] Create error:', error_2);
                            throw new common_1.InternalServerErrorException(error_2.message || 'Failed to create hazardous product record.');
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        RawMaterialsHazardousProductsService_1.prototype.createDocumentsOnly = function (urnNo, vendorId, files, eoiNo) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, documents, _i, files_1, file, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            documents = [];
                            _i = 0, files_1 = files;
                            _a.label = 1;
                        case 1:
                            if (!(_i < files_1.length)) return [3 /*break*/, 4];
                            file = files_1[_i];
                            return [4 /*yield*/, this.saveDocumentOnly(urnNo.trim(), vendorObjectId, file, String(eoiNo !== null && eoiNo !== void 0 ? eoiNo : '').trim())];
                        case 2:
                            result = _a.sent();
                            documents.push.apply(documents, result.documents);
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, { documentOnly: true, documents: documents }];
                    }
                });
            });
        };
        RawMaterialsHazardousProductsService_1.prototype.countMeaningfulProductsByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!mongoose_1.Types.ObjectId.isValid(vendorId)) {
                                return [2 /*return*/, 0];
                            }
                            return [4 /*yield*/, this.model
                                    .find({
                                    urnNo: urnNo.trim(),
                                    vendorId: new mongoose_1.Types.ObjectId(vendorId),
                                })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, (0, raw_materials_hazardous_display_util_1.filterHazardousProductsForVendorDisplay)(rows).length];
                    }
                });
            });
        };
        RawMaterialsHazardousProductsService_1.prototype.countPersistedByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.countMeaningfulProductsByUrn(urnNo, vendorId)];
                });
            });
        };
        RawMaterialsHazardousProductsService_1.prototype.listByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, rows, plain, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            return [4 /*yield*/, this.model
                                    .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
                                    .sort({ createdDate: 1 })
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            plain = rows.map(function (r) {
                                return typeof r.toObject === 'function' ? r.toObject() : r;
                            });
                            return [2 /*return*/, (0, raw_materials_hazardous_display_util_1.filterHazardousProductsForVendorDisplay)(plain)];
                        case 2:
                            error_3 = _a.sent();
                            console.error('[Raw Materials Hazardous Products] List error:', error_3);
                            throw new common_1.InternalServerErrorException(error_3.message || 'Failed to list hazardous product records.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return RawMaterialsHazardousProductsService_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsHazardousProductsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsHazardousProductsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsHazardousProductsService = _classThis;
}();
exports.RawMaterialsHazardousProductsService = RawMaterialsHazardousProductsService;
