/**
 * EOI format: GP + manufacturerInitial + 3-digit internalId + 3-digit sequence.
 * Example: GPPMI003004 → sequence suffix 004.
 */
const EOI_SEQUENCE_SUFFIX_LENGTH = 3;

/** Extract manufacturer-wise sequence number from the last 3 characters of eoiNo. */
export function parseEoiSequenceSuffix(eoiNo: string | null | undefined): number | null {
  if (!eoiNo || typeof eoiNo !== 'string') {
    return null;
  }
  const trimmed = eoiNo.trim();
  if (trimmed.length < EOI_SEQUENCE_SUFFIX_LENGTH) {
    return null;
  }
  const suffix = trimmed.slice(-EOI_SEQUENCE_SUFFIX_LENGTH);
  if (!/^\d{3}$/.test(suffix)) {
    return null;
  }
  const value = parseInt(suffix, 10);
  return Number.isFinite(value) && value >= 1 ? value : null;
}

/** Sort key for active EOIs: sequence suffix, then createdDate, then productId. */
export function compareProductsForResequence(
  a: { eoiNo: string; createdDate?: Date; productId?: number },
  b: { eoiNo: string; createdDate?: Date; productId?: number },
): number {
  const seqA = parseEoiSequenceSuffix(a.eoiNo);
  const seqB = parseEoiSequenceSuffix(b.eoiNo);

  if (seqA != null && seqB != null && seqA !== seqB) {
    return seqA - seqB;
  }
  if (seqA != null && seqB == null) {
    return -1;
  }
  if (seqA == null && seqB != null) {
    return 1;
  }

  const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
  const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
  if (dateA !== dateB) {
    return dateA - dateB;
  }

  return (a.productId ?? 0) - (b.productId ?? 0);
}

/** Detect duplicate sequence suffixes among active products (corruption recovery signal). */
export function findDuplicateEoiSequenceSuffixes(
  products: Array<{ eoiNo: string; _id?: unknown }>,
): number[] {
  const seen = new Map<number, number>();
  const duplicates: number[] = [];

  for (const product of products) {
    const suffix = parseEoiSequenceSuffix(product.eoiNo);
    if (suffix == null) {
      continue;
    }
    const count = (seen.get(suffix) ?? 0) + 1;
    seen.set(suffix, count);
    if (count === 2) {
      duplicates.push(suffix);
    }
  }

  return duplicates;
}
