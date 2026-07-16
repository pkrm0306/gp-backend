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
exports.ProcessRenewProductStewardshipService = void 0;
var common_1 = require("@nestjs/common");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var upload_file_util_1 = require("../../utils/upload-file.util");
var renew_section_documents_util_1 = require("../helpers/renew-section-documents.util");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renew_cycle_scope_util_1 = require("../helpers/renew-cycle-scope.util");
var path = require("path");
var ProcessRenewProductStewardshipService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProcessRenewProductStewardshipService = _classThis = /** @class */ (function () {
        function ProcessRenewProductStewardshipService_1(renewStewardshipModel, renewDocumentModel, renewalCycleModel, productModel, connection, sequenceHelper, documentVersioningService) {
            this.renewStewardshipModel = renewStewardshipModel;
            this.renewDocumentModel = renewDocumentModel;
            this.renewalCycleModel = renewalCycleModel;
            this.productModel = productModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.documentVersioningService = documentVersioningService;
        }
        ProcessRenewProductStewardshipService_1.prototype.upsert = function (input, seaFiles, qmFiles, eprFiles) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, cycle, context, urnStatus, ownership, session, now, trimmedUrn, renewalCycleObjectId, headerFilter, existing, processRenewProductStewardshipId, _b, seaSupportingDocuments_1, qmSupportingDocuments_1, eprSupportingDocuments_1, newDocRows, fileGroups, _i, fileGroups_1, group, uploadList, _c, uploadList_1, file, uploaded, _d, _e, saved, error_1;
                var _f;
                var _g, _h, _j, _k, _l, _m, _o, _p;
                return __generator(this, function (_q) {
                    switch (_q.label) {
                        case 0: return [4 /*yield*/, (0, renew_common_util_1.assertRenewProcessEditable)(this.productModel, this.renewalCycleModel, input.urnNo, input.renewalCycleId)];
                        case 1:
                            _a = _q.sent(), cycle = _a.cycle, context = _a.context, urnStatus = _a.urnStatus;
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            session = _q.sent();
                            session.startTransaction();
                            _q.label = 3;
                        case 3:
                            _q.trys.push([3, 18, , 20]);
                            now = new Date();
                            trimmedUrn = ownership.urnNo;
                            renewalCycleObjectId = cycle._id;
                            headerFilter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(trimmedUrn, cycle);
                            return [4 /*yield*/, this.renewStewardshipModel
                                    .findOne(headerFilter)
                                    .session(session)];
                        case 4:
                            existing = _q.sent();
                            if (!((_g = existing === null || existing === void 0 ? void 0 : existing.processRenewProductStewardshipId) !== null && _g !== void 0)) return [3 /*break*/, 5];
                            _b = _g;
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.sequenceHelper.getProcessRenewProductStewardshipId()];
                        case 6:
                            _b = (_q.sent());
                            _q.label = 7;
                        case 7:
                            processRenewProductStewardshipId = _b;
                            seaSupportingDocuments_1 = (_h = existing === null || existing === void 0 ? void 0 : existing.seaSupportingDocuments) !== null && _h !== void 0 ? _h : 0;
                            qmSupportingDocuments_1 = (_j = existing === null || existing === void 0 ? void 0 : existing.qmSupportingDocuments) !== null && _j !== void 0 ? _j : 0;
                            eprSupportingDocuments_1 = (_k = existing === null || existing === void 0 ? void 0 : existing.eprSupportingDocuments) !== null && _k !== void 0 ? _k : 0;
                            newDocRows = [];
                            fileGroups = [
                                { files: seaFiles, subsection: 'sea_supporting_documents', flag: function () { seaSupportingDocuments_1 = 1; } },
                                { files: qmFiles, subsection: 'qm_supporting_documents', flag: function () { qmSupportingDocuments_1 = 1; } },
                                { files: eprFiles, subsection: 'epr_supporting_documents', flag: function () { eprSupportingDocuments_1 = 1; } },
                            ];
                            _i = 0, fileGroups_1 = fileGroups;
                            _q.label = 8;
                        case 8:
                            if (!(_i < fileGroups_1.length)) return [3 /*break*/, 14];
                            group = fileGroups_1[_i];
                            uploadList = Array.isArray(group.files) ? group.files : [];
                            if (uploadList.length > 0) {
                                group.flag();
                            }
                            _c = 0, uploadList_1 = uploadList;
                            _q.label = 9;
                        case 9:
                            if (!(_c < uploadList_1.length)) return [3 /*break*/, 13];
                            file = uploadList_1[_c];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, (0, renew_common_util_1.renewUploadPath)(trimmedUrn))];
                        case 10:
                            uploaded = _q.sent();
                            _e = (_d = newDocRows).push;
                            _f = {};
                            return [4 /*yield*/, this.sequenceHelper.getRenewProductDocumentId()];
                        case 11:
                            _e.apply(_d, [(_f.productDocumentId = _q.sent(),
                                    _f.documentFormSubsection = group.subsection,
                                    _f.documentName = path.basename(uploaded.fileUrl),
                                    _f.documentOriginalName = file.originalname,
                                    _f.documentLink = uploaded.fileUrl,
                                    _f)]);
                            _q.label = 12;
                        case 12:
                            _c++;
                            return [3 /*break*/, 9];
                        case 13:
                            _i++;
                            return [3 /*break*/, 8];
                        case 14: return [4 /*yield*/, this.renewStewardshipModel
                                .findOneAndUpdate(headerFilter, {
                                $set: {
                                    vendorId: ownership.vendorId,
                                    manufacturerId: ownership.manufacturerId,
                                    renewalCycleId: renewalCycleObjectId,
                                    qualityManagementDetails: (_l = input.qualityManagementDetails) !== null && _l !== void 0 ? _l : '',
                                    eprImplementedDetails: (_m = input.eprImplementedDetails) !== null && _m !== void 0 ? _m : '',
                                    eprGreenPackagingDetails: (_o = input.eprGreenPackagingDetails) !== null && _o !== void 0 ? _o : '',
                                    seaSupportingDocuments: seaSupportingDocuments_1,
                                    qmSupportingDocuments: qmSupportingDocuments_1,
                                    eprSupportingDocuments: eprSupportingDocuments_1,
                                    productStewardshipStatus: (_p = input.productStewardshipStatus) !== null && _p !== void 0 ? _p : 0,
                                    updatedDate: now,
                                },
                                $setOnInsert: {
                                    processRenewProductStewardshipId: processRenewProductStewardshipId,
                                    urnNo: trimmedUrn,
                                    createdDate: now,
                                },
                            }, { upsert: true, new: true, session: session })
                                .exec()];
                        case 15:
                            saved = _q.sent();
                            return [4 /*yield*/, (0, renew_section_documents_util_1.insertRenewSectionDocuments)({
                                    renewDocumentModel: this.renewDocumentModel,
                                    documentVersioningService: this.documentVersioningService,
                                    urnNo: trimmedUrn,
                                    vendorObjectId: ownership.vendorId,
                                    manufacturerObjectId: ownership.manufacturerId,
                                    renewalCycleObjectId: renewalCycleObjectId,
                                    sectionKey: document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
                                    formPrimaryId: processRenewProductStewardshipId,
                                    urnStatus: urnStatus,
                                    now: now,
                                    session: session,
                                    rows: newDocRows,
                                    slotKeyMode: 'subsection',
                                })];
                        case 16:
                            _q.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 17:
                            _q.sent();
                            session.endSession();
                            return [2 /*return*/, saved];
                        case 18:
                            error_1 = _q.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 19:
                            _q.sent();
                            session.endSession();
                            throw new common_1.InternalServerErrorException(error_1.message || 'Failed to save renew product stewardship');
                        case 20: return [2 /*return*/];
                    }
                });
            });
        };
        ProcessRenewProductStewardshipService_1.prototype.getByUrn = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, cycle, _a, headerFilter, header, documentFilter, documents;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.renewalCycleModel.findById(renewalCycleId.trim()).exec()];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.renewalCycleModel
                                .findOne({ urnNo: trimmedUrn, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS })
                                .sort({ cycleNo: -1 })
                                .exec()];
                        case 3:
                            _a = _b.sent();
                            _b.label = 4;
                        case 4:
                            cycle = _a;
                            headerFilter = (0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)(trimmedUrn, cycle);
                            return [4 /*yield*/, this.renewStewardshipModel
                                    .findOne(headerFilter)
                                    .lean()
                                    .exec()];
                        case 5:
                            header = _b.sent();
                            documentFilter = (cycle === null || cycle === void 0 ? void 0 : cycle._id)
                                ? {
                                    urnNo: trimmedUrn,
                                    renewalCycleId: cycle._id,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
                                    isDeleted: { $ne: true },
                                }
                                : {
                                    urnNo: trimmedUrn,
                                    documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
                                    isDeleted: { $ne: true },
                                };
                            return [4 /*yield*/, this.renewDocumentModel
                                    .find(documentFilter)
                                    .lean()
                                    .exec()];
                        case 6:
                            documents = _b.sent();
                            return [2 /*return*/, { header: header, documents: documents }];
                    }
                });
            });
        };
        return ProcessRenewProductStewardshipService_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewProductStewardshipService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewProductStewardshipService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewProductStewardshipService = _classThis;
}();
exports.ProcessRenewProductStewardshipService = ProcessRenewProductStewardshipService;
