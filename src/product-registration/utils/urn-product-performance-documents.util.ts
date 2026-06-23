import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';

const PERFORMANCE_DOCUMENT_BUCKETS = [
  'product_performance_documents',
  'all_renew_product_documents',
  'all_urn_product_documents',
] as const;

function performanceDocKey(doc: Record<string, unknown>): string {
  return String(
    doc.productDocumentId ??
      doc.product_document_id ??
      doc._id ??
      `${doc.documentLink ?? doc.document_link ?? ''}|${doc.documentOriginalName ?? doc.document_original_name ?? ''}`,
  );
}

export function isUrnProductPerformanceDocument(
  doc: Record<string, unknown> | null | undefined,
): boolean {
  if (!doc) return false;
  if (doc.isDeleted === true || doc.is_deleted === true) return false;
  const form = String(doc.documentForm ?? doc.document_form ?? '')
    .trim()
    .toLowerCase();
  const sub = String(doc.documentFormSubsection ?? doc.document_form_subsection ?? '')
    .trim()
    .toLowerCase();
  if (form && form !== DocumentSectionKey.PRODUCT_PERFORMANCE) return false;
  if (sub === 'test_report_files' || sub === 'product_performance') return true;
  if (!form && (sub === 'test_report_files' || sub === 'product_performance')) return true;
  if (form === DocumentSectionKey.PRODUCT_PERFORMANCE && !sub) return true;
  return false;
}

/** URN-scoped performance uploads from cert + renew document buckets. */
export function collectUrnScopedProductPerformanceDocuments(
  product: Record<string, unknown>,
): Array<Record<string, unknown>> {
  const seen = new Set<string>();
  const out: Array<Record<string, unknown>> = [];

  const push = (raw: unknown) => {
    if (!raw || typeof raw !== 'object') return;
    const doc = raw as Record<string, unknown>;
    if (!isUrnProductPerformanceDocument(doc)) return;
    const key = performanceDocKey(doc);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(doc);
  };

  for (const key of PERFORMANCE_DOCUMENT_BUCKETS) {
    const bucket = product[key];
    if (!Array.isArray(bucket)) continue;
    for (const doc of bucket) push(doc);
  }

  return out;
}

export function collectUrnScopedProductPerformanceDocumentsFromSources(
  sources: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  const seen = new Set<string>();
  const out: Array<Record<string, unknown>> = [];

  for (const source of sources) {
    for (const doc of collectUrnScopedProductPerformanceDocuments(source)) {
      const key = performanceDocKey(doc);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(doc);
    }
  }

  return out;
}

export function formatUrnProductPerformanceDocumentForResponse(
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
    createdDate: doc.createdDate,
    updatedDate: doc.updatedDate,
  };
}

export function mergeRenewProductPerformanceDocumentsOntoDetailRows(
  rows: Array<Record<string, unknown>>,
  renewPayload: Record<string, unknown>,
): Array<Record<string, unknown>> {
  if (rows.length === 0) return rows;

  const mergedDocs = collectUrnScopedProductPerformanceDocumentsFromSources([
    rows[0] as Record<string, unknown>,
    renewPayload,
  ]);
  if (mergedDocs.length === 0) return rows;

  const rootDocs = collectUrnScopedProductPerformanceDocuments(
    rows[0] as Record<string, unknown>,
  );
  const rootIds = new Set(rootDocs.map(performanceDocKey));
  const hasNewDocs = mergedDocs.some((doc) => !rootIds.has(performanceDocKey(doc)));
  if (!hasNewDocs && mergedDocs.length <= rootDocs.length) {
    return rows;
  }

  const formatted = mergedDocs.map(formatUrnProductPerformanceDocumentForResponse);
  return rows.map((row, index) =>
    index === 0 ? { ...row, product_performance_documents: formatted } : row,
  );
}
