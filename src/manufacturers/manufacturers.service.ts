import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Connection, Types } from 'mongoose';
import {
  Manufacturer,
  ManufacturerDocument,
} from './schemas/manufacturer.schema';
import { VendorContactSlot } from './schemas/vendor-contact-slot.schema';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import { matchWebsitePublicCertifiedProducts } from '../product-registration/constants/website-public-product.filter';
import {
  VendorUser,
  VendorUserDocument,
} from '../vendor-users/schemas/vendor-user.schema';
import { VendorUsersService } from '../vendor-users/vendor-users.service';
import { UpdateProfileDto } from './dto/update-manufacturer-profile.dto';
import { UpdateVendorContactsDto } from './dto/update-vendor-contacts.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ListManufacturersQueryDto } from './dto/list-manufacturers-query.dto';
import {
  resolveManufacturerScopeFilter,
  resolveVendorStatusFilter,
} from './utils/list-manufacturers-query.util';
import { matchPublicWebsiteManufacturerVisibility } from './constants/public-website-manufacturer-visibility.filter';
import {
  parseMetaKeywords,
  rawSeoMeta,
  resolveSeoMeta,
  validateSeoMetaWrite,
} from '../common/constants/seo-meta.constants';
import {
  resolvePublicUploadUrl,
  uploadFile,
} from '../utils/upload-file.util';
import {
  isAllowedVendorProfileDocumentFile,
  VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE,
} from '../common/upload/vendor-profile-document.validation';
import { ManufacturerIdGenerationService } from './manufacturer-id-generation.service';
import { EmailService } from '../common/services/email.service';
import {
  GlobalPhoneUniquenessService,
  GLOBAL_PHONE_UNAVAILABLE_MESSAGE,
} from '../common/services/global-phone-uniqueness.service';
import { buildPhoneLookupVariants, normalizePhoneDigits } from '../common/utils/phone-lookup.util';
import { AuthService } from '../auth/auth.service';
import { normalizeManufacturerName } from './manufacturer-identifier.util';
import { ZohoDealsService } from '../zoho/services/zoho-deals.service';
import { LifecycleNotificationService } from '../notifications/lifecycle-notification.service';
import { countCertifiedPlantCertificatesByManufacturerIds } from '../product-registration/helpers/certified-plant-certificate-count.util';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../product-registration/schemas/product-plant.schema';
import {
  allocateUniqueSlug,
  isValidPublicSlug,
} from '../common/utils/unique-slug.util';
import ExcelJS from 'exceljs';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Case-insensitive exact match allowing flexible whitespace between tokens. */
function companyNameExactRegex(normalizedName: string): RegExp {
  const parts = normalizeManufacturerName(normalizedName)
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegex);
  if (parts.length === 0) {
    return /^$/;
  }
  return new RegExp(`^${parts.join('\\s+')}$`, 'i');
}

