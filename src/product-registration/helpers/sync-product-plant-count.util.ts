import { Model, Types, ClientSession } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../schemas/product-plant.schema';
import { matchActiveProductPlants } from '../constants/active-product.filter';

export async function countActivePlantsForProduct(
  productPlantModel: Model<ProductPlantDocument>,
  productObjectId: Types.ObjectId,
  session?: ClientSession,
): Promise<number> {
  const sessionOpts = session ? { session } : {};
  return productPlantModel.countDocuments(
    matchActiveProductPlants({ productId: productObjectId }),
    sessionOpts,
  );
}

export async function syncProductPlantCount(
  productModel: Model<ProductDocument>,
  productPlantModel: Model<ProductPlantDocument>,
  productObjectId: Types.ObjectId,
  updatedDate: Date,
  session?: ClientSession,
): Promise<number> {
  const plantCount = await countActivePlantsForProduct(
    productPlantModel,
    productObjectId,
    session,
  );
  const sessionOpts = session ? { session } : {};
  await productModel.updateOne(
    { _id: productObjectId },
    { $set: { plantCount, updatedDate } },
    sessionOpts,
  );
  return plantCount;
}
