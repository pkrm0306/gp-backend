"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var urn_tab_review_util_1 = require("./urn-tab-review.util");
var urn_tab_review_constants_1 = require("../constants/urn-tab-review.constants");
describe('urn-tab-review.util', function () {
    it('parses empty CSV as all 15 steps', function () {
        expect((0, urn_tab_review_util_1.parseVisibleRawMaterialSteps)('')).toEqual(Array.from({ length: 15 }, function (_, i) { return i + 1; }));
    });
    it('parses CSV list', function () {
        expect((0, urn_tab_review_util_1.parseVisibleRawMaterialSteps)('1,2,5,7')).toEqual([1, 2, 5, 7]);
    });
    it('builds 7 process + visible raw material slots', function () {
        var slots = (0, urn_tab_review_util_1.buildRequiredReviewSlots)([1, 7]);
        expect(slots.filter(function (s) { return s.stepId === null; })).toHaveLength(7);
        expect(slots.filter(function (s) { return s.tabKey === 'raw-materials'; })).toHaveLength(2);
    });
    it('isTabReviewSlotAlreadyDecided is true only for approved', function () {
        expect((0, urn_tab_review_util_1.isTabReviewSlotAlreadyDecided)(urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.PENDING)).toBe(false);
        expect((0, urn_tab_review_util_1.isTabReviewSlotAlreadyDecided)(urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.APPROVED)).toBe(true);
        expect((0, urn_tab_review_util_1.isTabReviewSlotAlreadyDecided)(urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.REJECTED)).toBe(false);
        expect((0, urn_tab_review_util_1.isTabReviewSlotAlreadyDecided)(undefined)).toBe(false);
    });
    it('isTabReviewSlotRejected is true only for rejected', function () {
        expect((0, urn_tab_review_util_1.isTabReviewSlotRejected)(urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.PENDING)).toBe(false);
        expect((0, urn_tab_review_util_1.isTabReviewSlotRejected)(urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.APPROVED)).toBe(false);
        expect((0, urn_tab_review_util_1.isTabReviewSlotRejected)(urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.REJECTED)).toBe(true);
    });
});
