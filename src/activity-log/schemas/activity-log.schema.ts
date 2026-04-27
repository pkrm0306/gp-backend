import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({
  collection: 'activity_log',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class ActivityLog {
  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendor_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturer_id: Types.ObjectId;

  @Prop({ required: true })
  urn_no: string;

  @Prop({ required: true, type: Number })
  activities_id: number;

  @Prop({ required: true })
  activity: string;

  @Prop({ required: true, type: Number })
  activity_status: number;

  @Prop({ type: Number })
  sub_activities_id?: number;

  @Prop({ required: true })
  responsibility: string;

  @Prop()
  next_responsibility?: string;

  @Prop({ type: Number })
  next_acitivities_id?: number;

  @Prop()
  next_activity?: string;

  @Prop({ required: true, type: Number, default: 1 })
  status: number;

  created_at?: Date;
  updated_at?: Date;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
