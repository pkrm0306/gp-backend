"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var raw_materials_hazardous_display_util_1 = require("./raw-materials-hazardous-display.util");
describe('raw-materials-hazardous-display.util', function () {
    it('includes row with only productsTestReport', function () {
        expect((0, raw_materials_hazardous_display_util_1.isHazardousProductRowForVendorDisplay)({
            productsName: '',
            productsTestReport: 'report-a.pdf',
        })).toBe(true);
    });
    it('includes row with only productsName', function () {
        expect((0, raw_materials_hazardous_display_util_1.isHazardousProductRowForVendorDisplay)({
            productsName: 'Widget',
            productsTestReport: '',
        })).toBe(true);
    });
    it('includes row with only productsTestReportFileName alias', function () {
        expect((0, raw_materials_hazardous_display_util_1.isHazardousProductRowForVendorDisplay)({
            productsTestReportFileName: 'report-a.pdf',
        })).toBe(true);
    });
    it('excludes fully empty row', function () {
        expect((0, raw_materials_hazardous_display_util_1.isHazardousProductRowForVendorDisplay)({
            productsName: '',
            productsTestReport: '',
        })).toBe(false);
    });
    it('filters empty rows from list', function () {
        var filtered = (0, raw_materials_hazardous_display_util_1.filterHazardousProductsForVendorDisplay)([
            { productsName: 'A', productsTestReport: '' },
            { productsName: '', productsTestReport: '' },
        ]);
        expect(filtered).toHaveLength(1);
    });
});
