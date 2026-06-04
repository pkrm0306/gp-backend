import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductRegistrationService } from './product-registration.service';

describe('ProductRegistrationService.adminUpdateRenewValidity', () => {
  function createHarness(products: Array<{ _id: Types.ObjectId }>) {
    const findExec = jest.fn().mockResolvedValue(products);
    const findSelect = jest.fn().mockReturnValue({
      lean: () => ({ exec: findExec }),
    });
    const find = jest.fn().mockReturnValue({ select: findSelect });
    const updateExec = jest.fn().mockResolvedValue({
      acknowledged: true,
      modifiedCount: products.length,
    });
    const updateMany = jest.fn().mockReturnValue({ exec: updateExec });

    const service = Object.create(
      ProductRegistrationService.prototype,
    ) as ProductRegistrationService;
    const serviceAny = service as any;
    serviceAny.productModel = { find, updateMany };
    serviceAny.invalidateProductListingsCache = jest
      .fn()
      .mockResolvedValue(undefined);

    return { service, find, updateMany, serviceAny };
  }

  it('should update validity by urnNo', async () => {
    const { service, updateMany } = createHarness([
      { _id: new Types.ObjectId() },
      { _id: new Types.ObjectId() },
    ]);

    const result = await service.adminUpdateRenewValidity({
      urnNo: 'URN-202606020001',
      validTillDate: '2028-12-31',
    });

    expect(updateMany).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        $set: expect.objectContaining({
          validtillDate: new Date('2028-12-31T00:00:00.000Z'),
        }),
      }),
    );
    expect(result).toEqual({
      urnNo: 'URN-202606020001',
      updatedCount: 2,
      validTillDate: '2028-12-31',
    });
  });

  it('should support preview mode without writing DB', async () => {
    const ids = [new Types.ObjectId(), new Types.ObjectId()];
    const { service, updateMany } = createHarness(ids.map((_id) => ({ _id })));

    const result = await service.adminUpdateRenewValidity({
      urnNo: 'URN-202606020001',
      validTillDate: '2028-12-31',
      preview: true,
    });

    expect(updateMany).not.toHaveBeenCalled();
    expect(result.preview).toBe(true);
    expect(result.updatedCount).toBe(2);
    expect(result.productIds).toEqual(ids.map(String));
  });

  it('should reject invalid date', async () => {
    const { service } = createHarness([{ _id: new Types.ObjectId() }]);

    await expect(
      service.adminUpdateRenewValidity({
        urnNo: 'URN-202606020001',
        validTillDate: 'not-a-date',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should return 404 for unknown urnNo', async () => {
    const { service } = createHarness([]);

    await expect(
      service.adminUpdateRenewValidity({
        urnNo: 'URN-NOT-FOUND',
        validTillDate: '2028-12-31',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should only update validity-related fields', async () => {
    const { service, updateMany } = createHarness([{ _id: new Types.ObjectId() }]);

    await service.adminUpdateRenewValidity({
      urnNo: 'URN-202606020001',
      validTillDate: '2028-12-31',
    });

    const setDoc = updateMany.mock.calls[0][1].$set;
    expect(Object.keys(setDoc).sort()).toEqual(['updatedDate', 'validtillDate']);
  });
});

