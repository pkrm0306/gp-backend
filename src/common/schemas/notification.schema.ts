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

  /** `0` = unseen, `1` = seen (admin bell feed). */
  @Prop({ required: true, default: 0 })
  seen: number;

  @Prop({ type: Date, default: null })
  seenAt?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ seen: 1, createdAt: -1 });
