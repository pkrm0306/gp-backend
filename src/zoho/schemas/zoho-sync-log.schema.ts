import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ZohoSyncLogDocument = ZohoSyncLog & Document;

@Schema({ collection: 'zoho_sync_logs', timestamps: true })
export class ZohoSyncLog {
  @Prop({ required: true })
  operation: string;

  @Prop({ required: true, enum: ['queued', 'success', 'failed', 'skipped'] })
  status: 'queued' | 'success' | 'failed' | 'skipped';

  @Prop()
  portalEntityId?: string;

  @Prop()
  zohoModule?: string;

  @Prop()
  zohoRecordId?: string;

  @Prop({ type: Object })
  requestPayload?: Record<string, unknown>;

  @Prop({ type: Object })
  responsePayload?: Record<string, unknown>;

  @Prop()
  errorCode?: string;

  @Prop()
  errorMessage?: string;

  @Prop({ default: 0 })
  attempts: number;

  @Prop()
  correlationId?: string;
}

export const ZohoSyncLogSchema = SchemaFactory.createForClass(ZohoSyncLog);

ZohoSyncLogSchema.index({ operation: 1, status: 1 });
ZohoSyncLogSchema.index({ portalEntityId: 1 });
ZohoSyncLogSchema.index({ createdAt: -1 });
