"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorProfileBrandingMemoryMulterOptions = vendorProfileBrandingMemoryMulterOptions;
var common_1 = require("@nestjs/common");
var multer_1 = require("multer");
var vendor_profile_document_validation_1 = require("../common/upload/vendor-profile-document.validation");
var MAX_BYTES = 15 * 1024 * 1024;
var LOGO_MIMES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
]);
/**
 * Memory storage so buffers are passed to shared **uploadFile()** in `upload-file.util.ts` (S3 or local).
 * Fields: **gst** / **gstDocument** (PDF or image), **companyLogo** (images), **pan** / **panDocument** (PDF or image).
 */
function vendorProfileBrandingMemoryMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: MAX_BYTES },
        fileFilter: function (_req, file, cb) {
            if (file.fieldname === 'gst' || file.fieldname === 'gstDocument') {
                if ((0, vendor_profile_document_validation_1.isAllowedVendorProfileDocumentFile)(file)) {
                    cb(null, true);
                }
                else {
                    cb(new common_1.BadRequestException(vendor_profile_document_validation_1.VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE));
                }
                return;
            }
            if (file.fieldname === 'companyLogo') {
                if (LOGO_MIMES.has(file.mimetype)) {
                    cb(null, true);
                }
                else {
                    cb(new common_1.BadRequestException('Company logo must be an image (jpeg, png, gif, or webp).'));
                }
                return;
            }
            if (file.fieldname === 'pan' || file.fieldname === 'panDocument') {
                if ((0, vendor_profile_document_validation_1.isAllowedVendorProfileDocumentFile)(file)) {
                    cb(null, true);
                }
                else {
                    cb(new common_1.BadRequestException(vendor_profile_document_validation_1.VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE));
                }
                return;
            }
            cb(new common_1.BadRequestException("Unexpected file field: ".concat(file.fieldname)));
        },
    };
}
