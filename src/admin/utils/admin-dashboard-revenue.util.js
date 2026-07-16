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
exports.REVENUE_PAYMENT_TYPE_LABELS = exports.REVENUE_PAYMENT_TYPE_KEYS = exports.REVENUE_RECOGNIZED_PAYMENT_STATUSES = void 0;
exports.paymentRevenueRecognitionDateExpr = paymentRevenueRecognitionDateExpr;
exports.buildPaymentRevenueDateRangeMatch = buildPaymentRevenueDateRangeMatch;
exports.buildPaymentRevenueBaseMatch = buildPaymentRevenueBaseMatch;
exports.normalizeRevenuePaymentTypeExpr = normalizeRevenuePaymentTypeExpr;
exports.revenueWeekOfMonthBucketExpr = revenueWeekOfMonthBucketExpr;
exports.formatWeekOfMonthBucketLabel = formatWeekOfMonthBucketLabel;
exports.emptyRevenueTypeTotals = emptyRevenueTypeTotals;
exports.roundRevenueAmount = roundRevenueAmount;
exports.revenueScopeDescription = revenueScopeDescription;
exports.buildRevenueDistribution = buildRevenueDistribution;
exports.getDefaultRevenueChartMonthRange = getDefaultRevenueChartMonthRange;
/**
 * Revenue-recognized payments: vendor-submitted (1) or admin-approved/completed (2).
 * Excludes created (0) and cancelled (3).
 */
exports.REVENUE_RECOGNIZED_PAYMENT_STATUSES = [1, 2];
exports.REVENUE_PAYMENT_TYPE_KEYS = [
    'registration',
    'certification',
    'renew',
];
exports.REVENUE_PAYMENT_TYPE_LABELS = {
    registration: 'Registration Fee',
    certification: 'Certificate Fee',
    renew: 'Renew Payment',
};
/** Best-effort payment date for revenue bucketing / filters. */
function paymentRevenueRecognitionDateExpr() {
    return {
        $ifNull: [
            '$paymentChequeDate',
            { $ifNull: ['$updatedDate', '$createdDate'] },
        ],
    };
}
function buildPaymentRevenueDateRangeMatch(dateRange) {
    var from = dateRange.from, to = dateRange.to;
    return {
        $or: [
            { paymentChequeDate: { $gte: from, $lte: to } },
            {
                $and: [
                    {
                        $or: [
                            { paymentChequeDate: { $exists: false } },
                            { paymentChequeDate: null },
                        ],
                    },
                    { createdDate: { $gte: from, $lte: to } },
                ],
            },
            {
                $and: [
                    {
                        $or: [
                            { paymentChequeDate: { $exists: false } },
                            { paymentChequeDate: null },
                        ],
                    },
                    { updatedDate: { $gte: from, $lte: to } },
                ],
            },
        ],
    };
}
function buildPaymentRevenueBaseMatch(filters, scopeUrns) {
    var clauses = [
        { paymentStatus: { $in: __spreadArray([], exports.REVENUE_RECOGNIZED_PAYMENT_STATUSES, true) } },
    ];
    if (filters.dateRange) {
        clauses.push(buildPaymentRevenueDateRangeMatch(filters.dateRange));
    }
    if (scopeUrns !== undefined) {
        clauses.push({
            urnNo: scopeUrns.length > 0 ? { $in: scopeUrns } : { $in: [] },
        });
    }
    return clauses.length === 1 ? clauses[0] : { $and: clauses };
}
function normalizeRevenuePaymentTypeExpr() {
    return {
        $let: {
            vars: {
                raw: {
                    $toLower: {
                        $trim: { input: { $ifNull: ['$paymentType', ''] } },
                    },
                },
            },
            in: {
                $switch: {
                    branches: [
                        {
                            case: { $in: ['$$raw', ['renew', 'renewal', 'renew_payment']] },
                            then: 'renew',
                        },
                        {
                            case: {
                                $in: [
                                    '$$raw',
                                    ['certification', 'certificate', 'cert', 'certificate_fee'],
                                ],
                            },
                            then: 'certification',
                        },
                        {
                            case: {
                                $in: ['$$raw', ['registration', 'register', 'registration_fee']],
                            },
                            then: 'registration',
                        },
                    ],
                    default: '$$raw',
                },
            },
        },
    };
}
/** Week index within calendar month (1–5) for W1…W5 charts. */
function revenueWeekOfMonthBucketExpr(dateField) {
    if (dateField === void 0) { dateField = 'revenueDate'; }
    return {
        year: { $year: "$".concat(dateField) },
        month: { $month: "$".concat(dateField) },
        weekOfMonth: {
            $min: [
                5,
                {
                    $ceil: {
                        $divide: [{ $dayOfMonth: "$".concat(dateField) }, 7],
                    },
                },
            ],
        },
    };
}
function formatWeekOfMonthBucketLabel(bucket) {
    var _a;
    var w = (_a = bucket.weekOfMonth) !== null && _a !== void 0 ? _a : 1;
    return "W".concat(w);
}
function emptyRevenueTypeTotals() {
    return { amount: 0, gstAmount: 0, tdsAmount: 0, count: 0 };
}
function roundRevenueAmount(value) {
    return Number((value !== null && value !== void 0 ? value : 0).toFixed(2));
}
function revenueScopeDescription(filters, scopedByProducts) {
    if (scopedByProducts) {
        return 'completed payments for URNs matching product filters (category, region, productStatus)';
    }
    if (filters.dateRange) {
        return 'paid/approved payments by payment date (cheque date, else created/updated) within dateRange';
    }
    return 'all paid/approved payments (platform-wide)';
}
function buildRevenueDistribution(totalsByType, totalAmount) {
    return exports.REVENUE_PAYMENT_TYPE_KEYS.map(function (key) {
        var amount = totalsByType[key].amount;
        var count = totalsByType[key].count;
        var percentage = totalAmount > 0
            ? roundRevenueAmount((amount / totalAmount) * 100)
            : 0;
        return {
            key: key,
            label: exports.REVENUE_PAYMENT_TYPE_LABELS[key],
            amount: amount,
            count: count,
            percentage: percentage,
        };
    });
}
function getDefaultRevenueChartMonthRange(now) {
    if (now === void 0) { now = new Date(); }
    return {
        from: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
        to: now,
    };
}
