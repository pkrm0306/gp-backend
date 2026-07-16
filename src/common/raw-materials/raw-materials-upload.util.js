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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.rawMaterialsMultipartMemoryMulterOptions = exports.RAW_MATERIALS_REDUCE_ENVIRONMENTAL_ROW_KEYS = exports.RAW_MATERIALS_SAVE_METADATA_BODY_KEYS = exports.RAW_MATERIALS_ADDITIVES_NUMERIC_KEYS = exports.RAW_MATERIALS_MANUFACTURING_UNIT_NUMERIC_KEYS = exports.RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS = exports.RAW_MATERIALS_UNIT_NUMERIC_KEYS = exports.shouldReplaceHazardousProductsTableBeforeInsert = exports.parseMultipartNonNegativeInt = exports.RAW_MATERIALS_EOI_NO_MAX_LENGTH = exports.RAW_MATERIALS_URN_MAX_LENGTH = exports.RAW_MATERIALS_AT_LEAST_ONE_MESSAGE = void 0;
exports.parseMultipartBoolean = parseMultipartBoolean;
exports.shouldReplaceRawMaterialsTableBeforeInsert = shouldReplaceRawMaterialsTableBeforeInsert;
exports.parseRawMaterialsFormString = parseRawMaterialsFormString;
exports.parseRequiredRawMaterialsUrn = parseRequiredRawMaterialsUrn;
exports.isAllowedRawMaterialsDocument = isAllowedRawMaterialsDocument;
exports.assertRawMaterialsDocumentTypes = assertRawMaterialsDocumentTypes;
exports.parseMultipartJsonArray = parseMultipartJsonArray;
exports.coerceRawMaterialsNumeric = coerceRawMaterialsNumeric;
exports.parseRawMaterialsUnitNumericInput = parseRawMaterialsUnitNumericInput;
exports.computeRawMaterialsYeardata3 = computeRawMaterialsYeardata3;
exports.mapRawMaterialsStandardGridUnitForSave = mapRawMaterialsStandardGridUnitForSave;
exports.mapRawMaterialsManufacturingUnitForSave = mapRawMaterialsManufacturingUnitForSave;
exports.mapRawMaterialsAdditivesUnitForSave = mapRawMaterialsAdditivesUnitForSave;
exports.sumNullableRawMaterialsNumerics = sumNullableRawMaterialsNumerics;
exports.withRawMaterialsNumericFields = withRawMaterialsNumericFields;
exports.normalizeRawMaterialsStandardGridUnits = normalizeRawMaterialsStandardGridUnits;
exports.normalizeRawMaterialsManufacturingUnits = normalizeRawMaterialsManufacturingUnits;
exports.normalizeRawMaterialsAdditivesUnits = normalizeRawMaterialsAdditivesUnits;
exports.isMeaningfulFieldValue = isMeaningfulFieldValue;
exports.assertUnitYearFieldsPositive = assertUnitYearFieldsPositive;
exports.hasAnyMeaningfulRow = hasAnyMeaningfulRow;
exports.filterMeaningfulRows = filterMeaningfulRows;
exports.hasAnyTrimmedText = hasAnyTrimmedText;
exports.resolveRawMaterialsProductsPayload = resolveRawMaterialsProductsPayload;
exports.hasAnyMeaningfulRawMaterialsSavePayload = hasAnyMeaningfulRawMaterialsSavePayload;
exports.assertAtLeastOneRawMaterialsField = assertAtLeastOneRawMaterialsField;
exports.countVendorUrnDocuments = countVendorUrnDocuments;
exports.pickUploadFile = pickUploadFile;
exports.normalizeReduceEnvironmentalUnitRow = normalizeReduceEnvironmentalUnitRow;
exports.hasPartialReduceEnvironmentalRow = hasPartialReduceEnvironmentalRow;
exports.legacyReduceEnvironmentalRowFromDto = legacyReduceEnvironmentalRowFromDto;
exports.hasExplicitReduceEnvironmentalArray = hasExplicitReduceEnvironmentalArray;
exports.resolveReduceEnvironmentalUnits = resolveReduceEnvironmentalUnits;
exports.hasAnyMeaningfulReduceEnvironmentalSavePayload = hasAnyMeaningfulReduceEnvironmentalSavePayload;
exports.applyRawMaterialsUtilizationRmcAliases = applyRawMaterialsUtilizationRmcAliases;
exports.normalizeRawMaterialsUtilizationRmcRow = normalizeRawMaterialsUtilizationRmcRow;
exports.normalizeRawMaterialsUtilizationRmcRows = normalizeRawMaterialsUtilizationRmcRows;
exports.collectAllUploadFiles = collectAllUploadFiles;
exports.hasAnyMeaningfulBodyField = hasAnyMeaningfulBodyField;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var form_partial_field_util_1 = require("../form-partial-field.util");
var product_design_upload_util_1 = require("../../product-design/product-design-upload.util");
exports.RAW_MATERIALS_AT_LEAST_ONE_MESSAGE = 'Please fill in at least one field in the form before continuing.';
/** Align with product-design / payments; vendor URNs exceed legacy 20-char DTO limits. */
exports.RAW_MATERIALS_URN_MAX_LENGTH = 64;
exports.RAW_MATERIALS_EOI_NO_MAX_LENGTH = 32;
/** Read a single string from multipart/form-data or JSON body fields. */
function parseMultipartBoolean(value) {
    if (value === undefined || value === null || value === '') {
        return false;
    }
    var normalized = String(value).trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
}
/** Re-export for rowIndex / totalRows on per-row hazardous product POSTs. */
var product_design_upload_util_2 = require("../../product-design/product-design-upload.util");
Object.defineProperty(exports, "parseMultipartNonNegativeInt", { enumerable: true, get: function () { return product_design_upload_util_2.parseMultipartNonNegativeInt; } });
/**
 * Delete all product table rows for this URN before insert when:
 * - replaceTable=true, or rowIndex=0, or legacy single POST (no handshake fields).
 */
