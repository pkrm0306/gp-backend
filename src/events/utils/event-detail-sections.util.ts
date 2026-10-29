import { BadRequestException } from '@nestjs/common';
import {
  EVENT_FORMATS,
  EventFormat,
} from '../schemas/event.schema';

export const EVENT_WHO_SHOULD_ATTEND_MAX = 20;
export const EVENT_WHO_SHOULD_ATTEND_ITEM_MAX = 100;
export const EVENT_KEY_THEMES_MAX = 20;
export const EVENT_KEY_THEME_HEADING_MAX = 80;
export const EVENT_KEY_THEME_DESCRIPTION_MAX = 400;
/** Max inclusive calendar days for an event date range. */
export const EVENT_PROGRAMME_MAX_DAYS = 30;
/** Max programme slot rows per event (multi-day × multiple slots per day). */
export const EVENT_PROGRAMME_MAX_ENTRIES = 300;
export const EVENT_PROGRAMME_TIME_MAX = 80;
export const EVENT_PROGRAMME_DESCRIPTION_MAX = 2000;
export const EVENT_VENUE_AND_TRAVEL_MAX = 5000;
export const EVENT_TAGS_MAX = 20;
export const EVENT_TAG_ITEM_MAX = 40;

export type EventKeyThemeRow = {
  heading: string;
  description: string;
};

export type EventProgrammeAtAGlanceRow = {
  /** 1-based day index within the event date range. */
  day: number;
  /** Optional ISO date (YYYY-MM-DD) for the programme day. */
  date?: string;
  time: string;
  description: string;
};

function readTrim(value: unknown): string {
  return String(value ?? '').trim();
}

/**
 * Multipart parsers often turn arrays into objects with numeric keys
 * (`{ "0": {...}, "1": {...} }`) instead of real arrays. Normalize those.
 */
function arrayFromNumericKeyedObject(raw: object): unknown[] | null {
  const keys = Object.keys(raw);
  if (keys.length === 0) return null;
  if (!keys.every((k) => /^\d+$/.test(k))) return null;
  return keys
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => (raw as Record<string, unknown>)[k]);
}

/**
 * Rebuild an array from flat multipart keys like:
 * `programmeAtAGlance[0][time]`, `programmeAtAGlance[0][description]`.
 */
export function collectIndexedFormArray(
  body: Record<string, unknown> | null | undefined,
  fieldNames: string[],
): unknown[] | undefined {
  if (!body || typeof body !== 'object') return undefined;

  const aliases = fieldNames.map((n) => n.toLowerCase());
  const byIndex = new Map<number, Record<string, unknown>>();

  for (const [rawKey, value] of Object.entries(body)) {
    const key = String(rawKey);
    const lower = key.toLowerCase();
    for (const alias of aliases) {
      // field[0][prop] or field[0].prop
      const match = lower.match(
        new RegExp(
          `^${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[(\\d+)\\](?:\\[([^\\]]+)\\]|\\.(\\w+))?$`,
        ),
      );
      if (!match) continue;
      const index = Number(match[1]);
      const prop = match[2] ?? match[3];
      const row = byIndex.get(index) ?? {};
      if (prop) {
        row[prop] = value;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(row, value as Record<string, unknown>);
      } else {
        row.value = value;
      }
      byIndex.set(index, row);
      break;
    }
  }

  if (byIndex.size === 0) return undefined;
  return [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, row]) => row);
}

/** Pick an array field from multipart/JSON body (JSON string, array, or indexed object/keys). */
export function pickFormArrayField(
  body: Record<string, unknown> | null | undefined,
  fieldNames: string[],
): unknown {
  if (!body || typeof body !== 'object') return undefined;

  for (const name of fieldNames) {
    if (body[name] !== undefined) return body[name];
  }

  const lowerMap = new Map(
    Object.keys(body).map((k) => [k.toLowerCase(), k] as const),
  );
  for (const name of fieldNames) {
    const actual = lowerMap.get(name.toLowerCase());
    if (actual !== undefined && body[actual] !== undefined) {
      return body[actual];
    }
  }

  return collectIndexedFormArray(body, fieldNames);
}

