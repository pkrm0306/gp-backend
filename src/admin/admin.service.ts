import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import {
  VendorUser,
  VendorUserDocument,
  TeamMemberTeam,
} from '../vendor-users/schemas/vendor-user.schema';
import { Banner, BannerDocument } from '../banners/schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import * as crypto from 'crypto';
import { ListTeamMembersQueryDto } from './dto/list-team-members-query.dto';
import { Event, EventDocument } from '../events/schemas/event.schema';
import { Article, ArticleDocument } from '../articles/schemas/article.schema';
import {
  EventIdCounter,
  EventIdCounterDocument,
  EVENT_ID_COUNTER_KEY,
} from '../events/schemas/event-id-counter.schema';
import { EmailService } from '../common/services/email.service';
import {
  ContactReplyThread,
  ContactReplyThreadDocument,
} from './schemas/contact-reply-thread.schema';
import {
  NewsletterSubscriber,
  NewsletterSubscriberDocument,
} from '../website/schemas/newsletter-subscriber.schema';
import {
  ContactMessage,
  ContactMessageDocument,
} from '../website/schemas/contact-message.schema';
import {
  Notification,
  NotificationDocument,
} from '../common/schemas/notification.schema';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
import * as bcrypt from 'bcryptjs';
import { RbacService } from '../rbac/rbac.service';
import { RedisService } from '../common/redis/redis.service';
import { CategoriesService } from '../categories/categories.service';
import { UpdateVendorUserProfileDto } from './dto/update-vendor-user-profile.dto';

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Multipart/query-style truthy used for optional credential flags on team-member forms. */
function isTruthyCredentialFlag(raw: unknown): boolean {
  if (raw === undefined || raw === null || raw === '') return false;
  if (raw === true || raw === 1) return true;
  const s = String(raw).trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes' || s === 'on';
}

const DISPLAY_ORDER_TAKEN_BODY = {
  error: 'DISPLAY_ORDER_TAKEN',
  message: 'This display order is already assigned.',
} as const;

/**
 * Upper bound only for numeric safety / BSON int — not derived from roster size.
 */
const TEAM_MEMBER_DISPLAY_ORDER_MAX = 2_147_483_647;

function throwDisplayOrderTaken(): never {
  throw new ConflictException(DISPLAY_ORDER_TAKEN_BODY);
}

function isMongoStaffTeamDisplayOrderDuplicate(err: unknown): boolean {
  const e = err as {
    code?: number;
    keyPattern?: Record<string, unknown>;
  };
  if (e?.code !== 11000) return false;
  const kp = e.keyPattern ?? {};
  return (
    'displayOrder' in kp && 'team' in kp && 'manufacturerId' in kp
  );
}

function escapeHtml(input: string): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const DEFAULT_EVENT_REGISTRATION_LINK =
  'https://cam.mycii.in/OR/OnlineRegistrationLogin.html?EventId=E000069218';
const DEFAULT_EVENT_BROCHURE_LINK =
  'https://www.linkedin.com/posts/cii-greenpro-ecolabelling_greenpro-summit-2025-brochure-03062025-activity-7335663123154014208-2ScV?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB-BYukBl9XKRWqUfyykOlftYFSgtIQGafI';

/** Paginated team member list (`GET /admin/team-members/list`, `GET /api/team-members/by-category/...`). */
export interface TeamMembersPaginatedResult {
  data: Record<string, unknown>[];
  displayOrderMax: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
    @InjectModel(Banner.name)
    private bannerModel: Model<BannerDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(EventIdCounter.name)
    private eventCounterModel: Model<EventIdCounterDocument>,
    @InjectModel(NewsletterSubscriber.name)
    private newsletterSubscriberModel: Model<NewsletterSubscriberDocument>,
    @InjectModel(ContactMessage.name)
    private contactMessageModel: Model<ContactMessageDocument>,
    @InjectModel(ContactReplyThread.name)
    private contactReplyThreadModel: Model<ContactReplyThreadDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(Article.name)
    private articleModel: Model<ArticleDocument>,
    private readonly emailService: EmailService,
    private readonly rbacService: RbacService,
    private readonly redisService: RedisService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private teamMemberCategoryArrays(m: {
    category_ids?: unknown;
    category_id?: unknown;
  }): { category_ids: number[]; categoryIds: number[] } {
    const raw = Array.isArray(m.category_ids) ? m.category_ids : [];
    const ids = raw.filter(
      (x): x is number => typeof x === 'number' && Number.isInteger(x) && x >= 1,
    );
    if (ids.length > 0) {
      return { category_ids: ids, categoryIds: ids };
    }
    const one =
      typeof m.category_id === 'number' &&
      Number.isInteger(m.category_id) &&
      m.category_id >= 1
        ? m.category_id
        : null;
    if (one !== null) {
      return { category_ids: [one], categoryIds: [one] };
    }
    return { category_ids: [], categoryIds: [] };
  }

  /** Raw `displayOrder` from DB for API responses (gaps allowed; do not coerce missing to 0). */
  /**
   * PATCH /admin/vendor-user/profile — updates the logged-in vendor_users row
   * (admin + staff only). Persists name, designation, email, phone (`mobile` in body).
   */
  async updateOwnVendorUserProfile(
    authUserId: string,
    manufacturerIdFromToken: string | undefined,
    dto: UpdateVendorUserProfileDto,
  ) {
    let oid: Types.ObjectId;
    try {
      oid = new Types.ObjectId(authUserId);
    } catch {
      throw new BadRequestException('Invalid user id');
    }

    const doc = await this.vendorUserModel.findById(oid).exec();
    if (!doc || doc.status === 2) {
      throw new NotFoundException('User not found');
    }
    if (!['admin', 'staff'].includes(doc.type)) {
      throw new BadRequestException(
        'This endpoint is only for admin portal accounts (type admin or staff). Use vendor profile routes for vendor accounts.',
      );
    }

    const mid =
      doc.manufacturerId?.toString() || doc.vendorId?.toString() || '';
    if (
      manufacturerIdFromToken &&
      mid &&
      manufacturerIdFromToken !== mid
    ) {
      throw new ForbiddenException('Cannot update another manufacturer account');
    }

    const emailLower = dto.email.trim().toLowerCase();
    const mobileTrim = dto.mobile.trim();

    const existingOther = await this.vendorUserModel
      .findOne({
        _id: { $ne: oid },
        manufacturerId: doc.manufacturerId,
        status: { $ne: 2 },
        $or: [
          { email: new RegExp(`^${escapeRegex(emailLower)}$`, 'i') },
          { phone: mobileTrim },
        ],
      })
      .select('_id email phone')
      .lean()
      .exec();

    if (existingOther) {
      if (
        String(existingOther.email ?? '').toLowerCase() === emailLower
      ) {
        throw new ConflictException('Email already exists');
      }
      if (existingOther.phone === mobileTrim) {
        throw new ConflictException('Phone number already exists');
      }
      throw new ConflictException('Email or phone already exists');
    }

    doc.name = dto.name.trim();
    doc.email = emailLower;
    doc.phone = mobileTrim;
    doc.designation =
      dto.designation !== undefined ? String(dto.designation).trim() : '';
    doc.updatedAt = new Date();
    await doc.save();

    const mobile = doc.phone;
    const designation = doc.designation ?? '';
    const idStr = String(doc._id);
    return {
      id: idStr,
      vendorUserId: idStr,
      email: doc.email,
      name: doc.name,
      type: doc.type,
      designation,
      mobile,
      phone: mobile,
      vendorUser: {
        designation,
        mobile,
        vendorUserId: idStr,
      },
    };
  }

  private persistedTeamMemberDisplayOrder(value: unknown): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  /** Active staff rows for a manufacturer + team. Optional exclude (e.g. member being edited). */
  private async countActiveStaffInTeam(
    manufacturerId: Types.ObjectId,
    team: TeamMemberTeam,
    excludeId?: Types.ObjectId,
  ): Promise<number> {
    const q: Record<string, unknown> = {
      manufacturerId,
      type: 'staff',
      status: { $ne: 2 },
      team,
    };
    if (excludeId) {
      q._id = { $ne: excludeId };
    }
    return this.vendorUserModel.countDocuments(q).exec();
  }

  /** Explicit orders must be positive integers within the global numeric cap (not tied to team size). */
  private assertTeamMemberDisplayOrderAllowed(order: number): void {
    if (!Number.isInteger(order) || order < 1) {
      throw new BadRequestException('Display order must be a positive integer');
    }
    if (order > TEAM_MEMBER_DISPLAY_ORDER_MAX) {
      throw new BadRequestException(
        `Display order must not exceed ${TEAM_MEMBER_DISPLAY_ORDER_MAX}`,
      );
    }
  }

  /**
   * When displayOrder is omitted on create: next slot after the highest existing order in this team
   * (gaps allowed elsewhere); empty team → 1. Uses $max so rows without displayOrder do not affect the max.
   */
  private async nextDefaultDisplayOrderForTeam(
    manufacturerId: Types.ObjectId,
    team: TeamMemberTeam,
  ): Promise<number> {
    const rows = await this.vendorUserModel
      .aggregate<{ maxOrd: number | null }>([
        {
          $match: {
            manufacturerId,
            type: 'staff',
            status: { $ne: 2 },
            team,
          },
        },
        { $group: { _id: null, maxOrd: { $max: '$displayOrder' } } },
      ])
      .exec();

    const raw = rows[0]?.maxOrd;
    const highest =
      typeof raw === 'number' && Number.isInteger(raw) && raw >= 1 ? raw : 0;
    const next = highest + 1;
    if (next > TEAM_MEMBER_DISPLAY_ORDER_MAX) {
      throw new BadRequestException(
        `Display order cannot exceed ${TEAM_MEMBER_DISPLAY_ORDER_MAX}`,
      );
    }
    return next;
  }

  private invalidateWebsiteTeamMembersListCache(): void {
    const key = this.redisService.buildKey('website', 'team-members', 'list');
    this.redisService.del(key).catch((err) => {
      this.logger.warn(
        `Website team-members cache invalidation failed: ${(err as Error)?.message || 'unknown'}`,
      );
    });
  }

