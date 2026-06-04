import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  DOCUMENT_PROCESS_TYPE_VALUES,
  DOCUMENT_VERSION_ACTION_VALUES,
  DocumentProcessType,
  DocumentVersionAction,
} from '../constants/document-version.constants';

export type DocVersionDocument = DocVersion & Document;

@Schema({ collection: 'doc_versions', timestamps: false })
export class DocVersion {
  @Prop({ type: Types.ObjectId, ref: 'DocStream', required: true })
  streamId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: true, enum: DOCUMENT_PROCESS_TYPE_VALUES })
  processType: DocumentProcessType;

  @Prop({ type: Types.ObjectId, default: null })
  renewalCycleId?: Types.ObjectId | null;

  @Prop({ type: Number, default: null })
  roundNo?: number | null;

  @Prop({ required: true })
  versionNo: number;

  @Prop({ required: true, enum: DOCUMENT_VERSION_ACTION_VALUES })
  action: DocumentVersionAction;

  @Prop({ type: String, default: null })
  filePath?: string | null;

  @Prop({ type: String, default: null })
  originalName?: string | null;

  @Prop({ type: String, default: null })
  storedName?: string | null;

  @Prop({ type: String, default: null })
  mimeType?: string | null;

  @Prop({ type: Number, default: null })
  sizeBytes?: number | null;

  @Prop({ type: String, default: null })
  checksum?: string | null;

  @Prop({ required: true, default: true })
  isLatest: boolean;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, required: true })
  createdBy: Types.ObjectId;
}

export const DocVersionSchema = SchemaFactory.createForClass(DocVersion);

DocVersionSchema.index({ streamId: 1, versionNo: 1 }, { unique: true });
DocVersionSchema.index({ streamId: 1, isLatest: 1 });
DocVersionSchema.index({ urnNo: 1, processType: 1, renewalCycleId: 1 });
