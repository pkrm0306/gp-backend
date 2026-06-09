import { EoiNumberService } from './eoi-number.service';

describe('EoiNumberService', () => {
  let findLean: jest.Mock;
  let service: EoiNumberService;

  beforeEach(() => {
    findLean = jest.fn().mockResolvedValue([
      { eoiNo: 'GPPMI003001' },
      { eoiNo: 'GPPMI003003' },
    ]);

    const productModel = {
      find: jest.fn().mockReturnValue({
        session: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({ exec: findLean }),
        }),
      }),
    };

    service = new EoiNumberService(
      productModel as never,
      { updateMany: jest.fn().mockReturnValue({ exec: jest.fn() }) } as never,
      {
        findById: jest.fn().mockResolvedValue({
          manufacturerInitial: 'PMI',
          gpInternalId: 'GP-3',
        }),
      } as never,
    );
  });

  it('computes max active sequence suffix', async () => {
    const max = await service.getMaxActiveSequenceSuffix('507f1f77bcf86cd799439011');
    expect(max).toBe(3);
  });

  it('assigns max + 1 as next active EOI', async () => {
    const assignment = await service.assignNextActiveEoiNo(
      '507f1f77bcf86cd799439011',
    );
    expect(assignment.eoiSequence).toBe(4);
    expect(assignment.eoiNo).toBe('GPPMI003004');
  });
});
