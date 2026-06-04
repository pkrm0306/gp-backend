import {
  buildRenewalBlockers,
  findEoiCollisions,
  selectCertifiedProductsToMove,
} from './urn-merge-eligibility.util';
import { Types } from 'mongoose';

describe('urn-merge-eligibility.util', () => {
  it('blocks urnStatus 12-17', () => {
    const blockers = buildRenewalBlockers('Source', [{ urnStatus: 14 }]);
    expect(blockers[0]?.code).toBe('RENEWAL_URN_STATUS_ACTIVE');
  });

  it('allows urnStatus 11 (renewal completed)', () => {
    expect(buildRenewalBlockers('Source', [{ urnStatus: 11 }])).toHaveLength(0);
  });

  it('detects EOI collision', () => {
    const blockers = findEoiCollisions(new Set(['GP001']), [{ eoiNo: 'GP001' }]);
    expect(blockers[0]?.code).toBe('EOI_COLLISION');
  });

  it('selects certified subset by productIds', () => {
    const rows = [
      {
        _id: new Types.ObjectId(),
        productId: 1,
        eoiNo: 'A',
        productName: 'a',
        productStatus: 2,
        categoryId: new Types.ObjectId(),
        vendorId: new Types.ObjectId(),
        manufacturerId: new Types.ObjectId(),
        urnStatus: 0,
        productRenewStatus: 0,
      },
      {
        _id: new Types.ObjectId(),
        productId: 2,
        eoiNo: 'B',
        productName: 'b',
        productStatus: 3,
        categoryId: new Types.ObjectId(),
        vendorId: new Types.ObjectId(),
        manufacturerId: new Types.ObjectId(),
        urnStatus: 0,
        productRenewStatus: 0,
      },
    ];
    const selected = selectCertifiedProductsToMove(rows, false, [1]);
    expect(selected).toHaveLength(1);
    expect(selected[0].productId).toBe(1);
  });
});
