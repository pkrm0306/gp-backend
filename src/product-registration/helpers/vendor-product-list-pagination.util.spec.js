"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vendor_product_list_pagination_util_1 = require("./vendor-product-list-pagination.util");
describe('buildVendorProductListPagination', function () {
    it('marks the last page when all URNs fit in one page', function () {
        expect((0, vendor_product_list_pagination_util_1.buildVendorProductListPagination)({ page: 1, limit: 20, totalCount: 5 })).toEqual({
            page: 1,
            limit: 20,
            totalCount: 5,
            totalPages: 1,
            currentPage: 1,
            hasMore: false,
            isLastPage: true,
        });
    });
    it('signals hasMore while additional pages remain', function () {
        expect((0, vendor_product_list_pagination_util_1.buildVendorProductListPagination)({ page: 1, limit: 10, totalCount: 25 })).toMatchObject({
            totalPages: 3,
            hasMore: true,
            isLastPage: false,
        });
        expect((0, vendor_product_list_pagination_util_1.buildVendorProductListPagination)({ page: 3, limit: 10, totalCount: 25 })).toMatchObject({
            page: 3,
            hasMore: false,
            isLastPage: true,
        });
    });
    it('clamps page beyond totalPages to avoid endless fetch loops', function () {
        expect((0, vendor_product_list_pagination_util_1.buildVendorProductListPagination)({ page: 99, limit: 10, totalCount: 25 })).toMatchObject({
            page: 3,
            totalPages: 3,
            hasMore: false,
            isLastPage: true,
        });
    });
    it('returns zero-page metadata for empty lists without implying more data exists', function () {
        expect((0, vendor_product_list_pagination_util_1.buildVendorProductListPagination)({ page: 1, limit: 20, totalCount: 0 })).toEqual({
            page: 1,
            limit: 20,
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            hasMore: false,
            isLastPage: true,
        });
    });
});
