"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renew_urn_status_transitions_util_1 = require("./renew-urn-status-transitions.util");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
describe('renew-urn-status-transitions', function () {
    it('allows vendor 14→15 and 16→15', function () {
        expect((0, renew_urn_status_transitions_util_1.getAllowedRenewUrnStatusTargets)('vendor', renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED)).toEqual([renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS]);
        expect(function () {
            return (0, renew_urn_status_transitions_util_1.assertRenewUrnStatusTransition)('vendor', renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED, renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS);
        }).not.toThrow();
        expect(function () {
            return (0, renew_urn_status_transitions_util_1.assertRenewUrnStatusTransition)('vendor', renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING, renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS);
        }).not.toThrow();
    });
    it('rejects vendor setting 15 directly from cert range intent', function () {
        expect(function () { return (0, renew_urn_status_transitions_util_1.assertVendorCannotSetRenewStatus)(17); }).toThrow();
        expect(function () {
            return (0, renew_urn_status_transitions_util_1.assertRenewUrnStatusTransition)('vendor', 14, 13);
        }).toThrow();
    });
    it('allows admin payment approve and review transitions', function () {
        expect(function () {
            return (0, renew_urn_status_transitions_util_1.assertRenewUrnStatusTransition)('admin', renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED, renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED);
        }).not.toThrow();
        expect(function () {
            return (0, renew_urn_status_transitions_util_1.assertRenewUrnStatusTransition)('admin', renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS, renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING);
        }).not.toThrow();
        expect(function () {
            return (0, renew_urn_status_transitions_util_1.assertRenewUrnStatusTransition)('admin', renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING, renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED);
        }).not.toThrow();
    });
});
