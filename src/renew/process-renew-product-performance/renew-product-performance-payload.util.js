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
exports.mapRenewProductDocument = mapRenewProductDocument;
exports.resolveRowTestReports = resolveRowTestReports;
exports.parseIncomingRenewTestReports = parseIncomingRenewTestReports;
exports.normalizedProductNameKey = normalizedProductNameKey;
exports.normalizedTestReportFileNameKey = normalizedTestReportFileNameKey;
exports.isMeaningfulRenewTestReportRow = isMeaningfulRenewTestReportRow;
exports.normalizeIncomingRenewTestReportsForReplace = normalizeIncomingRenewTestReportsForReplace;
exports.toPublicRenewTestReports = toPublicRenewTestReports;
exports.buildRowsFromAuthoritativeTestReports = buildRowsFromAuthoritativeTestReports;
exports.groupTestReportsByEoi = groupTestReportsByEoi;
var form_partial_field_util_1 = require("../../common/form-partial-field.util");
function mapRenewProductDocument(doc) {
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
function resolveRowTestReports(row, eoiNo) {
    var _a, _b;
    if (!row) {
        return [];
    }
    var embedded = Array.isArray(row.testReports) ? row.testReports : [];
    if (embedded.length > 0) {
        return embedded
            .map(function (entry) {
            var normalized = (0, form_partial_field_util_1.normalizeTestReportRow)(entry);
            return __assign({ productName: normalized.productName, testReportFileName: normalized.testReportFileName }, (eoiNo ? { eoiNo: eoiNo } : {}));
        })
            .filter(function (r) { return r.productName.trim() || r.testReportFileName.trim(); });
    }
    var productName = String((_a = row.productName) !== null && _a !== void 0 ? _a : '').trim();
    var testReportFileName = String((_b = row.testReportFileName) !== null && _b !== void 0 ? _b : '').trim();
    if (!productName && !testReportFileName) {
        return [];
    }
    return [
        __assign({ productName: productName, testReportFileName: testReportFileName }, (eoiNo ? { eoiNo: eoiNo } : {})),
    ];
}
function parseIncomingRenewTestReports(raw, defaultProductName, defaultEoiNo) {
    var _a, _b;
    if (raw === undefined || raw === null) {
        return [];
    }
    var rows = [];
    if (Array.isArray(raw)) {
        rows = raw;
    }
    else if (typeof raw === 'string') {
        var trimmed = raw.trim();
        if (!trimmed) {
            return [];
        }
        try {
            var parsed = JSON.parse(trimmed);
            rows = Array.isArray(parsed)
                ? parsed
                : parsed && typeof parsed === 'object'
                    ? [parsed]
                    : [];
        }
        catch (_c) {
            return [];
        }
    }
    else if (typeof raw === 'object') {
        rows = [raw];
    }
    var seen = new Set();
    var result = [];
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        var normalized = (0, form_partial_field_util_1.normalizeTestReportRow)(row);
        var productName = (normalized.productName || defaultProductName || '').trim();
        var testReportFileName = normalized.testReportFileName.trim();
        var eoiNo = String((_b = (_a = row.eoiNo) !== null && _a !== void 0 ? _a : row.eoi_no) !== null && _b !== void 0 ? _b : '').trim() ||
            (defaultEoiNo === null || defaultEoiNo === void 0 ? void 0 : defaultEoiNo.trim()) ||
            undefined;
        if (!productName && !testReportFileName) {
            continue;
        }
        var key = "".concat(eoiNo !== null && eoiNo !== void 0 ? eoiNo : '', "__").concat(productName.toLowerCase(), "__").concat(testReportFileName.toLowerCase());
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        result.push(__assign({ productName: productName, testReportFileName: testReportFileName }, (eoiNo ? { eoiNo: eoiNo } : {})));
    }
    return result;
}
var EMPTY_PRODUCT_KEY = '__default__';
var EMPTY_FILE_KEY = '__unnamed__';
function normalizedProductNameKey(productName) {
    return String(productName !== null && productName !== void 0 ? productName : '').trim().toLowerCase() || EMPTY_PRODUCT_KEY;
}
function normalizedTestReportFileNameKey(testReportFileName) {
    return String(testReportFileName !== null && testReportFileName !== void 0 ? testReportFileName : '').trim().toLowerCase() || EMPTY_FILE_KEY;
}
function isMeaningfulRenewTestReportRow(productName, testReportFileName) {
    return Boolean(productName.trim() || testReportFileName.trim());
}
function normalizeIncomingRenewTestReportsForReplace(raw, defaultEoiNo) {
    var _a;
    var parsed = parseIncomingRenewTestReports(raw, undefined, defaultEoiNo);
    var seen = new Set();
    var result = [];
    for (var _i = 0, parsed_1 = parsed; _i < parsed_1.length; _i++) {
        var row = parsed_1[_i];
        if (!isMeaningfulRenewTestReportRow(row.productName, row.testReportFileName)) {
            continue;
        }
        var normalizedProductName = normalizedProductNameKey(row.productName);
        var normalizedTestReportFileName = normalizedTestReportFileNameKey(row.testReportFileName);
        var key = "".concat((_a = row.eoiNo) !== null && _a !== void 0 ? _a : '', "__").concat(normalizedProductName, "__").concat(normalizedTestReportFileName);
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        result.push(__assign(__assign({}, row), { normalizedProductName: normalizedProductName, normalizedTestReportFileName: normalizedTestReportFileName }));
    }
    return result;
}
function toPublicRenewTestReports(rows) {
    return rows.map(function (r) { return (__assign({ productName: r.productName, testReportFileName: r.testReportFileName }, (r.eoiNo ? { eoiNo: r.eoiNo } : {}))); });
}
function buildRowsFromAuthoritativeTestReports(products, testReports, header, documents, urnNo) {
    var _a, _b, _c;
    var byEoi = groupTestReportsByEoi(testReports, products.map(function (p) { return ({ eoiNo: p.eoiNo, productName: p.productName }); }));
    var processRenewProductPerformanceId = header === null || header === void 0 ? void 0 : header.processRenewProductPerformanceId;
    var productPerformanceStatus = Number((_a = header === null || header === void 0 ? void 0 : header.productPerformanceStatus) !== null && _a !== void 0 ? _a : 0);
    var renewalType = Number((_b = header === null || header === void 0 ? void 0 : header.renewalType) !== null && _b !== void 0 ? _b : 0);
    var testReportFiles = Math.max(Number((_c = header === null || header === void 0 ? void 0 : header.testReportFiles) !== null && _c !== void 0 ? _c : documents.length), testReports.length);
    return products.map(function (product) {
        var _a;
        var nested = ((_a = byEoi.get(product.eoiNo)) !== null && _a !== void 0 ? _a : []).map(function (_a) {
            var productName = _a.productName, testReportFileName = _a.testReportFileName;
            return ({
                productName: productName,
                testReportFileName: testReportFileName,
                eoiNo: product.eoiNo,
            });
        });
        var rowDocuments = documents.filter(function (d) { return !d.eoiNo || d.eoiNo === product.eoiNo; });
        return {
            _id: header === null || header === void 0 ? void 0 : header._id,
            processRenewProductPerformanceId: processRenewProductPerformanceId,
            urnNo: urnNo,
            eoiNo: product.eoiNo,
            productName: product.productName,
            productPerformanceStatus: productPerformanceStatus,
            renewalType: renewalType,
            testReportFiles: testReportFiles,
            testReports: nested,
            documents: rowDocuments,
        };
    });
}
function groupTestReportsByEoi(reports, products) {
    var _a, _b;
    var byEoi = new Map();
    var nameToEoi = new Map();
    for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
        var p = products_1[_i];
        nameToEoi.set(p.productName.trim().toLowerCase(), p.eoiNo);
        byEoi.set(p.eoiNo, []);
    }
    for (var _c = 0, reports_1 = reports; _c < reports_1.length; _c++) {
        var report = reports_1[_c];
        var eoiNo = (_a = report.eoiNo) === null || _a === void 0 ? void 0 : _a.trim();
        if (!eoiNo && report.productName.trim()) {
            eoiNo = nameToEoi.get(report.productName.trim().toLowerCase());
        }
        if (!eoiNo && products.length === 1) {
            eoiNo = products[0].eoiNo;
        }
        if (!eoiNo) {
            continue;
        }
        var list = (_b = byEoi.get(eoiNo)) !== null && _b !== void 0 ? _b : [];
        list.push({
            productName: report.productName,
            testReportFileName: report.testReportFileName,
            eoiNo: eoiNo,
        });
        byEoi.set(eoiNo, list);
    }
    return byEoi;
}
