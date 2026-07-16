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
exports.mapPaymentListSortField = mapPaymentListSortField;
exports.parsePaymentListSort = parsePaymentListSort;
exports.buildPaymentListMongoSort = buildPaymentListMongoSort;
var DEFAULT = {
    sortBy: 'createdDate',
    sortOrder: 'desc',
};
/** API / client field names → `payment_details` document paths */
var SORT_FIELD_MAP = {
    createdAt: 'createdDate',
    createdDate: 'createdDate',
    updatedAt: 'updatedDate',
    updatedDate: 'updatedDate',
    paymentId: 'paymentId',
    quoteTotal: 'quoteTotal',
    urnNo: 'urnNo',
    paymentReferenceNo: 'paymentReferenceNo',
    paymentStatus: 'paymentStatus',
    paymentType: 'paymentType',
};
function mapPaymentListSortField(field) {
    var _a;
    var key = field.trim();
    return (_a = SORT_FIELD_MAP[key]) !== null && _a !== void 0 ? _a : key;
}
/**
 * Accepts `asc` | `desc`, or `field:asc` | `field:desc` (e.g. `createdAt:desc`).
 */
function parsePaymentListSort(raw) {
    if (raw === undefined || raw === null || raw === '') {
        return __assign({}, DEFAULT);
    }
    var s = String(raw).trim();
    if (!s)
        return __assign({}, DEFAULT);
    var lower = s.toLowerCase();
    if (lower === 'asc' || lower === 'desc') {
        return { sortBy: DEFAULT.sortBy, sortOrder: lower };
    }
    var colonIdx = s.indexOf(':');
    if (colonIdx > 0) {
        var field = s.slice(0, colonIdx).trim();
        var order = s.slice(colonIdx + 1).trim().toLowerCase();
        if (order === 'asc' || order === 'desc') {
            return {
                sortBy: mapPaymentListSortField(field),
                sortOrder: order,
            };
        }
    }
    return __assign({}, DEFAULT);
}
function buildPaymentListMongoSort(parsed) {
    var _a;
    var dir = parsed.sortOrder === 'asc' ? 1 : -1;
    var sort = (_a = {}, _a[parsed.sortBy] = dir, _a);
    if (parsed.sortBy !== 'paymentId') {
        sort.paymentId = dir;
    }
    return sort;
}
