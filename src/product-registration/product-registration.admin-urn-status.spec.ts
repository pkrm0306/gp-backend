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
      productStatus: 1,
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
    serviceAny.manufacturerModel = {
      findById: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({
              manufacturerName: 'Acme Co',
              vendor_email: 'vendor@example.com',
            }),
          }),
        }),
      }),
    };
    serviceAny.lifecycleNotification = {
      notifyUrnInitialApproved: jest.fn().mockResolvedValue(undefined),
      notifyUrnRegistrationRejected: jest.fn().mockResolvedValue(undefined),
      notifyProductCertified: jest.fn().mockResolvedValue(undefined),
      notifyProductRejected: jest.fn().mockResolvedValue(undefined),
    };
    serviceAny.invalidateProductListingsCache = jest
      .fn()
      .mockResolvedValue(undefined);
    serviceAny.logger = { warn: jest.fn(), log: jest.fn(), debug: jest.fn() };

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

  it('notifies product certified when product_status becomes 2', async () => {
    const { service } = createServiceHarness();
    const notifyProductCertified = (service as any).lifecycleNotification
      .notifyProductCertified as jest.Mock;

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'product_status',
      updateStatusTo: 2,
    });

    expect(notifyProductCertified).toHaveBeenCalledTimes(1);
    expect(notifyProductCertified).toHaveBeenCalledWith(
      expect.objectContaining({
        manufacturerId: manufacturerId.toString(),
        urnNo: 'URN-202604010001',
        productName: 'Test Product',
      }),
    );
  });

  it('does not notify product certified when product_status is already 2', async () => {
    const { service, find } = createServiceHarness();
    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 11,
            productStatus: 2,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);
    const notifyProductCertified = (service as any).lifecycleNotification
      .notifyProductCertified as jest.Mock;

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'product_status',
      updateStatusTo: 2,
    });

    expect(notifyProductCertified).not.toHaveBeenCalled();
  });

  it('notifies product certified only once for product_status 2 then urn_status 11', async () => {
    const { service, find } = createServiceHarness();
    const notifyProductCertified = (service as any).lifecycleNotification
      .notifyProductCertified as jest.Mock;

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'product_status',
      updateStatusTo: 2,
    });

    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 10,
            productStatus: 2,
            productRenewStatus: 0,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'urn_status',
      updateStatusTo: 11,
    });

    expect(notifyProductCertified).toHaveBeenCalledTimes(1);
  });

  it('notifies product rejected when product_status becomes 3', async () => {
    const { service } = createServiceHarness();
    const notifyProductRejected = (service as any).lifecycleNotification
      .notifyProductRejected as jest.Mock;

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'product_status',
      updateStatusTo: 3,
    });

    expect(notifyProductRejected).toHaveBeenCalledTimes(1);
    expect(notifyProductRejected).toHaveBeenCalledWith(
      expect.objectContaining({
        manufacturerId: manufacturerId.toString(),
        urnNo: 'URN-202604010001',
        productName: 'Test Product',
      }),
    );
  });

  it('does not notify product rejected when product_status is already 3', async () => {
    const { service, find } = createServiceHarness();
    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 10,
            productStatus: 3,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);
    const notifyProductRejected = (service as any).lifecycleNotification
      .notifyProductRejected as jest.Mock;
    const notifyUrnRegistrationRejected = (service as any).lifecycleNotification
      .notifyUrnRegistrationRejected as jest.Mock;

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'product_status',
      updateStatusTo: 3,
    });

    expect(notifyProductRejected).not.toHaveBeenCalled();
    expect(notifyUrnRegistrationRejected).not.toHaveBeenCalled();
  });

  it('notifies registration rejected when product_status becomes 3 at initial stage', async () => {
    const { service, find } = createServiceHarness();
    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 0,
            productStatus: 1,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);
    const notifyUrnRegistrationRejected = (service as any).lifecycleNotification
      .notifyUrnRegistrationRejected as jest.Mock;

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'product_status',
      updateStatusTo: 3,
    });

    expect(notifyUrnRegistrationRejected).toHaveBeenCalledWith(
      expect.objectContaining({
        manufacturerId: manufacturerId.toString(),
        urnNo: 'URN-202604010001',
      }),
    );
  });

  it('notifies urn initial approved when urn_status becomes 1 from 0 (legacy approve)', async () => {
    const { service, find } = createServiceHarness();
    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 0,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);
    const notifyUrnInitialApproved = (service as any).lifecycleNotification
      .notifyUrnInitialApproved as jest.Mock;

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'urn_status',
      updateStatusTo: 1,
    });

    expect(notifyUrnInitialApproved).toHaveBeenCalledWith(
      expect.objectContaining({
        manufacturerId: manufacturerId.toString(),
        urnNo: 'URN-202604010001',
      }),
    );
  });

  it('notifies urn initial approved when urn_status becomes 2', async () => {
    const { service, find } = createServiceHarness();
    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 0,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);
    const notifyUrnInitialApproved = (service as any).lifecycleNotification
      .notifyUrnInitialApproved as jest.Mock;

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'urn_status',
      updateStatusTo: 2,
    });

    expect(notifyUrnInitialApproved).toHaveBeenCalledWith(
      expect.objectContaining({
        manufacturerId: manufacturerId.toString(),
        urnNo: 'URN-202604010001',
      }),
    );
  });

  it('does not notify initial approval when urn_status goes 1 to 2', async () => {
    const { service, find } = createServiceHarness();
    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 1,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);
    const notifyUrnInitialApproved = (service as any).lifecycleNotification
      .notifyUrnInitialApproved as jest.Mock;

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'urn_status',
      updateStatusTo: 2,
    });

    expect(notifyUrnInitialApproved).not.toHaveBeenCalled();
  });

  it('does not notify product certified when only urn_status becomes 11', async () => {
    const { service, find } = createServiceHarness();
    find.mockReturnValue({
      lean: () => ({
        exec: jest.fn().mockResolvedValue([
          {
            urnNo: 'URN-202604010001',
            urnStatus: 10,
            productStatus: 2,
            productRenewStatus: 0,
            vendorId,
            manufacturerId,
            productName: 'Test Product',
          },
        ]),
      }),
    } as LeanExec<typeof baseProducts>);
    const notifyProductCertified = (service as any).lifecycleNotification
      .notifyProductCertified as jest.Mock;

    await service.adminUpdateUrnStatus({
      urnNo: 'URN-202604010001',
      updateStatusType: 'urn_status',
      updateStatusTo: 11,
    });

    expect(notifyProductCertified).not.toHaveBeenCalled();
  });
});

