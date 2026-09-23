import { EoiNumberService } from './eoi-number.service';

describe('EoiNumberService', () => {
  let findLean: jest.Mock;
  let productModelFind: jest.Mock;
  let service: EoiNumberService;

  function mockActiveRows(
    rows: Array<{ eoiNo: string; eoiSequence?: number }>,
  ) {
    findLean.mockResolvedValue(rows);
  }

  beforeEach(() => {
    findLean = jest.fn().mockResolvedValue([
      { eoiNo: 'GPPMI003001' },
      { eoiNo: 'GPPMI003003' },
    ]);

    productModelFind = jest.fn().mockReturnValue({
      session: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({ exec: findLean }),
      }),
    });

    service = new EoiNumberService(
      { find: productModelFind } as never,
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
    const max = await service.getMaxActiveSequenceSuffix(
      '507f1f77bcf86cd799439011',
    );
    expect(max).toBe(3);
  });

  it('assigns max + 1 as next active EOI (new registration — no hole reuse)', async () => {
    mockActiveRows([
      { eoiNo: 'GPPMI003001' },
      { eoiNo: 'GPPMI003002' },
      { eoiNo: 'GPPMI003003' },
      { eoiNo: 'GPPMI003005' },
    ]);
    const assignment = await service.assignNextActiveEoiNo(
      '507f1f77bcf86cd799439011',
    );
    expect(assignment.eoiSequence).toBe(6);
    expect(assignment.eoiNo).toBe('GPPMI003006');
  });

  describe('rejected restore EOI assignment', () => {
    const manufacturerId = '507f1f77bcf86cd799439011';

    it('TEST 1/3: reuses free previous sequence below active MAX', async () => {
      // 001–003, 005 active; 004 rejected (not in active rows)
      mockActiveRows([
        { eoiNo: 'GPPMI003001', eoiSequence: 1 },
        { eoiNo: 'GPPMI003002', eoiSequence: 2 },
        { eoiNo: 'GPPMI003003', eoiSequence: 3 },
        { eoiNo: 'GPPMI003005', eoiSequence: 5 },
      ]);

      const assignment = await service.assignEoiForRejectedRestore(
        manufacturerId,
        'GPPMI003004',
      );

      expect(assignment.eoiSequence).toBe(4);
      expect(assignment.eoiNo).toBe('GPPMI003004');
      expect(assignment.previousEoiNo).toBe('GPPMI003004');
    });

    it('TEST 2/5: assigns max+1 when previous sequence is occupied by active', async () => {
      mockActiveRows([
        { eoiNo: 'GPPMI003001', eoiSequence: 1 },
        { eoiNo: 'GPPMI003002', eoiSequence: 2 },
        { eoiNo: 'GPPMI003003', eoiSequence: 3 },
        { eoiNo: 'GPPMI003004', eoiSequence: 4 },
        { eoiNo: 'GPPMI003005', eoiSequence: 5 },
      ]);

      const assignment = await service.assignEoiForRejectedRestore(
        manufacturerId,
        'GPPMI003004',
      );

      expect(assignment.eoiSequence).toBe(6);
      expect(assignment.eoiNo).toBe('GPPMI003006');
    });

    it('TEST 4: rejected record does not block availability of its sequence', async () => {
      // Active pool has no 004 — only rejected held it (excluded from find mock)
      mockActiveRows([
        { eoiNo: 'GPPMI003001' },
        { eoiNo: 'GPPMI003002' },
        { eoiNo: 'GPPMI003003' },
        { eoiNo: 'GPPMI003005' },
      ]);

      const occupied = await service.isActiveSequenceOccupied(
        manufacturerId,
        4,
      );
      expect(occupied).toBe(false);
    });

    it('TEST 5: active record blocks availability', async () => {
      mockActiveRows([
        { eoiNo: 'GPPMI003001' },
        { eoiNo: 'GPPMI003004', eoiSequence: 4 },
        { eoiNo: 'GPPMI003005' },
      ]);

      const occupied = await service.isActiveSequenceOccupied(
        manufacturerId,
        4,
      );
      expect(occupied).toBe(true);
    });

    it('TEST 6: new registration still does not reuse holes', async () => {
      mockActiveRows([
        { eoiNo: 'GPPMI003001' },
        { eoiNo: 'GPPMI003002' },
        { eoiNo: 'GPPMI003003' },
        { eoiNo: 'GPPMI003005' },
      ]);

      const next = await service.generateNextEoiNo(manufacturerId);
      expect(next).toBe('GPPMI003006');
    });

    it('TEST 7: active 004 blocks restore of rejected 004 (max=4 → 005)', async () => {
      mockActiveRows([{ eoiNo: 'GPPMI003004', eoiSequence: 4 }]);

      const assignment = await service.assignEoiForRejectedRestore(
        manufacturerId,
        'GPPMI003004',
      );

      expect(assignment.eoiSequence).toBe(5);
      expect(assignment.eoiNo).toBe('GPPMI003005');
    });

    it('TEST 8: eoiSequence stays aligned with assigned eoiNo suffix', async () => {
      mockActiveRows([
        { eoiNo: 'GPPMI003001' },
        { eoiNo: 'GPPMI003005' },
      ]);

      const reuse = await service.assignEoiForRejectedRestore(
        manufacturerId,
        'GPPMI003004',
      );
      expect(reuse.eoiNo.endsWith('004')).toBe(true);
      expect(reuse.eoiSequence).toBe(4);

      mockActiveRows([
        { eoiNo: 'GPPMI003001' },
        { eoiNo: 'GPPMI003004' },
        { eoiNo: 'GPPMI003005' },
      ]);
      const bumped = await service.assignEoiForRejectedRestore(
        manufacturerId,
        'GPPMI003004',
      );
      expect(bumped.eoiNo.endsWith('006')).toBe(true);
      expect(bumped.eoiSequence).toBe(6);
    });

    it('reuses previous sequence even if restore target is wrongly present in active rows', async () => {
      // Mongo exclude filter removes self; lean mock returns siblings only
      mockActiveRows([
        { eoiNo: 'GPPMI003001' },
        { eoiNo: 'GPPMI003002' },
        { eoiNo: 'GPPMI003003' },
        { eoiNo: 'GPPMI003005' },
      ]);

      const assignment = await service.assignEoiForRejectedRestore(
        manufacturerId,
        'GPPMI003004',
        undefined,
        { excludeProductId: '507f1f77bcf86cd799439099' },
      );

      expect(productModelFind).toHaveBeenCalled();
      const filterArg = productModelFind.mock.calls[0][0];
      expect(filterArg._id).toEqual({ $ne: expect.anything() });
      expect(assignment.eoiSequence).toBe(4);
      expect(assignment.eoiNo).toBe('GPPMI003004');
    });

    it('ignores desynced eoiSequence when eoiNo suffix differs (eoiNo wins)', async () => {
      // Active 005 with stale eoiSequence=4 must NOT block restore of 004
      mockActiveRows([
        { eoiNo: 'GPPMI003001', eoiSequence: 1 },
        { eoiNo: 'GPPMI003002', eoiSequence: 2 },
        { eoiNo: 'GPPMI003003', eoiSequence: 3 },
        { eoiNo: 'GPPMI003005', eoiSequence: 4 }, // desynced
      ]);

      const assignment = await service.assignEoiForRejectedRestore(
        manufacturerId,
        'GPPMI003004',
      );

      expect(assignment.eoiSequence).toBe(4);
      expect(assignment.eoiNo).toBe('GPPMI003004');
    });

    it('bulk restore: reserved sequences prevent duplicate assignment in same txn', async () => {
      mockActiveRows([
        { eoiNo: 'GPPMI003001' },
        { eoiNo: 'GPPMI003002' },
        { eoiNo: 'GPPMI003003' },
        { eoiNo: 'GPPMI003005' },
      ]);
      const reserved = new Set<number>();

      const first = await service.assignEoiForRejectedRestore(
        manufacturerId,
        'GPPMI003004',
        undefined,
        { reservedSequences: reserved },
      );
      expect(first.eoiSequence).toBe(4);
      expect(reserved.has(4)).toBe(true);

      // Second rejected also "wants" 004; reserved blocks reuse → max(5,4)+1 = 6
      const second = await service.assignEoiForRejectedRestore(
        manufacturerId,
        'GPPMI003004',
        undefined,
        { reservedSequences: reserved },
      );
      expect(second.eoiSequence).toBe(6);
      expect(reserved.has(6)).toBe(true);
    });
  });
});
