import { NotFoundException } from '@nestjs/common';
import { DocumentVersioningService } from './document-versioning.service';

describe('DocumentVersioningService', () => {
  const service = Object.create(
    DocumentVersioningService.prototype,
  ) as DocumentVersioningService;

  const findStreamOrThrow = jest.fn();
  const docVersionFind = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (service as any).findStreamOrThrow = findStreamOrThrow;
    (service as any).resolveHistoryStream = findStreamOrThrow;
    (service as any).docVersionModel = { find: docVersionFind };
    (service as any).renewDocumentModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    };
    (service as any).mapStream = (stream: Record<string, unknown>) => stream;
    (service as any).mapVersion = (version: Record<string, unknown>) => version;
    (service as any).filterRenewHistoryVersions = async (
      _query: unknown,
      versions: Array<Record<string, unknown>>,
    ) => versions;
  });

  describe('getDocumentHistory', () => {
    const resolveHistoryStream = jest.fn();

    beforeEach(() => {
      (service as any).resolveHistoryStream = resolveHistoryStream;
      (service as any).filterRenewHistoryVersions = async (
        _query: unknown,
        versions: Array<Record<string, unknown>>,
      ) => versions;
    });

    it('returns empty versions when the stream was deleted by vendor', async () => {
      resolveHistoryStream.mockResolvedValue({
        _id: 'stream-1',
        isDeleted: true,
      });

      const result = await service.getDocumentHistory({
        urnNo: 'URN-1',
        sectionKey: 'product_design',
        slotKey: 'eco_vision_upload',
        processType: 'initial',
      });

      expect(result.versions).toEqual([]);
      expect(docVersionFind).not.toHaveBeenCalled();
    });

    it('excludes deleted version rows from history', async () => {
      resolveHistoryStream.mockResolvedValue({
        _id: 'stream-1',
        isDeleted: false,
      });
      const sort = jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([
            { versionNo: 1, action: 'added', filePath: 'uploads/a.pdf' },
          ]),
        }),
      });
      docVersionFind.mockReturnValue({ sort });

      const result = await service.getDocumentHistory({
        urnNo: 'URN-1',
        sectionKey: 'product_design',
        slotKey: 'eco_vision_upload',
        processType: 'initial',
      });

      expect(docVersionFind).toHaveBeenCalledWith({
        streamId: 'stream-1',
        action: { $ne: 'deleted' },
      });
      expect(result.versions).toEqual([
        { versionNo: 1, action: 'added', filePath: 'uploads/a.pdf' },
      ]);
    });
  });

  describe('filterRenewHistoryVersions', () => {
    const filterRenewHistoryVersions = (
      DocumentVersioningService.prototype as any
    ).filterRenewHistoryVersions.bind(service);

    beforeEach(() => {
      (service as any).normalizeDocPath = (value: string) =>
        value.trim().replace(/\\/g, '/').toLowerCase();
    });

    it('excludes deleted renew document paths even when renewalCycleId is null on row', async () => {
      (service as any).renewDocumentModel = {
        find: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([
                {
                  documentLink: 'uploads/deleted.pdf',
                  productDocumentId: 10,
                  isDeleted: true,
                },
              ]),
            }),
          }),
        }),
      };

      const versions = [
        { filePath: 'uploads/deleted.pdf', action: 'added' },
        { filePath: 'uploads/active.xlsx', action: 'added' },
      ];

      const result = await filterRenewHistoryVersions(
        {
          urnNo: 'URN-1',
          sectionKey: 'product_performance',
          processType: 'renewal',
          renewalCycleId: '507f1f77bcf86cd799439011',
        },
        versions,
      );

      expect(result).toEqual([{ filePath: 'uploads/active.xlsx', action: 'added' }]);
    });

    it('scopes legacy subsection stream history to active anchor document only', async () => {
      const findMock = jest
        .fn()
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([
                { documentLink: 'uploads/deleted.pdf', isDeleted: true },
              ]),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([
                {
                  documentLink: 'uploads/active.pdf',
                  isDeleted: false,
                  productDocumentId: 42,
                },
              ]),
            }),
          }),
        });
      (service as any).renewDocumentModel = { find: findMock };

      const versions = [
        { filePath: 'uploads/deleted.pdf', action: 'added' },
        { filePath: 'uploads/active.pdf', action: 'added' },
        { filePath: 'uploads/other.xlsx', action: 'added' },
      ];

      const result = await filterRenewHistoryVersions(
        {
          urnNo: 'URN-1',
          sectionKey: 'product_performance',
          processType: 'renewal',
          renewalCycleId: '507f1f77bcf86cd799439011',
          anchorProductDocumentId: 42,
        },
        versions,
      );

      expect(result).toEqual([{ filePath: 'uploads/active.pdf', action: 'added' }]);
    });
  });

  describe('getLatestDocumentMetadata', () => {
    it('throws when stream was deleted by vendor', async () => {
      findStreamOrThrow.mockResolvedValue({
        _id: 'stream-1',
        isDeleted: true,
      });

      await expect(
        service.getLatestDocumentMetadata({
          urnNo: 'URN-1',
          sectionKey: 'product_design',
          slotKey: 'eco_vision_upload',
          processType: 'renewal',
          renewalCycleId: 'cycle-1',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
