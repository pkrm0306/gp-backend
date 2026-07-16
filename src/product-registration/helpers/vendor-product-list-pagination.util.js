"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildVendorProductListPagination = buildVendorProductListPagination;
/** Normalizes vendor EOI list pagination so clients can stop fetching reliably. */
function buildVendorProductListPagination(params) {
    var limit = Math.max(1, Number(params.limit) || 1);
    var totalCount = Math.max(0, Number(params.totalCount) || 0);
    var totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : 0;
    var maxPage = totalPages > 0 ? totalPages : 1;
    var page = Math.min(Math.max(1, Number(params.page) || 1), maxPage);
    var hasMore = totalPages > 0 && page < totalPages;
    return {
        page: page,
        limit: limit,
        totalCount: totalCount,
        totalPages: totalPages,
        currentPage: page,
        hasMore: hasMore,
        isLastPage: !hasMore,
    };
}
