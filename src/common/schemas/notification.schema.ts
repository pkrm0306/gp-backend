import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ collection: 'notifications', timestamps: true })
export class Notification {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ required: true, trim: true, default: 'info' })
  type: string;

  @Prop({ required: true, trim: true, default: 'system' })
  source: string;

  @Prop({ trim: true })
  referenceType?: string;

  @Prop({ trim: true })
  referenceId?: string;

  @Prop({ trim: true })
  actorName?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ createdAt: -1 });
