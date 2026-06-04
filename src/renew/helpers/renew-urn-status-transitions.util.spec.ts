import {
  assertRenewUrnStatusTransition,
  assertVendorCannotSetRenewStatus,
  getAllowedRenewUrnStatusTargets,
} from './renew-urn-status-transitions.util';
import { RENEWAL_URN_STATUS } from '../constants/renewal-urn-status.constants';

describe('renew-urn-status-transitions', () => {
  it('allows vendor 14→15 and 16→15', () => {
    expect(
      getAllowedRenewUrnStatusTargets('vendor', RENEWAL_URN_STATUS.PAYMENT_APPROVED),
    ).toEqual([RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS]);
    expect(() =>
      assertRenewUrnStatusTransition(
        'vendor',
        RENEWAL_URN_STATUS.PAYMENT_APPROVED,
        RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
      ),
    ).not.toThrow();
    expect(() =>
      assertRenewUrnStatusTransition(
        'vendor',
        RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING,
        RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
      ),
    ).not.toThrow();
  });

  it('rejects vendor setting 15 directly from cert range intent', () => {
    expect(() => assertVendorCannotSetRenewStatus(17)).toThrow();
    expect(() =>
      assertRenewUrnStatusTransition('vendor', 14, 13),
    ).toThrow();
  });

  it('allows admin payment approve and review transitions', () => {
    expect(() =>
      assertRenewUrnStatusTransition(
        'admin',
        RENEWAL_URN_STATUS.PAYMENT_SUBMITTED,
        RENEWAL_URN_STATUS.PAYMENT_APPROVED,
      ),
    ).not.toThrow();
    expect(() =>
      assertRenewUrnStatusTransition(
        'admin',
        RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
        RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
      ),
    ).not.toThrow();
    expect(() =>
      assertRenewUrnStatusTransition(
        'admin',
        RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
        RENEWAL_URN_STATUS.COMPLETED,
      ),
    ).not.toThrow();
  });
});
