import { ClientSession, Model, Types } from 'mongoose';
import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';
import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';
import { matchActiveProducts } from '../../product-registration/constants/active-product.filter';
import { VENDOR_RESUBMIT_URN_STATUS } from '../../product-registration/constants/urn-tab-review.constants';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../../product-design/schemas/all-product-document.schema';
import { DocumentVersioningService } from '../document-versioning.service';
import type { DocumentVersionAction } from '../constants/document-version.constants';
import {
  slotKeyFromProductDocumentId,
  slotKeyFromSubsection,
  slotKeyFromSubsectionAndTag,
} from './document-version.helper';
import { RENEWAL_URN_STATUS } from '../../renew/constants/renewal-urn-status.constants';
import {
  ProductDocumentVersionRow,
  trackUploadedProductDocument,
} from './product-document-version.integration';

export type CertificationSlotKeyMode = 'subsection' | 'subsectionTag';

export async function isVendorResubmitCycle(
  productModel: Model<ProductDocument>,
  urnNo: string,
  session?: ClientSession,
): Promise<boolean> {
  const query = productModel
    .findOne(matchActiveProducts({ urnNo: urnNo.trim() }))
    .select('urnStatus')
    .lean();
  if (session) {
    query.session(session);
  }
  const product = await query.exec();
  return Number(product?.urnStatus) === VENDOR_RESUBMIT_URN_STATUS;
}

/** Version on first upload (v1) or admin resend re-upload (v2+). Skip otherwise. */
export function resolveCertificationVersionAction(
  existingDocsInSlot: number,
  isResubmitCycle: boolean,
): DocumentVersionAction | null {
  if (existingDocsInSlot === 0) {
    return 'added';
  }
  if (isResubmitCycle) {
    return 'replaced';
  }
  return null;
}

/** Admin sent renewal URN back to vendor for corrections (urnStatus 16). */
export function isRenewVendorResubmitCycle(urnStatus: number): boolean {
  return urnStatus === RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING;
}

/** Renewal: version only after admin resend; first resubmit upload is v1, replacements v2+. */
export function resolveRenewDocumentVersionAction(
  priorDocsInSlot: number,
  urnStatus: number,
): 'added' | 'replaced' | null {
  if (!isRenewVendorResubmitCycle(urnStatus)) {
    return null;
  }
  if (priorDocsInSlot === 0) {
    return 'added';
  }
  return 'replaced';
}

export function certificationSlotKeyModeForSection(
  sectionKey: string,
): CertificationSlotKeyMode {
  return sectionKey === DocumentSectionKey.PROCESS_INNOVATION
    ? 'subsectionTag'
    : 'subsection';
}

/** Align renew + initial certification subsection keys (e.g. product_performance → test_report_files). */
export function normalizeCertificationSubsection(
  sectionKey: string,
  subsection?: string | null,
): string | null {
  const section = String(sectionKey ?? '').trim();
  const raw = (subsection ?? '').trim().toLowerCase();
  if (section === DocumentSectionKey.PRODUCT_PERFORMANCE) {
    if (!raw || raw === 'product_performance') {
      return 'test_report_files';
    }
    return raw;
  }
  return subsection?.trim() || null;
}

export function certificationSlotKey(
  sectionKey: string,
  subsection?: string | null,
  documentTag?: string | null,
): string {
  const normalizedSubsection = normalizeCertificationSubsection(
    sectionKey,
    subsection,
  );
  if (certificationSlotKeyModeForSection(sectionKey) === 'subsectionTag') {
    return slotKeyFromSubsectionAndTag(normalizedSubsection, documentTag);
  }
  return slotKeyFromSubsection(normalizedSubsection);
}

/** Subsection/tag slot for certification docs; productDocumentId for legacy/non-cert rows. */
export function certificationStreamSlotKeyForDocument(doc: {
  documentForm: string;
  documentFormSubsection?: string | null;
  documentTag?: string | null;
  productDocumentId: number;
}): string {
  const sectionKey = String(doc.documentForm ?? '').trim();
  if (
    sectionKey.startsWith('product_') ||
    sectionKey.startsWith('process_') ||
    sectionKey.startsWith('raw_materials')
  ) {
    return certificationSlotKey(
      sectionKey,
      doc.documentFormSubsection,
      doc.documentTag,
    );
  }
  return slotKeyFromProductDocumentId(doc.productDocumentId);
}

/** Renew MP/WM/PP supporting uploads: one version stream per productDocumentId (not per subsection). */
export function usesRenewPerDocumentVersionSlot(sectionKey: string): boolean {
  return (
    sectionKey === DocumentSectionKey.PROCESS_MANUFACTURING ||
    sectionKey === DocumentSectionKey.PROCESS_WASTE_MANAGEMENT ||
    sectionKey === DocumentSectionKey.PRODUCT_PERFORMANCE
  );
}

export function renewDocumentVersionSlotKey(doc: {
  documentForm: string;
  documentFormSubsection?: string | null;
  documentTag?: string | null;
  productDocumentId: number;
}): string {
  const sectionKey = String(doc.documentForm ?? '').trim();
  if (usesRenewPerDocumentVersionSlot(sectionKey)) {
    return slotKeyFromProductDocumentId(doc.productDocumentId);
  }
  return certificationStreamSlotKeyForDocument(doc);
}

