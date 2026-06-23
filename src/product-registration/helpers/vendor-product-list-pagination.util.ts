export interface VendorProductListPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  isLastPage: boolean;
}

/** Normalizes vendor EOI list pagination so clients can stop fetching reliably. */
export function buildVendorProductListPagination(params: {
  page: number;
  limit: number;
  totalCount: number;
}): VendorProductListPagination {
  const limit = Math.max(1, Number(params.limit) || 1);
  const totalCount = Math.max(0, Number(params.totalCount) || 0);
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : 0;
  const maxPage = totalPages > 0 ? totalPages : 1;
  const page = Math.min(Math.max(1, Number(params.page) || 1), maxPage);
  const hasMore = totalPages > 0 && page < totalPages;

  return {
    page,
    limit,
    totalCount,
    totalPages,
    currentPage: page,
    hasMore,
    isLastPage: !hasMore,
  };
}
