import { Types } from 'mongoose';
import { ProductSoftDeleteService } from './product-soft-delete.service';
import {
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_SUBMITTED,
} from '../../renew/constants/product-status.constants';

describe('ProductSoftDeleteService', () => {
  const manufacturerId = new Types.ObjectId().toHexString();
  const productObjectId = new Types.ObjectId();
  const deletedByUserId = new Types.ObjectId().toHexString();

  let productFindByIdLean: jest.Mock;
  let productFindOneSessionExec: jest.Mock;
  let productUpdateOneExec: jest.Mock;
  let plantUpdateManyExec: jest.Mock;
  let resequenceSpy: jest.SpyInstance;
  let service: ProductSoftDeleteService;

  beforeEach(() => {
    productFindByIdLean = jest.fn().mockResolvedValue({
      _id: productObjectId,
      manufacturerId: new Types.ObjectId(manufacturerId),
      is_deleted: false,
      productStatus: PRODUCT_STATUS_PENDING,
    });
    productFindOneSessionExec = jest.fn().mockResolvedValue({
      _id: productObjectId,
      productStatus: PRODUCT_STATUS_PENDING,
    });
    productUpdateOneExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
    plantUpdateManyExec = jest.fn().mockResolvedValue({ modifiedCount: 2 });

    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    service = new ProductSoftDeleteService(
      {
        findById: jest.fn().mockReturnValue({ lean: () => ({ exec: productFindByIdLean }) }),
        findOne: jest.fn().mockReturnValue({
          session: jest.fn().mockReturnValue({ exec: productFindOneSessionExec }),
        }),
        updateOne: jest.fn().mockReturnValue({ exec: productUpdateOneExec }),
      } as never,
      {
        updateMany: jest.fn().mockReturnValue({ exec: plantUpdateManyExec }),
      } as never,
      {
        startSession: jest.fn().mockResolvedValue(session),
      } as never,
      { findById: jest.fn().mockResolvedValue({ _id: manufacturerId }) } as never,
      { buildEoiNo: jest.fn() } as never,
      {
        deleteByPattern: jest.fn().mockResolvedValue(undefined),
        buildKey: jest.fn((...parts: string[]) => parts.join(':')),
      } as never,
    );

    resequenceSpy = jest
      .spyOn(
        service as unknown as {
          resequenceActiveEoisForManufacturer: (
            mfgId: string,
            session: unknown,
          ) => Promise<number>;
        },
        'resequenceActiveEoisForManufacturer',
      )
      .mockResolvedValue(3);
  });

  afterEach(() => {
    resequenceSpy.mockRestore();
  });

  it('re-sequences EOIs when deleting an uncertified (pending) product', async () => {
    const result = await service.softDeleteProduct(
      productObjectId.toHexString(),
      deletedByUserId,
    );

    expect(resequenceSpy).toHaveBeenCalled();
    expect(result.updated_sequence_count).toBe(3);
    expect(result.message).toContain('sequences rearranged');
  });

  it('re-sequences EOIs when deleting a submitted product', async () => {
    productFindByIdLean.mockResolvedValue({
      _id: productObjectId,
      manufacturerId: new Types.ObjectId(manufacturerId),
      is_deleted: false,
      productStatus: PRODUCT_STATUS_SUBMITTED,
    });
    productFindOneSessionExec.mockResolvedValue({
      _id: productObjectId,
      productStatus: PRODUCT_STATUS_SUBMITTED,
    });

    const result = await service.softDeleteProduct(
      productObjectId.toHexString(),
      deletedByUserId,
    );

    expect(resequenceSpy).toHaveBeenCalled();
    expect(result.updated_sequence_count).toBe(3);
  });

  it('skips re-sequencing when deleting a certified product', async () => {
    productFindByIdLean.mockResolvedValue({
      _id: productObjectId,
      manufacturerId: new Types.ObjectId(manufacturerId),
      is_deleted: false,
      productStatus: 2,
    });
    productFindOneSessionExec.mockResolvedValue({
      _id: productObjectId,
      productStatus: 2,
    });

    const result = await service.softDeleteProduct(
      productObjectId.toHexString(),
      deletedByUserId,
    );

    expect(resequenceSpy).not.toHaveBeenCalled();
    expect(result.updated_sequence_count).toBe(0);
    expect(result.message).toBe('EOI deleted successfully');
  });
});
