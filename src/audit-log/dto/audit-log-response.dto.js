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
exports.toAuditLogResponseDto = toAuditLogResponseDto;
exports.assertJsonSafe = assertJsonSafe;
var audit_friendlies_1 = require("../audit-friendlies");
var audit_response_suppressed_fields_1 = require("../audit-response-suppressed-fields");
function toAuditLogResponseDto(row) {
    var _a, _b, _c;
    var performedBy = objectOrNull(row['performed_by']);
    var actor = objectOrNull(row['actor']);
    var actionType = stringOrNull(row['action_type']);
    var module = stringOrNull(row['module']);
    var oldValues = (0, audit_response_suppressed_fields_1.omitSuppressedAuditResponseFields)((_a = objectOrNull(row['old_values'])) !== null && _a !== void 0 ? _a : undefined);
    var newValues = (0, audit_response_suppressed_fields_1.omitSuppressedAuditResponseFields)((_b = objectOrNull(row['new_values'])) !== null && _b !== void 0 ? _b : undefined);
    var changes = (0, audit_response_suppressed_fields_1.omitSuppressedAuditResponseChanges)((_c = objectOrNull(row['changes'])) !== null && _c !== void 0 ? _c : undefined);
    var dto = __assign(__assign({}, row), { id: idString(row['_id']), occurred_at: dateStringOrNull(row['occurred_at']), action: stringOrNull(row['action']), outcome: stringOrNull(row['outcome']), module: module, module_display: (0, audit_friendlies_1.auditModuleDisplayName)(module !== null && module !== void 0 ? module : undefined), action_type: actionType, action_display: actionType, entity_name: stringOrNull(row['entity_name']), description: stringOrNull(row['description']), performed_by: performedBy, old_values: oldValues !== null && oldValues !== void 0 ? oldValues : null, new_values: newValues !== null && newValues !== void 0 ? newValues : null, http_method: stringOrNull(row['http_method']), route: stringOrNull(row['route']), status_code: typeof row['status_code'] === 'number' ? row['status_code'] : null, actor: actor, resource: objectOrNull(row['resource']), request: objectOrNull(row['request']), changes: changes !== null && changes !== void 0 ? changes : null, metadata: objectOrNull(row['metadata']), user_display: userDisplay(performedBy, actor) });
    return assertJsonSafe(dto);
}
function assertJsonSafe(payload) {
    JSON.stringify(payload, jsonSafeReplacer());
    return payload;
}
function objectOrNull(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
    }
    return normalizeJsonValue(value);
}
function normalizeJsonValue(value) {
    if (value === undefined) {
        return null;
    }
    if (typeof value === 'bigint') {
        return value.toString();
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (!value || typeof value !== 'object') {
        return value;
    }
    if (typeof value.toHexString === 'function') {
        return String(value);
    }
    if (Array.isArray(value)) {
        return value.map(function (item) { return normalizeJsonValue(item); });
    }
    return Object.fromEntries(Object.entries(value).map(function (_a) {
        var key = _a[0], item = _a[1];
        return [
            key,
            normalizeJsonValue(item),
        ];
    }));
}
function jsonSafeReplacer() {
    var seen = new WeakSet();
    return function (_key, value) {
        if (typeof value === 'bigint') {
            return value.toString();
        }
        if (value && typeof value === 'object') {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value === undefined ? null : value;
    };
}
function idString(value) {
    if (value === undefined || value === null) {
        return null;
    }
    return String(value);
}
function dateStringOrNull(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'string' && value.trim()) {
        var parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
    }
    return null;
}
function stringOrNull(value) {
    if (value === undefined || value === null) {
        return null;
    }
    return String(value);
}
function userDisplay(performedBy, actor) {
    return (stringOrNull(performedBy === null || performedBy === void 0 ? void 0 : performedBy['name']) ||
        stringOrNull(performedBy === null || performedBy === void 0 ? void 0 : performedBy['email']) ||
        stringOrNull(performedBy === null || performedBy === void 0 ? void 0 : performedBy['user_id']) ||
        stringOrNull(actor === null || actor === void 0 ? void 0 : actor['user_id']));
}
