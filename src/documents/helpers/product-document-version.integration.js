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
exports.trackProductDocumentBatch = trackProductDocumentBatch;
exports.trackProductDocumentDeleteBatch = trackProductDocumentDeleteBatch;
exports.trackUploadedProductDocument = trackUploadedProductDocument;
exports.trackPaymentFileChange = trackPaymentFileChange;
var document_version_helper_1 = require("./document-version.helper");
function trackProductDocumentBatch(params) {
    return __awaiter(this, void 0, void 0, function () {
        var versioning, urnNo, sectionKey, userId, docs, _a, action, _b, slotKeyMode, processType, renewalCycleId, roundNo, session, _i, docs_1, doc, metadata;
        var _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    versioning = params.versioning, urnNo = params.urnNo, sectionKey = params.sectionKey, userId = params.userId, docs = params.docs, _a = params.action, action = _a === void 0 ? 'added' : _a, _b = params.slotKeyMode, slotKeyMode = _b === void 0 ? 'productDocumentId' : _b, processType = params.processType, renewalCycleId = params.renewalCycleId, roundNo = params.roundNo, session = params.session;
                    _i = 0, docs_1 = docs;
                    _k.label = 1;
                case 1:
                    if (!(_i < docs_1.length)) return [3 /*break*/, 4];
                    doc = docs_1[_i];
                    metadata = (0, document_version_helper_1.fileMetadataFromMulter)(undefined, doc.documentName, doc.documentLink);
                    return [4 /*yield*/, versioning.trackAllProductDocument({
                            urnNo: urnNo,
                            sectionKey: sectionKey,
                            subsectionKey: (_c = doc.documentFormSubsection) !== null && _c !== void 0 ? _c : null,
                            slotKey: slotKeyMode === 'subsectionTag'
                                ? (0, document_version_helper_1.slotKeyFromSubsectionAndTag)(doc.documentFormSubsection, doc.documentTag)
                                : slotKeyMode === 'subsection'
                                    ? (0, document_version_helper_1.slotKeyFromSubsection)(doc.documentFormSubsection)
                                    : (0, document_version_helper_1.slotKeyFromProductDocumentId)(doc.productDocumentId),
                            action: action,
                            documentId: doc._id,
                            productDocumentId: doc.productDocumentId,
                            filePath: (_e = (_d = doc.documentLink) !== null && _d !== void 0 ? _d : metadata.filePath) !== null && _e !== void 0 ? _e : null,
                            originalName: (_g = (_f = doc.documentOriginalName) !== null && _f !== void 0 ? _f : metadata.originalName) !== null && _g !== void 0 ? _g : null,
                            storedName: (_j = (_h = doc.documentName) !== null && _h !== void 0 ? _h : metadata.storedName) !== null && _j !== void 0 ? _j : null,
                            userId: userId,
                            processType: processType,
                            renewalCycleId: renewalCycleId,
                            roundNo: roundNo,
                            session: session,
                        })];
                case 2:
                    _k.sent();
                    _k.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function trackProductDocumentDeleteBatch(params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trackProductDocumentBatch(__assign(__assign({}, params), { action: 'deleted' }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function trackUploadedProductDocument(versioning, params) {
    return __awaiter(this, void 0, void 0, function () {
        var metadata;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    metadata = (0, document_version_helper_1.fileMetadataFromMulter)(params.file, params.storedName, params.filePath);
                    return [4 /*yield*/, versioning.trackAllProductDocument({
                            urnNo: params.urnNo,
                            sectionKey: params.sectionKey,
                            subsectionKey: (_a = params.subsectionKey) !== null && _a !== void 0 ? _a : null,
                            slotKey: params.slotKeyMode === 'subsectionTag'
                                ? (0, document_version_helper_1.slotKeyFromSubsectionAndTag)(params.subsectionKey, params.documentTag)
                                : params.slotKeyMode === 'subsection'
                                    ? (0, document_version_helper_1.slotKeyFromSubsection)(params.subsectionKey)
                                    : (0, document_version_helper_1.slotKeyFromProductDocumentId)(params.productDocumentId),
                            action: (_b = params.action) !== null && _b !== void 0 ? _b : 'added',
                            documentId: params.documentId,
                            productDocumentId: params.productDocumentId,
                            filePath: params.filePath,
                            originalName: (_d = (_c = params.originalName) !== null && _c !== void 0 ? _c : metadata.originalName) !== null && _d !== void 0 ? _d : null,
                            storedName: (_f = (_e = params.storedName) !== null && _e !== void 0 ? _e : metadata.storedName) !== null && _f !== void 0 ? _f : null,
                            mimeType: (_g = metadata.mimeType) !== null && _g !== void 0 ? _g : null,
                            sizeBytes: (_h = metadata.sizeBytes) !== null && _h !== void 0 ? _h : null,
                            userId: params.userId,
                            processType: params.processType,
                            renewalCycleId: params.renewalCycleId,
                            roundNo: params.roundNo,
                            session: params.session,
                        })];
                case 1:
                    _j.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function trackPaymentFileChange(versioning, params) {
    return __awaiter(this, void 0, void 0, function () {
        var metadata;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    metadata = (0, document_version_helper_1.fileMetadataFromMulter)(params.file, (_a = params.storedName) !== null && _a !== void 0 ? _a : null, params.filePath);
                    return [4 /*yield*/, versioning.trackPaymentDocument({
                            urnNo: params.urnNo,
                            paymentId: params.paymentId,
                            field: params.field,
                            action: (_b = params.action) !== null && _b !== void 0 ? _b : 'added',
                            filePath: params.filePath,
                            originalName: (_c = metadata.originalName) !== null && _c !== void 0 ? _c : null,
                            storedName: (_d = metadata.storedName) !== null && _d !== void 0 ? _d : null,
                            mimeType: (_e = metadata.mimeType) !== null && _e !== void 0 ? _e : null,
                            sizeBytes: (_f = metadata.sizeBytes) !== null && _f !== void 0 ? _f : null,
                            userId: params.userId,
                            paymentType: params.paymentType,
                            renewalCycleId: params.renewalCycleId,
                            roundNo: params.roundNo,
                            session: params.session,
                        })];
                case 1:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
}
