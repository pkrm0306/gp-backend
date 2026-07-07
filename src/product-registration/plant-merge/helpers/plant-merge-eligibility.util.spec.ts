import { Types } from 'mongoose';
import {
  buildProductRenewalBlockers,
  validateRemainingPlantCount,
  validateSourcePlantSelection,
} from './plant-merge-eligibility.util';

describe('plant-merge-eligibility.util', () => {
  it('blocks urnStatus 12-17', () => {
    const blockers = buildProductRenewalBlockers('Product', { urnStatus: 14, productRenewStatus: 0 });
    expect(blockers[0]?.code).toBe('RENEWAL_URN_STATUS_ACTIVE');
  });

  it('rejects target in source list', () => {
    const id = new Types.ObjectId().toHexString();
    const blockers = validateSourcePlantSelection(id, [id]);
    expect(blockers.some((b) => b.code === 'TARGET_IN_SOURCE_LIST')).toBe(true);
  });

  it('requires at least one plant to remain', () => {
    const blockers = validateRemainingPlantCount(2, 2);
    expect(blockers[0]?.code).toBe('MIN_PLANTS_REQUIRED');
  });

  it('allows merge when one plant remains', () => {
    expect(validateRemainingPlantCount(3, 2)).toHaveLength(0);
  });
});
