"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BANNER_MEDIA_MULTIPART_FIELDS = exports.BANNER_VIDEO_MAX_BYTES = exports.BANNER_VIDEO_ALLOWED_MIMES = exports.BANNER_VIDEO_FILE_FIELD_NAMES = exports.BANNER_IMAGE_FILE_FIELD_NAMES = void 0;
exports.isUsableMulterImageFile = isUsableMulterImageFile;
exports.isUsableMulterVideoFile = isUsableMulterVideoFile;
exports.pickBannerImageFile = pickBannerImageFile;
exports.pickBannerVideoFile = pickBannerVideoFile;
exports.createBannerDiskMulterOptions = createBannerDiskMulterOptions;
var fs_1 = require("fs");
var path_1 = require("path");
var multer_1 = require("multer");
/** Form / multipart field names clients may use for the banner binary. */
exports.BANNER_IMAGE_FILE_FIELD_NAMES = [
    'image',
    'bannerImage',
    'banner_image',
    'file',
];
/** Multipart field names for banner video (system upload only). */
exports.BANNER_VIDEO_FILE_FIELD_NAMES = [
    'video',
    'bannerVideo',
    'banner_video',
];
exports.BANNER_VIDEO_ALLOWED_MIMES = new Set([
    'video/mp4',
    'video/webm',
    'video/quicktime',
]);
exports.BANNER_VIDEO_MAX_BYTES = 50 * 1024 * 1024;
/**
 * True when Multer actually received a non-empty image file (disk or memory).
 * Avoids treating an empty multipart part as an upload.
 */
function isUsableMulterImageFile(file) {
    if (!file)
        return false;
    if (typeof file.size === 'number' && file.size > 0)
        return true;
    if (file.buffer && file.buffer.length > 0)
        return true;
    if (file.path) {
        try {
            if (!(0, fs_1.existsSync)(file.path))
                return false;
            return (0, fs_1.statSync)(file.path).size > 0;
        }
        catch (_a) {
            return false;
        }
    }
    return false;
}
/** True when Multer received a non-empty video file. */
function isUsableMulterVideoFile(file) {
    return isUsableMulterImageFile(file);
}
/** First usable file among known field names (from FileFieldsInterceptor). */
function pickBannerImageFile(files) {
    var _a;
    if (!files || typeof files !== 'object')
        return undefined;
    for (var _i = 0, BANNER_IMAGE_FILE_FIELD_NAMES_1 = exports.BANNER_IMAGE_FILE_FIELD_NAMES; _i < BANNER_IMAGE_FILE_FIELD_NAMES_1.length; _i++) {
        var name_1 = BANNER_IMAGE_FILE_FIELD_NAMES_1[_i];
        var f = (_a = files[name_1]) === null || _a === void 0 ? void 0 : _a[0];
        if (isUsableMulterImageFile(f))
            return f;
    }
    return undefined;
}
/** First usable video among known field names (from FileFieldsInterceptor). */
function pickBannerVideoFile(files) {
    var _a, _b, _c, _d, _e;
    if (!files || typeof files !== 'object')
        return undefined;
    for (var _i = 0, BANNER_VIDEO_FILE_FIELD_NAMES_1 = exports.BANNER_VIDEO_FILE_FIELD_NAMES; _i < BANNER_VIDEO_FILE_FIELD_NAMES_1.length; _i++) {
        var name_2 = BANNER_VIDEO_FILE_FIELD_NAMES_1[_i];
        var f = (_a = files[name_2]) === null || _a === void 0 ? void 0 : _a[0];
        if (!isUsableMulterVideoFile(f))
            continue;
        var mime_1 = String((_b = f === null || f === void 0 ? void 0 : f.mimetype) !== null && _b !== void 0 ? _b : '').toLowerCase();
        var ext = (_e = (_d = (_c = f === null || f === void 0 ? void 0 : f.originalname) === null || _c === void 0 ? void 0 : _c.split('.').pop()) === null || _d === void 0 ? void 0 : _d.toLowerCase()) !== null && _e !== void 0 ? _e : '';
        var allowedExts = new Set(['mp4', 'webm', 'mov', 'm4v']);
        if (mime_1 && !exports.BANNER_VIDEO_ALLOWED_MIMES.has(mime_1)) {
            if (!allowedExts.has(ext))
                continue;
        }
        return f;
    }
    return undefined;
}
var bannerImageFieldSet = new Set(exports.BANNER_IMAGE_FILE_FIELD_NAMES);
var bannerVideoFieldSet = new Set(exports.BANNER_VIDEO_FILE_FIELD_NAMES);
/** Shared Multer config for vendor banner create / edit (image + optional video). */
function createBannerDiskMulterOptions() {
    return {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads', 'banners'),
            filename: function (req, file, cb) {
                var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                var ext = (0, path_1.extname)(file.originalname || '');
                var prefix = bannerVideoFieldSet.has(file.fieldname)
                    ? 'banner-video'
                    : 'banner';
                cb(null, "".concat(prefix, "-").concat(uniqueSuffix).concat(ext));
            },
        }),
        fileFilter: function (req, file, cb) {
            var _a;
            if (!(file === null || file === void 0 ? void 0 : file.originalname)) {
                cb(null, true);
                return;
            }
            var mime = String((_a = file.mimetype) !== null && _a !== void 0 ? _a : '').toLowerCase();
            if (bannerImageFieldSet.has(file.fieldname)) {
                cb(null, mime.startsWith('image/'));
                return;
            }
            if (bannerVideoFieldSet.has(file.fieldname)) {
                var ext = (0, path_1.extname)(file.originalname || '').toLowerCase();
                var allowedExts = new Set(['.mp4', '.webm', '.mov', '.m4v']);
                var okMime = !mime || exports.BANNER_VIDEO_ALLOWED_MIMES.has(mime);
                var okExt = allowedExts.has(ext);
                cb(null, okMime || okExt);
                return;
            }
            cb(null, false);
        },
        limits: { fileSize: exports.BANNER_VIDEO_MAX_BYTES },
    };
}
/** Multipart field list for banner image + video uploads. */
exports.BANNER_MEDIA_MULTIPART_FIELDS = __spreadArray(__spreadArray([], exports.BANNER_IMAGE_FILE_FIELD_NAMES.map(function (name) { return ({ name: name, maxCount: 1 }); }), true), exports.BANNER_VIDEO_FILE_FIELD_NAMES.map(function (name) { return ({ name: name, maxCount: 1 }); }), true);