  private resolveEventImagePath(eventImage?: string | null): string {
    const raw = String(eventImage ?? '').trim();
    if (!raw) return '';
    if (raw.startsWith('/uploads/')) {
      return raw.replace(/^\/uploads\//, '');
    }
    if (raw.startsWith('uploads/')) {
      return raw.replace(/^uploads\//, '');
    }
    return raw;
  }

  private resolveBannerImagePath(imageUrl?: string | null): string {
    const raw = String(imageUrl ?? '').trim();
    if (!raw) return '';
    if (raw.startsWith('/uploads/')) {
      return raw.replace(/^\/uploads\//, '');
    }
    if (raw.startsWith('uploads/')) {
      return raw.replace(/^uploads\//, '');
    }
    return raw;
  }

  private resolveBannerImageForResponse(
    imageUrl?: string | null,
    bannerImage?: string | null,
  ): string {
    const imageRaw = String(imageUrl ?? '').trim();
    if (imageRaw && /^https?:\/\//i.test(imageRaw)) return imageRaw;
    const candidate = imageRaw || (bannerImage ? `/uploads/${bannerImage}` : '');
    const normalized = String(candidate).trim();
    if (!normalized) return '';
    return normalized;
  }

  private resolveArticleImagePath(imageUrl?: string | null): string {
    const raw = String(imageUrl ?? '').trim();
    if (!raw) return '';
    // Preserve absolute S3/CloudFront URLs as-is and keep local upload paths stable.
    if (raw.startsWith('/uploads/')) return raw;
    if (raw.startsWith('uploads/')) return `/${raw}`;
    return raw;
  }

  private resolveArticlePdfPath(pdfUrl?: string | null): string {
    const raw = String(pdfUrl ?? '').trim();
    if (!raw) return '';
    if (raw.startsWith('/uploads/')) return raw;
    if (raw.startsWith('uploads/')) return `/${raw}`;
    return raw;
  }

  private resolveArticleAssetForResponse(rawUrl?: string | null): string {
    const raw = String(rawUrl ?? '').trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith('/uploads/')) return raw;
    if (raw.startsWith('uploads/')) return `/${raw}`;
    if (raw.startsWith('/')) return raw;
    return `/uploads/${raw.replace(/^\/+/, '')}`;
  }

  private async createNotification(input: {
    title: string;
    message: string;
    type?: string;
    source?: string;
    referenceType?: string;
    referenceId?: string;
    actorName?: string;
  }) {
    await this.notificationModel.create({
      title: input.title,
      message: input.message,
      type: input.type ?? 'info',
      source: input.source ?? 'admin',
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      actorName: input.actorName,
    });
  }

  private async nextEventId(): Promise<number> {
    const doc = await this.eventCounterModel
      .findOneAndUpdate(
        { _id: EVENT_ID_COUNTER_KEY },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      )
      .exec();
    if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
      throw new Error('Failed to allocate event id');
    }
    return doc.seq;
  }

  private formatEventResponse(event: any) {
    if (!event) return event;
    const obj = typeof event.toObject === 'function' ? event.toObject() : event;
    const id = obj?._id
      ? String(obj._id)
      : obj?.id
        ? String(obj.id)
        : undefined;
    const { _id, __v, ...rest } = obj ?? {};
    return {
      ...rest,
      galleryImages: Array.isArray((rest as any)?.galleryImages)
        ? (rest as any).galleryImages
        : (rest as any)?.eventImage
          ? [(rest as any).eventImage]
          : [],
      event_image:
        (rest as any)?.event_image ??
        this.resolveEventImagePath((rest as any)?.eventImage),
      registrationLink:
        (rest as any)?.registrationLink ?? DEFAULT_EVENT_REGISTRATION_LINK,
      brochureLink: (rest as any)?.brochureLink ?? DEFAULT_EVENT_BROCHURE_LINK,
      ...(id ? { id } : {}),
    };
  }

  async createEvent(payload: {
    eventName: string;
    eventDate: Date;
    eventStatus?: number;
    eventStartTime?: string;
    eventEndTime?: string;
    eventLocation?: string;
    eventDescription?: string;
    contactPersonName?: string;
    contactPersonDesignation?: string;
    contactPersonEmail?: string;
    contactPersonPhone?: string;
    eventImage?: string;
    galleryImages?: string[];
    galleryType?: string;
    registrationLink?: string;
    brochureLink?: string;
  }) {
    const nextName = String(payload.eventName ?? '').trim();
    const nextType = String(payload.galleryType ?? '').trim();
    if (nextType && nextName) {
      const duplicate = await this.eventModel
        .findOne({
          eventName: new RegExp(`^${escapeRegex(nextName)}$`, 'i'),
          galleryType: new RegExp(`^${escapeRegex(nextType)}$`, 'i'),
        })
        .select('_id')
        .lean()
        .exec();
      if (duplicate) {
        throw new ConflictException(
          `A gallery item with this title already exists in "${nextType}"`,
        );
      }
    }

    const eventId = await this.nextEventId();
    const now = new Date();

    const doc = new this.eventModel({
      eventId,
      eventName: payload.eventName,
      eventImage: payload.eventImage,
      event_image: this.resolveEventImagePath(payload.eventImage),
      galleryImages:
        Array.isArray(payload.galleryImages) && payload.galleryImages.length
          ? payload.galleryImages
          : payload.eventImage
            ? [payload.eventImage]
            : [],
      galleryType: payload.galleryType,
      eventDescription: payload.eventDescription,
      eventDate: payload.eventDate,
      eventStartTime: payload.eventStartTime,
      eventEndTime: payload.eventEndTime,
      eventLocation: payload.eventLocation,
      contactPersonName: payload.contactPersonName,
      contactPersonDesignation: payload.contactPersonDesignation,
      contactPersonEmail: payload.contactPersonEmail,
      contactPersonPhone: payload.contactPersonPhone,
      registrationLink: payload.registrationLink,
      brochureLink: payload.brochureLink,
      eventStatus:
        payload.eventStatus === 0 || payload.eventStatus === 1
          ? payload.eventStatus
          : 1,
      createdDate: now,
      updatedDate: now,
    });

    const saved = await doc.save();
    await this.createNotification({
      title: 'Event created',
      message: `Event "${payload.eventName}" was created.`,
      type: 'success',
      source: 'admin',
      referenceType: 'event',
      referenceId: String((saved as any)._id),
    });
    return this.formatEventResponse(saved);
  }

  async updateEvent(
    identifier: string,
    payload: {
      eventName?: string;
      eventDate?: Date;
      eventStartTime?: string;
      eventEndTime?: string;
      eventLocation?: string;
      eventDescription?: string;
      contactPersonName?: string;
      contactPersonDesignation?: string;
      contactPersonEmail?: string;
      contactPersonPhone?: string;
      eventImage?: string;
      galleryImages?: string[];
      galleryType?: string;
      registrationLink?: string;
      brochureLink?: string;
      eventStatus?: number;
    },
  ) {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Event id is required');

    const $set: Record<string, unknown> = { updatedDate: new Date() };
    if (
      payload.eventName !== undefined &&
      String(payload.eventName).trim() !== ''
    )
      $set.eventName = payload.eventName;
    if (payload.eventDate !== undefined) $set.eventDate = payload.eventDate;
    if (
      payload.eventStartTime !== undefined &&
      String(payload.eventStartTime).trim() !== ''
    )
      $set.eventStartTime = payload.eventStartTime;
    if (
      payload.eventEndTime !== undefined &&
      String(payload.eventEndTime).trim() !== ''
    )
      $set.eventEndTime = payload.eventEndTime;
    if (
      payload.eventLocation !== undefined &&
      String(payload.eventLocation).trim() !== ''
    )
      $set.eventLocation = payload.eventLocation;
    if (
      payload.eventDescription !== undefined &&
      String(payload.eventDescription).trim() !== ''
    )
      $set.eventDescription = payload.eventDescription;
    if (
      payload.contactPersonName !== undefined &&
      String(payload.contactPersonName).trim() !== ''
    )
      $set.contactPersonName = payload.contactPersonName;
    if (
      payload.contactPersonDesignation !== undefined &&
      String(payload.contactPersonDesignation).trim() !== ''
    )
      $set.contactPersonDesignation = payload.contactPersonDesignation;
    if (
      payload.contactPersonEmail !== undefined &&
      String(payload.contactPersonEmail).trim() !== ''
    )
      $set.contactPersonEmail = payload.contactPersonEmail;
    if (
      payload.contactPersonPhone !== undefined &&
      String(payload.contactPersonPhone).trim() !== ''
    )
      $set.contactPersonPhone = payload.contactPersonPhone;
    if (payload.eventImage !== undefined) {
      $set.eventImage = payload.eventImage;
      $set.event_image = this.resolveEventImagePath(payload.eventImage);
    }
    if (payload.galleryImages !== undefined) {
      $set.galleryImages = Array.isArray(payload.galleryImages)
        ? payload.galleryImages
        : [];
      const first = Array.isArray(payload.galleryImages)
        ? payload.galleryImages[0]
        : undefined;
      if (first) {
        $set.eventImage = first;
        $set.event_image = this.resolveEventImagePath(first);
      }
    }
    if (
      payload.galleryType !== undefined &&
      String(payload.galleryType).trim() !== ''
    ) {
      $set.galleryType = payload.galleryType;
    }
    if (
      payload.registrationLink !== undefined &&
      String(payload.registrationLink).trim() !== ''
    )
      $set.registrationLink = payload.registrationLink;
    if (
      payload.brochureLink !== undefined &&
      String(payload.brochureLink).trim() !== ''
    )
      $set.brochureLink = payload.brochureLink;
    if (payload.eventStatus === 0 || payload.eventStatus === 1) {
      $set.eventStatus = payload.eventStatus;
    }

    const findQuery: Record<string, unknown> = Types.ObjectId.isValid(raw)
      ? { _id: new Types.ObjectId(raw) }
      : (() => {
          const asNumber = Number.parseInt(raw, 10);
          if (!Number.isFinite(asNumber) || asNumber <= 0) {
            throw new BadRequestException(
              'Invalid event id (expected Mongo _id or numeric eventId)',
            );
          }
          return { eventId: asNumber };
        })();

    const current = await this.eventModel
      .findOne(findQuery)
      .select('_id eventName galleryType')
      .lean()
      .exec();
    if (!current) {
      throw new NotFoundException('Event not found');
    }

    const nextName =
      payload.eventName !== undefined
        ? String(payload.eventName).trim()
        : String((current as any).eventName ?? '').trim();
    const nextType =
      payload.galleryType !== undefined
        ? String(payload.galleryType).trim()
        : String((current as any).galleryType ?? '').trim();
    if (nextType && nextName) {
      const duplicate = await this.eventModel
        .findOne({
          _id: { $ne: (current as any)._id },
          eventName: new RegExp(`^${escapeRegex(nextName)}$`, 'i'),
          galleryType: new RegExp(`^${escapeRegex(nextType)}$`, 'i'),
        })
        .select('_id')
        .lean()
        .exec();
      if (duplicate) {
        throw new ConflictException(
          `A gallery item with this title already exists in "${nextType}"`,
        );
      }
    }

    const updated = await this.eventModel
      .findOneAndUpdate(findQuery, { $set }, { new: true })
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Event not found');
    }

    await this.createNotification({
      title: 'Event updated',
      message: `Event "${String((updated as any).eventName ?? '')}" was updated.`,
      type: 'info',
      source: 'admin',
      referenceType: 'event',
      referenceId: String((updated as any)._id),
    });

    return this.formatEventResponse(updated);
  }

  /**
   * Same row shape as GET /admin/events/list (omit s_no for single-item detail).
   */
  mapEventToAdminListItem(e: any, s_no?: number) {
    const datePart =
      e?.eventDate instanceof Date
        ? e.eventDate.toISOString().slice(0, 10)
        : e?.eventDate
          ? new Date(e.eventDate).toISOString().slice(0, 10)
          : '';
    const timePart = String(e?.eventStartTime ?? '').trim();

    return {
      ...(s_no !== undefined ? { s_no } : {}),
      id: String(e._id),
      eventId: typeof e.eventId === 'number' ? e.eventId : undefined,
      image: e.eventImage ?? null,
      galleryImages: Array.isArray(e.galleryImages)
        ? e.galleryImages
        : e.eventImage
          ? [e.eventImage]
          : [],
      event_image: e.event_image ?? this.resolveEventImagePath(e.eventImage),
      eventName: String(e.eventName ?? ''),
      eventDescription: String(e.eventDescription ?? ''),
      galleryType: e.galleryType ?? '',
      date: datePart,
      dateTime: [datePart, timePart].filter(Boolean).join(' '),
      location: String(e.eventLocation ?? ''),
      is_active: Number(e.eventStatus) === 1,
      registrationLink: e.registrationLink ?? DEFAULT_EVENT_REGISTRATION_LINK,
      brochureLink: e.brochureLink ?? DEFAULT_EVENT_BROCHURE_LINK,
    };
  }

  async listEvents() {
    const rows = await this.eventModel
      .find({})
      .sort({ createdDate: -1, _id: -1 })
      .select(
        'eventName eventDescription eventImage event_image galleryImages galleryType eventDate eventStartTime eventLocation eventStatus createdDate updatedDate eventId registrationLink brochureLink',
      )
      .lean()
      .exec();

    return (rows ?? []).map((e: any, idx: number) =>
      this.mapEventToAdminListItem(e, idx + 1),
    );
  }

  async getEventById(identifier: string) {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Event id is required');

    let event: any = null;
    if (Types.ObjectId.isValid(raw)) {
      event = await this.eventModel
        .findById(new Types.ObjectId(raw))
        .lean()
        .exec();
    } else {
      const asNumber = Number.parseInt(raw, 10);
      if (!Number.isFinite(asNumber) || asNumber <= 0) {
        throw new BadRequestException(
          'Invalid event id (expected Mongo _id or numeric eventId)',
        );
      }
      event = await this.eventModel
        .findOne({ eventId: asNumber })
        .lean()
        .exec();
    }

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const listShape = this.mapEventToAdminListItem(event);
    const formatted = this.formatEventResponse(event);
    return {
      ...formatted,
      ...listShape,
    };
  }

  async deleteEvent(identifier: string) {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Event id is required');

    let res: { deletedCount?: number } | null = null;
    if (Types.ObjectId.isValid(raw)) {
      res = await this.eventModel
        .deleteOne({ _id: new Types.ObjectId(raw) })
        .exec();
    } else {
      const asNumber = Number.parseInt(raw, 10);
      if (!Number.isFinite(asNumber) || asNumber <= 0) {
        throw new BadRequestException(
          'Invalid event id (expected Mongo _id or numeric eventId)',
        );
      }
      res = await this.eventModel.deleteOne({ eventId: asNumber }).exec();
    }

    if (!res || res.deletedCount === 0) {
      throw new NotFoundException('Event not found');
    }

    await this.createNotification({
      title: 'Event deleted',
      message: `Event (${raw}) was deleted.`,
      type: 'warning',
      source: 'admin',
      referenceType: 'event',
      referenceId: raw,
    });

    return { id: raw };
  }

  async setOrToggleEventStatus(identifier: string, status?: number) {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Event id is required');

    const where: Record<string, unknown> = {};
    if (Types.ObjectId.isValid(raw)) {
      where._id = new Types.ObjectId(raw);
    } else {
      const asNumber = Number.parseInt(raw, 10);
      if (!Number.isFinite(asNumber) || asNumber <= 0) {
        throw new BadRequestException(
          'Invalid event id (expected Mongo _id or numeric eventId)',
        );
      }
      where.eventId = asNumber;
    }

    let nextStatus: number;
    if (status === 0 || status === 1) {
      nextStatus = status;
    } else {
      const current = await this.eventModel
        .findOne(where)
        .select('eventStatus')
        .lean()
        .exec();
      if (!current) {
        throw new NotFoundException('Event not found');
      }
      const cur = Number((current as any).eventStatus) === 1 ? 1 : 0;
      nextStatus = cur === 1 ? 0 : 1;
    }

    const updated = await this.eventModel
      .findOneAndUpdate(
        where,
        { $set: { eventStatus: nextStatus, updatedDate: new Date() } },
        { new: true },
      )
      .select('_id eventId eventStatus')
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Event not found');
    }

    await this.createNotification({
      title: 'Gallery status updated',
      message: `Gallery item (${String((updated as any).eventId ?? (updated as any)._id)}) status updated to ${nextStatus === 1 ? 'active' : 'inactive'}.`,
      type: 'info',
      source: 'admin',
      referenceType: 'event',
      referenceId: String((updated as any)._id),
    });

    return {
      id: String((updated as any)._id),
      eventId: (updated as any).eventId,
      status: Number((updated as any).eventStatus) === 1 ? 'active' : 'inactive',
      is_active: Number((updated as any).eventStatus) === 1,
    };
  }

  async createArticle(payload: {
    title: string;
    description?: string;
    date: Date;
    image?: string;
    url?: string;
    externalUrl?: boolean;
    pdf?: string;
    status?: number;
  }) {
    const externalUrl = payload.externalUrl === true;
    const description = String(payload.description ?? '').trim();
    const url = String(payload.url ?? '').trim();
    if (externalUrl) {
      if (!url) {
        throw new BadRequestException('url is required when externalUrl is true');
      }
    } else if (!description) {
      throw new BadRequestException(
        'description is required when externalUrl is false',
      );
    }

    const title = String(payload.title ?? '').trim();
    if (!title) {
      throw new BadRequestException('title is required');
    }
    const duplicate = await this.articleModel
      .findOne({ title: new RegExp(`^${escapeRegex(title)}$`, 'i') })
      .select('_id')
      .lean()
      .exec();
    if (duplicate) {
      throw new ConflictException('An article with this title already exists');
    }

    const doc = new this.articleModel({
      title,
      description: externalUrl ? '' : description,
      date: payload.date,
      image: payload.image,
      article_image: this.resolveArticleImagePath(payload.image),
      url: externalUrl ? url : '',
      externalUrl,
      pdf: payload.pdf,
      article_pdf: this.resolveArticlePdfPath(payload.pdf),
      status: payload.status === 0 || payload.status === 1 ? payload.status : 1,
    });
    const saved = await doc.save();
    await this.createNotification({
      title: 'Article created',
      message: `Article "${String((saved as any).title ?? '')}" was created.`,
      type: 'success',
      source: 'admin',
      referenceType: 'article',
      referenceId: String((saved as any)._id),
    });
    return saved.toObject();
  }

  async updateArticle(
    id: string,
    payload: {
      title?: string;
      description?: string;
      date?: Date;
      image?: string;
      url?: string;
      externalUrl?: boolean;
      pdf?: string;
      status?: number;
    },
  ) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid article id');
    }

