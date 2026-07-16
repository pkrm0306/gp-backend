/**
 * Response-only helpers for process Supporting Document audit modules.
 * Storage remains unchanged — projection / allowlisting happens on read.
 *
 * File projection is centralized in audit-file-presentation.util;
 * this module keeps supporting-doc route detection, allowlists, and Yes/No flags.
 */

import { normalizeAuditFieldKey } from './audit-ignore-fields';
import {
  AUDIT_UPLOAD_FIELD_LABELS,
  SUPPORTING_DOCUMENT_ROUTE_PATTERN,
  labelAuditUploadField,
  projectAuditFileUploads,
  withAuditFileDisplay,
  type AuditFileDisplay,
} from './audit-file-presentation.util';

export type SupportingDocumentAuditContext = {
  action?: string | null;
  module?: string | null;
  description?: string | null;
  route?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type SupportingDocumentUploadDisplay = AuditFileDisplay;

export {
  SUPPORTING_DOCUMENT_ROUTE_PATTERN,
  AUDIT_UPLOAD_FIELD_LABELS as SUPPORTING_DOCUMENT_UPLOAD_FIELD_LABELS,
};

function normalizeKey(key: string): string {
  return normalizeAuditFieldKey(key).replace(/[-_\s]/g, '');
}

/**
 * Explicit business text / numeric fields shared across supporting-doc modules.
 * Upload display names (`*FileName`) and attachment flags are matched by pattern.
 */
const SUPPORTING_DOCUMENT_TEXT_ALLOWLIST = new Set([
  'urnno',
  'portablewaterdemand',
  'rainwaterharvesting',
  'beyondthefenceinitiatives',
  'totalenergyconsumption',
  'wmimplementationdetails',
  'lifecycleimplementationdetails',
  'innovationimplementationdetails',
  'programmedetails',
  'qualitymanagementdetails',
  'eprimplementeddetails',
  'eprgreenpackagingdetails',
  'documenttag',
  'uploadeddocuments',
  'filename',
  'sectionkey',
  'documentstatus',
]);

export function isSupportingDocumentAudit(
  ctx?: SupportingDocumentAuditContext | null,
): boolean {
  if (!ctx) {
    return false;
  }
  const route = String(ctx.route ?? '');
  if (SUPPORTING_DOCUMENT_ROUTE_PATTERN.test(route)) {
    return true;
  }
  const module = String(ctx.module ?? '').trim().toLowerCase();
  if (module === 'process') {
    const bodyFields = ctx.metadata?.['body_fields'];
    if (Array.isArray(bodyFields) && bodyFields.some(isSupportingDocumentBodyField)) {
      return true;
    }
    if (Array.isArray(ctx.metadata?.['file_uploads'])) {
      return true;
    }
  }
  return false;
}

function isSupportingDocumentBodyField(field: unknown): boolean {
  if (typeof field !== 'string') {
    return false;
  }
  const normalized = normalizeKey(field);
  if (normalized.endsWith('filename')) {
    return true;
  }
  return SUPPORTING_DOCUMENT_TEXT_ALLOWLIST.has(normalized);
}

/**
 * Attachment availability flags (0 = no file, 1 = file available), not status workflow.
 */
export function isSupportingDocumentAttachmentFlagKey(key: string): boolean {
  const normalized = normalizeKey(key);
  if (!normalized || normalized.endsWith('status')) {
    return false;
  }
  if (normalized.endsWith('filename') || normalized.endsWith('file')) {
    return false;
  }
  return (
    normalized.endsWith('supportingdocuments') ||
    normalized.endsWith('supportingdocument') ||
    normalized === 'energyconsumptiondocuments' ||
    normalized === 'lifecycleassesmentreports' ||
    normalized === 'lifecycleassessmentreports' ||
    normalized === 'lifecycleimplementationdocuments' ||
    normalized === 'innovationimplementationdocuments'
  );
}

export function resolveSupportingDocumentAttachmentLabel(
  value: unknown,
): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  const numeric =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : NaN;
  if (numeric === 0) {
    return 'No';
  }
  if (numeric === 1) {
    return 'Yes';
  }
  return undefined;
}

export function isAllowedSupportingDocumentField(key: string): boolean {
  const normalized = normalizeKey(key);
  if (!normalized) {
    return false;
  }
  if (SUPPORTING_DOCUMENT_TEXT_ALLOWLIST.has(normalized)) {
    return true;
  }
  if (normalized.endsWith('filename')) {
    return true;
  }
  if (isSupportingDocumentAttachmentFlagKey(key)) {
    return true;
  }
  return false;
}

export function labelSupportingDocumentUploadField(field: string): string {
  return labelAuditUploadField(field);
}

export function projectSupportingDocumentUploads(
  metadata: Record<string, unknown> | null | undefined,
): SupportingDocumentUploadDisplay[] | undefined {
  return projectAuditFileUploads(metadata);
}

/**
 * Merge projected uploads into a snapshot for API rendering (never mutates storage).
 */
export function withSupportingDocumentUploadDisplay(
  values: Record<string, unknown> | undefined,
  metadata: Record<string, unknown> | null | undefined,
): Record<string, unknown> | undefined {
  return withAuditFileDisplay(values, metadata);
}
