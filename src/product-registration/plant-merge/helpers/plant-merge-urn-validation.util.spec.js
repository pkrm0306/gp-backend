"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var product_status_constants_1 = require("../../../renew/constants/product-status.constants");
var plant_merge_urn_validation_util_1 = require("./plant-merge-urn-validation.util");
var plant_merge_urn_validation_constants_1 = require("../plant-merge-urn-validation.constants");
describe('plant-merge-urn-validation.util', function () {
    var manufacturerId = new mongoose_1.Types.ObjectId();
    var categoryId = new mongoose_1.Types.ObjectId();
    var source = {
        _id: new mongoose_1.Types.ObjectId(),
        productName: 'Cement Board',
        eoiNo: 'GP100',
        urnNo: 'URN-SOURCE',
        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
        manufacturerId: manufacturerId,
        categoryId: categoryId,
        certifiedDate: new Date('2024-06-01'),
        createdDate: new Date('2024-06-01'),
    };
    var target = {
        _id: new mongoose_1.Types.ObjectId(),
        productName: 'Cement Board',
        eoiNo: 'GP001',
        urnNo: 'URN-TARGET',
        productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED,
        manufacturerId: manufacturerId,
        categoryId: categoryId,
        certifiedDate: new Date('2023-01-01'),
        createdDate: new Date('2023-01-01'),
    };
    it('requires exact product name match', function () {
        expect((0, plant_merge_urn_validation_util_1.exactProductNamesMatch)('Cement Board', 'cement board')).toBe(false);
        expect((0, plant_merge_urn_validation_util_1.exactProductNamesMatch)('Cement Board', 'Cement Board')).toBe(true);
    });
    it('detects same source and target pair', function () {
        expect((0, plant_merge_urn_validation_util_1.isSameSourceAndTargetPair)({
            sourceUrnNo: 'URN-A',
            targetUrnNo: 'URN-A',
            sourceEoiNo: 'GP001',
            targetEoiNo: 'GP001',
        })).toBe(true);
    });
    it('requires target to be older than source', function () {
        expect((0, plant_merge_urn_validation_util_1.isTargetOlderThanSource)(target, source)).toBe(true);
        expect((0, plant_merge_urn_validation_util_1.isTargetOlderThanSource)(source, target)).toBe(false);
    });
    it('returns no blockers for a valid pair', function () {
        expect((0, plant_merge_urn_validation_util_1.buildPlantMergeUrnPairValidationBlockers)(source, target)).toHaveLength(0);
    });
    it('flags manufacturer mismatch', function () {
        var blockers = (0, plant_merge_urn_validation_util_1.buildPlantMergeUrnPairValidationBlockers)(source, __assign(__assign({}, target), { manufacturerId: new mongoose_1.Types.ObjectId() }));
        expect(blockers.some(function (b) { return b.code === plant_merge_urn_validation_constants_1.PLANT_MERGE_URN_VALIDATION_BLOCKER.MANUFACTURER_MISMATCH; })).toBe(true);
    });
    it('flags uncertified target', function () {
        expect((0, plant_merge_urn_validation_util_1.isCertifiedProductRow)({ productStatus: 1 })).toBe(false);
    });
});
