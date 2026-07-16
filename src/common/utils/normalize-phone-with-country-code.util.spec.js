"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var normalize_phone_with_country_code_util_1 = require("./normalize-phone-with-country-code.util");
describe('normalizePhoneWithCountryCode', function () {
    it('prefixes local digits with dial code', function () {
        expect((0, normalize_phone_with_country_code_util_1.normalizePhoneWithCountryCode)('9876543213', '+91', {
            requireCountryCodeForLocal: true,
        })).toBe('+919876543213');
    });
    it('accepts dial code without plus', function () {
        expect((0, normalize_phone_with_country_code_util_1.normalizePhoneWithCountryCode)('9876543213', '91')).toBe('+919876543213');
    });
    it('passes through international numbers', function () {
        expect((0, normalize_phone_with_country_code_util_1.normalizePhoneWithCountryCode)('+14155552671', '')).toBe('+14155552671');
    });
    it('requires country code for local numbers when configured', function () {
        expect(function () {
            return (0, normalize_phone_with_country_code_util_1.normalizePhoneWithCountryCode)('9876543213', '', {
                requireCountryCodeForLocal: true,
            });
        }).toThrow('countryCode is required');
    });
});
describe('resolveManufacturerInquiryPhone', function () {
    it('merges phoneNumber and countryCode', function () {
        expect((0, normalize_phone_with_country_code_util_1.resolveManufacturerInquiryPhone)({
            phoneNumber: '9876543213',
            countryCode: '+91',
        })).toBe('+919876543213');
    });
    it('reads country_code alias', function () {
        expect((0, normalize_phone_with_country_code_util_1.resolveManufacturerInquiryPhone)({
            phone: '9876543213',
            country_code: '91',
        })).toBe('+919876543213');
    });
});
describe('normalizeDialCode', function () {
    it('normalizes +91', function () {
        expect((0, normalize_phone_with_country_code_util_1.normalizeDialCode)('+91')).toBe('+91');
    });
});
