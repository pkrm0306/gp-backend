import { Types } from 'mongoose';
import { RenewDocumentPromotionService } from './renew-document-promotion.service';

jest.mock('../helpers/renew-eligible-product.util', () => ({
  fetchRenewCertifiedEoiSet: jest.fn().mockResolvedValue(new Set<string>()),
  filterRenewRowsByCertifiedEoi: jest.fn((rows: unknown[]) => rows),
}));

type RenewDocRow = {
  productDocumentId: number;
  documentForm: string;
  documentFormSubsection: string;
  documentTag?: string | null;
  documentLink: string;
  documentName: string;
  documentOriginalName: string;
  vendorId: Types.ObjectId;
  eoiNo?: string;
  formPrimaryId?: number;
  isDeleted?: boolean;
};

describe('RenewDocumentPromotionService', () => {
  const cycleId = new Types.ObjectId();
  const userId = new Types.ObjectId();
  const vendorId = new Types.ObjectId();

  const buildService = (options: {
    renewDocs: RenewDocRow[];
    deletedRenewDocs?: Array<{ documentLink: string }>;
    certifiedDocs?: Array<Record<string, unknown>>;
    existingVersionByPath?: Record<string, { _id: Types.ObjectId }>;
  }) => {
    const service = Object.create(
      RenewDocumentPromotionService.prototype,
    ) as RenewDocumentPromotionService;

    const certifiedDocs = options.certifiedDocs ?? [];
    const updatedCertifiedIds: unknown[] = [];
    const softDeletedIds: unknown[] = [];
    const createdCertifiedDocs: Array<Record<string, unknown>> = [];
    const trackedVersions: Array<Record<string, unknown>> = [];
    const markedCurrent: Types.ObjectId[] = [];

    (service as any).logger = { warn: jest.fn() };

    (service as any).renewDocumentModel = {
      find: jest.fn((filter: Record<string, unknown>) => {
        const wantsDeleted = filter.isDeleted === true;
        const rows = wantsDeleted
          ? options.deletedRenewDocs ?? []
          : options.renewDocs;
        const chain: Record<string, unknown> = {
          session: () => chain,
          select: () => chain,
          lean: () => chain,
          exec: () => Promise.resolve(rows),
        };
        return chain;
      }),
    };

    (service as any).allProductDocumentModel = {
      find: jest.fn(() => {
        const chain: Record<string, unknown> = {
          session: () => chain,
          lean: () => chain,
          exec: () => Promise.resolve(certifiedDocs),
        };
        return chain;
      }),
      findOne: jest.fn((filter: Record<string, unknown>) => {
        const match = certifiedDocs.find(
          (doc) =>
            Number(doc.productDocumentId) === Number(filter.productDocumentId),
        );
        const chain: Record<string, unknown> = {
          session: () => chain,
          exec: () => Promise.resolve(match ?? null),
        };
        return chain;
      }),
      updateOne: jest.fn(async (filter: Record<string, unknown>) => {
        updatedCertifiedIds.push(filter._id);
      }),
      updateMany: jest.fn(async (filter: Record<string, any>) => {
        softDeletedIds.push(...(filter._id?.$in ?? []));
      }),
      create: jest.fn(async (payload: Array<Record<string, unknown>>) => {
        createdCertifiedDocs.push(payload[0]);
        return [{ _id: new Types.ObjectId() }];
      }),
    };

    (service as any).renewalCycleModel = {
      findById: jest.fn(() => {
        const chain: Record<string, unknown> = {
          select: () => chain,
          lean: () => chain,
          exec: () => Promise.resolve({ _id: cycleId, cycleNo: 2 }),
        };
        return chain;
      }),
    };

    (service as any).productModel = {};

    (service as any).documentVersioningService = {
      findVersionByFilePath: jest.fn(
        async (
          _urn: string,
          _section: string,
          _subsection: string | null,
          _slot: string,
          normalizedPath: string,
        ) => options.existingVersionByPath?.[normalizedPath] ?? null,
      ),
      trackDocumentVersionChange: jest.fn(
        async (input: Record<string, unknown>) => {
          trackedVersions.push(input);
          return {
            streamId: new Types.ObjectId(),
            versionId: new Types.ObjectId(),
            versionNo: trackedVersions.length,
          };
        },
      ),
      markVersionAsCurrent: jest.fn(async (versionId: Types.ObjectId) => {
        markedCurrent.push(versionId);
      }),
    };

    return {
      service,
      updatedCertifiedIds,
      softDeletedIds,
      createdCertifiedDocs,
      trackedVersions,
      markedCurrent,
    };
  };

  const renewDoc = (overrides: Partial<RenewDocRow> = {}): RenewDocRow => ({
    productDocumentId: 101,
    documentForm: 'product_performance',
    documentFormSubsection: 'test_report_files',
    documentLink: 'uploads/renew-a.pdf',
    documentName: 'renew-a.pdf',
    documentOriginalName: 'Renew A.pdf',
    vendorId,
    ...overrides,
  });

  it('promotes every non-deleted renew doc of the cycle', async () => {
    const ctx = buildService({
      renewDocs: [
        renewDoc({ productDocumentId: 101, documentLink: 'uploads/renew-a.pdf' }),
        renewDoc({ productDocumentId: 102, documentLink: 'uploads/renew-b.pdf' }),
      ],
    });

    const promoted = await ctx.service.promoteRenewDocumentsForCompletedCycle(
      'URN-20260909091318',
      cycleId,
      userId,
    );

    expect(promoted).toBe(2);
    expect(ctx.createdCertifiedDocs).toHaveLength(2);
    expect(ctx.trackedVersions).toHaveLength(2);
  });

  it('stamps promoted versions with renewal provenance', async () => {
    const ctx = buildService({ renewDocs: [renewDoc()] });

    await ctx.service.promoteRenewDocumentsForCompletedCycle(
      'URN-20260909091318',
      cycleId,
      userId,
    );

    expect(ctx.trackedVersions[0]).toMatchObject({
      processType: 'renewal',
      renewalCycleNo: 2,
    });
    expect(String(ctx.trackedVersions[0].renewalCycleId)).toBe(String(cycleId));
  });

  it('reuses an existing version instead of duplicating it', async () => {
    const existingVersionId = new Types.ObjectId();
    const ctx = buildService({
      renewDocs: [renewDoc({ documentLink: 'uploads/Renew-A.pdf' })],
      existingVersionByPath: {
        'uploads/renew-a.pdf': { _id: existingVersionId },
      },
    });

    await ctx.service.promoteRenewDocumentsForCompletedCycle(
      'URN-20260909091318',
      cycleId,
      userId,
    );

    expect(ctx.trackedVersions).toHaveLength(0);
    expect(ctx.markedCurrent.map(String)).toEqual([String(existingVersionId)]);
  });

  it('keeps untouched certified docs and only removes vendor-deleted ones', async () => {
    const survivingId = new Types.ObjectId();
    const removedId = new Types.ObjectId();
    const ctx = buildService({
      renewDocs: [renewDoc({ productDocumentId: 103, documentLink: 'uploads/renew-c.pdf' })],
      deletedRenewDocs: [{ documentLink: 'uploads/old-removed.pdf' }],
      certifiedDocs: [
        {
          _id: survivingId,
          productDocumentId: 55,
          documentForm: 'product_performance',
          documentFormSubsection: 'test_report_files',
          documentLink: 'uploads/old-kept.pdf',
        },
        {
          _id: removedId,
          productDocumentId: 56,
          documentForm: 'product_performance',
          documentFormSubsection: 'test_report_files',
          documentLink: 'uploads/old-removed.pdf',
        },
      ],
    });

    await ctx.service.promoteRenewDocumentsForCompletedCycle(
      'URN-20260909091318',
      cycleId,
      userId,
    );

    expect(ctx.softDeletedIds.map(String)).toEqual([String(removedId)]);
  });
});
