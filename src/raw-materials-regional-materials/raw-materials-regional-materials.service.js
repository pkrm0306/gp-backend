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
exports.RawMaterialsRegionalMaterialsService = void 0;
var common_1 = require("@nestjs/common");
var raw_materials_upload_util_1 = require("../common/raw-materials/raw-materials-upload.util");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var path = require("path");
var upload_file_util_1 = require("../utils/upload-file.util");
var product_document_version_integration_1 = require("../documents/helpers/product-document-version.integration");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var raw_materials_upload_util_2 = require("../common/raw-materials/raw-materials-upload.util");
var REGIONAL_UNIT_KEYS = [
    'unitName',
    'year',
    'unit1',
    'yeardata1',
    'unit2',
    'yeardata2',
];
var RawMaterialsRegionalMaterialsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RawMaterialsRegionalMaterialsService = _classThis = /** @class */ (function () {
        function RawMaterialsRegionalMaterialsService_1(model, allProductDocumentModel, productModel, sequenceHelper, documentVersioningService) {
            this.model = model;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.sequenceHelper = sequenceHelper;
            this.documentVersioningService = documentVersioningService;
        }
        RawMaterialsRegionalMaterialsService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId)
                return id;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        RawMaterialsRegionalMaterialsService_1.prototype.roundToTwo = function (value) {
            return Math.round(value * 100) / 100;
        };
        RawMaterialsRegionalMaterialsService_1.prototype.saveFileToUrnFolder = function (file, urnNo) {
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
        RawMaterialsRegionalMaterialsService_1.prototype.syncDocuments = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, vendorObjectId, formPrimaryId, uploadFiles, existingDocumentIds, now, existingDocs, keepRefs, oldLinks, docsToDelete, _i, existingDocs_1, doc, keep, documents, i, file, uploaded, productDocumentId, masterDoc, _a, oldLinks_1, link, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            urnNo = params.urnNo, vendorObjectId = params.vendorObjectId, formPrimaryId = params.formPrimaryId, uploadFiles = params.uploadFiles, existingDocumentIds = params.existingDocumentIds;
                            now = new Date();
                            return [4 /*yield*/, this.allProductDocumentModel.find({
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
                                    isDeleted: { $ne: true },
                                })];
                        case 1:
                            existingDocs = _c.sent();
                            keepRefs = existingDocumentIds !== undefined ? existingDocumentIds : null;
                            oldLinks = [];
                            docsToDelete = [];
                            if (!(keepRefs !== null)) return [3 /*break*/, 7];
                            _i = 0, existingDocs_1 = existingDocs;
                            _c.label = 2;
                        case 2:
                            if (!(_i < existingDocs_1.length)) return [3 /*break*/, 5];
                            doc = existingDocs_1[_i];
                            keep = keepRefs.includes(String(doc.productDocumentId)) ||
                                keepRefs.includes(String(doc._id));
                            if (!!keep) return [3 /*break*/, 4];
                            docsToDelete.push(doc);
                            if (doc.documentLink) {
                                oldLinks.push(doc.documentLink);
                            }
                            doc.isDeleted = true;
                            doc.deletedAt = now;
                            doc.deletedBy = vendorObjectId;
                            doc.updatedDate = now;
                            return [4 /*yield*/, doc.save()];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                            if (!docsToDelete.length) return [3 /*break*/, 7];
                            return [4 /*yield*/, (0, product_document_version_integration_1.trackProductDocumentDeleteBatch)({
                                    versioning: this.documentVersioningService,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
                                    userId: vendorObjectId,
                                    docs: docsToDelete,
                                    slotKeyMode: 'subsection',
                                })];
                        case 6:
                            _c.sent();
                            _c.label = 7;
                        case 7:
                            documents = [];
                            i = 0;
                            _c.label = 8;
                        case 8:
                            if (!(i < uploadFiles.length)) return [3 /*break*/, 14];
                            file = uploadFiles[i];
                            return [4 /*yield*/, this.saveFileToUrnFolder(file, urnNo)];
                        case 9:
                            uploaded = _c.sent();
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 10:
                            productDocumentId = _c.sent();
                            return [4 /*yield*/, this.allProductDocumentModel.create({
                                    productDocumentId: productDocumentId,
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    eoiNo: '',
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
                                    documentFormSubsection: 'supporting_documents',
                                    formPrimaryId: i === 0 ? formPrimaryId : productDocumentId,
                                    documentName: uploaded.fileName || path.basename(uploaded.fileUrl),
                                    documentOriginalName: file.originalname,
                                    documentLink: uploaded.fileUrl,
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 11:
                            masterDoc = _c.sent();
                            documents.push(this.mapProductDocument(masterDoc));
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackCertificationDocumentAfterCreate)({
                                    productModel: this.productModel,
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    doc: masterDoc,
                                    file: file,
                                })];
                        case 12:
                            _c.sent();
                            _c.label = 13;
                        case 13:
                            i++;
                            return [3 /*break*/, 8];
                        case 14:
                            _a = 0, oldLinks_1 = oldLinks;
                            _c.label = 15;
                        case 15:
                            if (!(_a < oldLinks_1.length)) return [3 /*break*/, 20];
                            link = oldLinks_1[_a];
                            _c.label = 16;
                        case 16:
                            _c.trys.push([16, 18, , 19]);
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(link)];
                        case 17:
                            _c.sent();
                            return [3 /*break*/, 19];
                        case 18:
                            _b = _c.sent();
                            return [3 /*break*/, 19];
                        case 19:
                            _a++;
                            return [3 /*break*/, 15];
                        case 20: return [2 /*return*/, documents];
                    }
                });
            });
        };
        RawMaterialsRegionalMaterialsService_1.prototype.listDocumentsForUrn = function (urnNo, vendorObjectId) {
            return __awaiter(this, void 0, void 0, function () {
                var docRows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.allProductDocumentModel
                                .find({
                                urnNo: urnNo.trim(),
                                vendorId: vendorObjectId,
                                documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
                                $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
                            })
                                .sort({ productDocumentId: -1 })
                                .exec()];
                        case 1:
                            docRows = _a.sent();
                            return [2 /*return*/, docRows.map(function (d) { return _this.mapProductDocument(d); })];
                    }
                });
            });
        };
        RawMaterialsRegionalMaterialsService_1.prototype.toResponseUnit = function (row) {
            return (0, raw_materials_upload_util_2.withRawMaterialsNumericFields)({
                rawMaterialsRegionalMaterialsId: row.rawMaterialsRegionalMaterialsId,
                unitName: row.unitName,
                year: row.year,
                unit1: row.unit1,
                yeardata1: row.yeardata1,
                unit2: row.unit2,
                yeardata2: row.yeardata2,
                yeardata3: row.yeardata3 === undefined || row.yeardata3 === null
                    ? null
                    : this.roundToTwo(Number(row.yeardata3)),
            }, raw_materials_upload_util_2.RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS);
        };
        RawMaterialsRegionalMaterialsService_1.prototype.mapProductDocument = function (d) {
            var o = typeof d.toObject === 'function' ? d.toObject() : d;
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
        RawMaterialsRegionalMaterialsService_1.prototype.create = function (dto, vendorId, options) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, urnNo, now, docsToCreate, meaningfulUnits, _i, meaningfulUnits_1, unit, mapped, id, created, uploadFiles, formPrimaryId, _a, documents, error_1;
                var _this = this;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 13, , 14]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            urnNo = dto.urnNo.trim();
                            now = new Date();
                            docsToCreate = [];
                            meaningfulUnits = (0, raw_materials_upload_util_2.filterMeaningfulRows)(((_b = dto.units) !== null && _b !== void 0 ? _b : []), REGIONAL_UNIT_KEYS);
                            (0, raw_materials_upload_util_2.assertUnitYearFieldsPositive)(meaningfulUnits);
                            _i = 0, meaningfulUnits_1 = meaningfulUnits;
                            _f.label = 1;
                        case 1:
                            if (!(_i < meaningfulUnits_1.length)) return [3 /*break*/, 4];
                            unit = meaningfulUnits_1[_i];
                            mapped = (0, raw_materials_upload_util_2.mapRawMaterialsStandardGridUnitForSave)(unit);
                            return [4 /*yield*/, this.sequenceHelper.getRawMaterialsRegionalMaterialsId()];
                        case 2:
                            id = _f.sent();
                            docsToCreate.push(__assign(__assign({ rawMaterialsRegionalMaterialsId: id, urnNo: urnNo, vendorId: vendorObjectId }, mapped), { createdDate: now, updatedDate: now }));
                            _f.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: 
                        // Replace behavior: keep only the units coming in current request for this URN+vendor.
                        return [4 /*yield*/, this.model.deleteMany({ urnNo: urnNo, vendorId: vendorObjectId })];
                        case 5:
                            // Replace behavior: keep only the units coming in current request for this URN+vendor.
                            _f.sent();
                            return [4 /*yield*/, this.model.insertMany(docsToCreate)];
                        case 6:
                            created = _f.sent();
                            uploadFiles = (_c = options === null || options === void 0 ? void 0 : options.uploadFiles) !== null && _c !== void 0 ? _c : [];
                            if (!(uploadFiles.length > 0 || (options === null || options === void 0 ? void 0 : options.existingDocumentIds) !== undefined)) return [3 /*break*/, 11];
                            if (!((_e = (_d = created[0]) === null || _d === void 0 ? void 0 : _d.rawMaterialsRegionalMaterialsId) !== null && _e !== void 0)) return [3 /*break*/, 7];
                            _a = _e;
                            return [3 /*break*/, 9];
                        case 7: return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 8:
                            _a = (_f.sent());
                            _f.label = 9;
                        case 9:
                            formPrimaryId = _a;
                            return [4 /*yield*/, this.syncDocuments({
                                    urnNo: urnNo,
                                    vendorObjectId: vendorObjectId,
                                    formPrimaryId: formPrimaryId,
                                    uploadFiles: uploadFiles,
                                    existingDocumentIds: options === null || options === void 0 ? void 0 : options.existingDocumentIds,
                                })];
                        case 10:
                            _f.sent();
                            _f.label = 11;
                        case 11: return [4 /*yield*/, this.listDocumentsForUrn(urnNo, vendorObjectId)];
                        case 12:
                            documents = _f.sent();
                            return [2 /*return*/, {
                                    urnNo: urnNo,
                                    vendorId: vendorObjectId.toString(),
                                    units: created.map(function (row) { return _this.toResponseUnit(row.toObject()); }),
                                    documents: documents,
                                }];
                        case 13:
                            error_1 = _f.sent();
                            console.error('[Raw Materials Regional Materials] Create error:', error_1);
                            if (error_1 instanceof common_1.BadRequestException) {
                                throw error_1;
                            }
                            throw new common_1.InternalServerErrorException(error_1.message ||
                                'Failed to create raw materials regional materials record.');
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        RawMaterialsRegionalMaterialsService_1.prototype.countPersistedByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, raw_materials_upload_util_1.countVendorUrnDocuments)(this.model, urnNo, vendorId)];
                });
            });
        };
        RawMaterialsRegionalMaterialsService_1.prototype.listByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, trimmedUrn, rows, error_2;
                var _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.model
                                    .find({ urnNo: trimmedUrn, vendorId: vendorObjectId })
                                    .sort({ rawMaterialsRegionalMaterialsId: 1 })
                                    .exec()];
                        case 1:
                            rows = _b.sent();
                            _a = {
                                urnNo: trimmedUrn,
                                vendorId: vendorObjectId.toString(),
                                units: rows.map(function (row) { return _this.toResponseUnit(row.toObject()); })
                            };
                            return [4 /*yield*/, this.listDocumentsForUrn(trimmedUrn, vendorObjectId)];
                        case 2: return [2 /*return*/, (_a.documents = _b.sent(),
                                _a)];
                        case 3:
                            error_2 = _b.sent();
                            console.error('[Raw Materials Regional Materials] List error:', error_2);
                            if (error_2 instanceof common_1.BadRequestException) {
                                throw error_2;
                            }
                            throw new common_1.InternalServerErrorException(error_2.message ||
                                'Failed to list raw materials regional materials records.');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return RawMaterialsRegionalMaterialsService_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsRegionalMaterialsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsRegionalMaterialsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsRegionalMaterialsService = _classThis;
}();
exports.RawMaterialsRegionalMaterialsService = RawMaterialsRegionalMaterialsService;
