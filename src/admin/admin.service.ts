import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
  Inject,
  forwardRef,
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
  BusinessVertical,
} from '../vendor-users/schemas/vendor-user.schema';
import { Banner, BannerDocument } from '../banners/schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import * as crypto from 'crypto';
import { ListTeamMembersQueryDto } from './dto/list-team-members-query.dto';
import { Event, EventDocument } from '../events/schemas/event.schema';
import {
  buildWebsiteVisibleEventsMatch,
  isEventVisibleOnWebsite,
  parseEventDateInput,
  resolveEventEndDate,
  resolveEventStartDate,
  toDateOnlyIso,
} from '../events/utils/event-date.util';
import {
  mapEventBrochuresFromDoc,
  primaryEventBrochureLink,
  type EventBrochureRow,
} from '../events/utils/event-brochures.util';
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
import {
  buildAdminNotificationWhere,
  buildAdminNotificationUnreadCountWhere,
  mapAdminNotificationRow,
  unreadSeenFilter,
} from './helpers/admin-notification.util';
import * as bcrypt from 'bcryptjs';
import { RbacService } from '../rbac/rbac.service';
import { RedisService } from '../common/redis/redis.service';
import { CategoriesService } from '../categories/categories.service';
import { SectorsService } from '../sectors/sectors.service';
import { ManufacturerIdGenerationService } from '../manufacturers/manufacturer-id-generation.service';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import {
  manufacturerStatusKey,
  urnStatusLabel,
  URN_STATUS_LABELS,
} from './admin-dashboard-metrics.util';
import type { DashboardMetricsQueryDto } from './dto/dashboard-metrics-query.dto';
import {
  buildAppliedDashboardFilters,
  buildManufacturerSnapshotMatch,
  buildProductSnapshotMatch,
  bucketDateExpression,
  formatBucketLabel,
  resolveDashboardDateRange,
  resolveRevenueDashboardGranularity,
  stateNameMatchesRegion,
  type DashboardGranularity,
  type ResolvedDashboardFilters,
} from './utils/dashboard-metrics-filters.util';
import { normalizeCategoryNameKey } from '../categories/category-name-normalize';
import {
  Category,
  CategoryDocument,
} from '../categories/schemas/category.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../product-registration/schemas/product-plant.schema';
import { State, StateDocument } from '../states/schemas/state.schema';
import {
  ActivityLog,
  ActivityLogDocument,
} from '../activity-log/schemas/activity-log.schema';
import { matchExpiredProducts } from '../product-registration/constants/expired-product.filter';
import { ProductRegistrationService } from '../product-registration/product-registration.service';
import type {
  AdminDashboardCharts,
  AdminDashboardMetrics,
  AppliedDashboardFilters,
} from './admin-dashboard-metrics.types';
import {
  filterDashboardMetricsByPermissions,
  type AdminDashboardMetricsResponse,
} from './admin-dashboard-permissions.util';
import type { AdminDashboardRevenueAnalytics } from './admin-dashboard-revenue.types';
import { AdminDashboardStatsService } from './dashboard/admin-dashboard-stats.service';
import { AdminRevenueDashboardService } from './dashboard/admin-revenue-dashboard.service';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../payments/schemas/payment-details.schema';
import { isPlatformAdminUser } from '../common/utils/platform-admin.util';
import { AuthService } from '../auth/auth.service';
import { buildPhoneLookupVariants } from '../common/utils/phone-lookup.util';
import {
  GlobalPhoneUniquenessService,
  ADMIN_MOBILE_UNAVAILABLE_MESSAGE,
} from '../common/services/global-phone-uniqueness.service';
import { throwTeamMemberMobileDuplicateIssue } from './admin-field-validation.util';
import {
  buildBannerVendorScopeFilter,
  resolveBannerPersistVendorObjectId,
} from './utils/banner-vendor-scope.util';
import {
  getTeamMemberSectorNameById,
  isTeamMemberSectorId,
  TEAM_MEMBER_SECTOR_OPTIONS,
} from './team-member-sectors.constants';

export type { AdminDashboardMetrics, AdminDashboardMetricsResponse };

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(input: string): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function resolveOptionalEventUrl(value: unknown): string | undefined {
  const trimmed = String(value ?? '').trim();
  return trimmed || undefined;
}

const DEFAULT_EVENT_BROCHURE_LINK =
  'https://www.linkedin.com/posts/cii-greenpro-ecolabelling_greenpro-summit-2025-brochure-03062025-activity-7335663123154014208-2ScV?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB-BYukBl9XKRWqUfyykOlftYFSgtIQGafI';

export interface TeamMemberSectorFields {
  sector_ids: number[];
  sectorIds: number[];
  sector_id: number | null;
  sector_name: string | null;
  sectors: { id: number; name: string }[];
}

export interface TeamMemberListItem {
  s_no: number;
  id: string;
  vendorUserId: string;
  name: string;
  designation: string;
  email: string;
  mobile: string;
  is_active: boolean;
  displayOrder: number;
  businessVertical: string;
  business_vertical: string;
  sector_ids: number[];
  sectorIds: number[];
  sector_id: number | null;
  sector_name: string | null;
  sectors: { id: number; name: string }[];
}

