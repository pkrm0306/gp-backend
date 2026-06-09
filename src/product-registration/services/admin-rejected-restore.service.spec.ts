import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AdminRejectedRestoreService } from './admin-rejected-restore.service';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_REJECTED,
} from '../../renew/constants/product-status.constants';

describe('AdminRejectedRestoreService', () => {
  const urnNo = 'URN-20260428123027';
  const adminUserId = new Types.ObjectId().toHexString();
  const productObjectId = new Types.ObjectId();
  const manufacturerId = new Types.ObjectId();

  let findOneExec: jest.Mock;
  let findLeanExec: jest.Mock;
  let countDocuments: jest.Mock;
  let updateOne: jest.Mock;
  let productStatusAuditCreate: jest.Mock;
  let auditRecord: jest.Mock;
  let assignNextActiveEoiNo: jest.Mock;
  let applyEoiReassignment: jest.Mock;
  let getMaxActiveSequenceSuffix: jest.Mock;
  let startSession: jest.Mock;
  let service: AdminRejectedRestoreService;

  beforeEach(() => {
    findOneExec = jest.fn();
    findLeanExec = jest.fn();
    countDocuments = jest.fn().mockResolvedValue(0);
    updateOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    });
    productStatusAuditCreate = jest.fn().mockResolvedValue({});
    auditRecord = jest.fn().mockResolvedValue(undefined);
    assignNextActiveEoiNo = jest.fn().mockResolvedValue({
      eoiNo: 'GPPMI003006',
      eoiSequence: 6,
      previousEoiNo: 'GPPMI003003',
    });
    applyEoiReassignment = jest.fn().mockResolvedValue(undefined);
    getMaxActiveSequenceSuffix = jest.fn().mockResolvedValue(5);

    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    startSession = jest.fn().mockResolvedValue(session);

    const productModel = {
      findOne: jest.fn().mockReturnValue({ exec: findOneExec }),
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({ exec: findLeanExec }),
          }),
        }),
      }),
      countDocuments: jest.fn().mockReturnValue({ exec: countDocuments }),
      updateOne,
    };

    service = new AdminRejectedRestoreService(
      productModel as never,
      { create: productStatusAuditCreate } as never,
      { startSession } as never,
      {
        assignNextActiveEoiNo,
        applyEoiReassignment,
        getMaxActiveSequenceSuffix,
      } as never,
      { record: auditRecord } as never,
      {
        deleteByPattern: jest.fn().mockResolvedValue(undefined),
        buildKey: jest.fn((...parts: string[]) => parts.join(':')),
      } as never,
    );
  });

  describe('getRestoreOptions', () => {
    it('allows both targets when URN has no certified products', async () => {
      countDocuments
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(2);

      const result = await service.getRestoreOptions(urnNo);

      expect(result.allowedTargets).toEqual(['uncertified', 'certified']);
      expect(result.rejectedProductCount).toBe(2);
    });

    it('allows certified only when URN has certified products', async () => {
      countDocuments
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);

      const result = await service.getRestoreOptions(urnNo);

      expect(result.allowedTargets).toEqual(['certified']);
    });
  });

  describe('restoreProduct', () => {
    it('assigns new eoiNo on restore to uncertified', async () => {
      findOneExec.mockResolvedValue({
        _id: productObjectId,
        eoiNo: 'GPPMI003003',
        productStatus: PRODUCT_STATUS_REJECTED,
        manufacturerId,
      });
      countDocuments.mockResolvedValue(0);

      const result = await service.restoreProduct(
        urnNo,
        productObjectId.toHexString(),
        PRODUCT_STATUS_PENDING,
        adminUserId,
      );

      expect(result.previousEoiNo).toBe('GPPMI003003');
      expect(result.eoiNo).toBe('GPPMI003006');
      expect(assignNextActiveEoiNo).toHaveBeenCalledWith(
        String(manufacturerId),
        expect.any(Object),
        { previousEoiNo: 'GPPMI003003' },
      );
      expect(applyEoiReassignment).toHaveBeenCalled();
      expect(auditRecord).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'eoi_reassigned_on_restore' }),
      );
    });

    it('blocks uncertified restore when URN has certified products', async () => {
      findOneExec.mockResolvedValue({
        _id: productObjectId,
        eoiNo: 'GPPMI003803',
        productStatus: PRODUCT_STATUS_REJECTED,
        manufacturerId,
      });
      countDocuments.mockResolvedValue(1);

      await expect(
        service.restoreProduct(
          urnNo,
          productObjectId.toHexString(),
          PRODUCT_STATUS_PENDING,
          adminUserId,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws 409 when product is not rejected', async () => {
      findOneExec.mockResolvedValue({
        _id: productObjectId,
        eoiNo: 'GPPMI003803',
        productStatus: PRODUCT_STATUS_CERTIFIED,
        manufacturerId,
      });

      await expect(
        service.restoreProduct(
          urnNo,
          productObjectId.toHexString(),
          PRODUCT_STATUS_CERTIFIED,
          adminUserId,
        ),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('restoreUrn', () => {
    it('restores all rejected products with sequential new EOIs', async () => {
      findLeanExec.mockResolvedValue([
        {
          _id: productObjectId,
          eoiNo: 'GPPMI003003',
          manufacturerId,
        },
      ]);
      countDocuments.mockResolvedValue(0);

      const result = await service.restoreUrn(
        urnNo,
        PRODUCT_STATUS_CERTIFIED,
        adminUserId,
      );

      expect(result.updatedCount).toBe(1);
      expect(result.previousEoiNos).toEqual(['GPPMI003003']);
      expect(result.updatedEoiNos).toEqual(['GPPMI003006']);
    });

    it('throws 404 when URN has no rejected products', async () => {
      findLeanExec.mockResolvedValue([]);

      await expect(
        service.restoreUrn(urnNo, PRODUCT_STATUS_CERTIFIED, adminUserId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
