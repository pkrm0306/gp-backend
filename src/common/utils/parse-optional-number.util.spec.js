"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_optional_number_util_1 = require("./parse-optional-number.util");
describe('parseOptionalDecimalNumber', function () {
    it('parses decimal strings and numbers', function () {
        expect((0, parse_optional_number_util_1.parseOptionalDecimalNumber)('10.5')).toBe(10.5);
        expect((0, parse_optional_number_util_1.parseOptionalDecimalNumber)(10.5)).toBe(10.5);
        expect((0, parse_optional_number_util_1.parseOptionalDecimalNumber)('  12.75  ')).toBe(12.75);
    });
    it('returns undefined for empty or invalid values', function () {
        expect((0, parse_optional_number_util_1.parseOptionalDecimalNumber)(undefined)).toBeUndefined();
        expect((0, parse_optional_number_util_1.parseOptionalDecimalNumber)(null)).toBeUndefined();
        expect((0, parse_optional_number_util_1.parseOptionalDecimalNumber)('')).toBeUndefined();
        expect((0, parse_optional_number_util_1.parseOptionalDecimalNumber)('abc')).toBeUndefined();
    });
});
