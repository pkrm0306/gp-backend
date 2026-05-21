import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  NewsletterSubscriber,
  NewsletterSubscriberDocument,
} from './schemas/newsletter-subscriber.schema';
import { NewsletterSubscribeDto } from './dto/newsletter-subscribe.dto';
import { ContactSubmitDto } from './dto/contact-submit.dto';
import {
  ContactMessage,
  ContactMessageDocument,
} from './schemas/contact-message.schema';
import { Event, EventDocument } from '../events/schemas/event.schema';
import {
  VendorUser,
  VendorUserDocument,
} from '../vendor-users/schemas/vendor-user.schema';
import { ManufacturerInquiryDto } from './dto/manufacturer-inquiry.dto';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { ListManufacturersQueryDto } from '../manufacturers/dto/list-manufacturers-query.dto';
import { AdminService } from '../admin/admin.service';
import { ProductRegistrationService } from '../product-registration/product-registration.service';
import { PublicCertifiedProductsListDto } from './dto/public-certified-products-list.dto';
import { PublicCategoryManufacturersDto } from './dto/public-category-manufacturers.dto';
import { PublicManufacturerCategoriesDto } from './dto/public-manufacturer-categories.dto';
import { EmailService } from '../common/services/email.service';
import {
  Notification,
  NotificationDocument,
} from '../common/schemas/notification.schema';
import { RedisService } from '../common/redis/redis.service';

function buildSubscribedFor(dto: NewsletterSubscribeDto): string[] {
  const prefs: string[] = [];
  if (dto.greenProducts) prefs.push('Green Products');
  if (dto.events) prefs.push('Events');
  if (prefs.length === 0) prefs.push('Newsletter');
  return prefs;
}

function formatDateYYYYMMDD(value: unknown): string {
  const d =
    value instanceof Date ? value : value ? new Date(value as any) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function sanitizeWebsiteImagePath(raw: unknown): string | null {
  const value = String(raw ?? '').trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;

  const normalized = value.startsWith('/') ? value : `/${value}`;
  if (!normalized.startsWith('/uploads/')) return normalized;

  const rel = normalized.replace(/^\/uploads\//, '');
  if (!rel) return null;
  const safeRel = rel
    .split('/')
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment))
    .join('/');
  const absolute = join(process.cwd(), 'uploads', safeRel);
  return existsSync(absolute) ? normalized : null;
}

@Injectable()
export class WebsiteService {
  private readonly logger = new Logger(WebsiteService.name);

