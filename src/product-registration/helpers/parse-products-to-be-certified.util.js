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
exports.parseProductsToBeCertified = parseProductsToBeCertified;
exports.hasProductsToBeCertified = hasProductsToBeCertified;
exports.formatProductsToBeCertified = formatProductsToBeCertified;
exports.getProductsToBeCertifiedValidationError = getProductsToBeCertifiedValidationError;
exports.normalizeProductsToBeCertifiedStorage = normalizeProductsToBeCertifiedStorage;
exports.resolveProductIdsFromCertifiedField = resolveProductIdsFromCertifiedField;
var mongoose_1 = require("mongoose");
var PRODUCT_IDS_REQUIRED_MESSAGE = 'productsToBeCertified must be a JSON array of numeric productId values (e.g. "[101,102]"). Product names are not accepted.';
/**
 * Parse payment `productsToBeCertified` — **numeric productId only** (JSON array or comma-separated).
 * Optional MongoDB `_id` strings are resolved to productId when certifying.
 */
function parseProductsToBeCertified(raw) {
    var productIds = [];
    var mongoIds = [];
    if (raw === undefined || raw === null || String(raw).trim() === '') {
        return { productIds: productIds, mongoIds: mongoIds };
    }
    var trimmed = String(raw).trim();
    var items = [];
    try {
        var parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
            items = parsed;
        }
        else if (typeof parsed === 'number' || typeof parsed === 'string') {
            items = [parsed];
        }
    }
    catch (_a) {
        items = trimmed.split(',').map(function (part) { return part.trim(); });
    }
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        if (item === null || item === undefined || item === '') {
            continue;
        }
        if (typeof item === 'number' && Number.isFinite(item) && item > 0) {
            productIds.push(Math.trunc(item));
            continue;
        }
        var asString = String(item).trim();
        if (!asString) {
            continue;
        }
        if (mongoose_1.Types.ObjectId.isValid(asString) &&
            String(new mongoose_1.Types.ObjectId(asString)) === asString) {
            mongoIds.push(new mongoose_1.Types.ObjectId(asString));
            continue;
        }
        var asNum = Number(asString);
        if (Number.isFinite(asNum) && asNum > 0) {
            productIds.push(Math.trunc(asNum));
        }
    }
    return {
        productIds: __spreadArray([], new Set(productIds), true),
        mongoIds: __spreadArray([], new Map(mongoIds.map(function (id) { return [id.toString(), id]; })).values(), true),
    };
}
function hasProductsToBeCertified(parsed) {
    return parsed.productIds.length > 0 || parsed.mongoIds.length > 0;
}
/** Canonical storage format for `payment_details.productsToBeCertified`. */
function formatProductsToBeCertified(productIds) {
    var ids = __spreadArray([], new Set(productIds
        .map(function (id) { return Math.trunc(Number(id)); })
        .filter(function (id) { return Number.isFinite(id) && id > 0; })), true);
    return JSON.stringify(ids);
}
function getProductsToBeCertifiedValidationError(raw) {
    if (!String(raw !== null && raw !== void 0 ? raw : '').trim()) {
        return 'productsToBeCertified is required for certification payments';
    }
    if (!hasProductsToBeCertified(parseProductsToBeCertified(raw))) {
        return PRODUCT_IDS_REQUIRED_MESSAGE;
    }
    return null;
}
/**
 * Validate and return canonical JSON array string of numeric productIds for DB storage.
 */
function normalizeProductsToBeCertifiedStorage(raw) {
    var message = getProductsToBeCertifiedValidationError(raw);
    if (message) {
        throw new Error(message);
    }
    var productIds = parseProductsToBeCertified(raw).productIds;
    return formatProductsToBeCertified(productIds);
}
/**
 * Resolve numeric `productId` list from stored payment field (IDs + optional Mongo `_id`s only).
 */
function resolveProductIdsFromCertifiedField(raw, urnProducts) {
    var parsed = parseProductsToBeCertified(raw);
    var selected = new Set(parsed.productIds);
    var _loop_1 = function (oid) {
        var row = urnProducts.find(function (p) { return String(p._id) === String(oid); });
        if ((row === null || row === void 0 ? void 0 : row.productId) != null) {
            selected.add(row.productId);
        }
    };
    for (var _i = 0, _a = parsed.mongoIds; _i < _a.length; _i++) {
        var oid = _a[_i];
        _loop_1(oid);
    }
    return __spreadArray([], selected, true);
}
