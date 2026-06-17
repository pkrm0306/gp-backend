import {
  buildValidTillMonthYearExpr,
  normalizeAdminListFilterYearMonth,
  resolveAdminListValidTillMonthYearFilter,
} from './admin-list-valid-till-filter.util';

describe('admin-list-valid-till-filter.util', () => {
  it('normalizes YYYY-MM filter input', () => {
    expect(normalizeAdminListFilterYearMonth('2027-12')).toBe('2027-12');
    expect(normalizeAdminListFilterYearMonth('2027-12-31')).toBe('2027-12');
  });

  it('resolves single valid-till month+year from aliases', () => {
    expect(
      resolveAdminListValidTillMonthYearFilter({
        validtillDate: '2026-12',
      }),
    ).toEqual({ kind: 'single', yearMonth: '2026-12' });
    expect(
      resolveAdminListValidTillMonthYearFilter({
        valid_till: '2026-12',
      }),
    ).toEqual({ kind: 'single', yearMonth: '2026-12' });
  });

  it('resolves month+year from snake_case month and year pickers', () => {
    expect(
      resolveAdminListValidTillMonthYearFilter({
        valid_till_month: 12,
        valid_till_year: 2026,
      }),
    ).toEqual({ kind: 'single', yearMonth: '2026-12' });
  });

  it('resolves month+year from separate month and year pickers', () => {
    expect(
      resolveAdminListValidTillMonthYearFilter({
        validTillMonth: 12,
        validTillYear: 2026,
      }),
    ).toEqual({ kind: 'single', yearMonth: '2026-12' });
  });

  it('resolves inclusive valid-till month/year range', () => {
    expect(
      resolveAdminListValidTillMonthYearFilter({
        validTillFrom: '2026-01',
        validTillTo: '2026-12',
      }),
    ).toEqual({
      kind: 'range',
      from: '2026-01',
      to: '2026-12',
    });
  });

  it('builds month+year $expr using Asia/Kolkata', () => {
    const expr = buildValidTillMonthYearExpr({
      kind: 'single',
      yearMonth: '2027-12',
    });
    expect(expr).toEqual({
      $and: [
        { $ne: ['$validtillDate', null] },
        {
          $eq: [
            {
              $dateToString: {
                format: '%Y-%m',
                date: '$validtillDate',
                timezone: 'Asia/Kolkata',
              },
            },
            '2027-12',
          ],
        },
      ],
    });
  });

  it('maps local-midnight Dec 31 storage to December year-month', () => {
    const stored = new Date(2027, 11, 31, 0, 0, 0, 0);
    const yearMonth = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
    })
      .formatToParts(stored)
      .reduce(
        (acc, part) => {
          if (part.type === 'year') acc.year = part.value;
          if (part.type === 'month') acc.month = part.value;
          return acc;
        },
        { year: '', month: '' },
      );
    expect(`${yearMonth.year}-${yearMonth.month}`).toBe('2027-12');
    expect(
      resolveAdminListValidTillMonthYearFilter({
        validTillMonthYear: '2027-12',
      }),
    ).toEqual({ kind: 'single', yearMonth: '2027-12' });
  });
});
