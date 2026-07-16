"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRenewableEnergyUtilization = normalizeRenewableEnergyUtilization;
/** Strip zero-width / BOM chars that sometimes appear after admin copy/resend flows. */
function cleanUiString(value) {
    if (value === undefined || value === null)
        return '';
    return String(value)
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
}
/**
 * Maps vendor / admin UI values to stored enum `yes` | `no`.
 * Supports 1/0, 2 (some forms use 2 = No), booleans, common synonyms, and punctuation variants.
 */
function normalizeRenewableEnergyUtilization(value) {
    if (value === undefined || value === null || value === '')
        return undefined;
    if (typeof value === 'boolean') {
        return value ? 'yes' : 'no';
    }
    if (typeof value === 'number') {
        if (!Number.isFinite(value))
            return undefined;
        if (value === 1)
            return 'yes';
        if (value === 0 || value === 2)
            return 'no';
        return undefined;
    }
    var raw = cleanUiString(value);
    if (raw === '')
        return undefined;
    var normalized = raw.toLowerCase();
    if (normalized === '1' ||
        normalized === 'yes' ||
        normalized === 'true' ||
        normalized === 'y' ||
        normalized === 'on') {
        return 'yes';
    }
    if (normalized === '0' ||
        normalized === '2' ||
        normalized === '02' ||
        normalized === 'no' ||
        normalized === 'false' ||
        normalized === 'n' ||
        normalized === 'off' ||
        normalized === 'none') {
        return 'no';
    }
    var noPunct = normalized.replace(/[.:;,\s]+$/g, '');
    if (noPunct === 'no' || noPunct === 'n')
        return 'no';
    if (noPunct === 'yes' || noPunct === 'y')
        return 'yes';
    return undefined;
}
