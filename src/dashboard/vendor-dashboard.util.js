"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorActiveProductMatch = vendorActiveProductMatch;
exports.calcTrendPercent = calcTrendPercent;
exports.trendDirection = trendDirection;
exports.buildKpiCard = buildKpiCard;
exports.monthShortLabel = monthShortLabel;
exports.mapRecentEoiStatus = mapRecentEoiStatus;
exports.suggestAxisMax = suggestAxisMax;
exports.formatRelativeTime = formatRelativeTime;
exports.mapActivityLogToRecentItem = mapActivityLogToRecentItem;
var MONTH_SHORT = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
function vendorActiveProductMatch(vendorId) {
    return {
        vendorId: vendorId,
        productType: 0,
        $or: [{ is_deleted: { $ne: true } }, { is_deleted: { $exists: false } }],
    };
}
function calcTrendPercent(current, previous) {
    if (previous <= 0)
        return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
}
function trendDirection(trendPercent) {
    if (trendPercent > 0)
        return 'up';
    if (trendPercent < 0)
        return 'down';
    return 'flat';
}
function buildKpiCard(input) {
    var _a;
    var trendPercent = calcTrendPercent(input.currentMonth, input.previousMonth);
    return {
        key: input.key,
        label: input.label,
        value: input.value,
        trendPercent: trendPercent,
        trendDirection: trendDirection(trendPercent),
        subLabel: input.subLabel,
        currency: input.format === 'currency' ? 'INR' : undefined,
        format: (_a = input.format) !== null && _a !== void 0 ? _a : 'number',
    };
}
function monthShortLabel(month) {
    var _a;
    return (_a = MONTH_SHORT[Math.max(0, Math.min(11, month - 1))]) !== null && _a !== void 0 ? _a : "M".concat(month);
}
function mapRecentEoiStatus(productStatus, urnStatus) {
    if (productStatus === 2) {
        return { statusKey: 'certified', status: 'Certified', statusVariant: 'success' };
    }
    if (productStatus === 3) {
        return { statusKey: 'rejected', status: 'Rejected', statusVariant: 'danger' };
    }
    if (productStatus === 0) {
        return { statusKey: 'pending', status: 'Pending', statusVariant: 'warning' };
    }
    if (productStatus === 1 && urnStatus >= 1 && urnStatus <= 4) {
        return { statusKey: 'approved', status: 'Approved', statusVariant: 'success' };
    }
    return {
        statusKey: 'under_review',
        status: 'Under Review',
        statusVariant: 'warning',
    };
}
function suggestAxisMax(maxValue) {
    if (maxValue <= 0)
        return 10;
    if (maxValue <= 10)
        return 10;
    if (maxValue <= 24)
        return 24;
    if (maxValue <= 32)
        return 32;
    if (maxValue <= 100)
        return Math.ceil(maxValue / 10) * 10;
    return Math.ceil(maxValue / 100) * 100;
}
function formatRelativeTime(from, now) {
    if (now === void 0) { now = new Date(); }
    var diffMs = now.getTime() - from.getTime();
    if (diffMs < 0)
        return 'just now';
    var minutes = Math.floor(diffMs / 60000);
    if (minutes < 1)
        return 'just now';
    if (minutes < 60) {
        return "".concat(minutes, " minute").concat(minutes === 1 ? '' : 's', " ago");
    }
    var hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return "".concat(hours, " hour").concat(hours === 1 ? '' : 's', " ago");
    }
    var days = Math.floor(hours / 24);
    return "".concat(days, " day").concat(days === 1 ? '' : 's', " ago");
}
function mapActivityLogToRecentItem(input) {
    var _a, _b;
    var type = inferActivityType(input.activity, input.activitiesId);
    var productLabel = ((_a = input.productName) === null || _a === void 0 ? void 0 : _a.trim()) || 'product';
    var message = buildActivityMessage(type, input.activity, productLabel, input.urnNo);
    return {
        id: input.id,
        type: type,
        message: message,
        occurredAt: input.createdAt.toISOString(),
        relativeTimeLabel: formatRelativeTime(input.createdAt, input.now),
        metadata: {
            urnNo: input.urnNo,
            productName: (_b = input.productName) !== null && _b !== void 0 ? _b : null,
            activitiesId: input.activitiesId,
        },
    };
}
function inferActivityType(activity, activitiesId) {
    var text = activity.toLowerCase();
    if (text.includes('payment') ||
        text.includes('fee') ||
        activitiesId === 3 ||
        activitiesId === 9) {
        return 'payment';
    }
    if (text.includes('renew') ||
        text.includes('expir') ||
        text.includes('due')) {
        return 'alert';
    }
    if (text.includes('reject') ||
        text.includes('re-upload') ||
        text.includes('document') ||
        text.includes('required')) {
        return 'requirement';
    }
    if (text.includes('approve') ||
        activitiesId === 1 ||
        activitiesId === 11) {
        return 'productApproval';
    }
    return 'submission';
}
function buildActivityMessage(type, activity, productName, urnNo) {
    var trimmed = activity.trim();
    if (type === 'productApproval') {
        return "Product '".concat(productName, "' approved");
    }
    if (type === 'payment') {
        if (trimmed.toLowerCase().includes('payment'))
            return trimmed;
        return "Payment update recorded for ".concat(urnNo);
    }
    if (type === 'requirement') {
        if (trimmed)
            return trimmed;
        return "Document re-upload required for ".concat(urnNo);
    }
    if (type === 'alert') {
        if (trimmed)
            return trimmed;
        return "Certification renewal due";
    }
    if (trimmed.toLowerCase().includes('registration')) {
        return "".concat(trimmed, " for ").concat(productName);
    }
    if (trimmed)
        return trimmed;
    return "EOI submitted for review";
}
