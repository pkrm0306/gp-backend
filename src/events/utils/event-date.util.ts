/** Parse admin/website date input (YYYY-MM-DD, DD-MM-YYYY, or ISO datetime). */
export function parseEventDateInput(raw: unknown): Date | null {
  const value = String(raw ?? '').trim();
  if (!value) return null;

  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const parsed = new Date(
      `${value.slice(6, 10)}-${value.slice(3, 5)}-${value.slice(0, 2)}`,
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toDateOnlyIso(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  const parsed = parseEventDateInput(value);
  return parsed ? parsed.toISOString().slice(0, 10) : '';
}

function startOfLocalDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function parseTimeOnDate(baseDate: Date, timeRaw: unknown): Date | null {
  const time = String(timeRaw ?? '').trim();
  if (!time) return null;

  const match12 = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hours = Number(match12[1]);
    const minutes = Number(match12[2]);
    const ampm = match12[3].toUpperCase();
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
    if (ampm === 'PM') hours = hours === 12 ? 12 : hours + 12;
    else hours = hours === 12 ? 0 : hours;
    const out = new Date(baseDate);
    out.setHours(hours, minutes, 0, 0);
    return out;
  }

  const match24 = time.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = Number(match24[1]);
    const minutes = Number(match24[2]);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    const out = new Date(baseDate);
    out.setHours(hours, minutes, 0, 0);
    return out;
  }

  return null;
}

export function resolveEventStartDate(event: Record<string, unknown>): Date | null {
  return (
    parseEventDateInput(event.eventStartDate) ??
    parseEventDateInput(event.eventDate) ??
    parseEventDateInput(event.date)
  );
}

export function resolveEventEndDate(event: Record<string, unknown>): Date | null {
  return (
    parseEventDateInput(event.eventEndDate) ??
    resolveEventStartDate(event)
  );
}

/** Event remains visible through the end date (and end time when provided). */
export function isEventVisibleOnWebsite(
  event: Record<string, unknown>,
  now = new Date(),
): boolean {
  const endDate = resolveEventEndDate(event);
  if (!endDate) return false;

  const endTime = parseTimeOnDate(endDate, event.eventEndTime);
  if (endTime) {
    return now.getTime() <= endTime.getTime();
  }

  const endOfDay = startOfLocalDay(endDate);
  endOfDay.setHours(23, 59, 59, 999);
  return now.getTime() <= endOfDay.getTime();
}

export function buildWebsiteVisibleEventsMatch(now = new Date()): Record<string, unknown> {
  const startOfToday = startOfLocalDay(now);
  return {
    $expr: {
      $gte: [
        {
          $ifNull: [
            '$eventEndDate',
            { $ifNull: ['$eventStartDate', '$eventDate'] },
          ],
        },
        startOfToday,
      ],
    },
  };
}
