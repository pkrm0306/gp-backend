export const CRON_TIMEZONE = 'Asia/Kolkata';

/** Calendar YYYY-MM-DD in the given IANA timezone. */
export function toIsoDateInTimeZone(date: Date, timeZone = CRON_TIMEZONE): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function todayIsoInTimeZone(timeZone = CRON_TIMEZONE): string {
  return toIsoDateInTimeZone(new Date(), timeZone);
}

export function isSameCalendarDayInTimeZone(
  a: Date | string | null | undefined,
  b: Date | string | null | undefined,
  timeZone = CRON_TIMEZONE,
): boolean {
  if (!a || !b) return false;
  const da = a instanceof Date ? a : new Date(a);
  const db = b instanceof Date ? b : new Date(b);
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return false;
  return toIsoDateInTimeZone(da, timeZone) === toIsoDateInTimeZone(db, timeZone);
}

/** Whole calendar days from earlier → later (legacy PHP daysBetween-style). */
export function calendarDaysBetween(
  earlier: Date | string,
  later: Date | string,
  timeZone = CRON_TIMEZONE,
): number {
  const startIso = toIsoDateInTimeZone(
    earlier instanceof Date ? earlier : new Date(earlier),
    timeZone,
  );
  const endIso = toIsoDateInTimeZone(
    later instanceof Date ? later : new Date(later),
    timeZone,
  );
  const startMs = Date.parse(`${startIso}T00:00:00.000Z`);
  const endMs = Date.parse(`${endIso}T00:00:00.000Z`);
  return Math.round((endMs - startMs) / 86_400_000);
}

export function addCalendarDays(isoDate: string, days: number, timeZone = CRON_TIMEZONE): string {
  const base = new Date(`${isoDate}T12:00:00.000Z`);
  base.setUTCDate(base.getUTCDate() + days);
  return toIsoDateInTimeZone(base, timeZone);
}

/** Year of (today − months) in IST — used for deactivation template. */
export function yearMonthsAgoInTimeZone(
  months: number,
  timeZone = CRON_TIMEZONE,
): number {
  const now = new Date();
  const iso = toIsoDateInTimeZone(now, timeZone);
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1 - months, d, 12));
  return dt.getUTCFullYear();
}