    const $set: Record<string, unknown> = {};
    if (payload.title !== undefined) {
      const nextTitle = String(payload.title).trim();
      if (!nextTitle) {
        throw new BadRequestException('title cannot be empty');
      }
      const duplicate = await this.articleModel
        .findOne({
          _id: { $ne: objectId },
          title: new RegExp(`^${escapeRegex(nextTitle)}$`, 'i'),
        })
        .select('_id')
        .lean()
        .exec();
      if (duplicate) {
        throw new ConflictException('An article with this title already exists');
      }
      $set.title = nextTitle;
    }
    if (payload.description !== undefined) $set.description = String(payload.description).trim();
    if (payload.date !== undefined) $set.date = payload.date;
    if (payload.image !== undefined) {
      $set.image = payload.image;
      $set.article_image = this.resolveArticleImagePath(payload.image);
    }
    if (payload.url !== undefined) $set.url = String(payload.url).trim();
    if (payload.externalUrl !== undefined) $set.externalUrl = payload.externalUrl === true;
    if (payload.pdf !== undefined) {
      $set.pdf = payload.pdf;
      $set.article_pdf = this.resolveArticlePdfPath(payload.pdf);
    }
    if (payload.status === 0 || payload.status === 1) $set.status = payload.status;
    if (Object.keys($set).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    const current = await this.articleModel.findById(objectId).lean().exec();
    if (!current) throw new NotFoundException('Article not found');

    const nextExternalUrl =
      payload.externalUrl !== undefined
        ? payload.externalUrl === true
        : payload.url !== undefined && payload.description === undefined
          ? true
          : payload.description !== undefined && payload.url === undefined
            ? false
            : (current as any).externalUrl === true;
    const nextDescription =
      payload.description !== undefined
        ? String(payload.description ?? '').trim()
        : String((current as any).description ?? '').trim();
    const nextUrl =
      payload.url !== undefined
        ? String(payload.url ?? '').trim()
        : String((current as any).url ?? '').trim();

    if (nextExternalUrl) {
      if (!nextUrl) {
        throw new BadRequestException('url is required when externalUrl is true');
      }
      $set.description = '';
      $set.url = nextUrl;
      $set.externalUrl = true;
    } else {
      if (!nextDescription) {
        throw new BadRequestException(
          'description is required when externalUrl is false',
        );
      }
      $set.url = '';
      $set.description = nextDescription;
      $set.externalUrl = false;
    }

    const updated = await this.articleModel
      .findByIdAndUpdate(objectId, { $set }, { new: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Article not found');

    await this.createNotification({
      title: 'Article updated',
      message: `Article "${String((updated as any).title ?? '')}" was updated.`,
      type: 'info',
      source: 'admin',
      referenceType: 'article',
      referenceId: String((updated as any)._id),
    });

    return updated;
  }

  async listArticles() {
    const rows = await this.articleModel
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .select(
        'title description date image article_image url externalUrl pdf article_pdf status',
      )
      .lean()
      .exec();

    return (rows ?? []).map((a: any, idx: number) => ({
      s_no: idx + 1,
      id: String(a._id),
      title: String(a.title ?? ''),
      description: String(a.description ?? ''),
      date:
        a?.date instanceof Date
          ? a.date.toISOString().slice(0, 10)
          : a?.date
            ? new Date(a.date).toISOString().slice(0, 10)
            : '',
      image: this.resolveArticleAssetForResponse(a.image) || null,
      article_image: this.resolveArticleAssetForResponse(
        a.article_image ?? this.resolveArticleImagePath(a.image),
      ),
      url: a.externalUrl === true ? String(a.url ?? '') : '',
      externalUrl: a.externalUrl === true,
      pdf: this.resolveArticleAssetForResponse(a.pdf) || null,
      article_pdf: this.resolveArticleAssetForResponse(
        a.article_pdf ?? this.resolveArticlePdfPath(a.pdf),
      ),
      is_active: Number(a.status) === 1,
    }));
  }

  async getArticleById(id: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid article id');
    }
    const article = await this.articleModel.findById(objectId).lean().exec();
    if (!article) throw new NotFoundException('Article not found');

    return {
      id: String((article as any)._id),
      title: String((article as any).title ?? ''),
      description: String((article as any).description ?? ''),
      date:
        (article as any)?.date instanceof Date
          ? (article as any).date.toISOString().slice(0, 10)
          : (article as any)?.date
            ? new Date((article as any).date).toISOString().slice(0, 10)
            : '',
      image: this.resolveArticleAssetForResponse((article as any).image) || null,
      article_image: this.resolveArticleAssetForResponse(
        (article as any).article_image ??
          this.resolveArticleImagePath((article as any).image),
      ),
      url:
        (article as any).externalUrl === true
          ? String((article as any).url ?? '')
          : '',
      externalUrl: (article as any).externalUrl === true,
      pdf: this.resolveArticleAssetForResponse((article as any).pdf) || null,
      article_pdf: this.resolveArticleAssetForResponse(
        (article as any).article_pdf ??
          this.resolveArticlePdfPath((article as any).pdf),
      ),
      is_active: Number((article as any).status) === 1,
    };
  }

  async setOrToggleArticleStatus(id: string, status?: number) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid article id');
    }

