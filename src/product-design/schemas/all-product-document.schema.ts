import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AllProductDocumentDocument = AllProductDocument & Document;

@Schema({ collection: 'all_product_documents', timestamps: false })
export class AllProductDocument {
  @Prop({ required: true, unique: true })
  productDocumentId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop()
  eoiNo?: string;

  @Prop({ required: true })
  documentForm: string; // e.g. 'product_design'

  @Prop()
  documentFormSubsection?: string; // e.g. 'eco_vision_upload', 'supporting_documents'

  @Prop({ required: true })
  formPrimaryId: number; // productDesignId

  @Prop({ required: true })
  documentName: string; // stored filename

  @Prop({ required: true })
  documentOriginalName: string; // original upload filename

  @Prop({ required: true })
  documentLink: string; // stored path/url

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const AllProductDocumentSchema = SchemaFactory.createForClass(AllProductDocument);

