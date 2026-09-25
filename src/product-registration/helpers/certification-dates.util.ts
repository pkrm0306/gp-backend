export type CertificationNotifyDates = {
  firstNotifyDate: Date;
  secondNotifyDate: Date;
  thirdNotifyDate: Date;
};

export type CertificationDateBundle = {
  certifiedDate: Date;
  validtillDate: Date;
} & CertificationNotifyDates;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Calendar month add/subtract; clamp day to last day of target month (e.g. Dec 31 − 1 mo → Nov 30). */
function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const lastDayOfMonth = new Date(
    d.getFullYear(),
    d.getMonth() + 1,
    0,
  ).getDate();
  d.setDate(Math.min(day, lastDayOfMonth));
  return d;
}

function subMonths(date: Date, months: number): Date {
  return addMonths(date, -months);
}

/**
 * Validity end for a newly certified product:
 * last calendar day of the month that is exactly 2 years after the
 * certification month (e.g. 2026-09-24 → 2028-09-30).
 *
 * Not “same calendar day + 2 years” — always month-end.
 */
export function computeValidTillFromCertified(certifiedDate: Date): Date {
  const base = startOfDay(certifiedDate);
  return startOfDay(
    new Date(base.getFullYear() + 2, base.getMonth() + 1, 0),
  );
}

/**
 * Notify offsets from validtill (calendar months), stored at start of day.
 *
 * | Field | Offset |
 * |-------|--------|
 * | firstNotifyDate | validtill − 3 months (first expiry reminder) |
 * | secondNotifyDate | validtill − 2 months (second / weekly window start) |
 * | thirdNotifyDate | validtill + 3 months (grace end / deactivation) |
 */
export function computeNotifyDates(
  validtillDate: Date,
): CertificationNotifyDates {
  const vt = startOfDay(validtillDate);
  return {
    firstNotifyDate: startOfDay(subMonths(vt, 3)),
    secondNotifyDate: startOfDay(subMonths(vt, 2)),
    thirdNotifyDate: computeGraceEndDate(validtillDate),
  };
}

/** End of the 3-month grace period after validtillDate. */
export function computeGraceEndDate(validtillDate: Date): Date {
  return startOfDay(addMonths(startOfDay(validtillDate), 3));
}

/** Full bundle when admin approves certification payment. */
export function computeCertificationDates(
  approvedAt: Date,
): CertificationDateBundle {
  const certifiedDate = approvedAt;
  const validtillDate = computeValidTillFromCertified(certifiedDate);
  const notify = computeNotifyDates(validtillDate);
  return {
    certifiedDate,
    validtillDate,
    ...notify,
  };
}
