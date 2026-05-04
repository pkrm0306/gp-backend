import { Types } from 'mongoose';
import { ProductDesignService } from './product-design.service';

describe('ProductDesignService measures idempotency', () => {
  const vendorObjectId = new Types.ObjectId();
  const now = new Date('2026-04-28T10:00:00.000Z');

  function buildServiceWithMeasureStore(initialRows: any[] = []) {
    const store = [...initialRows];
    let seq = 1000;

    const pdMeasureModel = {
      find: jest.fn(() => ({
        session: jest.fn().mockResolvedValue(
          store.map((r) => ({
            normalizedMeasures: r.normalizedMeasures,
            normalizedBenefits: r.normalizedBenefits,
          })),
        ),
      })),
      insertMany: jest.fn(async (docs: any[]) => {
        store.push(...docs);
      }),
      syncIndexes: jest.fn(),
    };

    const service = new ProductDesignService(
      { syncIndexes: jest.fn() } as any,
      pdMeasureModel as any,
      {} as any,
      {} as any,
      { getProductDesignMeasureId: jest.fn(async () => ++seq) } as any,
    );

    return { service, pdMeasureModel, store };
  }

  it('submitting same payload twice does not increase row count', async () => {
    const { service, store } = buildServiceWithMeasureStore();
    const normalizedRows = (service as any).normalizeUniqueMeasures([
      { measuresImplemented: 'Use solar', benefitsAchieved: 'Less CO2' },
    ]);

    const first = await (service as any).upsertMeasuresByUrn({
      urnNo: 'URN-1',
      vendorObjectId,
      effectiveProductDesignId: 1,
      normalizedMeasures: normalizedRows,
      now,
      session: {} as any,
    });
    const second = await (service as any).upsertMeasuresByUrn({
      urnNo: 'URN-1',
      vendorObjectId,
      effectiveProductDesignId: 1,
      normalizedMeasures: normalizedRows,
      now,
      session: {} as any,
    });

    expect(first).toEqual({ inserted: 1, skipped: 0 });
    expect(second).toEqual({ inserted: 0, skipped: 1 });
    expect(store).toHaveLength(1);
  });

  it('mixed old and new rows only insert new unique rows', async () => {
    const { service, store } = buildServiceWithMeasureStore([
      {
        normalizedMeasures: 'use solar',
        normalizedBenefits: 'less co2',
      },
    ]);

    const normalizedRows = (service as any).normalizeUniqueMeasures([
      { measuresImplemented: 'Use Solar', benefitsAchieved: 'Less CO2' },
      { measuresImplemented: 'Rainwater harvest', benefitsAchieved: 'Save water' },
    ]);

    const result = await (service as any).upsertMeasuresByUrn({
      urnNo: 'URN-1',
      vendorObjectId,
      effectiveProductDesignId: 1,
      normalizedMeasures: normalizedRows,
      now,
      session: {} as any,
    });

    expect(result).toEqual({ inserted: 1, skipped: 1 });
    expect(store).toHaveLength(2);
  });

  it('treats whitespace and case variants as duplicates', () => {
    const { service } = buildServiceWithMeasureStore();

    const normalizedRows = (service as any).normalizeUniqueMeasures([
      { measuresImplemented: ' Use Solar ', benefitsAchieved: ' Less CO2 ' },
      { measuresImplemented: 'use solar', benefitsAchieved: 'less co2' },
    ]);

    expect(normalizedRows).toHaveLength(1);
    expect(normalizedRows[0]).toMatchObject({
      measuresImplemented: 'Use Solar',
      benefitsAchieved: 'Less CO2',
      normalizedMeasures: 'use solar',
      normalizedBenefits: 'less co2',
    });
  });
});

