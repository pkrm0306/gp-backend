import {
  isExpiredProduct,
  matchExpiredProducts,
} from './expired-product.filter';
import {
  isOngoingRenewalProduct,
  matchCertifiedProductsList,
} from './certified-product.filter';
import {
  PRODUCT_RENEW_STATUS,
  RENEWAL_URN_STATUS,
} from '../../renew/constants/renewal-urn-status.constants';

describe('certified + expired product filters (ongoing renewal)', () => {
  const now = new Date('2026-09-10T12:00:00.000Z');
  const past = new Date('2026-07-31T00:00:00.000Z');
  const future = new Date('2027-01-01T00:00:00.000Z');

  it('matchCertifiedProductsList keeps ongoing renewal with past validity', () => {
    const match = matchCertifiedProductsList(now);
    expect(match.productStatus).toBe(2);
    const or = match.$or as Array<Record<string, unknown>>;
    expect(or).toEqual(
      expect.arrayContaining([
        { validtillDate: { $gte: now } },
        {
          urnStatus: {
            $in: [12, 13, 14, 15, 16, 17],
          },
        },
        { productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS },
      ]),
    );
  });

  it('matchExpiredProducts excludes ongoing renewal urn statuses', () => {
    const match = matchExpiredProducts(now);
    const branch = (match.$or as Array<Record<string, unknown>>)[1] as {
      $and: Array<Record<string, unknown>>;
    };
    expect(branch.$and).toEqual(
      expect.arrayContaining([
        { urnStatus: { $nin: [12, 13, 14, 15, 16, 17] } },
        { productRenewStatus: { $ne: PRODUCT_RENEW_STATUS.IN_PROGRESS } },
      ]),
    );
  });

  it('isOngoingRenewalProduct detects urnStatus 12–17 and renew in progress', () => {
    expect(
      isOngoingRenewalProduct({
        urnStatus: RENEWAL_URN_STATUS.PAYMENT_APPROVED,
        productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS,
      }),
    ).toBe(true);
    expect(
      isOngoingRenewalProduct({
        urnStatus: RENEWAL_URN_STATUS.COMPLETED,
        productRenewStatus: PRODUCT_RENEW_STATUS.NOT_RENEWED,
      }),
    ).toBe(false);
    expect(
      isOngoingRenewalProduct({
        urnStatus: RENEWAL_URN_STATUS.COMPLETED,
        productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS,
      }),
    ).toBe(true);
  });

  it('isExpiredProduct is false for ongoing renewal even when validity lapsed', () => {
    expect(isExpiredProduct(2, past, now)).toBe(true);
    expect(
      isExpiredProduct(2, past, now, {
        urnStatus: RENEWAL_URN_STATUS.PAYMENT_APPROVED,
        productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS,
      }),
    ).toBe(false);
    expect(isExpiredProduct(2, future, now)).toBe(false);
  });
});
