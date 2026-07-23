import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import { PRODUCT_STATUS_CERTIFIED, PRODUCT_STATUS_DISCONTINUED } from '../../renew/constants/product-status.constants';
import type { DashboardMetricsQueryDto } from '../dto/dashboard-metrics-query.dto';
import type { ResolvedDashboardFilters } from '../utils/dashboard-metrics-filters.util';
import {
  bucketDateExpression,
  buildAppliedDashboardFilters,
  buildProductSnapshotMatch,
  buildProductTrendMatch,
  formatBucketLabel,
  resolveManufacturerScopeIds,
  type DashboardGranularity,
} from '../utils/dashboard-metrics-filters.util';
import { buildUrnPipelineChart } from '../utils/admin-dashboard-pipeline.util';
import {
  buildProductStatusBreakdownFromCounts,
} from '../utils/admin-dashboard-product-status.util';
import type { AdminDashboardCharts } from '../admin-dashboard-metrics.types';
import type { AdminDashboardStatsBundle } from './admin-dashboard-stats.types';
import type { AdminDashboardRejectionTrend } from './admin-dashboard-rejection-trend.types';

@Injectable()
export class AdminDashboardStatsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  buildAppliedFilters(
    query: DashboardMetricsQueryDto,
    filters: ResolvedDashboardFilters,
  ) {
    return buildAppliedDashboardFilters(query, filters);
  }

  private certifiedActiveExpr(now: Date): Record<string, unknown> {
    return {
      $and: [
        { $eq: ['$productStatus', 2] },
        {
          $or: [
            { $eq: [{ $ifNull: ['$validtillDate', null] }, null] },
            { $gte: ['$validtillDate', now] },
          ],
        },
      ],
    };
  }

  private expiredExpr(now: Date): Record<string, unknown> {
    return {
      $or: [
        { $eq: ['$productStatus', PRODUCT_STATUS_DISCONTINUED] },
        {
          $and: [
            { $eq: ['$productStatus', 2] },
            { $ne: [{ $ifNull: ['$validtillDate', null] }, null] },
            { $lt: ['$validtillDate', now] },
          ],
        },
      ],
    };
  }

  /**
   * Same eligibility as `adminListRenewProducts` / Renew listing total
   * and dashboard "Renewal pending" KPI (EOI rows).
   */
  private buildRenewListMatch(
    filters: ResolvedDashboardFilters,
    thresholdDate: Date,
    applyDateRange: boolean,
  ): Record<string, unknown> {
    const match: Record<string, unknown> = {
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
    if (filters.categoryObjectId) {
      match.categoryId = filters.categoryObjectId;
    }
    const manufacturerIds = resolveManufacturerScopeIds(filters);
    if (manufacturerIds) {
      match.manufacturerId = { $in: manufacturerIds };
    }
    if (applyDateRange && filters.dateRange) {
      match.createdDate = {
        $gte: filters.dateRange.from,
        $lte: filters.dateRange.to,
      };
    }
    return match;
  }

  private compareChartBuckets(
    a: { year?: number; month?: number; quarter?: number; week?: number },
    b: { year?: number; month?: number; quarter?: number; week?: number },
    granularity: DashboardGranularity,
  ): number {
    const ay = a.year ?? 0;
    const by = b.year ?? 0;
    if (ay !== by) return ay - by;
    if (granularity === 'weekly') return (a.week ?? 0) - (b.week ?? 0);
    if (granularity === 'quarterly') {
      return (a.quarter ?? 0) - (b.quarter ?? 0);
    }
    return (a.month ?? 0) - (b.month ?? 0);
  }

  /**
   * Accurate widget counts — active products only, same rules as admin product list.
   * By default period/year filters do **not** change these totals (backlog snapshot).
   * Pass `applyDateRange: true` to scope by `createdDate` (executive summary KPIs).
   */
  async getProductWidgetStats(
    filters: ResolvedDashboardFilters,
    options?: { applyDateRange?: boolean },
  ) {
    const now = new Date();
    const applyDateRange = Boolean(options?.applyDateRange);
    const snapshotMatch = applyDateRange
      ? buildProductTrendMatch(filters, now)
      : buildProductSnapshotMatch(filters, now);
    const certifiedActive = this.certifiedActiveExpr(now);
    const expired = this.expiredExpr(now);
    const thresholdDate = new Date(now);
    thresholdDate.setDate(thresholdDate.getDate() + 60);
    const renewListMatch = this.buildRenewListMatch(
      filters,
      thresholdDate,
      applyDateRange,
    );

    const baseStages: any[] = [{ $match: snapshotMatch }];

    const [statusFacet, pipelineFacetRows, categoryRows, totalRow, renewalPendingCount] =
      await Promise.all([
      this.productModel
        .aggregate<{
          statusCounts: Array<{
            certified: number;
            uncertified: number;
            expired: number;
            rejected: number;
            pending: number;
            approved: number;
          }>;
        }>([
          ...baseStages,
          {
            $facet: {
              statusCounts: [
                {
                  $group: {
                    _id: null,
                    certified: { $sum: { $cond: [certifiedActive, 1, 0] } },
                    uncertified: {
                      $sum: {
                        $cond: [{ $in: ['$productStatus', [0, 1]] }, 1, 0],
                      },
                    },
                    expired: { $sum: { $cond: [expired, 1, 0] } },
                    rejected: {
                      $sum: {
                        $cond: [{ $eq: ['$productStatus', 3] }, 1, 0],
                      },
                    },
                    pending: {
                      $sum: {
                        $cond: [{ $eq: ['$productStatus', 0] }, 1, 0],
                      },
                    },
                    approved: {
                      $sum: {
                        $cond: [{ $eq: ['$productStatus', 1] }, 1, 0],
                      },
                    },
                  },
                },
              ],
            },
          },
        ])
        .exec(),
      this.productModel
        .aggregate<{
          inProgress: Array<{ _id: number; count: number }>;
          certified: Array<{ count: number }>;
        }>([
          ...baseStages,
          {
            $facet: {
              // Uncertified certification journey (EOI rows by urnStatus 0–10).
              inProgress: [
                {
                  $match: {
                    productStatus: { $in: [0, 1] },
                    urnStatus: { $gte: 0, $lte: 10 },
                  },
                },
                { $group: { _id: '$urnStatus', count: { $sum: 1 } } },
              ],
              // Certified stage = active certified EOIs (same rule as Certified listing).
              certified: [
                { $match: { $expr: certifiedActive } },
                { $count: 'count' },
              ],
            },
          },
        ])
        .exec(),
      this.productModel
        .aggregate<{
          name: string;
          certifiedProducts: number;
        }>([
          ...baseStages,
          { $match: { $expr: certifiedActive } },
          { $group: { _id: '$categoryId', certifiedProducts: { $sum: 1 } } },
          {
            $lookup: {
              from: 'categories',
              localField: '_id',
              foreignField: '_id',
              as: 'cat',
            },
          },
          {
            $project: {
              name: {
                $ifNull: [
                  { $arrayElemAt: ['$cat.category_name', 0] },
                  'Unknown',
                ],
              },
              certifiedProducts: 1,
            },
          },
          { $match: { certifiedProducts: { $gt: 0 } } },
          { $sort: { certifiedProducts: -1 } },
        ])
        .exec(),
      this.productModel.countDocuments(snapshotMatch).exec(),
      // Exact Renew listing total (same match as dashboard Renewal pending card).
      this.productModel.countDocuments(renewListMatch).exec(),
    ]);

    const row = statusFacet[0]?.statusCounts?.[0];
    const certified = row?.certified ?? 0;
    const uncertified = row?.uncertified ?? 0;
    const expiredCount = row?.expired ?? 0;
    const renewedCount = renewalPendingCount;
    const rejected = row?.rejected ?? 0;
    const pending = row?.pending ?? 0;
    const approved = row?.approved ?? 0;

    const productStatusBreakdown = buildProductStatusBreakdownFromCounts({
      certified,
      uncertified,
      expired: expiredCount,
      renewed: renewedCount,
      rejected,
    });

    const totalProducts = totalRow ?? 0;
    const uncertifiedForPie = Math.max(0, totalProducts - certified);
    /** Non-deleted registered EOIs across listing buckets (no double-count across buckets). */
    const registeredProducts =
      uncertified + certified + expiredCount + rejected;

    const categoryCertified = categoryRows.map((r) => ({
      name: r.name,
      certifiedProducts: r.certifiedProducts,
      products: r.certifiedProducts,
    }));

    const pipelineFacet = pipelineFacetRows[0];
    const pipelineByStatus = [
      ...(pipelineFacet?.inProgress ?? []).map((r) => ({
        status: Number(r._id ?? 0),
        count: r.count ?? 0,
      })),
      {
        status: 11,
        count: pipelineFacet?.certified?.[0]?.count ?? 0,
      },
    ];

    return {
      statusBreakdown: productStatusBreakdown,
      certifiedVsUncertified: {
        totals: {
          totalProducts,
          certifiedProducts: certified,
          uncertifiedProducts: uncertifiedForPie,
        },
        chart: [
          { key: 'certified', label: 'Certified', count: certified },
          { key: 'uncertified', label: 'Uncertified', count: uncertifiedForPie },
        ],
      },
      urnPipeline: buildUrnPipelineChart(pipelineByStatus),
      categoryCertified,
      statusCounts: {
        pending,
        approved,
        uncertified,
        certified,
        rejected,
        expired: expiredCount,
        total: registeredProducts,
      },
    };
  }

  async getTrendCharts(
    filters: ResolvedDashboardFilters,
    granularity: DashboardGranularity,
  ): Promise<
    Pick<
      AdminDashboardCharts,
      'monthlySubmissions' | 'monthlyCertified' | 'onlineOffline'
    >
  > {
    const now = new Date();
    const trendMatch = buildProductTrendMatch(filters, now);
    const createdBucketId = bucketDateExpression(granularity, 'createdDate');
    const certifiedBucketId = bucketDateExpression(granularity, 'certifiedDate');

    /**
     * Certified series must match Certified Products listing month filter:
     * active certified EOIs bucketed by `certifiedDate` (not `createdDate`).
     */
    const certifiedTrendMatch: Record<string, unknown> = {
      $and: [
        buildProductSnapshotMatch(filters, now),
        {
          productStatus: PRODUCT_STATUS_CERTIFIED,
          certifiedDate:
            filters.dateRange != null
              ? {
                  $gte: filters.dateRange.from,
                  $lte: filters.dateRange.to,
                }
              : { $exists: true, $ne: null },
          $or: [
            { validtillDate: null },
            { validtillDate: { $exists: false } },
            { validtillDate: { $gte: now } },
          ],
        },
      ],
    };

    const baseStages: any[] = [{ $match: trendMatch }];

    const [submissionRows, uncertifiedRows, certifiedOnlyRows, onlineOfflineRows] =
      await Promise.all([
        this.productModel
          .aggregate<{
            _id: {
              year?: number;
              month?: number;
              quarter?: number;
              week?: number;
            };
            count: number;
          }>([
            ...baseStages,
            { $group: { _id: createdBucketId, count: { $sum: 1 } } },
          ])
          .exec(),
        this.productModel
          .aggregate<{
            _id: {
              year?: number;
              month?: number;
              quarter?: number;
              week?: number;
            };
            uncertified: number;
          }>([
            ...baseStages,
            {
              $group: {
                _id: createdBucketId,
                uncertified: {
                  $sum: {
                    $cond: [{ $in: ['$productStatus', [0, 1]] }, 1, 0],
                  },
                },
              },
            },
          ])
          .exec(),
        this.productModel
          .aggregate<{
            _id: {
              year?: number;
              month?: number;
              quarter?: number;
              week?: number;
            };
            certified: number;
          }>([
            { $match: certifiedTrendMatch },
            {
              $group: {
                _id: certifiedBucketId,
                certified: { $sum: 1 },
              },
            },
          ])
          .exec(),
        this.productModel
          .aggregate<{
            _id: {
              year?: number;
              month?: number;
              quarter?: number;
              week?: number;
            };
            online: number;
            offline: number;
          }>([
            ...baseStages,
            {
              $group: {
                _id: createdBucketId,
                online: {
                  $sum: { $cond: [{ $eq: ['$productType', 0] }, 1, 0] },
                },
                offline: {
                  $sum: { $cond: [{ $eq: ['$productType', 1] }, 1, 0] },
                },
              },
            },
          ])
          .exec(),
      ]);

    type ChartBucketId = {
      year?: number;
      month?: number;
      quarter?: number;
      week?: number;
    };
    type ChartBucketRow = { _id: ChartBucketId };
    const sortBuckets = <T extends ChartBucketRow>(rows: T[]): T[] =>
      [...rows].sort((a, b) =>
        this.compareChartBuckets(a._id, b._id, granularity),
      );

    const bucketKey = (id: ChartBucketId): string =>
      `${id.year ?? 0}|${id.month ?? 0}|${id.quarter ?? 0}|${id.week ?? 0}`;

    const certifiedMap = new Map(
      certifiedOnlyRows.map((r) => [bucketKey(r._id), r.certified ?? 0]),
    );
    const uncertifiedMap = new Map(
      uncertifiedRows.map((r) => [bucketKey(r._id), r.uncertified ?? 0]),
    );
    const mergedIds = new Map<string, ChartBucketId>();
    for (const row of certifiedOnlyRows) {
      mergedIds.set(bucketKey(row._id), row._id);
    }
    for (const row of uncertifiedRows) {
      if ((row.uncertified ?? 0) > 0) {
        mergedIds.set(bucketKey(row._id), row._id);
      }
    }
    const monthlyCertified = sortBuckets(
      [...mergedIds.entries()].map(([key, id]) => ({
        _id: id,
        certified: certifiedMap.get(key) ?? 0,
        uncertified: uncertifiedMap.get(key) ?? 0,
      })),
    ).map((r) => ({
      month: formatBucketLabel(granularity, r._id),
      certified: r.certified,
      uncertified: r.uncertified,
    }));

    return {
      monthlySubmissions: sortBuckets(submissionRows).map((r) => ({
        month: formatBucketLabel(granularity, r._id),
        count: r.count,
      })),
      monthlyCertified,
      onlineOffline: sortBuckets(onlineOfflineRows).map((r) => ({
        month: formatBucketLabel(granularity, r._id),
        online: r.online,
        offline: r.offline,
      })),
    };
  }

  async getCharts(filters: ResolvedDashboardFilters): Promise<AdminDashboardCharts> {
    const [widgets, trends] = await Promise.all([
      // Analytics graphs respect global date + category (Overall = all-time).
      this.getProductWidgetStats(filters, { applyDateRange: true }),
      this.getTrendCharts(filters, filters.granularity),
    ]);

    return {
      categoryDistribution: widgets.categoryCertified.map((r) => ({
        name: r.name,
        products: r.certifiedProducts,
        sales: 0,
      })),
      categoryCertified: widgets.categoryCertified,
      productStatusBreakdown: widgets.statusBreakdown,
      certifiedVsUncertified: widgets.certifiedVsUncertified,
      urnPipeline: widgets.urnPipeline,
      ...trends,
    };
  }

  /**
   * Monthly (or weekly/quarterly) rejected product volume for the Rejection Trend area chart.
   * Buckets by `rejectedAt`, falling back to `updatedDate` for legacy rows.
   */
  async getRejectionTrend(
    filters: ResolvedDashboardFilters,
  ): Promise<AdminDashboardRejectionTrend> {
    const now = new Date();
    const granularity = filters.granularity ?? 'monthly';
    const snapshotMatch = buildProductSnapshotMatch(filters, now);
    const rejectedMatch: Record<string, unknown> = {
      ...snapshotMatch,
      productStatus: 3,
    };

    const dateMatch: Record<string, unknown> = { ...rejectedMatch };
    if (filters.dateRange) {
      dateMatch.$expr = {
        $and: [
          {
            $gte: [
              { $ifNull: ['$rejectedAt', '$updatedDate'] },
              filters.dateRange.from,
            ],
          },
          {
            $lte: [
              { $ifNull: ['$rejectedAt', '$updatedDate'] },
              filters.dateRange.to,
            ],
          },
        ],
      };
    }

    const bucketId = bucketDateExpression(
      granularity,
      'rejectionDate',
    );

    const [trendRows, rejectedInRange, totalRejected] = await Promise.all([
      this.productModel
        .aggregate<{
          _id: {
            year?: number;
            month?: number;
            quarter?: number;
            week?: number;
          };
          count: number;
        }>([
          { $match: dateMatch },
          {
            $addFields: {
              rejectionDate: { $ifNull: ['$rejectedAt', '$updatedDate'] },
            },
          },
          { $group: { _id: bucketId, count: { $sum: 1 } } },
        ])
        .exec(),
      this.productModel.countDocuments(dateMatch).exec(),
      this.productModel.countDocuments(rejectedMatch).exec(),
    ]);

    const sortedRows = [...trendRows].sort((a, b) =>
      this.compareChartBuckets(a._id, b._id, granularity),
    );

    const chart = sortedRows.map((row) => ({
      label: formatBucketLabel(granularity, row._id),
      year: row._id.year ?? 0,
      month: row._id.month,
      quarter: row._id.quarter,
      week: row._id.week,
      count: row.count ?? 0,
    }));

    const maxCount = chart.reduce((max, point) => Math.max(max, point.count), 0);
    const suggestedMax = this.suggestRejectionTrendYMax(maxCount);
    const subtitle =
      granularity === 'weekly'
        ? 'Weekly rejected product volume'
        : granularity === 'quarterly'
          ? 'Quarterly rejected product volume'
          : 'Monthly rejected product volume';

    return {
      title: 'Rejection Trend',
      subtitle,
      unit: 'products',
      granularity,
      totals: {
        rejectedInRange,
        totalRejected,
      },
      chart,
      yAxis: {
        min: 0,
        suggestedMax,
      },
    };
  }

  private suggestRejectionTrendYMax(maxCount: number): number {
    if (maxCount <= 0) return 1;
    if (maxCount <= 1) return 1;
    if (maxCount <= 4) return 4;
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxCount)));
    const normalized = maxCount / magnitude;
    const nice =
      normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    return nice * magnitude;
  }
}
