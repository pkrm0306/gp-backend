import { Types } from 'mongoose';
import { ProductRegistrationService } from './product-registration.service';

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
});