/** Product-table steps: hazardous products, formaldehyde, solvents products, etc. */
function shouldReplaceRawMaterialsTableBeforeInsert(body) {
    if (parseMultipartBoolean(body.replaceTable)) {
        return true;
    }
    var rowIndexRaw = body.rowIndex;
    if (rowIndexRaw !== undefined && rowIndexRaw !== null && rowIndexRaw !== '') {
        var rowIndex = Number(String(rowIndexRaw).trim());
        return Number.isFinite(rowIndex) && rowIndex === 0;
    }
    var hasHandshake = body.replaceTable !== undefined ||
        body.rowIndex !== undefined ||
        body.totalRows !== undefined;
    return !hasHandshake;
}
/** @deprecated Use shouldReplaceRawMaterialsTableBeforeInsert */
exports.shouldReplaceHazardousProductsTableBeforeInsert = shouldReplaceRawMaterialsTableBeforeInsert;
function parseRawMaterialsFormString(value) {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (typeof value === 'string') {
        return value;
    }
    if (Array.isArray(value) && value.length > 0) {
        return String(value[0]);
    }
    return String(value);
}
function parseRequiredRawMaterialsUrn(body) {
    var _a, _b;
    var urnNo = (_b = (_a = parseRawMaterialsFormString(body.urnNo)) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
    if (!urnNo) {
        throw new common_1.BadRequestException('URN number is required');
    }
    if (urnNo.length > exports.RAW_MATERIALS_URN_MAX_LENGTH) {
        throw new common_1.BadRequestException("urnNo must be shorter than or equal to ".concat(exports.RAW_MATERIALS_URN_MAX_LENGTH, " characters"));
    }
    return urnNo;
}
function isAllowedRawMaterialsDocument(file) {
    return (0, product_design_upload_util_1.isAllowedSupportingDesignFile)(file);
}
function assertRawMaterialsDocumentTypes(files) {
    (0, product_design_upload_util_1.assertSupportingDesignFileTypes)(files);
}
function parseMultipartJsonArray(value, fieldLabel) {
    if (fieldLabel === void 0) { fieldLabel = 'units'; }
    if (value === undefined || value === null || value === '') {
        return [];
    }
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string') {
        var trimmed = value.trim();
        if (trimmed === '') {
            return [];
        }
        try {
            var parsed = JSON.parse(trimmed);
            if (!Array.isArray(parsed)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldLabel, " format. Expected JSON array."));
            }
            return parsed;
        }
        catch (e) {
            if (e instanceof common_1.BadRequestException) {
                throw e;
            }
            throw new common_1.BadRequestException("Invalid ".concat(fieldLabel, " format. Expected JSON array."));
        }
    }
    throw new common_1.BadRequestException("Invalid ".concat(fieldLabel, " format. Expected JSON array."));
}
/** Unit grid numeric fields used for row validation and response normalization. */
exports.RAW_MATERIALS_UNIT_NUMERIC_KEYS = new Set([
    'year',
    'yeardata1',
    'yeardata2',
    'yeardata3',
    'unit1',
    'unit2',
    'year1',
    'year1a',
    'year1b',
    'year1c',
    'year2',
    'year2a',
    'year2b',
    'year2c',
    'year3',
    'year3a',
    'year3b',
    'year3c',
]);
exports.RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS = [
    'year',
    'unit1',
    'unit2',
    'yeardata1',
    'yeardata2',
    'yeardata3',
];
exports.RAW_MATERIALS_MANUFACTURING_UNIT_NUMERIC_KEYS = [
    'year',
    'yeardata1',
    'yeardata2',
    'yeardata3',
];
exports.RAW_MATERIALS_ADDITIVES_NUMERIC_KEYS = [
    'year',
    'year1',
    'year1a',
    'year1b',
    'year1c',
    'year2',
    'year2a',
    'year2b',
    'year2c',
    'year3',
    'year3a',
    'year3b',
    'year3c',
];
/** Coerce vendor numeric input when a fallback is required (e.g. computed totals). */
function coerceRawMaterialsNumeric(value, fallback) {
    if (fallback === void 0) { fallback = 0; }
    if (value === undefined || value === null || value === '') {
        return fallback;
    }
    var n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}
