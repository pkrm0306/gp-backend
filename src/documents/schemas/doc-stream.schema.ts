import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import {
  DOCUMENT_PROCESS_TYPE_VALUES,
  DocumentProcessType,
} from '../constants/document-version.constants';

export type DocStreamDocument = DocStream & Document;

@Schema({ _id: false })
export class DocStreamLiveRef {
  @Prop({ required: true })
  collection: string;

  @Prop({ type: Types.ObjectId, required: true })
  id: Types.ObjectId;

  @Prop()
  field?: string;
}

const DocStreamLiveRefSchema = SchemaFactory.createForClass(DocStreamLiveRef);

@Schema({ collection: 'doc_streams', timestamps: false })
export class DocStream {
  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: true, enum: DOCUMENT_PROCESS_TYPE_VALUES })
  processType: DocumentProcessType;

  @Prop({ type: Types.ObjectId, default: null })
  renewalCycleId?: Types.ObjectId | null;

  @Prop({ required: true })
  sectionKey: string;

  @Prop({ type: String, default: null })
  subsectionKey?: string | null;

  @Prop({ required: true })
  slotKey: string;

  @Prop({ required: true })
  streamKey: string;

  @Prop({ required: true })
  liveSource: string;

  @Prop({ type: DocStreamLiveRefSchema, required: true })
  liveRef: DocStreamLiveRef;

  @Prop({ required: true, default: 0 })
  latestVersionNo: number;

  @Prop({ type: Types.ObjectId, default: null })
  latestVersionId?: Types.ObjectId | null;

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, required: true })
  updatedBy: Types.ObjectId;
}

export const DocStreamSchema = SchemaFactory.createForClass(DocStream);

DocStreamSchema.index(
  {
    urnNo: 1,
    processType: 1,
    renewalCycleId: 1,
    sectionKey: 1,
    subsectionKey: 1,
    slotKey: 1,
  },
  { unique: true },
);
