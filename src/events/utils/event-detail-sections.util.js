"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_TAG_ITEM_MAX = exports.EVENT_TAGS_MAX = exports.EVENT_VENUE_AND_TRAVEL_MAX = exports.EVENT_PROGRAMME_DESCRIPTION_MAX = exports.EVENT_PROGRAMME_TIME_MAX = exports.EVENT_PROGRAMME_MAX_ENTRIES = exports.EVENT_PROGRAMME_MAX_DAYS = exports.EVENT_KEY_THEME_DESCRIPTION_MAX = exports.EVENT_KEY_THEME_HEADING_MAX = exports.EVENT_KEY_THEMES_MAX = exports.EVENT_WHO_SHOULD_ATTEND_ITEM_MAX = exports.EVENT_WHO_SHOULD_ATTEND_MAX = void 0;
exports.collectIndexedFormArray = collectIndexedFormArray;
exports.pickFormArrayField = pickFormArrayField;
exports.computeEventDayCount = computeEventDayCount;
exports.normalizeWhoShouldAttendInput = normalizeWhoShouldAttendInput;
exports.normalizeKeyThemesInput = normalizeKeyThemesInput;
exports.normalizeProgrammeAtAGlanceInput = normalizeProgrammeAtAGlanceInput;
exports.normalizeVenueAndTravelInput = normalizeVenueAndTravelInput;
exports.normalizeEventTagsInput = normalizeEventTagsInput;
exports.mapWhoShouldAttendFromDoc = mapWhoShouldAttendFromDoc;
exports.mapKeyThemesFromDoc = mapKeyThemesFromDoc;
exports.mapProgrammeAtAGlanceFromDoc = mapProgrammeAtAGlanceFromDoc;
exports.mapVenueAndTravelFromDoc = mapVenueAndTravelFromDoc;
exports.mapEventTagsFromDoc = mapEventTagsFromDoc;
const common_1 = require("@nestjs/common");
exports.EVENT_WHO_SHOULD_ATTEND_MAX = 20;
exports.EVENT_WHO_SHOULD_ATTEND_ITEM_MAX = 100;
exports.EVENT_KEY_THEMES_MAX = 20;
exports.EVENT_KEY_THEME_HEADING_MAX = 80;
exports.EVENT_KEY_THEME_DESCRIPTION_MAX = 400;
/** Max inclusive calendar days for an event date range. */
exports.EVENT_PROGRAMME_MAX_DAYS = 30;
/** Max programme slot rows per event (multi-day × multiple slots per day). */
exports.EVENT_PROGRAMME_MAX_ENTRIES = 300;
exports.EVENT_PROGRAMME_TIME_MAX = 80;
exports.EVENT_PROGRAMME_DESCRIPTION_MAX = 2000;
exports.EVENT_VENUE_AND_TRAVEL_MAX = 5000;
exports.EVENT_TAGS_MAX = 20;
exports.EVENT_TAG_ITEM_MAX = 40;
function readTrim(value) {
    return String(value !== null && value !== void 0 ? value : '').trim();
}
/**
 * Multipart parsers often turn arrays into objects with numeric keys
 * (`{ "0": {...}, "1": {...} }`) instead of real arrays. Normalize those.
 */
function arrayFromNumericKeyedObject(raw) {
    const keys = Object.keys(raw);
    if (keys.length === 0)
        return null;
    if (!keys.every((k) => /^\d+$/.test(k)))
        return null;
    return keys
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => raw[k]);
}
/**
 * Rebuild an array from flat multipart keys like:
 * `programmeAtAGlance[0][time]`, `programmeAtAGlance[0][description]`.
 */
