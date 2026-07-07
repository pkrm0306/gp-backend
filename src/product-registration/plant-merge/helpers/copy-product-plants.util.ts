import { ClientSession, Model, Types } from 'mongoose';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../../schemas/product-plant.schema';
import { matchActiveProductPlants } from '../../constants/active-product.filter';
import { SequenceHelper } from '../../helpers/sequence.helper';
import { buildPlantIdentityKey } from './plant-merge-eligibility.util';

export type CopyProductPlantsTarget = {
  _id: Types.ObjectId;
  urnNo: string;
  eoiNo: string;
  vendorId: Types.ObjectId;
  categoryId: Types.ObjectId;
  manufacturerId: Types.ObjectId;
};

export type CopyProductPlantsResult = {
  sourcePlantIds: Types.ObjectId[];
  sourceProductPlantIds: number[];
  copiedPlantIds: Types.ObjectId[];
  copiedProductPlantIds: number[];
  skippedSourcePlantIds: Types.ObjectId[];
  skippedProductPlantIds: number[];
  manufacturingUnitsSkipped: string[];
};

/**
 * Copies active manufacturing plants from a source product onto a target product.
 * Plants already present on the target (same name + location) are skipped.
 * Source plants are left unchanged.
 */
export async function copyActivePlantsToTargetProduct(
  productPlantModel: Model<ProductPlantDocument>,
  sequenceHelper: SequenceHelper,
  sourceProductId: Types.ObjectId,
  targetProduct: CopyProductPlantsTarget,
  now: Date,
  session?: ClientSession,
): Promise<CopyProductPlantsResult> {
  const sessionOpts = session ? { session } : {};

  const sourcePlants = await productPlantModel
    .find(matchActiveProductPlants({ productId: sourceProductId }))
    .sort({ createdDate: 1 })
    .lean()
    .exec();

  const targetPlants = await productPlantModel
    .find(matchActiveProductPlants({ productId: targetProduct._id }))
    .lean()
    .exec();

  const targetIdentityKeys = new Set(
    targetPlants.map((plant) =>
      buildPlantIdentityKey({
        plantName: plant.plantName,
        plantLocation: plant.plantLocation,
        city: plant.city,
      }),
    ),
  );

  const sourcePlantIds: Types.ObjectId[] = [];
  const sourceProductPlantIds: number[] = [];
  const copiedPlantIds: Types.ObjectId[] = [];
  const copiedProductPlantIds: number[] = [];
  const skippedSourcePlantIds: Types.ObjectId[] = [];
  const skippedProductPlantIds: number[] = [];
  const manufacturingUnitsSkipped: string[] = [];

  const plantsToCopy: (ProductPlant & { _id: Types.ObjectId })[] = [];

  for (const sourcePlant of sourcePlants as (ProductPlant & { _id: Types.ObjectId })[]) {
    const identityKey = buildPlantIdentityKey({
      plantName: sourcePlant.plantName,
      plantLocation: sourcePlant.plantLocation,
      city: sourcePlant.city,
    });

    if (targetIdentityKeys.has(identityKey)) {
      skippedSourcePlantIds.push(sourcePlant._id);
      skippedProductPlantIds.push(Number(sourcePlant.productPlantId ?? 0));
      manufacturingUnitsSkipped.push(String(sourcePlant.plantName ?? '').trim());
      continue;
    }

    targetIdentityKeys.add(identityKey);
    plantsToCopy.push(sourcePlant);
  }

  if (plantsToCopy.length === 0) {
    return {
      sourcePlantIds,
      sourceProductPlantIds,
      copiedPlantIds,
      copiedProductPlantIds,
      skippedSourcePlantIds,
      skippedProductPlantIds,
      manufacturingUnitsSkipped,
    };
  }

  const productPlantIds = await sequenceHelper.reserveSequenceValues(
    'product_plant_id',
    plantsToCopy.length,
  );

  for (let index = 0; index < plantsToCopy.length; index += 1) {
    const sourcePlant = plantsToCopy[index];
    const productPlantId = productPlantIds[index];

    const created = await productPlantModel.create(
      [
        {
          productPlantId,
          productId: targetProduct._id,
          vendorId: targetProduct.vendorId,
          categoryId: targetProduct.categoryId,
          manufacturerId: targetProduct.manufacturerId,
          countryId: sourcePlant.countryId,
          stateId: sourcePlant.stateId,
          urnNo: targetProduct.urnNo,
          eoiNo: targetProduct.eoiNo,
          plantName: sourcePlant.plantName,
          plantLocation: sourcePlant.plantLocation,
          city: sourcePlant.city,
          plantStatus: sourcePlant.plantStatus ?? 1,
          createdDate: now,
        },
      ],
      sessionOpts,
    );

    sourcePlantIds.push(sourcePlant._id);
    sourceProductPlantIds.push(Number(sourcePlant.productPlantId ?? 0));
    copiedPlantIds.push(created[0]._id as Types.ObjectId);
    copiedProductPlantIds.push(productPlantId);
  }

  return {
    sourcePlantIds,
    sourceProductPlantIds,
    copiedPlantIds,
    copiedProductPlantIds,
    skippedSourcePlantIds,
    skippedProductPlantIds,
    manufacturingUnitsSkipped,
  };
}
