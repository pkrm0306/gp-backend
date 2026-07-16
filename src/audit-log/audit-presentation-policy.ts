/**
 * Reusable audit response presentation policies.
 *
 * Domain modules declare match + allowlist + optional field order.
 * Display transforms (enums, IDs, booleans, dates) stay in AuditValueTransformer;
 * this module only filters and orders response payloads (storage unchanged).
 */

import {
  isAllowedSupportingDocumentField,
  isSupportingDocumentAudit,
} from './audit-supporting-documents.util';
import {
  isAllowedDocumentReviewField,
  isDocumentReviewAudit,
} from './audit-document-review.util';
import { isRenewalDocumentAudit } from './audit-file-presentation.util';
import { normalizeAuditFieldKey } from './audit-ignore-fields';
import { AUDIT_ACTION } from './audit-actions';

/** Context available when shaping audit response field payloads. */
export type AuditResponseFieldContext = {
  action?: string | null;
  module?: string | null;
  description?: string | null;
  route?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type AuditPresentationPolicy = {
  id: string;
  match: (ctx: AuditResponseFieldContext) => boolean;
  /** Canonical camelCase keys — drives allowlist and preferred order. */
  valueKeys?: readonly string[];
  /** Pattern-based allow when fixed keys are insufficient. */
  isValueAllowed?: (key: string, ctx: AuditResponseFieldContext) => boolean;
  metadataKeys?: readonly string[];
  /** Stable response field order (missing keys skipped; extras appended). */
  fieldOrder?: readonly string[];
};

export function normalizePresentationFieldKey(key: string): string {
  return normalizeAuditFieldKey(key).replace(/[-_\s]/g, '');
}

export function isRenewalPaymentDecisionAudit(
  ctx?: AuditResponseFieldContext | null,
): boolean {
  if (!ctx) {
    return false;
  }
  const businessEvent = ctx.metadata?.['business_event_type'];
  if (businessEvent === 'renewal_payment_decision') {
    return true;
  }
  const description = String(ctx.description ?? '').trim().toLowerCase();
  return (
    description === 'renewal payment approved' ||
    description === 'renewal payment rejected'
  );
}

export function isExpiredProductReactivateAudit(
  ctx?: AuditResponseFieldContext | null,
): boolean {
  if (!ctx) {
    return false;
  }
  const action = String(ctx.action ?? '').trim();
  if (
    action === AUDIT_ACTION.EXPIRED_REACTIVATE_PRODUCT ||
    action === AUDIT_ACTION.EXPIRED_REACTIVATE_URN
  ) {
    return true;
  }
  const route = String(ctx.route ?? '').toLowerCase();
  if (route.includes('/expired-reactivate/')) {
    return true;
  }
  const description = String(ctx.description ?? '').trim().toLowerCase();
  return (
    description.includes('reactivated expired product') ||
    description.includes('expired products on urn reactivated') ||
    description.includes('expired product reactivated to certified') ||
    description.includes('expired product on urn reactivated to certified') ||
    description === 'all expired products on urn reactivated to certified'
  );
}

export function isCertificationFeeAudit(
  ctx?: AuditResponseFieldContext | null,
): boolean {
  if (!ctx) {
    return false;
  }
  const businessEvent = ctx.metadata?.['business_event_type'];
  if (businessEvent === 'certification_fee') {
    return true;
  }
  const description = String(ctx.description ?? '').trim().toLowerCase();
  return (
    description === 'certification fee assigned' ||
    description ===
      'certification fee assigned with partial product rejection' ||
    description === 'certification fee payment submitted' ||
    description === 'certification fee payment approved' ||
    description === 'certification fee payment rejected'
  );
}

export function isFinalReviewSubmitAudit(
  ctx?: AuditResponseFieldContext | null,
): boolean {
  if (!ctx) {
    return false;
  }
  const businessEvent = ctx.metadata?.['business_event_type'];
  if (businessEvent === 'final_review_submit') {
    return true;
  }
  const description = String(ctx.description ?? '').trim().toLowerCase();
  return description === 'submitted for final review';
}

/** Renewal payment approve / reject — canonical business fields + order. */
export const RENEWAL_PAYMENT_FIELD_ORDER = [
  'urnNo',
  'paymentType',
  'paymentStatus',
  'paymentRejectionRemarks',
  'adminPaymentRejectionRemarks',
  'urnStatus',
] as const;

export const EXPIRED_TO_CERTIFIED_FIELD_ORDER = [
  'urnNo',
  'eoiNo',
  'fromStatus',
  'productStatus',
  'toStatus',
  'validtillDate',
] as const;

export const FINAL_REVIEW_SUBMIT_FIELD_ORDER = [
  'urnNo',
  'workflow',
  'previousUrnStatus',
  'urnStatus',
  'productRenewStatus',
  'renewedDate',
  'validtillDate',
] as const;

export const CERTIFICATION_FEE_FIELD_ORDER = [
  'urnNo',
  'paymentType',
  'paymentStatus',
  'productsToBeCertified',
  'selectedProductIds',
  'rejectedProductIds',
  'rejectedProductStatus',
  'rejectionReason',
  'certifiedProductStatus',
  'paymentRejectionRemarks',
  'adminPaymentRejectionRemarks',
  'fromStatus',
  'toStatus',
  'productStatus',
  'urnStatus',
] as const;

export const DOCUMENT_REVIEW_FIELD_ORDER = [
  'urnNo',
  'workflow',
  'sectionLabel',
  'tabKey',
  'stepId',
  'decision',
  'reviewStatus',
  'rejectionRemarks',
  'paymentType',
  'vendorProposalApprovalStatus',
  'proposalRejectionRemarks',
] as const;

export const SUPPORTING_DOCUMENT_FIELD_ORDER = [
  'urnNo',
  'portableWaterDemand',
  'rainWaterHarvesting',
  'beyondTheFenceInitiatives',
  'totalEnergyConsumption',
  'wmImplementationDetails',
  'lifeCycleImplementationDetails',
  'innovationImplementationDetails',
  'programmeDetails',
  'qualityManagementDetails',
  'eprImplementedDetails',
  'eprGreenPackagingDetails',
  'documentTag',
  'sectionKey',
  'fileName',
  'uploadedDocuments',
] as const;

export const RENEWAL_DOCUMENT_FIELD_ORDER = [
  'urnNo',
  'sectionKey',
  'documentTag',
  'fileName',
  'documentStatus',
  'uploadedDocuments',
] as const;

/**
 * First-match policy registry. Renewal is first so renew journeys stay consistent.
 */
export const AUDIT_PRESENTATION_POLICIES: readonly AuditPresentationPolicy[] = [
  {
    id: 'renewal_payment',
    match: (ctx) => isRenewalPaymentDecisionAudit(ctx),
    valueKeys: RENEWAL_PAYMENT_FIELD_ORDER,
    metadataKeys: ['error_message'],
    fieldOrder: RENEWAL_PAYMENT_FIELD_ORDER,
  },
  {
    id: 'final_review_submit',
    match: (ctx) => isFinalReviewSubmitAudit(ctx),
    valueKeys: FINAL_REVIEW_SUBMIT_FIELD_ORDER,
    metadataKeys: ['error_message'],
    fieldOrder: FINAL_REVIEW_SUBMIT_FIELD_ORDER,
  },
  {
    id: 'expired_to_certified',
    match: (ctx) => isExpiredProductReactivateAudit(ctx),
    valueKeys: EXPIRED_TO_CERTIFIED_FIELD_ORDER,
    metadataKeys: ['error_message'],
    fieldOrder: EXPIRED_TO_CERTIFIED_FIELD_ORDER,
  },
  {
    id: 'certification_fee',
    match: (ctx) => isCertificationFeeAudit(ctx),
    valueKeys: CERTIFICATION_FEE_FIELD_ORDER,
    metadataKeys: ['error_message'],
    fieldOrder: CERTIFICATION_FEE_FIELD_ORDER,
  },
  {
    id: 'document_review',
    match: (ctx) => isDocumentReviewAudit(ctx),
    isValueAllowed: (key, ctx) => isAllowedDocumentReviewField(key, ctx),
    metadataKeys: ['error_message'],
    fieldOrder: DOCUMENT_REVIEW_FIELD_ORDER,
  },
  {
    id: 'renewal_document',
    match: (ctx) => isRenewalDocumentAudit(ctx),
    valueKeys: RENEWAL_DOCUMENT_FIELD_ORDER,
    metadataKeys: ['error_message'],
    fieldOrder: RENEWAL_DOCUMENT_FIELD_ORDER,
  },
  {
    id: 'supporting_document',
    match: (ctx) => isSupportingDocumentAudit(ctx),
    isValueAllowed: (key) => isAllowedSupportingDocumentField(key),
    metadataKeys: ['error_message'],
    fieldOrder: SUPPORTING_DOCUMENT_FIELD_ORDER,
  },
];

export function resolveAuditPresentationPolicy(
  ctx?: AuditResponseFieldContext | null,
): AuditPresentationPolicy | undefined {
  if (!ctx) {
    return undefined;
  }
  return AUDIT_PRESENTATION_POLICIES.find((policy) => policy.match(ctx));
}

function keySet(keys: readonly string[] | undefined): Set<string> {
  return new Set((keys ?? []).map(normalizePresentationFieldKey));
}

export function isPolicyValueAllowed(
  policy: AuditPresentationPolicy,
  key: string,
  ctx: AuditResponseFieldContext,
): boolean {
  if (policy.isValueAllowed) {
    return policy.isValueAllowed(key, ctx);
  }
  if (!policy.valueKeys?.length) {
    return true;
  }
  return keySet(policy.valueKeys).has(normalizePresentationFieldKey(key));
}

export function isPolicyMetadataAllowed(
  policy: AuditPresentationPolicy,
  key: string,
): boolean {
  if (!policy.metadataKeys?.length) {
    return false;
  }
  return keySet(policy.metadataKeys).has(normalizePresentationFieldKey(key));
}

/**
 * Reorder snapshot keys: declared order first, then any remaining keys
 * in their previous relative order.
 */
export function orderAuditSnapshotFields(
  values: Record<string, unknown> | undefined,
  fieldOrder?: readonly string[] | null,
): Record<string, unknown> | undefined {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return values;
  }
  if (!fieldOrder?.length) {
    return values;
  }

  const entries = Object.entries(values);
  if (!entries.length) {
    return values;
  }

  const byNormalized = new Map<string, string>();
  for (const [key] of entries) {
    byNormalized.set(normalizePresentationFieldKey(key), key);
  }

  const out: Record<string, unknown> = {};
  const used = new Set<string>();

  for (const wanted of fieldOrder) {
    const actual = byNormalized.get(normalizePresentationFieldKey(wanted));
    if (!actual || used.has(actual)) {
      continue;
    }
    out[actual] = values[actual];
    used.add(actual);
  }

  for (const [key, value] of entries) {
    if (used.has(key)) {
      continue;
    }
    out[key] = value;
  }

  return out;
}

