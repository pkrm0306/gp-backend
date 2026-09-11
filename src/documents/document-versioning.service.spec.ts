import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DocumentVersioningService } from './document-versioning.service';

describe('DocumentVersioningService', () => {
  const service = Object.create(
    DocumentVersioningService.prototype,
  ) as DocumentVersioningService;

  const resolveHistoryStreams = jest.fn();
  const docVersionFind = jest.fn();
  const docVersionFindOne = jest.fn();

  const mockVersions = (versions: Array<Record<string, unknown>>) => {
    docVersionFind.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(versions),
        }),
      }),
    });
  };

  const mockCycles = (cycles: Array<Record<string, unknown>>) => {
    (service as any).renewalCycleModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(cycles),
          }),
        }),
      }),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (service as any).resolveHistoryStreams = resolveHistoryStreams;
    (service as any).docVersionModel = {
      find: docVersionFind,
      findOne: docVersionFindOne,
    };
    (service as any).allProductDocumentModel = {
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
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
    mockCycles([]);
  });

  describe('getDocumentHistory', () => {
    it('returns the whole slot timeline excluding deleted action rows', async () => {
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: { _id: 'stream-1', urnNo: 'URN-1', isDeleted: true },
        legacyVersions: [],
      });
      mockVersions([
        { versionNo: 1, action: 'added', filePath: 'uploads/a.pdf' },
        { versionNo: 2, action: 'deleted', filePath: 'uploads/a.pdf' },
      ]);

      const result = await service.getDocumentHistory({
        urnNo: 'URN-1',
        sectionKey: 'product_design',
        slotKey: 'eco_vision_upload',
      });

      expect(docVersionFind).toHaveBeenCalledWith({ streamId: 'stream-1' });
      expect(result.versions.map((v) => v.versionNo)).toEqual([1]);
      expect(result.versions.map((v) => v.action)).toEqual(['added']);
    });

    it('hides vendor soft-deleted files from History without removing DB rows', async () => {
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: { _id: 'stream-1', urnNo: 'URN-1', isDeleted: false },
        legacyVersions: [],
      });
      mockVersions([
        {
          versionNo: 3,
          action: 'added',
          productDocumentId: 30,
          filePath: 'uploads/v3.pdf',
        },
        {
          versionNo: 4,
          action: 'added',
          productDocumentId: 40,
          filePath: 'uploads/v4.xlsx',
        },
      ]);
      (service as any).allProductDocumentModel = {
        find: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([
                {
                  productDocumentId: 30,
                  documentLink: 'uploads/v3.pdf',
                  isDeleted: false,
                  historyHidden: false,
                },
                {
                  productDocumentId: 40,
                  documentLink: 'uploads/v4.xlsx',
                  isDeleted: true,
                  historyHidden: true,
                },
              ]),
            }),
          }),
        }),
      };

      const result = await service.getDocumentHistory({
        urnNo: 'URN-1',
        sectionKey: 'raw_materials_hazardous_products',
        slotKey: 'products_test_report',
      });

      expect(result.versions.map((v) => v.versionNo)).toEqual([3]);
    });

    it('keeps superseded soft-deleted files in History (not vendor-hidden)', async () => {
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: { _id: 'stream-1', urnNo: 'URN-1', isDeleted: false },
        legacyVersions: [],
      });
      mockVersions([
        {
          versionNo: 3,
          action: 'added',
          productDocumentId: 30,
          filePath: 'uploads/v3.pdf',
        },
        {
          versionNo: 4,
          action: 'added',
          productDocumentId: 40,
          filePath: 'uploads/v4.xlsx',
        },
      ]);
      (service as any).allProductDocumentModel = {
        find: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([
                {
                  productDocumentId: 30,
                  documentLink: 'uploads/v3.pdf',
                  isDeleted: true,
                  historyHidden: false,
                },
                {
                  productDocumentId: 40,
                  documentLink: 'uploads/v4.xlsx',
                  isDeleted: false,
                  historyHidden: false,
                },
              ]),
            }),
          }),
        }),
      };

      const result = await service.getDocumentHistory({
        urnNo: 'URN-1',
        sectionKey: 'product_performance',
        slotKey: 'test_report_files',
      });

      expect(result.versions.map((v) => v.versionNo)).toEqual([3, 4]);
    });

    it('throws when no canonical stream exists', async () => {
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: null,
        legacyVersions: [],
      });

      await expect(
        service.getDocumentHistory({
          urnNo: 'URN-1',
          sectionKey: 'product_design',
          slotKey: 'eco_vision_upload',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('merges legacy per-cycle versions into the timeline by createdAt', async () => {
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: { _id: 'stream-1', isDeleted: false },
        legacyVersions: [
          {
            versionNo: 1,
            action: 'added',
            processType: 'renewal',
            createdAt: '2026-02-01T00:00:00.000Z',
          },
        ],
      });
      mockVersions([
        { versionNo: 1, action: 'added', createdAt: '2026-01-01T00:00:00.000Z' },
        { versionNo: 2, action: 'replaced', createdAt: '2026-03-01T00:00:00.000Z' },
      ]);

      const result = await service.getDocumentHistory({
        urnNo: 'URN-1',
        sectionKey: 'product_design',
        slotKey: 'eco_vision_upload',
      });

      expect(result.versions.map((v) => v.processType)).toEqual([
        undefined,
        'renewal',
        undefined,
      ]);
    });

    it('excludes open-cycle versions when includeOpenCycleVersions is false', async () => {
      const openCycle = new Types.ObjectId();
      const completedCycle = new Types.ObjectId();
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: { _id: 'stream-1', isDeleted: false },
        legacyVersions: [],
      });
      mockVersions([
        { versionNo: 1, action: 'added', processType: 'initial' },
        {
          versionNo: 2,
          action: 'replaced',
          processType: 'renewal',
          renewalCycleId: completedCycle,
          renewalCycleNo: 1,
        },
        {
          versionNo: 3,
          action: 'replaced',
          processType: 'renewal',
          renewalCycleId: openCycle,
          renewalCycleNo: 2,
        },
      ]);
      mockCycles([
        { _id: completedCycle, status: 'completed' },
        { _id: openCycle, status: 'in_progress' },
      ]);

      const result = await service.getDocumentHistory({
        urnNo: 'URN-1',
        sectionKey: 'product_design',
        slotKey: 'eco_vision_upload',
        includeOpenCycleVersions: false,
      });

      expect(result.versions.map((v) => v.versionNo)).toEqual([1, 2]);
      expect(result.versions[1].renewalCycleNo).toBe(1);
    });

    it('keeps every version when includeOpenCycleVersions is not set', async () => {
      const openCycle = new Types.ObjectId();
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: { _id: 'stream-1', isDeleted: false },
        legacyVersions: [],
      });
      mockVersions([
        { versionNo: 1, action: 'added', processType: 'initial' },
        {
          versionNo: 2,
          action: 'replaced',
          processType: 'renewal',
          renewalCycleId: openCycle,
          renewalCycleNo: 1,
        },
      ]);
      mockCycles([{ _id: openCycle, status: 'in_progress' }]);

      const result = await service.getDocumentHistory({
        urnNo: 'URN-1',
        sectionKey: 'product_design',
        slotKey: 'eco_vision_upload',
      });

      expect(result.versions.map((v) => v.versionNo)).toEqual([1, 2]);
    });
  });

  describe('getLatestDocumentMetadata', () => {
    it('throws when stream was deleted by vendor', async () => {
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: { _id: 'stream-1', isDeleted: true },
        legacyVersions: [],
      });

      await expect(
        service.getLatestDocumentMetadata({
          urnNo: 'URN-1',
          sectionKey: 'product_design',
          slotKey: 'eco_vision_upload',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns displayable version after all latest-version files were vendor-deleted', async () => {
      const streamId = new Types.ObjectId();
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: {
          _id: streamId,
          urnNo: 'URN-1',
          isDeleted: false,
          latestVersionNo: 4,
        },
        legacyVersions: [],
      });
      mockVersions([
        {
          streamId,
          versionNo: 3,
          action: 'added',
          productDocumentId: 30,
          filePath: 'uploads/v3.pdf',
          originalName: 'v3.pdf',
        },
        {
          streamId,
          versionNo: 4,
          action: 'added',
          productDocumentId: 40,
          filePath: 'uploads/v4.xlsx',
          originalName: 'v4.xlsx',
        },
      ]);
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
                  documentLink: 'uploads/v4.xlsx',
                  isDeleted: true,
                  historyHidden: true,
                },
              ]),
            }),
          }),
        }),
      };

      const result = await service.getLatestDocumentMetadata({
        urnNo: 'URN-1',
        sectionKey: 'raw_materials_hazardous_products',
        slotKey: 'products_test_report',
      });

      expect(result.latestVersion.versionNo).toBe(3);
      expect(result.latestVersion.originalName).toBe('v3.pdf');
      // Consumers read stream.latestVersionNo for the CURRENT badge.
      expect(result.stream.latestVersionNo).toBe(3);
    });

    it('falls back to history badge when no active CURRENT files remain', async () => {
      const streamId = new Types.ObjectId();
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: {
          _id: streamId,
          urnNo: 'URN-1',
          isDeleted: false,
          latestVersionNo: 4,
        },
        legacyVersions: [],
      });
      mockVersions([
        {
          streamId,
          versionNo: 3,
          action: 'added',
          productDocumentId: 30,
          filePath: 'uploads/v3.pdf',
          originalName: 'v3.pdf',
        },
        {
          streamId,
          versionNo: 4,
          action: 'added',
          productDocumentId: 40,
          filePath: 'uploads/v4.xlsx',
          originalName: 'v4.xlsx',
        },
      ]);
      (service as any).allProductDocumentModel = {
        find: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([
                {
                  productDocumentId: 30,
                  documentLink: 'uploads/v3.pdf',
                  isDeleted: true,
                  historyHidden: false,
                },
                {
                  productDocumentId: 40,
                  documentLink: 'uploads/v4.xlsx',
                  isDeleted: true,
                  historyHidden: false,
                },
              ]),
            }),
          }),
        }),
      };

      const result = await service.getLatestDocumentMetadata({
        urnNo: 'URN-1',
        sectionKey: 'product_performance',
        slotKey: 'test_report_files',
      });

      expect(result.stream.latestVersionNo).toBe(4);
      expect(result.latestVersion.versionNo).toBe(4);
    });

    it('excludes open renew tip when includeOpenCycleVersions is false', async () => {
      const streamId = new Types.ObjectId();
      const openCycle = new Types.ObjectId();
      resolveHistoryStreams.mockResolvedValue({
        canonicalStream: {
          _id: streamId,
          urnNo: 'URN-1',
          isDeleted: false,
          latestVersionNo: 6,
        },
        legacyVersions: [],
      });
      mockVersions([
        {
          streamId,
          versionNo: 4,
          action: 'added',
          productDocumentId: 40,
          filePath: 'uploads/v4.pdf',
          originalName: 'v4.pdf',
          processType: 'initial',
        },
        {
          streamId,
          versionNo: 6,
          action: 'added',
          productDocumentId: 60,
          filePath: 'uploads/v6.pdf',
          originalName: 'v6.pdf',
          processType: 'renewal',
          renewalCycleId: openCycle,
        },
      ]);
      mockCycles([{ _id: openCycle, status: 'in_progress' }]);
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
                  productDocumentId: 60,
                  documentLink: 'uploads/v6.pdf',
                  isDeleted: false,
                },
              ]),
            }),
          }),
        }),
      };

      const result = await service.getLatestDocumentMetadata({
        urnNo: 'URN-1',
        sectionKey: 'product_performance',
        slotKey: 'test_report_files',
        includeOpenCycleVersions: false,
      });

      expect(result.stream.latestVersionNo).toBe(4);
      expect(result.latestVersion.versionNo).toBe(4);
      expect(result.latestVersion.originalName).toBe('v4.pdf');
    });
  });
});
