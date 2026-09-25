import { Types } from 'mongoose';
import { UrnLifecycleRecipientResolver } from './urn-lifecycle-recipient.resolver';

describe('UrnLifecycleRecipientResolver', () => {
  const findLeanExec = jest.fn();
  const productModel = {
    find: jest.fn(() => ({
      select: () => ({
        lean: () => ({
          exec: findLeanExec,
        }),
      }),
    })),
  };

  const findActiveAllocationsByProductIds = jest.fn();
  const findTeamMemberById = jest.fn();
  const spocAllocationRepository = {
    findActiveAllocationsByProductIds,
    findTeamMemberById,
  };

  const configGet = jest.fn();
  const configService = { get: configGet };

  const resolver = new UrnLifecycleRecipientResolver(
    productModel as any,
    spocAllocationRepository as any,
    configService as any,
  );

  const spocIdA = new Types.ObjectId();
  const spocIdB = new Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
    findLeanExec.mockResolvedValue([{ productId: 101 }, { productId: 102 }]);
    findActiveAllocationsByProductIds.mockResolvedValue([
      { productId: 101, spocId: spocIdA },
      { productId: 102, spocId: spocIdA },
    ]);
    findTeamMemberById.mockResolvedValue({
      _id: spocIdA,
      email: 'spoc@example.com',
    });
    configGet.mockImplementation((key: string) => {
      if (key === 'NOTIFICATION_CC_TEAM_LEADS') {
        return 'tl1@example.com, tl2@example.com';
      }
      return undefined;
    });
  });

  it('CASE A: manufacturer + distinct SPOC + Team Leads in allUniqueEmails', async () => {
    const result = await resolver.resolveBusinessRecipients({
      urnNo: 'URN-1',
      manufacturerEmail: 'vendor@example.com',
    });

    expect(result.to).toBe('vendor@example.com');
    expect(result.allUniqueEmails).toEqual(
      expect.arrayContaining([
        'vendor@example.com',
        'spoc@example.com',
        'tl1@example.com',
        'tl2@example.com',
      ]),
    );
    expect(result.allUniqueEmails).toHaveLength(4);
    expect(result.cc).toHaveLength(3);
    expect(result.cc).not.toContain('vendor@example.com');
  });

  it('CASE B: SPOC email that is also a Team Lead appears once', async () => {
    configGet.mockImplementation((key: string) => {
      if (key === 'NOTIFICATION_CC_TEAM_LEADS') {
        return 'spoc@example.com, tl2@example.com';
      }
      return undefined;
    });

    const result = await resolver.resolveBusinessRecipients({
      urnNo: 'URN-1',
      manufacturerEmail: 'vendor@example.com',
    });

    expect(result.to).toBe('vendor@example.com');
    expect(result.cc.filter((e) => e.toLowerCase() === 'spoc@example.com')).toHaveLength(
      1,
    );
    expect(result.cc).toEqual(
      expect.arrayContaining(['spoc@example.com', 'tl2@example.com']),
    );
    expect(result.cc).toHaveLength(2);
  });

  it('CASE C: no SPOC → manufacturer To + Team Leads CC only', async () => {
    findActiveAllocationsByProductIds.mockResolvedValue([]);

    const result = await resolver.resolveBusinessRecipients({
      urnNo: 'URN-1',
      manufacturerEmail: 'vendor@example.com',
    });

    expect(result.to).toBe('vendor@example.com');
    expect(result.spocEmails).toEqual([]);
    expect(result.cc).toEqual(['tl1@example.com', 'tl2@example.com']);
  });

  it('CASE D: multiple products same SPOC → SPOC once', async () => {
    findActiveAllocationsByProductIds.mockResolvedValue([
      { productId: 101, spocId: spocIdA },
      { productId: 102, spocId: spocIdA },
      { productId: 103, spocId: spocIdA },
    ]);
    findLeanExec.mockResolvedValue([
      { productId: 101 },
      { productId: 102 },
      { productId: 103 },
    ]);

    const result = await resolver.resolveBusinessRecipients({
      urnNo: 'URN-1',
      manufacturerEmail: 'vendor@example.com',
    });

    expect(findTeamMemberById).toHaveBeenCalledTimes(1);
    expect(result.cc.filter((e) => e === 'spoc@example.com')).toHaveLength(1);
  });

  it('CASE E: missing manufacturer → first SPOC/TL as To, rest as CC', async () => {
    findActiveAllocationsByProductIds.mockResolvedValue([
      { productId: 101, spocId: spocIdA },
      { productId: 102, spocId: spocIdB },
    ]);
    findTeamMemberById.mockImplementation(async (id: Types.ObjectId) => {
      if (String(id) === String(spocIdA)) {
        return { _id: spocIdA, email: 'spoc@example.com' };
      }
      return { _id: spocIdB, email: 'spoc2@example.com' };
    });

    const result = await resolver.resolveBusinessRecipients({
      urnNo: 'URN-1',
      manufacturerEmail: null,
    });

    expect(result.to).toBe('spoc@example.com');
    expect(result.allUniqueEmails).toEqual(
      expect.arrayContaining([
        'spoc@example.com',
        'spoc2@example.com',
        'tl1@example.com',
        'tl2@example.com',
      ]),
    );
    expect(result.cc).toEqual(
      expect.arrayContaining([
        'spoc2@example.com',
        'tl1@example.com',
        'tl2@example.com',
      ]),
    );
    expect(result.cc).not.toContain('spoc@example.com');
    expect(result.cc).toHaveLength(3);
  });

  it('skips outbound when no manufacturer, SPOC, or Team Lead emails', async () => {
    findActiveAllocationsByProductIds.mockResolvedValue([]);
    configGet.mockReturnValue('');

    const result = await resolver.resolveBusinessRecipients({
      urnNo: 'URN-1',
      manufacturerEmail: undefined,
    });

    expect(result.to).toBeUndefined();
    expect(result.cc).toEqual([]);
  });

  it('ignores inactive allocations (repository only returns isActive)', async () => {
    findActiveAllocationsByProductIds.mockResolvedValue([]);
    const result = await resolver.resolveBusinessRecipients({
      urnNo: 'URN-1',
      manufacturerEmail: 'vendor@example.com',
    });
    expect(result.spocEmails).toEqual([]);
    expect(findActiveAllocationsByProductIds).toHaveBeenCalledWith([101, 102]);
  });
});
