import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from '../../schemas/product.schema';
import { PlantMergeAudit } from '../schemas/plant-merge-audit.schema';
import { PlantMergeUrnValidationService } from './plant-merge-urn-validation.service';
import { PRODUCT_STATUS_CERTIFIED } from '../../../renew/constants/product-status.constants';
import { PLANT_MERGE_URN_VALIDATION_BLOCKER } from '../plant-merge-urn-validation.constants';

describe('PlantMergeUrnValidationService', () => {
  let service: PlantMergeUrnValidationService;

  const manufacturerId = new Types.ObjectId();
  const categoryId = new Types.ObjectId();

  const productModel = {
    countDocuments: jest.fn(),
    findOne: jest.fn(),
  };

  const plantMergeAuditModel = {
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantMergeUrnValidationService,
        { provide: getModelToken(Product.name), useValue: productModel },
        { provide: getModelToken(PlantMergeAudit.name), useValue: plantMergeAuditModel },
      ],
    }).compile();

    service = module.get(PlantMergeUrnValidationService);
  });

  function mockFindOneChain(row: unknown) {
    return {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(row),
    };
  }

  it('returns canMerge true when all rules pass', async () => {
    const sourceProduct = {
      _id: new Types.ObjectId(),
      productName: 'Board',
      eoiNo: 'GP100',
      urnNo: 'URN-SOURCE',
      productStatus: PRODUCT_STATUS_CERTIFIED,
      manufacturerId,
      categoryId,
      certifiedDate: new Date('2024-01-01'),
      createdDate: new Date('2024-01-01'),
    };
    const targetProduct = {
      _id: new Types.ObjectId(),
      productName: 'Board',
      eoiNo: 'GP001',
      urnNo: 'URN-TARGET',
      productStatus: PRODUCT_STATUS_CERTIFIED,
      manufacturerId,
      categoryId,
      certifiedDate: new Date('2023-01-01'),
      createdDate: new Date('2023-01-01'),
    };

    productModel.countDocuments.mockResolvedValue(1);
    productModel.findOne
      .mockReturnValueOnce(mockFindOneChain(sourceProduct))
      .mockReturnValueOnce(mockFindOneChain(targetProduct));
    plantMergeAuditModel.countDocuments.mockResolvedValue(0);

    const result = await service.validate({
      sourceUrnNo: 'URN-SOURCE',
      targetUrnNo: 'URN-TARGET',
      sourceEoiNo: 'GP100',
      targetEoiNo: 'GP001',
    });

    expect(result.canMerge).toBe(true);
    expect(result.blockers).toHaveLength(0);
  });

  it('returns duplicate merge blocker', async () => {
    productModel.countDocuments.mockResolvedValue(1);
    productModel.findOne
      .mockReturnValueOnce(
        mockFindOneChain({
          _id: new Types.ObjectId(),
          productName: 'Board',
          eoiNo: 'GP100',
          urnNo: 'URN-SOURCE',
          productStatus: PRODUCT_STATUS_CERTIFIED,
          manufacturerId,
          categoryId,
          certifiedDate: new Date('2024-01-01'),
          createdDate: new Date('2024-01-01'),
        }),
      )
      .mockReturnValueOnce(
        mockFindOneChain({
          _id: new Types.ObjectId(),
          productName: 'Board',
          eoiNo: 'GP001',
          urnNo: 'URN-TARGET',
          productStatus: PRODUCT_STATUS_CERTIFIED,
          manufacturerId,
          categoryId,
          certifiedDate: new Date('2023-01-01'),
          createdDate: new Date('2023-01-01'),
        }),
      );
    plantMergeAuditModel.countDocuments.mockResolvedValue(1);

    const result = await service.validate({
      sourceUrnNo: 'URN-SOURCE',
      targetUrnNo: 'URN-TARGET',
      sourceEoiNo: 'GP100',
      targetEoiNo: 'GP001',
    });

    expect(result.canMerge).toBe(false);
    expect(result.blockers.some((b) => b.code === PLANT_MERGE_URN_VALIDATION_BLOCKER.DUPLICATE_MERGE)).toBe(true);
  });
});
