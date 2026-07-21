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
  const manufacturerId = new Types.ObjectId();

  let findOneExec: jest.Mock;
  let findExec: jest.Mock;
  let updateOne: jest.Mock;
  let updateOneExec: jest.Mock;
  let bulkWrite: jest.Mock;
  let productStatusAuditCreate: jest.Mock;
  let productStatusAuditInsertMany: jest.Mock;
  let auditRecord: jest.Mock;
  let auditRecordMany: jest.Mock;
  let notifyProductRejected: jest.Mock;
  let service: AdminCertifiedRejectService;

  beforeEach(() => {
    findOneExec = jest.fn();
    findExec = jest.fn();
    updateOneExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
    updateOne = jest.fn().mockReturnValue({ exec: updateOneExec });
    bulkWrite = jest.fn().mockResolvedValue({ modifiedCount: 2 });
    productStatusAuditCreate = jest.fn().mockResolvedValue({});
    productStatusAuditInsertMany = jest.fn().mockResolvedValue([]);
    auditRecord = jest.fn().mockResolvedValue(undefined);
    auditRecordMany = jest.fn().mockResolvedValue(undefined);
    notifyProductRejected = jest.fn().mockResolvedValue(undefined);

    service = new AdminCertifiedRejectService(
      {
        findOne: jest.fn().mockReturnValue({ exec: findOneExec }),
        find: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({ exec: findExec }),
          }),
        }),
        updateOne,
        bulkWrite,
      } as never,
      {
        create: productStatusAuditCreate,
        insertMany: productStatusAuditInsertMany,
      } as never,
      { record: auditRecord, recordMany: auditRecordMany } as never,
      {
        deleteByPattern: jest.fn().mockResolvedValue(undefined),
        buildKey: jest.fn((...parts: string[]) => parts.join(':')),
      } as never,
      { notifyProductRejected } as never,
    );
  });

  it('rejects certified product and keeps eoiNo', async () => {
    findOneExec.mockResolvedValue({
      _id: productObjectId,
      eoiNo: 'GPPMI003026',
      productName: 'Green Cement',
      manufacturerId,
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
    expect(notifyProductRejected).toHaveBeenCalledWith(
      expect.objectContaining({
        manufacturerId: manufacturerId.toHexString(),
        urnNo,
        productName: 'Green Cement',
        reason: 'Admin rejected',
      }),
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
    expect(notifyProductRejected).not.toHaveBeenCalled();
  });

  it('throws 404 when product is missing', async () => {
    findOneExec.mockResolvedValue(null);

    await expect(
      service.rejectProduct(urnNo, productObjectId.toHexString(), adminUserId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects all certified products on a URN', async () => {
    const secondId = new Types.ObjectId();
    findExec.mockResolvedValue([
      {
        _id: productObjectId,
        eoiNo: 'GPPMI003026',
        productName: 'Product A',
        manufacturerId,
        productStatus: PRODUCT_STATUS_CERTIFIED,
      },
      {
        _id: secondId,
        eoiNo: 'GPPMI003027',
        productName: 'Product B',
        manufacturerId,
        productStatus: PRODUCT_STATUS_CERTIFIED,
      },
    ]);

    const result = await service.rejectUrn(urnNo, adminUserId);

    expect(result.success).toBe(true);
    expect(result.updatedCount).toBe(2);
    expect(result.updatedProductIds).toEqual([
      productObjectId.toHexString(),
      secondId.toHexString(),
    ]);
    expect(result.updatedEoiNos).toEqual(['GPPMI003026', 'GPPMI003027']);
    expect(bulkWrite).toHaveBeenCalled();
    expect(productStatusAuditInsertMany).toHaveBeenCalled();
    expect(auditRecordMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'certified_reject_urn',
          route: '/api/admin/products/certified-reject/urn',
        }),
      ]),
    );
    expect(notifyProductRejected).toHaveBeenCalledTimes(2);
  });

  it('throws 404 when URN has no certified products', async () => {
    findExec.mockResolvedValue([]);

    await expect(service.rejectUrn(urnNo, adminUserId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(bulkWrite).not.toHaveBeenCalled();
    expect(notifyProductRejected).not.toHaveBeenCalled();
  });
});
