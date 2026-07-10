import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../payments/schemas/payment-details.schema';
import {
  ActivityLog,
  ActivityLogDocument,
} from '../activity-log/schemas/activity-log.schema';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_REJECTED,
  PRODUCT_STATUS_SUBMITTED,
} from '../renew/constants/product-status.constants';
import type { VendorDashboardOverview } from './vendor-dashboard.types';
import {
  buildKpiCard,
  mapActivityLogToRecentItem,
  mapRecentEoiStatus,
  monthShortLabel,
  suggestAxisMax,
  vendorActiveProductMatch,
} from './vendor-dashboard.util';

@Injectable()
export class VendorDashboardOverviewService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(PaymentDetails.name)
    private readonly paymentDetailsModel: Model<PaymentDetailsDocument>,
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async getOverview(vendorId: Types.ObjectId): Promise<VendorDashboardOverview> {
    const now = new Date();
    const year = now.getFullYear();
    const baseMatch = vendorActiveProductMatch(vendorId);

    const [
      kpiCards,
      registrationCertificationTrend,
      productStatus,
      productsByCategory,
      recentEois,
      recentActivity,
      productOutcomesChart,
    ] = await Promise.all([
      this.buildKpiCards(vendorId, baseMatch, now),
      this.buildRegistrationCertificationTrend(vendorId, baseMatch, year),
      this.buildProductStatusDistribution(vendorId, baseMatch, now),
      this.buildProductsByCategory(vendorId, baseMatch),
      this.buildRecentEois(vendorId, baseMatch),
      this.buildRecentActivity(vendorId, now, 7),
      this.getProductOutcomesChart(vendorId),
    ]);

    return {
      kpiCards,
      registrationCertificationTrend,
      productStatus,
      productsByCategory,
      recentEois,
      recentActivity,
      productOutcomesChart,
    };
  }

  private monthRange(year: number, month: number): { from: Date; to: Date } {
    const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const to = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    return { from, to };
  }

  private async buildKpiCards(
    vendorId: Types.ObjectId,
    baseMatch: Record<string, unknown>,
    now: Date,
  ) {
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const [
      totalProducts,
      pendingApprovals,
      eoisSubmitted,
      urnsGenerated,
      certifiedProducts,
      paymentsDue,
      totalCurrent,
      totalPrevious,
      pendingCurrent,
      pendingPrevious,
      eoiCurrent,
      eoiPrevious,
      urnCurrent,
      urnPrevious,
      certifiedCurrent,
      certifiedPrevious,
    ] = await Promise.all([
      this.productModel.countDocuments(baseMatch).exec(),
      this.productModel
        .countDocuments({
          ...baseMatch,
          productStatus: { $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED] },
        })
        .exec(),
      this.productModel
        .countDocuments({
          ...baseMatch,
          productStatus: { $gte: PRODUCT_STATUS_SUBMITTED },
        })
        .exec(),
      this.productModel.distinct('urnNo', baseMatch).exec().then((r) => r.length),
      this.productModel
        .countDocuments({
          ...baseMatch,
          productStatus: PRODUCT_STATUS_CERTIFIED,
          $or: [
            { validtillDate: { $exists: false } },
            { validtillDate: null },
            { validtillDate: { $gte: now } },
          ],
        })
        .exec(),
      this.aggregatePaymentsDue(vendorId),
      this.countProductsCreatedInMonth(baseMatch, currentYear, currentMonth),
      this.countProductsCreatedInMonth(baseMatch, previousYear, previousMonth),
      this.countPendingInMonth(baseMatch, currentYear, currentMonth),
      this.countPendingInMonth(baseMatch, previousYear, previousMonth),
      this.countEoiSubmittedInMonth(baseMatch, currentYear, currentMonth),
      this.countEoiSubmittedInMonth(baseMatch, previousYear, previousMonth),
      this.countUrnsInMonth(baseMatch, currentYear, currentMonth),
      this.countUrnsInMonth(baseMatch, previousYear, previousMonth),
      this.countCertifiedInMonth(baseMatch, currentYear, currentMonth, now),
      this.countCertifiedInMonth(baseMatch, previousYear, previousMonth, now),
    ]);

    return [
      buildKpiCard({
        key: 'totalProducts',
        label: 'Total Products',
        value: totalProducts,
        currentMonth: totalCurrent,
        previousMonth: totalPrevious,
      }),
      buildKpiCard({
        key: 'pendingApprovals',
        label: 'Pending Approvals',
        value: pendingApprovals,
        currentMonth: pendingCurrent,
        previousMonth: pendingPrevious,
      }),
      buildKpiCard({
        key: 'eoisSubmitted',
        label: 'EOIs Submitted',
        value: eoisSubmitted,
        currentMonth: eoiCurrent,
        previousMonth: eoiPrevious,
      }),
      buildKpiCard({
        key: 'urnsGenerated',
        label: 'URNs Generated',
        value: urnsGenerated,
        currentMonth: urnCurrent,
        previousMonth: urnPrevious,
      }),
      buildKpiCard({
        key: 'certifiedProducts',
        label: 'Certified Products',
        value: certifiedProducts,
        currentMonth: certifiedCurrent,
        previousMonth: certifiedPrevious,
      }),
      buildKpiCard({
        key: 'paymentsDue',
        label: 'Payments Due',
        value: paymentsDue.amount,
        currentMonth: paymentsDue.currentMonthCount,
        previousMonth: paymentsDue.previousMonthCount,
        subLabel:
          paymentsDue.pendingInvoices > 0
            ? `${paymentsDue.pendingInvoices} pending invoice${paymentsDue.pendingInvoices === 1 ? '' : 's'}`
            : undefined,
        format: 'currency',
      }),
    ];
  }

  private async aggregatePaymentsDue(vendorId: Types.ObjectId): Promise<{
    amount: number;
    pendingInvoices: number;
    currentMonthCount: number;
    previousMonthCount: number;
  }> {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const dueMatch = {
      vendorId,
      paymentStatus: { $in: [0, 1] },
    };

    const [totals, currentCount, previousCount] = await Promise.all([
      this.paymentDetailsModel
        .aggregate<{ amount: number; count: number }>([
          { $match: dueMatch },
          {
            $group: {
              _id: null,
              amount: { $sum: '$quoteTotal' },
              count: { $sum: 1 },
            },
          },
        ])
        .exec(),
      this.countPaymentsCreatedInMonth(vendorId, currentYear, currentMonth),
      this.countPaymentsCreatedInMonth(vendorId, previousYear, previousMonth),
    ]);

    return {
      amount: Math.round(Number(totals[0]?.amount ?? 0)),
      pendingInvoices: totals[0]?.count ?? 0,
      currentMonthCount: currentCount,
      previousMonthCount: previousCount,
    };
  }

  private async countPaymentsCreatedInMonth(
    vendorId: Types.ObjectId,
    year: number,
    month: number,
  ): Promise<number> {
    const { from, to } = this.monthRange(year, month);
    return this.paymentDetailsModel
      .countDocuments({
        vendorId,
        paymentStatus: { $in: [0, 1] },
        createdDate: { $gte: from, $lte: to },
      })
      .exec();
  }

  private async countProductsCreatedInMonth(
    baseMatch: Record<string, unknown>,
    year: number,
    month: number,
  ): Promise<number> {
    const { from, to } = this.monthRange(year, month);
    return this.productModel
      .countDocuments({ ...baseMatch, createdDate: { $gte: from, $lte: to } })
      .exec();
  }

  private async countPendingInMonth(
    baseMatch: Record<string, unknown>,
    year: number,
    month: number,
  ): Promise<number> {
    const { from, to } = this.monthRange(year, month);
    return this.productModel
      .countDocuments({
        ...baseMatch,
        productStatus: { $in: [PRODUCT_STATUS_PENDING, PRODUCT_STATUS_SUBMITTED] },
        createdDate: { $gte: from, $lte: to },
      })
      .exec();
  }

  private async countEoiSubmittedInMonth(
    baseMatch: Record<string, unknown>,
    year: number,
    month: number,
  ): Promise<number> {
    const { from, to } = this.monthRange(year, month);
    return this.productModel
      .countDocuments({
        ...baseMatch,
        productStatus: { $gte: PRODUCT_STATUS_SUBMITTED },
        createdDate: { $gte: from, $lte: to },
      })
      .exec();
  }

  private async countUrnsInMonth(
    baseMatch: Record<string, unknown>,
    year: number,
    month: number,
  ): Promise<number> {
    const { from, to } = this.monthRange(year, month);
    const urns = await this.productModel.distinct('urnNo', {
      ...baseMatch,
      createdDate: { $gte: from, $lte: to },
    });
    return urns.filter(Boolean).length;
  }

  private async countCertifiedInMonth(
    baseMatch: Record<string, unknown>,
    year: number,
    month: number,
    now: Date,
  ): Promise<number> {
    const { from, to } = this.monthRange(year, month);
    return this.productModel
      .countDocuments({
        ...baseMatch,
        productStatus: PRODUCT_STATUS_CERTIFIED,
        certifiedDate: { $gte: from, $lte: to },
        $or: [
          { validtillDate: { $exists: false } },
          { validtillDate: null },
          { validtillDate: { $gte: now } },
        ],
      })
      .exec();
  }

  private static readonly PRODUCT_OUTCOMES_YEAR_WINDOW = 5;

  async getProductOutcomesChart(
    vendorId: Types.ObjectId,
    requestedYear?: number,
  ) {
    const baseMatch = vendorActiveProductMatch(vendorId);
    const currentYear = new Date().getFullYear();
    const availableYears = this.listAvailableProductYears(currentYear);
    const year = this.resolveChartYear(requestedYear, availableYears, currentYear);
    return this.buildProductOutcomesChart(baseMatch, year, availableYears);
  }

  private resolveChartYear(
    requestedYear: number | undefined,
    availableYears: number[],
    currentYear: number,
  ): number {
    if (
      typeof requestedYear === 'number' &&
      Number.isFinite(requestedYear) &&
      availableYears.includes(requestedYear)
    ) {
      return requestedYear;
    }
    return availableYears[0] ?? currentYear;
  }

  private listAvailableProductYears(currentYear: number): number[] {
    const years: number[] = [];
    for (let index = 0; index < VendorDashboardOverviewService.PRODUCT_OUTCOMES_YEAR_WINDOW; index += 1) {
      years.push(currentYear - index);
    }
    return years;
  }

  private async buildProductOutcomesChart(
    baseMatch: Record<string, unknown>,
    year: number,
    availableYears: number[],
  ) {
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    const [registrationRows, certificationRows, rejectionRows] = await Promise.all([
      this.productModel
        .aggregate<{ _id: number; count: number }>([
          {
            $match: {
              ...baseMatch,
              createdDate: { $gte: start, $lte: end },
            },
          },
          { $group: { _id: { $month: '$createdDate' }, count: { $sum: 1 } } },
        ])
        .exec(),
      this.productModel
        .aggregate<{ _id: number; count: number }>([
          {
            $match: {
              ...baseMatch,
              productStatus: PRODUCT_STATUS_CERTIFIED,
              certifiedDate: { $gte: start, $lte: end, $ne: null },
            },
          },
          {
            $group: { _id: { $month: '$certifiedDate' }, count: { $sum: 1 } },
          },
        ])
        .exec(),
      this.productModel
        .aggregate<{ _id: number; count: number }>([
          {
            $match: {
              ...baseMatch,
              productStatus: PRODUCT_STATUS_REJECTED,
              $or: [
                { rejectedAt: { $gte: start, $lte: end, $ne: null } },
                {
                  $and: [
                    { $or: [{ rejectedAt: null }, { rejectedAt: { $exists: false } }] },
                    { createdDate: { $gte: start, $lte: end } },
                  ],
                },
              ],
            },
          },
          {
            $group: {
              _id: {
                $month: { $ifNull: ['$rejectedAt', '$createdDate'] },
              },
              count: { $sum: 1 },
            },
          },
        ])
        .exec(),
    ]);

    const registered = new Map<number, number>();
    const certified = new Map<number, number>();
    const rejected = new Map<number, number>();

    for (const row of registrationRows) {
      registered.set(Number(row._id), row.count ?? 0);
    }
    for (const row of certificationRows) {
      certified.set(Number(row._id), row.count ?? 0);
    }
    for (const row of rejectionRows) {
      rejected.set(Number(row._id), row.count ?? 0);
    }

    const chart = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      return {
        label: monthShortLabel(month),
        month,
        year,
        registered: registered.get(month) ?? 0,
        certified: certified.get(month) ?? 0,
        rejected: rejected.get(month) ?? 0,
      };
    });

    const totals = chart.reduce(
      (acc, point) => ({
        registered: acc.registered + point.registered,
        certified: acc.certified + point.certified,
        rejected: acc.rejected + point.rejected,
      }),
      { registered: 0, certified: 0, rejected: 0 },
    );

    const maxValue = chart.reduce(
      (max, point) =>
        Math.max(max, point.registered + point.certified + point.rejected),
      0,
    );

    return {
      title: 'Product outcomes',
      subtitle: `Registered, certified, and rejected products in ${year}`,
      year,
      availableYears,
      chart,
      totals,
      yAxis: {
        min: 0,
        suggestedMax: suggestAxisMax(maxValue),
      },
    };
  }

  private async buildRegistrationCertificationTrend(
    vendorId: Types.ObjectId,
    baseMatch: Record<string, unknown>,
    year: number,
  ) {
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    const [registrationRows, certificationRows] = await Promise.all([
      this.productModel
        .aggregate<{ _id: number; count: number }>([
          {
            $match: {
              ...baseMatch,
              createdDate: { $gte: start, $lte: end },
            },
          },
          { $group: { _id: { $month: '$createdDate' }, count: { $sum: 1 } } },
        ])
        .exec(),
      this.productModel
        .aggregate<{ _id: number; count: number }>([
          {
            $match: {
              ...baseMatch,
              productStatus: PRODUCT_STATUS_CERTIFIED,
              certifiedDate: { $gte: start, $lte: end, $ne: null },
            },
          },
          {
            $group: { _id: { $month: '$certifiedDate' }, count: { $sum: 1 } },
          },
        ])
        .exec(),
    ]);

    const registrations = new Map<number, number>();
    const certifications = new Map<number, number>();
    for (const row of registrationRows) {
      registrations.set(Number(row._id), row.count ?? 0);
    }
    for (const row of certificationRows) {
      certifications.set(Number(row._id), row.count ?? 0);
    }

    const chart = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      return {
        label: monthShortLabel(month),
        month,
        year,
        registrations: registrations.get(month) ?? 0,
        certifications: certifications.get(month) ?? 0,
      };
    });

    const maxValue = chart.reduce(
      (max, point) =>
        Math.max(max, point.registrations, point.certifications),
      0,
    );

    return {
      title: 'Registration & Certification Trend',
      subtitle: 'Monthly overview for current year',
      year,
      chart,
      yAxis: {
        min: 0,
        suggestedMax: suggestAxisMax(maxValue),
      },
    };
  }

  private async buildProductStatusDistribution(
    vendorId: Types.ObjectId,
    baseMatch: Record<string, unknown>,
    now: Date,
  ) {
    const [pending, underReview, certified, rejected] = await Promise.all([
      this.productModel
        .countDocuments({ ...baseMatch, productStatus: PRODUCT_STATUS_PENDING })
        .exec(),
      this.productModel
        .countDocuments({ ...baseMatch, productStatus: PRODUCT_STATUS_SUBMITTED })
        .exec(),
      this.productModel
        .countDocuments({
          ...baseMatch,
          productStatus: PRODUCT_STATUS_CERTIFIED,
          $or: [
            { validtillDate: { $exists: false } },
            { validtillDate: null },
            { validtillDate: { $gte: now } },
          ],
        })
        .exec(),
      this.productModel
        .countDocuments({ ...baseMatch, productStatus: PRODUCT_STATUS_REJECTED })
        .exec(),
    ]);

    const chart = [
      {
        key: 'certified' as const,
        label: 'Certified',
        count: certified,
        color: '#22C55E',
      },
      {
        key: 'pending' as const,
        label: 'Pending',
        count: pending,
        color: '#3B82F6',
      },
      {
        key: 'underReview' as const,
        label: 'Under Review',
        count: underReview,
        color: '#F59E0B',
      },
      {
        key: 'rejected' as const,
        label: 'Rejected',
        count: rejected,
        color: '#EF4444',
      },
    ];

    return {
      title: 'Product Status',
      subtitle: 'Distribution overview',
      total: chart.reduce((sum, slice) => sum + slice.count, 0),
      chart,
    };
  }

  private async buildProductsByCategory(
    vendorId: Types.ObjectId,
    baseMatch: Record<string, unknown>,
  ) {
    const rows = await this.productModel
      .aggregate<{ name: string; count: number }>([
        { $match: baseMatch },
        { $group: { _id: '$categoryId', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $project: {
            name: {
              $ifNull: [
                { $arrayElemAt: ['$category.category_name', 0] },
                'Unknown',
              ],
            },
            count: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ])
      .exec();

    const maxCount = rows.reduce((max, row) => Math.max(max, row.count ?? 0), 0);

    return {
      title: 'Products by Category',
      subtitle: 'Top product categories',
      chart: rows.map((row) => ({
        name: row.name,
        count: row.count ?? 0,
      })),
      xAxis: {
        min: 0,
        suggestedMax: suggestAxisMax(maxCount),
      },
    };
  }

  private async buildRecentEois(
    vendorId: Types.ObjectId,
    baseMatch: Record<string, unknown>,
  ) {
    const rows = await this.productModel
      .aggregate([
        { $match: baseMatch },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $sort: { createdDate: -1, productId: -1 } },
        { $limit: 5 },
        {
          $project: {
            productId: 1,
            eoiNo: 1,
            productName: 1,
            urnNo: 1,
            productStatus: 1,
            urnStatus: 1,
            createdDate: 1,
            categoryName: {
              $ifNull: [
                { $arrayElemAt: ['$category.category_name', 0] },
                'Unknown',
              ],
            },
          },
        },
      ])
      .exec();

    return {
      title: 'Recent EOIs',
      subtitle: 'Latest expression of interest submissions',
      viewAllPath: '/vendor/products',
      items: rows.map((row) => {
        const status = mapRecentEoiStatus(
          Number(row.productStatus ?? 0),
          Number(row.urnStatus ?? 0),
        );
        return {
          productId: Number(row.productId ?? 0),
          eoiNo: String(row.eoiNo ?? ''),
          productName: String(row.productName ?? ''),
          categoryName: String(row.categoryName ?? 'Unknown'),
          date: row.createdDate
            ? new Date(row.createdDate as Date).toISOString().slice(0, 10)
            : '',
          status: status.status,
          statusKey: status.statusKey,
          statusVariant: status.statusVariant,
          urnNo: String(row.urnNo ?? ''),
        };
      }),
    };
  }

  private async buildRecentActivity(
    vendorId: Types.ObjectId,
    now: Date,
    days: number,
  ) {
    const from = new Date(now);
    from.setDate(from.getDate() - days);

    const logs = await this.activityLogModel
      .find({
        vendor_id: vendorId,
        created_at: { $gte: from, $lte: now },
      })
      .sort({ created_at: -1 })
      .limit(10)
      .lean()
      .exec();

    const urnNos = [...new Set(logs.map((log) => String(log.urn_no ?? '').trim()).filter(Boolean))];
    const products = urnNos.length
      ? await this.productModel
          .find({ vendorId, urnNo: { $in: urnNos }, productType: 0 })
          .select('urnNo productName productId')
          .lean()
          .exec()
      : [];

    const productByUrn = new Map<string, string>();
    for (const product of products) {
      const urn = String(product.urnNo ?? '').trim();
      if (!urn || productByUrn.has(urn)) continue;
      productByUrn.set(urn, String(product.productName ?? '').trim());
    }

    const items = logs.map((log) =>
      mapActivityLogToRecentItem({
        id: String(log._id),
        activity: String(log.activity ?? ''),
        activitiesId: Number(log.activities_id ?? 0),
        urnNo: String(log.urn_no ?? ''),
        productName: productByUrn.get(String(log.urn_no ?? '').trim()) ?? null,
        createdAt: log.created_at ? new Date(log.created_at) : now,
        now,
      }),
    );

    return {
      title: 'Recent Activity',
      subtitle: `Last ${days} days`,
      days,
      items,
    };
  }
}
