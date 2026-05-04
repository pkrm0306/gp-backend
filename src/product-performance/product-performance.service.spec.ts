import { Types } from 'mongoose';
import { ProductPerformanceService } from './product-performance.service';

describe('ProductPerformanceService idempotent submit', () => {
  const vendorId = new Types.ObjectId().toString();

  function buildService() {
    const store = new Map<string, any>();
    let seq = 0;

    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    const model = {
      syncIndexes: jest.fn(),
      findOne: jest.fn((filter: any) => ({
        session: jest.fn().mockResolvedValue(
          store.get(
            `${filter.urnNo}__${filter.normalizedProductName}__${filter.normalizedTestReportFileName}`,
          ) || null,
        ),
      })),
      findOneAndUpdate: jest.fn((filter: any, update: any) => ({
        exec: jest.fn().mockImplementation(async () => {
          const key = `${filter.urnNo}__${filter.normalizedProductName}__${filter.normalizedTestReportFileName}`;
          const existing = store.get(key);
          const next = existing
            ? { ...existing, ...update.$set }
            : {
                _id: new Types.ObjectId(),
                ...update.$set,
                ...update.$setOnInsert,
              };
          store.set(key, next);
          return next;
        }),
      })),
    };

    const service = new ProductPerformanceService(
      model as any,
      { find: jest.fn(), updateMany: jest.fn(), create: jest.fn() } as any,
      { startSession: jest.fn().mockResolvedValue(session) } as any,
      {
        getProductPerformanceId: jest.fn(async () => ++seq),
        getProductDocumentId: jest.fn(async () => ++seq),
      } as any,
    );

    return { service, store };
  }

  it('same payload twice keeps row count unchanged', async () => {
    const { service, store } = buildService();
    const dto = {
      urnNo: 'URN-1',
      productName: 'Solar Panel',
      testReportFileName: 'IEC Report',
    } as any;

    await service.createProductPerformance(dto, vendorId);
    await service.createProductPerformance(dto, vendorId);

    expect(store.size).toBe(1);
  });

  it('case/whitespace variants are treated as duplicates', async () => {
    const { service, store } = buildService();

    await service.createProductPerformance(
      {
        urnNo: 'URN-1',
        productName: ' Solar Panel ',
        testReportFileName: ' IEC REPORT ',
      } as any,
      vendorId,
    );
    await service.createProductPerformance(
      {
        urnNo: 'URN-1',
        productName: 'solar panel',
        testReportFileName: 'iec report',
      } as any,
      vendorId,
    );

    expect(store.size).toBe(1);
  });

  it('mixed existing and new rows only add truly new keys', async () => {
    const { service, store } = buildService();

    await service.createProductPerformance(
      {
        urnNo: 'URN-1',
        productName: 'Solar Panel',
        testReportFileName: 'Report A',
      } as any,
      vendorId,
    );
    await service.createProductPerformance(
      {
        urnNo: 'URN-1',
        productName: 'Solar Panel',
        testReportFileName: 'Report B',
      } as any,
      vendorId,
    );

    expect(store.size).toBe(2);
  });
});

