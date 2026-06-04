import { Types } from 'mongoose';
import {
  buildRenewPaymentFindFilter,
  buildRenewProcessHeaderFilter,
} from './renew-cycle-scope.util';
import { RenewalCycleStatus } from '../schemas/renewal-cycle.schema';

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
});