function parseArrayRaw(raw: unknown, fieldName: string): unknown[] {
  if (raw === undefined || raw === null) {
    return [];
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && typeof parsed === 'object') {
        const fromKeys = arrayFromNumericKeyedObject(parsed);
        return fromKeys ?? [parsed];
      }
      throw new Error('invalid');
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException(`${fieldName} must be a valid JSON array`);
    }
  }
  if (Array.isArray(raw)) {
    return raw;
  }
  if (typeof raw === 'object') {
    const fromKeys = arrayFromNumericKeyedObject(raw);
    if (fromKeys) return fromKeys;
    return [raw];
  }
  throw new BadRequestException(`${fieldName} must be an array`);
}

function normalizeStringList(
  raw: unknown,
  options: {
    fieldName: string;
    maxItems: number;
    maxItemLength: number;
  },
): string[] {
  const items = parseArrayRaw(raw, options.fieldName);
  const errors: Record<string, string> = {};
  const out: string[] = [];

  items.forEach((item, index) => {
    const text =
      typeof item === 'string' || typeof item === 'number'
        ? readTrim(item)
        : readTrim(
            (item as Record<string, unknown>)?.text ??
              (item as Record<string, unknown>)?.label ??
              (item as Record<string, unknown>)?.value,
          );
    if (!text) {
      return;
    }
    if (text.length > options.maxItemLength) {
      errors[`${options.fieldName}[${index}]`] =
        `Maximum ${options.maxItemLength} characters are allowed.`;
    }
    out.push(text);
  });

  if (out.length > options.maxItems) {
    errors[`${options.fieldName}.max`] =
      `Maximum ${options.maxItems} items are allowed.`;
  }

  if (Object.keys(errors).length > 0) {
    throw new BadRequestException({
      message: 'Validation failed',
      fieldErrors: errors,
      errors,
    });
  }

  return out;
}

/** Inclusive day count between start/end dates (minimum 1). */
export function computeEventDayCount(
  startDate: Date | null | undefined,
  endDate: Date | null | undefined,
): number {
  if (!startDate || Number.isNaN(startDate.getTime())) {
    return 1;
  }
  const end =
    endDate && !Number.isNaN(endDate.getTime()) ? endDate : startDate;
  const startUtc = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate(),
  );
  const endUtc = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
  );
  const days = Math.floor((endUtc - startUtc) / 86_400_000) + 1;
  if (!Number.isFinite(days) || days < 1) return 1;
  return Math.min(days, EVENT_PROGRAMME_MAX_DAYS);
}

/** Validate and normalize "Who should attend" audience list. */
export function normalizeWhoShouldAttendInput(
  raw: unknown,
): string[] | undefined {
  if (raw === undefined) return undefined;
  return normalizeStringList(raw, {
    fieldName: 'whoShouldAttend',
    maxItems: EVENT_WHO_SHOULD_ATTEND_MAX,
    maxItemLength: EVENT_WHO_SHOULD_ATTEND_ITEM_MAX,
  });
}

