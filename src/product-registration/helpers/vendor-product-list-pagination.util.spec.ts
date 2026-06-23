import { buildVendorProductListPagination } from './vendor-product-list-pagination.util';

describe('buildVendorProductListPagination', () => {
  it('marks the last page when all URNs fit in one page', () => {
    expect(buildVendorProductListPagination({ page: 1, limit: 20, totalCount: 5 })).toEqual({
      page: 1,
      limit: 20,
      totalCount: 5,
      totalPages: 1,
      currentPage: 1,
      hasMore: false,
      isLastPage: true,
    });
  });

  it('signals hasMore while additional pages remain', () => {
    expect(buildVendorProductListPagination({ page: 1, limit: 10, totalCount: 25 })).toMatchObject({
      totalPages: 3,
      hasMore: true,
      isLastPage: false,
    });
    expect(buildVendorProductListPagination({ page: 3, limit: 10, totalCount: 25 })).toMatchObject({
      page: 3,
      hasMore: false,
      isLastPage: true,
    });
  });

  it('clamps page beyond totalPages to avoid endless fetch loops', () => {
    expect(buildVendorProductListPagination({ page: 99, limit: 10, totalCount: 25 })).toMatchObject({
      page: 3,
      totalPages: 3,
      hasMore: false,
      isLastPage: true,
    });
  });

  it('returns zero-page metadata for empty lists without implying more data exists', () => {
    expect(buildVendorProductListPagination({ page: 1, limit: 20, totalCount: 0 })).toEqual({
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
