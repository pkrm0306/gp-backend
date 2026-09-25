import {
  computeCertificationDates,
  computeNotifyDates,
  computeValidTillFromCertified,
} from './certification-dates.util';

describe('certification-dates.util', () => {
  describe('computeValidTillFromCertified (month-end + 2 years)', () => {
    const cases: Array<{
      label: string;
      certified: Date;
      expectY: number;
      expectM: number; // 0-based
      expectD: number;
    }> = [
      {
        label: '2026-09-24 → 2028-09-30',
        certified: new Date(2026, 8, 24, 14, 30, 0),
        expectY: 2028,
        expectM: 8,
        expectD: 30,
      },
      {
        label: '2026-01-15 → 2028-01-31',
        certified: new Date(2026, 0, 15),
        expectY: 2028,
        expectM: 0,
        expectD: 31,
      },
      {
        label: '2026-02-10 → 2028-02-29 (leap)',
        certified: new Date(2026, 1, 10),
        expectY: 2028,
        expectM: 1,
        expectD: 29,
      },
      {
        label: '2025-02-28 → 2027-02-28',
        certified: new Date(2025, 1, 28),
        expectY: 2027,
        expectM: 1,
        expectD: 28,
      },
      {
        label: '2024-02-29 → 2026-02-28 (non-leap)',
        certified: new Date(2024, 1, 29),
        expectY: 2026,
        expectM: 1,
        expectD: 28,
      },
      {
        label: '2027-12-01 → 2029-12-31',
        certified: new Date(2027, 11, 1),
        expectY: 2029,
        expectM: 11,
        expectD: 31,
      },
    ];

    it.each(cases)('$label', ({ certified, expectY, expectM, expectD }) => {
      const validtill = computeValidTillFromCertified(certified);
      expect(validtill.getFullYear()).toBe(expectY);
      expect(validtill.getMonth()).toBe(expectM);
      expect(validtill.getDate()).toBe(expectD);
      expect(validtill.getHours()).toBe(0);
    });
  });

  it('computes notify dates from validtill (3 / 2 / +3 month offsets)', () => {
    const validtill = new Date(2028, 11, 31);
    const notify = computeNotifyDates(validtill);
    // validtill − 3 months (Dec 31 → Sep 30, month-end clamp)
    expect(notify.firstNotifyDate.getFullYear()).toBe(2028);
    expect(notify.firstNotifyDate.getMonth()).toBe(8);
    expect(notify.firstNotifyDate.getDate()).toBe(30);
    // validtill − 2 months → Oct 31
    expect(notify.secondNotifyDate.getFullYear()).toBe(2028);
    expect(notify.secondNotifyDate.getMonth()).toBe(9);
    expect(notify.secondNotifyDate.getDate()).toBe(31);
    // validtill + 3 months grace → Mar 31 2029
    expect(notify.thirdNotifyDate.getFullYear()).toBe(2029);
    expect(notify.thirdNotifyDate.getMonth()).toBe(2);
    expect(notify.thirdNotifyDate.getDate()).toBe(31);
  });

  it('bundles certification approval dates (validtill = month-end + 2y)', () => {
    const approvedAt = new Date(2026, 4, 19); // 19 May 2026
    const bundle = computeCertificationDates(approvedAt);
    // May 2026 + 2y → May 2028 month-end
    expect(bundle.validtillDate.getFullYear()).toBe(2028);
    expect(bundle.validtillDate.getMonth()).toBe(4);
    expect(bundle.validtillDate.getDate()).toBe(31);
    // first notify = validtill − 3 months → Feb 29 2028 (leap)
    expect(bundle.firstNotifyDate.getFullYear()).toBe(2028);
    expect(bundle.firstNotifyDate.getMonth()).toBe(1);
    expect(bundle.firstNotifyDate.getDate()).toBe(29);
    // grace = validtill + 3 months → Aug 31 2028
    expect(bundle.thirdNotifyDate.getFullYear()).toBe(2028);
    expect(bundle.thirdNotifyDate.getMonth()).toBe(7);
    expect(bundle.thirdNotifyDate.getDate()).toBe(31);
  });
});