function collectIndexedFormArray(body, fieldNames) {
    var _a, _b;
    if (!body || typeof body !== 'object')
        return undefined;
    const aliases = fieldNames.map((n) => n.toLowerCase());
    const byIndex = new Map();
    for (const [rawKey, value] of Object.entries(body)) {
        const key = String(rawKey);
        const lower = key.toLowerCase();
        for (const alias of aliases) {
            // field[0][prop] or field[0].prop
            const match = lower.match(new RegExp(`^${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[(\\d+)\\](?:\\[([^\\]]+)\\]|\\.(\\w+))?$`));
            if (!match)
                continue;
            const index = Number(match[1]);
            const prop = (_a = match[2]) !== null && _a !== void 0 ? _a : match[3];
            const row = (_b = byIndex.get(index)) !== null && _b !== void 0 ? _b : {};
            if (prop) {
                row[prop] = value;
            }
            else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                Object.assign(row, value);
            }
            else {
                row.value = value;
            }
            byIndex.set(index, row);
            break;
        }
    }
    if (byIndex.size === 0)
        return undefined;
    return [...byIndex.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([, row]) => row);
}
/** Pick an array field from multipart/JSON body (JSON string, array, or indexed object/keys). */
function pickFormArrayField(body, fieldNames) {
    if (!body || typeof body !== 'object')
        return undefined;
    for (const name of fieldNames) {
        if (body[name] !== undefined)
            return body[name];
    }
    const lowerMap = new Map(Object.keys(body).map((k) => [k.toLowerCase(), k]));
    for (const name of fieldNames) {
        const actual = lowerMap.get(name.toLowerCase());
        if (actual !== undefined && body[actual] !== undefined) {
            return body[actual];
        }
    }
    return collectIndexedFormArray(body, fieldNames);
}
function parseArrayRaw(raw, fieldName) {
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
                return fromKeys !== null && fromKeys !== void 0 ? fromKeys : [parsed];
            }
            throw new Error('invalid');
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException)
                throw err;
            throw new common_1.BadRequestException(`${fieldName} must be a valid JSON array`);
        }
    }
    if (Array.isArray(raw)) {
        return raw;
    }
    if (typeof raw === 'object') {
        const fromKeys = arrayFromNumericKeyedObject(raw);
        if (fromKeys)
            return fromKeys;
        return [raw];
    }
    throw new common_1.BadRequestException(`${fieldName} must be an array`);
}
function normalizeStringList(raw, options) {
    const items = parseArrayRaw(raw, options.fieldName);
    const errors = {};
    const out = [];
    items.forEach((item, index) => {
        var _a, _b;
        const text = typeof item === 'string' || typeof item === 'number'
            ? readTrim(item)
            : readTrim((_b = (_a = item === null || item === void 0 ? void 0 : item.text) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.label) !== null && _b !== void 0 ? _b : item === null || item === void 0 ? void 0 : item.value);
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
        throw new common_1.BadRequestException({
            message: 'Validation failed',
            fieldErrors: errors,
            errors,
        });
    }
    return out;
}
/** Inclusive day count between start/end dates (minimum 1). */
function computeEventDayCount(startDate, endDate) {
    if (!startDate || Number.isNaN(startDate.getTime())) {
        return 1;
    }
    const end = endDate && !Number.isNaN(endDate.getTime()) ? endDate : startDate;
    const startUtc = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
    const endUtc = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
    const days = Math.floor((endUtc - startUtc) / 86400000) + 1;
    if (!Number.isFinite(days) || days < 1)
        return 1;
    return Math.min(days, exports.EVENT_PROGRAMME_MAX_DAYS);
}
/** Validate and normalize "Who should attend" audience list. */
function normalizeWhoShouldAttendInput(raw) {
    if (raw === undefined)
        return undefined;
    return normalizeStringList(raw, {
        fieldName: 'whoShouldAttend',
        maxItems: exports.EVENT_WHO_SHOULD_ATTEND_MAX,
        maxItemLength: exports.EVENT_WHO_SHOULD_ATTEND_ITEM_MAX,
    });
}
/** Validate and normalize key themes (heading + description). */
function normalizeKeyThemesInput(raw) {
    if (raw === undefined)
        return undefined;
    const items = parseArrayRaw(raw, 'keyThemes');
    const errors = {};
    const out = [];
    items.forEach((item, index) => {
        var _a, _b, _c, _d, _e, _f;
        const rec = (item !== null && item !== void 0 ? item : {});
        const heading = readTrim((_c = (_b = (_a = rec.heading) !== null && _a !== void 0 ? _a : rec.title) !== null && _b !== void 0 ? _b : rec.label) !== null && _c !== void 0 ? _c : rec.name);
        const description = readTrim((_f = (_e = (_d = rec.description) !== null && _d !== void 0 ? _d : rec.text) !== null && _e !== void 0 ? _e : rec.body) !== null && _f !== void 0 ? _f : rec.detail);
        const prefix = `keyThemes[${index}]`;
        if (!heading && !description) {
            return;
        }
        if (!heading) {
            errors[`${prefix}.heading`] = 'Key theme heading is required.';
        }
        else if (heading.length > exports.EVENT_KEY_THEME_HEADING_MAX) {
            errors[`${prefix}.heading`] =
                `Maximum ${exports.EVENT_KEY_THEME_HEADING_MAX} characters are allowed.`;
        }
        if (!description) {
            errors[`${prefix}.description`] = 'Key theme description is required.';
        }
        else if (description.length > exports.EVENT_KEY_THEME_DESCRIPTION_MAX) {
            errors[`${prefix}.description`] =
                `Maximum ${exports.EVENT_KEY_THEME_DESCRIPTION_MAX} characters are allowed.`;
        }
        out.push({ heading, description });
    });
    if (out.length > exports.EVENT_KEY_THEMES_MAX) {
        errors['keyThemes.max'] =
            `Maximum ${exports.EVENT_KEY_THEMES_MAX} key themes are allowed.`;
    }
    if (Object.keys(errors).length > 0) {
        throw new common_1.BadRequestException({
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
function expandProgrammeRawItems(items) {
    const out = [];
    items.forEach((item, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (typeof item === 'string' || typeof item === 'number') {
            out.push(item);
            return;
        }
        if (Array.isArray(item)) {
            // Rare: day bucket sent as a bare array of slots.
            item.forEach((slot) => {
                if (slot && typeof slot === 'object' && !Array.isArray(slot)) {
                    const slotRec = slot;
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
        const rec = item;
        const nestedRaw = (_d = (_c = (_b = (_a = rec.items) !== null && _a !== void 0 ? _a : rec.slots) !== null && _b !== void 0 ? _b : rec.programme) !== null && _c !== void 0 ? _c : rec.sessions) !== null && _d !== void 0 ? _d : rec.entries;
        const nested = Array.isArray(nestedRaw)
            ? nestedRaw
            : nestedRaw && typeof nestedRaw === 'object'
                ? arrayFromNumericKeyedObject(nestedRaw)
                : null;
        if (nested && nested.length > 0) {
            const dayRaw = (_f = (_e = rec.day) !== null && _e !== void 0 ? _e : rec.dayNumber) !== null && _f !== void 0 ? _f : rec.dayIndex;
            const dayParsed = dayRaw === undefined || dayRaw === null || dayRaw === ''
                ? index + 1
                : Number(dayRaw);
            const day = Number.isFinite(dayParsed) && dayParsed >= 1
                ? Math.floor(dayParsed)
                : index + 1;
            const dateRaw = readTrim((_h = (_g = rec.date) !== null && _g !== void 0 ? _g : rec.eventDate) !== null && _h !== void 0 ? _h : rec.event_date);
            const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? dateRaw : undefined;
            nested.forEach((slot) => {
                var _a, _b, _c, _d, _e;
                if (slot && typeof slot === 'object' && !Array.isArray(slot)) {
                    const slotRec = slot;
                    out.push({
                        ...slotRec,
                        day: (_c = (_b = (_a = slotRec.day) !== null && _a !== void 0 ? _a : slotRec.dayNumber) !== null && _b !== void 0 ? _b : slotRec.dayIndex) !== null && _c !== void 0 ? _c : day,
                        ...(date &&
                            !readTrim((_e = (_d = slotRec.date) !== null && _d !== void 0 ? _d : slotRec.eventDate) !== null && _e !== void 0 ? _e : slotRec.event_date)
                            ? { date }
                            : {}),
                    });
                }
                else {
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
function normalizeProgrammeAtAGlanceInput(raw) {
    if (raw === undefined)
        return undefined;
    const items = expandProgrammeRawItems(parseArrayRaw(raw, 'programmeAtAGlance'));
    const errors = {};
    const out = [];
    items.forEach((item, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        // Plain string row → treat as description (time optional via "HH:MM - text" later).
        if (typeof item === 'string' || typeof item === 'number') {
            const text = readTrim(item);
            if (!text)
                return;
            out.push({ day: index + 1, time: '', description: text });
            errors[`programmeAtAGlance[${index}].time`] =
                'Programme time is required.';
            return;
        }
        const rec = (item !== null && item !== void 0 ? item : {});
        const time = readTrim((_g = (_f = (_e = (_d = (_c = (_b = (_a = rec.time) !== null && _a !== void 0 ? _a : rec.tym) !== null && _b !== void 0 ? _b : rec.slot) !== null && _c !== void 0 ? _c : rec.timing) !== null && _d !== void 0 ? _d : rec.startTime) !== null && _e !== void 0 ? _e : rec.start_time) !== null && _f !== void 0 ? _f : rec.eventTime) !== null && _g !== void 0 ? _g : rec.event_time);
        const description = readTrim((_q = (_p = (_o = (_m = (_l = (_k = (_j = (_h = rec.description) !== null && _h !== void 0 ? _h : rec.text) !== null && _j !== void 0 ? _j : rec.body) !== null && _k !== void 0 ? _k : rec.detail) !== null && _l !== void 0 ? _l : rec.agenda) !== null && _m !== void 0 ? _m : rec.title) !== null && _o !== void 0 ? _o : rec.heading) !== null && _p !== void 0 ? _p : rec.name) !== null && _q !== void 0 ? _q : rec.value);
        const dayRaw = (_s = (_r = rec.day) !== null && _r !== void 0 ? _r : rec.dayNumber) !== null && _s !== void 0 ? _s : rec.dayIndex;
        const dayParsed = dayRaw === undefined || dayRaw === null || dayRaw === ''
            ? index + 1
            : Number(dayRaw);
        const dateRaw = readTrim((_u = (_t = rec.date) !== null && _t !== void 0 ? _t : rec.eventDate) !== null && _u !== void 0 ? _u : rec.event_date);
        const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? dateRaw : undefined;
        const prefix = `programmeAtAGlance[${index}]`;
        if (!time && !description) {
            return;
        }
        if (!time) {
            errors[`${prefix}.time`] = 'Programme time is required.';
        }
        else if (time.length > exports.EVENT_PROGRAMME_TIME_MAX) {
            errors[`${prefix}.time`] =
                `Maximum ${exports.EVENT_PROGRAMME_TIME_MAX} characters are allowed.`;
        }
        if (!description) {
            errors[`${prefix}.description`] = 'Programme description is required.';
        }
        else if (description.length > exports.EVENT_PROGRAMME_DESCRIPTION_MAX) {
            errors[`${prefix}.description`] =
                `Maximum ${exports.EVENT_PROGRAMME_DESCRIPTION_MAX} characters are allowed.`;
        }
        const day = Number.isFinite(dayParsed) && dayParsed >= 1
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
    if (out.length > exports.EVENT_PROGRAMME_MAX_ENTRIES) {
        errors['programmeAtAGlance.max'] =
            `Maximum ${exports.EVENT_PROGRAMME_MAX_ENTRIES} programme entries are allowed.`;
    }
    if (Object.keys(errors).length > 0) {
        throw new common_1.BadRequestException({
            message: 'Validation failed',
            fieldErrors: errors,
            errors,
        });
    }
    return out;
}
/** Validate and normalize venue and travel (plain/HTML text). */
function normalizeVenueAndTravelInput(raw) {
    if (raw === undefined)
        return undefined;
    const text = readTrim(raw);
    if (text.length > exports.EVENT_VENUE_AND_TRAVEL_MAX) {
        throw new common_1.BadRequestException({
            message: 'Validation failed',
            fieldErrors: {
                venueAndTravel: `Maximum ${exports.EVENT_VENUE_AND_TRAVEL_MAX} characters are allowed.`,
            },
            errors: {
                venueAndTravel: `Maximum ${exports.EVENT_VENUE_AND_TRAVEL_MAX} characters are allowed.`,
            },
        });
    }
    return text;
}
/** Validate and normalize tags. */
function normalizeEventTagsInput(raw) {
    if (raw === undefined)
        return undefined;
    return normalizeStringList(raw, {
        fieldName: 'tags',
        maxItems: exports.EVENT_TAGS_MAX,
        maxItemLength: exports.EVENT_TAG_ITEM_MAX,
    });
}
function mapWhoShouldAttendFromDoc(doc) {
    return Array.isArray(doc.whoShouldAttend)
        ? doc.whoShouldAttend.map((v) => readTrim(v)).filter(Boolean)
        : [];
}
function mapKeyThemesFromDoc(doc) {
    if (!Array.isArray(doc.keyThemes))
        return [];
    return doc.keyThemes
        .map((item) => {
        if (typeof item === 'string' || typeof item === 'number') {
            const heading = readTrim(item);
            return heading ? { heading, description: '' } : null;
        }
        return {
            heading: readTrim(item === null || item === void 0 ? void 0 : item.heading),
            description: readTrim(item === null || item === void 0 ? void 0 : item.description),
        };
    })
        .filter((item) => Boolean(item && (item.heading || item.description)));
}
function mapProgrammeAtAGlanceFromDoc(doc) {
    if (!Array.isArray(doc.programmeAtAGlance))
        return [];
    return doc.programmeAtAGlance
        .map((item, index) => {
        const dayParsed = Number(item === null || item === void 0 ? void 0 : item.day);
        const day = Number.isFinite(dayParsed) && dayParsed >= 1
            ? Math.floor(dayParsed)
            : index + 1;
        const dateRaw = readTrim(item === null || item === void 0 ? void 0 : item.date);
        const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? dateRaw : undefined;
        return {
            day,
            ...(date ? { date } : {}),
            time: readTrim(item === null || item === void 0 ? void 0 : item.time),
            description: readTrim(item === null || item === void 0 ? void 0 : item.description),
        };
    })
        .filter((item) => item.time || item.description);
}
function mapVenueAndTravelFromDoc(doc) {
    return readTrim(doc.venueAndTravel);
}
function mapEventTagsFromDoc(doc) {
    return Array.isArray(doc.tags)
        ? doc.tags.map((v) => readTrim(v)).filter(Boolean)
        : [];
}
