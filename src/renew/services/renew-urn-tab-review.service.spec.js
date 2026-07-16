"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renew_urn_tab_review_service_1 = require("./renew-urn-tab-review.service");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
describe('RenewUrnTabReviewService', function () {
    var service = Object.create(renew_urn_tab_review_service_1.RenewUrnTabReviewService.prototype);
    describe('buildQuickActions', function () {
        it('enables resend when all reviewed and has rejection', function () {
            var actions = service.buildQuickActions({
                allReviewed: true,
                allApproved: false,
                hasRejection: true,
            });
            expect(actions.enableResend).toBe(true);
            expect(actions.enableSubmitFinal).toBe(false);
        });
        it('disables resend when all reviewed and all approved', function () {
            var actions = service.buildQuickActions({
                allReviewed: true,
                allApproved: true,
                hasRejection: false,
            });
            expect(actions.enableResend).toBe(false);
            expect(actions.enableSubmitFinal).toBe(true);
        });
        it('disables both when reviews pending', function () {
            var actions = service.buildQuickActions({
                allReviewed: false,
                allApproved: false,
                hasRejection: false,
            });
            expect(actions.disableBoth).toBe(true);
            expect(actions.enableResend).toBe(false);
            expect(actions.enableSubmitFinal).toBe(false);
        });
    });
});
describe('renew admin status gating', function () {
    it('documents expected transition codes', function () {
        expect(renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS).toBe(15);
        expect(renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING).toBe(16);
        expect(renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING).toBe(17);
    });
});
