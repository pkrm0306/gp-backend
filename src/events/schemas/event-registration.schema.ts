import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const EVENT_REGISTRATION_STATUSES = [
  'new',
  'confirmed',
  'cancelled',
  'attended',
] as const;
export type EventRegistrationStatus =
  (typeof EVENT_REGISTRATION_STATUSES)[number];

export const EVENT_ATTENDANCE_MODES = ['in-person', 'online'] as const;
export type EventAttendanceMode = (typeof EVENT_ATTENDANCE_MODES)[number];

export const EVENT_PARTICIPANT_ROLES = [
  'Manufacturer',
  'Architect / consultant',
  'Developer',
  'Government',
  'Academia / student',
  'Other',
] as const;
export type EventParticipantRole = (typeof EVENT_PARTICIPANT_ROLES)[number];

export type EventRegistrationDocument = EventRegistration & Document;

@Schema({ timestamps: true, collection: 'event_registrations' })
export class EventRegistration {
  /** Human-readable reference shown on the website success card (e.g. GP-00042). */
  @Prop({ required: true, trim: true, unique: true, index: true })
  referenceCode: string;

  @Prop({ required: true, trim: true, index: true })
  eventSlug: string;

  @Prop({ required: true, trim: true, default: '' })
  eventTitle: string;

  @Prop({ required: false, trim: true, default: '' })
  eventDate: string;

  @Prop({ required: false, trim: true, default: '' })
  eventTime: string;

  @Prop({ required: false, trim: true, default: '' })
  eventLocation: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  organisation: string;

  @Prop({ required: false, trim: true, default: '' })
  designation: string;

  @Prop({
    required: true,
    enum: EVENT_ATTENDANCE_MODES,
    index: true,
  })
  attendanceMode: EventAttendanceMode;

  @Prop({
    required: true,
    enum: EVENT_PARTICIPANT_ROLES,
    index: true,
  })
  participantRole: EventParticipantRole;

  @Prop({ type: [String], default: [] })
  sessionsOfInterest: string[];

  @Prop({ required: false, trim: true, default: '', maxlength: 300 })
  accessibilityOrDietaryNotes: string;

  @Prop({ required: true, type: Boolean, default: true })
  consent: boolean;

  @Prop({ required: false, trim: true, default: '' })
  sourcePath: string;

  @Prop({
    required: true,
    enum: EVENT_REGISTRATION_STATUSES,
    default: 'new',
    index: true,
  })
  status: EventRegistrationStatus;

  @Prop({ required: false, trim: true, default: '' })
  adminNotes: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const EventRegistrationSchema =
  SchemaFactory.createForClass(EventRegistration);

EventRegistrationSchema.index({ eventSlug: 1, createdAt: -1 });
EventRegistrationSchema.index(
  { eventSlug: 1, email: 1 },
  { unique: true },
);
