/**
 * Centralized audit file presentation.
 *
 * Write-time stores raw multer metadata in `metadata.file_uploads`.
 * Read-time projects that (plus response document hints) into
 * `uploadedDocuments` and scrubs placeholder / internal file fields.
 * Storage rows are never rewritten.
 */

import { normalizeAuditFieldKey } from './audit-ignore-fields';

export const AUDIT_MISSING_FILE_LABEL = 'Unavailable';

export type AuditFileDisplayStatus = 'available' | 'missing' | 'deleted';

export type AuditFileDisplay = {
  documentType: string;
  fileName: string;
  mimeType?: string;
  sizeBytes?: number;
  status?: AuditFileDisplayStatus;
};

export type AuditFilePresentationContext = {
  action?: string | null;
  module?: string | null;
  description?: string | null;
  route?: string | null;
  metadata?: Record<string, unknown> | null;
};

function normalizeKey(key: string): string {
  return normalizeAuditFieldKey(key).replace(/[-_\s]/g, '');
}

/**
 * Multer / form field → user-facing document type.
 * Certification + renew process supporting docs and product performance.
 */
export const AUDIT_UPLOAD_FIELD_LABELS: Record<string, string> = {
  energyconservationsupportingdocumentsfile:
    'Energy conservation supporting documents',
  energyconservationsupportingdocuments:
    'Energy conservation supporting documents',
  energyconservationsupportingdocument:
    'Energy conservation supporting documents',
  energyconservationsupportingdocumentfile:
    'Energy conservation supporting documents',
  energy_conservation_supporting_documents:
    'Energy conservation supporting documents',
  energyconservationfile: 'Energy conservation supporting documents',
  energyconservationfiles: 'Energy conservation supporting documents',
  energyconsumptiondocumentsfile: 'Energy consumption documents',
  energyconsumptiondocuments: 'Energy consumption documents',
  energyconsumptiondocument: 'Energy consumption documents',
  energyconsumptiondocumentfile: 'Energy consumption documents',
  energy_consumption_documents: 'Energy consumption documents',
  energyconsumptionfile: 'Energy consumption documents',
  energyconsumptionfiles: 'Energy consumption documents',
  wmsupportingdocumentsfile: 'Waste management supporting documents',
  wmsupportingdocuments: 'Waste management supporting documents',
  lifecycleassesmentreportsfile: 'Life cycle assessment reports',
  lifecycleassessmentreportsfile: 'Life cycle assessment reports',
  lifecycleimplementationdocumentsfile: 'Life cycle implementation documents',
  seasupportingdocumentsfile: 'SEA supporting documents',
  qmsupportingdocumentsfile: 'Quality management supporting documents',
  eprsupportingdocumentsfile: 'EPR supporting documents',
  innovationimplementationdocumentsfile:
    'Innovation implementation documents',
  files: 'Product performance documents',
  file: 'Document',
  testreportfiles: 'Test report files',
  testreports: 'Test reports',
};

/** Internal / non-display file-related keys stripped from audit responses. */
const AUDIT_FILE_RESPONSE_DENYLIST = new Set([
  'existingdocumentids',
  'existing_document_ids',
  'documentids',
  'files',
  'file',
  'testreportfiles',
]);

/**
 * Routes that carry renewal document delete / product-performance file mutations.
 * Supporting-doc process tabs still use supporting_document policy.
 */
export const RENEWAL_DOCUMENT_ROUTE_PATTERN =
  /\/renew\/(?:documents(?:\/\d+)?\/?$|process-product-performance(?:\/|$))/i;

export const SUPPORTING_DOCUMENT_ROUTE_PATTERN =
  /\/(?:renew\/)?process-(?:manufacturing|waste-management|life-cycle-approach|product-stewardship|innovation|product-performance)(?:\/|$)/i;

