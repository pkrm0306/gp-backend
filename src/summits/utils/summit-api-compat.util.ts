import type { SummitDocument } from '../schemas/summit.schema';
import type {
  SummitAgendaPointRow,
  SummitCardRow,
  SummitFocusAreaRow,
} from './summit-cms-sections.util';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Flat string for legacy website parsers (`asStringArray` reads `text` first). */
export function formatSummitCardLegacyText(
  heading: string,
  description: string,
): string {
  const h = String(heading ?? '').trim();
  const d = String(description ?? '').trim();
  if (h && d) {
    return `${h} — ${d}`;
  }
  return h || d;
}

export type SummitCardApiRow = SummitCardRow & {
  /** Legacy alias for heading — used by public website normalizers. */
  title: string;
  /** Combined heading + description for legacy string-array parsers. */
  text: string;
};

export function enrichSummitCardRow(row: SummitCardRow): SummitCardApiRow {
  const heading = String(row.heading ?? '').trim();
  const description = String(row.description ?? '').trim();
  return {
    ...row,
    title: heading,
    text: formatSummitCardLegacyText(heading, description),
  };
}

export type SummitFocusAreaApiRow = SummitFocusAreaRow & {
  /** Legacy alias for heading — used by public website normalizers. */
  title: string;
  /** Flat bullet strings for legacy parsers (`items` / `points` arrays). */
  items: string[];
};

export function enrichFocusedAreaRow(
  area: SummitFocusAreaRow,
): SummitFocusAreaApiRow {
  const heading = String(area.heading ?? '').trim();
  const items = (area.points ?? [])
    .map((point) => String(point.text ?? '').trim())
    .filter(Boolean);
  return {
    ...area,
    title: heading,
    items,
  };
}

export function buildAgendaHtmlFromPoints(
  points: SummitAgendaPointRow[],
): string {
  const texts = points
    .map((point) => String(point.text ?? '').trim())
    .filter(Boolean);
  if (texts.length === 0) {
    return '';
  }
  return `<ul>${texts.map((text) => `<li>${escapeHtml(text)}</li>`).join('')}</ul>`;
}

export function mapLegacyAreaPoints(
  doc: SummitDocument,
  focusedAreas: SummitFocusAreaRow[],
): Array<{ id: string; sortOrder: number; text: string }> {
  const legacy = doc.areaPoints ?? [];
  if (legacy.length > 0) {
    return legacy.map((point, index) => ({
      id: String(point.id ?? '').trim() || `area-${index}`,
      sortOrder: point.sortOrder ?? index,
      text: String(point.text ?? '').trim(),
    }));
  }

  return focusedAreas.flatMap((area, areaIndex) =>
    (area.points ?? []).map((point, pointIndex) => ({
      id: point.id,
      sortOrder: area.sortOrder * 10 + pointIndex,
      text: String(point.text ?? '').trim(),
    })),
  );
}
