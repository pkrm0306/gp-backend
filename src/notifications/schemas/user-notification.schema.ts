import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserNotificationDocument = UserNotification & Document;

/**
 * Per-user in-app notifications (distinct from admin `notifications` system feed).
 * Collection: user_notifications
 */
@Schema({
  collection: 'user_notifications',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class UserNotification {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  user_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ required: true, trim: true, default: 'info' })
  type: string;

  @Prop({ required: true, trim: true })
  notify_type: string;

  /** 0 = unseen, 1 = seen */
  @Prop({ required: true, default: 0 })
  seen: number;

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export const UserNotificationSchema =
  SchemaFactory.createForClass(UserNotification);

UserNotificationSchema.index({ user_id: 1, seen: 1, created_at: -1 });
UserNotificationSchema.index({ user_id: 1, deleted_at: 1 });
