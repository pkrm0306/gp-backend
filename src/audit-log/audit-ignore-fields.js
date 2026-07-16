"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAuditFieldKey = normalizeAuditFieldKey;
exports.isAuditIgnoredField = isAuditIgnoredField;
var audit_privacy_1 = require("./audit-privacy");
var AUDIT_IGNORED_FIELD_KEYS = new Set([
    '_id',
    'id',
    '__v',
    'v',
    'version',
    'createdat',
    'createddate',
    'updatedat',
    'updateddate',
    'deletedat',
    'deleteddate',
    'createdby',
    'created_by',
    'updatedby',
    'updated_by',
    'deletedby',
    'deleted_by',
    'isdeleted',
    'is_deleted',
    'deleted',
    'formprimaryid',
    'productdocumentid',
    'documentid',
    'rawmaterialshazardousproductsid',
    'rawmaterialseliminationofformaldehydeid',
    'rawmaterialsreduceenvironmentalid',
    'rawmaterialsadditivesid',
    'rawmaterialsrecoveryid',
    'rawmaterialsregionalmaterialsid',
    'rawmaterialsoptimizationofrawmixid',
    'quotegstamount',
    'quotetdsamount',
    'quotetotal',
    'gstamount',
    'tdsamount',
    'totalamount',
    'grandtotal',
    'subtotal',
]);
var AUDIT_IGNORED_SUFFIXES = [
    'createdat',
    'createddate',
    'updatedat',
    'updateddate',
    'deletedat',
    'deleteddate',
    'calculatedtotal',
    'derivedtotal',
];
function normalizeAuditFieldKey(key) {
    return key
        .replace(/\[\]$/g, '')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toLowerCase();
}
function isAuditIgnoredField(key) {
    var normalized = normalizeAuditFieldKey(key);
    return (audit_privacy_1.AUDIT_SENSITIVE_BODY_KEYS.has(key) ||
        audit_privacy_1.AUDIT_SENSITIVE_BODY_KEYS.has(normalized) ||
        AUDIT_IGNORED_FIELD_KEYS.has(normalized) ||
        AUDIT_IGNORED_SUFFIXES.some(function (suffix) { return normalized.endsWith(suffix); }));
}
