import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  SUMMIT_SPONSOR_TIERS,
  SUMMIT_STATUSES,
  type SummitSponsorTier,
  type SummitStatus,
} from '../constants/summit.constants';

export type SummitDocument = Summit & Document;

@Schema({ _id: false })
export class SummitRichTextBlock {
  @Prop({ default: '' })
  title: string;

  @Prop({ default: '' })
  content: string;
}

@Schema({ _id: false })
export class SummitBannerItem {
  @Prop({ required: true })
  id: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: '' })
  imageUrl: string;
}

@Schema({ _id: false })
export class SummitPdfItem {
  @Prop({ required: true })
  id: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: '' })
  title: string;

  @Prop({ default: '' })
  fileUrl: string;

  @Prop({ default: '' })
  fileName: string;
}

@Schema({ _id: false })
export class SummitTextItem {
  @Prop({ required: true })
  id: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: '' })
  text: string;
}

/** Card row for Highlights / Event Outcomes tabs. */
@Schema({ _id: false })
export class SummitCardItem {
  @Prop({ required: true })
  id: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: '', maxlength: 75 })
  heading: string;

  @Prop({ default: '', maxlength: 75 })
  description: string;

  /** @deprecated legacy flat bullet — migrated to description on read */
  @Prop()
  text?: string;
}

@Schema({ _id: false })
export class SummitFocusPointItem {
  @Prop({ required: true })
  id: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: '', maxlength: 75 })
  text: string;
}

@Schema({ _id: false })
export class SummitFocusAreaCard {
  @Prop({ required: true })
  id: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: '', maxlength: 75 })
  heading: string;

  @Prop({ type: [SummitFocusPointItem], default: [] })
  points: SummitFocusPointItem[];
}

@Schema({ _id: false })
export class SummitSpeakerItem {
  @Prop({ required: true })
  id: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  designation: string;

  @Prop({ default: '' })
  organisation: string;

  @Prop({ default: '' })
  sub: string;

  @Prop({ default: '' })
  keyPoint: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: '' })
  imageUrl: string;
}

@Schema({ _id: false })
export class SummitSponsorItem {
  @Prop({ required: true })
  id: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: '' })
  name: string;

  @Prop({
    type: String,
    enum: SUMMIT_SPONSOR_TIERS,
    default: 'Partner',
  })
  tier: SummitSponsorTier;

  @Prop({ default: '' })
  logoUrl: string;
}

@Schema({
  collection: 'summits',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class Summit {
  @Prop({ required: true, trim: true })
  year: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ required: true, trim: true })
  date: string;

  @Prop({ default: '', trim: true })
  location: string;

  @Prop({
    type: String,
    enum: SUMMIT_STATUSES,
    default: 'inactive',
  })
  status: SummitStatus;

  @Prop({ type: [SummitBannerItem], default: [] })
  banners: SummitBannerItem[];

  @Prop({ type: [SummitPdfItem], default: [] })
  industrialPdfs: SummitPdfItem[];

  @Prop({ type: [SummitPdfItem], default: [] })
  buildingsPdfs: SummitPdfItem[];

  @Prop({ type: SummitRichTextBlock, default: () => ({ title: '', content: '' }) })
  aboutGreenPro: SummitRichTextBlock;

  @Prop({ type: SummitRichTextBlock, default: () => ({ title: '', content: '' }) })
  aboutSummit: SummitRichTextBlock;

  @Prop({ default: 'Highlights of GreenPro Summit' })
  highlightsTitle: string;

  @Prop({ type: [SummitCardItem], default: [] })
  highlights: SummitCardItem[];

  @Prop({ default: 'Focused Area' })
  focusedAreaTitle: string;

  @Prop({ type: [SummitFocusAreaCard], default: [] })
  focusedAreas: SummitFocusAreaCard[];

  /** @deprecated legacy flat bullets — migrated to focusedAreas on read */
  @Prop({ type: [SummitTextItem], default: [] })
  areaPoints: SummitTextItem[];

  @Prop({ default: 'Event Outcomes' })
  eventOutcomesTitle: string;

  @Prop({ type: [SummitCardItem], default: [] })
  eventOutcomes: SummitCardItem[];

  @Prop({ type: [SummitSpeakerItem], default: [] })
  speakers: SummitSpeakerItem[];

  @Prop({ default: "GreenPro's Core Agenda" })
  agendaTitle: string;

  @Prop({ type: [SummitTextItem], default: [] })
  agendaPoints: SummitTextItem[];

  /** @deprecated legacy rich-text agenda — migrated to agendaPoints on read */
  @Prop({
    type: SummitRichTextBlock,
    default: () => ({ title: "GreenPro's Core Agenda", content: '' }),
  })
  agenda: SummitRichTextBlock;

  /** @deprecated duplicate of agendaTitle — kept for legacy reads */
  @Prop()
  agendaTitleLegacy?: string;

  @Prop({ default: 'Our Sponsors & Partners' })
  sponsorsTitle: string;

  @Prop({ type: [SummitSponsorItem], default: [] })
  sponsors: SummitSponsorItem[];

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const SummitSchema = SchemaFactory.createForClass(Summit);
SummitSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
SummitSchema.index(
  { year: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
SummitSchema.index({ status: 1, year: 1, updatedAt: -1 });
SummitSchema.index({ deletedAt: 1 });
