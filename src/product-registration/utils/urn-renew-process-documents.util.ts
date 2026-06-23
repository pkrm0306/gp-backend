import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';

const PROCESS_DOCUMENT_BUCKETS = [
  'process_manufacturing_documents',
  'process_waste_management_documents',
  'process_innovation_documents',
  'all_renew_product_documents',
  'all_urn_product_documents',
  'documents',
] as const;

const MANUFACTURING_DOC_SUBSECTIONS = new Set([
  'energy_conservation_supporting_documents',
  'energy_consumption_documents',
]);

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (value == null || value === '') continue;
    return String(value).trim();
  }
  return '';
}

function processDocKey(doc: Record<string, unknown>): string {
  return String(
    doc.productDocumentId ??
      doc.product_document_id ??
      doc._id ??
      `${doc.documentLink ?? doc.document_link ?? ''}|${doc.documentOriginalName ?? doc.document_original_name ?? ''}`,
  );
}

function isDeletedDoc(doc: Record<string, unknown>): boolean {
  return doc.isDeleted === true || doc.is_deleted === true;
}

export function isUrnManufacturingProcessDocument(
  doc: Record<string, unknown> | null | undefined,
): boolean {
  if (!doc || isDeletedDoc(doc)) return false;
  const form = pickString(doc.documentForm, doc.document_form).toLowerCase();
  const sub = pickString(
    doc.documentFormSubsection,
    doc.document_form_subsection,
  ).toLowerCase();
  if (form && form !== DocumentSectionKey.PROCESS_MANUFACTURING) return false;
  if (MANUFACTURING_DOC_SUBSECTIONS.has(sub)) return true;
  if (form === DocumentSectionKey.PROCESS_MANUFACTURING && !sub) return true;
  return false;
}

export function isUrnWasteManagementProcessDocument(
  doc: Record<string, unknown> | null | undefined,
): boolean {
  if (!doc || isDeletedDoc(doc)) return false;
  const form = pickString(doc.documentForm, doc.document_form).toLowerCase();
  const sub = pickString(
    doc.documentFormSubsection,
    doc.document_form_subsection,
  ).toLowerCase();

  if (form && form !== DocumentSectionKey.PROCESS_WASTE_MANAGEMENT) return false;
  if (sub === 'wm_supporting_documents' || sub === 'wm_supporting_document') {
    return true;
  }
  if (form === DocumentSectionKey.PROCESS_WASTE_MANAGEMENT) {
    if (!sub) return true;
    if (sub === 'supporting_documents') return true;
  }
  if (
    !form &&
    (sub === 'wm_supporting_documents' || sub === 'wm_supporting_document')
  ) {
    return true;
  }
  return false;
}

export function isUrnInnovationProcessDocument(
  doc: Record<string, unknown> | null | undefined,
): boolean {
  if (!doc || isDeletedDoc(doc)) return false;
  const form = pickString(doc.documentForm, doc.document_form).toLowerCase();
  const sub = pickString(
    doc.documentFormSubsection,
    doc.document_form_subsection,
  ).toLowerCase();

  if (
    form &&
    form !== DocumentSectionKey.PROCESS_INNOVATION &&
    !form.includes('innovation')
  ) {
    return false;
  }
  if (
    sub === 'innovation_implementation_documents' ||
    sub.includes('innovation')
  ) {
    return true;
  }
  if (
    form === DocumentSectionKey.PROCESS_INNOVATION ||
    form.includes('innovation')
  ) {
    return true;
  }
  return false;
}

function collectSectionDocuments(
  sources: Array<Record<string, unknown>>,
  rowDocKey: string,
  matches: (doc: Record<string, unknown>) => boolean,
): Array<Record<string, unknown>> {
  const seen = new Set<string>();
  const out: Array<Record<string, unknown>> = [];

  const push = (raw: unknown) => {
    if (!raw || typeof raw !== 'object') return;
    const doc = raw as Record<string, unknown>;
    if (!matches(doc)) return;
    const key = processDocKey(doc);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(doc);
  };

  for (const source of sources) {
    if (Array.isArray(source[rowDocKey])) {
      for (const doc of source[rowDocKey]) push(doc);
    }
    for (const key of PROCESS_DOCUMENT_BUCKETS) {
      if (!Array.isArray(source[key])) continue;
      for (const doc of source[key]) push(doc);
    }
  }

  return out;
}

export function collectUrnScopedManufacturingProcessDocuments(
  product: Record<string, unknown>,
): Array<Record<string, unknown>> {
  return collectSectionDocuments(
    [product],
    'process_manufacturing_documents',
    isUrnManufacturingProcessDocument,
  );
}

export function collectUrnScopedWasteManagementProcessDocuments(
  product: Record<string, unknown>,
): Array<Record<string, unknown>> {
  return collectSectionDocuments(
    [product],
    'process_waste_management_documents',
    isUrnWasteManagementProcessDocument,
  );
}

export function collectUrnScopedInnovationProcessDocuments(
  product: Record<string, unknown>,
): Array<Record<string, unknown>> {
  return collectSectionDocuments(
    [product],
    'process_innovation_documents',
    isUrnInnovationProcessDocument,
  );
}

function collectFromSources(
  sources: Array<Record<string, unknown>>,
  rowDocKey: string,
  matches: (doc: Record<string, unknown>) => boolean,
): Array<Record<string, unknown>> {
  return collectSectionDocuments(sources, rowDocKey, matches);
}