  constructor(
    @InjectModel(NewsletterSubscriber.name)
    private subscriberModel: Model<NewsletterSubscriberDocument>,
    @InjectModel(ContactMessage.name)
    private contactMessageModel: Model<ContactMessageDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private manufacturersService: ManufacturersService,
    private readonly adminService: AdminService,
    private readonly productRegistrationService: ProductRegistrationService,
    private emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  private getWebsitePublicListCacheTtlSeconds(): number {
    const ttl = parseInt(
      this.configService.get<string>('WEBSITE_PUBLIC_LIST_CACHE_TTL_SECONDS') ||
        this.configService.get<string>('CACHE_TTL_SECONDS') ||
        '120',
      10,
    );
    return Number.isFinite(ttl) && ttl > 0 ? ttl : 120;
  }

  private stableJsonValue(value: unknown): unknown {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((v) => this.stableJsonValue(v));
    }
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj).sort()) {
      out[k] = this.stableJsonValue(obj[k]);
    }
    return out;
  }

  private stableJsonStringify(value: unknown): string {
    return JSON.stringify(this.stableJsonValue(value));
  }

  private shortHash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex').slice(0, 40);
  }

  private buildManufacturersWebsiteCacheKey(
    query: ListManufacturersQueryDto,
  ): string {
    const normalized = {
      id: String(query.id || '').trim(),
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: String(query.search || '').trim().toLowerCase(),
      manufacturerName: String(query.manufacturerName || '')
        .trim()
        .toLowerCase(),
      gpInternalId: String(query.gpInternalId || '').trim().toLowerCase(),
      manufacturerInitial: String(query.manufacturerInitial || '')
        .trim()
        .toLowerCase(),
      manufacturerStatus: query.manufacturerStatus ?? null,
      vendor_status: query.vendor_status ?? null,
      sortBy: query.sortBy ?? 'createdAt',
      order: query.order === 'asc' ? 'asc' : 'desc',
    };
    return this.redisService.buildKey(
      'website',
      'public',
      'manufacturers',
      this.shortHash(this.stableJsonStringify(normalized)),
    );
  }

  private async invalidateNewsletterSubscribersCache(): Promise<void> {
    const key = this.redisService.buildKey('website', 'newsletter', 'subscribers');
    await this.redisService.del(key).catch((error) => {
      this.logger.warn(
        `Newsletter cache invalidation failed: ${(error as Error)?.message || 'unknown'}`,
      );
    });
  }

  /** Public manufacturers listing (Redis). */
  async getPublicManufacturersPaginated(query: ListManufacturersQueryDto) {
    const cacheKey = this.buildManufacturersWebsiteCacheKey(query);
    try {
      const cached = await this.redisService.get<Record<string, unknown>>(cacheKey);
      if (cached && typeof cached === 'object' && Array.isArray((cached as any).data)) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Website manufacturers cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }
    const result = await this.manufacturersService.findAllPaginated(query);
    this.redisService
      .set(cacheKey, result, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website manufacturers cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return result;
  }

  /** Public banners with absolute image URLs (Redis). */
  async getPublicBannersNormalized(origin: string) {
    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'banners',
      this.shortHash(origin),
    );
    try {
      const cached = await this.redisService.get<{
        message: string;
        data: unknown[];
      }>(cacheKey);
      if (cached?.data && Array.isArray(cached.data)) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Website banners cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const rows = await this.adminService.listPublicBanners();
    const normalizeImageUrl = (raw: unknown) => {
      const v = (raw ?? '').toString().trim();
      if (!v) return v;
      if (/^https?:\/\//i.test(v)) return v;
      if (v.startsWith('/uploads/')) return `${origin}${v}`;
      if (v.startsWith('uploads/')) return `${origin}/${v}`;
      return v;
    };
    const data = rows.map((b: Record<string, unknown>) => ({
      ...b,
      imageUrl: normalizeImageUrl(b.imageUrl),
    }));
    const payload = { message: 'Banners retrieved successfully', data };
    this.redisService
      .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website banners cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return payload;
  }

  /** Public active articles with absolute asset URLs (Redis). */
  async getPublicArticlesNormalized(origin: string) {
    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'articles',
      this.shortHash(origin),
    );
    try {
      const cached = await this.redisService.get<{
        message: string;
        data: unknown[];
      }>(cacheKey);
      if (cached?.data && Array.isArray(cached.data)) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Website articles cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const normalizeImageUrl = (raw: unknown) => {
      const v = String(raw ?? '').trim();
      if (!v) return v;
      if (/^https?:\/\//i.test(v)) return v;
      if (v.startsWith('/uploads/')) return `${origin}${v}`;
      if (v.startsWith('uploads/')) return `${origin}/${v}`;
      return v;
    };

    const rows = await this.adminService.listArticles();
    const data = (rows ?? [])
      .filter((a: { is_active?: boolean }) => Boolean(a?.is_active))
      .map((a: Record<string, unknown>, idx: number) => ({
        s_no: idx + 1,
        id: a.id,
        title: a.title,
        description: a.externalUrl ? '' : a.description,
        date: a.date,
        image: normalizeImageUrl(a.image),
        article_image: normalizeImageUrl(a.article_image),
        url: a.externalUrl ? a.url : '',
        externalUrl: a.externalUrl === true,
        pdf: normalizeImageUrl(a.pdf),
        article_pdf: normalizeImageUrl(a.article_pdf),
        is_active: true,
      }));

    const payload = { message: 'Articles retrieved successfully', data };
    this.redisService
      .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website articles cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return payload;
  }

  /** Public certified products (Redis; key from request body). */
  async getPublicCertifiedProducts(dto: PublicCertifiedProductsListDto) {
    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'certified-products',
      this.shortHash(this.stableJsonStringify({ ...(dto as object) })),
    );
    try {
      const cached = await this.redisService.get<Record<string, unknown>>(cacheKey);
      if (cached && typeof cached === 'object' && Array.isArray((cached as any).data)) {
        return {
          ...cached,
          message: 'Certified products retrieved successfully',
        };
      }
    } catch (error) {
      this.logger.warn(
        `Website certified products cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const result = await this.productRegistrationService.adminListProducts({
      ...dto,
      status: [2],
      groupBy: 'urn',
    });
    this.redisService
      .set(cacheKey, result, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website certified products cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return { ...result, message: 'Certified products retrieved successfully' };
  }

  async getManufacturersByCategoryPublic(dto: PublicCategoryManufacturersDto) {
    const id = String(dto.categoryId ?? '').trim();
    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'manufacturers-by-category',
      id,
    );
    try {
      const cached = await this.redisService.get<{
        categoryId: string;
        total: number;
        data: unknown[];
      }>(cacheKey);
      if (cached && typeof cached === 'object' && Array.isArray(cached.data)) {
        return {
          message: 'Manufacturers retrieved successfully',
          ...cached,
        };
      }
    } catch (error) {
      this.logger.warn(
        `Website manufacturers-by-category cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const result = await this.productRegistrationService.getManufacturersByCategory(
      dto.categoryId,
    );
    this.redisService
      .set(cacheKey, result, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website manufacturers-by-category cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return { message: 'Manufacturers retrieved successfully', ...result };
  }

  async getCategoriesByManufacturerPublic(dto: PublicManufacturerCategoriesDto) {
    const id = String(dto.manufacturerId ?? '').trim();
    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'categories-by-manufacturer',
      id,
    );
    try {
      const cached = await this.redisService.get<{
        manufacturerId: string;
        total: number;
        data: unknown[];
      }>(cacheKey);
      if (cached && typeof cached === 'object' && Array.isArray(cached.data)) {
        return {
          message: 'Categories retrieved successfully',
          ...cached,
        };
      }
    } catch (error) {
      this.logger.warn(
        `Website categories-by-manufacturer cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const result = await this.productRegistrationService.getCategoriesByManufacturer(
      dto.manufacturerId,
    );
    this.redisService
      .set(cacheKey, result, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website categories-by-manufacturer cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return { message: 'Categories retrieved successfully', ...result };
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
      source: input.source ?? 'website',
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      actorName: input.actorName,
    });
  }

  async subscribeNewsletter(dto: NewsletterSubscribeDto) {
    const email = dto.email.trim().toLowerCase();
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const greenProducts = Boolean(dto.greenProducts);
    const events = Boolean(dto.events);
    const subscribedFor = buildSubscribedFor(dto);

    const saved = await this.subscriberModel
      .findOneAndUpdate(
        { email },
        {
          $set: {
            email,
            subscribedFor,
            status: 1,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true, new: true },
      )
      .lean()
      .exec();

    await this.invalidateNewsletterSubscribersCache();

    // Shape response like your admin table rows
    const createdAt = saved?.createdAt ? new Date(saved.createdAt) : new Date();
    const createdDate = createdAt.toISOString().slice(0, 10); // YYYY-MM-DD (UI can format)

    await this.createNotification({
      title: 'New subscriber added',
      message: `${email} subscribed to newsletter.`,
      type: 'success',
      source: 'website',
      referenceType: 'newsletter',
      referenceId: String((saved as any)?._id ?? ''),
      actorName: email,
    });

    return {
      email: saved.email,
      greenProducts,
      events,
      createdDate,
      is_active: true,
    };
  }

  /**
   * Admin list endpoint backing `GET /api/website/newsletter`.
   *
   * Sample Mongo (Mongoose) query used:
   *   this.subscriberModel.find({}, { email: 1, subscribedFor: 1, status: 1, createdAt: 1 })
   *     .sort({ createdAt: -1 })
   *     .lean()
   *     .exec();
   */
  async getNewsletterSubscribers() {
    const cacheKey = this.redisService.buildKey('website', 'newsletter', 'subscribers');
    try {
      const cached = await this.redisService.get<
        Array<{
          id: number;
          email: string;
          subscribedFor: string;
          createdAt: string;
          status: string;
        }>
      >(cacheKey);
      if (Array.isArray(cached)) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Newsletter subscribers cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    try {
      const rows = await this.subscriberModel
        .find(
          {},
          {
            email: 1,
            subscribedFor: 1,
            status: 1,
            createdAt: 1,
          },
        )
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const data = (rows ?? []).map((r, idx) => ({
        id: idx + 1, // S.No for the table
        email: String(r.email ?? ''),
        subscribedFor:
          Array.isArray(r.subscribedFor) && r.subscribedFor.length > 0
            ? r.subscribedFor.join(', ')
            : 'Newsletter',
        createdAt: formatDateYYYYMMDD(r.createdAt),
        status: Number(r.status) === 1 ? 'active' : 'inactive',
      }));

      this.redisService
        .set(cacheKey, data, this.getWebsitePublicListCacheTtlSeconds())
        .catch((error) => {
          this.logger.warn(
            `Newsletter subscribers cache write failed: ${(error as Error)?.message || 'unknown error'}`,
          );
        });

      return data;
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.message || 'Failed to fetch newsletter subscriptions',
      );
    }
  }

  /**
   * Stores a website "Contact Us" form submission.
   *
   * Sample Mongo (Mongoose) insert:
   *   const doc = new this.contactMessageModel(payload);
   *   await doc.save();
   */
  async submitContact(dto: ContactSubmitDto) {
    try {
      const name = String(dto.name ?? '').trim();
      const email = String(dto.email ?? '').trim().toLowerCase();
      const phoneNumber = String(dto.phoneNumber ?? dto.phone ?? '').trim();
      const subject = String(dto.subject ?? '').trim();
      const message = String(dto.message ?? '').trim();

      const payload: Partial<ContactMessage> = {
        name,
        email,
        phoneNumber,
        subject,
        message,
      };

      const created = new this.contactMessageModel(payload);
      const saved = await created.save();

      await this.createNotification({
        title: 'New website inquiry',
        message: `${payload.name || 'Anonymous'} submitted a contact inquiry.`,
        type: 'info',
        source: 'website',
        referenceType: 'contact',
        referenceId: String((saved as any)._id),
        actorName: payload.name,
      });

      return {
        id: String((saved as any)._id),
        name: (saved as any).name,
        email: (saved as any).email,
        phoneNumber: (saved as any).phoneNumber,
        subject: (saved as any).subject,
        message: (saved as any).message,
        createdAt: (saved as any).createdAt,
      };
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.message || 'Failed to submit contact message',
      );
    }
  }

  /**
   * Public event status toggle for the website events page.
   *
   * - Accepts Mongo `_id` OR numeric `eventId`
   * - If status is missing/invalid, treats it as active by default (1)
   * - Toggles: 1 ↔ 0
   */
  async toggleWebsiteEventStatus(identifier: string) {
    const raw = String(identifier ?? '').trim();
    if (!raw) {
      throw new BadRequestException('Event id is required');
    }

    const findQuery: Record<string, any> = {};
    if (Types.ObjectId.isValid(raw)) {
      findQuery._id = new Types.ObjectId(raw);
    } else {
      const asNumber = Number.parseInt(raw, 10);
      if (!Number.isFinite(asNumber) || asNumber <= 0) {
        throw new BadRequestException(
          'Invalid event id (expected Mongo _id or numeric eventId)',
        );
      }
      findQuery.eventId = asNumber;
    }

    const current = await this.eventModel
      .findOne(findQuery)
      .select('eventStatus')
      .lean()
      .exec();

    if (!current) {
      throw new NotFoundException('Event not found');
    }

    const cur = Number((current as any).eventStatus);
    const normalized = cur === 0 || cur === 1 ? cur : 1; // default active
    const next = normalized === 1 ? 0 : 1;

    const updated = await this.eventModel
      .findOneAndUpdate(
        findQuery,
        { $set: { eventStatus: next, updatedDate: new Date() } },
        { new: true },
      )
      .select('eventStatus eventId')
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Event not found');
    }

    return {
      id: String((updated as any)._id),
      eventId: (updated as any).eventId,
      status:
        Number((updated as any).eventStatus) === 1 ? 'active' : 'inactive',
    };
  }

  /**
   * Public website team members list.
   * Pulls active team members from shared dataset (type=staff, status=1),
   * sorted by displayOrder so website follows admin ordering.
   */
  async listWebsiteTeamMembers() {
    const cacheKey = this.redisService.buildKey('website', 'team-members', 'list');
    try {
      const cached = await this.redisService.get<
        Array<{
          s_no: number;
          id: string;
          name: string;
          designation: string;
          email: string;
          mobile: string;
          image: string | null;
          facebookUrl: string;
          twitterUrl: string;
          linkedinUrl: string;
        }>
      >(cacheKey);
      if (Array.isArray(cached)) {
        return cached.map((member) => ({
          ...member,
          image: sanitizeWebsiteImagePath(member.image),
        }));
      }
    } catch (error) {
      this.logger.warn(
        `Website team-members cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const rows = await this.vendorUserModel
      .find({ type: 'staff', status: 1 })
      .sort({ displayOrder: 1, _id: 1 })
      .select(
        'name designation email phone image facebookUrl twitterUrl linkedinUrl displayOrder team',
      )
      .lean()
      .exec();

    const data = (rows ?? []).map((m: any, idx: number) => ({
      s_no: idx + 1,
      id: String(m._id),
      name: String(m.name ?? ''),
      designation: String(m.designation ?? ''),
      email: String(m.email ?? ''),
      mobile: String(m.phone ?? ''),
      displayOrder: Number((m as any).displayOrder) || 0,
      team: String((m as any).team ?? ''),
      image: sanitizeWebsiteImagePath(m.image),
      facebookUrl: String(m.facebookUrl ?? ''),
      twitterUrl: String(m.twitterUrl ?? ''),
      linkedinUrl: String(m.linkedinUrl ?? ''),
    }));
    this.redisService
      .set(cacheKey, data, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website team-members cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return data;
  }

  /**
   * Sends an email to the customer with manufacturer details included.
   * Uses `manufacturerId` to fetch manufacturer details.
   */
  async submitManufacturerInquiry(
    dto: ManufacturerInquiryDto,
    manufacturerIdFromQuery?: string,
  ) {
    const manufacturerId = String(
      dto.manufacturerId ?? manufacturerIdFromQuery ?? '',
    ).trim();
    if (!manufacturerId) {
      throw new BadRequestException('manufacturerId is required');
    }

    const manufacturer = await this.manufacturersService.findById(
      manufacturerId,
    );
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    const manufacturerName = (manufacturer.manufacturerName ?? '')
      .toString()
      .trim();
    const vendorName = (manufacturer.vendor_name ?? '').toString().trim();
    let vendorEmail = (manufacturer.vendor_email ?? '').toString().trim();
    let vendorPhone = (manufacturer.vendor_phone ?? '').toString().trim();
    // Website is intentionally not included in the customer email template.

    // Fallback: if manufacturer doc doesn't have vendor email/phone, pick it from the vendor user record.
    if (!vendorEmail || !vendorPhone) {
      const vendorUser = await this.vendorUserModel
        .findOne({
          manufacturerId: new Types.ObjectId(String(manufacturer._id)),
          type: 'vendor',
          status: { $ne: 2 },
        })
        .select('email phone')
        .lean()
        .exec();
      if (!vendorEmail)
        vendorEmail = String((vendorUser as any)?.email ?? '').trim();
      if (!vendorPhone)
        vendorPhone = String((vendorUser as any)?.phone ?? '').trim();
    }

    const subject =
      dto.subject && String(dto.subject).trim()
        ? String(dto.subject).trim()
        : `Your inquiry to ${manufacturerName || 'GreenPro Manufacturer'}`;

    const safe = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const htmlBody = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Inquiry Received</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 640px; margin: 0 auto; padding: 20px;">
          <div style="background:#16a34a; color:#fff; padding:16px 20px; border-radius:8px 8px 0 0;">
            <h2 style="margin:0;">Thanks, we received your message</h2>
          </div>
          <div style="border:1px solid #e5e7eb; border-top:0; padding:20px; border-radius:0 0 8px 8px;">
            <p style="margin-top:0;">Hi ${safe(dto.name)},</p>
            <p>We’ve recorded your inquiry and included the manufacturer details below for your reference.</p>

            <h3 style="margin:18px 0 8px;">Your Message</h3>
            <div style="background:#f9fafb; padding:14px; border-radius:8px; border:1px solid #e5e7eb;">
              <p style="margin:0;"><strong>Contact:</strong> ${safe(dto.phone || dto.contact || '')}</p>
              <p style="margin:8px 0 0; white-space:pre-wrap;">${safe(dto.message || '')}</p>
            </div>

            <h3 style="margin:18px 0 8px;">Manufacturer Details</h3>
            <div style="background:#fff; padding:14px; border-radius:8px; border:1px solid #e5e7eb;">
              <p style="margin:0;"><strong>Name:</strong> ${safe(manufacturerName || vendorName || 'N/A')}</p>
              <p style="margin:8px 0 0;"><strong>Email:</strong> ${safe(vendorEmail || 'N/A')}</p>
              <p style="margin:8px 0 0;"><strong>Phone:</strong> ${safe(vendorPhone || 'N/A')}</p>
            </div>

            <p style="margin:18px 0 0; color:#6b7280; font-size:12px;">
              This email was generated automatically by GreenPro.
            </p>
          </div>
        </body>
      </html>
    `;

    await this.createNotification({
      title: 'New manufacturer inquiry',
      message: `${dto.name} submitted an inquiry for ${manufacturerName || 'a manufacturer'}.`,
      type: 'info',
      source: 'website',
      referenceType: 'manufacturer_inquiry',
      referenceId: manufacturerId,
      actorName: dto.name,
    });

    this.emailService.sendInBackground(() =>
      this.emailService.sendEmail(dto.email, subject, htmlBody),
    );

    return { sent: true, subject };
  }
}
