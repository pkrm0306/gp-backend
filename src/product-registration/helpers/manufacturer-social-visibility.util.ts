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

export function isManufacturerSocialVisibleOnWebsite(
  flag: unknown,
): boolean {
  return flag !== false;
}

export function resolveManufacturerSocialVisibility(
  source: Partial<Record<ManufacturerSocialVisibilityKey, unknown>> | null | undefined,
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

/** Apply visibility flags: hidden networks become empty strings for public APIs. */
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
    visible ? String(value ?? '').trim() : '';

  return {
    website: pick(urls.website, flags.showWebsiteOnWebsite),
    facebook: pick(urls.facebook, flags.showFacebookOnWebsite),
    youtube: pick(urls.youtube, flags.showYoutubeOnWebsite),
    twitter: pick(urls.twitter, flags.showTwitterOnWebsite),
    linkedin: pick(urls.linkedin, flags.showLinkedinOnWebsite),
  };
}

export function buildManufacturerSocialVisibilityPayload(
  source: Partial<Record<ManufacturerSocialVisibilityKey, unknown>> | null | undefined,
): ManufacturerSocialVisibility & {
  socialVisibility: ManufacturerSocialVisibility;
} {
  const flags = resolveManufacturerSocialVisibility(source);
  return {
    ...flags,
    socialVisibility: flags,
  };
}
