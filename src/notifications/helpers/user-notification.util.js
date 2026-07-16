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
exports.unreadSeenFilter = unreadSeenFilter;
exports.readSeenFilter = readSeenFilter;
exports.isNotificationSeen = isNotificationSeen;
exports.normalizeSeenToNumber = normalizeSeenToNumber;
exports.buildVendorNotificationRangeWhere = buildVendorNotificationRangeWhere;
exports.buildVendorNotificationWhere = buildVendorNotificationWhere;
exports.buildVendorNotificationUnreadCountWhere = buildVendorNotificationUnreadCountWhere;
exports.mapVendorNotificationRow = mapVendorNotificationRow;
/** Mongo filter: unread (`seen` is 0, false, or missing). */
function unreadSeenFilter() {
    return {
        $or: [{ seen: 0 }, { seen: false }, { seen: { $exists: false } }],
    };
}
/** Mongo filter: read (`seen` is 1 or true). */
function readSeenFilter() {
    return { $or: [{ seen: 1 }, { seen: true }] };
}
function isNotificationSeen(value) {
    return value === 1 || value === true;
}
/** API/storage convention: `0` = unseen, `1` = seen. */
function normalizeSeenToNumber(value) {
    return isNotificationSeen(value) ? 1 : 0;
}
function buildVendorNotificationRangeWhere(query) {
    var now = new Date();
    var where = {};
    switch (query === null || query === void 0 ? void 0 : query.range) {
        case 'today': {
            var start = new Date(now);
            start.setHours(0, 0, 0, 0);
            where.created_at = { $gte: start };
            break;
        }
        case 'week': {
            var start = new Date(now);
            start.setDate(now.getDate() - 7);
            where.created_at = { $gte: start };
            break;
        }
        case '30d': {
            var start = new Date(now);
            start.setDate(now.getDate() - 30);
            where.created_at = { $gte: start };
            break;
        }
        case '90d': {
            var start = new Date(now);
            start.setDate(now.getDate() - 90);
            where.created_at = { $gte: start };
            break;
        }
        default:
            break;
    }
    return where;
}
function buildVendorNotificationWhere(query) {
    var where = buildVendorNotificationRangeWhere(query);
    if (query.seen === true) {
        Object.assign(where, readSeenFilter());
    }
    else if (query.seen === false) {
        Object.assign(where, unreadSeenFilter());
    }
    return where;
}
function buildVendorNotificationUnreadCountWhere(query) {
    return __assign(__assign({}, buildVendorNotificationRangeWhere(query)), unreadSeenFilter());
}
function mapVendorNotificationRow(n) {
    var _a, _b, _c, _d, _e, _f, _g;
    var notifyType = String((_a = n.notify_type) !== null && _a !== void 0 ? _a : '').trim();
    return {
        _id: String(n._id),
        id: String(n._id),
        numericId: typeof n.id === 'number' ? n.id : Number(n.id) || null,
        title: String((_b = n.title) !== null && _b !== void 0 ? _b : ''),
        message: String((_d = (_c = n.content) !== null && _c !== void 0 ? _c : n.message) !== null && _d !== void 0 ? _d : ''),
        type: String((_e = n.type) !== null && _e !== void 0 ? _e : 'info'),
        notify_type: notifyType || null,
        source: 'system',
        name: 'GreenPro',
        role: 'System',
        actorName: 'GreenPro',
        seen: normalizeSeenToNumber(n.seen),
        seenAt: null,
        createdAt: (_g = (_f = n.created_at) !== null && _f !== void 0 ? _f : n.createdAt) !== null && _g !== void 0 ? _g : null,
    };
}
