import { AUDIT_SENSITIVE_BODY_KEYS } from './audit-privacy';

const AUDIT_IGNORED_FIELD_KEYS = new Set([
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

const AUDIT_IGNORED_SUFFIXES = [
  'createdat',
  'createddate',
  'updatedat',
  'updateddate',
  'deletedat',
  'deleteddate',
  'calculatedtotal',
  'derivedtotal',
];

export function normalizeAuditFieldKey(key: string): string {
  return key
    .replace(/\[\]$/g, '')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();
}

export function isAuditIgnoredField(key: string): boolean {
  const normalized = normalizeAuditFieldKey(key);
  return (
    AUDIT_SENSITIVE_BODY_KEYS.has(key) ||
    AUDIT_SENSITIVE_BODY_KEYS.has(normalized) ||
    AUDIT_IGNORED_FIELD_KEYS.has(normalized) ||
    AUDIT_IGNORED_SUFFIXES.some((suffix) => normalized.endsWith(suffix))
  );
}
