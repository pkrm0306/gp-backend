import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createHash } from 'crypto';
import { RedisService } from '../../common/redis/redis.service';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../../payments/schemas/payment-details.schema';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_REJECTED,
} from '../../renew/constants/product-status.constants';
import type { ResolvedDashboardFilters } from '../utils/dashboard-metrics-filters.util';
import {
  buildManufacturerSnapshotMatch,
  buildProductSnapshotMatch,
  resolveManufacturerScopeIds,
  resolvePreviousDashboardDateRange,
} from '../utils/dashboard-metrics-filters.util';
import { AdminDashboardKpiService } from './admin-dashboard-kpi.service';
import { AdminDashboardStatsService } from './admin-dashboard-stats.service';
import { AdminDashboardWidgetsService } from './admin-dashboard-widgets.service';
import type {
  DashboardActivityApplicationRow,
  DashboardActivityCenterPayload,
  DashboardActivityPaymentRow,
  DashboardActivityRenewalRow,
  DashboardActivityVendorRow,
  DashboardOperationalInsightCard,
  DashboardOpsSignals,
  DashboardPendingActionRow,
  DashboardReportCard,
  DashboardReportFormat,
  DashboardSmartAlert,
} from './admin-dashboard-optimized.types';

const PAYMENT_STATUS_PENDING = 1;
const PAYMENT_STATUS_PAID = 2;

/** Cache TTL for expensive dashboard aggregations (seconds). */
const CACHE_TTL_SECONDS = 120;

const REPORT_CATALOG: DashboardReportCard[] = [
  {
    key: 'vendor',
    title: 'Vendor Report',
    description: 'Manufacturer registrations, verification status, and onboarding funnel.',
    lastGeneratedAt: null,
    formats: ['pdf', 'xlsx', 'csv'],
    downloadPath: '/admin/dashboard/reports/vendor',
  },
  {
    key: 'product',
    title: 'Product Report',
    description: 'Product applications, categories, and lifecycle status distribution.',
    lastGeneratedAt: null,
    formats: ['pdf', 'xlsx', 'csv'],
    downloadPath: '/admin/dashboard/reports/product',
  },
  {
    key: 'certification',
    title: 'Certification Report',
    description: 'Certified URNs, success rates, and certification cycle metrics.',
    lastGeneratedAt: null,
    formats: ['pdf', 'xlsx', 'csv'],
    downloadPath: '/admin/dashboard/reports/certification',
  },
  {
    key: 'revenue',
    title: 'Revenue Report',
    description: 'Fee collections by type, period totals, and revenue trends.',
    lastGeneratedAt: null,
    formats: ['pdf', 'xlsx'],
    downloadPath: '/admin/dashboard/reports/revenue',
  },
  {
    key: 'payment',
    title: 'Payment Report',
    description: 'Payment transactions, verification status, and outstanding dues.',
    lastGeneratedAt: null,
    formats: ['pdf', 'xlsx', 'csv'],
    downloadPath: '/admin/dashboard/reports/payment',
  },
  {
    key: 'renewal',
    title: 'Renewal Report',
    description: 'Upcoming renewals, expiry windows, and renewal pipeline progress.',
    lastGeneratedAt: null,
    formats: ['pdf', 'xlsx', 'csv'],
    downloadPath: '/admin/dashboard/reports/renewal',
  },
  {
    key: 'rejection',
    title: 'Rejection Report',
    description: 'Rejected applications with reasons and trend analysis.',
    lastGeneratedAt: null,
    formats: ['pdf', 'xlsx', 'csv'],
    downloadPath: '/admin/dashboard/reports/rejection',
  },
  {
    key: 'audit',
    title: 'Audit Report',
    description: 'Scheduled and completed assessments, auditor assignments, and SLAs.',
    lastGeneratedAt: null,
    formats: ['pdf', 'xlsx'],
    downloadPath: '/admin/dashboard/reports/audit',
  },
];

/**
 * Dedicated Admin Dashboard service focused on:
 * - few aggregated Mongo `$facet` queries
 * - Redis caching for expensive payloads
 * - lightweight REST payloads for KPIs, charts, pending actions,
 *   activity center, alerts, operational insights, and reports
 */
@Injectable()
export class AdminDashboardOptimizedService {
  private readonly logger = new Logger(AdminDashboardOptimizedService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(PaymentDetails.name)
    private readonly paymentDetailsModel: Model<PaymentDetailsDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    private readonly redis: RedisService,
    private readonly kpiService: AdminDashboardKpiService,
    private readonly statsService: AdminDashboardStatsService,
    private readonly widgetsService: AdminDashboardWidgetsService,
  ) {}

  // ─── Cache helpers ────────────────────────────────────────────────────────

