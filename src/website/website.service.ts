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
import { resolveManufacturerInquiryPhone } from '../common/utils/normalize-phone-with-country-code.util';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { ListManufacturersQueryDto } from '../manufacturers/dto/list-manufacturers-query.dto';
import { matchPublicWebsiteManufacturerVisibility } from '../manufacturers/constants/public-website-manufacturer-visibility.filter';
import { AdminService } from '../admin/admin.service';
import { GalleryService } from '../gallery/gallery.service';
import { ProductRegistrationService } from '../product-registration/product-registration.service';
import { AdminListProductsDto } from '../product-registration/dto/admin-list-products.dto';
import { PublicCategoryManufacturersDto } from './dto/public-category-manufacturers.dto';
import { PublicManufacturerCategoriesDto } from './dto/public-manufacturer-categories.dto';
import { PublicListEventsQueryDto } from './dto/public-list-events-query.dto';
import { PublicListArticlesQueryDto } from './dto/public-list-articles-query.dto';
import { PublicListGalleryQueryDto } from './dto/public-list-gallery-query.dto';
import { EmailService } from '../common/services/email.service';
import { LifecycleNotificationService } from '../notifications/lifecycle-notification.service';
import { AdminSystemNotificationService } from '../notifications/helpers/admin-system-notification.service';
import { WebsiteAnalyticsService } from './website-analytics.service';
import {
  Notification,
  NotificationDocument,
} from '../common/schemas/notification.schema';
import { RedisService } from '../common/redis/redis.service';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import {
  Category,
  CategoryDocument,
} from '../categories/schemas/category.schema';
import {
  matchWebsitePublicCertifiedProducts,
} from '../product-registration/constants/website-public-product.filter';
import { resolveStoredUploadUrl } from '../utils/upload-file.util';
import {
  NEWSLETTER_SUBSCRIBER_COLLECTIONS,
  absorbNewsletterSubscriberRows,
  newsletterSubscriberActivityDate,
  sortNewsletterSubscribersByActivity,
} from './utils/newsletter-subscribers-query.util';

function buildSubscribedFor(dto: NewsletterSubscribeDto): string[] {
  const prefs: string[] = [];
  if (dto.greenProducts) prefs.push('Green Products');
  if (dto.events) prefs.push('Events');
  if (prefs.length === 0) prefs.push('Newsletter');
  return prefs;
}

