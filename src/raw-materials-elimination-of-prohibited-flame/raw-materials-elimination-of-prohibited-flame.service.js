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
exports.RawMaterialsEliminationOfProhibitedFlameService = void 0;
var common_1 = require("@nestjs/common");
var raw_materials_upload_util_1 = require("../common/raw-materials/raw-materials-upload.util");
var raw_materials_single_record_replace_util_1 = require("../common/raw-materials/raw-materials-single-record-replace.util");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var path = require("path");
var upload_file_util_1 = require("../utils/upload-file.util");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var RawMaterialsEliminationOfProhibitedFlameService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RawMaterialsEliminationOfProhibitedFlameService = _classThis = /** @class */ (function () {
        function RawMaterialsEliminationOfProhibitedFlameService_1(model, allProductDocumentModel, productModel, sequenceHelper, documentVersioningService) {
            this.model = model;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.sequenceHelper = sequenceHelper;
            this.documentVersioningService = documentVersioningService;
        }
        RawMaterialsEliminationOfProhibitedFlameService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId)
                return id;
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        RawMaterialsEliminationOfProhibitedFlameService_1.prototype.saveFileToUrnFolder = function (file, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, "urns/".concat(urnNo))];
                        case 1: return [2 /*return*/, (_a.sent()).fileUrl];
                    }
                });
            });
        };
        RawMaterialsEliminationOfProhibitedFlameService_1.prototype.create = function (dto, vendorId, prohibitedFlameFile) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, urnNo, now, measuresImplemented, hasText, formPrimaryId, saved, id, storedRelativePath, productDocumentId, createdDoc, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 11, , 12]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            urnNo = dto.urnNo.trim();
                            now = new Date();
                            measuresImplemented = ((_a = dto.measuresImplemented) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                            hasText = (0, raw_materials_upload_util_1.hasAnyTrimmedText)(measuresImplemented);
                            formPrimaryId = 0;
                            saved = null;
                            if (!hasText) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.sequenceHelper.getRawMaterialsEliminationOfProhibitedFlameId()];
                        case 1:
                            id = _b.sent();
                            formPrimaryId = id;
                            return [4 /*yield*/, (0, raw_materials_single_record_replace_util_1.replaceSingleRecordForUrn)(this.model, urnNo, vendorObjectId, {
                                    rawMaterialsEliminationOfProhibitedFlameId: id,
                                    urnNo: urnNo,
                                    vendorId: vendorObjectId,
                                    measuresImplemented: measuresImplemented,
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 2:
                            saved = _b.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.model.deleteMany({ urnNo: urnNo, vendorId: vendorObjectId })];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            if (!prohibitedFlameFile) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.saveFileToUrnFolder(prohibitedFlameFile, urnNo)];
                        case 6:
                            storedRelativePath = _b.sent();
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 7:
                            productDocumentId = _b.sent();
                            return [4 /*yield*/, this.allProductDocumentModel.create({
                                    productDocumentId: productDocumentId,
                                    vendorId: vendorObjectId,
                                    urnNo: urnNo,
                                    eoiNo: '',
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
                                    documentFormSubsection: 'supporting_documents',
                                    formPrimaryId: formPrimaryId || productDocumentId,
                                    documentName: path.basename(storedRelativePath),
                                    documentOriginalName: prohibitedFlameFile.originalname,
                                    documentLink: storedRelativePath,
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 8:
                            createdDoc = _b.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackCertificationDocumentAfterCreate)({
                                    productModel: this.productModel,
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    doc: createdDoc,
                                    file: prohibitedFlameFile,
                                })];
                        case 9:
                            _b.sent();
                            _b.label = 10;
                        case 10: return [2 /*return*/, saved];
                        case 11:
                            error_1 = _b.sent();
                            console.error('[Raw Materials Elimination Of Prohibited Flame] Create error:', error_1);
                            if (error_1 instanceof common_1.BadRequestException) {
                                throw error_1;
                            }
                            throw new common_1.InternalServerErrorException(error_1.message ||
                                'Failed to create raw materials elimination of prohibited flame record.');
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        RawMaterialsEliminationOfProhibitedFlameService_1.prototype.countPersistedByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!mongoose_1.Types.ObjectId.isValid(vendorId)) {
                                return [2 /*return*/, 0];
                            }
                            return [4 /*yield*/, this.model
                                    .countDocuments({
                                    urnNo: urnNo.trim(),
                                    vendorId: new mongoose_1.Types.ObjectId(vendorId),
                                })
                                    .exec()];
                        case 1:
                            count = _a.sent();
                            if (count > 0) {
                                return [2 /*return*/, count];
                            }
                            return [2 /*return*/, this.allProductDocumentModel
                                    .countDocuments({
                                    urnNo: urnNo.trim(),
                                    vendorId: new mongoose_1.Types.ObjectId(vendorId),
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
                                    isDeleted: { $ne: true },
                                })
                                    .exec()];
                    }
                });
            });
        };
        RawMaterialsEliminationOfProhibitedFlameService_1.prototype.listByUrn = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            return [4 /*yield*/, this.model
                                    .find({ urnNo: urnNo.trim(), vendorId: vendorObjectId })
                                    .sort({ createdDate: 1 })
                                    .exec()];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_2 = _a.sent();
                            console.error('[Raw Materials Elimination Of Prohibited Flame] List error:', error_2);
                            if (error_2 instanceof common_1.BadRequestException) {
                                throw error_2;
                            }
                            throw new common_1.InternalServerErrorException(error_2.message ||
                                'Failed to list raw materials elimination of prohibited flame records.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return RawMaterialsEliminationOfProhibitedFlameService_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsEliminationOfProhibitedFlameService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsEliminationOfProhibitedFlameService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsEliminationOfProhibitedFlameService = _classThis;
}();
exports.RawMaterialsEliminationOfProhibitedFlameService = RawMaterialsEliminationOfProhibitedFlameService;
