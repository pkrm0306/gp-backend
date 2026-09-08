import { Types } from 'mongoose';
import { RenewUrnTabReviewService } from './renew-urn-tab-review.service';
import { RENEWAL_URN_STATUS } from '../constants/renewal-urn-status.constants';
import { RenewalCycleStatus } from '../schemas/renewal-cycle.schema';

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

  describe('resolveRenewalCycleId', () => {
    const completedId = new Types.ObjectId();
    const olderCompletedId = new Types.ObjectId();
    const inProgressId = new Types.ObjectId();
    const explicitId = new Types.ObjectId();

    function mockCycleModel(handlers: {
      findById?: (id: string) => Promise<{ _id: Types.ObjectId; urnNo: string } | null>;
      findOneSequence?: Array<
        | { _id: Types.ObjectId; urnNo: string; status: string; cycleNo?: number }
        | null
      >;
    }) {
      let findOneCall = 0;
      (service as unknown as { renewalCycleModel: unknown }).renewalCycleModel = {
        findById: (id: string) => ({
          exec: async () => handlers.findById?.(id) ?? null,
        }),
        findOne: () => ({
          sort: () => ({
            exec: async () => {
              const seq = handlers.findOneSequence ?? [];
              const row = seq[findOneCall] ?? null;
              findOneCall += 1;
              return row;
            },
          }),
        }),
      };
    }

    it('uses explicit renewalCycleId when provided', async () => {
      mockCycleModel({
        findById: async () => ({ _id: explicitId, urnNo: 'URN-1' }),
      });
      const id = await service.resolveRenewalCycleId('URN-1', String(explicitId));
      expect(id.equals(explicitId)).toBe(true);
    });

    it('falls back to latest COMPLETED when no IN_PROGRESS (multi-renew)', async () => {
      mockCycleModel({
        findOneSequence: [
          null, // IN_PROGRESS miss
          {
            _id: completedId,
            urnNo: 'URN-1',
            status: RenewalCycleStatus.COMPLETED,
            cycleNo: 2,
          },
        ],
      });
      const id = await service.resolveRenewalCycleId('URN-1');
      expect(id.equals(completedId)).toBe(true);
    });

    it('prefers IN_PROGRESS over COMPLETED', async () => {
      mockCycleModel({
        findOneSequence: [
          {
            _id: inProgressId,
            urnNo: 'URN-1',
            status: RenewalCycleStatus.IN_PROGRESS,
            cycleNo: 3,
          },
        ],
      });
      const id = await service.resolveRenewalCycleId('URN-1');
      expect(id.equals(inProgressId)).toBe(true);
    });

    it('throws when no cycle exists at all', async () => {
      mockCycleModel({ findOneSequence: [null, null] });
      await expect(service.resolveRenewalCycleId('URN-1')).rejects.toThrow(
        /renewalCycleId is required when no active renewal cycle exists/,
      );
    });

    it('rejects explicit cycle that does not match URN', async () => {
      mockCycleModel({
        findById: async () => ({ _id: olderCompletedId, urnNo: 'URN-OTHER' }),
      });
      await expect(
        service.resolveRenewalCycleId('URN-1', String(olderCompletedId)),
      ).rejects.toThrow(/does not match this URN/);
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
