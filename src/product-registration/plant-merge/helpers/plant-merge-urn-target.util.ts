import { Types } from 'mongoose';
import { normalizeTrimmedValue } from '../../helpers/merge-eligibility.shared';

export type PlantMergeSourceProductRow = {
  _id: Types.ObjectId;
  productId: number;
  productName: string;
  eoiNo: string;
  urnNo: string;
  categoryId: Types.ObjectId;
  manufacturerId: Types.ObjectId;
  productStatus: number;
  certifiedDate?: Date;
  createdDate: Date;
};

export type PlantMergeTargetProductRow = {
  _id?: Types.ObjectId;
  urnNo: string;
  eoiNo: string;
  productName: string;
  manufacturerId: Types.ObjectId;
  categoryId: Types.ObjectId;
  productStatus?: number;
  certifiedDate?: Date;
  createdDate: Date;
};

export function exactProductNameKey(productName: string | undefined): string {
  return normalizeTrimmedValue(String(productName ?? ''));
}

/** @deprecated Use exactProductNameKey — kept for tests migrating from case-insensitive keys */
export function normalizeProductNameKey(productName: string | undefined): string {
  return exactProductNameKey(productName);
}

export function buildCertifiedProductMatchKey(product: {
  productName?: string;
  manufacturerId: Types.ObjectId;
  categoryId: Types.ObjectId;
}): string {
  return [
    exactProductNameKey(product.productName),
    String(product.manufacturerId),
    String(product.categoryId),
  ].join('|');
}

export function compareCertifiedProductAge(
  left: Pick<PlantMergeTargetProductRow, 'certifiedDate' | 'createdDate'>,
  right: Pick<PlantMergeTargetProductRow, 'certifiedDate' | 'createdDate'>,
): number {
  const leftCertified = left.certifiedDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const rightCertified = right.certifiedDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
  if (leftCertified !== rightCertified) {
    return leftCertified - rightCertified;
  }

  const leftCreated = left.createdDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const rightCreated = right.createdDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return leftCreated - rightCreated;
}

export function isTargetOlderThanSource(
  target: Pick<PlantMergeTargetProductRow, 'certifiedDate' | 'createdDate'>,
  source: Pick<PlantMergeSourceProductRow, 'certifiedDate' | 'createdDate'>,
): boolean {
  return compareCertifiedProductAge(target, source) < 0;
}

export function findOldestMatchingCertifiedTarget(
  source: PlantMergeSourceProductRow,
  candidates: PlantMergeTargetProductRow[],
  excludeUrnNo: string,
): PlantMergeTargetProductRow | null {
  const sourceKey = buildCertifiedProductMatchKey(source);
  const excludedUrn = normalizeTrimmedValue(excludeUrnNo);

  const matches = candidates.filter((candidate) => {
    if (normalizeTrimmedValue(candidate.urnNo) === excludedUrn) {
      return false;
    }
    if (buildCertifiedProductMatchKey(candidate) !== sourceKey) {
      return false;
    }
    return isTargetOlderThanSource(candidate, source);
  });

  if (matches.length === 0) {
    return null;
  }

  return [...matches].sort(compareCertifiedProductAge)[0] ?? null;
}

/** True when a same-name match exists on another URN but none is older than the source. */
export function hasNewerMatchingCertifiedCandidate(
  source: PlantMergeSourceProductRow,
  candidates: PlantMergeTargetProductRow[],
  excludeUrnNo: string,
): boolean {
  const sourceKey = buildCertifiedProductMatchKey(source);
  const excludedUrn = normalizeTrimmedValue(excludeUrnNo);

  return candidates.some((candidate) => {
    if (normalizeTrimmedValue(candidate.urnNo) === excludedUrn) {
      return false;
    }
    if (buildCertifiedProductMatchKey(candidate) !== sourceKey) {
      return false;
    }
    return !isTargetOlderThanSource(candidate, source);
  });
}
