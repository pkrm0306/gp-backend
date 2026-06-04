import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductRegistrationService } from './product-registration.service';

type LeanExec<T> = {
  lean: () => {
    exec: () => Promise<T>;
  };
};

describe('ProductRegistrationService.adminUpdateUrnStatus', () => {
  const vendorId = new Types.ObjectId();
  const manufacturerId = new Types.ObjectId();

  const baseProducts = [
    {
      urnNo: 'URN-202604010001',
      vendorId,
      manufacturerId,
      urnStatus: 10,
      productName: 'Test Product',
    },
  ];

  function createServiceHarness() {
    const updateExec = jest.fn().mockResolvedValue({ acknowledged: true });
    const updateMany = jest.fn().mockReturnValue({
      exec: updateExec,
    });
    const findExec = jest.fn().mockResolvedValue(baseProducts);
    const find = jest.fn().mockReturnValue({
      lean: () => ({ exec: findExec }),
    } as LeanExec<typeof baseProducts>);
    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      abortTransaction: jest.fn().mockResolvedValue(undefined),
      endSession: jest.fn(),
    };
    const startSession = jest.fn().mockResolvedValue(session);

    const service = Object.create(
      ProductRegistrationService.prototype,
    ) as ProductRegistrationService;
    const serviceAny = service as any;

    serviceAny.productModel = { find, updateMany };
    serviceAny.connection = { startSession };
    serviceAny.tryLogUrnLifecycleStep = jest.fn().mockResolvedValue(undefined);
    serviceAny.syncUrnProductsToZohoDeal = jest.fn().mockResolvedValue(undefined);
    serviceAny.syncDocumentReviewedStatusToZohoDeal = jest
      .fn()
      .mockResolvedValue(undefined);
    serviceAny.urnTabReviewService = {
      ensurePendingReviewsForUrn: jest.fn().mockResolvedValue(undefined),
    };
    serviceAny.lifecycleNotification = {
      notifyUrnInitialApproved: jest.fn().mockResolvedValue(undefined),
    };
    serviceAny.invalidateProductListingsCache = jest
      .fn()
      .mockResolvedValue(undefined);
    serviceAny.logger = { warn: jest.fn() };

    return {
      service,
      find,
      updateMany,
      updateExec,
      session,
    };
  }

  it('rejects urn_status 12 when URN is already in renewal workflow', async () => {
    const { service, find } = createServiceHarness();
    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 12,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);

    await expect(
      service.adminUpdateUrnStatus({
        urnNo: 'URN-202604010001',
        updateStatusType: 'urn_status',
        updateStatusTo: 14,
      }),
    ).rejects.toThrow(/PATCH \/renew\/urn-status/);
  });

  it('accepts cert urn_status 6 and persists urnStatus', async () => {
    const { service, updateMany, find } = createServiceHarness();
    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 6,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);

    const result = await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'urn_status',
      updateStatusTo: 7,
    });

    expect(updateMany).toHaveBeenCalledWith(
      { urnNo: 'URN-202604010001' },
      expect.objectContaining({
        $set: expect.objectContaining({ urnStatus: 7 }),
      }),
      expect.any(Object),
    );
    expect(result).toEqual({ urnNo: 'URN-202604010001', urnStatus: 7 });
  });

  it('rejects renewal urn_status 12–17 on cert admin route', async () => {
    const { service, find } = createServiceHarness();
    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 15,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);

    await expect(
      service.adminUpdateUrnStatus({
        urnNo: 'URN-202604010001',
        updateStatusType: 'urn_status',
        updateStatusTo: 17,
      }),
    ).rejects.toThrow(/PATCH \/renew\/urn-status/);
  });

  it('still accepts existing urn_status <=11', async () => {
    const { service } = createServiceHarness();

    await expect(
      service.adminUpdateUrnStatus({
        urnNo: 'URN-202604010001',
        updateStatusType: 'urn_status',
        updateStatusTo: 11,
      }),
    ).resolves.toEqual({ urnNo: 'URN-202604010001', urnStatus: 11 });
  });

  it('rejects invalid urn_status values outside 0..17', async () => {
    const { service } = createServiceHarness();

    await expect(
      service.adminUpdateUrnStatus({
        urnNo: 'URN-202604010001',
        updateStatusType: 'urn_status',
        updateStatusTo: -1,
      }),
    ).rejects.toThrow(BadRequestException);

    await expect(
      service.adminUpdateUrnStatus({
        urnNo: 'URN-202604010001',
        updateStatusType: 'urn_status',
        updateStatusTo: 99,
      }),
    ).rejects.toThrow('updateStatusTo must be between 0 and 17 for urn_status');
  });

  it('keeps product_status behavior unchanged (0..3 only)', async () => {
    const { service, updateMany } = createServiceHarness();

    await expect(
      service.adminUpdateUrnStatus({
        urnNo: 'URN-202604010001',
        updateStatusType: 'product_status',
        updateStatusTo: 3,
      }),
    ).resolves.toEqual({ urnNo: 'URN-202604010001', productStatus: 3 });

    expect(updateMany).toHaveBeenCalledWith(
      { urnNo: 'URN-202604010001' },
      expect.objectContaining({
        $set: expect.objectContaining({ productStatus: 3 }),
      }),
      expect.any(Object),
    );

    await expect(
      service.adminUpdateUrnStatus({
        urnNo: 'URN-202604010001',
        updateStatusType: 'product_status',
        updateStatusTo: 4,
      }),
    ).rejects.toThrow('updateStatusTo must be between 0 and 3 for product_status');
  });
});

