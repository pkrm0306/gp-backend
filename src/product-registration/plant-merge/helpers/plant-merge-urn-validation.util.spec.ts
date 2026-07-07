import { Types } from 'mongoose';
import { PRODUCT_STATUS_CERTIFIED } from '../../../renew/constants/product-status.constants';
import {
  buildPlantMergeUrnPairValidationBlockers,
  exactProductNamesMatch,
  isCertifiedProductRow,
  isSameSourceAndTargetPair,
  isTargetOlderThanSource,
} from './plant-merge-urn-validation.util';
import { PLANT_MERGE_URN_VALIDATION_BLOCKER } from '../plant-merge-urn-validation.constants';

describe('plant-merge-urn-validation.util', () => {
  const manufacturerId = new Types.ObjectId();
  const categoryId = new Types.ObjectId();

  const source = {
    _id: new Types.ObjectId(),
    productName: 'Cement Board',
    eoiNo: 'GP100',
    urnNo: 'URN-SOURCE',
    productStatus: PRODUCT_STATUS_CERTIFIED,
    manufacturerId,
    categoryId,
    certifiedDate: new Date('2024-06-01'),
    createdDate: new Date('2024-06-01'),
  };

  const target = {
    _id: new Types.ObjectId(),
    productName: 'Cement Board',
    eoiNo: 'GP001',
    urnNo: 'URN-TARGET',
    productStatus: PRODUCT_STATUS_CERTIFIED,
    manufacturerId,
    categoryId,
    certifiedDate: new Date('2023-01-01'),
    createdDate: new Date('2023-01-01'),
  };

  it('requires exact product name match', () => {
    expect(exactProductNamesMatch('Cement Board', 'cement board')).toBe(false);
    expect(exactProductNamesMatch('Cement Board', 'Cement Board')).toBe(true);
  });

  it('detects same source and target pair', () => {
    expect(
      isSameSourceAndTargetPair({
        sourceUrnNo: 'URN-A',
        targetUrnNo: 'URN-A',
        sourceEoiNo: 'GP001',
        targetEoiNo: 'GP001',
      }),
    ).toBe(true);
  });

  it('requires target to be older than source', () => {
    expect(isTargetOlderThanSource(target, source)).toBe(true);
    expect(isTargetOlderThanSource(source, target)).toBe(false);
  });

  it('returns no blockers for a valid pair', () => {
    expect(buildPlantMergeUrnPairValidationBlockers(source, target)).toHaveLength(0);
  });

  it('flags manufacturer mismatch', () => {
    const blockers = buildPlantMergeUrnPairValidationBlockers(source, {
      ...target,
      manufacturerId: new Types.ObjectId(),
    });
    expect(blockers.some((b) => b.code === PLANT_MERGE_URN_VALIDATION_BLOCKER.MANUFACTURER_MISMATCH)).toBe(true);
  });

  it('flags uncertified target', () => {
    expect(
      isCertifiedProductRow({ productStatus: 1 }),
    ).toBe(false);
  });
});
