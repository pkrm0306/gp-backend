import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { Category } from '../../categories/schemas/category.schema';
import { Manufacturer } from '../../manufacturers/schemas/manufacturer.schema';
import { AllProductDocument } from '../../product-design/schemas/all-product-document.schema';
import { ProductPlant } from '../schemas/product-plant.schema';
import { VendorCertificateService } from './vendor-certificate.service';

jest.mock('archiver', () => jest.fn());

describe('VendorCertificateService', () => {
  let service: VendorCertificateService;

  const vendorId = new Types.ObjectId();
  const productObjectId = new Types.ObjectId();
  const plantObjectId = new Types.ObjectId();

  const productModel = {
    findOne: jest.fn(),
    find: jest.fn(),
  };
  const categoryModel = { findById: jest.fn() };
  const manufacturerModel = { findById: jest.fn() };
  const allProductDocumentModel = { find: jest.fn() };
  const productPlantModel = { aggregate: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendorCertificateService,
        { provide: getModelToken(Product.name), useValue: productModel },
        { provide: getModelToken(Category.name), useValue: categoryModel },
        {
          provide: getModelToken(Manufacturer.name),
          useValue: manufacturerModel,
        },
        {
          provide: getModelToken(AllProductDocument.name),
          useValue: allProductDocumentModel,
        },
        { provide: getModelToken(ProductPlant.name), useValue: productPlantModel },
      ],
    }).compile();

    service = module.get(VendorCertificateService);
  });

  function mockCertifiedProduct() {
    return {
      _id: productObjectId,
      vendorId,
      eoiNo: 'GPABC001',
      urnNo: 'URN-TEST',
      productName: 'Test Product',
      productStatus: 2,
      validtillDate: new Date('2028-12-31'),
      categoryId: new Types.ObjectId(),
      manufacturerId: new Types.ObjectId(),
    };
  }

  function mockPlantsAggregate(rows: unknown[]) {
    productPlantModel.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(rows),
    });
  }

  it('generates one merged PDF page per plant for a single-plant EOI', async () => {
    const product = mockCertifiedProduct();
    productModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(product),
    });
    categoryModel.findById.mockReturnValue({
      select: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ categoryName: 'Category' }),
      }),
    });
    manufacturerModel.findById.mockReturnValue({
      select: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ manufacturerName: 'Acme' }),
      }),
    });
    mockPlantsAggregate([
      {
        _id: plantObjectId,
        productPlantId: 1,
        plantName: 'Mumbai',
        plantLocation: 'Mumbai',
        city: 'Mumbai',
        state: [{ stateName: 'Maharashtra' }],
      },
    ]);

    const file = await service.downloadEoiCertificate(
      String(vendorId),
      String(productObjectId),
      'merged',
    );

    expect(file.contentType).toBe('application/pdf');
    expect(file.buffer.subarray(0, 5).toString()).toBe('%PDF-');
    expect(file.fileName).toBe('GreenPro_Certificate_GPABC001.pdf');
  });
});
