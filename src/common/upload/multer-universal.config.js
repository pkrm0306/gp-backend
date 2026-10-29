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
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const document_upload_validation_1 = require("./document-upload.validation");
const TEN_MB = 10 * 1024 * 1024;
const FIVE_MB = 5 * 1024 * 1024;
const ADMIN_IMAGE_MIMES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
]);
function universalMemoryMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
function standardsDocumentMemoryMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
function adminImageMemoryMulterOptions(maxBytes = FIVE_MB) {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: maxBytes },
        fileFilter: (_req, file, cb) => {
            if (!file?.originalname) {
                cb(null, true);
                return;
            }
            if (ADMIN_IMAGE_MIMES.has(file.mimetype) || file.mimetype?.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        },
    };
}
function adminArticleMemoryMulterOptions() {
    return adminImageMemoryMulterOptions(FIVE_MB);
}
function certificationMultipartMemoryMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
function productPerformanceMultipartMemoryMulterOptions(maxFiles = 20) {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB, files: maxFiles },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
function rawMaterialsMultipartMemoryMulterOptions(maxFiles = 20) {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB, files: maxFiles },
        fileFilter: document_upload_validation_1.standardDocumentMulterFileFilter,
    };
}
function productDesignMultipartFileFilter(_req, file, cb) {
    (0, document_upload_validation_1.standardDocumentMulterFileFilter)(_req, file, cb);
}
function productDesignMultipartMemoryMulterOptions(maxFiles = 40) {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: TEN_MB, files: maxFiles },
        fileFilter: productDesignMultipartFileFilter,
    };
}
function wasteManagementMultipartMemoryMulterOptions() {
    const raw = process.env.WM_SUPPORTING_DOCS_MAX_FILE_MB;
    let maxMb = 1024;
    if (raw !== undefined && raw !== '') {
        const n = Number(raw);
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
const FIFTY_MB = 50 * 1024 * 1024;
function assessmentReportFileFilter(_req, file, cb) {
    if (!file) {
        cb(null, true);
        return;
    }
    const name = String(file.originalname ?? '').trim();
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
function assessmentReportMemoryMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: FIFTY_MB },
        fileFilter: assessmentReportFileFilter,
    };
}
//# sourceMappingURL=multer-universal.config.js.map