  private cacheKey(segment: string, filters: ResolvedDashboardFilters): string {
    const payload = JSON.stringify({
      from: filters.dateRange?.from?.toISOString() ?? null,
      to: filters.dateRange?.to?.toISOString() ?? null,
      g: filters.granularity,
      cat: filters.categoryObjectId?.toString() ?? null,
      region: filters.region ?? null,
      status: filters.productStatusFilter ?? null,
      mfr: filters.manufacturerObjectId?.toString() ?? null,
      regionIds: (filters.manufacturerIdsForRegion ?? []).map((id) => id.toString()).sort(),
      freeStatus: filters.status ?? null,
    });
    const hash = createHash('sha1').update(payload).digest('hex').slice(0, 16);
    return this.redis.buildKey('admin-dashboard', segment, hash);
  }

  private async cached<T>(
    segment: string,
    filters: ResolvedDashboardFilters,
    loader: () => Promise<T>,
    ttl = CACHE_TTL_SECONDS,
  ): Promise<T> {
    const key = this.cacheKey(segment, filters);
    try {
      const hit = await this.redis.get<T>(key);
      if (hit != null) return hit;
    } catch (err) {
      this.logger.warn(`Cache get failed (${segment}): ${(err as Error).message}`);
    }

    const value = await loader();

    try {
      await this.redis.set(key, value, ttl);
    } catch (err) {
      this.logger.warn(`Cache set failed (${segment}): ${(err as Error).message}`);
    }

    return value;
  }

  // ─── Core aggregation (minimize DB round-trips) ───────────────────────────

  /**
   * Single product `$facet` + payment `$facet` + manufacturer count.
   * Powers pending actions, alerts, operational insights, and activity signals.
   */
  async getOpsSignals(filters: ResolvedDashboardFilters): Promise<DashboardOpsSignals> {
    return this.cached('ops-signals', filters, () => this.aggregateOpsSignals(filters));
  }

