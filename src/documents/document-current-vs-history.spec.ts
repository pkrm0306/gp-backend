import { Types } from 'mongoose';
import { DocumentVersioningService } from './document-versioning.service';

describe('DocumentVersioningService current vs history separation', () => {
  const service = Object.create(
    DocumentVersioningService.prototype,
  ) as DocumentVersioningService;

  beforeEach(() => {
    jest.clearAllMocks();
    (service as any).allRenewProductDocumentModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    };
    (service as any).renewalCycleModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    };
  });

  it('filterDocumentsToCurrentVersion keeps only displayable-version file identities', () => {
    const allowlist = {
      productDocumentIds: new Set([30, 40]),
      filePaths: new Set(['uploads/v4-a.xlsx', 'uploads/v4-b.xlsx']),
      historicalProductDocumentIds: new Set([10, 20, 30, 40]),
      historicalFilePaths: new Set([
        'uploads/v1.pdf',
        'uploads/v2.pdf',
        'uploads/v4-a.xlsx',
        'uploads/v4-b.xlsx',
      ]),
      hasVersionedStreams: true,
    };

    const filtered = service.filterDocumentsToCurrentVersion(
      [
        { productDocumentId: 10, documentLink: 'uploads/v1.pdf' },
        { productDocumentId: 20, documentLink: 'uploads/v2.pdf' },
        { productDocumentId: 30, documentLink: 'uploads/v4-a.xlsx' },
        { productDocumentId: 40, documentLink: 'uploads/v4-b.xlsx' },
      ],
      allowlist,
    );

    expect(filtered.map((d) => d.productDocumentId)).toEqual([30, 40]);
  });

  it('filterDocumentsToCurrentVersion keeps untracked live docs', () => {
    const allowlist = {
      productDocumentIds: new Set([30]),
      filePaths: new Set(['uploads/v4.xlsx']),
      historicalProductDocumentIds: new Set([10, 30]),
      historicalFilePaths: new Set(['uploads/v1.pdf', 'uploads/v4.xlsx']),
      hasVersionedStreams: true,
    };

    const filtered = service.filterDocumentsToCurrentVersion(
      [
        { productDocumentId: 10, documentLink: 'uploads/v1.pdf' },
        { productDocumentId: 30, documentLink: 'uploads/v4.xlsx' },
        { productDocumentId: 99, documentLink: 'uploads/legacy-untracked.pdf' },
      ],
      allowlist,
    );

    expect(filtered.map((d) => d.productDocumentId)).toEqual([30, 99]);
  });

  it('filterDocumentsToCurrentVersion hides historical identities when no displayable current remains', () => {
    const filtered = service.filterDocumentsToCurrentVersion(
      [
        { productDocumentId: 10, documentLink: 'uploads/v1.pdf' },
        { productDocumentId: 20, documentLink: 'uploads/v3.pdf' },
      ],
      {
        productDocumentIds: new Set(),
        filePaths: new Set(),
        historicalProductDocumentIds: new Set([10, 20, 30]),
        historicalFilePaths: new Set([
          'uploads/v1.pdf',
          'uploads/v3.pdf',
          'uploads/v4.xlsx',
        ]),
        hasVersionedStreams: true,
      },
    );
    expect(filtered).toEqual([]);
  });

  it('filterDocumentsToCurrentVersion strictAllowlist drops non-tip and untracked rows', () => {
    const filtered = service.filterDocumentsToCurrentVersion(
      [
        { productDocumentId: 10, documentLink: 'uploads/v1.pdf' },
        { productDocumentId: 40, documentLink: 'uploads/v4.xlsx' },
        { productDocumentId: 99, documentLink: 'uploads/untracked.pdf' },
      ],
      {
        productDocumentIds: new Set([40]),
        filePaths: new Set(['uploads/v4.xlsx']),
        historicalProductDocumentIds: new Set([10, 40]),
        historicalFilePaths: new Set(['uploads/v1.pdf', 'uploads/v4.xlsx']),
        hasVersionedStreams: true,
      },
      { strictAllowlist: true },
    );
    expect(filtered.map((d) => d.productDocumentId)).toEqual([40]);
  });

  it('filterDocumentsToCurrentVersion returns all docs when no version streams exist', () => {
    const docs = [
      { productDocumentId: 1, documentLink: 'a.pdf' },
      { productDocumentId: 2, documentLink: 'b.pdf' },
    ];
    expect(
      service.filterDocumentsToCurrentVersion(docs, {
        productDocumentIds: new Set(),
        filePaths: new Set(),
        historicalProductDocumentIds: new Set(),
        historicalFilePaths: new Set(),
        hasVersionedStreams: false,
      }),
    ).toEqual(docs);
  });

  it('getCurrentVersionDocumentAllowlist falls back when all latest-version files are deleted', async () => {
    const streamId = new Types.ObjectId();
    (service as any).docStreamModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              { _id: streamId, latestVersionNo: 4 },
            ]),
          }),
        }),
      }),
    };
    (service as any).docVersionModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              {
                streamId,
                versionNo: 1,
                productDocumentId: 10,
                filePath: 'uploads/v1.pdf',
              },
              {
                streamId,
                versionNo: 3,
                productDocumentId: 30,
                filePath: 'uploads/v3.pdf',
              },
              {
                streamId,
                versionNo: 3,
                productDocumentId: 31,
                filePath: 'uploads/v3-b.pdf',
              },
              {
                streamId,
                versionNo: 4,
                productDocumentId: 40,
                filePath: 'uploads/v4-a.xlsx',
              },
              {
                streamId,
                versionNo: 4,
                productDocumentId: 41,
                filePath: 'uploads/v4-b.xlsx',
              },
            ]),
          }),
        }),
      }),
    };
    (service as any).allProductDocumentModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              {
                productDocumentId: 10,
                documentLink: 'uploads/v1.pdf',
                isDeleted: false,
              },
              {
                productDocumentId: 30,
                documentLink: 'uploads/v3.pdf',
                isDeleted: false,
              },
              {
                productDocumentId: 31,
                documentLink: 'uploads/v3-b.pdf',
                isDeleted: false,
              },
              {
                productDocumentId: 40,
                documentLink: 'uploads/v4-a.xlsx',
                isDeleted: true,
              },
              {
                productDocumentId: 41,
                documentLink: 'uploads/v4-b.xlsx',
                isDeleted: true,
              },
            ]),
          }),
        }),
      }),
    };

    const allowlist = await service.getCurrentVersionDocumentAllowlist('URN-1');
    expect(allowlist.hasVersionedStreams).toBe(true);
    // Falls back to V3 (both active files), not empty V4 watermark.
    expect([...allowlist.productDocumentIds].sort()).toEqual([30, 31]);
    expect(allowlist.filePaths.has('uploads/v3.pdf')).toBe(true);
    expect(allowlist.filePaths.has('uploads/v4-a.xlsx')).toBe(false);
  });

  it('getCurrentVersionDocumentAllowlist keeps remaining active file on latest version', async () => {
    const streamId = new Types.ObjectId();
    (service as any).docStreamModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              { _id: streamId, latestVersionNo: 4 },
            ]),
          }),
        }),
      }),
    };
    (service as any).docVersionModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              {
                streamId,
                versionNo: 3,
                productDocumentId: 30,
                filePath: 'uploads/v3.pdf',
              },
              {
                streamId,
                versionNo: 4,
                productDocumentId: 40,
                filePath: 'uploads/v4-a.xlsx',
              },
              {
                streamId,
                versionNo: 4,
                productDocumentId: 41,
                filePath: 'uploads/v4-b.xlsx',
              },
            ]),
          }),
        }),
      }),
    };
    (service as any).allProductDocumentModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              {
                productDocumentId: 30,
                documentLink: 'uploads/v3.pdf',
                isDeleted: false,
              },
              {
                productDocumentId: 40,
                documentLink: 'uploads/v4-a.xlsx',
                isDeleted: true,
              },
              {
                productDocumentId: 41,
                documentLink: 'uploads/v4-b.xlsx',
                isDeleted: false,
              },
            ]),
          }),
        }),
      }),
    };

    const allowlist = await service.getCurrentVersionDocumentAllowlist('URN-1');
    expect([...allowlist.productDocumentIds]).toEqual([41]);
  });

  it('excludeOpenRenewalCycles keeps completed-cert tip (soft-deleted V4) and drops open V6', async () => {
    const streamId = new Types.ObjectId();
    const openCycle = new Types.ObjectId();
    (service as any).docStreamModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              { _id: streamId, latestVersionNo: 6 },
            ]),
          }),
        }),
      }),
    };
    (service as any).docVersionModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              {
                streamId,
                versionNo: 4,
                productDocumentId: 40,
                filePath: 'uploads/v4.pdf',
                processType: 'initial',
              },
              {
                streamId,
                versionNo: 5,
                productDocumentId: 50,
                filePath: 'uploads/v5.pdf',
                processType: 'renewal',
                renewalCycleId: openCycle,
              },
              {
                streamId,
                versionNo: 6,
                productDocumentId: 60,
                filePath: 'uploads/v6.pdf',
                processType: 'renewal',
                renewalCycleId: openCycle,
              },
            ]),
          }),
        }),
      }),
    };
    (service as any).allProductDocumentModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              {
                productDocumentId: 40,
                documentLink: 'uploads/v4.pdf',
                isDeleted: true,
                historyHidden: false,
              },
              {
                productDocumentId: 50,
                documentLink: 'uploads/v5.pdf',
                isDeleted: false,
              },
              {
                productDocumentId: 60,
                documentLink: 'uploads/v6.pdf',
                isDeleted: false,
              },
            ]),
          }),
        }),
      }),
    };
    (service as any).allRenewProductDocumentModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    };
    (service as any).renewalCycleModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([
              { _id: openCycle, status: 'in_progress' },
            ]),
          }),
        }),
      }),
    };

    const allowlist = await service.getCurrentVersionDocumentAllowlist('URN-1', {
      excludeOpenRenewalCycles: true,
    });
    expect(allowlist.hasVersionedStreams).toBe(true);
    expect([...allowlist.productDocumentIds].sort()).toEqual([40]);
    expect(allowlist.filePaths.has('uploads/v4.pdf')).toBe(true);
    expect(allowlist.filePaths.has('uploads/v6.pdf')).toBe(false);
    // Open-cycle identities stay historical so live renew rows are not fail-open kept.
    expect(allowlist.historicalProductDocumentIds.has(50)).toBe(true);
    expect(allowlist.historicalProductDocumentIds.has(60)).toBe(true);
  });
});
