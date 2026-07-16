"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifySummitInput = slugifySummitInput;
exports.isValidSummitSlug = isValidSummitSlug;
exports.buildSummitSlug = buildSummitSlug;
function slugifySummitInput(raw) {
    return String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function isValidSummitSlug(slug) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 2;
}
/**
 * Server-generated summit URL slug (admin no longer sends slug).
 * Includes calendar year so different years with the same title stay unique.
 */
function buildSummitSlug(title, year) {
    var base = slugifySummitInput(title);
    var normalizedYear = String(year !== null && year !== void 0 ? year : '').trim();
    if (!normalizedYear) {
        return base;
    }
    if (base === normalizedYear || base.endsWith("-".concat(normalizedYear))) {
        return base;
    }
    return "".concat(base, "-").concat(normalizedYear);
}
