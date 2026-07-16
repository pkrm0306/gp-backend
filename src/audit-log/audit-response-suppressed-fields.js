"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuditResponseSuppressedFieldKey = isAuditResponseSuppressedFieldKey;
exports.omitSuppressedAuditResponseFields = omitSuppressedAuditResponseFields;
exports.omitSuppressedAuditResponseChanges = omitSuppressedAuditResponseChanges;
var audit_ignore_fields_1 = require("./audit-ignore-fields");
function normalizeSuppressedFieldKey(key) {
    return (0, audit_ignore_fields_1.normalizeAuditFieldKey)(key).replace(/[-_\s]/g, '');
}
/**
 * Internal workflow completion flags for selected process tabs.
 * Omitted from audit log API responses only (stored audit rows are unchanged).
 */
var PROCESS_TAB_STATUS_KEY_PATTERN = /^process(wastemanagement|manufacturing|lifecycleapproach|innovation)status$/;
function isAuditResponseSuppressedFieldKey(key) {
    var normalized = normalizeSuppressedFieldKey(key);
    if (normalized === 'productstewardshipstatus') {
        return true;
    }
    if (PROCESS_TAB_STATUS_KEY_PATTERN.test(normalized)) {
        return true;
    }
    var labelMatch = normalized.match(/^(.+?)status(label|name|display|text)$/);
    if (labelMatch === null || labelMatch === void 0 ? void 0 : labelMatch[1]) {
        return isAuditResponseSuppressedFieldKey("".concat(labelMatch[1], "Status"));
    }
    return false;
}
function omitSuppressedAuditResponseFields(values) {
    if (!values || typeof values !== 'object' || Array.isArray(values)) {
        return values;
    }
    var out = {};
    for (var _i = 0, _a = Object.entries(values); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (isAuditResponseSuppressedFieldKey(key)) {
            continue;
        }
        out[key] = value;
    }
    return Object.keys(out).length ? out : undefined;
}
function omitSuppressedAuditResponseChanges(changes) {
    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
        return changes;
    }
    var out = {};
    for (var _i = 0, _a = Object.entries(changes); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (isAuditResponseSuppressedFieldKey(key)) {
            continue;
        }
        out[key] = value;
    }
    return Object.keys(out).length ? out : undefined;
}
