import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../../payments/schemas/payment-details.schema';
import type { DashboardMetricsQueryDto } from '../dto/dashboard-metrics-query.dto';
import type {
  AdminDashboardRevenueAnalytics,
  RevenuePaymentTypeKey,
  RevenueWeeklyComparisonPoint,
} from '../admin-dashboard-revenue.types';
import {
  bucketDateExpression,
  formatBucketLabel,
  resolvePreviousDashboardDateRange,
  resolveRevenueDashboardGranularity,
  revenuePeriodDisplayLabel,
  type ResolvedDashboardFilters,
} from '../utils/dashboard-metrics-filters.util';
import {
  buildPaymentRevenueBaseMatch,
  buildRevenueDistribution,
  emptyRevenueTypeTotals,
  formatWeekOfMonthBucketLabel,
  getDefaultRevenueChartMonthRange,
  normalizeRevenuePaymentTypeExpr,
  paymentRevenueRecognitionDateExpr,
  revenueScopeDescription,
  revenueWeekOfMonthBucketExpr,
  REVENUE_PAYMENT_TYPE_KEYS,
  REVENUE_PAYMENT_TYPE_LABELS,
  roundRevenueAmount,
} from '../utils/admin-dashboard-revenue.util';
import type { AppliedDashboardFilters } from '../admin-dashboard-metrics.types';

type FacetTotalsRow = {
  _id: string;
  amount: number;
  gstAmount: number;
  tdsAmount: number;
  count: number;
};

type FacetSeriesRow = {
  _id: {
    bucket: Record<string, number | undefined>;
    paymentType: string;
  };
  amount: number;
  count: number;
};

@Injectable()
export class AdminRevenueDashboardService {
  constructor(
    @InjectModel(PaymentDetails.name)
    private readonly paymentDetailsModel: Model<PaymentDetailsDocument>,
  ) {}

  async getRevenueAnalytics(
    filters: ResolvedDashboardFilters,
    query: DashboardMetricsQueryDto,
    appliedFilters: AppliedDashboardFilters,
    scopeUrns: string[] | undefined,
    scopedByProducts: boolean,
  ): Promise<AdminDashboardRevenueAnalytics> {
    const paymentMatch = buildPaymentRevenueBaseMatch(filters, scopeUrns);
    const granularity = filters.granularity;
    const useWeekOfMonth =
      query.period === 'this_month' ||
      query.period === 'last_month' ||
      (!query.period && !query.year && query.month === undefined);

    const bucketId = useWeekOfMonth
      ? revenueWeekOfMonthBucketExpr('revenueDate')
      : bucketDateExpression(granularity, 'revenueDate');

    const [facetResult, weeklyComparison] = await Promise.all([
      this.aggregateRevenueFacet(paymentMatch, bucketId),
      this.buildWeeklyComparison(filters, scopeUrns, query.period),
    ]);

    const byTypeRows = facetResult?.byType ?? [];
    const seriesRows = facetResult?.timeSeries ?? [];

    const totalsByType = this.mapTotalsByType(byTypeRows);
    const allTotals = this.sumAllTotals(totalsByType);
    const byTypeChart = buildRevenueDistribution(totalsByType, allTotals.amount);

    const { timeSeries, weeklyByType } = this.buildTimeSeries(
      seriesRows,
      granularity,
      useWeekOfMonth,
    );

    const periodTotals = {
      registration: totalsByType.registration,
      certification: totalsByType.certification,
      renewal: totalsByType.renew,
      all: allTotals,
    };

    const distribution = {
      totalRevenue: allTotals.amount,
      totalCount: allTotals.count,
      currency: 'INR' as const,
      centerLabel: 'Total Revenue',
      segments: byTypeChart,
    };

    return {
      appliedFilters: {
        ...appliedFilters,
        revenueScope: revenueScopeDescription(filters, scopedByProducts),
      },
      totals: periodTotals,
      periodTotals,
      charts: {
        granularity,
        byType: byTypeChart,
        timeSeries,
        weeklyByType,
      },
      distribution,
      weeklyComparison,
    };
  }

  private mapTotalsByType(byTypeRows: FacetTotalsRow[]) {
    const totalsByType: Record<
      RevenuePaymentTypeKey,
      ReturnType<typeof emptyRevenueTypeTotals>
    > = {
      registration: emptyRevenueTypeTotals(),
      certification: emptyRevenueTypeTotals(),
      renew: emptyRevenueTypeTotals(),
    };

    for (const row of byTypeRows) {
      const key = String(row._id ?? '').trim() as RevenuePaymentTypeKey;
      if (!REVENUE_PAYMENT_TYPE_KEYS.includes(key)) continue;
      totalsByType[key] = {
        amount: roundRevenueAmount(row.amount ?? 0),
        gstAmount: roundRevenueAmount(row.gstAmount ?? 0),
        tdsAmount: roundRevenueAmount(row.tdsAmount ?? 0),
        count: row.count ?? 0,
      };
    }
    return totalsByType;
  }

