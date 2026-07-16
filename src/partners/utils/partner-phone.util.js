"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePartnerCountryCode = resolvePartnerCountryCode;
exports.resolvePartnerPhone = resolvePartnerPhone;
var common_1 = require("@nestjs/common");
var normalize_phone_with_country_code_util_1 = require("../../common/utils/normalize-phone-with-country-code.util");
function resolvePartnerCountryCode(dto) {
    var _a, _b, _c;
    var normalized = (0, normalize_phone_with_country_code_util_1.normalizeDialCode)((_c = (_b = (_a = dto.countryCode) !== null && _a !== void 0 ? _a : dto.country_code) !== null && _b !== void 0 ? _b : dto.dialCode) !== null && _c !== void 0 ? _c : dto.dial_code);
    return normalized || undefined;
}
function resolvePartnerPhone(dto) {
    var _a, _b;
    var raw = String((_b = (_a = dto.phone) !== null && _a !== void 0 ? _a : dto.mobile) !== null && _b !== void 0 ? _b : '').trim();
    if (!raw) {
        throw new common_1.BadRequestException('Phone / mobile is required');
    }
    var countryCode = resolvePartnerCountryCode(dto);
    var isLocal = !raw.startsWith('+');
    try {
        return (0, normalize_phone_with_country_code_util_1.normalizePhoneWithCountryCode)(raw, countryCode, {
            requireCountryCodeForLocal: isLocal,
        });
    }
    catch (error) {
        throw new common_1.BadRequestException(error.message || 'Invalid phone');
    }
}
