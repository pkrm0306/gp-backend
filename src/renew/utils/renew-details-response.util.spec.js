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
var renew_details_response_util_1 = require("./renew-details-response.util");
describe('renew-details-response.util', function () {
    describe('parseRenewDetailsInclude', function () {
        it('defaults to summary when omitted', function () {
            expect((0, renew_details_response_util_1.parseRenewDetailsInclude)()).toBe('summary');
            expect((0, renew_details_response_util_1.parseRenewDetailsInclude)('')).toBe('summary');
            expect((0, renew_details_response_util_1.parseRenewDetailsInclude)('summary')).toBe('summary');
        });
        it('returns full only for include=full', function () {
            expect((0, renew_details_response_util_1.parseRenewDetailsInclude)('full')).toBe('full');
            expect((0, renew_details_response_util_1.parseRenewDetailsInclude)('FULL')).toBe('full');
        });
    });
    describe('buildRenewDetailsHttpResponse', function () {
        var baseResult = {
            data: [
                {
                    product_details: {
                        eoiNo: 'GP001',
                        productName: 'p',
                        productStatus: 2,
                    },
                    category: { categoryName: 'Cat' },
                    vendor: { companyName: 'Co', vendor_email: 'a@b.com' },
                },
            ],
            products: [],
            manufacturer: null,
            manufacturing_details: null,
            plants: [
                { plantName: 'Unit 1', stateName: 'Tamil Nadu', State: 'Tamil Nadu' },
            ],
            plant_details: [
                { plantName: 'Unit 1', stateName: 'Tamil Nadu', State: 'Tamil Nadu' },
            ],
            all_renew_product_documents: [],
            all_urn_product_documents: [],
            documents: [],
            renewContext: {
                urnNo: 'URN-1',
                urnStatus: 15,
                productRenewStatus: 1,
                vendorId: 'v1',
                manufacturerId: 'm1',
                renewalCycleId: 'c1',
            },
            siteVisits: [],
        };
        it('omits payment and admin blocks for summary', function () {
            var body = (0, renew_details_response_util_1.buildRenewDetailsHttpResponse)(baseResult, 'summary');
            expect(body.success).toBe(true);
            expect(body.payment).toBeUndefined();
            expect(body.tabReviews).toBeUndefined();
            expect(body.processComments).toBeUndefined();
            expect(body.product_details_list).toBe(baseResult.data);
        });
        it('includes payment and admin blocks for full', function () {
            var body = (0, renew_details_response_util_1.buildRenewDetailsHttpResponse)(__assign(__assign({}, baseResult), { payment: { paymentType: 'renew', renewalCycleId: 'c1' }, payments: [], tabReviews: { urnNo: 'URN-1' }, processComments: { productPerformance: 'x' } }), 'full');
            expect(body.payment).toEqual({
                paymentType: 'renew',
                renewalCycleId: 'c1',
            });
            expect(body.payments).toEqual([]);
            expect(body.tabReviews).toEqual({ urnNo: 'URN-1' });
            expect(body.processComments).toEqual({ productPerformance: 'x' });
            expect(body.vendor).toMatchObject({ company: 'Co', email: 'a@b.com' });
            expect(body.category).toEqual({ categoryName: 'Cat' });
            expect(body.plants).toEqual([
                {
                    plantName: 'Unit 1',
                    stateName: 'Tamil Nadu',
                    State: 'Tamil Nadu',
                },
            ]);
        });
    });
});
