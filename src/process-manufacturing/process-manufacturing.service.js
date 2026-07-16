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
exports.ProcessManufacturingService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var upload_file_util_1 = require("../utils/upload-file.util");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var vendor_urn_edit_util_1 = require("../common/vendor/vendor-urn-edit.util");
var ProcessManufacturingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessManufacturingService = _classThis = /** @class */ (function () {
        function ProcessManufacturingService_1(processManufacturingModel, allProductDocumentModel, productModel, connection, sequenceHelper, documentUploadNotification, documentVersioningService) {
            this.processManufacturingModel = processManufacturingModel;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentUploadNotification = documentUploadNotification;
            this.documentVersioningService = documentVersioningService;
        }
        ProcessManufacturingService_1.prototype.onModuleInit = function () {
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
                            return [4 /*yield*/, this.processManufacturingModel.syncIndexes()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error('[process-manufacturing] syncIndexes failed (check duplicates):', error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Safely convert string to ObjectId with validation
         */
        ProcessManufacturingService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        ProcessManufacturingService_1.prototype.saveFileToUrnFolder = function (file, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, upload_file_util_1.uploadFile)(file, "urns/".concat(urnNo))];
                });
            });
        };
        ProcessManufacturingService_1.prototype.rollbackCreatedUploads = function (uploads) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, uploads_1, upload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, uploads_1 = uploads;
                            _a.label = 1;
                        case 1:
                            if (!(_i < uploads_1.length)) return [3 /*break*/, 4];
                            upload = uploads_1[_i];
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFile)({
                                    storage_type: upload.storage,
                                    s3_key: upload.s3Key,
                                    relativePath: upload.relativePath,
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessManufacturingService_1.prototype.countRetainedProcessManufacturingDocuments = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!mongoose_1.Types.ObjectId.isValid(vendorId)) {
                        return [2 /*return*/, 0];
                    }
                    return [2 /*return*/, this.allProductDocumentModel
                            .countDocuments({
                            vendorId: new mongoose_1.Types.ObjectId(vendorId),
                            urnNo: urnNo,
                            documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING,
                            isDeleted: { $ne: true },
                        })
                            .exec()];
                });
            });
        };
        /**
         * Create process manufacturing with file uploads
         */
        ProcessManufacturingService_1.prototype.createProcessManufacturing = function (createProcessManufacturingDto, vendorId, energyConservationSupportingDocumentsFiles, energyConsumptionDocumentsFiles) {
            return __awaiter(this, void 0, void 0, function () {
                var session, createdUploads, vendorObjectId, now, existingManufacturing, processManufacturingId, _a, energyConservationFiles, energyConsumptionFiles, conservationDisplayName, consumptionDisplayName, energyConservationSupportingDocuments, energyConservationUploads, _i, energyConservationFiles_1, energyConservationSupportingDocumentsFile, uploaded, energyConsumptionDocuments, energyConsumptionUploads, _b, energyConsumptionFiles_1, energyConsumptionDocumentsFile, uploaded, processManufacturingData, savedProcessManufacturing, docsToInsert, i, uploaded, productDocumentId, i, uploaded, productDocumentId, isResubmitCycle, insertedDocs, error_2;
                var _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0: return [4 /*yield*/, (0, vendor_urn_edit_util_1.assertVendorCanEditUrn)(this.productModel, vendorId, createProcessManufacturingDto.urnNo)];
                        case 1:
                            _h.sent();
                            return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            session = _h.sent();
                            session.startTransaction();
                            createdUploads = [];
                            _h.label = 3;
                        case 3:
                            _h.trys.push([3, 32, , 35]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            now = new Date();
                            return [4 /*yield*/, this.processManufacturingModel
                                    .findOne({ urnNo: createProcessManufacturingDto.urnNo })
                                    .session(session)];
                        case 4:
                            existingManufacturing = _h.sent();
                            if (!((_c = existingManufacturing === null || existingManufacturing === void 0 ? void 0 : existingManufacturing.processManufacturingId) !== null && _c !== void 0)) return [3 /*break*/, 5];
                            _a = _c;
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.sequenceHelper.getProcessManufacturingId()];
                        case 6:
                            _a = (_h.sent());
                            _h.label = 7;
                        case 7:
                            processManufacturingId = _a;
                            energyConservationFiles = Array.isArray(energyConservationSupportingDocumentsFiles)
                                ? energyConservationSupportingDocumentsFiles
                                : [];
                            energyConsumptionFiles = Array.isArray(energyConsumptionDocumentsFiles)
                                ? energyConsumptionDocumentsFiles
                                : [];
                            conservationDisplayName = ((_d = createProcessManufacturingDto.energyConservationSupportingDocumentsFileName) === null || _d === void 0 ? void 0 : _d.trim()) ||
                                '';
                            consumptionDisplayName = ((_e = createProcessManufacturingDto.energyConsumptionDocumentsFileName) === null || _e === void 0 ? void 0 : _e.trim()) ||
                                '';
                            energyConservationSupportingDocuments = (_f = existingManufacturing === null || existingManufacturing === void 0 ? void 0 : existingManufacturing.energyConservationSupportingDocuments) !== null && _f !== void 0 ? _f : null;
                            energyConservationUploads = [];
                            if (!(energyConservationFiles.length > 0)) return [3 /*break*/, 12];
                            _i = 0, energyConservationFiles_1 = energyConservationFiles;
                            _h.label = 8;
                        case 8:
                            if (!(_i < energyConservationFiles_1.length)) return [3 /*break*/, 11];
                            energyConservationSupportingDocumentsFile = energyConservationFiles_1[_i];
                            return [4 /*yield*/, this.saveFileToUrnFolder(energyConservationSupportingDocumentsFile, createProcessManufacturingDto.urnNo)];
                        case 9:
                            uploaded = _h.sent();
                            energyConservationUploads.push(uploaded);
                            createdUploads.push(uploaded);
                            _h.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 8];
                        case 11:
                            energyConservationSupportingDocuments = 1;
                            _h.label = 12;
                        case 12:
                            energyConsumptionDocuments = (_g = existingManufacturing === null || existingManufacturing === void 0 ? void 0 : existingManufacturing.energyConsumptionDocuments) !== null && _g !== void 0 ? _g : null;
                            energyConsumptionUploads = [];
                            if (!(energyConsumptionFiles.length > 0)) return [3 /*break*/, 17];
                            _b = 0, energyConsumptionFiles_1 = energyConsumptionFiles;
                            _h.label = 13;
                        case 13:
                            if (!(_b < energyConsumptionFiles_1.length)) return [3 /*break*/, 16];
                            energyConsumptionDocumentsFile = energyConsumptionFiles_1[_b];
                            return [4 /*yield*/, this.saveFileToUrnFolder(energyConsumptionDocumentsFile, createProcessManufacturingDto.urnNo)];
                        case 14:
                            uploaded = _h.sent();
                            energyConsumptionUploads.push(uploaded);
                            createdUploads.push(uploaded);
                            _h.label = 15;
                        case 15:
                            _b++;
                            return [3 /*break*/, 13];
                        case 16:
                            energyConsumptionDocuments = 1;
                            _h.label = 17;
                        case 17:
                            processManufacturingData = {
                                vendorId: vendorObjectId,
                                urnNo: createProcessManufacturingDto.urnNo,
                                energyConservationSupportingDocuments: energyConservationSupportingDocuments,
                                portableWaterDemand: createProcessManufacturingDto.portableWaterDemand || '',
                                rainWaterHarvesting: createProcessManufacturingDto.rainWaterHarvesting || '',
                                beyondTheFenceInitiatives: createProcessManufacturingDto.beyondTheFenceInitiatives || '',
                                totalEnergyConsumption: createProcessManufacturingDto.totalEnergyConsumption || null,
                                energyConsumptionDocuments: energyConsumptionDocuments,
                                processManufacturingStatus: createProcessManufacturingDto.processManufacturingStatus || 0,
                                updatedDate: now,
                            };
                            return [4 /*yield*/, this.processManufacturingModel
                                    .findOneAndUpdate({ urnNo: createProcessManufacturingDto.urnNo }, {
                                    $set: processManufacturingData,
                                    $setOnInsert: { processManufacturingId: processManufacturingId, createdDate: now },
                                }, { upsert: true, new: true, session: session })
                                    .exec()];
                        case 18:
                            savedProcessManufacturing = _h.sent();
                            docsToInsert = [];
                            i = 0;
                            _h.label = 19;
                        case 19:
                            if (!(i < energyConservationUploads.length)) return [3 /*break*/, 22];
                            uploaded = energyConservationUploads[i];
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 20:
                            productDocumentId = _h.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId,
                                urnNo: createProcessManufacturingDto.urnNo,
                                eoiNo: '',
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING,
                                documentFormSubsection: 'energy_conservation_supporting_documents',
                                formPrimaryId: savedProcessManufacturing.processManufacturingId,
                                documentName: conservationDisplayName || uploaded.fileName,
                                documentOriginalName: energyConservationFiles[i].originalname,
                                documentLink: uploaded.fileUrl,
                                createdDate: now,
                                updatedDate: now,
                            });
                            _h.label = 21;
                        case 21:
                            i++;
                            return [3 /*break*/, 19];
                        case 22:
                            i = 0;
                            _h.label = 23;
                        case 23:
                            if (!(i < energyConsumptionUploads.length)) return [3 /*break*/, 26];
                            uploaded = energyConsumptionUploads[i];
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 24:
                            productDocumentId = _h.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId,
                                urnNo: createProcessManufacturingDto.urnNo,
                                eoiNo: '',
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING,
                                documentFormSubsection: 'energy_consumption_documents',
                                formPrimaryId: savedProcessManufacturing.processManufacturingId,
                                documentName: consumptionDisplayName || uploaded.fileName,
                                documentOriginalName: energyConsumptionFiles[i].originalname,
                                documentLink: uploaded.fileUrl,
                                createdDate: now,
                                updatedDate: now,
                            });
                            _h.label = 25;
                        case 25:
                            i++;
                            return [3 /*break*/, 23];
                        case 26:
                            if (!docsToInsert.length) return [3 /*break*/, 30];
                            return [4 /*yield*/, (0, certification_document_version_util_1.isVendorResubmitCycle)(this.productModel, createProcessManufacturingDto.urnNo, session)];
                        case 27:
                            isResubmitCycle = _h.sent();
                            return [4 /*yield*/, this.allProductDocumentModel.insertMany(docsToInsert, { session: session })];
                        case 28:
                            insertedDocs = _h.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackInsertedCertificationDocuments)({
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: createProcessManufacturingDto.urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    insertedDocs: insertedDocs,
                                    isResubmitCycle: isResubmitCycle,
                                    session: session,
                                    filesByIndex: __spreadArray(__spreadArray([], energyConservationFiles, true), energyConsumptionFiles, true),
                                })];
                        case 29:
                            _h.sent();
                            _h.label = 30;
                        case 30: return [4 /*yield*/, session.commitTransaction()];
                        case 31:
                            _h.sent();
                            session.endSession();
                            this.documentUploadNotification.notifyAfterDocumentsUploaded(vendorId, docsToInsert.length, createProcessManufacturingDto.urnNo);
                            return [2 /*return*/, savedProcessManufacturing];
                        case 32:
                            error_2 = _h.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 33:
                            _h.sent();
                            session.endSession();
                            return [4 /*yield*/, this.rollbackCreatedUploads(createdUploads).catch(function (cleanupError) {
                                    console.error('[Process Manufacturing] File cleanup error:', cleanupError);
                                })];
                        case 34:
                            _h.sent();
                            console.error('[Process Manufacturing] Create error:', error_2);
                            throw new common_1.InternalServerErrorException(error_2.message || 'Failed to create process manufacturing record.');
                        case 35: return [2 /*return*/];
                    }
                });
            });
        };
        return ProcessManufacturingService_1;
    }());
    __setFunctionName(_classThis, "ProcessManufacturingService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessManufacturingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessManufacturingService = _classThis;
}();
exports.ProcessManufacturingService = ProcessManufacturingService;
