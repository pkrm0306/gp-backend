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
exports.ProcessRenewWasteManagementService = void 0;
var common_1 = require("@nestjs/common");
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var upload_file_util_1 = require("../../utils/upload-file.util");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renew_cycle_scope_util_1 = require("../helpers/renew-cycle-scope.util");
var renew_section_documents_util_1 = require("../helpers/renew-section-documents.util");
var upload_file_util_2 = require("../../utils/upload-file.util");
var path = require("path");
var ProcessRenewWasteManagementService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessRenewWasteManagementService = _classThis = /** @class */ (function () {
        function ProcessRenewWasteManagementService_1(renewWasteModel, renewDocumentModel, renewalCycleModel, productModel, connection, sequenceHelper, documentVersioningService) {
            this.renewWasteModel = renewWasteModel;
            this.renewDocumentModel = renewDocumentModel;
            this.renewalCycleModel = renewalCycleModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentVersioningService = documentVersioningService;
        }
        ProcessRenewWasteManagementService_1.prototype.upsert = function (input, files) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, cycle, context, urnStatus, ownership, renewalCycleObjectId, headerFilter, session, now, trimmedUrn, existing, processRenewWasteManagementId, _b, wmSupportingDocuments, uploadedFiles, filePaths, _i, uploadedFiles_1, file, uploaded, oldFileLinksToDeleteAfterCommit, saved, newDocRows, i, _c, _d, _e, oldFileLinksToDeleteAfterCommit_1, link, error_1;
                var _f;
                var _g, _h, _j, _k, _l;
                return __generator(this, function (_m) {
                    switch (_m.label) {
                        case 0: return [4 /*yield*/, (0, renew_common_util_1.assertRenewProcessEditable)(this.productModel, this.renewalCycleModel, input.urnNo, input.renewalCycleId)];
                        case 1:
                            _a = _m.sent(), cycle = _a.cycle, context = _a.context, urnStatus = _a.urnStatus;
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            renewalCycleObjectId = cycle._id;
                            headerFilter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(ownership.urnNo, cycle);
                            return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            session = _m.sent();
                            session.startTransaction();
                            _m.label = 3;
                        case 3:
                            _m.trys.push([3, 24, , 26]);
                            now = new Date();
                            trimmedUrn = ownership.urnNo;
                            return [4 /*yield*/, this.renewWasteModel
                                    .findOne(headerFilter)
                                    .session(session)];
                        case 4:
                            existing = _m.sent();
                            if (!((_g = existing === null || existing === void 0 ? void 0 : existing.processRenewWasteManagementId) !== null && _g !== void 0)) return [3 /*break*/, 5];
                            _b = _g;
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.sequenceHelper.getProcessRenewWasteManagementId()];
                        case 6:
                            _b = (_m.sent());
                            _m.label = 7;
                        case 7:
                            processRenewWasteManagementId = _b;
                            wmSupportingDocuments = (_h = existing === null || existing === void 0 ? void 0 : existing.wmSupportingDocuments) !== null && _h !== void 0 ? _h : 0;
                            uploadedFiles = Array.isArray(files) ? files : [];
                            filePaths = [];
                            _i = 0, uploadedFiles_1 = uploadedFiles;
                            _m.label = 8;
                        case 8:
                            if (!(_i < uploadedFiles_1.length)) return [3 /*break*/, 11];
                            file = uploadedFiles_1[_i];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, (0, renew_common_util_1.renewUploadPath)(trimmedUrn))];
                        case 9:
                            uploaded = _m.sent();
                            filePaths.push(uploaded.fileUrl);
                            _m.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 8];
                        case 11:
                            if (filePaths.length > 0) {
                                wmSupportingDocuments = 1;
                            }
                            return [4 /*yield*/, (0, renew_section_documents_util_1.applyRenewSectionDocumentKeepList)({
                                    renewDocumentModel: this.renewDocumentModel,
                                    documentVersioningService: this.documentVersioningService,
                                    urnNo: trimmedUrn,
                                    vendorObjectId: ownership.vendorId,
                                    renewalCycleObjectId: renewalCycleObjectId,
                                    cycleNo: Number((_j = cycle.cycleNo) !== null && _j !== void 0 ? _j : 1),
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
                                    existingDocumentIds: input.existingDocumentIds,
                                    urnStatus: urnStatus,
                                    now: now,
                                    session: session,
                                })];
                        case 12:
                            oldFileLinksToDeleteAfterCommit = _m.sent();
                            return [4 /*yield*/, this.renewWasteModel
                                    .findOneAndUpdate(headerFilter, {
                                    $set: {
                                        vendorId: ownership.vendorId,
                                        manufacturerId: ownership.manufacturerId,
                                        renewalCycleId: renewalCycleObjectId,
                                        wmImplementationDetails: (_k = input.wmImplementationDetails) !== null && _k !== void 0 ? _k : '',
                                        wmSupportingDocuments: wmSupportingDocuments,
                                        processWasteManagementStatus: (_l = input.processWasteManagementStatus) !== null && _l !== void 0 ? _l : 0,
                                        updatedDate: now,
                                    },
                                    $setOnInsert: {
                                        processRenewWasteManagementId: processRenewWasteManagementId,
                                        urnNo: trimmedUrn,
                                        createdDate: now,
                                    },
                                }, { upsert: true, new: true, session: session })
                                    .exec()];
                        case 13:
                            saved = _m.sent();
                            newDocRows = [];
                            i = 0;
                            _m.label = 14;
                        case 14:
                            if (!(i < filePaths.length)) return [3 /*break*/, 17];
                            _d = (_c = newDocRows).push;
                            _f = {};
                            return [4 /*yield*/, this.sequenceHelper.getRenewProductDocumentId()];
                        case 15:
                            _d.apply(_c, [(_f.productDocumentId = _m.sent(),
                                    _f.documentFormSubsection = 'wm_supporting_documents',
                                    _f.documentName = path.basename(filePaths[i]),
                                    _f.documentOriginalName = uploadedFiles[i].originalname,
                                    _f.documentLink = filePaths[i],
                                    _f)]);
                            _m.label = 16;
                        case 16:
                            i++;
                            return [3 /*break*/, 14];
                        case 17: return [4 /*yield*/, (0, renew_section_documents_util_1.insertRenewSectionDocuments)({
                                renewDocumentModel: this.renewDocumentModel,
                                documentVersioningService: this.documentVersioningService,
                                urnNo: trimmedUrn,
                                vendorObjectId: ownership.vendorId,
                                manufacturerObjectId: ownership.manufacturerId,
                                renewalCycleObjectId: renewalCycleObjectId,
                                sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
                                formPrimaryId: saved.processRenewWasteManagementId,
                                urnStatus: urnStatus,
                                now: now,
                                session: session,
                                rows: newDocRows,
                                slotKeyMode: (0, renew_section_documents_util_1.renewSectionDocumentSlotKeyMode)(document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT),
                            })];
                        case 18:
                            _m.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 19:
                            _m.sent();
                            session.endSession();
                            _e = 0, oldFileLinksToDeleteAfterCommit_1 = oldFileLinksToDeleteAfterCommit;
                            _m.label = 20;
                        case 20:
                            if (!(_e < oldFileLinksToDeleteAfterCommit_1.length)) return [3 /*break*/, 23];
                            link = oldFileLinksToDeleteAfterCommit_1[_e];
                            return [4 /*yield*/, (0, upload_file_util_2.deleteUploadedFileByDocumentLink)(link).catch(function () { return undefined; })];
                        case 21:
                            _m.sent();
                            _m.label = 22;
                        case 22:
                            _e++;
                            return [3 /*break*/, 20];
                        case 23: return [2 /*return*/, saved];
                        case 24:
                            error_1 = _m.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 25:
                            _m.sent();
                            session.endSession();
                            throw new common_1.InternalServerErrorException(error_1.message || 'Failed to save renew waste management');
                        case 26: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessRenewWasteManagementService_1.prototype.getByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, cycle, headerFilter, header, docFilter, documents;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            cycle = null;
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.renewalCycleModel.findById(renewalCycleId.trim()).exec()];
                        case 1:
                            cycle = _b.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.renewalCycleModel
                                .findOne({ urnNo: trimmedUrn, status: 'in_progress' })
                                .sort({ cycleNo: -1 })
                                .exec()];
                        case 3:
                            cycle = _b.sent();
                            _b.label = 4;
                        case 4:
                            headerFilter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(trimmedUrn, cycle);
                            return [4 /*yield*/, this.renewWasteModel.findOne(headerFilter).lean().exec()];
                        case 5:
                            header = _b.sent();
                            docFilter = (cycle === null || cycle === void 0 ? void 0 : cycle._id) != null
                                ? (0, renew_section_documents_util_1.buildRenewSectionDocMigrationFilter)(trimmedUrn, cycle._id, document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT, Number((_a = cycle.cycleNo) !== null && _a !== void 0 ? _a : 1) > 1)
                                : {
                                    urnNo: trimmedUrn,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
                                    isDeleted: { $ne: true },
                                };
                            return [4 /*yield*/, this.renewDocumentModel.find(docFilter).lean().exec()];
                        case 6:
                            documents = _b.sent();
                            return [2 /*return*/, { header: header, documents: documents }];
                    }
                });
            });
        };
        return ProcessRenewWasteManagementService_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewWasteManagementService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewWasteManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewWasteManagementService = _classThis;
}();
exports.ProcessRenewWasteManagementService = ProcessRenewWasteManagementService;
