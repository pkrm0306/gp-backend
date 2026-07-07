import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from '../../schemas/product.schema';
import { ProductPlant } from '../../schemas/product-plant.schema';
import { PlantMergeUrnPreviewService } from './plant-merge-urn-preview.service';
import { PlantMergeUrnValidationService } from './plant-merge-urn-validation.service';
import {
  PLANT_MERGE_URN_PREVIEW_FAILURE,
  PLANT_MERGE_URN_PREVIEW_STATUS,
} from '../plant-merge-urn-preview.constants';
import { PRODUCT_STATUS_CERTIFIED } from '../../../renew/constants/product-status.constants';
import { PLANT_MERGE_URN_VALIDATION_MESSAGE } from '../plant-merge-urn-validation.constants';

describe('PlantMergeUrnPreviewService', () => {
  let service: PlantMergeUrnPreviewService;

  const manufacturerId = new Types.ObjectId();
  const categoryId = new Types.ObjectId();

  const productModel = {
    find: jest.fn(),
  };

  const productPlantModel = {
    countDocuments: jest.fn().mockResolvedValue(2),
  };

  const plantMergeUrnValidationService = {
    validateResolvedPair: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    plantMergeUrnValidationService.validateResolvedPair.mockResolvedValue([]);
    productPlantModel.countDocuments.mockResolvedValue(2);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantMergeUrnPreviewService,
        {
          provide: getModelToken(Product.name),
          useValue: productModel,
        },
        {
          provide: getModelToken(ProductPlant.name),
          useValue: productPlantModel,
        },
        {
          provide: PlantMergeUrnValidationService,
          useValue: plantMergeUrnValidationService,
        },
      ],
    }).compile();

    service = module.get(PlantMergeUrnPreviewService);
  });

  function mockFindChain(rows: unknown[]) {
    return {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(rows),
    };
  }

  it('returns READY rows with target URN, EOI, and plant count', async () => {
    const sourceProduct = {
      _id: new Types.ObjectId(),
      productId: 10,
      productName: 'Board',
      eoiNo: 'GP100',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      certifiedDate: new Date('2024-01-01'),
      createdDate: new Date('2024-01-01'),
    };

    productModel.find
      .mockReturnValueOnce(mockFindChain([sourceProduct]))
      .mockReturnValueOnce(
        mockFindChain([
          {
            _id: new Types.ObjectId(),
            productName: 'Board',
            urnNo: 'URN-TARGET',
            eoiNo: 'GP001',
            manufacturerId,
            categoryId,
            productStatus: PRODUCT_STATUS_CERTIFIED,
            certifiedDate: new Date('2023-01-01'),
            createdDate: new Date('2023-01-01'),
          },
        ]),
      );

    const result = await service.previewBySourceUrn('URN-SOURCE');

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({
      productName: 'Board',
      sourceEoi: 'GP100',
      sourceUrn: 'URN-SOURCE',
      targetUrn: 'URN-TARGET',
      targetEoi: 'GP001',
      mergeStatus: PLANT_MERGE_URN_PREVIEW_STATUS.READY,
      failureReason: null,
      sourcePlantCount: 2,
    });
    expect(result.summary).toEqual({
      total: 1,
      ready: 1,
      blocked: 0,
      noTarget: 0,
    });
  });

  it('returns NO_TARGET when no external match exists', async () => {
    const sourceProduct = {
      _id: new Types.ObjectId(),
      productId: 11,
      productName: 'Panel',
      eoiNo: 'GP200',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      createdDate: new Date('2024-01-01'),
    };

    productModel.find
      .mockReturnValueOnce(mockFindChain([sourceProduct]))
      .mockReturnValueOnce(mockFindChain([]));

    const result = await service.previewBySourceUrn('URN-SOURCE');

    expect(result.items[0]?.mergeStatus).toBe(PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET);
    expect(result.items[0]?.targetUrn).toBeNull();
    expect(result.items[0]?.failureReason).toBe(
      PLANT_MERGE_URN_PREVIEW_FAILURE.NO_MATCHING_TARGET,
    );
    expect(result.summary.noTarget).toBe(1);
  });

  it('returns NO_TARGET with brand-new-product reason when only newer matches exist', async () => {
    const sourceProduct = {
      _id: new Types.ObjectId(),
      productId: 12,
      productName: 'Tile',
      eoiNo: 'GP300',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      certifiedDate: new Date('2024-06-01'),
      createdDate: new Date('2024-06-01'),
    };

    productModel.find
      .mockReturnValueOnce(mockFindChain([sourceProduct]))
      .mockReturnValueOnce(
        mockFindChain([
          {
            urnNo: 'URN-NEWER',
            eoiNo: 'GP099',
            productName: 'Tile',
            manufacturerId,
            categoryId,
            certifiedDate: new Date('2025-01-01'),
            createdDate: new Date('2025-01-01'),
          },
        ]),
      );

    const result = await service.previewBySourceUrn('URN-SOURCE');

    expect(result.items[0]?.mergeStatus).toBe(PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET);
    expect(result.items[0]?.failureReason).toBe(
      PLANT_MERGE_URN_PREVIEW_FAILURE.BRAND_NEW_PRODUCT,
    );
  });

  it('returns BLOCKED when source EOI has no active plants', async () => {
    productPlantModel.countDocuments.mockResolvedValue(0);

    const sourceProduct = {
      _id: new Types.ObjectId(),
      productId: 13,
      productName: 'Glass',
      eoiNo: 'GP400',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      createdDate: new Date('2024-01-01'),
    };

    productModel.find
      .mockReturnValueOnce(mockFindChain([sourceProduct]))
      .mockReturnValueOnce(mockFindChain([]));

    const result = await service.previewBySourceUrn('URN-SOURCE');

    expect(result.items[0]?.mergeStatus).toBe(PLANT_MERGE_URN_PREVIEW_STATUS.BLOCKED);
    expect(result.items[0]?.failureReason).toBe(
      PLANT_MERGE_URN_PREVIEW_FAILURE.SOURCE_NO_PLANTS,
    );
    expect(result.summary.blocked).toBe(1);
  });

  it('returns partial summary for multiple products with mixed statuses', async () => {
    const sourceA = {
      _id: new Types.ObjectId(),
      productId: 20,
      productName: 'Board',
      eoiNo: 'GP100',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      certifiedDate: new Date('2024-01-01'),
      createdDate: new Date('2024-01-01'),
    };
    const sourceB = {
      _id: new Types.ObjectId(),
      productId: 21,
      productName: 'Panel',
      eoiNo: 'GP101',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      certifiedDate: new Date('2024-02-01'),
      createdDate: new Date('2024-02-01'),
    };

    productModel.find
      .mockReturnValueOnce(mockFindChain([sourceA, sourceB]))
      .mockReturnValueOnce(
        mockFindChain([
          {
            _id: new Types.ObjectId(),
            productName: 'Board',
            urnNo: 'URN-TARGET',
            eoiNo: 'GP001',
            manufacturerId,
            categoryId,
            productStatus: PRODUCT_STATUS_CERTIFIED,
            certifiedDate: new Date('2023-01-01'),
            createdDate: new Date('2023-01-01'),
          },
        ]),
      );

    const result = await service.previewBySourceUrn('URN-SOURCE');

    expect(result.items).toHaveLength(2);
    expect(result.summary).toEqual({
      total: 2,
      ready: 1,
      blocked: 0,
      noTarget: 1,
    });
    expect(result.items[0]?.mergeStatus).toBe(PLANT_MERGE_URN_PREVIEW_STATUS.READY);
    expect(result.items[1]?.mergeStatus).toBe(PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET);
  });

  it('returns BLOCKED when validation reports duplicate merge', async () => {
    const sourceProduct = {
      _id: new Types.ObjectId(),
      productId: 30,
      productName: 'Board',
      eoiNo: 'GP500',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: PRODUCT_STATUS_CERTIFIED,
      certifiedDate: new Date('2024-01-01'),
      createdDate: new Date('2024-01-01'),
    };

    productModel.find
      .mockReturnValueOnce(mockFindChain([sourceProduct]))
      .mockReturnValueOnce(
        mockFindChain([
          {
            _id: new Types.ObjectId(),
            productName: 'Board',
            urnNo: 'URN-TARGET',
            eoiNo: 'GP001',
            manufacturerId,
            categoryId,
            productStatus: PRODUCT_STATUS_CERTIFIED,
            certifiedDate: new Date('2023-01-01'),
            createdDate: new Date('2023-01-01'),
          },
        ]),
      );

    plantMergeUrnValidationService.validateResolvedPair.mockResolvedValue([
      {
        code: 'DUPLICATE_MERGE',
        message: PLANT_MERGE_URN_VALIDATION_MESSAGE.DUPLICATE_MERGE,
      },
    ]);

    const result = await service.previewBySourceUrn('URN-SOURCE');

    expect(result.items[0]?.mergeStatus).toBe(PLANT_MERGE_URN_PREVIEW_STATUS.BLOCKED);
    expect(result.items[0]?.failureReason).toContain('already been merged');
    expect(result.summary.blocked).toBe(1);
  });
});
