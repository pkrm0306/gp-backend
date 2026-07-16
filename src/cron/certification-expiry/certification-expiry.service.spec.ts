import { Types } from 'mongoose';
import { CertificationExpiryService } from './certification-expiry.service';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
} from '../../renew/constants/product-status.constants';
import { todayIsoInTimeZone, toIsoDateInTimeZone } from '../utils/cron-date.util';
import { computeGraceEndDate } from '../../product-registration/helpers/certification-dates.util';
import type { EligibleExpiryProduct } from './certification-expiry.types';
import { AUDIT_ACTION } from '../../audit-log/audit-actions';
import {
  AUDIT_ACTION_TYPE,
  AUDIT_MODULE,
} from '../../audit-log/audit-friendlies';

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
  let auditRecord: jest.Mock;
  let auditRecordMany: jest.Mock;

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
    auditRecord = jest.fn().mockResolvedValue(undefined);
    auditRecordMany = jest.fn().mockResolvedValue(undefined);

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
        notifyVendorCertificationExpiryInApp: jest
          .fn()
          .mockReturnValue(undefined),
      } as never,
      { record: auditRecord, recordMany: auditRecordMany } as never,
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

  it('writes success audit entries for deactivated products via AuditLogService', async () => {
    const products = [makeProduct(1), makeProduct(2)];
    getDeactivationEligibleProducts.mockResolvedValue(products);
    productFindLeanExec.mockResolvedValue(
      products.map((p) => ({
        productId: p.productId,
        productStatus: PRODUCT_STATUS_CERTIFIED,
      })),
    );
    updateMany.mockResolvedValue({ matchedCount: 2, modifiedCount: 2 });

    await service.runDeactivationMail();

    expect(auditRecordMany).toHaveBeenCalledTimes(1);
    const entries = auditRecordMany.mock.calls[0][0] as Array<
      Record<string, unknown>
    >;
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual(
      expect.objectContaining({
        action: AUDIT_ACTION.CERTIFICATION_EXPIRY_DEACTIVATION,
        outcome: 'success',
        module: AUDIT_MODULE.PRODUCT,
        action_type: AUDIT_ACTION_TYPE.UPDATE,
        entity_name: 'EOI-1',
        performed_by: expect.objectContaining({
          user_id: 'system:cron:certification-expiry',
          name: 'System',
        }),
        actor: expect.objectContaining({
          user_id: 'system:cron:certification-expiry',
          role: 'system',
        }),
        old_values: expect.objectContaining({
          productStatus: PRODUCT_STATUS_CERTIFIED,
        }),
        new_values: expect.objectContaining({
          productStatus: PRODUCT_STATUS_DISCONTINUED,
          urnNo: 'URN-1',
          eoiNo: 'EOI-1',
        }),
        http_method: 'POST',
        route: '/api/cron/certification-expiry/deactivation-mail',
        status_code: 200,
        metadata: expect.objectContaining({
          audit_event_id: expect.stringMatching(
            /^certification-expiry:deactivation:1:deactivate-/,
          ),
          business_event_type: 'certification_expiry_deactivation',
          business_outcome: 'product_deactivated',
          job_type: 'deactivationMail',
        }),
      }),
    );
    expect(entries[1]).toEqual(
      expect.objectContaining({
        entity_name: 'EOI-2',
        resource: expect.objectContaining({
          type: 'product',
          id: '2',
          urn_no: 'URN-2',
        }),
      }),
    );
  });

  it('does not write success audits when no products were modified', async () => {
    const product = makeProduct(5);
    getDeactivationEligibleProducts.mockResolvedValue([product]);
    productFindLeanExec.mockResolvedValue([
      { productId: 5, productStatus: PRODUCT_STATUS_CERTIFIED },
    ]);
    updateMany.mockResolvedValue({ matchedCount: 0, modifiedCount: 0 });

    await service.runDeactivationMail();

    expect(auditRecordMany).not.toHaveBeenCalled();
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
    const graceEndIso = toIsoDateInTimeZone(
      computeGraceEndDate(product.validtillDate!),
    );
    const notifyDate = `deactivate-${graceEndIso}`;

    getDeactivationEligibleProducts.mockResolvedValue([product]);
    cronLogFindLeanExec.mockResolvedValue([{ productId: 42, notifyDate }]);
    productFindLeanExec.mockResolvedValue([
      { productId: 42, productStatus: PRODUCT_STATUS_DISCONTINUED },
    ]);

    const result = await service.runDeactivationMail();

    expect(updateMany).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
    expect(auditRecordMany).not.toHaveBeenCalled();
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
    expect(auditRecordMany).toHaveBeenCalledTimes(1);

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
    auditRecordMany.mockClear();

    const second = await service.runDeactivationMail();

    expect(updateMany).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
    expect(auditRecordMany).not.toHaveBeenCalled();
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
    sendEmail.mockImplementation(async (to: string) => {
      if (String(to).includes('vendor22@')) {
        throw new Error('SMTP down');
      }
    });

    const result = await service.runDeactivationMail();

    expect(updateMany).toHaveBeenCalledTimes(1);
    expect(result.deactivated).toBe(2);
    expect(result.sent).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(auditRecordMany).toHaveBeenCalledTimes(1);
    expect(auditRecord).toHaveBeenCalledTimes(1);
    expect(auditRecord.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        action: AUDIT_ACTION.CERTIFICATION_EXPIRY_DEACTIVATION,
        outcome: 'failure',
        entity_name: 'EOI-22',
        description:
          'Deactivation mail failed after product status was discontinued',
        metadata: expect.objectContaining({
          business_outcome: 'deactivation_mail_failed',
          error_message: 'SMTP down',
          audit_event_id: expect.stringMatching(
            /^certification-expiry:deactivation-mail-failure:22:/,
          ),
        }),
      }),
    );
  });

  it('writes a job failure audit when the deactivation handler throws', async () => {
    getDeactivationEligibleProducts.mockRejectedValue(
      new Error('query unavailable'),
    );

    const result = await service.runDeactivationMail();

    expect(result.success).toBe(false);
    expect(result.errors[0]?.message).toBe('query unavailable');
    expect(auditRecordMany).not.toHaveBeenCalled();
    expect(auditRecord).toHaveBeenCalledTimes(1);
    expect(auditRecord.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        action: AUDIT_ACTION.CERTIFICATION_EXPIRY_DEACTIVATION,
        outcome: 'failure',
        entity_name: 'deactivationMail',
        description: 'Certification expiry deactivation mail job failed',
        actor: expect.objectContaining({ role: 'system' }),
        metadata: expect.objectContaining({
          business_outcome: 'job_failed',
          error_message: 'query unavailable',
        }),
      }),
    );
  });

  it('uses deterministic audit_event_id values for deactivated products', async () => {
    const product = makeProduct(99);
    const notifyDate = `deactivate-${toIsoDateInTimeZone(
      computeGraceEndDate(product.validtillDate!),
    )}`;
    getDeactivationEligibleProducts.mockResolvedValue([product]);
    productFindLeanExec.mockResolvedValue([
      { productId: 99, productStatus: PRODUCT_STATUS_CERTIFIED },
    ]);
    updateMany.mockResolvedValue({ matchedCount: 1, modifiedCount: 1 });

    await service.runDeactivationMail();

    const entries = auditRecordMany.mock.calls[0][0] as Array<{
      metadata: { audit_event_id: string };
    }>;
    expect(entries[0].metadata.audit_event_id).toBe(
      `certification-expiry:deactivation:99:${notifyDate}`,
    );
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
      { record: jest.fn(), recordMany: jest.fn() } as never,
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
