import {
  PRODUCT_RENEW_STATUS,
  RENEWAL_URN_STATUS,
} from '../../renew/constants/renewal-urn-status.constants';
import {
  PUBLIC_PRODUCT_RENEWAL_MESSAGE,
  computePublicWebsiteProductVisibilityFlags,
  isPublicWebsiteProductVisible,
  matchWebsitePublicCertifiedProducts,
  subCalendarMonths,
} from './website-public-product.filter';

describe('website-public-product.filter', () => {
  const now = new Date('2026-09-22T12:00:00.000Z');

  it('matchWebsitePublicCertifiedProducts uses $and visibility branches', () => {
    const match = matchWebsitePublicCertifiedProducts({}, now);
    expect(match.$and).toBeDefined();
    expect(Array.isArray(match.$and)).toBe(true);
  });

  it('keeps active certified products clickable', () => {
    const flags = computePublicWebsiteProductVisibilityFlags(
      {
        productStatus: 2,
        certifiedDate: '2026-05-01T00:00:00.000Z',
        validtillDate: '2028-12-31T00:00:00.000Z',
        urnStatus: 11,
        productRenewStatus: 0,
      },
      now,
    );
    expect(flags.isUnderRenewal).toBe(false);
    expect(flags.isPublicClickable).toBe(true);
    expect(flags.renewalMessage).toBeNull();
    expect(flags.validFrom).toBe('2026-05-01T00:00:00.000Z');
  });

  it('marks ongoing renewal as under renewal and not clickable', () => {
    const flags = computePublicWebsiteProductVisibilityFlags(
      {
        productStatus: 2,
        certifiedDate: '2024-01-01T00:00:00.000Z',
        validtillDate: '2026-08-31T00:00:00.000Z',
        urnStatus: RENEWAL_URN_STATUS.PAYMENT_APPROVED,
        productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS,
      },
      now,
    );
    expect(flags.isUnderRenewal).toBe(true);
    expect(flags.isPublicClickable).toBe(false);
    expect(flags.renewalMessage).toBe(PUBLIC_PRODUCT_RENEWAL_MESSAGE);
    expect(
      isPublicWebsiteProductVisible(
        {
          productStatus: 2,
          validtillDate: '2026-08-31T00:00:00.000Z',
          urnStatus: RENEWAL_URN_STATUS.PAYMENT_APPROVED,
          productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS,
        },
        now,
      ),
    ).toBe(true);
  });

  it('hides ongoing renewal after validtill + 6 months', () => {
    const oldValidTill = subCalendarMonths(now, 7);
    expect(
      isPublicWebsiteProductVisible(
        {
          productStatus: 2,
          validtillDate: oldValidTill,
          urnStatus: RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
          productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS,
        },
        now,
      ),
    ).toBe(false);
  });

  it('keeps expired non-renewing products visible for 3-month grace', () => {
    const twoMonthsAgo = subCalendarMonths(now, 2);
    expect(
      isPublicWebsiteProductVisible(
        {
          productStatus: 2,
          validtillDate: twoMonthsAgo,
          urnStatus: 11,
          productRenewStatus: 0,
        },
        now,
      ),
    ).toBe(true);
    const flags = computePublicWebsiteProductVisibilityFlags(
      {
        productStatus: 2,
        validtillDate: twoMonthsAgo,
        urnStatus: 11,
        productRenewStatus: 0,
      },
      now,
    );
    expect(flags.isUnderRenewal).toBe(true);
    expect(flags.isPublicClickable).toBe(false);
  });

  it('hides expired non-renewing products after 3-month grace', () => {
    const fourMonthsAgo = subCalendarMonths(now, 4);
    expect(
      isPublicWebsiteProductVisible(
        {
          productStatus: 2,
          validtillDate: fourMonthsAgo,
          urnStatus: 11,
          productRenewStatus: 0,
        },
        now,
      ),
    ).toBe(false);
  });

  it('includes discontinued status 4 within 6 months of validtill', () => {
    const threeMonthsAgo = subCalendarMonths(now, 3);
    expect(
      isPublicWebsiteProductVisible(
        {
          productStatus: 4,
          validtillDate: threeMonthsAgo,
        },
        now,
      ),
    ).toBe(true);
    expect(
      isPublicWebsiteProductVisible(
        {
          productStatus: 4,
          validtillDate: subCalendarMonths(now, 7),
        },
        now,
      ),
    ).toBe(false);
  });
});
