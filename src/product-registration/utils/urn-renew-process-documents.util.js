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
exports.isUrnManufacturingProcessDocument = isUrnManufacturingProcessDocument;
exports.isUrnWasteManagementProcessDocument = isUrnWasteManagementProcessDocument;
exports.isUrnInnovationProcessDocument = isUrnInnovationProcessDocument;
exports.collectUrnScopedManufacturingProcessDocuments = collectUrnScopedManufacturingProcessDocuments;
exports.collectUrnScopedWasteManagementProcessDocuments = collectUrnScopedWasteManagementProcessDocuments;
exports.collectUrnScopedInnovationProcessDocuments = collectUrnScopedInnovationProcessDocuments;
exports.formatUrnProcessDocumentForResponse = formatUrnProcessDocumentForResponse;
exports.mergeRenewManufacturingDocumentsOntoDetailRows = mergeRenewManufacturingDocumentsOntoDetailRows;
exports.mergeRenewWasteManagementDocumentsOntoDetailRows = mergeRenewWasteManagementDocumentsOntoDetailRows;
exports.mergeRenewInnovationDocumentsOntoDetailRows = mergeRenewInnovationDocumentsOntoDetailRows;
exports.mergeAllRenewProcessDocumentsOntoDetailRows = mergeAllRenewProcessDocumentsOntoDetailRows;
exports.finalizeUrnProcessDocumentFieldsOnDetailRows = finalizeUrnProcessDocumentFieldsOnDetailRows;
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var PROCESS_DOCUMENT_BUCKETS = [
    'process_manufacturing_documents',
    'process_waste_management_documents',
    'process_innovation_documents',
    'all_renew_product_documents',
    'all_urn_product_documents',
    'documents',
];
var MANUFACTURING_DOC_SUBSECTIONS = new Set([
    'energy_conservation_supporting_documents',
    'energy_consumption_documents',
]);
function pickString() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
        var value = values_1[_a];
        if (value == null || value === '')
            continue;
        return String(value).trim();
    }
    return '';
}
function processDocKey(doc) {
    var _a, _b, _c, _d, _e, _f, _g;
    return String((_c = (_b = (_a = doc.productDocumentId) !== null && _a !== void 0 ? _a : doc.product_document_id) !== null && _b !== void 0 ? _b : doc._id) !== null && _c !== void 0 ? _c : "".concat((_e = (_d = doc.documentLink) !== null && _d !== void 0 ? _d : doc.document_link) !== null && _e !== void 0 ? _e : '', "|").concat((_g = (_f = doc.documentOriginalName) !== null && _f !== void 0 ? _f : doc.document_original_name) !== null && _g !== void 0 ? _g : ''));
}
function isDeletedDoc(doc) {
    return doc.isDeleted === true || doc.is_deleted === true;
}
function isUrnManufacturingProcessDocument(doc) {
    if (!doc || isDeletedDoc(doc))
        return false;
    var form = pickString(doc.documentForm, doc.document_form).toLowerCase();
    var sub = pickString(doc.documentFormSubsection, doc.document_form_subsection).toLowerCase();
    if (form && form !== document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING)
        return false;
    if (MANUFACTURING_DOC_SUBSECTIONS.has(sub))
        return true;
    if (form === document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING && !sub)
        return true;
    return false;
}
function isUrnWasteManagementProcessDocument(doc) {
    if (!doc || isDeletedDoc(doc))
        return false;
    var form = pickString(doc.documentForm, doc.document_form).toLowerCase();
    var sub = pickString(doc.documentFormSubsection, doc.document_form_subsection).toLowerCase();
    if (form && form !== document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT)
        return false;
    if (sub === 'wm_supporting_documents' || sub === 'wm_supporting_document') {
        return true;
    }
    if (form === document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT) {
        if (!sub)
            return true;
        if (sub === 'supporting_documents')
            return true;
    }
    if (!form &&
        (sub === 'wm_supporting_documents' || sub === 'wm_supporting_document')) {
        return true;
    }
    return false;
}
function isUrnInnovationProcessDocument(doc) {
    if (!doc || isDeletedDoc(doc))
        return false;
    var form = pickString(doc.documentForm, doc.document_form).toLowerCase();
    var sub = pickString(doc.documentFormSubsection, doc.document_form_subsection).toLowerCase();
    if (form &&
        form !== document_section_key_constants_1.DocumentSectionKey.PROCESS_INNOVATION &&
        !form.includes('innovation')) {
        return false;
    }
    if (sub === 'innovation_implementation_documents' ||
        sub.includes('innovation')) {
        return true;
    }
    if (form === document_section_key_constants_1.DocumentSectionKey.PROCESS_INNOVATION ||
        form.includes('innovation')) {
        return true;
    }
    return false;
}
function collectSectionDocuments(sources, rowDocKey, matches) {
    var seen = new Set();
    var out = [];
    var push = function (raw) {
        if (!raw || typeof raw !== 'object')
            return;
        var doc = raw;
        if (!matches(doc))
            return;
        var key = processDocKey(doc);
        if (seen.has(key))
            return;
        seen.add(key);
        out.push(doc);
    };
    for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var source = sources_1[_i];
        if (Array.isArray(source[rowDocKey])) {
            for (var _a = 0, _b = source[rowDocKey]; _a < _b.length; _a++) {
                var doc = _b[_a];
                push(doc);
            }
        }
        for (var _c = 0, PROCESS_DOCUMENT_BUCKETS_1 = PROCESS_DOCUMENT_BUCKETS; _c < PROCESS_DOCUMENT_BUCKETS_1.length; _c++) {
            var key = PROCESS_DOCUMENT_BUCKETS_1[_c];
            if (!Array.isArray(source[key]))
                continue;
            for (var _d = 0, _e = source[key]; _d < _e.length; _d++) {
                var doc = _e[_d];
                push(doc);
            }
        }
    }
    return out;
}
function collectUrnScopedManufacturingProcessDocuments(product) {
    return collectSectionDocuments([product], 'process_manufacturing_documents', isUrnManufacturingProcessDocument);
}
function collectUrnScopedWasteManagementProcessDocuments(product) {
    return collectSectionDocuments([product], 'process_waste_management_documents', isUrnWasteManagementProcessDocument);
}
function collectUrnScopedInnovationProcessDocuments(product) {
    return collectSectionDocuments([product], 'process_innovation_documents', isUrnInnovationProcessDocument);
}
function collectFromSources(sources, rowDocKey, matches) {
    return collectSectionDocuments(sources, rowDocKey, matches);
}
function formatUrnProcessDocumentForResponse(doc) {
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
        documentTag: doc.documentTag,
        createdDate: doc.createdDate,
        updatedDate: doc.updatedDate,
    };
}
function mergeSectionDocumentsOntoDetailRows(rows, renewPayload, rowDocKey, matches) {
    if (rows.length === 0)
        return rows;
    var mergedDocs = collectFromSources([rows[0], renewPayload], rowDocKey, matches);
    if (mergedDocs.length === 0)
        return rows;
    var rootDocs = collectFromSources([rows[0]], rowDocKey, matches);
    var rootIds = new Set(rootDocs.map(processDocKey));
    var hasNewDocs = mergedDocs.some(function (doc) { return !rootIds.has(processDocKey(doc)); });
    if (!hasNewDocs && mergedDocs.length <= rootDocs.length) {
        return rows;
    }
    var formatted = mergedDocs.map(formatUrnProcessDocumentForResponse);
    return rows.map(function (row, index) {
        var _a;
        return index === 0 ? __assign(__assign({}, row), (_a = {}, _a[rowDocKey] = formatted, _a)) : row;
    });
}
function mergeRenewManufacturingDocumentsOntoDetailRows(rows, renewPayload) {
    return mergeSectionDocumentsOntoDetailRows(rows, renewPayload, 'process_manufacturing_documents', isUrnManufacturingProcessDocument);
}
function mergeRenewWasteManagementDocumentsOntoDetailRows(rows, renewPayload) {
    return mergeSectionDocumentsOntoDetailRows(rows, renewPayload, 'process_waste_management_documents', isUrnWasteManagementProcessDocument);
}
function mergeRenewInnovationDocumentsOntoDetailRows(rows, renewPayload) {
    return mergeSectionDocumentsOntoDetailRows(rows, renewPayload, 'process_innovation_documents', isUrnInnovationProcessDocument);
}
function mergeAllRenewProcessDocumentsOntoDetailRows(rows, renewPayload) {
    var resolved = rows;
    resolved = mergeRenewManufacturingDocumentsOntoDetailRows(resolved, renewPayload);
    resolved = mergeRenewWasteManagementDocumentsOntoDetailRows(resolved, renewPayload);
    resolved = mergeRenewInnovationDocumentsOntoDetailRows(resolved, renewPayload);
    return resolved;
}
function mergeProcessDocumentBuckets() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i] = arguments[_i];
    }
    var merged = {};
    var keys = new Set(__spreadArray(__spreadArray([], PROCESS_DOCUMENT_BUCKETS, true), [
        'process_manufacturing_documents',
        'process_waste_management_documents',
        'process_innovation_documents',
    ], false));
    for (var _a = 0, sources_2 = sources; _a < sources_2.length; _a++) {
        var source = sources_2[_a];
        for (var _b = 0, keys_1 = keys; _b < keys_1.length; _b++) {
            var key = keys_1[_b];
            if (!Array.isArray(source[key]))
                continue;
            var prev = Array.isArray(merged[key]) ? merged[key] : [];
            merged[key] = __spreadArray(__spreadArray([], prev, true), source[key], true);
        }
    }
    return merged;
}
/** Union cert + renew buckets into section arrays on the primary URN detail row. */
function finalizeUrnProcessDocumentFieldsOnDetailRows(rows, extraSources) {
    if (extraSources === void 0) { extraSources = []; }
    if (rows.length === 0)
        return rows;
    var bucket = mergeProcessDocumentBuckets.apply(void 0, __spreadArray([rows[0]], extraSources, false));
    return rows.map(function (row, index) {
        return index === 0
            ? __assign(__assign({}, row), { process_manufacturing_documents: collectUrnScopedManufacturingProcessDocuments(bucket).map(formatUrnProcessDocumentForResponse), process_waste_management_documents: collectUrnScopedWasteManagementProcessDocuments(bucket).map(formatUrnProcessDocumentForResponse), process_innovation_documents: collectUrnScopedInnovationProcessDocuments(bucket).map(formatUrnProcessDocumentForResponse) }) : row;
    });
}
