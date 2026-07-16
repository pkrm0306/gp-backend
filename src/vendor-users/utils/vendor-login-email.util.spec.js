"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vendor_login_email_util_1 = require("./vendor-login-email.util");
describe('vendor-login-email.util', function () {
    it('normalizes login email', function () {
        expect((0, vendor_login_email_util_1.normalizeLoginEmail)('  Vikas184@Gmail.COM ')).toBe('vikas184@gmail.com');
    });
    it('detects common gmail typo domains', function () {
        expect((0, vendor_login_email_util_1.isLikelyEmailDomainTypo)('gmil.com', 'gmail.com')).toBe(true);
        expect((0, vendor_login_email_util_1.isLikelyEmailDomainTypo)('yahoo.com', 'gmail.com')).toBe(false);
    });
    it('allows small edit distance between domains', function () {
        expect((0, vendor_login_email_util_1.editDistance)('gmil.com', 'gmail.com')).toBeLessThanOrEqual(2);
    });
});
