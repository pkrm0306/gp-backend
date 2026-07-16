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
exports.ProcessInnovationService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var fs = require("fs");
var path = require("path");
var upload_file_util_1 = require("../utils/upload-file.util");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var vendor_urn_edit_util_1 = require("../common/vendor/vendor-urn-edit.util");
var ProcessInnovationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessInnovationService = _classThis = /** @class */ (function () {
        function ProcessInnovationService_1(processInnovationModel, allProductDocumentModel, productModel, connection, sequenceHelper, documentUploadNotification, documentVersioningService) {
            this.processInnovationModel = processInnovationModel;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentUploadNotification = documentUploadNotification;
            this.documentVersioningService = documentVersioningService;
        }
        ProcessInnovationService_1.prototype.onModuleInit = function () {
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
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.processInnovationModel.syncIndexes()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error('[process-innovation] syncIndexes failed (check duplicates):', error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Safely convert string to ObjectId with validation
         */
        ProcessInnovationService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        ProcessInnovationService_1.prototype.saveFileToUrnFolder = function (file, urnNo, fileType) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, "urns/".concat(urnNo))];
                        case 1: return [2 /*return*/, (_a.sent()).fileUrl];
                    }
                });
            });
        };
        /**
         * Create process innovation with file upload
         */
        ProcessInnovationService_1.prototype.createProcessInnovation = function (createProcessInnovationDto, vendorId, innovationImplementationDocumentsFiles, innovationDocumentTags) {
            return __awaiter(this, void 0, void 0, function () {
                var session, createdFileFullPaths, vendorObjectId, now, existingInnovation, processInnovationId, _a, uploadedInnovationFiles, innovationImplementationDocuments, innovationImplementationDocumentsFilePaths, _i, uploadedInnovationFiles_1, innovationImplementationDocumentsFile, innovationImplementationDocumentsFilePath, INNOVATION_DOCS_SUBSECTION, processInnovationData, savedProcessInnovation, tags, docsToInsert, isResubmitCycle, i, tag, productDocumentId, insertedDocs, error_2, isUrnDuplicate, vendorObjectId, now, recovered, _b, createdFileFullPaths_1, fullPath;
                var _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0: return [4 /*yield*/, (0, vendor_urn_edit_util_1.assertVendorCanEditUrn)(this.productModel, vendorId, createProcessInnovationDto.urnNo)];
                        case 1:
                            _h.sent();
                            return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            session = _h.sent();
                            session.startTransaction();
                            createdFileFullPaths = [];
                            _h.label = 3;
                        case 3:
                            _h.trys.push([3, 23, , 27]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            now = new Date();
                            return [4 /*yield*/, this.processInnovationModel
                                    .findOne({ urnNo: createProcessInnovationDto.urnNo })
                                    .session(session)];
                        case 4:
                            existingInnovation = _h.sent();
                            if (!((_c = existingInnovation === null || existingInnovation === void 0 ? void 0 : existingInnovation.processInnovationId) !== null && _c !== void 0)) return [3 /*break*/, 5];
                            _a = _c;
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.sequenceHelper.getProcessInnovationId()];
                        case 6:
                            _a = (_h.sent());
                            _h.label = 7;
                        case 7:
                            processInnovationId = _a;
                            uploadedInnovationFiles = Array.isArray(innovationImplementationDocumentsFiles)
                                ? innovationImplementationDocumentsFiles
                                : [];
                            innovationImplementationDocuments = (_d = existingInnovation === null || existingInnovation === void 0 ? void 0 : existingInnovation.innovationImplementationDocuments) !== null && _d !== void 0 ? _d : 0;
                            innovationImplementationDocumentsFilePaths = [];
                            if (!(uploadedInnovationFiles.length > 0)) return [3 /*break*/, 12];
                            _i = 0, uploadedInnovationFiles_1 = uploadedInnovationFiles;
                            _h.label = 8;
                        case 8:
                            if (!(_i < uploadedInnovationFiles_1.length)) return [3 /*break*/, 11];
                            innovationImplementationDocumentsFile = uploadedInnovationFiles_1[_i];
                            return [4 /*yield*/, this.saveFileToUrnFolder(innovationImplementationDocumentsFile, createProcessInnovationDto.urnNo, 'innovation_implementation')];
                        case 9:
                            innovationImplementationDocumentsFilePath = _h.sent();
                            innovationImplementationDocumentsFilePaths.push(innovationImplementationDocumentsFilePath);
                            createdFileFullPaths.push(path.join('uploads', innovationImplementationDocumentsFilePath));
                            _h.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 8];
                        case 11:
                            innovationImplementationDocuments = 1;
                            _h.label = 12;
                        case 12:
                            INNOVATION_DOCS_SUBSECTION = 'innovation_implementation_documents';
                            processInnovationData = {
                                vendorId: vendorObjectId,
                                urnNo: createProcessInnovationDto.urnNo,
                                innovationImplementationDetails: createProcessInnovationDto.innovationImplementationDetails || '',
                                innovationImplementationDocuments: innovationImplementationDocuments,
                                processInnovationStatus: createProcessInnovationDto.processInnovationStatus || 0,
                                updatedDate: now,
                            };
                            return [4 /*yield*/, this.processInnovationModel
                                    .findOneAndUpdate({ urnNo: createProcessInnovationDto.urnNo }, {
                                    $set: processInnovationData,
                                    $setOnInsert: { processInnovationId: processInnovationId, createdDate: now },
                                }, { upsert: true, new: true, session: session })
                                    .exec()];
                        case 13:
                            savedProcessInnovation = _h.sent();
                            if (!(innovationImplementationDocumentsFilePaths.length > 0)) return [3 /*break*/, 21];
                            tags = innovationDocumentTags !== null && innovationDocumentTags !== void 0 ? innovationDocumentTags : [];
                            docsToInsert = [];
                            return [4 /*yield*/, (0, certification_document_version_util_1.isVendorResubmitCycle)(this.productModel, createProcessInnovationDto.urnNo, session)];
                        case 14:
                            isResubmitCycle = _h.sent();
                            i = 0;
                            _h.label = 15;
                        case 15:
                            if (!(i < innovationImplementationDocumentsFilePaths.length)) return [3 /*break*/, 18];
                            tag = (_e = tags[i]) !== null && _e !== void 0 ? _e : 'tech';
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 16:
                            productDocumentId = _h.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId,
                                urnNo: createProcessInnovationDto.urnNo,
                                eoiNo: '',
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_INNOVATION,
                                documentFormSubsection: INNOVATION_DOCS_SUBSECTION,
                                formPrimaryId: savedProcessInnovation.processInnovationId,
                                documentName: path.basename(innovationImplementationDocumentsFilePaths[i]),
                                documentOriginalName: uploadedInnovationFiles[i].originalname,
                                documentLink: innovationImplementationDocumentsFilePaths[i],
                                documentTag: tag,
                                createdDate: now,
                                updatedDate: now,
                            });
                            _h.label = 17;
                        case 17:
                            i++;
                            return [3 /*break*/, 15];
                        case 18: return [4 /*yield*/, this.allProductDocumentModel.insertMany(docsToInsert, { session: session })];
                        case 19:
                            insertedDocs = _h.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackInsertedCertificationDocuments)({
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: createProcessInnovationDto.urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_INNOVATION,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    insertedDocs: insertedDocs,
                                    isResubmitCycle: isResubmitCycle,
                                    session: session,
                                    filesByIndex: uploadedInnovationFiles,
                                })];
                        case 20:
                            _h.sent();
                            _h.label = 21;
                        case 21: return [4 /*yield*/, session.commitTransaction()];
                        case 22:
                            _h.sent();
                            session.endSession();
                            this.documentUploadNotification.notifyAfterDocumentsUploaded(vendorId, innovationImplementationDocumentsFilePaths.length, createProcessInnovationDto.urnNo);
                            return [2 /*return*/, savedProcessInnovation];
                        case 23:
                            error_2 = _h.sent();
                            isUrnDuplicate = Number(error_2 === null || error_2 === void 0 ? void 0 : error_2.code) === 11000 &&
                                (((_f = error_2 === null || error_2 === void 0 ? void 0 : error_2.keyPattern) === null || _f === void 0 ? void 0 : _f.urnNo) === 1 || ((_g = error_2 === null || error_2 === void 0 ? void 0 : error_2.keyValue) === null || _g === void 0 ? void 0 : _g.urnNo));
                            return [4 /*yield*/, session.abortTransaction()];
                        case 24:
                            _h.sent();
                            session.endSession();
                            if (!isUrnDuplicate) return [3 /*break*/, 26];
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            now = new Date();
                            return [4 /*yield*/, this.processInnovationModel
                                    .findOneAndUpdate({ urnNo: createProcessInnovationDto.urnNo }, {
                                    $set: {
                                        vendorId: vendorObjectId,
                                        urnNo: createProcessInnovationDto.urnNo,
                                        innovationImplementationDetails: createProcessInnovationDto.innovationImplementationDetails ||
                                            '',
                                        processInnovationStatus: createProcessInnovationDto.processInnovationStatus || 0,
                                        updatedDate: now,
                                    },
                                }, { new: true })
                                    .exec()];
                        case 25:
                            recovered = _h.sent();
                            if (recovered) {
                                return [2 /*return*/, recovered];
                            }
                            _h.label = 26;
                        case 26:
                            // Clean up uploaded file if transaction fails (file was moved to URN folder)
                            try {
                                for (_b = 0, createdFileFullPaths_1 = createdFileFullPaths; _b < createdFileFullPaths_1.length; _b++) {
                                    fullPath = createdFileFullPaths_1[_b];
                                    if (fs.existsSync(fullPath)) {
                                        fs.unlinkSync(fullPath);
                                    }
                                }
                            }
                            catch (cleanupError) {
                                console.error('[Process Innovation] File cleanup error:', cleanupError);
                            }
                            console.error('[Process Innovation] Create error:', error_2);
                            throw new common_1.InternalServerErrorException(error_2.message || 'Failed to create process innovation record.');
                        case 27: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessInnovationService_1.prototype.patchInnovationDocumentTag = function (dto, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, urnNo, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            urnNo = dto.urnNo.trim();
                            return [4 /*yield*/, this.allProductDocumentModel
                                    .findOneAndUpdate({
                                    productDocumentId: dto.productDocumentId,
                                    urnNo: urnNo,
                                    vendorId: vendorObjectId,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_INNOVATION,
                                    isDeleted: { $ne: true },
                                }, {
                                    $set: {
                                        documentTag: dto.documentTag,
                                        updatedDate: new Date(),
                                    },
                                }, { new: true })
                                    .exec()];
                        case 1:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException("Innovation document ".concat(dto.productDocumentId, " not found for URN ").concat(urnNo));
                            }
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        return ProcessInnovationService_1;
    }());
    __setFunctionName(_classThis, "ProcessInnovationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessInnovationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessInnovationService = _classThis;
}();
exports.ProcessInnovationService = ProcessInnovationService;
