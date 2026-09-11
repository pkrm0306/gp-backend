/**
 * Live productDocumentIds that belong to older history versions and should leave
 * the current list after a later upload (reject → re-upload / replace).
 */
export function productDocumentIdsSupersededByLaterVersions(
  versions: Array<{
    versionNo?: number | null;
    productDocumentId?: number | null;
  }>,
): Set<number> {
  const sorted = versions
    .map((v) => ({
      versionNo: Number(v.versionNo),
      productDocumentId: Number(v.productDocumentId),
    }))
    .filter(
      (v) =>
        Number.isFinite(v.versionNo) &&
        v.versionNo > 0 &&
        Number.isFinite(v.productDocumentId) &&
        v.productDocumentId > 0,
    )
    .sort((a, b) => a.versionNo - b.versionNo);

  if (sorted.length < 2) return new Set();

  const latestNo = sorted[sorted.length - 1].versionNo;
  const superseded = new Set<number>();
  for (const v of sorted) {
    if (v.versionNo < latestNo) {
      superseded.add(v.productDocumentId);
    }
  }
  return superseded;
}
