"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldExposeVendorOtpInResponse = shouldExposeVendorOtpInResponse;
exports.buildVendorRegistrationOtpClientPayload = buildVendorRegistrationOtpClientPayload;
exports.buildVendorRegistrationSuccessMessage = buildVendorRegistrationSuccessMessage;
exports.buildVendorResendOtpMessage = buildVendorResendOtpMessage;
var disposable_email_util_1 = require("../../common/utils/disposable-email.util");
function isNonProductionEnv(configService) {
    var nodeEnv = String(configService.get('NODE_ENV') ||
        configService.get('APP_ENV') ||
        configService.get('ENV') ||
        '')
        .trim()
        .toLowerCase();
    return (nodeEnv === 'staging' ||
        nodeEnv === 'development' ||
        nodeEnv === 'test' ||
        nodeEnv === 'local');
}
/** When true, API may return OTP in the response (staging or disposable inbox). */
function shouldExposeVendorOtpInResponse(configService, email) {
    return isNonProductionEnv(configService) || (0, disposable_email_util_1.isDisposableEmailDomain)(email);
}
function buildVendorRegistrationOtpClientPayload(configService, email, otp) {
    if (!shouldExposeVendorOtpInResponse(configService, email)) {
        return {};
    }
    var disposable = (0, disposable_email_util_1.isDisposableEmailDomain)(email);
    var yopHint = (0, disposable_email_util_1.yopmailInboxHint)(email);
    var emailDeliveryNote;
    if (disposable) {
        emailDeliveryNote =
            'Temporary inboxes (Yopmail, etc.) often do not show emails sent from Gmail SMTP. Use verificationOtp below on the verify screen.';
    }
    else if (isNonProductionEnv(configService)) {
        emailDeliveryNote =
            'Staging/dev: if the inbox email is delayed, use verificationOtp below.';
    }
    return __assign(__assign({ verificationOtp: otp, otp: otp }, (emailDeliveryNote ? { emailDeliveryNote: emailDeliveryNote } : {})), (yopHint ? { yopmailInboxHint: yopHint } : {}));
}
function buildVendorRegistrationSuccessMessage(configService, email, otp, emailDelivered) {
    var expose = shouldExposeVendorOtpInResponse(configService, email);
    if (!emailDelivered) {
        return expose
            ? "Registration successful, but email could not be sent. Your verification code is ".concat(otp, ".")
            : 'Registration successful, but the verification email could not be sent. Please use Resend OTP.';
    }
    if (expose) {
        if ((0, disposable_email_util_1.isDisposableEmailDomain)(email)) {
            return "Registration successful. Your verification code is ".concat(otp, ". Yopmail/temporary inboxes may not receive Gmail mail \u2014 use this code to verify.");
        }
        return "Registration successful. Your verification code is ".concat(otp, ". Check your email or use this code if mail is delayed.");
    }
    return 'Registration successful. Please verify your email.';
}
function buildVendorResendOtpMessage(configService, email, otp) {
    if (shouldExposeVendorOtpInResponse(configService, email)) {
        if ((0, disposable_email_util_1.isDisposableEmailDomain)(email)) {
            return "Verification code is ".concat(otp, ". Yopmail/temporary inboxes may not receive Gmail mail \u2014 use this code to verify.");
        }
        return "Verification code is ".concat(otp, ". Check your email or use this code if mail is delayed.");
    }
    return 'Verification OTP sent to your email.';
}
