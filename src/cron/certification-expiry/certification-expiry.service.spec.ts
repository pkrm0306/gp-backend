import { Types } from 'mongoose';
import { CertificationExpiryService } from './certification-expiry.service';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
} from '../../renew/constants/product-status.constants';
import { todayIsoInTimeZone, toIsoDateInTimeZone } from '../utils/cron-date.util';
import { computeGraceEndDate } from '../../product-registration/helpers/certification-dates.util';
import type { EligibleExpiryProduct } from './certification-expiry.types';

function makeProduct(
  productId: number,
  overrides: Partial<EligibleExpiryProduct> = {},
): EligibleExpiryProduct {
  const validtillDate = new Date('2020-06-01T00:00:00.000Z');
  return {
    productId,
    eoiNo: `EOI-${productId}`,
    urnNo: `URN-${productId}`,
    productName: `Product ${productId}`,
    productStatus: PRODUCT_STATUS_CERTIFIED,
    productRenewStatus: 0,
    urnStatus: 0,
    validtillDate,
    vendorId: new Types.ObjectId(),
    vendorEmail: `vendor${productId}@example.com`,
    ...overrides,
  };
}

describe('CertificationExpiryService.runDeactivationMail', () => {
  let service: CertificationExpiryService;
  let updateMany: jest.Mock;
  let updateOne: jest.Mock;
  let productFindLeanExec: jest.Mock;
  let cronLogFindLeanExec: jest.Mock;
  let cronLogCreate: jest.Mock;
  let sendEmail: jest.Mock;
  let renderDeactivationEmail: jest.Mock;
  let getDeactivationEligibleProducts: jest.Mock;
  let renewalFindLeanExec: jest.Mock;

  beforeEach(() => {
    updateMany = jest
      .fn()
      .mockResolvedValue({ matchedCount: 0, modifiedCount: 0 });
    updateOne = jest.fn().mockResolvedValue({ acknowledged: true });
    productFindLeanExec = jest.fn().mockResolvedValue([]);
    cronLogFindLeanExec = jest.fn().mockResolvedValue([]);
    cronLogCreate = jest.fn().mockResolvedValue({});
    sendEmail = jest.fn().mockResolvedValue(undefined);
    renderDeactivationEmail = jest.fn().mockResolvedValue('<p>deactivated</p>');
    getDeactivationEligibleProducts = jest.fn().mockResolvedValue([]);
    renewalFindLeanExec = jest.fn().mockResolvedValue(null);

    const productModel = {
      updateMany,
      updateOne,
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({ exec: productFindLeanExec }),
        }),
      }),
    };

    const cronEmailLogModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({ exec: cronLogFindLeanExec }),
        }),
      }),
      create: cronLogCreate,
      exists: jest.fn(),
    };

    const renewalCycleModel = {
      findOne: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({ exec: renewalFindLeanExec }),
        }),
      }),
    };

    service = new CertificationExpiryService(
      { getDeactivationEligibleProducts } as never,
      { renderDeactivationEmail } as never,
      { sendEmail } as never,
      { get: jest.fn().mockReturnValue('false') } as never,
      productModel as never,
      renewalCycleModel as never,
      cronEmailLogModel as never,
      {
        notifyCertificationExpiryAdmin: jest.fn().mockResolvedValue(undefined),
      } as never,
    );
  });

  it('bulk-commits all planned products with a single updateMany', async () => {
    const products = [makeProduct(1), makeProduct(2), makeProduct(3)];
    getDeactivationEligibleProducts.mockResolvedValue(products);
    productFindLeanExec.mockResolvedValue(
      products.map((p) => ({
        productId: p.productId,
        productStatus: PRODUCT_STATUS_CERTIFIED,
      })),
    );
    updateMany.mockResolvedValue({ matchedCount: 3, modifiedCount: 3 });

    const result = await service.runDeactivationMail();

    expect(updateMany).toHaveBeenCalledTimes(1);
    expect(updateMany).toHaveBeenCalledWith(
      {
        productId: { $in: [1, 2, 3] },
        productStatus: PRODUCT_STATUS_CERTIFIED,
      },
      {
        $set: {
          productStatus: PRODUCT_STATUS_DISCONTINUED,
          updatedDate: expect.any(Date),
        },
      },
    );
    expect(updateOne).not.toHaveBeenCalled();
    expect(result.planned).toBe(3);
    expect(result.deactivated).toBe(3);
    expect(result.modifiedCount).toBe(3);
    expect(result.sent).toBe(3);
    expect(sendEmail).toHaveBeenCalledTimes(3);
  });

  it('commits status before sending any vendor email', async () => {
    const products = [makeProduct(10), makeProduct(11)];
    getDeactivationEligibleProducts.mockResolvedValue(products);
    productFindLeanExec.mockResolvedValue(
      products.map((p) => ({
        productId: p.productId,
        productStatus: PRODUCT_STATUS_CERTIFIED,
      })),
    );

    let resolveUpdateMany: (value: unknown) => void = () => undefined;
    const updateManyGate = new Promise((resolve) => {
      resolveUpdateMany = resolve;
    });
    updateMany.mockImplementation(() => updateManyGate);

    let emailStarted = false;
    sendEmail.mockImplementation(async () => {
      emailStarted = true;
    });

    const runPromise = service.runDeactivationMail();
    await new Promise((resolve) => setImmediate(resolve));
    expect(emailStarted).toBe(false);

    resolveUpdateMany({ matchedCount: 2, modifiedCount: 2 });
    const result = await runPromise;

    expect(updateMany).toHaveBeenCalled();
    expect(emailStarted).toBe(true);
    expect(result.sent).toBe(2);
  });

  it('skips products already logged and discontinued (idempotency)', async () => {
    const product = makeProduct(42);
    const graceEndIso = toIsoDateInTimeZone(computeGraceEndDate(product.validtillDate!));
    const notifyDate = `deactivate-${graceEndIso}`;

    getDeactivationEligibleProducts.mockResolvedValue([product]);
    cronLogFindLeanExec.mockResolvedValue([{ productId: 42, notifyDate }]);
    productFindLeanExec.mockResolvedValue([
      { productId: 42, productStatus: PRODUCT_STATUS_DISCONTINUED },
    ]);

    const result = await service.runDeactivationMail();

    expect(updateMany).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
    expect(result.skipped).toBe(1);
    expect(result.planned).toBe(0);
    expect(result.deactivated).toBe(0);
  });

  it('does not double-deactivate on re-run after successful processing', async () => {
    const products = [makeProduct(7), makeProduct(8)];
    const graceEndById = new Map(
      products.map((p) => [
        p.productId,
        `deactivate-${toIsoDateInTimeZone(computeGraceEndDate(p.validtillDate!))}`,
      ]),
    );

    getDeactivationEligibleProducts.mockResolvedValue(products);
    productFindLeanExec.mockResolvedValue(
      products.map((p) => ({
        productId: p.productId,
        productStatus: PRODUCT_STATUS_CERTIFIED,
      })),
    );
    updateMany.mockResolvedValue({ matchedCount: 2, modifiedCount: 2 });

    const first = await service.runDeactivationMail();
    expect(first.deactivated).toBe(2);

    cronLogFindLeanExec.mockResolvedValue(
      products.map((p) => ({
        productId: p.productId,
        notifyDate: graceEndById.get(p.productId),
      })),
    );
    productFindLeanExec.mockResolvedValue(
      products.map((p) => ({
        productId: p.productId,
        productStatus: PRODUCT_STATUS_DISCONTINUED,
      })),
    );
    updateMany.mockClear();
    sendEmail.mockClear();

    const second = await service.runDeactivationMail();

    expect(updateMany).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
    expect(second.skipped).toBe(2);
    expect(second.deactivated).toBe(0);
  });

  it('records email failures without rolling back bulk deactivation', async () => {
    const products = [makeProduct(21), makeProduct(22)];
    getDeactivationEligibleProducts.mockResolvedValue(products);
    productFindLeanExec.mockResolvedValue(
      products.map((p) => ({
        productId: p.productId,
        productStatus: PRODUCT_STATUS_CERTIFIED,
      })),
    );
    updateMany.mockResolvedValue({ matchedCount: 2, modifiedCount: 2 });
    sendEmail
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('SMTP down'));

    const result = await service.runDeactivationMail();

    expect(updateMany).toHaveBeenCalledTimes(1);
    expect(result.deactivated).toBe(2);
    expect(result.sent).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});

