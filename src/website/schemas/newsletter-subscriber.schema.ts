import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsletterSubscriberDocument = NewsletterSubscriber & Document;

@Schema({ timestamps: true })
export class NewsletterSubscriber {
  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true })
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

  createdAt?: Date;
  updatedAt?: Date;
}

export const NewsletterSubscriberSchema =
  SchemaFactory.createForClass(NewsletterSubscriber);

