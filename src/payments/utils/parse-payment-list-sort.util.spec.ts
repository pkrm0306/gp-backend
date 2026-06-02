import {
  buildPaymentListMongoSort,
  parsePaymentListSort,
} from './parse-payment-list-sort.util';

describe('parsePaymentListSort', () => {
  it('parses asc/desc shorthand as createdDate', () => {
    expect(parsePaymentListSort('asc')).toEqual({
      sortBy: 'createdDate',
      sortOrder: 'asc',
    });
    expect(parsePaymentListSort('desc')).toEqual({
      sortBy: 'createdDate',
      sortOrder: 'desc',
    });
  });

  it('parses field:order', () => {
    expect(parsePaymentListSort('createdAt:desc')).toEqual({
      sortBy: 'createdDate',
      sortOrder: 'desc',
    });
    expect(parsePaymentListSort('updatedAt:asc')).toEqual({
      sortBy: 'updatedDate',
      sortOrder: 'asc',
    });
  });

  it('builds mongo sort with tie-breaker paymentId', () => {
    expect(buildPaymentListMongoSort(parsePaymentListSort('createdAt:desc'))).toEqual({
      createdDate: -1,
      paymentId: -1,
    });
  });
});