/** Apply an allowlist predicate while preserving source key casing. */
export function applyAuditValueAllowlist(
  values: Record<string, unknown>,
  isAllowed: (key: string) => boolean,
  isGloballySuppressed: (key: string) => boolean,
): Record<string, unknown> | undefined {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (isGloballySuppressed(key)) {
      continue;
    }
    if (!isAllowed(key)) {
      continue;
    }
    out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Filter + order a value/changes snapshot for one audit row.
 */
export function presentAuditSnapshotFields(
  values: Record<string, unknown> | undefined,
  ctx: AuditResponseFieldContext | null | undefined,
  isGloballySuppressed: (key: string) => boolean,
): Record<string, unknown> | undefined {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return values;
  }
  const policy = resolveAuditPresentationPolicy(ctx ?? undefined);
  if (policy) {
    const filtered = applyAuditValueAllowlist(
      values,
      (key) => isPolicyValueAllowed(policy, key, ctx ?? {}),
      isGloballySuppressed,
    );
    return orderAuditSnapshotFields(filtered, policy.fieldOrder);
  }

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (isGloballySuppressed(key)) {
      continue;
    }
    out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

export function presentAuditMetadataFields(
  metadata: Record<string, unknown> | undefined | null,
  ctx: AuditResponseFieldContext | null | undefined,
  isGloballyDenied: (normalizedKey: string) => boolean,
): Record<string, unknown> | undefined {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return metadata ?? undefined;
  }
  const effectiveCtx = ctx ?? { metadata };
  const policy = resolveAuditPresentationPolicy(effectiveCtx);
  if (policy) {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(metadata)) {
      if (!isPolicyMetadataAllowed(policy, key)) {
        continue;
      }
      if (value === undefined || value === null || value === '') {
        continue;
      }
      out[key] = value;
    }
    return Object.keys(out).length ? out : undefined;
  }

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    const normalized = normalizePresentationFieldKey(key);
    if (isGloballyDenied(normalized)) {
      continue;
    }
    if (value === undefined) {
      continue;
    }
    out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}