export function isRenewalDocumentAudit(
  ctx?: AuditFilePresentationContext | null,
): boolean {
  if (!ctx) {
    return false;
  }
  const businessEvent = ctx.metadata?.['business_event_type'];
  if (
    businessEvent === 'renewal_document' ||
    businessEvent === 'renewal_process_document'
  ) {
    return true;
  }
  const route = String(ctx.route ?? '');
  if (RENEWAL_DOCUMENT_ROUTE_PATTERN.test(route)) {
    return true;
  }
  const description = String(ctx.description ?? '').trim().toLowerCase();
  return (
    description === 'renewal document deleted' ||
    description === 'renewal document uploaded' ||
    description === 'renewal document updated' ||
    description === 'renewal product performance saved'
  );
}

export function labelAuditUploadField(field: string): string {
  const normalized = normalizeKey(field);
  const mapped = AUDIT_UPLOAD_FIELD_LABELS[normalized];
  if (mapped) {
    return mapped;
  }
  const withoutFileSuffix = field
    .replace(/(File|Files|Document|Documents)$/g, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
  if (!withoutFileSuffix) {
    return 'Document';
  }
  return withoutFileSuffix.charAt(0).toUpperCase() + withoutFileSuffix.slice(1);
}

function readFileName(row: Record<string, unknown>): string {
  for (const key of [
    'original_name',
    'originalName',
    'originalname',
    'fileName',
    'filename',
    'file_name',
    'stored_name',
    'storedName',
    'documentOriginalName',
    'testReportFileName',
  ]) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function readDocumentType(
  row: Record<string, unknown>,
  fallbackField?: string,
): string {
  for (const key of ['documentType', 'document_type', 'documentTag', 'sectionKey']) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  if (fallbackField) {
    return labelAuditUploadField(fallbackField);
  }
  return 'Document';
}

function readMimeType(row: Record<string, unknown>): string | undefined {
  const mime = String(row['mimetype'] ?? row['mimeType'] ?? '').trim();
  return mime || undefined;
}

function readSizeBytes(row: Record<string, unknown>): number | undefined {
  const size = row['size'] ?? row['sizeBytes'];
  if (typeof size === 'number' && Number.isFinite(size)) {
    return size;
  }
  return undefined;
}

function toDisplayEntry(
  row: Record<string, unknown>,
  options?: {
    fallbackField?: string;
    status?: AuditFileDisplayStatus;
  },
): AuditFileDisplay | undefined {
  const fileName = readFileName(row);
  const field = String(row['field'] ?? options?.fallbackField ?? '').trim();
  const documentType = readDocumentType(row, field || undefined);
  const status =
    options?.status ??
    (typeof row['status'] === 'string'
      ? (row['status'] as AuditFileDisplayStatus)
      : undefined) ??
    (typeof row['documentStatus'] === 'string' &&
    String(row['documentStatus']).toLowerCase() === 'deleted'
      ? 'deleted'
      : undefined);

  if (!fileName && !field && status !== 'deleted' && status !== 'missing') {
    return undefined;
  }

  const entry: AuditFileDisplay = {
    documentType,
    fileName: fileName || AUDIT_MISSING_FILE_LABEL,
    status: status ?? (fileName ? 'available' : 'missing'),
  };
  const mimeType = readMimeType(row);
  if (mimeType) {
    entry.mimeType = mimeType;
  }
  const sizeBytes = readSizeBytes(row);
  if (sizeBytes !== undefined) {
    entry.sizeBytes = sizeBytes;
  }
  return entry;
}

/**
 * Map stored `metadata.file_uploads` into display rows.
 */
export function projectAuditFileUploads(
  metadata: Record<string, unknown> | null | undefined,
): AuditFileDisplay[] | undefined {
  const uploads = metadata?.['file_uploads'];
  if (!Array.isArray(uploads) || uploads.length === 0) {
    return undefined;
  }
  const projected: AuditFileDisplay[] = [];
  for (const item of uploads) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      continue;
    }
    const entry = toDisplayEntry(item as Record<string, unknown>);
    if (entry) {
      projected.push(entry);
    }
  }
  return projected.length ? projected : undefined;
}

/**
 * Extract file hints already present on value snapshots (test reports, deletes).
 */
