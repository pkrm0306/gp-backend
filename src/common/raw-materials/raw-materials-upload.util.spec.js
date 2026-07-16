"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var raw_materials_upload_util_1 = require("./raw-materials-upload.util");
describe('raw materials numeric zero handling', function () {
    it('treats numeric zero as meaningful for unit grid fields', function () {
        expect((0, raw_materials_upload_util_1.isMeaningfulFieldValue)(0, 'yeardata1')).toBe(true);
        expect((0, raw_materials_upload_util_1.isMeaningfulFieldValue)('0', 'year')).toBe(true);
        expect((0, raw_materials_upload_util_1.isMeaningfulFieldValue)(0)).toBe(true);
    });
    it('keeps rows that only contain explicit numeric zeros', function () {
        var rows = (0, raw_materials_upload_util_1.filterMeaningfulRows)([{ yeardata1: 0, yeardata2: '0' }], ['unitName', 'year', 'yeardata1', 'yeardata2']);
        expect(rows).toHaveLength(1);
    });
    it('parses omitted fields as null and explicit zero as 0', function () {
        expect((0, raw_materials_upload_util_1.parseRawMaterialsUnitNumericInput)(undefined)).toBeNull();
        expect((0, raw_materials_upload_util_1.parseRawMaterialsUnitNumericInput)('')).toBeNull();
        expect((0, raw_materials_upload_util_1.parseRawMaterialsUnitNumericInput)(0)).toBe(0);
        expect((0, raw_materials_upload_util_1.parseRawMaterialsUnitNumericInput)('0')).toBe(0);
    });
    it('maps only provided unit fields on save', function () {
        var mapped = (0, raw_materials_upload_util_1.mapRawMaterialsStandardGridUnitForSave)({
            unitName: 'Unit A',
            yeardata1: 0,
        });
        expect(mapped.yeardata1).toBe(0);
        expect(mapped.year).toBeNull();
        expect(mapped.unit1).toBeNull();
        expect(mapped.yeardata2).toBeNull();
        expect(mapped.yeardata3).toBeNull();
    });
    it('omits unset numeric fields from responses but keeps explicit zero', function () {
        var formatted = (0, raw_materials_upload_util_1.withRawMaterialsNumericFields)({ unitName: 'Unit A', yeardata1: 0 }, raw_materials_upload_util_1.RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS);
        expect(formatted.yeardata1).toBe(0);
        expect(formatted.yeardata2).toBeNull();
        expect(formatted.year).toBeNull();
    });
    it('preserves explicit zero through numeric coercion', function () {
        expect((0, raw_materials_upload_util_1.coerceRawMaterialsNumeric)(0)).toBe(0);
        expect((0, raw_materials_upload_util_1.coerceRawMaterialsNumeric)('0')).toBe(0);
    });
    it('computes yeardata3 only when both operands are provided', function () {
        expect((0, raw_materials_upload_util_1.computeRawMaterialsYeardata3)(null, 5)).toBeNull();
        expect((0, raw_materials_upload_util_1.computeRawMaterialsYeardata3)(10, null)).toBeNull();
        expect((0, raw_materials_upload_util_1.computeRawMaterialsYeardata3)(10, 5)).toBe(50);
        expect((0, raw_materials_upload_util_1.computeRawMaterialsYeardata3)(0, 5)).toBe(0);
    });
    it('allows save when any one product-table column is filled', function () {
        expect(function () {
            return (0, raw_materials_upload_util_1.assertAtLeastOneRawMaterialsField)({
                rows: [{ productsTestReportFileName: 'report-a.pdf' }],
            });
        }).not.toThrow();
        expect(function () {
            return (0, raw_materials_upload_util_1.assertAtLeastOneRawMaterialsField)({
                body: { productsName: 'Widget' },
            });
        }).not.toThrow();
        expect(function () {
            return (0, raw_materials_upload_util_1.assertAtLeastOneRawMaterialsField)({
                files: [{ originalname: 'doc.pdf' }],
            });
        }).not.toThrow();
        expect(function () { return (0, raw_materials_upload_util_1.assertAtLeastOneRawMaterialsField)({}); }).toThrow(raw_materials_upload_util_1.RAW_MATERIALS_AT_LEAST_ONE_MESSAGE);
    });
    it('resolves legacy top-level product fields when products array is empty', function () {
        var rows = (0, raw_materials_upload_util_1.resolveRawMaterialsProductsPayload)({
            urnNo: 'URN-1',
            products: '[]',
            productsTestReport: 'report-a.pdf',
        });
        expect(rows).toHaveLength(1);
        expect((0, raw_materials_upload_util_1.hasAnyMeaningfulRawMaterialsSavePayload)({
            urnNo: 'URN-1',
            products: '[]',
            productsTestReport: 'report-a.pdf',
        })).toBe(true);
    });
    it('treats prohibitedFlameSolventsFileName as a partial product row field', function () {
        expect((0, raw_materials_upload_util_1.hasAnyMeaningfulRawMaterialsSavePayload)({
            urnNo: 'URN-1',
            products: '[]',
            prohibitedFlameSolventsFileName: 'report-a.pdf',
        })).toBe(true);
    });
});