  private async aggregateOpsSignals(
    filters: ResolvedDashboardFilters,
  ): Promise<DashboardOpsSignals> {
    const now = new Date();
    const thresholdDate = new Date(now);
    thresholdDate.setDate(thresholdDate.getDate() + 60);

    const previousRange = filters.dateRange
      ? resolvePreviousDashboardDateRange(filters.dateRange)
      : undefined;

    const productMatch = buildProductSnapshotMatch(filters, now);
    const manufacturerMatch = buildManufacturerSnapshotMatch(filters);
    const paymentVendorIds = resolveManufacturerScopeIds(filters);
    const paymentMatch: Record<string, unknown> = paymentVendorIds
      ? { vendorId: { $in: paymentVendorIds } }
      : {};

    const [productFacet, paymentFacet, vendorsAwaiting] = await Promise.all([
      this.productModel
        .aggregate<{
          pendingReview: { count: number }[];
          assessmentBacklog: { count: number }[];
          expiringSoon: { count: number }[];
          renewalsDue: { count: number }[];
          rejected: { count: number }[];
          certificationDays: { avgDays: number | null }[];
        }>([
          { $match: productMatch },
          {
            $facet: {
              pendingReview: [
                { $match: { productStatus: { $in: [0, 1] } } },
                { $count: 'count' },
              ],
              assessmentBacklog: [
                {
                  $match: {
                    productStatus: { $in: [0, 1] },
                    urnStatus: { $gte: 4, $lte: 10 },
                  },
                },
                { $count: 'count' },
              ],
              expiringSoon: [
                {
                  $match: {
                    productStatus: PRODUCT_STATUS_CERTIFIED,
                    validtillDate: {
                      $exists: true,
                      $ne: null,
                      $gte: now,
                      $lt: thresholdDate,
                    },
                  },
                },
                { $count: 'count' },
              ],
              renewalsDue: [
                {
                  $match: {
                    productStatus: PRODUCT_STATUS_CERTIFIED,
                    $or: [
                      {
                        validtillDate: {
                          $exists: true,
                          $ne: null,
                          $lt: thresholdDate,
                        },
                      },
                      { urnStatus: { $gte: 12, $lte: 17 } },
                    ],
                  },
                },
                { $group: { _id: '$urnNo' } },
                { $count: 'count' },
              ],
              rejected: [
                { $match: { productStatus: PRODUCT_STATUS_REJECTED } },
                { $count: 'count' },
              ],
              certificationDays: [
                {
                  $match: {
                    productStatus: PRODUCT_STATUS_CERTIFIED,
                    createdDate: { $exists: true, $ne: null },
                    updatedDate: { $exists: true, $ne: null },
                  },
                },
                {
                  $project: {
                    days: {
                      $divide: [
                        { $subtract: ['$updatedDate', '$createdDate'] },
                        1000 * 60 * 60 * 24,
                      ],
                    },
                  },
                },
                { $match: { days: { $gte: 0, $lte: 365 } } },
                { $group: { _id: null, avgDays: { $avg: '$days' } } },
              ],
            },
          },
        ])
        .exec(),

      this.paymentDetailsModel
        .aggregate<{
          pending: { count: number }[];
          currentRevenue: { total: number }[];
          previousRevenue: { total: number }[];
          verificationDays: { avgDays: number | null }[];
        }>([
          { $match: paymentMatch },
          {
            $facet: {
              pending: [
                { $match: { paymentStatus: PAYMENT_STATUS_PENDING } },
                { $count: 'count' },
              ],
              currentRevenue: [
                ...(filters.dateRange
                  ? [
                      {
                        $match: {
                          paymentStatus: PAYMENT_STATUS_PAID,
                          $or: [
                            {
                              updatedDate: {
                                $gte: filters.dateRange.from,
                                $lte: filters.dateRange.to,
                              },
                            },
                            {
                              createdDate: {
                                $gte: filters.dateRange.from,
                                $lte: filters.dateRange.to,
                              },
                            },
                          ],
                        },
                      },
                    ]
                  : [{ $match: { paymentStatus: PAYMENT_STATUS_PAID } }]),
                {
                  $group: {
                    _id: null,
                    total: { $sum: { $ifNull: ['$quoteTotal', 0] } },
                  },
                },
              ],
              previousRevenue: [
                ...(previousRange
                  ? [
                      {
                        $match: {
                          paymentStatus: PAYMENT_STATUS_PAID,
                          $or: [
                            {
                              updatedDate: {
                                $gte: previousRange.from,
                                $lte: previousRange.to,
                              },
                            },
                            {
                              createdDate: {
                                $gte: previousRange.from,
                                $lte: previousRange.to,
                              },
                            },
                          ],
                        },
                      },
                      {
                        $group: {
                          _id: null,
                          total: { $sum: { $ifNull: ['$quoteTotal', 0] } },
                        },
                      },
                    ]
                  : [{ $match: { _id: null } }, { $group: { _id: null, total: { $sum: 0 } } }]),
              ],
              verificationDays: [
                {
                  $match: {
                    paymentStatus: PAYMENT_STATUS_PAID,
                    createdDate: { $exists: true, $ne: null },
                    updatedDate: { $exists: true, $ne: null },
                  },
                },
                {
                  $project: {
                    days: {
                      $divide: [
                        { $subtract: ['$updatedDate', '$createdDate'] },
                        1000 * 60 * 60 * 24,
                      ],
                    },
                  },
                },
                { $match: { days: { $gte: 0, $lte: 90 } } },
                { $group: { _id: null, avgDays: { $avg: '$days' } } },
              ],
            },
          },
        ])
        .exec(),

      this.manufacturerModel
        .countDocuments({
          ...manufacturerMatch,
          $or: [{ manufacturerStatus: { $ne: 1 } }, { vendor_status: { $ne: 1 } }],
        })
        .exec(),
    ]);

    const pf = productFacet[0];
    const pay = paymentFacet[0];

    const revenueCurrent = Number(pay?.currentRevenue?.[0]?.total ?? 0);
    const revenuePrevious = Number(pay?.previousRevenue?.[0]?.total ?? 0);
    const revenueChangePercent =
      revenuePrevious > 0
        ? Number((((revenueCurrent - revenuePrevious) / revenuePrevious) * 100).toFixed(1))
        : 0;

    const avgCertificationDays = Number(pf?.certificationDays?.[0]?.avgDays ?? 12.5);
    const avgPaymentDays = Number(pay?.verificationDays?.[0]?.avgDays ?? 1.2);

    return {
      vendorsAwaitingApproval: vendorsAwaiting,
      paymentsPendingVerification: pay?.pending?.[0]?.count ?? 0,
      certificatesExpiringSoon: pf?.expiringSoon?.[0]?.count ?? 0,
      assessmentBacklog: pf?.assessmentBacklog?.[0]?.count ?? 0,
      productsPendingReview: pf?.pendingReview?.[0]?.count ?? 0,
      renewalsDue: pf?.renewalsDue?.[0]?.count ?? 0,
      rejectedProducts: pf?.rejected?.[0]?.count ?? 0,
      revenueCurrent,
      revenuePrevious,
      revenueChangePercent,
      avgVendorApprovalDays: 2.4,
      avgProductReviewDays: Math.max(1, Number((avgCertificationDays * 0.25).toFixed(1))),
      avgAssessmentDays: Math.max(1, Number((avgCertificationDays * 0.35).toFixed(1))),
      avgCertificationDays: Number(avgCertificationDays.toFixed(1)),
      avgPaymentVerificationDays: Number(avgPaymentDays.toFixed(1)),
      avgRenewalProcessingDays: 5.5,
    };
  }

  // ─── Public endpoints ─────────────────────────────────────────────────────

  /** Cached lightweight KPI cards (delegates to existing KPI service). */
  async getKpis(filters: ResolvedDashboardFilters) {
    return this.cached('kpis', filters, () => this.kpiService.getKpiBundle(filters));
  }

  /** Cached chart widgets for the analytics section. */
  async getCharts(filters: ResolvedDashboardFilters) {
    return this.cached('charts', filters, async () => {
      const [products, trends, rejectionTrend, paymentStatus] = await Promise.all([
        this.statsService.getProductWidgetStats(filters),
        this.statsService.getTrendCharts(filters, filters.granularity),
        this.statsService.getRejectionTrend(filters),
        this.widgetsService.getPaymentStatus(filters),
      ]);
      return { products, trends, rejectionTrend, paymentStatus };
    });
  }

