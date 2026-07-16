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
exports.ProcessWasteManagementService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var fs = require("fs");
var path = require("path");
var upload_file_util_1 = require("../utils/upload-file.util");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var vendor_urn_edit_util_1 = require("../common/vendor/vendor-urn-edit.util");
var ProcessWasteManagementService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessWasteManagementService = _classThis = /** @class */ (function () {
        function ProcessWasteManagementService_1(processWasteManagementModel, allProductDocumentModel, productModel, connection, sequenceHelper, documentUploadNotification, documentVersioningService) {
            this.processWasteManagementModel = processWasteManagementModel;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentUploadNotification = documentUploadNotification;
            this.documentVersioningService = documentVersioningService;
        }
        ProcessWasteManagementService_1.prototype.onModuleInit = function () {
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
                            return [4 /*yield*/, this.processWasteManagementModel.syncIndexes()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error('[process-waste-management] syncIndexes failed (check duplicates):', error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Safely convert string to ObjectId with validation
         */
        ProcessWasteManagementService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        ProcessWasteManagementService_1.prototype.saveFileToUrnFolder = function (file, urnNo, fileType) {
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
         * Create process waste management with file upload
         */
        ProcessWasteManagementService_1.prototype.createProcessWasteManagement = function (createProcessWasteManagementDto, vendorId, wmSupportingDocumentsFiles) {
            return __awaiter(this, void 0, void 0, function () {
                var session, createdFileFullPaths, vendorObjectId, now, existingWasteManagement, processWasteManagementId, _a, uploadedWmFiles, wmSupportingDocuments, wmSupportingDocumentsFilePaths, _i, uploadedWmFiles_1, wmSupportingDocumentsFile, wmSupportingDocumentsFilePath, processWasteManagementData, savedProcessWasteManagement, isResubmitCycle, docsToInsert, i, productDocumentId, insertedDocs, error_2, _b, createdFileFullPaths_1, fullPath;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, (0, vendor_urn_edit_util_1.assertVendorCanEditUrn)(this.productModel, vendorId, createProcessWasteManagementDto.urnNo)];
                        case 1:
                            _e.sent();
                            return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            session = _e.sent();
                            session.startTransaction();
                            createdFileFullPaths = [];
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 23, , 25]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            now = new Date();
                            return [4 /*yield*/, this.processWasteManagementModel
                                    .findOne({ urnNo: createProcessWasteManagementDto.urnNo })
                                    .session(session)];
                        case 4:
                            existingWasteManagement = _e.sent();
                            if (!((_c = existingWasteManagement === null || existingWasteManagement === void 0 ? void 0 : existingWasteManagement.processWasteManagementId) !== null && _c !== void 0)) return [3 /*break*/, 5];
                            _a = _c;
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.sequenceHelper.getProcessWasteManagementId()];
                        case 6:
                            _a = (_e.sent());
                            _e.label = 7;
                        case 7:
                            processWasteManagementId = _a;
                            uploadedWmFiles = Array.isArray(wmSupportingDocumentsFiles)
                                ? wmSupportingDocumentsFiles
                                : [];
                            wmSupportingDocuments = (_d = existingWasteManagement === null || existingWasteManagement === void 0 ? void 0 : existingWasteManagement.wmSupportingDocuments) !== null && _d !== void 0 ? _d : null;
                            wmSupportingDocumentsFilePaths = [];
                            if (!(uploadedWmFiles.length > 0)) return [3 /*break*/, 12];
                            _i = 0, uploadedWmFiles_1 = uploadedWmFiles;
                            _e.label = 8;
                        case 8:
                            if (!(_i < uploadedWmFiles_1.length)) return [3 /*break*/, 11];
                            wmSupportingDocumentsFile = uploadedWmFiles_1[_i];
                            return [4 /*yield*/, this.saveFileToUrnFolder(wmSupportingDocumentsFile, createProcessWasteManagementDto.urnNo, 'waste_management_supporting')];
                        case 9:
                            wmSupportingDocumentsFilePath = _e.sent();
                            wmSupportingDocumentsFilePaths.push(wmSupportingDocumentsFilePath);
                            createdFileFullPaths.push(path.join('uploads', wmSupportingDocumentsFilePath));
                            _e.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 8];
                        case 11:
                            wmSupportingDocuments = 1;
                            _e.label = 12;
                        case 12:
                            processWasteManagementData = {
                                vendorId: vendorObjectId,
                                urnNo: createProcessWasteManagementDto.urnNo,
                                wmImplementationDetails: createProcessWasteManagementDto.wmImplementationDetails || '',
                                wmSupportingDocuments: wmSupportingDocuments,
                                processWasteManagementStatus: createProcessWasteManagementDto.processWasteManagementStatus || 0,
                                updatedDate: now,
                            };
                            return [4 /*yield*/, this.processWasteManagementModel
                                    .findOneAndUpdate({ urnNo: createProcessWasteManagementDto.urnNo }, {
                                    $set: processWasteManagementData,
                                    $setOnInsert: { processWasteManagementId: processWasteManagementId, createdDate: now },
                                }, { upsert: true, new: true, session: session })
                                    .exec()];
                        case 13:
                            savedProcessWasteManagement = _e.sent();
                            if (!(wmSupportingDocumentsFilePaths.length > 0)) return [3 /*break*/, 21];
                            return [4 /*yield*/, (0, certification_document_version_util_1.isVendorResubmitCycle)(this.productModel, createProcessWasteManagementDto.urnNo, session)];
                        case 14:
                            isResubmitCycle = _e.sent();
                            docsToInsert = [];
                            i = 0;
                            _e.label = 15;
                        case 15:
                            if (!(i < wmSupportingDocumentsFilePaths.length)) return [3 /*break*/, 18];
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 16:
                            productDocumentId = _e.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId,
                                urnNo: createProcessWasteManagementDto.urnNo,
                                eoiNo: '',
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
                                documentFormSubsection: 'wm_supporting_documents',
                                formPrimaryId: savedProcessWasteManagement.processWasteManagementId,
                                documentName: path.basename(wmSupportingDocumentsFilePaths[i]),
                                documentOriginalName: uploadedWmFiles[i].originalname,
                                documentLink: wmSupportingDocumentsFilePaths[i],
                                createdDate: now,
                                updatedDate: now,
                            });
                            _e.label = 17;
                        case 17:
                            i++;
                            return [3 /*break*/, 15];
                        case 18: return [4 /*yield*/, this.allProductDocumentModel.insertMany(docsToInsert, { session: session })];
                        case 19:
                            insertedDocs = _e.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackInsertedCertificationDocuments)({
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: createProcessWasteManagementDto.urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    insertedDocs: insertedDocs,
                                    isResubmitCycle: isResubmitCycle,
                                    session: session,
                                    filesByIndex: uploadedWmFiles,
                                })];
                        case 20:
                            _e.sent();
                            _e.label = 21;
                        case 21: return [4 /*yield*/, session.commitTransaction()];
                        case 22:
                            _e.sent();
                            session.endSession();
                            this.documentUploadNotification.notifyAfterDocumentsUploaded(vendorId, wmSupportingDocumentsFilePaths.length, createProcessWasteManagementDto.urnNo);
                            return [2 /*return*/, savedProcessWasteManagement];
                        case 23:
                            error_2 = _e.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 24:
                            _e.sent();
                            session.endSession();
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
                                console.error('[Process Waste Management] File cleanup error:', cleanupError);
                            }
                            console.error('[Process Waste Management] Create error:', error_2);
                            throw new common_1.InternalServerErrorException(error_2.message || 'Failed to create process waste management record.');
                        case 25: return [2 /*return*/];
                    }
                });
            });
        };
        return ProcessWasteManagementService_1;
    }());
    __setFunctionName(_classThis, "ProcessWasteManagementService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessWasteManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessWasteManagementService = _classThis;
}();
exports.ProcessWasteManagementService = ProcessWasteManagementService;
