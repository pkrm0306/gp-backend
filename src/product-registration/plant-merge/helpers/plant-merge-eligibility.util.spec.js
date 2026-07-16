"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var plant_merge_eligibility_util_1 = require("./plant-merge-eligibility.util");
describe('plant-merge-eligibility.util', function () {
    it('blocks urnStatus 12-17', function () {
        var _a;
        var blockers = (0, plant_merge_eligibility_util_1.buildProductRenewalBlockers)('Product', { urnStatus: 14, productRenewStatus: 0 });
        expect((_a = blockers[0]) === null || _a === void 0 ? void 0 : _a.code).toBe('RENEWAL_URN_STATUS_ACTIVE');
    });
    it('rejects target in source list', function () {
        var id = new mongoose_1.Types.ObjectId().toHexString();
        var blockers = (0, plant_merge_eligibility_util_1.validateSourcePlantSelection)(id, [id]);
        expect(blockers.some(function (b) { return b.code === 'TARGET_IN_SOURCE_LIST'; })).toBe(true);
    });
    it('requires at least one plant to remain', function () {
        var _a;
        var blockers = (0, plant_merge_eligibility_util_1.validateRemainingPlantCount)(2, 2);
        expect((_a = blockers[0]) === null || _a === void 0 ? void 0 : _a.code).toBe('MIN_PLANTS_REQUIRED');
    });
    it('allows merge when one plant remains', function () {
        expect((0, plant_merge_eligibility_util_1.validateRemainingPlantCount)(3, 2)).toHaveLength(0);
    });
});
