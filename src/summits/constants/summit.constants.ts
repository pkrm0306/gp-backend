export const SUMMIT_STATUSES = ['active', 'inactive'] as const;
export type SummitStatus = (typeof SUMMIT_STATUSES)[number];
export const SUMMIT_SPONSOR_TIERS = [
  'Title Sponsor',
  'Principal',
  'Platinum Sponsor',
  'Gold Sponsor',
  'Silver Sponsor',
  'Bronze Sponsor',
  'Partner',
] as const;

export type SummitSponsorTier = (typeof SUMMIT_SPONSOR_TIERS)[number];

export const SUMMIT_SECTION_KEYS = [
  'basic',
  'banners',
  'downloads',
  'about-greenpro',
  'about-summit',
  'highlights',
  'focused-area',
  'event-outcomes',
  'speakers',
  'agenda',
  'sponsors',
] as const;

export type SummitSectionKey = (typeof SUMMIT_SECTION_KEYS)[number];

export const SUMMIT_UPLOAD_TYPES = [
  'banner',
  'speaker',
  'sponsor',
  'pdf_industrial',
  'pdf_buildings',
] as const;

export type SummitUploadType = (typeof SUMMIT_UPLOAD_TYPES)[number];

export const SUMMIT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const SUMMIT_PDF_MAX_BYTES = 10 * 1024 * 1024;
