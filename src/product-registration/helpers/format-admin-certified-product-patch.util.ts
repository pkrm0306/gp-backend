import { resolveStoredUploadUrl } from '../../utils/upload-file.util';

/** Normalize valid-till from DB / Mongoose for admin PATCH responses. */
export function normalizeValidTillForApiResponse(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  const text = String(value).trim();
  if (!text) return null;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? text : parsed.toISOString();
}

export type AdminCertifiedProductPatchResponse = {
  _id: string | undefined;
  productMongoId: string | undefined;
  productName: unknown;
  productDetails: unknown;
  urnNo: unknown;
  eoiNo: unknown;
  categoryId: string | undefined;
  productImage: string | null;
  productImageUrl: string | null;
  productStatus: number;
  validtillDate: string | null;
  validTill: string | null;
  validTillDate: string | null;
  valid_till_date: string | null;
  updatedDate: unknown;
};

/** Flat PATCH payload aligned with admin list EOI rows (includes valid-till aliases). */
export function formatAdminCertifiedProductPatchResponse(
  product: Record<string, unknown>,
  toMongoIdString: (value: unknown) => string | undefined,
): AdminCertifiedProductPatchResponse {
  const mongoId = toMongoIdString(product._id);
  const validTillIso = normalizeValidTillForApiResponse(
    product.validtillDate ?? product.validTillDate ?? product.valid_till_date,
  );
  const productImageRaw = product.productImage ?? product.product_image;
  const productImage =
    productImageRaw != null && String(productImageRaw).trim() !== ''
      ? resolveStoredUploadUrl(String(productImageRaw).trim()) || null
      : null;

  return {
    _id: mongoId,
    productMongoId: mongoId,
    productName: product.productName ?? null,
    productDetails: product.productDetails ?? null,
    urnNo: product.urnNo ?? null,
    eoiNo: product.eoiNo ?? null,
    categoryId: toMongoIdString(product.categoryId),
    productImage,
    productImageUrl: productImage,
    productStatus: Number(product.productStatus ?? 0),
    validtillDate: validTillIso,
    validTill: validTillIso,
    validTillDate: validTillIso,
    valid_till_date: validTillIso,
    updatedDate: product.updatedDate ?? null,
  };
}