export function projectAuditFilesFromValues(
  values: Record<string, unknown> | undefined,
): AuditFileDisplay[] {
  if (!values || typeof values !== 'object') {
    return [];
  }
  const out: AuditFileDisplay[] = [];

  const fileName = readFileName(values);
  if (fileName || values['documentStatus'] === 'deleted') {
    const fromRoot = toDisplayEntry(values, {
      status:
        String(values['documentStatus'] ?? '').toLowerCase() === 'deleted'
          ? 'deleted'
          : undefined,
    });
    if (fromRoot) {
      out.push(fromRoot);
    }
  }

  for (const key of ['uploadedDocuments', 'testReports', 'testReportFiles']) {
    const raw = values[key];
    if (!Array.isArray(raw)) {
      continue;
    }
    for (const item of raw) {
      if (typeof item === 'string' && item.trim()) {
        out.push({
          documentType: labelAuditUploadField(key),
          fileName: item.trim(),
          status: 'available',
        });
        continue;
      }
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        continue;
      }
      const entry = toDisplayEntry(item as Record<string, unknown>, {
        fallbackField: key,
      });
      if (entry) {
        out.push(entry);
      }
    }
  }

  return out;
}

function dedupeFileDisplays(entries: AuditFileDisplay[]): AuditFileDisplay[] {
  const seen = new Set<string>();
  const out: AuditFileDisplay[] = [];
  for (const entry of entries) {
    const key = `${normalizeKey(entry.documentType)}::${entry.fileName.toLowerCase()}::${entry.status ?? ''}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(entry);
  }
  return out;
}

/**
 * Drop empty FileName strings, null file placeholders, and ID retention lists.
 */
export function scrubAuditFilePlaceholderFields(
  values: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return values;
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    const normalized = normalizeKey(key);
    if (AUDIT_FILE_RESPONSE_DENYLIST.has(normalized)) {
      continue;
    }
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && !value.trim())
    ) {
      if (
        normalized.endsWith('filename') ||
        normalized.endsWith('file') ||
        normalized === 'files'
      ) {
        continue;
      }
    }
    out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Merge projected uploads into a snapshot and scrub non-display file noise.
 */
export function withAuditFileDisplay(
  values: Record<string, unknown> | undefined,
  metadata: Record<string, unknown> | null | undefined,
): Record<string, unknown> | undefined {
  const fromMeta = projectAuditFileUploads(metadata) ?? [];
  const fromValues = projectAuditFilesFromValues(values);
  const uploadedDocuments = dedupeFileDisplays([...fromMeta, ...fromValues]);

  const base = scrubAuditFilePlaceholderFields(values) ?? {};
  // Prefer projected list; drop raw test report arrays once projected.
  const {
    testReports: _testReports,
    testReportFiles: _testReportFiles,
    uploadedDocuments: _existingUploads,
    fileName: rootFileName,
    documentStatus,
    ...rest
  } = base as Record<string, unknown>;

  const next: Record<string, unknown> = { ...rest };
  if (
    typeof documentStatus === 'string' &&
    documentStatus.trim()
  ) {
    next.documentStatus = documentStatus;
  }
  // Keep a singular deleted/missing file name when no list was produced.
  if (uploadedDocuments.length) {
    next.uploadedDocuments = uploadedDocuments;
  } else if (typeof rootFileName === 'string' && rootFileName.trim()) {
    next.fileName = rootFileName.trim();
  }

  return Object.keys(next).length ? next : undefined;
}

export function hasAuditFilePayload(
  values: Record<string, unknown> | undefined,
  metadata: Record<string, unknown> | null | undefined,
): boolean {
  if (Array.isArray(metadata?.['file_uploads']) && metadata!['file_uploads'].length) {
    return true;
  }
  if (!values) {
    return false;
  }
  if (Array.isArray(values['uploadedDocuments']) && values['uploadedDocuments'].length) {
    return true;
  }
  if (typeof values['fileName'] === 'string' && values['fileName'].trim()) {
    return true;
  }
  if (Array.isArray(values['testReports']) && values['testReports'].length) {
    return true;
  }
  if (Array.isArray(values['testReportFiles']) && values['testReportFiles'].length) {
    return true;
  }
  return false;
}
