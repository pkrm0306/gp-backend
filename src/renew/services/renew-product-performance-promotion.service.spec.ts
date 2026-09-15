import { Types } from 'mongoose';
import { RenewProductPerformancePromotionService } from './renew-product-performance-promotion.service';

describe('RenewProductPerformancePromotionService', () => {
  const cycleId = new Types.ObjectId();
  const vendorId = new Types.ObjectId();

  const buildService = (options: {
    childRows?: Array<Record<string, unknown>>;
    header?: Record<string, unknown> | null;
    existingCertHeader?: Record<string, unknown> | null;
  }) => {
    const service = Object.create(
      RenewProductPerformancePromotionService.prototype,
    ) as RenewProductPerformancePromotionService;

    const deletedFilters: unknown[] = [];
    const insertedDocs: Array<Record<string, unknown>> = [];
    const headerUpdates: Array<Record<string, unknown>> = [];
    let nextReportId = 100;

    (service as any).logger = { warn: jest.fn(), debug: jest.fn() };

    (service as any).renewTestReportModel = {
      find: jest.fn(() => {
        const chain: Record<string, unknown> = {
          sort: () => chain,
          session: () => chain,
          lean: () => chain,
          exec: () => Promise.resolve(options.childRows ?? []),
        };
        return chain;
      }),
    };

    (service as any).renewPerformanceModel = {
      findOne: jest.fn(() => {
        const chain: Record<string, unknown> = {
          session: () => chain,
          lean: () => chain,
          exec: () => Promise.resolve(options.header ?? null),
        };
        return chain;
      }),
    };

    (service as any).productPerformanceModel = {
      findOne: jest.fn(() => {
        const chain: Record<string, unknown> = {
          session: () => chain,
          exec: () => Promise.resolve(options.existingCertHeader ?? null),
        };
        return chain;
      }),
      updateOne: jest.fn(async (_filter: unknown, update: Record<string, unknown>) => {
        headerUpdates.push(update);
      }),
      create: jest.fn(async (payload: Array<Record<string, unknown>>) => {
        headerUpdates.push({ $create: payload[0] });
        return payload;
      }),
    };

    (service as any).ppTestReportModel = {
      deleteMany: jest.fn(async (filter: unknown) => {
        deletedFilters.push(filter);
      }),
      insertMany: jest.fn(async (docs: Array<Record<string, unknown>>) => {
        insertedDocs.push(...docs);
        return docs;
      }),
    };

    (service as any).sequenceHelper = {
      getProductPerformanceId: jest.fn(async () => 55),
      getProductPerformanceTestReportId: jest.fn(async () => ++nextReportId),
    };

    return {
      service,
      deletedFilters,
      insertedDocs,
      headerUpdates,
    };
  };

  it('promotes renew child-table productName + testReportFileName into process_pp_test_reports', async () => {
    const { service, deletedFilters, insertedDocs, headerUpdates } = buildService({
      childRows: [
        {
          productName: 'AAC Block Renewed',
          testReportFileName: 'renew-report.pdf',
          vendorId,
        },
      ],
      header: { vendorId, testReports: [] },
      existingCertHeader: {
        _id: new Types.ObjectId(),
        processProductPerformanceId: 42,
        testReportFiles: 1,
        productPerformanceStatus: 1,
      },
    });

    const count =
      await service.promoteRenewProductPerformanceTestReportsForCompletedCycle(
        'URN-TEST',
        cycleId,
      );

    expect(count).toBe(1);
    expect(deletedFilters).toEqual([{ urnNo: 'URN-TEST', vendorId }]);
    expect(insertedDocs).toHaveLength(1);
    expect(insertedDocs[0]).toMatchObject({
      urnNo: 'URN-TEST',
      vendorId,
      processProductPerformanceId: 42,
      productName: 'AAC Block Renewed',
      testReportFileName: 'renew-report.pdf',
    });
    expect(headerUpdates[0]).toMatchObject({
      $set: {
        testReports: [
          {
            productName: 'AAC Block Renewed',
            testReportFileName: 'renew-report.pdf',
          },
        ],
      },
    });
  });

  it('replaces prior cert names with renew-updated values', async () => {
    const { service, insertedDocs } = buildService({
      childRows: [
        {
          productName: 'Updated Product',
          testReportFileName: 'updated.pdf',
          vendorId,
        },
      ],
      header: {
        vendorId,
        testReports: [
          { productName: 'Updated Product', testReportFileName: 'updated.pdf' },
        ],
      },
      existingCertHeader: {
        _id: new Types.ObjectId(),
        processProductPerformanceId: 7,
        testReportFiles: 0,
        productPerformanceStatus: 1,
      },
    });

    await service.promoteRenewProductPerformanceTestReportsForCompletedCycle(
      'URN-1',
      cycleId,
    );

    expect(insertedDocs[0]?.productName).toBe('Updated Product');
    expect(insertedDocs[0]?.testReportFileName).toBe('updated.pdf');
  });

  it('skips promotion when renew cycle never saved test-report metadata', async () => {
    const { service, deletedFilters, insertedDocs } = buildService({
      childRows: [],
      header: { vendorId }, // seed header — no testReports field
      existingCertHeader: {
        _id: new Types.ObjectId(),
        processProductPerformanceId: 1,
      },
    });

    const count =
      await service.promoteRenewProductPerformanceTestReportsForCompletedCycle(
        'URN-SKIP',
        cycleId,
      );

    expect(count).toBe(0);
    expect(deletedFilters).toHaveLength(0);
    expect(insertedDocs).toHaveLength(0);
  });

  it('promotes empty metadata when renew explicitly saved empty testReports', async () => {
    const { service, deletedFilters, insertedDocs, headerUpdates } = buildService({
      childRows: [],
      header: { vendorId, testReports: [] },
      existingCertHeader: {
        _id: new Types.ObjectId(),
        processProductPerformanceId: 9,
        testReportFiles: 2,
        productPerformanceStatus: 1,
      },
    });

    const count =
      await service.promoteRenewProductPerformanceTestReportsForCompletedCycle(
        'URN-EMPTY',
        cycleId,
      );

    expect(count).toBe(0);
    expect(deletedFilters).toEqual([{ urnNo: 'URN-EMPTY', vendorId }]);
    expect(insertedDocs).toHaveLength(0);
    expect(headerUpdates[0]).toMatchObject({
      $set: { testReports: [] },
    });
  });

  it('falls back to embedded header.testReports when child table empty', async () => {
    const { service, insertedDocs } = buildService({
      childRows: [],
      header: {
        vendorId,
        testReports: [
          { productName: 'From Header', testReportFileName: 'header.pdf' },
        ],
      },
      existingCertHeader: {
        _id: new Types.ObjectId(),
        processProductPerformanceId: 3,
      },
    });

    const count =
      await service.promoteRenewProductPerformanceTestReportsForCompletedCycle(
        'URN-HDR',
        cycleId,
      );

    expect(count).toBe(1);
    expect(insertedDocs[0]).toMatchObject({
      productName: 'From Header',
      testReportFileName: 'header.pdf',
    });
  });
});
