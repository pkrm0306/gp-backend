import { ClientSession, Types } from 'mongoose';
import {
  DocumentProcessType,
  DocumentVersionAction,
} from '../constants/document-version.constants';

export interface DocumentLiveRef {
  collection: string;
  id: Types.ObjectId | string;
  field?: string;
}

export interface TrackDocumentVersionChangeInput {
  urnNo: string;
  processType?: DocumentProcessType;
  renewalCycleId?: string | Types.ObjectId | null;
  sectionKey: string;
  subsectionKey?: string | null;
  slotKey: string;
  liveSource: string;
  liveRef: DocumentLiveRef;
  action: DocumentVersionAction;
  filePath?: string | null;
  originalName?: string | null;
  storedName?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  checksum?: string | null;
  userId: string | Types.ObjectId;
  roundNo?: number | null;
  session?: ClientSession;
}

export interface DocumentStreamQueryInput {
  urnNo: string;
  processType?: DocumentProcessType;
  renewalCycleId?: string | null;
  sectionKey: string;
  subsectionKey?: string | null;
  slotKey: string;
  /** Renew MP/WM: scope history to one file; enables legacy subsection-stream fallback. */
  anchorProductDocumentId?: number;
}

export interface TrackAllProductDocumentInput {
  urnNo: string;
  sectionKey: string;
  subsectionKey?: string | null;
  slotKey: string;
  action: DocumentVersionAction;
  documentId: Types.ObjectId | string;
  productDocumentId?: number;
  filePath?: string | null;
  originalName?: string | null;
  storedName?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  userId: string | Types.ObjectId;
  processType?: DocumentProcessType;
  renewalCycleId?: string | Types.ObjectId | null;
  roundNo?: number | null;
  session?: ClientSession;
}

export interface TrackPaymentDocumentInput {
  urnNo: string;
  paymentId: Types.ObjectId | string;
  field: string;
  action: DocumentVersionAction;
  filePath?: string | null;
  originalName?: string | null;
  storedName?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  userId: string | Types.ObjectId;
  paymentType?: string;
  renewalCycleId?: string | Types.ObjectId | null;
  roundNo?: number | null;
  session?: ClientSession;
}
