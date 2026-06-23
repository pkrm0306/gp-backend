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
    (service as any).docVersionModel = { find: docVersionFind };
    (service as any).mapStream = (stream: Record<string, unknown>) => stream;
    (service as any).mapVersion = (version: Record<string, unknown>) => version;
  });

  describe('getDocumentHistory', () => {
    it('returns empty versions when the stream was deleted by vendor', async () => {
      findStreamOrThrow.mockResolvedValue({
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
      findStreamOrThrow.mockResolvedValue({
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
