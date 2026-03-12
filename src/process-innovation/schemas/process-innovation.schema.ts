import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessInnovationDocument = ProcessInnovation & Document;

@Schema({ collection: 'process_innovation', timestamps: false })
export class ProcessInnovation {
  @Prop({ required: true, unique: true })
  processInnovationId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: false })
  innovationImplementationDetails?: string;

  @Prop({ required: true, type: Number, default: 0 })
  innovationImplementationDocuments: number; // 0=No File Available, 1=File Available

  @Prop({ required: true, type: Number, default: 0 })
  processInnovationStatus: number; // 0=Pending, 1=Completed

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessInnovationSchema = SchemaFactory.createForClass(ProcessInnovation);
