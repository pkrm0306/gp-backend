import {
  allocateUniqueSlug,
  collisionSlug,
  isValidPublicSlug,
  slugifyPublicName,
} from './unique-slug.util';

describe('unique-slug.util', () => {
  it('slugifies names (lowercase, strip quotes, kebab)', () => {
    expect(slugifyPublicName(`Asian Paints "Pro"`)).toBe('asian-paints-pro');
    expect(slugifyPublicName('  Cement / Ready-Mix  ')).toBe('cement-ready-mix');
    expect(slugifyPublicName("O'Reilly")).toBe('oreilly');
  });

  it('validates public slug format', () => {
    expect(isValidPublicSlug('asian-paints')).toBe(true);
    expect(isValidPublicSlug('cement-2')).toBe(true);
    expect(isValidPublicSlug('A')).toBe(false);
    expect(isValidPublicSlug('-bad')).toBe(false);
    expect(isValidPublicSlug('')).toBe(false);
  });

  it('builds collision suffixes without ObjectIds', () => {
    expect(collisionSlug('cement', 1)).toBe('cement');
    expect(collisionSlug('cement', 2)).toBe('cement-2');
    expect(collisionSlug('cement', 3)).toBe('cement-3');
  });

  it('allocates unique slug on collision', async () => {
    const taken = new Set(['solar-panel', 'solar-panel-2']);
    const slug = await allocateUniqueSlug('Solar Panel', async (s) =>
      taken.has(s),
    );
    expect(slug).toBe('solar-panel-3');
  });

  it('uses fallback when name slugifies empty', async () => {
    const slug = await allocateUniqueSlug('!!!', async () => false, {
      fallback: 'product',
    });
    expect(slug).toBe('product');
  });
});
