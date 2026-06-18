import { Types } from 'mongoose';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../../product-design/schemas/all-product-document.schema';
import { Model } from 'mongoose';

export function buildAllProductDocumentLookupFilter(
  documentIdParam: string,
): Record<string, unknown> | null {
  const raw = String(documentIdParam ?? '').trim();
  if (!raw) {
    return null;
  }

  const or: Record<string, unknown>[] = [];

  if (/^\d+$/.test(raw)) {
    or.push({ productDocumentId: Number(raw) });
  }

  if (/^[a-fA-F0-9]{24}$/.test(raw) && Types.ObjectId.isValid(raw)) {
    or.push({ _id: new Types.ObjectId(raw) });
  }

  if (or.length === 0) {
    return null;
  }

  return or.length === 1 ? or[0] : { $or: or };
}

export async function findAllProductDocumentByIdParam(
  model: Model<AllProductDocumentDocument>,
  documentIdParam: string,
): Promise<AllProductDocument | null> {
  const filter = buildAllProductDocumentLookupFilter(documentIdParam);
  if (!filter) {
    return null;
  }
  return model.findOne(filter).lean<AllProductDocument>().exec();
}
