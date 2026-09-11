import { productDocumentIdsSupersededByLaterVersions } from './superseded-live-documents.util';

describe('productDocumentIdsSupersededByLaterVersions', () => {
  it('returns empty when fewer than two versioned uploads', () => {
    expect(
      productDocumentIdsSupersededByLaterVersions([
        { versionNo: 1, productDocumentId: 10 },
      ]),
    ).toEqual(new Set());
  });

  it('marks older version productDocumentIds as superseded after replace', () => {
    expect(
      productDocumentIdsSupersededByLaterVersions([
        { versionNo: 1, productDocumentId: 10 },
        { versionNo: 2, productDocumentId: 20 },
      ]),
    ).toEqual(new Set([10]));
  });

  it('keeps only non-latest ids when multiple older versions exist', () => {
    expect(
      productDocumentIdsSupersededByLaterVersions([
        { versionNo: 3, productDocumentId: 30 },
        { versionNo: 1, productDocumentId: 10 },
        { versionNo: 2, productDocumentId: 20 },
      ]),
    ).toEqual(new Set([10, 20]));
  });
});
