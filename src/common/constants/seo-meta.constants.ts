/**
 * Default SEO meta for public website API responses when DB fields are empty.
 * Never persist these into Mongo — apply only at read/response time.
 */
export const DEFAULT_SEO_META = {
  meta_title: 'Ecolabelled Products Directory | CII GreenPro Certification',
  meta_description:
    'Explore the CII GreenPro directory of certified eco-friendly products. Browse sustainable building materials, industrial products, and green manufacturers.',
  meta_keywords: [
    'greenpro certified products',
    'ecolabelled products directory',
    'cii greenpro',
    'eco friendly building materials',
    'sustainable products directory',
    'green product certification',
    'cii green business centre',
  ],
} as const;

export const SEO_META_TITLE_MAX = 250;
export const SEO_META_DESCRIPTION_MAX = 500;

export type SeoMetaFields = {
  meta_title: string;
  meta_description: string;
  meta_image: string | null;
  meta_keywords: string[];
};

export type SeoMetaSource = {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_image?: string | null;
  meta_keywords?: string[] | string | null;
  /** Primary entity image path/URL used when meta_image is empty. */
  primaryImage?: string | null;
};

function trimOrEmpty(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

/** Parse comma-separated or array keywords into trimmed unique-ish tags (order preserved). */
export function parseMetaKeywords(value: unknown): string[] {
  if (value == null) return [];
  const parts = Array.isArray(value)
    ? value.map((v) => String(v ?? ''))
    : String(value).split(',');
  const out: string[] = [];
  const seen = new Set<string>();
  for (const part of parts) {
    const tag = part.trim().replace(/\s+/g, ' ');
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
  }
  return out;
}

/**
 * Resolve SEO meta for API responses.
 * Empty DB title/description/keywords → DEFAULT_SEO_META.
 * Empty meta_image → primaryImage (resolved URL/path) or null.
 */
export function resolveSeoMeta(source: SeoMetaSource): SeoMetaFields {
  const title = trimOrEmpty(source.meta_title);
  const description = trimOrEmpty(source.meta_description);
  const keywords = parseMetaKeywords(source.meta_keywords);
  const metaImage =
    trimOrEmpty(source.meta_image) ||
    trimOrEmpty(source.primaryImage) ||
    null;

  return {
    meta_title: title || DEFAULT_SEO_META.meta_title,
    meta_description: description || DEFAULT_SEO_META.meta_description,
    meta_image: metaImage,
    meta_keywords:
      keywords.length > 0
        ? keywords
        : [...DEFAULT_SEO_META.meta_keywords],
  };
}

/**
 * Return raw DB SEO fields without applying defaults.
 * Use for admin responses so edit forms see actual stored values.
 */
export function rawSeoMeta(source: SeoMetaSource): SeoMetaFields {
  const title = trimOrEmpty(source.meta_title);
  const description = trimOrEmpty(source.meta_description);
  const keywords = parseMetaKeywords(source.meta_keywords);
  const metaImage =
    trimOrEmpty(source.meta_image) ||
    trimOrEmpty(source.primaryImage) ||
    null;

  return {
    meta_title: title,
    meta_description: description,
    meta_image: metaImage,
    meta_keywords: keywords,
  };
}

/** Validate required meta title/description for admin writes. Returns error message or null. */
export function validateSeoMetaWrite(input: {
  meta_title?: string | null;
  meta_description?: string | null;
}): string | null {
  const title = trimOrEmpty(input.meta_title);
  const description = trimOrEmpty(input.meta_description);
  if (!title) return 'Meta title is required';
  if (title.length > SEO_META_TITLE_MAX) {
    return `Meta title must be at most ${SEO_META_TITLE_MAX} characters`;
  }
  if (!description) return 'Meta description is required';
  if (description.length > SEO_META_DESCRIPTION_MAX) {
    return `Meta description must be at most ${SEO_META_DESCRIPTION_MAX} characters`;
  }
  return null;
}
