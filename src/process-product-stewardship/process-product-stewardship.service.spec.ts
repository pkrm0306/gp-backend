import { Types } from 'mongoose';
import { ProcessProductStewardshipService } from './process-product-stewardship.service';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';

jest.mock('../utils/upload-file.util', () => ({
  uploadFile: jest.fn(async (file: Express.Multer.File, folder: string) => ({
    fileUrl: `${folder}/${file.originalname}`,
    fileName: file.originalname,
  })),
}));

jest.mock('../documents/helpers/certification-document-version.util', () => ({
  isVendorResubmitCycle: jest.fn(async () => false),
  trackInsertedCertificationDocuments: jest.fn(async () => undefined),
}));

describe('ProcessProductStewardshipService DesiredState', () => {
  const vendorId = new Types.ObjectId().toString();
  const urnNo = 'URN-PS-DESIRED';

  function fakeFile(name: string): Express.Multer.File {
    return {
      fieldname: 'seaSupportingDocumentsFile',
      originalname: name,
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: 10,
      buffer: Buffer.from('x'),
      destination: '',
      filename: name,
      path: '',
      stream: null as any,
    };
  }

  function buildService(liveDocs: any[]) {
    const store = new Map<string, any>();
    let seq = 100;
    const softDeleted: Types.ObjectId[] = [];
    const inserted: any[] = [];

    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    const stewardshipModel = {
      syncIndexes: jest.fn(),
      findOne: jest.fn((filter: any) => ({
        session: jest.fn().mockResolvedValue(store.get(filter.urnNo) || null),
      })),
      findOneAndUpdate: jest.fn((filter: any, update: any) => ({
        exec: jest.fn().mockImplementation(async () => {
          const existing = store.get(filter.urnNo);
          const next = existing
            ? { ...existing, ...update.$set }
            : {
                _id: new Types.ObjectId(),
                ...update.$set,
                ...update.$setOnInsert,
              };
          store.set(filter.urnNo, next);
          return next;
        }),
      })),
    };

    const programmeModel = {
      updateMany: jest.fn().mockResolvedValue({ modifiedCount: 0 }),
      insertMany: jest.fn().mockResolvedValue([]),
      syncIndexes: jest.fn(),
    };

    const liveCopy = liveDocs.map((d) => ({ ...d }));

    const documentModel = {
      find: jest.fn(() => ({
        session: jest.fn().mockResolvedValue(liveCopy),
      })),
      updateMany: jest.fn(async (filter: any, update?: any) => {
        const ids: Types.ObjectId[] = filter?._id?.$in ?? [];
        if (update?.$set?.isDeleted === true) {
          for (const oid of ids) softDeleted.push(oid);
        }
        return { modifiedCount: ids.length };
      }),
      insertMany: jest.fn(async (rows: any[]) => {
        const withIds = rows.map((row) => ({
          ...row,
          _id: new Types.ObjectId(),
        }));
        inserted.push(...withIds);
        return withIds;
      }),
    };
    const productModel = {
      findOne: jest.fn(() => ({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({
              urnStatus: 1,
              urnNo,
              productRenewStatus: 0,
            }),
          }),
        }),
      })),
    };

    const versioning = {
      trackProductDocumentDeleteBatch: jest.fn(),
    };

    const service = new ProcessProductStewardshipService(
      stewardshipModel as any,
      programmeModel as any,
      documentModel as any,
      productModel as any,
      { startSession: jest.fn().mockResolvedValue(session) } as any,
      {
        getProcessProductStewardshipId: jest.fn(async () => ++seq),
        getProductDocumentId: jest.fn(async () => ++seq),
      } as any,
      { notifyAfterDocumentsUploaded: jest.fn() } as any,
      versioning as any,
    );

    return { service, store, softDeleted, inserted, documentModel, programmeModel };
  }

  it('same URN submit twice does not create duplicate stewardship rows', async () => {
    const { service, store } = buildService([]);
    const dto = {
      urnNo,
      qualityManagementDetails: 'Quality system',
      eprImplementedDetails: 'EPR details',
      eprGreenPackagingDetails: 'Green packaging',
      productStewardshipStatus: 1,
      existingSeaDocumentIds: [],
      existingQmDocumentIds: [],
      existingEprDocumentIds: [],
    } as any;

    await service.createProcessProductStewardship(dto, vendorId);
    await service.createProcessProductStewardship(dto, vendorId);

    expect(store.size).toBe(1);
  });

  it('SEA keep sync does not soft-delete QM or EPR docs', async () => {
    const seaKeep = new Types.ObjectId();
    const seaDrop = new Types.ObjectId();
    const qmKeep = new Types.ObjectId();
    const eprKeep = new Types.ObjectId();
    const { service, softDeleted, store } = buildService([
      {
        _id: seaKeep,
        productDocumentId: 101,
        documentFormSubsection: 'sea_supporting_documents',
        documentLink: 'urns/a/sea-keep.pdf',
      },
      {
        _id: seaDrop,
        productDocumentId: 102,
        documentFormSubsection: 'sea_supporting_documents',
        documentLink: 'urns/a/sea-drop.pdf',
      },
      {
        _id: qmKeep,
        productDocumentId: 201,
        documentFormSubsection: 'qm_supporting_documents',
        documentLink: 'urns/a/qm.pdf',
      },
      {
        _id: eprKeep,
        productDocumentId: 301,
        documentFormSubsection: 'epr_supporting_documents',
        documentLink: 'urns/a/epr.pdf',
      },
    ]);

    await service.createProcessProductStewardship(
      {
        urnNo,
        qualityManagementDetails: 'QM',
        existingSeaDocumentIds: ['101'],
        existingQmDocumentIds: ['201'],
        existingEprDocumentIds: ['301'],
      } as any,
      vendorId,
    );

    expect(softDeleted.map((id) => id.toString())).toEqual([seaDrop.toString()]);
    expect(store.get(urnNo).seaSupportingDocuments).toBe(1);
    expect(store.get(urnNo).qmSupportingDocuments).toBe(1);
    expect(store.get(urnNo).eprSupportingDocuments).toBe(1);
  });

  it('empty SEA keep clears SEA flag only; QM/EPR retained', async () => {
    const seaDoc = new Types.ObjectId();
    const qmDoc = new Types.ObjectId();
    const eprDoc = new Types.ObjectId();
    const { service, softDeleted, store } = buildService([
      {
        _id: seaDoc,
        productDocumentId: 101,
        documentFormSubsection: 'sea_supporting_documents',
        documentLink: 'urns/a/sea.pdf',
      },
      {
        _id: qmDoc,
        productDocumentId: 201,
        documentFormSubsection: 'qm_supporting_documents',
        documentLink: 'urns/a/qm.pdf',
      },
      {
        _id: eprDoc,
        productDocumentId: 301,
        documentFormSubsection: 'epr_supporting_documents',
        documentLink: 'urns/a/epr.pdf',
      },
    ]);

    await service.createProcessProductStewardship(
      {
        urnNo,
        existingSeaDocumentIds: [],
        existingQmDocumentIds: ['201'],
        existingEprDocumentIds: ['301'],
      } as any,
      vendorId,
    );

    expect(softDeleted.map((id) => id.toString())).toEqual([seaDoc.toString()]);
    expect(store.get(urnNo).seaSupportingDocuments).toBeNull();
    expect(store.get(urnNo).qmSupportingDocuments).toBe(1);
    expect(store.get(urnNo).eprSupportingDocuments).toBe(1);
  });

  it('programmeDetails replace does not clear document DesiredState slots', async () => {
    const seaDoc = new Types.ObjectId();
    const { service, softDeleted, programmeModel, store } = buildService([
      {
        _id: seaDoc,
        productDocumentId: 101,
        documentFormSubsection: 'sea_supporting_documents',
        documentLink: 'urns/a/sea.pdf',
      },
    ]);

    await service.createProcessProductStewardship(
      {
        urnNo,
        programmeDetails: [
          { programmeDetails: 'Dealer training', numberOfPrograms: '2' },
        ],
        existingSeaDocumentIds: ['101'],
        existingQmDocumentIds: [],
        existingEprDocumentIds: [],
      } as any,
      vendorId,
    );

    expect(programmeModel.updateMany).toHaveBeenCalled();
    expect(programmeModel.insertMany).toHaveBeenCalled();
    expect(softDeleted).toHaveLength(0);
    expect(store.get(urnNo).seaSupportingDocuments).toBe(1);
  });

  it('new SEA upload inserts sea_supporting_documents subsection only', async () => {
    const qmDoc = new Types.ObjectId();
    const { service, inserted, softDeleted } = buildService([
      {
        _id: qmDoc,
        productDocumentId: 201,
        documentFormSubsection: 'qm_supporting_documents',
        documentLink: 'urns/a/qm.pdf',
      },
    ]);

    await service.createProcessProductStewardship(
      {
        urnNo,
        seaSupportingDocumentsFileName: 'sea-new.pdf',
        existingSeaDocumentIds: [],
        existingQmDocumentIds: ['201'],
        existingEprDocumentIds: [],
      } as any,
      vendorId,
      [fakeFile('sea-new.pdf')],
      [],
      [],
    );

    expect(softDeleted).toHaveLength(0);
    expect(inserted).toHaveLength(1);
    expect(inserted[0].documentForm).toBe(
      DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
    );
    expect(inserted[0].documentFormSubsection).toBe('sea_supporting_documents');
  });
});
