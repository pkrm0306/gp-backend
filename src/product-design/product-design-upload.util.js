"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeMeasureBenefitRows = exports.normalizeMeasureBenefitRow = exports.PRODUCT_DESIGN_EMPTY_FORM_MESSAGE = exports.SUPPORTING_DESIGN_VALIDATION_MESSAGE = exports.SUPPORTING_DESIGN_ALLOWED_EXTENSIONS = exports.SUPPORTING_SUBSECTION = exports.ECO_VISION_SUBSECTION = exports.PRODUCT_DESIGN_SUPPORTING_FIELD_NAMES = exports.PRODUCT_DESIGN_ECO_VISION_FIELD_NAMES = void 0;
exports.isAllowedSupportingDesignFile = isAllowedSupportingDesignFile;
exports.assertSupportingDesignFileTypes = assertSupportingDesignFileTypes;
exports.normalizeMultipartFieldName = normalizeMultipartFieldName;
exports.hasProductDesignDocumentUpload = hasProductDesignDocumentUpload;
exports.hasAtLeastOneProductDesignFieldFilled = hasAtLeastOneProductDesignFieldFilled;
exports.hasAtLeastOneProductDesignContent = hasAtLeastOneProductDesignContent;
exports.parseMultipartJsonIdArray = parseMultipartJsonIdArray;
exports.parseMultipartNonNegativeInt = parseMultipartNonNegativeInt;
exports.collectProductDesignUploadFiles = collectProductDesignUploadFiles;
var document_upload_validation_1 = require("../common/upload/document-upload.validation");
Object.defineProperty(exports, "SUPPORTING_DESIGN_VALIDATION_MESSAGE", { enumerable: true, get: function () { return document_upload_validation_1.STANDARD_DOCUMENT_VALIDATION_MESSAGE; } });
var form_partial_field_util_1 = require("../common/form-partial-field.util");
/** Multipart field names for eco vision uploads (repeat per file). */
exports.PRODUCT_DESIGN_ECO_VISION_FIELD_NAMES = new Set([
    'ecoVisionFile',
    'ecoVisionFiles',
    'eco_vision',
    'ecoVision',
    'eco_vision_upload',
    'ecoVisionUpload',
    'ecoVisionDocument',
    'ecoVisionDocuments',
    'document',
    'documents',
    'documentFile',
    'documentFiles',
    'file',
    'upload',
]);
/** Multipart field names for product design supporting document uploads. */
exports.PRODUCT_DESIGN_SUPPORTING_FIELD_NAMES = new Set([
    'supportingDesignFile',
    'supportingDocumentFile',
    'supportingDocumentFiles',
    'supportingDocuments',
    'productDesignSupportingDocument',
    'supporting_document',
    'supporting_documents',
    'supportingDesignDocuments',
    'supportingDesignDocument',
]);
exports.ECO_VISION_SUBSECTION = 'eco_vision_upload';
exports.SUPPORTING_SUBSECTION = 'supporting_documents';
/** Vendor certification uploads: PDF and Excel only. */
exports.SUPPORTING_DESIGN_ALLOWED_EXTENSIONS = new Set([
    '.pdf',
    '.xls',
    '.xlsx',
]);
function isAllowedSupportingDesignFile(file) {
    return (0, document_upload_validation_1.isAllowedStandardDocumentFile)(file);
}
function assertSupportingDesignFileTypes(files) {
    (0, document_upload_validation_1.assertStandardDocumentFileTypes)(files);
}
/** Exact copy for vendor toast / API 400 (productDesignFormFilled.ts). */
exports.PRODUCT_DESIGN_EMPTY_FORM_MESSAGE = 'Please fill in at least one field in the form before continuing.';
function hasAnyValidMultipartUpload(files) {
    return (files !== null && files !== void 0 ? files : []).some(function (file) { return isValidUploadPart(file); });
}
function normalizeMultipartFieldName(fieldname) {
    return String(fieldname !== null && fieldname !== void 0 ? fieldname : 'files')
        .replace(/\[\d*\]$/g, '')
        .replace(/\[\]$/g, '')
        .trim();
}
/** True when the save is driven by an eco/supporting upload (new or already on the URN). */
function hasProductDesignDocumentUpload(params) {
    var _a, _b, _c, _d;
    if (hasAnyValidMultipartUpload(params.allUploadFiles)) {
        return true;
    }
    if (((_a = params.ecoVisionFiles) !== null && _a !== void 0 ? _a : []).length > 0) {
        return true;
    }
    if (((_b = params.supportingDocumentFiles) !== null && _b !== void 0 ? _b : []).length > 0) {
        return true;
    }
    if (((_c = params.retainedEcoVisionDocumentCount) !== null && _c !== void 0 ? _c : 0) > 0) {
        return true;
    }
    if (((_d = params.retainedSupportingDocumentCount) !== null && _d !== void 0 ? _d : 0) > 0) {
        return true;
    }
    return false;
}
function hasAtLeastOneProductDesignFieldFilled(params) {
    var _a, _b;
    if (hasAnyValidMultipartUpload(params.allUploadFiles)) {
        return true;
    }
    if (params.ecoVisionFiles.length > 0) {
        return true;
    }
    if (params.supportingDocumentFiles.length > 0) {
        return true;
    }
    if (String((_a = params.strategies) !== null && _a !== void 0 ? _a : '').trim()) {
        return true;
    }
    var rows = (_b = params.measuresAndBenefits) !== null && _b !== void 0 ? _b : [];
    return rows.some(function (row) {
        return (0, form_partial_field_util_1.hasPartialMeasureBenefitRow)(row);
    });
}
var form_partial_field_util_2 = require("../common/form-partial-field.util");
Object.defineProperty(exports, "normalizeMeasureBenefitRow", { enumerable: true, get: function () { return form_partial_field_util_2.normalizeMeasureBenefitRow; } });
Object.defineProperty(exports, "normalizeMeasureBenefitRows", { enumerable: true, get: function () { return form_partial_field_util_2.normalizeMeasureBenefitRows; } });
/**
 * Vendor “≥ 1 field” rule including persisted documents after existing*DocumentIds.
 */
