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
exports.RenewDocumentPromotionService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_version_helper_1 = require("../../documents/helpers/document-version.helper");
var certification_document_version_util_1 = require("../../documents/helpers/certification-document-version.util");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renew_eligible_product_util_1 = require("../helpers/renew-eligible-product.util");
function renewDocSlotKey(doc) {
    var _a, _b;
    return (0, certification_document_version_util_1.certificationStreamSlotKeyForDocument)({
        documentForm: String(doc.documentForm),
        documentFormSubsection: (_a = doc.documentFormSubsection) !== null && _a !== void 0 ? _a : null,
        documentTag: (_b = doc.documentTag) !== null && _b !== void 0 ? _b : null,
        productDocumentId: doc.productDocumentId,
    });
}
/**
 * On renewal completion, copy renew uploads into all_product_documents and
 * point initial-process version streams at the latest file per subsection slot.
 */
var RenewDocumentPromotionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RenewDocumentPromotionService = _classThis = /** @class */ (function () {
        function RenewDocumentPromotionService_1(renewDocumentModel, allProductDocumentModel, productModel, documentVersioningService) {
            this.renewDocumentModel = renewDocumentModel;
            this.allProductDocumentModel = allProductDocumentModel;
            this.productModel = productModel;
            this.documentVersioningService = documentVersioningService;
            this.logger = new common_1.Logger(RenewDocumentPromotionService.name);
        }
        RenewDocumentPromotionService_1.prototype.softDeleteLegacyCertificationDocsInSlot = function (trimmedUrn, doc, userObjectId, now, session) {
            return __awaiter(this, void 0, void 0, function () {
                var sectionKey, targetSlot, query, legacyDocs, idsToDelete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sectionKey = String(doc.documentForm);
                            targetSlot = renewDocSlotKey(doc);
                            query = this.allProductDocumentModel.find({
                                urnNo: trimmedUrn,
                                documentForm: doc.documentForm,
                                isDeleted: { $ne: true },
                            });
                            if (session) {
                                query.session(session);
                            }
                            return [4 /*yield*/, query.lean().exec()];
                        case 1:
                            legacyDocs = _a.sent();
                            idsToDelete = legacyDocs
                                .filter(function (existing) {
                                var _a, _b;
                                if (Number(existing.productDocumentId) === Number(doc.productDocumentId)) {
                                    return false;
                                }
                                var existingSlot = (0, certification_document_version_util_1.certificationStreamSlotKeyForDocument)({
                                    documentForm: String(existing.documentForm),
                                    documentFormSubsection: (_a = existing.documentFormSubsection) !== null && _a !== void 0 ? _a : null,
                                    documentTag: (_b = existing.documentTag) !== null && _b !== void 0 ? _b : null,
                                    productDocumentId: Number(existing.productDocumentId),
                                });
                                return existingSlot === targetSlot;
                            })
                                .map(function (row) { return row._id; });
                            if (!idsToDelete.length) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.allProductDocumentModel.updateMany({ _id: { $in: idsToDelete } }, {
                                    $set: {
                                        isDeleted: true,
                                        deletedAt: now,
                                        deletedBy: userObjectId,
                                        updatedDate: now,
                                    },
                                }, session ? { session: session } : {})];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RenewDocumentPromotionService_1.prototype.promoteRenewDocumentsForCompletedCycle = function (urnNo, renewalCycleId, userId, session) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, cycleObjectId, userObjectId, now, query, docs, certifiedEoiNos, eligibleDocs, latestBySlot, _i, eligibleDocs_1, doc, key, existing, docUpdated, existingUpdated, promoted, _a, _b, doc, sectionKey, existingProductDocQuery, existingProductDoc, promotedSubsection, slotSubsection, productDocPayload, promotedDocId, inserted, slotKey, error_1;
                var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                return __generator(this, function (_p) {
                    switch (_p.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            cycleObjectId = (0, renew_common_util_1.toRenewObjectId)(renewalCycleId, 'renewalCycleId');
                            userObjectId = userId instanceof mongoose_1.Types.ObjectId ? userId : new mongoose_1.Types.ObjectId(String(userId));
                            now = new Date();
                            query = this.renewDocumentModel.find({
                                urnNo: trimmedUrn,
                                renewalCycleId: cycleObjectId,
                                isDeleted: { $ne: true },
                            });
                            if (session) {
                                query.session(session);
                            }
                            return [4 /*yield*/, query.lean().exec()];
                        case 1:
                            docs = _p.sent();
                            return [4 /*yield*/, (0, renew_eligible_product_util_1.fetchRenewCertifiedEoiSet)(this.productModel, trimmedUrn)];
                        case 2:
                            certifiedEoiNos = _p.sent();
                            eligibleDocs = (0, renew_eligible_product_util_1.filterRenewRowsByCertifiedEoi)(docs, certifiedEoiNos);
                            latestBySlot = new Map();
                            for (_i = 0, eligibleDocs_1 = eligibleDocs; _i < eligibleDocs_1.length; _i++) {
                                doc = eligibleDocs_1[_i];
                                key = renewDocSlotKey(doc);
                                existing = latestBySlot.get(key);
                                docUpdated = new Date((_d = (_c = doc.updatedDate) !== null && _c !== void 0 ? _c : doc.createdDate) !== null && _d !== void 0 ? _d : 0).getTime();
                                existingUpdated = existing
                                    ? new Date((_f = (_e = existing.updatedDate) !== null && _e !== void 0 ? _e : existing.createdDate) !== null && _f !== void 0 ? _f : 0).getTime()
                                    : -1;
                                if (!existing || docUpdated >= existingUpdated) {
                                    latestBySlot.set(key, doc);
                                }
                            }
                            promoted = 0;
                            _a = 0, _b = latestBySlot.values();
                            _p.label = 3;
                        case 3:
                            if (!(_a < _b.length)) return [3 /*break*/, 14];
                            doc = _b[_a];
                            _p.label = 4;
                        case 4:
                            _p.trys.push([4, 12, , 13]);
                            sectionKey = String(doc.documentForm);
                            return [4 /*yield*/, this.softDeleteLegacyCertificationDocsInSlot(trimmedUrn, doc, userObjectId, now, session)];
                        case 5:
                            _p.sent();
                            existingProductDocQuery = this.allProductDocumentModel.findOne({
                                productDocumentId: doc.productDocumentId,
                            });
                            if (session) {
                                existingProductDocQuery.session(session);
                            }
                            return [4 /*yield*/, existingProductDocQuery.exec()];
                        case 6:
                            existingProductDoc = _p.sent();
                            promotedSubsection = (_h = (0, certification_document_version_util_1.normalizeCertificationSubsection)(String(doc.documentForm), (_g = doc.documentFormSubsection) !== null && _g !== void 0 ? _g : null)) !== null && _h !== void 0 ? _h : doc.documentFormSubsection;
                            slotSubsection = promotedSubsection;
                            productDocPayload = {
                                productDocumentId: doc.productDocumentId,
                                vendorId: doc.vendorId,
                                urnNo: trimmedUrn,
                                eoiNo: doc.eoiNo,
                                documentForm: doc.documentForm,
                                documentFormSubsection: promotedSubsection,
                                formPrimaryId: doc.formPrimaryId,
                                documentName: doc.documentName,
                                documentOriginalName: doc.documentOriginalName,
                                documentLink: doc.documentLink,
                                documentTag: doc.documentTag,
                                createdDate: (_j = doc.createdDate) !== null && _j !== void 0 ? _j : now,
                                updatedDate: now,
                                isDeleted: false,
                                deletedAt: undefined,
                                deletedBy: undefined,
                            };
                            promotedDocId = void 0;
                            if (!existingProductDoc) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.allProductDocumentModel.updateOne({ _id: existingProductDoc._id }, { $set: productDocPayload }, session ? { session: session } : {})];
                        case 7:
                            _p.sent();
                            promotedDocId = existingProductDoc._id;
                            return [3 /*break*/, 10];
                        case 8: return [4 /*yield*/, this.allProductDocumentModel.create([productDocPayload], session ? { session: session } : {})];
                        case 9:
                            inserted = _p.sent();
                            promotedDocId = inserted[0]._id;
                            _p.label = 10;
                        case 10:
                            slotKey = (0, certification_document_version_util_1.certificationSlotKey)(sectionKey, slotSubsection !== null && slotSubsection !== void 0 ? slotSubsection : null, (_k = doc.documentTag) !== null && _k !== void 0 ? _k : null);
                            return [4 /*yield*/, this.documentVersioningService.trackDocumentVersionChange((0, document_version_helper_1.buildAllProductDocumentTrackInput)({
                                    urnNo: trimmedUrn,
                                    sectionKey: sectionKey,
                                    subsectionKey: slotSubsection !== null && slotSubsection !== void 0 ? slotSubsection : null,
                                    slotKey: slotKey,
                                    action: 'replaced',
                                    documentId: promotedDocId,
                                    productDocumentId: doc.productDocumentId,
                                    filePath: (_l = doc.documentLink) !== null && _l !== void 0 ? _l : null,
                                    originalName: (_m = doc.documentOriginalName) !== null && _m !== void 0 ? _m : null,
                                    storedName: (_o = doc.documentName) !== null && _o !== void 0 ? _o : null,
                                    userId: userObjectId,
                                    processType: 'initial',
                                    renewalCycleId: null,
                                    session: session,
                                }))];
                        case 11:
                            _p.sent();
                            promoted += 1;
                            return [3 /*break*/, 13];
                        case 12:
                            error_1 = _p.sent();
                            this.logger.warn("Renew document promotion skipped for URN ".concat(trimmedUrn, " productDocumentId ").concat(doc.productDocumentId), error_1 instanceof Error ? error_1.message : String(error_1));
                            return [3 /*break*/, 13];
                        case 13:
                            _a++;
                            return [3 /*break*/, 3];
                        case 14: return [2 /*return*/, promoted];
                    }
                });
            });
        };
        return RenewDocumentPromotionService_1;
    }());
    __setFunctionName(_classThis, "RenewDocumentPromotionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewDocumentPromotionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewDocumentPromotionService = _classThis;
}();
exports.RenewDocumentPromotionService = RenewDocumentPromotionService;
