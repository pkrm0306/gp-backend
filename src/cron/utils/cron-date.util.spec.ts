import {
  calendarDaysBetween,
  isSameCalendarDayInTimeZone,
  toIsoDateInTimeZone,
} from './cron-date.util';

describe('cron-date.util', () => {
  it('formats IST calendar date', () => {
    const iso = toIsoDateInTimeZone(new Date('2026-06-15T18:30:00.000Z'), 'Asia/Kolkata');
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('calendarDaysBetween counts whole days', () => {
    const days = calendarDaysBetween('2026-06-01', '2026-06-08', 'UTC');
    expect(days).toBe(7);
  });

  it('isSameCalendarDayInTimeZone compares dates', () => {
    expect(
      isSameCalendarDayInTimeZone(
        new Date('2026-03-01T00:00:00.000Z'),
        new Date('2026-03-01T23:59:00.000Z'),
        'UTC',
      ),
    ).toBe(true);
  });
});
