import { normalizeAuditFieldKey } from './audit-ignore-fields';
import { isInternalApiEnvelopeField } from './audit-internal-api-fields';
import {
  isCertificationFeeAudit,
  isExpiredProductReactivateAudit,
  isFinalReviewSubmitAudit,
  isRenewalPaymentDecisionAudit,
  presentAuditMetadataFields,
  presentAuditSnapshotFields,
  type AuditResponseFieldContext,
} from './audit-presentation-policy';

/**
 * Response-only audit field policy.
 * Storage stays unchanged — these filters apply when shaping API payloads.
 *
 * Domain-specific allowlists and field order live in audit-presentation-policy.
 * This module keeps global denylists / envelope detection and the public filter
 * API used by the presenter.
 */

export type { AuditResponseFieldContext };

export {
  isCertificationFeeAudit,
  isExpiredProductReactivateAudit,
  isFinalReviewSubmitAudit,
  isRenewalPaymentDecisionAudit,
};

export {
  AUDIT_INTERNAL_API_ENVELOPE_KEYS,
  isInternalApiEnvelopeField,
} from './audit-internal-api-fields';

function normalizeSuppressedFieldKey(key: string): string {
  return normalizeAuditFieldKey(key).replace(/[-_\s]/g, '');
}

/**
 * Internal workflow completion flags for selected process tabs.
 * Omitted from audit log API responses only (stored audit rows are unchanged).
 */
const PROCESS_TAB_STATUS_KEY_PATTERN =
  /^process(wastemanagement|manufacturing|lifecycleapproach|innovation)status$/;

/**
 * Internal renewal workflow keys omitted from audit API responses.
 * Storage retains the original snapshots; filtering is response-only.
 * Applies globally so every Renewal document upload module is covered
 * even when a domain allowlist is not matched.
 */
export const RENEWAL_INTERNAL_WORKFLOW_FIELDS = [
  'renewalType',
  'productPerformanceStatus',
  'existingDocumentIds',
  'existing_document_ids',
] as const;

/**
 * Framework / diagnostics metadata omitted from all audit API responses.
 * Storage retains the full metadata blob for support / dedupe.
 */
const GLOBAL_METADATA_DENYLIST = new Set([
  'durationms',
  'bodyfields',
  'fileuploads',
  'consolidated',
  'auditsource',
  'relateddomainevents',
  'contentevent',
  'rowindex',
  'totalrows',
  'correlationid',
  'requestid',
  'sessionid',
  'httpmethod',
  'statuscode',
  'httpstatus',
  'httpstatuscode',
]);

/** Extra internal snapshot keys never intended for end users. */
const GLOBAL_RESPONSE_DENYLIST = new Set([
  'renewalcycleid',
  'paymentid',
  'vendorid',
  'manufacturerid',
  'userid',
  'sessionid',
  'auditeventid',
  'auditbatchid',
  'batchid',
  'uploadbatchid',
  'correlationid',
  'requestid',
  'durationms',
  'bodyfields',
  'fileuploads',
  'consolidated',
  'auditsource',
  'relateddomainevents',
  'businesseventtype',
  'renewalpaymentdecision',
  'contentevent',
  'rowindex',
  'totalrows',
  ...RENEWAL_INTERNAL_WORKFLOW_FIELDS.map((key) =>
    normalizeSuppressedFieldKey(key),
  ),
]);

export function isAuditResponseSuppressedFieldKey(key: string): boolean {
  const normalized = normalizeSuppressedFieldKey(key);
  if (GLOBAL_RESPONSE_DENYLIST.has(normalized)) {
    return true;
  }
  if (isInternalApiEnvelopeField(key)) {
    return true;
  }
  if (normalized === 'productstewardshipstatus') {
    return true;
  }
  if (PROCESS_TAB_STATUS_KEY_PATTERN.test(normalized)) {
    return true;
  }

  const labelMatch = normalized.match(
    /^(.+?)status(label|name|display|text)$/,
  );
  if (labelMatch?.[1]) {
    return isAuditResponseSuppressedFieldKey(`${labelMatch[1]}Status`);
  }

  return false;
}

function isSuppressedMetadataFieldKey(normalizedKey: string): boolean {
  if (GLOBAL_METADATA_DENYLIST.has(normalizedKey)) {
    return true;
  }
  return isInternalApiEnvelopeField(normalizedKey);
}

/**
 * Filter value snapshots for API rendering.
 * Applies presentation policy allowlist + stable field order when matched.
 */
export function filterAuditResponseFields(
  values: Record<string, unknown> | undefined,
  ctx?: AuditResponseFieldContext | null,
): Record<string, unknown> | undefined {
  return presentAuditSnapshotFields(
    values,
    ctx,
    isAuditResponseSuppressedFieldKey,
  );
}

export function filterAuditResponseChanges(
  changes: Record<string, unknown> | undefined,
  ctx?: AuditResponseFieldContext | null,
): Record<string, unknown> | undefined {
  return presentAuditSnapshotFields(
    changes,
    ctx,
    isAuditResponseSuppressedFieldKey,
  );
}

/**
 * Filter metadata for API rendering.
 * Policy-matched audits: allowlist only.
 * Other audits: strip framework / diagnostic / API-envelope denylist keys.
 */
export function filterAuditResponseMetadata(
  metadata: Record<string, unknown> | undefined | null,
  ctx?: AuditResponseFieldContext | null,
): Record<string, unknown> | undefined {
  return presentAuditMetadataFields(metadata, ctx, isSuppressedMetadataFieldKey);
}

/** @deprecated Prefer filterAuditResponseFields — kept for existing call sites. */
export function omitSuppressedAuditResponseFields(
  values: Record<string, unknown> | undefined,
  ctx?: AuditResponseFieldContext | null,
): Record<string, unknown> | undefined {
  return filterAuditResponseFields(values, ctx);
}

/** @deprecated Prefer filterAuditResponseChanges — kept for existing call sites. */
export function omitSuppressedAuditResponseChanges(
  changes: Record<string, unknown> | undefined,
  ctx?: AuditResponseFieldContext | null,
): Record<string, unknown> | undefined {
  return filterAuditResponseChanges(changes, ctx);
}
