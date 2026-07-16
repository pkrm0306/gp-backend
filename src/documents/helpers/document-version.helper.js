"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStreamKey = buildStreamKey;
exports.normalizeProcessType = normalizeProcessType;
exports.paymentTypeToProcessType = paymentTypeToProcessType;
exports.paymentStreamSubsectionKey = paymentStreamSubsectionKey;
exports.toObjectId = toObjectId;
exports.normalizeRenewalCycleId = normalizeRenewalCycleId;
exports.buildAllProductDocumentLiveRef = buildAllProductDocumentLiveRef;
exports.buildPaymentDocumentLiveRef = buildPaymentDocumentLiveRef;
exports.buildAllProductDocumentTrackInput = buildAllProductDocumentTrackInput;
exports.buildPaymentDocumentTrackInput = buildPaymentDocumentTrackInput;
exports.buildStreamIdentityFilter = buildStreamIdentityFilter;
exports.fileMetadataFromMulter = fileMetadataFromMulter;
exports.slotKeyFromProductDocumentId = slotKeyFromProductDocumentId;
exports.slotKeyFromSubsection = slotKeyFromSubsection;
exports.slotKeyFromSubsectionAndTag = slotKeyFromSubsectionAndTag;
var mongoose_1 = require("mongoose");
var document_version_constants_1 = require("../constants/document-version.constants");
function buildStreamKey(input) {
    var _a, _b, _c;
    var renewal = (_b = (_a = input.renewalCycleId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
    var subsection = (_c = input.subsectionKey) !== null && _c !== void 0 ? _c : '';
    return "".concat(input.urnNo, "|").concat(input.processType, "|").concat(renewal, "|").concat(input.sectionKey, "|").concat(subsection, "|").concat(input.slotKey);
}
function normalizeProcessType(processType) {
    return processType === 'renewal' ? 'renewal' : 'initial';
}
function paymentTypeToProcessType(paymentType) {
    return paymentType === 'renew' ? 'renewal' : 'initial';
}
/** Separate version streams per payment phase (registration vs certification vs renew). */
function paymentStreamSubsectionKey(paymentType) {
    var t = String(paymentType !== null && paymentType !== void 0 ? paymentType : '').trim().toLowerCase();
    if (t === 'registration' || t === 'certification' || t === 'renew') {
        return t;
    }
    return null;
}
function toObjectId(id, fieldName) {
    if (fieldName === void 0) { fieldName = 'id'; }
    if (id instanceof mongoose_1.Types.ObjectId) {
        return id;
    }
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ".concat(fieldName, " format: ").concat(id));
    }
    return new mongoose_1.Types.ObjectId(id);
}
function normalizeRenewalCycleId(renewalCycleId) {
    if (renewalCycleId == null || renewalCycleId === '') {
        return null;
    }
    return toObjectId(renewalCycleId, 'renewalCycleId');
}
function buildAllProductDocumentLiveRef(documentId) {
    return {
        collection: document_version_constants_1.ALL_PRODUCT_DOCUMENTS_LIVE_SOURCE,
        id: toObjectId(documentId, 'documentId'),
    };
}
function buildPaymentDocumentLiveRef(paymentId, field) {
    return {
        collection: document_version_constants_1.PAYMENT_DETAILS_LIVE_SOURCE,
        id: toObjectId(paymentId, 'paymentId'),
        field: field,
    };
}
function buildAllProductDocumentTrackInput(input) {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        urnNo: input.urnNo.trim(),
        processType: normalizeProcessType(input.processType),
        renewalCycleId: normalizeRenewalCycleId(input.renewalCycleId),
        sectionKey: input.sectionKey,
        subsectionKey: (_a = input.subsectionKey) !== null && _a !== void 0 ? _a : null,
        slotKey: input.slotKey,
        liveSource: document_version_constants_1.ALL_PRODUCT_DOCUMENTS_LIVE_SOURCE,
        liveRef: buildAllProductDocumentLiveRef(input.documentId),
        action: input.action,
        filePath: (_b = input.filePath) !== null && _b !== void 0 ? _b : null,
        originalName: (_c = input.originalName) !== null && _c !== void 0 ? _c : null,
        storedName: (_d = input.storedName) !== null && _d !== void 0 ? _d : null,
        mimeType: (_e = input.mimeType) !== null && _e !== void 0 ? _e : null,
        sizeBytes: (_f = input.sizeBytes) !== null && _f !== void 0 ? _f : null,
        userId: input.userId,
        roundNo: (_g = input.roundNo) !== null && _g !== void 0 ? _g : null,
        session: input.session,
    };
}
function buildPaymentDocumentTrackInput(input) {
    var _a, _b, _c, _d, _e, _f;
    return {
        urnNo: input.urnNo.trim(),
        processType: paymentTypeToProcessType(input.paymentType),
        renewalCycleId: normalizeRenewalCycleId(input.renewalCycleId),
        sectionKey: 'payment',
        subsectionKey: paymentStreamSubsectionKey(input.paymentType),
        slotKey: input.field,
        liveSource: document_version_constants_1.PAYMENT_DETAILS_LIVE_SOURCE,
        liveRef: buildPaymentDocumentLiveRef(input.paymentId, input.field),
        action: input.action,
        filePath: (_a = input.filePath) !== null && _a !== void 0 ? _a : null,
        originalName: (_b = input.originalName) !== null && _b !== void 0 ? _b : null,
        storedName: (_c = input.storedName) !== null && _c !== void 0 ? _c : null,
        mimeType: (_d = input.mimeType) !== null && _d !== void 0 ? _d : null,
        sizeBytes: (_e = input.sizeBytes) !== null && _e !== void 0 ? _e : null,
        userId: input.userId,
        roundNo: (_f = input.roundNo) !== null && _f !== void 0 ? _f : null,
        session: input.session,
    };
}
function buildStreamIdentityFilter(query) {
    var _a;
    return {
        urnNo: query.urnNo.trim(),
        processType: normalizeProcessType(query.processType),
        renewalCycleId: query.renewalCycleId && mongoose_1.Types.ObjectId.isValid(query.renewalCycleId)
            ? new mongoose_1.Types.ObjectId(query.renewalCycleId)
            : null,
        sectionKey: query.sectionKey,
        subsectionKey: (_a = query.subsectionKey) !== null && _a !== void 0 ? _a : null,
        slotKey: query.slotKey,
    };
}
function fileMetadataFromMulter(file, storedName, filePath) {
    var _a, _b, _c;
    if (!file && !filePath) {
        return {
            originalName: null,
            storedName: storedName !== null && storedName !== void 0 ? storedName : null,
            mimeType: null,
            sizeBytes: null,
            filePath: filePath !== null && filePath !== void 0 ? filePath : null,
        };
    }
    return {
        originalName: (_a = file === null || file === void 0 ? void 0 : file.originalname) !== null && _a !== void 0 ? _a : null,
        storedName: storedName !== null && storedName !== void 0 ? storedName : (file ? file.filename : null),
        mimeType: (_b = file === null || file === void 0 ? void 0 : file.mimetype) !== null && _b !== void 0 ? _b : null,
        sizeBytes: (_c = file === null || file === void 0 ? void 0 : file.size) !== null && _c !== void 0 ? _c : null,
        filePath: filePath !== null && filePath !== void 0 ? filePath : null,
    };
}
function slotKeyFromProductDocumentId(productDocumentId) {
    return String(productDocumentId);
}
function slotKeyFromSubsection(subsection) {
    return (subsection === null || subsection === void 0 ? void 0 : subsection.trim()) || 'default';
}
/** Innovation and similar sections: one version stream per subsection + document tag. */
function slotKeyFromSubsectionAndTag(subsection, tag) {
    var sub = (subsection === null || subsection === void 0 ? void 0 : subsection.trim()) || 'default';
    var t = (tag === null || tag === void 0 ? void 0 : tag.trim()) || 'tech';
    return "".concat(sub, "__").concat(t);
}
