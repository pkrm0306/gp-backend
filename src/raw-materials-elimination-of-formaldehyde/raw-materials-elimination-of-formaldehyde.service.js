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
exports.RawMaterialsEliminationOfFormaldehydeService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var upload_file_util_1 = require("../utils/upload-file.util");
var raw_materials_hazardous_display_util_1 = require("../common/raw-materials/raw-materials-hazardous-display.util");
var form_partial_field_util_1 = require("../common/form-partial-field.util");
var path = require("path");
var upload_file_util_2 = require("../utils/upload-file.util");
var product_document_version_integration_1 = require("../documents/helpers/product-document-version.integration");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var RawMaterialsEliminationOfFormaldehydeService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RawMaterialsEliminationOfFormaldehydeService = _classThis = /** @class */ (function () {
        function RawMaterialsEliminationOfFormaldehydeService_1(model, allProductDocumentModel, productModel, sequenceHelper, documentVersioningService) {
            this.model = model;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.sequenceHelper = sequenceHelper;
            this.documentVersioningService = documentVersioningService;
        }
        RawMaterialsEliminationOfFormaldehydeService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId)
                return id;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        RawMaterialsEliminationOfFormaldehydeService_1.prototype.saveFileToUrnFolder = function (file, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var uploaded;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, upload_file_util_2.uploadFile)(file, "urns/".concat(urnNo))];
                        case 1:
                            uploaded = _a.sent();
                            return [2 /*return*/, { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName }];
                    }
                });
            });
        };
        RawMaterialsEliminationOfFormaldehydeService_1.prototype.deleteAllProductsForUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            return [4 /*yield*/, this.model.deleteMany({ urnNo: urnNo.trim(), vendorId: vendorObjectId })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RawMaterialsEliminationOfFormaldehydeService_1.prototype.parseMeaningfulProducts = function (products) {
            var rows = [];
            for (var _i = 0, _a = products !== null && products !== void 0 ? products : []; _i < _a.length; _i++) {
                var item = _a[_i];
                var n = (0, form_partial_field_util_1.normalizeRawMaterialsProductRow)(item);
                if ((0, form_partial_field_util_1.hasPartialRawMaterialsProductRow)(n)) {
                    rows.push(n);
                }
            }
            return rows;
        };
        RawMaterialsEliminationOfFormaldehydeService_1.prototype.replaceByUrn = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, urnNo, now, meaningful, uploadFiles, inserted, _i, meaningful_1, row, id, doc, keepIds, existingDocs, keepRefs, oldLinks, docsToDelete, _a, existingDocs_1, doc, keep, documents, firstId, i, file, uploaded, productDocumentId, d, _b, oldLinks_1, link, _c;
                var _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(params.vendorId, 'vendorId');
                            urnNo = params.urnNo.trim();
                            now = new Date();
                            meaningful = this.parseMeaningfulProducts(params.products);
                            uploadFiles = (_d = params.uploadedFiles) !== null && _d !== void 0 ? _d : [];
                            return [4 /*yield*/, this.deleteAllProductsForUrn(urnNo, params.vendorId)];
                        case 1:
                            _g.sent();
                            inserted = [];
                            _i = 0, meaningful_1 = meaningful;
                            _g.label = 2;
                        case 2:
                            if (!(_i < meaningful_1.length)) return [3 /*break*/, 6];
                            row = meaningful_1[_i];
                            return [4 /*yield*/, this.sequenceHelper.getRawMaterialsEliminationOfFormaldehydeId()];
                        case 3:
                            id = _g.sent();
                            return [4 /*yield*/, this.model.create({
                                    rawMaterialsEliminationOfFormaldehydeId: id,
                                    urnNo: urnNo,
                                    vendorId: vendorObjectId,
                                    productsName: row.productName,
                                    productsTestReport: row.testReportReference,
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 4:
                            doc = _g.sent();
                            inserted.push(doc);
                            _g.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 2];
                        case 6:
                            keepIds = (_e = params.existingDocumentIds) !== null && _e !== void 0 ? _e : [];
                            return [4 /*yield*/, this.allProductDocumentModel.find({
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
                                    isDeleted: { $ne: true },
                                })];
                        case 7:
                            existingDocs = _g.sent();
                            keepRefs = params.existingDocumentIds !== undefined ? keepIds : null;
                            oldLinks = [];
                            docsToDelete = [];
                            _a = 0, existingDocs_1 = existingDocs;
                            _g.label = 8;
                        case 8:
                            if (!(_a < existingDocs_1.length)) return [3 /*break*/, 11];
                            doc = existingDocs_1[_a];
                            keep = keepRefs === null ||
                                keepIds.includes(String(doc.productDocumentId)) ||
                                keepIds.includes(String(doc._id));
                            if (!!keep) return [3 /*break*/, 10];
                            docsToDelete.push(doc);
                            if (doc.documentLink)
                                oldLinks.push(doc.documentLink);
                            doc.isDeleted = true;
                            doc.deletedAt = now;
                            doc.deletedBy = vendorObjectId;
                            doc.updatedDate = now;
                            return [4 /*yield*/, doc.save()];
                        case 9:
                            _g.sent();
                            _g.label = 10;
                        case 10:
                            _a++;
                            return [3 /*break*/, 8];
                        case 11:
                            if (!docsToDelete.length) return [3 /*break*/, 13];
                            return [4 /*yield*/, (0, product_document_version_integration_1.trackProductDocumentDeleteBatch)({
                                    versioning: this.documentVersioningService,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
                                    userId: vendorObjectId,
                                    docs: docsToDelete,
                                    slotKeyMode: 'subsection',
                                })];
                        case 12:
                            _g.sent();
                            _g.label = 13;
                        case 13:
                            documents = [];
                            firstId = (_f = inserted[0]) === null || _f === void 0 ? void 0 : _f.rawMaterialsEliminationOfFormaldehydeId;
                            i = 0;
                            _g.label = 14;
                        case 14:
                            if (!(i < uploadFiles.length)) return [3 /*break*/, 20];
                            file = uploadFiles[i];
                            return [4 /*yield*/, this.saveFileToUrnFolder(file, urnNo)];
                        case 15:
                            uploaded = _g.sent();
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 16:
                            productDocumentId = _g.sent();
                            return [4 /*yield*/, this.allProductDocumentModel.create({
                                    productDocumentId: productDocumentId,
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    eoiNo: '',
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
                                    documentFormSubsection: 'supporting_documents',
                                    formPrimaryId: i === 0 && firstId ? firstId : productDocumentId,
                                    documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
                                    documentOriginalName: file.originalname,
                                    documentLink: uploaded.fileUrl,
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 17:
                            d = _g.sent();
                            documents.push(d);
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackCertificationDocumentAfterCreate)({
                                    productModel: this.productModel,
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    doc: d,
                                    file: file,
                                })];
                        case 18:
                            _g.sent();
                            _g.label = 19;
                        case 19:
                            i++;
                            return [3 /*break*/, 14];
                        case 20:
                            _b = 0, oldLinks_1 = oldLinks;
                            _g.label = 21;
                        case 21:
                            if (!(_b < oldLinks_1.length)) return [3 /*break*/, 26];
                            link = oldLinks_1[_b];
                            _g.label = 22;
                        case 22:
                            _g.trys.push([22, 24, , 25]);
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(link)];
                        case 23:
                            _g.sent();
                            return [3 /*break*/, 25];
                        case 24:
                            _c = _g.sent();
                            return [3 /*break*/, 25];
                        case 25:
                            _b++;
                            return [3 /*break*/, 21];
                        case 26: return [2 /*return*/, {
                                urnNo: urnNo,
                                vendorId: vendorObjectId.toString(),
                                products: (0, raw_materials_hazardous_display_util_1.filterFormaldehydeStyleProductsForVendorDisplay)(inserted.map(function (r) {
                                    return typeof r.toObject === 'function' ? r.toObject() : r;
                                })),
                                documents: documents,
                            }];
                    }
                });
            });
        };
        /** File-only: documents only — no formaldehyde product row. */
        RawMaterialsEliminationOfFormaldehydeService_1.prototype.saveDocumentOnly = function (urnNo, vendorObjectId, file) {
            return __awaiter(this, void 0, void 0, function () {
                var now, uploaded, productDocumentId, doc;
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
                                    eoiNo: '',
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
                                    documentFormSubsection: 'supporting_documents',
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
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    doc: doc,
                                    file: file,
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { documentOnly: true, documents: [doc] }];
                    }
                });
            });
        };
        RawMaterialsEliminationOfFormaldehydeService_1.prototype.create = function (dto, vendorId, formaldehydeFile, options) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, urnNo, productRow, hasProductText, id, now, doc, saved, uploaded, productDocumentId, createdDoc, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 10, , 11]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            urnNo = dto.urnNo.trim();
                            productRow = (0, form_partial_field_util_1.normalizeRawMaterialsProductRow)({
                                productsName: dto.productsName,
                                productsTestReport: dto.productsTestReport,
                            });
                            hasProductText = (0, form_partial_field_util_1.hasPartialRawMaterialsProductRow)(productRow);
                            if (!(options === null || options === void 0 ? void 0 : options.replaceTableBeforeInsert)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.deleteAllProductsForUrn(urnNo, vendorId)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!hasProductText && formaldehydeFile) {
                                return [2 /*return*/, this.saveDocumentOnly(urnNo, vendorObjectId, formaldehydeFile)];
                            }
                            if (!hasProductText) {
                                return [2 /*return*/, { skipped: true }];
                            }
                            return [4 /*yield*/, this.sequenceHelper.getRawMaterialsEliminationOfFormaldehydeId()];
                        case 3:
                            id = _a.sent();
                            now = new Date();
                            doc = new this.model({
                                rawMaterialsEliminationOfFormaldehydeId: id,
                                urnNo: urnNo,
                                vendorId: vendorObjectId,
                                productsName: productRow.productName,
                                productsTestReport: productRow.testReportReference,
                                createdDate: now,
                                updatedDate: now,
                            });
                            return [4 /*yield*/, doc.save()];
                        case 4:
                            saved = _a.sent();
                            if (!formaldehydeFile) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.saveFileToUrnFolder(formaldehydeFile, urnNo)];
                        case 5:
                            uploaded = _a.sent();
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 6:
                            productDocumentId = _a.sent();
                            return [4 /*yield*/, this.allProductDocumentModel.create({
                                    productDocumentId: productDocumentId,
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    eoiNo: '',
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
                                    documentFormSubsection: 'supporting_documents',
                                    formPrimaryId: id,
                                    documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
                                    documentOriginalName: formaldehydeFile.originalname,
                                    documentLink: uploaded.fileUrl,
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 7:
                            createdDoc = _a.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackCertificationDocumentAfterCreate)({
                                    productModel: this.productModel,
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    doc: createdDoc,
                                    file: formaldehydeFile,
                                })];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9: return [2 /*return*/, saved];
                        case 10:
                            error_1 = _a.sent();
                            console.error('[Raw Materials Elimination Of Formaldehyde] Create error:', error_1);
                            if (error_1 instanceof common_1.BadRequestException) {
                                throw error_1;
                            }
                            throw new common_1.InternalServerErrorException(error_1.message ||
                                'Failed to create raw materials elimination of formaldehyde record.');
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        RawMaterialsEliminationOfFormaldehydeService_1.prototype.countMeaningfulProductsByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, raw_materials_hazardous_display_util_1.countMeaningfulRawMaterialsProductRows)(this.model, urnNo, vendorId)];
                });
            });
        };
        RawMaterialsEliminationOfFormaldehydeService_1.prototype.countPersistedByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.countMeaningfulProductsByUrn(urnNo, vendorId)];
                });
            });
        };
        RawMaterialsEliminationOfFormaldehydeService_1.prototype.listByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, rows, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            return [4 /*yield*/, this.model
                                    .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
                                    .sort({ createdDate: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, (0, raw_materials_hazardous_display_util_1.filterFormaldehydeStyleProductsForVendorDisplay)(rows)];
                        case 2:
                            error_2 = _a.sent();
                            console.error('[Raw Materials Elimination Of Formaldehyde] List error:', error_2);
                            if (error_2 instanceof common_1.BadRequestException) {
                                throw error_2;
                            }
                            throw new common_1.InternalServerErrorException(error_2.message ||
                                'Failed to list raw materials elimination of formaldehyde records.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return RawMaterialsEliminationOfFormaldehydeService_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsEliminationOfFormaldehydeService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsEliminationOfFormaldehydeService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsEliminationOfFormaldehydeService = _classThis;
}();
exports.RawMaterialsEliminationOfFormaldehydeService = RawMaterialsEliminationOfFormaldehydeService;
