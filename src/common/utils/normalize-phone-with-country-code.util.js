"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDialCode = normalizeDialCode;
exports.normalizePhoneWithCountryCode = normalizePhoneWithCountryCode;
exports.resolveManufacturerInquiryPhone = resolveManufacturerInquiryPhone;
/** Normalize dial code to E.164 prefix (e.g. `91` or `+91` → `+91`). */
function normalizeDialCode(raw) {
    var digits = String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/[^\d]/g, '');
    return digits ? "+".concat(digits) : '';
}
/**
 * Combine local phone digits with a country dial code, or pass through international `+` numbers.
 */
function normalizePhoneWithCountryCode(phoneRaw, countryCodeRaw, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var minDigits = (_a = options.minDigits) !== null && _a !== void 0 ? _a : 7;
    var maxDigits = (_b = options.maxDigits) !== null && _b !== void 0 ? _b : 15;
    var phoneInput = String(phoneRaw !== null && phoneRaw !== void 0 ? phoneRaw : '').trim();
    if (!phoneInput) {
        throw new Error('Phone is required');
    }
    var countryCodeInput = String(countryCodeRaw !== null && countryCodeRaw !== void 0 ? countryCodeRaw : '').trim();
    var sanitizedPhone = phoneInput.replace(/[^\d+]/g, '');
    var normalizedDialCode = normalizeDialCode(countryCodeInput);
    var normalizedPhone;
    if (sanitizedPhone.startsWith('+')) {
        normalizedPhone = "+".concat(sanitizedPhone.slice(1).replace(/[^\d]/g, ''));
    }
    else {
        var digits = sanitizedPhone.replace(/[^\d]/g, '');
        if (!normalizedDialCode && options.requireCountryCodeForLocal) {
            throw new Error('countryCode is required for local phone numbers');
        }
        normalizedPhone = normalizedDialCode
            ? "".concat(normalizedDialCode).concat(digits)
            : digits;
    }
    var digitCount = normalizedPhone.replace(/[^\d]/g, '').length;
    if (digitCount < minDigits || digitCount > maxDigits) {
        throw new Error('Phone number is invalid');
    }
    return normalizedPhone;
}
/** Resolve raw inquiry body fields to one E.164-style phone string. */
function resolveManufacturerInquiryPhone(dto) {
    var _a, _b, _c, _d, _e, _f;
    var raw = String((_c = (_b = (_a = dto.phoneNumber) !== null && _a !== void 0 ? _a : dto.phone) !== null && _b !== void 0 ? _b : dto.contact) !== null && _c !== void 0 ? _c : '').trim();
    var countryCode = (_f = (_e = (_d = dto.countryCode) !== null && _d !== void 0 ? _d : dto.country_code) !== null && _e !== void 0 ? _e : dto.dialCode) !== null && _f !== void 0 ? _f : dto.dial_code;
    var isLocal = raw.length > 0 && !raw.startsWith('+');
    return normalizePhoneWithCountryCode(raw, countryCode, {
        requireCountryCodeForLocal: isLocal,
    });
}
