"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUMMIT_YEAR_MIN = void 0;
exports.getSummitYearOptions = getSummitYearOptions;
exports.isValidSummitYear = isValidSummitYear;
/** Earliest year offered in summit basic-info year dropdowns. */
exports.SUMMIT_YEAR_MIN = 2019;
/** Year dropdown options for summit basic info (newest first). */
function getSummitYearOptions(now, futureCount) {
    if (now === void 0) { now = new Date(); }
    if (futureCount === void 0) { futureCount = 2; }
    var current = now.getFullYear();
    var years = [];
    for (var y = current + futureCount; y >= exports.SUMMIT_YEAR_MIN; y--) {
        years.push(y);
    }
    return years.map(function (y) { return ({ value: String(y), label: String(y) }); });
}
function isValidSummitYear(year) {
    return /^(19|20)\d{2}$/.test(String(year).trim());
}