/**
 * Parse a unit-grid numeric field from vendor input.
 * Empty / omitted → null (unset). Explicit 0 is stored as 0.
 */
function parseRawMaterialsUnitNumericInput(value) {
    if (value === undefined || value === null || value === '') {
        return null;
    }
    var n = Number(value);
    return Number.isFinite(n) ? n : null;
}
function computeRawMaterialsYeardata3(yeardata1, yeardata2) {
    if (yeardata1 === null || yeardata2 === null) {
        return null;
    }
    if (yeardata1 > 0) {
        return Math.round((yeardata2 / yeardata1) * 10000) / 100;
    }
    return 0;
}
function mapRawMaterialsStandardGridUnitForSave(unit) {
    var _a;
    var yeardata1 = parseRawMaterialsUnitNumericInput(unit.yeardata1);
    var yeardata2 = parseRawMaterialsUnitNumericInput(unit.yeardata2);
    return {
        unitName: String((_a = unit.unitName) !== null && _a !== void 0 ? _a : '').trim(),
        year: parseRawMaterialsUnitNumericInput(unit.year),
        unit1: parseRawMaterialsUnitNumericInput(unit.unit1),
        unit2: parseRawMaterialsUnitNumericInput(unit.unit2),
        yeardata1: yeardata1,
        yeardata2: yeardata2,
        yeardata3: computeRawMaterialsYeardata3(yeardata1, yeardata2),
    };
}
function mapRawMaterialsManufacturingUnitForSave(unit) {
    var _a;
    return {
        unitName: String((_a = unit.unitName) !== null && _a !== void 0 ? _a : '').trim(),
        year: parseRawMaterialsUnitNumericInput(unit.year),
        yeardata1: parseRawMaterialsUnitNumericInput(unit.yeardata1),
        yeardata2: parseRawMaterialsUnitNumericInput(unit.yeardata2),
        yeardata3: parseRawMaterialsUnitNumericInput(unit.yeardata3),
    };
}
function mapRawMaterialsAdditivesUnitForSave(unit) {
    var _a, _b, _c, _d;
    return {
        unitName: String((_a = unit.unitName) !== null && _a !== void 0 ? _a : '').trim(),
        year: parseRawMaterialsUnitNumericInput(unit.year),
        year1: parseRawMaterialsUnitNumericInput(unit.year1),
        year1a: parseRawMaterialsUnitNumericInput(unit.year1a),
        year1b: parseRawMaterialsUnitNumericInput(unit.year1b),
        year1c: parseRawMaterialsUnitNumericInput(unit.year1c),
        year2: parseRawMaterialsUnitNumericInput(unit.year2),
        year2a: parseRawMaterialsUnitNumericInput(unit.year2a),
        year2b: parseRawMaterialsUnitNumericInput(unit.year2b),
        year2c: parseRawMaterialsUnitNumericInput(unit.year2c),
        year3: parseRawMaterialsUnitNumericInput(unit.year3),
        year3a: parseRawMaterialsUnitNumericInput(unit.year3a),
        year3b: parseRawMaterialsUnitNumericInput(unit.year3b),
        year3c: parseRawMaterialsUnitNumericInput(unit.year3c),
        psc: String((_b = unit.psc) !== null && _b !== void 0 ? _b : '').trim(),
        coc: String((_c = unit.coc) !== null && _c !== void 0 ? _c : '').trim(),
        percentcoc: String((_d = unit.percentcoc) !== null && _d !== void 0 ? _d : '').trim(),
    };
}
/** Sum nullable operands; returns null when every operand is unset. */
function sumNullableRawMaterialsNumerics() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    if (values.every(function (value) { return value === undefined || value === null; })) {
        return null;
    }
    return values.reduce(function (sum, value) { return sum + (value === null || value === undefined ? 0 : value); }, 0);
}
/** Serialize unit numerics: explicit 0 stays 0; unset/null fields return null. */
function withRawMaterialsNumericFields(row, numericKeys) {
    var out = __assign({}, row);
    for (var _i = 0, numericKeys_1 = numericKeys; _i < numericKeys_1.length; _i++) {
        var key = numericKeys_1[_i];
        var value = out[key];
        if (value === undefined || value === null) {
            out[key] = null;
            continue;
        }
        var n = Number(value);
        if (Number.isFinite(n)) {
            out[key] = n;
        }
        else {
            out[key] = null;
        }
    }
    return out;
}
function normalizeRawMaterialsStandardGridUnits(rows) {
    if (!Array.isArray(rows)) {
        return [];
    }
    return rows.map(function (row) {
        return withRawMaterialsNumericFields(row, exports.RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS);
    });
}
function normalizeRawMaterialsManufacturingUnits(rows) {
    if (!Array.isArray(rows)) {
        return [];
    }
    return rows.map(function (row) {
        return withRawMaterialsNumericFields(row, exports.RAW_MATERIALS_MANUFACTURING_UNIT_NUMERIC_KEYS);
    });
}
function normalizeRawMaterialsAdditivesUnits(rows) {
    if (!Array.isArray(rows)) {
        return [];
    }
    return rows.map(function (row) {
        return withRawMaterialsNumericFields(row, exports.RAW_MATERIALS_ADDITIVES_NUMERIC_KEYS);
    });
}
function isMeaningfulFieldValue(value, fieldKey) {
    if (value === undefined || value === null) {
        return false;
    }
    if (typeof value === 'string') {
        var trimmed = value.trim();
        if (trimmed === '') {
            return false;
        }
        if (fieldKey && exports.RAW_MATERIALS_UNIT_NUMERIC_KEYS.has(fieldKey)) {
            return Number.isFinite(Number(trimmed));
        }
        return true;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value);
    }
    if (typeof value === 'boolean') {
        return true;
    }
    return false;
}
/**
 * Deferred: manufacturer / unit year and yeardata must be > 0 when provided.
 * Left commented so partial saves stay allowed until product re-enables the rule.
 */