export interface TeamMembersPaginatedResult {
  data: TeamMemberListItem[];
  displayOrderMax: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
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
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    @InjectModel(ProductPlant.name)
    private productPlantModel: Model<ProductPlantDocument>,
    @InjectModel(State.name)
    private stateModel: Model<StateDocument>,
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
    @InjectModel(PaymentDetails.name)
    private paymentDetailsModel: Model<PaymentDetailsDocument>,
    private readonly emailService: EmailService,
    private readonly rbacService: RbacService,
    private readonly redisService: RedisService,
    private readonly categoriesService: CategoriesService,
    private readonly sectorsService: SectorsService,
    private readonly manufacturerIdGeneration: ManufacturerIdGenerationService,
    private readonly productRegistrationService: ProductRegistrationService,
    private readonly globalPhoneUniqueness: GlobalPhoneUniquenessService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly dashboardStatsService: AdminDashboardStatsService,
    private readonly revenueDashboardService: AdminRevenueDashboardService,
  ) {}

  async resolveDashboardMetricsFilters(
    query: DashboardMetricsQueryDto,
  ): Promise<ResolvedDashboardFilters> {
    const dateRange = resolveDashboardDateRange(query);
    const granularity = resolveRevenueDashboardGranularity(
      query.period,
      query.granularity,
    );
    let categoryObjectId: Types.ObjectId | undefined;
    if (query.categoryId) {
      categoryObjectId = await this.resolveDashboardCategoryId(query.categoryId);
    }
    let manufacturerIdsForRegion: Types.ObjectId[] | undefined;
    if (query.region) {
      manufacturerIdsForRegion = await this.resolveManufacturerIdsByRegion(
        query.region,
      );
    }

    const manufacturerRaw = (query.manufacturerId || query.vendorId || '').trim();
    let manufacturerObjectId: Types.ObjectId | undefined;
    if (manufacturerRaw) {
      if (!Types.ObjectId.isValid(manufacturerRaw)) {
        throw new BadRequestException('manufacturerId/vendorId must be a valid ObjectId');
      }
      manufacturerObjectId = new Types.ObjectId(manufacturerRaw);
    }

    return {
      dateRange,
      granularity,
      categoryObjectId,
      region: query.region,
      productStatusFilter: query.productStatus,
      manufacturerIdsForRegion,
      manufacturerObjectId,
      status: query.status,
    };
  }

  buildAppliedFiltersPayload(
    query: DashboardMetricsQueryDto,
    filters: ResolvedDashboardFilters,
  ): AppliedDashboardFilters {
    return buildAppliedDashboardFilters(query, filters);
  }

  getDashboardFilterOptions() {
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];
    return {
      periods: [
        { value: 'this_week', label: 'This Week' },
        { value: 'last_week', label: 'Last Week' },
        { value: 'this_month', label: 'This Month' },
        { value: 'last_month', label: 'Last Month' },
        { value: 'this_quarter', label: 'This Quarter' },
        { value: 'this_year', label: 'This Year' },
        { value: 'last_year', label: 'Last Year' },
      ],
      years: [
        { value: null, label: 'All Years' },
        ...years.map((y) => ({ value: y, label: String(y) })),
      ],
      months: [
        { value: null, label: 'All Months' },
        { value: 1, label: 'Jan' },
        { value: 2, label: 'Feb' },
        { value: 3, label: 'Mar' },
        { value: 4, label: 'Apr' },
        { value: 5, label: 'May' },
        { value: 6, label: 'Jun' },
        { value: 7, label: 'Jul' },
        { value: 8, label: 'Aug' },
        { value: 9, label: 'Sep' },
        { value: 10, label: 'Oct' },
        { value: 11, label: 'Nov' },
        { value: 12, label: 'Dec' },
      ],
      productStatuses: [
        { value: null, label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'active', label: 'Active (in certification)' },
        { value: 'completed', label: 'Completed (certified)' },
        { value: 'overdue', label: 'Overdue (expired)' },
      ],
      regions: [
        { value: null, label: 'All Regions' },
        { value: 'north', label: 'North' },
        { value: 'south', label: 'South' },
        { value: 'east', label: 'East' },
        { value: 'west', label: 'West' },
      ],
      granularities: [
        { value: 'monthly', label: 'Monthly' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'quarterly', label: 'Quarterly' },
      ],
      defaults: {
        period: 'this_year',
        year: currentYear,
        month: null,
        granularity: 'monthly',
      },
      queryParamMap: {
        period: 'period',
        year: 'year',
        month: 'month',
        quarter: 'quarter',
        productStatus: 'productStatus',
        categoryId: 'categoryId',
        region: 'region',
        granularity: 'granularity',
      },
    };
  }

  private async resolveDashboardCategoryId(raw: string): Promise<Types.ObjectId> {
    const trimmed = String(raw).trim();
    if (/^[0-9a-fA-F]{24}$/.test(trimmed)) {
      return new Types.ObjectId(trimmed);
    }
    const key = normalizeCategoryNameKey(trimmed.replace(/-/g, ' '));
    const cat = await this.categoryModel
      .findOne({ category_name_normalized: key })
      .select('_id')
      .lean()
      .exec();
    if (!cat?._id) {
      throw new BadRequestException(`Category not found: ${raw}`);
    }
    return cat._id as Types.ObjectId;
  }

  private async resolveManufacturerIdsByRegion(
    region: 'north' | 'south' | 'east' | 'west',
  ): Promise<Types.ObjectId[]> {
    const states = await this.stateModel.find().select('stateName').lean().exec();
    const stateIds = states
      .filter((s) =>
        stateNameMatchesRegion(String(s.stateName ?? ''), region),
      )
      .map((s) => s._id);
    if (stateIds.length === 0) {
      return [];
    }
    return this.productPlantModel
      .distinct('manufacturerId', { stateId: { $in: stateIds } })
      .exec();
  }

  private compareChartBuckets(
    a: { year?: number; month?: number; quarter?: number; week?: number },
    b: { year?: number; month?: number; quarter?: number; week?: number },
    granularity: DashboardGranularity,
  ): number {
    const ay = a.year ?? 0;
    const by = b.year ?? 0;
    if (ay !== by) return ay - by;
    if (granularity === 'weekly') {
      return (a.week ?? 0) - (b.week ?? 0);
    }
    if (granularity === 'quarterly') {
      return (a.quarter ?? 0) - (b.quarter ?? 0);
    }
    return (a.month ?? 0) - (b.month ?? 0);
  }

  private async buildDashboardCharts(
    filters: ResolvedDashboardFilters,
  ): Promise<AdminDashboardCharts> {
    return this.dashboardStatsService.getCharts(filters);
  }

  async getDashboardRecentProducts(page = 1, limit = 10) {
    return this.productRegistrationService.adminListProducts({
      page,
      limit,
      sortBy: 'createdDate',
      sortOrder: 'desc',
    });
  }

  async getDashboardActivity(limit = 20) {
    const rows = await this.activityLogModel
      .find()
      .sort({ created_at: -1 })
      .limit(limit)
      .lean()
      .exec();

    return rows.map((r) => ({
      id: String(r._id),
      urnNo: r.urn_no,
      activity: r.activity,
      activityStatus: r.activity_status,
      manufacturerId: String(r.manufacturer_id),
      vendorId: String(r.vendor_id),
      createdAt: r.created_at,
    }));
  }

  /** Normalized sector ids stored on the team member (or legacy fallback from categories). */
  private teamMemberStoredSectorIds(m: {
    sector_ids?: unknown;
    sector_id?: unknown;
    category_ids?: unknown;
    category_id?: unknown;
  }): number[] {
    const fromSectors = Array.isArray(m.sector_ids) ? m.sector_ids : [];
    const sectorIds = fromSectors.filter(
      (x): x is number => typeof x === 'number' && Number.isInteger(x) && x >= 1,
    );
    if (sectorIds.length > 0) {
      return [...new Set(sectorIds)];
    }
    const oneSector =
      typeof m.sector_id === 'number' &&
      Number.isInteger(m.sector_id) &&
      m.sector_id >= 1
        ? m.sector_id
        : null;
    if (oneSector !== null) {
      return [oneSector];
    }
    return [];
  }

  /** Legacy rows: derive sector ids from stored category_ids when sector_ids is empty. */
  private async legacySectorIdsFromCategories(m: {
    category_ids?: unknown;
    category_id?: unknown;
  }): Promise<number[]> {
    const raw = Array.isArray(m.category_ids) ? m.category_ids : [];
    const catIds = raw.filter(
      (x): x is number => typeof x === 'number' && Number.isInteger(x) && x >= 1,
    );
    if (!catIds.length) {
      const one =
        typeof m.category_id === 'number' &&
        Number.isInteger(m.category_id) &&
        m.category_id >= 1
          ? m.category_id
          : null;
      if (one !== null) catIds.push(one);
    }
    if (!catIds.length) return [];
    const catToSector =
      await this.categoriesService.getCategorySectorsByNumericIds(catIds);
    const out = new Set<number>();
    for (const cid of catIds) {
      const s = catToSector.get(cid);
      if (typeof s === 'number' && Number.isInteger(s) && s >= 1) {
        out.add(s);
      }
    }
    return [...out].sort((a, b) => a - b);
  }

  private async normalizeTeamMemberSectorIds(m: {
    sector_ids?: unknown;
    sector_id?: unknown;
    category_ids?: unknown;
    category_id?: unknown;
  }): Promise<number[]> {
    const stored = this.teamMemberStoredSectorIds(m);
    if (stored.length > 0) return stored;
    return this.legacySectorIdsFromCategories(m);
  }

  /** Validates fixed CMS team-member sectors (ids 1–4 only). */
  private assertTeamMemberSectorsValid(sectorIds: number[]): number[] {
    const unique: number[] = [];
    const seen = new Set<number>();
    const invalid: number[] = [];
    for (const sid of sectorIds) {
      if (!Number.isInteger(sid)) continue;
      if (seen.has(sid)) continue;
      seen.add(sid);
      if (isTeamMemberSectorId(sid)) {
        unique.push(sid);
      } else {
        invalid.push(sid);
      }
    }
    if (invalid.length > 0) {
      const allowed = TEAM_MEMBER_SECTOR_OPTIONS.map((s) => s.name).join(', ');
      throw new BadRequestException(
        `Invalid sector id(s): ${invalid.join(', ')}. Allowed sectors: ${allowed}`,
      );
    }
    return unique.sort((a, b) => a - b);
  }

  listTeamMemberSectorOptions() {
    return {
      message: 'Team member sector options retrieved successfully',
      data: [...TEAM_MEMBER_SECTOR_OPTIONS],
    };
  }

  private async assertGlobalMobileAvailable(
    mobile: string,
    excludeUserId?: Types.ObjectId,
  ): Promise<void> {
    try {
      await this.globalPhoneUniqueness.assertPhoneAvailable(mobile, {
        excludeUserId,
        conflictMessage: ADMIN_MOBILE_UNAVAILABLE_MESSAGE,
      });
    } catch (e) {
      if (e instanceof ConflictException) {
        throwTeamMemberMobileDuplicateIssue();
      }
      throw e;
    }
  }

  /** Platform admin/staff emails are globally unique (including soft-deleted rows). */
  private async assertPlatformEmailAvailable(
    emailLower: string,
    excludeUserId?: Types.ObjectId,
  ): Promise<void> {
    const filter: Record<string, unknown> = {
      type: { $in: ['admin', 'staff'] },
      email: new RegExp(`^${escapeRegex(emailLower)}$`, 'i'),
    };
    if (excludeUserId) {
      filter._id = { $ne: excludeUserId };
    }
    const existing = await this.vendorUserModel
      .findOne(filter)
      .select('_id email')
      .lean()
      .exec();
    if (existing) {
      throw new ConflictException('Email already exists');
    }
  }

  private rethrowTeamMemberDuplicateKeyError(e: unknown): never {
    const err = e as { code?: number; keyPattern?: Record<string, unknown>; keyValue?: Record<string, unknown> };
    if (err?.code === 11000) {
      const pattern = err.keyPattern ?? {};
      const keyVal = err.keyValue ?? {};
      if ('email' in pattern || keyVal.email !== undefined) {
        throw new ConflictException('Email already exists');
      }
      if ('phone' in pattern || keyVal.phone !== undefined) {
        throwTeamMemberMobileDuplicateIssue();
      }
      throw new ConflictException('Duplicate record');
    }
    throw e;
  }

  /** Attach fixed CMS sector names for API; strips category_* and internal fields. */
  private async attachSectorsToTeamMemberRows<
    T extends Record<string, unknown>,
  >(rows: Array<T & { sector_ids: number[] }>): Promise<
    Array<
      Omit<T, 'category_ids' | 'categoryIds' | 'category_id' | 'sector_ids'> &
        TeamMemberSectorFields
    >
  > {
    const legacyIds = new Set<number>();
    for (const row of rows) {
      for (const sid of row.sector_ids) {
        if (!isTeamMemberSectorId(sid)) {
          legacyIds.add(sid);
        }
      }
    }
    const legacyNameMap =
      legacyIds.size > 0
        ? await this.sectorsService.getSectorNamesByNumericIds([...legacyIds])
        : new Map<number, string>();

    return rows.map((row) => {
      const {
        sector_ids: storedSectorIds,
        category_ids: _cids,
        categoryIds: _cidsCamel,
        category_id: _cid,
        sector_id: _sid,
        ...rest
      } = row as T & {
        sector_ids: number[];
        category_ids?: number[];
        categoryIds?: number[];
        category_id?: number;
        sector_id?: number;
      };

      const sector_ids = [...storedSectorIds]
        .filter((id) => isTeamMemberSectorId(id) || legacyNameMap.has(id))
        .sort((a, b) => a - b);
      const sectors = sector_ids.map((id) => ({
        id,
        name: isTeamMemberSectorId(id)
          ? getTeamMemberSectorNameById(id)
          : (legacyNameMap.get(id) ?? ''),
      }));
      const sector_id = sector_ids[0] ?? null;
      const sector_name =
        sector_id !== null
          ? isTeamMemberSectorId(sector_id)
            ? getTeamMemberSectorNameById(sector_id)
            : (legacyNameMap.get(sector_id) ?? '')
          : null;

      return {
        ...rest,
        sector_ids,
        sectorIds: sector_ids,
        sector_id,
        sector_name,
        sectors,
      } as Omit<T, 'category_ids' | 'categoryIds' | 'category_id' | 'sector_ids'> &
        TeamMemberSectorFields;
    });
  }

  /** Resolve sector ids for a team member row (includes legacy category fallback). */
  async resolveTeamMemberSectorIds(member: {
    sector_ids?: unknown;
    sector_id?: unknown;
    category_ids?: unknown;
    category_id?: unknown;
  }): Promise<number[]> {
    return this.normalizeTeamMemberSectorIds(member);
  }

  /** Attach sector_ids, sectorIds, sector_id, sector_name, and sectors to list rows. */
  async attachTeamMemberSectorFields<T extends Record<string, unknown>>(
    rows: Array<T & { sector_ids: number[] }>,
  ): Promise<
    Array<
      Omit<T, 'category_ids' | 'categoryIds' | 'category_id' | 'sector_ids'> &
        TeamMemberSectorFields
    >
  > {
    return this.attachSectorsToTeamMemberRows(rows);
  }

  private invalidateWebsiteTeamMembersListCache(): void {
    for (const version of ['list-v2', 'list-v3', 'list-v4']) {
      const key = this.redisService.buildKey('website', 'team-members', version);
      this.redisService.del(key).catch((err) => {
        this.logger.warn(
          `Website team-members cache invalidation failed: ${(err as Error)?.message || 'unknown'}`,
        );
      });
    }
  }

  private mapTeamMemberShowOnWebsite(value: unknown): boolean {
    if (value === false || value === 0) return false;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === '0' || normalized === 'false' || normalized === 'no' || normalized === 'off') {
        return false;
      }
    }
    return true;
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

  /** How the banner image was stored: multipart upload vs URL/path in form. */
  private resolveBannerImageSource(
    stored: unknown,
  ): 'binary_upload' | 'manual_url' {
    return stored === 'binary_upload' ? 'binary_upload' : 'manual_url';
  }

  private resolveBannerVideoPath(videoUrl?: string | null): string {
    return this.resolveBannerImagePath(videoUrl);
  }

  private resolveBannerVideoForResponse(
    videoUrl?: string | null,
    bannerVideo?: string | null,
  ): string {
    const videoRaw = String(videoUrl ?? '').trim();
    if (videoRaw && /^https?:\/\//i.test(videoRaw)) return videoRaw;
    const candidate = videoRaw || (bannerVideo ? `/uploads/${bannerVideo}` : '');
    return String(candidate).trim();
  }

  private resolveBannerVideoSource(stored: unknown): 'binary_upload' | undefined {
    return stored === 'binary_upload' ? 'binary_upload' : undefined;
  }

  private mapBannerRowForResponse(
    b: Record<string, unknown>,
    index?: number,
  ) {
    const st = (b.status as number | undefined) ?? 1;
    return {
      ...(index != null ? { s_no: index + 1 } : {}),
      id: String(b._id),
      imageUrl: this.resolveBannerImageForResponse(
        b.imageUrl as string,
        b.banner_image as string,
      ),
      imageSource: this.resolveBannerImageSource(b.imageSource),
      videoUrl: this.resolveBannerVideoForResponse(
        b.videoUrl as string,
        b.banner_video as string,
      ),
      videoSource: this.resolveBannerVideoSource(b.videoSource),
      heading: b.heading as string,
      title: b.heading as string,
      sequenceNumber: Number(b.sequenceNumber ?? 1),
      description: b.description as string,
      status: st === 1 ? 'active' : 'inactive',
      is_active: st === 1,
    };
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
    const { _id, __v, registrationLink: storedRegistrationLink, ...rest } =
      obj ?? {};
    const registrationLink = resolveOptionalEventUrl(storedRegistrationLink);
    const startDate = resolveEventStartDate(rest ?? {});
    const endDate = resolveEventEndDate(rest ?? {});
    const datePart = startDate ? toDateOnlyIso(startDate) : '';
    const endDatePart = endDate ? toDateOnlyIso(endDate) : datePart;
    const brochures = mapEventBrochuresFromDoc(rest ?? {});
    const brochureLink =
      primaryEventBrochureLink(brochures) ||
      String((rest as any)?.brochureLink ?? '').trim() ||
      DEFAULT_EVENT_BROCHURE_LINK;
    return {
      ...rest,
      eventDate: datePart || (rest as any)?.eventDate,
      eventStartDate: datePart,
      eventEndDate: endDatePart,
      is_active: isEventVisibleOnWebsite(rest ?? {}),
      galleryImages: Array.isArray((rest as any)?.galleryImages)
        ? (rest as any).galleryImages
        : (rest as any)?.eventImage
          ? [(rest as any).eventImage]
          : [],
      event_image:
        (rest as any)?.event_image ??
        this.resolveEventImagePath((rest as any)?.eventImage),
      ...(registrationLink ? { registrationLink } : {}),
      brochures,
      brochureLink,
      ...(id ? { id } : {}),
    };
  }

  private eventKindMatch(kind: 'event' | 'gallery'): Record<string, unknown> {
    if (kind === 'gallery') {
      return {
        galleryType: { $exists: true, $nin: [null, ''] },
      };
    }
    return {
      $or: [
        { galleryType: { $exists: false } },
        { galleryType: null },
        { galleryType: '' },
      ],
    };
  }

  private parseEventIdentifier(identifier: string): {
    where: Record<string, unknown>;
  } {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Event id is required');
    if (Types.ObjectId.isValid(raw)) {
      return { where: { _id: new Types.ObjectId(raw) } };
    }
    const asNumber = Number.parseInt(raw, 10);
    if (!Number.isFinite(asNumber) || asNumber <= 0) {
      throw new BadRequestException(
        'Invalid event id (expected Mongo _id or numeric eventId)',
      );
    }
    return { where: { eventId: asNumber } };
  }

  async createEvent(payload: {
    eventName: string;
    eventDate: Date;
    eventStartDate?: Date;
    eventEndDate?: Date;
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
    brochures?: EventBrochureRow[];
  }) {
    const eventId = await this.nextEventId();
    const now = new Date();
    const eventStartDate = payload.eventStartDate ?? payload.eventDate;
    const eventEndDate = payload.eventEndDate ?? eventStartDate;
    const brochures = payload.brochures ?? [];
    const brochureLink =
      primaryEventBrochureLink(brochures) ?? payload.brochureLink;

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
      eventDate: eventStartDate,
      eventStartDate,
      eventEndDate,
      eventStartTime: payload.eventStartTime,
      eventEndTime: payload.eventEndTime,
      eventLocation: payload.eventLocation,
      contactPersonName: payload.contactPersonName,
      contactPersonDesignation: payload.contactPersonDesignation,
      contactPersonEmail: payload.contactPersonEmail,
      contactPersonPhone: payload.contactPersonPhone,
      registrationLink: payload.registrationLink,
      brochures,
      brochureLink,
      eventStatus:
        payload.eventStatus === 0 || payload.eventStatus === 1
          ? payload.eventStatus
          : 1,
      createdDate: now,
      updatedDate: now,
    });

    const saved = await doc.save();
    return this.formatEventResponse(saved);
  }

  async updateEvent(
    identifier: string,
    payload: {
      eventName?: string;
      eventDate?: Date;
      eventStartDate?: Date;
      eventEndDate?: Date;
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
      brochures?: EventBrochureRow[];
      eventStatus?: number;
    },
    kind: 'event' | 'gallery' = 'event',
  ) {
    const { where } = this.parseEventIdentifier(identifier);

    const $set: Record<string, unknown> = { updatedDate: new Date() };
    if (
      payload.eventName !== undefined &&
      String(payload.eventName).trim() !== ''
    )
      $set.eventName = payload.eventName;
    if (payload.eventStartDate !== undefined) {
      $set.eventStartDate = payload.eventStartDate;
      $set.eventDate = payload.eventStartDate;
    } else if (payload.eventDate !== undefined) {
      $set.eventDate = payload.eventDate;
      $set.eventStartDate = payload.eventDate;
    }
    if (payload.eventEndDate !== undefined) {
      $set.eventEndDate = payload.eventEndDate;
    }
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
    if (payload.registrationLink !== undefined) {
      const registrationLink = resolveOptionalEventUrl(payload.registrationLink);
      if (registrationLink) {
        $set.registrationLink = registrationLink;
      } else {
        $set.registrationLink = '';
      }
    }
    if (payload.brochures !== undefined) {
      $set.brochures = payload.brochures;
      const primaryBrochure = primaryEventBrochureLink(payload.brochures);
      $set.brochureLink = primaryBrochure ?? '';
    } else if (
      payload.brochureLink !== undefined &&
      String(payload.brochureLink).trim() !== ''
    ) {
      $set.brochureLink = payload.brochureLink;
    }
    if (payload.eventStatus === 0 || payload.eventStatus === 1) {
      $set.eventStatus = payload.eventStatus;
    }

    const updated = await this.eventModel
      .findOneAndUpdate(
        {
          ...where,
          ...this.eventKindMatch(kind),
        },
        { $set },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Event not found');
    }

    return this.formatEventResponse(updated);
  }

  async listEvents(kind: 'event' | 'gallery' = 'event') {
    const rows = await this.eventModel
      .find(this.eventKindMatch(kind))
      .sort({ createdDate: -1, _id: -1 })
      .select(
        'eventName eventDescription eventImage event_image galleryImages galleryType eventDate eventStartDate eventEndDate eventStartTime eventEndTime eventLocation eventStatus createdDate updatedDate eventId registrationLink brochureLink brochures',
      )
      .lean()
      .exec();

    return (rows ?? []).map((e: any, idx: number) =>
      this.mapEventListRow(e, idx + 1),
    );
  }

  async listEventsPaginated(
    page = 1,
    perPage = 10,
    options?: { activeOnly?: boolean },
  ) {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safePerPage =
      Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 10;
    const where: Record<string, unknown> = {
      ...this.eventKindMatch('event'),
    };
    if (options?.activeOnly) {
      Object.assign(where, buildWebsiteVisibleEventsMatch());
    }

    const [total, rows] = await Promise.all([
      this.eventModel.countDocuments(where).exec(),
      this.eventModel
        .find(where)
        .sort({ eventDate: -1, createdDate: -1, _id: -1 })
        .skip((safePage - 1) * safePerPage)
        .limit(safePerPage)
        .select(
          'eventName eventDescription eventImage event_image galleryImages galleryType eventDate eventStartDate eventEndDate eventStartTime eventEndTime eventLocation eventStatus createdDate updatedDate eventId registrationLink brochureLink brochures',
        )
        .lean()
        .exec(),
    ]);

    const totalPages = total > 0 ? Math.ceil(total / safePerPage) : 0;
    const data = (rows ?? []).map((e: any, idx: number) =>
      this.mapEventListRow(e, (safePage - 1) * safePerPage + idx + 1),
    );

    return {
      data,
      pagination: {
        page: safePage,
        limit: safePerPage,
        perPage: safePerPage,
        total,
        totalPages,
      },
    };
  }

  private mapEventListRow(e: any, serialNo: number) {
    const startDate = resolveEventStartDate(e ?? {});
    const endDate = resolveEventEndDate(e ?? {});
    const datePart = startDate ? toDateOnlyIso(startDate) : '';
    const endDatePart = endDate ? toDateOnlyIso(endDate) : datePart;
    const timePart = String(e?.eventStartTime ?? '').trim();
    const visible = isEventVisibleOnWebsite(e ?? {});
    const brochures = mapEventBrochuresFromDoc(e ?? {});
    const registrationLink = resolveOptionalEventUrl(e?.registrationLink);
    return {
      s_no: serialNo,
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
      eventDate: datePart,
      eventStartDate: datePart,
      eventEndDate: endDatePart,
      dateTime: [datePart, timePart].filter(Boolean).join(' '),
      location: String(e.eventLocation ?? ''),
      is_active: visible,
      ...(registrationLink ? { registrationLink } : {}),
      brochures,
      brochureLink:
        primaryEventBrochureLink(brochures) ||
        e.brochureLink ||
        DEFAULT_EVENT_BROCHURE_LINK,
    };
  }

  async listGalleryPaginated(
    page = 1,
    perPage = 50,
    options?: { activeOnly?: boolean },
  ) {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safePerPage =
      Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 50;
    const where: Record<string, unknown> = {
      ...this.eventKindMatch('gallery'),
    };
    if (options?.activeOnly) {
      Object.assign(where, buildWebsiteVisibleEventsMatch());
    }

    const [total, rows] = await Promise.all([
      this.eventModel.countDocuments(where).exec(),
      this.eventModel
        .find(where)
        .sort({ createdDate: -1, _id: -1 })
        .skip((safePage - 1) * safePerPage)
        .limit(safePerPage)
        .select(
          'eventName eventDescription eventImage event_image galleryImages galleryType eventDate eventStartTime eventLocation eventStatus createdDate updatedDate eventId registrationLink brochureLink',
        )
        .lean()
        .exec(),
    ]);

    const totalPages = total > 0 ? Math.ceil(total / safePerPage) : 0;
    const data = (rows ?? []).map((e: any, idx: number) =>
      this.mapEventListRow(e, (safePage - 1) * safePerPage + idx + 1),
    );

    return {
      data,
      pagination: {
        page: safePage,
        perPage: safePerPage,
        total,
        totalPages,
      },
    };
  }

  async getEventById(identifier: string, kind: 'event' | 'gallery' = 'event') {
    const { where } = this.parseEventIdentifier(identifier);
    const event = await this.eventModel
      .findOne({
        ...where,
        ...this.eventKindMatch(kind),
      })
      .lean()
      .exec();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.formatEventResponse(event);
  }

  async deleteEvent(identifier: string, kind: 'event' | 'gallery' = 'event') {
    const { where } = this.parseEventIdentifier(identifier);
    const res = await this.eventModel
      .deleteOne({
        ...where,
        ...this.eventKindMatch(kind),
      })
      .exec();

    if (!res || res.deletedCount === 0) {
      throw new NotFoundException('Event not found');
    }

    return { id: String(identifier ?? '').trim() };
  }

  async setOrToggleEventStatus(
    identifier: string,
    status?: number,
    kind: 'event' | 'gallery' = 'event',
  ) {
    const { where } = this.parseEventIdentifier(identifier);
    const scopedWhere = {
      ...where,
      ...this.eventKindMatch(kind),
    };

    let nextStatus: number;
    if (status === 0 || status === 1) {
      nextStatus = status;
    } else {
      const current = await this.eventModel
        .findOne(scopedWhere)
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
        scopedWhere,
        { $set: { eventStatus: nextStatus, updatedDate: new Date() } },
        { new: true },
      )
      .select('_id eventId eventStatus')
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Event not found');
    }

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
    shortDescription?: string;
    date: Date;
    image?: string;
    url?: string;
    externalUrl?: boolean;
    pdf?: string;
    status?: number;
  }) {
    const externalUrl = payload.externalUrl === true;
    const description = String(payload.description ?? '').trim();
    const shortDescription = String(payload.shortDescription ?? '').trim();
    const url = String(payload.url ?? '').trim();
    if (externalUrl) {
      if (!url) {
        throw new BadRequestException('url is required when externalUrl is true');
      }
      if (!shortDescription) {
        throw new BadRequestException(
          'shortDescription is required when externalUrl is true',
        );
      }
    } else if (!description) {
      throw new BadRequestException('description is required');
    }

    const doc = new this.articleModel({
      title: String(payload.title ?? '').trim(),
      description: externalUrl ? '' : description,
      shortDescription: externalUrl ? shortDescription : '',
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
      shortDescription?: string;
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
    if (payload.title !== undefined) $set.title = String(payload.title).trim();
    if (payload.description !== undefined) $set.description = String(payload.description).trim();
    if (payload.shortDescription !== undefined) {
      $set.shortDescription = String(payload.shortDescription).trim();
    }
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
        : payload.url !== undefined &&
            payload.description === undefined &&
            payload.shortDescription !== undefined
          ? true
          : payload.description !== undefined && payload.url === undefined
            ? false
            : payload.shortDescription !== undefined &&
                payload.description === undefined
              ? true
              : (current as any).externalUrl === true;
    const nextDescription =
      payload.description !== undefined
        ? String(payload.description ?? '').trim()
        : String((current as any).description ?? '').trim();
    const nextShortDescription =
      payload.shortDescription !== undefined
        ? String(payload.shortDescription ?? '').trim()
        : String((current as any).shortDescription ?? '').trim();
    const nextUrl =
      payload.url !== undefined
        ? String(payload.url ?? '').trim()
        : String((current as any).url ?? '').trim();

    if (nextExternalUrl) {
      if (!nextUrl) {
        throw new BadRequestException('url is required when externalUrl is true');
      }
      if (!nextShortDescription) {
        throw new BadRequestException(
          'shortDescription is required when externalUrl is true',
        );
      }
      $set.shortDescription = nextShortDescription;
      $set.description = '';
      $set.url = nextUrl;
      $set.externalUrl = true;
    } else {
      if (!nextDescription) {
        throw new BadRequestException('description is required');
      }
      $set.shortDescription = '';
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

  private resolveArticleShortDescription(a: any): string {
    const shortDescription = String(a?.shortDescription ?? '').trim();
    if (shortDescription) return shortDescription;
    if (a?.externalUrl === true) {
      return String(a?.description ?? '').trim();
    }
    return '';
  }

  private mapArticleListRow(a: any, serialNo: number) {
    return {
      s_no: serialNo,
      id: String(a._id),
      title: String(a.title ?? ''),
      description: String(a.description ?? ''),
      shortDescription: this.resolveArticleShortDescription(a),
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
      url: String(a.url ?? ''),
      externalUrl: a.externalUrl === true,
      pdf: this.resolveArticleAssetForResponse(a.pdf) || null,
      article_pdf: this.resolveArticleAssetForResponse(
        a.article_pdf ?? this.resolveArticlePdfPath(a.pdf),
      ),
      is_active: Number(a.status) === 1,
    };
  }

  async listArticles() {
    const rows = await this.articleModel
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .select(
        'title description shortDescription date image article_image url externalUrl pdf article_pdf status',
      )
      .lean()
      .exec();

    return (rows ?? []).map((a, idx) => this.mapArticleListRow(a, idx + 1));
  }

  async listArticlesPaginated(
    page = 1,
    perPage = 12,
    options?: { activeOnly?: boolean },
  ) {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safePerPage =
      Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 12;
    const where: Record<string, unknown> = {};
    if (options?.activeOnly) {
      where.status = 1;
    }

    const [total, rows] = await Promise.all([
      this.articleModel.countDocuments(where).exec(),
      this.articleModel
        .find(where)
        .sort({ createdAt: -1, _id: -1 })
        .skip((safePage - 1) * safePerPage)
        .limit(safePerPage)
        .select(
          'title description shortDescription date image article_image url externalUrl pdf article_pdf status',
        )
        .lean()
        .exec(),
    ]);

    const totalPages = total > 0 ? Math.ceil(total / safePerPage) : 0;
    const data = (rows ?? []).map((a, idx) =>
      this.mapArticleListRow(a, (safePage - 1) * safePerPage + idx + 1),
    );

    return {
      data,
      pagination: {
        page: safePage,
        limit: safePerPage,
        perPage: safePerPage,
        total,
        totalPages,
      },
    };
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
      shortDescription: this.resolveArticleShortDescription(article),
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

    const where = buildAdminNotificationWhere(query);
    const unreadWhere = buildAdminNotificationUnreadCountWhere(query);

    const [totalCount, unreadCount, rows] = await Promise.all([
      this.notificationModel.countDocuments(where).exec(),
      this.notificationModel.countDocuments(unreadWhere).exec(),
      this.notificationModel
        .find(where)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),
    ]);

    return {
      data: (rows ?? []).map((n) =>
        mapAdminNotificationRow(n as Record<string, unknown>),
      ),
      totalCount,
      unreadCount,
      currentPage: safePage,
      totalPages: Math.max(1, Math.ceil(totalCount / safeLimit) || 1),
    };
  }

  async markNotificationSeen(notificationId: string) {
    if (!notificationId?.trim()) {
      throw new BadRequestException('Notification id is required');
    }
    if (!Types.ObjectId.isValid(notificationId.trim())) {
      throw new BadRequestException('Invalid notification id');
    }

    const now = new Date();
    const updated = await this.notificationModel
      .findByIdAndUpdate(
        notificationId.trim(),
        { $set: { seen: 1, seenAt: now } },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Notification not found');
    }

    return {
      success: true,
      id: String(updated._id),
      seen: 1 as const,
    };
  }

  async markAllNotificationsSeen(): Promise<{ success: true; markedCount: number }> {
    const now = new Date();
    const result = await this.notificationModel
      .updateMany(unreadSeenFilter(), { $set: { seen: 1, seenAt: now } })
      .exec();

    return {
      success: true,
      markedCount: result.modifiedCount ?? 0,
    };
  }

  async createTeamMember(
    data: {
      name: string;
      designation?: string;
      email: string;
      mobile: string;
      displayOrder?: number;
      businessVertical: BusinessVertical;
      imagePath?: string;
      facebookUrl?: string;
      twitterUrl?: string;
      linkedinUrl?: string;
      roleId?: string;
      roleIds?: string[];
      sector_ids: number[];
      showOnWebsite?: boolean;
    },
  ) {
    const emailLower = data.email.trim().toLowerCase();
    const mobileTrim = data.mobile.trim();

    await this.assertGlobalMobileAvailable(mobileTrim);

    await this.assertPlatformEmailAvailable(emailLower);

    /** Same email/phone can still exist on a soft-deleted row (status 2); unique index blocks a second insert. */
    const phoneVariants = buildPhoneLookupVariants(mobileTrim);
    const softDeletedOr: Record<string, unknown>[] = [
      { email: new RegExp(`^${escapeRegex(emailLower)}$`, 'i') },
    ];
    if (phoneVariants.length > 0) {
      softDeletedOr.push({ phone: { $in: phoneVariants } });
    }
    const softDeleted = await this.vendorUserModel
      .findOne({
        type: 'staff',
        status: 2,
        $or: softDeletedOr,
      })
      .exec();

    if (softDeleted) {
      await this.assertGlobalMobileAvailable(mobileTrim, softDeleted._id);
      await this.assertPlatformEmailAvailable(emailLower, softDeleted._id);

      const totalNonDeleted = await this.vendorUserModel
        .countDocuments({
          type: 'staff',
          businessVertical: data.businessVertical,
          status: { $ne: 2 },
        })
        .exec();
      const maxAllowed = Math.max(1, totalNonDeleted + 1);
      const desiredOrder =
        data.displayOrder === undefined ? maxAllowed : data.displayOrder;
      if (!Number.isInteger(desiredOrder) || desiredOrder < 1) {
        throw new BadRequestException('Display order must be a positive integer');
      }

      if (desiredOrder <= totalNonDeleted) {
        await this.vendorUserModel
          .updateMany(
            {
              type: 'staff',
              businessVertical: data.businessVertical,
              status: { $ne: 2 },
              displayOrder: { $gte: desiredOrder },
            },
            { $inc: { displayOrder: 1 } },
          )
          .exec();
      }

      const passwordHash = await bcrypt.hash(
        crypto.randomBytes(8).toString('hex'),
        10,
      );

      const $set: Record<string, unknown> = {
        name: data.name.trim(),
        email: emailLower,
        phone: mobileTrim,
        status: 1,
        isVerified: true,
        password: passwordHash,
        displayOrder: desiredOrder,
        businessVertical: data.businessVertical,
        image: data.imagePath,
        facebookUrl: data.facebookUrl,
        twitterUrl: data.twitterUrl,
        linkedinUrl: data.linkedinUrl,
        updatedAt: new Date(),
        showOnWebsite: data.showOnWebsite !== false,
      };
      if (data.designation !== undefined && data.designation !== '') {
        $set.designation = data.designation;
      }

      const updatePayload: Record<string, unknown> = { $set };
      const $unset: Record<string, string> = { team: '' };
      if (data.designation !== undefined && data.designation === '') {
        $unset.designation = '';
      }
      if (Object.keys($unset).length > 0) {
        updatePayload.$unset = $unset;
      }

      let updated: VendorUserDocument | null;
      try {
        updated = await this.vendorUserModel
          .findByIdAndUpdate(softDeleted._id, updatePayload, { new: true })
          .exec();
      } catch (e) {
        this.rethrowTeamMemberDuplicateKeyError(e);
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

      await this.rbacService.replaceStaffRoles(undefined, {
        vendorUserId: String(updated._id),
        roleIds: normalizedRoleIds,
      });

      this.invalidateWebsiteTeamMembersListCache();

      const obj: any = updated.toObject();
      delete obj.password;
      delete obj.otp;
      const id = String(updated._id);
      return {
        ...obj,
        id,
        vendorUserId: id,
        roleIds: normalizedRoleIds,
        portalAccess: normalizedRoleIds.length > 0,
        businessVertical: obj.businessVertical,
        business_vertical: obj.businessVertical,
        showOnWebsite: this.mapTeamMemberShowOnWebsite(obj.showOnWebsite),
      };
    }

    const totalNonDeleted = await this.vendorUserModel
      .countDocuments({
        type: 'staff',
        businessVertical: data.businessVertical,
        status: { $ne: 2 },
      })
      .exec();
    const maxAllowed = Math.max(1, totalNonDeleted + 1);
    const desiredOrder =
      data.displayOrder === undefined ? maxAllowed : data.displayOrder;
    if (!Number.isInteger(desiredOrder) || desiredOrder < 1) {
      throw new BadRequestException('Display order must be a positive integer');
    }

    if (desiredOrder <= totalNonDeleted) {
      await this.vendorUserModel
        .updateMany(
          {
            type: 'staff',
            businessVertical: data.businessVertical,
            status: { $ne: 2 },
            displayOrder: { $gte: desiredOrder },
          },
          { $inc: { displayOrder: 1 } },
        )
        .exec();
    }

    const passwordHash = await bcrypt.hash(crypto.randomBytes(8).toString('hex'), 10);

    const sector_ids = this.assertTeamMemberSectorsValid(data.sector_ids);

    const teamMember: Partial<VendorUser> = {
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
      businessVertical: data.businessVertical,
      password: passwordHash,
      sector_ids,
      ...(sector_ids.length > 0 ? { sector_id: sector_ids[0] } : {}),
      category_ids: [],
      showOnWebsite: data.showOnWebsite !== false,
    };

    const created = new this.vendorUserModel(teamMember);
    let saved: any;
    try {
      saved = await created.save();
    } catch (e) {
      this.rethrowTeamMemberDuplicateKeyError(e);
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
    await this.rbacService.replaceStaffRoles(undefined, {
      vendorUserId: String(saved._id),
      roleIds: normalizedRoleIds,
    });

    this.invalidateWebsiteTeamMembersListCache();

    const id = String(saved._id);
    const sectorIds = await this.normalizeTeamMemberSectorIds(obj);
    const [enriched] = await this.attachSectorsToTeamMemberRows([
      {
        id,
        vendorUserId: id,
        name: obj.name,
        email: obj.email,
        phone: obj.phone,
        designation: obj.designation,
        image: obj.image,
        facebookUrl: obj.facebookUrl,
        twitterUrl: obj.twitterUrl,
        linkedinUrl: obj.linkedinUrl,
        displayOrder: obj.displayOrder,
        businessVertical: obj.businessVertical,
        business_vertical: obj.businessVertical,
        status: obj.status,
        type: obj.type,
        roleIds: normalizedRoleIds,
        portalAccess: normalizedRoleIds.length > 0,
        sector_ids: sectorIds,
        showOnWebsite: this.mapTeamMemberShowOnWebsite(obj.showOnWebsite),
      },
    ]);
    return enriched;
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
        'name designation email phone status displayOrder businessVertical showOnWebsite sector_ids sector_id category_ids category_id',
      )
      .lean()
      .exec();

    const rows = await Promise.all(
      members.map(async (m, index) => {
        const sector_ids = await this.normalizeTeamMemberSectorIds(m as any);
        return {
          s_no: index + 1,
          id: String(m._id),
          vendorUserId: String(m._id),
          name: m.name,
          designation: m.designation ?? '',
          email: m.email,
          mobile: m.phone,
          is_active: m.status === 1,
          displayOrder: Number((m as any).displayOrder) || 0,
          businessVertical: String((m as any).businessVertical ?? ''),
          business_vertical: String((m as any).businessVertical ?? ''),
          showOnWebsite: this.mapTeamMemberShowOnWebsite((m as any).showOnWebsite),
          sector_ids,
        };
      }),
    );
    return this.attachSectorsToTeamMemberRows(rows);
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
      const catToSector =
        await this.categoriesService.getCategorySectorsByNumericIds([catId]);
      const sectorForCat = catToSector.get(catId);
      const orClause: Record<string, unknown>[] = [
        { category_ids: catId },
        { category_id: catId },
      ];
      if (
        typeof sectorForCat === 'number' &&
        Number.isInteger(sectorForCat) &&
        sectorForCat >= 1
      ) {
        orClause.push({ sector_ids: sectorForCat });
        orClause.push({ sector_id: sectorForCat });
      }
      mongoQuery.$or = orClause;
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
        .countDocuments({ type: 'staff', status: { $ne: 2 } })
        .exec(),
      this.vendorUserModel.countDocuments(mongoQuery).exec(),
      this.vendorUserModel
        .find(mongoQuery)
        .sort({ displayOrder: 1, _id: 1 })
        .skip(skip)
        .limit(perPage)
        .select(
          'name designation email phone status displayOrder businessVertical showOnWebsite sector_ids sector_id category_ids category_id',
        )
        .lean()
        .exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
    const rows = await Promise.all(
      (members ?? []).map(async (m, index) => {
        const sector_ids = await this.normalizeTeamMemberSectorIds(m as any);
        return {
          s_no: skip + index + 1,
          id: String(m._id),
          vendorUserId: String(m._id),
          name: m.name,
          designation: m.designation ?? '',
          email: m.email,
          mobile: m.phone,
          is_active: m.status === 1,
          displayOrder: Number((m as any).displayOrder) || 0,
          businessVertical: String((m as any).businessVertical ?? ''),
          business_vertical: String((m as any).businessVertical ?? ''),
          showOnWebsite: this.mapTeamMemberShowOnWebsite((m as any).showOnWebsite),
          sector_ids,
        };
      }),
    );
    const data = await this.attachSectorsToTeamMemberRows(rows);

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
        'name designation email phone status displayOrder businessVertical showOnWebsite sector_ids sector_id category_ids category_id',
      )
      .lean()
      .exec();

    const rows = await Promise.all(
      members.map(async (m, index) => {
        const sector_ids = await this.normalizeTeamMemberSectorIds(m as any);
        return {
          s_no: index + 1,
          id: String(m._id),
          vendorUserId: String(m._id),
          name: m.name,
          designation: m.designation ?? '',
          email: m.email,
          mobile: m.phone,
          is_active: m.status === 1,
          displayOrder: Number((m as any).displayOrder) || 0,
          businessVertical: String((m as any).businessVertical ?? ''),
          business_vertical: String((m as any).businessVertical ?? ''),
          showOnWebsite: this.mapTeamMemberShowOnWebsite((m as any).showOnWebsite),
          sector_ids,
        };
      }),
    );
    return this.attachSectorsToTeamMemberRows(rows);
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
        'name designation email phone status image facebookUrl twitterUrl linkedinUrl displayOrder businessVertical showOnWebsite sector_ids sector_id category_ids category_id',
      )
      .lean()
      .exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const st = member.status ?? 0;
    const sector_ids = await this.normalizeTeamMemberSectorIds(member as any);
    const [enriched] = await this.attachSectorsToTeamMemberRows([
      {
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
        displayOrder: Number((member as any).displayOrder) || 0,
        businessVertical: String((member as any).businessVertical ?? ''),
        business_vertical: String((member as any).businessVertical ?? ''),
        showOnWebsite: this.mapTeamMemberShowOnWebsite((member as any).showOnWebsite),
        sector_ids,
      },
    ]);
    return enriched;
  }

  async createBanner(
    vendorScope: string | null,
    dto: CreateBannerDto & { imageUrl: string; videoUrl?: string },
    resolvedImageSource: 'binary_upload' | 'manual_url',
    resolvedVideoSource?: 'binary_upload',
  ) {
    const vendorObjectId = resolveBannerPersistVendorObjectId(vendorScope);
    const scopeFilter = buildBannerVendorScopeFilter(vendorScope);

    let sequenceNumber = dto.sequenceNumber;
    if (sequenceNumber === undefined) {
      const latestBanner = await this.bannerModel
        .findOne(scopeFilter)
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
          ...scopeFilter,
        })
        .lean()
        .exec();
      if (duplicateSequence) {
        throw new ConflictException(
          `Sequence number ${sequenceNumber} already exists for another banner`,
        );
      }
    }

    const videoUrl = String(dto.videoUrl ?? '').trim();
    const created = new this.bannerModel({
      vendorId: vendorObjectId,
      banner_image: this.resolveBannerImagePath(dto.imageUrl),
      imageUrl: String(dto.imageUrl ?? '').trim(),
      imageSource: resolvedImageSource,
      banner_video: videoUrl ? this.resolveBannerVideoPath(videoUrl) : '',
      videoUrl,
      ...(resolvedVideoSource ? { videoSource: resolvedVideoSource } : {}),
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
      imageSource: this.resolveBannerImageSource((o as any).imageSource),
      videoUrl: this.resolveBannerVideoForResponse(
        (o as any).videoUrl,
        (o as any).banner_video,
      ),
      videoSource: this.resolveBannerVideoSource((o as any).videoSource),
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
  async listBanners(vendorScope: string | null) {
    const scopeFilter = buildBannerVendorScopeFilter(vendorScope);

    const rows = await this.bannerModel
      .find(scopeFilter)
      .sort({ sequenceNumber: 1, createdAt: -1, _id: -1 })
      .select(
        'banner_image imageUrl imageSource banner_video videoUrl videoSource heading sequenceNumber description status',
      )
      .lean()
      .exec();

    return rows.map((b, index) => this.mapBannerRowForResponse(b as any, index));
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
      .select(
        'banner_image imageUrl imageSource banner_video videoUrl videoSource heading sequenceNumber description status',
      )
      .lean()
      .exec();

    return rows.map((b, index) => this.mapBannerRowForResponse(b as any, index));
  }

  /** Single banner for the View modal (image URL, heading, description). */
  async getBannerById(vendorScope: string | null, bannerId: string) {
    let bannerObjectId: Types.ObjectId;
    try {
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const b = await this.bannerModel
      .findOne({
        _id: bannerObjectId,
        ...buildBannerVendorScopeFilter(vendorScope),
      })
      .select(
        'banner_image imageUrl imageSource banner_video videoUrl videoSource heading sequenceNumber description status',
      )
      .lean()
      .exec();

    if (!b) {
      throw new NotFoundException('Banner not found');
    }

    return {
      ...this.mapBannerRowForResponse(b as any),
    };
  }

  /** Updates a banner that belongs to the vendor. */
  async updateBanner(
    vendorScope: string | null,
    bannerId: string,
    payload: {
      imageUrl?: string;
      imageSource?: 'binary_upload' | 'manual_url';
      videoUrl?: string;
      videoSource?: 'binary_upload';
      clearVideo?: boolean;
      title?: string;
      sequenceNumber?: number;
      description?: string;
      status?: string;
    },
  ) {
    let bannerObjectId: Types.ObjectId;
    try {
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const scopeFilter = buildBannerVendorScopeFilter(vendorScope);

    const existing = await this.bannerModel
      .findOne({
        _id: bannerObjectId,
        ...scopeFilter,
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
          ...scopeFilter,
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
      $set.imageSource = payload.imageSource;
    }
    if (payload.clearVideo) {
      $set.videoUrl = '';
      $set.banner_video = '';
      $set.videoSource = undefined;
    } else if (payload.videoUrl !== undefined) {
      const trimmedVideo = payload.videoUrl.trim();
      $set.videoUrl = trimmedVideo;
      $set.banner_video = trimmedVideo
        ? this.resolveBannerVideoPath(trimmedVideo)
        : '';
      if (payload.videoSource !== undefined) {
        $set.videoSource = payload.videoSource;
      } else if (!trimmedVideo) {
        $set.videoSource = undefined;
      }
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
      imageSource: this.resolveBannerImageSource((updated as any).imageSource),
      videoUrl: this.resolveBannerVideoForResponse(
        (updated as any).videoUrl,
        (updated as any).banner_video,
      ),
      videoSource: this.resolveBannerVideoSource((updated as any).videoSource),
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
  async deleteBanner(vendorScope: string | null, bannerId: string) {
    let bannerObjectId: Types.ObjectId;
    try {
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const res = await this.bannerModel
      .deleteOne({
        _id: bannerObjectId,
        ...buildBannerVendorScopeFilter(vendorScope),
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
    vendorScope: string | null,
    bannerId: string,
    status?: string,
  ) {
    let bannerObjectId: Types.ObjectId;
    try {
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const existing = await this.bannerModel
      .findOne({
        _id: bannerObjectId,
        ...buildBannerVendorScopeFilter(vendorScope),
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
    data: {
      id: string;
      name: string;
      designation?: string;
      email: string;
      mobile: string;
      displayOrder?: number;
      businessVertical: BusinessVertical;
      imagePath?: string;
      facebookUrl?: string;
      twitterUrl?: string;
      linkedinUrl?: string;
      roleId?: string;
      roleIds?: string[];
      sector_ids?: number[];
      showOnWebsite?: boolean;
    },
  ) {
    let memberObjectId: Types.ObjectId;
    try {
      memberObjectId = new Types.ObjectId(data.id);
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

    const emailLower = data.email.trim().toLowerCase();
    const mobileTrim = data.mobile.trim();

    await this.assertGlobalMobileAvailable(mobileTrim, memberObjectId);

    await this.assertPlatformEmailAvailable(emailLower, memberObjectId);

    const totalNonDeleted = await this.vendorUserModel
      .countDocuments({ type: 'staff', status: { $ne: 2 } })
      .exec();
    const maxAllowed = Math.max(1, totalNonDeleted);
    const desiredOrder =
      data.displayOrder === undefined ? maxAllowed : data.displayOrder;
    if (!Number.isInteger(desiredOrder) || desiredOrder < 1) {
      throw new BadRequestException('Display order must be a positive integer');
    }

    const currentOrder = Number((member as any).displayOrder) || maxAllowed;
    if (desiredOrder !== currentOrder) {
      if (desiredOrder < currentOrder) {
        await this.vendorUserModel
          .updateMany(
            {
              _id: { $ne: memberObjectId },
              type: 'staff',
              status: { $ne: 2 },
              displayOrder: { $gte: desiredOrder, $lt: currentOrder },
            },
            { $inc: { displayOrder: 1 } },
          )
          .exec();
      } else {
        await this.vendorUserModel
          .updateMany(
            {
              _id: { $ne: memberObjectId },
              type: 'staff',
              status: { $ne: 2 },
              displayOrder: { $gt: currentOrder, $lte: desiredOrder },
            },
            { $inc: { displayOrder: -1 } },
          )
          .exec();
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
    $set.businessVertical = data.businessVertical;
    if (data.showOnWebsite !== undefined) {
      $set.showOnWebsite = data.showOnWebsite;
    }

    const $unset: Record<string, string> = { team: '' };
    if (data.sector_ids !== undefined) {
      const sector_ids = this.assertTeamMemberSectorsValid(data.sector_ids);
      $set.sector_ids = sector_ids;
      if (sector_ids.length > 0) {
        $set.sector_id = sector_ids[0];
      } else {
        $unset.sector_id = '';
      }
      $set.category_ids = [];
      $unset.category_id = '';
    }

    const updatePayload: Record<string, unknown> = { $set };
    if (data.designation !== undefined && data.designation === '') {
      $unset.designation = '';
    }
    // Platform CMS team members must not carry manufacturer scope (legacy rows).
    $unset.manufacturerId = '';
    $unset.vendorId = '';
    if (Object.keys($unset).length > 0) {
      updatePayload.$unset = $unset;
    }

    let updated: VendorUserDocument | null;
    try {
      updated = await this.vendorUserModel
        .findByIdAndUpdate(memberObjectId, updatePayload, { new: true })
        .exec();
    } catch (e) {
      this.rethrowTeamMemberDuplicateKeyError(e);
    }

    if (!updated) {
      throw new NotFoundException('Team member not found');
    }

    const obj: any = updated.toObject();
    delete obj.password;
    delete obj.otp;

    const normalizedRoleIds =
      Array.isArray(data.roleIds) && data.roleIds.length > 0
        ? Array.from(new Set(data.roleIds.map((id) => String(id).trim()).filter(Boolean)))
        : data.roleId
          ? [String(data.roleId).trim()]
          : [];
    await this.rbacService.replaceStaffRoles(undefined, {
      vendorUserId: data.id,
      roleIds: normalizedRoleIds,
    });

    this.invalidateWebsiteTeamMembersListCache();

    const id = String(updated._id);
    const sector_ids = await this.normalizeTeamMemberSectorIds(obj);
    const [enriched] = await this.attachSectorsToTeamMemberRows([
      {
        id,
        vendorUserId: id,
        name: obj.name,
        email: obj.email,
        phone: obj.phone,
        designation: obj.designation,
        image: obj.image,
        facebookUrl: obj.facebookUrl,
        twitterUrl: obj.twitterUrl,
        linkedinUrl: obj.linkedinUrl,
        displayOrder: obj.displayOrder,
        businessVertical: obj.businessVertical,
        business_vertical: obj.businessVertical,
        status: obj.status,
        type: obj.type,
        roleIds: normalizedRoleIds,
        portalAccess: normalizedRoleIds.length > 0,
        sector_ids,
        showOnWebsite: this.mapTeamMemberShowOnWebsite(obj.showOnWebsite),
      },
    ]);
    return enriched;
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

    const deletedOrder = Number((member as any).displayOrder);
    if (Number.isFinite(deletedOrder) && deletedOrder > 0) {
      await this.vendorUserModel
        .updateMany(
          {
            _id: { $ne: memberObjectId },
            type: 'staff',
            status: { $ne: 2 },
            displayOrder: { $gt: deletedOrder },
          },
          { $inc: { displayOrder: -1 } },
        )
        .exec();
    }

    await this.rbacService
      .unassignStaffRole(undefined, teamMemberId)
      .catch((err) => {
        this.logger.warn(
          `Failed to clean up role mappings for deleted team member ${teamMemberId}: ${(err as Error)?.message || 'unknown'}`,
        );
      });

    const obj: any = updated.toObject();
    delete obj.password;
    delete obj.otp;

    this.invalidateWebsiteTeamMembersListCache();

    return obj;
  }

  /** Permanently deletes a newsletter subscriber by document id. */
  private async invalidateNewsletterSubscribersCache(): Promise<void> {
    const key = this.redisService.buildKey('website', 'newsletter', 'subscribers');
    await this.redisService.del(key).catch(() => undefined);
  }

  private formatNewsletterSubscriberRow(
    row: Record<string, unknown>,
    serialNo: number,
  ) {
    const subscribedFor =
      Array.isArray(row.subscribedFor) && row.subscribedFor.length > 0
        ? (row.subscribedFor as string[]).join(', ')
        : 'Newsletter';
    const createdRaw = row.createdAt;
    const createdAt =
      createdRaw instanceof Date
        ? createdRaw.toISOString().slice(0, 10)
        : createdRaw
          ? new Date(String(createdRaw)).toISOString().slice(0, 10)
          : '';
    const isActive = Number(row.status) === 1;
    return {
      id: row._id ? String(row._id) : '',
      s_no: serialNo,
      email: String(row.email ?? ''),
      subscribedFor,
      subscribeFor: subscribedFor,
      createdAt,
      createdDate: createdAt,
      status: isActive ? 'active' : 'inactive',
      is_active: isActive,
    };
  }

  /** Admin subscribers list — always reads MongoDB (no stale Redis empty cache). */
  async listNewsletterSubscribers() {
    const rows = await this.newsletterSubscriberModel
      .find(
        {},
        {
          email: 1,
          subscribedFor: 1,
          status: 1,
          createdAt: 1,
        },
      )
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    return (rows ?? []).map((row, idx) =>
      this.formatNewsletterSubscriberRow(row as Record<string, unknown>, idx + 1),
    );
  }

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

      await this.invalidateNewsletterSubscribersCache();
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

    await this.invalidateNewsletterSubscribersCache();
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

    await this.invalidateNewsletterSubscribersCache();

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
      .find({
        $or: [
          { inquiryType: 'contact' },
          { inquiryType: { $exists: false } },
          { inquiryType: null },
          { inquiryType: '' },
        ],
      })
      .select('name email phoneNumber message subject createdAt inquiryType')
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    return (rows ?? []).map((r, idx) => ({
      s_no: idx + 1,
      id: String(r._id),
      name: String(r.name ?? ''),
      email: String(r.email ?? ''),
      phoneNo: String((r as any).phoneNumber ?? ''),
      message:
        typeof (r as any).message === 'string'
          ? String((r as any).message).trim()
          : '',
      subject: String((r as any).subject ?? ''),
      createdAt: (r as any).createdAt ?? null,
      inquiryType: 'contact',
    }));
  }

  private collectValidObjectIds(values: Iterable<string>): Types.ObjectId[] {
    const out: Types.ObjectId[] = [];
    const seen = new Set<string>();
    for (const raw of values) {
      const id = String(raw ?? '').trim();
      if (!id || seen.has(id) || !Types.ObjectId.isValid(id)) {
        continue;
      }
      seen.add(id);
      out.push(new Types.ObjectId(id));
    }
    return out;
  }

  private mapProductInquiryRow(
    r: Record<string, unknown>,
    idx: number,
    lookups: {
      manufacturerById: Map<string, { manufacturerName?: string; gpInternalId?: string }>;
      categoryById: Map<string, { category_name?: string; category_id?: number }>;
      productById: Map<
        string,
        {
          productName?: string;
          urnNo?: string;
          eoiNo?: string;
          categoryId?: Types.ObjectId;
          manufacturerId?: Types.ObjectId;
        }
      >;
    },
  ) {
    const manufacturerId = String(r.manufacturerId ?? '').trim();
    const categoryId = String(r.categoryId ?? '').trim();
    const productId = String(r.productId ?? '').trim();
    const product = productId ? lookups.productById.get(productId) : undefined;

    const resolvedManufacturerId =
      manufacturerId ||
      (product?.manufacturerId ? String(product.manufacturerId) : '');
    const resolvedCategoryId =
      categoryId || (product?.categoryId ? String(product.categoryId) : '');

    const manufacturer = resolvedManufacturerId
      ? lookups.manufacturerById.get(resolvedManufacturerId)
      : undefined;
    const category = resolvedCategoryId
      ? lookups.categoryById.get(resolvedCategoryId)
      : undefined;

    const storedUrn = String(r.urnNumber ?? '').trim();
    const urnNumber = storedUrn || String(product?.urnNo ?? '').trim();

    return {
      s_no: typeof r.s_no === 'number' ? r.s_no : idx + 1,
      id: String(r.id ?? r._id ?? ''),
      name: String(r.name ?? ''),
      email: String(r.email ?? ''),
      phoneNo: String(r.phoneNo ?? r.phoneNumber ?? ''),
      message:
        typeof r.message === 'string' ? String(r.message).trim() : '',
      designation: String(r.designation ?? ''),
      organisation: String(r.organisation ?? ''),
      manufacturerId: resolvedManufacturerId,
      manufacturerName: String(manufacturer?.manufacturerName ?? '').trim(),
      gpInternalId: String(manufacturer?.gpInternalId ?? '').trim() || undefined,
      productId,
      productName: String(product?.productName ?? '').trim(),
      categoryId: resolvedCategoryId,
      categoryName: String(category?.category_name ?? '').trim(),
      category_id:
        category?.category_id !== undefined && category?.category_id !== null
          ? Number(category.category_id)
          : undefined,
      urnNumber,
      urnNo: urnNumber,
      eoiNo: String(product?.eoiNo ?? '').trim(),
      createdAt: r.createdAt ?? null,
      inquiryType: 'product' as const,
    };
  }

  private async enrichProductInquiries(
    rows: Array<Record<string, unknown>>,
  ): Promise<Array<Record<string, unknown>>> {
    if (!rows.length) {
      return [];
    }

    const manufacturerIdSet = new Set<string>();
    const categoryIdSet = new Set<string>();
    const productIdSet = new Set<string>();

    for (const r of rows) {
      const manufacturerId = String(r.manufacturerId ?? '').trim();
      const categoryId = String(r.categoryId ?? '').trim();
      const productId = String(r.productId ?? '').trim();
      if (manufacturerId) manufacturerIdSet.add(manufacturerId);
      if (categoryId) categoryIdSet.add(categoryId);
      if (productId) productIdSet.add(productId);
    }

    const productObjectIds = this.collectValidObjectIds(productIdSet);
    const products = productObjectIds.length
      ? await this.productModel
          .find({ _id: { $in: productObjectIds } })
          .select('_id productName urnNo eoiNo categoryId manufacturerId')
          .lean()
          .exec()
      : [];

    for (const product of products) {
      const manufacturerId = String(product.manufacturerId ?? '').trim();
      const categoryId = String(product.categoryId ?? '').trim();
      if (manufacturerId) manufacturerIdSet.add(manufacturerId);
      if (categoryId) categoryIdSet.add(categoryId);
    }

    const manufacturerObjectIds = this.collectValidObjectIds(manufacturerIdSet);
    const categoryObjectIds = this.collectValidObjectIds(categoryIdSet);

    const [manufacturers, categories] = await Promise.all([
      manufacturerObjectIds.length
        ? this.manufacturerModel
            .find({ _id: { $in: manufacturerObjectIds } })
            .select('_id manufacturerName gpInternalId')
            .lean()
            .exec()
        : Promise.resolve([]),
      categoryObjectIds.length
        ? this.categoryModel
            .find({ _id: { $in: categoryObjectIds } })
            .select('_id category_name category_id')
            .lean()
            .exec()
        : Promise.resolve([]),
    ]);

    const manufacturerById = new Map(
      manufacturers.map((m) => [String(m._id), m]),
    );
    const categoryById = new Map(categories.map((c) => [String(c._id), c]));
    const productById = new Map(products.map((p) => [String(p._id), p]));

    return rows.map((r, idx) =>
      this.mapProductInquiryRow(r, idx, {
        manufacturerById,
        categoryById,
        productById,
      }),
    );
  }

  async listProductInquiries() {
    const rows = await this.contactMessageModel
      .find({ inquiryType: 'product' })
      .select(
        'name email phoneNumber message designation organisation manufacturerId productId categoryId urnNumber createdAt',
      )
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    return this.enrichProductInquiries(
      (rows ?? []).map((r) => ({
        ...r,
        id: String(r._id),
        phoneNo: String((r as any).phoneNumber ?? ''),
      })) as Array<Record<string, unknown>>,
    );
  }

  /** Single product inquiry for admin view modal. */
  async getProductInquiryById(id: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid inquiry id');
    }

    const msg = await this.contactMessageModel
      .findOne({ _id: objectId, inquiryType: 'product' })
      .select(
        'name email phoneNumber message designation organisation manufacturerId productId categoryId urnNumber createdAt',
      )
      .lean()
      .exec();

    if (!msg) {
      throw new NotFoundException('Product inquiry not found');
    }

    const [enriched] = await this.enrichProductInquiries([
      {
        ...msg,
        id: String(msg._id),
        phoneNo: String((msg as any).phoneNumber ?? ''),
      } as Record<string, unknown>,
    ]);

    return {
      ...enriched,
      phone: enriched?.phoneNo ?? '',
    };
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
      .select('name email phoneNumber message subject createdAt inquiryType')
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
      phoneNo: String((msg as any).phoneNumber ?? ''),
      subject: String((msg as any).subject ?? ''),
      message: String((msg as any).message ?? ''),
      createdAt: (msg as any).createdAt ?? null,
      inquiryType: String((msg as any).inquiryType ?? 'contact'),
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
      return await this.manufacturerIdGeneration.withTransaction(
        async (session) => {
          const existing = await this.manufacturerModel
            .findById(manufacturerId)
            .session(session)
            .exec();
          if (!existing) {
            throw new NotFoundException('Manufacturer not found');
          }

          const isUnverified = (existing.manufacturerStatus ?? 0) !== 1;
          const updateData: Record<string, unknown> = {
            manufacturerName: updateDto.manufacturerName,
            updatedAt: new Date(),
          };
          if (imagePath) {
            updateData.manufacturerImage = imagePath;
          }

          if (isUnverified) {
            const auto =
              await this.manufacturerIdGeneration.resolveAutoIdentifiersForUnverified(
                updateDto.manufacturerName,
                existing._id,
                {
                  manufacturerName: existing.manufacturerName,
                  manufacturerInitial: existing.manufacturerInitial,
                  gpInternalId: existing.gpInternalId,
                },
                session,
              );
            updateData.manufacturerInitial = auto.manufacturerInitial;
            updateData.gpInternalId = auto.gpInternalId;
          } else {
            const rawGp =
              updateDto.gpInternalId !== undefined
                ? String(updateDto.gpInternalId).trim()
                : '';
            const rawIni =
              updateDto.manufacturerInitial !== undefined
                ? String(updateDto.manufacturerInitial).trim()
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

          const manufacturer = await this.manufacturerModel
            .findByIdAndUpdate(manufacturerId, updateData, {
              new: true,
              session,
            })
            .exec();
          if (!manufacturer) {
            throw new NotFoundException('Manufacturer not found');
          }
          return manufacturer;
        },
      );
    } catch (error: any) {
      if (error?.code === 11000) {
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

  /**
   * Platform-wide metrics for the admin dashboard home screen.
   * Honors global filters (period, category, productStatus, region, etc.).
   */
  async getDashboardMetrics(
    filters: ResolvedDashboardFilters = { granularity: 'monthly' },
  ): Promise<AdminDashboardMetrics> {
    const now = new Date();
    const manufacturerMatch = buildManufacturerSnapshotMatch(filters);
    const productMatch = buildProductSnapshotMatch(filters, now);

    const manufacturerPipeline: any[] = [];
    if (Object.keys(manufacturerMatch).length > 0) {
      manufacturerPipeline.push({ $match: manufacturerMatch });
    }
    manufacturerPipeline.push({
      $facet: {
        total: [{ $count: 'count' }],
        byStatus: [
          { $group: { _id: '$manufacturerStatus', count: { $sum: 1 } } },
        ],
        verifiedActive: [
          { $match: { manufacturerStatus: 1, vendor_status: 1 } },
          { $count: 'count' },
        ],
        verifiedInactive: [
          {
            $match: {
              manufacturerStatus: 1,
              vendor_status: { $ne: 1 },
            },
          },
          { $count: 'count' },
        ],
      },
    });

    const productPipeline: any[] = [];
    if (Object.keys(productMatch).length > 0) {
      productPipeline.push({ $match: productMatch });
    }
    productPipeline.push({
      $facet: {
        total: [{ $count: 'count' }],
        distinctUrns: [{ $group: { _id: '$urnNo' } }, { $count: 'count' }],
        byProductStatus: [
          { $group: { _id: '$productStatus', count: { $sum: 1 } } },
        ],
        byUrnStatus: [
          { $group: { _id: '$urnStatus', count: { $sum: 1 } } },
        ],
        expired: [
          { $match: matchExpiredProducts(now) },
          { $count: 'count' },
        ],
      },
    });

    const [manufacturerFacet, productFacet, charts] = await Promise.all([
      this.manufacturerModel
        .aggregate<{
          total: { count: number }[];
          byStatus: { _id: number; count: number }[];
          verifiedActive: { count: number }[];
          verifiedInactive: { count: number }[];
        }>(manufacturerPipeline)
        .exec(),
      this.productModel
        .aggregate<{
          total: { count: number }[];
          distinctUrns: { count: number }[];
          byProductStatus: { _id: number; count: number }[];
          byUrnStatus: { _id: number; count: number }[];
          expired: { count: number }[];
        }>(productPipeline)
        .exec(),
      this.buildDashboardCharts(filters),
    ]);

    const mfgPayload = manufacturerFacet[0] ?? {
      total: [],
      byStatus: [],
      verifiedActive: [],
      verifiedInactive: [],
    };
    const productPayload = productFacet[0] ?? {
      total: [],
      distinctUrns: [],
      byProductStatus: [],
      byUrnStatus: [],
      expired: [],
    };

    const manufacturers = {
      verified: 0,
      unverified: 0,
      inactivePending: 0,
      verifiedActive: mfgPayload.verifiedActive?.[0]?.count ?? 0,
      verifiedInactive: mfgPayload.verifiedInactive?.[0]?.count ?? 0,
    };
    for (const row of mfgPayload.byStatus ?? []) {
      const key = manufacturerStatusKey(Number(row._id ?? 0));
      manufacturers[key] += row.count ?? 0;
    }

    const productStatusCounts: Record<number, number> = {};
    for (const row of productPayload.byProductStatus ?? []) {
      if (row?._id !== undefined && row?._id !== null) {
        productStatusCounts[Number(row._id)] = row.count ?? 0;
      }
    }

    const expiredCount = productPayload.expired?.[0]?.count ?? 0;
    const certifiedActive = productStatusCounts[2] ?? 0;

    const byProductStatus = {
      pending: productStatusCounts[0] ?? 0,
      approved: productStatusCounts[1] ?? 0,
      certified: Math.max(0, certifiedActive - expiredCount),
      rejected: productStatusCounts[3] ?? 0,
      expired: expiredCount,
    };

    const urnCountMap = new Map<number, number>();
    for (const row of productPayload.byUrnStatus ?? []) {
      if (row?._id !== undefined && row?._id !== null) {
        urnCountMap.set(Number(row._id), row.count ?? 0);
      }
    }

    const byUrnStatus = Object.keys(URN_STATUS_LABELS)
      .map((k) => Number(k))
      .sort((a, b) => a - b)
      .map((status) => ({
        status,
        label: urnStatusLabel(status),
        count: urnCountMap.get(status) ?? 0,
      }));

    const proposalPending = urnCountMap.get(0) ?? 0;
    const certificatePublished = urnCountMap.get(11) ?? 0;
    let inCertificationPipeline = 0;
    for (let s = 1; s <= 10; s += 1) {
      inCertificationPipeline += urnCountMap.get(s) ?? 0;
    }

    return {
      totalManufacturers: mfgPayload.total?.[0]?.count ?? 0,
      manufacturers,
      productSubmissions: {
        total: productPayload.total?.[0]?.count ?? 0,
        totalUrns: productPayload.distinctUrns?.[0]?.count ?? 0,
      },
      certificationProgress: {
        byProductStatus,
        byUrnStatus,
        summary: {
          certifiedProducts: byProductStatus.certified,
          inCertificationPipeline,
          proposalPending,
          certificatePublished,
        },
      },
      charts,
    };
  }

  /**
   * Dashboard metrics filtered by staff role grants. Platform admins see all sections.
   */
  async getDashboardMetricsForUser(input: {
    role?: string;
    type?: string;
    manufacturerId: string;
    userId: string;
    filters: ResolvedDashboardFilters;
    query: DashboardMetricsQueryDto;
  }): Promise<AdminDashboardMetricsResponse> {
    const full = await this.getDashboardMetrics(input.filters);
    const appliedFilters = this.buildAppliedFiltersPayload(
      input.query,
      input.filters,
    );

    if (isPlatformAdminUser({ role: input.role, type: input.type })) {
      return {
        ...full,
        visibleSections: {
          manufacturers: true,
          products: true,
          certification: true,
        },
        appliedFilters,
      };
    }

    const grants = await this.rbacService.getStaffPermissions(
      undefined,
      input.userId,
    );
    return filterDashboardMetricsByPermissions(full, grants, appliedFilters);
  }

  async getCertifiedVsUncertifiedProductsForUser(input: {
    role?: string;
    type?: string;
    manufacturerId: string;
    userId: string;
    filters: ResolvedDashboardFilters;
    query: DashboardMetricsQueryDto;
  }) {
    const metrics = await this.getDashboardMetricsForUser(input);
    const chartBlock = metrics.charts?.certifiedVsUncertified;
    if (chartBlock) {
      return {
        appliedFilters: metrics.appliedFilters,
        totals: chartBlock.totals,
        chart: chartBlock.chart,
      };
    }
    const totalProducts = metrics.productSubmissions?.total ?? 0;
    const certifiedProducts =
      metrics.certificationProgress?.summary?.certifiedProducts ?? 0;
    const uncertifiedProducts = Math.max(0, totalProducts - certifiedProducts);

    return {
      totals: {
        totalProducts,
        certifiedProducts,
        uncertifiedProducts,
      },
      chart: [
        { key: 'certified', label: 'Certified', count: certifiedProducts },
        { key: 'uncertified', label: 'Uncertified', count: uncertifiedProducts },
      ],
    };
  }

  async getVerifiedVsUnverifiedManufacturersForUser(input: {
    role?: string;
    type?: string;
    manufacturerId: string;
    userId: string;
    filters: ResolvedDashboardFilters;
    query: DashboardMetricsQueryDto;
  }) {
    const metrics = await this.getDashboardMetricsForUser(input);
    const manufacturers = metrics.manufacturers ?? {
      verified: 0,
      unverified: 0,
      inactivePending: 0,
      verifiedActive: 0,
      verifiedInactive: 0,
    };
    const verified = manufacturers.verified ?? 0;
    const unverified =
      (manufacturers.unverified ?? 0) + (manufacturers.inactivePending ?? 0);

    return {
      totals: {
        totalManufacturers: metrics.totalManufacturers ?? 0,
        verifiedManufacturers: verified,
        unverifiedManufacturers: unverified,
        verifiedActive: manufacturers.verifiedActive ?? 0,
        verifiedInactive: manufacturers.verifiedInactive ?? 0,
      },
      chart: [
        { key: 'verified', label: 'Verified', count: verified },
        { key: 'unverified', label: 'Unverified', count: unverified },
      ],
    };
  }

  async getExpiredProductsImpactForUser(input: {
    role?: string;
    type?: string;
    manufacturerId: string;
    userId: string;
    filters: ResolvedDashboardFilters;
    query: DashboardMetricsQueryDto;
  }) {
    const metrics = await this.getDashboardMetricsForUser(input);
    const byProductStatus = metrics.certificationProgress?.byProductStatus;
    const expiredProducts = byProductStatus?.expired ?? 0;
    const activeCertifiedProducts = byProductStatus?.certified ?? 0;
    const certifiedProductsTotal = activeCertifiedProducts + expiredProducts;
    const expiredImpactPercent =
      certifiedProductsTotal > 0
        ? Number(((expiredProducts / certifiedProductsTotal) * 100).toFixed(2))
        : 0;

    return {
      totals: {
        expiredProducts,
        activeCertifiedProducts,
        certifiedProductsTotal,
        expiredImpactPercent,
      },
      chart: [
        { key: 'activeCertified', label: 'Active Certified', count: activeCertifiedProducts },
        { key: 'expired', label: 'Expired', count: expiredProducts },
      ],
    };
  }

  async getRejectedProductsAnalyticsForUser(input: {
    role?: string;
    type?: string;
    manufacturerId: string;
    userId: string;
    filters: ResolvedDashboardFilters;
    query: DashboardMetricsQueryDto;
  }) {
    const metrics = await this.getDashboardMetricsForUser(input);
    const totalProducts = metrics.productSubmissions?.total ?? 0;
    const rejectedProducts =
      metrics.certificationProgress?.byProductStatus?.rejected ?? 0;
    const nonRejectedProducts = Math.max(0, totalProducts - rejectedProducts);
    const rejectionRatePercent =
      totalProducts > 0
        ? Number(((rejectedProducts / totalProducts) * 100).toFixed(2))
        : 0;

    return {
      totals: {
        totalProducts,
        rejectedProducts,
        nonRejectedProducts,
        rejectionRatePercent,
      },
      chart: [
        { key: 'rejected', label: 'Rejected', count: rejectedProducts },
        { key: 'nonRejected', label: 'Non-Rejected', count: nonRejectedProducts },
      ],
    };
  }

  private revenueFiltersNeedProductScope(
    filters: ResolvedDashboardFilters,
  ): boolean {
    return !!(
      filters.categoryObjectId ||
      filters.manufacturerIdsForRegion?.length ||
      filters.productStatusFilter
    );
  }

  private async resolveRevenueScopeUrns(
    filters: ResolvedDashboardFilters,
    now: Date,
  ): Promise<string[]> {
    const productMatch = buildProductSnapshotMatch(filters, now);
    const pipeline: any[] = [];
    if (Object.keys(productMatch).length > 0) {
      pipeline.push({ $match: productMatch });
    }
    pipeline.push({ $group: { _id: '$urnNo' } });
    const rows = await this.productModel
      .aggregate<{ _id: string }>(pipeline)
      .exec();
    return rows
      .map((r) => String(r._id ?? '').trim())
      .filter((urn) => urn.length > 0);
  }

  /**
   * Revenue from paid/approved payments (`paymentStatus` 1–2), summed on `quoteTotal`.
   * Date filters use cheque date, else created/updated date.
   */
  async getRevenueAnalytics(
    filters: ResolvedDashboardFilters,
    query: DashboardMetricsQueryDto,
  ): Promise<AdminDashboardRevenueAnalytics> {
    const scopedByProducts = this.revenueFiltersNeedProductScope(filters);
    const scopeUrns = scopedByProducts
      ? await this.resolveRevenueScopeUrns(filters, new Date())
      : undefined;
    const appliedFilters = this.buildAppliedFiltersPayload(query, filters);
    return this.revenueDashboardService.getRevenueAnalytics(
      filters,
      query,
      appliedFilters,
      scopeUrns,
      scopedByProducts,
    );
  }

  async getProductStatusBreakdownForUser(input: {
    filters: ResolvedDashboardFilters;
    query: DashboardMetricsQueryDto;
  }) {
    const widgets = await this.dashboardStatsService.getProductWidgetStats(
      input.filters,
    );
    return {
      appliedFilters: this.buildAppliedFiltersPayload(input.query, input.filters),
      ...widgets.statusBreakdown,
      statusCounts: widgets.statusCounts,
    };
  }

  async getUrnPipelineForUser(input: {
    filters: ResolvedDashboardFilters;
    query: DashboardMetricsQueryDto;
  }) {
    const widgets = await this.dashboardStatsService.getProductWidgetStats(
      input.filters,
    );
    return {
      appliedFilters: this.buildAppliedFiltersPayload(input.query, input.filters),
      steps: widgets.urnPipeline,
      totals: {
        inPipeline: widgets.urnPipeline
          .filter((s) => s.key !== 'certified')
          .reduce((sum, s) => sum + s.count, 0),
        certified:
          widgets.urnPipeline.find((s) => s.key === 'certified')?.count ?? 0,
      },
    };
  }

  async getRevenueAnalyticsForUser(input: {
    filters: ResolvedDashboardFilters;
    query: DashboardMetricsQueryDto;
  }): Promise<AdminDashboardRevenueAnalytics> {
    return this.getRevenueAnalytics(input.filters, input.query);
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

      if (updatedVendor && newStatus === 0) {
        await this.authService.invalidateSessionsForManufacturer(id);
      }

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
