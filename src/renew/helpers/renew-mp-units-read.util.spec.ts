import { findRenewMpUnitsForRead } from './renew-mp-units-read.util';

describe('findRenewMpUnitsForRead', () => {
  function mockModel(rows: Array<Record<string, unknown>>) {
    return {
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(rows),
          }),
        }),
      }),
    } as any;
  }

  it('falls back to certified MP units when renew rows are empty', async () => {
    const renewMp = mockModel([]);
    const certMp = mockModel([
      {
        processMpManufacturingUnitId: 7,
        urnNo: 'URN-1',
        unitName: 'Plant A',
        ecdProductionYear3: 100,
      },
    ]);

    const rows = await findRenewMpUnitsForRead(
      renewMp,
      certMp,
      'URN-1',
      { _id: 'cycle1', cycleNo: 1 } as any,
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]?.unitName ?? rows[0]?.processMpManufacturingUnitId).toBeTruthy();
    expect(certMp.find).toHaveBeenCalled();
  });

  it('returns renew rows when present without querying cert', async () => {
    const renewMp = mockModel([
      {
        processRenewMpManufacturingUnitId: 3,
        urnNo: 'URN-1',
        unitName: 'Renew Plant',
      },
    ]);
    const certMp = mockModel([]);

    const rows = await findRenewMpUnitsForRead(
      renewMp,
      certMp,
      'URN-1',
      { _id: 'cycle1', cycleNo: 2 } as any,
    );

    expect(rows).toHaveLength(1);
    expect(certMp.find).not.toHaveBeenCalled();
  });

  it('skips empty cert shells and prefers URN-wide renew rows', async () => {
    const renewFind = jest
      .fn()
      .mockReturnValueOnce({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      })
      .mockReturnValueOnce({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      })
      .mockReturnValueOnce({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              {
                processRenewMpManufacturingUnitId: 19,
                urnNo: 'URN-1',
                unitName: 'test',
                ecdProductionYear3: 11,
              },
            ]),
          }),
        }),
      });
    const renewMp = { find: renewFind } as any;
    const certMp = mockModel([
      {
        processMpManufacturingUnitId: 83,
        urnNo: 'URN-1',
        unitName: '',
        ecdProductionYear3: null,
      },
    ]);

    const rows = await findRenewMpUnitsForRead(
      renewMp,
      certMp,
      'URN-1',
      { _id: 'wrong-cycle', cycleNo: 1 } as any,
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]?.unitName).toBe('test');
    expect(certMp.find).not.toHaveBeenCalled();
  });

  it('does not return empty-shell cert rows', async () => {
    const renewMp = mockModel([]);
    const certMp = mockModel([
      {
        processMpManufacturingUnitId: 83,
        urnNo: 'URN-1',
        unitName: '',
        ecdProductionYear3: null,
      },
    ]);

    const rows = await findRenewMpUnitsForRead(
      renewMp,
      certMp,
      'URN-1',
      { _id: 'cycle1', cycleNo: 2 } as any,
    );

    expect(rows).toHaveLength(0);
  });
});
