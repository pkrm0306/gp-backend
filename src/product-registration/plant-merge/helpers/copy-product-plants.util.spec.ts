import { Types } from 'mongoose';
import { copyActivePlantsToTargetProduct } from './copy-product-plants.util';

describe('copyActivePlantsToTargetProduct', () => {
  const sourceProductId = new Types.ObjectId();
  const targetProductId = new Types.ObjectId();
  const vendorId = new Types.ObjectId();
  const categoryId = new Types.ObjectId();
  const manufacturerId = new Types.ObjectId();
  const now = new Date('2024-06-01');

  const targetProduct = {
    _id: targetProductId,
    urnNo: 'URN-TARGET',
    eoiNo: 'GP001',
    vendorId,
    categoryId,
    manufacturerId,
  };

  const sequenceHelper = {
    reserveSequenceValues: jest.fn(),
  };

  function buildProductPlantModel(options: {
    sourcePlants?: Array<Record<string, unknown>>;
    targetPlants?: Array<Record<string, unknown>>;
  }) {
    const sourcePlants = options.sourcePlants ?? [];
    const targetPlants = options.targetPlants ?? [];

    return {
      find: jest.fn((filter: { productId?: Types.ObjectId }) => {
        const rows =
          String(filter.productId) === String(sourceProductId)
            ? sourcePlants
            : targetPlants;
        return {
          sort: jest.fn().mockReturnThis(),
          lean: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(rows),
        };
      }),
      create: jest.fn(async (rows: Array<Record<string, unknown>>) => [
        { _id: new Types.ObjectId(), ...rows[0] },
      ]),
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
    sequenceHelper.reserveSequenceValues.mockResolvedValue([9001, 9002, 9003]);
  });

  it('copies multiple source plants to the target product', async () => {
    const plantA = new Types.ObjectId();
    const plantB = new Types.ObjectId();
    const plantC = new Types.ObjectId();

    const productPlantModel = buildProductPlantModel({
      sourcePlants: [
        {
          _id: plantA,
          productPlantId: 1,
          plantName: 'Mumbai',
          plantLocation: 'Andheri',
          city: 'Mumbai',
        },
        {
          _id: plantB,
          productPlantId: 2,
          plantName: 'Pune',
          plantLocation: 'Hinjewadi',
          city: 'Pune',
        },
        {
          _id: plantC,
          productPlantId: 3,
          plantName: 'Delhi',
          plantLocation: 'Noida',
          city: 'Delhi',
        },
      ],
    });

    const result = await copyActivePlantsToTargetProduct(
      productPlantModel as never,
      sequenceHelper as never,
      sourceProductId,
      targetProduct,
      now,
    );

    expect(sequenceHelper.reserveSequenceValues).toHaveBeenCalledWith(
      'product_plant_id',
      3,
    );
    expect(productPlantModel.create).toHaveBeenCalledTimes(3);
    expect(result.copiedPlantIds).toHaveLength(3);
    expect(result.sourcePlantIds).toEqual([plantA, plantB, plantC]);
    expect(result.manufacturingUnitsSkipped).toEqual([]);
  });

  it('skips duplicate plants already present on the target', async () => {
    const sourcePlantA = new Types.ObjectId();
    const sourcePlantB = new Types.ObjectId();

    const productPlantModel = buildProductPlantModel({
      sourcePlants: [
        {
          _id: sourcePlantA,
          productPlantId: 10,
          plantName: 'Mumbai',
          plantLocation: 'Andheri',
          city: 'Mumbai',
        },
        {
          _id: sourcePlantB,
          productPlantId: 11,
          plantName: 'Pune',
          plantLocation: 'Hinjewadi',
          city: 'Pune',
        },
      ],
      targetPlants: [
        {
          _id: new Types.ObjectId(),
          plantName: 'Mumbai',
          plantLocation: 'Andheri',
          city: 'Mumbai',
        },
      ],
    });

    const result = await copyActivePlantsToTargetProduct(
      productPlantModel as never,
      sequenceHelper as never,
      sourceProductId,
      targetProduct,
      now,
    );

    expect(sequenceHelper.reserveSequenceValues).toHaveBeenCalledWith(
      'product_plant_id',
      1,
    );
    expect(productPlantModel.create).toHaveBeenCalledTimes(1);
    expect(result.copiedPlantIds).toHaveLength(1);
    expect(result.skippedSourcePlantIds).toEqual([sourcePlantA]);
    expect(result.manufacturingUnitsSkipped).toEqual(['Mumbai']);
    expect(result.sourcePlantIds).toEqual([sourcePlantB]);
  });

  it('returns empty copy result when source has no active plants', async () => {
    const productPlantModel = buildProductPlantModel({ sourcePlants: [] });

    const result = await copyActivePlantsToTargetProduct(
      productPlantModel as never,
      sequenceHelper as never,
      sourceProductId,
      targetProduct,
      now,
    );

    expect(sequenceHelper.reserveSequenceValues).not.toHaveBeenCalled();
    expect(productPlantModel.create).not.toHaveBeenCalled();
    expect(result.copiedPlantIds).toEqual([]);
    expect(result.manufacturingUnitsSkipped).toEqual([]);
  });

  it('skips all plants when every source plant already exists on target', async () => {
    const sourcePlant = new Types.ObjectId();

    const productPlantModel = buildProductPlantModel({
      sourcePlants: [
        {
          _id: sourcePlant,
          productPlantId: 20,
          plantName: 'Chennai',
          plantLocation: 'OMR',
          city: 'Chennai',
        },
      ],
      targetPlants: [
        {
          _id: new Types.ObjectId(),
          plantName: 'Chennai',
          plantLocation: 'OMR',
          city: 'Chennai',
        },
      ],
    });

    const result = await copyActivePlantsToTargetProduct(
      productPlantModel as never,
      sequenceHelper as never,
      sourceProductId,
      targetProduct,
      now,
    );

    expect(sequenceHelper.reserveSequenceValues).not.toHaveBeenCalled();
    expect(productPlantModel.create).not.toHaveBeenCalled();
    expect(result.copiedPlantIds).toEqual([]);
    expect(result.skippedSourcePlantIds).toEqual([sourcePlant]);
    expect(result.manufacturingUnitsSkipped).toEqual(['Chennai']);
  });
});
