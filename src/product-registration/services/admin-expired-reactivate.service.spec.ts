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
  let bulkWrite: jest.Mock;
  let productStatusAuditCreate: jest.Mock;
  let productStatusAuditInsertMany: jest.Mock;
  let auditRecord: jest.Mock;
  let auditRecordMany: jest.Mock;
  let service: AdminExpiredReactivateService;

  beforeEach(() => {
    findOneExec = jest.fn();
    findLeanExec = jest.fn();
    updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
    bulkWrite = jest.fn().mockResolvedValue({ modifiedCount: 0 });
    productStatusAuditCreate = jest.fn().mockResolvedValue({});
    productStatusAuditInsertMany = jest.fn().mockResolvedValue([]);
    auditRecord = jest.fn().mockResolvedValue(undefined);
    auditRecordMany = jest.fn().mockResolvedValue(undefined);

    const productModel = {
      findOne: jest.fn().mockReturnValue({ exec: findOneExec }),
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({ exec: findLeanExec }),
        }),
      }),
      updateOne,
      bulkWrite,
    };

    service = new AdminExpiredReactivateService(
      productModel as never,
      {
        create: productStatusAuditCreate,
        insertMany: productStatusAuditInsertMany,
      } as never,
      { record: auditRecord, recordMany: auditRecordMany } as never,
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
      expect.objectContaining({
        action: 'expired_reactivate_product',
        description: 'Expired product reactivated to certified',
        old_values: {
          fromStatus: PRODUCT_STATUS_DISCONTINUED,
          productStatus: PRODUCT_STATUS_DISCONTINUED,
        },
        new_values: {
          toStatus: PRODUCT_STATUS_CERTIFIED,
          productStatus: PRODUCT_STATUS_CERTIFIED,
          urnNo,
          eoiNo: 'GPPMI003026',
        },
        metadata: expect.objectContaining({
          business_event_type: 'expired_to_certified',
        }),
      }),
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
    // Soft-expired: audit shows Expired → Certified (workflow), while
    // product_status_audit keeps raw Certified fromStatus.
    expect(productStatusAuditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        fromStatus: PRODUCT_STATUS_CERTIFIED,
        toStatus: PRODUCT_STATUS_CERTIFIED,
      }),
    );
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Expired product reactivated to certified',
        old_values: {
          fromStatus: PRODUCT_STATUS_DISCONTINUED,
          productStatus: PRODUCT_STATUS_DISCONTINUED,
        },
        new_values: expect.objectContaining({
          toStatus: PRODUCT_STATUS_CERTIFIED,
          productStatus: PRODUCT_STATUS_CERTIFIED,
        }),
        metadata: expect.objectContaining({
          soft_expired: true,
          business_event_type: 'expired_to_certified',
        }),
      }),
    );
  });

  it('records Expired→Certified audit when validity is retained (future validtill)', async () => {
    const futureTill = new Date();
    futureTill.setFullYear(futureTill.getFullYear() + 2);
    findOneExec.mockResolvedValue({
      _id: productObjectId,
      eoiNo: 'GPPMI003026',
      productStatus: PRODUCT_STATUS_DISCONTINUED,
      validtillDate: futureTill,
    });

    await service.reactivateProduct(
      urnNo,
      productObjectId.toHexString(),
      adminUserId,
    );

    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Expired product reactivated to certified',
        old_values: {
          fromStatus: PRODUCT_STATUS_DISCONTINUED,
          productStatus: PRODUCT_STATUS_DISCONTINUED,
        },
        new_values: expect.objectContaining({
          toStatus: PRODUCT_STATUS_CERTIFIED,
          productStatus: PRODUCT_STATUS_CERTIFIED,
        }),
        metadata: expect.objectContaining({
          business_event_type: 'expired_to_certified',
          validity_extended: false,
        }),
      }),
    );
  });

  it('throws 404 when product is missing', async () => {
    findOneExec.mockResolvedValue(null);

    await expect(
      service.reactivateProduct(urnNo, productObjectId.toHexString(), adminUserId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('bulk-reactivates all expired products on a URN with one bulkWrite', async () => {
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
    bulkWrite.mockResolvedValue({ modifiedCount: 2 });

    const result = await service.reactivateUrn(urnNo, adminUserId);

    expect(result.updatedCount).toBe(2);
    expect(result.modifiedCount).toBe(2);
    expect(result.updatedEoiNos).toEqual(['GPPMI003026', 'GPPMI003027']);
    expect(bulkWrite).toHaveBeenCalledTimes(1);
    expect(bulkWrite).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          updateOne: expect.objectContaining({
            filter: { _id: productObjectId },
          }),
        }),
        expect.objectContaining({
          updateOne: expect.objectContaining({
            filter: { _id: secondId },
          }),
        }),
      ]),
      { ordered: false },
    );
    expect(updateOne).not.toHaveBeenCalled();
    expect(productStatusAuditInsertMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ productId: productObjectId }),
        expect.objectContaining({ productId: secondId }),
      ]),
      { ordered: false },
    );
    expect(auditRecordMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'expired_reactivate_urn',
          entity_name: 'GPPMI003026',
          description: 'Expired product on URN reactivated to certified',
          old_values: {
            fromStatus: PRODUCT_STATUS_DISCONTINUED,
            productStatus: PRODUCT_STATUS_DISCONTINUED,
          },
          new_values: expect.objectContaining({
            toStatus: PRODUCT_STATUS_CERTIFIED,
            productStatus: PRODUCT_STATUS_CERTIFIED,
            eoiNo: 'GPPMI003026',
          }),
        }),
        expect.objectContaining({
          action: 'expired_reactivate_urn',
          entity_name: 'GPPMI003027',
          description: 'Expired product on URN reactivated to certified',
          old_values: {
            fromStatus: PRODUCT_STATUS_DISCONTINUED,
            productStatus: PRODUCT_STATUS_DISCONTINUED,
          },
          metadata: expect.objectContaining({ soft_expired: true }),
        }),
      ]),
    );
    expect(auditRecord).not.toHaveBeenCalled();
  });

  it('throws 404 when URN has no expired products', async () => {
    findLeanExec.mockResolvedValue([]);

    await expect(service.reactivateUrn(urnNo, adminUserId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
