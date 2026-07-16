"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUrnProductPerformanceDocument = isUrnProductPerformanceDocument;
exports.collectUrnScopedProductPerformanceDocuments = collectUrnScopedProductPerformanceDocuments;
exports.collectUrnScopedProductPerformanceDocumentsFromSources = collectUrnScopedProductPerformanceDocumentsFromSources;
exports.formatUrnProductPerformanceDocumentForResponse = formatUrnProductPerformanceDocumentForResponse;
exports.mergeRenewProductPerformanceDocumentsOntoDetailRows = mergeRenewProductPerformanceDocumentsOntoDetailRows;
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var PERFORMANCE_DOCUMENT_BUCKETS = [
    'product_performance_documents',
    'all_renew_product_documents',
    'all_urn_product_documents',
];
function performanceDocKey(doc) {
    var _a, _b, _c, _d, _e, _f, _g;
    return String((_c = (_b = (_a = doc.productDocumentId) !== null && _a !== void 0 ? _a : doc.product_document_id) !== null && _b !== void 0 ? _b : doc._id) !== null && _c !== void 0 ? _c : "".concat((_e = (_d = doc.documentLink) !== null && _d !== void 0 ? _d : doc.document_link) !== null && _e !== void 0 ? _e : '', "|").concat((_g = (_f = doc.documentOriginalName) !== null && _f !== void 0 ? _f : doc.document_original_name) !== null && _g !== void 0 ? _g : ''));
}
function isUrnProductPerformanceDocument(doc) {
    var _a, _b, _c, _d;
    if (!doc)
        return false;
    if (doc.isDeleted === true || doc.is_deleted === true)
        return false;
    var form = String((_b = (_a = doc.documentForm) !== null && _a !== void 0 ? _a : doc.document_form) !== null && _b !== void 0 ? _b : '')
        .trim()
        .toLowerCase();
    var sub = String((_d = (_c = doc.documentFormSubsection) !== null && _c !== void 0 ? _c : doc.document_form_subsection) !== null && _d !== void 0 ? _d : '')
        .trim()
        .toLowerCase();
    if (form && form !== document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE)
        return false;
    if (sub === 'test_report_files' || sub === 'product_performance')
        return true;
    if (!form && (sub === 'test_report_files' || sub === 'product_performance'))
        return true;
    if (form === document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE && !sub)
        return true;
    return false;
}
/** URN-scoped performance uploads from cert + renew document buckets. */
function collectUrnScopedProductPerformanceDocuments(product) {
    var seen = new Set();
    var out = [];
    var push = function (raw) {
        if (!raw || typeof raw !== 'object')
            return;
        var doc = raw;
        if (!isUrnProductPerformanceDocument(doc))
            return;
        var key = performanceDocKey(doc);
        if (seen.has(key))
            return;
        seen.add(key);
        out.push(doc);
    };
    for (var _i = 0, PERFORMANCE_DOCUMENT_BUCKETS_1 = PERFORMANCE_DOCUMENT_BUCKETS; _i < PERFORMANCE_DOCUMENT_BUCKETS_1.length; _i++) {
        var key = PERFORMANCE_DOCUMENT_BUCKETS_1[_i];
        var bucket = product[key];
        if (!Array.isArray(bucket))
            continue;
        for (var _a = 0, bucket_1 = bucket; _a < bucket_1.length; _a++) {
            var doc = bucket_1[_a];
            push(doc);
        }
    }
    return out;
}
function collectUrnScopedProductPerformanceDocumentsFromSources(sources) {
    var seen = new Set();
    var out = [];
    for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var source = sources_1[_i];
        for (var _a = 0, _b = collectUrnScopedProductPerformanceDocuments(source); _a < _b.length; _a++) {
            var doc = _b[_a];
            var key = performanceDocKey(doc);
            if (seen.has(key))
                continue;
            seen.add(key);
            out.push(doc);
        }
    }
    return out;
}
function formatUrnProductPerformanceDocumentForResponse(doc) {
    return {
        _id: doc._id,
        productDocumentId: doc.productDocumentId,
        vendorId: doc.vendorId,
        urnNo: doc.urnNo,
        eoiNo: doc.eoiNo,
        documentForm: doc.documentForm,
        documentFormSubsection: doc.documentFormSubsection,
        formPrimaryId: doc.formPrimaryId,
        documentName: doc.documentName,
        documentOriginalName: doc.documentOriginalName,
        documentLink: doc.documentLink,
        createdDate: doc.createdDate,
        updatedDate: doc.updatedDate,
    };
}
function mergeRenewProductPerformanceDocumentsOntoDetailRows(rows, renewPayload) {
    if (rows.length === 0)
        return rows;
    var mergedDocs = collectUrnScopedProductPerformanceDocumentsFromSources([
        rows[0],
        renewPayload,
    ]);
    if (mergedDocs.length === 0)
        return rows;
    var rootDocs = collectUrnScopedProductPerformanceDocuments(rows[0]);
    var rootIds = new Set(rootDocs.map(performanceDocKey));
    var hasNewDocs = mergedDocs.some(function (doc) { return !rootIds.has(performanceDocKey(doc)); });
    if (!hasNewDocs && mergedDocs.length <= rootDocs.length) {
        return rows;
    }
    var formatted = mergedDocs.map(formatUrnProductPerformanceDocumentForResponse);
    return rows.map(function (row, index) {
        return index === 0 ? __assign(__assign({}, row), { product_performance_documents: formatted }) : row;
    });
}
