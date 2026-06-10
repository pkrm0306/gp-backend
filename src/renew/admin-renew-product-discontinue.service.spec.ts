import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AdminRenewProductDiscontinueService } from './services/admin-renew-product-discontinue.service';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_PENDING,
} from './constants/product-status.constants';

describe('AdminRenewProductDiscontinueService', () => {
  const urnNo = 'URN-202606020001';
  const adminUserId = new Types.ObjectId().toHexString();
  const productId = new Types.ObjectId();

  let findChain: { lean: jest.Mock; exec: jest.Mock };
  let findOneExec: jest.Mock;
  let findOneLeanExec: jest.Mock;
  let updateOne: jest.Mock;
  let auditCreate: jest.Mock;
  let auditRecord: jest.Mock;
  let resequenceForManufacturerInSession: jest.Mock;
  let service: AdminRenewProductDiscontinueService;

  beforeEach(() => {
    findChain = {
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };
    findOneExec = jest.fn();
    findOneLeanExec = jest.fn();
    updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
    auditCreate = jest.fn().mockResolvedValue({});
    auditRecord = jest.fn().mockResolvedValue(undefined);
    resequenceForManufacturerInSession = jest.fn().mockResolvedValue(2);

    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const connection = {
      startSession: jest.fn().mockResolvedValue(session),
    };

    const productModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue(findChain),
        }),
      }),
      findOne: jest.fn().mockImplementation(() => ({
        exec: findOneExec,
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({ exec: findOneLeanExec }),
        }),
      })),
      updateOne,
    };

    service = new AdminRenewProductDiscontinueService(
      productModel as never,
      { create: auditCreate } as never,
      connection as never,
      { resequenceForManufacturerInSession } as never,
      { record: auditRecord } as never,
      {
        deleteByPattern: jest.fn().mockResolvedValue(undefined),
        buildKey: jest.fn((...parts: string[]) => parts.join(':')),
      } as never,
    );
  });

  it('lists only active certified products for URN', async () => {
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

    expect(data[0]).toMatchObject({
      _id: String(productId),
      eoiNo: 'EOI-1',
      productStatus: 2,
    });
  });

  it('soft-deletes certified product without changing productStatus', async () => {
    findOneExec.mockResolvedValue({
      _id: productId,
      urnNo,
      eoiNo: 'GPPMI003004',
      productStatus: PRODUCT_STATUS_CERTIFIED,
      manufacturerId: new Types.ObjectId(),
    });

    const result = await service.discontinueProduct(
      urnNo,
      String(productId),
      adminUserId,
      'EOL',
    );

    expect(result).toMatchObject({
      success: true,
      productId: String(productId),
      eoiNo: 'GPPMI003004',
      productStatus: 2,
      isDeleted: true,
    });
    expect(updateOne).toHaveBeenCalledWith(
      { _id: productId },
      {
        $set: expect.objectContaining({
          is_deleted: true,
          deleted_at: expect.any(Date),
          discontinuedAt: expect.any(Date),
          discontinueReason: 'EOL',
        }),
      },
      expect.objectContaining({ session: expect.anything() }),
    );
    expect(resequenceForManufacturerInSession).toHaveBeenCalled();
    expect(updateOne.mock.calls[0][1].$set).not.toHaveProperty(
      'productStatus',
    );
    expect(auditCreate).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          fromStatus: 2,
          toStatus: 2,
          reason: 'EOL',
        }),
      ],
      expect.objectContaining({ session: expect.anything() }),
    );
  });

  it('rejects discontinue when currentStatus is not certified', async () => {
    await expect(
      service.toggleProductStatus(
        urnNo,
        String(productId),
        PRODUCT_STATUS_PENDING,
        adminUserId,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns 409 when product is already soft-deleted', async () => {
    findOneLeanExec.mockResolvedValue({
      is_deleted: true,
      productStatus: PRODUCT_STATUS_CERTIFIED,
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

  it('returns 404 when product is not under urnNo', async () => {
    findOneExec.mockResolvedValue(null);

    await expect(
      service.discontinueProduct(urnNo, String(productId), adminUserId),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects bulk reactivate', async () => {
    await expect(
      service.bulkReactivate(urnNo, [String(productId)], adminUserId),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
