import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { matchActiveProducts } from '../../constants/active-product.filter';

export const PLANT_MERGE_URN_VALIDATION_PRODUCT_SELECT =
  '_id productName eoiNo urnNo productStatus categoryId manufacturerId certifiedDate createdDate';

export const PLANT_MERGE_URN_EXECUTE_PRODUCT_SELECT =
  '_id productId productName eoiNo urnNo vendorId categoryId manufacturerId';

export async function findActiveProductOnUrn<T>(
  productModel: Model<ProductDocument>,
  urnNo: string,
  eoiNo: string,
  select: string,
): Promise<T | null> {
  const row = await productModel
    .findOne(matchActiveProducts({ urnNo, eoiNo }))
    .select(select)
    .lean()
    .exec();

  return row as T | null;
}