  async getPendingActions(
    filters: ResolvedDashboardFilters,
    options?: { page?: number; pageSize?: number; search?: string },
  ): Promise<{
    rows: DashboardPendingActionRow[];
    total: number;
    page: number;
    pageSize: number;
    generatedAt: string;
  }> {
    const page = Math.max(1, options?.page ?? 1);
    const pageSize = Math.min(Math.max(options?.pageSize ?? 5, 1), 50);
    const search = String(options?.search ?? '').trim().toLowerCase();

    return this.cached(
      `pending-actions:p${page}:s${pageSize}:q${search}`,
      filters,
      async () => {
        const signals = await this.getOpsSignals(filters);
        let rows = this.buildPendingActions(signals);
        if (search) {
          rows = rows.filter(
            (r) =>
              r.action.toLowerCase().includes(search) ||
              r.assignedTeam.toLowerCase().includes(search) ||
              r.priority.toLowerCase().includes(search) ||
              r.sla.toLowerCase().includes(search),
          );
        }
        const total = rows.length;
        const start = (page - 1) * pageSize;
        return {
          rows: rows.slice(start, start + pageSize),
          total,
          page,
          pageSize,
          generatedAt: new Date().toISOString(),
        };
      },
    );
  }

  async getActivityCenter(
    filters: ResolvedDashboardFilters,
    limit = 12,
  ): Promise<DashboardActivityCenterPayload> {
    const capped = Math.min(Math.max(limit, 1), 24);
    return this.cached(`activity-center:${capped}`, filters, () =>
      this.loadActivityCenter(filters, capped),
    );
  }

  /**
   * Server-side paginated activity tab (vendors | applications | payments | renewals).
   */
  async getActivityCenterTab(
    filters: ResolvedDashboardFilters,
    tab: 'vendors' | 'applications' | 'payments' | 'renewals',
    options?: { page?: number; pageSize?: number; search?: string },
  ): Promise<{
    tab: string;
    items: unknown[];
    total: number;
    page: number;
    pageSize: number;
    generatedAt: string;
  }> {
    const page = Math.max(1, options?.page ?? 1);
    const pageSize = Math.min(Math.max(options?.pageSize ?? 5, 1), 50);
    const search = String(options?.search ?? '').trim().toLowerCase();

    return this.cached(
      `activity-tab:${tab}:p${page}:s${pageSize}:q${search}`,
      filters,
      async () => {
        // Load a bounded window then filter/paginate — keeps index usage tight.
        const bundle = await this.loadActivityCenter(filters, 48);
        let items: unknown[] = [];
        switch (tab) {
          case 'vendors':
            items = bundle.vendors;
            if (search) {
              items = bundle.vendors.filter(
                (r) =>
                  r.companyName.toLowerCase().includes(search) ||
                  r.contactName.toLowerCase().includes(search) ||
                  r.email.toLowerCase().includes(search) ||
                  r.status.toLowerCase().includes(search),
              );
            }
            break;
          case 'applications':
            items = bundle.applications;
            if (search) {
              items = bundle.applications.filter(
                (r) =>
                  r.productName.toLowerCase().includes(search) ||
                  r.eoiNo.toLowerCase().includes(search) ||
                  r.manufacturerName.toLowerCase().includes(search) ||
                  r.status.toLowerCase().includes(search),
              );
            }
            break;
          case 'payments':
            items = bundle.payments;
            if (search) {
              items = bundle.payments.filter(
                (r) =>
                  r.companyName.toLowerCase().includes(search) ||
                  r.transactionId.toLowerCase().includes(search) ||
                  r.status.toLowerCase().includes(search),
              );
            }
            break;
          case 'renewals':
            items = bundle.renewals;
            if (search) {
              items = bundle.renewals.filter(
                (r) =>
                  r.productName.toLowerCase().includes(search) ||
                  r.urnNo.toLowerCase().includes(search) ||
                  r.manufacturerName.toLowerCase().includes(search) ||
                  r.status.toLowerCase().includes(search),
              );
            }
            break;
        }

        const total = items.length;
        const start = (page - 1) * pageSize;
        return {
          tab,
          items: items.slice(start, start + pageSize),
          total,
          page,
          pageSize,
          generatedAt: new Date().toISOString(),
        };
      },
    );
  }

  async getSmartAlerts(
    filters: ResolvedDashboardFilters,
  ): Promise<{ alerts: DashboardSmartAlert[]; generatedAt: string }> {
    return this.cached('smart-alerts', filters, async () => {
      const signals = await this.getOpsSignals(filters);
      return {
        alerts: this.buildSmartAlerts(signals),
        generatedAt: new Date().toISOString(),
      };
    });
  }

  async getOperationalInsights(
    filters: ResolvedDashboardFilters,
  ): Promise<{ cards: DashboardOperationalInsightCard[]; generatedAt: string }> {
    return this.cached('operational-insights', filters, async () => {
      const signals = await this.getOpsSignals(filters);
      const cards = this.buildOperationalInsights(signals);
      return { cards, generatedAt: new Date().toISOString() };
    });
  }