/** Validate and normalize key themes (heading + description). */
export function normalizeKeyThemesInput(
  raw: unknown,
): EventKeyThemeRow[] | undefined {
  if (raw === undefined) return undefined;
  const items = parseArrayRaw(raw, 'keyThemes');
  const errors: Record<string, string> = {};
  const out: EventKeyThemeRow[] = [];

  items.forEach((item, index) => {
    const rec = (item ?? {}) as Record<string, unknown>;
    const heading = readTrim(
      rec.heading ?? rec.title ?? rec.label ?? rec.name,
    );
    const description = readTrim(
      rec.description ?? rec.text ?? rec.body ?? rec.detail,
    );
    const prefix = `keyThemes[${index}]`;

    if (!heading && !description) {
      return;
    }

    if (!heading) {
      errors[`${prefix}.heading`] = 'Key theme heading is required.';
    } else if (heading.length > EVENT_KEY_THEME_HEADING_MAX) {
      errors[`${prefix}.heading`] =
        `Maximum ${EVENT_KEY_THEME_HEADING_MAX} characters are allowed.`;
    }

    if (!description) {
      errors[`${prefix}.description`] = 'Key theme description is required.';
    } else if (description.length > EVENT_KEY_THEME_DESCRIPTION_MAX) {
      errors[`${prefix}.description`] =
        `Maximum ${EVENT_KEY_THEME_DESCRIPTION_MAX} characters are allowed.`;
    }

    out.push({ heading, description });
  });

  if (out.length > EVENT_KEY_THEMES_MAX) {
    errors['keyThemes.max'] =
      `Maximum ${EVENT_KEY_THEMES_MAX} key themes are allowed.`;
  }

  if (Object.keys(errors).length > 0) {
    throw new BadRequestException({
      message: 'Validation failed',
      fieldErrors: errors,
      errors,
    });
  }

  return out;
}

/**
 * Admin UI groups programme slots as `{ day, date?, items: [{ time, description }] }`.
 * Expand those wrappers (and similar nested shapes) into a flat slot list before validate.
 * Without this, nested day payloads look empty (no top-level time/description) and only
 * accidentally flat day-1 rows survive — other days appear "deleted".
 */
function expandProgrammeRawItems(items: unknown[]): unknown[] {
  const out: unknown[] = [];

  items.forEach((item, index) => {
    if (typeof item === 'string' || typeof item === 'number') {
      out.push(item);
      return;
    }
    if (Array.isArray(item)) {
      // Rare: day bucket sent as a bare array of slots.
      item.forEach((slot) => {
        if (slot && typeof slot === 'object' && !Array.isArray(slot)) {
          const slotRec = slot as Record<string, unknown>;
          if (slotRec.day == null && slotRec.dayNumber == null && slotRec.dayIndex == null) {
            out.push({ ...slotRec, day: index + 1 });
            return;
          }
        }
        out.push(slot);
      });
      return;
    }
    if (!item || typeof item !== 'object') {
      return;
    }

    const rec = item as Record<string, unknown>;
    const nestedRaw =
      rec.items ?? rec.slots ?? rec.programme ?? rec.sessions ?? rec.entries;
    const nested = Array.isArray(nestedRaw)
      ? nestedRaw
      : nestedRaw && typeof nestedRaw === 'object'
        ? arrayFromNumericKeyedObject(nestedRaw as object)
        : null;

    if (nested && nested.length > 0) {
      const dayRaw = rec.day ?? rec.dayNumber ?? rec.dayIndex;
      const dayParsed =
        dayRaw === undefined || dayRaw === null || dayRaw === ''
          ? index + 1
          : Number(dayRaw);
      const day =
        Number.isFinite(dayParsed) && dayParsed >= 1
          ? Math.floor(dayParsed)
          : index + 1;
      const dateRaw = readTrim(rec.date ?? rec.eventDate ?? rec.event_date);
      const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? dateRaw : undefined;

      nested.forEach((slot) => {
        if (slot && typeof slot === 'object' && !Array.isArray(slot)) {
          const slotRec = slot as Record<string, unknown>;
          out.push({
            ...slotRec,
            day:
              slotRec.day ??
              slotRec.dayNumber ??
              slotRec.dayIndex ??
              day,
            ...(date &&
            !readTrim(slotRec.date ?? slotRec.eventDate ?? slotRec.event_date)
              ? { date }
              : {}),
          });
        } else {
          out.push(slot);
        }
      });
      return;
    }

    out.push(item);
  });

  return out;
}

/**
 * Validate and normalize "Programme at a glance".
 * Any number of entries is allowed (including multiple per day); each requires time + description.
 * Accepts flat `{ day?, time, description }` rows or nested `{ day, items: [...] }` day wrappers
 * (admin UI shape). Optional `day` (1-based) groups slots under an event day; defaults to index + 1.
 * At least one entry is required when the field is sent.
 */
