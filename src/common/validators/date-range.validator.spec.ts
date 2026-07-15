import {
  FROM_DATE_LATER_THAN_TO_MESSAGE,
  assertFromDateNotLaterThanToDate,
  isFromDateNotLaterThanToDate,
} from './date-range.validator';

describe('date-range.validator', () => {
  describe('isFromDateNotLaterThanToDate', () => {
    it('allows empty from or to', () => {
      expect(isFromDateNotLaterThanToDate(undefined, '2026-07-14')).toBe(true);
      expect(isFromDateNotLaterThanToDate('2026-07-14', undefined)).toBe(true);
      expect(isFromDateNotLaterThanToDate('', '')).toBe(true);
    });

    it('allows same calendar day', () => {
      expect(isFromDateNotLaterThanToDate('2026-07-14', '2026-07-14')).toBe(
        true,
      );
    });

    it('allows from before to', () => {
      expect(isFromDateNotLaterThanToDate('2026-07-01', '2026-07-14')).toBe(
        true,
      );
    });

    it('rejects from later than to', () => {
      expect(isFromDateNotLaterThanToDate('2026-07-15', '2026-07-14')).toBe(
        false,
      );
    });
  });

  describe('assertFromDateNotLaterThanToDate', () => {
    it('does not throw for valid ranges', () => {
      expect(() =>
        assertFromDateNotLaterThanToDate('2026-07-14', '2026-07-14'),
      ).not.toThrow();
    });

    it('throws with the expected message when from > to', () => {
      expect(() =>
        assertFromDateNotLaterThanToDate('2026-07-15', '2026-07-14'),
      ).toThrow(FROM_DATE_LATER_THAN_TO_MESSAGE);
    });
  });
});
