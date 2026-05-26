import { Model, Types } from 'mongoose';

/**
 * One logical record per URN (green supply, utilization, prohibited flame text rows).
 * Removes duplicate rows from legacy append saves, then inserts at most one new row.
 */
export async function replaceSingleRecordForUrn<T>(
  model: Model<T>,
  urnNo: string,
  vendorObjectId: Types.ObjectId,
  insertDoc: Record<string, unknown> | null,
): Promise<T | null> {
  await model.deleteMany({
    urnNo: urnNo.trim(),
    vendorId: vendorObjectId,
  });
  if (!insertDoc) {
    return null;
  }
  const created = await model.create(insertDoc);
  return created as T;
}
