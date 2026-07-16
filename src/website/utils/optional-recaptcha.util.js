"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractOptionalRecaptchaToken = extractOptionalRecaptchaToken;
exports.isManufacturerInquiryRecaptchaRequired = isManufacturerInquiryRecaptchaRequired;
/** Read optional reCAPTCHA token from header or body (not required for manufacturer inquiry). */
function extractOptionalRecaptchaToken(headers, body) {
    var _a, _b, _c;
    var h = headers !== null && headers !== void 0 ? headers : {};
    var headerRaw = (_b = (_a = h['x-recaptcha-token']) !== null && _a !== void 0 ? _a : h['x-recaptcha-token'.toLowerCase()]) !== null && _b !== void 0 ? _b : h['X-Recaptcha-Token'];
    var fromHeader = String(headerRaw !== null && headerRaw !== void 0 ? headerRaw : '').trim();
    if (fromHeader) {
        return fromHeader;
    }
    var b = body !== null && body !== void 0 ? body : {};
    for (var _i = 0, _d = [
        'captchaToken',
        'recaptchaToken',
        'gRecaptchaResponse',
        'g-recaptcha-response',
        'recaptcha_response',
        'captcha',
    ]; _i < _d.length; _i++) {
        var key = _d[_i];
        var value = String((_c = b[key]) !== null && _c !== void 0 ? _c : '').trim();
        if (value) {
            return value;
        }
    }
    return '';
}
/**
 * Manufacturer inquiry does not require reCAPTCHA.
 * When a token is sent, it may be verified elsewhere (e.g. POST /auth/verify-recaptcha) but this endpoint never blocks on it.
 */
function isManufacturerInquiryRecaptchaRequired() {
    return false;
}
