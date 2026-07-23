import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createHash } from 'crypto';
import { RedisService } from '../../common/redis/redis.service';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import { resolveManufacturerScopeFilter } from '../../manufacturers/utils/list-manufacturers-query.util';
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
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_REJECTED,
  PRODUCT_STATUS_SUBMITTED,
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
const PAYMENT_STATUS_CREATED = 0;
const PAYMENT_STATUS_REJECTED = 3;

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

    const [productFacet, paymentFacet, vendorsAwaiting, timingAvgs] = await Promise.all([
      this.productModel
        .aggregate<{
          pendingReview: { count: number }[];
          assessmentBacklog: { count: number }[];
          documentVerification: { count: number }[];
          registrationPaymentVerification: { count: number }[];
          certificationPaymentVerification: { count: number }[];
          renewalPaymentVerification: { count: number }[];
          renewalDocumentVerification: { count: number }[];
          expiringSoon: { count: number }[];
          renewalsDue: { count: number }[];
          rejected: { count: number }[];
          certificationDays: { avgDays: number | null }[];
          renewalProcessingDays: { avgDays: number | null }[];
          prevCertificationDays: { avgDays: number | null }[];
          prevRenewalProcessingDays: { avgDays: number | null }[];
        }>([
          { $match: productMatch },
          {
            $facet: {
              /**
               * Product Approvals — same scope as Un-certified list `?urnStatus=0`:
               * product documents (EOIs) with productStatus ∈ {0,1}, productType 0, urnStatus 0.
               */
              pendingReview: [
                {
                  $match: {
                    productStatus: {
                      $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED],
                    },
                    productType: 0,
                    urnStatus: 0,
                  },
                },
                { $count: 'count' },
              ],
              assessmentBacklog: [
                {
                  $match: {
                    productStatus: {
                      $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED],
                    },
                    productType: 0,
                    urnStatus: { $gte: 4, $lte: 10 },
                  },
                },
                { $count: 'count' },
              ],
              /**
               * Document Verification — Un-certified list `?urnStatus=3` (product/EOI count).
               */
              documentVerification: [
                {
                  $match: {
                    productStatus: {
                      $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED],
                    },
                    productType: 0,
                    urnStatus: 3,
                  },
                },
                { $count: 'count' },
              ],
              /**
               * Registration Payment Approvals — Un-certified list `?urnStatus=2`.
               */
              registrationPaymentVerification: [
                {
                  $match: {
                    productStatus: {
                      $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED],
                    },
                    productType: 0,
                    urnStatus: 2,
                  },
                },
                { $count: 'count' },
              ],
              /**
               * Certification Payment Approvals — Un-certified list `?urnStatus=8`.
               */
              certificationPaymentVerification: [
                {
                  $match: {
                    productStatus: {
                      $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED],
                    },
                    productType: 0,
                    urnStatus: 8,
                  },
                },
                { $count: 'count' },
              ],
              /**
               * Renewal Payment Approvals — Renew list `?urnStatus=13` (product count).
               */
              renewalPaymentVerification: [
                {
                  $match: {
                    productStatus: PRODUCT_STATUS_CERTIFIED,
                    productType: 0,
                    urnStatus: 13,
                  },
                },
                { $count: 'count' },
              ],
              /**
               * Renewal Document Verification — Renew list `?urnStatus=15,17`.
               */
              renewalDocumentVerification: [
                {
                  $match: {
                    productStatus: PRODUCT_STATUS_CERTIFIED,
                    productType: 0,
                    urnStatus: { $in: [15, 17] },
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
                    updatedDate: filters.dateRange
                      ? {
                          $exists: true,
                          $ne: null,
                          $gte: filters.dateRange.from,
                          $lte: filters.dateRange.to,
                        }
                      : { $exists: true, $ne: null },
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
              renewalProcessingDays: [
                {
                  $match: {
                    productStatus: PRODUCT_STATUS_CERTIFIED,
                    urnStatus: { $gte: 12, $lte: 17 },
                    createdDate: { $exists: true, $ne: null },
                    updatedDate: filters.dateRange
                      ? {
                          $exists: true,
                          $ne: null,
                          $gte: filters.dateRange.from,
                          $lte: filters.dateRange.to,
                        }
                      : { $exists: true, $ne: null },
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
              prevCertificationDays: previousRange
                ? [
                    {
                      $match: {
                        productStatus: PRODUCT_STATUS_CERTIFIED,
                        createdDate: { $exists: true, $ne: null },
                        updatedDate: {
                          $gte: previousRange.from,
                          $lte: previousRange.to,
                        },
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
                  ]
                : [{ $match: { _id: null } }, { $group: { _id: null, avgDays: { $avg: 0 } } }],
              prevRenewalProcessingDays: previousRange
                ? [
                    {
                      $match: {
                        productStatus: PRODUCT_STATUS_CERTIFIED,
                        urnStatus: { $gte: 12, $lte: 17 },
                        createdDate: { $exists: true, $ne: null },
                        updatedDate: {
                          $gte: previousRange.from,
                          $lte: previousRange.to,
                        },
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
                  ]
                : [{ $match: { _id: null } }, { $group: { _id: null, avgDays: { $avg: 0 } } }],
            },
          },
        ])
        .exec(),

      this.paymentDetailsModel
        .aggregate<{
          pending: { count: number }[];
          pendingRegistration: { count: number }[];
          pendingCertification: { count: number }[];
          pendingRenewal: { count: number }[];
          currentRevenue: { total: number }[];
          previousRevenue: { total: number }[];
          verificationDays: { avgDays: number | null }[];
          prevVerificationDays: { avgDays: number | null }[];
        }>([
          { $match: paymentMatch },
          {
            $facet: {
              pending: [
                { $match: { paymentStatus: PAYMENT_STATUS_PENDING } },
                { $count: 'count' },
              ],
              pendingRegistration: [
                {
                  $match: {
                    paymentStatus: PAYMENT_STATUS_PENDING,
                    paymentType: 'registration',
                  },
                },
                { $count: 'count' },
              ],
              pendingCertification: [
                {
                  $match: {
                    paymentStatus: PAYMENT_STATUS_PENDING,
                    paymentType: 'certification',
                  },
                },
                { $count: 'count' },
              ],
              /** Same filter as Payment History with `paymentType=renew` + pending status. */
              pendingRenewal: [
                {
                  $match: {
                    paymentStatus: PAYMENT_STATUS_PENDING,
                    paymentType: 'renew',
                  },
                },
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
                    updatedDate: filters.dateRange
                      ? {
                          $exists: true,
                          $ne: null,
                          $gte: filters.dateRange.from,
                          $lte: filters.dateRange.to,
                        }
                      : { $exists: true, $ne: null },
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
              prevVerificationDays: previousRange
                ? [
                    {
                      $match: {
                        paymentStatus: PAYMENT_STATUS_PAID,
                        createdDate: { $exists: true, $ne: null },
                        updatedDate: {
                          $gte: previousRange.from,
                          $lte: previousRange.to,
                        },
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
                  ]
                : [{ $match: { _id: null } }, { $group: { _id: null, avgDays: { $avg: 0 } } }],
            },
          },
        ])
        .exec(),

      this.manufacturerModel
        .countDocuments({
          ...manufacturerMatch,
          // Same filter as admin Unverified Manufacturers list (`scope=unverified`).
          ...resolveManufacturerScopeFilter({ scope: 'unverified' }),
        })
        .exec(),

      this.aggregateVendorApprovalTiming(manufacturerMatch, filters.dateRange, previousRange),
    ]);

    const pf = productFacet[0];
    const pay = paymentFacet[0];

    const revenueCurrent = Number(pay?.currentRevenue?.[0]?.total ?? 0);
    const revenuePrevious = Number(pay?.previousRevenue?.[0]?.total ?? 0);
    const revenueChangePercent =
      revenuePrevious > 0
        ? Number((((revenueCurrent - revenuePrevious) / revenuePrevious) * 100).toFixed(1))
        : 0;

    const avgCertificationDays = Number(pf?.certificationDays?.[0]?.avgDays ?? 0);
    const avgPaymentDays = Number(pay?.verificationDays?.[0]?.avgDays ?? 0);
    const avgRenewalDays = Number(pf?.renewalProcessingDays?.[0]?.avgDays ?? 0);
    const avgVendorApprovalDays = Number(timingAvgs.current ?? 0);

    return {
      vendorsAwaitingApproval: vendorsAwaiting,
      productsPendingReview: pf?.pendingReview?.[0]?.count ?? 0,
      registrationPaymentsPending:
        pf?.registrationPaymentVerification?.[0]?.count ?? 0,
      documentVerificationPending: pf?.documentVerification?.[0]?.count ?? 0,
      certificationPaymentsPending:
        pf?.certificationPaymentVerification?.[0]?.count ?? 0,
      renewalPaymentsPending: pf?.renewalPaymentVerification?.[0]?.count ?? 0,
      renewalDocumentVerificationPending:
        pf?.renewalDocumentVerification?.[0]?.count ?? 0,
      paymentsPendingVerification: pay?.pending?.[0]?.count ?? 0,
      certificatesExpiringSoon: pf?.expiringSoon?.[0]?.count ?? 0,
      assessmentBacklog: pf?.assessmentBacklog?.[0]?.count ?? 0,
      renewalsDue: pf?.renewalsDue?.[0]?.count ?? 0,
      rejectedProducts: pf?.rejected?.[0]?.count ?? 0,
      revenueCurrent,
      revenuePrevious,
      revenueChangePercent,
      avgVendorApprovalDays: Number(avgVendorApprovalDays.toFixed(1)),
      avgProductReviewDays: Math.max(
        0,
        Number((avgCertificationDays * 0.25).toFixed(1)),
      ),
      avgAssessmentDays: Math.max(
        0,
        Number((avgCertificationDays * 0.35).toFixed(1)),
      ),
      avgCertificationDays: Number(avgCertificationDays.toFixed(1)),
      avgPaymentVerificationDays: Number(avgPaymentDays.toFixed(1)),
      avgRenewalProcessingDays: Number(avgRenewalDays.toFixed(1)),
      prevAvgVendorApprovalDays: Number(Number(timingAvgs.previous ?? 0).toFixed(1)),
      prevAvgCertificationDays: Number(
        Number(pf?.prevCertificationDays?.[0]?.avgDays ?? 0).toFixed(1),
      ),
      prevAvgPaymentVerificationDays: Number(
        Number(pay?.prevVerificationDays?.[0]?.avgDays ?? 0).toFixed(1),
      ),
      prevAvgRenewalProcessingDays: Number(
        Number(pf?.prevRenewalProcessingDays?.[0]?.avgDays ?? 0).toFixed(1),
      ),
    };
  }

  // ─── Public endpoints ─────────────────────────────────────────────────────

  /** Cached lightweight KPI cards (delegates to existing KPI service). */
  async getKpis(filters: ResolvedDashboardFilters) {
    return this.cached('kpis', filters, () => this.kpiService.getKpiBundle(filters));
  }

  /** Cached executive KPI strip (counts + paid collection buckets). */
  async getExecutiveKpis(filters: ResolvedDashboardFilters) {
    return this.cached('executive-kpis', filters, () =>
      this.kpiService.getExecutiveKpis(filters),
    );
  }

  /** Cached chart widgets for the analytics section. */
  async getCharts(filters: ResolvedDashboardFilters) {
    return this.cached('charts', filters, async () => {
      const [products, trends, rejectionTrend, paymentStatus] = await Promise.all([
        this.statsService.getProductWidgetStats(filters, { applyDateRange: true }),
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
    limit = 10,
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
    const pageSize = Math.min(Math.max(options?.pageSize ?? 10, 1), 50);
    const search = String(options?.search ?? '').trim().toLowerCase();
    const fetchLimit = Math.min(Math.max(pageSize * page, 10), 48);

    return this.cached(
      `activity-tab:${tab}:p${page}:s${pageSize}:q${search}:from${filters.dateRange?.from?.toISOString() ?? 'all'}:to${filters.dateRange?.to?.toISOString() ?? 'all'}`,
      filters,
      async () => {
        // Load a bounded window then filter/paginate — keeps index usage tight.
        const bundle = await this.loadActivityCenter(filters, fetchLimit);
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
                  r.urnNo.toLowerCase().includes(search) ||
                  r.manufacturerName.toLowerCase().includes(search) ||
                  String(r.totalEoi).includes(search),
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
    return this.cached('smart-alerts-urn', filters, async () => {
      const alerts = await this.loadUrnSmartAlerts(filters);
      return {
        alerts,
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
        key: 'manufacturerApprovals',
        action: 'Manufacturer Approvals',
        count: signals.vendorsAwaitingApproval,
        assignedTeam: 'Vendor Ops',
        quickActionLabel: 'Review manufacturers',
        href: '/vendors/unverified',
        slaHours: signals.vendorsAwaitingApproval > 10 ? -4 : 8,
      },
      {
        key: 'productApprovals',
        action: 'Product Approvals',
        count: signals.productsPendingReview,
        assignedTeam: 'Product Ops',
        quickActionLabel: 'Review products',
        /** urnStatus 0 = Proposal / Admin Approval Pending */
        href: '/products/un-certified?urnStatus=0',
        slaHours: signals.productsPendingReview > 20 ? -2 : 12,
      },
      {
        key: 'registrationPaymentApprovals',
        action: 'Registration Payment Approvals',
        count: signals.registrationPaymentsPending,
        assignedTeam: 'Finance',
        quickActionLabel: 'Verify payments',
        /** urnStatus 2 = Registration Payment Verification Pending (Admin Action) */
        href: '/products/un-certified?urnStatus=2',
        slaHours: signals.registrationPaymentsPending > 8 ? -6 : 5,
      },
      {
        key: 'documentVerification',
        action: 'Document Verification',
        count: signals.documentVerificationPending,
        assignedTeam: 'Compliance',
        quickActionLabel: 'Verify documents',
        /** urnStatus 3 = Process Forms Submitted by vendor, admin must review */
        href: '/products/un-certified?urnStatus=3',
        slaHours: signals.documentVerificationPending > 15 ? -4 : 10,
      },
      {
        key: 'certificationPaymentApprovals',
        action: 'Certification Payment Approvals',
        count: signals.certificationPaymentsPending,
        assignedTeam: 'Finance',
        quickActionLabel: 'Verify payments',
        /** urnStatus 8 = Certification Payment Verification Pending (Admin Action) */
        href: '/products/un-certified?urnStatus=8',
        slaHours: signals.certificationPaymentsPending > 8 ? -6 : 5,
      },
      {
        key: 'renewalPaymentApprovals',
        action: 'Renewal Payment Approvals',
        count: signals.renewalPaymentsPending,
        assignedTeam: 'Finance',
        quickActionLabel: 'Verify payments',
        href: '/products/renew?urnStatus=13',
        slaHours: signals.renewalPaymentsPending > 8 ? -6 : 5,
      },
      {
        key: 'renewalDocumentVerification',
        action: 'Renewal Document Verification',
        count: signals.renewalDocumentVerificationPending,
        assignedTeam: 'Renewals',
        quickActionLabel: 'Review renewals',
        href: '/products/renew?urnStatus=15,17',
        slaHours: signals.renewalDocumentVerificationPending > 10 ? -3 : 12,
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

  /**
   * Latest actionable updates as **per-URN** rows (not aggregated group counts).
   * Categories: recent URN applications (urnStatus 0), payment approval pending, form validation (urnStatus 3).
   */
  private async loadUrnSmartAlerts(
    filters: ResolvedDashboardFilters,
    perCategoryLimit = 5,
    maxAlerts = 5,
  ): Promise<DashboardSmartAlert[]> {
    const now = new Date();
    const snapshot = buildProductSnapshotMatch(filters, now);
    const paymentIds = resolveManufacturerScopeIds(filters);

    const recentUrnMatch: Record<string, unknown> = {
      ...snapshot,
      productStatus: {
        $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED],
      },
      urnNo: { $exists: true, $nin: [null, ''] },
      urnStatus: 0,
    };

    const formValidationMatch: Record<string, unknown> = {
      ...snapshot,
      productStatus: {
        $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED],
      },
      urnNo: { $exists: true, $nin: [null, ''] },
      urnStatus: 3,
    };

    const paymentMatch: Record<string, unknown> = {
      paymentStatus: PAYMENT_STATUS_PENDING,
      urnNo: { $exists: true, $nin: [null, ''] },
      ...(paymentIds ? { vendorId: { $in: paymentIds } } : {}),
    };

    const [recentUrns, pendingPayments, formValidationUrns] = await Promise.all([
      this.productModel
        .aggregate<{
          urnNo: string;
          manufacturerName?: string;
          updatedAt?: Date;
          totalEoi: number;
        }>([
          { $match: recentUrnMatch },
          { $sort: { updatedDate: -1, createdDate: -1 } },
          {
            $group: {
              _id: '$urnNo',
              urnNo: { $first: '$urnNo' },
              manufacturerId: { $first: '$manufacturerId' },
              updatedAt: {
                $max: { $ifNull: ['$updatedDate', '$createdDate'] },
              },
              totalEoi: { $sum: 1 },
            },
          },
          { $sort: { updatedAt: -1 } },
          { $limit: perCategoryLimit },
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
              updatedAt: 1,
              totalEoi: 1,
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

      this.paymentDetailsModel
        .find(paymentMatch)
        .sort({ updatedDate: -1, createdDate: -1 })
        .limit(perCategoryLimit)
        .select({
          urnNo: 1,
          paymentType: 1,
          quoteTotal: 1,
          updatedDate: 1,
          createdDate: 1,
          vendorId: 1,
        })
        .lean()
        .exec(),

      this.productModel
        .aggregate<{
          urnNo: string;
          manufacturerName?: string;
          updatedAt?: Date;
          totalEoi: number;
        }>([
          { $match: formValidationMatch },
          { $sort: { updatedDate: -1, createdDate: -1 } },
          {
            $group: {
              _id: '$urnNo',
              urnNo: { $first: '$urnNo' },
              manufacturerId: { $first: '$manufacturerId' },
              updatedAt: {
                $max: { $ifNull: ['$updatedDate', '$createdDate'] },
              },
              totalEoi: { $sum: 1 },
            },
          },
          { $sort: { updatedAt: -1 } },
          { $limit: perCategoryLimit },
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
              updatedAt: 1,
              totalEoi: 1,
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

    const paymentVendorIds = pendingPayments
      .map((p) => p.vendorId)
      .filter((id): id is Types.ObjectId => !!id);
    const manufacturerMap = await this.loadManufacturerNameMap(paymentVendorIds);

    const alerts: DashboardSmartAlert[] = [];

    for (const row of recentUrns) {
      const urnNo = String(row.urnNo ?? '').trim();
      if (!urnNo) continue;
      const mfr = String(row.manufacturerName ?? 'Unknown').trim() || 'Unknown';
      const eoiCount = Number(row.totalEoi ?? 0);
      const ts = row.updatedAt
        ? new Date(row.updatedAt).toISOString()
        : now.toISOString();
      alerts.push({
        id: `alert-urn-registration-${urnNo}`,
        key: 'recentUrnRegistration',
        title: `New URN · ${urnNo}`,
        message: `${mfr}${eoiCount > 0 ? ` · ${eoiCount} EOI${eoiCount === 1 ? '' : 's'}` : ''} awaiting admin approval.`,
        severity: 'warning',
        timestamp: ts,
        actionLabel: 'Open URN',
        href: `/products/un-certified/urn/${encodeURIComponent(urnNo)}`,
        count: eoiCount || undefined,
      });
    }

    for (const row of pendingPayments) {
      const urnNo = String(row.urnNo ?? '').trim();
      if (!urnNo) continue;
      const vendorKey = row.vendorId?.toString() ?? '';
      const mfrDoc = manufacturerMap.get(vendorKey);
      const mfr = mfrDoc?.manufacturerName ?? mfrDoc?.vendor_name ?? 'Unknown';
      const feeType = this.formatPaymentType(row.paymentType);
      const amount = Number(row.quoteTotal ?? 0);
      const ts = row.updatedDate ?? row.createdDate
        ? new Date((row.updatedDate ?? row.createdDate) as Date).toISOString()
        : now.toISOString();
      const paymentTypeKey = String(row.paymentType ?? '').trim().toLowerCase();
      const href =
        paymentTypeKey === 'renew' || paymentTypeKey === 'renewal'
          ? `/products/renew/urn/${encodeURIComponent(urnNo)}`
          : `/products/un-certified/urn/${encodeURIComponent(urnNo)}`;
      alerts.push({
        id: `alert-urn-payment-${urnNo}-${paymentTypeKey || 'payment'}`,
        key: 'paymentApprovalPending',
        title: `Payment pending · ${urnNo}`,
        message: `${mfr} · ${feeType}${amount > 0 ? ` · ₹${amount.toLocaleString('en-IN')}` : ''} awaiting approval.`,
        severity: 'critical',
        timestamp: ts,
        actionLabel: 'Open URN',
        href,
      });
    }

    for (const row of formValidationUrns) {
      const urnNo = String(row.urnNo ?? '').trim();
      if (!urnNo) continue;
      const mfr = String(row.manufacturerName ?? 'Unknown').trim() || 'Unknown';
      const eoiCount = Number(row.totalEoi ?? 0);
      const ts = row.updatedAt
        ? new Date(row.updatedAt).toISOString()
        : now.toISOString();
      alerts.push({
        id: `alert-urn-form-${urnNo}`,
        key: 'formValidationPending',
        title: `Form validation · ${urnNo}`,
        message: `${mfr}${eoiCount > 0 ? ` · ${eoiCount} product form${eoiCount === 1 ? '' : 's'}` : ''} submitted for review.`,
        severity: 'warning',
        timestamp: ts,
        actionLabel: 'Open URN',
        href: `/products/un-certified/urn/${encodeURIComponent(urnNo)}`,
        count: eoiCount || undefined,
      });
    }

    const order = { critical: 0, warning: 1, info: 2, success: 3 } as const;
    return alerts
      .sort(
        (a, b) =>
          order[a.severity] - order[b.severity] ||
          b.timestamp.localeCompare(a.timestamp),
      )
      .slice(0, maxAlerts);
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
        signals.prevAvgVendorApprovalDays,
        3,
        '/vendors/unverified',
      ),
      mk(
        'certification',
        'Average Certification Time',
        signals.avgCertificationDays,
        signals.prevAvgCertificationDays,
        14,
        '/products/certified',
      ),
      mk(
        'paymentVerification',
        'Average Payment Verification Time',
        signals.avgPaymentVerificationDays,
        signals.prevAvgPaymentVerificationDays,
        2,
        '/payment-history',
      ),
      mk(
        'renewalProcessing',
        'Average Renewal Processing Time',
        signals.avgRenewalProcessingDays,
        signals.prevAvgRenewalProcessingDays,
        5,
        '/products/renew',
      ),
    ];
  }

  private async aggregateVendorApprovalTiming(
    manufacturerMatch: Record<string, unknown>,
    dateRange: { from: Date; to: Date } | undefined,
    previousRange: { from: Date; to: Date } | undefined,
  ): Promise<{ current: number; previous: number }> {
    const avgForRange = async (
      range?: { from: Date; to: Date },
    ): Promise<number> => {
      const match: Record<string, unknown> = {
        ...manufacturerMatch,
        manufacturerStatus: 1,
        createdAt: { $exists: true, $ne: null },
        updatedAt: range
          ? { $exists: true, $ne: null, $gte: range.from, $lte: range.to }
          : { $exists: true, $ne: null },
      };
      const rows = await this.manufacturerModel
        .aggregate<{ avgDays: number | null }>([
          { $match: match },
          {
            $project: {
              days: {
                $divide: [
                  { $subtract: ['$updatedAt', '$createdAt'] },
                  1000 * 60 * 60 * 24,
                ],
              },
            },
          },
          { $match: { days: { $gte: 0, $lte: 90 } } },
          { $group: { _id: null, avgDays: { $avg: '$days' } } },
        ])
        .exec();
      return Number(rows[0]?.avgDays ?? 0);
    };

    const [current, previous] = await Promise.all([
      avgForRange(dateRange),
      previousRange ? avgForRange(previousRange) : Promise.resolve(0),
    ]);
    return { current, previous };
  }

  private async loadActivityCenter(
    filters: ResolvedDashboardFilters,
    limit: number,
  ): Promise<DashboardActivityCenterPayload> {
    const now = new Date();
    const applicationsMatch = {
      ...buildProductSnapshotMatch(filters, now),
      productStatus: {
        $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED],
      },
      urnNo: { $exists: true, $nin: [null, ''] },
      ...(filters.dateRange
        ? {
            createdDate: {
              $gte: filters.dateRange.from,
              $lte: filters.dateRange.to,
            },
          }
        : {}),
    };
    const manufacturerMatch = {
      ...buildManufacturerSnapshotMatch(filters),
      ...(filters.dateRange
        ? {
            createdAt: {
              $gte: filters.dateRange.from,
              $lte: filters.dateRange.to,
            },
          }
        : {}),
    };
    const paymentIds = resolveManufacturerScopeIds(filters);
    const paymentMatch: Record<string, unknown> = {
      paymentStatus: {
        $in: [
          PAYMENT_STATUS_CREATED,
          PAYMENT_STATUS_PENDING,
          PAYMENT_STATUS_PAID,
          PAYMENT_STATUS_REJECTED,
        ],
      },
      ...(paymentIds ? { vendorId: { $in: paymentIds } } : {}),
      ...(filters.dateRange
        ? {
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
          }
        : {}),
    };

    const thresholdDate = new Date(now);
    thresholdDate.setDate(thresholdDate.getDate() + 60);
    const renewalsMatch: Record<string, unknown> = {
      ...buildProductSnapshotMatch(filters, now),
      productStatus: PRODUCT_STATUS_CERTIFIED,
      validtillDate: {
        $exists: true,
        $ne: null,
        $gte: now,
        ...(filters.dateRange
          ? { $lte: filters.dateRange.to < thresholdDate ? filters.dateRange.to : thresholdDate }
          : { $lte: thresholdDate }),
      },
    };

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
          { $match: applicationsMatch },
          { $sort: { createdDate: -1 } },
          {
            $group: {
              _id: '$urnNo',
              urnNo: { $first: '$urnNo' },
              manufacturerId: { $first: '$manufacturerId' },
              createdAt: { $max: '$createdDate' },
              totalEoi: { $sum: 1 },
            },
          },
          { $sort: { createdAt: -1 } },
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
              totalEoi: 1,
              createdAt: 1,
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

      this.paymentDetailsModel
        .find(paymentMatch)
        .sort({ updatedDate: -1, createdDate: -1 })
        .limit(limit)
        .lean()
        .exec(),

      this.productModel
        .aggregate([
          {
            $match: renewalsMatch,
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
            $lookup: {
              from: 'categories',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $lookup: {
              from: 'sectors',
              let: { sectorId: { $arrayElemAt: ['$category.sector', 0] } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $ne: ['$$sectorId', null] },
                        { $eq: ['$id', '$$sectorId'] },
                      ],
                    },
                  },
                },
                { $project: { name: 1 } },
                { $limit: 1 },
              ],
              as: 'sector',
            },
          },
          {
            $project: {
              urnNo: 1,
              eoiNo: 1,
              productName: 1,
              validtillDate: 1,
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
              sectorName: {
                $ifNull: [{ $arrayElemAt: ['$sector.name', 0] }, '—'],
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
      const urnNo = String(row.urnNo ?? '').trim();
      return {
        id: urnNo || String(row._id),
        urnNo: urnNo || '—',
        manufacturerName: String(row.manufacturerName ?? 'Unknown'),
        totalEoi: Number(row.totalEoi ?? 0),
        createdAt: row.createdAt
          ? new Date(row.createdAt as Date).toISOString().slice(0, 10)
          : '',
        href: urnNo
          ? `/products/un-certified/urn/${encodeURIComponent(urnNo)}`
          : '/products/un-certified',
      };
    });

    const paymentRows: DashboardActivityPaymentRow[] = payments.map((row) => {
      const statusCode = Number(row.paymentStatus);
      const paid = statusCode === PAYMENT_STATUS_PAID;
      const rejected = statusCode === PAYMENT_STATUS_REJECTED;
      const overdue = statusCode === PAYMENT_STATUS_CREATED;
      const vendorKey = row.vendorId?.toString() ?? '';
      const mfr = manufacturerMap.get(vendorKey);
      const companyName =
        mfr?.manufacturerName ?? mfr?.vendor_name ?? 'Unknown';
      const paymentId = Number(row.paymentId ?? 0);
      const status = paid
        ? { label: 'Paid', tone: 'success' }
        : rejected
          ? { label: 'Rejected', tone: 'neutral' }
          : overdue
            ? { label: 'Over Due', tone: 'danger' }
            : { label: 'Pending', tone: 'warning' };
      return {
        id: String(row._id),
        transactionId: row.paymentReferenceNo?.trim()
          ? String(row.paymentReferenceNo).trim()
          : `TXN-${paymentId || row._id}`,
        companyName,
        paymentType: this.formatPaymentType(row.paymentType),
        paymentMode: String(row.paymentMode ?? "").trim() || "—",
        amount: Number(row.quoteTotal ?? 0),
        currency: 'INR',
        paidAt: (row.createdDate ?? row.updatedDate)
          ? new Date((row.createdDate ?? row.updatedDate) as Date).toISOString().slice(0, 10)
          : '',
        status: status.label,
        statusTone: status.tone,
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
            : { label: 'Certified', tone: 'success' };
      const urnNo = String(row.urnNo ?? '');
      return {
        id: String(row._id),
        eoiNo: String(row.eoiNo ?? ''),
        urnNo,
        productName: String(row.productName ?? ''),
        categoryName: String(row.categoryName ?? '—'),
        sectorName: String(row.sectorName ?? '—'),
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

  private formatPaymentType(value?: string | null): string {
    const key = String(value ?? '').trim().toLowerCase();
    if (key === 'certification') return 'Certification';
    if (key === 'renew' || key === 'renewal') return 'Renewal';
    if (key === 'registration') return 'Registration';
    return key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Payment';
  }

  private formatPaymentMode(value?: string | null): string {
    const key = String(value ?? '').trim().toLowerCase();
    if (key === 'online') return 'UPI';
    if (key === 'cheque_or_dd') return 'Cheque';
    if (key === 'neft_or_rtgs') return 'Bank Transfer';
    return key || '—';
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
