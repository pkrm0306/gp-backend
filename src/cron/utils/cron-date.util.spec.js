"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cron_date_util_1 = require("./cron-date.util");
describe('cron-date.util', function () {
    it('formats IST calendar date', function () {
        var iso = (0, cron_date_util_1.toIsoDateInTimeZone)(new Date('2026-06-15T18:30:00.000Z'), 'Asia/Kolkata');
        expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
    it('calendarDaysBetween counts whole days', function () {
        var days = (0, cron_date_util_1.calendarDaysBetween)('2026-06-01', '2026-06-08', 'UTC');
        expect(days).toBe(7);
    });
    it('isSameCalendarDayInTimeZone compares dates', function () {
        expect((0, cron_date_util_1.isSameCalendarDayInTimeZone)(new Date('2026-03-01T00:00:00.000Z'), new Date('2026-03-01T23:59:00.000Z'), 'UTC')).toBe(true);
    });
});
