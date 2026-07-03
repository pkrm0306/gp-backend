import { Types } from 'mongoose';
import type { SummitDocument } from '../schemas/summit.schema';
import { normalizeSummitStatus } from './summit-status.util';

export interface SummitApiResponse {
  id: string;
  basic: {
    year: string;
    title: string;
    date: string;
    location: string;
    status: string;
  };
  banners: Array<{
    id: string;
    sortOrder: number;
    imageUrl: string;
  }>;
  industrialPdfs: Array<{
    id: string;
    sortOrder: number;
    title: string;
    fileUrl: string;
    fileName: string;
  }>;
  buildingsPdfs: Array<{
    id: string;
    sortOrder: number;
    title: string;
    fileUrl: string;
    fileName: string;
  }>;
  aboutGreenPro: { title: string; content: string };
  aboutSummit: { title: string; content: string };
  highlightsTitle: string;
  highlights: Array<{ id: string; sortOrder: number; text: string }>;
  focusedAreaTitle: string;
  areaPoints: Array<{ id: string; sortOrder: number; text: string }>;
  eventOutcomesTitle: string;
  eventOutcomes: Array<{ id: string; sortOrder: number; text: string }>;
  speakers: Array<{
    id: string;
    sortOrder: number;
    name: string;
    designation: string;
    organisation: string;
    organization: string;
    sub: string;
    keyPoint: string;
    tags: string[];
    /** Legacy read-only alias — first key point string when present */
    keyPoints: string[];
    imageUrl: string;
  }>;
  agenda: { title: string; content: string };
  sponsorsTitle: string;
  sponsors: Array<{
    id: string;
    sortOrder: number;
    name: string;
    tier: string;
    logoUrl: string;
  }>;
  createdAt: string;
  updatedAt: string;
  /** Present on GET /website/summits/:slug and GET /admin/summits/:id — tabs to show when filled */
  visibleSections?: string[];
  sectionVisibility?: Record<string, boolean>;
}

export interface SummitListItemApi {
  id: string;
  year: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  status: string;
  coverImageUrl: string | null;
  speakerCount: number;
  sponsorCount: number;
  bannerCount: number;
  updatedAt: string;
  createdAt: string;
}

/** Card row for public website listing (active summits only; no status field). */
export interface SummitPublicListItemApi {
  s_no: number;
  id: string;
  year: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  coverImageUrl: string | null;
  /** Plain-text excerpt from About Summit (max ~200 chars) for cards */
  excerpt: string;
}

export function normalizeSummitAssetUrl(
  raw: string | null | undefined,
  origin?: string,
): string {
  const v = String(raw ?? '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  if (!origin) {
    return v.startsWith('/') ? v : `/${v.replace(/^\/+/, '')}`;
  }
  if (v.startsWith('/uploads/')) return `${origin}${v}`;
  if (v.startsWith('uploads/')) return `${origin}/${v}`;
  if (v.startsWith('/')) return `${origin}${v}`;
  return v;
}

