import { Types } from 'mongoose';
import {
  buildPlantIdentityKey,
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

  describe('buildPlantIdentityKey', () => {
    const keralaId = new Types.ObjectId();

    it('treats same-state plants as distinct when city or name differs', () => {
      const thiruvananthapuram = buildPlantIdentityKey({
        plantName: 'R R KABEL LIMITED 6',
        plantLocation: 'Plot no K8 1 SIPCOT',
        city: 'thiruvananthapurar',
        stateId: keralaId,
        stateName: 'Kerala',
      });
      const kochi = buildPlantIdentityKey({
        plantName: 'Kerala 2',
        plantLocation: 'Main Road',
        city: 'Kochi',
        stateId: keralaId,
        stateName: 'Kerala',
      });
      expect(thiruvananthapuram).not.toBe(kochi);
    });

    it('matches only when name, city, and state all match', () => {
      const left = buildPlantIdentityKey({
        plantName: 'Mumbai',
        plantLocation: 'Andheri',
        city: 'Mumbai',
        stateName: 'Maharashtra',
      });
      const right = buildPlantIdentityKey({
        plantName: 'mumbai',
        plantLocation: 'Andheri',
        city: 'Mumbai',
        stateName: 'Maharashtra',
      });
      expect(left).toBe(right);
    });

    it('does not treat empty plantLocation as city', () => {
      const withCity = buildPlantIdentityKey({
        plantName: 'Plant A',
        plantLocation: '',
        city: 'Kochi',
        stateName: 'Kerala',
      });
      const otherCity = buildPlantIdentityKey({
        plantName: 'Plant A',
        plantLocation: '',
        city: 'Thiruvananthapuram',
        stateName: 'Kerala',
      });
      expect(withCity).not.toBe(otherCity);
    });
  });
});
