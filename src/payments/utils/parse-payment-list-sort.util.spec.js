"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_payment_list_sort_util_1 = require("./parse-payment-list-sort.util");
describe('parsePaymentListSort', function () {
    it('parses asc/desc shorthand as createdDate', function () {
        expect((0, parse_payment_list_sort_util_1.parsePaymentListSort)('asc')).toEqual({
            sortBy: 'createdDate',
            sortOrder: 'asc',
        });
        expect((0, parse_payment_list_sort_util_1.parsePaymentListSort)('desc')).toEqual({
            sortBy: 'createdDate',
            sortOrder: 'desc',
        });
    });
    it('parses field:order', function () {
        expect((0, parse_payment_list_sort_util_1.parsePaymentListSort)('createdAt:desc')).toEqual({
            sortBy: 'createdDate',
            sortOrder: 'desc',
        });
        expect((0, parse_payment_list_sort_util_1.parsePaymentListSort)('updatedAt:asc')).toEqual({
            sortBy: 'updatedDate',
            sortOrder: 'asc',
        });
    });
    it('builds mongo sort with tie-breaker paymentId', function () {
        expect((0, parse_payment_list_sort_util_1.buildPaymentListMongoSort)((0, parse_payment_list_sort_util_1.parsePaymentListSort)('createdAt:desc'))).toEqual({
            createdDate: -1,
            paymentId: -1,
        });
    });
});
