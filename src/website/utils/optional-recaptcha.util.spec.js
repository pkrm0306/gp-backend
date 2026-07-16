"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var optional_recaptcha_util_1 = require("./optional-recaptcha.util");
describe('optional-recaptcha.util', function () {
    it('extractOptionalRecaptchaToken reads header first', function () {
        expect((0, optional_recaptcha_util_1.extractOptionalRecaptchaToken)({ 'x-recaptcha-token': 'header-token' }, { captchaToken: 'body-token' })).toBe('header-token');
    });
    it('extractOptionalRecaptchaToken reads body aliases', function () {
        expect((0, optional_recaptcha_util_1.extractOptionalRecaptchaToken)({}, { captchaToken: 'body-token' })).toBe('body-token');
    });
    it('manufacturer inquiry never requires recaptcha', function () {
        expect((0, optional_recaptcha_util_1.isManufacturerInquiryRecaptchaRequired)()).toBe(false);
    });
});
