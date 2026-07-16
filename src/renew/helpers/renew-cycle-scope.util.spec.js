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
var renew_cycle_scope_util_1 = require("./renew-cycle-scope.util");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
describe('renew-cycle-scope.util', function () {
    var cycleId = new mongoose_1.Types.ObjectId();
    var cycle = {
        _id: cycleId,
        urnNo: 'URN-1',
        cycleNo: 2,
        status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
        paymentId: null,
    };
    it('strict process header filter for cycle 2+', function () {
        expect((0, renew_cycle_scope_util_1.buildRenewProcessHeaderFilter)('URN-1', cycle)).toEqual({
            urnNo: 'URN-1',
            $or: [{ renewalCycleId: cycleId }, { renewalCycleId: String(cycleId) }],
        });
    });
    it('renew payment filter prefers renewalCycleId for active cycle', function () {
        var filter = (0, renew_cycle_scope_util_1.buildRenewPaymentFindFilter)('URN-1', cycle);
        expect(filter.paymentType).toBe('renew');
        expect(filter.$or).toEqual([{ renewalCycleId: cycleId }]);
    });
    it('cycle 2+ does not match legacy untagged payments via paymentId', function () {
        var cycle2 = __assign(__assign({}, cycle), { paymentId: 999 });
        var filter = (0, renew_cycle_scope_util_1.buildRenewPaymentFindFilter)('URN-1', cycle2);
        expect(filter.$or).toEqual([{ renewalCycleId: cycleId }]);
    });
    it('cycle 1 allows legacy untagged renew payments', function () {
        var cycle1 = {
            _id: cycleId,
            urnNo: 'URN-1',
            cycleNo: 1,
            status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
            paymentId: null,
        };
        var filter = (0, renew_cycle_scope_util_1.buildRenewPaymentFindFilter)('URN-1', cycle1);
        expect(filter.$or).toHaveLength(3);
    });
    describe('resolveCycleScopedUrnStatus', function () {
        it('returns payment pending for new in-progress cycle when product still shows completed', function () {
            var status = (0, renew_cycle_scope_util_1.resolveCycleScopedUrnStatus)({ cycleNo: 2, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS }, { urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED, renewCycleNo: 2 }, { paymentStatus: 0 });
            expect(status).toBe(renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING);
        });
        it('returns live product status for active matching cycle', function () {
            var status = (0, renew_cycle_scope_util_1.resolveCycleScopedUrnStatus)({ cycleNo: 2, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS }, { urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED, renewCycleNo: 2 }, { paymentStatus: 1 });
            expect(status).toBe(renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED);
        });
        it('returns completed for completed renewal cycles', function () {
            var status = (0, renew_cycle_scope_util_1.resolveCycleScopedUrnStatus)({ cycleNo: 1, status: renewal_cycle_schema_1.RenewalCycleStatus.COMPLETED }, { urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING, renewCycleNo: 2 }, { paymentStatus: 0 });
            expect(status).toBe(renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED);
        });
        it('infers submitted status from payment when product cycle lags', function () {
            var status = (0, renew_cycle_scope_util_1.resolveCycleScopedUrnStatus)({ cycleNo: 3, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS }, { urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED, renewCycleNo: 2 }, { paymentStatus: 1 });
            expect(status).toBe(renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED);
        });
    });
    describe('canAdminAccessRenewProcessTabs', function () {
        it('locks tabs below payment approved', function () {
            expect((0, renew_cycle_scope_util_1.canAdminAccessRenewProcessTabs)(12)).toBe(false);
            expect((0, renew_cycle_scope_util_1.canAdminAccessRenewProcessTabs)(13)).toBe(false);
        });
        it('unlocks tabs at payment approved and beyond', function () {
            expect((0, renew_cycle_scope_util_1.canAdminAccessRenewProcessTabs)(14)).toBe(true);
            expect((0, renew_cycle_scope_util_1.canAdminAccessRenewProcessTabs)(15)).toBe(true);
            expect((0, renew_cycle_scope_util_1.canAdminAccessRenewProcessTabs)(11)).toBe(true);
        });
    });
});
