import { Types } from 'mongoose';
import { DocumentVersioningService } from './document-versioning.service';

describe('DocumentVersioningService per-stream awaitingRevision', () => {
  const service = Object.create(
    DocumentVersioningService.prototype,
  ) as DocumentVersioningService;

  const streamUpdateMany = jest.fn();
  const streamFindOneAndUpdate = jest.fn();
  const streamFindById = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (service as any).docStreamModel = {
      updateMany: streamUpdateMany,
      findOneAndUpdate: streamFindOneAndUpdate,
      findById: streamFindById,
    };
    streamUpdateMany.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ modifiedCount: 2 }),
    });
  });

  it('markStreamsAwaitingRevision updates only matching section streams', async () => {
    await expect(
      service.markStreamsAwaitingRevision({
        urnNo: 'URN-1',
        sectionKeys: ['product_design', 'product_performance'],
      }),
    ).resolves.toBe(2);

    expect(streamUpdateMany).toHaveBeenCalledWith(
      {
        urnNo: 'URN-1',
        processType: 'initial',
        renewalCycleId: null,
        sectionKey: { $in: ['product_design', 'product_performance'] },
      },
      expect.objectContaining({
        $set: expect.objectContaining({ awaitingRevision: true }),
      }),
      {},
    );
  });

  it('does not mark streams when sectionKeys is empty', async () => {
    await expect(
      service.markStreamsAwaitingRevision({
        urnNo: 'URN-1',
        sectionKeys: [],
      }),
    ).resolves.toBe(0);
    expect(streamUpdateMany).not.toHaveBeenCalled();
  });

  it('first post-resend upload atomically allocates next version once', async () => {
    const stream = {
      _id: new Types.ObjectId(),
      latestVersionNo: 1,
      awaitingRevision: true,
    };
    const session = {} as any;
    const userId = new Types.ObjectId();

    streamFindOneAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        ...stream,
        latestVersionNo: 2,
        awaitingRevision: false,
      }),
    });

    const versionNo = await (service as any).resolveStreamVersionNoForUpload(
      stream,
      session,
      new Date(),
      userId,
    );

    expect(versionNo).toBe(2);
    expect(streamFindOneAndUpdate).toHaveBeenCalledWith(
      { _id: stream._id, awaitingRevision: true },
      expect.objectContaining({
        $inc: { latestVersionNo: 1 },
        $set: expect.objectContaining({ awaitingRevision: false }),
      }),
      expect.objectContaining({ new: true }),
    );
  });

  it('concurrent loser reuses the winner version', async () => {
    const stream = {
      _id: new Types.ObjectId(),
      latestVersionNo: 1,
      awaitingRevision: true,
    };
    streamFindOneAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    streamFindById.mockReturnValue({
      session: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          latestVersionNo: 2,
          awaitingRevision: false,
        }),
      }),
    });

    const versionNo = await (service as any).resolveStreamVersionNoForUpload(
      stream,
      {} as any,
      new Date(),
      new Types.ObjectId(),
    );

    expect(versionNo).toBe(2);
  });

  it('reuses current version when not awaiting revision', async () => {
    const versionNo = await (service as any).resolveStreamVersionNoForUpload(
      {
        _id: new Types.ObjectId(),
        latestVersionNo: 2,
        awaitingRevision: false,
      },
      {} as any,
      new Date(),
      new Types.ObjectId(),
    );
    expect(versionNo).toBe(2);
    expect(streamFindOneAndUpdate).not.toHaveBeenCalled();
  });
});
