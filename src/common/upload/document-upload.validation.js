"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STANDARD_DOCUMENT_MIMES = exports.STANDARD_DOCUMENT_EXTENSIONS = exports.STANDARD_DOCUMENT_VALIDATION_MESSAGE = void 0;
exports.standardDocumentExtension = standardDocumentExtension;
exports.isAllowedStandardDocumentFile = isAllowedStandardDocumentFile;
exports.assertStandardDocumentFileTypes = assertStandardDocumentFileTypes;
exports.standardDocumentMulterFileFilter = standardDocumentMulterFileFilter;
var common_1 = require("@nestjs/common");
var path_1 = require("path");
exports.STANDARD_DOCUMENT_VALIDATION_MESSAGE = 'Only PDF and Excel (.pdf, .xls, .xlsx) files are allowed';
exports.STANDARD_DOCUMENT_EXTENSIONS = new Set(['.pdf', '.xls', '.xlsx']);
exports.STANDARD_DOCUMENT_MIMES = new Set([
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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
function standardDocumentExtension(originalname) {
    return (0, path_1.extname)(String(originalname !== null && originalname !== void 0 ? originalname : '')).toLowerCase();
}
function mimeMatchesExtension(ext, mime) {
    if (UNTRUSTED_MIMES_ALLOWED_WITH_EXTENSION.has(mime)) {
        return true;
    }
    if (ext === '.pdf') {
        return mime === 'application/pdf';
    }
    if (ext === '.xlsx') {
        return (mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }
    if (ext === '.xls') {
        return mime === 'application/vnd.ms-excel';
    }
    if (!ext) {
        return exports.STANDARD_DOCUMENT_MIMES.has(mime);
    }
    return false;
}
function isAllowedStandardDocumentFile(file) {
    var _a;
    var ext = standardDocumentExtension(file.originalname);
    var mime = String((_a = file.mimetype) !== null && _a !== void 0 ? _a : '').toLowerCase();
    if (BLOCKED_DOCUMENT_MIMES.has(mime)) {
        return false;
    }
    var extAllowed = exports.STANDARD_DOCUMENT_EXTENSIONS.has(ext);
    var mimeAllowed = exports.STANDARD_DOCUMENT_MIMES.has(mime);
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
function assertStandardDocumentFileTypes(files) {
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (!isAllowedStandardDocumentFile(file)) {
            throw new common_1.BadRequestException(exports.STANDARD_DOCUMENT_VALIDATION_MESSAGE);
        }
    }
}
function standardDocumentMulterFileFilter(_req, file, cb) {
    if (!file) {
        cb(null, true);
        return;
    }
    if (isAllowedStandardDocumentFile(file)) {
        cb(null, true);
        return;
    }
    cb(new common_1.BadRequestException(exports.STANDARD_DOCUMENT_VALIDATION_MESSAGE), false);
}
