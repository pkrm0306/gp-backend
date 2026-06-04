import { Types } from 'mongoose';
import { ProcessRenewProductPerformanceService } from './process-renew-product-performance.service';
import { RenewalCycleStatus } from '../schemas/renewal-cycle.schema';

describe('ProcessRenewProductPerformanceService storage rules', () => {
  const urnNo = 'URN-TEST-001';
  const vendorId = new Types.ObjectId().toHexString();
  const cycleId = new Types.ObjectId();

  function createHarness() {
    const renewTestReportDeleteMany = jest.fn().mockReturnValue({ session: jest.fn() });
    const renewTestReportInsertMany = jest.fn().mockResolvedValue([]);
    const renewTestReportFind = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([
            {
              productName: 'A',
              testReportFileName: 'r1',
              eoiNo: 'EOI-1',
            },
            {
              productName: 'B',
              testReportFileName: 'r2',
              eoiNo: 'EOI-2',
            },
          ]),
        }),
      }),
    });

    const renewPerformanceDeleteMany = jest.fn().mockResolvedValue({});
    const renewPerformanceFindOne = jest.fn().mockReturnValue({
      session: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    const renewPerformanceFindOneAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({}),
    });

    const renewDocumentFind = jest.fn().mockReturnValue({
      session: jest.fn().mockResolvedValue([]),
    });
    const renewDocumentCountDocuments = jest.fn().mockReturnValue({
      session: jest.fn().mockResolvedValue(0),
    });

    const renewalCycleModel = {
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: cycleId,
          urnNo,
          status: RenewalCycleStatus.IN_PROGRESS,
        }),
      }),
    };

    const productModel = {
      findOne: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({
              vendorId: new Types.ObjectId(),
              manufacturerId: new Types.ObjectId(),
            }),
          }),
        }),
      }),
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([
                { eoiNo: 'EOI-1', productName: 'Product 1' },
              ]),
            }),
          }),
        }),
      }),
      exists: jest.fn().mockResolvedValue(true),
    };

    const connection = {
      startSession: jest.fn().mockResolvedValue({
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      }),
    };

    const service = new ProcessRenewProductPerformanceService(
      {
        deleteMany: renewPerformanceDeleteMany,
        findOne: renewPerformanceFindOne,
        findOneAndUpdate: renewPerformanceFindOneAndUpdate,
        find: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
        }),
      } as any,
      {
        deleteMany: renewTestReportDeleteMany,
        insertMany: renewTestReportInsertMany,
        find: renewTestReportFind,
      } as any,
      {
        find: renewDocumentFind,
        countDocuments: renewDocumentCountDocuments,
        updateMany: jest.fn().mockReturnValue({ session: jest.fn() }),
        insertMany: jest.fn().mockReturnValue({ session: jest.fn() }),
      } as any,
      renewalCycleModel as any,
      productModel as any,
      connection as any,
      {
        getProcessRenewProductPerformanceId: jest.fn().mockResolvedValue(100),
        getProcessRenewProductPerformanceTestReportId: jest
          .fn()
          .mockResolvedValue(1),
        getRenewProductDocumentId: jest.fn().mockResolvedValue(201),
      } as any,
      { trackProductDocumentBatch: jest.fn(), trackProductDocumentDeleteBatch: jest.fn() } as any,
    );

    return {
      service,
      renewTestReportDeleteMany,
      renewTestReportInsertMany,
      renewPerformanceDeleteMany,
    };
  }

  it('replaces test report rows for urn+cycle (delete then insert)', async () => {
    const { service, renewTestReportDeleteMany, renewTestReportInsertMany } =
      createHarness();
    jest.spyOn(service, 'getFormPayloadByUrn').mockResolvedValue({
      urnNo,
      renewalCycleId: String(cycleId),
      testReports: [],
      testReportFiles: 0,
    });

    await service.save(
      {
        urnNo,
        renewalCycleId: String(cycleId),
        testReports: [
          { productName: 'A', testReportFileName: 'r1', eoiNo: 'EOI-1' },
          { productName: 'B', testReportFileName: 'r2', eoiNo: 'EOI-2' },
        ],
      },
    );

    expect(renewTestReportDeleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        urnNo,
        renewalCycleId: cycleId,
      }),
      expect.any(Object),
    );
    expect(renewTestReportInsertMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ productName: 'A', testReportFileName: 'r1' }),
        expect.objectContaining({ productName: 'B', testReportFileName: 'r2' }),
      ]),
      expect.any(Object),
    );
  });

  it('purges legacy per-EOI performance rows before cycle header upsert', async () => {
    const { service, renewPerformanceDeleteMany } = createHarness();
    jest.spyOn(service, 'getFormPayloadByUrn').mockResolvedValue({
      urnNo,
      renewalCycleId: String(cycleId),
      testReports: [],
      testReportFiles: 0,
    });

    await service.save(
      {
        urnNo,
        renewalCycleId: String(cycleId),
        testReports: [],
      },
    );

    expect(renewPerformanceDeleteMany).toHaveBeenCalled();
  });

  it('GET uses child collection as authoritative testReports source', async () => {
    const harness = createHarness();
    (harness.service as any).renewPerformanceModel.findOne = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      }),
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    (harness.service as any).productModel.find = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              { eoiNo: 'EOI-1', productName: 'Product 1', productStatus: 2 },
            ]),
          }),
        }),
      }),
    });
    (harness.service as any).renewDocumentModel.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    });

    const loadSpy = jest
      .spyOn(
        ProcessRenewProductPerformanceService.prototype as any,
        'loadAuthoritativeTestReports',
      )
      .mockResolvedValue([
        { productName: 'Only', testReportFileName: 'saved', eoiNo: 'EOI-1' },
      ]);

    jest
      .spyOn(harness.service, 'resolveRenewalCycleForRead')
      .mockResolvedValue({ _id: cycleId, urnNo } as any);

    const payload = await harness.service.getFormPayloadByUrn(
      urnNo,
      String(cycleId),
    );

    expect(loadSpy).toHaveBeenCalled();
    expect(payload.testReports).toEqual([
      { productName: 'Only', testReportFileName: 'saved', eoiNo: 'EOI-1' },
    ]);

    loadSpy.mockRestore();
  });

  it('GET returns embedded header testReports when child table is empty', async () => {
    const harness = createHarness();
    const header = {
      _id: 'hdr',
      processRenewProductPerformanceId: 3,
      urnNo,
      renewalCycleId: cycleId,
      productPerformanceStatus: 0,
      renewalType: 1,
      testReportFiles: 0,
      testReports: [
        {
          productName: 'kkjjdsdjksd',
          testReportFileName: '',
          eoiNo: 'GPPMI003026',
        },
      ],
    };

    let findOneCall = 0;
    (harness.service as any).renewPerformanceModel.findOne = jest
      .fn()
      .mockImplementation(() => ({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(findOneCall++ === 0 ? header : null),
          }),
        }),
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(header),
        }),
      }));

    (harness.service as any).renewTestReportModel.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    (harness.service as any).productModel.find = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              {
                eoiNo: 'GPPMI003026',
                productName: 'Test Product 2',
                productStatus: 2,
              },
            ]),
          }),
        }),
      }),
    });

    (harness.service as any).renewDocumentModel.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    });

    jest
      .spyOn(harness.service, 'resolveRenewalCycleForRead')
      .mockResolvedValue({ _id: cycleId, urnNo } as any);

    jest
      .spyOn(harness.service, 'resolveRenewalCycleForRead')
      .mockResolvedValue({ _id: cycleId, urnNo } as any);

    const payload = await harness.service.getFormPayloadByUrn(urnNo, String(cycleId));

    expect(payload.testReports).toEqual([
      {
        productName: 'kkjjdsdjksd',
        testReportFileName: '',
        eoiNo: 'GPPMI003026',
      },
    ]);
    expect(
      (payload.product_performance as { testReports: unknown[] }).testReports,
    ).toHaveLength(1);
    expect(payload.testReportFiles).toBeGreaterThanOrEqual(1);
    expect(
      (payload.rows as Array<{ testReports: unknown[] }>)[0].testReports,
    ).toHaveLength(1);
  });
});
