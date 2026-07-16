"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NEWSLETTER_SUBSCRIBER_COLLECTIONS = void 0;
exports.newsletterSubscriberActivityMs = newsletterSubscriberActivityMs;
exports.newsletterSubscriberActivityDate = newsletterSubscriberActivityDate;
exports.absorbNewsletterSubscriberRows = absorbNewsletterSubscriberRows;
exports.sortNewsletterSubscribersByActivity = sortNewsletterSubscribersByActivity;
/** Newest of createdAt / updatedAt — used so re-subscribes surface at the top of the list. */
function newsletterSubscriberActivityMs(row) {
    var _a, _b;
    var updated = Date.parse(String((_a = row.updatedAt) !== null && _a !== void 0 ? _a : ''));
    var created = Date.parse(String((_b = row.createdAt) !== null && _b !== void 0 ? _b : ''));
    return Math.max(Number.isFinite(updated) ? updated : 0, Number.isFinite(created) ? created : 0);
}
function newsletterSubscriberActivityDate(row) {
    var ms = newsletterSubscriberActivityMs(row);
    return ms > 0 ? new Date(ms) : null;
}
/**
 * Merge subscriber rows by email, keeping the most recently active document
 * when the same email exists in both `newslettersubscribers` and
 * `newsletter_subscribers`.
 */
function absorbNewsletterSubscriberRows(byEmail, rows) {
    var _a;
    for (var _i = 0, _b = rows !== null && rows !== void 0 ? rows : []; _i < _b.length; _i++) {
        var row = _b[_i];
        var email = String((_a = row === null || row === void 0 ? void 0 : row.email) !== null && _a !== void 0 ? _a : '')
            .trim()
            .toLowerCase();
        if (!email)
            continue;
        var next = row;
        var existing = byEmail.get(email);
        if (!existing ||
            newsletterSubscriberActivityMs(next) >=
                newsletterSubscriberActivityMs(existing)) {
            byEmail.set(email, next);
        }
    }
}
function sortNewsletterSubscribersByActivity(rows) {
    return __spreadArray([], rows, true).sort(function (a, b) {
        var _a, _b;
        var delta = newsletterSubscriberActivityMs(b) - newsletterSubscriberActivityMs(a);
        if (delta !== 0)
            return delta;
        return String((_a = b._id) !== null && _a !== void 0 ? _a : '').localeCompare(String((_b = a._id) !== null && _b !== void 0 ? _b : ''));
    });
}
exports.NEWSLETTER_SUBSCRIBER_COLLECTIONS = [
    'newslettersubscribers',
    'newsletter_subscribers',
];
