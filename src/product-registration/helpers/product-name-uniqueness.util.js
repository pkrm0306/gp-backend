"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_NAME_ALREADY_EXISTS_MESSAGE = void 0;
exports.normalizeProductNameForComparison = normalizeProductNameForComparison;
exports.productNameEqualsFilter = productNameEqualsFilter;
exports.PRODUCT_NAME_ALREADY_EXISTS_MESSAGE = 'Product Name already exists. Please enter a unique Product Name.';
/** Trim and collapse internal whitespace for stable comparisons. */
function normalizeProductNameForComparison(name) {
    return String(name !== null && name !== void 0 ? name : '')
        .trim()
        .replace(/\s+/g, ' ');
}
/** Case-insensitive exact match filter for MongoDB `productName` / `requestedName`. */
function productNameEqualsFilter(name) {
    var normalized = normalizeProductNameForComparison(name);
    if (!normalized) {
        return null;
    }
    var escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return { $regex: "^".concat(escaped, "$"), $options: 'i' };
}
