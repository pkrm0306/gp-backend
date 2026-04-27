import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DocumentsService } from './documents.service';
import { AllProductDocument } from '../product-design/schemas/all-product-document.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';

describe('DocumentsService', () => {
  let service: DocumentsService;
  const findOneMock = jest.fn();
  const updateOneMock = jest.fn();

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

  beforeEach(async () => {
    findOneMock.mockReset();
    updateOneMock.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getModelToken(AllProductDocument.name),
          useValue: {
            findOne: findOneMock,
            updateOne: updateOneMock,
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
    findOneMock.mockReturnValue({ exec: jest.fn().mockResolvedValue(doc) });
    updateOneMock.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });

    const result = await service.softDeleteDocument(123, vendorA, {
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
    findOneMock.mockReturnValue({
      exec: jest.fn().mockResolvedValue(buildDoc({ vendorId: new Types.ObjectId(vendorB) })),
    });

    await expect(
      service.softDeleteDocument(123, vendorA, {
        urnNo: 'URN-1',
        sectionKey: DocumentSectionKey.PRODUCT_DESIGN,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('throws 404 for wrong section key', async () => {
    findOneMock.mockReturnValue({
      exec: jest.fn().mockResolvedValue(
        buildDoc({ documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE }),
      ),
    });

    await expect(
      service.softDeleteDocument(123, vendorA, {
        urnNo: 'URN-1',
        sectionKey: DocumentSectionKey.PRODUCT_DESIGN,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('throws 404 for wrong URN', async () => {
    findOneMock.mockReturnValue({
      exec: jest.fn().mockResolvedValue(buildDoc({ urnNo: 'URN-2' })),
    });

    await expect(
      service.softDeleteDocument(123, vendorA, {
        urnNo: 'URN-1',
        sectionKey: DocumentSectionKey.PRODUCT_DESIGN,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(updateOneMock).not.toHaveBeenCalled();
  });

  it('throws 404 when document is already deleted', async () => {
    findOneMock.mockReturnValue({
      exec: jest.fn().mockResolvedValue(buildDoc({ isDeleted: true })),
    });

    await expect(
      service.softDeleteDocument(123, vendorA, {
        urnNo: 'URN-1',
        sectionKey: DocumentSectionKey.PRODUCT_DESIGN,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
