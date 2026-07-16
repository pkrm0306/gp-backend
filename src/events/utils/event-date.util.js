"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEventDateInput = parseEventDateInput;
exports.toDateOnlyIso = toDateOnlyIso;
exports.resolveEventStartDate = resolveEventStartDate;
exports.resolveEventEndDate = resolveEventEndDate;
exports.isEventVisibleOnWebsite = isEventVisibleOnWebsite;
exports.buildWebsiteVisibleEventsMatch = buildWebsiteVisibleEventsMatch;
/** Parse admin/website date input (YYYY-MM-DD, DD-MM-YYYY, or ISO datetime). */
function parseEventDateInput(raw) {
    var value = String(raw !== null && raw !== void 0 ? raw : '').trim();
    if (!value)
        return null;
    if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
        var parsed_1 = new Date("".concat(value.slice(6, 10), "-").concat(value.slice(3, 5), "-").concat(value.slice(0, 2)));
        return Number.isNaN(parsed_1.getTime()) ? null : parsed_1;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        var parsed_2 = new Date("".concat(value, "T00:00:00.000Z"));
        return Number.isNaN(parsed_2.getTime()) ? null : parsed_2;
    }
    var parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}
function toDateOnlyIso(value) {
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }
    var parsed = parseEventDateInput(value);
    return parsed ? parsed.toISOString().slice(0, 10) : '';
}
function startOfLocalDay(date) {
    var copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}
function parseTimeOnDate(baseDate, timeRaw) {
    var time = String(timeRaw !== null && timeRaw !== void 0 ? timeRaw : '').trim();
    if (!time)
        return null;
    var match12 = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
        var hours = Number(match12[1]);
        var minutes = Number(match12[2]);
        var ampm = match12[3].toUpperCase();
        if (!Number.isFinite(hours) || !Number.isFinite(minutes))
            return null;
        if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59)
            return null;
        if (ampm === 'PM')
            hours = hours === 12 ? 12 : hours + 12;
        else
            hours = hours === 12 ? 0 : hours;
        var out = new Date(baseDate);
        out.setHours(hours, minutes, 0, 0);
        return out;
    }
    var match24 = time.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
        var hours = Number(match24[1]);
        var minutes = Number(match24[2]);
        if (!Number.isFinite(hours) || !Number.isFinite(minutes))
            return null;
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59)
            return null;
        var out = new Date(baseDate);
        out.setHours(hours, minutes, 0, 0);
        return out;
    }
    return null;
}
function resolveEventStartDate(event) {
    var _a, _b;
    return ((_b = (_a = parseEventDateInput(event.eventStartDate)) !== null && _a !== void 0 ? _a : parseEventDateInput(event.eventDate)) !== null && _b !== void 0 ? _b : parseEventDateInput(event.date));
}
function resolveEventEndDate(event) {
    var _a;
    return ((_a = parseEventDateInput(event.eventEndDate)) !== null && _a !== void 0 ? _a : resolveEventStartDate(event));
}
/** Event remains visible through the end date (and end time when provided). */
function isEventVisibleOnWebsite(event, now) {
    if (now === void 0) { now = new Date(); }
    var endDate = resolveEventEndDate(event);
    if (!endDate)
        return false;
    var endTime = parseTimeOnDate(endDate, event.eventEndTime);
    if (endTime) {
        return now.getTime() <= endTime.getTime();
    }
    var endOfDay = startOfLocalDay(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    return now.getTime() <= endOfDay.getTime();
}
function buildWebsiteVisibleEventsMatch(now) {
    if (now === void 0) { now = new Date(); }
    var startOfToday = startOfLocalDay(now);
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
