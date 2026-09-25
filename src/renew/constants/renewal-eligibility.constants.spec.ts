import {
  RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY,
  renewEligibilityThresholdDate,
} from './renewal-eligibility.constants';

describe('renewal-eligibility.constants', () => {
  it('uses a 90-day eligibility window', () => {
    expect(RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY).toBe(90);
  });

  it('computes threshold as asOf + 90 calendar days', () => {
    const asOf = new Date('2026-09-24T12:00:00.000Z');
    const threshold = renewEligibilityThresholdDate(asOf);
    const expected = new Date(asOf);
    expected.setDate(expected.getDate() + 90);
    expect(threshold.getTime()).toBe(expected.getTime());
  });
});
