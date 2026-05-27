import { Types } from 'mongoose';

export type ParsedProductsToBeCertified = {
  productIds: number[];
  mongoIds: Types.ObjectId[];
};

const PRODUCT_IDS_REQUIRED_MESSAGE =
  'productsToBeCertified must be a JSON array of numeric productId values (e.g. "[101,102]"). Product names are not accepted.';

/**
 * Parse payment `productsToBeCertified` — **numeric productId only** (JSON array or comma-separated).
 * Optional MongoDB `_id` strings are resolved to productId when certifying.
 */
export function parseProductsToBeCertified(
  raw?: string | null,
): ParsedProductsToBeCertified {
  const productIds: number[] = [];
  const mongoIds: Types.ObjectId[] = [];

  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return { productIds, mongoIds };
  }

  const trimmed = String(raw).trim();
  let items: unknown[] = [];

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      items = parsed;
    } else if (typeof parsed === 'number' || typeof parsed === 'string') {
      items = [parsed];
    }
  } catch {
    items = trimmed.split(',').map((part) => part.trim());
  }

  for (const item of items) {
    if (item === null || item === undefined || item === '') {
      continue;
    }
    if (typeof item === 'number' && Number.isFinite(item) && item > 0) {
      productIds.push(Math.trunc(item));
      continue;
    }
    const asString = String(item).trim();
    if (!asString) {
      continue;
    }
    if (
      Types.ObjectId.isValid(asString) &&
      String(new Types.ObjectId(asString)) === asString
    ) {
      mongoIds.push(new Types.ObjectId(asString));
      continue;
    }
    const asNum = Number(asString);
    if (Number.isFinite(asNum) && asNum > 0) {
      productIds.push(Math.trunc(asNum));
    }
  }

  return {
    productIds: [...new Set(productIds)],
    mongoIds: [...new Map(mongoIds.map((id) => [id.toString(), id])).values()],
  };
}

export function hasProductsToBeCertified(
  parsed: ParsedProductsToBeCertified,
): boolean {
  return parsed.productIds.length > 0 || parsed.mongoIds.length > 0;
}

/** Canonical storage format for `payment_details.productsToBeCertified`. */
export function formatProductsToBeCertified(productIds: number[]): string {
  const ids = [
    ...new Set(
      productIds
        .map((id) => Math.trunc(Number(id)))
        .filter((id) => Number.isFinite(id) && id > 0),
    ),
  ];
  return JSON.stringify(ids);
}

export function getProductsToBeCertifiedValidationError(
  raw?: string | null,
): string | null {
  if (!String(raw ?? '').trim()) {
    return 'productsToBeCertified is required for certification payments';
  }
  if (!hasProductsToBeCertified(parseProductsToBeCertified(raw))) {
    return PRODUCT_IDS_REQUIRED_MESSAGE;
  }
  return null;
}

/**
 * Validate and return canonical JSON array string of numeric productIds for DB storage.
 */
export function normalizeProductsToBeCertifiedStorage(
  raw: string,
): string {
  const message = getProductsToBeCertifiedValidationError(raw);
  if (message) {
    throw new Error(message);
  }
  const { productIds } = parseProductsToBeCertified(raw);
  return formatProductsToBeCertified(productIds);
}

export type UrnProductCertifyCandidate = {
  productId: number;
  _id?: Types.ObjectId;
};

/**
 * Resolve numeric `productId` list from stored payment field (IDs + optional Mongo `_id`s only).
 */
export function resolveProductIdsFromCertifiedField(
  raw: string | null | undefined,
  urnProducts: UrnProductCertifyCandidate[],
): number[] {
  const parsed = parseProductsToBeCertified(raw);
  const selected = new Set<number>(parsed.productIds);

  for (const oid of parsed.mongoIds) {
    const row = urnProducts.find((p) => String(p._id) === String(oid));
    if (row?.productId != null) {
      selected.add(row.productId);
    }
  }

  return [...selected];
}
