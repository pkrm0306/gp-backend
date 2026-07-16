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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVendorResubmitCycle = isVendorResubmitCycle;
exports.resolveCertificationVersionAction = resolveCertificationVersionAction;
exports.isRenewVendorResubmitCycle = isRenewVendorResubmitCycle;
exports.resolveRenewDocumentVersionAction = resolveRenewDocumentVersionAction;
exports.certificationSlotKeyModeForSection = certificationSlotKeyModeForSection;
exports.normalizeCertificationSubsection = normalizeCertificationSubsection;
exports.certificationSlotKey = certificationSlotKey;
exports.certificationStreamSlotKeyForDocument = certificationStreamSlotKeyForDocument;
exports.usesRenewPerDocumentVersionSlot = usesRenewPerDocumentVersionSlot;
exports.renewDocumentVersionSlotKey = renewDocumentVersionSlotKey;
exports.countCertificationDocsInSlot = countCertificationDocsInSlot;
exports.trackInsertedCertificationDocuments = trackInsertedCertificationDocuments;
exports.trackSingleCertificationDocument = trackSingleCertificationDocument;
exports.trackCertificationDocumentAfterCreate = trackCertificationDocumentAfterCreate;
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var active_product_filter_1 = require("../../product-registration/constants/active-product.filter");
var urn_tab_review_constants_1 = require("../../product-registration/constants/urn-tab-review.constants");
var document_version_helper_1 = require("./document-version.helper");
var renewal_urn_status_constants_1 = require("../../renew/constants/renewal-urn-status.constants");
var product_document_version_integration_1 = require("./product-document-version.integration");
function isVendorResubmitCycle(productModel, urnNo, session) {
    return __awaiter(this, void 0, void 0, function () {
        var query, product;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = productModel
                        .findOne((0, active_product_filter_1.matchActiveProducts)({ urnNo: urnNo.trim() }))
                        .select('urnStatus')
                        .lean();
                    if (session) {
                        query.session(session);
                    }
                    return [4 /*yield*/, query.exec()];
                case 1:
                    product = _a.sent();
                    return [2 /*return*/, Number(product === null || product === void 0 ? void 0 : product.urnStatus) === urn_tab_review_constants_1.VENDOR_RESUBMIT_URN_STATUS];
            }
        });
    });
}
/** Version on first upload (v1) or admin resend re-upload (v2+). Skip otherwise. */
function resolveCertificationVersionAction(existingDocsInSlot, isResubmitCycle) {
    if (existingDocsInSlot === 0) {
        return 'added';
    }
    if (isResubmitCycle) {
        return 'replaced';
    }
    return null;
}
/** Admin sent renewal URN back to vendor for corrections (urnStatus 16). */
function isRenewVendorResubmitCycle(urnStatus) {
    return urnStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING;
}
/** Renewal: version only after admin resend; first resubmit upload is v1, replacements v2+. */
function resolveRenewDocumentVersionAction(priorDocsInSlot, urnStatus) {
    if (!isRenewVendorResubmitCycle(urnStatus)) {
        return null;
    }
    if (priorDocsInSlot === 0) {
        return 'added';
    }
    return 'replaced';
}
function certificationSlotKeyModeForSection(sectionKey) {
    return sectionKey === document_section_key_constants_1.DocumentSectionKey.PROCESS_INNOVATION
        ? 'subsectionTag'
        : 'subsection';
}
/** Align renew + initial certification subsection keys (e.g. product_performance → test_report_files). */
function normalizeCertificationSubsection(sectionKey, subsection) {
    var section = String(sectionKey !== null && sectionKey !== void 0 ? sectionKey : '').trim();
    var raw = (subsection !== null && subsection !== void 0 ? subsection : '').trim().toLowerCase();
    if (section === document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE) {
        if (!raw || raw === 'product_performance') {
            return 'test_report_files';
        }
        return raw;
    }
    return (subsection === null || subsection === void 0 ? void 0 : subsection.trim()) || null;
}
function certificationSlotKey(sectionKey, subsection, documentTag) {
    var normalizedSubsection = normalizeCertificationSubsection(sectionKey, subsection);
    if (certificationSlotKeyModeForSection(sectionKey) === 'subsectionTag') {
        return (0, document_version_helper_1.slotKeyFromSubsectionAndTag)(normalizedSubsection, documentTag);
    }
    return (0, document_version_helper_1.slotKeyFromSubsection)(normalizedSubsection);
}
/** Subsection/tag slot for certification docs; productDocumentId for legacy/non-cert rows. */
function certificationStreamSlotKeyForDocument(doc) {
    var _a;
    var sectionKey = String((_a = doc.documentForm) !== null && _a !== void 0 ? _a : '').trim();
    if (sectionKey.startsWith('product_') ||
        sectionKey.startsWith('process_') ||
        sectionKey.startsWith('raw_materials')) {
        return certificationSlotKey(sectionKey, doc.documentFormSubsection, doc.documentTag);
    }
    return (0, document_version_helper_1.slotKeyFromProductDocumentId)(doc.productDocumentId);
}
/** Renew MP/WM/PP supporting uploads: one version stream per productDocumentId (not per subsection). */
function usesRenewPerDocumentVersionSlot(sectionKey) {
    return (sectionKey === document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING ||
        sectionKey === document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT ||
        sectionKey === document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE);
}
function renewDocumentVersionSlotKey(doc) {
    var _a;
    var sectionKey = String((_a = doc.documentForm) !== null && _a !== void 0 ? _a : '').trim();
    if (usesRenewPerDocumentVersionSlot(sectionKey)) {
        return (0, document_version_helper_1.slotKeyFromProductDocumentId)(doc.productDocumentId);
    }
    return certificationStreamSlotKeyForDocument(doc);
}
function countCertificationDocsInSlot(model, args, session) {
    return __awaiter(this, void 0, void 0, function () {
        var filter, query;
        return __generator(this, function (_a) {
            filter = {
                vendorId: args.vendorId,
                urnNo: args.urnNo.trim(),
                documentForm: args.documentForm,
                isDeleted: { $ne: true },
            };
            if (args.documentFormSubsection) {
                filter.documentFormSubsection = args.documentFormSubsection;
            }
            if (args.documentTag) {
                filter.documentTag = args.documentTag;
            }
            query = model.countDocuments(filter);
            if (session) {
                query.session(session);
            }
            return [2 /*return*/, query.exec()];
        });
    });
}
/**
 * Append-only uploads: track v1 on first file per slot; v2+ only during admin resend.
 * Multiple files in the same subsection on first submit share one v1 (first file only).
 */
