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
exports.exactProductNameKey = exactProductNameKey;
exports.normalizeProductNameKey = normalizeProductNameKey;
exports.buildCertifiedProductMatchKey = buildCertifiedProductMatchKey;
exports.compareCertifiedProductAge = compareCertifiedProductAge;
exports.isTargetOlderThanSource = isTargetOlderThanSource;
exports.findOldestMatchingCertifiedTarget = findOldestMatchingCertifiedTarget;
exports.hasNewerMatchingCertifiedCandidate = hasNewerMatchingCertifiedCandidate;
var merge_eligibility_shared_1 = require("../../helpers/merge-eligibility.shared");
function exactProductNameKey(productName) {
    return (0, merge_eligibility_shared_1.normalizeTrimmedValue)(String(productName !== null && productName !== void 0 ? productName : ''));
}
/** @deprecated Use exactProductNameKey — kept for tests migrating from case-insensitive keys */
function normalizeProductNameKey(productName) {
    return exactProductNameKey(productName);
}
function buildCertifiedProductMatchKey(product) {
    return [
        exactProductNameKey(product.productName),
        String(product.manufacturerId),
        String(product.categoryId),
    ].join('|');
}
function compareCertifiedProductAge(left, right) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var leftCertified = (_b = (_a = left.certifiedDate) === null || _a === void 0 ? void 0 : _a.getTime()) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER;
    var rightCertified = (_d = (_c = right.certifiedDate) === null || _c === void 0 ? void 0 : _c.getTime()) !== null && _d !== void 0 ? _d : Number.MAX_SAFE_INTEGER;
    if (leftCertified !== rightCertified) {
        return leftCertified - rightCertified;
    }
    var leftCreated = (_f = (_e = left.createdDate) === null || _e === void 0 ? void 0 : _e.getTime()) !== null && _f !== void 0 ? _f : Number.MAX_SAFE_INTEGER;
    var rightCreated = (_h = (_g = right.createdDate) === null || _g === void 0 ? void 0 : _g.getTime()) !== null && _h !== void 0 ? _h : Number.MAX_SAFE_INTEGER;
    return leftCreated - rightCreated;
}
function isTargetOlderThanSource(target, source) {
    return compareCertifiedProductAge(target, source) < 0;
}
function findOldestMatchingCertifiedTarget(source, candidates, excludeUrnNo) {
    var _a;
    var sourceKey = buildCertifiedProductMatchKey(source);
    var excludedUrn = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(excludeUrnNo);
    var matches = candidates.filter(function (candidate) {
        if ((0, merge_eligibility_shared_1.normalizeTrimmedValue)(candidate.urnNo) === excludedUrn) {
            return false;
        }
        if (buildCertifiedProductMatchKey(candidate) !== sourceKey) {
            return false;
        }
        return isTargetOlderThanSource(candidate, source);
    });
    if (matches.length === 0) {
        return null;
    }
    return (_a = __spreadArray([], matches, true).sort(compareCertifiedProductAge)[0]) !== null && _a !== void 0 ? _a : null;
}
/** True when a same-name match exists on another URN but none is older than the source. */
function hasNewerMatchingCertifiedCandidate(source, candidates, excludeUrnNo) {
    var sourceKey = buildCertifiedProductMatchKey(source);
    var excludedUrn = (0, merge_eligibility_shared_1.normalizeTrimmedValue)(excludeUrnNo);
    return candidates.some(function (candidate) {
        if ((0, merge_eligibility_shared_1.normalizeTrimmedValue)(candidate.urnNo) === excludedUrn) {
            return false;
        }
        if (buildCertifiedProductMatchKey(candidate) !== sourceKey) {
            return false;
        }
        return !isTargetOlderThanSource(candidate, source);
    });
}
