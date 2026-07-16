"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMysqlDate = parseMysqlDate;
exports.parseMysqlDateRequired = parseMysqlDateRequired;
exports.normalizeUrn = normalizeUrn;
exports.normalizeEmail = normalizeEmail;
exports.trimString = trimString;
exports.parseDecimalNumber = parseDecimalNumber;
exports.parseJsonArray = parseJsonArray;
var ZERO_DATE_PREFIX = '0000-00-00';
var EPOCH_FALLBACK = new Date('1970-01-01T00:00:00.000Z');
function parseMysqlDate(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime()))
            return null;
        return value;
    }
    var str = String(value).trim();
    if (!str || str.startsWith(ZERO_DATE_PREFIX)) {
        return null;
    }
    var d = new Date(str.includes('T') ? str : str.replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) {
        return null;
    }
    return d;
}
function parseMysqlDateRequired(value) {
    var _a;
    return (_a = parseMysqlDate(value)) !== null && _a !== void 0 ? _a : EPOCH_FALLBACK;
}
function normalizeUrn(value) {
    return String(value !== null && value !== void 0 ? value : '').trim();
}
function normalizeEmail(value) {
    return String(value !== null && value !== void 0 ? value : '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '');
}
function trimString(value) {
    return String(value !== null && value !== void 0 ? value : '').trim();
}
function parseDecimalNumber(value) {
    if (value === null || value === undefined || value === '')
        return 0;
    var n = Number(value);
    return Number.isFinite(n) ? n : 0;
}
function parseJsonArray(value) {
    if (value === null || value === undefined || value === '')
        return null;
    if (Array.isArray(value))
        return value;
    var str = String(value).trim();
    if (!str)
        return null;
    try {
        return JSON.parse(str);
    }
    catch (_a) {
        if (str.includes(',')) {
            return str.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        }
        return str;
    }
}
