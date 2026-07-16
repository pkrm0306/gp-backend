"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCategoryDisplayName = formatCategoryDisplayName;
exports.normalizeCategoryNameKey = normalizeCategoryNameKey;
/** Trim, collapse internal whitespace to single spaces (display-safe). */
function formatCategoryDisplayName(name) {
    return String(name !== null && name !== void 0 ? name : '')
        .trim()
        .replace(/\s+/g, ' ');
}
/** Same rules as display, then lowercase — used for global uniqueness. */
function normalizeCategoryNameKey(name) {
    return formatCategoryDisplayName(name).toLowerCase();
}
