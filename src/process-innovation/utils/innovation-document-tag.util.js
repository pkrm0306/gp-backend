"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeInnovationDocumentTag = normalizeInnovationDocumentTag;
exports.parseInnovationDocumentTagsForUpload = parseInnovationDocumentTagsForUpload;
var ALLOWED = new Set(['tech', 'process', 'social']);
function normalizeInnovationDocumentTag(value) {
    var s = String(value !== null && value !== void 0 ? value : '')
        .trim()
        .toLowerCase();
    if (ALLOWED.has(s))
        return s;
    return 'tech';
}
/**
 * One tag per uploaded file, in the same order as `innovationImplementationDocumentsFile` parts.
 * Accepts JSON array string in multipart (`["tech","process"]`) or comma-separated values.
 * Missing entries default to **tech**.
 */
function parseInnovationDocumentTagsForUpload(raw, fileCount) {
    if (fileCount <= 0)
        return [];
    var arr = [];
    if (typeof raw === 'string' && raw.trim() !== '') {
        var trimmed = raw.trim();
        try {
            var parsed = JSON.parse(trimmed);
            arr = Array.isArray(parsed)
                ? parsed
                : trimmed.split(',').map(function (x) { return x.trim(); });
        }
        catch (_a) {
            arr = trimmed.split(',').map(function (x) { return x.trim(); });
        }
    }
    else if (Array.isArray(raw)) {
        arr = raw;
    }
    var out = [];
    for (var i = 0; i < fileCount; i++) {
        out.push(normalizeInnovationDocumentTag(arr[i]));
    }
    return out;
}
