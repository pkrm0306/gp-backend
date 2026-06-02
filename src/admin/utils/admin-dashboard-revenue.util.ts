import type { ResolvedDashboardFilters } from './dashboard-metrics-filters.util';
import type { DashboardDateRange } from './dashboard-metrics-filters.util';
import type {
  RevenueChartSlice,
  RevenuePaymentTypeKey,
  RevenueTypeTotals,
} from '../admin-dashboard-revenue.types';

/**
 * Revenue-recognized payments: vendor-submitted (1) or admin-approved/completed (2).
 * Excludes created (0) and cancelled (3).
 */
export const REVENUE_RECOGNIZED_PAYMENT_STATUSES = [1, 2] as const;

export const REVENUE_PAYMENT_TYPE_KEYS: RevenuePaymentTypeKey[] = [
  'registration',
  'certification',
  'renew',
];

export const REVENUE_PAYMENT_TYPE_LABELS: Record<RevenuePaymentTypeKey, string> =
  {
    registration: 'Registration Fee',
    certification: 'Certificate Fee',
    renew: 'Renew Payment',
  };

/** Best-effort payment date for revenue bucketing / filters. */
export function paymentRevenueRecognitionDateExpr(): Record<string, unknown> {
  return {
    $ifNull: [
      '$paymentChequeDate',
      { $ifNull: ['$updatedDate', '$createdDate'] },
    ],
  };
}

export function buildPaymentRevenueDateRangeMatch(
  dateRange: DashboardDateRange,
): Record<string, unknown> {
  const { from, to } = dateRange;
  return {
    $or: [
      { paymentChequeDate: { $gte: from, $lte: to } },
      {
        $and: [
          {
            $or: [
              { paymentChequeDate: { $exists: false } },
              { paymentChequeDate: null },
            ],
          },
          { createdDate: { $gte: from, $lte: to } },
        ],
      },
      {
        $and: [
          {
            $or: [
              { paymentChequeDate: { $exists: false } },
              { paymentChequeDate: null },
            ],
          },
          { updatedDate: { $gte: from, $lte: to } },
        ],
      },
    ],
  };
}

export function buildPaymentRevenueBaseMatch(
  filters: ResolvedDashboardFilters,
  scopeUrns?: string[],
): Record<string, unknown> {
  const clauses: Record<string, unknown>[] = [
    { paymentStatus: { $in: [...REVENUE_RECOGNIZED_PAYMENT_STATUSES] } },
  ];

  if (filters.dateRange) {
    clauses.push(buildPaymentRevenueDateRangeMatch(filters.dateRange));
  }

  if (scopeUrns !== undefined) {
    clauses.push({
      urnNo: scopeUrns.length > 0 ? { $in: scopeUrns } : { $in: [] },
    });
  }

  return clauses.length === 1 ? clauses[0] : { $and: clauses };
}

export function normalizeRevenuePaymentTypeExpr(): Record<string, unknown> {
  return {
    $let: {
      vars: {
        raw: {
          $toLower: {
            $trim: { input: { $ifNull: ['$paymentType', ''] } },
          },
        },
      },
      in: {
        $switch: {
          branches: [
            {
              case: { $in: ['$$raw', ['renew', 'renewal', 'renew_payment']] },
              then: 'renew',
            },
            {
              case: {
                $in: [
                  '$$raw',
                  ['certification', 'certificate', 'cert', 'certificate_fee'],
                ],
              },
              then: 'certification',
            },
            {
              case: {
                $in: ['$$raw', ['registration', 'register', 'registration_fee']],
              },
              then: 'registration',
            },
          ],
          default: '$$raw',
        },
      },
    },
  };
}

/** Week index within calendar month (1–5) for W1…W5 charts. */
export function revenueWeekOfMonthBucketExpr(
  dateField = 'revenueDate',
): Record<string, unknown> {
  return {
    year: { $year: `$${dateField}` },
    month: { $month: `$${dateField}` },
    weekOfMonth: {
      $min: [
        5,
        {
          $ceil: {
            $divide: [{ $dayOfMonth: `$${dateField}` }, 7],
          },
        },
      ],
    },
  };
}

export function formatWeekOfMonthBucketLabel(bucket: {
  weekOfMonth?: number;
}): string {
  const w = bucket.weekOfMonth ?? 1;
  return `W${w}`;
}

export function emptyRevenueTypeTotals(): RevenueTypeTotals {
  return { amount: 0, gstAmount: 0, tdsAmount: 0, count: 0 };
}

export function roundRevenueAmount(value: number): number {
  return Number((value ?? 0).toFixed(2));
}

export function revenueScopeDescription(
  filters: ResolvedDashboardFilters,
  scopedByProducts: boolean,
): string {
  if (scopedByProducts) {
    return 'completed payments for URNs matching product filters (category, region, productStatus)';
  }
  if (filters.dateRange) {
    return 'paid/approved payments by payment date (cheque date, else created/updated) within dateRange';
  }
  return 'all paid/approved payments (platform-wide)';
}

export function buildRevenueDistribution(
  totalsByType: Record<RevenuePaymentTypeKey, RevenueTypeTotals>,
  totalAmount: number,
): RevenueChartSlice[] {
  return REVENUE_PAYMENT_TYPE_KEYS.map((key) => {
    const amount = totalsByType[key].amount;
    const count = totalsByType[key].count;
    const percentage =
      totalAmount > 0
        ? roundRevenueAmount((amount / totalAmount) * 100)
        : 0;
    return {
      key,
      label: REVENUE_PAYMENT_TYPE_LABELS[key],
      amount,
      count,
      percentage,
    };
  });
}

export function getDefaultRevenueChartMonthRange(now = new Date()): DashboardDateRange {
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
    to: now,
  };
}
