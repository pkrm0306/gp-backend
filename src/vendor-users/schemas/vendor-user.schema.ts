import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorUserDocument = VendorUser & Document;
export const TEAM_MEMBER_TEAMS = [
  'administrative',
  'technical',
  'finance',
  'marketing',
] as const;
export type TeamMemberTeam = (typeof TEAM_MEMBER_TEAMS)[number];

@Schema({ collection: 'users', timestamps: true })
export class VendorUser {
  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  // Legacy alias retained for backward compatibility with existing modules.
  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: false })
  vendorId?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  designation?: string;

  @Prop()
  image?: string;

  @Prop()
  facebookUrl?: string;

  @Prop()
  twitterUrl?: string;

  @Prop()
  linkedinUrl?: string;

  @Prop({ required: false, min: 1 })
  displayOrder?: number;

  @Prop({ required: false, enum: TEAM_MEMBER_TEAMS })
  team?: TeamMemberTeam;

  /** Product category ids (GET /categories `category_id`); full set for this team member. */
  @Prop({ type: [Number], default: [] })
  category_ids?: number[];

  /** Legacy primary category (first entry of category_ids when set). */
  @Prop({ required: false })
  category_id?: number;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['vendor', 'partner', 'admin', 'staff'] })
  type: string;

  @Prop({ default: 1 })
  status: number;

  @Prop()
  otp?: string;

  @Prop({ default: false })
  isVerified: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const VendorUserSchema = SchemaFactory.createForClass(VendorUser);

// Uniqueness should be per vendor/manufacturer (not global).
VendorUserSchema.index({ manufacturerId: 1, email: 1 }, { unique: true });
VendorUserSchema.index({ manufacturerId: 1, phone: 1 }, { unique: true });

/**
 * Team members: one display slot per (manufacturer, team). Requires no duplicate
 * (manufacturerId, team, displayOrder) among active staff; resolve legacy dupes before deploying.
 */
VendorUserSchema.index(
  { manufacturerId: 1, team: 1, displayOrder: 1 },
  {
    unique: true,
    name: 'uniq_staff_manufacturer_team_display_order',
    partialFilterExpression: {
      type: 'staff',
      status: { $ne: 2 },
      team: { $exists: true, $type: 'string' },
      displayOrder: { $exists: true, $gte: 1 },
    },
  },
);
