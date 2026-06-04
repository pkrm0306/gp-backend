import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AdminRenewProductDiscontinueService } from './services/admin-renew-product-discontinue.service';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
  PRODUCT_STATUS_PENDING,
} from './constants/product-status.constants';

describe('AdminRenewProductDiscontinueService', () => {
  const urnNo = 'URN-202606020001';
  const adminUserId = new Types.ObjectId().toHexString();
  const productId = new Types.ObjectId();

  let findChain: { lean: jest.Mock; exec: jest.Mock };
  let findOneExec: jest.Mock;
  let updateOne: jest.Mock;
  let updateMany: jest.Mock;
  let auditCreate: jest.Mock;
  let auditInsertMany: jest.Mock;
  let service: AdminRenewProductDiscontinueService;

  beforeEach(() => {
    findChain = {
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };
    findOneExec = jest.fn();
    updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
    updateMany = jest.fn().mockResolvedValue({ modifiedCount: 0 });
    auditCreate = jest.fn().mockResolvedValue({});
    auditInsertMany = jest.fn().mockResolvedValue([]);

    const productModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue(findChain),
        }),
      }),
      findOne: jest.fn().mockReturnValue({ exec: findOneExec }),
      updateOne,
      updateMany,
    };

    const auditModel = {
      create: auditCreate,
      insertMany: auditInsertMany,
    };

    service = new AdminRenewProductDiscontinueService(
      productModel as any,
      auditModel as any,
    );
  });

  it('lists products for URN sorted by createdDate', async () => {
    const createdDate = new Date('2024-01-15T10:00:00.000Z');
    findChain.exec.mockResolvedValue([
      {
        _id: productId,
        eoiNo: 'EOI-1',
        productName: 'Sample',
        productStatus: 2,
        createdDate,
      },
    ]);

    const data = await service.listProducts(urnNo);

    expect(data).toEqual([
      {
        _id: String(productId),
        eoiNo: 'EOI-1',
        productName: 'Sample',
        productStatus: 2,
        createdAt: createdDate,
      },
    ]);
  });

  it('toggles 2 → 4 and sets discontinue fields with audit', async () => {
    findOneExec.mockResolvedValue({
      _id: productId,
      urnNo,
      productStatus: PRODUCT_STATUS_CERTIFIED,
    });

    const result = await service.toggleProductStatus(
      urnNo,
      String(productId),
      PRODUCT_STATUS_CERTIFIED,
      adminUserId,
      'EOL',
    );

    expect(result).toMatchObject({
      success: true,
      productId: String(productId),
      fromStatus: 2,
      toStatus: 4,
    });
    expect(updateOne).toHaveBeenCalledWith(
      { _id: productId },
      {
        $set: expect.objectContaining({
          productStatus: PRODUCT_STATUS_DISCONTINUED,
          discontinuedAt: expect.any(Date),
          discontinuedBy: expect.any(Types.ObjectId),
          updatedDate: expect.any(Date),
        }),
      },
    );
    expect(auditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        urnNo,
        fromStatus: 2,
        toStatus: 4,
        reason: 'EOL',
      }),
    );
  });

  it('toggles 4 → 2 and clears discontinue fields with audit', async () => {
    findOneExec.mockResolvedValue({
      _id: productId,
      urnNo,
      productStatus: PRODUCT_STATUS_DISCONTINUED,
    });

    const result = await service.toggleProductStatus(
      urnNo,
      String(productId),
      PRODUCT_STATUS_DISCONTINUED,
      adminUserId,
    );

    expect(result.toStatus).toBe(PRODUCT_STATUS_CERTIFIED);
    expect(updateOne).toHaveBeenCalledWith(
      { _id: productId },
      {
        $set: expect.objectContaining({
          productStatus: PRODUCT_STATUS_CERTIFIED,
          discontinuedAt: null,
          discontinuedBy: null,
        }),
      },
    );
    expect(auditCreate).toHaveBeenCalled();
  });

  it('rejects non-toggleable currentStatus with 400', async () => {
    await expect(
      service.toggleProductStatus(
        urnNo,
        String(productId),
        PRODUCT_STATUS_PENDING,
        adminUserId,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns 404 when product is not under urnNo', async () => {
    findOneExec.mockResolvedValue(null);

    await expect(
      service.toggleProductStatus(
        urnNo,
        String(productId),
        PRODUCT_STATUS_CERTIFIED,
        adminUserId,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns 409 when DB status differs from body currentStatus', async () => {
    findOneExec.mockResolvedValue({
      _id: productId,
      urnNo,
      productStatus: PRODUCT_STATUS_DISCONTINUED,
    });

    await expect(
      service.toggleProductStatus(
        urnNo,
        String(productId),
        PRODUCT_STATUS_CERTIFIED,
        adminUserId,
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('bulk reactivate updates only matching URN ids and audits changes', async () => {
    const otherId = new Types.ObjectId();
    const findExec = jest.fn().mockResolvedValue([
      { _id: productId, productStatus: PRODUCT_STATUS_DISCONTINUED },
      { _id: otherId, productStatus: PRODUCT_STATUS_DISCONTINUED },
    ]);
    (service as any).productModel.find = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({ exec: findExec }),
      }),
    });
    updateMany.mockResolvedValue({ modifiedCount: 2 });

    const result = await service.bulkReactivate(
      urnNo,
      [String(productId), String(otherId)],
      adminUserId,
    );

    expect(result).toEqual({ success: true, updatedCount: 2 });
    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ urnNo }),
      expect.objectContaining({
        $set: expect.objectContaining({ productStatus: PRODUCT_STATUS_CERTIFIED }),
      }),
    );
    expect(auditInsertMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ fromStatus: 4, toStatus: 2 }),
      ]),
    );
  });
});
