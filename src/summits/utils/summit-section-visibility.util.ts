import type { SummitSectionKey } from '../constants/summit.constants';
import type { SummitApiResponse } from './summit-mapper.util';

/** Nav / block order on the public summit page (excludes `basic` — always shown as hero). */
export const PUBLIC_SUMMIT_SECTION_ORDER: SummitSectionKey[] = [
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
];

function stripHtml(html: string | undefined | null): string {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasRichTextContentOnly(block: { title?: string; content?: string }): boolean {
  return stripHtml(block.content).length > 0;
}

function hasListItems(
  items: Array<{ text?: string }> | undefined,
): boolean {
  return (items ?? []).some((item) => String(item.text ?? '').trim().length > 0);
}

export function computeSummitSectionVisibility(
  summit: SummitApiResponse,
): Record<SummitSectionKey, boolean> {
  const hasBanner = summit.banners.some((b) =>
    String(b.imageUrl ?? '').trim(),
  );

  const hasDownloads =
    summit.industrialPdfs.some((p) => String(p.fileUrl ?? '').trim()) ||
    summit.buildingsPdfs.some((p) => String(p.fileUrl ?? '').trim());

  const visibility: Record<SummitSectionKey, boolean> = {
    basic: Boolean(
      String(summit.basic.title ?? '').trim() ||
        String(summit.basic.date ?? '').trim(),
    ),
    banners: hasBanner,
    downloads: hasDownloads,
    'about-greenpro': hasRichTextContentOnly(summit.aboutGreenPro),
    'about-summit': hasRichTextContentOnly(summit.aboutSummit),
    highlights: hasListItems(summit.highlights),
    'focused-area': hasListItems(summit.areaPoints),
    'event-outcomes': hasListItems(summit.eventOutcomes),
    speakers: summit.speakers.some(
      (s) =>
        String(s.name ?? '').trim() ||
        String(s.imageUrl ?? '').trim() ||
        String(s.sub ?? '').trim() ||
        (s.tags ?? []).some((t) => String(t).trim()),
    ),
    agenda: hasRichTextContentOnly(summit.agenda),
    sponsors: summit.sponsors.some(
      (s) => String(s.name ?? '').trim() || String(s.logoUrl ?? '').trim(),
    ),
  };

  return visibility;
}

/** Sections to render on the public page (filled only, stable order). */
export function getVisiblePublicSummitSections(
  summit: SummitApiResponse,
): SummitSectionKey[] {
  const visibility = computeSummitSectionVisibility(summit);
  return PUBLIC_SUMMIT_SECTION_ORDER.filter((key) => visibility[key]);
}

export function buildSummitViewPayload(summit: SummitApiResponse) {
  const sectionVisibility = computeSummitSectionVisibility(summit);
  const visibleSections = getVisiblePublicSummitSections(summit);
  return {
    ...summit,
    sectionVisibility,
    visibleSections,
  };
}
