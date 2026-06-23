import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AdminExpiredReactivateService } from './admin-expired-reactivate.service';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
} from '../../renew/constants/product-status.constants';

describe('AdminExpiredReactivateService', () => {
  const urnNo = 'URN-20260428123027';
  const adminUserId = new Types.ObjectId().toHexString();
  const productObjectId = new Types.ObjectId();

  let findOneExec: jest.Mock;
  let findLeanExec: jest.Mock;
  let updateOne: jest.Mock;
  let productStatusAuditCreate: jest.Mock;
  let auditRecord: jest.Mock;
  let service: AdminExpiredReactivateService;

  beforeEach(() => {
    findOneExec = jest.fn();
    findLeanExec = jest.fn();
    updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
    productStatusAuditCreate = jest.fn().mockResolvedValue({});
    auditRecord = jest.fn().mockResolvedValue(undefined);

    const productModel = {
      findOne: jest.fn().mockReturnValue({ exec: findOneExec }),
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({ exec: findLeanExec }),
        }),
      }),
      updateOne,
    };

    service = new AdminExpiredReactivateService(
      productModel as never,
      { create: productStatusAuditCreate } as never,
      { record: auditRecord } as never,
      {
        del: jest.fn(),
        deleteByPattern: jest.fn().mockResolvedValue(0),
        buildKey: jest.fn((...parts: string[]) => parts.join(':')),
      } as never,
    );
  });

  it('reactivates one expired product by Mongo _id', async () => {
    findOneExec.mockResolvedValue({
      _id: productObjectId,
      eoiNo: 'GPPMI003026',
      productStatus: PRODUCT_STATUS_DISCONTINUED,
      validtillDate: new Date('2026-04-28T00:00:00.000Z'),
    });

    const result = await service.reactivateProduct(
      urnNo,
      productObjectId.toHexString(),
      adminUserId,
    );

    expect(result.success).toBe(true);
    expect(result.fromStatus).toBe(4);
    expect(result.toStatus).toBe(2);
    expect(updateOne).toHaveBeenCalledWith(
      { _id: productObjectId },
      {
        $set: expect.objectContaining({
          productStatus: PRODUCT_STATUS_CERTIFIED,
          discontinuedAt: null,
          discontinuedBy: null,
        }),
      },
    );
    expect(productStatusAuditCreate).toHaveBeenCalled();
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'expired_reactivate_product' }),
    );
  });

  it('reactivates one expired product by numeric productId', async () => {
    findOneExec.mockResolvedValue({
      _id: productObjectId,
      eoiNo: 'GPPMI003026',
      productStatus: PRODUCT_STATUS_DISCONTINUED,
      validtillDate: new Date('2028-01-01T00:00:00.000Z'),
    });

    await service.reactivateProduct(urnNo, '366', adminUserId);

    expect(findOneExec).toHaveBeenCalled();
    expect(updateOne).toHaveBeenCalled();
  });

  it('throws 409 when product is not expired', async () => {
    findOneExec.mockResolvedValue({
      _id: productObjectId,
      eoiNo: 'GPPMI003026',
      productStatus: PRODUCT_STATUS_CERTIFIED,
      validtillDate: new Date('2028-01-01T00:00:00.000Z'),
    });

    await expect(
      service.reactivateProduct(urnNo, productObjectId.toHexString(), adminUserId),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('reactivates certified product that is past validtillDate', async () => {
    findOneExec.mockResolvedValue({
      _id: productObjectId,
      eoiNo: 'GPPMI003026',
      productStatus: PRODUCT_STATUS_CERTIFIED,
      validtillDate: new Date('2020-01-01T00:00:00.000Z'),
    });

    const result = await service.reactivateProduct(
      urnNo,
      productObjectId.toHexString(),
      adminUserId,
    );

    expect(result.success).toBe(true);
    expect(result.fromStatus).toBe(PRODUCT_STATUS_CERTIFIED);
    expect(updateOne).toHaveBeenCalled();
  });

  it('throws 404 when product is missing', async () => {
    findOneExec.mockResolvedValue(null);

    await expect(
      service.reactivateProduct(urnNo, productObjectId.toHexString(), adminUserId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('reactivates all expired products on a URN', async () => {
    const secondId = new Types.ObjectId();
    findLeanExec.mockResolvedValue([
      {
        _id: productObjectId,
        eoiNo: 'GPPMI003026',
        validtillDate: new Date('2026-04-28T00:00:00.000Z'),
        productStatus: PRODUCT_STATUS_DISCONTINUED,
      },
      {
        _id: secondId,
        eoiNo: 'GPPMI003027',
        validtillDate: new Date('2020-01-01T00:00:00.000Z'),
        productStatus: PRODUCT_STATUS_CERTIFIED,
      },
    ]);

    const result = await service.reactivateUrn(urnNo, adminUserId);

    expect(result.updatedCount).toBe(2);
    expect(result.updatedEoiNos).toEqual(['GPPMI003026', 'GPPMI003027']);
    expect(updateOne).toHaveBeenCalledTimes(2);
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'expired_reactivate_urn' }),
    );
  });

  it('throws 404 when URN has no expired products', async () => {
    findLeanExec.mockResolvedValue([]);

    await expect(service.reactivateUrn(urnNo, adminUserId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
