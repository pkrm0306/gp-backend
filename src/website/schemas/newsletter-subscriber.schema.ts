import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsletterSubscriberDocument = NewsletterSubscriber & Document;

/**
 * Existing Atlas/prod data uses Mongoose’s default pluralized name
 * (`newslettersubscribers`), not `newsletter_subscribers`.
 */
@Schema({ timestamps: true, collection: 'newslettersubscribers' })
export class NewsletterSubscriber {
  /** Unique among non–soft-deleted rows (see partial index below). */
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  /**
   * Human-readable preference labels (e.g. "Green Products", "Events").
   * Kept as strings to match UI labels.
   */
  @Prop({ type: [String], default: [] })
  subscribedFor: string[];

  /** 1 = active (toggle on), 0 = inactive (toggle off). */
  @Prop({ default: 1 })
  status: number;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted?: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const NewsletterSubscriberSchema =
  SchemaFactory.createForClass(NewsletterSubscriber);
NewsletterSubscriberSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
NewsletterSubscriberSchema.index({ deletedAt: 1 });