    let nextStatus: number;
    if (status === 0 || status === 1) {
      nextStatus = status;
    } else {
      const current = await this.articleModel
        .findById(objectId)
        .select('status')
        .lean()
        .exec();
      if (!current) throw new NotFoundException('Article not found');
      nextStatus = Number((current as any).status) === 1 ? 0 : 1;
    }

    const updated = await this.articleModel
      .findByIdAndUpdate(
        objectId,
        { $set: { status: nextStatus } },
        { new: true },
      )
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Article not found');

    return {
      id: String((updated as any)._id),
      status: Number((updated as any).status) === 1 ? 'active' : 'inactive',
      is_active: Number((updated as any).status) === 1,
    };
  }

  async deleteArticle(id: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid article id');
    }

    const existing = await this.articleModel
      .findById(objectId)
      .select('title')
      .lean()
      .exec();
    if (!existing) {
      throw new NotFoundException('Article not found');
    }

    const res = await this.articleModel.deleteOne({ _id: objectId }).exec();
    if (!res || res.deletedCount === 0) {
      throw new NotFoundException('Article not found');
    }

    await this.createNotification({
      title: 'Article deleted',
      message: `Article "${String((existing as any).title ?? '')}" was deleted.`,
      type: 'warning',
      source: 'admin',
      referenceType: 'article',
      referenceId: id,
    });

    return { id };
  }

  async replyToCustomerViaManufacturer(payload: {
    email: string;
    userMessage: string;
    replyMessage: string;
  }) {
    const brand = 'GreenPro';
    const subject = `Reply from ${brand}`;
    const cleanReply = String(payload.replyMessage ?? '').trim();
    const apiBase = String(process.env.API_BASE_URL ?? '')
      .trim()
      .replace(/\/+$/, '');
    const logoUrl = String(
      process.env.GREENPRO_LOGO_URL ??
        (apiBase ? `${apiBase}/uploads/greenpro-logo.svg` : ''),
    ).trim();
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; padding: 20px;">
          <div style="padding: 0 0 14px 0; border-bottom: 1px solid #e5e7eb;">
            ${
              logoUrl
                ? `<img src="${escapeHtml(logoUrl)}" alt="${brand}" style="display:block; max-height:48px; width:auto; margin:0 0 10px 0;" />`
                : `<div style="font-size: 20px; font-weight: 800; color: #16a34a;">${brand}</div>`
            }
            <div style="font-size: 14px; font-weight: 600; color: #111827;">Support</div>
          </div>

          <div style="padding: 16px 0 0 0;">
            <p style="margin: 0 0 12px 0;">Hello,</p>
            <p style="margin: 0 0 12px 0;">Please find our response below.</p>
            <div style="white-space: pre-wrap; margin: 0 0 16px 0;">${escapeHtml(cleanReply)}</div>

            <p style="margin: 0;">Regards,<br />${brand} Support Team</p>
            <p style="margin: 12px 0 0 0; font-size: 12px; color: #6b7280;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </body>
      </html>
    `;

    const textBody = `Hello,\n\nPlease find our response below.\n\n${cleanReply}\n\nRegards,\n${brand} Support Team`;

    this.emailService.sendInBackground(() =>
      this.emailService.sendEmail(
        payload.email,
        subject,
        htmlBody,
        textBody,
      ),
    );

    return { to: payload.email, subject };
  }

  async sendContactReply(contactMessageId: string, replyMessage: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(contactMessageId);
    } catch {
      throw new BadRequestException('Invalid contact message id');
    }

    const contact = await this.contactMessageModel
      .findById(objectId)
      .select('name email phoneNumber subject message createdAt')
      .lean()
      .exec();

    if (!contact) {
      throw new NotFoundException('Contact message not found');
    }

    const to = String((contact as any).email ?? '')
      .trim()
      .toLowerCase();
    if (!to) {
      throw new BadRequestException('Contact message has no email');
    }

    const subject = `Reply to your inquiry${(contact as any).subject ? `: ${String((contact as any).subject).trim()}` : ''}`;
    const name = String((contact as any).name ?? '').trim();
    const greeting = name ? `Hi ${name},` : 'Hello,';
    const cleanReply = String(replyMessage ?? '').trim();
    const apiBase = String(process.env.API_BASE_URL ?? '')
      .trim()
      .replace(/\/+$/, '');
    const logoUrl = String(
      process.env.GREENPRO_LOGO_URL ??
        (apiBase ? `${apiBase}/uploads/greenpro-logo.svg` : ''),
    ).trim();

    const htmlBody = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${escapeHtml(subject)}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; padding: 20px;">
          <div style="padding: 0 0 14px 0; border-bottom: 1px solid #e5e7eb;">
            ${
              logoUrl
                ? `<img src="${escapeHtml(logoUrl)}" alt="GreenPro" style="display:block; max-height:48px; width:auto; margin:0 0 10px 0;" />`
                : `<div style="font-size: 20px; font-weight: 800; color: #16a34a;">GreenPro</div>`
            }
            <div style="font-size: 14px; font-weight: 600; color: #111827;">Support</div>
          </div>

          <div style="padding: 16px 0 0 0;">
            <p style="margin: 0 0 12px 0;">${escapeHtml(greeting)}</p>
            <p style="margin: 0 0 12px 0;">Thank you for contacting us. Please find our response below.</p>
            <div style="white-space: pre-wrap; margin: 0 0 16px 0;">${escapeHtml(cleanReply)}</div>

            <p style="margin: 0;">Regards,<br />GreenPro Support Team</p>
            <p style="margin: 12px 0 0 0; font-size: 12px; color: #6b7280;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </body>
      </html>
    `;

    const textBody = `${greeting}\n\nThank you for contacting us. Please find our response below.\n\n${cleanReply}\n\nRegards,\nGreenPro Support Team`;

    const entry = {
      adminReply: replyMessage,
      repliedAt: new Date(),
    };

    await this.contactReplyThreadModel
      .updateOne(
        { contactMessageId: objectId },
        {
          $setOnInsert: { contactMessageId: objectId, email: to },
          $push: { conversations: entry },
        },
        { upsert: true },
      )
      .exec(); 

    await this.createNotification({
      title: 'Contact replied',
      message: `Admin replied to contact ${to}.`,
      type: 'info',
      source: 'admin',
      referenceType: 'contact',
      referenceId: String(objectId),
    });

    this.emailService.sendInBackground(() =>
      this.emailService.sendEmail(to, subject, htmlBody, textBody),
    );

    return { sent: true };
  }

  async getContactReplyHistory(contactMessageId: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(contactMessageId);
    } catch {
      throw new BadRequestException('Invalid contact message id');
    }

    const thread = await this.contactReplyThreadModel
      .findOne({ contactMessageId: objectId })
      .lean()
      .exec();

    if (!thread) {
      return { contactMessageId, email: null, conversations: [] };
    }

    return {
      contactMessageId: String((thread as any).contactMessageId),
      email: String((thread as any).email ?? ''),
      conversations: ((thread as any).conversations ?? []).map((c: any) => ({
        adminReply: String(c?.adminReply ?? ''),
        repliedAt: c?.repliedAt ?? null,
      })),
    };
  }

  async listNotifications(query: ListNotificationsQueryDto) {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 20);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;
    const skip = (safePage - 1) * safeLimit;

    const now = new Date();
    const where: Record<string, unknown> = {};
    switch (query?.range) {
      case 'today': {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        where.createdAt = { $gte: start };
        break;
      }
      case 'week': {
        const start = new Date(now);
        start.setDate(now.getDate() - 7);
        where.createdAt = { $gte: start };
        break;
      }
      case '30d': {
        const start = new Date(now);
        start.setDate(now.getDate() - 30);
        where.createdAt = { $gte: start };
        break;
      }
      case '90d': {
        const start = new Date(now);
        start.setDate(now.getDate() - 90);
        where.createdAt = { $gte: start };
        break;
      }
      default:
        break;
    }

    const [totalCount, rows] = await Promise.all([
      this.notificationModel.countDocuments(where).exec(),
      this.notificationModel
        .find(where)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),
    ]);

    return {
      data: (rows ?? []).map((n: any) => ({
        id: String(n._id),
        title: String(n.title ?? ''),
        message: String(n.message ?? ''),
        type: String(n.type ?? 'info'),
        source: String(n.source ?? 'system'),
        referenceType: n.referenceType ?? null,
        referenceId: n.referenceId ?? null,
        actorName: n.actorName ?? null,
        createdAt: n.createdAt ?? null,
      })),
      totalCount,
      currentPage: safePage,
      totalPages: Math.max(1, Math.ceil(totalCount / safeLimit)),
    };
  }

  async createTeamMember(
    vendorId: string,
    data: {
      name: string;
      designation?: string;
      email: string;
      mobile: string;
      displayOrder?: number;
      team: TeamMemberTeam;
      imagePath?: string;
      facebookUrl?: string;
      twitterUrl?: string;
      linkedinUrl?: string;
      roleId?: string;
      roleIds?: string[];
      /** Optional; omit or empty = no product categories linked. */
      category_ids?: number[];
    },
  ) {
    let vendorObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
    } catch {
      throw new BadRequestException('Invalid vendor ID format');
    }

    const emailLower = data.email.trim().toLowerCase();
    const mobileTrim = data.mobile.trim();

    const existingActive = await this.vendorUserModel
      .findOne({
        $and: [
          { manufacturerId: vendorObjectId },
          { status: { $ne: 2 } },
          { type: 'staff' },
          {
            $or: [
              { email: new RegExp(`^${escapeRegex(emailLower)}$`, 'i') },
              { phone: mobileTrim },
            ],
          },
        ],
      })
      .select('_id email phone')
      .lean()
      .exec();

    if (existingActive) {
      if (
        String(existingActive.email ?? '').toLowerCase() === emailLower
      ) {
        throw new ConflictException('Email already exists');
      }
      if (existingActive.phone === mobileTrim) {
        throw new ConflictException('Phone number already exists');
      }
      throw new ConflictException('Team member already exists');
    }

    /** Same email/phone can still exist on a soft-deleted row (status 2); unique index blocks a second insert. */
    const softDeleted = await this.vendorUserModel
      .findOne({
        manufacturerId: vendorObjectId,
        type: 'staff',
        status: 2,
        $or: [
          { email: new RegExp(`^${escapeRegex(emailLower)}$`, 'i') },
          { phone: mobileTrim },
        ],
      })
      .exec();

    if (softDeleted) {
      /**
       * Omit displayOrder → next slot after max existing order in this team (not roster count).
       * Explicit order: any positive integer up to TEAM_MEMBER_DISPLAY_ORDER_MAX; uniqueness per team enforced by shift + index.
       */
      const desiredOrder =
        data.displayOrder === undefined
          ? await this.nextDefaultDisplayOrderForTeam(vendorObjectId, data.team)
          : data.displayOrder;
      this.assertTeamMemberDisplayOrderAllowed(desiredOrder);

      await this.vendorUserModel
        .updateMany(
          {
            manufacturerId: vendorObjectId,
            type: 'staff',
            status: { $ne: 2 },
            team: data.team,
            displayOrder: { $gte: desiredOrder },
          },
          { $inc: { displayOrder: 1 } },
        )
        .exec();

      const passwordHash = await bcrypt.hash(
        crypto.randomBytes(8).toString('hex'),
        10,
      );

      const categoryIds = data.category_ids ?? [];
      if (categoryIds.length > 0) {
        await this.categoriesService.assertNumericCategoriesExist(categoryIds);
      }

      const $set: Record<string, unknown> = {
        name: data.name.trim(),
        email: emailLower,
        phone: mobileTrim,
        status: 1,
        isVerified: true,
        password: passwordHash,
        displayOrder: desiredOrder,
        team: data.team,
        image: data.imagePath,
        facebookUrl: data.facebookUrl,
        twitterUrl: data.twitterUrl,
        linkedinUrl: data.linkedinUrl,
        updatedAt: new Date(),
        category_ids: categoryIds,
      };
      if (categoryIds.length > 0) {
        $set.category_id = categoryIds[0];
      }
      if (data.designation !== undefined && data.designation !== '') {
        $set.designation = data.designation;
      }

      const updatePayload: Record<string, unknown> = { $set };
      const $unset: Record<string, string> = {};
      if (data.designation !== undefined && data.designation === '') {
        $unset.designation = '';
      }
      if (categoryIds.length === 0) {
        $unset.category_id = '';
      }
      if (Object.keys($unset).length > 0) {
        updatePayload.$unset = $unset;
      }

      let updated: VendorUserDocument | null;
      try {
        updated = await this.vendorUserModel
          .findByIdAndUpdate(softDeleted._id, updatePayload, { new: true })
          .exec();
      } catch (e: unknown) {
        if (isMongoStaffTeamDisplayOrderDuplicate(e)) {
          throwDisplayOrderTaken();
        }
        throw e;
      }

      if (!updated) {
        throw new NotFoundException('Team member record could not be reactivated');
      }

      const normalizedRoleIds =
        Array.isArray(data.roleIds) && data.roleIds.length > 0
          ? Array.from(
              new Set(data.roleIds.map((id) => String(id).trim()).filter(Boolean)),
            )
          : data.roleId
            ? [String(data.roleId).trim()]
            : [];

      const rbacResult = await this.rbacService.replaceStaffRoles(vendorId, {
        vendorUserId: String(updated._id),
        roleIds: normalizedRoleIds,
      });

      this.invalidateWebsiteTeamMembersListCache();

      const obj: any = updated.toObject();
      delete obj.password;
      delete obj.otp;
      const id = String(updated._id);
      const cat = this.teamMemberCategoryArrays(obj);
      return {
        ...obj,
        id,
        vendorUserId: id,
        roleIds: normalizedRoleIds,
        portalAccess: normalizedRoleIds.length > 0,
        category_ids: cat.category_ids,
        categoryIds: cat.categoryIds,
        ...(rbacResult.temporaryPassword != null && rbacResult.email != null
          ? {
              temporaryPassword: rbacResult.temporaryPassword,
              email: rbacResult.email,
            }
          : {}),
      };
    }

    const desiredOrder =
      data.displayOrder === undefined
        ? await this.nextDefaultDisplayOrderForTeam(vendorObjectId, data.team)
        : data.displayOrder;
    this.assertTeamMemberDisplayOrderAllowed(desiredOrder);

    await this.vendorUserModel
      .updateMany(
        {
          manufacturerId: vendorObjectId,
          type: 'staff',
          status: { $ne: 2 },
          team: data.team,
          displayOrder: { $gte: desiredOrder },
        },
        { $inc: { displayOrder: 1 } },
      )
      .exec();

    // Staff can log into admin portal only after a role is assigned (RBAC mapping).
    // We still store a random password hash here; on first role assignment we rotate it
    // and send credentials via email (see RbacService).
    const passwordHash = await bcrypt.hash(crypto.randomBytes(8).toString('hex'), 10);

    const categoryIds = data.category_ids ?? [];
    if (categoryIds.length > 0) {
      await this.categoriesService.assertNumericCategoriesExist(categoryIds);
    }

    const teamMember: Partial<VendorUser> = {
      // Canonical + legacy alias (some modules still query vendorId)
      manufacturerId: vendorObjectId,
      vendorId: vendorObjectId,
      type: 'staff',
      status: 1,
      isVerified: true,
      name: data.name,
      ...(data.designation !== undefined && data.designation !== ''
        ? { designation: data.designation }
        : {}),
      email: emailLower,
      phone: mobileTrim,
      image: data.imagePath,
      facebookUrl: data.facebookUrl,
      twitterUrl: data.twitterUrl,
      linkedinUrl: data.linkedinUrl,
      displayOrder: desiredOrder,
      team: data.team,
      password: passwordHash,
      category_ids: categoryIds,
      ...(categoryIds.length > 0 ? { category_id: categoryIds[0] } : {}),
    };

    const created = new this.vendorUserModel(teamMember);
    let saved: any;
    try {
      saved = await created.save();
    } catch (e: any) {
      if (e?.code === 11000) {
        if (isMongoStaffTeamDisplayOrderDuplicate(e)) {
          throwDisplayOrderTaken();
        }
        const pattern = (e?.keyPattern ?? {}) as Record<string, unknown>;
        const keyVal = (e?.keyValue ?? {}) as Record<string, unknown>;
        if ('email' in pattern || keyVal.email !== undefined) {
          throw new ConflictException('Email already exists');
        }
        if ('phone' in pattern || keyVal.phone !== undefined) {
          throw new ConflictException('Phone number already exists');
        }
        throw new ConflictException('Duplicate record');
      }
      throw e;
    }

    // Never return password hash/plaintext
    const obj: any = saved.toObject();
    delete obj.password;
    delete obj.otp;

    const normalizedRoleIds =
      Array.isArray(data.roleIds) && data.roleIds.length > 0
        ? Array.from(new Set(data.roleIds.map((id) => String(id).trim()).filter(Boolean)))
        : data.roleId
          ? [String(data.roleId).trim()]
          : [];

    // Role assignments drive portal access; credentials are sent only on first transition
    // from no-roles to any-role by RBAC service.
    const rbacResult = await this.rbacService.replaceStaffRoles(vendorId, {
      vendorUserId: String(saved._id),
      roleIds: normalizedRoleIds,
    });

    this.invalidateWebsiteTeamMembersListCache();

    const id = String(saved._id);
    const cat = this.teamMemberCategoryArrays(obj);
    return {
      ...obj,
      id,
      vendorUserId: id,
      roleIds: normalizedRoleIds,
      portalAccess: normalizedRoleIds.length > 0,
      category_ids: cat.category_ids,
      categoryIds: cat.categoryIds,
      ...(rbacResult.temporaryPassword != null && rbacResult.email != null
        ? {
            temporaryPassword: rbacResult.temporaryPassword,
            email: rbacResult.email,
          }
        : {}),
    };
  }

  /**
   * Team members for the admin table: non-deleted partners (status !== 2).
   * status 1 = active, 0 = inactive (matches partner toggle).
   */
  async listTeamMembers(_vendorId: string) {
    const members = await this.vendorUserModel
      .find({
        type: 'staff',
        status: { $ne: 2 },
      })
      .sort({ displayOrder: 1, _id: 1 })
      .select(
        'name designation email phone status displayOrder team category_ids category_id',
      )
      .lean()
      .exec();

    return members.map((m, index) => {
      const cat = this.teamMemberCategoryArrays(m as any);
      return {
        s_no: index + 1,
        id: String(m._id),
        vendorUserId: String(m._id),
        name: m.name,
        designation: m.designation ?? '',
        email: m.email,
        mobile: m.phone,
        is_active: m.status === 1,
        displayOrder: this.persistedTeamMemberDisplayOrder((m as any).displayOrder),
        team: String((m as any).team ?? ''),
        category_ids: cat.category_ids,
        categoryIds: cat.categoryIds,
      };
    });
  }

  async listTeamMembersPaginated(
    _vendorId: string,
    query: ListTeamMembersQueryDto,
    opts?: { categoryNumericId?: number },
  ): Promise<TeamMembersPaginatedResult> {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
    const perPage = Number.isFinite(limit) && limit > 0 ? limit : 10;
    const skip = (currentPage - 1) * perPage;

    const mongoQuery: Record<string, unknown> = {
      type: 'staff',
      status: { $ne: 2 },
    };

    const catId = opts?.categoryNumericId;
    if (
      catId !== undefined &&
      typeof catId === 'number' &&
      Number.isInteger(catId) &&
      catId >= 1
    ) {
      mongoQuery.$or = [
        { category_ids: catId },
        { category_id: catId },
      ];
    }

    const rawStatus = query?.status?.trim().toLowerCase();
    if (rawStatus) {
      if (rawStatus === 'active' || rawStatus === '1') mongoQuery.status = 1;
      if (rawStatus === 'inactive' || rawStatus === '0') mongoQuery.status = 0;
    }

    const designation = query?.designation?.trim();
    if (designation) {
      mongoQuery.designation = new RegExp(`^${escapeRegex(designation)}$`, 'i');
    }

    const [displayOrderMax, totalCount, members] = await Promise.all([
      this.vendorUserModel
        .aggregate<{ maxOrd: number | null }>([
          { $match: mongoQuery },
          { $group: { _id: null, maxOrd: { $max: '$displayOrder' } } },
        ])
        .exec()
        .then((rows) => {
          const v = rows[0]?.maxOrd;
          return typeof v === 'number' && Number.isFinite(v) ? v : 0;
        }),
      this.vendorUserModel.countDocuments(mongoQuery).exec(),
      this.vendorUserModel
        .find(mongoQuery)
        .sort({ displayOrder: 1, _id: 1 })
        .skip(skip)
        .limit(perPage)
        .select(
          'name designation email phone status displayOrder team category_ids category_id',
        )
        .lean()
        .exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
    const data = (members ?? []).map((m, index) => {
      const cat = this.teamMemberCategoryArrays(m as any);
      return {
        s_no: skip + index + 1,
        id: String(m._id),
        vendorUserId: String(m._id),
        name: m.name,
        designation: m.designation ?? '',
        email: m.email,
        mobile: m.phone,
        is_active: m.status === 1,
        displayOrder: this.persistedTeamMemberDisplayOrder((m as any).displayOrder),
        team: String((m as any).team ?? ''),
        category_ids: cat.category_ids,
        categoryIds: cat.categoryIds,
      };
    });

    return {
      data,
      displayOrderMax: Math.max(1, displayOrderMax),
      totalCount,
      currentPage,
      totalPages,
    };
  }

  /**
   * Partial, case-insensitive match on name and/or email (non-deleted partners only).
   * When both filters are set, both must match (AND).
   */
  async searchTeamMembers(_vendorId: string, filters: { name?: string; email?: string }) {
    const name = filters.name?.trim();
    const email = filters.email?.trim();
    if (!name && !email) {
      throw new BadRequestException('Provide a name and/or email to search');
    }

    const query: Record<string, unknown> = {
      type: 'staff',
      status: { $ne: 2 },
    };
    if (name) {
      query.name = new RegExp(escapeRegex(name), 'i');
    }
    if (email) {
      query.email = new RegExp(escapeRegex(email), 'i');
    }

    const members = await this.vendorUserModel
      .find(query)
      .sort({ displayOrder: 1, _id: 1 })
      .select(
        'name designation email phone status displayOrder team category_ids category_id',
      )
      .lean()
      .exec();

    return members.map((m, index) => {
      const cat = this.teamMemberCategoryArrays(m as any);
      return {
        s_no: index + 1,
        id: String(m._id),
        vendorUserId: String(m._id),
        name: m.name,
        designation: m.designation ?? '',
        email: m.email,
        mobile: m.phone,
        is_active: m.status === 1,
        displayOrder: this.persistedTeamMemberDisplayOrder((m as any).displayOrder),
        team: String((m as any).team ?? ''),
        category_ids: cat.category_ids,
        categoryIds: cat.categoryIds,
      };
    });
  }

  /** Single team member for view modal (non-deleted partner, same vendor). */
  async getTeamMemberById(_vendorId: string, memberId: string) {
    let memberObjectId: Types.ObjectId;
    try {
      memberObjectId = new Types.ObjectId(memberId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const member = await this.vendorUserModel
      .findOne({
        _id: memberObjectId,
        type: 'staff',
        status: { $ne: 2 },
      })
      .select(
        'name designation email phone status image facebookUrl twitterUrl linkedinUrl displayOrder team category_ids category_id',
      )
      .lean()
      .exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const st = member.status ?? 0;
    const cat = this.teamMemberCategoryArrays(member as any);
    return {
      id: String(member._id),
      vendorUserId: String(member._id),
      name: member.name,
      designation: member.designation ?? '',
      email: member.email,
      mobile: member.phone,
      status: st === 1 ? 'Active' : 'Inactive',
      image: member.image ?? null,
      facebookUrl: member.facebookUrl ?? '',
      twitterUrl: member.twitterUrl ?? '',
      linkedinUrl: member.linkedinUrl ?? '',
      displayOrder: this.persistedTeamMemberDisplayOrder((member as any).displayOrder),
      team: String((member as any).team ?? ''),
      category_ids: cat.category_ids,
      categoryIds: cat.categoryIds,
    };
  }

  async createBanner(vendorId: string, dto: CreateBannerDto) {
    let vendorObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
    } catch {
      throw new BadRequestException('Invalid vendor ID format');
    }

    let sequenceNumber = dto.sequenceNumber;
    if (sequenceNumber === undefined) {
      const latestBanner = await this.bannerModel
        .findOne({ $or: [{ vendorId: vendorObjectId }, { vendorId }] })
        .sort({ sequenceNumber: -1, createdAt: -1 })
        .select('sequenceNumber')
        .lean()
        .exec();
      const currentMax = Number((latestBanner as any)?.sequenceNumber ?? 0);
      sequenceNumber = Number.isFinite(currentMax) && currentMax >= 1 ? currentMax + 1 : 1;
    } else {
      const duplicateSequence = await this.bannerModel
        .exists({
          sequenceNumber,
          $or: [{ vendorId: vendorObjectId }, { vendorId }],
        })
        .lean()
        .exec();
      if (duplicateSequence) {
        throw new ConflictException(
          `Sequence number ${sequenceNumber} already exists for another banner`,
        );
      }
    }

    const created = new this.bannerModel({
      vendorId: vendorObjectId,
      banner_image: this.resolveBannerImagePath(dto.imageUrl),
      imageUrl: String(dto.imageUrl ?? '').trim(),
      imageSource: dto.imageSource === 'binary_upload' ? 'binary_upload' : 'manual_url',
      heading: dto.title.trim(),
      sequenceNumber,
      description: dto.description.trim(),
      status:
        String(dto.status ?? '').trim().toLowerCase() === 'inactive' ||
        String(dto.status ?? '').trim() === '0'
          ? 0
          : 1,
    });
    const saved = await created.save();
    const o = saved.toObject();
    const st = o.status ?? 1;
    return {
      id: String(o._id),
      imageUrl: this.resolveBannerImageForResponse(o.imageUrl, o.banner_image),
      imageSource:
        String((o as any).imageSource) === 'binary_upload'
          ? 'binary_upload'
          : 'manual_url',
      heading: o.heading,
      title: o.heading,
      sequenceNumber: Number(o.sequenceNumber ?? 1),
      description: o.description,
      status: st === 1 ? 'active' : 'inactive',
      is_active: st === 1,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };
  }

  /**
   * Banners for the vendor admin grid: image, heading, full description (UI clamps ~3 lines), toggle state.
   */
  async listBanners(vendorId: string) {
    let vendorObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
    } catch {
      throw new BadRequestException('Invalid vendor ID format');
    }

    const rows = await this.bannerModel
      .find({
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
      })
      .sort({ sequenceNumber: 1, createdAt: -1, _id: -1 })
      .select('banner_image imageUrl imageSource heading sequenceNumber description status')
      .lean()
      .exec();

    return rows.map((b, index) => {
      const st = b.status ?? 1;
      return {
        s_no: index + 1,
        id: String(b._id),
        imageUrl: this.resolveBannerImageForResponse(b.imageUrl, b.banner_image),
        imageSource:
          String((b as any).imageSource) === 'binary_upload'
            ? 'binary_upload'
            : 'manual_url',
        heading: b.heading,
        title: b.heading,
        sequenceNumber: Number((b as any).sequenceNumber ?? 1),
        description: b.description,
        status: st === 1 ? 'active' : 'inactive',
        is_active: st === 1,
      };
    });
  }

  /** Public banner list for website (active only, newest first). */
  async listPublicBanners() {
    const rows = await this.bannerModel
      .find({
        $or: [
          { status: 1 },
          { status: { $exists: false } },
          { status: null as any },
        ],
      })
      .sort({ sequenceNumber: 1, createdAt: -1, _id: -1 })
      .select('banner_image imageUrl imageSource heading sequenceNumber description status')
      .lean()
      .exec();

    return rows.map((b, index) => ({
      s_no: index + 1,
      id: String(b._id),
      imageUrl: this.resolveBannerImageForResponse(b.imageUrl, b.banner_image),
      imageSource:
        String((b as any).imageSource) === 'binary_upload'
          ? 'binary_upload'
          : 'manual_url',
      heading: b.heading,
      title: b.heading,
      sequenceNumber: Number((b as any).sequenceNumber ?? 1),
      description: b.description,
      status: (b.status ?? 1) === 1 ? 'active' : 'inactive',
      is_active: (b.status ?? 1) === 1,
    }));
  }

  /** Single banner for the View modal (image URL, heading, description). */
  async getBannerById(vendorId: string, bannerId: string) {
    let vendorObjectId: Types.ObjectId;
    let bannerObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const b = await this.bannerModel
      .findOne({
        _id: bannerObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
      })
      .select('banner_image imageUrl imageSource heading sequenceNumber description status')
      .lean()
      .exec();

    if (!b) {
      throw new NotFoundException('Banner not found');
    }

    return {
      id: String(b._id),
      imageUrl: this.resolveBannerImageForResponse(b.imageUrl, b.banner_image),
      imageSource:
        String((b as any).imageSource) === 'binary_upload'
          ? 'binary_upload'
          : 'manual_url',
      heading: b.heading,
      title: b.heading,
      sequenceNumber: Number((b as any).sequenceNumber ?? 1),
      description: b.description,
      status: Number((b as any).status) === 1 ? 'active' : 'inactive',
    };
  }

  /** Updates a banner that belongs to the vendor. */
  async updateBanner(
    vendorId: string,
    bannerId: string,
    payload: {
      imageUrl?: string;
      imageSource?: 'binary_upload' | 'manual_url';
      title?: string;
      sequenceNumber?: number;
      description?: string;
      status?: string;
    },
  ) {
    let vendorObjectId: Types.ObjectId;
    let bannerObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const existing = await this.bannerModel
      .findOne({
        _id: bannerObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
      })
      .select('_id')
      .lean()
      .exec();

    if (!existing) {
      throw new NotFoundException('Banner not found');
    }

    if (payload.sequenceNumber !== undefined) {
      const duplicateSequence = await this.bannerModel
        .exists({
          _id: { $ne: bannerObjectId },
          sequenceNumber: payload.sequenceNumber,
          $or: [{ vendorId: vendorObjectId }, { vendorId }],
        })
        .lean()
        .exec();
      if (duplicateSequence) {
        throw new ConflictException(
          `Sequence number ${payload.sequenceNumber} already exists for another banner`,
        );
      }
    }

    const $set: Record<string, unknown> = { updatedAt: new Date() };
    if (payload.title !== undefined) {
      $set.heading = payload.title.trim();
    }
    if (payload.sequenceNumber !== undefined) {
      $set.sequenceNumber = payload.sequenceNumber;
    }
    if (payload.description !== undefined) {
      $set.description = payload.description.trim();
    }
    if (payload.status !== undefined) {
      $set.status =
        String(payload.status).trim().toLowerCase() === 'inactive' ||
        String(payload.status).trim() === '0'
          ? 0
          : 1;
    }
    if (payload.imageUrl !== undefined) {
      $set.imageUrl = payload.imageUrl.trim();
      $set.banner_image = this.resolveBannerImagePath(payload.imageUrl);
    }
    if (payload.imageSource !== undefined) {
      $set.imageSource =
        payload.imageSource === 'binary_upload' ? 'binary_upload' : 'manual_url';
    }

    const updated = await this.bannerModel
      .findByIdAndUpdate(bannerObjectId, { $set }, { new: true })
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Banner not found');
    }

    const st = updated.status ?? 1;
    return {
      id: String(updated._id),
      imageUrl: this.resolveBannerImageForResponse(
        (updated as any).imageUrl,
        (updated as any).banner_image,
      ),
      imageSource:
        String((updated as any).imageSource) === 'binary_upload'
          ? 'binary_upload'
          : 'manual_url',
      heading: updated.heading,
      title: updated.heading,
      sequenceNumber: Number((updated as any).sequenceNumber ?? 1),
      description: updated.description,
      status: st === 1 ? 'active' : 'inactive',
      is_active: st === 1,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  /** Permanently removes a banner that belongs to the vendor. */
  async deleteBanner(vendorId: string, bannerId: string) {
    let vendorObjectId: Types.ObjectId;
    let bannerObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const res = await this.bannerModel
      .deleteOne({
        _id: bannerObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
      })
      .exec();

    if (res.deletedCount === 0) {
      throw new NotFoundException('Banner not found');
    }

    return { id: bannerId };
  }

  /**
   * Set or toggle a banner's status (vendor-scoped).
   *
   * - When `status` is provided: sets explicitly (active/inactive)
   * - When `status` is omitted: toggles (1 ↔ 0)
   */
  async setOrToggleBannerStatus(
    vendorId: string,
    bannerId: string,
    status?: string,
  ) {
    let vendorObjectId: Types.ObjectId;
    let bannerObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const existing = await this.bannerModel
      .findOne({
        _id: bannerObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
      })
      .select('status')
      .lean()
      .exec();

    if (!existing) {
      throw new NotFoundException('Banner not found');
    }

    const desired =
      status !== undefined ? String(status).trim().toLowerCase() : undefined;
    let newStatus: number | null = null;

    if (desired === undefined || desired === '') {
      const cur = Number(existing.status) === 1 ? 1 : 0;
      newStatus = cur === 1 ? 0 : 1;
    } else {
      if (desired === 'active' || desired === '1') newStatus = 1;
      if (desired === 'inactive' || desired === '0') newStatus = 0;
      if (newStatus === null) {
        throw new BadRequestException(
          'Invalid status. Use "active" or "inactive"',
        );
      }
    }

    const updated = await this.bannerModel
      .findByIdAndUpdate(
        bannerObjectId,
        { $set: { status: newStatus, updatedAt: new Date() } },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Banner not found');
    }

    return {
      id: String(updated._id),
      status: Number(updated.status) === 1 ? 'active' : 'inactive',
      is_active: Number(updated.status) === 1,
    };
  }

  async updateTeamMember(
    vendorId: string,
    data: {
      id: string;
      name: string;
      designation?: string;
      email: string;
      mobile: string;
      displayOrder?: number;
      team: TeamMemberTeam;
      imagePath?: string;
      facebookUrl?: string;
      twitterUrl?: string;
      linkedinUrl?: string;
      roleId?: string;
      roleIds?: string[];
      category_ids?: number[];
      /** When set with sendCredentialsEmail (e.g. multipart "1"), rotate portal password after email change. */
      autoGeneratePassword?: unknown;
      sendCredentialsEmail?: unknown;
    },
  ) {
    let memberObjectId: Types.ObjectId;
    try {
      memberObjectId = new Types.ObjectId(data.id);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    let vendorObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
    } catch {
      throw new BadRequestException('Invalid vendor ID format');
    }

    const member = await this.vendorUserModel
      .findOne({
        _id: memberObjectId,
        type: 'staff',
        status: { $ne: 2 },
      })
      .exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const memberManufacturerId = (member as any).manufacturerId as
      | Types.ObjectId
      | undefined;
    if (!memberManufacturerId?.equals(vendorObjectId)) {
      throw new ForbiddenException(
        'Team member does not belong to this manufacturer',
      );
    }

    const priorEmail = String(member.email ?? '').trim().toLowerCase();
    const hadAnyRoleBefore = await this.rbacService.hasAnyActiveStaffRoleMapping(
      vendorId,
      data.id,
    );

    const emailLower = data.email.trim().toLowerCase();
    const mobileTrim = data.mobile.trim();

    const normalizedRoleIds =
      Array.isArray(data.roleIds) && data.roleIds.length > 0
        ? Array.from(new Set(data.roleIds.map((id) => String(id).trim()).filter(Boolean)))
        : data.roleId
          ? [String(data.roleId).trim()]
          : [];

    const emailChanged = priorEmail !== emailLower;

    const existingOther = await this.vendorUserModel
      .findOne({
        $and: [
          { _id: { $ne: memberObjectId } },
          { status: { $ne: 2 } },
          { type: 'staff' },
          {
            $or: [
              { email: new RegExp(`^${escapeRegex(emailLower)}$`, 'i') },
              { phone: mobileTrim },
            ],
          },
        ],
      })
      .select('_id email phone')
      .lean()
      .exec();

    if (existingOther) {
      if (
        String(existingOther.email ?? '').toLowerCase() === emailLower
      ) {
        throw new ConflictException('Email already exists');
      }
      if (existingOther.phone === mobileTrim) {
        throw new ConflictException('Phone number already exists');
      }
      throw new ConflictException('Team member already exists');
    }

    const manufacturerId = vendorObjectId;
    const oldTeam = (member as any).team as TeamMemberTeam | undefined;
    const newTeam = data.team;

    const persistedOld = this.persistedTeamMemberDisplayOrder(
      (member as any).displayOrder,
    );
    const oldOrder =
      persistedOld !== null && persistedOld >= 1 ? persistedOld : null;

    const explicitDisplayOrder = data.displayOrder !== undefined;

    /**
     * Omit displayOrder on edit: keep current slot in the same team; when changing team only,
     * append to the end of the destination team (next free slot).
     */
    let desiredOrder: number;
    if (!explicitDisplayOrder) {
      if (oldTeam !== undefined && String(oldTeam) === String(newTeam)) {
        desiredOrder =
          oldOrder ??
          (await this.nextDefaultDisplayOrderForTeam(manufacturerId, newTeam));
      } else {
        desiredOrder = await this.nextDefaultDisplayOrderForTeam(
          manufacturerId,
          newTeam,
        );
      }
    } else {
      desiredOrder = data.displayOrder as number;
    }

    this.assertTeamMemberDisplayOrderAllowed(desiredOrder);

    const sameTeam =
      oldTeam !== undefined && String(oldTeam) === String(newTeam);

    const nInTeamIncludingSelf = await this.countActiveStaffInTeam(
      manufacturerId,
      newTeam,
    );
    const curSlotForShift =
      oldOrder ?? (sameTeam ? nInTeamIncludingSelf : null);

    if (!sameTeam) {
      if (oldTeam !== undefined && curSlotForShift !== null) {
        await this.vendorUserModel
          .updateMany(
            {
              manufacturerId,
              type: 'staff',
              status: { $ne: 2 },
              team: oldTeam,
              _id: { $ne: memberObjectId },
              displayOrder: { $gt: curSlotForShift },
            },
            { $inc: { displayOrder: -1 } },
          )
          .exec();
      }
      await this.vendorUserModel
        .updateMany(
          {
            manufacturerId,
            type: 'staff',
            status: { $ne: 2 },
            team: newTeam,
            _id: { $ne: memberObjectId },
            displayOrder: { $gte: desiredOrder },
          },
          { $inc: { displayOrder: 1 } },
        )
        .exec();
    } else {
      const cur = curSlotForShift ?? Math.max(1, nInTeamIncludingSelf);
      if (desiredOrder !== cur) {
        if (desiredOrder < cur) {
          await this.vendorUserModel
            .updateMany(
              {
                manufacturerId,
                type: 'staff',
                status: { $ne: 2 },
                team: newTeam,
                _id: { $ne: memberObjectId },
                displayOrder: { $gte: desiredOrder, $lt: cur },
              },
              { $inc: { displayOrder: 1 } },
            )
            .exec();
        } else {
          await this.vendorUserModel
            .updateMany(
              {
                manufacturerId,
                type: 'staff',
                status: { $ne: 2 },
                team: newTeam,
                _id: { $ne: memberObjectId },
                displayOrder: { $gt: cur, $lte: desiredOrder },
              },
              { $inc: { displayOrder: -1 } },
            )
            .exec();
        }
      }
    }

    const $set: Record<string, unknown> = {
      name: data.name,
      email: emailLower,
      phone: mobileTrim,
      updatedAt: new Date(),
    };

    if (data.designation !== undefined && data.designation !== '') {
      $set.designation = data.designation;
    }

    if (data.facebookUrl !== undefined) {
      $set.facebookUrl = data.facebookUrl;
    }
    if (data.twitterUrl !== undefined) {
      $set.twitterUrl = data.twitterUrl;
    }
    if (data.linkedinUrl !== undefined) {
      $set.linkedinUrl = data.linkedinUrl;
    }
    if (data.imagePath !== undefined) {
      $set.image = data.imagePath;
    }
    $set.displayOrder = desiredOrder;
    $set.team = data.team;

    const unsetFields: Record<string, string> = {};
    if (data.category_ids !== undefined) {
      if (data.category_ids.length > 0) {
        await this.categoriesService.assertNumericCategoriesExist(data.category_ids);
        $set.category_ids = data.category_ids;
        $set.category_id = data.category_ids[0];
      } else {
        $set.category_ids = [];
        unsetFields.category_id = '';
      }
    }

    const updatePayload: Record<string, unknown> = { $set };
    if (data.designation !== undefined && data.designation === '') {
      unsetFields.designation = '';
    }
    if (Object.keys(unsetFields).length > 0) {
      updatePayload.$unset = unsetFields;
    }

    let updated: VendorUserDocument | null;
    try {
      updated = await this.vendorUserModel
        .findByIdAndUpdate(memberObjectId, updatePayload, { new: true })
        .exec();
    } catch (e: any) {
      if (e?.code === 11000) {
        if (isMongoStaffTeamDisplayOrderDuplicate(e)) {
          throwDisplayOrderTaken();
        }
        const pattern = (e?.keyPattern ?? {}) as Record<string, unknown>;
        const keyVal = (e?.keyValue ?? {}) as Record<string, unknown>;
        if ('email' in pattern || keyVal.email !== undefined) {
          throw new ConflictException('Email already exists');
        }
        if ('phone' in pattern || keyVal.phone !== undefined) {
          throw new ConflictException('Phone number already exists');
        }
        throw new ConflictException('Duplicate record');
      }
      throw e;
    }

    if (!updated) {
      throw new NotFoundException('Team member not found');
    }

    const obj: any = updated.toObject();
    delete obj.password;
    delete obj.otp;

    const rbacResult = await this.rbacService.replaceStaffRoles(vendorId, {
      vendorUserId: data.id,
      roleIds: normalizedRoleIds,
    });

    /**
     * Optional multipart flags (legacy): both false-ish explicitly → skip rotation when email changed.
     * Otherwise, email change + at least one role behaves like delivery on create / first role assignment.
     */
    const explicitlySkipCredentialRotation =
      data.autoGeneratePassword !== undefined &&
      data.sendCredentialsEmail !== undefined &&
      !isTruthyCredentialFlag(data.autoGeneratePassword) &&
      !isTruthyCredentialFlag(data.sendCredentialsEmail);

    const deferFirstRoleCredentialDelivery =
      !hadAnyRoleBefore && normalizedRoleIds.length > 0;

    let credentialExtras: { temporaryPassword?: string; email?: string } =
      rbacResult.temporaryPassword != null && rbacResult.email != null
        ? {
            temporaryPassword: rbacResult.temporaryPassword,
            email: rbacResult.email,
          }
        : {};

    if (
      !explicitlySkipCredentialRotation &&
      normalizedRoleIds.length > 0 &&
      emailChanged &&
      !deferFirstRoleCredentialDelivery
    ) {
      const password = crypto.randomBytes(8).toString('hex');
      const passwordHash = await bcrypt.hash(password, 10);
      await this.vendorUserModel
        .updateOne(
          { _id: memberObjectId },
          { $set: { password: passwordHash, updatedAt: new Date() } },
        )
        .exec();
      try {
        await this.emailService.sendStaffCredentialsEmail(
          emailLower,
          password,
          String(data.name ?? '').trim(),
        );
      } catch (err) {
        this.logger.warn(
          `Team member email-change credentials email failed for ${emailLower}: ${(err as Error)?.message || 'unknown error'}`,
        );
      }
      credentialExtras = {
        temporaryPassword: password,
        email: emailLower,
      };
    }

    this.invalidateWebsiteTeamMembersListCache();

    const id = String(updated._id);
    const cat = this.teamMemberCategoryArrays(obj);
    return {
      ...obj,
      id,
      vendorUserId: id,
      roleIds: normalizedRoleIds,
      portalAccess: normalizedRoleIds.length > 0,
      category_ids: cat.category_ids,
      categoryIds: cat.categoryIds,
      ...(Object.keys(credentialExtras).length > 0 ? credentialExtras : {}),
    };
  }

  /** Soft delete: status 2 (same as partners). */
  async deleteTeamMember(_vendorId: string, teamMemberId: string) {
    let memberObjectId: Types.ObjectId;
    try {
      memberObjectId = new Types.ObjectId(teamMemberId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const member = await this.vendorUserModel
      .findOne({
        _id: memberObjectId,
        type: 'staff',
        status: { $ne: 2 },
      })
      .exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const updated = await this.vendorUserModel
      .findByIdAndUpdate(
        memberObjectId,
        { status: 2, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Team member not found');
    }

    const obj: any = updated.toObject();
    delete obj.password;
    delete obj.otp;

    this.invalidateWebsiteTeamMembersListCache();

    return obj;
  }

  /** Permanently deletes a newsletter subscriber by document id. */
  async deleteNewsletterSubscriber(subscriberId: string) {
    const raw = String(subscriberId ?? '').trim();
    if (!raw) {
      throw new BadRequestException('Subscriber id is required');
    }

    // Preferred: delete by MongoDB _id
    if (Types.ObjectId.isValid(raw)) {
      const res = await this.newsletterSubscriberModel
        .deleteOne({ _id: new Types.ObjectId(raw) })
        .exec();

      if (res.deletedCount === 0) {
        throw new NotFoundException('Subscriber not found');
      }

      return { id: raw };
    }

    // Backward-compatible fallback: allow deleting by S.No (1-based index in list)
    const asNumber = Number.parseInt(raw, 10);
    if (!Number.isFinite(asNumber) || asNumber <= 0) {
      throw new BadRequestException(
        'Invalid subscriber id. Provide MongoDB _id or S.No (e.g. "1")',
      );
    }

    const idx = asNumber - 1;
    const ids = await this.newsletterSubscriberModel
      .find({}, { _id: 1 })
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    const target = ids?.[idx]?._id ? String(ids[idx]._id) : null;
    if (!target) {
      throw new NotFoundException('Subscriber not found');
    }

    const res = await this.newsletterSubscriberModel
      .deleteOne({ _id: new Types.ObjectId(target) })
      .exec();

    if (res.deletedCount === 0) {
      throw new NotFoundException('Subscriber not found');
    }

    return { id: target };
  }

  private async resolveNewsletterSubscriberId(
    identifier: string,
  ): Promise<string> {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Subscriber id is required');

    if (Types.ObjectId.isValid(raw)) return raw;

    const asNumber = Number.parseInt(raw, 10);
    if (!Number.isFinite(asNumber) || asNumber <= 0) {
      throw new BadRequestException(
        'Invalid subscriber id. Provide MongoDB _id or S.No (e.g. "1")',
      );
    }

    const idx = asNumber - 1;
    const ids = await this.newsletterSubscriberModel
      .find({}, { _id: 1 })
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    const target = ids?.[idx]?._id ? String(ids[idx]._id) : null;
    if (!target) throw new NotFoundException('Subscriber not found');
    return target;
  }

  /**
   * Set or toggle a newsletter subscriber's status.
   *
   * - When `status` is provided: sets explicitly (active/inactive)
   * - When `status` is omitted: toggles (1 ↔ 0)
   */
  async setOrToggleNewsletterSubscriberStatus(
    identifier: string,
    status?: string,
  ) {
    const targetId = await this.resolveNewsletterSubscriberId(identifier);

    const desired =
      status !== undefined ? String(status).trim().toLowerCase() : undefined;
    let newStatus: number | null = null;

    if (desired === undefined || desired === '') {
      const current = await this.newsletterSubscriberModel
        .findById(new Types.ObjectId(targetId))
        .select('status')
        .lean()
        .exec();
      if (!current) throw new NotFoundException('Subscriber not found');

      const cur = Number(current.status) === 1 ? 1 : 0;
      newStatus = cur === 1 ? 0 : 1;
    } else {
      if (desired === 'active' || desired === '1') newStatus = 1;
      if (desired === 'inactive' || desired === '0') newStatus = 0;
      if (newStatus === null) {
        throw new BadRequestException(
          'Invalid status. Use "active" or "inactive"',
        );
      }
    }

    const updated = await this.newsletterSubscriberModel
      .findByIdAndUpdate(
        new Types.ObjectId(targetId),
        { $set: { status: newStatus, updatedAt: new Date() } },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated) throw new NotFoundException('Subscriber not found');

    return {
      id: targetId,
      status: Number(updated.status) === 1 ? 'active' : 'inactive',
    };
  }

  /**
   * Contact messages list for admin table.
   *
   * Sample Mongo (Mongoose) query:
   *   this.contactMessageModel.find({}, { name: 1, email: 1, phoneNumber: 1 })
   *     .sort({ createdAt: -1 })
   *     .lean()
   *     .exec();
   */
  async listContactMessages() {
    const rows = await this.contactMessageModel
      .find({})
      .select('name email phoneNumber subject message createdAt')
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    return (rows ?? []).map((r, idx) => ({
      s_no: idx + 1,
      id: String(r._id),
      name: String(r.name ?? ''),
      email: String(r.email ?? ''),
      phoneNo: String((r as any).phoneNumber ?? ''),
      subject: String((r as any).subject ?? ''),
      message:
        typeof (r as any).message === 'string'
          ? String((r as any).message).trim()
          : '',
      createdAt: (r as any).createdAt ?? null,
    }));
  }

  /** Single contact message for admin "view" modal/page. */
  async getContactMessageById(id: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid contact id');
    }

    const msg = await this.contactMessageModel
      .findById(objectId)
      .select('name email phoneNumber message')
      .lean()
      .exec();

    if (!msg) {
      throw new NotFoundException('Contact message not found');
    }

    return {
      id: String(msg._id),
      name: String(msg.name ?? ''),
      email: String(msg.email ?? ''),
      phone: String((msg as any).phoneNumber ?? ''),
      message: String((msg as any).message ?? ''),
    };
  }

  /** Permanently deletes a contact message by MongoDB id. */
  async deleteContactMessage(id: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid contact id');
    }

    const res = await this.contactMessageModel
      .deleteOne({ _id: objectId })
      .exec();
    if (res.deletedCount === 0) {
      throw new NotFoundException('Contact message not found');
    }
    return { id };
  }

  /**
   * Toggle active flag for a team member (partner): status 1 ↔ 0.
   * Same semantics as partners PATCH /partners/status; excludes soft-deleted (2).
   */
  async updateTeamMemberStatus(_vendorId: string, teamMemberId: string) {
    let memberObjectId: Types.ObjectId;
    try {
      memberObjectId = new Types.ObjectId(teamMemberId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const member = await this.vendorUserModel
      .findOne({
        _id: memberObjectId,
        type: 'staff',
        status: { $ne: 2 },
      })
      .exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const current = member.status;
    let newStatus: number;
    if (current === 1) {
      newStatus = 0;
    } else if (current === 0) {
      newStatus = 1;
    } else {
      throw new BadRequestException(`Invalid team member status: ${current}`);
    }

    const updated = await this.vendorUserModel
      .findByIdAndUpdate(
        memberObjectId,
        { status: newStatus, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Team member not found');
    }

    const obj: any = updated.toObject();
    delete obj.password;
    delete obj.otp;
    return obj;
  }

  async updateManufacturer(
    id: string,
    updateDto: UpdateManufacturerDto,
    imagePath?: string,
  ) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const updateData: any = {
        manufacturerName: updateDto.manufacturerName,
        gpInternalId: updateDto.gpInternalId,
        manufacturerInitial: updateDto.manufacturerInitial,
        updatedAt: new Date(),
      };

      if (imagePath) {
        updateData.manufacturerImage = imagePath;
      }

      const manufacturer = await this.manufacturerModel
        .findByIdAndUpdate(manufacturerId, updateData, { new: true })
        .exec();

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }

      return manufacturer;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
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

  async updateManufacturerStatus(id: string) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const manufacturer = await this.manufacturerModel
        .findById(manufacturerId)
        .exec();

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }

      const currentStatus = manufacturer.manufacturerStatus;
      const newStatus = currentStatus === 1 ? 2 : 1;

      const updatedManufacturer = await this.manufacturerModel
        .findByIdAndUpdate(
          manufacturerId,
          {
            manufacturerStatus: newStatus,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      return updatedManufacturer;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
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

  async updateVendorStatus(id: string) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const manufacturer = await this.manufacturerModel
        .findById(manufacturerId)
        .exec();

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }

      const currentStatus = manufacturer.vendor_status;
      let newStatus: number;

      if (currentStatus === 0) {
        newStatus = 1;
      } else if (currentStatus === 1) {
        newStatus = 0;
      } else {
        throw new BadRequestException(
          `Invalid vendor status: ${currentStatus}`,
        );
      }

      const updatedVendor = await this.manufacturerModel
        .findByIdAndUpdate(
          manufacturerId,
          {
            vendor_status: newStatus,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      return updatedVendor;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
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
}
