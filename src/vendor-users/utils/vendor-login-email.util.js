"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLoginEmail = normalizeLoginEmail;
exports.splitLoginEmail = splitLoginEmail;
exports.editDistance = editDistance;
exports.isLikelyEmailDomainTypo = isLikelyEmailDomainTypo;
var ZERO_WIDTH_CHARS = /[\u200B-\u200D\uFEFF]/g;
/** Normalize login identifier: trim, lowercase, strip zero-width characters. */
function normalizeLoginEmail(raw) {
    return String(raw !== null && raw !== void 0 ? raw : '')
        .replace(ZERO_WIDTH_CHARS, '')
        .trim()
        .toLowerCase();
}
function splitLoginEmail(email) {
    var normalized = normalizeLoginEmail(email);
    var at = normalized.indexOf('@');
    if (at <= 0 || at === normalized.length - 1) {
        return null;
    }
    return {
        local: normalized.slice(0, at),
        domain: normalized.slice(at + 1),
    };
}
/** Levenshtein distance for short domain typo checks at login. */
function editDistance(a, b) {
    if (a === b) {
        return 0;
    }
    var rows = a.length + 1;
    var cols = b.length + 1;
    var matrix = Array.from({ length: rows }, function () {
        return Array(cols).fill(0);
    });
    for (var i = 0; i < rows; i++) {
        matrix[i][0] = i;
    }
    for (var j = 0; j < cols; j++) {
        matrix[0][j] = j;
    }
    for (var i = 1; i < rows; i++) {
        for (var j = 1; j < cols; j++) {
            var cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
    }
    return matrix[rows - 1][cols - 1];
}
var KNOWN_DOMAIN_TYPOS = {
    'gmil.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.con': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'outlok.com': 'outlook.com',
};
/** True when submitted domain is likely a typo of the registered domain. */
function isLikelyEmailDomainTypo(submittedDomain, registeredDomain) {
    var submitted = normalizeLoginEmail(submittedDomain);
    var registered = normalizeLoginEmail(registeredDomain);
    if (!submitted || !registered) {
        return false;
    }
    if (submitted === registered) {
        return true;
    }
    if (KNOWN_DOMAIN_TYPOS[submitted] === registered) {
        return true;
    }
    return editDistance(submitted, registered) <= 2;
}
