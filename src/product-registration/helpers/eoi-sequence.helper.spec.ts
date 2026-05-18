import {
  compareProductsForResequence,
  findDuplicateEoiSequenceSuffixes,
  parseEoiSequenceSuffix,
} from './eoi-sequence.helper';

describe('eoi-sequence.helper', () => {
  describe('parseEoiSequenceSuffix', () => {
    it('parses last 3 digits', () => {
      expect(parseEoiSequenceSuffix('GPPMI003004')).toBe(4);
      expect(parseEoiSequenceSuffix('GPPMI003001')).toBe(1);
    });

    it('returns null for invalid suffix', () => {
      expect(parseEoiSequenceSuffix('GPPMI00X')).toBeNull();
      expect(parseEoiSequenceSuffix('')).toBeNull();
    });
  });

  describe('compareProductsForResequence', () => {
    it('orders by sequence suffix', () => {
      const products = [
        { eoiNo: 'GPPMI003003', createdDate: new Date('2024-01-03') },
        { eoiNo: 'GPPMI003001', createdDate: new Date('2024-01-01') },
        { eoiNo: 'GPPMI003002', createdDate: new Date('2024-01-02') },
      ];
      const sorted = [...products].sort(compareProductsForResequence);
      expect(sorted.map((p) => p.eoiNo)).toEqual([
        'GPPMI003001',
        'GPPMI003002',
        'GPPMI003003',
      ]);
    });
  });

  describe('findDuplicateEoiSequenceSuffixes', () => {
    it('detects duplicate suffixes', () => {
      const dupes = findDuplicateEoiSequenceSuffixes([
        { eoiNo: 'GPPMI003002' },
        { eoiNo: 'GPPMI003002' },
        { eoiNo: 'GPPMI003001' },
      ]);
      expect(dupes).toEqual([2]);
    });
  });
});
