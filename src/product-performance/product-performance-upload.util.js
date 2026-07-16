"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTestReportRows = exports.normalizeTestReportRow = exports.parseMultipartJsonIdArray = exports.PERFORMANCE_TEST_REPORT_SUBSECTION = exports.PRODUCT_PERFORMANCE_UPLOAD_FIELD_NAMES = exports.PRODUCT_PERFORMANCE_EMPTY_FORM_MESSAGE = void 0;
exports.collectProductPerformanceUploadFiles = collectProductPerformanceUploadFiles;
exports.labelFromUploadFile = labelFromUploadFile;
exports.hasAtLeastOneProductPerformanceFieldFilled = hasAtLeastOneProductPerformanceFieldFilled;
exports.hasAtLeastOneProductPerformanceContent = hasAtLeastOneProductPerformanceContent;
exports.assertProductPerformanceTestReportFileTypes = assertProductPerformanceTestReportFileTypes;
var product_design_upload_util_1 = require("../product-design/product-design-upload.util");
var form_partial_field_util_1 = require("../common/form-partial-field.util");
/** Vendor empty-form copy (shared with product design / formAtLeastOneFieldMessage). */
exports.PRODUCT_PERFORMANCE_EMPTY_FORM_MESSAGE = 'Please fill in at least one field in the form before continuing.';
/** Multipart field names accepted for test report file uploads. */
exports.PRODUCT_PERFORMANCE_UPLOAD_FIELD_NAMES = new Set([
    'files',
    'testReportFile',
    'testReportFiles',
    'file',
]);
exports.PERFORMANCE_TEST_REPORT_SUBSECTION = 'test_report_files';
var product_design_upload_util_2 = require("../product-design/product-design-upload.util");
Object.defineProperty(exports, "parseMultipartJsonIdArray", { enumerable: true, get: function () { return product_design_upload_util_2.parseMultipartJsonIdArray; } });
function collectProductPerformanceUploadFiles(files) {
    if (!Array.isArray(files) || files.length === 0) {
        return [];
    }
    return files.filter(function (f) {
        var _a, _b;
        if (!(f === null || f === void 0 ? void 0 : f.originalname) && !((f === null || f === void 0 ? void 0 : f.size) > 0) && !((_a = f === null || f === void 0 ? void 0 : f.buffer) === null || _a === void 0 ? void 0 : _a.length)) {
            return false;
        }
        var field = String((_b = f.fieldname) !== null && _b !== void 0 ? _b : 'files');
        return exports.PRODUCT_PERFORMANCE_UPLOAD_FIELD_NAMES.has(field);
    });
}
function labelFromUploadFile(file, index) {
    var _a;
    var stem = String((_a = file.originalname) !== null && _a !== void 0 ? _a : '')
        .replace(/\.[^/.]+$/, '')
        .trim();
    return stem || "Test report ".concat(index + 1);
}
/** True when at least one new file or one test report row has productName or testReportFileName. */
function hasAtLeastOneProductPerformanceFieldFilled(params) {
    var _a;
    if (params.uploadedFiles.length > 0) {
        return true;
    }
    var rows = (_a = params.testReports) !== null && _a !== void 0 ? _a : [];
    return rows.some(function (row) {
        return (0, form_partial_field_util_1.hasPartialTestReportRow)(row);
    });
}
var form_partial_field_util_2 = require("../common/form-partial-field.util");
Object.defineProperty(exports, "normalizeTestReportRow", { enumerable: true, get: function () { return form_partial_field_util_2.normalizeTestReportRow; } });
Object.defineProperty(exports, "normalizeTestReportRows", { enumerable: true, get: function () { return form_partial_field_util_2.normalizeTestReportRows; } });
/** Vendor “≥ 1 field” rule including retained performance documents on the URN. */
function hasAtLeastOneProductPerformanceContent(params) {
    var _a;
    if (hasAtLeastOneProductPerformanceFieldFilled({
        testReports: params.testReports,
        uploadedFiles: params.uploadedFiles,
    })) {
        return true;
    }
    return ((_a = params.retainedDocumentCount) !== null && _a !== void 0 ? _a : 0) > 0;
}
/** Test report uploads: PDF and Excel only (matches vendor UI). */
function assertProductPerformanceTestReportFileTypes(files) {
    (0, product_design_upload_util_1.assertSupportingDesignFileTypes)(files);
}
