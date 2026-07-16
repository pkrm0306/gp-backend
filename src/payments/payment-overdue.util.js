"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_OVERDUE_DAYS = void 0;
exports.parsePaymentCreatedDate = parsePaymentCreatedDate;
exports.differenceInCalendarDays = differenceInCalendarDays;
exports.isPaymentOverdue = isPaymentOverdue;
exports.resolveVendorDisplayPaymentStatus = resolveVendorDisplayPaymentStatus;
exports.getPaymentOverdueCutoffDate = getPaymentOverdueCutoffDate;
exports.buildVendorHistoryStatusClause = buildVendorHistoryStatusClause;
/** Days after payment creation before vendor history treats status 0 as overdue. */
exports.PAYMENT_OVERDUE_DAYS = 14;
function startOfCalendarDay(value) {
    var d = new Date(value);
    d.setHours(0, 0, 0, 0);
    return d;
}
function parsePaymentCreatedDate(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
        var d_1 = new Date(value);
        return Number.isNaN(d_1.getTime()) ? null : d_1;
    }
    var raw = String(value !== null && value !== void 0 ? value : '').trim();
    if (!raw)
        return null;
    var ddMmYyyy = raw.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (ddMmYyyy) {
        var day = Number(ddMmYyyy[1]);
        var month = Number(ddMmYyyy[2]) - 1;
        var year = Number(ddMmYyyy[3]);
        var d_2 = new Date(year, month, day);
        return Number.isNaN(d_2.getTime()) ? null : d_2;
    }
    var d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
}
function differenceInCalendarDays(later, earlier) {
    var end = startOfCalendarDay(later).getTime();
    var start = startOfCalendarDay(earlier).getTime();
    return Math.floor((end - start) / (24 * 60 * 60 * 1000));
}
function isPaymentOverdue(paymentStatus, createdDate, referenceDate) {
    if (referenceDate === void 0) { referenceDate = new Date(); }
    if (Number(paymentStatus) !== 0) {
        return false;
    }
    var created = parsePaymentCreatedDate(createdDate);
    if (!created) {
        return false;
    }
    return (differenceInCalendarDays(referenceDate, created) >= exports.PAYMENT_OVERDUE_DAYS);
}
/** Vendor payment history display status (0=over due, 1=pending, 2=paid, 3=rejected). */
function resolveVendorDisplayPaymentStatus(paymentStatus, createdDate, referenceDate) {
    if (referenceDate === void 0) { referenceDate = new Date(); }
    var status = Number(paymentStatus);
    if (status === 0) {
        return isPaymentOverdue(status, createdDate, referenceDate) ? 0 : 1;
    }
    if (status === 1 || status === 2 || status === 3) {
        return status;
    }
    return 1;
}
function getPaymentOverdueCutoffDate(referenceDate) {
    if (referenceDate === void 0) { referenceDate = new Date(); }
    var cutoff = startOfCalendarDay(referenceDate);
    cutoff.setDate(cutoff.getDate() - exports.PAYMENT_OVERDUE_DAYS);
    return cutoff;
}
/** Mongo match for vendor history filters that map pending/overdue to created-date rules. */
function buildVendorHistoryStatusClause(status, referenceDate) {
    if (referenceDate === void 0) { referenceDate = new Date(); }
    if (status === 2) {
        return { paymentStatus: 2 };
    }
    var cutoff = getPaymentOverdueCutoffDate(referenceDate);
    if (status === 0) {
        return {
            paymentStatus: 0,
            createdDate: { $lte: cutoff },
        };
    }
    if (status === 1) {
        return {
            $or: [
                { paymentStatus: 1 },
                {
                    paymentStatus: 0,
                    createdDate: { $gt: cutoff },
                },
            ],
        };
    }
    return { paymentStatus: status };
}
