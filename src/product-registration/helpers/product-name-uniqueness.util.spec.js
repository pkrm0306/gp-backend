"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_name_uniqueness_util_1 = require("./product-name-uniqueness.util");
describe('product-name-uniqueness', function () {
    it('normalizes whitespace', function () {
        expect((0, product_name_uniqueness_util_1.normalizeProductNameForComparison)('  foo   bar  ')).toBe('foo bar');
    });
    it('builds case-insensitive exact regex', function () {
        expect((0, product_name_uniqueness_util_1.productNameEqualsFilter)('Test Product')).toEqual({
            $regex: '^Test Product$',
            $options: 'i',
        });
    });
    it('escapes regex metacharacters', function () {
        expect((0, product_name_uniqueness_util_1.productNameEqualsFilter)('12 DOOR (A)')).toEqual({
            $regex: '^12 DOOR \\(A\\)$',
            $options: 'i',
        });
    });
});