/** Same label shown in admin Subscribers list and in confirmation emails. */
function formatSubscribedForLabel(value: unknown): string {
  if (Array.isArray(value)) {
    const parts = value.map((v) => String(v ?? '').trim()).filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Newsletter';
  }
  const asString = String(value ?? '').trim();
  return asString || 'Newsletter';
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
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    private manufacturersService: ManufacturersService,
    private readonly adminService: AdminService,
    private readonly galleryService: GalleryService,
    private readonly productRegistrationService: ProductRegistrationService,
    private emailService: EmailService,
    private readonly lifecycleNotification: LifecycleNotificationService,
    private readonly adminSystemNotification: AdminSystemNotificationService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly websiteAnalytics: WebsiteAnalyticsService,
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

  /** Ignore empty paths and Swagger placeholder `"string"`. */
  private pickImagePath(raw: unknown): string | null {
    const v = String(raw ?? '').trim();
    if (!v || v.toLowerCase() === 'string') {
      return null;
    }
    const resolved = resolveStoredUploadUrl(v);
    return resolved || v;
  }

  private normalizeWebsiteImageUrl(
    raw: unknown,
    origin: string,
    kind: 'product' | 'category' = 'product',
  ): string | null {
    const v = this.pickImagePath(raw);
    if (!v) {
      return null;
    }
    if (/^https?:\/\//i.test(v)) {
      return v;
    }
    if (v.startsWith('/uploads/')) {
      return `${origin}${v}`;
    }
    if (v.startsWith('uploads/')) {
      return `${origin}/${v}`;
    }
    if (v.startsWith('/')) {
      return `${origin}${v}`;
    }
    const folder = kind === 'category' ? 'categories' : 'products';
    const encoded = v
      .split('/')
      .filter(Boolean)
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `${origin}/uploads/${folder}/${encoded}`;
  }

  private mapCertifiedProductCardForWebsite(
    row: Record<string, unknown>,
    origin: string,
  ): Record<string, unknown> {
    const productOnly = this.pickImagePath(
      row.productImageUrl ?? row.productImage ?? row.product_image,
    );
    const categoryOnly = this.pickImagePath(
      row.categoryImageUrl ?? row.categoryImage ?? row.category_image,
    );
    const normalizedProductImage = productOnly
      ? this.normalizeWebsiteImageUrl(productOnly, origin, 'product')
      : null;
    const normalizedCategoryImage = this.normalizeWebsiteImageUrl(
      categoryOnly,
      origin,
      'category',
    );
    const cardImage = normalizedProductImage ?? normalizedCategoryImage;

    return {
      ...row,
      productImage: cardImage,
      productImageUrl: normalizedProductImage,
      categoryImage: categoryOnly,
      categoryImageUrl: normalizedCategoryImage,
    };
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
      'with-certified-products',
      'v4',
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
    const result =
      await this.manufacturersService.findAllPaginatedForWebsitePublic(query);
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

  /** Public paginated gallery for website (active only, default 50 per page). */
  async getPublicGalleryPaginated(
    query: PublicListGalleryQueryDto,
    origin: string,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'gallery',
      String(page),
      String(limit),
      this.shortHash(origin),
    );
    try {
      const cached = await this.redisService.get<{
        message: string;
        data: unknown[];
        pagination: Record<string, number>;
      }>(cacheKey);
      if (cached?.data && Array.isArray(cached.data) && cached.pagination) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Website gallery cache read failed: ${(error as Error)?.message || 'unknown error'}`,
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

    const result = await this.galleryService.listGalleryPaginated(page, limit, {
      activeOnly: true,
    });

    const data = (result.data ?? []).map((row: Record<string, unknown>) => {
      const images = Array.isArray(row.galleryImages)
        ? row.galleryImages
        : row.image
          ? [row.image]
          : [];
      const normalizedImages = images.map((img) => normalizeImageUrl(img));
      return {
        s_no: row.s_no,
        id: row.id,
        eventId: row.eventId ?? row.galleryId,
        title: row.title ?? row.eventName ?? '',
        galleryType: row.galleryType ?? '',
        description: row.description ?? row.eventDescription ?? '',
        date: row.date ?? '',
        dateTime: row.dateTime ?? '',
        image: normalizedImages[0] ?? null,
        images: normalizedImages,
        event_image: normalizeImageUrl(row.gallery_image ?? row.event_image),
        is_active: row.is_active ?? true,
      };
    });

    const payload = {
      message: 'Gallery retrieved successfully',
      pagination: {
        ...result.pagination,
        limit: result.pagination.perPage,
      },
      data,
    };
    this.redisService
      .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website gallery cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return payload;
  }

  /** Public paginated events for website (active only, default 10 per page). */
  async getPublicEventsPaginated(
    query: PublicListEventsQueryDto,
    origin: string,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'events',
      'v4',
      String(page),
      String(limit),
      this.shortHash(origin),
    );
    try {
      const cached = await this.redisService.get<{
        message: string;
        data: unknown[];
        pagination: Record<string, number>;
      }>(cacheKey);
      if (cached?.data && Array.isArray(cached.data) && cached.pagination) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Website events cache read failed: ${(error as Error)?.message || 'unknown error'}`,
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

    const result = await this.adminService.listEventsPaginated(page, limit, {
      activeOnly: true,
    });
    const data = (result.data ?? []).map((row: Record<string, unknown>) => ({
      ...row,
      image: normalizeImageUrl(row.image),
      event_image: normalizeImageUrl(row.event_image),
    }));

    const payload = {
      message: 'Events retrieved successfully',
      pagination: result.pagination,
      data,
    };
    this.redisService
      .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website events cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return payload;
  }

  /** Public active articles with absolute asset URLs (paginated, Redis). */
  async getPublicArticlesNormalized(
    query: PublicListArticlesQueryDto,
    origin: string,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'articles',
      'v2',
      String(page),
      String(limit),
      this.shortHash(origin),
    );
    try {
      const cached = await this.redisService.get<{
        message: string;
        data: unknown[];
        pagination: Record<string, number>;
      }>(cacheKey);
      if (cached?.data && Array.isArray(cached.data) && cached.pagination) {
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

    const result = await this.adminService.listArticlesPaginated(page, limit, {
      activeOnly: true,
    });
    const data = (result.data ?? []).map((a: Record<string, unknown>) => {
      const externalUrl = a.externalUrl === true;
      const shortDescription = String(a.shortDescription ?? '').trim();
      const legacyShort =
        externalUrl && !shortDescription
          ? String(a.description ?? '').trim()
          : shortDescription;
      return {
        ...a,
        description: externalUrl ? '' : a.description,
        shortDescription: legacyShort,
        image: normalizeImageUrl(a.image),
        article_image: normalizeImageUrl(a.article_image),
        pdf: normalizeImageUrl(a.pdf),
        article_pdf: normalizeImageUrl(a.article_pdf),
        is_active: true,
      };
    });

    const payload = {
      message: 'Articles retrieved successfully',
      pagination: result.pagination,
      data,
    };
    this.redisService
      .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website articles cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return payload;
  }

  /** Filter options for public certified products page (categories + country/state tree). */
  async getPublicCertifiedProductsFilterOptions() {
    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'certified-products',
      'filter-options',
      'v5',
    );
    try {
      const cached = await this.redisService.get<{
        message: string;
        data: unknown;
      }>(cacheKey);
      if (cached?.data) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Website certified filter-options cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const data =
      await this.productRegistrationService.getPublicCertifiedWebsiteFilterOptions();
    const payload = {
      message: 'Filter options retrieved successfully',
      data,
    };
    this.redisService
      .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website certified filter-options cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return payload;
  }

  /** Typeahead suggestions for certified product search bar. */
  async searchPublicCertifiedProducts(
    q: string,
    limit: number,
    origin: string,
  ) {
    const rows = await this.productRegistrationService.searchPublicCertifiedProducts(
      q,
      limit,
    );
    return {
      message: 'Product suggestions retrieved successfully',
      data: rows.map((row: Record<string, unknown>) =>
        this.mapCertifiedProductCardForWebsite(row, origin),
      ),
    };
  }

  private hasPublicCertifiedProductsListFilter(
    dto: AdminListProductsDto,
  ): boolean {
    const search = String(dto.search ?? '').trim();
    if (search.length >= 2) {
      return true;
    }
    if (dto.productId) {
      return true;
    }
    const categoryIds = dto.categoryIds ?? dto.category_ids;
    if (categoryIds && categoryIds.length > 0) {
      return true;
    }
    if (dto.categoryId) {
      return true;
    }
    if (dto.manufacturerId || dto.manufacturerIds?.length || dto.manufacturer_ids?.length) {
      return true;
    }
    if (dto.manufacturerNames?.length || dto.manufacturer_names?.length) {
      return true;
    }
    if (dto.countryId) {
      return true;
    }
    const stateIds = dto.stateIds ?? dto.state_ids;
    if (stateIds && stateIds.length > 0) {
      return true;
    }
    if (dto.stateId || dto.state_name) {
      return true;
    }
    if (dto.city) {
      return true;
    }
    if (
      dto.fromDate ||
      dto.toDate ||
      dto.from ||
      dto.to ||
      dto.validTillYear !== undefined ||
      dto.validTillYears?.length ||
      dto.valid_till_years?.length
    ) {
      return true;
    }
    return false;
  }

  private toAdminListDtoFromPublicWebsite(
    dto: AdminListProductsDto,
  ): AdminListProductsDto {
    const categoryIds =
      dto.categoryIds ??
      dto.category_ids ??
      (dto.categoryId ? [dto.categoryId] : undefined);

    const manufacturerIds =
      dto.manufacturerIds ??
      dto.manufacturer_ids ??
      (dto.manufacturerId ? [dto.manufacturerId] : undefined);

    const stateIds =
      dto.stateIds ??
      dto.state_ids ??
      (dto.stateId ? [dto.stateId] : undefined);

    return {
      ...dto,
      categoryIds,
      manufacturerIds,
      stateIds,
      countryId: dto.countryId,
      fromDate: dto.fromDate ?? dto.from,
      toDate: dto.toDate ?? dto.to,
      page: dto.page ?? 1,
      limit: dto.limit ?? 12,
      sortBy: dto.sortBy ?? 'createdDate',
      sortOrder: dto.sortOrder ?? 'desc',
    };
  }

  /**
   * Public certified product cards (flat list).
   * Returns empty until user applies search, category, location, or picks a product.
   */
  async listPublicCertifiedProductsForWebsite(
    dto: AdminListProductsDto,
    origin: string,
  ) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 12;

    if (!this.hasPublicCertifiedProductsListFilter(dto)) {
      return {
        message:
          'Apply a search (min 2 characters), category, country/state, or select a product to view results',
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'certified-products',
      'flat',
      'v11',
      this.shortHash(this.stableJsonStringify({ ...(dto as object), origin })),
    );
    try {
      const cached = await this.redisService.get<Record<string, unknown>>(cacheKey);
      if (cached && Array.isArray((cached as { data?: unknown[] }).data)) {
        return {
          ...cached,
          message: 'Certified products retrieved successfully',
        };
      }
    } catch (error) {
      this.logger.warn(
        `Website certified products flat cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const adminDto = this.toAdminListDtoFromPublicWebsite(dto);
    const result =
      await this.productRegistrationService.listPublicCertifiedProductsFlat(
        adminDto,
        dto.productId,
      );

    const data = (result.data ?? []).map((row: Record<string, unknown>) =>
      this.mapCertifiedProductCardForWebsite(row, origin),
    );

    const hasLocationFilter = Boolean(
      dto.countryId ?? (dto.stateIds ?? dto.state_ids)?.length,
    );
    const message =
      result.total === 0 && hasLocationFilter
        ? 'No certified products found for the selected location'
        : 'Certified products retrieved successfully';

    const payload = {
      message,
      data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };

    this.redisService
      .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website certified products flat cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });

    return payload;
  }

  /** Public certified products (Redis; key from request body). */
  async getPublicCertifiedProducts(dto: AdminListProductsDto) {
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

  async getPublicCertifiedProductPassport(
    productId: string,
    origin?: string,
  ) {
    const normalizedProductId = String(productId ?? '').trim();
    if (!normalizedProductId) {
      throw new BadRequestException('productId is required');
    }

    const data =
      await this.productRegistrationService.getPublicCertifiedProductPassport(
        normalizedProductId,
      );

    const resolvedOrigin = String(origin ?? '').trim();
    if (!resolvedOrigin) {
      return {
        message: 'Certified product passport retrieved successfully',
        data,
      };
    }

    const productImage = this.pickImagePath(
      data.productImageUrl ?? data.productImage,
    );
    const productImageUrl = productImage
      ? this.normalizeWebsiteImageUrl(productImage, resolvedOrigin, 'product')
      : null;

    return {
      message: 'Certified product passport retrieved successfully',
      data: {
        ...data,
        productImage,
        productImageUrl: productImageUrl ?? data.productImageUrl ?? null,
      },
    };
  }

  /** Matches public website manufacturer visibility (see website `isPublicManufacturerWebsiteVisible`). */
  private matchPublicWebsiteManufacturerVisibility(): Record<string, unknown> {
    return matchPublicWebsiteManufacturerVisibility();
  }

  async getPublicWebsiteStats() {
    const cacheKey = this.redisService.buildKey('website', 'public', 'stats', 'v7');
    try {
      const cached = await this.redisService.get<{
        message: string;
        data: {
          companies: number;
          productCategories: number;
          ecolabelledProducts: number;
        };
      }>(cacheKey);
      if (
        cached &&
        typeof cached === 'object' &&
        cached.data &&
        Number.isFinite(Number(cached.data.companies)) &&
        Number.isFinite(Number(cached.data.productCategories)) &&
        Number.isFinite(Number(cached.data.ecolabelledProducts))
      ) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Website stats cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const productScope = matchWebsitePublicCertifiedProducts({
      manufacturerId: { $exists: true, $ne: null },
      categoryId: { $exists: true, $ne: null },
    });

    const [facetResult, productCategories, ecolabelledProducts] =
      await Promise.all([
        this.productModel
          .aggregate<{
            companies: Array<{ count: number }>;
          }>([
            { $match: productScope },
            {
              $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category',
              },
            },
            { $unwind: '$category' },
            { $match: { 'category.category_status': 1 } },
            {
              $lookup: {
                from: 'manufacturers',
                localField: 'manufacturerId',
                foreignField: '_id',
                as: 'manufacturer',
              },
            },
            { $unwind: '$manufacturer' },
            { $match: this.matchPublicWebsiteManufacturerVisibility() },
            {
              $facet: {
                companies: [
                  { $group: { _id: '$manufacturerId' } },
                  { $count: 'count' },
                ],
              },
            },
          ])
          .exec(),
        this.categoryModel.countDocuments({}).exec(),
        this.productModel
          .aggregate<{ count: number }>([
            { $match: matchWebsitePublicCertifiedProducts() },
            {
              $lookup: {
                from: 'manufacturers',
                localField: 'manufacturerId',
                foreignField: '_id',
                as: 'manufacturer',
              },
            },
            { $unwind: '$manufacturer' },
            { $match: this.matchPublicWebsiteManufacturerVisibility() },
            { $count: 'count' },
          ])
          .exec()
          .then((rows) => rows[0]?.count ?? 0),
      ]);

    const facet = facetResult[0] ?? {
      companies: [],
    };

    const payload = {
      message: 'Website stats retrieved successfully',
      data: {
        companies: facet.companies[0]?.count ?? 0,
        productCategories,
        ecolabelledProducts,
      },
    };

    this.redisService
      .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Website stats cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });

    return payload;
  }

  async getManufacturersByCategoryPublic(dto: PublicCategoryManufacturersDto) {
    const id = String(dto.categoryId ?? '').trim();
    const cacheKey = this.redisService.buildKey(
      'website',
      'public',
      'manufacturers-by-category',
      'v5',
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
      'v3',
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
    await this.adminSystemNotification.createFeedNotification({
      ...input,
      source: input.source ?? 'website',
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

    // Remove split-brain rows left in the old collection name.
    try {
      await this.subscriberModel.db
        .collection('newsletter_subscribers')
        .deleteMany({ email });
    } catch {
      // ignore
    }

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

    void this.websiteAnalytics
      .recordSignUp({
        visitorKey: email,
        signUpType: 'newsletter',
        path: '/newsletter',
      })
      .catch(() => undefined);

    this.emailService.sendInBackground(() =>
      this.emailService.sendNewsletterSubscribeEmail(email, subscribedFor),
    );

    return {
      email: saved.email,
      greenProducts,
      events,
      createdDate,
      is_active: true,
      subscribedFor: formatSubscribedForLabel(subscribedFor),
      subscribeFor: formatSubscribedForLabel(subscribedFor),
      status: 'active',
    };
  }

  /**
   * Admin list endpoint backing `GET /api/website/newsletter`.
   * Always reads MongoDB (and any legacy collection) so new website signups appear immediately.
   */
  async getNewsletterSubscribers() {
    try {
      const rows = await this.loadNewsletterSubscriberDocs();

      const data = (rows ?? []).map((r, idx) => {
        const subscribedFor = formatSubscribedForLabel(r.subscribedFor);
        const activity = newsletterSubscriberActivityDate(r);
        const dateStr = formatDateYYYYMMDD(activity ?? r.createdAt);
        return {
          id: r._id ? String(r._id) : String(idx + 1),
          s_no: idx + 1,
          email: String(r.email ?? ''),
          subscribedFor,
          subscribeFor: subscribedFor,
          createdAt: dateStr,
          createdDate: dateStr,
          updatedAt: formatDateYYYYMMDD(r.updatedAt ?? activity ?? r.createdAt),
          status: Number(r.status) === 1 ? 'active' : 'inactive',
          is_active: Number(r.status) === 1,
        };
      });

      // Refresh cache asynchronously (list itself never serves stale Redis data).
      const cacheKey = this.redisService.buildKey(
        'website',
        'newsletter',
        'subscribers',
      );
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
   * Reads `newslettersubscribers` (canonical in Atlas) plus any stray
   * `newsletter_subscribers` docs. Re-subscribes sort by latest activity
   * (updatedAt / createdAt), not the original signup date.
   */
  private async loadNewsletterSubscriberDocs(): Promise<Record<string, unknown>[]> {
    const projection = {
      email: 1,
      subscribedFor: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    const byEmail = new Map<string, Record<string, unknown>>();

    const primary = await this.subscriberModel
      .find({}, projection)
      .lean()
      .exec();
    absorbNewsletterSubscriberRows(byEmail, primary ?? []);

    const primaryName = this.subscriberModel.collection.name;
    for (const name of NEWSLETTER_SUBSCRIBER_COLLECTIONS) {
      if (name === primaryName) continue;
      try {
        const altRows = await this.subscriberModel.db
          .collection(name)
          .find({}, { projection })
          .toArray();
        absorbNewsletterSubscriberRows(byEmail, altRows ?? []);
      } catch {
        // Collection may not exist.
      }
    }

    return sortNewsletterSubscribersByActivity(Array.from(byEmail.values()));
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
        inquiryType: 'contact',
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
    const cacheKey = this.redisService.buildKey('website', 'team-members', 'list-v4');
    try {
      const cached = await this.redisService.get<
        Array<{
          s_no: number;
          id: string;
          name: string;
          designation: string;
          email: string;
          mobile: string;
          displayOrder: number;
          businessVertical: string;
          business_vertical: string;
          image: string | null;
          facebookUrl: string;
          twitterUrl: string;
          linkedinUrl: string;
          sector_ids: number[];
          sectorIds: number[];
          sector_id: number | null;
          sector_name: string | null;
          sectors: { id: number; name: string }[];
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
      .find({ type: 'staff', status: 1, showOnWebsite: { $ne: false } })
      .sort({ displayOrder: 1, _id: 1 })
      .select(
        'name designation email phone image facebookUrl twitterUrl linkedinUrl displayOrder businessVertical showOnWebsite sector_ids sector_id category_ids category_id',
      )
      .lean()
      .exec();

    const baseRows = await Promise.all(
      (rows ?? []).map(async (m: any, idx: number) => {
        const sector_ids = await this.adminService.resolveTeamMemberSectorIds(m);
        return {
          s_no: idx + 1,
          id: String(m._id),
          name: String(m.name ?? ''),
          designation: String(m.designation ?? ''),
          email: String(m.email ?? ''),
          mobile: String(m.phone ?? ''),
          displayOrder: Number((m as any).displayOrder) || 0,
          businessVertical: String((m as any).businessVertical ?? ''),
          business_vertical: String((m as any).businessVertical ?? ''),
          image: sanitizeWebsiteImagePath(m.image),
          facebookUrl: String(m.facebookUrl ?? ''),
          twitterUrl: String(m.twitterUrl ?? ''),
          linkedinUrl: String(m.linkedinUrl ?? ''),
          sector_ids,
        };
      }),
    );

    const data = await this.adminService.attachTeamMemberSectorFields(baseRows);
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
        : `Thanks, we received your inquiry${
            manufacturerName ? ` — ${manufacturerName}` : ''
          }`;

    const safe = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    let visitorPhone = '';
    try {
      visitorPhone = safe(resolveManufacturerInquiryPhone(dto));
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Phone number is invalid',
      );
    }
    const visitorMessage = String(dto.message ?? '').trim();
    const visitorDetailsBlock = visitorMessage
      ? `
            <h3 style="margin:18px 0 8px;">Your Message</h3>
            <div style="background:#f9fafb; padding:14px; border-radius:8px; border:1px solid #e5e7eb;">
              <p style="margin:0;"><strong>Phone:</strong> ${visitorPhone}</p>
              <p style="margin:8px 0 0; white-space:pre-wrap;">${safe(visitorMessage)}</p>
            </div>`
      : `
            <h3 style="margin:18px 0 8px;">Your Contact Details</h3>
            <div style="background:#f9fafb; padding:14px; border-radius:8px; border:1px solid #e5e7eb;">
              <p style="margin:0;"><strong>Phone:</strong> ${visitorPhone}</p>
            </div>`;

    // Content fragment only — EmailService wraps with the shared GreenPro template
    // (same layout as newsletter subscribe confirmation emails).
    const htmlBody = `
      <p>Hi ${safe(dto.name)},</p>
      <p>We’ve recorded your inquiry and included the manufacturer details below for your reference.</p>
${visitorDetailsBlock}

      <h3 style="margin:18px 0 8px;">Manufacturer Details</h3>
      <div style="background:#f9fafb; padding:14px; border-radius:8px; border:1px solid #e5e7eb;">
        <p style="margin:0;"><strong>Name:</strong> ${safe(manufacturerName || vendorName || 'N/A')}</p>
        <p style="margin:8px 0 0;"><strong>Email:</strong> ${safe(vendorEmail || 'N/A')}</p>
        <p style="margin:8px 0 0;"><strong>Phone:</strong> ${safe(vendorPhone || 'N/A')}</p>
      </div>
    `;

    await this.lifecycleNotification
      .notifyProductEnquiry({
        manufacturerId,
        manufacturerName: manufacturerName || vendorName,
        vendorEmail,
        visitorName: dto.name,
        visitorEmail: dto.email,
        visitorPhone,
        visitorMessage: visitorMessage || undefined,
      })
      .catch((err) =>
        this.logger.warn(
          `[submitManufacturerInquiry] Lifecycle notification failed: ${(err as Error).message}`,
        ),
      );

    const productId = String(dto.productId ?? '').trim();
    let categoryId = String(dto.categoryId ?? '').trim();
    let urnNumber = String(
      dto.urnNumber ?? (dto as any).urnNo ?? (dto as any).urn_no ?? '',
    ).trim();

    if (productId && Types.ObjectId.isValid(productId)) {
      const product = await this.productModel
        .findById(new Types.ObjectId(productId))
        .select('urnNo categoryId')
        .lean()
        .exec();
      if (product) {
        if (!urnNumber) {
          urnNumber = String(product.urnNo ?? '').trim();
        }
        if (!categoryId && product.categoryId) {
          categoryId = String(product.categoryId);
        }
      }
    }

    const designation = String(dto.designation ?? '').trim();
    const organisation = String(
      dto.organisation ?? (dto as any).organization ?? '',
    ).trim();

    try {
      const inquiryDoc = new this.contactMessageModel({
        inquiryType: 'product',
        name: String(dto.name ?? '').trim(),
        email: String(dto.email ?? '')
          .trim()
          .toLowerCase(),
        phoneNumber: visitorPhone,
        subject,
        message: visitorMessage,
        designation,
        organisation,
        manufacturerId,
        productId,
        categoryId,
        urnNumber,
      });
      const saved = await inquiryDoc.save();
      await this.createNotification({
        title: 'New product inquiry',
        message: `${dto.name || 'A visitor'} submitted a product inquiry.`,
        type: 'info',
        source: 'website',
        referenceType: 'product_inquiry',
        referenceId: String((saved as any)._id),
        actorName: dto.name,
      });
    } catch (err) {
      this.logger.warn(
        `[submitManufacturerInquiry] Failed to persist product inquiry: ${(err as Error).message}`,
      );
    }

    this.emailService.sendInBackground(() =>
      this.emailService.sendEmail(dto.email, subject, htmlBody),
    );

    return { sent: true, subject };
  }
}
