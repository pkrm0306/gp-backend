import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../../payments/schemas/payment-details.schema';
import {
  VendorProductChangeRequest,
  VendorProductChangeRequestDocument,
} from '../../product-registration/schemas/vendor-product-change-request.schema';
import {
  ContactMessage,
  ContactMessageDocument,
} from '../../website/schemas/contact-message.schema';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_SUBMITTED,
} from '../../renew/constants/product-status.constants';
import { manufacturerStatusKey } from '../admin-dashboard-metrics.util';
import type { ResolvedDashboardFilters } from '../utils/dashboard-metrics-filters.util';
import {
  buildManufacturerSnapshotMatch,
  buildProductSnapshotMatch,
  resolveManufacturerScopeIds,
  resolvePreviousDashboardDateRange,
} from '../utils/dashboard-metrics-filters.util';
import {
  paymentRevenueRecognitionDateExpr,
  roundRevenueAmount,
} from '../utils/admin-dashboard-revenue.util';
import { AdminDashboardStatsService } from './admin-dashboard-stats.service';
import { AdminDashboardCertificationTimingService } from './admin-dashboard-certification-timing.service';
import type {
  AdminDashboardKpiBundle,
  AdminDashboardKpiCards,
  ExecutiveKpiCard,
  ExecutiveKpiPayload,
} from './admin-dashboard-kpi.types';

const PAYMENT_STATUS_PENDING = 1;
const PAYMENT_STATUS_PAID = 2;

