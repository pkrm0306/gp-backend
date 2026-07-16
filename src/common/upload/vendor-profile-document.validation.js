"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VENDOR_PROFILE_DOCUMENT_MIMES = exports.VENDOR_PROFILE_DOCUMENT_EXTENSIONS = exports.VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE = void 0;
exports.vendorProfileDocumentExtension = vendorProfileDocumentExtension;
exports.isAllowedVendorProfileDocumentFile = isAllowedVendorProfileDocumentFile;
exports.assertVendorProfileDocumentFileTypes = assertVendorProfileDocumentFileTypes;
var common_1 = require("@nestjs/common");
var path_1 = require("path");
exports.VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE = 'Only PDF, JPG, and PNG (.pdf, .jpg, .jpeg, .png) files are allowed';
exports.VENDOR_PROFILE_DOCUMENT_EXTENSIONS = new Set([
    '.pdf',
    '.jpg',
    '.jpeg',
    '.png',
]);
exports.VENDOR_PROFILE_DOCUMENT_MIMES = new Set([
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/png',
]);
var UNTRUSTED_MIMES_ALLOWED_WITH_EXTENSION = new Set([
    'application/octet-stream',
    'binary/octet-stream',
    '',
]);
var BLOCKED_DOCUMENT_MIMES = new Set([
    'application/javascript',
    'text/javascript',
    'application/x-javascript',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-zip',
    'multipart/x-zip',
    'application/x-msdownload',
]);
function vendorProfileDocumentExtension(originalname) {
    return (0, path_1.extname)(String(originalname !== null && originalname !== void 0 ? originalname : '')).toLowerCase();
}
function mimeMatchesExtension(ext, mime) {
    if (UNTRUSTED_MIMES_ALLOWED_WITH_EXTENSION.has(mime)) {
        return true;
    }
    if (ext === '.pdf') {
        return mime === 'application/pdf';
    }
    if (ext === '.jpg' || ext === '.jpeg') {
        return (mime === 'image/jpeg' || mime === 'image/jpg' || mime === 'image/pjpeg');
    }
    if (ext === '.png') {
        return mime === 'image/png';
    }
    if (!ext) {
        return exports.VENDOR_PROFILE_DOCUMENT_MIMES.has(mime);
    }
    return false;
}
function isAllowedVendorProfileDocumentFile(file) {
    var _a;
    var ext = vendorProfileDocumentExtension(file.originalname);
    var mime = String((_a = file.mimetype) !== null && _a !== void 0 ? _a : '').toLowerCase();
    if (BLOCKED_DOCUMENT_MIMES.has(mime)) {
        return false;
    }
    var extAllowed = exports.VENDOR_PROFILE_DOCUMENT_EXTENSIONS.has(ext);
    var mimeAllowed = exports.VENDOR_PROFILE_DOCUMENT_MIMES.has(mime);
    if (ext && !extAllowed) {
        return false;
    }
    if (!ext && !mimeAllowed) {
        return false;
    }
    if (ext && !mimeMatchesExtension(ext, mime)) {
        return false;
    }
    if (mimeAllowed || UNTRUSTED_MIMES_ALLOWED_WITH_EXTENSION.has(mime)) {
        return extAllowed || !ext;
    }
    return false;
}
function assertVendorProfileDocumentFileTypes(files) {
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (!isAllowedVendorProfileDocumentFile(file)) {
            throw new common_1.BadRequestException(exports.VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE);
        }
    }
}