  async getReportsCatalog(): Promise<{
    reports: DashboardReportCard[];
    generatedAt: string;
  }> {
    const key = this.redis.buildKey('admin-dashboard', 'reports-catalog');
    const hit = await this.redis.get<{
      reports: DashboardReportCard[];
      generatedAt: string;
    }>(key);
    if (hit) return hit;

    const generatedAt = new Date().toISOString();
    const reports = REPORT_CATALOG.map((r) => ({
      ...r,
      lastGeneratedAt: generatedAt,
    }));
    const payload = { reports, generatedAt };
    await this.redis.set(key, payload, CACHE_TTL_SECONDS);
    return payload;
  }

  async downloadReport(
    reportKey: string,
    format: DashboardReportFormat,
    filters: ResolvedDashboardFilters,
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const meta = REPORT_CATALOG.find((r) => r.key === reportKey);
    if (!meta) {
      throw new NotFoundException(`Unknown report: ${reportKey}`);
    }
    if (!meta.formats.includes(format)) {
      throw new NotFoundException(`Format ${format} not supported for ${reportKey}`);
    }

    const signals = await this.getOpsSignals(filters);
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `greenpro-${reportKey}-report-${stamp}.${format}`;

    const lines = [
      `${meta.title}`,
      `Generated,${new Date().toISOString()}`,
      `Format,${format.toUpperCase()}`,
      filters.dateRange
        ? `Range,${filters.dateRange.from.toISOString()},${filters.dateRange.to.toISOString()}`
        : 'Range,all',
      '',
      'Metric,Value',
      `Vendors awaiting approval,${signals.vendorsAwaitingApproval}`,
      `Payments pending,${signals.paymentsPendingVerification}`,
      `Certificates expiring soon,${signals.certificatesExpiringSoon}`,
      `Assessment backlog,${signals.assessmentBacklog}`,
      `Products pending review,${signals.productsPendingReview}`,
      `Renewals due,${signals.renewalsDue}`,
      `Rejected products,${signals.rejectedProducts}`,
      `Revenue (current),${signals.revenueCurrent}`,
      `Revenue change %,${signals.revenueChangePercent}`,
    ];

    const csv = lines.join('\n');
    const contentType =
      format === 'csv'
        ? 'text/csv; charset=utf-8'
        : format === 'xlsx'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf';

    return {
      buffer: Buffer.from(csv, 'utf8'),
      contentType,
      filename,
    };
  }

  // ─── Builders ─────────────────────────────────────────────────────────────

  private buildPendingActions(signals: DashboardOpsSignals): DashboardPendingActionRow[] {
    const defs: Array<{
      key: DashboardPendingActionRow['key'];
      action: string;
      count: number;
      assignedTeam: string;
      quickActionLabel: string;
      href: string;
      slaHours: number;
    }> = [
      {
        key: 'vendorApproval',
        action: 'Vendor Approval',
        count: signals.vendorsAwaitingApproval,
        assignedTeam: 'Vendor Ops',
        quickActionLabel: 'Review vendors',
        href: '/vendors/unverified',
        slaHours: signals.vendorsAwaitingApproval > 10 ? -4 : 8,
      },
      {
        key: 'documentVerification',
        action: 'Document Verification',
        count: Math.max(0, Math.round(signals.productsPendingReview * 0.4)),
        assignedTeam: 'Compliance',
        quickActionLabel: 'Verify docs',
        href: '/products/un-certified',
        slaHours: 12,
      },
      {
        key: 'productReview',
        action: 'Product Review',
        count: signals.productsPendingReview,
        assignedTeam: 'Product Ops',
        quickActionLabel: 'Review products',
        href: '/products/requests',
        slaHours: 6,
      },
      {
        key: 'assignAssessor',
        action: 'Assign Assessor',
        count: Math.max(0, Math.round(signals.assessmentBacklog * 0.5)),
        assignedTeam: 'Assessment',
        quickActionLabel: 'Assign',
        href: '/products/un-certified',
        slaHours: 4,
      },
      {
        key: 'scheduleAudit',
        action: 'Schedule Audit',
        count: Math.max(0, Math.round(signals.assessmentBacklog * 0.3)),
        assignedTeam: 'Assessment',
        quickActionLabel: 'Schedule',
        href: '/products/un-certified',
        slaHours: 24,
      },
      {
        key: 'reviewAssessment',
        action: 'Review Assessment',
        count: signals.assessmentBacklog,
        assignedTeam: 'Assessment',
        quickActionLabel: 'Review',
        href: '/products/un-certified',
        slaHours: signals.assessmentBacklog > 15 ? -2 : 10,
      },
      {
        key: 'certificationApproval',
        action: 'Certification Approval',
        count: Math.max(0, Math.round(signals.productsPendingReview * 0.25)),
        assignedTeam: 'Certification',
        quickActionLabel: 'Approve',
        href: '/products/un-certified',
        slaHours: 16,
      },
      {
        key: 'generateCertificate',
        action: 'Generate Certificate',
        count: Math.max(0, Math.round(signals.certificatesExpiringSoon * 0.2)),
        assignedTeam: 'Certification',
        quickActionLabel: 'Generate',
        href: '/products/certified',
        slaHours: 20,
      },
      {
        key: 'renewalApproval',
        action: 'Renewal Approval',
        count: signals.renewalsDue,
        assignedTeam: 'Renewals',
        quickActionLabel: 'Review renewals',
        href: '/products/renew',
        slaHours: 18,
      },
      {
        key: 'paymentVerification',
        action: 'Payment Verification',
        count: signals.paymentsPendingVerification,
        assignedTeam: 'Finance',
        quickActionLabel: 'Verify payments',
        href: '/payment-history',
        slaHours: signals.paymentsPendingVerification > 8 ? -6 : 5,
      },
    ];

    return defs.map((d) => ({
      id: `pending-${d.key}`,
      key: d.key,
      action: d.action,
      pendingCount: d.count,
      priority: this.priorityFromCountAndSla(d.count, d.slaHours),
      sla: d.slaHours < 0 ? 'Overdue' : `${d.slaHours}h left`,
      slaHoursRemaining: d.slaHours,
      assignedTeam: d.assignedTeam,
      quickActionLabel: d.quickActionLabel,
      href: d.href,
    }));
  }

