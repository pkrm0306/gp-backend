import { ClientSession, Types } from 'mongoose';
import { DocumentVersioningService } from '../document-versioning.service';
import {
  DocumentVersionAction,
  DocumentProcessType,
} from '../constants/document-version.constants';
import {
  fileMetadataFromMulter,
  slotKeyFromProductDocumentId,
  slotKeyFromSubsection,
  slotKeyFromSubsectionAndTag,
} from './document-version.helper';

export interface ProductDocumentVersionRow {
  _id: Types.ObjectId | string;
  productDocumentId: number;
  documentFormSubsection?: string | null;
  documentTag?: string | null;
  documentLink?: string | null;
  documentName?: string | null;
  documentOriginalName?: string | null;
}

export interface TrackProductDocumentBatchParams {
  versioning: DocumentVersioningService;
  urnNo: string;
  sectionKey: string;
  userId: string | Types.ObjectId;
  docs: ProductDocumentVersionRow[];
  action?: DocumentVersionAction;
  slotKeyMode?: 'productDocumentId' | 'subsection' | 'subsectionTag';
  processType?: DocumentProcessType;
  renewalCycleId?: string | Types.ObjectId | null;
  roundNo?: number | null;
  session?: ClientSession;
}

export async function trackProductDocumentBatch(
  params: TrackProductDocumentBatchParams,
): Promise<void> {
  const {
    versioning,
    urnNo,
    sectionKey,
    userId,
    docs,
    action = 'added',
    slotKeyMode = 'productDocumentId',
    processType,
    renewalCycleId,
    roundNo,
    session,
  } = params;

  for (const doc of docs) {
    const metadata = fileMetadataFromMulter(undefined, doc.documentName, doc.documentLink);
    await versioning.trackAllProductDocument({
      urnNo,
      sectionKey,
      subsectionKey: doc.documentFormSubsection ?? null,
      slotKey:
        slotKeyMode === 'subsectionTag'
          ? slotKeyFromSubsectionAndTag(
              doc.documentFormSubsection,
              doc.documentTag,
            )
          : slotKeyMode === 'subsection'
            ? slotKeyFromSubsection(doc.documentFormSubsection)
            : slotKeyFromProductDocumentId(doc.productDocumentId),
      action,
      documentId: doc._id,
      productDocumentId: doc.productDocumentId,
      filePath: doc.documentLink ?? metadata.filePath ?? null,
      originalName: doc.documentOriginalName ?? metadata.originalName ?? null,
      storedName: doc.documentName ?? metadata.storedName ?? null,
      userId,
      processType,
      renewalCycleId,
      roundNo,
      session,
    });
  }
}

export async function trackProductDocumentDeleteBatch(
  params: Omit<TrackProductDocumentBatchParams, 'action'>,
): Promise<void> {
  await trackProductDocumentBatch({ ...params, action: 'deleted' });
}

export async function trackUploadedProductDocument(
  versioning: DocumentVersioningService,
  params: {
    urnNo: string;
    sectionKey: string;
    subsectionKey?: string | null;
    documentTag?: string | null;
    userId: string | Types.ObjectId;
    documentId: Types.ObjectId | string;
    productDocumentId: number;
    filePath: string;
    originalName: string;
    storedName: string;
    file?: Express.Multer.File;
    action?: DocumentVersionAction;
    slotKeyMode?: 'productDocumentId' | 'subsection' | 'subsectionTag';
    processType?: DocumentProcessType;
    renewalCycleId?: string | Types.ObjectId | null;
    roundNo?: number | null;
    session?: ClientSession;
  },
): Promise<void> {
  const metadata = fileMetadataFromMulter(params.file, params.storedName, params.filePath);
  await versioning.trackAllProductDocument({
    urnNo: params.urnNo,
    sectionKey: params.sectionKey,
    subsectionKey: params.subsectionKey ?? null,
    slotKey:
      params.slotKeyMode === 'subsectionTag'
        ? slotKeyFromSubsectionAndTag(params.subsectionKey, params.documentTag)
        : params.slotKeyMode === 'subsection'
          ? slotKeyFromSubsection(params.subsectionKey)
          : slotKeyFromProductDocumentId(params.productDocumentId),
    action: params.action ?? 'added',
    documentId: params.documentId,
    productDocumentId: params.productDocumentId,
    filePath: params.filePath,
    originalName: params.originalName ?? metadata.originalName ?? null,
    storedName: params.storedName ?? metadata.storedName ?? null,
    mimeType: metadata.mimeType ?? null,
    sizeBytes: metadata.sizeBytes ?? null,
    userId: params.userId,
    processType: params.processType,
    renewalCycleId: params.renewalCycleId,
    roundNo: params.roundNo,
    session: params.session,
  });
}

export async function trackPaymentFileChange(
  versioning: DocumentVersioningService,
  params: {
    urnNo: string;
    paymentId: Types.ObjectId | string;
    field: string;
    userId: string | Types.ObjectId;
    filePath: string;
    file?: Express.Multer.File;
    storedName?: string;
    action?: DocumentVersionAction;
    paymentType?: string;
    renewalCycleId?: string | Types.ObjectId | null;
    roundNo?: number | null;
    session?: ClientSession;
  },
): Promise<void> {
  const metadata = fileMetadataFromMulter(
    params.file,
    params.storedName ?? null,
    params.filePath,
  );
  await versioning.trackPaymentDocument({
    urnNo: params.urnNo,
    paymentId: params.paymentId,
    field: params.field,
    action: params.action ?? 'added',
    filePath: params.filePath,
    originalName: metadata.originalName ?? null,
    storedName: metadata.storedName ?? null,
    mimeType: metadata.mimeType ?? null,
    sizeBytes: metadata.sizeBytes ?? null,
    userId: params.userId,
    paymentType: params.paymentType,
    renewalCycleId: params.renewalCycleId,
    roundNo: params.roundNo,
    session: params.session,
  });
}
