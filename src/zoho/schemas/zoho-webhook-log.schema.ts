import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ZohoWebhookLogDocument = ZohoWebhookLog & Document;

@Schema({ collection: 'zoho_webhook_logs', timestamps: true })
export class ZohoWebhookLog {
  @Prop()
  event?: string;

  @Prop()
  module?: string;

  @Prop()
  recordId?: string;

  @Prop({ type: Object })
  headers?: Record<string, string | string[]>;

  @Prop({ type: Object, required: true })
  payload: Record<string, unknown>;

  @Prop({ default: false })
  signatureValid: boolean;

  @Prop({ required: true, enum: ['received', 'queued', 'processed', 'failed'] })
  status: 'received' | 'queued' | 'processed' | 'failed';

  @Prop()
  errorMessage?: string;

  @Prop()
  processedAt?: Date;
}

export const ZohoWebhookLogSchema =
  SchemaFactory.createForClass(ZohoWebhookLog);

ZohoWebhookLogSchema.index({ event: 1, module: 1 });
ZohoWebhookLogSchema.index({ recordId: 1 });
ZohoWebhookLogSchema.index({ createdAt: -1 });
