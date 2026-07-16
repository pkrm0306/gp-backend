"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renewal_urn_status_constants_1 = require("./renewal-urn-status.constants");
describe('shouldUseRenewWorkflowForUrn', function () {
    it('treats certified complete urnStatus 11 as certification flow', function () {
        expect((0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
            urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED,
            productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.NOT_RENEWED,
        })).toBe(false);
    });
    it('treats renewal in-progress statuses as renewal flow', function () {
        expect((0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
            urnStatus: 15,
            productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.IN_PROGRESS,
        })).toBe(true);
    });
    it('treats renewal completed urnStatus 11 as renewal flow', function () {
        expect((0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
            urnStatus: renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED,
            productRenewStatus: renewal_urn_status_constants_1.PRODUCT_RENEW_STATUS.RENEWED,
        })).toBe(true);
    });
});
