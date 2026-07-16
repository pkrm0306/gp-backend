"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var urn_merge_eligibility_util_1 = require("./urn-merge-eligibility.util");
var mongoose_1 = require("mongoose");
describe('urn-merge-eligibility.util', function () {
    it('blocks urnStatus 12-17', function () {
        var _a;
        var blockers = (0, urn_merge_eligibility_util_1.buildRenewalBlockers)('Source', [{ urnStatus: 14 }]);
        expect((_a = blockers[0]) === null || _a === void 0 ? void 0 : _a.code).toBe('RENEWAL_URN_STATUS_ACTIVE');
    });
    it('allows urnStatus 11 (renewal completed)', function () {
        expect((0, urn_merge_eligibility_util_1.buildRenewalBlockers)('Source', [{ urnStatus: 11 }])).toHaveLength(0);
    });
    it('detects EOI collision', function () {
        var _a;
        var blockers = (0, urn_merge_eligibility_util_1.findEoiCollisions)(new Set(['GP001']), [
            { eoiNo: 'GP001' },
        ]);
        expect((_a = blockers[0]) === null || _a === void 0 ? void 0 : _a.code).toBe('EOI_COLLISION');
    });
    it('does not add ownership blocker when manufacturer and vendor match', function () {
        var vendorId = new mongoose_1.Types.ObjectId();
        var manufacturerId = new mongoose_1.Types.ObjectId();
        expect((0, urn_merge_eligibility_util_1.buildOwnershipMismatchBlocker)({ vendorId: vendorId, manufacturerId: manufacturerId }, { vendorId: vendorId, manufacturerId: manufacturerId })).toHaveLength(0);
    });
    it('returns one consolidated blocker when vendor differs', function () {
        var manufacturerId = new mongoose_1.Types.ObjectId();
        var blockers = (0, urn_merge_eligibility_util_1.buildOwnershipMismatchBlocker)({ vendorId: new mongoose_1.Types.ObjectId(), manufacturerId: manufacturerId }, { vendorId: new mongoose_1.Types.ObjectId(), manufacturerId: manufacturerId });
        expect(blockers).toEqual([
            {
                code: 'VENDOR_MISMATCH',
                message: urn_merge_eligibility_util_1.URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE,
            },
        ]);
    });
    it('returns one consolidated blocker when manufacturer differs', function () {
        var vendorId = new mongoose_1.Types.ObjectId();
        var blockers = (0, urn_merge_eligibility_util_1.buildOwnershipMismatchBlocker)({ vendorId: vendorId, manufacturerId: new mongoose_1.Types.ObjectId() }, { vendorId: vendorId, manufacturerId: new mongoose_1.Types.ObjectId() });
        expect(blockers).toEqual([
            {
                code: 'MANUFACTURER_MISMATCH',
                message: urn_merge_eligibility_util_1.URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE,
            },
        ]);
    });
    it('returns one consolidated blocker when manufacturer and vendor differ', function () {
        var blockers = (0, urn_merge_eligibility_util_1.buildOwnershipMismatchBlocker)({
            vendorId: new mongoose_1.Types.ObjectId(),
            manufacturerId: new mongoose_1.Types.ObjectId(),
        }, {
            vendorId: new mongoose_1.Types.ObjectId(),
            manufacturerId: new mongoose_1.Types.ObjectId(),
        });
        expect(blockers).toHaveLength(1);
        expect(blockers[0]).toEqual({
            code: 'VENDOR_MISMATCH',
            message: urn_merge_eligibility_util_1.URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE,
        });
    });
    it('selects certified subset by productIds', function () {
        var rows = [
            {
                _id: new mongoose_1.Types.ObjectId(),
                productId: 1,
                eoiNo: 'A',
                productName: 'a',
                productStatus: 2,
                categoryId: new mongoose_1.Types.ObjectId(),
                vendorId: new mongoose_1.Types.ObjectId(),
                manufacturerId: new mongoose_1.Types.ObjectId(),
                urnStatus: 0,
                productRenewStatus: 0,
            },
            {
                _id: new mongoose_1.Types.ObjectId(),
                productId: 2,
                eoiNo: 'B',
                productName: 'b',
                productStatus: 3,
                categoryId: new mongoose_1.Types.ObjectId(),
                vendorId: new mongoose_1.Types.ObjectId(),
                manufacturerId: new mongoose_1.Types.ObjectId(),
                urnStatus: 0,
                productRenewStatus: 0,
            },
        ];
        var selected = (0, urn_merge_eligibility_util_1.selectCertifiedProductsToMove)(rows, false, [1]);
        expect(selected).toHaveLength(1);
        expect(selected[0].productId).toBe(1);
    });
});
