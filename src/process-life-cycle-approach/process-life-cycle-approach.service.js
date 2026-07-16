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
exports.ProcessLifeCycleApproachService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var fs = require("fs");
var path = require("path");
var upload_file_util_1 = require("../utils/upload-file.util");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var vendor_urn_edit_util_1 = require("../common/vendor/vendor-urn-edit.util");
var ProcessLifeCycleApproachService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessLifeCycleApproachService = _classThis = /** @class */ (function () {
        function ProcessLifeCycleApproachService_1(processLifeCycleApproachModel, allProductDocumentModel, productModel, connection, sequenceHelper, documentUploadNotification, documentVersioningService) {
            this.processLifeCycleApproachModel = processLifeCycleApproachModel;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentUploadNotification = documentUploadNotification;
            this.documentVersioningService = documentVersioningService;
        }
        ProcessLifeCycleApproachService_1.prototype.onModuleInit = function () {
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
                            return [4 /*yield*/, this.processLifeCycleApproachModel.syncIndexes()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error('[process-life-cycle-approach] syncIndexes failed (check duplicates):', error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Safely convert string to ObjectId with validation
         */
        ProcessLifeCycleApproachService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        ProcessLifeCycleApproachService_1.prototype.saveFileToUrnFolder = function (file, urnNo, fileType) {
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
        /**
         * Create process life cycle approach with file uploads
         */
        ProcessLifeCycleApproachService_1.prototype.createProcessLifeCycleApproach = function (createProcessLifeCycleApproachDto, vendorId, lifeCycleAssesmentReportsFiles, lifeCycleImplementationDocumentsFiles) {
            return __awaiter(this, void 0, void 0, function () {
                var session, createdFileFullPaths, vendorObjectId, now, existingLifeCycle, processLifeCycleApproachId, _a, lcaReportsFiles, lcaImplementationFiles, lcaReportsDisplayName, lcaImplementationDisplayName, lifeCycleAssesmentReports, lcaReportsFilePaths, lcaReportsStoredNames, _i, lcaReportsFiles_1, lifeCycleAssesmentReportsFile, lcaReportsFilePath, lifeCycleImplementationDocuments, lcaImplementationFilePaths, lcaImplementationStoredNames, _b, lcaImplementationFiles_1, lifeCycleImplementationDocumentsFile, lcaImplementationFilePath, processLifeCycleApproachData, savedProcessLifeCycleApproach, docsToInsert, i, productDocumentId, i, productDocumentId, isResubmitCycle, insertedDocs, error_2, _c, createdFileFullPaths_1, fullPath;
                var _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0: return [4 /*yield*/, (0, vendor_urn_edit_util_1.assertVendorCanEditUrn)(this.productModel, vendorId, createProcessLifeCycleApproachDto.urnNo)];
                        case 1:
                            _j.sent();
                            return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            session = _j.sent();
                            session.startTransaction();
                            createdFileFullPaths = [];
                            _j.label = 3;
                        case 3:
                            _j.trys.push([3, 32, , 34]);
                            vendorObjectId = this.toObjectId(vendorId, 'vendorId');
                            now = new Date();
                            return [4 /*yield*/, this.processLifeCycleApproachModel
                                    .findOne({ urnNo: createProcessLifeCycleApproachDto.urnNo })
                                    .session(session)];
                        case 4:
                            existingLifeCycle = _j.sent();
                            if (!((_d = existingLifeCycle === null || existingLifeCycle === void 0 ? void 0 : existingLifeCycle.processLifeCycleApproachId) !== null && _d !== void 0)) return [3 /*break*/, 5];
                            _a = _d;
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.sequenceHelper.getProcessLifeCycleApproachId()];
                        case 6:
                            _a = (_j.sent());
                            _j.label = 7;
                        case 7:
                            processLifeCycleApproachId = _a;
                            lcaReportsFiles = Array.isArray(lifeCycleAssesmentReportsFiles)
                                ? lifeCycleAssesmentReportsFiles
                                : [];
                            lcaImplementationFiles = Array.isArray(lifeCycleImplementationDocumentsFiles)
                                ? lifeCycleImplementationDocumentsFiles
                                : [];
                            lcaReportsDisplayName = ((_e = createProcessLifeCycleApproachDto.lifeCycleAssesmentReportsFileName) === null || _e === void 0 ? void 0 : _e.trim()) ||
                                '';
                            lcaImplementationDisplayName = ((_f = createProcessLifeCycleApproachDto.lifeCycleImplementationDocumentsFileName) === null || _f === void 0 ? void 0 : _f.trim()) ||
                                '';
                            lifeCycleAssesmentReports = (_g = existingLifeCycle === null || existingLifeCycle === void 0 ? void 0 : existingLifeCycle.lifeCycleAssesmentReports) !== null && _g !== void 0 ? _g : null;
                            lcaReportsFilePaths = [];
                            lcaReportsStoredNames = [];
                            if (!(lcaReportsFiles.length > 0)) return [3 /*break*/, 12];
                            _i = 0, lcaReportsFiles_1 = lcaReportsFiles;
                            _j.label = 8;
                        case 8:
                            if (!(_i < lcaReportsFiles_1.length)) return [3 /*break*/, 11];
                            lifeCycleAssesmentReportsFile = lcaReportsFiles_1[_i];
                            return [4 /*yield*/, this.saveFileToUrnFolder(lifeCycleAssesmentReportsFile, createProcessLifeCycleApproachDto.urnNo, 'lca_reports')];
                        case 9:
                            lcaReportsFilePath = _j.sent();
                            lcaReportsFilePaths.push(lcaReportsFilePath.fileUrl);
                            lcaReportsStoredNames.push(lcaReportsFilePath.fileName);
                            createdFileFullPaths.push(path.join('uploads', lcaReportsFilePath.fileUrl));
                            _j.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 8];
                        case 11:
                            lifeCycleAssesmentReports = 1;
                            _j.label = 12;
                        case 12:
                            lifeCycleImplementationDocuments = (_h = existingLifeCycle === null || existingLifeCycle === void 0 ? void 0 : existingLifeCycle.lifeCycleImplementationDocuments) !== null && _h !== void 0 ? _h : null;
                            lcaImplementationFilePaths = [];
                            lcaImplementationStoredNames = [];
                            if (!(lcaImplementationFiles.length > 0)) return [3 /*break*/, 17];
                            _b = 0, lcaImplementationFiles_1 = lcaImplementationFiles;
                            _j.label = 13;
                        case 13:
                            if (!(_b < lcaImplementationFiles_1.length)) return [3 /*break*/, 16];
                            lifeCycleImplementationDocumentsFile = lcaImplementationFiles_1[_b];
                            return [4 /*yield*/, this.saveFileToUrnFolder(lifeCycleImplementationDocumentsFile, createProcessLifeCycleApproachDto.urnNo, 'lca_implementation')];
                        case 14:
                            lcaImplementationFilePath = _j.sent();
                            lcaImplementationFilePaths.push(lcaImplementationFilePath.fileUrl);
                            lcaImplementationStoredNames.push(lcaImplementationFilePath.fileName);
                            createdFileFullPaths.push(path.join('uploads', lcaImplementationFilePath.fileUrl));
                            _j.label = 15;
                        case 15:
                            _b++;
                            return [3 /*break*/, 13];
                        case 16:
                            lifeCycleImplementationDocuments = 1;
                            _j.label = 17;
                        case 17:
                            processLifeCycleApproachData = {
                                vendorId: vendorObjectId,
                                urnNo: createProcessLifeCycleApproachDto.urnNo,
                                lifeCycleAssesmentReports: lifeCycleAssesmentReports,
                                lifeCycleImplementationDetails: createProcessLifeCycleApproachDto.lifeCycleImplementationDetails ||
                                    '',
                                lifeCycleImplementationDocuments: lifeCycleImplementationDocuments,
                                processLifeCycleApproachStatus: createProcessLifeCycleApproachDto.processLifeCycleApproachStatus || 0,
                                updatedDate: now,
                            };
                            return [4 /*yield*/, this.processLifeCycleApproachModel
                                    .findOneAndUpdate({ urnNo: createProcessLifeCycleApproachDto.urnNo }, {
                                    $set: processLifeCycleApproachData,
                                    $setOnInsert: { processLifeCycleApproachId: processLifeCycleApproachId, createdDate: now },
                                }, { upsert: true, new: true, session: session })
                                    .exec()];
                        case 18:
                            savedProcessLifeCycleApproach = _j.sent();
                            docsToInsert = [];
                            i = 0;
                            _j.label = 19;
                        case 19:
                            if (!(i < lcaReportsFilePaths.length)) return [3 /*break*/, 22];
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 20:
                            productDocumentId = _j.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId,
                                urnNo: createProcessLifeCycleApproachDto.urnNo,
                                eoiNo: '',
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
                                documentFormSubsection: 'life_cycle_assesment_reports',
                                formPrimaryId: savedProcessLifeCycleApproach.processLifeCycleApproachId,
                                documentName: lcaReportsDisplayName || lcaReportsStoredNames[i],
                                documentOriginalName: lcaReportsFiles[i].originalname,
                                documentLink: lcaReportsFilePaths[i],
                                createdDate: now,
                                updatedDate: now,
                            });
                            _j.label = 21;
                        case 21:
                            i++;
                            return [3 /*break*/, 19];
                        case 22:
                            i = 0;
                            _j.label = 23;
                        case 23:
                            if (!(i < lcaImplementationFilePaths.length)) return [3 /*break*/, 26];
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 24:
                            productDocumentId = _j.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId,
                                urnNo: createProcessLifeCycleApproachDto.urnNo,
                                eoiNo: '',
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
                                documentFormSubsection: 'life_cycle_implementation_documents',
                                formPrimaryId: savedProcessLifeCycleApproach.processLifeCycleApproachId,
                                documentName: lcaImplementationDisplayName || lcaImplementationStoredNames[i],
                                documentOriginalName: lcaImplementationFiles[i].originalname,
                                documentLink: lcaImplementationFilePaths[i],
                                createdDate: now,
                                updatedDate: now,
                            });
                            _j.label = 25;
                        case 25:
                            i++;
                            return [3 /*break*/, 23];
                        case 26:
                            if (!docsToInsert.length) return [3 /*break*/, 30];
                            return [4 /*yield*/, (0, certification_document_version_util_1.isVendorResubmitCycle)(this.productModel, createProcessLifeCycleApproachDto.urnNo, session)];
                        case 27:
                            isResubmitCycle = _j.sent();
                            return [4 /*yield*/, this.allProductDocumentModel.insertMany(docsToInsert, { session: session })];
                        case 28:
                            insertedDocs = _j.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackInsertedCertificationDocuments)({
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: createProcessLifeCycleApproachDto.urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
                                    userId: vendorObjectId,
                                    vendorId: vendorObjectId,
                                    insertedDocs: insertedDocs,
                                    isResubmitCycle: isResubmitCycle,
                                    session: session,
                                    filesByIndex: __spreadArray(__spreadArray([], lcaReportsFiles, true), lcaImplementationFiles, true),
                                })];
                        case 29:
                            _j.sent();
                            _j.label = 30;
                        case 30: return [4 /*yield*/, session.commitTransaction()];
                        case 31:
                            _j.sent();
                            session.endSession();
                            if (docsToInsert.length > 0) {
                                this.documentUploadNotification.notifyAfterDocumentsUploaded(vendorId, docsToInsert.length, createProcessLifeCycleApproachDto.urnNo);
                            }
                            return [2 /*return*/, savedProcessLifeCycleApproach];
                        case 32:
                            error_2 = _j.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 33:
                            _j.sent();
                            session.endSession();
                            // Clean up uploaded files if transaction fails (files were moved to URN folder)
                            try {
                                for (_c = 0, createdFileFullPaths_1 = createdFileFullPaths; _c < createdFileFullPaths_1.length; _c++) {
                                    fullPath = createdFileFullPaths_1[_c];
                                    if (fs.existsSync(fullPath)) {
                                        fs.unlinkSync(fullPath);
                                    }
                                }
                            }
                            catch (cleanupError) {
                                console.error('[Process Life Cycle Approach] File cleanup error:', cleanupError);
                            }
                            console.error('[Process Life Cycle Approach] Create error:', error_2);
                            throw new common_1.InternalServerErrorException(error_2.message || 'Failed to create process life cycle approach record.');
                        case 34: return [2 /*return*/];
                    }
                });
            });
        };
        return ProcessLifeCycleApproachService_1;
    }());
    __setFunctionName(_classThis, "ProcessLifeCycleApproachService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessLifeCycleApproachService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessLifeCycleApproachService = _classThis;
}();
exports.ProcessLifeCycleApproachService = ProcessLifeCycleApproachService;
