import { Types } from 'mongoose';
import type { SummitDocument } from '../schemas/summit.schema';
import { normalizeSummitStatus } from './summit-status.util';
import {
  buildAgendaHtmlFromPoints,
  enrichFocusedAreaRow,
  enrichSummitCardRow,
  mapLegacyAreaPoints,
  type SummitCardApiRow,
  type SummitFocusAreaApiRow,
} from './summit-api-compat.util';
import {
  mapAgendaFromDoc as mapAgendaSectionFromDoc,
  mapEventOutcomesFromDoc,
  mapFocusedAreasFromDoc,
  mapHighlightsFromDoc,
  type SummitAgendaPointRow,
} from './summit-cms-sections.util';

export interface SummitApiResponse {
  id: string;
  slug: string;
  basic: {
    year: string;
    title: string;
    date: string;
    location: string;
    status: string;
    slug: string;
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
  highlights: SummitCardApiRow[];
  focusedAreaTitle: string;
  /** Legacy alias for focusedAreaTitle — used by public website. */
  areaPointsTitle: string;
  focusedAreas: SummitFocusAreaApiRow[];
  /** Legacy flat bullets derived from focusedAreas when areaPoints is empty. */
  areaPoints: Array<{ id: string; sortOrder: number; text: string }>;
  eventOutcomesTitle: string;
  eventOutcomes: SummitCardApiRow[];
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
    keyPoints: string[];
    imageUrl: string;
  }>;
  agendaTitle: string;
  agendaPoints: SummitAgendaPointRow[];
  /** Legacy rich-text agenda block for public website HTML fallback. */
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

export interface SummitPublicListItemApi {
  s_no: number;
  id: string;
  year: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  coverImageUrl: string | null;
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

export function mapSummitToApi(doc: SummitDocument): SummitApiResponse {
  const banners = sortByOrder(doc.banners ?? []);
  const agenda = mapAgendaSectionFromDoc(doc);
  const highlights = mapHighlightsFromDoc(doc).map(enrichSummitCardRow);
  const focusedAreas = mapFocusedAreasFromDoc(doc).map(enrichFocusedAreaRow);
  const eventOutcomes = mapEventOutcomesFromDoc(doc).map(enrichSummitCardRow);
  const focusedAreaTitle = doc.focusedAreaTitle ?? 'Focused Area';
  const agendaContent =
    buildAgendaHtmlFromPoints(agenda.points) ||
    String(doc.agenda?.content ?? '').trim();

  return {
    id: doc._id.toString(),
    slug: doc.slug ?? '',
    basic: {
      year: doc.year ?? '',
      title: doc.title ?? '',
      date: doc.date ?? '',
      location: doc.location ?? '',
      status: normalizeSummitStatus(doc.status),
      slug: doc.slug ?? '',
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
    highlights,
    focusedAreaTitle,
    areaPointsTitle: focusedAreaTitle,
    focusedAreas,
    areaPoints: mapLegacyAreaPoints(doc, focusedAreas),
    eventOutcomesTitle: doc.eventOutcomesTitle ?? 'Event Outcomes',
    eventOutcomes,
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
    agendaTitle: agenda.title,
    agendaPoints: agenda.points,
    agenda: {
      title: agenda.title,
      content: agendaContent,
    },
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
