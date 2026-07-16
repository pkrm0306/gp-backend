"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.universalMemoryMulterOptions = universalMemoryMulterOptions;
exports.standardsDocumentMemoryMulterOptions = standardsDocumentMemoryMulterOptions;
exports.adminImageMemoryMulterOptions = adminImageMemoryMulterOptions;
exports.adminArticleMemoryMulterOptions = adminArticleMemoryMulterOptions;
exports.certificationMultipartMemoryMulterOptions = certificationMultipartMemoryMulterOptions;
exports.productPerformanceMultipartMemoryMulterOptions = productPerformanceMultipartMemoryMulterOptions;
exports.rawMaterialsMultipartMemoryMulterOptions = rawMaterialsMultipartMemoryMulterOptions;
exports.productDesignMultipartMemoryMulterOptions = productDesignMultipartMemoryMulterOptions;
exports.wasteManagementMultipartMemoryMulterOptions = wasteManagementMultipartMemoryMulterOptions;
exports.assessmentReportMemoryMulterOptions = assessmentReportMemoryMulterOptions;
var common_1 = require("@nestjs/common");
var multer_1 = require("multer");
var document_upload_validation_1 = require("./document-upload.validation");
var TEN_MB = 10 * 1024 * 1024;
var FIVE_MB = 5 * 1024 * 1024;
var ADMIN_IMAGE_MIMES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
]);
/**
 * Memory storage for S3 or local upload via `uploadFile()` helper.
 * Allowed: standard document types — max 10MB.
 */
function universalMemoryMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
/**
 * Standards create/update (`file` field). Memory buffer → shared `uploadFile()` in
 * `src/utils/upload-file.util.ts` (local `uploads/standards/` or S3).
 */
function standardsDocumentMemoryMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
/** Admin/CMS images (banners, events, gallery, team members, manufacturers). */
function adminImageMemoryMulterOptions(maxBytes) {
    if (maxBytes === void 0) { maxBytes = FIVE_MB; }
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: maxBytes },
        fileFilter: function (_req, file, cb) {
            var _a;
            if (!(file === null || file === void 0 ? void 0 : file.originalname)) {
                cb(null, true);
                return;
            }
            if (ADMIN_IMAGE_MIMES.has(file.mimetype) || ((_a = file.mimetype) === null || _a === void 0 ? void 0 : _a.startsWith('image/'))) {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        },
    };
}
/** Admin articles: image fields + standard documents on `pdf` / `file`. */
function adminArticleMemoryMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: FIVE_MB },
        fileFilter: function (_req, file, cb) {
            var _a;
            if (!(file === null || file === void 0 ? void 0 : file.originalname)) {
                cb(null, true);
                return;
            }
            if (file.fieldname === 'pdf' || file.fieldname === 'file') {
                if ((0, document_upload_validation_1.isAllowedStandardDocumentFile)(file)) {
                    cb(null, true);
                }
                else {
                    cb(new common_1.BadRequestException(document_upload_validation_1.STANDARD_DOCUMENT_VALIDATION_MESSAGE), false);
                }
                return;
            }
            if (ADMIN_IMAGE_MIMES.has(file.mimetype) || ((_a = file.mimetype) === null || _a === void 0 ? void 0 : _a.startsWith('image/'))) {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        },
    };
}
/** Certification / URN multipart document uploads. */
function certificationMultipartMemoryMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
/** Product performance — test report files. */
function productPerformanceMultipartMemoryMulterOptions(maxFiles) {
    if (maxFiles === void 0) { maxFiles = 20; }
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB, files: maxFiles },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
/** Raw Materials steps — all upload fields, 10MB (vendor supporting docs). */
function rawMaterialsMultipartMemoryMulterOptions(maxFiles) {
    if (maxFiles === void 0) { maxFiles = 20; }
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB, files: maxFiles },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
/** Product design — PDF and Excel only, max 40 parts. */
function productDesignMultipartFileFilter(_req, file, cb) {
    (0, document_upload_validation_1.standardDocumentMulterFileFilter)(_req, file, cb);
}
function productDesignMultipartMemoryMulterOptions(maxFiles) {
    if (maxFiles === void 0) { maxFiles = 40; }
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB, files: maxFiles },
        fileFilter: productDesignMultipartFileFilter,
    };
}
/**
 * Waste management supporting documents — same types as certification, but much
 * larger default per-file limit (large PDFs / directories). 413 from Multer was
 * caused by the 10MB certification cap.
 *
 * Set **WM_SUPPORTING_DOCS_MAX_FILE_MB** (megabytes) to override; default **1024** (1 GB).
 */
function wasteManagementMultipartMemoryMulterOptions() {
    var raw = process.env.WM_SUPPORTING_DOCS_MAX_FILE_MB;
    var maxMb = 1024;
    if (raw !== undefined && raw !== '') {
        var n = Number(raw);
        if (Number.isFinite(n) && n > 0) {
            maxMb = n;
        }
    }
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: maxMb * 1024 * 1024 },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
var FIFTY_MB = 50 * 1024 * 1024;
function assessmentReportFileFilter(_req, file, cb) {
    var _a;
    if (!file) {
        cb(null, true);
        return;
    }
    var name = String((_a = file.originalname) !== null && _a !== void 0 ? _a : '').trim();
    if (!name || name.endsWith('/') || name.endsWith('\\')) {
        cb(new common_1.BadRequestException('Folder uploads are not allowed for assessment reports.'), false);
        return;
    }
    if (!(0, document_upload_validation_1.isAllowedStandardDocumentFile)(file)) {
        cb(new common_1.BadRequestException(document_upload_validation_1.STANDARD_DOCUMENT_VALIDATION_MESSAGE), false);
        return;
    }
    cb(null, true);
}
/** Admin URN assessment report — standard document types, max 50MB. */
function assessmentReportMemoryMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: FIFTY_MB },
        fileFilter: assessmentReportFileFilter,
    };
}
