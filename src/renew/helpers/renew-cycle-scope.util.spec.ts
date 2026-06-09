import { Types } from 'mongoose';
import {
  buildRenewPaymentFindFilter,
  buildRenewProcessHeaderFilter,
  canAdminAccessRenewProcessTabs,
  resolveCycleScopedUrnStatus,
} from './renew-cycle-scope.util';
import { RenewalCycleStatus } from '../schemas/renewal-cycle.schema';
import { RENEWAL_URN_STATUS } from '../constants/renewal-urn-status.constants';

describe('renew-cycle-scope.util', () => {
  const cycleId = new Types.ObjectId();
  const cycle = {
    _id: cycleId,
    urnNo: 'URN-1',
    cycleNo: 2,
    status: RenewalCycleStatus.IN_PROGRESS,
    paymentId: null,
  } as const;

  it('strict process header filter for cycle 2+', () => {
    expect(buildRenewProcessHeaderFilter('URN-1', cycle as never)).toEqual({
      urnNo: 'URN-1',
      renewalCycleId: cycleId,
    });
  });

  it('renew payment filter prefers renewalCycleId for active cycle', () => {
    const filter = buildRenewPaymentFindFilter('URN-1', cycle as never);
    expect(filter.paymentType).toBe('renew');
    expect(filter.$or).toEqual([{ renewalCycleId: cycleId }]);
  });

  it('cycle 2+ does not match legacy untagged payments via paymentId', () => {
    const cycle2 = {
      ...cycle,
      paymentId: 999,
    };
    const filter = buildRenewPaymentFindFilter('URN-1', cycle2 as never);
    expect(filter.$or).toEqual([{ renewalCycleId: cycleId }]);
  });

  it('cycle 1 allows legacy untagged renew payments', () => {
    const cycle1 = {
      _id: cycleId,
      urnNo: 'URN-1',
      cycleNo: 1,
      status: RenewalCycleStatus.IN_PROGRESS,
      paymentId: null,
    };
    const filter = buildRenewPaymentFindFilter('URN-1', cycle1 as never);
    expect(filter.$or).toHaveLength(3);
  });

  describe('resolveCycleScopedUrnStatus', () => {
    it('returns payment pending for new in-progress cycle when product still shows completed', () => {
      const status = resolveCycleScopedUrnStatus(
        { cycleNo: 2, status: RenewalCycleStatus.IN_PROGRESS },
        { urnStatus: RENEWAL_URN_STATUS.COMPLETED, renewCycleNo: 2 },
        { paymentStatus: 0 },
      );
      expect(status).toBe(RENEWAL_URN_STATUS.PAYMENT_PENDING);
    });

    it('returns live product status for active matching cycle', () => {
      const status = resolveCycleScopedUrnStatus(
        { cycleNo: 2, status: RenewalCycleStatus.IN_PROGRESS },
        { urnStatus: RENEWAL_URN_STATUS.PAYMENT_SUBMITTED, renewCycleNo: 2 },
        { paymentStatus: 1 },
      );
      expect(status).toBe(RENEWAL_URN_STATUS.PAYMENT_SUBMITTED);
    });

    it('returns completed for completed renewal cycles', () => {
      const status = resolveCycleScopedUrnStatus(
        { cycleNo: 1, status: RenewalCycleStatus.COMPLETED },
        { urnStatus: RENEWAL_URN_STATUS.PAYMENT_PENDING, renewCycleNo: 2 },
        { paymentStatus: 0 },
      );
      expect(status).toBe(RENEWAL_URN_STATUS.COMPLETED);
    });

    it('infers submitted status from payment when product cycle lags', () => {
      const status = resolveCycleScopedUrnStatus(
        { cycleNo: 3, status: RenewalCycleStatus.IN_PROGRESS },
        { urnStatus: RENEWAL_URN_STATUS.COMPLETED, renewCycleNo: 2 },
        { paymentStatus: 1 },
      );
      expect(status).toBe(RENEWAL_URN_STATUS.PAYMENT_SUBMITTED);
    });
  });

  describe('canAdminAccessRenewProcessTabs', () => {
    it('locks tabs below payment approved', () => {
      expect(canAdminAccessRenewProcessTabs(12)).toBe(false);
      expect(canAdminAccessRenewProcessTabs(13)).toBe(false);
    });

    it('unlocks tabs at payment approved and beyond', () => {
      expect(canAdminAccessRenewProcessTabs(14)).toBe(true);
      expect(canAdminAccessRenewProcessTabs(15)).toBe(true);
      expect(canAdminAccessRenewProcessTabs(11)).toBe(true);
    });
  });
});
