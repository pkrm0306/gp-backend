/**
 * Manufacturer social / website visibility on the public website.
 * Missing / undefined flags are treated as ON (default visible).
 * Networks: Facebook, YouTube, Twitter, LinkedIn (+ optional company website).
 */

export const MANUFACTURER_SOCIAL_VISIBILITY_KEYS = [
  'showWebsiteOnWebsite',
  'showFacebookOnWebsite',
  'showYoutubeOnWebsite',
  'showTwitterOnWebsite',
  'showLinkedinOnWebsite',
] as const;

export type ManufacturerSocialVisibilityKey =
  (typeof MANUFACTURER_SOCIAL_VISIBILITY_KEYS)[number];

export type ManufacturerSocialVisibility = Record<
  ManufacturerSocialVisibilityKey,
  boolean
>;

export type ManufacturerSocialUrls = {
  website?: unknown;
  facebook?: unknown;
  youtube?: unknown;
  twitter?: unknown;
  linkedin?: unknown;
};

export type ManufacturerSocialPlatform =
  | 'website'
  | 'facebook'
  | 'youtube'
  | 'twitter'
  | 'linkedin';

const PLATFORM_TO_FLAG: Record<
  ManufacturerSocialPlatform,
  ManufacturerSocialVisibilityKey
> = {
  website: 'showWebsiteOnWebsite',
  facebook: 'showFacebookOnWebsite',
  youtube: 'showYoutubeOnWebsite',
  twitter: 'showTwitterOnWebsite',
  linkedin: 'showLinkedinOnWebsite',
};

/** Explicit off values from admin/vendor forms (boolean, 0/1, yes/no strings). */
export function isManufacturerSocialVisibleOnWebsite(flag: unknown): boolean {
  if (flag === false || flag === 0) {
    return false;
  }
  if (typeof flag === 'string') {
    const normalized = flag.trim().toLowerCase();
    if (
      normalized === 'false' ||
      normalized === '0' ||
      normalized === 'off' ||
      normalized === 'no'
    ) {
      return false;
    }
  }
  // Missing / undefined / true / "true" / 1 → visible (schema default).
  return true;
}

export function resolveManufacturerSocialVisibility(
  source:
    | Partial<Record<ManufacturerSocialVisibilityKey, unknown>>
    | null
    | undefined,
): ManufacturerSocialVisibility {
  return {
    showWebsiteOnWebsite: isManufacturerSocialVisibleOnWebsite(
      source?.showWebsiteOnWebsite,
    ),
    showFacebookOnWebsite: isManufacturerSocialVisibleOnWebsite(
      source?.showFacebookOnWebsite,
    ),
    showYoutubeOnWebsite: isManufacturerSocialVisibleOnWebsite(
      source?.showYoutubeOnWebsite,
    ),
    showTwitterOnWebsite: isManufacturerSocialVisibleOnWebsite(
      source?.showTwitterOnWebsite,
    ),
    showLinkedinOnWebsite: isManufacturerSocialVisibleOnWebsite(
      source?.showLinkedinOnWebsite,
    ),
  };
}

function trimUrl(value: unknown): string {
  return String(value ?? '').trim();
}

/**
 * Apply visibility flags: hidden networks become empty strings for public APIs
 * that still expose a fixed flat field shape.
 */
export function filterManufacturerSocialUrlsForWebsite(
  urls: ManufacturerSocialUrls,
  visibility?: Partial<Record<ManufacturerSocialVisibilityKey, unknown>> | null,
): {
  website: string;
  facebook: string;
  youtube: string;
  twitter: string;
  linkedin: string;
} {
  const flags = resolveManufacturerSocialVisibility(visibility);
  const pick = (value: unknown, visible: boolean): string =>
    visible ? trimUrl(value) : '';

  return {
    website: pick(urls.website, flags.showWebsiteOnWebsite),
    facebook: pick(urls.facebook, flags.showFacebookOnWebsite),
    youtube: pick(urls.youtube, flags.showYoutubeOnWebsite),
    twitter: pick(urls.twitter, flags.showTwitterOnWebsite),
    linkedin: pick(urls.linkedin, flags.showLinkedinOnWebsite),
  };
}

/**
 * Public website payload: include a platform **only when** Display-on-Website is on
 * and the URL is non-empty. Disabled / empty networks are omitted entirely.
 *
 * Example (LinkedIn on, Facebook off):
 * `{ linkedin: "https://...", linkedinUrl: "https://..." }`
 */
export function pickManufacturerSocialLinksForWebsite(
  urls: ManufacturerSocialUrls,
  visibility?: Partial<Record<ManufacturerSocialVisibilityKey, unknown>> | null,
  options?: { includeWebsite?: boolean },
): Record<string, string> {
  const flags = resolveManufacturerSocialVisibility(visibility);
  const includeWebsite = options?.includeWebsite === true;
  const out: Record<string, string> = {};

  const platforms: ManufacturerSocialPlatform[] = includeWebsite
    ? ['website', 'facebook', 'youtube', 'twitter', 'linkedin']
    : ['facebook', 'youtube', 'twitter', 'linkedin'];

  for (const platform of platforms) {
    const flagKey = PLATFORM_TO_FLAG[platform];
    if (!flags[flagKey]) {
      continue;
    }
    const href = trimUrl(urls[platform]);
    if (!href) {
      continue;
    }
    out[platform] = href;
    if (platform !== 'website') {
      out[`${platform}Url`] = href;
    }
  }

  return out;
}

export function buildManufacturerSocialVisibilityPayload(
  source:
    | Partial<Record<ManufacturerSocialVisibilityKey, unknown>>
    | null
    | undefined,
): ManufacturerSocialVisibility & {
  socialVisibility: ManufacturerSocialVisibility;
} {
  const flags = resolveManufacturerSocialVisibility(source);
  return {
    ...flags,
    socialVisibility: flags,
  };
}