export function normalizeProgrammeAtAGlanceInput(
  raw: unknown,
): EventProgrammeAtAGlanceRow[] | undefined {
  if (raw === undefined) return undefined;

  const items = expandProgrammeRawItems(
    parseArrayRaw(raw, 'programmeAtAGlance'),
  );
  const errors: Record<string, string> = {};
  const out: EventProgrammeAtAGlanceRow[] = [];

  items.forEach((item, index) => {
    // Plain string row → treat as description (time optional via "HH:MM - text" later).
    if (typeof item === 'string' || typeof item === 'number') {
      const text = readTrim(item);
      if (!text) return;
      out.push({ day: index + 1, time: '', description: text });
      errors[`programmeAtAGlance[${index}].time`] =
        'Programme time is required.';
      return;
    }

    const rec = (item ?? {}) as Record<string, unknown>;
    const time = readTrim(
      rec.time ??
        rec.tym ??
        rec.slot ??
        rec.timing ??
        rec.startTime ??
        rec.start_time ??
        rec.eventTime ??
        rec.event_time,
    );
    const description = readTrim(
      rec.description ??
        rec.text ??
        rec.body ??
        rec.detail ??
        rec.agenda ??
        rec.title ??
        rec.heading ??
        rec.name ??
        rec.value,
    );
    const dayRaw = rec.day ?? rec.dayNumber ?? rec.dayIndex;
    const dayParsed =
      dayRaw === undefined || dayRaw === null || dayRaw === ''
        ? index + 1
        : Number(dayRaw);
    const dateRaw = readTrim(rec.date ?? rec.eventDate ?? rec.event_date);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? dateRaw : undefined;
    const prefix = `programmeAtAGlance[${index}]`;

    if (!time && !description) {
      return;
    }

    if (!time) {
      errors[`${prefix}.time`] = 'Programme time is required.';
    } else if (time.length > EVENT_PROGRAMME_TIME_MAX) {
      errors[`${prefix}.time`] =
        `Maximum ${EVENT_PROGRAMME_TIME_MAX} characters are allowed.`;
    }

    if (!description) {
      errors[`${prefix}.description`] = 'Programme description is required.';
    } else if (description.length > EVENT_PROGRAMME_DESCRIPTION_MAX) {
      errors[`${prefix}.description`] =
        `Maximum ${EVENT_PROGRAMME_DESCRIPTION_MAX} characters are allowed.`;
    }

    const day =
      Number.isFinite(dayParsed) && dayParsed >= 1
        ? Math.floor(dayParsed)
        : index + 1;

    out.push({
      day,
      ...(date ? { date } : {}),
      time,
      description,
    });
  });

  if (out.length < 1) {
    errors['programmeAtAGlance.min'] =
      'At least one programme at a glance entry is required.';
  }

  if (out.length > EVENT_PROGRAMME_MAX_ENTRIES) {
    errors['programmeAtAGlance.max'] =
      `Maximum ${EVENT_PROGRAMME_MAX_ENTRIES} programme entries are allowed.`;
  }

  if (Object.keys(errors).length > 0) {
    throw new BadRequestException({
      message: 'Validation failed',
      fieldErrors: errors,
      errors,
    });
  }

  return out;
}

/** Validate and normalize venue and travel (plain/HTML text). */
export function normalizeVenueAndTravelInput(
  raw: unknown,
): string | undefined {
  if (raw === undefined) return undefined;
  const text = readTrim(raw);
  if (text.length > EVENT_VENUE_AND_TRAVEL_MAX) {
    throw new BadRequestException({
      message: 'Validation failed',
      fieldErrors: {
        venueAndTravel: `Maximum ${EVENT_VENUE_AND_TRAVEL_MAX} characters are allowed.`,
      },
      errors: {
        venueAndTravel: `Maximum ${EVENT_VENUE_AND_TRAVEL_MAX} characters are allowed.`,
      },
    });
  }
  return text;
}

