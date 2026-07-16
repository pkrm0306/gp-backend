import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebsiteAnalyticsEventDocument = WebsiteAnalyticsEvent & Document;

export type WebsiteAnalyticsEventType = 'page_view' | 'sign_up';

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'website_analytics_events' })
export class WebsiteAnalyticsEvent {
  @Prop({ required: true, enum: ['page_view', 'sign_up'], index: true })
  eventType: WebsiteAnalyticsEventType;

  /** Anonymous browser session id generated on the public website. */
  @Prop({ required: true, trim: true, index: true })
  visitorId: string;

  @Prop({ trim: true })
  path?: string;

  @Prop({ trim: true })
  signUpType?: string;

  @Prop({ trim: true })
  measurementId?: string;

  createdAt?: Date;
}

export const WebsiteAnalyticsEventSchema =
  SchemaFactory.createForClass(WebsiteAnalyticsEvent);

WebsiteAnalyticsEventSchema.index({ createdAt: 1, eventType: 1 });