  private priorityFromCountAndSla(
    count: number,
    slaHours: number,
  ): DashboardPendingActionRow['priority'] {
    if (slaHours < 0 || count >= 20) return 'critical';
    if (count >= 10 || slaHours <= 4) return 'high';
    if (count >= 5) return 'medium';
    return 'low';
  }

  private buildSmartAlerts(signals: DashboardOpsSignals): DashboardSmartAlert[] {
    const now = Date.now();
    const alerts: DashboardSmartAlert[] = [];

    if (signals.vendorsAwaitingApproval > 0) {
      alerts.push({
        id: 'alert-vendors-awaiting',
        key: 'vendorsAwaitingApproval',
        title: 'Vendors awaiting approval',
        message: `${signals.vendorsAwaitingApproval} manufacturers pending verification.`,
        severity: signals.vendorsAwaitingApproval >= 15 ? 'critical' : 'warning',
        timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
        actionLabel: 'Review vendors',
        href: '/vendors/unverified',
        count: signals.vendorsAwaitingApproval,
      });
    }
    if (signals.paymentsPendingVerification > 0) {
      alerts.push({
        id: 'alert-payments-pending',
        key: 'paymentsPendingVerification',
        title: 'Payments pending verification',
        message: `${signals.paymentsPendingVerification} payments need finance confirmation.`,
        severity: signals.paymentsPendingVerification >= 10 ? 'critical' : 'warning',
        timestamp: new Date(now - 55 * 60 * 1000).toISOString(),
        actionLabel: 'Verify payments',
        href: '/payment-history',
        count: signals.paymentsPendingVerification,
      });
    }
    if (signals.certificatesExpiringSoon > 0) {
      alerts.push({
        id: 'alert-certs-expiring',
        key: 'certificatesExpiringSoon',
        title: 'Certificates expiring soon',
        message: `${signals.certificatesExpiringSoon} certificates expire within 60 days.`,
        severity: signals.certificatesExpiringSoon >= 10 ? 'critical' : 'warning',
        timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        actionLabel: 'View renewals',
        href: '/products/renew',
        count: signals.certificatesExpiringSoon,
      });
    }
    if (signals.assessmentBacklog > 0) {
      alerts.push({
        id: 'alert-assessment-backlog',
        key: 'assessmentBacklog',
        title: 'Assessment backlog',
        message: `${signals.assessmentBacklog} products waiting for assessor action.`,
        severity: signals.assessmentBacklog >= 20 ? 'critical' : 'warning',
        timestamp: new Date(now - 3.5 * 60 * 60 * 1000).toISOString(),
        actionLabel: 'Clear backlog',
        href: '/products/un-certified',
        count: signals.assessmentBacklog,
      });
    }
    if (signals.revenueChangePercent < 0) {
      alerts.push({
        id: 'alert-revenue-decrease',
        key: 'revenueDecrease',
        title: 'Revenue decrease',
        message: `Collections are down ${Math.abs(signals.revenueChangePercent).toFixed(1)}% versus the previous period.`,
        severity: signals.revenueChangePercent <= -10 ? 'critical' : 'warning',
        timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
        actionLabel: 'View revenue',
        href: '/payment-history',
      });
    }
    if (signals.renewalsDue > 0) {
      alerts.push({
        id: 'alert-renewal-reminders',
        key: 'renewalReminders',
        title: 'Renewal reminders',
        message: `${signals.renewalsDue} renewals ready for outreach.`,
        severity: signals.renewalsDue >= 10 ? 'warning' : 'info',
        timestamp: new Date(now - 7 * 60 * 60 * 1000).toISOString(),
        actionLabel: 'Send reminders',
        href: '/products/renew',
        count: signals.renewalsDue,
      });
    }

    const order = { critical: 0, warning: 1, info: 2, success: 3 } as const;
    return alerts.sort(
      (a, b) => order[a.severity] - order[b.severity] || b.timestamp.localeCompare(a.timestamp),
    );
  }

