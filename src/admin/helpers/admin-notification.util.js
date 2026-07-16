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
exports.buildAdminNotificationRangeWhere = buildAdminNotificationRangeWhere;
exports.buildAdminNotificationWhere = buildAdminNotificationWhere;
exports.buildAdminNotificationUnreadCountWhere = buildAdminNotificationUnreadCountWhere;
exports.mapAdminNotificationRow = mapAdminNotificationRow;
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
function buildAdminNotificationRangeWhere(query) {
    var now = new Date();
    var where = {};
    switch (query === null || query === void 0 ? void 0 : query.range) {
        case 'today': {
            var start = new Date(now);
            start.setHours(0, 0, 0, 0);
            where.createdAt = { $gte: start };
            break;
        }
        case 'week': {
            var start = new Date(now);
            start.setDate(now.getDate() - 7);
            where.createdAt = { $gte: start };
            break;
        }
        case '30d': {
            var start = new Date(now);
            start.setDate(now.getDate() - 30);
            where.createdAt = { $gte: start };
            break;
        }
        case '90d': {
            var start = new Date(now);
            start.setDate(now.getDate() - 90);
            where.createdAt = { $gte: start };
            break;
        }
        default:
            break;
    }
    return where;
}
/** Range window + optional `seen` list filter (for paginated rows). */
function buildAdminNotificationWhere(query) {
    var where = buildAdminNotificationRangeWhere(query);
    if (query.seen === true) {
        Object.assign(where, readSeenFilter());
    }
    else if (query.seen === false) {
        Object.assign(where, unreadSeenFilter());
    }
    return where;
}
/** Unread count for bell badge: same `range`, ignores `seen` query param. */
function buildAdminNotificationUnreadCountWhere(query) {
    return __assign(__assign({}, buildAdminNotificationRangeWhere(query)), unreadSeenFilter());
}
function mapAdminNotificationRow(n) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var actorName = String((_a = n.actorName) !== null && _a !== void 0 ? _a : '').trim();
    var source = String((_b = n.source) !== null && _b !== void 0 ? _b : 'system').trim();
    return {
        _id: String(n._id),
        id: String(n._id),
        title: String((_c = n.title) !== null && _c !== void 0 ? _c : ''),
        message: String((_d = n.message) !== null && _d !== void 0 ? _d : ''),
        type: String((_e = n.type) !== null && _e !== void 0 ? _e : 'info'),
        source: source,
        referenceType: (_f = n.referenceType) !== null && _f !== void 0 ? _f : null,
        referenceId: (_g = n.referenceId) !== null && _g !== void 0 ? _g : null,
        actorName: actorName || null,
        name: actorName || 'System',
        role: source === 'manufacturer' ? 'Manufacturer' : 'Admin',
        seen: normalizeSeenToNumber(n.seen),
        seenAt: (_h = n.seenAt) !== null && _h !== void 0 ? _h : null,
        createdAt: (_j = n.createdAt) !== null && _j !== void 0 ? _j : null,
    };
}
