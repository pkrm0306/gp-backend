"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var summit_slug_util_1 = require("./summit-slug.util");
describe('summit-slug.util', function () {
    it('slugifies title', function () {
        expect((0, summit_slug_util_1.slugifySummitInput)('GreenPro Summit 2026')).toBe('greenpro-summit-2026');
    });
    it('buildSummitSlug appends year when title does not include it', function () {
        expect((0, summit_slug_util_1.buildSummitSlug)('GreenPro Summit', '2026')).toBe('greenpro-summit-2026');
    });
    it('buildSummitSlug avoids duplicate year suffix', function () {
        expect((0, summit_slug_util_1.buildSummitSlug)('GreenPro Summit 2026', '2026')).toBe('greenpro-summit-2026');
    });
    it('validates slug format', function () {
        expect((0, summit_slug_util_1.isValidSummitSlug)('greenpro-summit-2026')).toBe(true);
        expect((0, summit_slug_util_1.isValidSummitSlug)('a')).toBe(false);
    });
});
