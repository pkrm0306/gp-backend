"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var category_change_constants_1 = require("../constants/category-change.constants");
var category_change_util_1 = require("./category-change.util");
describe('category-change.util', function () {
    it('allows category edit before final review submission', function () {
        expect((0, category_change_util_1.isProductCategoryEditable)({ productStatus: 1, urnStatus: 5 })).toBe(true);
        expect((0, category_change_util_1.resolveCategoryChangeBlockReason)({ productStatus: 1, urnStatus: 5 })).toBeNull();
    });
    it('blocks category edit after final review submission (urnStatus >= 6)', function () {
        expect((0, category_change_util_1.isProductCategoryEditable)({ productStatus: 1, urnStatus: 6 })).toBe(false);
        expect((0, category_change_util_1.resolveCategoryChangeBlockReason)({ productStatus: 1, urnStatus: 6 })).toBe(category_change_constants_1.CATEGORY_CHANGE_LOCKED_MESSAGE);
    });
    it('allows category edit during admin review before final submit (urnStatus 4-5)', function () {
        expect((0, category_change_util_1.isProductCategoryEditable)({ productStatus: 1, urnStatus: 4 })).toBe(true);
        expect((0, category_change_util_1.isProductCategoryEditable)({ productStatus: 1, urnStatus: 5 })).toBe(true);
    });
    it('locks category for entire URN once admin final submit is recorded (urnStatus 6)', function () {
        expect((0, category_change_util_1.isProductCategoryEditableForUrn)({
            productStatus: 1,
            urnStatuses: [4, 6],
        })).toBe(false);
        expect((0, category_change_util_1.maxUrnStatusForCategoryLock)([4, 6])).toBe(6);
    });
    it('blocks category edit for certified products', function () {
        expect((0, category_change_util_1.isProductCategoryEditable)({ productStatus: 2, urnStatus: 11 })).toBe(false);
        expect((0, category_change_util_1.resolveCategoryChangeBlockReason)({ productStatus: 2, urnStatus: 11 })).toBe(category_change_constants_1.CATEGORY_CHANGE_CERTIFIED_MESSAGE);
    });
    it('blocks category edit during renewal workflow', function () {
        expect((0, category_change_util_1.isProductCategoryEditable)({ productStatus: 1, urnStatus: 12 })).toBe(false);
        expect((0, category_change_util_1.resolveCategoryChangeBlockReason)({ productStatus: 1, urnStatus: 12 })).toBe(category_change_constants_1.CATEGORY_CHANGE_RENEWAL_MESSAGE);
    });
    it('purges only raw material steps removed by the new category', function () {
        expect((0, category_change_util_1.stepsToPurgeOnCategoryChange)('1,2,3', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15')).toEqual([]);
        expect((0, category_change_util_1.stepsToPurgeOnCategoryChange)('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15', '1,2')).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });
    it('retains overlapping raw material steps when category expands', function () {
        expect((0, category_change_util_1.retainedRawMaterialStepsOnCategoryChange)('1,2,3', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15')).toEqual([1, 2, 3]);
        expect((0, category_change_util_1.addedRawMaterialStepsOnCategoryChange)('1,2,3', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15')).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });
    it('parses visible steps from category CSV', function () {
        expect((0, category_change_util_1.visibleStepsForCategory)('1,2,5')).toEqual([1, 2, 5]);
        expect((0, category_change_util_1.visibleStepsForCategory)('')).toHaveLength(15);
    });
    it('formats category payload with raw material visibility for vendor UI', function () {
        var formatted = (0, category_change_util_1.formatCategoryWithRawMaterialVisibility)({
            _id: 'cat1',
            category_name: 'Cement',
            category_raw_material_forms: '1,2',
            sector: 3,
        });
        expect(formatted).toMatchObject({
            categoryName: 'Cement',
            category_raw_material_forms: '1,2',
            visibleRawMaterialSteps: [1, 2],
            sector: 3,
        });
    });
});
