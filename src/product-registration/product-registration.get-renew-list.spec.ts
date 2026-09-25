import { Types } from 'mongoose';
import { ProductRegistrationService } from './product-registration.service';
import {
  RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY,
  renewEligibilityThresholdDate,
} from '../renew/constants/renewal-eligibility.constants';

describe('ProductRegistrationService.getRenewList', () => {
  it('filters vendor renew list by manufacturerId (not vendorId)', async () => {
    const aggregateExec = jest.fn().mockResolvedValue([]);
    const aggregate = jest.fn().mockReturnValue({ exec: aggregateExec });

    const service = Object.create(
      ProductRegistrationService.prototype,
    ) as ProductRegistrationService;
    const serviceAny = service as any;
    serviceAny.productModel = { aggregate };
    serviceAny.toObjectId = (id: string) => new Types.ObjectId(id);

    const manufacturerId = new Types.ObjectId().toString();
    await service.getRenewList(manufacturerId);

    expect(aggregate).toHaveBeenCalledTimes(1);
    const pipeline = aggregate.mock.calls[0][0] as Array<Record<string, any>>;
    const match = pipeline[0].$match;

    expect(match.manufacturerId).toBeDefined();
    expect(match.vendorId).toBeUndefined();
    expect(String(match.manufacturerId)).toBe(manufacturerId);
    expect(match.productStatus).toBe(2);
    expect(match.productStatus).not.toBe(3);

    const project = pipeline.find((stage) => stage.$project)?.$project;
    expect(project.product_details).toBeDefined();
    expect(project.unit_count).toBeDefined();
    expect(project.plantCount).toBeDefined();
  });

  it('uses a 90-day validtillDate threshold (not 60)', async () => {
    const before = Date.now();
    const aggregateExec = jest.fn().mockResolvedValue([]);
    const aggregate = jest.fn().mockReturnValue({ exec: aggregateExec });

    const service = Object.create(
      ProductRegistrationService.prototype,
    ) as ProductRegistrationService;
    const serviceAny = service as any;
    serviceAny.productModel = { aggregate };
    serviceAny.toObjectId = (id: string) => new Types.ObjectId(id);

    await service.getRenewList(new Types.ObjectId().toString());
    const after = Date.now();

    const pipeline = aggregate.mock.calls[0][0] as Array<Record<string, any>>;
    const match = pipeline[0].$match;
    const threshold: Date = match.validtillDate.$lt;

    expect(threshold).toBeInstanceOf(Date);
    expect(RENEW_ELIGIBILITY_DAYS_BEFORE_EXPIRY).toBe(90);

    const minExpected = renewEligibilityThresholdDate(new Date(before)).getTime();
    const maxExpected = renewEligibilityThresholdDate(new Date(after)).getTime();
    expect(threshold.getTime()).toBeGreaterThanOrEqual(minExpected - 1000);
    expect(threshold.getTime()).toBeLessThanOrEqual(maxExpected + 1000);

    // Sanity: ~90 days from now, not ~60
    const daysFromNow =
      (threshold.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    expect(daysFromNow).toBeGreaterThan(85);
    expect(daysFromNow).toBeLessThan(95);
  });
});

describe('ProductRegistrationService.adminListRenewProducts', () => {
  it('uses the same 90-day threshold and keeps urnStatus 12–17 branch', async () => {
    const aggregateExec = jest.fn().mockResolvedValue([]);
    const aggregate = jest.fn().mockReturnValue({ exec: aggregateExec });

    const service = Object.create(
      ProductRegistrationService.prototype,
    ) as ProductRegistrationService;
    const serviceAny = service as any;
    serviceAny.productModel = { aggregate };
    serviceAny.formatRenewAdminListManufacturerGroup = (m: unknown) => m;

    await service.adminListRenewProducts();

    const pipeline = aggregate.mock.calls[0][0] as Array<Record<string, any>>;
    const match = pipeline[0].$match;
    expect(match.productStatus).toBe(2);
    expect(match.$or).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          validtillDate: expect.objectContaining({ $lt: expect.any(Date) }),
        }),
        { urnStatus: { $gte: 12, $lte: 17 } },
      ]),
    );

    const threshold: Date = match.$or[0].validtillDate.$lt;
    const daysFromNow =
      (threshold.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    expect(daysFromNow).toBeGreaterThan(85);
    expect(daysFromNow).toBeLessThan(95);
  });
});
