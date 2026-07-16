import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from '../../schemas/product.schema';
import { ProductPlant } from '../../schemas/product-plant.schema';
import { PlantMergeAudit } from '../schemas/plant-merge-audit.schema';
import { PlantMergeUrnExecuteService } from './plant-merge-urn-execute.service';
import { PlantMergeUrnValidationService } from './plant-merge-urn-validation.service';
import { PlantMergeUrnPreviewService } from './plant-merge-urn-preview.service';
import { SequenceHelper } from '../../helpers/sequence.helper';
import { ActivityLogService } from '../../../activity-log/activity-log.service';
import { RedisService } from '../../../common/redis/redis.service';
import { LifecycleNotificationService } from '../../../notifications/lifecycle-notification.service';
import { PLANT_MERGE_URN_PREVIEW_STATUS } from '../plant-merge-urn-preview.constants';
import { PLANT_MERGE_STATUS, PLANT_MERGE_STRATEGY_URN_COPY } from '../plant-merge.constants';

jest.mock('../../../renew/helpers/mongo-session.util', () => ({
  runInTransactionIfSupported: jest.fn(
    async (_connection: unknown, work: (session?: unknown) => Promise<unknown>) =>
      work({}),
  ),
}));

import { runInTransactionIfSupported } from '../../../renew/helpers/mongo-session.util';

jest.mock('../helpers/copy-product-plants.util', () => ({
  copyActivePlantsToTargetProduct: jest.fn(),
}));

import { copyActivePlantsToTargetProduct } from '../helpers/copy-product-plants.util';