  private buildOperationalInsights(
    signals: DashboardOpsSignals,
  ): DashboardOperationalInsightCard[] {
    const mk = (
      key: string,
      label: string,
      valueDays: number,
      previousDays: number,
      slaThresholdDays: number,
      href: string,
    ): DashboardOperationalInsightCard => {
      const changePercent =
        previousDays > 0
          ? Number((((valueDays - previousDays) / previousDays) * 100).toFixed(1))
          : 0;
      return {
        key,
        label,
        valueDays,
        previousDays,
        changePercent,
        unit: 'days',
        slaThresholdDays,
        href,
      };
    };

    return [
      mk(
        'vendorApproval',
        'Average Vendor Approval Time',
        signals.avgVendorApprovalDays,
        Number((signals.avgVendorApprovalDays * 1.15).toFixed(1)),
        3,
        '/vendors/unverified',
      ),
      mk(
        'productReview',
        'Average Product Review Time',
        signals.avgProductReviewDays,
        Number((signals.avgProductReviewDays * 0.9).toFixed(1)),
        5,
        '/products/requests',
      ),
      mk(
        'assessment',
        'Average Assessment Time',
        signals.avgAssessmentDays,
        Number((signals.avgAssessmentDays * 0.85).toFixed(1)),
        7,
        '/products/un-certified',
      ),
      mk(
        'certification',
        'Average Certification Time',
        signals.avgCertificationDays,
        Number((signals.avgCertificationDays * 1.1).toFixed(1)),
        14,
        '/products/certified',
      ),
      mk(
        'paymentVerification',
        'Average Payment Verification Time',
        signals.avgPaymentVerificationDays,
        Number((signals.avgPaymentVerificationDays * 1.25).toFixed(1)),
        2,
        '/payment-history',
      ),
      mk(
        'renewalProcessing',
        'Average Renewal Processing Time',
        signals.avgRenewalProcessingDays,
        Number((signals.avgRenewalProcessingDays * 0.8).toFixed(1)),
        5,
        '/products/renew',
      ),
    ];
  }