  private sumAllTotals(
    totalsByType: Record<RevenuePaymentTypeKey, ReturnType<typeof emptyRevenueTypeTotals>>,
  ) {
    return {
      amount: roundRevenueAmount(
        REVENUE_PAYMENT_TYPE_KEYS.reduce((sum, k) => sum + totalsByType[k].amount, 0),
      ),
      gstAmount: roundRevenueAmount(
        REVENUE_PAYMENT_TYPE_KEYS.reduce(
          (sum, k) => sum + totalsByType[k].gstAmount,
          0,
        ),
      ),
      tdsAmount: roundRevenueAmount(
        REVENUE_PAYMENT_TYPE_KEYS.reduce(
          (sum, k) => sum + totalsByType[k].tdsAmount,
          0,
        ),
      ),
      count: REVENUE_PAYMENT_TYPE_KEYS.reduce(
        (sum, k) => sum + totalsByType[k].count,
        0,
      ),
    };
  }

  private async aggregateRevenueFacet(
    paymentMatch: Record<string, unknown>,
    bucketId: Record<string, unknown>,
  ) {
    const [facetResult] = await this.paymentDetailsModel
      .aggregate<{
        byType: FacetTotalsRow[];
        timeSeries: FacetSeriesRow[];
      }>([
        { $match: paymentMatch },
        {
          $addFields: {
            revenueDate: paymentRevenueRecognitionDateExpr(),
            revenuePaymentType: normalizeRevenuePaymentTypeExpr(),
          },
        },
        {
          $facet: {
            byType: [
              {
                $group: {
                  _id: '$revenuePaymentType',
                  amount: { $sum: '$quoteTotal' },
                  gstAmount: { $sum: '$quoteGstAmount' },
                  tdsAmount: { $sum: '$quoteTdsAmount' },
                  count: { $sum: 1 },
                },
              },
            ],
            timeSeries: [
              {
                $group: {
                  _id: { bucket: bucketId, paymentType: '$revenuePaymentType' },
                  amount: { $sum: '$quoteTotal' },
                  count: { $sum: 1 },
                },
              },
            ],
          },
        },
      ])
      .exec();
    return facetResult;
  }

  private buildTimeSeries(
    seriesRows: FacetSeriesRow[],
    granularity: ResolvedDashboardFilters['granularity'],
    useWeekOfMonth: boolean,
  ) {
    const bucketByType = new Map<
      string,
      Record<RevenuePaymentTypeKey, { amount: number; count: number }>
    >();
    const bucketTotals = new Map<
      string,
      { bucket: string; amount: number; count: number }
    >();

    for (const row of seriesRows) {
      const paymentType = String(row._id?.paymentType ?? '').trim() as
        | RevenuePaymentTypeKey
        | string;
      if (!REVENUE_PAYMENT_TYPE_KEYS.includes(paymentType as RevenuePaymentTypeKey)) {
        continue;
      }
      const typedPaymentType = paymentType as RevenuePaymentTypeKey;
      const bucketLabel = useWeekOfMonth
        ? formatWeekOfMonthBucketLabel(row._id?.bucket ?? {})
        : formatBucketLabel(granularity, row._id?.bucket ?? {});
      const bucketKey = JSON.stringify(row._id?.bucket ?? {});
      const amount = roundRevenueAmount(row.amount ?? 0);
      const count = row.count ?? 0;

      const existingTotal = bucketTotals.get(bucketKey) ?? {
        bucket: bucketLabel,
        amount: 0,
        count: 0,
      };
      existingTotal.amount = roundRevenueAmount(existingTotal.amount + amount);
      existingTotal.count += count;
      bucketTotals.set(bucketKey, existingTotal);

      const perType =
        bucketByType.get(bucketKey) ??
        ({
          registration: { amount: 0, count: 0 },
          certification: { amount: 0, count: 0 },
          renew: { amount: 0, count: 0 },
        } as Record<RevenuePaymentTypeKey, { amount: number; count: number }>);
      perType[typedPaymentType].amount = roundRevenueAmount(
        perType[typedPaymentType].amount + amount,
      );
      perType[typedPaymentType].count += count;
      bucketByType.set(bucketKey, perType);
    }

    const sortedBucketKeys = [...bucketByType.keys()].sort((a, b) =>
      this.compareBucketKeys(
        JSON.parse(a),
        JSON.parse(b),
        useWeekOfMonth,
      ),
    );

    const buildPoints = (
      picker: (
        perType: Record<
          RevenuePaymentTypeKey,
          { amount: number; count: number }
        >,
      ) => { amount: number; count: number },
    ) =>
      sortedBucketKeys.map((bucketKey) => {
        const perType = bucketByType.get(bucketKey)!;
        const picked = picker(perType);
        return {
          bucket: bucketTotals.get(bucketKey)!.bucket,
          amount: picked.amount,
          count: picked.count,
        };
      });

    const timeSeries = [
      ...REVENUE_PAYMENT_TYPE_KEYS.map((key) => ({
        key,
        label: REVENUE_PAYMENT_TYPE_LABELS[key],
        points: buildPoints((perType) => perType[key]),
      })),
      {
        key: 'total' as const,
        label: 'Total Revenue',
        points: sortedBucketKeys.map((bucketKey) => {
          const total = bucketTotals.get(bucketKey)!;
          return {
            bucket: total.bucket,
            amount: total.amount,
            count: total.count,
          };
        }),
      },
    ];

    const weeklyByType = sortedBucketKeys.map((bucketKey) => {
      const perType = bucketByType.get(bucketKey)!;
      const total = bucketTotals.get(bucketKey)!;
      return {
        bucket: total.bucket,
        registration: perType.registration.amount,
        certification: perType.certification.amount,
        renewal: perType.renew.amount,
        total: total.amount,
      };
    });

    return { timeSeries, weeklyByType };
  }