function hasAtLeastOneProductDesignContent(params) {
    var _a, _b;
    if (hasAtLeastOneProductDesignFieldFilled({
        strategies: params.strategies,
        measuresAndBenefits: params.measuresAndBenefits,
        ecoVisionFiles: params.ecoVisionFiles,
        supportingDocumentFiles: params.supportingDocumentFiles,
        allUploadFiles: params.allUploadFiles,
    })) {
        return true;
    }
    if (((_a = params.retainedEcoVisionDocumentCount) !== null && _a !== void 0 ? _a : 0) > 0) {
        return true;
    }
    if (((_b = params.retainedSupportingDocumentCount) !== null && _b !== void 0 ? _b : 0) > 0) {
        return true;
    }
    return false;
}
function isValidUploadPart(file) {
    var _a, _b, _c;
    return Boolean((file === null || file === void 0 ? void 0 : file.originalname) ||
        ((_a = file === null || file === void 0 ? void 0 : file.size) !== null && _a !== void 0 ? _a : 0) > 0 ||
        ((_c = (_b = file === null || file === void 0 ? void 0 : file.buffer) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0);
}
function parseMultipartJsonIdArray(value) {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value.map(function (id) { return String(id).trim(); }).filter(Boolean);
    }
    if (typeof value === 'string') {
        var trimmed = value.trim();
        if (trimmed === '') {
            return [];
        }
        try {
            var parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.map(function (id) { return String(id).trim(); }).filter(Boolean);
            }
            return [];
        }
        catch (_a) {
            return [];
        }
    }
    return [];
}
function parseMultipartNonNegativeInt(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    var n = parseInt(String(value), 10);
    if (!Number.isFinite(n) || n < 0) {
        return undefined;
    }
    return n;
}
/**
 * Split multipart files by field name.
 * Legacy `files`: first `ecoVisionFilesCount` → eco vision, remainder → supporting.
 * Legacy `files` without counts: all parts → eco vision.
 */
function collectProductDesignUploadFiles(files, options) {
    var ecoVisionFiles = [];
    var supportingDocumentFiles = [];
    var legacyFiles = [];
    var uncategorizedFiles = [];
    for (var _i = 0, _a = files !== null && files !== void 0 ? files : []; _i < _a.length; _i++) {
        var file = _a[_i];
        if (!isValidUploadPart(file))
            continue;
        var field = normalizeMultipartFieldName(file.fieldname);
        if (exports.PRODUCT_DESIGN_ECO_VISION_FIELD_NAMES.has(field)) {
            ecoVisionFiles.push(file);
        }
        else if (exports.PRODUCT_DESIGN_SUPPORTING_FIELD_NAMES.has(field)) {
            supportingDocumentFiles.push(file);
        }
        else if (field === 'files') {
            legacyFiles.push(file);
        }
        else {
            uncategorizedFiles.push(file);
        }
    }
    var hasExplicit = ecoVisionFiles.length > 0 || supportingDocumentFiles.length > 0;
    if (!hasExplicit && legacyFiles.length > 0) {
        var ecoCount = options === null || options === void 0 ? void 0 : options.ecoVisionFilesCount;
        var supportingCount = options === null || options === void 0 ? void 0 : options.supportingDesignFilesCount;
        if (ecoCount !== undefined || supportingCount !== undefined) {
            var ecoN = Math.min(ecoCount !== null && ecoCount !== void 0 ? ecoCount : 0, legacyFiles.length);
            ecoVisionFiles.push.apply(ecoVisionFiles, legacyFiles.slice(0, ecoN));
            supportingDocumentFiles.push.apply(supportingDocumentFiles, legacyFiles.slice(ecoN));
        }
        else {
            ecoVisionFiles.push.apply(ecoVisionFiles, legacyFiles);
        }
    }
    if (uncategorizedFiles.length > 0) {
        ecoVisionFiles.push.apply(ecoVisionFiles, uncategorizedFiles);
    }
    return { ecoVisionFiles: ecoVisionFiles, supportingDocumentFiles: supportingDocumentFiles };
}
