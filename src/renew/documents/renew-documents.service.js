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
exports.RenewDocumentsService = void 0;
var common_1 = require("@nestjs/common");
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var upload_file_util_1 = require("../../utils/upload-file.util");
var certification_document_version_util_1 = require("../../documents/helpers/certification-document-version.util");
var renew_common_util_1 = require("../helpers/renew-common.util");
var renew_section_documents_util_1 = require("../helpers/renew-section-documents.util");
var resolve_all_product_document_util_1 = require("../../documents/helpers/resolve-all-product-document.util");
var renew_eligible_product_util_1 = require("../helpers/renew-eligible-product.util");
var RenewDocumentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RenewDocumentsService = _classThis = /** @class */ (function () {
        function RenewDocumentsService_1(renewDocumentModel, renewalCycleModel, productModel, documentVersioningService) {
            this.renewDocumentModel = renewDocumentModel;
            this.renewalCycleModel = renewalCycleModel;
            this.productModel = productModel;
            this.documentVersioningService = documentVersioningService;
        }
        RenewDocumentsService_1.prototype.shouldDeletePhysicalFile = function () {
            return process.env.DOCUMENT_DELETE_REMOVE_FILE !== 'false';
        };
        RenewDocumentsService_1.prototype.tryDeleteFile = function (documentLink) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.shouldDeletePhysicalFile() || !documentLink) {
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(documentLink)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.warn("Renew document file cleanup failed for \"".concat(documentLink, "\":"), error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RenewDocumentsService_1.prototype.resolveCycle = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var cycle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.renewalCycleModel
                                .findById(renewalCycleId.trim())
                                .exec()];
                        case 1:
                            cycle = _a.sent();
                            if (!cycle || cycle.urnNo !== urnNo.trim()) {
                                throw new common_1.BadRequestException('renewalCycleId does not match this URN');
                            }
                            return [2 /*return*/, cycle];
                    }
                });
            });
        };
        RenewDocumentsService_1.prototype.softDeleteDocument = function (documentIdParam, query, deletedByUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var context, deletedBy, cycle, cycleObjectId, lookupFilter, document, actorOwnsDocument, normalizedRequestedSectionKey, normalizedStoredSectionKey, now, product, urnStatus;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            if (!((_a = query.renewalCycleId) === null || _a === void 0 ? void 0 : _a.trim())) {
                                throw new common_1.BadRequestException('renewalCycleId is required for renewal document delete');
                            }
                            if (!((_b = query.sectionKey) === null || _b === void 0 ? void 0 : _b.trim())) {
                                throw new common_1.BadRequestException('sectionKey is required for renewal document delete');
                            }
                            return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, query.urnNo)];
                        case 1:
                            context = _l.sent();
                            deletedBy = (0, renew_common_util_1.toRenewObjectId)(deletedByUserId, 'deletedBy');
                            return [4 /*yield*/, this.resolveCycle(context.urnNo, query.renewalCycleId)];
                        case 2:
                            cycle = _l.sent();
                            cycleObjectId = cycle._id;
                            lookupFilter = (0, resolve_all_product_document_util_1.buildAllProductDocumentLookupFilter)(documentIdParam);
                            if (!lookupFilter) {
                                throw new common_1.NotFoundException('Document not found');
                            }
                            return [4 /*yield*/, this.renewDocumentModel.findOne(lookupFilter).exec()];
                        case 3:
                            document = _l.sent();
                            if (!document || document.isDeleted) {
                                throw new common_1.NotFoundException('Document not found');
                            }
                            if (document.urnNo !== context.urnNo) {
                                throw new common_1.NotFoundException('Document not found for provided urnNo');
                            }
                            actorOwnsDocument = String(document.vendorId) === String(deletedBy) ||
                                String(document.manufacturerId) === String(deletedBy) ||
                                String(context.vendorId) === String(deletedBy) ||
                                String(context.manufacturerId) === String(deletedBy);
                            if (!actorOwnsDocument) {
                                throw new common_1.ForbiddenException('You are not allowed to delete this document');
                            }
                            normalizedRequestedSectionKey = (0, document_section_key_constants_1.normalizeDocumentSectionKey)(query.sectionKey);
                            normalizedStoredSectionKey = (0, document_section_key_constants_1.normalizeDocumentSectionKey)(document.documentForm);
                            if (normalizedStoredSectionKey !== normalizedRequestedSectionKey) {
                                throw new common_1.NotFoundException('Document not found for provided urnNo and sectionKey');
                            }
                            (0, renew_section_documents_util_1.assertRenewDocumentMatchesCycle)(document, cycleObjectId, Number((_c = cycle.cycleNo) !== null && _c !== void 0 ? _c : 1));
                            return [4 /*yield*/, this.tryDeleteFile(document.documentLink)];
                        case 4:
                            _l.sent();
                            now = new Date();
                            return [4 /*yield*/, this.renewDocumentModel.updateOne({ _id: document._id }, {
                                    $set: {
                                        isDeleted: true,
                                        deletedAt: now,
                                        deletedBy: deletedBy,
                                        updatedDate: now,
                                    },
                                })];
                        case 5:
                            _l.sent();
                            return [4 /*yield*/, this.productModel
                                    .findOne(__assign({ urnNo: context.urnNo }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                    .select('urnStatus')
                                    .lean()
                                    .exec()];
                        case 6:
                            product = _l.sent();
                            urnStatus = Number((_d = product === null || product === void 0 ? void 0 : product.urnStatus) !== null && _d !== void 0 ? _d : 0);
                            if (!(0, certification_document_version_util_1.isRenewVendorResubmitCycle)(urnStatus)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.documentVersioningService.trackAllProductDocument({
                                    urnNo: document.urnNo,
                                    sectionKey: document.documentForm,
                                    subsectionKey: (_e = document.documentFormSubsection) !== null && _e !== void 0 ? _e : null,
                                    slotKey: (0, certification_document_version_util_1.renewDocumentVersionSlotKey)({
                                        documentForm: String(document.documentForm),
                                        documentFormSubsection: (_f = document.documentFormSubsection) !== null && _f !== void 0 ? _f : null,
                                        documentTag: (_g = document.documentTag) !== null && _g !== void 0 ? _g : null,
                                        productDocumentId: document.productDocumentId,
                                    }),
                                    action: 'deleted',
                                    documentId: document._id,
                                    productDocumentId: document.productDocumentId,
                                    filePath: (_h = document.documentLink) !== null && _h !== void 0 ? _h : null,
                                    originalName: (_j = document.documentOriginalName) !== null && _j !== void 0 ? _j : null,
                                    storedName: (_k = document.documentName) !== null && _k !== void 0 ? _k : null,
                                    userId: deletedBy,
                                    processType: 'renewal',
                                    renewalCycleId: cycleObjectId,
                                })];
                        case 7:
                            _l.sent();
                            _l.label = 8;
                        case 8: return [2 /*return*/, {
                                documentId: document.productDocumentId,
                                urnNo: document.urnNo,
                                sectionKey: document.documentForm,
                            }];
                    }
                });
            });
        };
        return RenewDocumentsService_1;
    }());
    __setFunctionName(_classThis, "RenewDocumentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewDocumentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewDocumentsService = _classThis;
}();
exports.RenewDocumentsService = RenewDocumentsService;