  private compareBucketKeys(
    a: Record<string, number | undefined>,
    b: Record<string, number | undefined>,
    useWeekOfMonth: boolean,
  ): number {
    if ((a.year ?? 0) !== (b.year ?? 0)) return (a.year ?? 0) - (b.year ?? 0);
    if (useWeekOfMonth) {
      return (a.month ?? 0) - (b.month ?? 0) || (a.weekOfMonth ?? 0) - (b.weekOfMonth ?? 0);
    }
    if (a.month && b.month) return a.month - b.month;
    if (a.week && b.week) return a.week - b.week;
    if (a.quarter && b.quarter) return a.quarter - b.quarter;
    return 0;
  }

  private async buildWeeklyComparison(
    filters: ResolvedDashboardFilters,
    scopeUrns: string[] | undefined,
    period?: DashboardMetricsQueryDto['period'],
  ) {
    const now = new Date();
    const currentRange =
      filters.dateRange ?? getDefaultRevenueChartMonthRange(now);
    const previousRange = resolvePreviousDashboardDateRange(currentRange);

    const currentMatch = buildPaymentRevenueBaseMatch(
      { ...filters, dateRange: currentRange },
      scopeUrns,
    );
    const previousMatch = buildPaymentRevenueBaseMatch(
      { ...filters, dateRange: previousRange },
      scopeUrns,
    );

    const bucketId = revenueWeekOfMonthBucketExpr('revenueDate');

    const [currentRows, previousRows] = await Promise.all([
      this.aggregateWeeklyTotals(currentMatch, bucketId),
      this.aggregateWeeklyTotals(previousMatch, bucketId),
    ]);

    const currentMap = new Map(
      currentRows.map((r) => [
        formatWeekOfMonthBucketLabel(r._id),
        { amount: roundRevenueAmount(r.amount), count: r.count },
      ]),
    );
    const previousMap = new Map(
      previousRows.map((r) => [
        formatWeekOfMonthBucketLabel(r._id),
        { amount: roundRevenueAmount(r.amount), count: r.count },
      ]),
    );

    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5'];
    const buckets: RevenueWeeklyComparisonPoint[] = weeks.map((week) => ({
      week,
      currentAmount: currentMap.get(week)?.amount ?? 0,
      previousAmount: previousMap.get(week)?.amount ?? 0,
      currentCount: currentMap.get(week)?.count ?? 0,
      previousCount: previousMap.get(week)?.count ?? 0,
    }));

    const currentLabel = revenuePeriodDisplayLabel(period ?? 'this_month');
    const previousLabel =
      period === 'last_month' ? 'Month Before Last' : `Previous ${currentLabel}`;

    return {
      currentPeriodLabel: currentLabel,
      previousPeriodLabel: previousLabel,
      buckets,
    };
  }

  private async aggregateWeeklyTotals(
    paymentMatch: Record<string, unknown>,
    bucketId: Record<string, unknown>,
  ) {
    return this.paymentDetailsModel
      .aggregate<{
        _id: { weekOfMonth?: number };
        amount: number;
        count: number;
      }>([
        { $match: paymentMatch },
        {
          $addFields: {
            revenueDate: paymentRevenueRecognitionDateExpr(),
          },
        },
        {
          $group: {
            _id: bucketId,
            amount: { $sum: '$quoteTotal' },
            count: { $sum: 1 },
          },
        },
      ])
      .exec();
  }

  static resolveGranularity(
    query: DashboardMetricsQueryDto,
  ): ResolvedDashboardFilters['granularity'] {
    return resolveRevenueDashboardGranularity(query.period, query.granularity);
  }
}