function stripHtmlForExcerpt(html: string | undefined | null): string {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sortByOrder<T extends { sortOrder?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function ensureSummitItemId(id?: string): string {
  if (id && String(id).trim()) return String(id).trim();
  return new Types.ObjectId().toString();
}

function mapTextItems(
  items: Array<{ id: string; sortOrder?: number; text?: string }> | undefined,
) {
  return sortByOrder(items ?? []).map((h) => ({
    id: h.id,
    sortOrder: h.sortOrder ?? 0,
    text: h.text ?? '',
  }));
}

/** Supports rich-text agenda and legacy array + agendaTitle documents. */
export function mapAgendaFromDoc(doc: SummitDocument): {
  title: string;
  content: string;
} {
  const legacyTitle =
    (doc as SummitDocument & { agendaTitle?: string }).agendaTitle ?? '';
  const raw = doc.agenda as unknown;

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const block = raw as { title?: string; content?: string };
    return {
      title: block.title ?? legacyTitle ?? "GreenPro's Core Agenda",
      content: block.content ?? '',
    };
  }

  if (Array.isArray(raw) && raw.length > 0) {
    const lines = sortByOrder(
      raw as Array<{ sortOrder?: number; text?: string }>,
    )
      .map((item) => String(item.text ?? '').trim())
      .filter(Boolean);
    return {
      title: legacyTitle || "GreenPro's Core Agenda",
      content: lines.map((t) => `<p>${t}</p>`).join(''),
    };
  }

  return {
    title: legacyTitle || "GreenPro's Core Agenda",
    content: '',
  };
}

export function mapSummitToApi(doc: SummitDocument): SummitApiResponse {
  const banners = sortByOrder(doc.banners ?? []);
  return {
    id: doc._id.toString(),
    basic: {
      year: doc.year ?? '',
      title: doc.title ?? '',
      date: doc.date ?? '',
      location: doc.location ?? '',
      status: normalizeSummitStatus(doc.status),
    },
    banners: banners.map((b) => ({
      id: b.id,
      sortOrder: b.sortOrder ?? 0,
      imageUrl: b.imageUrl ?? '',
    })),
    industrialPdfs: sortByOrder(doc.industrialPdfs ?? []).map((p) => ({
      id: p.id,
      sortOrder: p.sortOrder ?? 0,
      title: p.title ?? '',
      fileUrl: p.fileUrl ?? '',
      fileName: p.fileName ?? '',
    })),
    buildingsPdfs: sortByOrder(doc.buildingsPdfs ?? []).map((p) => ({
      id: p.id,
      sortOrder: p.sortOrder ?? 0,
      title: p.title ?? '',
      fileUrl: p.fileUrl ?? '',
      fileName: p.fileName ?? '',
    })),
    aboutGreenPro: {
      title: doc.aboutGreenPro?.title ?? '',
      content: doc.aboutGreenPro?.content ?? '',
    },
    aboutSummit: {
      title: doc.aboutSummit?.title ?? '',
      content: doc.aboutSummit?.content ?? '',
    },
    highlightsTitle: doc.highlightsTitle ?? '',
    highlights: mapTextItems(doc.highlights),
    focusedAreaTitle: doc.focusedAreaTitle ?? 'Focused Area',
    areaPoints: mapTextItems(doc.areaPoints),
    eventOutcomesTitle: doc.eventOutcomesTitle ?? 'Event Outcomes',
    eventOutcomes: mapTextItems(doc.eventOutcomes),
    speakers: sortByOrder(doc.speakers ?? []).map((s) => {
      const tags = s.tags ?? [];
      const keyPoint = String(s.keyPoint ?? '').trim();
      const designation = String(s.designation ?? s.sub ?? '').trim();
      const organisation = String(s.organisation ?? '').trim();
      return {
        id: s.id,
        sortOrder: s.sortOrder ?? 0,
        name: s.name ?? '',
        designation,
        organisation,
        organization: organisation,
        sub: s.sub ?? '',
        keyPoint,
        tags,
        keyPoints: keyPoint ? [keyPoint] : [],
        imageUrl: s.imageUrl ?? '',
      };
    }),
    agenda: mapAgendaFromDoc(doc),
    sponsorsTitle: doc.sponsorsTitle ?? '',
    sponsors: sortByOrder(doc.sponsors ?? []).map((s) => ({
      id: s.id,
      sortOrder: s.sortOrder ?? 0,
      name: s.name ?? '',
      tier: s.tier ?? 'Partner',
      logoUrl: s.logoUrl ?? '',
    })),
    createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

export function mapSummitToPublicListItem(
  doc: SummitDocument | (SummitDocument & { _id: { toString(): string } }),
  options: { s_no: number; origin?: string },
): SummitPublicListItemApi {
  const banners = sortByOrder(doc.banners ?? []);
  const firstBanner = banners.find((b) => b.imageUrl?.trim());
  const id =
    doc._id != null
      ? typeof doc._id === 'object' && 'toString' in doc._id
        ? doc._id.toString()
        : String(doc._id)
      : '';
  const aboutContent = doc.aboutSummit?.content ?? '';
  const excerptRaw = stripHtmlForExcerpt(aboutContent);
  const excerpt =
    excerptRaw.length > 200 ? `${excerptRaw.slice(0, 197)}...` : excerptRaw;

  return {
    s_no: options.s_no,
    id,
    year: doc.year ?? '',
    title: doc.title ?? '',
    slug: doc.slug ?? '',
    date: doc.date ?? '',
    location: doc.location ?? '',
    coverImageUrl: firstBanner?.imageUrl?.trim()
      ? normalizeSummitAssetUrl(firstBanner.imageUrl, options.origin) || null
      : null,
    excerpt,
  };
}

export function mapSummitToListItem(
  doc: SummitDocument | (SummitDocument & { _id: { toString(): string } }),
): SummitListItemApi {
  const banners = sortByOrder(doc.banners ?? []);
  const firstBanner = banners.find((b) => b.imageUrl?.trim());
  const id =
    doc._id != null
      ? typeof doc._id === 'object' && 'toString' in doc._id
        ? doc._id.toString()
        : String(doc._id)
      : '';
  return {
    id,
    year: doc.year ?? '',
    title: doc.title ?? '',
    slug: doc.slug ?? '',
    date: doc.date ?? '',
    location: doc.location ?? '',
    status: normalizeSummitStatus(doc.status),
    coverImageUrl: firstBanner?.imageUrl?.trim() || null,
    speakerCount: doc.speakers?.length ?? 0,
    sponsorCount: doc.sponsors?.length ?? 0,
    bannerCount: banners.length,
    createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString?.() ?? new Date().toISOString(),
  };
}
