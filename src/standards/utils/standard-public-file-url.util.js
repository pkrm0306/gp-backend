"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveStandardPublicFileUrl = resolveStandardPublicFileUrl;
exports.normalizeStandardRelativePath = normalizeStandardRelativePath;
/**
 * Canonical browser path for a standard document stored via uploadFile() (`uploads/standards/...`).
 */
function resolveStandardPublicFileUrl(input) {
    var _a, _b, _c;
    var storage = String((_a = input.storage_type) !== null && _a !== void 0 ? _a : '').toLowerCase();
    var fileUrl = String((_b = input.file_url) !== null && _b !== void 0 ? _b : '').trim();
    var filename = String((_c = input.filename) !== null && _c !== void 0 ? _c : '').trim();
    if (fileUrl && /^https?:\/\//i.test(fileUrl)) {
        return fileUrl;
    }
    if (storage === 's3' && fileUrl) {
        return fileUrl;
    }
    var rel = normalizeStandardRelativePath(filename || fileUrl);
    if (!rel) {
        return undefined;
    }
    return "/uploads/".concat(rel.split('/').map(encodeURIComponent).join('/'));
}
/** Relative path under `uploads/` (e.g. `standards/1700_file.pdf`). */
function normalizeStandardRelativePath(raw) {
    var path = String(raw !== null && raw !== void 0 ? raw : '').trim().replace(/^\/+/, '');
    if (!path)
        return '';
    if (path.startsWith('uploads/')) {
        path = path.slice('uploads/'.length);
    }
    if (!path.startsWith('standards/')) {
        path = "standards/".concat(path);
    }
    return path;
}
