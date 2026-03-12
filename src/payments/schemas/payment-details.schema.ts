import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDetailsDocument = PaymentDetails & Document;

@Schema({ collection: 'payment_details', timestamps: false })
export class PaymentDetails {
  @Prop({ required: true, unique: true })
  paymentId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  quoteAmount: number;

  @Prop({ required: true, type: Number })
  quoteGstAmount: number;

  @Prop({ required: true, type: Number })
  quoteTdsAmount: number;

  @Prop({ required: true, type: Number })
  quoteTotal: number;

  @Prop()
  proposalFile?: string;

  @Prop({ required: true })
  adminGstNo: string;

  @Prop({ required: true })
  vendorGstNo: string;

  @Prop({
    required: true,
    enum: ['registration', 'certification', 'renew'],
    default: 'registration',
  })
  paymentType: string;

  @Prop({
    enum: ['online', 'cheque_or_dd', 'neft_or_rtgs'],
  })
  paymentMode?: string;

  @Prop({ required: true, type: Number, default: 0 })
  onlinePaymentId: number;

  @Prop()
  paymentReferenceNo?: string;

  @Prop()
  paymentChequeDate?: Date;

  @Prop()
  chequeOrDdFile?: string;

  @Prop()
  tdsFile?: string;

  @Prop()
  productsToBeCertified?: string;

  @Prop({ required: true, type: Number, default: 0 })
  paymentStatus: number; // 0=Created, 1=Pending, 2=Completed, 3=Cancelled

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const PaymentDetailsSchema = SchemaFactory.createForClass(PaymentDetails);
