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
 * Validity end date for a newly certified product.
 *
 * Default rule: Dec 31 of (certified year + 2).
 *
 * Special business rule (2026 issuance window):
 * - 2026-01-01 .. 2026-04-30  => 2027-12-31
 * - 2026-05-01 .. 2026-12-31  => 2028-12-31
 */
export function computeValidTillFromCertified(certifiedDate: Date): Date {
  const y = certifiedDate.getFullYear();
  if (y === 2026) {
    const month = certifiedDate.getMonth(); // 0-based
    const day = certifiedDate.getDate();

    // Jan 1 .. Apr 30
    if (month < 4 || (month === 3 && day <= 30)) {
      return startOfDay(new Date(2027, 11, 31));
    }
    // May 1 .. Dec 31
    return startOfDay(new Date(2028, 11, 31));
  }

  return startOfDay(new Date(y + 2, 11, 31));
}

/** Notify offsets from validtill (calendar months), stored at start of day. */
export function computeNotifyDates(
  validtillDate: Date,
): CertificationNotifyDates {
  const vt = startOfDay(validtillDate);
  return {
    firstNotifyDate: startOfDay(subMonths(vt, 2)),
    secondNotifyDate: startOfDay(subMonths(vt, 1)),
    thirdNotifyDate: computeGraceEndDate(validtillDate),
  };
}

/** End of the 1-month grace period after validtillDate. */
export function computeGraceEndDate(validtillDate: Date): Date {
  return startOfDay(addMonths(startOfDay(validtillDate), 1));
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
