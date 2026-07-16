"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeValidTillFromCertified = computeValidTillFromCertified;
exports.computeNotifyDates = computeNotifyDates;
exports.computeGraceEndDate = computeGraceEndDate;
exports.computeCertificationDates = computeCertificationDates;
function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}
/** Calendar month add/subtract; clamp day to last day of target month (e.g. Dec 31 − 1 mo → Nov 30). */
function addMonths(date, months) {
    var d = new Date(date);
    var day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    var lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDayOfMonth));
    return d;
}
function subMonths(date, months) {
    return addMonths(date, -months);
}
/**
 * Validity end date for a newly certified product.
 *
 * Default rule: Dec 31 of (certified year + 2).
 *
 * Special business rule (2026 issuance window):
 * - 2026-01-01 .. 2026-04-30  => 2027-12-31
 * - 2026-05-01 .. 2026-12-31  => 2028-12-31
 */
function computeValidTillFromCertified(certifiedDate) {
    var y = certifiedDate.getFullYear();
    if (y === 2026) {
        var month = certifiedDate.getMonth(); // 0-based
        var day = certifiedDate.getDate();
        // Jan 1 .. Apr 30
        if (month < 4 || (month === 3 && day <= 30)) {
            return startOfDay(new Date(2027, 11, 31));
        }
        // May 1 .. Dec 31
        return startOfDay(new Date(2028, 11, 31));
    }
    return startOfDay(new Date(y + 2, 11, 31));
}
/** Notify offsets from validtill (calendar months), stored at start of day. */
function computeNotifyDates(validtillDate) {
    var vt = startOfDay(validtillDate);
    return {
        firstNotifyDate: startOfDay(subMonths(vt, 2)),
        secondNotifyDate: startOfDay(subMonths(vt, 1)),
        thirdNotifyDate: computeGraceEndDate(validtillDate),
    };
}
/** End of the 1-month grace period after validtillDate. */
function computeGraceEndDate(validtillDate) {
    return startOfDay(addMonths(startOfDay(validtillDate), 1));
}
/** Full bundle when admin approves certification payment. */
function computeCertificationDates(approvedAt) {
    var certifiedDate = approvedAt;
    var validtillDate = computeValidTillFromCertified(certifiedDate);
    var notify = computeNotifyDates(validtillDate);
    return __assign({ certifiedDate: certifiedDate, validtillDate: validtillDate }, notify);
}
