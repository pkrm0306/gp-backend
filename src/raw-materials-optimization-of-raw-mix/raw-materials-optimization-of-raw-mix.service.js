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
exports.RawMaterialsOptimizationOfRawMixService = void 0;
var common_1 = require("@nestjs/common");
var raw_materials_upload_util_1 = require("../common/raw-materials/raw-materials-upload.util");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var path = require("path");
var upload_file_util_1 = require("../utils/upload-file.util");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var raw_materials_upload_util_2 = require("../common/raw-materials/raw-materials-upload.util");
var RAW_MIX_UNIT_KEYS = [
    'unitName',
    'year',
    'yeardata1',
    'yeardata2',
    'yeardata3',
];
var RawMaterialsOptimizationOfRawMixService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RawMaterialsOptimizationOfRawMixService = _classThis = /** @class */ (function () {
        function RawMaterialsOptimizationOfRawMixService_1(model, allProductDocumentModel, productModel, sequenceHelper, documentVersioningService) {
            this.model = model;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.sequenceHelper = sequenceHelper;
            this.documentVersioningService = documentVersioningService;
        }
        RawMaterialsOptimizationOfRawMixService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId)
                return id;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        RawMaterialsOptimizationOfRawMixService_1.prototype.saveFileToUrnFolder = function (file, urnNo, fileType) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, "urns/".concat(urnNo))];
                        case 1: return [2 /*return*/, (_a.sent()).fileUrl];
                    }
                });
            });
        };
        RawMaterialsOptimizationOfRawMixService_1.prototype.toResponseUnit = function (row) {
            var numericNormalized = (0, raw_materials_upload_util_2.withRawMaterialsNumericFields)({
                year: row.year,
                yeardata1: row.yeardata1,
                yeardata2: row.yeardata2,
                yeardata3: row.yeardata3,
            }, raw_materials_upload_util_2.RAW_MATERIALS_MANUFACTURING_UNIT_NUMERIC_KEYS);
            var asVendorDisplay = function (value) {
                if (value === null || value === undefined || value === '')
                    return null;
                var n = Number(value);
                if (!Number.isFinite(n))
                    return null;
                return n === 0 ? '0' : n;
            };
            return {
                rawMaterialsOptimizationOfRawMixId: row.rawMaterialsOptimizationOfRawMixId,
                unitName: row.unitName,
                year: asVendorDisplay(numericNormalized.year),
                yeardata1: asVendorDisplay(numericNormalized.yeardata1),
                yeardata2: asVendorDisplay(numericNormalized.yeardata2),
                yeardata3: asVendorDisplay(numericNormalized.yeardata3),
            };
        };
        RawMaterialsOptimizationOfRawMixService_1.prototype.mapProductDocument = function (d) {
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
        RawMaterialsOptimizationOfRawMixService_1.prototype.create = function (dto, vendorId, optimizationOfRawMixFile) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, urnNo, now, docsToCreate, meaningfulUnits, _i, meaningfulUnits_1, unit, id, mapped, created, documents, storedRelativePath, productDocumentId, masterDoc, error_1;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 12, , 13]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            urnNo = dto.urnNo.trim();
                            now = new Date();
                            docsToCreate = [];
                            meaningfulUnits = (0, raw_materials_upload_util_2.filterMeaningfulRows)(((_a = dto.units) !== null && _a !== void 0 ? _a : []), RAW_MIX_UNIT_KEYS);
                            (0, raw_materials_upload_util_2.assertUnitYearFieldsPositive)(meaningfulUnits);
                            _i = 0, meaningfulUnits_1 = meaningfulUnits;
                            _d.label = 1;
                        case 1:
                            if (!(_i < meaningfulUnits_1.length)) return [3 /*break*/, 4];
                            unit = meaningfulUnits_1[_i];
                            return [4 /*yield*/, this.sequenceHelper.getRawMaterialsOptimizationOfRawMixId()];
                        case 2:
                            id = _d.sent();
                            mapped = (0, raw_materials_upload_util_2.mapRawMaterialsManufacturingUnitForSave)(unit);
                            docsToCreate.push(__assign(__assign({ rawMaterialsOptimizationOfRawMixId: id, urnNo: urnNo, vendorId: vendorObjectId }, mapped), { createdDate: now, updatedDate: now }));
                            _d.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: 
                        // Replace behavior: keep only the units coming in current request for this URN+vendor.
                        return [4 /*yield*/, this.model.deleteMany({ urnNo: urnNo, vendorId: vendorObjectId })];
                        case 5:
                            // Replace behavior: keep only the units coming in current request for this URN+vendor.
                            _d.sent();
                            return [4 /*yield*/, this.model.insertMany(docsToCreate)];
                        case 6:
                            created = _d.sent();
                            documents = [];
                            if (!optimizationOfRawMixFile) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.saveFileToUrnFolder(optimizationOfRawMixFile, urnNo, 'raw_mix_optimization_supporting_document')];
                        case 7:
                            storedRelativePath = _d.sent();
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 8:
                            productDocumentId = _d.sent();
                            return [4 /*yield*/, this.allProductDocumentModel.create({
                                    productDocumentId: productDocumentId,
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    eoiNo: '',
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION,
                                    documentFormSubsection: 'supporting_documents',
                                    formPrimaryId: (_c = (_b = created[0]) === null || _b === void 0 ? void 0 : _b.rawMaterialsOptimizationOfRawMixId) !== null && _c !== void 0 ? _c : productDocumentId,
                                    documentName: path.basename(storedRelativePath),
                                    documentOriginalName: optimizationOfRawMixFile.originalname,
                                    documentLink: storedRelativePath,
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 9:
                            masterDoc = _d.sent();
                            documents.push(this.mapProductDocument(masterDoc));
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackCertificationDocumentAfterCreate)({
                                    productModel: this.productModel,
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    doc: masterDoc,
                                    file: optimizationOfRawMixFile,
                                })];
                        case 10:
                            _d.sent();
                            _d.label = 11;
                        case 11: return [2 /*return*/, {
                                urnNo: urnNo,
                                vendorId: vendorObjectId.toString(),
                                units: created.map(function (row) { return _this.toResponseUnit(row.toObject()); }),
                                documents: documents,
                            }];
                        case 12:
                            error_1 = _d.sent();
                            console.error('[Raw Materials Optimization Of Raw Mix] Create error:', error_1);
                            if (error_1 instanceof common_1.BadRequestException) {
                                throw error_1;
                            }
                            throw new common_1.InternalServerErrorException(error_1.message ||
                                'Failed to create raw materials optimization of raw mix record.');
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        RawMaterialsOptimizationOfRawMixService_1.prototype.countPersistedByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, raw_materials_upload_util_1.countVendorUrnDocuments)(this.model, urnNo, vendorId)];
                });
            });
        };
        RawMaterialsOptimizationOfRawMixService_1.prototype.listByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, trimmedUrn, rows, docRows, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.model
                                    .find({ urnNo: trimmedUrn, vendorId: vendorObjectId })
                                    .sort({ rawMaterialsOptimizationOfRawMixId: 1 })
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .find({
                                    urnNo: trimmedUrn,
                                    vendorId: vendorObjectId,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION,
                                    $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
                                })
                                    .sort({ productDocumentId: -1 })
                                    .exec()];
                        case 2:
                            docRows = _a.sent();
                            return [2 /*return*/, {
                                    urnNo: trimmedUrn,
                                    vendorId: vendorObjectId.toString(),
                                    units: rows.map(function (row) { return _this.toResponseUnit(row.toObject()); }),
                                    documents: docRows.map(function (d) { return _this.mapProductDocument(d); }),
                                }];
                        case 3:
                            error_2 = _a.sent();
                            console.error('[Raw Materials Optimization Of Raw Mix] List error:', error_2);
                            if (error_2 instanceof common_1.BadRequestException) {
                                throw error_2;
                            }
                            throw new common_1.InternalServerErrorException(error_2.message ||
                                'Failed to list raw materials optimization of raw mix records.');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return RawMaterialsOptimizationOfRawMixService_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsOptimizationOfRawMixService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsOptimizationOfRawMixService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsOptimizationOfRawMixService = _classThis;
}();
exports.RawMaterialsOptimizationOfRawMixService = RawMaterialsOptimizationOfRawMixService;