/** Validate and normalize tags. */
export function normalizeEventTagsInput(raw: unknown): string[] | undefined {
  if (raw === undefined) return undefined;
  return normalizeStringList(raw, {
    fieldName: 'tags',
    maxItems: EVENT_TAGS_MAX,
    maxItemLength: EVENT_TAG_ITEM_MAX,
  });
}

export function mapWhoShouldAttendFromDoc(doc: {
  whoShouldAttend?: string[];
}): string[] {
  return Array.isArray(doc.whoShouldAttend)
    ? doc.whoShouldAttend.map((v) => readTrim(v)).filter(Boolean)
    : [];
}

export function mapKeyThemesFromDoc(doc: {
  keyThemes?: Array<{ heading?: string; description?: string } | string>;
}): EventKeyThemeRow[] {
  if (!Array.isArray(doc.keyThemes)) return [];
  return doc.keyThemes
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        const heading = readTrim(item);
        return heading ? { heading, description: '' } : null;
      }
      return {
        heading: readTrim((item as { heading?: string })?.heading),
        description: readTrim((item as { description?: string })?.description),
      };
    })
    .filter((item): item is EventKeyThemeRow =>
      Boolean(item && (item.heading || item.description)),
    );
}

export function mapProgrammeAtAGlanceFromDoc(doc: {
  programmeAtAGlance?: Array<{
    day?: number | string;
    date?: string;
    time?: string;
    description?: string;
  }>;
}): EventProgrammeAtAGlanceRow[] {
  if (!Array.isArray(doc.programmeAtAGlance)) return [];
  return doc.programmeAtAGlance
    .map((item, index) => {
      const dayParsed = Number(item?.day);
      const day =
        Number.isFinite(dayParsed) && dayParsed >= 1
          ? Math.floor(dayParsed)
          : index + 1;
      const dateRaw = readTrim(item?.date);
      const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? dateRaw : undefined;
      return {
        day,
        ...(date ? { date } : {}),
        time: readTrim(item?.time),
        description: readTrim(item?.description),
      };
    })
    .filter((item) => item.time || item.description);
}

export function mapVenueAndTravelFromDoc(doc: {
  venueAndTravel?: string;
}): string {
  return readTrim(doc.venueAndTravel);
}

export function mapEventTagsFromDoc(doc: { tags?: string[] }): string[] {
  return Array.isArray(doc.tags)
    ? doc.tags.map((v) => readTrim(v)).filter(Boolean)
    : [];
}

/**
 * Parse multipart/JSON checkbox multiselect for event format.
 * Accepts array, JSON string, comma-separated string, or numeric-keyed object.
 * Returns `undefined` when the field is omitted; otherwise a deduped list
 * (may be empty to clear). Callers should validate against EVENT_FORMATS.
 */
export function normalizeEventFormatInput(
  raw: unknown,
): EventFormat[] | undefined {
  if (raw === undefined || raw === null || raw === '') return undefined;

  let items: unknown[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return undefined;
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        items = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        items = trimmed.split(/[,|]/);
      }
    } else {
      items = trimmed.split(/[,|]/);
    }
  } else if (typeof raw === 'object') {
    const asArray = arrayFromNumericKeyedObject(raw as object);
    if (!asArray) return undefined;
    items = asArray;
  } else {
    return undefined;
  }

  const out: EventFormat[] = [];
  for (const item of items) {
    let v = readTrim(item).toLowerCase();
    if (!v) continue;
    if (v === 'in-person' || v === 'in_person') v = 'inperson';
    if (!out.includes(v as EventFormat)) out.push(v as EventFormat);
  }
  return out;
}

export function mapEventFormatFromDoc(doc: {
  format?: string[];
}): EventFormat[] {
  if (!Array.isArray(doc.format)) return [];
  const allowed = new Set<string>(EVENT_FORMATS);
  const out: EventFormat[] = [];
  for (const item of doc.format) {
    let v = readTrim(item).toLowerCase();
    if (v === 'in-person' || v === 'in_person') v = 'inperson';
    if (allowed.has(v) && !out.includes(v as EventFormat)) {
      out.push(v as EventFormat);
    }
  }
  return out;
}
