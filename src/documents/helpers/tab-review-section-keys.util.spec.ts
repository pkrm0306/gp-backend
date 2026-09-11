import { sectionKeysForTabReviewSlot } from './tab-review-section-keys.util';

describe('sectionKeysForTabReviewSlot', () => {
  it('maps process tabs to document section keys', () => {
    expect(sectionKeysForTabReviewSlot('product-design')).toEqual([
      'product_design',
    ]);
    expect(sectionKeysForTabReviewSlot('manufacturing-process')).toEqual([
      'process_manufacturing',
    ]);
  });

  it('maps raw-materials steps to section keys', () => {
    expect(sectionKeysForTabReviewSlot('raw-materials', 1)).toEqual([
      'raw_materials_hazardous_products',
    ]);
    expect(sectionKeysForTabReviewSlot('raw-materials', 2)).toContain(
      'raw_materials_recycled_content',
    );
  });

  it('returns empty for unknown tabs', () => {
    expect(sectionKeysForTabReviewSlot('payment')).toEqual([]);
  });
});
