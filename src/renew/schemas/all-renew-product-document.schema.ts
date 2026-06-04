import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  DOCUMENT_SECTION_KEY_VALUES,
  DocumentSectionKey,
} from '../../common/constants/document-section-key.constants';

export type AllRenewProductDocumentDocument = AllRenewProductDocument & Document;

@Schema({ collection: 'all_renew_product_documents', timestamps: false })
export class AllRenewProductDocument {
  @Prop({ required: true, unique: true })
  productDocumentId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true, index: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'RenewalCycle', index: true })
  renewalCycleId?: Types.ObjectId;

  @Prop()
  eoiNo?: string;

  @Prop({ required: true, enum: DOCUMENT_SECTION_KEY_VALUES })
  documentForm: DocumentSectionKey;

  @Prop()
  documentFormSubsection?: string;

  @Prop({ required: true })
  formPrimaryId: number;

  @Prop({ required: true })
  documentName: string;

  @Prop({ required: true })
  documentOriginalName: string;

  @Prop({ required: true })
  documentLink: string;

  @Prop({ required: false, enum: ['tech', 'process', 'social'] })
  documentTag?: 'tech' | 'process' | 'social';

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Vendor' })
  deletedBy?: Types.ObjectId;
}

export const AllRenewProductDocumentSchema = SchemaFactory.createForClass(
  AllRenewProductDocument,
);
