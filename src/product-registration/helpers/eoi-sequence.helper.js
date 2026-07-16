"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEoiSequenceSuffix = parseEoiSequenceSuffix;
exports.compareProductsForResequence = compareProductsForResequence;
exports.findDuplicateEoiSequenceSuffixes = findDuplicateEoiSequenceSuffixes;
/**
 * EOI format: GP + manufacturerInitial + 3-digit internalId + 3-digit sequence.
 * Example: GPPMI003004 → sequence suffix 004.
 */
var EOI_SEQUENCE_SUFFIX_LENGTH = 3;
/** Extract manufacturer-wise sequence number from the last 3 characters of eoiNo. */
function parseEoiSequenceSuffix(eoiNo) {
    if (!eoiNo || typeof eoiNo !== 'string') {
        return null;
    }
    var trimmed = eoiNo.trim();
    if (trimmed.length < EOI_SEQUENCE_SUFFIX_LENGTH) {
        return null;
    }
    var suffix = trimmed.slice(-EOI_SEQUENCE_SUFFIX_LENGTH);
    if (!/^\d{3}$/.test(suffix)) {
        return null;
    }
    var value = parseInt(suffix, 10);
    return Number.isFinite(value) && value >= 1 ? value : null;
}
/** Sort key for active EOIs: sequence suffix, then createdDate, then productId. */
function compareProductsForResequence(a, b) {
    var _a, _b;
    var seqA = parseEoiSequenceSuffix(a.eoiNo);
    var seqB = parseEoiSequenceSuffix(b.eoiNo);
    if (seqA != null && seqB != null && seqA !== seqB) {
        return seqA - seqB;
    }
    if (seqA != null && seqB == null) {
        return -1;
    }
    if (seqA == null && seqB != null) {
        return 1;
    }
    var dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
    var dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
    if (dateA !== dateB) {
        return dateA - dateB;
    }
    return ((_a = a.productId) !== null && _a !== void 0 ? _a : 0) - ((_b = b.productId) !== null && _b !== void 0 ? _b : 0);
}
/** Detect duplicate sequence suffixes among active products (corruption recovery signal). */
function findDuplicateEoiSequenceSuffixes(products) {
    var _a;
    var seen = new Map();
    var duplicates = [];
    for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
        var product = products_1[_i];
        var suffix = parseEoiSequenceSuffix(product.eoiNo);
        if (suffix == null) {
            continue;
        }
        var count = ((_a = seen.get(suffix)) !== null && _a !== void 0 ? _a : 0) + 1;
        seen.set(suffix, count);
        if (count === 2) {
            duplicates.push(suffix);
        }
    }
    return duplicates;
}
