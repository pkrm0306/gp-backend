"use strict";
/**
 * Manufacturer initials + internal ID (gpInternalId) helpers.
 * Internal ID format: `GP<INITIAL>-<suffix>` where suffix is:
 * - **001–999** (always three digits, zero-padded), then
 * - **1000–9999** (four digits, no leading zeros) after every value 1–999 is in use.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeManufacturerName = normalizeManufacturerName;
exports.tokenizeManufacturerName = tokenizeManufacturerName;
exports.generateInitial = generateInitial;
exports.parseGpInternalNumericSuffix = parseGpInternalNumericSuffix;
exports.generateInternalId = generateInternalId;
exports.internalIdMatchesInitial = internalIdMatchesInitial;
var LETTER = /[A-Za-z]/;
function letterChar(ch) {
    if (!ch || !LETTER.test(ch))
        return null;
    return ch.toUpperCase();
}
/** Collapse whitespace; trim. */
function normalizeManufacturerName(name) {
    return String(name !== null && name !== void 0 ? name : '')
        .trim()
        .replace(/\s+/g, ' ');
}
/**
 * Split display name into word tokens (letters/digits grouped; skip pure punctuation).
 */
function tokenizeManufacturerName(normalizedName) {
    var _a;
    var s = normalizeManufacturerName(normalizedName);
    if (!s)
        return [];
    return (_a = s.match(/[A-Za-z0-9]+/g)) !== null && _a !== void 0 ? _a : [];
}
/**
 * Ordered 2-letter uppercase candidates: first letter of word1 fixed;
 * second letter cycles through word2, then rest of word1, then further words' first letters, then A–Z.
 */
function generateInitial(manufacturerName) {
    var name = normalizeManufacturerName(manufacturerName);
    var words = tokenizeManufacturerName(name);
    var out = [];
    if (words.length === 0) {
        return out;
    }
    var w1 = words[0];
    var c1 = letterChar(w1[0]);
    if (!c1) {
        return out;
    }
    var push = function (second) {
        if (!second)
            return;
        var pair = "".concat(c1).concat(second);
        if (pair.length === 2 && !out.includes(pair)) {
            out.push(pair);
        }
    };
    if (words.length >= 2) {
        var w2 = words[1];
        for (var i = 0; i < w2.length; i++) {
            push(letterChar(w2[i]));
        }
    }
    for (var j = 1; j < w1.length; j++) {
        push(letterChar(w1[j]));
    }
    for (var wi = 2; wi < words.length; wi++) {
        var wx = words[wi];
        var fc = letterChar(wx[0]);
        push(fc);
    }
    for (var code = 'A'.charCodeAt(0); code <= 'Z'.charCodeAt(0); code++) {
        push(String.fromCharCode(code));
    }
    return out;
}
/**
 * Numeric suffix after the last `-` in a `GP..` internal id: **1–999** (three-digit form)
 * or **1000–9999** (four-digit form). Returns `null` if not parseable.
 */
function parseGpInternalNumericSuffix(gpInternalId) {
    var id = String(gpInternalId !== null && gpInternalId !== void 0 ? gpInternalId : '').trim().toUpperCase();
    var m = /-(\d{3,4})$/.exec(id);
    if (!m) {
        return null;
    }
    var digits = m[1];
    var v = parseInt(digits, 10);
    if (!Number.isFinite(v)) {
        return null;
    }
    if (digits.length === 3) {
        if (v >= 1 && v <= 999) {
            return v;
        }
        return null;
    }
    if (digits.length === 4) {
        if (v >= 1000 && v <= 9999) {
            return v;
        }
        if (v >= 1 && v <= 999) {
            return v;
        }
        return null;
    }
    return null;
}
/**
 * Builds `GP<INITIAL>-<suffix>`: **001–999** zero-padded; **1000–9999** as plain digits.
 */
function generateInternalId(manufacturerInitial, suffixNumber) {
    var ini = String(manufacturerInitial !== null && manufacturerInitial !== void 0 ? manufacturerInitial : '').trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(ini)) {
        throw new Error('generateInternalId: manufacturerInitial must be exactly 2 letters');
    }
    if (!Number.isInteger(suffixNumber)) {
        throw new Error('generateInternalId: suffixNumber must be an integer from 1 to 9999');
    }
    if (suffixNumber >= 1 && suffixNumber <= 999) {
        var n = String(suffixNumber).padStart(3, '0');
        return "GP".concat(ini, "-").concat(n);
    }
    if (suffixNumber >= 1000 && suffixNumber <= 9999) {
        return "GP".concat(ini, "-").concat(suffixNumber);
    }
    throw new Error('generateInternalId: suffixNumber must be between 1 and 9999 (use 001–999 then 1000–9999)');
}
/** True if existing stored id already matches GP<initial>-(###|####) for the resolved initial. */
function internalIdMatchesInitial(gpInternalId, manufacturerInitial) {
    var id = String(gpInternalId !== null && gpInternalId !== void 0 ? gpInternalId : '').trim().toUpperCase();
    var ini = String(manufacturerInitial !== null && manufacturerInitial !== void 0 ? manufacturerInitial : '').trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(ini)) {
        return false;
    }
    var escaped = ini.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp("^GP".concat(escaped, "-(?:\\d{3}|[1-9]\\d{3})$"));
    if (!re.test(id)) {
        return false;
    }
    var n = parseGpInternalNumericSuffix(id);
    if (n == null) {
        return false;
    }
    return id === generateInternalId(ini, n);
}
