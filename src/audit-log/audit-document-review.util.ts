/**
 * Centralized audit payload helpers for document approval / rejection workflows:
 * - Admin URN tab review (vendor-uploaded process / raw-material sections)
 * - Vendor proposal document approve / reject
 *
 * Write-time summaries use these builders; read-time allowlists clean API responses.
 * Storage rows are never rewritten.
 */

import { normalizeAuditFieldKey } from './audit-ignore-fields';
import {
  PROCESS_TAB_LABELS,
  RAW_MATERIAL_STEP_TITLES,
  RAW_MATERIALS_TAB_KEY,
  type ProcessTabReviewKey,
} from '../product-registration/constants/urn-tab-review.constants';
import {
  RENEW_PROCESS_TAB_LABELS,
  type RenewProcessTabReviewKey,
} from '../renew/constants/renew-urn-tab-review.constants';

export type DocumentReviewAuditContext = {
  action?: string | null;
  module?: string | null;
  description?: string | null;
  route?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type DocumentReviewDecision = 'approved' | 'rejected';

export const DOCUMENT_REVIEW_BUSINESS_EVENT = {
  URN_TAB_REVIEW: 'urn_tab_review_decision',
  VENDOR_PROPOSAL: 'vendor_proposal_review',
} as const;

const URN_TAB_REVIEW_VALUE_ALLOWLIST = new Set([
  'urnno',
  'tabkey',
  'stepid',
  'sectionlabel',
  'decision',
  'reviewstatus',
  'rejectionremarks',
  'workflow',
]);

const VENDOR_PROPOSAL_VALUE_ALLOWLIST = new Set([
  'urnno',
  'paymenttype',
  'vendorproposalapprovalstatus',
  'proposalrejectionremarks',
  'decision',
]);

const DOCUMENT_REVIEW_METADATA_ALLOWLIST = new Set(['errormessage']);

function normalizeKey(key: string): string {
  return normalizeAuditFieldKey(key).replace(/[-_\s]/g, '');
}

export function isUrnTabReviewAudit(
  ctx?: DocumentReviewAuditContext | null,
): boolean {
  if (!ctx) {
    return false;
  }
  if (ctx.metadata?.['business_event_type'] === DOCUMENT_REVIEW_BUSINESS_EVENT.URN_TAB_REVIEW) {
    return true;
  }
  const route = String(ctx.route ?? '').toLowerCase();
  if (route.includes('urn-tab-review')) {
    return true;
  }
  const description = String(ctx.description ?? '').trim().toLowerCase();
  return (
    /^.+\s+(approved|rejected)\.?$/.test(description) &&
    !description.includes('payment') &&
    !description.includes('proposal')
  );
}

export function isVendorProposalReviewAudit(
  ctx?: DocumentReviewAuditContext | null,
): boolean {
  if (!ctx) {
    return false;
  }
  if (
    ctx.metadata?.['business_event_type'] ===
    DOCUMENT_REVIEW_BUSINESS_EVENT.VENDOR_PROPOSAL
  ) {
    return true;
  }
  const route = String(ctx.route ?? '').toLowerCase();
  if (route.includes('vendor-proposal-approval')) {
    return true;
  }
  const description = String(ctx.description ?? '').trim().toLowerCase();
  return (
    description === 'proposal rejected by vendor' ||
    description === 'proposal approved by vendor'
  );
}

/** All document approve/reject workflows that share centralized filtering. */
export function isDocumentReviewAudit(
  ctx?: DocumentReviewAuditContext | null,
): boolean {
  return isUrnTabReviewAudit(ctx) || isVendorProposalReviewAudit(ctx);
}

export function isAllowedUrnTabReviewField(key: string): boolean {
  return URN_TAB_REVIEW_VALUE_ALLOWLIST.has(normalizeKey(key));
}

export function isAllowedVendorProposalReviewField(key: string): boolean {
  return VENDOR_PROPOSAL_VALUE_ALLOWLIST.has(normalizeKey(key));
}

export function isAllowedDocumentReviewField(
  key: string,
  ctx?: DocumentReviewAuditContext | null,
): boolean {
  if (isVendorProposalReviewAudit(ctx)) {
    return isAllowedVendorProposalReviewField(key);
  }
  return isAllowedUrnTabReviewField(key);
}

export function isAllowedDocumentReviewMetadataField(key: string): boolean {
  return DOCUMENT_REVIEW_METADATA_ALLOWLIST.has(normalizeKey(key));
}

export function resolveUrnTabReviewSectionLabel(
  tabKey: string,
  stepId?: number | null,
): string {
  const key = String(tabKey ?? '').trim();
  if (!key) {
    return 'Section';
  }
  if (key === RAW_MATERIALS_TAB_KEY) {
    if (typeof stepId === 'number' && RAW_MATERIAL_STEP_TITLES[stepId]) {
      return RAW_MATERIAL_STEP_TITLES[stepId];
    }
    return 'Raw Materials';
  }
  if (key in PROCESS_TAB_LABELS) {
    return PROCESS_TAB_LABELS[key as ProcessTabReviewKey];
  }
  if (key in RENEW_PROCESS_TAB_LABELS) {
    return RENEW_PROCESS_TAB_LABELS[key as RenewProcessTabReviewKey];
  }
  return key
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatUrnTabReviewAuditDescription(
  tabKey: string,
  decision: DocumentReviewDecision,
  stepId?: number | null,
): string {
  const section = resolveUrnTabReviewSectionLabel(tabKey, stepId);
  return decision === 'approved'
    ? `${section} approved`
    : `${section} rejected`;
}

export function buildUrnTabReviewAuditValues(input: {
  urnNo?: string;
  tabKey: string;
  stepId?: number | null;
  decision: DocumentReviewDecision;
  rejectionRemarks?: string;
  renewalCycleId?: string;
}): {
  old_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  sectionLabel: string;
  workflow: 'certification' | 'renewal';
} {
  const sectionLabel = resolveUrnTabReviewSectionLabel(
    input.tabKey,
    input.stepId,
  );
  const workflow = input.renewalCycleId ? 'renewal' : 'certification';
  const reviewStatus = input.decision === 'approved' ? 1 : 2;
  return {
    sectionLabel,
    workflow,
    old_values: {
      urnNo: input.urnNo,
      tabKey: input.tabKey,
      ...(input.stepId != null ? { stepId: input.stepId } : {}),
      sectionLabel,
      reviewStatus: 0,
      decision: 'pending',
      workflow,
    },
    new_values: {
      urnNo: input.urnNo,
      tabKey: input.tabKey,
      ...(input.stepId != null ? { stepId: input.stepId } : {}),
      sectionLabel,
      decision: input.decision,
      reviewStatus,
      workflow,
      ...(input.decision === 'rejected' && input.rejectionRemarks
        ? { rejectionRemarks: input.rejectionRemarks }
        : {}),
    },
  };
}
