"use strict";
/**
 * Vendor partial-row helpers (see vendor/lib/formPartialFieldFilled.ts).
 * Any one non-empty column in a row counts as “filled” — not all columns required.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickTrimmedString = pickTrimmedString;
exports.normalizeMeasureBenefitRow = normalizeMeasureBenefitRow;
exports.hasPartialMeasureBenefitRow = hasPartialMeasureBenefitRow;
exports.normalizeTestReportRow = normalizeTestReportRow;
exports.hasPartialTestReportRow = hasPartialTestReportRow;
exports.normalizeRawMaterialsProductRow = normalizeRawMaterialsProductRow;
exports.hasPartialRawMaterialsProductRow = hasPartialRawMaterialsProductRow;
exports.normalizeMeasureBenefitRows = normalizeMeasureBenefitRows;
exports.normalizeTestReportRows = normalizeTestReportRows;
function pickTrimmedString(row, keys) {
    if (!row || typeof row !== 'object') {
        return '';
    }
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var value = row[key];
        if (value === undefined || value === null) {
            continue;
        }
        var trimmed = String(value).trim();
        if (trimmed !== '') {
            return trimmed;
        }
    }
    return '';
}
/** Product Design — measures row: either column may be filled. */
function normalizeMeasureBenefitRow(row) {
    return {
        measuresImplemented: pickTrimmedString(row, [
            'measuresImplemented',
            'measures',
            'measure',
        ]),
        benefitsAchieved: pickTrimmedString(row, [
            'benefitsAchieved',
            'benefits',
            'benefit',
        ]),
    };
}
function hasPartialMeasureBenefitRow(row) {
    var n = normalizeMeasureBenefitRow(row);
    return Boolean(n.measuresImplemented || n.benefitsAchieved);
}
/** Product Performance — test report row: either column may be filled. */
function normalizeTestReportRow(row) {
    return {
        productName: pickTrimmedString(row, [
            'productName',
            'product_name',
            'productsName',
        ]),
        testReportFileName: pickTrimmedString(row, [
            'testReportFileName',
            'test_report_file_name',
            'testReportReference',
            'testReport',
            'productsTestReport',
        ]),
    };
}
function hasPartialTestReportRow(row) {
    var n = normalizeTestReportRow(row);
    return Boolean(n.productName || n.testReportFileName);
}
/** Raw Materials — hazardous / formaldehyde / solvents product row. */
function normalizeRawMaterialsProductRow(row) {
    return {
        productName: pickTrimmedString(row, [
            'productName',
            'productsName',
            'product_name',
        ]),
        testReportReference: pickTrimmedString(row, [
            'testReportReference',
            'productsTestReport',
            'productsTestReportFileName',
            'products_test_report',
            'products_test_report_file_name',
            'testReport',
            'testReportFileName',
            'test_report_file_name',
            'fileNameOfTheTestReport',
            'fileNameOfTestReport',
            'fileName',
            'file_name',
            'prohibitedFlameSolventsFileName',
            'prohibited_flame_solvents_file_name',
        ]),
    };
}
function hasPartialRawMaterialsProductRow(row) {
    var n = normalizeRawMaterialsProductRow(row);
    return Boolean(n.productName || n.testReportReference);
}
function normalizeMeasureBenefitRows(rows) {
    if (!Array.isArray(rows)) {
        return [];
    }
    return rows.map(function (row) { return normalizeMeasureBenefitRow(row); });
}
function normalizeTestReportRows(rows) {
    if (!Array.isArray(rows)) {
        return [];
    }
    return rows.map(function (row) { return normalizeTestReportRow(row); });
}