export async function countCertificationDocsInSlot(
  model: Model<AllProductDocumentDocument>,
  args: {
    vendorId: Types.ObjectId;
    urnNo: string;
    documentForm: string;
    documentFormSubsection?: string | null;
    documentTag?: string | null;
  },
  session?: ClientSession,
): Promise<number> {
  const filter: Record<string, unknown> = {
    vendorId: args.vendorId,
    urnNo: args.urnNo.trim(),
    documentForm: args.documentForm,
    isDeleted: { $ne: true },
  };
  if (args.documentFormSubsection) {
    filter.documentFormSubsection = args.documentFormSubsection;
  }
  if (args.documentTag) {
    filter.documentTag = args.documentTag;
  }
  const query = model.countDocuments(filter);
  if (session) {
    query.session(session);
  }
  return query.exec();
}

type TrackInsertedCertificationDocumentsParams = {
  versioning: DocumentVersioningService;
  documentModel: Model<AllProductDocumentDocument>;
  urnNo: string;
  sectionKey: string;
  userId: string | Types.ObjectId;
  vendorId: Types.ObjectId;
  insertedDocs: ProductDocumentVersionRow[];
  isResubmitCycle: boolean;
  session?: ClientSession;
  filesByIndex?: Array<Express.Multer.File | undefined>;
  processType?: 'initial' | 'renewal';
  renewalCycleId?: string | Types.ObjectId | null;
};

/**
 * Append-only uploads: track v1 on first file per slot; v2+ only during admin resend.
 * Multiple files in the same subsection on first submit share one v1 (first file only).
 */
export async function trackInsertedCertificationDocuments(
  params: TrackInsertedCertificationDocumentsParams,
): Promise<void> {
  const {
    versioning,
    documentModel,
    urnNo,
    sectionKey,
    userId,
    vendorId,
    insertedDocs,
    isResubmitCycle,
    session,
    filesByIndex,
    processType,
    renewalCycleId,
  } = params;

  if (!insertedDocs.length) {
    return;
  }

  const slotKeyMode = certificationSlotKeyModeForSection(sectionKey);
  const slotCounts = new Map<string, number>();
  const batchCountBySlot = new Map<string, number>();

  for (const doc of insertedDocs) {
    const slot = certificationSlotKey(
      sectionKey,
      doc.documentFormSubsection,
      doc.documentTag,
    );
    batchCountBySlot.set(slot, (batchCountBySlot.get(slot) ?? 0) + 1);
  }

  for (const [slot, batchCount] of batchCountBySlot) {
    const sample = insertedDocs.find(
      (doc) =>
        certificationSlotKey(
          sectionKey,
          doc.documentFormSubsection,
          doc.documentTag,
        ) === slot,
    );
    if (!sample) continue;
    const totalCount = await countCertificationDocsInSlot(
      documentModel,
      {
        vendorId,
        urnNo,
        documentForm: sectionKey,
        documentFormSubsection: sample.documentFormSubsection,
        documentTag: sample.documentTag,
      },
      session,
    );
    slotCounts.set(slot, Math.max(0, totalCount - batchCount));
  }

  for (let i = 0; i < insertedDocs.length; i++) {
    const doc = insertedDocs[i];
    const slot = certificationSlotKey(
      sectionKey,
      doc.documentFormSubsection,
      doc.documentTag,
    );
    const priorInSlot = slotCounts.get(slot) ?? 0;
    const action = resolveCertificationVersionAction(priorInSlot, isResubmitCycle);
    slotCounts.set(slot, priorInSlot + 1);

    if (!action) {
      continue;
    }

    await trackUploadedProductDocument(versioning, {
      urnNo,
      sectionKey,
      subsectionKey: doc.documentFormSubsection ?? null,
      documentTag: doc.documentTag ?? null,
      userId,
      documentId: doc._id,
      productDocumentId: doc.productDocumentId,
      filePath: doc.documentLink ?? '',
      originalName: doc.documentOriginalName ?? '',
      storedName: doc.documentName ?? '',
      file: filesByIndex?.[i],
      action,
      slotKeyMode,
      processType,
      renewalCycleId,
      session,
    });
  }
}

type TrackSingleCertificationDocumentParams = {
  versioning: DocumentVersioningService;
  documentModel: Model<AllProductDocumentDocument>;
  urnNo: string;
  sectionKey: string;
  userId: string | Types.ObjectId;
  vendorId: Types.ObjectId;
  doc: ProductDocumentVersionRow;
  isResubmitCycle: boolean;
  file?: Express.Multer.File;
  session?: ClientSession;
  processType?: 'initial' | 'renewal';
  renewalCycleId?: string | Types.ObjectId | null;
};

export async function trackSingleCertificationDocument(
  params: TrackSingleCertificationDocumentParams,
): Promise<void> {
  await trackInsertedCertificationDocuments({
    versioning: params.versioning,
    documentModel: params.documentModel,
    urnNo: params.urnNo,
    sectionKey: params.sectionKey,
    userId: params.userId,
    vendorId: params.vendorId,
    insertedDocs: [params.doc],
    isResubmitCycle: params.isResubmitCycle,
    session: params.session,
    filesByIndex: params.file ? [params.file] : undefined,
    processType: params.processType,
    renewalCycleId: params.renewalCycleId,
  });
}

/** Resolves admin-resend cycle and tracks a single newly created certification document. */
export async function trackCertificationDocumentAfterCreate(
  params: Omit<TrackSingleCertificationDocumentParams, 'isResubmitCycle'> & {
    productModel: Model<ProductDocument>;
  },
): Promise<void> {
  const { productModel, urnNo, session, ...rest } = params;
  const isResubmitCycle = await isVendorResubmitCycle(
    productModel,
    urnNo,
    session,
  );
  await trackSingleCertificationDocument({
    ...rest,
    urnNo,
    session,
    isResubmitCycle,
  });
}

export type { ProductDocument, AllProductDocument };