function assertUnitYearFieldsPositive(units) {
    // for (const unit of units) {
    //   for (const key of ['year', 'yeardata1', 'yeardata2', 'yeardata3']) {
    //     if (
    //       unit[key] !== undefined &&
    //       unit[key] !== null &&
    //       unit[key] !== ''
    //     ) {
    //       const n = Number(unit[key]);
    //       if (Number.isFinite(n) && n <= 0) {
    //         throw new BadRequestException(
    //           `${key} must be greater than 0 for each unit`,
    //         );
    //       }
    //     }
    //   }
    // }
}
function hasAnyMeaningfulRow(rows, keys) {
    if (!Array.isArray(rows) || rows.length === 0) {
        return false;
    }
    return rows.some(function (row) {
        if (!row || typeof row !== 'object') {
            return false;
        }
        var fields = keys !== null && keys !== void 0 ? keys : Object.keys(row);
        return fields.some(function (key) { return isMeaningfulFieldValue(row[key], key); });
    });
}
function filterMeaningfulRows(rows, keys) {
    if (!Array.isArray(rows)) {
        return [];
    }
    return rows.filter(function (row) {
        return keys.some(function (key) { return isMeaningfulFieldValue(row[key], key); });
    });
}
function hasAnyTrimmedText() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return values.some(function (v) { return String(v !== null && v !== void 0 ? v : '').trim() !== ''; });
}
function hasAnyPartialRawMaterialsProductRow(rows) {
    if (!Array.isArray(rows)) {
        return false;
    }
    return rows.some(function (row) {
        return (0, form_partial_field_util_1.hasPartialRawMaterialsProductRow)((0, form_partial_field_util_1.normalizeRawMaterialsProductRow)(row && typeof row === 'object' ? row : undefined));
    });
}
exports.RAW_MATERIALS_SAVE_METADATA_BODY_KEYS = new Set([
    'urnNo',
    'urn_no',
    'vendorId',
    'vendor_id',
    'eoiNo',
    'eoi_no',
    'replaceTable',
    'rowIndex',
    'totalRows',
    'existingDocumentIds',
    'existing_document_ids',
    'prohibitedFlameSolventsFileName',
    'formaldehydeFileName',
    'recycledContentFileName',
    'regionalMaterialsFileName',
    'utilizationRmcFileName',
]);
/** Resolve vendor product-table rows from multipart/JSON body (many alias shapes). */
function resolveRawMaterialsProductsPayload(body) {
    var candidates = [
        body.products,
        body.productRows,
        body.product_rows,
        body.rows,
    ];
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        if (Array.isArray(candidate)) {
            var rows = candidate.filter(function (row) { return row && typeof row === 'object'; });
            if (rows.length > 0) {
                return rows;
            }
            continue;
        }
        if (typeof candidate === 'string' && candidate.trim() !== '') {
            var parsed = parseMultipartJsonArray(candidate, 'products');
            if (parsed.length > 0) {
                return parsed;
            }
        }
    }
    if (body.product &&
        typeof body.product === 'object' &&
        !Array.isArray(body.product)) {
        return [body.product];
    }
    if ((0, form_partial_field_util_1.hasPartialRawMaterialsProductRow)((0, form_partial_field_util_1.normalizeRawMaterialsProductRow)(body))) {
        return [body];
    }
    return [];
}
function hasAnyMeaningfulRawMaterialsSavePayload(body) {
    if (hasAnyMeaningfulReduceEnvironmentalSavePayload(body)) {
        return true;
    }
    if (hasAnyPartialRawMaterialsProductRow(resolveRawMaterialsProductsPayload(body))) {
        return true;
    }
    if ((0, form_partial_field_util_1.hasPartialRawMaterialsProductRow)((0, form_partial_field_util_1.normalizeRawMaterialsProductRow)(body))) {
        return true;
    }
    return hasAnyMeaningfulBodyField(body, new Set(__spreadArray(__spreadArray([], exports.RAW_MATERIALS_SAVE_METADATA_BODY_KEYS, true), [
        'products',
        'productRows',
        'product_rows',
        'rows',
        'product',
        'units',
        'mines',
    ], false)));
}
function assertAtLeastOneRawMaterialsField(params) {
    var _a, _b, _c, _d, _e;
    if (((_a = params.retainedDocumentCount) !== null && _a !== void 0 ? _a : 0) > 0) {
        return;
    }
    if (((_b = params.persistedRecordCount) !== null && _b !== void 0 ? _b : 0) > 0) {
        return;
    }
    var files = (_c = params.files) !== null && _c !== void 0 ? _c : [];
    if (files.length > 0) {
        return;
    }
    if (hasAnyTrimmedText.apply(void 0, ((_d = params.textValues) !== null && _d !== void 0 ? _d : []))) {
        return;
    }
    if (hasAnyMeaningfulRow(params.rows, params.rowKeys)) {
        return;
    }
    if (hasAnyPartialRawMaterialsProductRow(params.rows)) {
        return;
    }
    if (Array.isArray(params.rows) &&
        params.rows.some(function (row) { return hasPartialReduceEnvironmentalRow(row); })) {
        return;
    }
    var body = params.body;
    if (body &&
        (0, form_partial_field_util_1.hasPartialRawMaterialsProductRow)((0, form_partial_field_util_1.normalizeRawMaterialsProductRow)(body))) {
        return;
    }
    if (body && hasAnyMeaningfulRawMaterialsSavePayload(body)) {
        return;
    }
    var bodyKeys = (_e = params.bodyKeys) !== null && _e !== void 0 ? _e : [];
    if (body &&
        bodyKeys.some(function (key) { return isMeaningfulFieldValue(body[key], key); })) {
        return;
    }
    throw new common_1.BadRequestException(exports.RAW_MATERIALS_AT_LEAST_ONE_MESSAGE);
}
/** Count persisted rows for a vendor URN (tables, product rows, text records). */
function countVendorUrnDocuments(model, urnNo, vendorId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!mongoose_1.Types.ObjectId.isValid(vendorId)) {
                return [2 /*return*/, 0];
            }
            return [2 /*return*/, model
                    .countDocuments({
                    urnNo: urnNo.trim(),
                    vendorId: new mongoose_1.Types.ObjectId(vendorId),
                })
                    .exec()];
        });
    });
}
function pickUploadFile(uploadedFiles, preferredFieldNames) {
    var _a;
    if (!(uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles.length)) {
        return undefined;
    }
    return ((_a = uploadedFiles.find(function (f) { return preferredFieldNames.includes(f.fieldname); })) !== null && _a !== void 0 ? _a : uploadedFiles[0]);
}
exports.RAW_MATERIALS_REDUCE_ENVIRONMENTAL_ROW_KEYS = [
    'location',
    'enhancementOfMinesLife',
    'topsoilConservation',
    'waterTableManagement',
    'restorationOfSpentMines',
    'greenBeltDevelopmentAndBioDiversity',
];
/** Normalize reduce-environmental row keys (vendor may send `locations` plural). */
function normalizeReduceEnvironmentalUnitRow(row) {
    return {
        location: (0, form_partial_field_util_1.pickTrimmedString)(row, [
            'location',
            'locations',
            'mineLocation',
            'mine_location',
        ]),
        enhancementOfMinesLife: (0, form_partial_field_util_1.pickTrimmedString)(row, [
            'enhancementOfMinesLife',
            'enhancement_of_mines_life',
            'enhancementOfMineLife',
            'minesLifeEnhancement',
        ]),
        topsoilConservation: (0, form_partial_field_util_1.pickTrimmedString)(row, [
            'topsoilConservation',
            'topsoil_conservation',
        ]),
        waterTableManagement: (0, form_partial_field_util_1.pickTrimmedString)(row, [
            'waterTableManagement',
            'water_table_management',
        ]),
        restorationOfSpentMines: (0, form_partial_field_util_1.pickTrimmedString)(row, [
            'restorationOfSpentMines',
            'restoration_of_spent_mines',
            'restorationOfSpentMine',
        ]),
        greenBeltDevelopmentAndBioDiversity: (0, form_partial_field_util_1.pickTrimmedString)(row, [
            'greenBeltDevelopmentAndBioDiversity',
            'green_belt_development_and_bio_diversity',
            'greenBeltDevelopmentAndBiodiversity',
            'green_belt_development_and_biodiversity',
            'greenBeltDevelopment',
            'bioDiversity',
        ]),
    };
}
function hasPartialReduceEnvironmentalRow(row) {
    var normalized = normalizeReduceEnvironmentalUnitRow(row && typeof row === 'object' ? row : {});
    return exports.RAW_MATERIALS_REDUCE_ENVIRONMENTAL_ROW_KEYS.some(function (key) { return normalized[key].trim() !== ''; });
}
function legacyReduceEnvironmentalRowFromDto(dto) {
    return normalizeReduceEnvironmentalUnitRow(dto);
}
/** True when client sent `units` or `mines` (including `[]` to clear all rows). */
function hasExplicitReduceEnvironmentalArray(body) {
    var unitsSent = body.units !== undefined && body.units !== null && body.units !== '';
    var minesSent = body.mines !== undefined && body.mines !== null && body.mines !== '';
    return unitsSent || minesSent;
}
function resolveReduceEnvironmentalUnits(dto, rowKeys) {
    if (hasExplicitReduceEnvironmentalArray(dto)) {
        var unitsRaw = parseMultipartJsonArray(dto.units, 'units');
        var minesRaw = parseMultipartJsonArray(dto.mines, 'mines');
        var arraySource = dto.units !== undefined && dto.units !== null && dto.units !== ''
            ? unitsRaw
            : minesRaw;
        var fromArray = arraySource.map(function (row) {
            return normalizeReduceEnvironmentalUnitRow(row && typeof row === 'object' ? row : {});
        });
        var meaningfulFromArray = filterMeaningfulRows(fromArray, rowKeys);
        if (meaningfulFromArray.length > 0) {
            return meaningfulFromArray;
        }
    }
    var legacy = legacyReduceEnvironmentalRowFromDto(dto);
    return filterMeaningfulRows([legacy], rowKeys);
}
function hasAnyMeaningfulReduceEnvironmentalSavePayload(body, rowKeys) {
    if (rowKeys === void 0) { rowKeys = exports.RAW_MATERIALS_REDUCE_ENVIRONMENTAL_ROW_KEYS; }
    if (hasAnyTrimmedText(parseRawMaterialsFormString(body.reduceEnvironmentalFileName), parseRawMaterialsFormString(body.reduce_environmental_file_name))) {
        return true;
    }
    return resolveReduceEnvironmentalUnits(body, __spreadArray([], rowKeys, true)).length > 0;
}
function applyRawMaterialsUtilizationRmcAliases(row) {
    var out = __assign({}, row);
    for (var _i = 0, _a = ['Iron', 'Steel', 'Copper', 'Recycled', 'Aggregate']; _i < _a.length; _i++) {
        var mat = _a[_i];
        for (var _b = 0, _c = [1, 2, 3, 4]; _b < _c.length; _b++) {
            var yr = _c[_b];
            var canonical = "percentYear".concat(yr, "Subsititution").concat(mat);
            var legacy = "percentYear".concat(yr, "Subsitution").concat(mat);
            if (out[legacy] === undefined && out[canonical] !== undefined) {
                out[legacy] = out[canonical];
            }
        }
    }
    for (var _d = 0, _e = [1, 2, 3, 4]; _d < _e.length; _d++) {
        var yr = _e[_d];
        var canonical = "plantYear".concat(yr, "PercentSubstitution");
        var legacy = "plantYear".concat(yr, "PercentSubsitution");
        if (out[legacy] === undefined && out[canonical] !== undefined) {
            out[legacy] = out[canonical];
        }
    }
    return out;
}
var RAW_MATERIALS_UTILIZATION_RMC_META_KEYS = new Set([
    '_id',
    'rawMaterialsUtilizationRmcId',
    'urnNo',
    'vendorId',
    'createdDate',
    'updatedDate',
]);
function normalizeRawMaterialsUtilizationRmcRow(row) {
    var aliased = applyRawMaterialsUtilizationRmcAliases(row);
    var numericKeys = Object.keys(aliased).filter(function (key) { return !RAW_MATERIALS_UTILIZATION_RMC_META_KEYS.has(key); });
    return withRawMaterialsNumericFields(aliased, numericKeys);
}
function normalizeRawMaterialsUtilizationRmcRows(rows) {
    if (!Array.isArray(rows)) {
        return [];
    }
    return rows.map(function (row) { return normalizeRawMaterialsUtilizationRmcRow(row); });
}
var multer_universal_config_1 = require("../upload/multer-universal.config");
Object.defineProperty(exports, "rawMaterialsMultipartMemoryMulterOptions", { enumerable: true, get: function () { return multer_universal_config_1.rawMaterialsMultipartMemoryMulterOptions; } });
function collectAllUploadFiles(uploadedFiles) {
    if (!(uploadedFiles === null || uploadedFiles === void 0 ? void 0 : uploadedFiles.length)) {
        return [];
    }
    return uploadedFiles.filter(function (f) {
        var _a, _b, _c;
        return (f === null || f === void 0 ? void 0 : f.originalname) ||
            ((_a = f === null || f === void 0 ? void 0 : f.size) !== null && _a !== void 0 ? _a : 0) > 0 ||
            ((_c = (_b = f === null || f === void 0 ? void 0 : f.buffer) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0;
    });
}
/** True when any non-metadata body field has a meaningful value (Step 15 grid). */
function hasAnyMeaningfulBodyField(body, excludeKeys) {
    if (excludeKeys === void 0) { excludeKeys = new Set([
        'urnNo',
        'vendorId',
        'utilizationRmcFileName',
        'existingDocumentIds',
    ]); }
    for (var _i = 0, _a = Object.entries(body); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (excludeKeys.has(key)) {
            continue;
        }
        if (isMeaningfulFieldValue(value, key)) {
            return true;
        }
    }
    return false;
}
