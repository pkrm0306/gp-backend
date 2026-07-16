"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP_RESEND_WINDOW_SECONDS = exports.OTP_RESEND_MAX_PER_WINDOW = exports.OTP_RESEND_COOLDOWN_SECONDS = exports.VENDOR_REGISTRATION_OTP_EXPIRES_MINUTES = void 0;
exports.generateVendorRegistrationOtp = generateVendorRegistrationOtp;
exports.VENDOR_REGISTRATION_OTP_EXPIRES_MINUTES = 15;
/** Minimum wait between resend requests for the same email. */
exports.OTP_RESEND_COOLDOWN_SECONDS = 60;
/** Max resend attempts per email within the rolling window. */
exports.OTP_RESEND_MAX_PER_WINDOW = 5;
exports.OTP_RESEND_WINDOW_SECONDS = 15 * 60;
function generateVendorRegistrationOtp(configService) {
    var _a;
    var fixed = String((_a = configService.get('VENDOR_REGISTRATION_OTP_FIXED')) !== null && _a !== void 0 ? _a : '').trim();
    if (fixed) {
        return fixed;
    }
    var nodeEnv = String(configService.get('NODE_ENV') ||
        configService.get('APP_ENV') ||
        configService.get('ENV') ||
        '')
        .trim()
        .toLowerCase();
    if (nodeEnv === 'staging' || nodeEnv === 'development' || nodeEnv === 'test') {
        return '123456';
    }
    return String(Math.floor(100000 + Math.random() * 900000));
}
