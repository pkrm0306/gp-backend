import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DocumentsService } from './documents.service';
import { AllProductDocument } from '../product-design/schemas/all-product-document.schema';
import { DocumentVersioningService } from './document-versioning.service';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';

describe('DocumentsService', () => {
  let service: DocumentsService;
  const findOneMock = jest.fn();
  const updateOneMock = jest.fn();
  const countDocumentsMock = jest.fn();
  const collectionUpdateOneMock = jest.fn();

  const vendorA = new Types.ObjectId().toString();
  const vendorB = new Types.ObjectId().toString();

  const buildDoc = (overrides: Record<string, any> = {}) => ({
    _id: new Types.ObjectId(),
    productDocumentId: 123,
    vendorId: new Types.ObjectId(vendorA),
    urnNo: 'URN-1',
    documentForm: DocumentSectionKey.PRODUCT_DESIGN,
    documentLink: 'uploads/urns/URN-1/test.pdf',
    isDeleted: false,
    ...overrides,
  });

  const mockFindOneResult = (doc: unknown) => {
    findOneMock.mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(doc),
      }),
    });
  };

  beforeEach(async () => {
    findOneMock.mockReset();
    updateOneMock.mockReset();
    countDocumentsMock.mockReset();
    collectionUpdateOneMock.mockReset();
    countDocumentsMock.mockResolvedValue(0);
    collectionUpdateOneMock.mockResolvedValue({ acknowledged: true });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getModelToken(AllProductDocument.name),
          useValue: {
            findOne: findOneMock,
            updateOne: updateOneMock,
            countDocuments: countDocumentsMock,
          },
        },
        {
          provide: getConnectionToken(),
          useValue: {
            collection: jest.fn().mockReturnValue({
              updateOne: collectionUpdateOneMock,
            }),
          },
        },
        {
          provide: DocumentVersioningService,
          useValue: {
            trackDocumentVersionChangeSafe: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('soft deletes document on happy path', async () => {
    const doc = buildDoc();
    mockFindOneResult(doc);
    updateOneMock.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });

    const result = await service.softDeleteDocument('123', vendorA, {
      urnNo: 'URN-1',
      sectionKey: DocumentSectionKey.PRODUCT_DESIGN,
    });

    expect(updateOneMock).toHaveBeenCalledTimes(1);
    expect(updateOneMock.mock.calls[0][1].$set.isDeleted).toBe(true);
    expect(result).toEqual({
      documentId: 123,
      urnNo: 'URN-1',
      sectionKey: DocumentSectionKey.PRODUCT_DESIGN,
    });
  });

  it('throws 403 for wrong vendor ownership', async () => {
    mockFindOneResult(buildDoc({ vendorId: new Types.ObjectId(vendorB) }));

    await expect(
      service.softDeleteDocument('123', vendorA, {
        urnNo: 'URN-1',
        sectionKey: DocumentSectionKey.PRODUCT_DESIGN,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('soft deletes when sectionKey does not match stored documentForm', async () => {
    const doc = buildDoc({ documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE });
    mockFindOneResult(doc);
    updateOneMock.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });

    const result = await service.softDeleteDocument('123', vendorA, {
      urnNo: 'URN-1',
      sectionKey: DocumentSectionKey.PRODUCT_DESIGN,
    });

    expect(updateOneMock).toHaveBeenCalledTimes(1);
    expect(result.sectionKey).toBe(DocumentSectionKey.PRODUCT_PERFORMANCE);
  });

  it('throws 404 for wrong URN', async () => {
    mockFindOneResult(buildDoc({ urnNo: 'URN-2' }));

    await expect(
      service.softDeleteDocument('123', vendorA, {
        urnNo: 'URN-1',
        sectionKey: DocumentSectionKey.PRODUCT_DESIGN,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('returns success when document is already deleted (idempotent)', async () => {
    mockFindOneResult(
      buildDoc({
        isDeleted: true,
        documentForm: DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
        documentFormSubsection: 'wm_supporting_documents',
      }),
    );

    const result = await service.softDeleteDocument('123', vendorA, {
      urnNo: 'URN-1',
      sectionKey: DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
    });

    expect(updateOneMock).not.toHaveBeenCalled();
    expect(collectionUpdateOneMock).toHaveBeenCalledWith(
      { urnNo: 'URN-1' },
      expect.objectContaining({
        $set: expect.objectContaining({
          wmSupportingDocuments: null,
        }),
      }),
    );
    expect(result.documentId).toBe(123);
  });

  it('clears waste management supporting-doc flag when last file is removed', async () => {
    const doc = buildDoc({
      documentForm: DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
      documentFormSubsection: 'wm_supporting_documents',
    });
    mockFindOneResult(doc);
    updateOneMock.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });

    await service.softDeleteDocument('123', vendorA, {
      urnNo: 'URN-1',
      sectionKey: DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
    });

    expect(collectionUpdateOneMock).toHaveBeenCalledWith(
      { urnNo: 'URN-1' },
      expect.objectContaining({
        $set: expect.objectContaining({
          wmSupportingDocuments: null,
        }),
      }),
    );
  });

  it('resolves document by MongoDB _id string', async () => {
    const objectId = new Types.ObjectId();
    const doc = buildDoc({ _id: objectId });
    mockFindOneResult(doc);
    updateOneMock.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });

    await service.softDeleteDocument(objectId.toString(), vendorA, {
      urnNo: 'URN-1',
      sectionKey: DocumentSectionKey.PRODUCT_DESIGN,
    });

    expect(findOneMock).toHaveBeenCalledWith({ _id: objectId });
  });
});
