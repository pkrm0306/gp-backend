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

/**
 * Vendor portal accounts (vendor / partner / admin / staff).
 *
 * **Collection name:** legacy data lives in **`users`** (not the Mongoose default
 * `vendorusers`). Override with env **`VENDOR_USERS_MONGO_COLLECTION`** if your DB uses a
 * different collection.
 */
const vendorUsersCollectionName =
  (typeof process !== 'undefined' &&
    String(process.env.VENDOR_USERS_MONGO_COLLECTION || '').trim()) ||
  'users';

@Schema({ collection: vendorUsersCollectionName, timestamps: true })
export class VendorUser {
  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: false })
  manufacturerId?: Types.ObjectId;

  // Legacy alias retained for backward compatibility with existing modules.
  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: false })
  vendorId?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  /** Dial code stored for vendor team members (e.g. +91). */
  @Prop()
  countryCode?: string;

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

  /**
   * Sector ids (GET /api/sectors numeric `id`); admin multiselect — what the user picks.
   * Replaces legacy **category_ids** for team-member forms.
   */
  @Prop({ type: [Number], default: [] })
  sector_ids?: number[];

  /** Legacy primary sector (first entry of sector_ids when set). */
  @Prop({ required: false })
  sector_id?: number;

  /** @deprecated Use **sector_ids**. Kept for legacy queries / migration. */
  @Prop({ type: [Number], default: [] })
  category_ids?: number[];

  /** @deprecated Use **sector_id**. */
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

  /** When false, member is hidden from the public website team listing. */
  @Prop({ default: true })
  showOnWebsite?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const VendorUserSchema = SchemaFactory.createForClass(VendorUser);

VendorUserSchema.pre('validate', function vendorUserManufacturerRules(next) {
  const doc = this as VendorUser;
  const type = String(doc.type ?? '').trim().toLowerCase();
  const hasManufacturer = doc.manufacturerId != null;
  const hasVendor = doc.vendorId != null;

  if (type === 'vendor' || type === 'partner') {
    if (!hasManufacturer && !hasVendor) {
      return next(
        new Error('manufacturerId is required for vendor and partner accounts'),
      );
    }
    return next();
  }

  if (type === 'admin' || type === 'staff') {
    if (hasManufacturer || hasVendor) {
      return next(
        new Error(
          'manufacturerId and vendorId must not be set for admin and staff accounts',
        ),
      );
    }
  }

  next();
});

// Vendor/partner: unique email and phone per manufacturer.
VendorUserSchema.index(
  { manufacturerId: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: { $in: ['vendor', 'partner'] },
      manufacturerId: { $exists: true, $type: 'objectId' },
    },
  },
);
VendorUserSchema.index(
  { manufacturerId: 1, phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: { $in: ['vendor', 'partner'] },
      manufacturerId: { $exists: true, $type: 'objectId' },
    },
  },
);

// Platform admin/staff: globally unique email and phone.
VendorUserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { type: { $in: ['admin', 'staff'] } },
  },
);
VendorUserSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: { type: { $in: ['admin', 'staff'] } },
  },
);

/**
 * Team members: one display slot per team (platform staff / website team).
 */
VendorUserSchema.index(
  { team: 1, displayOrder: 1 },
  {
    unique: true,
    name: 'uniq_staff_team_display_order',
    partialFilterExpression: {
      type: 'staff',
      status: { $ne: 2 },
      team: { $exists: true, $type: 'string' },
      displayOrder: { $exists: true, $gte: 1 },
    },
  },
);
