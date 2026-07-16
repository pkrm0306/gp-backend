"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptionalDecimalNumber = parseOptionalDecimalNumber;
/** Coerce optional form/JSON values to a finite number (supports decimals). */
function parseOptionalDecimalNumber(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : undefined;
    }
    var n = Number(String(value).trim());
    return Number.isFinite(n) ? n : undefined;
}
