import {
  ARTICLE_WHATS_INSIDE_ITEM_MAX,
  normalizeKeyPointsInput,
  normalizeTagsInput,
  normalizeWhatsInsideInput,
  normalizeWhoItsForInput,
} from './article-detail-sections.util';

describe('article detail sections normalize', () => {
  it('enforces 50-char max on whatsInside items', () => {
    expect(() =>
      normalizeWhatsInsideInput([
        'ok',
        'x'.repeat(ARTICLE_WHATS_INSIDE_ITEM_MAX + 1),
      ]),
    ).toThrow();
  });

  it('accepts valid whatsInside / whoItsFor / tags arrays', () => {
    expect(
      normalizeWhatsInsideInput(['Introduction to Green Building']),
    ).toEqual(['Introduction to Green Building']);
    expect(normalizeWhoItsForInput(['Architects and consultants'])).toEqual([
      'Architects and consultants',
    ]);
    expect(normalizeTagsInput(['Event', 'Eco-labels'])).toEqual([
      'Event',
      'Eco-labels',
    ]);
  });

  it('requires heading and description for key points', () => {
    expect(
      normalizeKeyPointsInput([
        {
          heading: 'Standardization',
          description: 'Clearer standards help procurement teams.',
        },
      ]),
    ).toEqual([
      {
        heading: 'Standardization',
        description: 'Clearer standards help procurement teams.',
      },
    ]);
    expect(() =>
      normalizeKeyPointsInput([{ heading: 'Only heading' }]),
    ).toThrow();
  });

  it('parses JSON string payloads from multipart', () => {
    expect(
      normalizeTagsInput('["Event","Building materials"]'),
    ).toEqual(['Event', 'Building materials']);
  });

  it('returns undefined when field omitted', () => {
    expect(normalizeWhatsInsideInput(undefined)).toBeUndefined();
    expect(normalizeKeyPointsInput(undefined)).toBeUndefined();
  });
});