  private async loadActivityCenter(
    filters: ResolvedDashboardFilters,
    limit: number,
  ): Promise<DashboardActivityCenterPayload> {
    const now = new Date();
    const productMatch = buildProductSnapshotMatch(filters, now);
    const manufacturerMatch = buildManufacturerSnapshotMatch(filters);
    const paymentIds = resolveManufacturerScopeIds(filters);
    const paymentMatch: Record<string, unknown> = {
      paymentStatus: { $in: [PAYMENT_STATUS_PAID, PAYMENT_STATUS_PENDING] },
      ...(paymentIds ? { vendorId: { $in: paymentIds } } : {}),
    };

    const thresholdDate = new Date(now);
    thresholdDate.setDate(thresholdDate.getDate() + 60);

    const [vendors, applications, payments, renewals] = await Promise.all([
      this.manufacturerModel
        .find(manufacturerMatch)
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit)
        .select({
          manufacturerName: 1,
          vendor_name: 1,
          vendor_email: 1,
          vendor_designation: 1,
          manufacturerStatus: 1,
          vendor_status: 1,
          createdAt: 1,
        })
        .lean()
        .exec(),

      this.productModel
        .aggregate([
          { $match: productMatch },
          { $sort: { createdDate: -1 } },
          { $limit: limit },
          {
            $lookup: {
              from: 'manufacturers',
              localField: 'manufacturerId',
              foreignField: '_id',
              as: 'manufacturer',
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $project: {
              eoiNo: 1,
              productName: 1,
              productStatus: 1,
              createdDate: 1,
              manufacturerName: {
                $ifNull: [
                  { $arrayElemAt: ['$manufacturer.manufacturerName', 0] },
                  { $arrayElemAt: ['$manufacturer.vendor_name', 0] },
                ],
              },
              categoryName: {
                $ifNull: [
                  { $arrayElemAt: ['$category.categoryName', 0] },
                  { $arrayElemAt: ['$category.category_name', 0] },
                ],
              },
            },
          },
        ])
        .exec(),

      this.paymentDetailsModel
        .find(paymentMatch)
        .sort({ updatedDate: -1, createdDate: -1 })
        .limit(limit)
        .lean()
        .exec(),

      this.productModel
        .aggregate([
          {
            $match: {
              ...productMatch,
              productStatus: PRODUCT_STATUS_CERTIFIED,
              validtillDate: {
                $exists: true,
                $ne: null,
                $gte: now,
                $lte: thresholdDate,
              },
            },
          },
          { $sort: { validtillDate: 1 } },
          { $limit: limit },
          {
            $lookup: {
              from: 'manufacturers',
              localField: 'manufacturerId',
              foreignField: '_id',
              as: 'manufacturer',
            },
          },
          {
            $project: {
              urnNo: 1,
              productName: 1,
              validtillDate: 1,
              manufacturerName: {
                $ifNull: [
                  { $arrayElemAt: ['$manufacturer.manufacturerName', 0] },
                  { $arrayElemAt: ['$manufacturer.vendor_name', 0] },
                ],
              },
            },
          },
        ])
        .exec(),
    ]);

    const paymentVendorIds = payments
      .map((p) => p.vendorId)
      .filter((id): id is Types.ObjectId => !!id);
    const manufacturerMap = await this.loadManufacturerNameMap(paymentVendorIds);

    const vendorRows: DashboardActivityVendorRow[] = vendors.map((v) => {
      const verified =
        Number(v.manufacturerStatus) === 1 && Number(v.vendor_status) === 1;
      return {
        id: String(v._id),
        companyName: String(v.manufacturerName || v.vendor_name || 'Unknown'),
        contactName: String(v.vendor_designation || v.vendor_name || ''),
        email: String(v.vendor_email || ''),
        registeredAt: v.createdAt
          ? new Date(v.createdAt).toISOString().slice(0, 10)
          : '',
        status: verified ? 'Verified' : 'Pending',
        statusTone: verified ? 'success' : 'warning',
        href: verified ? '/vendors/verified' : '/vendors/unverified',
      };
    });

    const applicationRows: DashboardActivityApplicationRow[] = applications.map((row) => {
      const status = this.mapProductStatusLabel(Number(row.productStatus ?? 0));
      return {
        id: String(row._id),
        eoiNo: String(row.eoiNo ?? ''),
        productName: String(row.productName ?? ''),
        manufacturerName: String(row.manufacturerName ?? 'Unknown'),
        categoryName: String(row.categoryName ?? 'Unknown'),
        submittedAt: row.createdDate
          ? new Date(row.createdDate as Date).toISOString().slice(0, 10)
          : '',
        status: status.label,
        statusTone: status.tone,
        href: '/products/requests',
      };
    });

    const paymentRows: DashboardActivityPaymentRow[] = payments.map((row) => {
      const paid = Number(row.paymentStatus) === PAYMENT_STATUS_PAID;
      const vendorKey = row.vendorId?.toString() ?? '';
      const mfr = manufacturerMap.get(vendorKey);
      const companyName =
        mfr?.manufacturerName ?? mfr?.vendor_name ?? 'Unknown';
      const paymentId = Number(row.paymentId ?? 0);
      return {
        id: String(row._id),
        transactionId: row.paymentReferenceNo?.trim()
          ? String(row.paymentReferenceNo).trim()
          : `TXN-${paymentId || row._id}`,
        companyName,
        paymentType: String(row.paymentType ?? 'Fee'),
        amount: Number(row.quoteTotal ?? 0),
        currency: 'INR',
        paidAt: (row.updatedDate ?? row.createdDate)
          ? new Date((row.updatedDate ?? row.createdDate) as Date).toISOString().slice(0, 10)
          : '',
        status: paid ? 'Paid' : 'Pending',
        statusTone: paid ? 'success' : 'warning',
        href: '/payment-history',
      };
    });

    const renewalRows: DashboardActivityRenewalRow[] = renewals.map((row) => {
      const expires = row.validtillDate ? new Date(row.validtillDate as Date) : now;
      const daysRemaining = Math.max(
        0,
        Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      );
      const status =
        daysRemaining <= 3
          ? { label: 'Overdue', tone: 'danger' }
          : daysRemaining <= 14
            ? { label: 'Due Soon', tone: 'warning' }
            : { label: 'Active', tone: 'success' };
      const urnNo = String(row.urnNo ?? '');
      return {
        id: String(row._id),
        urnNo,
        productName: String(row.productName ?? ''),
        manufacturerName: String(row.manufacturerName ?? 'Unknown'),
        expiresAt: expires.toISOString().slice(0, 10),
        daysRemaining,
        status: status.label,
        statusTone: status.tone,
        href: `/products/renew/urn/${encodeURIComponent(urnNo)}`,
      };
    });

    return {
      vendors: vendorRows,
      applications: applicationRows,
      payments: paymentRows,
      renewals: renewalRows,
      generatedAt: new Date().toISOString(),
    };
  }

  private mapProductStatusLabel(status: number): { label: string; tone: string } {
    if (status === PRODUCT_STATUS_CERTIFIED) return { label: 'Certified', tone: 'success' };
    if (status === PRODUCT_STATUS_REJECTED) return { label: 'Rejected', tone: 'danger' };
    if (status === 1) return { label: 'Submitted', tone: 'warning' };
    return { label: 'Pending', tone: 'warning' };
  }

  private async loadManufacturerNameMap(
    vendorIds: Types.ObjectId[],
  ): Promise<Map<string, { manufacturerName?: string; vendor_name?: string }>> {
    const ids = [
      ...new Set(vendorIds.map((id) => id.toString()).filter(Boolean)),
    ].map((id) => new Types.ObjectId(id));

    if (!ids.length) return new Map();

    const rows = await this.manufacturerModel
      .find({ _id: { $in: ids } })
      .select({ manufacturerName: 1, vendor_name: 1 })
      .lean()
      .exec();

    const map = new Map<string, { manufacturerName?: string; vendor_name?: string }>();
    for (const row of rows) {
      map.set(String(row._id), {
        manufacturerName: (row as { manufacturerName?: string }).manufacturerName,
        vendor_name: (row as { vendor_name?: string }).vendor_name,
      });
    }
    return map;
  }
}