export function formatUrnProcessDocumentForResponse(
  doc: Record<string, unknown>,
): Record<string, unknown> {
  return {
    _id: doc._id,
    productDocumentId: doc.productDocumentId,
    vendorId: doc.vendorId,
    urnNo: doc.urnNo,
    eoiNo: doc.eoiNo,
    documentForm: doc.documentForm,
    documentFormSubsection: doc.documentFormSubsection,
    formPrimaryId: doc.formPrimaryId,
    documentName: doc.documentName,
    documentOriginalName: doc.documentOriginalName,
    documentLink: doc.documentLink,
    documentTag: doc.documentTag,
    createdDate: doc.createdDate,
    updatedDate: doc.updatedDate,
  };
}

function mergeSectionDocumentsOntoDetailRows(
  rows: Array<Record<string, unknown>>,
  renewPayload: Record<string, unknown>,
  rowDocKey: string,
  matches: (doc: Record<string, unknown>) => boolean,
): Array<Record<string, unknown>> {
  if (rows.length === 0) return rows;

  const mergedDocs = collectFromSources(
    [rows[0] as Record<string, unknown>, renewPayload],
    rowDocKey,
    matches,
  );
  if (mergedDocs.length === 0) return rows;

  const rootDocs = collectFromSources([rows[0] as Record<string, unknown>], rowDocKey, matches);
  const rootIds = new Set(rootDocs.map(processDocKey));
  const hasNewDocs = mergedDocs.some((doc) => !rootIds.has(processDocKey(doc)));
  if (!hasNewDocs && mergedDocs.length <= rootDocs.length) {
    return rows;
  }

  const formatted = mergedDocs.map(formatUrnProcessDocumentForResponse);
  return rows.map((row, index) =>
    index === 0 ? { ...row, [rowDocKey]: formatted } : row,
  );
}

export function mergeRenewManufacturingDocumentsOntoDetailRows(
  rows: Array<Record<string, unknown>>,
  renewPayload: Record<string, unknown>,
): Array<Record<string, unknown>> {
  return mergeSectionDocumentsOntoDetailRows(
    rows,
    renewPayload,
    'process_manufacturing_documents',
    isUrnManufacturingProcessDocument,
  );
}

export function mergeRenewWasteManagementDocumentsOntoDetailRows(
  rows: Array<Record<string, unknown>>,
  renewPayload: Record<string, unknown>,
): Array<Record<string, unknown>> {
  return mergeSectionDocumentsOntoDetailRows(
    rows,
    renewPayload,
    'process_waste_management_documents',
    isUrnWasteManagementProcessDocument,
  );
}

export function mergeRenewInnovationDocumentsOntoDetailRows(
  rows: Array<Record<string, unknown>>,
  renewPayload: Record<string, unknown>,
): Array<Record<string, unknown>> {
  return mergeSectionDocumentsOntoDetailRows(
    rows,
    renewPayload,
    'process_innovation_documents',
    isUrnInnovationProcessDocument,
  );
}

export function mergeAllRenewProcessDocumentsOntoDetailRows(
  rows: Array<Record<string, unknown>>,
  renewPayload: Record<string, unknown>,
): Array<Record<string, unknown>> {
  let resolved = rows;
  resolved = mergeRenewManufacturingDocumentsOntoDetailRows(resolved, renewPayload);
  resolved = mergeRenewWasteManagementDocumentsOntoDetailRows(resolved, renewPayload);
  resolved = mergeRenewInnovationDocumentsOntoDetailRows(resolved, renewPayload);
  return resolved;
}

function mergeProcessDocumentBuckets(
  ...sources: Array<Record<string, unknown>>
): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  const keys = new Set<string>([
    ...PROCESS_DOCUMENT_BUCKETS,
    'process_manufacturing_documents',
    'process_waste_management_documents',
    'process_innovation_documents',
  ]);

  for (const source of sources) {
    for (const key of keys) {
      if (!Array.isArray(source[key])) continue;
      const prev = Array.isArray(merged[key]) ? (merged[key] as unknown[]) : [];
      merged[key] = [...prev, ...(source[key] as unknown[])];
    }
  }

  return merged;
}

/** Union cert + renew buckets into section arrays on the primary URN detail row. */
export function finalizeUrnProcessDocumentFieldsOnDetailRows(
  rows: Array<Record<string, unknown>>,
  extraSources: Array<Record<string, unknown>> = [],
): Array<Record<string, unknown>> {
  if (rows.length === 0) return rows;

  const bucket = mergeProcessDocumentBuckets(
    rows[0] as Record<string, unknown>,
    ...extraSources,
  );

  return rows.map((row, index) =>
    index === 0
      ? {
          ...row,
          process_manufacturing_documents:
            collectUrnScopedManufacturingProcessDocuments(bucket).map(
              formatUrnProcessDocumentForResponse,
            ),
          process_waste_management_documents:
            collectUrnScopedWasteManagementProcessDocuments(bucket).map(
              formatUrnProcessDocumentForResponse,
            ),
          process_innovation_documents:
            collectUrnScopedInnovationProcessDocuments(bucket).map(
              formatUrnProcessDocumentForResponse,
            ),
        }
      : row,
  );
}
