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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRenewDocumentIdRefs = resolveRenewDocumentIdRefs;
exports.renewDocumentMatchesIdRefs = renewDocumentMatchesIdRefs;
exports.buildRenewSectionDocMigrationFilter = buildRenewSectionDocMigrationFilter;
exports.assertRenewDocumentMatchesCycle = assertRenewDocumentMatchesCycle;
exports.renewSectionDocumentSlotKeyMode = renewSectionDocumentSlotKeyMode;
exports.applyRenewSectionDocumentKeepList = applyRenewSectionDocumentKeepList;
exports.insertRenewSectionDocuments = insertRenewSectionDocuments;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var certification_document_version_util_1 = require("../../documents/helpers/certification-document-version.util");
var product_document_version_integration_1 = require("../../documents/helpers/product-document-version.integration");
function resolveRenewDocumentIdRefs(ids) {
    var objectIds = [];
    var productDocumentIds = [];
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var raw = ids_1[_i];
        var value = String(raw).trim();
        if (!value)
            continue;
        if (mongoose_1.Types.ObjectId.isValid(value)) {
            objectIds.push(new mongoose_1.Types.ObjectId(value));
            continue;
        }
        var numericId = Number(value);
        if (Number.isFinite(numericId)) {
            productDocumentIds.push(numericId);
        }
    }
    return { objectIds: objectIds, productDocumentIds: productDocumentIds };
}
function renewDocumentMatchesIdRefs(doc, refs) {
    if (doc._id &&
        refs.objectIds.some(function (id) { return id.equals(doc._id); })) {
        return true;
    }
    return (doc.productDocumentId !== undefined &&
        refs.productDocumentIds.includes(doc.productDocumentId));
}
function buildRenewSectionDocMigrationFilter(urnNo, renewalCycleObjectId, sectionKey, strictCycleOnly) {
    var base = {
        urnNo: urnNo.trim(),
        documentForm: sectionKey,
        isDeleted: { $ne: true },
    };
    if (strictCycleOnly) {
        return __assign(__assign({}, base), { renewalCycleId: renewalCycleObjectId });
    }
    return __assign(__assign({}, base), { $or: [
            { renewalCycleId: renewalCycleObjectId },
            { renewalCycleId: null },
            { renewalCycleId: { $exists: false } },
        ] });
}
function assertRenewDocumentMatchesCycle(document, requestedCycleId, cycleNo) {
    var docCycle = document.renewalCycleId;
    if (!docCycle) {
        if (cycleNo > 1) {
            throw new common_1.ForbiddenException('renewalCycleId does not match document cycle');
        }
        return;
    }
    if (!docCycle.equals(requestedCycleId)) {
        throw new common_1.ForbiddenException('renewalCycleId does not match document cycle');
    }
}
function renewSectionDocumentSlotKeyMode(sectionKey) {
    if (sectionKey === document_section_key_constants_1.DocumentSectionKey.PROCESS_INNOVATION) {
        return 'subsectionTag';
    }
    if (sectionKey === document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING ||
        sectionKey === document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT) {
        return 'productDocumentId';
    }
    return 'subsection';
}
function applyRenewSectionDocumentKeepList(params) {
    return __awaiter(this, void 0, void 0, function () {
        var renewDocumentModel, documentVersioningService, urnNo, vendorObjectId, renewalCycleObjectId, cycleNo, sectionKey, existingDocumentIds, urnStatus, now, session, keepRefs, baseFilter, existingDocs, deleteIds, docsToDelete, oldFileLinksToDeleteAfterCommit, _i, existingDocs_1, doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    renewDocumentModel = params.renewDocumentModel, documentVersioningService = params.documentVersioningService, urnNo = params.urnNo, vendorObjectId = params.vendorObjectId, renewalCycleObjectId = params.renewalCycleObjectId, cycleNo = params.cycleNo, sectionKey = params.sectionKey, existingDocumentIds = params.existingDocumentIds, urnStatus = params.urnStatus, now = params.now, session = params.session;
                    if (existingDocumentIds === undefined) {
                        return [2 /*return*/, []];
                    }
                    keepRefs = resolveRenewDocumentIdRefs(existingDocumentIds);
                    baseFilter = buildRenewSectionDocMigrationFilter(urnNo, renewalCycleObjectId, sectionKey, cycleNo > 1);
                    return [4 /*yield*/, renewDocumentModel.find(baseFilter).session(session)];
                case 1:
                    existingDocs = _a.sent();
                    deleteIds = [];
                    docsToDelete = [];
                    oldFileLinksToDeleteAfterCommit = [];
                    _i = 0, existingDocs_1 = existingDocs;
                    _a.label = 2;
                case 2:
                    if (!(_i < existingDocs_1.length)) return [3 /*break*/, 6];
                    doc = existingDocs_1[_i];
                    if (!renewDocumentMatchesIdRefs(doc, keepRefs)) return [3 /*break*/, 4];
                    return [4 /*yield*/, renewDocumentModel.updateOne({ _id: doc._id }, {
                            $set: {
                                renewalCycleId: renewalCycleObjectId,
                                updatedDate: now,
                            },
                        }, { session: session })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    deleteIds.push(doc._id);
                    docsToDelete.push(doc);
                    if (doc.documentLink) {
                        oldFileLinksToDeleteAfterCommit.push(doc.documentLink);
                    }
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    if (!deleteIds.length) return [3 /*break*/, 9];
                    return [4 /*yield*/, renewDocumentModel.updateMany({ _id: { $in: deleteIds } }, {
                            $set: {
                                isDeleted: true,
                                deletedAt: now,
                                deletedBy: vendorObjectId,
                                updatedDate: now,
                            },
                        }, { session: session })];
                case 7:
                    _a.sent();
                    if (!(0, certification_document_version_util_1.isRenewVendorResubmitCycle)(urnStatus)) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, product_document_version_integration_1.trackProductDocumentDeleteBatch)({
                            versioning: documentVersioningService,
                            urnNo: urnNo,
                            sectionKey: sectionKey,
                            userId: vendorObjectId,
                            docs: docsToDelete,
                            slotKeyMode: renewSectionDocumentSlotKeyMode(sectionKey),
                            processType: 'renewal',
                            renewalCycleId: renewalCycleObjectId,
                            session: session,
                        })];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [2 /*return*/, oldFileLinksToDeleteAfterCommit];
            }
        });
    });
}
function insertRenewSectionDocuments(params) {
    return __awaiter(this, void 0, void 0, function () {
        var renewDocumentModel, documentVersioningService, urnNo, vendorObjectId, manufacturerObjectId, renewalCycleObjectId, sectionKey, formPrimaryId, urnStatus, now, session, rows, _a, slotKeyMode, trackVersions, versionActions, _i, rows_1, row, slotFilter, existingInSlot, docsToInsert, inserted, i, doc, action;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    renewDocumentModel = params.renewDocumentModel, documentVersioningService = params.documentVersioningService, urnNo = params.urnNo, vendorObjectId = params.vendorObjectId, manufacturerObjectId = params.manufacturerObjectId, renewalCycleObjectId = params.renewalCycleObjectId, sectionKey = params.sectionKey, formPrimaryId = params.formPrimaryId, urnStatus = params.urnStatus, now = params.now, session = params.session, rows = params.rows, _a = params.slotKeyMode, slotKeyMode = _a === void 0 ? 'subsection' : _a;
                    if (!rows.length) {
                        return [2 /*return*/];
                    }
                    trackVersions = (0, certification_document_version_util_1.isRenewVendorResubmitCycle)(urnStatus);
                    versionActions = [];
                    if (!(trackVersions && (slotKeyMode === 'subsection' || slotKeyMode === 'subsectionTag'))) return [3 /*break*/, 4];
                    _i = 0, rows_1 = rows;
                    _f.label = 1;
                case 1:
                    if (!(_i < rows_1.length)) return [3 /*break*/, 4];
                    row = rows_1[_i];
                    slotFilter = {
                        urnNo: urnNo,
                        renewalCycleId: renewalCycleObjectId,
                        documentForm: sectionKey,
                        documentFormSubsection: row.documentFormSubsection,
                        isDeleted: { $ne: true },
                    };
                    if (slotKeyMode === 'subsectionTag') {
                        slotFilter.documentTag = (_b = row.documentTag) !== null && _b !== void 0 ? _b : 'tech';
                    }
                    return [4 /*yield*/, renewDocumentModel
                            .countDocuments(slotFilter)
                            .session(session)];
                case 2:
                    existingInSlot = _f.sent();
                    versionActions.push((0, certification_document_version_util_1.resolveRenewDocumentVersionAction)(existingInSlot, urnStatus));
                    _f.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    docsToInsert = rows.map(function (row) { return ({
                        productDocumentId: row.productDocumentId,
                        vendorId: vendorObjectId,
                        manufacturerId: manufacturerObjectId,
                        urnNo: urnNo,
                        renewalCycleId: renewalCycleObjectId,
                        eoiNo: row.eoiNo,
                        documentForm: sectionKey,
                        documentFormSubsection: row.documentFormSubsection,
                        formPrimaryId: formPrimaryId,
                        documentName: row.documentName,
                        documentOriginalName: row.documentOriginalName,
                        documentLink: row.documentLink,
                        documentTag: row.documentTag,
                        createdDate: now,
                        updatedDate: now,
                    }); });
                    return [4 /*yield*/, renewDocumentModel.insertMany(docsToInsert, { session: session })];
                case 5:
                    inserted = _f.sent();
                    if (!(trackVersions && (slotKeyMode === 'subsection' || slotKeyMode === 'subsectionTag'))) return [3 /*break*/, 10];
                    i = 0;
                    _f.label = 6;
                case 6:
                    if (!(i < inserted.length)) return [3 /*break*/, 9];
                    doc = inserted[i];
                    action = versionActions[i];
                    if (!action)
                        return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, product_document_version_integration_1.trackUploadedProductDocument)(documentVersioningService, __assign(__assign({ urnNo: urnNo, sectionKey: sectionKey, subsectionKey: doc.documentFormSubsection }, (slotKeyMode === 'subsectionTag'
                            ? { documentTag: (_e = (_c = doc.documentTag) !== null && _c !== void 0 ? _c : (_d = rows[i]) === null || _d === void 0 ? void 0 : _d.documentTag) !== null && _e !== void 0 ? _e : 'tech' }
                            : {})), { userId: vendorObjectId, documentId: doc._id, productDocumentId: doc.productDocumentId, filePath: doc.documentLink, originalName: doc.documentOriginalName, storedName: doc.documentName, action: action, slotKeyMode: slotKeyMode, processType: 'renewal', renewalCycleId: renewalCycleObjectId, session: session }))];
                case 7:
                    _f.sent();
                    _f.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9: return [2 /*return*/];
                case 10:
                    if (!(trackVersions && slotKeyMode === 'productDocumentId')) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, product_document_version_integration_1.trackProductDocumentBatch)({
                            versioning: documentVersioningService,
                            urnNo: urnNo,
                            sectionKey: sectionKey,
                            userId: vendorObjectId,
                            docs: inserted,
                            processType: 'renewal',
                            renewalCycleId: renewalCycleObjectId,
                            session: session,
                        })];
                case 11:
                    _f.sent();
                    _f.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    });
}
