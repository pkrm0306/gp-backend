import { buildSummitSlug, isValidSummitSlug, slugifySummitInput } from './summit-slug.util';

describe('summit-slug.util', () => {
  it('slugifies title', () => {
    expect(slugifySummitInput('GreenPro Summit 2026')).toBe('greenpro-summit-2026');
  });

  it('buildSummitSlug appends year when title does not include it', () => {
    expect(buildSummitSlug('GreenPro Summit', '2026')).toBe('greenpro-summit-2026');
  });

  it('buildSummitSlug avoids duplicate year suffix', () => {
    expect(buildSummitSlug('GreenPro Summit 2026', '2026')).toBe(
      'greenpro-summit-2026',
    );
  });

  it('validates slug format', () => {
    expect(isValidSummitSlug('greenpro-summit-2026')).toBe(true);
    expect(isValidSummitSlug('a')).toBe(false);
  });
});
