import { Model, Types } from 'mongoose';
import { matchActiveProducts } from '../constants/active-product.filter';
import { ProductDocument } from '../schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../schemas/product-plant.schema';

const CERTIFIED_PRODUCT_STATUS = 2;

type CertifiedProductCountRow = {
  _id: Types.ObjectId;
  manufacturerId: Types.ObjectId;
  vendorId: Types.ObjectId;
  plantCount?: number;
};

export function matchCertifiedProductsForManufacturerBatch(
  manufacturerIds: Types.ObjectId[],
): Record<string, unknown> {
  const now = new Date();
  return matchActiveProducts({
    productStatus: CERTIFIED_PRODUCT_STATUS,
    $and: [
      {
        $or: [
          { manufacturerId: { $in: manufacturerIds } },
          { vendorId: { $in: manufacturerIds } },
        ],
      },
      {
        $or: [
          { validtillDate: null },
          { validtillDate: { $exists: false } },
          { validtillDate: { $gte: now } },
        ],
      },
    ],
  });
}

/** Mirrors `resolveEffectivePlantsForCertificates` length without loading plants. */
export function effectivePlantCertificatePageCount(
  declaredPlantCount: number,
  plantsInDb: number,
): number {
  const declared = Number(declaredPlantCount ?? 0);
  return Math.max(plantsInDb, declared > 0 ? declared : 0, 1);
}

function resolveBatchManufacturerOwnerKey(
  product: {
    manufacturerId?: Types.ObjectId | string | null;
    vendorId?: Types.ObjectId | string | null;
  },
  manufacturerIdSet: Set<string>,
): string | null {
  const manufacturerId = String(product.manufacturerId ?? '').trim();
  if (manufacturerId && manufacturerIdSet.has(manufacturerId)) {
    return manufacturerId;
  }
  const vendorId = String(product.vendorId ?? '').trim();
  if (vendorId && manufacturerIdSet.has(vendorId)) {
    return vendorId;
  }
  return null;
}

async function countProductPlantsGroupedByProductId(
  productPlantModel: Model<ProductPlantDocument>,
  productIds: Types.ObjectId[],
): Promise<Map<string, number>> {
  const grouped = new Map<string, number>();
  if (!productIds.length) {
    return grouped;
  }

  const rows = await productPlantModel
    .aggregate<{ _id: unknown; count: number }>([
      {
        $match: {
          $or: [
            { productId: { $in: productIds } },
            { productId: { $in: productIds.map((id) => String(id)) } },
          ],
        },
      },
      { $group: { _id: '$productId', count: { $sum: 1 } } },
    ])
    .exec();

  for (const row of rows) {
    grouped.set(String(row._id ?? ''), row.count);
  }
  return grouped;
}

/**
 * Lightweight batch count for admin manufacturer lists — same plant-page rules as
 * bulk certificate download without hydrating products or generating PDFs.
 */
export async function countCertifiedPlantCertificatesByManufacturerIds(
  productModel: Model<ProductDocument>,
  productPlantModel: Model<ProductPlantDocument>,
  manufacturerIds: Types.ObjectId[],
): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  if (!manufacturerIds.length) {
    return out;
  }

  const idSet = new Set(manufacturerIds.map((id) => id.toString()));
  for (const id of manufacturerIds) {
    out.set(id.toString(), 0);
  }

  const products = await productModel
    .find(matchCertifiedProductsForManufacturerBatch(manufacturerIds))
    .select('_id manufacturerId vendorId plantCount')
    .lean<CertifiedProductCountRow[]>()
    .exec();

  if (!products.length) {
    return out;
  }

  const productIds = products.map((product) => product._id as Types.ObjectId);
  const plantCountByProductId = await countProductPlantsGroupedByProductId(
    productPlantModel,
    productIds,
  );

  for (const product of products) {
    const ownerKey = resolveBatchManufacturerOwnerKey(product, idSet);
    if (!ownerKey) continue;

    const productId = String(product._id);
    const plantsInDb = plantCountByProductId.get(productId) ?? 0;
    const pageCount = effectivePlantCertificatePageCount(
      Number(product.plantCount ?? 0),
      plantsInDb,
    );

    out.set(ownerKey, (out.get(ownerKey) ?? 0) + pageCount);
  }

  return out;
}
