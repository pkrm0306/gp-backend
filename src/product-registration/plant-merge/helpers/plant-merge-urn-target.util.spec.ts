import { Types } from 'mongoose';
import {
  compareCertifiedProductAge,
  findOldestMatchingCertifiedTarget,
  hasNewerMatchingCertifiedCandidate,
  normalizeProductNameKey,
} from './plant-merge-urn-target.util';

describe('plant-merge-urn-target.util', () => {
  const manufacturerId = new Types.ObjectId();
  const categoryId = new Types.ObjectId();

  it('normalizes product name by trimming whitespace', () => {
    expect(normalizeProductNameKey('  Cement Board  ')).toBe('Cement Board');
  });

  it('picks the oldest certified product on a different URN', () => {
    const source = {
      _id: new Types.ObjectId(),
      productId: 1,
      productName: 'Cement Board',
      eoiNo: 'GP001',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: 2,
      certifiedDate: new Date('2024-06-01'),
      createdDate: new Date('2024-01-01'),
    };

    const target = findOldestMatchingCertifiedTarget(
      source,
      [
        {
          urnNo: 'URN-NEWER',
          eoiNo: 'GP010',
          productName: 'Cement Board',
          manufacturerId,
          categoryId,
          certifiedDate: new Date('2024-05-01'),
          createdDate: new Date('2024-02-01'),
        },
        {
          urnNo: 'URN-OLDEST',
          eoiNo: 'GP002',
          productName: 'Cement Board',
          manufacturerId,
          categoryId,
          certifiedDate: new Date('2023-01-01'),
          createdDate: new Date('2023-01-01'),
        },
      ],
      'URN-SOURCE',
    );

    expect(target?.urnNo).toBe('URN-OLDEST');
    expect(target?.eoiNo).toBe('GP002');
  });

  it('ignores targets that are not older than source', () => {
    const source = {
      _id: new Types.ObjectId(),
      productId: 1,
      productName: 'Tile',
      eoiNo: 'GP001',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: 2,
      certifiedDate: new Date('2020-01-01'),
      createdDate: new Date('2020-01-01'),
    };

    const target = findOldestMatchingCertifiedTarget(
      source,
      [
        {
          urnNo: 'URN-NEWER',
          eoiNo: 'GP099',
          productName: 'Tile',
          manufacturerId,
          categoryId,
          certifiedDate: new Date('2024-01-01'),
          createdDate: new Date('2024-01-01'),
        },
      ],
      'URN-SOURCE',
    );

    expect(target).toBeNull();
  });

  it('ignores products on the source URN', () => {
    const source = {
      _id: new Types.ObjectId(),
      productId: 1,
      productName: 'Tile',
      eoiNo: 'GP001',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: 2,
      createdDate: new Date('2024-01-01'),
    };

    const target = findOldestMatchingCertifiedTarget(
      source,
      [
        {
          urnNo: 'URN-SOURCE',
          eoiNo: 'GP099',
          productName: 'Tile',
          manufacturerId,
          categoryId,
          createdDate: new Date('2020-01-01'),
        },
      ],
      'URN-SOURCE',
    );

    expect(target).toBeNull();
  });

  it('sorts by createdDate when certifiedDate is missing', () => {
    expect(
      compareCertifiedProductAge(
        { createdDate: new Date('2020-01-01') },
        { createdDate: new Date('2021-01-01') },
      ),
    ).toBeLessThan(0);
  });

  it('returns null for brand-new source when only newer certified matches exist', () => {
    const source = {
      _id: new Types.ObjectId(),
      productId: 1,
      productName: 'New Product',
      eoiNo: 'GP001',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: 2,
      certifiedDate: new Date('2025-01-01'),
      createdDate: new Date('2025-01-01'),
    };

    const target = findOldestMatchingCertifiedTarget(
      source,
      [
        {
          urnNo: 'URN-OTHER',
          eoiNo: 'GP050',
          productName: 'New Product',
          manufacturerId,
          categoryId,
          certifiedDate: new Date('2025-06-01'),
          createdDate: new Date('2025-06-01'),
        },
      ],
      'URN-SOURCE',
    );

    expect(target).toBeNull();
  });

  it('detects newer-only matches for brand-new source products', () => {
    const source = {
      _id: new Types.ObjectId(),
      productId: 2,
      productName: 'New Product',
      eoiNo: 'GP001',
      urnNo: 'URN-SOURCE',
      manufacturerId,
      categoryId,
      productStatus: 2,
      certifiedDate: new Date('2025-01-01'),
      createdDate: new Date('2025-01-01'),
    };

    expect(
      hasNewerMatchingCertifiedCandidate(
        source,
        [
          {
            urnNo: 'URN-OTHER',
            eoiNo: 'GP050',
            productName: 'New Product',
            manufacturerId,
            categoryId,
            certifiedDate: new Date('2025-06-01'),
            createdDate: new Date('2025-06-01'),
          },
        ],
        'URN-SOURCE',
      ),
    ).toBe(true);
  });
});
