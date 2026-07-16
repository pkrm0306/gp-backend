"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var otp_util_1 = require("./otp.util");
describe('generateVendorRegistrationOtp', function () {
    var config = function (env, fixed) {
        return ({
            get: function (key) {
                if (key === 'VENDOR_REGISTRATION_OTP_FIXED')
                    return fixed !== null && fixed !== void 0 ? fixed : '';
                if (key === 'NODE_ENV')
                    return env;
                return '';
            },
        });
    };
    it('uses fixed OTP when VENDOR_REGISTRATION_OTP_FIXED is set', function () {
        expect((0, otp_util_1.generateVendorRegistrationOtp)(config('production', '999888'))).toBe('999888');
    });
    it('uses 123456 in development', function () {
        expect((0, otp_util_1.generateVendorRegistrationOtp)(config('development'))).toBe('123456');
    });
    it('generates a 6-digit OTP in production', function () {
        var otp = (0, otp_util_1.generateVendorRegistrationOtp)(config('production'));
        expect(otp).toMatch(/^\d{6}$/);
    });
});