describe('PlantMergeUrnExecuteService', () => {
  let service: PlantMergeUrnExecuteService;

  const sourceProductId = new Types.ObjectId();
  const targetProductId = new Types.ObjectId();
  const copiedPlantId = new Types.ObjectId();
  const sourcePlantId = new Types.ObjectId();
  const vendorId = new Types.ObjectId();
  const manufacturerId = new Types.ObjectId();
  const categoryId = new Types.ObjectId();
  const adminUserId = new Types.ObjectId().toHexString();

  const productModel = {
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };

  const productPlantModel = {
    countDocuments: jest.fn(),
    create: jest.fn(),
  };

  const plantMergeAuditModel = {
    create: jest.fn(),
  };

  const plantMergeUrnValidationService = {
    validate: jest.fn(),
  };

  const plantMergeUrnPreviewService = {
    previewBySourceUrn: jest.fn(),
  };

  const sequenceHelper = {
    reserveSequenceValues: jest.fn(),
    getProductPlantId: jest.fn(),
  };

  const redisService = {
    buildKey: jest.fn((...parts: string[]) => parts.join(':')),
    deleteByPattern: jest.fn().mockResolvedValue(undefined),
  };

  const activityLogService = {
    logActivity: jest.fn().mockResolvedValue(undefined),
  };

  const sourceProduct = {
    _id: sourceProductId,
    productId: 101,
    productName: 'Board',
    eoiNo: 'GP100',
    urnNo: 'URN-SOURCE',
    vendorId,
    manufacturerId,
    categoryId,
  };

  const targetProduct = {
    _id: targetProductId,
    productId: 50,
    productName: 'Board',
    eoiNo: 'GP001',
    urnNo: 'URN-TARGET',
    vendorId,
    manufacturerId,
    categoryId,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    plantMergeUrnValidationService.validate.mockResolvedValue({
      success: true,
      canMerge: true,
      sourceUrnNo: 'URN-SOURCE',
      targetUrnNo: 'URN-TARGET',
      sourceEoiNo: 'GP100',
      targetEoiNo: 'GP001',
      productName: 'Board',
      blockers: [],
    });

    productModel.findOne
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(sourceProduct),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(targetProduct),
      });

    productPlantModel.countDocuments.mockResolvedValue(2);
    productModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

    (copyActivePlantsToTargetProduct as jest.Mock).mockResolvedValue({
      sourcePlantIds: [sourcePlantId],
      sourceProductPlantIds: [9001],
      copiedPlantIds: [copiedPlantId],
      copiedProductPlantIds: [9002],
      skippedSourcePlantIds: [],
      skippedProductPlantIds: [],
      manufacturingUnitsSkipped: [],
    });

    plantMergeAuditModel.create.mockResolvedValue([
      { _id: new Types.ObjectId() },
    ]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantMergeUrnExecuteService,
        { provide: getModelToken(Product.name), useValue: productModel },
        { provide: getModelToken(ProductPlant.name), useValue: productPlantModel },
        {
          provide: getModelToken(PlantMergeAudit.name),
          useValue: plantMergeAuditModel,
        },
        { provide: getConnectionToken(), useValue: {} },
        {
          provide: PlantMergeUrnValidationService,
          useValue: plantMergeUrnValidationService,
        },
        {
          provide: PlantMergeUrnPreviewService,
          useValue: plantMergeUrnPreviewService,
        },
        { provide: SequenceHelper, useValue: sequenceHelper },
        { provide: ActivityLogService, useValue: activityLogService },
        { provide: RedisService, useValue: redisService },
        {
          provide: LifecycleNotificationService,
          useValue: {
            notifyPlantMerged: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get(PlantMergeUrnExecuteService);
  });

  it('executes explicit pair: copies plants, writes audit, does not touch source product', async () => {
    const result = await service.execute(
      {
        sourceUrnNo: 'URN-SOURCE',
        pairs: [
          {
            sourceEoiNo: 'GP100',
            targetUrnNo: 'URN-TARGET',
            targetEoiNo: 'GP001',
          },
        ],
      },
      adminUserId,
    );

    expect(plantMergeUrnValidationService.validate).toHaveBeenCalledWith({
      sourceUrnNo: 'URN-SOURCE',
      targetUrnNo: 'URN-TARGET',
      sourceEoiNo: 'GP100',
      targetEoiNo: 'GP001',
    });

    expect(copyActivePlantsToTargetProduct).toHaveBeenCalledWith(
      productPlantModel,
      sequenceHelper,
      sourceProductId,
      expect.objectContaining({
        _id: targetProductId,
        urnNo: 'URN-TARGET',
        eoiNo: 'GP001',
      }),
      expect.any(Date),
      expect.any(Object),
    );

    expect(plantMergeAuditModel.create).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          productId: sourceProductId,
          targetProductId,
          urnNo: 'URN-SOURCE',
          eoiNo: 'GP100',
          targetUrnNo: 'URN-TARGET',
          targetEoiNo: 'GP001',
          mergeStrategy: PLANT_MERGE_STRATEGY_URN_COPY,
          mergeStatus: PLANT_MERGE_STATUS.COMPLETED,
          sourcePlantIds: [sourcePlantId],
          copiedPlantIds: [copiedPlantId],
          manufacturingUnitsSkipped: [],
        }),
      ],
      { session: expect.any(Object) },
    );

    expect(result.pairsExecuted).toBe(1);
    expect(result.results[0]?.plantsCopied).toBe(1);
    expect(result.results[0]?.plantsSkipped).toBe(0);
    expect(result.results[0]?.mergeStatus).toBe(PLANT_MERGE_STATUS.COMPLETED);
    expect(activityLogService.logActivity).toHaveBeenCalled();
  });

  it('auto-resolves READY preview pairs when pairs omitted', async () => {
    plantMergeUrnPreviewService.previewBySourceUrn.mockResolvedValue({
      success: true,
      sourceUrnNo: 'URN-SOURCE',
      items: [
        {
          productName: 'Board',
          sourceEoi: 'GP100',
          sourceUrn: 'URN-SOURCE',
          targetUrn: 'URN-TARGET',
          targetEoi: 'GP001',
          mergeStatus: PLANT_MERGE_URN_PREVIEW_STATUS.READY,
          failureReason: null,
          sourcePlantCount: 2,
        },
      ],
      summary: { total: 1, ready: 1, blocked: 0, noTarget: 0 },
    });

    productModel.findOne.mockReset();
    productModel.findOne
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(sourceProduct),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(targetProduct),
      });

    await service.execute({ sourceUrnNo: 'URN-SOURCE' }, adminUserId);

    expect(plantMergeUrnPreviewService.previewBySourceUrn).toHaveBeenCalledWith(
      'URN-SOURCE',
    );
    expect(copyActivePlantsToTargetProduct).toHaveBeenCalled();
  });

  it('rejects when validation fails before transaction', async () => {
    plantMergeUrnValidationService.validate.mockResolvedValue({
      success: true,
      canMerge: false,
      blockers: [{ code: 'DUPLICATE_MERGE', message: 'Already merged' }],
    });

    await expect(
      service.execute(
        {
          sourceUrnNo: 'URN-SOURCE',
          pairs: [
            {
              sourceEoiNo: 'GP100',
              targetUrnNo: 'URN-TARGET',
              targetEoiNo: 'GP001',
            },
          ],
        },
        adminUserId,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(copyActivePlantsToTargetProduct).not.toHaveBeenCalled();
    expect(plantMergeAuditModel.create).not.toHaveBeenCalled();
  });

  it('rejects when no eligible pairs exist', async () => {
    plantMergeUrnPreviewService.previewBySourceUrn.mockResolvedValue({
      success: true,
      sourceUrnNo: 'URN-SOURCE',
      items: [],
      summary: { total: 0, ready: 0, blocked: 0, noTarget: 0 },
    });

    await expect(
      service.execute({ sourceUrnNo: 'URN-SOURCE' }, adminUserId),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('executes only READY pairs when preview has partial matches', async () => {
    plantMergeUrnPreviewService.previewBySourceUrn.mockResolvedValue({
      success: true,
      sourceUrnNo: 'URN-SOURCE',
      items: [
        {
          productName: 'Board',
          sourceEoi: 'GP100',
          sourceUrn: 'URN-SOURCE',
          targetUrn: 'URN-TARGET',
          targetEoi: 'GP001',
          mergeStatus: PLANT_MERGE_URN_PREVIEW_STATUS.READY,
          failureReason: null,
          sourcePlantCount: 2,
        },
        {
          productName: 'Panel',
          sourceEoi: 'GP101',
          sourceUrn: 'URN-SOURCE',
          targetUrn: null,
          targetEoi: null,
          mergeStatus: PLANT_MERGE_URN_PREVIEW_STATUS.NO_TARGET,
          failureReason: 'No match',
          sourcePlantCount: 1,
        },
      ],
      summary: { total: 2, ready: 1, blocked: 0, noTarget: 1 },
    });

    productModel.findOne.mockReset();
    productModel.findOne
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(sourceProduct),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(targetProduct),
      });

    const result = await service.execute({ sourceUrnNo: 'URN-SOURCE' }, adminUserId);

    expect(result.pairsExecuted).toBe(1);
    expect(copyActivePlantsToTargetProduct).toHaveBeenCalledTimes(1);
  });

  it('records skipped duplicate plants in audit and result', async () => {
    (copyActivePlantsToTargetProduct as jest.Mock).mockResolvedValue({
      sourcePlantIds: [],
      sourceProductPlantIds: [],
      copiedPlantIds: [],
      copiedProductPlantIds: [],
      skippedSourcePlantIds: [sourcePlantId],
      skippedProductPlantIds: [9001],
      manufacturingUnitsSkipped: ['Mumbai'],
    });

    const result = await service.execute(
      {
        sourceUrnNo: 'URN-SOURCE',
        pairs: [
          {
            sourceEoiNo: 'GP100',
            targetUrnNo: 'URN-TARGET',
            targetEoiNo: 'GP001',
          },
        ],
      },
      adminUserId,
    );

    expect(plantMergeAuditModel.create).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          manufacturingUnitsSkipped: ['Mumbai'],
          copiedPlantIds: [],
        }),
      ],
      expect.any(Object),
    );
    expect(result.results[0]?.plantsCopied).toBe(0);
    expect(result.results[0]?.plantsSkipped).toBe(1);
    expect(result.results[0]?.skippedPlantNames).toEqual(['Mumbai']);
  });

  it('re-validates pairs inside the transaction before copying', async () => {
    plantMergeUrnValidationService.validate
      .mockResolvedValueOnce({
        success: true,
        canMerge: true,
        blockers: [],
      })
      .mockResolvedValueOnce({
        success: true,
        canMerge: false,
        blockers: [{ code: 'DUPLICATE_MERGE', message: 'Already merged' }],
      });

    await expect(
      service.execute(
        {
          sourceUrnNo: 'URN-SOURCE',
          pairs: [
            {
              sourceEoiNo: 'GP100',
              targetUrnNo: 'URN-TARGET',
              targetEoiNo: 'GP001',
            },
          ],
        },
        adminUserId,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(copyActivePlantsToTargetProduct).not.toHaveBeenCalled();
  });

  it('propagates failure and does not commit when a later pair fails in the transaction', async () => {
    const secondSourceProductId = new Types.ObjectId();
    const secondSourceProduct = {
      ...sourceProduct,
      _id: secondSourceProductId,
      eoiNo: 'GP102',
      productName: 'Panel',
    };

    productModel.findOne.mockReset();
    productModel.findOne
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(sourceProduct),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(targetProduct),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(secondSourceProduct),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(targetProduct),
      });

    plantMergeAuditModel.create
      .mockResolvedValueOnce([{ _id: new Types.ObjectId() }])
      .mockRejectedValueOnce(new Error('audit write failed'));

    await expect(
      service.execute(
        {
          sourceUrnNo: 'URN-SOURCE',
          pairs: [
            {
              sourceEoiNo: 'GP100',
              targetUrnNo: 'URN-TARGET',
              targetEoiNo: 'GP001',
            },
            {
              sourceEoiNo: 'GP102',
              targetUrnNo: 'URN-TARGET',
              targetEoiNo: 'GP001',
            },
          ],
        },
        adminUserId,
      ),
    ).rejects.toThrow('audit write failed');

    expect(copyActivePlantsToTargetProduct).toHaveBeenCalledTimes(2);
    expect(plantMergeAuditModel.create).toHaveBeenCalledTimes(2);
    expect(runInTransactionIfSupported).toHaveBeenCalled();
  });
});
