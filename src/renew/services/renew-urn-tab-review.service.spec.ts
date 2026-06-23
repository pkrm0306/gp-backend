import { RenewUrnTabReviewService } from './renew-urn-tab-review.service';
import { RENEWAL_URN_STATUS } from '../constants/renewal-urn-status.constants';

describe('RenewUrnTabReviewService', () => {
  const service = Object.create(RenewUrnTabReviewService.prototype) as RenewUrnTabReviewService;

  describe('buildQuickActions', () => {
    it('enables resend when all reviewed and has rejection', () => {
      const actions = service.buildQuickActions({
        allReviewed: true,
        allApproved: false,
        hasRejection: true,
      });
      expect(actions.enableResend).toBe(true);
      expect(actions.enableSubmitFinal).toBe(false);
    });

    it('disables resend when all reviewed and all approved', () => {
      const actions = service.buildQuickActions({
        allReviewed: true,
        allApproved: true,
        hasRejection: false,
      });
      expect(actions.enableResend).toBe(false);
      expect(actions.enableSubmitFinal).toBe(true);
    });

    it('disables both when reviews pending', () => {
      const actions = service.buildQuickActions({
        allReviewed: false,
        allApproved: false,
        hasRejection: false,
      });
      expect(actions.disableBoth).toBe(true);
      expect(actions.enableResend).toBe(false);
      expect(actions.enableSubmitFinal).toBe(false);
    });
  });
});

describe('renew admin status gating', () => {
  it('documents expected transition codes', () => {
    expect(RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS).toBe(15);
    expect(RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING).toBe(16);
    expect(RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING).toBe(17);
  });
});