function trackInsertedCertificationDocuments(params) {
    return __awaiter(this, void 0, void 0, function () {
        var versioning, documentModel, urnNo, sectionKey, userId, vendorId, insertedDocs, isResubmitCycle, session, filesByIndex, processType, renewalCycleId, slotKeyMode, slotCounts, batchCountBySlot, _i, insertedDocs_1, doc, slot, _loop_1, _a, batchCountBySlot_1, _b, slot, batchCount, i, doc, slot, priorInSlot, action;
        var _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    versioning = params.versioning, documentModel = params.documentModel, urnNo = params.urnNo, sectionKey = params.sectionKey, userId = params.userId, vendorId = params.vendorId, insertedDocs = params.insertedDocs, isResubmitCycle = params.isResubmitCycle, session = params.session, filesByIndex = params.filesByIndex, processType = params.processType, renewalCycleId = params.renewalCycleId;
                    if (!insertedDocs.length) {
                        return [2 /*return*/];
                    }
                    slotKeyMode = certificationSlotKeyModeForSection(sectionKey);
                    slotCounts = new Map();
                    batchCountBySlot = new Map();
                    for (_i = 0, insertedDocs_1 = insertedDocs; _i < insertedDocs_1.length; _i++) {
                        doc = insertedDocs_1[_i];
                        slot = certificationSlotKey(sectionKey, doc.documentFormSubsection, doc.documentTag);
                        batchCountBySlot.set(slot, ((_c = batchCountBySlot.get(slot)) !== null && _c !== void 0 ? _c : 0) + 1);
                    }
                    _loop_1 = function (slot, batchCount) {
                        var sample, totalCount;
                        return __generator(this, function (_l) {
                            switch (_l.label) {
                                case 0:
                                    sample = insertedDocs.find(function (doc) {
                                        return certificationSlotKey(sectionKey, doc.documentFormSubsection, doc.documentTag) === slot;
                                    });
                                    if (!sample)
                                        return [2 /*return*/, "continue"];
                                    return [4 /*yield*/, countCertificationDocsInSlot(documentModel, {
                                            vendorId: vendorId,
                                            urnNo: urnNo,
                                            documentForm: sectionKey,
                                            documentFormSubsection: sample.documentFormSubsection,
                                            documentTag: sample.documentTag,
                                        }, session)];
                                case 1:
                                    totalCount = _l.sent();
                                    slotCounts.set(slot, Math.max(0, totalCount - batchCount));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, batchCountBySlot_1 = batchCountBySlot;
                    _k.label = 1;
                case 1:
                    if (!(_a < batchCountBySlot_1.length)) return [3 /*break*/, 4];
                    _b = batchCountBySlot_1[_a], slot = _b[0], batchCount = _b[1];
                    return [5 /*yield**/, _loop_1(slot, batchCount)];
                case 2:
                    _k.sent();
                    _k.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4:
                    i = 0;
                    _k.label = 5;
                case 5:
                    if (!(i < insertedDocs.length)) return [3 /*break*/, 8];
                    doc = insertedDocs[i];
                    slot = certificationSlotKey(sectionKey, doc.documentFormSubsection, doc.documentTag);
                    priorInSlot = (_d = slotCounts.get(slot)) !== null && _d !== void 0 ? _d : 0;
                    action = resolveCertificationVersionAction(priorInSlot, isResubmitCycle);
                    slotCounts.set(slot, priorInSlot + 1);
                    if (!action) {
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, (0, product_document_version_integration_1.trackUploadedProductDocument)(versioning, {
                            urnNo: urnNo,
                            sectionKey: sectionKey,
                            subsectionKey: (_e = doc.documentFormSubsection) !== null && _e !== void 0 ? _e : null,
                            documentTag: (_f = doc.documentTag) !== null && _f !== void 0 ? _f : null,
                            userId: userId,
                            documentId: doc._id,
                            productDocumentId: doc.productDocumentId,
                            filePath: (_g = doc.documentLink) !== null && _g !== void 0 ? _g : '',
                            originalName: (_h = doc.documentOriginalName) !== null && _h !== void 0 ? _h : '',
                            storedName: (_j = doc.documentName) !== null && _j !== void 0 ? _j : '',
                            file: filesByIndex === null || filesByIndex === void 0 ? void 0 : filesByIndex[i],
                            action: action,
                            slotKeyMode: slotKeyMode,
                            processType: processType,
                            renewalCycleId: renewalCycleId,
                            session: session,
                        })];
                case 6:
                    _k.sent();
                    _k.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function trackSingleCertificationDocument(params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trackInsertedCertificationDocuments({
                        versioning: params.versioning,
                        documentModel: params.documentModel,
                        urnNo: params.urnNo,
                        sectionKey: params.sectionKey,
                        userId: params.userId,
                        vendorId: params.vendorId,
                        insertedDocs: [params.doc],
                        isResubmitCycle: params.isResubmitCycle,
                        session: params.session,
                        filesByIndex: params.file ? [params.file] : undefined,
                        processType: params.processType,
                        renewalCycleId: params.renewalCycleId,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/** Resolves admin-resend cycle and tracks a single newly created certification document. */
function trackCertificationDocumentAfterCreate(params) {
    return __awaiter(this, void 0, void 0, function () {
        var productModel, urnNo, session, rest, isResubmitCycle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productModel = params.productModel, urnNo = params.urnNo, session = params.session, rest = __rest(params, ["productModel", "urnNo", "session"]);
                    return [4 /*yield*/, isVendorResubmitCycle(productModel, urnNo, session)];
                case 1:
                    isResubmitCycle = _a.sent();
                    return [4 /*yield*/, trackSingleCertificationDocument(__assign(__assign({}, rest), { urnNo: urnNo, session: session, isResubmitCycle: isResubmitCycle }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
