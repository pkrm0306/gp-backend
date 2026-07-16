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
exports.ProcessProductStewardshipService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var fs = require("fs");
var path = require("path");
var upload_file_util_1 = require("../utils/upload-file.util");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var vendor_urn_edit_util_1 = require("../common/vendor/vendor-urn-edit.util");
var ProcessProductStewardshipService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessProductStewardshipService = _classThis = /** @class */ (function () {
        function ProcessProductStewardshipService_1(processProductStewardshipModel, processPsStakeholderEduAwarnessModel, allProductDocumentModel, productModel, connection, sequenceHelper, documentUploadNotification, documentVersioningService) {
            this.processProductStewardshipModel = processProductStewardshipModel;
            this.processPsStakeholderEduAwarnessModel = processPsStakeholderEduAwarnessModel;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentUploadNotification = documentUploadNotification;
            this.documentVersioningService = documentVersioningService;
        }
        ProcessProductStewardshipService_1.prototype.onModuleInit = function () {
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
                            return [4 /*yield*/, this.processProductStewardshipModel.syncIndexes()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.processPsStakeholderEduAwarnessModel.syncIndexes()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error('[process-product-stewardship] syncIndexes failed (check duplicates):', error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Safely convert string to ObjectId with validation
         */
        ProcessProductStewardshipService_1.prototype.toObjectId = function (id, fieldName) {
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        ProcessProductStewardshipService_1.prototype.saveFileToUrnFolder = function (file, urnNo) {
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
        ProcessProductStewardshipService_1.prototype.normalizeProgrammeRows = function (rows) {
            if (!Array.isArray(rows)) {
                return [];
            }
            var normalized = rows
                .map(function (row) {
                var _a, _b;
                return ({
                    seaProgramDetails: String((_a = row === null || row === void 0 ? void 0 : row.programmeDetails) !== null && _a !== void 0 ? _a : '').trim(),
                    seaNoOfPrograms: String((_b = row === null || row === void 0 ? void 0 : row.numberOfPrograms) !== null && _b !== void 0 ? _b : '').trim(),
                });
            })
                .filter(function (row) { return row.seaProgramDetails !== '' || row.seaNoOfPrograms !== ''; });
            var seen = new Set();
            var unique = [];
            for (var _i = 0, normalized_1 = normalized; _i < normalized_1.length; _i++) {
                var row = normalized_1[_i];
                var key = "".concat(row.seaProgramDetails.toLowerCase(), "__").concat(row.seaNoOfPrograms.toLowerCase());
                if (seen.has(key))
                    continue;
                seen.add(key);
                unique.push(row);
            }
            return unique;
        };
        /**
         * Create process product stewardship with file uploads
         */
        ProcessProductStewardshipService_1.prototype.createProcessProductStewardship = function (createProcessProductStewardshipDto, vendorId, seaSupportingDocumentsFiles, qmSupportingDocumentsFiles, eprSupportingDocumentsFiles) {
            return __awaiter(this, void 0, void 0, function () {
                var session, createdFileFullPaths, oldFileLinksToDeleteAfterCommit, vendorObjectId_1, now_1, existingStewardship, processProductStewardshipId, _a, seaFiles, qmFiles, eprFiles, seaDisplayName, qmDisplayName, eprDisplayName, seaSupportingDocuments_1, seaFilePaths, seaStoredNames, _i, seaFiles_1, seaSupportingDocumentsFile, uploaded, qmSupportingDocuments, qmFilePaths, qmStoredNames, _b, qmFiles_1, qmSupportingDocumentsFile, uploaded, eprSupportingDocuments, eprFilePaths, eprStoredNames, _c, eprFiles_1, eprSupportingDocumentsFile, uploaded, isResubmitCycle, processProductStewardshipData, savedProcessProductStewardship_1, normalizedProgrammeRows, rowsToInsert, docsToInsert, i, productDocumentId, insertedSeaDocs, docsToInsert, i, productDocumentId, insertedQmDocs, docsToInsert, i, productDocumentId, insertedEprDocs, uploadedDocumentCount, _d, oldFileLinksToDeleteAfterCommit_1, fileLink, normalizedPath, error_2, _e, createdFileFullPaths_1, fullPath;
                var _f, _g, _h, _j, _k, _l, _m;
                return __generator(this, function (_o) {
                    switch (_o.label) {
                        case 0: return [4 /*yield*/, (0, vendor_urn_edit_util_1.assertVendorCanEditUrn)(this.productModel, vendorId, createProcessProductStewardshipDto.urnNo)];
                        case 1:
                            _o.sent();
                            return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            session = _o.sent();
                            session.startTransaction();
                            createdFileFullPaths = [];
                            oldFileLinksToDeleteAfterCommit = [];
                            _o.label = 3;
                        case 3:
                            _o.trys.push([3, 50, , 52]);
                            vendorObjectId_1 = this.toObjectId(vendorId, 'vendorId');
                            now_1 = new Date();
                            return [4 /*yield*/, this.processProductStewardshipModel
                                    .findOne({
                                    urnNo: createProcessProductStewardshipDto.urnNo,
                                })
                                    .session(session)];
                        case 4:
                            existingStewardship = _o.sent();
                            if (!((_f = existingStewardship === null || existingStewardship === void 0 ? void 0 : existingStewardship.processProductStewardshipId) !== null && _f !== void 0)) return [3 /*break*/, 5];
                            _a = _f;
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.sequenceHelper.getProcessProductStewardshipId()];
                        case 6:
                            _a = (_o.sent());
                            _o.label = 7;
                        case 7:
                            processProductStewardshipId = _a;
                            seaFiles = Array.isArray(seaSupportingDocumentsFiles)
                                ? seaSupportingDocumentsFiles
                                : [];
                            qmFiles = Array.isArray(qmSupportingDocumentsFiles)
                                ? qmSupportingDocumentsFiles
                                : [];
                            eprFiles = Array.isArray(eprSupportingDocumentsFiles)
                                ? eprSupportingDocumentsFiles
                                : [];
                            seaDisplayName = ((_g = createProcessProductStewardshipDto.seaSupportingDocumentsFileName) === null || _g === void 0 ? void 0 : _g.trim()) ||
                                '';
                            qmDisplayName = ((_h = createProcessProductStewardshipDto.qmSupportingDocumentsFileName) === null || _h === void 0 ? void 0 : _h.trim()) ||
                                '';
                            eprDisplayName = ((_j = createProcessProductStewardshipDto.eprSupportingDocumentsFileName) === null || _j === void 0 ? void 0 : _j.trim()) ||
                                '';
                            seaSupportingDocuments_1 = (_k = existingStewardship === null || existingStewardship === void 0 ? void 0 : existingStewardship.seaSupportingDocuments) !== null && _k !== void 0 ? _k : null;
                            seaFilePaths = [];
                            seaStoredNames = [];
                            if (!(seaFiles.length > 0)) return [3 /*break*/, 12];
                            _i = 0, seaFiles_1 = seaFiles;
                            _o.label = 8;
                        case 8:
                            if (!(_i < seaFiles_1.length)) return [3 /*break*/, 11];
                            seaSupportingDocumentsFile = seaFiles_1[_i];
                            return [4 /*yield*/, this.saveFileToUrnFolder(seaSupportingDocumentsFile, createProcessProductStewardshipDto.urnNo)];
                        case 9:
                            uploaded = _o.sent();
                            seaFilePaths.push(uploaded.fileUrl);
                            seaStoredNames.push(uploaded.fileName);
                            createdFileFullPaths.push(path.join('uploads', uploaded.fileUrl));
                            _o.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 8];
                        case 11:
                            seaSupportingDocuments_1 = 1;
                            _o.label = 12;
                        case 12:
                            qmSupportingDocuments = (_l = existingStewardship === null || existingStewardship === void 0 ? void 0 : existingStewardship.qmSupportingDocuments) !== null && _l !== void 0 ? _l : null;
                            qmFilePaths = [];
                            qmStoredNames = [];
                            if (!(qmFiles.length > 0)) return [3 /*break*/, 17];
                            _b = 0, qmFiles_1 = qmFiles;
                            _o.label = 13;
                        case 13:
                            if (!(_b < qmFiles_1.length)) return [3 /*break*/, 16];
                            qmSupportingDocumentsFile = qmFiles_1[_b];
                            return [4 /*yield*/, this.saveFileToUrnFolder(qmSupportingDocumentsFile, createProcessProductStewardshipDto.urnNo)];
                        case 14:
                            uploaded = _o.sent();
                            qmFilePaths.push(uploaded.fileUrl);
                            qmStoredNames.push(uploaded.fileName);
                            createdFileFullPaths.push(path.join('uploads', uploaded.fileUrl));
                            _o.label = 15;
                        case 15:
                            _b++;
                            return [3 /*break*/, 13];
                        case 16:
                            qmSupportingDocuments = 1;
                            _o.label = 17;
                        case 17:
                            eprSupportingDocuments = (_m = existingStewardship === null || existingStewardship === void 0 ? void 0 : existingStewardship.eprSupportingDocuments) !== null && _m !== void 0 ? _m : null;
                            eprFilePaths = [];
                            eprStoredNames = [];
                            if (!(eprFiles.length > 0)) return [3 /*break*/, 22];
                            _c = 0, eprFiles_1 = eprFiles;
                            _o.label = 18;
                        case 18:
                            if (!(_c < eprFiles_1.length)) return [3 /*break*/, 21];
                            eprSupportingDocumentsFile = eprFiles_1[_c];
                            return [4 /*yield*/, this.saveFileToUrnFolder(eprSupportingDocumentsFile, createProcessProductStewardshipDto.urnNo)];
                        case 19:
                            uploaded = _o.sent();
                            eprFilePaths.push(uploaded.fileUrl);
                            eprStoredNames.push(uploaded.fileName);
                            createdFileFullPaths.push(path.join('uploads', uploaded.fileUrl));
                            _o.label = 20;
                        case 20:
                            _c++;
                            return [3 /*break*/, 18];
                        case 21:
                            eprSupportingDocuments = 1;
                            _o.label = 22;
                        case 22: return [4 /*yield*/, (0, certification_document_version_util_1.isVendorResubmitCycle)(this.productModel, createProcessProductStewardshipDto.urnNo, session)];
                        case 23:
                            isResubmitCycle = _o.sent();
                            processProductStewardshipData = {
                                vendorId: vendorObjectId_1,
                                urnNo: createProcessProductStewardshipDto.urnNo,
                                seaSupportingDocuments: seaSupportingDocuments_1,
                                qualityManagementDetails: createProcessProductStewardshipDto.qualityManagementDetails || '',
                                qmSupportingDocuments: qmSupportingDocuments,
                                eprImplementedDetails: createProcessProductStewardshipDto.eprImplementedDetails || '',
                                eprGreenPackagingDetails: createProcessProductStewardshipDto.eprGreenPackagingDetails || '',
                                eprSupportingDocuments: eprSupportingDocuments,
                                productStewardshipStatus: createProcessProductStewardshipDto.productStewardshipStatus || 0,
                                updatedDate: now_1,
                            };
                            return [4 /*yield*/, this.processProductStewardshipModel
                                    .findOneAndUpdate({ urnNo: createProcessProductStewardshipDto.urnNo }, {
                                    $set: processProductStewardshipData,
                                    $setOnInsert: {
                                        processProductStewardshipId: processProductStewardshipId,
                                        createdDate: now_1,
                                    },
                                }, { upsert: true, new: true, session: session })
                                    .exec()];
                        case 24:
                            savedProcessProductStewardship_1 = _o.sent();
                            if (!(createProcessProductStewardshipDto.programmeDetails !== undefined)) return [3 /*break*/, 27];
                            normalizedProgrammeRows = this.normalizeProgrammeRows(createProcessProductStewardshipDto.programmeDetails);
                            return [4 /*yield*/, this.processPsStakeholderEduAwarnessModel.updateMany({
                                    urnNo: createProcessProductStewardshipDto.urnNo,
                                    vendorId: vendorObjectId_1,
                                    isDeleted: { $ne: true },
                                }, {
                                    $set: {
                                        isDeleted: true,
                                        updatedDate: now_1,
                                    },
                                }, { session: session })];
                        case 25:
                            _o.sent();
                            if (!(normalizedProgrammeRows.length > 0)) return [3 /*break*/, 27];
                            rowsToInsert = normalizedProgrammeRows.map(function (row) { return ({
                                vendorId: vendorObjectId_1,
                                urnNo: createProcessProductStewardshipDto.urnNo,
                                processProductStewardshipId: savedProcessProductStewardship_1._id,
                                seaProgramDetails: row.seaProgramDetails,
                                seaNoOfPrograms: row.seaNoOfPrograms,
                                seaSupportingDocuments: seaSupportingDocuments_1,
                                productStewardshipStatus: createProcessProductStewardshipDto.productStewardshipStatus || 0,
                                createdDate: now_1,
                                updatedDate: now_1,
                                isDeleted: false,
                            }); });
                            return [4 /*yield*/, this.processPsStakeholderEduAwarnessModel.insertMany(rowsToInsert, { session: session })];
                        case 26:
                            _o.sent();
                            _o.label = 27;
                        case 27:
                            if (!(seaFilePaths.length > 0)) return [3 /*break*/, 34];
                            docsToInsert = [];
                            i = 0;
                            _o.label = 28;
                        case 28:
                            if (!(i < seaFilePaths.length)) return [3 /*break*/, 31];
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 29:
                            productDocumentId = _o.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId_1,
                                urnNo: createProcessProductStewardshipDto.urnNo,
                                eoiNo: '',
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
                                documentFormSubsection: 'sea_supporting_documents',
                                formPrimaryId: savedProcessProductStewardship_1.processProductStewardshipId,
                                documentName: seaDisplayName || seaStoredNames[i],
                                documentOriginalName: seaFiles[i].originalname,
                                documentLink: seaFilePaths[i],
                                createdDate: now_1,
                                updatedDate: now_1,
                            });
                            _o.label = 30;
                        case 30:
                            i++;
                            return [3 /*break*/, 28];
                        case 31: return [4 /*yield*/, this.allProductDocumentModel.insertMany(docsToInsert, { session: session })];
                        case 32:
                            insertedSeaDocs = _o.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackInsertedCertificationDocuments)({
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: createProcessProductStewardshipDto.urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
                                    userId: vendorObjectId_1,
                                    vendorId: vendorObjectId_1,
                                    insertedDocs: insertedSeaDocs,
                                    isResubmitCycle: isResubmitCycle,
                                    session: session,
                                    filesByIndex: seaFiles,
                                })];
                        case 33:
                            _o.sent();
                            _o.label = 34;
                        case 34:
                            if (!(qmFilePaths.length > 0)) return [3 /*break*/, 41];
                            docsToInsert = [];
                            i = 0;
                            _o.label = 35;
                        case 35:
                            if (!(i < qmFilePaths.length)) return [3 /*break*/, 38];
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 36:
                            productDocumentId = _o.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId_1,
                                urnNo: createProcessProductStewardshipDto.urnNo,
                                eoiNo: '',
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
                                documentFormSubsection: 'qm_supporting_documents',
                                formPrimaryId: savedProcessProductStewardship_1.processProductStewardshipId,
                                documentName: qmDisplayName || qmStoredNames[i],
                                documentOriginalName: qmFiles[i].originalname,
                                documentLink: qmFilePaths[i],
                                createdDate: now_1,
                                updatedDate: now_1,
                            });
                            _o.label = 37;
                        case 37:
                            i++;
                            return [3 /*break*/, 35];
                        case 38: return [4 /*yield*/, this.allProductDocumentModel.insertMany(docsToInsert, { session: session })];
                        case 39:
                            insertedQmDocs = _o.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackInsertedCertificationDocuments)({
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: createProcessProductStewardshipDto.urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
                                    userId: vendorObjectId_1,
                                    vendorId: vendorObjectId_1,
                                    insertedDocs: insertedQmDocs,
                                    isResubmitCycle: isResubmitCycle,
                                    session: session,
                                    filesByIndex: qmFiles,
                                })];
                        case 40:
                            _o.sent();
                            _o.label = 41;
                        case 41:
                            if (!(eprFilePaths.length > 0)) return [3 /*break*/, 48];
                            docsToInsert = [];
                            i = 0;
                            _o.label = 42;
                        case 42:
                            if (!(i < eprFilePaths.length)) return [3 /*break*/, 45];
                            return [4 /*yield*/, this.sequenceHelper.getProductDocumentId()];
                        case 43:
                            productDocumentId = _o.sent();
                            docsToInsert.push({
                                productDocumentId: productDocumentId,
                                vendorId: vendorObjectId_1,
                                urnNo: createProcessProductStewardshipDto.urnNo,
                                eoiNo: '',
                                documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
                                documentFormSubsection: 'epr_supporting_documents',
                                formPrimaryId: savedProcessProductStewardship_1.processProductStewardshipId,
                                documentName: eprDisplayName || eprStoredNames[i],
                                documentOriginalName: eprFiles[i].originalname,
                                documentLink: eprFilePaths[i],
                                createdDate: now_1,
                                updatedDate: now_1,
                            });
                            _o.label = 44;
                        case 44:
                            i++;
                            return [3 /*break*/, 42];
                        case 45: return [4 /*yield*/, this.allProductDocumentModel.insertMany(docsToInsert, { session: session })];
                        case 46:
                            insertedEprDocs = _o.sent();
                            return [4 /*yield*/, (0, certification_document_version_util_1.trackInsertedCertificationDocuments)({
                                    versioning: this.documentVersioningService,
                                    documentModel: this.allProductDocumentModel,
                                    urnNo: createProcessProductStewardshipDto.urnNo,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
                                    userId: vendorObjectId_1,
                                    vendorId: vendorObjectId_1,
                                    insertedDocs: insertedEprDocs,
                                    isResubmitCycle: isResubmitCycle,
                                    session: session,
                                    filesByIndex: eprFiles,
                                })];
                        case 47:
                            _o.sent();
                            _o.label = 48;
                        case 48: return [4 /*yield*/, session.commitTransaction()];
                        case 49:
                            _o.sent();
                            session.endSession();
                            uploadedDocumentCount = seaFilePaths.length + qmFilePaths.length + eprFilePaths.length;
                            this.documentUploadNotification.notifyAfterDocumentsUploaded(vendorId, uploadedDocumentCount, createProcessProductStewardshipDto.urnNo);
                            for (_d = 0, oldFileLinksToDeleteAfterCommit_1 = oldFileLinksToDeleteAfterCommit; _d < oldFileLinksToDeleteAfterCommit_1.length; _d++) {
                                fileLink = oldFileLinksToDeleteAfterCommit_1[_d];
                                normalizedPath = String(fileLink).replace(/\\/g, '/');
                                if (normalizedPath && fs.existsSync(normalizedPath)) {
                                    try {
                                        fs.unlinkSync(normalizedPath);
                                    }
                                    catch (_p) {
                                        // Ignore cleanup issues after successful commit
                                    }
                                }
                            }
                            return [2 /*return*/, savedProcessProductStewardship_1];
                        case 50:
                            error_2 = _o.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 51:
                            _o.sent();
                            session.endSession();
                            // Clean up uploaded files if transaction fails (files were moved to URN folder)
                            try {
                                for (_e = 0, createdFileFullPaths_1 = createdFileFullPaths; _e < createdFileFullPaths_1.length; _e++) {
                                    fullPath = createdFileFullPaths_1[_e];
                                    if (fs.existsSync(fullPath)) {
                                        fs.unlinkSync(fullPath);
                                    }
                                }
                            }
                            catch (cleanupError) {
                                console.error('[Process Product Stewardship] File cleanup error:', cleanupError);
                            }
                            console.error('[Process Product Stewardship] Create error:', error_2);
                            throw new common_1.InternalServerErrorException(error_2.message || 'Failed to create process product stewardship record.');
                        case 52: return [2 /*return*/];
                    }
                });
            });
        };
        return ProcessProductStewardshipService_1;
    }());
    __setFunctionName(_classThis, "ProcessProductStewardshipService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessProductStewardshipService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessProductStewardshipService = _classThis;
}();
exports.ProcessProductStewardshipService = ProcessProductStewardshipService;
