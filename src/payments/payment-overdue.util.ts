/** Days after payment creation before vendor history treats status 0 as overdue. */
export const PAYMENT_OVERDUE_DAYS = 14;

export type VendorDisplayPaymentStatus = 0 | 1 | 2 | 3;

function startOfCalendarDay(value: Date): Date {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parsePaymentCreatedDate(
  value: unknown,
): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  const ddMmYyyy = raw.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddMmYyyy) {
    const day = Number(ddMmYyyy[1]);
    const month = Number(ddMmYyyy[2]) - 1;
    const year = Number(ddMmYyyy[3]);
    const d = new Date(year, month, day);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function differenceInCalendarDays(
  later: Date,
  earlier: Date,
): number {
  const end = startOfCalendarDay(later).getTime();
  const start = startOfCalendarDay(earlier).getTime();
  return Math.floor((end - start) / (24 * 60 * 60 * 1000));
}

export function isPaymentOverdue(
  paymentStatus: number,
  createdDate: unknown,
  referenceDate: Date = new Date(),
): boolean {
  if (Number(paymentStatus) !== 0) {
    return false;
  }
  const created = parsePaymentCreatedDate(createdDate);
  if (!created) {
    return false;
  }
  return (
    differenceInCalendarDays(referenceDate, created) >= PAYMENT_OVERDUE_DAYS
  );
}

/** Vendor payment history display status (0=over due, 1=pending, 2=paid, 3=rejected). */
export function resolveVendorDisplayPaymentStatus(
  paymentStatus: number,
  createdDate: unknown,
  referenceDate: Date = new Date(),
): VendorDisplayPaymentStatus {
  const status = Number(paymentStatus);
  if (status === 0) {
    return isPaymentOverdue(status, createdDate, referenceDate) ? 0 : 1;
  }
  if (status === 1 || status === 2 || status === 3) {
    return status as VendorDisplayPaymentStatus;
  }
  return 1;
}

export function getPaymentOverdueCutoffDate(
  referenceDate: Date = new Date(),
): Date {
  const cutoff = startOfCalendarDay(referenceDate);
  cutoff.setDate(cutoff.getDate() - PAYMENT_OVERDUE_DAYS);
  return cutoff;
}

/** Mongo match for vendor history filters that map pending/overdue to created-date rules. */
export function buildVendorHistoryStatusClause(
  status: number,
  referenceDate: Date = new Date(),
): Record<string, unknown> {
  if (status === 2) {
    return { paymentStatus: 2 };
  }

  const cutoff = getPaymentOverdueCutoffDate(referenceDate);

  if (status === 0) {
    return {
      paymentStatus: 0,
      createdDate: { $lte: cutoff },
    };
  }

  if (status === 1) {
    return {
      $or: [
        { paymentStatus: 1 },
        {
          paymentStatus: 0,
          createdDate: { $gt: cutoff },
        },
      ],
    };
  }

  return { paymentStatus: status };
}
