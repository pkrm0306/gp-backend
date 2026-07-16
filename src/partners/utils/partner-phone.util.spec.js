"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var partner_phone_util_1 = require("./partner-phone.util");
describe('partner-phone.util', function () {
    it('combines country code with local mobile', function () {
        expect((0, partner_phone_util_1.resolvePartnerPhone)({
            mobile: '9848441332',
            countryCode: '+91',
        })).toBe('+919848441332');
    });
    it('passes through international phone', function () {
        expect((0, partner_phone_util_1.resolvePartnerPhone)({
            phone: '+14155552671',
        })).toBe('+14155552671');
    });
    it('requires country code for local digits', function () {
        expect(function () {
            return (0, partner_phone_util_1.resolvePartnerPhone)({
                mobile: '9848441332',
            });
        }).toThrow('countryCode is required for local phone numbers');
    });
    it('normalizes dial code aliases', function () {
        expect((0, partner_phone_util_1.resolvePartnerCountryCode)({ country_code: '91' })).toBe('+91');
    });
});
