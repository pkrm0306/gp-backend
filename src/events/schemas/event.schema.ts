import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  ALL_GALLERY_TYPES,
  GALLERY_TYPES,
  GalleryType,
} from '../../gallery/schemas/gallery.schema';

export type EventDocument = Event & Document;
export { GALLERY_TYPES, GalleryType };

/** Max gallery images allowed on event create/edit (same cap as articles/gallery). */
export const EVENT_MAX_IMAGES = 10;

/** Event delivery format (checkbox multiselect on admin create/edit). */
export const EVENT_FORMATS = ['inperson', 'online'] as const;
export type EventFormat = (typeof EVENT_FORMATS)[number];

@Schema({ _id: false })
export class EventBrochureItem {
  @Prop({ required: true, trim: true })
  heading: string;

  @Prop({ required: true, trim: true })
  link: string;
}

export const EventBrochureItemSchema =
  SchemaFactory.createForClass(EventBrochureItem);

@Schema({ _id: false })
export class EventProgrammeAtAGlanceItem {
  /** 1-based day index within the event date range. */
  @Prop({ required: true, type: Number, min: 1 })
  day: number;

  /** Optional ISO date (YYYY-MM-DD) for the programme day. */
  @Prop({ required: false, trim: true })
  date?: string;

  @Prop({ required: true, trim: true })
  time: string;

  @Prop({ required: true, trim: true })
  description: string;
}

export const EventProgrammeAtAGlanceItemSchema = SchemaFactory.createForClass(
  EventProgrammeAtAGlanceItem,
);

@Schema({ _id: false })
export class EventKeyThemeItem {
  @Prop({ required: true, trim: true })
  heading: string;

  @Prop({ required: true, trim: true })
  description: string;
}

export const EventKeyThemeItemSchema =
  SchemaFactory.createForClass(EventKeyThemeItem);

@Schema({ collection: 'events', timestamps: false })
export class Event {
  /** Unique among non–soft-deleted rows (see partial index below). */
  @Prop({ required: true })
  eventId: number;

  @Prop({ required: true })
  eventName: string;

  /** Local upload path (e.g. /uploads/events/xxx.png) or absolute URL */
  @Prop()
  eventImage?: string;

  /** Relative path stored in DB (for example: events/file.png) */
  @Prop()
  event_image?: string;

  /** Multiple gallery images (local upload paths or absolute URLs) */
  @Prop({ type: [String], default: [] })
  galleryImages?: string[];

  @Prop({ enum: ALL_GALLERY_TYPES, required: false })
  galleryType?: GalleryType;

  @Prop()
  eventDescription?: string;

  @Prop({ required: true })
  eventDate: Date;

  /** Inclusive event start date (falls back to `eventDate` on legacy rows). */
  @Prop()
  eventStartDate?: Date;

  /** Inclusive event end date (falls back to start/`eventDate` on legacy rows). */
  @Prop()
  eventEndDate?: Date;

  @Prop()
  eventStartTime?: string;

  @Prop()
  eventEndTime?: string;

  @Prop()
  eventLocation?: string;

  /**
   * Delivery format(s): inperson and/or online (admin checkbox multiselect).
   */
  @Prop({
    type: [{ type: String, enum: EVENT_FORMATS }],
    default: [],
  })
  format?: EventFormat[];

  @Prop()
  contactPersonName?: string;

  @Prop()
  contactPersonDesignation?: string;

  @Prop()
  contactPersonEmail?: string;

  @Prop()
  contactPersonPhone?: string;

  /** Optional external registration URL */
  @Prop()
  registrationLink?: string;

  /** Optional brochure/attachment URL */
  @Prop()
  brochureLink?: string;

  /** Multiple brochure cards (heading + external link). */
  @Prop({ type: [EventBrochureItemSchema], default: [] })
  brochures?: EventBrochureItem[];

  /** Audience bullets for the public "Who should attend" section. */
  @Prop({ type: [String], default: [] })
  whoShouldAttend?: string[];

  /** Key themes for the public event detail page (heading + description). */
  @Prop({ type: [EventKeyThemeItemSchema], default: [] })
  keyThemes?: EventKeyThemeItem[];

  /**
   * "Programme at a glance" slots (time + description), optionally tagged with `day`
   * (and `date`) so multi-day events can store any number of rows per day.
   */
  @Prop({ type: [EventProgrammeAtAGlanceItemSchema], default: [] })
  programmeAtAGlance?: EventProgrammeAtAGlanceItem[];

  /** Venue / travel notes for the public event detail page. */
  @Prop({ default: '', trim: true })
  venueAndTravel?: string;

  /** Tag pills shown on the public event detail page. */
  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ required: true, type: Number, default: 1 })
  eventStatus: number; // 0=Inactive, 1=Active

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted?: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index(
  { eventId: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
EventSchema.index({ deletedAt: 1 });