describe('CertificationExpiryService.planDeactivationBatch', () => {
  let service: CertificationExpiryService;
  let productFindLeanExec: jest.Mock;
  let cronLogFindLeanExec: jest.Mock;

  beforeEach(() => {
    productFindLeanExec = jest.fn().mockResolvedValue([]);
    cronLogFindLeanExec = jest.fn().mockResolvedValue([]);

    service = new CertificationExpiryService(
      {} as never,
      {} as never,
      {} as never,
      { get: jest.fn() } as never,
      {
        find: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({ exec: productFindLeanExec }),
          }),
        }),
      } as never,
      {} as never,
      {
        find: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({ exec: cronLogFindLeanExec }),
          }),
        }),
      } as never,
      {
        notifyCertificationExpiryAdmin: jest.fn().mockResolvedValue(undefined),
      } as never,
    );
  });

  it('skips products still inside the grace window', async () => {
    const futureValidTill = new Date();
    futureValidTill.setFullYear(futureValidTill.getFullYear() + 2);
    const product = makeProduct(99, { validtillDate: futureValidTill });
    const result = {
      success: true,
      jobType: 'deactivationMail' as const,
      processed: 0,
      sent: 0,
      skipped: 0,
      failed: 0,
      deactivated: 0,
      errors: [],
    };

    const planned = await service.planDeactivationBatch(
      [product],
      todayIsoInTimeZone(),
      result,
    );

    expect(planned).toHaveLength(0);
    expect(result.skipped).toBe(1);
  });
});
