import { Types } from 'mongoose';
import {
  ALL_PRODUCT_DOCUMENTS_LIVE_SOURCE,
  DocumentProcessType,
  PAYMENT_DETAILS_LIVE_SOURCE,
} from '../constants/document-version.constants';
import {
  DocumentLiveRef,
  DocumentStreamQueryInput,
  TrackAllProductDocumentInput,
  TrackDocumentVersionChangeInput,
  TrackPaymentDocumentInput,
} from '../types/document-version.types';

export function buildStreamKey(input: {
  urnNo: string;
  processType: DocumentProcessType;
  renewalCycleId?: Types.ObjectId | null;
  sectionKey: string;
  subsectionKey?: string | null;
  slotKey: string;
}): string {
  const renewal = input.renewalCycleId?.toString() ?? '';
  const subsection = input.subsectionKey ?? '';
  return `${input.urnNo}|${input.processType}|${renewal}|${input.sectionKey}|${subsection}|${input.slotKey}`;
}

export function normalizeProcessType(
  processType?: DocumentProcessType | string | null,
): DocumentProcessType {
  return processType === 'renewal' ? 'renewal' : 'initial';
}

export function paymentTypeToProcessType(
  paymentType?: string | null,
): DocumentProcessType {
  return paymentType === 'renew' ? 'renewal' : 'initial';
}

/** Separate version streams per payment phase (registration vs certification vs renew). */
export function paymentStreamSubsectionKey(
  paymentType?: string | null,
): string | null {
  const t = String(paymentType ?? '').trim().toLowerCase();
  if (t === 'registration' || t === 'certification' || t === 'renew') {
    return t;
  }
  return null;
}

export function toObjectId(
  id: string | Types.ObjectId,
  fieldName = 'id',
): Types.ObjectId {
  if (id instanceof Types.ObjectId) {
    return id;
  }
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName} format: ${id}`);
  }
  return new Types.ObjectId(id);
}

export function normalizeRenewalCycleId(
  renewalCycleId?: string | Types.ObjectId | null,
): Types.ObjectId | null {
  if (renewalCycleId == null || renewalCycleId === '') {
    return null;
  }
  return toObjectId(renewalCycleId, 'renewalCycleId');
}

export function buildAllProductDocumentLiveRef(
  documentId: Types.ObjectId | string,
): DocumentLiveRef {
  return {
    collection: ALL_PRODUCT_DOCUMENTS_LIVE_SOURCE,
    id: toObjectId(documentId, 'documentId'),
  };
}

export function buildPaymentDocumentLiveRef(
  paymentId: Types.ObjectId | string,
  field: string,
): DocumentLiveRef {
  return {
    collection: PAYMENT_DETAILS_LIVE_SOURCE,
    id: toObjectId(paymentId, 'paymentId'),
    field,
  };
}

export function buildAllProductDocumentTrackInput(
  input: TrackAllProductDocumentInput,
): TrackDocumentVersionChangeInput {
  return {
    urnNo: input.urnNo.trim(),
    processType: normalizeProcessType(input.processType),
    renewalCycleId: normalizeRenewalCycleId(input.renewalCycleId),
    sectionKey: input.sectionKey,
    subsectionKey: input.subsectionKey ?? null,
    slotKey: input.slotKey,
    liveSource: ALL_PRODUCT_DOCUMENTS_LIVE_SOURCE,
    liveRef: buildAllProductDocumentLiveRef(input.documentId),
    action: input.action,
    filePath: input.filePath ?? null,
    originalName: input.originalName ?? null,
    storedName: input.storedName ?? null,
    mimeType: input.mimeType ?? null,
    sizeBytes: input.sizeBytes ?? null,
    userId: input.userId,
    roundNo: input.roundNo ?? null,
    session: input.session,
  };
}

export function buildPaymentDocumentTrackInput(
  input: TrackPaymentDocumentInput,
): TrackDocumentVersionChangeInput {
  return {
    urnNo: input.urnNo.trim(),
    processType: paymentTypeToProcessType(input.paymentType),
    renewalCycleId: normalizeRenewalCycleId(input.renewalCycleId),
    sectionKey: 'payment',
    subsectionKey: paymentStreamSubsectionKey(input.paymentType),
    slotKey: input.field,
    liveSource: PAYMENT_DETAILS_LIVE_SOURCE,
    liveRef: buildPaymentDocumentLiveRef(input.paymentId, input.field),
    action: input.action,
    filePath: input.filePath ?? null,
    originalName: input.originalName ?? null,
    storedName: input.storedName ?? null,
    mimeType: input.mimeType ?? null,
    sizeBytes: input.sizeBytes ?? null,
    userId: input.userId,
    roundNo: input.roundNo ?? null,
    session: input.session,
  };
}

export function buildStreamIdentityFilter(
  query: DocumentStreamQueryInput,
): Record<string, unknown> {
  return {
    urnNo: query.urnNo.trim(),
    processType: normalizeProcessType(query.processType),
    renewalCycleId:
      query.renewalCycleId && Types.ObjectId.isValid(query.renewalCycleId)
        ? new Types.ObjectId(query.renewalCycleId)
        : null,
    sectionKey: query.sectionKey,
    subsectionKey: query.subsectionKey ?? null,
    slotKey: query.slotKey,
  };
}

export function fileMetadataFromMulter(
  file?: Express.Multer.File | null,
  storedName?: string | null,
  filePath?: string | null,
): {
  originalName?: string | null;
  storedName?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  filePath?: string | null;
} {
  if (!file && !filePath) {
    return {
      originalName: null,
      storedName: storedName ?? null,
      mimeType: null,
      sizeBytes: null,
      filePath: filePath ?? null,
    };
  }

  return {
    originalName: file?.originalname ?? null,
    storedName: storedName ?? (file ? file.filename : null),
    mimeType: file?.mimetype ?? null,
    sizeBytes: file?.size ?? null,
    filePath: filePath ?? null,
  };
}

export function slotKeyFromProductDocumentId(productDocumentId: number): string {
  return String(productDocumentId);
}

export function slotKeyFromSubsection(subsection?: string | null): string {
  return subsection?.trim() || 'default';
}

/** Innovation and similar sections: one version stream per subsection + document tag. */
export function slotKeyFromSubsectionAndTag(
  subsection?: string | null,
  tag?: string | null,
): string {
  const sub = subsection?.trim() || 'default';
  const t = tag?.trim() || 'tech';
  return `${sub}__${t}`;
}
