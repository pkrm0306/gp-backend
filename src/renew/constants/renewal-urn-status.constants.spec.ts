import {
  PRODUCT_RENEW_STATUS,
  RENEWAL_URN_STATUS,
  shouldUseRenewWorkflowForUrn,
} from './renewal-urn-status.constants';

describe('shouldUseRenewWorkflowForUrn', () => {
  it('treats certified complete urnStatus 11 as certification flow', () => {
    expect(
      shouldUseRenewWorkflowForUrn({
        urnStatus: RENEWAL_URN_STATUS.COMPLETED,
        productRenewStatus: PRODUCT_RENEW_STATUS.NOT_RENEWED,
      }),
    ).toBe(false);
  });

  it('treats renewal in-progress statuses as renewal flow', () => {
    expect(
      shouldUseRenewWorkflowForUrn({
        urnStatus: 15,
        productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS,
      }),
    ).toBe(true);
  });

  it('treats renewal completed urnStatus 11 as renewal flow', () => {
    expect(
      shouldUseRenewWorkflowForUrn({
        urnStatus: RENEWAL_URN_STATUS.COMPLETED,
        productRenewStatus: PRODUCT_RENEW_STATUS.RENEWED,
      }),
    ).toBe(true);
  });
});