function csvEscape(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** List / CSV: 0 inactive/pending, 1 verified, 2 unverified */
function manufacturerStatusLabel(status: number): string {
  switch (status) {
    case 0:
      return 'Inactive / pending';
    case 1:
      return 'Verified';
    case 2:
      return 'Unverified';
    default:
      return `Unknown (${status})`;
  }
}

/** List / CSV: 0 unverified, 1 active, 2 inactive */
function vendorStatusLabel(status: number): string {
  switch (status) {
    case 0:
      return 'Unverified';
    case 1:
      return 'Active';
    case 2:
      return 'Inactive';
    default:
      return `Unknown (${status})`;
  }
}

/** Multipart fields for vendor profile branding; stored via shared `uploadFile()` in `upload-file.util`. */
type VendorProfileBrandingMulterFiles = {
  gst?: Express.Multer.File[];
  gstDocument?: Express.Multer.File[];
  companyLogo?: Express.Multer.File[];
  pan?: Express.Multer.File[];
  panDocument?: Express.Multer.File[];
};

@Injectable()
export class ManufacturersService implements OnModuleInit {
  private readonly logger = new Logger(ManufacturersService.name);

  constructor(
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private productPlantModel: Model<ProductPlantDocument>,
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
    @InjectConnection() private connection: Connection,
    private vendorUsersService: VendorUsersService,
    private readonly manufacturerIdGeneration: ManufacturerIdGenerationService,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly globalPhoneUniqueness: GlobalPhoneUniquenessService,
    private readonly zohoDealsService: ZohoDealsService,
    @Inject(forwardRef(() => LifecycleNotificationService))
    private readonly lifecycleNotification: LifecycleNotificationService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.backfillManufacturerSlugs();
    } catch (error) {
      this.logger.warn(
        `Manufacturer slug backfill skipped: ${(error as Error)?.message || 'unknown error'}`,
      );
    }
  }

  async backfillManufacturerSlugs(): Promise<{ scanned: number; updated: number }> {
    const cursor = this.manufacturerModel
      .find({
        $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
      })
      .select('_id manufacturerName')
      .lean()
      .cursor();

    let scanned = 0;
    let updated = 0;
    for await (const doc of cursor) {
      scanned += 1;
      const slug = await this.allocateManufacturerSlug(
        String((doc as { manufacturerName?: string }).manufacturerName ?? ''),
        doc._id as Types.ObjectId,
      );
      await this.manufacturerModel
        .updateOne({ _id: doc._id }, { $set: { slug } })
        .exec();
      updated += 1;
    }
    if (updated > 0) {
      this.logger.log(
        `[manufacturers] backfilled slug on ${updated}/${scanned} manufacturer row(s)`,
      );
    }
    return { scanned, updated };
  }

  private async allocateManufacturerSlug(
    name: string,
    excludeId?: Types.ObjectId,
  ): Promise<string> {
    return allocateUniqueSlug(
      name,
      async (candidate) => {
        const filter: Record<string, unknown> = {
          slug: candidate,
          ...this.activeManufacturerNameFilter(),
        };
        if (excludeId) {
          filter._id = { $ne: excludeId };
        }
        const existing = await this.manufacturerModel
          .findOne(filter)
          .select('_id')
          .lean()
          .exec();
        return Boolean(existing);
      },
      { fallback: 'manufacturer' },
    );
  }

  /**
   * Public website: manufacturer by unique slug (must be website-visible
   * and have at least one certified public product).
   */
  async findBySlugForWebsitePublic(manufacturerSlug: string) {
    const slug = String(manufacturerSlug ?? '')
      .trim()
      .toLowerCase();
    if (!isValidPublicSlug(slug)) {
      throw new NotFoundException('Manufacturer not found');
    }

    const m = await this.manufacturerModel
      .findOne({
        slug,
        ...matchPublicWebsiteManufacturerVisibility(''),
      })
      .lean()
      .exec();
    if (!m) {
      throw new NotFoundException('Manufacturer not found');
    }

    const productCount = await this.productModel
      .countDocuments(
        matchWebsitePublicCertifiedProducts({
          manufacturerId: m._id,
        }),
      )
      .exec();
    if (productCount < 1) {
      throw new NotFoundException('Manufacturer not found');
    }

    return this.formatManufacturerApiRow(m as any, {
      productCount,
      manufacturer_product_count: productCount,
      applySeoDefa: true,
    });
  }

  async resolveManufacturerIdBySlug(
    manufacturerSlug: string,
  ): Promise<string | null> {
    const slug = String(manufacturerSlug ?? '')
      .trim()
      .toLowerCase();
    if (!isValidPublicSlug(slug)) {
      return null;
    }
    const doc = await this.manufacturerModel
      .findOne({ slug })
      .select('_id')
      .lean()
      .exec();
    return doc?._id ? String(doc._id) : null;
  }

  private normalizeVendorEmail(raw: unknown): string {
    return String(raw ?? '').trim().toLowerCase();
  }

  private normalizeProfilePhone(raw: unknown): string {
    return String(raw ?? '').trim();
  }

  /** True when the client sent a contact value that differs from any known current value. */
  private isVendorEmailChanging(
    incoming: string | undefined,
    ...currentValues: Array<string | undefined | null>
  ): boolean {
    if (incoming === undefined) {
      return false;
    }
    const normalizedIncoming = this.normalizeVendorEmail(incoming);
    if (!normalizedIncoming) {
      return false;
    }
    const currentSet = new Set(
      currentValues
        .map((value) => this.normalizeVendorEmail(value))
        .filter((value) => value.length > 0),
    );
    return !currentSet.has(normalizedIncoming);
  }

  private isVendorPhoneChanging(
    incoming: string | undefined,
    ...currentValues: Array<string | undefined | null>
  ): boolean {
    if (incoming === undefined) {
      return false;
    }
    const incomingDigits = normalizePhoneDigits(incoming);
    if (incomingDigits.length < 7) {
      return false;
    }
    const incomingKey =
      incomingDigits.length >= 10
        ? incomingDigits.slice(-10)
        : incomingDigits;
    const currentKeys = new Set(
      currentValues
        .map((value) => normalizePhoneDigits(value ?? ''))
        .filter((digits) => digits.length >= 7)
        .map((digits) =>
          digits.length >= 10 ? digits.slice(-10) : digits,
        ),
    );
    return !currentKeys.has(incomingKey);
  }

  private vendorEmailDuplicateMessage(): string {
    return 'This email id is already registered';
  }

  private manufacturerNameDuplicateMessage(): string {
    return 'Manufacturer name already exists';
  }

  private activeManufacturerNameFilter(): Record<string, unknown> {
    return {
      $or: [
        { accountDeletedAt: { $exists: false } },
        { accountDeletedAt: null },
      ],
    };
  }

  private vendorEmailCaseInsensitiveRegex(normalized: string): RegExp {
    return new RegExp(`^${escapeRegex(normalized)}$`, 'i');
  }

  /**
   * True when another non-deleted manufacturer already uses this company name.
   * Soft-deleted manufacturers (`accountDeletedAt` set) do not block the name.
   */
  async isManufacturerNameAvailable(
    manufacturerId: string | null | undefined,
    companyName: string,
    session?: ClientSession,
  ): Promise<boolean> {
    const normalized = normalizeManufacturerName(companyName);
    if (!normalized) {
      return true;
    }
    const filter: Record<string, unknown> = {
      manufacturerName: { $regex: companyNameExactRegex(normalized) },
      ...this.activeManufacturerNameFilter(),
    };
    if (manufacturerId && Types.ObjectId.isValid(manufacturerId)) {
      filter._id = { $ne: new Types.ObjectId(manufacturerId) };
    }
    const query = this.manufacturerModel
      .findOne(filter)
      .select('_id')
      .lean();
    if (session) query.session(session);
    return !(await query.exec());
  }

  /**
   * Assert manufacturer display name is free among non-deleted manufacturers.
   */
  async assertManufacturerNameAvailable(
    companyName: string,
    excludeManufacturerId?: string | Types.ObjectId | null,
    session?: ClientSession,
  ): Promise<void> {
    const excludeId =
      excludeManufacturerId != null
        ? String(excludeManufacturerId)
        : undefined;
    const available = await this.isManufacturerNameAvailable(
      excludeId,
      companyName,
      session,
    );
    if (!available) {
      throw new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        message: this.manufacturerNameDuplicateMessage(),
        fieldErrors: {
          manufacturerName: this.manufacturerNameDuplicateMessage(),
        },
      });
    }
  }

  /** Ensures login email is not used by another manufacturer or portal user account. */
  async assertVendorEmailAvailableForManufacturer(
    email: string,
    manufacturerId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<void> {
    const normalized = this.normalizeVendorEmail(email);
    if (!normalized) {
      throw new BadRequestException('vendor_email is required');
    }

    const emailRx = this.vendorEmailCaseInsensitiveRegex(normalized);
    const mfgIdStr = manufacturerId.toString();

    const mfgQuery = this.manufacturerModel
      .findOne({
        vendor_email: emailRx,
        _id: { $ne: manufacturerId },
        $or: [
          { accountDeletedAt: { $exists: false } },
          { accountDeletedAt: null },
        ],
      })
      .select('_id')
      .lean();
    if (session) mfgQuery.session(session);
    if (await mfgQuery.exec()) {
      throw new ConflictException(this.vendorEmailDuplicateMessage());
    }

    const usersQuery = this.vendorUserModel
      .find({ email: emailRx, status: { $ne: 2 } })
      .select('_id manufacturerId vendorId')
      .lean();
    if (session) usersQuery.session(session);
    const usersWithEmail = await usersQuery.exec();

    for (const row of usersWithEmail) {
      const ownerId =
        row.manufacturerId?.toString() || row.vendorId?.toString() || '';
      if (!ownerId || ownerId !== mfgIdStr) {
        throw new ConflictException(this.vendorEmailDuplicateMessage());
      }
    }
  }

  /** Returns false when another manufacturer or user already uses this email. */
  async isVendorEmailAvailableForManufacturer(
    manufacturerId: string,
    email: string,
  ): Promise<boolean> {
    try {
      await this.assertVendorEmailAvailableForManufacturer(
        email,
        new Types.ObjectId(manufacturerId),
      );
      return true;
    } catch (e) {
      if (e instanceof ConflictException) {
        return false;
      }
      throw e;
    }
  }

  /** Ensures phone is not used by another manufacturer or portal user. */
  async assertVendorPhoneAvailableForManufacturer(
    phone: string,
    manufacturerId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<void> {
    const trimmed = String(phone ?? '').trim();
    if (!trimmed) {
      throw new BadRequestException('vendor_phone is required');
    }
    const linkedUserIds =
      await this.loadLinkedVendorUserIdsForManufacturer(
        manufacturerId,
        session,
      );
    await this.globalPhoneUniqueness.assertPhoneAvailable(trimmed, {
      excludeManufacturerId: manufacturerId,
      excludeUserIds: linkedUserIds,
      session,
    });
  }

  async isVendorPhoneAvailableForManufacturer(
    manufacturerId: string,
    phone: string,
  ): Promise<boolean> {
    try {
      await this.assertVendorPhoneAvailableForManufacturer(
        phone,
        new Types.ObjectId(manufacturerId),
      );
      return true;
    } catch (e) {
      if (e instanceof ConflictException) {
        return false;
      }
      throw e;
    }
  }

  /**
   * Validates vendor email/phone in parallel and returns every conflict message
   * (so the client can show email and phone errors on one submit).
   */
  private async collectManufacturerContactConflicts(
    manufacturerId: string,
    fields: { email?: string; phone?: string },
    options?: {
      excludeUserId?: string;
      session?: ClientSession;
    },
  ): Promise<string[]> {
    const conflicts: string[] = [];
    const tasks: Array<Promise<void>> = [];

    if (fields.email !== undefined) {
      const normalized = this.normalizeVendorEmail(fields.email);
      if (!normalized) {
        conflicts.push('vendor_email is required');
      } else {
        tasks.push(
          this.isVendorEmailAvailableForManufacturer(
            manufacturerId,
            normalized,
          ).then((ok) => {
            if (!ok) {
              conflicts.push(this.vendorEmailDuplicateMessage());
            }
          }),
        );
      }
    }

    if (fields.phone !== undefined) {
      const trimmed = String(fields.phone).trim();
      if (trimmed) {
        tasks.push(
          (async () => {
            const linkedUserIds =
              await this.loadLinkedVendorUserIdsForManufacturer(
                manufacturerId,
                options?.session,
              );
            const ok = await this.globalPhoneUniqueness.isPhoneAvailable(
              trimmed,
              {
                excludeManufacturerId: manufacturerId,
                excludeUserId: options?.excludeUserId,
                excludeUserIds: linkedUserIds,
                session: options?.session,
              },
            );
            if (!ok) {
              conflicts.push(GLOBAL_PHONE_UNAVAILABLE_MESSAGE);
            }
          })(),
        );
      }
    }

    await Promise.all(tasks);
    return conflicts;
  }

  private async assertVendorPhoneAvailableForUserId(
    phone: string,
    userId: string,
    session?: ClientSession,
  ): Promise<void> {
    const trimmed = String(phone ?? '').trim();
    if (!trimmed) {
      throw new BadRequestException('Phone is required');
    }
    await this.globalPhoneUniqueness.assertPhoneAvailable(trimmed, {
      excludeUserId: userId,
      session,
    });
  }

  /** Vendor profile row without a linked manufacturer (rare). */
  private async assertVendorEmailAvailableForUserId(
    email: string,
    userId: string,
    session?: ClientSession,
  ): Promise<void> {
    const normalized = this.normalizeVendorEmail(email);
    if (!normalized) {
      throw new BadRequestException('Email is required');
    }

    const emailRx = this.vendorEmailCaseInsensitiveRegex(normalized);

    const mfgQuery = this.manufacturerModel
      .findOne({
        vendor_email: emailRx,
        $or: [
          { accountDeletedAt: { $exists: false } },
          { accountDeletedAt: null },
        ],
      })
      .select('_id')
      .lean();
    if (session) mfgQuery.session(session);
    if (await mfgQuery.exec()) {
      throw new ConflictException(this.vendorEmailDuplicateMessage());
    }

    const userFilter: Record<string, unknown> = {
      email: emailRx,
      status: { $ne: 2 },
    };
    if (Types.ObjectId.isValid(userId)) {
      userFilter._id = { $ne: new Types.ObjectId(userId) };
    }
    const usersQuery = this.vendorUserModel
      .find(userFilter)
      .select('_id')
      .limit(1)
      .lean();
    if (session) usersQuery.session(session);
    if (await usersQuery.exec()) {
      throw new ConflictException(this.vendorEmailDuplicateMessage());
    }
  }

  /**
   * Keeps vendor_users.email in sync with manufacturer.vendor_email (login uses both).
   */
  async syncVendorUserEmailsForManufacturer(
    manufacturerId: Types.ObjectId,
    newEmail: string,
    session?: ClientSession,
  ): Promise<number> {
    const normalized = this.normalizeVendorEmail(newEmail);
    if (!normalized) return 0;

    const result = await this.vendorUserModel.updateMany(
      {
        $or: [{ manufacturerId }, { vendorId: manufacturerId }],
        type: { $in: ['vendor', 'partner'] },
      },
      { $set: { email: normalized, updatedAt: new Date() } },
      session ? { session } : undefined,
    );
    return result.modifiedCount ?? 0;
  }

  /** Keeps primary vendor user `name` in sync with manufacturer.vendor_name. */
  private async syncVendorUserNamesForManufacturer(
    manufacturerId: Types.ObjectId,
    newName: string,
    session?: ClientSession,
  ): Promise<number> {
    const trimmed = String(newName ?? '').trim();
    if (!trimmed) return 0;

    const result = await this.vendorUserModel.updateMany(
      {
        $or: [{ manufacturerId }, { vendorId: manufacturerId }],
        type: 'vendor',
      },
      { $set: { name: trimmed, updatedAt: new Date() } },
      session ? { session } : undefined,
    );
    return result.modifiedCount ?? 0;
  }

  /**
   * Keeps vendor/partner users' `phone` in sync with manufacturer.vendor_phone.
   * Without this, admin phone edits leave the old number on vendor_users and block re-registration.
   */
  private async syncVendorUserPhonesForManufacturer(
    manufacturerId: Types.ObjectId,
    newPhone: string,
    session?: ClientSession,
  ): Promise<number> {
    const normalized =
      this.normalizeProfilePhone(newPhone) || String(newPhone ?? '').trim();
    if (!normalized) return 0;

    // Any vendor/partner linked to this org — free old number for re-registration.
    // Prefer type vendor/partner; also catch legacy rows missing type.
    const result = await this.vendorUserModel.updateMany(
      {
        $or: [{ manufacturerId }, { vendorId: manufacturerId }],
        $and: [
          {
            $or: [
              { type: { $in: ['vendor', 'partner'] } },
              { type: { $exists: false } },
              { type: null },
              { type: '' },
            ],
          },
        ],
      },
      { $set: { phone: normalized, updatedAt: new Date() } },
      session ? { session } : undefined,
    );
    return result.modifiedCount ?? 0;
  }

  /** Active (non-deleted) vendor/partner user ids linked to a manufacturer. */
  private async loadLinkedVendorUserIdsForManufacturer(
    manufacturerId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<Types.ObjectId[]> {
    const oid =
      manufacturerId instanceof Types.ObjectId
        ? manufacturerId
        : Types.ObjectId.isValid(String(manufacturerId))
          ? new Types.ObjectId(String(manufacturerId))
          : null;
    if (!oid) return [];

    const q = this.vendorUserModel
      .find({
        $or: [{ manufacturerId: oid }, { vendorId: oid }],
        type: { $in: ['vendor', 'partner'] },
        status: { $ne: 2 },
      })
      .select('_id')
      .lean();
    if (session) q.session(session);
    const rows = await q.exec();
    return rows
      .map((r) => r._id as Types.ObjectId)
      .filter((id): id is Types.ObjectId => Boolean(id));
  }

  /**
   * Vendor display name: use stored vendor_name unless legacy rows copied company name
   * into vendor_name — then prefer the linked vendor user's contact name.
   */
  private resolveVendorDisplayName(
    manufacturer: {
      vendor_name?: string | null;
      manufacturerName?: string | null;
    },
    primaryVendorUserName?: string,
  ): string {
    const stored = String(manufacturer.vendor_name ?? '').trim();
    const company = String(manufacturer.manufacturerName ?? '').trim();
    const userName = String(primaryVendorUserName ?? '').trim();

    if (
      userName &&
      (!stored ||
        (company && stored.toLowerCase() === company.toLowerCase()))
    ) {
      return userName;
    }
    return stored || userName;
  }

  private async loadPrimaryVendorUsersByManufacturerIds(
    ids: Types.ObjectId[],
  ): Promise<Map<string, { name: string; userId: string }>> {
    const map = new Map<string, { name: string; userId: string }>();
    if (!ids.length) return map;

    const users = await this.vendorUserModel
      .find({
        $or: [
          { manufacturerId: { $in: ids } },
          { vendorId: { $in: ids } },
        ],
        type: 'vendor',
        status: { $ne: 2 },
      })
      .select('manufacturerId vendorId name')
      .lean()
      .exec();

    for (const row of users) {
      const mid =
        row.manufacturerId?.toString() || row.vendorId?.toString() || '';
      if (!mid || map.has(mid)) continue;
      const name = String(row.name ?? '').trim();
      const userId = String(row._id ?? '').trim();
      if (name || userId) {
        map.set(mid, { name, userId });
      }
    }
    return map;
  }

  private resolveManufacturerImageUrl(
    manufacturerImage: string | null | undefined,
  ): string | null {
    return resolvePublicUploadUrl(manufacturerImage);
  }

  /** Prefer manufacturerImage; fall back to vendor companyLogo for list/detail APIs. */
  private pickManufacturerListImage(m: {
    manufacturerImage?: string | null;
    companyLogo?: string | null;
  }): string | null {
    const primary = String(m.manufacturerImage ?? '').trim();
    if (primary) {
      return this.resolveManufacturerImageUrl(primary);
    }
    const logo = String(m.companyLogo ?? '').trim();
    if (logo) {
      return this.resolveManufacturerImageUrl(logo);
    }
    return null;
  }

  private formatManufacturerApiRow(
    m: {
      _id: Types.ObjectId | string;
      manufacturerName?: string | null;
      vendor_name?: string | null;
      gpInternalId?: string | null;
      manufacturerInitial?: string | null;
      manufacturerImage?: string | null;
      companyLogo?: string | null;
      manufacturerStatus?: number | null;
      vendor_email?: string | null;
      vendor_phone?: string | null;
      vendor_status?: number | null;
      accountDeletedAt?: Date | null;
      createdAt?: Date;
      updatedAt?: Date;
    },
    options: {
      primaryVendorUserName?: string;
      primaryVendorUserId?: string;
      manufacturer_product_count?: number;
      manufacturer_vendor_count?: number;
      productCount?: number;
      certifiedPlantCount?: number;
      applySeoDefa?: boolean;
    } = {},
  ) {
    const vendorDisplay = this.resolveVendorDisplayName(
      m,
      options.primaryVendorUserName,
    );
    const iniRaw = String(m.manufacturerInitial ?? '').trim();
    const manufacturerInitial = iniRaw ? iniRaw : null;
    const mSt = Number(m.manufacturerStatus ?? 0);
    const vSt = Number(m.vendor_status ?? 0);
    const companyName = String(m.manufacturerName ?? '').trim();
    const resolvedManufacturerImage = this.pickManufacturerListImage(m);
    const resolvedCompanyLogo = this.resolveManufacturerImageUrl(m.companyLogo);
    const accountDeletedAt = m.accountDeletedAt
      ? new Date(m.accountDeletedAt)
      : null;
    const accountDeleted = Boolean(accountDeletedAt);
    const seoSource = {
      meta_title: (m as { meta_title?: string | null }).meta_title,
      meta_description: (m as { meta_description?: string | null })
        .meta_description,
      meta_image: (m as { meta_image?: string | null }).meta_image,
      meta_keywords: (m as { meta_keywords?: string[] | string | null })
        .meta_keywords,
      primaryImage: resolvedManufacturerImage,
    };
    const seo = options.applySeoDefa
      ? resolveSeoMeta(seoSource)
      : rawSeoMeta(seoSource);

    return {
      _id: m._id,
      manufacturerName: companyName,
      /** Company / organization name (admin grid "Manufacturer Name"). */
      companyName,
      slug: String((m as { slug?: string | null }).slug ?? '').trim() || null,
      gpInternalId: m.gpInternalId ?? null,
      manufacturerInitial,
      initial: manufacturerInitial,
      manufacturerImage: resolvedManufacturerImage,
      manufacturerImageUrl: resolvedManufacturerImage,
      manufacturer_image: resolvedManufacturerImage,
      companyLogo: resolvedCompanyLogo,
      companyLogoUrl: resolvedCompanyLogo,
      manufacturerStatus: mSt,
      manufacturerStatusLabel: manufacturerStatusLabel(mSt),
      vendor_name: vendorDisplay,
      /** Primary contact name — not the company name. */
      vendorName: vendorDisplay,
      vendorUserId: options.primaryVendorUserId ?? null,
      vendor_email: m.vendor_email ?? '',
      vendor_phone: m.vendor_phone ?? '',
      vendor_status: vSt,
      vendorStatusLabel: vendorStatusLabel(vSt),
      statusToggle: vSt === 1 ? ('On' as const) : ('Off' as const),
      deactivationRemark:
        String(
          (m as { deactivationRemark?: string | null }).deactivationRemark ??
            '',
        ).trim() || null,
      accountDeleted,
      accountDeletedAt,
      manufacturer_product_count: options.manufacturer_product_count,
      manufacturer_vendor_count: options.manufacturer_vendor_count,
      ...(options.certifiedPlantCount !== undefined
        ? { certifiedPlantCount: options.certifiedPlantCount }
        : {}),
      ...(options.productCount !== undefined
        ? { productCount: options.productCount }
        : {}),
      ...seo,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    };
  }

  async findByIdForApi(id: string) {
    const manufacturer = await this.findById(id);
    if (!manufacturer) return null;

    const primaryVendors = await this.loadPrimaryVendorUsersByManufacturerIds([
      manufacturer._id,
    ]);
    const primaryVendor = primaryVendors.get(manufacturer._id.toString());
    const counts = await this.countForManufacturer(manufacturer._id);
    return this.formatManufacturerApiRow(manufacturer, {
      primaryVendorUserName: primaryVendor?.name,
      primaryVendorUserId: primaryVendor?.userId,
      manufacturer_product_count: counts.manufacturer_product_count,
      manufacturer_vendor_count: counts.manufacturer_vendor_count,
    });
  }

  /**
   * New random login password for all vendor/partner users on a manufacturer (admin email change).
   */
  private async resetVendorLoginPasswordsForManufacturer(
    manufacturerId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<string> {
    const plainPassword = crypto.randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    await this.vendorUserModel.updateMany(
      {
        $or: [{ manufacturerId }, { vendorId: manufacturerId }],
        type: { $in: ['vendor', 'partner'] },
      },
      { $set: { password: passwordHash, updatedAt: new Date() } },
      session ? { session } : undefined,
    );
    return plainPassword;
  }

  async create(
    data: Partial<Manufacturer>,
    session?: ClientSession,
  ): Promise<ManufacturerDocument> {
    const payload: Partial<Manufacturer> = { ...data };
    if (!String(payload.slug ?? '').trim()) {
      payload.slug = await this.allocateManufacturerSlug(
        String(payload.manufacturerName ?? ''),
      );
      payload.slugLocked = false;
    }
    const manufacturer = new this.manufacturerModel(payload);
    if (session) {
      return manufacturer.save({ session });
    }
    return manufacturer.save();
  }

  /**
   * Called after vendor email OTP succeeds so admin **unverified** lists can include this manufacturer.
   */
  async markVendorPortalEmailVerified(manufacturerId: string): Promise<void> {
    let oid: Types.ObjectId;
    try {
      oid = new Types.ObjectId(manufacturerId);
    } catch {
      return;
    }
    await this.manufacturerModel
      .updateOne({ _id: oid }, { $set: { vendorPortalEmailVerified: true } })
      .exec();
  }

  /**
   * Persists **gpInternalId** + **manufacturerInitial** when a manufacturer is verified.
   * Unverified (pending) manufacturers must not receive IDs at registration or edit.
   */
  async assignAutoGpIdentifiersOnVerification(
    manufacturerId: string,
    displayName: string,
    session: ClientSession,
  ): Promise<void> {
    const oid = new Types.ObjectId(manufacturerId);
    const existing = await this.manufacturerModel
      .findById(oid)
      .session(session)
      .exec();
    if (!existing) {
      throw new NotFoundException('Manufacturer not found');
    }
    const nameForGen =
      String(displayName ?? '').trim() ||
      String(existing.manufacturerName ?? '').trim();
    if (!nameForGen) {
      throw new BadRequestException(
        'Manufacturer name is required for GP id allocation',
      );
    }

    // Already has a valid pair — keep it (e.g. legacy rows assigned before this rule).
    const existingIni = String(existing.manufacturerInitial ?? '').trim();
    const existingGp = String(existing.gpInternalId ?? '').trim();
    if (existingIni && existingGp) {
      return;
    }

    const auto =
      await this.manufacturerIdGeneration.resolveAutoIdentifiersForUnverified(
        nameForGen,
        existing._id,
        {
          manufacturerName: existing.manufacturerName,
          manufacturerInitial: existing.manufacturerInitial,
          gpInternalId: existing.gpInternalId,
        },
        session,
      );

    try {
      const dupInitial = await this.manufacturerModel
        .findOne({
          manufacturerInitial: auto.manufacturerInitial,
          _id: { $ne: existing._id },
        })
        .session(session)
        .select('_id')
        .lean()
        .exec();
      if (dupInitial) {
        throw new ConflictException(
          'manufacturerInitial already exists on another manufacturer',
        );
      }
      const dupGp = await this.manufacturerModel
        .findOne({
          gpInternalId: auto.gpInternalId,
          _id: { $ne: existing._id },
        })
        .session(session)
        .select('_id')
        .lean()
        .exec();
      if (dupGp) {
        throw new ConflictException(
          'gpInternalId already exists on another manufacturer',
        );
      }

      await this.manufacturerModel
        .findByIdAndUpdate(
          oid,
          {
            manufacturerInitial: auto.manufacturerInitial,
            gpInternalId: auto.gpInternalId,
            updatedAt: new Date(),
          },
          { session, new: true },
        )
        .exec();
    } catch (e) {
      await this.manufacturerIdGeneration.reconcileSequentialStateFromManufacturers(
        session,
      );
      throw e;
    }
  }

  async findById(id: string): Promise<ManufacturerDocument | null> {
    return this.manufacturerModel.findById(id).exec();
  }

  async findByVendorEmail(email: string): Promise<ManufacturerDocument | null> {
    const normalized = String(email ?? '').trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    const notSoftDeleted = {
      $or: [
        { accountDeletedAt: { $exists: false } },
        { accountDeletedAt: null },
      ],
    };
    const exact = await this.manufacturerModel
      .findOne({ vendor_email: normalized, ...notSoftDeleted })
      .exec();
    if (exact) {
      return exact;
    }
    return this.manufacturerModel
      .findOne({
        vendor_email: {
          $regex: new RegExp(`^${escapeRegex(normalized)}$`, 'i'),
        },
        ...notSoftDeleted,
      })
      .exec();
  }

  async findByVendorPhone(
    phone: string,
  ): Promise<ManufacturerDocument | null> {
    const normalized = String(phone ?? '').trim();
    if (!normalized) {
      return null;
    }
    const variants = buildPhoneLookupVariants(normalized);
    if (!variants.length) {
      return null;
    }
    return this.manufacturerModel
      .findOne({ vendor_phone: { $in: variants } })
      .exec();
  }

  async findByCompanyName(
    companyName: string,
  ): Promise<ManufacturerDocument | null> {
    const normalized = normalizeManufacturerName(companyName);
    if (!normalized) {
      return null;
    }
    return this.manufacturerModel
      .findOne({
        manufacturerName: { $regex: companyNameExactRegex(normalized) },
        ...this.activeManufacturerNameFilter(),
      })
      .exec();
  }

  async update(
    id: string,
    data: Partial<Manufacturer>,
    session?: ClientSession,
  ): Promise<ManufacturerDocument | null> {
    const options = session ? { session, new: true } : { new: true };
    return this.manufacturerModel.findByIdAndUpdate(id, data, options).exec();
  }

  async getProfile(manufacturerId: string) {
    const manufacturer = await this.findById(manufacturerId);
    if (!manufacturer) {
      throw new BadRequestException('Manufacturer not found');
    }
    return manufacturer;
  }

  /**
   * Resolve vendor-facing profile using login auth user id -> users.manufacturerId -> manufacturers doc.
   */
  async getVendorDetailsByAuthUserId(userId: string) {
    const vendorUser = await this.vendorUsersService.findById(userId);
    if (!vendorUser) {
      throw new NotFoundException('Vendor user not found');
    }

    const manufacturerId =
      vendorUser.manufacturerId?.toString() || vendorUser.vendorId?.toString();
    if (!manufacturerId) {
      throw new NotFoundException('Manufacturer mapping not found for user');
    }

    const manufacturer = await this.manufacturerModel
      .findById(manufacturerId)
      .lean()
      .exec();
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    const showGpIdentifiers = Boolean(vendorUser.isVerified);

    const vendorDisplay = this.resolveVendorDisplayName(
      manufacturer,
      vendorUser.name,
    );

    return {
      _id: manufacturer._id,
      manufacturerName: manufacturer.manufacturerName,
      companyName: manufacturer.manufacturerName ?? '',
      gpInternalId: showGpIdentifiers
        ? (manufacturer.gpInternalId ?? null)
        : null,
      manufacturerInitial: showGpIdentifiers
        ? (manufacturer.manufacturerInitial ?? null)
        : null,
      manufacturerImage:
        this.pickManufacturerListImage({
          manufacturerImage: manufacturer.manufacturerImage,
          companyLogo: manufacturer.companyLogo,
        }) ?? null,
      manufacturerStatus: manufacturer.manufacturerStatus ?? 0,
      vendor_name: vendorDisplay,
      vendorName: vendorDisplay,
      vendor_email: manufacturer.vendor_email ?? '',
      vendor_phone: manufacturer.vendor_phone ?? '',
      vendor_website: manufacturer.vendor_website ?? '',
      vendor_facebook: manufacturer.vendor_facebook ?? '',
      vendor_youtube: manufacturer.vendor_youtube ?? '',
      vendor_twitter: manufacturer.vendor_twitter ?? '',
      vendor_linkedin: manufacturer.vendor_linkedin ?? '',
      vendor_whatsapp: manufacturer.vendor_whatsapp ?? '',
      facebook: manufacturer.vendor_facebook ?? '',
      youtube: manufacturer.vendor_youtube ?? '',
      twitter: manufacturer.vendor_twitter ?? '',
      linkedin: manufacturer.vendor_linkedin ?? '',
      whatsapp: manufacturer.vendor_whatsapp ?? '',
      facebookUrl: manufacturer.vendor_facebook ?? '',
      youtubeUrl: manufacturer.vendor_youtube ?? '',
      twitterUrl: manufacturer.vendor_twitter ?? '',
      linkedinUrl: manufacturer.vendor_linkedin ?? '',
      whatsappUrl: manufacturer.vendor_whatsapp ?? '',
      whatsapp_url: manufacturer.vendor_whatsapp ?? '',
      vendor_designation: manufacturer.vendor_designation ?? '',
      vendor_gst: manufacturer.vendor_gst ?? '',
      gstPdf: manufacturer.vendorGstPdf ?? '',
      companyLogo: manufacturer.companyLogo ?? '',
      vendor_status: manufacturer.vendor_status ?? 0,
      companySize: manufacturer.companySize ?? '',
      pan: manufacturer.vendorPanDocument ?? '',
      panNumber: manufacturer.vendorPan ?? '',
      technicalContact: this.mapVendorContactSlot(
        manufacturer.technicalContact as VendorContactSlot | undefined,
      ),
      marketingContact: this.mapVendorContactSlot(
        manufacturer.marketingContact as VendorContactSlot | undefined,
      ),
      createdAt: manufacturer.createdAt,
      updatedAt: manufacturer.updatedAt,
    };
  }

  private toProfilePayloadShape(manufacturer: ManufacturerDocument | Manufacturer) {
    return {
      companyName: manufacturer.manufacturerName ?? '',
      name: manufacturer.vendor_name ?? '',
      designation: manufacturer.vendor_designation ?? '',
      gst: manufacturer.vendor_gst ?? '',
      gstPdf: manufacturer.vendorGstPdf ?? '',
      companyLogo: manufacturer.companyLogo ?? '',
      pan: manufacturer.vendorPanDocument ?? '',
      panNumber: manufacturer.vendorPan ?? '',
      email: manufacturer.vendor_email ?? '',
      mobile: manufacturer.vendor_phone ?? '',
      facebook: manufacturer.vendor_facebook ?? '',
      youtube: manufacturer.vendor_youtube ?? '',
      twitter: manufacturer.vendor_twitter ?? '',
      linkedin: manufacturer.vendor_linkedin ?? '',
      whatsapp: manufacturer.vendor_whatsapp ?? '',
      facebookUrl: manufacturer.vendor_facebook ?? '',
      youtubeUrl: manufacturer.vendor_youtube ?? '',
      twitterUrl: manufacturer.vendor_twitter ?? '',
      linkedinUrl: manufacturer.vendor_linkedin ?? '',
      whatsappUrl: manufacturer.vendor_whatsapp ?? '',
      whatsapp_url: manufacturer.vendor_whatsapp ?? '',
    };
  }

  /** Vendor panel may send `facebookUrl` / `linkedin_url` etc.; normalize to canonical keys for persistence. */
  private normalizeVendorProfileSocialLinks(
    dto: UpdateProfileDto,
  ): UpdateProfileDto {
    const pairs: Array<{
      canonical: keyof Pick<
        UpdateProfileDto,
        'facebook' | 'youtube' | 'twitter' | 'linkedin' | 'whatsapp'
      >;
      aliases: Array<
        keyof Pick<
          UpdateProfileDto,
          | 'facebookUrl'
          | 'facebook_url'
          | 'youtubeUrl'
          | 'youtube_url'
          | 'twitterUrl'
          | 'twitter_url'
          | 'linkedinUrl'
          | 'linkedin_url'
          | 'whatsappUrl'
          | 'whatsapp_url'
        >
      >;
    }> = [
      { canonical: 'facebook', aliases: ['facebookUrl', 'facebook_url'] },
      { canonical: 'youtube', aliases: ['youtubeUrl', 'youtube_url'] },
      { canonical: 'twitter', aliases: ['twitterUrl', 'twitter_url'] },
      { canonical: 'linkedin', aliases: ['linkedinUrl', 'linkedin_url'] },
      { canonical: 'whatsapp', aliases: ['whatsappUrl', 'whatsapp_url'] },
    ];

    const out = { ...dto };
    for (const { canonical, aliases } of pairs) {
      if (out[canonical] !== undefined) {
        continue;
      }
      for (const alias of aliases) {
        if (out[alias] !== undefined) {
          out[canonical] = out[alias];
          break;
        }
      }
    }
    return out;
  }

  private emptyVendorContactSlot() {
    return {
      name: '',
      email_id: '',
      phone_number: '',
      designation: '',
    };
  }

  private mapVendorContactSlot(
    slot?: VendorContactSlot | Record<string, unknown> | null,
  ) {
    if (!slot) {
      return this.emptyVendorContactSlot();
    }
    const s = slot as Record<string, unknown>;
    return {
      name: String(s.name ?? '').trim(),
      email_id: String(s.email_id ?? '').trim(),
      phone_number: String(s.phone_number ?? '').trim(),
      designation: String(s.designation ?? '').trim(),
    };
  }

  private looksLikeVendorAssetUrl(value: string): boolean {
    const t = String(value ?? '').trim();
    if (!t) return false;
    return t.startsWith('/') || /^https?:\/\//i.test(t);
  }

  private normalizeIndianPan(value: string): string {
    return String(value ?? '').trim().toUpperCase();
  }

  private normalizeIndianGstin(value: string): string {
    return String(value ?? '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '');
  }

  /** GST / tax id text for storage — trim, uppercase, no format checks. */
  private normalizeGstNumberForStorage(raw: string): string {
    return this.normalizeIndianGstin(raw).slice(0, 64);
  }

  private partitionGstAndPdfFromUpdateDto(updateDto: UpdateProfileDto): {
    gstNumberToApply: string;
    gstPdfToApply?: string;
  } {
    const rawGst =
      updateDto.gst !== undefined ? String(updateDto.gst).trim() : '';
    const rawGstNumber =
      updateDto.gstNumber !== undefined
        ? String(updateDto.gstNumber).trim()
        : '';
    let gstNumberToApply = rawGstNumber;
    let gstPdfToApply: string | undefined;
    if (rawGst && this.looksLikeVendorAssetUrl(rawGst)) {
      gstPdfToApply = rawGst;
    } else if (rawGst) {
      gstNumberToApply = gstNumberToApply || rawGst;
    }
    return { gstNumberToApply, gstPdfToApply };
  }

  private async resolveManufacturerForVendorProfile(
    authUser:
      | string
      | { userId: string; manufacturerId?: string; vendorId?: string },
  ): Promise<{
    resolvedManufacturer: ManufacturerDocument | null;
    vendorUser: VendorUserDocument | null;
  }> {
    const userId = typeof authUser === 'string' ? authUser : authUser.userId;
    const manufacturerIdFromToken =
      typeof authUser === 'string'
        ? ''
        : String(authUser.manufacturerId || authUser.vendorId || '').trim();

    const manufacturerFromToken =
      manufacturerIdFromToken && Types.ObjectId.isValid(manufacturerIdFromToken)
        ? await this.manufacturerModel.findById(manufacturerIdFromToken).exec()
        : null;

    const vendorUser = await this.vendorUsersService.findById(userId);

    const mappedManufacturerId =
      vendorUser?.manufacturerId?.toString() ||
      vendorUser?.vendorId?.toString() ||
      '';

    const manufacturer = mappedManufacturerId
      ? await this.manufacturerModel.findById(mappedManufacturerId).exec()
      : null;

    const fallbackManufacturer =
      !manufacturer && Types.ObjectId.isValid(userId)
        ? await this.manufacturerModel.findById(userId).exec()
        : null;

    const fallbackByContact =
      !manufacturer &&
      !fallbackManufacturer &&
      vendorUser &&
      (vendorUser.email || vendorUser.phone)
        ? await this.manufacturerModel
            .findOne({
              $or: [
                ...(vendorUser.email
                  ? [{ vendor_email: String(vendorUser.email).trim() }]
                  : []),
                ...(vendorUser.phone
                  ? [{ vendor_phone: String(vendorUser.phone).trim() }]
                  : []),
              ],
            })
            .exec()
        : null;

    // Prefer vendor-users.manufacturerId (same as GET /api/vendor/profile) over JWT
    // manufacturerId, which can be stale and would save profile to the wrong row.
    const resolvedManufacturer =
      manufacturer ||
      manufacturerFromToken ||
      fallbackManufacturer ||
      fallbackByContact;

    return { resolvedManufacturer, vendorUser };
  }

  /** Public wrapper used by dashboard and other modules. */
  async resolveManufacturerForAuthUser(
    authUser:
      | string
      | { userId: string; manufacturerId?: string; vendorId?: string },
  ) {
    return this.resolveManufacturerForVendorProfile(authUser);
  }

  /**
   * Vendor dashboard gate — GST (number or certificate PDF), designation, and phone.
   * Falls back to vendor-users row when manufacturer text fields were only saved there.
   */
  isVendorAccountProfileComplete(
    manufacturer: ManufacturerDocument | Manufacturer | null | undefined,
    vendorUser?: VendorUserDocument | null,
  ): boolean {
    const gst =
      String(manufacturer?.vendor_gst ?? '').trim() ||
      String(manufacturer?.vendorGstPdf ?? '').trim();
    const designation =
      String(manufacturer?.vendor_designation ?? '').trim() ||
      String(vendorUser?.designation ?? '').trim();
    const phone =
      String(manufacturer?.vendor_phone ?? '').trim() ||
      String(vendorUser?.phone ?? '').trim();
    return Boolean(gst && designation && phone);
  }

  /**
   * Many clients send both `pan` and `panDocument` (or `gst` + `gstDocument`); the first slot
   * is often an empty file part. Prefer **document** field names, then any slice with bytes.
   */
  private pickVendorProfileUploadSlice(
    files: VendorProfileBrandingMulterFiles | undefined,
    fieldOrder: (keyof VendorProfileBrandingMulterFiles)[],
  ): Express.Multer.File | undefined {
    if (!files) {
      return undefined;
    }
    const slices = fieldOrder
      .map((k) => files[k]?.[0])
      .filter((f): f is Express.Multer.File => !!f);
    const withBytes = slices.find((f) => this.multerFileByteLength(f) > 0);
    if (withBytes) {
      return withBytes;
    }
    return slices[0];
  }

  /** Multer file groups for vendor GST logo / PAN (field aliases supported). */
  private vendorProfileBrandingMulterFiles(files?: VendorProfileBrandingMulterFiles) {
    return {
      gstFile: this.pickVendorProfileUploadSlice(files, [
        'gstDocument',
        'gst',
      ]),
      logoFile: files?.companyLogo?.[0],
      panFile: this.pickVendorProfileUploadSlice(files, [
        'panDocument',
        'pan',
      ]),
    };
  }

  private multerFileByteLength(file: Express.Multer.File): number {
    if (typeof file.size === 'number' && file.size > 0) {
      return file.size;
    }
    return file.buffer?.length ?? 0;
  }

  /**
   * Multipart text fields sometimes land on `req.body` but not on the validated DTO.
   * Fills only keys that are missing or blank on `dto` from `raw` (never overwrites non-empty values).
   */
  mergeVendorProfileDtoFromRawBody(
    dto: UpdateProfileDto,
    raw?: Record<string, unknown>,
  ): UpdateProfileDto {
    if (!raw || typeof raw !== 'object') {
      return dto;
    }
    const out = { ...dto } as UpdateProfileDto & Record<string, unknown>;
    const isBlank = (v: unknown) =>
      v === undefined ||
      v === null ||
      (typeof v === 'string' && v.trim() === '');

    const readRaw = (key: string): string | undefined => {
      const rawVal = raw[key];
      if (rawVal === undefined || rawVal === null) {
        return undefined;
      }
      if (Array.isArray(rawVal)) {
        const first = rawVal[0];
        return typeof first === 'string' ? first.trim() : String(first ?? '').trim();
      }
      return typeof rawVal === 'string' ? rawVal.trim() : String(rawVal).trim();
    };

    const fill = (key: keyof UpdateProfileDto) => {
      if (!isBlank(out[key])) {
        return;
      }
      const s = readRaw(key as string);
      if (s === undefined || s === '') {
        return;
      }
      out[key] = s as never;
    };

    (
      [
        'companyName',
        'name',
        'designation',
        'gst',
        'companyLogo',
        'pan',
        'email',
        'mobile',
        'facebook',
        'facebookUrl',
        'facebook_url',
        'youtube',
        'youtubeUrl',
        'youtube_url',
        'twitter',
        'twitterUrl',
        'twitter_url',
        'linkedin',
        'linkedinUrl',
        'linkedin_url',
        'whatsapp',
        'whatsappUrl',
        'whatsapp_url',
      ] as (keyof UpdateProfileDto)[]
    ).forEach(fill);

    return this.normalizeVendorProfileSocialLinks(out as UpdateProfileDto);
  }

  /**
   * Persists vendor branding files only through the shared `uploadFile()` helper
   * in `upload-file.util` (`uploads/manufacturers/` locally or S3 when configured).
   */
  private async uploadVendorBrandingMulterFile(
    file: Express.Multer.File,
    label: string,
  ): Promise<string> {
    if (this.multerFileByteLength(file) <= 0) {
      throw new BadRequestException(
        `${label} file is empty or unreadable. Pick the file again in the browser (replayed curl without binary body will not upload).`,
      );
    }
    try {
      return (await uploadFile(file, 'manufacturers')).fileUrl;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('requires file buffer')) {
        throw new BadRequestException(
          `${label} could not be read or is empty. Re-select the file and retry.`,
        );
      }
      throw e;
    }
  }

  private async vendorBrandingFileUrlsFromUploadFile(
    files?: VendorProfileBrandingMulterFiles,
  ): Promise<Partial<Pick<UpdateProfileDto, 'gst' | 'companyLogo' | 'pan'>>> {
    const { gstFile, logoFile, panFile } =
      this.vendorProfileBrandingMulterFiles(files);
    const out: Partial<Pick<UpdateProfileDto, 'gst' | 'companyLogo' | 'pan'>> = {};
    if (gstFile) {
      if (!isAllowedVendorProfileDocumentFile(gstFile)) {
        throw new BadRequestException(VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE);
      }
      out.gst = await this.uploadVendorBrandingMulterFile(
        gstFile,
        'GST certificate',
      );
    }
    if (logoFile) {
      out.companyLogo = await this.uploadVendorBrandingMulterFile(
        logoFile,
        'Company logo',
      );
    }
    if (panFile) {
      if (!isAllowedVendorProfileDocumentFile(panFile)) {
        throw new BadRequestException(VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE);
      }
      out.pan = await this.uploadVendorBrandingMulterFile(panFile, 'PAN document');
    }
    return out;
  }

  async uploadVendorProfileBranding(
    authUser: { userId: string; manufacturerId?: string; vendorId?: string },
    files?: VendorProfileBrandingMulterFiles,
  ) {
    const dto = await this.vendorBrandingFileUrlsFromUploadFile(files);
    if (!dto.gst && !dto.companyLogo && !dto.pan) {
      throw new BadRequestException(
        'Send at least one file: **gst** / **gstDocument** (PDF, JPG, or PNG only), **companyLogo** (image), and/or **pan** / **panDocument** (PDF, JPG, or PNG only).',
      );
    }
    return this.editProfile(authUser, dto as UpdateProfileDto);
  }

  /**
   * Same as {@link editProfile} but merges optional multipart files into the DTO
   * (used by PATCH /api/vendor/profile with multipart). Field aliases: **gstDocument** → gst, **panDocument** → pan.
   * Files are stored only via the shared `uploadFile()` helper (`upload-file.util`).
   */
  async editProfileWithOptionalBrandingFiles(
    authUser: { userId: string; manufacturerId?: string; vendorId?: string },
    updateDto: UpdateProfileDto,
    files?: VendorProfileBrandingMulterFiles,
    rawBody?: Record<string, unknown>,
  ) {
    const mergedText = this.mergeVendorProfileDtoFromRawBody(updateDto, rawBody);
    const fromFiles = await this.vendorBrandingFileUrlsFromUploadFile(files);
    return this.editProfile(authUser, { ...mergedText, ...fromFiles });
  }

  async editProfile(
    authUser:
      | string
      | { userId: string; manufacturerId?: string; vendorId?: string },
    updateDto: UpdateProfileDto,
  ) {
    updateDto = this.normalizeVendorProfileSocialLinks(updateDto);
    const userId = typeof authUser === 'string' ? authUser : authUser.userId;
    const { gstNumberToApply: rawGstinFromPartition, gstPdfToApply } =
      this.partitionGstAndPdfFromUpdateDto(updateDto);
    const gstNumberToApply = this.normalizeGstNumberForStorage(
      rawGstinFromPartition,
    );

    const rawPanField =
      updateDto.pan !== undefined ? String(updateDto.pan).trim() : '';
    const rawPanNumberOnly =
      updateDto.panNumber !== undefined
        ? String(updateDto.panNumber).trim()
        : '';

    let panNumberToApply = '';
    if (rawPanNumberOnly) {
      panNumberToApply = this.normalizeIndianPan(rawPanNumberOnly);
    }

    let panDocUrlToApply: string | undefined;

    if (rawPanField) {
      if (this.looksLikeVendorAssetUrl(rawPanField)) {
        panDocUrlToApply = rawPanField;
      } else if (rawPanField && !panNumberToApply) {
        panNumberToApply = this.normalizeIndianPan(rawPanField);
      }
    }

    const brandingAttempted =
      updateDto.companyLogo !== undefined ||
      gstPdfToApply !== undefined ||
      panDocUrlToApply !== undefined;

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { resolvedManufacturer, vendorUser } =
        await this.resolveManufacturerForVendorProfile(authUser);

      if (resolvedManufacturer) {
        const emailChanging = this.isVendorEmailChanging(
          updateDto.email,
          resolvedManufacturer.vendor_email,
          vendorUser?.email,
        );
        const phoneChanging = this.isVendorPhoneChanging(
          updateDto.mobile,
          resolvedManufacturer.vendor_phone,
          vendorUser?.phone,
        );
        const profileContactConflicts =
          await this.collectManufacturerContactConflicts(
            resolvedManufacturer._id.toString(),
            {
              email: emailChanging ? updateDto.email : undefined,
              phone: phoneChanging ? updateDto.mobile : undefined,
            },
            { excludeUserId: userId, session },
          );
        if (profileContactConflicts.length > 0) {
          throw new ConflictException(profileContactConflicts);
        }
      }

      if (!resolvedManufacturer) {
        if (brandingAttempted) {
          throw new BadRequestException(
            'Company logo, GST certificate, and PAN document require a linked manufacturer profile.',
          );
        }
        const vendorUserUpdate: Partial<VendorUser> = {};
        if (updateDto.name !== undefined) {
          vendorUserUpdate.name = updateDto.name;
        }
        if (updateDto.designation !== undefined) {
          vendorUserUpdate.designation = updateDto.designation;
        }
        if (
          this.isVendorEmailChanging(updateDto.email, vendorUser?.email)
        ) {
          const newEmail = this.normalizeVendorEmail(updateDto.email);
          await this.assertVendorEmailAvailableForUserId(
            newEmail,
            userId,
            session,
          );
          vendorUserUpdate.email = newEmail;
        }
        if (this.isVendorPhoneChanging(updateDto.mobile, vendorUser?.phone)) {
          const newPhone = this.normalizeProfilePhone(updateDto.mobile);
          await this.assertVendorPhoneAvailableForUserId(
            newPhone,
            userId,
            session,
          );
          vendorUserUpdate.phone = newPhone;
        }

        if (Object.keys(vendorUserUpdate).length > 0) {
          try {
            await this.vendorUserModel
              .findByIdAndUpdate(userId, vendorUserUpdate, { new: true, session })
              .exec();
          } catch (e: unknown) {
            if ((e as { code?: number })?.code === 11000) {
              throw new ConflictException(this.vendorEmailDuplicateMessage());
            }
            throw e;
          }
        }

        await session.commitTransaction();
        const vendorOnlyGst = gstNumberToApply || '';
        return {
          companyName: updateDto.companyName ?? '',
          name: updateDto.name ?? vendorUser?.name ?? '',
          designation: updateDto.designation ?? vendorUser?.designation ?? '',
          gst: vendorOnlyGst,
          gstPdf: '',
          companyLogo: '',
          pan: '',
          panNumber: panNumberToApply || '',
          email: updateDto.email ?? vendorUser?.email ?? '',
          mobile: updateDto.mobile ?? vendorUser?.phone ?? '',
          facebook:
            updateDto.facebook ??
            updateDto.facebookUrl ??
            updateDto.facebook_url ??
            '',
          youtube:
            updateDto.youtube ??
            updateDto.youtubeUrl ??
            updateDto.youtube_url ??
            '',
          twitter:
            updateDto.twitter ??
            updateDto.twitterUrl ??
            updateDto.twitter_url ??
            '',
          linkedin:
            updateDto.linkedin ??
            updateDto.linkedinUrl ??
            updateDto.linkedin_url ??
            '',
          whatsapp:
            updateDto.whatsapp ??
            updateDto.whatsappUrl ??
            updateDto.whatsapp_url ??
            '',
          facebookUrl:
            updateDto.facebook ??
            updateDto.facebookUrl ??
            updateDto.facebook_url ??
            '',
          youtubeUrl:
            updateDto.youtube ??
            updateDto.youtubeUrl ??
            updateDto.youtube_url ??
            '',
          twitterUrl:
            updateDto.twitter ??
            updateDto.twitterUrl ??
            updateDto.twitter_url ??
            '',
          linkedinUrl:
            updateDto.linkedin ??
            updateDto.linkedinUrl ??
            updateDto.linkedin_url ??
            '',
          whatsappUrl:
            updateDto.whatsapp ??
            updateDto.whatsappUrl ??
            updateDto.whatsapp_url ??
            '',
          whatsapp_url:
            updateDto.whatsapp ??
            updateDto.whatsappUrl ??
            updateDto.whatsapp_url ??
            '',
          linkedin_url:
            updateDto.linkedin ??
            updateDto.linkedinUrl ??
            updateDto.linkedin_url ??
            '',
        };
      }

      if (gstNumberToApply) {
        const gstExists = await this.manufacturerModel
          .findOne({
            _id: { $ne: resolvedManufacturer._id },
            vendor_gst: gstNumberToApply,
          })
          .select('_id')
          .lean()
          .exec();
        if (gstExists) {
          throw new BadRequestException(
            'GST number already exists. Please change it.',
          );
        }
      }

      if (panNumberToApply) {
        const panExists = await this.manufacturerModel
          .findOne({
            _id: { $ne: resolvedManufacturer._id },
            vendorPan: panNumberToApply,
          })
          .select('_id')
          .lean()
          .exec();
        if (panExists) {
          throw new BadRequestException(
            'PAN number already exists for another vendor.',
          );
        }
      }

      const updateData: Partial<Manufacturer> = {};
      if (updateDto.companyName) {
        const nextCompanyName = normalizeManufacturerName(updateDto.companyName);
        const prevCompanyName = normalizeManufacturerName(
          String(resolvedManufacturer.manufacturerName ?? ''),
        );
        if (nextCompanyName && nextCompanyName !== prevCompanyName) {
          await this.assertManufacturerNameAvailable(
            nextCompanyName,
            resolvedManufacturer._id,
          );
        }
        if (nextCompanyName) {
          updateData.manufacturerName = nextCompanyName;
        }
      }
      if (updateDto.name) {
        updateData.vendor_name = updateDto.name;
      }
      if (updateDto.designation !== undefined) {
        updateData.vendor_designation = String(updateDto.designation).trim();
      }
      if (gstNumberToApply) {
        updateData.vendor_gst = gstNumberToApply;
      }
      if (gstPdfToApply !== undefined) {
        updateData.vendorGstPdf = gstPdfToApply;
      }
      if (updateDto.companyLogo !== undefined) {
        const logo = String(updateDto.companyLogo).trim();
        if (logo) {
          updateData.companyLogo = logo;
          // Keep list/image fields in sync when vendor uploads a logo and no profile image exists yet.
          if (!String(resolvedManufacturer.manufacturerImage ?? '').trim()) {
            updateData.manufacturerImage = logo;
          }
        } else {
          updateData.companyLogo = '';
        }
      }
      if (panNumberToApply) {
        updateData.vendorPan = panNumberToApply;
      }
      if (panDocUrlToApply !== undefined) {
        updateData.vendorPanDocument = panDocUrlToApply;
      }
      if (updateDto.facebook !== undefined) {
        updateData.vendor_facebook = String(updateDto.facebook).trim();
      }
      if (updateDto.youtube !== undefined) {
        updateData.vendor_youtube = String(updateDto.youtube).trim();
      }
      if (updateDto.twitter !== undefined) {
        updateData.vendor_twitter = String(updateDto.twitter).trim();
      }
      if (updateDto.linkedin !== undefined) {
        updateData.vendor_linkedin = String(updateDto.linkedin).trim();
      }
      if (updateDto.whatsapp !== undefined) {
        updateData.vendor_whatsapp = String(updateDto.whatsapp).trim();
      }
      let profileEmailChanged = false;
      let profileNotifyEmail: string | null = null;
      if (updateDto.email !== undefined && String(updateDto.email).trim()) {
        const newEmail = this.normalizeVendorEmail(updateDto.email);
        const oldEmail = this.normalizeVendorEmail(
          resolvedManufacturer.vendor_email,
        );
        if (newEmail !== oldEmail) {
          profileEmailChanged = true;
          profileNotifyEmail = newEmail;
        }
        updateData.vendor_email = newEmail;
      }
      if (updateDto.mobile) {
        updateData.vendor_phone = updateDto.mobile;
      }

      if (Object.keys(updateData).length > 0) {
        await this.update(
          resolvedManufacturer._id.toString(),
          updateData,
          session,
        );
      }

      if (profileEmailChanged && profileNotifyEmail) {
        await this.syncVendorUserEmailsForManufacturer(
          resolvedManufacturer._id,
          profileNotifyEmail,
          session,
        );
      }

      const profilePhoneChanged =
        updateDto.mobile !== undefined &&
        String(updateDto.mobile).trim() &&
        this.isVendorPhoneChanging(
          updateDto.mobile,
          resolvedManufacturer.vendor_phone,
          vendorUser?.phone,
        );
      if (profilePhoneChanged && updateDto.mobile) {
        await this.syncVendorUserPhonesForManufacturer(
          resolvedManufacturer._id,
          String(updateDto.mobile).trim(),
          session,
        );
      }

      const vendorUserSelfPatch: Partial<VendorUser> = {};
      if (updateDto.name !== undefined && String(updateDto.name).trim()) {
        vendorUserSelfPatch.name = String(updateDto.name).trim();
      }
      if (updateDto.designation !== undefined) {
        vendorUserSelfPatch.designation = String(updateDto.designation).trim();
      }
      if (updateDto.email !== undefined && String(updateDto.email).trim()) {
        vendorUserSelfPatch.email = this.normalizeVendorEmail(updateDto.email);
      }
      if (updateDto.mobile !== undefined && String(updateDto.mobile).trim()) {
        vendorUserSelfPatch.phone = String(updateDto.mobile).trim();
      }
      if (Object.keys(vendorUserSelfPatch).length > 0) {
        try {
          await this.vendorUserModel
            .findByIdAndUpdate(userId, vendorUserSelfPatch, {
              new: true,
              session,
            })
            .exec();
        } catch (e: unknown) {
          const code = (e as { code?: number })?.code;
          if (code === 11000) {
            const keyPattern = (e as { keyPattern?: Record<string, unknown> })
              ?.keyPattern;
            if (keyPattern && 'phone' in keyPattern) {
              throw new ConflictException(GLOBAL_PHONE_UNAVAILABLE_MESSAGE);
            }
            throw new ConflictException(this.vendorEmailDuplicateMessage());
          }
          throw e;
        }
      }

      await session.commitTransaction();
      const updated = await this.findById(resolvedManufacturer._id.toString());
      if (!updated) {
        throw new NotFoundException('Manufacturer not found');
      }
      if (profileEmailChanged && profileNotifyEmail) {
        await this.authService.invalidateSessionsForManufacturer(
          resolvedManufacturer._id.toString(),
        );
        this.emailService.sendInBackground(() =>
          this.emailService
            .sendVendorLoginEmailUpdatedEmail(
              profileNotifyEmail,
              String(updated.vendor_name ?? updated.manufacturerName ?? ''),
            )
            .catch((err) => {
              this.logger.warn(
                `Vendor login email notification failed for ${profileNotifyEmail}: ${(err as Error).message || 'unknown error'}`,
              );
            }),
        );
      }
      return this.toProfilePayloadShape(updated);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getVendorContactsByAuthUserId(userId: string) {
    const { resolvedManufacturer } =
      await this.resolveManufacturerForVendorProfile(userId);
    if (!resolvedManufacturer) {
      return {
        technicalContact: this.emptyVendorContactSlot(),
        marketingContact: this.emptyVendorContactSlot(),
      };
    }
    return {
      technicalContact: this.mapVendorContactSlot(
        resolvedManufacturer.technicalContact,
      ),
      marketingContact: this.mapVendorContactSlot(
        resolvedManufacturer.marketingContact,
      ),
    };
  }

  async updateVendorContacts(
    authUser: { userId: string; manufacturerId?: string; vendorId?: string },
    dto: UpdateVendorContactsDto,
  ) {
    const { resolvedManufacturer } =
      await this.resolveManufacturerForVendorProfile(authUser);
    if (!resolvedManufacturer) {
      throw new BadRequestException(
        'Vendor contacts require a linked manufacturer profile.',
      );
    }

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.update(
        resolvedManufacturer._id.toString(),
        {
          technicalContact: {
            name: dto.technicalContact.name.trim(),
            email_id: dto.technicalContact.email_id.trim().toLowerCase(),
            phone_number: dto.technicalContact.phone_number.trim(),
            designation: dto.technicalContact.designation.trim(),
          },
          marketingContact: {
            name: dto.marketingContact.name.trim(),
            email_id: dto.marketingContact.email_id.trim().toLowerCase(),
            phone_number: dto.marketingContact.phone_number.trim(),
            designation: dto.marketingContact.designation.trim(),
          },
        } as Partial<Manufacturer>,
        session,
      );
      await session.commitTransaction();
      const updated = await this.findById(resolvedManufacturer._id.toString());
      if (!updated) {
        throw new NotFoundException('Manufacturer not found');
      }
      return {
        technicalContact: this.mapVendorContactSlot(updated.technicalContact),
        marketingContact: this.mapVendorContactSlot(updated.marketingContact),
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    const user = await this.vendorUsersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isCurrentPasswordValid =
      await this.vendorUsersService.comparePassword(
        changePasswordDto.currentPassword,
        user.password,
      );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.vendorUsersService.update(userId, {
      password: changePasswordDto.newPassword,
    });

    await this.authService.invalidateSessionsForUser(userId);

    return { message: 'Password changed successfully' };
  }

  /**
   * Updates core manufacturer fields. Unverified rows do not get **manufacturerInitial** /
   * **gpInternalId** (allocated only on verify). Verified rows: optional manual
   * **gpInternalId** / **manufacturerInitial** when provided.
   */
  async updateManufacturerDetails(
    id: string,
    dto: UpdateManufacturerDto,
    imagePath?: string,
  ) {
    let notifyEmailChange: {
      email: string;
      vendorName: string;
      password: string;
    } | null = null;

    try {
      const manufacturerId = new Types.ObjectId(id);

      const manufacturer = await this.manufacturerIdGeneration.withTransaction(
        async (session) => {
          const existing = await this.manufacturerModel
            .findById(manufacturerId)
            .session(session)
            .exec();
          if (!existing) {
            throw new NotFoundException('Manufacturer not found');
          }

          const prevName = String(existing.manufacturerName ?? '').trim();
          const nextName = String(dto.manufacturerName ?? '').trim();
          const nameChanging =
            normalizeManufacturerName(nextName) !==
            normalizeManufacturerName(prevName);

          const emailChanging =
            dto.vendor_email !== undefined &&
            this.isVendorEmailChanging(dto.vendor_email, existing.vendor_email);
          const phoneChanging =
            dto.vendor_phone !== undefined &&
            this.isVendorPhoneChanging(dto.vendor_phone, existing.vendor_phone);

          const fieldErrors: Record<string, string> = {};
          const conflictMessages: string[] = [];

          if (nameChanging && nextName) {
            const nameAvailable = await this.isManufacturerNameAvailable(
              id,
              nextName,
              session,
            );
            if (!nameAvailable) {
              const msg = this.manufacturerNameDuplicateMessage();
              conflictMessages.push(msg);
              fieldErrors.manufacturerName = msg;
            }
          }

          if (emailChanging || phoneChanging) {
            const contactConflicts =
              await this.collectManufacturerContactConflicts(
                id,
                {
                  email: emailChanging ? dto.vendor_email : undefined,
                  phone: phoneChanging ? dto.vendor_phone : undefined,
                },
                { session },
              );
            for (const msg of contactConflicts) {
              conflictMessages.push(msg);
              if (
                /email/i.test(msg) &&
                !fieldErrors.vendor_email &&
                !fieldErrors.vendorEmail
              ) {
                fieldErrors.vendor_email = msg;
              } else if (
                /phone|mobile/i.test(msg) &&
                !fieldErrors.vendor_phone &&
                !fieldErrors.vendorPhone
              ) {
                fieldErrors.vendor_phone = msg;
              }
            }
          }

          if (conflictMessages.length > 0) {
            throw new ConflictException({
              statusCode: 409,
              error: 'Conflict',
              message: conflictMessages,
              fieldErrors,
            });
          }

          const isUnverified = (existing.manufacturerStatus ?? 0) !== 1;
          const updateData: Record<string, unknown> = {
            manufacturerName: dto.manufacturerName,
            updatedAt: new Date(),
          };
          if (
            nextName &&
            nextName !== prevName &&
            !(existing as { slugLocked?: boolean }).slugLocked
          ) {
            updateData.slug = await this.allocateManufacturerSlug(
              nextName,
              existing._id,
            );
          }
          let vendorEmailChanged = false;
          if (dto.vendor_email !== undefined) {
            const newEmail = this.normalizeVendorEmail(dto.vendor_email);
            const oldEmail = this.normalizeVendorEmail(existing.vendor_email);
            if (newEmail !== oldEmail) {
              vendorEmailChanged = true;
            }
            updateData.vendor_email = newEmail;
          }
          if (dto.vendor_phone !== undefined) {
            updateData.vendor_phone = String(dto.vendor_phone).trim();
          }
          let vendorNameChanged = false;
          if (dto.vendor_name !== undefined) {
            const newVendorName = String(dto.vendor_name).trim();
            const oldVendorName = String(existing.vendor_name ?? '').trim();
            updateData.vendor_name = newVendorName;
            vendorNameChanged =
              newVendorName !== oldVendorName && newVendorName.length > 0;
          }
          if (imagePath) {
            updateData.manufacturerImage = imagePath;
            updateData.meta_image = imagePath;
          }

          const isVerified = !isUnverified;
          if (isVerified) {
            if (
              dto.meta_title !== undefined ||
              dto.meta_description !== undefined
            ) {
              const metaErr = validateSeoMetaWrite({
                meta_title:
                  dto.meta_title !== undefined
                    ? dto.meta_title
                    : existing.meta_title,
                meta_description:
                  dto.meta_description !== undefined
                    ? dto.meta_description
                    : existing.meta_description,
              });
              if (metaErr) {
                throw new BadRequestException(metaErr);
              }
            }
            if (dto.meta_title !== undefined) {
              updateData.meta_title = String(dto.meta_title).trim();
            }
            if (dto.meta_description !== undefined) {
              updateData.meta_description = String(dto.meta_description).trim();
            }
            if (dto.meta_keywords !== undefined) {
              updateData.meta_keywords = parseMetaKeywords(dto.meta_keywords);
            }
            if (
              !imagePath &&
              existing.manufacturerImage &&
              (dto.meta_title !== undefined ||
                dto.meta_description !== undefined ||
                dto.meta_keywords !== undefined)
            ) {
              updateData.meta_image = existing.manufacturerImage;
            }
          }

          if (!isUnverified) {
            const rawGp =
              dto.gpInternalId !== undefined
                ? String(dto.gpInternalId).trim()
                : '';
            const rawIni =
              dto.manufacturerInitial !== undefined
                ? String(dto.manufacturerInitial).trim()
                : '';
            if (rawGp) {
              updateData.gpInternalId = rawGp.toUpperCase();
            }
            if (rawIni) {
              updateData.manufacturerInitial = rawIni.toUpperCase();
            }
          }

          if (updateData.manufacturerInitial !== undefined) {
            const dupInitial = await this.manufacturerModel
              .findOne({
                manufacturerInitial: updateData.manufacturerInitial,
                _id: { $ne: existing._id },
                $or: [
                  { accountDeletedAt: { $exists: false } },
                  { accountDeletedAt: null },
                ],
              })
              .session(session)
              .select('_id')
              .lean()
              .exec();
            if (dupInitial) {
              throw new ConflictException(
                'manufacturerInitial already exists on another manufacturer',
              );
            }
          }
          if (updateData.gpInternalId !== undefined) {
            const dupGp = await this.manufacturerModel
              .findOne({
                gpInternalId: updateData.gpInternalId,
                _id: { $ne: existing._id },
                $or: [
                  { accountDeletedAt: { $exists: false } },
                  { accountDeletedAt: null },
                ],
              })
              .session(session)
              .select('_id')
              .lean()
              .exec();
            if (dupGp) {
              throw new ConflictException(
                'gpInternalId already exists on another manufacturer',
              );
            }
          }

          const updated = await this.manufacturerModel
            .findByIdAndUpdate(manufacturerId, updateData, {
              new: true,
              session,
            })
            .exec();
          if (!updated) {
            throw new NotFoundException('Manufacturer not found');
          }

          if (vendorEmailChanged && updateData.vendor_email) {
            await this.syncVendorUserEmailsForManufacturer(
              manufacturerId,
              String(updateData.vendor_email),
              session,
            );
            const newPassword =
              await this.resetVendorLoginPasswordsForManufacturer(
                manufacturerId,
                session,
              );
            notifyEmailChange = {
              email: String(updateData.vendor_email),
              vendorName: this.resolveVendorDisplayName(updated),
              password: newPassword,
            };
          }

          // Always resync user phones when vendor_phone is present (not only when "changing")
          // so re-saves heal rows where manufacturer already moved but users still hold the old number.
          const phoneToSync =
            updateData.vendor_phone !== undefined
              ? String(updateData.vendor_phone).trim()
              : phoneChanging
                ? String(dto.vendor_phone ?? '').trim()
                : '';
          if (phoneToSync || phoneChanging) {
            const syncPhone =
              phoneToSync || String(updated.vendor_phone ?? '').trim();
            if (syncPhone) {
              await this.syncVendorUserPhonesForManufacturer(
                manufacturerId,
                syncPhone,
                session,
              );
            }
          }

          if (vendorNameChanged && updateData.vendor_name) {
            await this.syncVendorUserNamesForManufacturer(
              manufacturerId,
              String(updateData.vendor_name),
              session,
            );
          }

          return updated;
        },
      );

      if (notifyEmailChange) {
        await this.authService.invalidateSessionsForManufacturer(id);
        const { email, vendorName, password } = notifyEmailChange;
        this.emailService.sendInBackground(() =>
          this.emailService
            .sendVendorLoginEmailUpdatedEmail(email, vendorName, password)
            .catch((error) => {
              this.logger.warn(
                `Vendor login credentials email failed for ${email}: ${(error as Error).message || 'unknown error'}`,
              );
            }),
        );
      }

      return manufacturer;
    } catch (error: any) {
      if (error?.code === 11000) {
        const keyPattern = error?.keyPattern as Record<string, unknown> | undefined;
        if (keyPattern && ('email' in keyPattern || 'vendor_email' in keyPattern)) {
          throw new ConflictException(this.vendorEmailDuplicateMessage());
        }
        if (
          keyPattern &&
          ('phone' in keyPattern || 'vendor_phone' in keyPattern)
        ) {
          throw new ConflictException(GLOBAL_PHONE_UNAVAILABLE_MESSAGE);
        }
        throw new ConflictException(
          'Duplicate manufacturer identifier (initial or internal id)',
        );
      }
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid manufacturer ID format');
      }
      throw new BadRequestException(
        error.message || 'Failed to update manufacturer',
      );
    }
  }

  private fireManufacturerApprovedNotification(
    manufacturer: ManufacturerDocument,
  ): void {
    const manufacturerId = manufacturer._id.toString();
    const manufacturerName =
      String(manufacturer.manufacturerName ?? manufacturer.vendor_name ?? '').trim();
    const vendorEmail = this.normalizeVendorEmail(manufacturer.vendor_email);
    this.lifecycleNotification
      .notifyManufacturerApproved(manufacturerId, {
        manufacturerName: manufacturerName || undefined,
        vendorEmail: vendorEmail || undefined,
      })
      .catch((err) =>
        this.logger.warn(
          `[manufacturerApproved] Notification failed for ${manufacturerId}: ${(err as Error).message}`,
        ),
      );
  }

  /** Verifies an unverified manufacturer (confirm action). Allocates GP id + initial. */
  async verifyManufacturer(id: string) {
    const manufacturerId = new Types.ObjectId(id);
    let wasUnverified = false;

    const updated = await this.manufacturerIdGeneration.withTransaction(
      async (session) => {
        const manufacturer = await this.manufacturerModel
          .findById(manufacturerId)
          .session(session)
          .exec();
        if (!manufacturer) {
          throw new NotFoundException('Manufacturer not found');
        }
        this.assertManufacturerAccountNotDeleted(manufacturer);
        wasUnverified = (manufacturer.manufacturerStatus ?? 0) !== 1;

        if (wasUnverified) {
          await this.assignAutoGpIdentifiersOnVerification(
            manufacturerId.toString(),
            String(manufacturer.manufacturerName ?? ''),
            session,
          );
        }

        const withIds = await this.manufacturerModel
          .findById(manufacturerId)
          .session(session)
          .exec();
        if (!withIds) {
          throw new NotFoundException('Manufacturer not found');
        }
        this.assertCoreFieldsPresentForActivation(withIds);

        return this.manufacturerModel
          .findByIdAndUpdate(
            manufacturerId,
            {
              manufacturerStatus: 1,
              vendor_status: 1,
              updatedAt: new Date(),
            },
            { new: true, session },
          )
          .exec();
      },
    );

    const loginEmail = this.normalizeVendorEmail(updated?.vendor_email);
    if (updated && loginEmail) {
      await this.syncVendorUserEmailsForManufacturer(
        manufacturerId,
        loginEmail,
      );
    }

    if (updated && wasUnverified) {
      await this.tryConvertManufacturerLeadInZoho(
        updated,
        'verifyManufacturer',
      );
      this.fireManufacturerApprovedNotification(updated);
    } else if (updated) {
      await this.tryConvertManufacturerLeadInZoho(
        updated,
        'verifyManufacturer',
      );
    }

    return updated;
  }

  private async convertVerifiedManufacturerLeadInZoho(
    manufacturer: ManufacturerDocument,
  ): Promise<void> {
    const vendorInternalId = String(manufacturer.gpInternalId ?? '').trim();
    if (!vendorInternalId) {
      this.logger.warn(
        `[verifyManufacturer] Skipping Zoho vendor lead conversion for ${manufacturer._id}: gpInternalId missing`,
      );
      return;
    }

    await this.zohoDealsService.convertRegisteredVendorLead({
      manufacturerId: manufacturer._id.toString(),
      vendorInternalId,
    });
  }

  private async tryConvertManufacturerLeadInZoho(
    manufacturer: ManufacturerDocument,
    source: string,
  ): Promise<void> {
    await this.convertVerifiedManufacturerLeadInZoho(manufacturer).catch(
      (error: any) => {
        this.logger.warn(
          `[${source}] Zoho vendor lead conversion failed for ${manufacturer._id}: ${
            error?.message || error
          }`,
        );
      },
    );
  }

  private assertCoreFieldsPresentForActivation(
    manufacturer: ManufacturerDocument,
  ) {
    const gpInternalId = (manufacturer.gpInternalId ?? '').toString().trim();
    const manufacturerInitial = (manufacturer.manufacturerInitial ?? '')
      .toString()
      .trim();
    if (!gpInternalId || !manufacturerInitial) {
      throw new ConflictException(
        'Cannot activate manufacturer. Please fill gpInternalId and manufacturerInitial first.',
      );
    }
  }

  /** Soft-deleted accounts (DPDP Complete) must never be reactivated. */
  private assertManufacturerAccountNotDeleted(
    manufacturer: ManufacturerDocument | { accountDeletedAt?: Date | null },
  ): void {
    if (manufacturer.accountDeletedAt) {
      throw new ConflictException(
        'This manufacturer account was deleted and cannot be reactivated.',
      );
    }
  }

  /**
   * Toggles vendor active/inactive for verified manufacturer.
   * Keeps manufacturerStatus pinned at 1.
   */
  async toggleManufacturerStatus(id: string) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const manufacturer = await this.manufacturerModel
        .findById(manufacturerId)
        .exec();

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      this.assertManufacturerAccountNotDeleted(manufacturer);
      const wasUnverified = (manufacturer.manufacturerStatus ?? 0) !== 1;
      const currentVendor = manufacturer.vendor_status ?? 0;
      const newVendor = currentVendor === 1 ? 0 : 1;

      if (newVendor === 1 && wasUnverified) {
        await this.manufacturerIdGeneration.withTransaction(async (session) => {
          await this.assignAutoGpIdentifiersOnVerification(
            manufacturerId.toString(),
            String(manufacturer.manufacturerName ?? ''),
            session,
          );
        });
        const withIds = await this.manufacturerModel
          .findById(manufacturerId)
          .exec();
        if (!withIds) {
          throw new NotFoundException('Manufacturer not found');
        }
        this.assertCoreFieldsPresentForActivation(withIds);
      } else if (newVendor === 1) {
        this.assertCoreFieldsPresentForActivation(manufacturer);
      }

      const updated = await this.manufacturerModel
        .findByIdAndUpdate(
          manufacturerId,
          {
            manufacturerStatus: 1,
            vendor_status: newVendor,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      if (updated && wasUnverified && newVendor === 1) {
        await this.tryConvertManufacturerLeadInZoho(
          updated,
          'toggleManufacturerStatus',
        );
        this.fireManufacturerApprovedNotification(updated);
      } else if (updated && newVendor === 0) {
        await this.authService.invalidateSessionsForManufacturer(
          manufacturerId.toString(),
        );
        this.lifecycleNotification
          .notifyManufacturerInactive(manufacturerId.toString())
          .catch((err) =>
            this.logger.warn(
              `[toggleManufacturerStatus] Inactive notification failed: ${(err as Error).message}`,
            ),
          );
      } else if (updated && newVendor === 1) {
        await this.tryConvertManufacturerLeadInZoho(
          updated,
          'toggleManufacturerStatus',
        );
      }

      return updated;
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid manufacturer ID format');
      }
      throw new BadRequestException(
        error.message || 'Failed to update manufacturer status',
      );
    }
  }

  /**
   * Lightweight vendor_status update for verified manufacturer.
   * Ensures manufacturerStatus stays 1 and rejects toggling for unverified manufacturers.
   * Deactivation (vendor_status = 0) requires a remark of 1–500 characters.
   */
  async setVendorStatusForVerified(
    id: string,
    vendor_status: 0 | 1,
    options?: { remark?: string },
  ) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const manufacturer = await this.manufacturerModel
        .findById(manufacturerId)
        .exec();

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      this.assertManufacturerAccountNotDeleted(manufacturer);
      if ((manufacturer.manufacturerStatus ?? 0) !== 1) {
        throw new ConflictException(
          'Only verified manufacturers can be toggled',
        );
      }
      if (vendor_status === 1) {
        this.assertCoreFieldsPresentForActivation(manufacturer);
      }

      const updateData: Record<string, unknown> = {
        manufacturerStatus: 1,
        vendor_status,
        updatedAt: new Date(),
      };

      if (vendor_status === 0) {
        const remark = String(options?.remark ?? '').trim();
        if (!remark) {
          throw new BadRequestException({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Remark is required when deactivating a manufacturer',
            fieldErrors: {
              remark: 'Remark is required',
            },
          });
        }
        if (remark.length > 500) {
          throw new BadRequestException({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Remark must be at most 500 characters',
            fieldErrors: {
              remark: 'Remark must be at most 500 characters',
            },
          });
        }
        updateData.deactivationRemark = remark;
      }

      const updated = await this.manufacturerModel
        .findByIdAndUpdate(manufacturerId, updateData, { new: true })
        .exec();

      if (updated && vendor_status === 0) {
        await this.authService.invalidateSessionsForManufacturer(
          manufacturerId.toString(),
        );
        this.lifecycleNotification
          .notifyManufacturerInactive(manufacturerId.toString())
          .catch((err) =>
            this.logger.warn(
              `[setVendorStatusForVerified] Inactive notification failed: ${(err as Error).message}`,
            ),
          );
      }
      if (updated && vendor_status === 1) {
        await this.tryConvertManufacturerLeadInZoho(
          updated,
          'setVendorStatusForVerified',
        );
      }

      return updated;
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid manufacturer ID format');
      }
      throw new BadRequestException(
        error.message || 'Failed to update vendor status',
      );
    }
  }

  /**
   * Soft-delete a manufacturer after an Account Deletion request is Completed:
   * - Sets vendor_status = 0 and accountDeletedAt (blocks login / JWT access)
   * - Frees vendor_email / vendor_phone (and portal user emails) for re-registration
   * - Invalidates sessions
   * Certified products stay in DB but are hidden from the public website via visibility filters.
   */
  async softDeleteAccountAfterDeletionRequest(
    id: string,
  ): Promise<ManufacturerDocument> {
    const manufacturerId = new Types.ObjectId(id);
    const manufacturer = await this.manufacturerModel
      .findById(manufacturerId)
      .exec();

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    if (manufacturer.accountDeletedAt) {
      return manufacturer;
    }

    const stamp = Date.now();
    const idStr = manufacturerId.toString();
    const originalEmail = this.normalizeVendorEmail(manufacturer.vendor_email);
    const originalPhone = String(manufacturer.vendor_phone ?? '').trim();
    const freedEmail = `deleted.${idStr}.${stamp}@account-deleted.local`;
    const freedPhone = `DEL-${idStr.slice(-8)}-${stamp}`.slice(0, 32);
    // Free display name + public slug so the original name can be re-registered.
    const freedName = `Deleted manufacturer ${idStr} ${stamp}`.slice(0, 200);
    const freedSlug = `deleted-${idStr}-${stamp}`.toLowerCase();

    const updated = await this.manufacturerModel
      .findByIdAndUpdate(
        manufacturerId,
        {
          vendor_status: 0,
          accountDeletedAt: new Date(),
          deletedVendorEmail: originalEmail || undefined,
          deletedVendorPhone: originalPhone || undefined,
          vendor_email: freedEmail,
          vendor_phone: freedPhone,
          manufacturerName: freedName,
          slug: freedSlug,
          slugLocked: true,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Manufacturer not found');
    }

    const portalUsers = await this.vendorUserModel
      .find({
        $or: [{ manufacturerId }, { vendorId: manufacturerId }],
        type: { $in: ['vendor', 'partner'] },
      })
      .select('_id email phone')
      .exec();

    for (let i = 0; i < portalUsers.length; i++) {
      const user = portalUsers[i];
      await this.vendorUserModel
        .findByIdAndUpdate(user._id, {
          status: 2,
          email: `deleted.user.${idStr}.${i}.${stamp}@account-deleted.local`,
          phone: `DELU-${idStr.slice(-6)}-${i}-${stamp}`.slice(0, 32),
          updatedAt: new Date(),
        })
        .exec();
    }

    await this.authService.invalidateSessionsForManufacturer(idStr);

    return updated;
  }

  private async countForManufacturer(manufacturerId: Types.ObjectId) {
    const [manufacturer_product_count, manufacturer_vendor_count] =
      await Promise.all([
        this.productModel
          .countDocuments({
            manufacturerId,
            $or: [
              { is_deleted: { $ne: true } },
              { is_deleted: { $exists: false } },
            ],
          })
          .exec(),
        this.vendorUserModel
          .countDocuments({
            manufacturerId,
            type: 'vendor',
            status: { $ne: 2 },
          })
          .exec(),
      ]);
    return { manufacturer_product_count, manufacturer_vendor_count };
  }

  private buildListFilter(
    query: ListManufacturersQueryDto,
    restrictToManufacturerIds?: Types.ObjectId[],
  ): Record<string, unknown> {
    const parts: Record<string, unknown>[] = [];

    if (restrictToManufacturerIds && restrictToManufacturerIds.length > 0) {
      parts.push({ _id: { $in: restrictToManufacturerIds } });
    }

    if (query.search !== undefined && query.search.trim() !== '') {
      const rx = new RegExp(escapeRegex(query.search.trim()), 'i');
      parts.push({
        $or: [
          { manufacturerName: rx },
          { vendor_name: rx },
          { vendor_email: rx },
          { gpInternalId: rx },
        ],
      });
    }
    const scopeFilter = resolveManufacturerScopeFilter(query);
    if (scopeFilter) {
      parts.push(scopeFilter);
    }

    const vendorStatusFilter = resolveVendorStatusFilter(query);
    if (vendorStatusFilter) {
      parts.push(vendorStatusFilter);
    }
    if (
      query.manufacturerName !== undefined &&
      query.manufacturerName.trim() !== ''
    ) {
      parts.push({
        manufacturerName: new RegExp(
          escapeRegex(query.manufacturerName.trim()),
          'i',
        ),
      });
    }
    if (query.gpInternalId !== undefined && query.gpInternalId.trim() !== '') {
      parts.push({
        gpInternalId: new RegExp(escapeRegex(query.gpInternalId.trim()), 'i'),
      });
    }
    if (
      query.manufacturerInitial !== undefined &&
      query.manufacturerInitial.trim() !== ''
    ) {
      parts.push({
        manufacturerInitial: new RegExp(
          escapeRegex(query.manufacturerInitial.trim()),
          'i',
        ),
      });
    }

    if (parts.length === 0) {
      return {};
    }
    if (parts.length === 1) {
      return parts[0];
    }
    return { $and: parts };
  }

  /** One row for CSV/XLSX: mirrors admin grid Initial + Status (toggle = vendor active). */
  private async buildManufacturerExportRows(
    query: ListManufacturersQueryDto,
  ): Promise<
    Array<{
      _id: string;
      manufacturerName: string;
      gpInternalId: string;
      initial: string;
      manufacturerStatus: number;
      manufacturerStatusLabel: string;
      vendor_status: number;
      vendorStatusLabel: string;
      /** Admin UI vendor toggle: On only when vendor_status === 1 */
      statusToggle: 'On' | 'Off';
      vendor_name: string;
      vendor_email: string;
      vendor_phone: string;
      manufacturer_product_count: number;
      manufacturer_vendor_count: number;
      createdAt: Date | undefined;
      updatedAt: Date | undefined;
    }>
  > {
    const sortBy = query.sortBy ?? 'createdAt';
    const order = query.order ?? 'desc';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    let rawRows: Record<string, unknown>[];
    if (query.id) {
      if (!Types.ObjectId.isValid(query.id)) {
        throw new BadRequestException('Invalid manufacturer ID format');
      }
      const doc = await this.manufacturerModel
        .findById(query.id)
        .lean()
        .exec();
      rawRows = doc ? [doc as Record<string, unknown>] : [];
    } else {
      const filter = this.buildListFilter(query);
      rawRows = (await this.manufacturerModel
        .find(filter)
        .sort(sort)
        .lean()
        .exec()) as Record<string, unknown>[];
    }

    const manufacturerIds = rawRows.map(
      (raw) => new Types.ObjectId(String(raw._id)),
    );
    const vendorUsersByMfgId =
      await this.loadPrimaryVendorUsersByManufacturerIds(manufacturerIds);

    return Promise.all(
      rawRows.map(async (raw) => {
        const mid = new Types.ObjectId(String(raw._id));
        const counts = await this.countForManufacturer(mid);
        const ini = String(raw.manufacturerInitial ?? '').trim();
        const mSt = Number(raw.manufacturerStatus ?? 0);
        const vSt = Number(raw.vendor_status ?? 0);
        const vendorDisplay = this.resolveVendorDisplayName(
          {
            vendor_name: raw.vendor_name as string | undefined,
            manufacturerName: raw.manufacturerName as string | undefined,
          },
          vendorUsersByMfgId.get(mid.toString())?.name,
        );
        return {
          _id: String(raw._id),
          manufacturerName: String(raw.manufacturerName ?? ''),
          companyName: String(raw.manufacturerName ?? ''),
          gpInternalId: String(raw.gpInternalId ?? ''),
          initial: ini,
          manufacturerStatus: mSt,
          manufacturerStatusLabel: manufacturerStatusLabel(mSt),
          vendor_status: vSt,
          vendorStatusLabel: vendorStatusLabel(vSt),
          statusToggle: vSt === 1 ? ('On' as const) : ('Off' as const),
          vendor_name: vendorDisplay,
          vendorName: vendorDisplay,
          vendor_email: String(raw.vendor_email ?? ''),
          vendor_phone: String(raw.vendor_phone ?? ''),
          manufacturer_product_count: counts.manufacturer_product_count,
          manufacturer_vendor_count: counts.manufacturer_vendor_count,
          createdAt: raw.createdAt as Date | undefined,
          updatedAt: raw.updatedAt as Date | undefined,
        };
      }),
    );
  }

  /**
   * Full export (no pagination cap): same filters/sort as the listing.
   * Columns match the admin Excel layout, including **Initial** and **Status** (On/Off = vendor active).
   */
  async buildCsvExport(query: ListManufacturersQueryDto): Promise<string> {
    const rows = await this.buildManufacturerExportRows(query);

    const header = [
      'S.No',
      'Manufacturer Name',
      'GP Internal ID',
      'Vendor Name',
      'Vendor Email',
      'Vendor Phone',
      'Initial',
      'Status',
      'Manufacturer Verification',
      'Vendor Status Detail',
      'Product Count',
      'Vendor User Count',
      'MongoDB _id',
      'Created At',
      'Updated At',
    ];

    const lines: string[] = [header.join(',')];

    rows.forEach((r, idx) => {
      const row = [
        idx + 1,
        r.manufacturerName,
        r.gpInternalId,
        r.vendor_name,
        r.vendor_email,
        r.vendor_phone,
        r.initial,
        r.statusToggle,
        r.manufacturerStatusLabel,
        r.vendorStatusLabel,
        r.manufacturer_product_count,
        r.manufacturer_vendor_count,
        r._id,
        r.createdAt ? new Date(r.createdAt).toISOString() : '',
        r.updatedAt ? new Date(r.updatedAt).toISOString() : '',
      ]
        .map(csvEscape)
        .join(',');
      lines.push(row);
    });

    return lines.join('\r\n');
  }

  /** Same data as CSV, as `.xlsx` for Excel (includes Initial + Status columns). */
  async buildXlsxExport(
    query: ListManufacturersQueryDto,
  ): Promise<{ buffer: Buffer; fileName: string }> {
    const rows = await this.buildManufacturerExportRows(query);
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Manufacturers');

    ws.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Manufacturer Name', key: 'manufacturerName', width: 28 },
      { header: 'GP Internal ID', key: 'gpInternalId', width: 18 },
      { header: 'Vendor Name', key: 'vendor_name', width: 24 },
      { header: 'Vendor Email', key: 'vendor_email', width: 34 },
      { header: 'Vendor Phone', key: 'vendor_phone', width: 18 },
      { header: 'Initial', key: 'initial', width: 14 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Manufacturer Verification', key: 'mfgVerify', width: 22 },
      { header: 'Vendor Status Detail', key: 'vendorDetail', width: 18 },
      { header: 'Created At', key: 'createdAt', width: 26 },
    ];

    rows.forEach((r, i) => {
      ws.addRow({
        sno: i + 1,
        manufacturerName: r.manufacturerName,
        gpInternalId: r.gpInternalId,
        vendor_name: r.vendor_name,
        vendor_email: r.vendor_email,
        vendor_phone: r.vendor_phone,
        initial: r.initial,
        status: r.statusToggle,
        mfgVerify: r.manufacturerStatusLabel,
        vendorDetail: r.vendorStatusLabel,
        createdAt: r.createdAt
          ? new Date(r.createdAt).toISOString()
          : '',
      });
    });

    const raw = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.isBuffer(raw) ? raw : Buffer.from(raw as ArrayBuffer);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return {
      buffer,
      fileName: `manufacturers-export-${stamp}.xlsx`,
    };
  }

  private async countWebsitePublicProductsByManufacturer(
    manufacturerIds: Types.ObjectId[],
  ): Promise<Map<string, number>> {
    if (!manufacturerIds.length) {
      return new Map();
    }

    const rows = await this.productModel
      .aggregate<{
        _id: Types.ObjectId;
        manufacturer_product_count: number;
      }>([
        {
          $match: matchWebsitePublicCertifiedProducts({
            manufacturerId: { $in: manufacturerIds },
          }),
        },
        {
          $group: {
            _id: '$manufacturerId',
            manufacturer_product_count: { $sum: 1 },
          },
        },
      ])
      .exec();

    const out = new Map<string, number>();
    for (const row of rows) {
      out.set(String(row._id), row.manufacturer_product_count);
    }
    return out;
  }

  /**
   * Public website manufacturers listing: only manufacturers with at least one certified,
   * non–soft-deleted product, excluding inactive / account-deleted manufacturers.
   */
  async findAllPaginatedForWebsitePublic(query: ListManufacturersQueryDto) {
    const manufacturerIds = await this.productModel
      .distinct('manufacturerId', matchWebsitePublicCertifiedProducts())
      .exec();

    if (!manufacturerIds.length) {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      return {
        message: 'Manufacturers retrieved successfully',
        data: [],
        total: 0,
        totalCount: 0,
        page,
        limit,
        totalPages: 0,
        currentPage: page,
      };
    }

    const visibleManufacturerIds = await this.manufacturerModel
      .find({
        _id: { $in: manufacturerIds },
        ...matchPublicWebsiteManufacturerVisibility(''),
      })
      .select('_id')
      .lean()
      .exec()
      .then((rows) => rows.map((r) => r._id as Types.ObjectId));

    if (!visibleManufacturerIds.length) {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      return {
        message: 'Manufacturers retrieved successfully',
        data: [],
        total: 0,
        totalCount: 0,
        page,
        limit,
        totalPages: 0,
        currentPage: page,
      };
    }

    return this.findAllPaginated(query, visibleManufacturerIds, {
      useWebsitePublicCertifiedProductCount: true,
    });
  }

  async findAllPaginated(
    query: ListManufacturersQueryDto,
    restrictToManufacturerIds?: Types.ObjectId[],
    options?: { useWebsitePublicCertifiedProductCount?: boolean },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? 'createdAt';
    const order = query.order ?? 'desc';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const filter = this.buildListFilter(query, restrictToManufacturerIds);
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      this.manufacturerModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.manufacturerModel.countDocuments(filter).exec(),
    ]);

    const manufacturerIds = rows.map((m) => new Types.ObjectId(String(m._id)));
    const useWebsitePublicCertifiedProductCount =
      options?.useWebsitePublicCertifiedProductCount === true;
    const [vendorUsersByMfgId, publicProductCountsByManufacturerId] =
      await Promise.all([
        this.loadPrimaryVendorUsersByManufacturerIds(manufacturerIds),
        useWebsitePublicCertifiedProductCount
          ? this.countWebsitePublicProductsByManufacturer(manufacturerIds)
          : Promise.resolve(undefined),
      ]);

    const certifiedPlantCountsByManufacturerId =
      useWebsitePublicCertifiedProductCount
        ? undefined
        : await countCertifiedPlantCertificatesByManufacturerIds(
            this.productModel,
            this.productPlantModel,
            manufacturerIds,
          );

    const data = await Promise.all(
      rows.map(async (m) => {
        const mid = new Types.ObjectId(String(m._id));
        const primaryVendor = vendorUsersByMfgId.get(mid.toString());
        if (useWebsitePublicCertifiedProductCount) {
          const manufacturer_product_count =
            publicProductCountsByManufacturerId?.get(mid.toString()) ?? 0;
          return this.formatManufacturerApiRow(m, {
            primaryVendorUserName: primaryVendor?.name,
            primaryVendorUserId: primaryVendor?.userId,
            manufacturer_product_count,
            productCount: manufacturer_product_count,
            applySeoDefa: true,
          });
        }
        const counts = await this.countForManufacturer(mid);
        return this.formatManufacturerApiRow(m, {
          primaryVendorUserName: primaryVendor?.name,
          primaryVendorUserId: primaryVendor?.userId,
          manufacturer_product_count: counts.manufacturer_product_count,
          manufacturer_vendor_count: counts.manufacturer_vendor_count,
          certifiedPlantCount:
            certifiedPlantCountsByManufacturerId?.get(mid.toString()) ?? 0,
          // Admin list: raw DB SEO only (no website DEFAULT_SEO_META).
        });
      }),
    );

    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

    return {
      message: 'Manufacturers retrieved successfully',
      data,
      total,
      totalCount: total,
      page,
      limit,
      totalPages,
      currentPage: page,
    };
  }

  /** Delete verified manufacturer only when both counts are zero. */
  async deleteManufacturerWithConstraint(id: string) {
    const manufacturerId = new Types.ObjectId(id);
    const manufacturer = await this.manufacturerModel
      .findById(manufacturerId)
      .exec();
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }
    if (manufacturer.manufacturerStatus !== 1) {
      throw new BadRequestException(
        'Use unverified delete endpoint for unverified manufacturer',
      );
    }
    const counts = await this.countForManufacturer(manufacturerId);
    if (
      counts.manufacturer_product_count > 0 ||
      counts.manufacturer_vendor_count > 0
    ) {
      throw new ConflictException(
        'Delete blocked: manufacturer_product_count and manufacturer_vendor_count must be 0',
      );
    }
    await this.manufacturerModel.deleteOne({ _id: manufacturerId }).exec();
    await this.manufacturerIdGeneration.enqueueReclaimedSuffixFromGpInternalId(
      manufacturer.gpInternalId,
    );
    return { _id: id };
  }

  /** Dedicated endpoint: delete only if unverified. */
  async deleteUnverifiedById(id: string) {
    const manufacturerId = new Types.ObjectId(id);
    const manufacturer = await this.manufacturerModel
      .findById(manufacturerId)
      .exec();
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }
    if (manufacturer.manufacturerStatus === 1) {
      throw new BadRequestException(
        'Only unverified manufacturer can be deleted from this endpoint',
      );
    }
    const manufacturerName = String(
      manufacturer.manufacturerName ?? manufacturer.vendor_name ?? 'Manufacturer',
    ).trim();
    const vendorEmail = String(manufacturer.vendor_email ?? '')
      .trim()
      .toLowerCase();
    await this.manufacturerModel.deleteOne({ _id: manufacturerId }).exec();
    this.lifecycleNotification
      .notifyManufacturerRejected(manufacturerName, id, { vendorEmail })
      .catch((err) =>
        this.logger.warn(
          `[deleteUnverifiedById] Rejection notification failed: ${(err as Error).message}`,
        ),
      );
    await this.manufacturerIdGeneration.enqueueReclaimedSuffixFromGpInternalId(
      manufacturer.gpInternalId,
    );
    return { _id: id };
  }
}
