import { Types } from 'mongoose';
import { ProcessProductStewardshipService } from './process-product-stewardship.service';

describe('ProcessProductStewardshipService idempotent submit', () => {
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
        session: jest.fn().mockResolvedValue(store.get(filter.urnNo) || null),
      })),
      findOneAndUpdate: jest.fn((filter: any, update: any) => ({
        exec: jest.fn().mockImplementation(async () => {
          const existing = store.get(filter.urnNo);
          const next = existing
            ? { ...existing, ...update.$set }
            : {
                _id: new Types.ObjectId(),
                ...update.$set,
                ...update.$setOnInsert,
              };
          store.set(filter.urnNo, next);
          return next;
        }),
      })),
    };

    const service = new ProcessProductStewardshipService(
      model as any,
      { find: jest.fn(), updateMany: jest.fn(), create: jest.fn() } as any,
      { startSession: jest.fn().mockResolvedValue(session) } as any,
      {
        getProcessProductStewardshipId: jest.fn(async () => ++seq),
        getProductDocumentId: jest.fn(async () => ++seq),
      } as any,
    );
    return { service, store };
  }

  it('same URN submit twice does not create duplicate stewardship rows', async () => {
    const { service, store } = buildService();
    const dto = {
      urnNo: 'URN-1',
      qualityManagementDetails: 'Quality system',
      eprImplementedDetails: 'EPR details',
      eprGreenPackagingDetails: 'Green packaging',
      productStewardshipStatus: 1,
    } as any;

    await service.createProcessProductStewardship(dto, vendorId);
    await service.createProcessProductStewardship(dto, vendorId);

    expect(store.size).toBe(1);
  });
});

