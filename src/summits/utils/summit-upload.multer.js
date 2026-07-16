"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summitUploadMulterOptions = summitUploadMulterOptions;
exports.summitUploadMaxBytes = summitUploadMaxBytes;
var common_1 = require("@nestjs/common");
var multer_1 = require("multer");
var path_1 = require("path");
var summit_constants_1 = require("../constants/summit.constants");
var IMAGE_MIMES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
]);
var IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
function summitUploadMulterOptions() {
    return {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: summit_constants_1.SUMMIT_PDF_MAX_BYTES },
        fileFilter: function (_req, file, cb) {
            var _a, _b;
            var ext = (0, path_1.extname)((_a = file === null || file === void 0 ? void 0 : file.originalname) !== null && _a !== void 0 ? _a : '').toLowerCase();
            var isPdf = file.mimetype === 'application/pdf' || ext === '.pdf';
            var isImage = IMAGE_MIMES.has(file.mimetype) ||
                IMAGE_EXT.has(ext) ||
                ((_b = file.mimetype) === null || _b === void 0 ? void 0 : _b.startsWith('image/'));
            if (isPdf || isImage) {
                cb(null, true);
                return;
            }
            cb(new common_1.BadRequestException('Allowed: JPEG, PNG, WebP, GIF, or PDF'), false);
        },
    };
}
function summitUploadMaxBytes(isPdf) {
    return isPdf ? summit_constants_1.SUMMIT_PDF_MAX_BYTES : summit_constants_1.SUMMIT_IMAGE_MAX_BYTES;
}
