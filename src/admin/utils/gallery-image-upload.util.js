"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryImageDiskMulterOptions = galleryImageDiskMulterOptions;
var multer_1 = require("multer");
var path_1 = require("path");
var GALLERY_IMAGE_MIMES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
]);
/** Gallery multipart uploads — no per-file size cap (Multer default when limits omitted). */
function galleryImageDiskMulterOptions() {
    return {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads', 'events'),
            filename: function (_req, file, cb) {
                var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                var ext = (0, path_1.extname)(file.originalname || '');
                cb(null, "event-".concat(uniqueSuffix).concat(ext));
            },
        }),
        fileFilter: function (_req, file, cb) {
            if (!(file === null || file === void 0 ? void 0 : file.originalname)) {
                cb(null, true);
                return;
            }
            cb(null, GALLERY_IMAGE_MIMES.has(file.mimetype));
        },
    };
}
