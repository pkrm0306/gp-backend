"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractEmailDomain = extractEmailDomain;
exports.isDisposableEmailDomain = isDisposableEmailDomain;
exports.yopmailInboxHint = yopmailInboxHint;
/** Domains that often do not receive mail from personal Gmail SMTP. */
var DISPOSABLE_EMAIL_DOMAINS = new Set([
    'yopmail.com',
    'yopmail.fr',
    'yopmail.net',
    'cool.fr.nf',
    'jetable.fr.nf',
    'courriel.fr.nf',
    'moncourrier.fr.nf',
    'monemail.fr.nf',
    'monmail.fr.nf',
    'guerrillamail.com',
    'guerrillamail.net',
    'sharklasers.com',
    'mailinator.com',
    'tempmail.com',
    '10minutemail.com',
]);
function extractEmailDomain(email) {
    var normalized = String(email !== null && email !== void 0 ? email : '').trim().toLowerCase();
    var at = normalized.lastIndexOf('@');
    if (at <= 0 || at === normalized.length - 1) {
        return null;
    }
    return normalized.slice(at + 1);
}
function isDisposableEmailDomain(email) {
    var domain = extractEmailDomain(email);
    if (!domain) {
        return false;
    }
    if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
        return true;
    }
    return domain.endsWith('.yopmail.com') || domain.endsWith('.yopmail.fr');
}
function yopmailInboxHint(email) {
    var normalized = String(email !== null && email !== void 0 ? email : '').trim().toLowerCase();
    var domain = extractEmailDomain(normalized);
    if (!domain || !domain.includes('yopmail')) {
        return null;
    }
    var local = normalized.split('@')[0];
    return "Open https://yopmail.com and enter inbox name \"".concat(local, "\" (without @yopmail.com).");
}
