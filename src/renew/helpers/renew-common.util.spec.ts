import { extendValidityForRenewal } from './renew-common.util';

describe('extendValidityForRenewal (month-end + 24 months)', () => {
  const cases: Array<{
    label: string;
    current: Date;
    expectY: number;
    expectM: number; // 0-based
    expectD: number;
  }> = [
    {
      label: '2028-09-30 → 2030-09-30',
      current: new Date(2028, 8, 30),
      expectY: 2030,
      expectM: 8,
      expectD: 30,
    },
    {
      label: '2028-05-31 → 2030-05-31',
      current: new Date(2028, 4, 31),
      expectY: 2030,
      expectM: 4,
      expectD: 31,
    },
    {
      label: '2028-02-29 → 2030-02-28 (non-leap)',
      current: new Date(2028, 1, 29),
      expectY: 2030,
      expectM: 1,
      expectD: 28,
    },
    {
      label: '2028-12-31 → 2030-12-31',
      current: new Date(2028, 11, 31),
      expectY: 2030,
      expectM: 11,
      expectD: 31,
    },
    {
      label: '2027-01-31 → 2029-01-31',
      current: new Date(2027, 0, 31),
      expectY: 2029,
      expectM: 0,
      expectD: 31,
    },
  ];

  it.each(cases)('$label', ({ current, expectY, expectM, expectD }) => {
    const next = extendValidityForRenewal(current);
    expect(next.getFullYear()).toBe(expectY);
    expect(next.getMonth()).toBe(expectM);
    expect(next.getDate()).toBe(expectD);
    expect(next.getHours()).toBe(0);
  });

  it('does not snap non-December dates to Dec 31', () => {
    const next = extendValidityForRenewal(new Date(2028, 8, 30));
    expect(next.getMonth()).not.toBe(11);
    expect(next.getDate()).not.toBe(31);
    expect(next.getMonth()).toBe(8);
    expect(next.getDate()).toBe(30);
  });
});
