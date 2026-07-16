"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var date_range_validator_1 = require("./date-range.validator");
describe('date-range.validator', function () {
    describe('isFromDateNotLaterThanToDate', function () {
        it('allows empty from or to', function () {
            expect((0, date_range_validator_1.isFromDateNotLaterThanToDate)(undefined, '2026-07-14')).toBe(true);
            expect((0, date_range_validator_1.isFromDateNotLaterThanToDate)('2026-07-14', undefined)).toBe(true);
            expect((0, date_range_validator_1.isFromDateNotLaterThanToDate)('', '')).toBe(true);
        });
        it('allows same calendar day', function () {
            expect((0, date_range_validator_1.isFromDateNotLaterThanToDate)('2026-07-14', '2026-07-14')).toBe(true);
        });
        it('allows from before to', function () {
            expect((0, date_range_validator_1.isFromDateNotLaterThanToDate)('2026-07-01', '2026-07-14')).toBe(true);
        });
        it('rejects from later than to', function () {
            expect((0, date_range_validator_1.isFromDateNotLaterThanToDate)('2026-07-15', '2026-07-14')).toBe(false);
        });
    });
    describe('assertFromDateNotLaterThanToDate', function () {
        it('does not throw for valid ranges', function () {
            expect(function () {
                return (0, date_range_validator_1.assertFromDateNotLaterThanToDate)('2026-07-14', '2026-07-14');
            }).not.toThrow();
        });
        it('throws with the expected message when from > to', function () {
            expect(function () {
                return (0, date_range_validator_1.assertFromDateNotLaterThanToDate)('2026-07-15', '2026-07-14');
            }).toThrow(date_range_validator_1.FROM_DATE_LATER_THAN_TO_MESSAGE);
        });
    });
});