@Injectable()
export class AdminDashboardKpiService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(PaymentDetails.name)
    private readonly paymentDetailsModel: Model<PaymentDetailsDocument>,
    @InjectModel(VendorProductChangeRequest.name)
    private readonly vendorProductChangeRequestModel: Model<VendorProductChangeRequestDocument>,
    @InjectModel(ContactMessage.name)
    private readonly contactMessageModel: Model<ContactMessageDocument>,
    private readonly dashboardStatsService: AdminDashboardStatsService,
    private readonly certificationTimingService: AdminDashboardCertificationTimingService,
  ) {}

  async getKpiBundle(
    filters: ResolvedDashboardFilters,
  ): Promise<AdminDashboardKpiBundle> {
    const [cards, certificationTiming] = await Promise.all([
      this.getKpiCards(filters),
      this.certificationTimingService.getCertificationTiming(filters),
    ]);
    return { cards, certificationTiming };
  }

  /**
   * Executive KPI strip for the admin dashboard home.
   * Revenue cards: paid payments only (`paymentStatus` 2), sum of `quoteTotal`,
   * bucketed by recognition date (cheque date → updated → created).
   */
  async getExecutiveKpis(
    filters: ResolvedDashboardFilters,
  ): Promise<ExecutiveKpiPayload> {
    const now = new Date();
    const productMatch = buildProductSnapshotMatch(filters, now);
    const manufacturerMatch = buildManufacturerSnapshotMatch(filters);
    const paymentVendorScope = this.buildPaymentVendorScope(filters);

    const thresholdDate = new Date(now);
    thresholdDate.setDate(thresholdDate.getDate() + 60);

    const renewMatch = this.buildRenewDueMatch(productMatch, thresholdDate);

    const [
      manufacturerFacet,
      productWidgets,
      activeUrnCount,
      pendingProducts,
      underReview,
      renewalsDue,
      pendingPayments,
      collections,
    ] = await Promise.all([
      this.aggregateManufacturerFacet(manufacturerMatch),
      this.dashboardStatsService.getProductWidgetStats(filters),
      this.productModel
        .aggregate<{ count: number }>([
          {
            $match: {
              ...productMatch,
              productStatus: {
                $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED],
              },
            },
          },
          { $group: { _id: '$urnNo' } },
          { $count: 'count' },
        ])
        .exec()
        .then((rows) => rows[0]?.count ?? 0),
      this.productModel
        .countDocuments({
          ...productMatch,
          productStatus: PRODUCT_STATUS_PENDING,
        })
        .exec(),
      this.productModel
        .countDocuments({
          ...productMatch,
          productStatus: PRODUCT_STATUS_SUBMITTED,
        })
        .exec(),
      this.productModel
        .aggregate<{ count: number }>([
          { $match: renewMatch },
          { $group: { _id: '$urnNo' } },
          { $count: 'count' },
        ])
        .exec()
        .then((rows) => rows[0]?.count ?? 0),
      this.paymentDetailsModel
        .countDocuments({
          ...paymentVendorScope,
          paymentStatus: PAYMENT_STATUS_PENDING,
        })
        .exec(),
      this.aggregatePaidCollectionBuckets(paymentVendorScope, now, filters),
    ]);

    const cards: ExecutiveKpiCard[] = [
      {
        key: 'totalManufacturers',
        label: 'Total Manufacturers',
        value: manufacturerFacet.verifiedActive,
        changePercent: 0,
        higherIsBetter: true,
        format: 'number',
        href: '/vendors/verified',
        sparkline: this.buildSparkline(manufacturerFacet.verifiedActive),
      },
      {
        key: 'activeUrns',
        label: 'Active URNs',
        value: activeUrnCount,
        changePercent: 0,
        higherIsBetter: true,
        format: 'number',
        href: '/products/un-certified',
        sparkline: this.buildSparkline(activeUrnCount),
      },
      {
        key: 'registeredProducts',
        label: 'Registered Products',
        value: productWidgets.statusCounts.total,
        changePercent: 0,
        higherIsBetter: true,
        format: 'number',
        href: '/products/un-certified',
        sparkline: this.buildSparkline(productWidgets.statusCounts.total),
      },
      {
        key: 'certifiedProducts',
        label: 'Certified Products',
        value: productWidgets.statusCounts.certified,
        changePercent: 0,
        higherIsBetter: true,
        format: 'number',
        href: '/products/certified',
        sparkline: this.buildSparkline(productWidgets.statusCounts.certified),
      },
      {
        key: 'pendingProducts',
        label: 'Pending Products',
        value: pendingProducts,
        changePercent: 0,
        higherIsBetter: false,
        format: 'number',
        href: '/products/un-certified',
        sparkline: this.buildSparkline(pendingProducts),
      },
      {
        key: 'underReview',
        label: 'Under review',
        value: underReview,
        changePercent: 0,
        higherIsBetter: false,
        format: 'number',
        href: '/products/un-certified',
        sparkline: this.buildSparkline(underReview),
      },
      {
        key: 'renewalsDue',
        label: 'Renewal pending',
        value: renewalsDue,
        changePercent: 0,
        higherIsBetter: false,
        format: 'number',
        href: '/products/renew',
        sparkline: this.buildSparkline(renewalsDue),
      },
      {
        key: 'pendingPayments',
        label: 'Payment pending',
        value: pendingPayments,
        changePercent: 0,
        higherIsBetter: false,
        format: 'number',
        href: '/payment-history?status=pending',
        sparkline: this.buildSparkline(pendingPayments),
      },
      {
        key: 'totalRevenue',
        label: 'Total Revenue',
        value: collections.total,
        changePercent: collections.totalChangePercent,
        higherIsBetter: true,
        format: 'currency',
        href: '/payment-history',
        sparkline: collections.sparkline,
      },
      {
        key: 'todaysCollection',
        label: "Today's Collection",
        value: collections.today,
        changePercent: collections.todayChangePercent,
        higherIsBetter: true,
        format: 'currency',
        href: '/payment-history',
        sparkline: collections.sparkline,
      },
      {
        key: 'monthlyCollection',
        label: 'Monthly Collection',
        value: collections.month,
        changePercent: collections.monthChangePercent,
        higherIsBetter: true,
        format: 'currency',
        href: '/payment-history',
        sparkline: collections.sparkline,
      },
      {
        key: 'yearlyCollection',
        label: 'Yearly Collection',
        value: collections.year,
        changePercent: collections.yearChangePercent,
        higherIsBetter: true,
        format: 'currency',
        href: '/payment-history',
        sparkline: collections.sparkline,
      },
    ];

    return { cards, generatedAt: now.toISOString() };
  }

  async getKpiCards(
    filters: ResolvedDashboardFilters,
  ): Promise<AdminDashboardKpiCards> {
    const now = new Date();
    const productMatch = buildProductSnapshotMatch(filters, now);
    const manufacturerMatch = buildManufacturerSnapshotMatch(filters);
    const paymentVendorScope = this.buildPaymentVendorScope(filters);

    const thresholdDate = new Date(now);
    thresholdDate.setDate(thresholdDate.getDate() + 60);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const renewEoiMatch = {
      ...productMatch,
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
    };

    const renewQueueMatch = {
      ...productMatch,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      urnStatus: { $gte: 12, $lte: 17 },
    };

    const pendingEoiMatch = {
      ...productMatch,
      productStatus: { $in: [0, 1] },
    };

    const [
      productWidgets,
      manufacturerFacet,
      pendingEoiCount,
      pendingProductRequests,
      renewEoiCount,
      renewQueueUrnCount,
      paymentFacet,
      revenueFacet,
      totalInquiriesCount,
      inquiriesThisMonth,
      productInquiriesCount,
      productInquiriesThisMonth,
    ] = await Promise.all([
      this.dashboardStatsService.getProductWidgetStats(filters),
      this.aggregateManufacturerFacet(manufacturerMatch),
      this.productModel.countDocuments(pendingEoiMatch).exec(),
      this.vendorProductChangeRequestModel
        .countDocuments({ status: 'pending' })
        .exec(),
      this.productModel.countDocuments(renewEoiMatch).exec(),
      this.productModel
        .aggregate<{ count: number }>([
          { $match: renewQueueMatch },
          { $group: { _id: '$urnNo' } },
          { $count: 'count' },
        ])
        .exec()
        .then((rows) => rows[0]?.count ?? 0),
      this.aggregatePaymentFacet(paymentVendorScope),
      this.aggregateCompletedRevenue(paymentVendorScope),
      this.contactMessageModel
        .countDocuments({
          $or: [
            { inquiryType: 'contact' },
            { inquiryType: { $exists: false } },
            { inquiryType: null },
            { inquiryType: '' },
          ],
        })
        .exec(),
      this.contactMessageModel
        .countDocuments({
          createdAt: { $gte: monthStart },
          $or: [
            { inquiryType: 'contact' },
            { inquiryType: { $exists: false } },
            { inquiryType: null },
            { inquiryType: '' },
          ],
        })
        .exec(),
      this.contactMessageModel.countDocuments({ inquiryType: 'product' }).exec(),
      this.contactMessageModel
        .countDocuments({
          inquiryType: 'product',
          createdAt: { $gte: monthStart },
        })
        .exec(),
    ]);

    const manufacturers = {
      verified: 0,
      unverified: 0,
      inactivePending: 0,
      verifiedActive: manufacturerFacet.verifiedActive,
      verifiedInactive: manufacturerFacet.verifiedInactive,
    };
    for (const row of manufacturerFacet.byStatus) {
      const key = manufacturerStatusKey(Number(row._id ?? 0));
      manufacturers[key] += row.count ?? 0;
    }

    const certifiedActive = productWidgets.statusCounts.certified;
    const totalProducts = productWidgets.statusCounts.total;
    const expiredCount = productWidgets.statusCounts.expired;
    const rejectedCount = productWidgets.statusCounts.rejected;
    const decidedCount = certifiedActive + rejectedCount;
    const successRate =
      decidedCount > 0
        ? Math.round((certifiedActive / decidedCount) * 1000) / 10
        : 0;

    const pendingApplicationsTotal = pendingEoiCount + pendingProductRequests;

    return {
      activeManufacturers: {
        key: 'activeManufacturers',
        label: 'Total Active Manufacturers',
        value: manufacturers.verifiedActive,
        subMetrics: {
          registered: manufacturerFacet.total,
          verified: manufacturers.verified,
        },
      },
      certifiedProducts: {
        key: 'certifiedProducts',
        label: 'Total Certified Products',
        value: certifiedActive,
        subMetrics: {
          totalRecords: totalProducts,
          expired: expiredCount,
        },
      },
      pendingApplications: {
        key: 'pendingApplications',
        label: 'Total Pending Applications',
        value: pendingApplicationsTotal,
        subMetrics: {
          eois: pendingEoiCount,
          productRequests: pendingProductRequests,
        },
      },
      transactions: {
        key: 'transactions',
        label: 'Total Transactions',
        value: paymentFacet.paid + paymentFacet.overdue,
        subMetrics: {
          paid: paymentFacet.paid,
          pending: paymentFacet.overdue,
        },
      },
      certificationSuccessRate: {
        key: 'certificationSuccessRate',
        label: 'Certification Success Rate',
        value: successRate,
        subMetrics: {
          certified: certifiedActive,
          decided: decidedCount,
          rejected: rejectedCount,
        },
      },
      totalRevenue: {
        key: 'totalRevenue',
        label: 'Total Revenue',
        value: revenueFacet.amount,
        currency: 'INR',
        subMetrics: {
          completedPayments: revenueFacet.count,
        },
      },
      pendingRenewals: {
        key: 'pendingRenewals',
        label: 'Pending Renewals',
        value: renewEoiCount,
        subMetrics: {
          renewalQueueItems: renewQueueUrnCount,
        },
      },
      expiredCertifications: {
        key: 'expiredCertifications',
        label: 'Expired Certifications',
        value: expiredCount,
        subMetrics: {
          requiresRenewal: expiredCount,
        },
      },
      totalInquiries: {
        key: 'totalInquiries',
        label: 'Contact Inquiries',
        value: totalInquiriesCount,
        subMetrics: {
          thisMonth: inquiriesThisMonth,
        },
      },
      productInquiries: {
        key: 'productInquiries',
        label: 'Product Inquiries',
        value: productInquiriesCount,
        subMetrics: {
          thisMonth: productInquiriesThisMonth,
        },
      },
    };
  }

  private buildPaymentVendorScope(
    filters: ResolvedDashboardFilters,
  ): Record<string, unknown> {
    const ids = resolveManufacturerScopeIds(filters);
    if (!ids?.length) {
      return ids ? { vendorId: { $in: [] } } : {};
    }
    return { vendorId: { $in: ids } };
  }

  /** Merge active-product `$or` with renew eligibility `$or` without overwriting. */
  private buildRenewDueMatch(
    productMatch: Record<string, unknown>,
    thresholdDate: Date,
  ): Record<string, unknown> {
    const { $or: activeOr, ...rest } = productMatch as {
      $or?: unknown[];
    } & Record<string, unknown>;
    const andClauses: Record<string, unknown>[] = [];
    if (activeOr) {
      andClauses.push({ $or: activeOr });
    }
    andClauses.push({
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
    });
    return {
      ...rest,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      $and: andClauses,
    };
  }

  private percentChange(current: number, previous: number): number {
    if (previous > 0) {
      return Number((((current - previous) / previous) * 100).toFixed(1));
    }
    if (current > 0) return 100;
    return 0;
  }

  private buildSparkline(seed: number, points = 7): number[] {
    const base = Math.max(1, Math.abs(seed));
    return Array.from({ length: points }, (_, i) => {
      const wave = 0.72 + 0.08 * i + ((seed * (i + 3)) % 7) * 0.01;
      return Math.max(1, Math.round(base * wave));
    });
  }

  /**
   * Paid collections (`paymentStatus` 2) by recognition date.
   * % change uses comparable prior windows (yesterday / prior MTD / prior YTD).
   * When filters.dateRange is set, Total Revenue uses that window vs previous window.
   */
  private async aggregatePaidCollectionBuckets(
    vendorScope: Record<string, unknown>,
    now: Date,
    filters: ResolvedDashboardFilters,
  ): Promise<{
    total: number;
    today: number;
    month: number;
    year: number;
    totalChangePercent: number;
    todayChangePercent: number;
    monthChangePercent: number;
    yearChangePercent: number;
    sparkline: number[];
  }> {
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const msSinceMidnight = now.getTime() - todayStart.getTime();

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(yesterdayStart.getTime() + msSinceMidnight);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const dayOfMonth = now.getDate();
    const daysInPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
    ).getDate();
    const prevMonthSameDay = Math.min(dayOfMonth, daysInPrevMonth);
    const prevMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      prevMonthSameDay,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );

    const yearStart = new Date(now.getFullYear(), 0, 1);
    const prevYearStart = new Date(now.getFullYear() - 1, 0, 1);
    const daysInSameMonthLastYear = new Date(
      now.getFullYear() - 1,
      now.getMonth() + 1,
      0,
    ).getDate();
    const prevYearEnd = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      Math.min(dayOfMonth, daysInSameMonthLastYear),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );

    const sparkFrom = new Date(todayStart);
    sparkFrom.setDate(sparkFrom.getDate() - 6);

    const filterFrom = filters.dateRange?.from;
    const filterTo = filters.dateRange?.to;
    const previousFilterRange = filters.dateRange
      ? resolvePreviousDashboardDateRange(filters.dateRange)
      : undefined;

    const sumPipeline = (from: Date, to: Date) => [
      { $match: { revenueDate: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: null,
          amount: { $sum: { $ifNull: ['$quoteTotal', 0] } },
        },
      },
    ];

    const emptySum = [
      { $match: { _id: null } },
      { $group: { _id: null, amount: { $sum: 0 } } },
    ];

    const rows = await this.paymentDetailsModel
      .aggregate<{
        total: { amount: number }[];
        filterTotal: { amount: number }[];
        filterPrev: { amount: number }[];
        today: { amount: number }[];
        yesterday: { amount: number }[];
        month: { amount: number }[];
        prevMonth: { amount: number }[];
        year: { amount: number }[];
        prevYear: { amount: number }[];
        sparkDays: { _id: string; amount: number }[];
      }>([
        {
          $match: {
            paymentStatus: PAYMENT_STATUS_PAID,
            ...vendorScope,
          },
        },
        {
          $addFields: {
            revenueDate: paymentRevenueRecognitionDateExpr(),
          },
        },
        {
          $facet: {
            total: [
              {
                $group: {
                  _id: null,
                  amount: { $sum: { $ifNull: ['$quoteTotal', 0] } },
                },
              },
            ],
            filterTotal:
              filterFrom && filterTo
                ? sumPipeline(filterFrom, filterTo)
                : emptySum,
            filterPrev: previousFilterRange
              ? sumPipeline(previousFilterRange.from, previousFilterRange.to)
              : emptySum,
            today: sumPipeline(todayStart, now),
            yesterday: sumPipeline(yesterdayStart, yesterdayEnd),
            month: sumPipeline(monthStart, now),
            prevMonth: sumPipeline(prevMonthStart, prevMonthEnd),
            year: sumPipeline(yearStart, now),
            prevYear: sumPipeline(prevYearStart, prevYearEnd),
            sparkDays: [
              {
                $match: {
                  revenueDate: { $gte: sparkFrom, $lte: now },
                },
              },
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$revenueDate',
                      timezone: 'Asia/Kolkata',
                    },
                  },
                  amount: { $sum: { $ifNull: ['$quoteTotal', 0] } },
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ])
      .exec();

    const facet = rows[0];
    const amount = (bucket?: { amount: number }[]) =>
      roundRevenueAmount(bucket?.[0]?.amount ?? 0);

    const allTime = amount(facet?.total);
    const filteredTotal = amount(facet?.filterTotal);
    const filteredPrev = amount(facet?.filterPrev);
    const today = amount(facet?.today);
    const yesterday = amount(facet?.yesterday);
    const month = amount(facet?.month);
    const prevMonth = amount(facet?.prevMonth);
    const year = amount(facet?.year);
    const prevYear = amount(facet?.prevYear);

    const total = filterFrom && filterTo ? filteredTotal : allTime;
    const totalChangePercent =
      filterFrom && filterTo
        ? this.percentChange(filteredTotal, filteredPrev)
        : this.percentChange(year, prevYear);

    const byDay = new Map<string, number>();
    for (const row of facet?.sparkDays ?? []) {
      byDay.set(String(row._id), roundRevenueAmount(row.amount ?? 0));
    }
    const sparkline: number[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      sparkline.push(byDay.get(`${y}-${m}-${day}`) ?? 0);
    }

    return {
      total,
      today,
      month,
      year,
      totalChangePercent,
      todayChangePercent: this.percentChange(today, yesterday),
      monthChangePercent: this.percentChange(month, prevMonth),
      yearChangePercent: this.percentChange(year, prevYear),
      sparkline,
    };
  }

  private async aggregateManufacturerFacet(
    manufacturerMatch: Record<string, unknown>,
  ): Promise<{
    total: number;
    byStatus: Array<{ _id: number; count: number }>;
    verifiedActive: number;
    verifiedInactive: number;
  }> {
    const pipeline: any[] = [];
    if (Object.keys(manufacturerMatch).length > 0) {
      pipeline.push({ $match: manufacturerMatch });
    }
    pipeline.push({
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

    const rows = await this.manufacturerModel
      .aggregate<{
        total: { count: number }[];
        byStatus: { _id: number; count: number }[];
        verifiedActive: { count: number }[];
        verifiedInactive: { count: number }[];
      }>(pipeline)
      .exec();

    const payload = rows[0];
    return {
      total: payload?.total?.[0]?.count ?? 0,
      byStatus: payload?.byStatus ?? [],
      verifiedActive: payload?.verifiedActive?.[0]?.count ?? 0,
      verifiedInactive: payload?.verifiedInactive?.[0]?.count ?? 0,
    };
  }

  private async aggregatePaymentFacet(
    vendorScope: Record<string, unknown>,
  ): Promise<{
    total: number;
    paid: number;
    overdue: number;
    created: number;
  }> {
    const match =
      Object.keys(vendorScope).length > 0 ? vendorScope : undefined;

    const rows = await this.paymentDetailsModel
      .aggregate<{
        _id: number;
        count: number;
      }>([
        ...(match ? [{ $match: match }] : []),
        { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
      ])
      .exec();

    const byStatus = new Map<number, number>();
    for (const row of rows) {
      byStatus.set(Number(row._id ?? 0), row.count ?? 0);
    }

    const paid = byStatus.get(2) ?? 0;
    const overdue = byStatus.get(1) ?? 0;
    const created = byStatus.get(0) ?? 0;
    const cancelled = byStatus.get(3) ?? 0;

    return {
      total: paid + overdue + created + cancelled,
      paid,
      overdue,
      created,
    };
  }

  private async aggregateCompletedRevenue(
    vendorScope: Record<string, unknown>,
  ): Promise<{ amount: number; count: number }> {
    const match: Record<string, unknown> = {
      paymentStatus: PAYMENT_STATUS_PAID,
      ...vendorScope,
    };

    const rows = await this.paymentDetailsModel
      .aggregate<{
        amount: number;
        count: number;
      }>([
        { $match: match },
        {
          $group: {
            _id: null,
            amount: { $sum: '$quoteTotal' },
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    const row = rows[0];
    return {
      amount: roundRevenueAmount(row?.amount ?? 0),
      count: row?.count ?? 0,
    };
  }

  /**
   * Inquiry analytics snapshot for the admin dashboard.
   * All-time counts (not filtered by period) — contact + product enquiries.
   */
  async getInquiryAnalytics(): Promise<{
    totalEnquiries: number;
    contactEnquiries: number;
    productEnquiries: number;
    acknowledgedEnquiries: number;
    remindedEnquiries: number;
  }> {
    const contactMatch = {
      $or: [
        { inquiryType: 'contact' },
        { inquiryType: { $exists: false } },
        { inquiryType: null },
        { inquiryType: '' },
      ],
    };

    const [contactEnquiries, productEnquiries, acknowledgedEnquiries, remindedEnquiries] =
      await Promise.all([
        this.contactMessageModel.countDocuments(contactMatch).exec(),
        this.contactMessageModel.countDocuments({ inquiryType: 'product' }).exec(),
        this.contactMessageModel
          .countDocuments({ isAcknowledged: true })
          .exec(),
        this.contactMessageModel.countDocuments({ isReminded: true }).exec(),
      ]);

    return {
      totalEnquiries: contactEnquiries + productEnquiries,
      contactEnquiries,
      productEnquiries,
      acknowledgedEnquiries,
      remindedEnquiries,
    };
  }
}
