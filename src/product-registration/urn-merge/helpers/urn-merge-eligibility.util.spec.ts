import {
  URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE,
  buildOwnershipMismatchBlocker,
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
    const blockers = findEoiCollisions(new Set(['GP001']), [
      { eoiNo: 'GP001' },
    ]);
    expect(blockers[0]?.code).toBe('EOI_COLLISION');
  });

  it('does not add ownership blocker when manufacturer and vendor match', () => {
    const vendorId = new Types.ObjectId();
    const manufacturerId = new Types.ObjectId();

    expect(
      buildOwnershipMismatchBlocker(
        { vendorId, manufacturerId },
        { vendorId, manufacturerId },
      ),
    ).toHaveLength(0);
  });

  it('returns one consolidated blocker when vendor differs', () => {
    const manufacturerId = new Types.ObjectId();
    const blockers = buildOwnershipMismatchBlocker(
      { vendorId: new Types.ObjectId(), manufacturerId },
      { vendorId: new Types.ObjectId(), manufacturerId },
    );

    expect(blockers).toEqual([
      {
        code: 'VENDOR_MISMATCH',
        message: URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE,
      },
    ]);
  });

  it('returns one consolidated blocker when manufacturer differs', () => {
    const vendorId = new Types.ObjectId();
    const blockers = buildOwnershipMismatchBlocker(
      { vendorId, manufacturerId: new Types.ObjectId() },
      { vendorId, manufacturerId: new Types.ObjectId() },
    );

    expect(blockers).toEqual([
      {
        code: 'MANUFACTURER_MISMATCH',
        message: URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE,
      },
    ]);
  });

  it('returns one consolidated blocker when manufacturer and vendor differ', () => {
    const blockers = buildOwnershipMismatchBlocker(
      {
        vendorId: new Types.ObjectId(),
        manufacturerId: new Types.ObjectId(),
      },
      {
        vendorId: new Types.ObjectId(),
        manufacturerId: new Types.ObjectId(),
      },
    );

    expect(blockers).toHaveLength(1);
    expect(blockers[0]).toEqual({
      code: 'VENDOR_MISMATCH',
      message: URN_MERGE_OWNERSHIP_MISMATCH_MESSAGE,
    });
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
