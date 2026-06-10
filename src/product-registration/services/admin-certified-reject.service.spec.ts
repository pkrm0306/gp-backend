import { ConflictException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AdminCertifiedRejectService } from './admin-certified-reject.service';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_REJECTED,
} from '../../renew/constants/product-status.constants';

describe('AdminCertifiedRejectService', () => {
  const urnNo = 'URN-20260428123027';
  const adminUserId = new Types.ObjectId().toHexString();
  const productObjectId = new Types.ObjectId();

  let findOneExec: jest.Mock;
  let updateOne: jest.Mock;
  let updateOneExec: jest.Mock;
  let productStatusAuditCreate: jest.Mock;
  let auditRecord: jest.Mock;
  let service: AdminCertifiedRejectService;

  beforeEach(() => {
    findOneExec = jest.fn();
    updateOneExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
    updateOne = jest.fn().mockReturnValue({ exec: updateOneExec });
    productStatusAuditCreate = jest.fn().mockResolvedValue({});
    auditRecord = jest.fn().mockResolvedValue(undefined);

    service = new AdminCertifiedRejectService(
      {
        findOne: jest.fn().mockReturnValue({ exec: findOneExec }),
        updateOne,
      } as never,
      { create: productStatusAuditCreate } as never,
      { record: auditRecord } as never,
      {
        deleteByPattern: jest.fn().mockResolvedValue(undefined),
        buildKey: jest.fn((...parts: string[]) => parts.join(':')),
      } as never,
    );
  });

  it('rejects certified product and keeps eoiNo', async () => {
    findOneExec.mockResolvedValue({
      _id: productObjectId,
      eoiNo: 'GPPMI003026',
      productStatus: PRODUCT_STATUS_CERTIFIED,
    });

    const result = await service.rejectProduct(
      urnNo,
      productObjectId.toHexString(),
      adminUserId,
      { rejectionReason: 'Admin rejected' },
    );

    expect(result.fromStatus).toBe(2);
    expect(result.toStatus).toBe(3);
    expect(result.eoiNo).toBe('GPPMI003026');
    expect(updateOne).toHaveBeenCalledWith(
      { _id: productObjectId, productStatus: PRODUCT_STATUS_CERTIFIED },
      {
        $set: expect.objectContaining({
          productStatus: PRODUCT_STATUS_REJECTED,
          rejectedDetails: 'Admin rejected',
          rejectedAt: expect.any(Date),
        }),
      },
    );
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'certified_reject_product' }),
    );
  });

  it('throws 409 when product is not certified', async () => {
    findOneExec.mockResolvedValue({
      _id: productObjectId,
      eoiNo: 'GPPMI003026',
      productStatus: PRODUCT_STATUS_REJECTED,
    });

    await expect(
      service.rejectProduct(urnNo, productObjectId.toHexString(), adminUserId),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws 404 when product is missing', async () => {
    findOneExec.mockResolvedValue(null);

    await expect(
      service.rejectProduct(urnNo, productObjectId.toHexString(), adminUserId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
