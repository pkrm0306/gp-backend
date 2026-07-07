import { loadVendorPlantMergeSourceIndex, plantMergeSourceLookupKey } from './vendor-plant-merge-status.util';
import { PLANT_MERGE_STATUS, PLANT_MERGE_STRATEGY_URN_COPY } from '../plant-merge.constants';

describe('vendor-plant-merge-status.util', () => {
  const plantMergeAuditModel = {
    find: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('indexes completed urn_copy merges by source urn/eoi', async () => {
    plantMergeAuditModel.find.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        {
          urnNo: 'URN-SOURCE',
          eoiNo: 'GP100',
          targetUrnNo: 'URN-TARGET',
          targetEoiNo: 'GP001',
        },
      ]),
    });

    const index = await loadVendorPlantMergeSourceIndex(plantMergeAuditModel as never, [
      { urnNo: 'URN-SOURCE', eoiNo: 'GP100' },
    ]);

    expect(plantMergeAuditModel.find).toHaveBeenCalledWith({
      mergeStrategy: PLANT_MERGE_STRATEGY_URN_COPY,
      mergeStatus: PLANT_MERGE_STATUS.COMPLETED,
      $or: [{ urnNo: 'URN-SOURCE', eoiNo: 'GP100' }],
    });
    expect(index.get(plantMergeSourceLookupKey('URN-SOURCE', 'GP100'))).toEqual({
      targetEoiNo: 'GP001',
      targetUrnNo: 'URN-TARGET',
    });
  });
});
