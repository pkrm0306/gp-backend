import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  SUMMIT_CMS_CARD_MAX,
  SUMMIT_CMS_FIELD_MAX,
  SUMMIT_CMS_FIELD_MIN,
  SUMMIT_FOCUS_POINTS_MAX,
} from '../constants/summit.constants';
import type { SummitDocument } from '../schemas/summit.schema';

function ensureItemId(id?: string): string {
  if (id && String(id).trim()) {
    return String(id).trim();
  }
  return new Types.ObjectId().toString();
}

export type SummitCardRow = {
  id: string;
  sortOrder: number;
  heading: string;
  description: string;
};

export type SummitFocusPointRow = {
  id: string;
  sortOrder: number;
  text: string;
};

export type SummitFocusAreaRow = {
  id: string;
  sortOrder: number;
  heading: string;
  points: SummitFocusPointRow[];
};

export type SummitAgendaPointRow = {
  id: string;
  sortOrder: number;
  heading: string;
  description: string;
  /** Combined "heading — description" for legacy consumers reading `text`. */
  text: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function sortSummitItems<T extends { sortOrder?: number }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function throwSummitFieldErrors(
  fieldErrors: Record<string, string>,
): never {
  throw new BadRequestException({
    message: 'Validation failed',
    fieldErrors,
    errors: fieldErrors,
  });
}

function readTrimmed(value: unknown): string {
  return String(value ?? '').trim();
}

function extractNestedArray(
  value: unknown,
  nestedKeys: string[],
): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (isPlainObject(value)) {
    for (const key of nestedKeys) {
      const nested = value[key];
      if (Array.isArray(nested)) {
        return nested;
      }
    }
  }
  return [];
}

function validateSectionTitle(
  title: string,
  fieldKey: string,
  hasContent: boolean,
  errors: Record<string, string>,
): void {
  if (!hasContent) {
    return;
  }
  if (!title) {
    errors[fieldKey] = 'Section title is required.';
    return;
  }
  if (title.length < SUMMIT_CMS_FIELD_MIN) {
    errors[fieldKey] = `Minimum ${SUMMIT_CMS_FIELD_MIN} characters are required.`;
    return;
  }
  if (title.length > SUMMIT_CMS_FIELD_MAX) {
    errors[fieldKey] = `Maximum ${SUMMIT_CMS_FIELD_MAX} characters are allowed.`;
  }
}

/** True when a CMS text field has enough content to keep (not an empty draft UI row). */
function hasCmsFieldContent(value: string): boolean {
  return value.length >= SUMMIT_CMS_FIELD_MIN;
}

/**
 * Draft/basic saves often send empty placeholder cards from other tabs.
 * Keep only fully filled rows; drop incomplete placeholders instead of failing.
 */
function isCompleteCardRow(item: {
  heading: string;
  description: string;
}): boolean {
  return hasCmsFieldContent(item.heading) && hasCmsFieldContent(item.description);
}

function validateCmsFieldMax(
  value: string,
  fieldKey: string,
  errors: Record<string, string>,
): void {
  if (value.length > SUMMIT_CMS_FIELD_MAX) {
    errors[fieldKey] = `Maximum ${SUMMIT_CMS_FIELD_MAX} characters are allowed.`;
  }
}

function splitLegacyCardText(
  text: string,
  knownHeading?: string,
): { heading: string; description: string } {
  const trimmed = readTrimmed(text);
  if (!trimmed) {
    return { heading: readTrimmed(knownHeading), description: '' };
  }

  const heading = readTrimmed(knownHeading);
  if (heading) {
    const prefix = `${heading} — `;
    if (trimmed.startsWith(prefix)) {
      return {
        heading,
        description: readTrimmed(trimmed.slice(prefix.length)),
      };
    }
    if (trimmed === heading) {
      return { heading, description: '' };
    }
    return { heading, description: trimmed };
  }

  const separatorIndex = trimmed.indexOf(' — ');
  if (separatorIndex > 0) {
    return {
      heading: readTrimmed(trimmed.slice(0, separatorIndex)),
      description: readTrimmed(trimmed.slice(separatorIndex + 3)),
    };
  }

  return { heading: '', description: trimmed };
}

function cardRowFromInput(
  item: unknown,
  index: number,
): { id: string; sortOrder: number; heading: string; description: string } {
  const source = (item ?? {}) as Record<string, unknown>;
  const legacyText = readTrimmed(source.text ?? source.point);
  let heading = readTrimmed(source.heading ?? source.title ?? source.label);
  let description = readTrimmed(source.description);

  if (!description && legacyText) {
    const parsed = splitLegacyCardText(legacyText, heading || undefined);
    heading = heading || parsed.heading;
    description = parsed.description;
  } else if (!description) {
    description = legacyText;
  } else if (!heading && description.includes(' — ')) {
    const parsed = splitLegacyCardText(description);
    heading = parsed.heading;
    description = parsed.description;
  }

  return {
    id: ensureItemId(source.id as string | undefined),
    sortOrder:
      typeof source.sortOrder === 'number' ? source.sortOrder : index,
    heading,
    description: description || (heading ? '' : legacyText),
  };
}

function pointRowFromInput(
  item: unknown,
  index: number,
): SummitFocusPointRow {
  if (typeof item === 'string' || typeof item === 'number') {
    return {
      id: ensureItemId(undefined),
      sortOrder: index,
      text: readTrimmed(item),
    };
  }

  const source = (item ?? {}) as Record<string, unknown>;
  const legacyText = readTrimmed(source.text ?? source.point);
  const heading = readTrimmed(source.heading ?? source.title ?? source.label);
  const description = readTrimmed(source.description);
  const text =
    legacyText || combineCardText(heading, description) || heading;

  return {
    id: ensureItemId(source.id as string | undefined),
    sortOrder:
      typeof source.sortOrder === 'number' ? source.sortOrder : index,
    text,
  };
}

function normalizeFocusPointsFromCard(
  source: Record<string, unknown>,
): SummitFocusPointRow[] {
  const fromPoints = extractNestedArray(source.points, ['items']).map(
    (point, pointIndex) => pointRowFromInput(point, pointIndex),
  );
  const fromItems = extractNestedArray(source.items, []).map((item, itemIndex) =>
    pointRowFromInput(item, itemIndex),
  );

  if (fromPoints.length === 0) {
    return fromItems;
  }
  if (fromItems.length === 0) {
    return fromPoints;
  }

  const merged: SummitFocusPointRow[] = [];
  const maxLen = Math.max(fromPoints.length, fromItems.length);
  for (let index = 0; index < maxLen; index++) {
    const point = fromPoints[index];
    const item = fromItems[index];
    if (point && readTrimmed(point.text)) {
      merged.push({ ...point, sortOrder: point.sortOrder ?? index });
      continue;
    }
    if (item && readTrimmed(item.text)) {
      merged.push({
        id: point?.id ?? item.id,
        sortOrder: point?.sortOrder ?? item.sortOrder ?? index,
        text: item.text,
      });
      continue;
    }
  }
  return merged.filter((point) => readTrimmed(point.text));
}

function shouldRegroupFlatAreaPoints(entries: unknown[]): boolean {
  if (entries.length <= SUMMIT_CMS_CARD_MAX) {
    return false;
  }
  return entries.every((entry) => {
    if (typeof entry === 'string' || typeof entry === 'number') {
      return true;
    }
    const source = (entry ?? {}) as Record<string, unknown>;
    const hasNestedPoints =
      extractNestedArray(source.points, ['items']).length > 0;
    const heading = readTrimmed(source.heading ?? source.title ?? source.label);
    return !hasNestedPoints && !heading;
  });
}

function reconstructFocusedAreaCardsFromAreaPoints(
  areaPoints: unknown[],
): SummitFocusAreaRow[] {
  const parsed = sortSummitItems(
    areaPoints.map((item, index) => {
      const source = (item ?? {}) as Record<string, unknown>;
      const bullet = pointRowFromInput(source, index);
      const topicHeading = readTrimmed(
        source.heading ?? source.title ?? source.label,
      );
      return {
        source,
        sortOrder:
          typeof source.sortOrder === 'number' ? source.sortOrder : index,
        bullet,
        topicHeading,
      };
    }),
  );

  const topicShaped = parsed.filter(
    (row) =>
      row.topicHeading &&
      readTrimmed(row.bullet.text) &&
      row.bullet.text !== row.topicHeading,
  );
  if (
    topicShaped.length > 0 &&
    topicShaped.length === parsed.length &&
    topicShaped.length <= SUMMIT_CMS_CARD_MAX * 3
  ) {
    return topicShaped.slice(0, SUMMIT_CMS_CARD_MAX).map((row, index) => ({
      id: ensureItemId(row.source.id as string | undefined),
      sortOrder: row.sortOrder ?? index,
      heading: row.topicHeading,
      points: [
        {
          id: ensureItemId(undefined),
          sortOrder: 0,
          text: row.bullet.text,
        },
      ],
    }));
  }

  const groups = new Map<number, typeof parsed>();
  for (const row of parsed) {
    const groupKey = Math.floor(row.sortOrder / 10);
    const bucket = groups.get(groupKey) ?? [];
    bucket.push(row);
    groups.set(groupKey, bucket);
  }

  if (groups.size > 1) {
    return [...groups.entries()]
      .sort((a, b) => a[0] - b[0])
      .slice(0, SUMMIT_CMS_CARD_MAX)
      .map(([groupKey, rows], index) => ({
        id: ensureItemId(undefined),
        sortOrder: groupKey,
        heading: readTrimmed(rows[0]?.topicHeading) || `Topic ${index + 1}`,
        points: sortSummitItems(
          rows
            .map((row, pointIndex) => ({
              id: ensureItemId(row.source.id as string | undefined),
              sortOrder: row.sortOrder % 10 || pointIndex,
              text: row.bullet.text,
            }))
            .filter((point) => readTrimmed(point.text)),
        ).slice(0, SUMMIT_FOCUS_POINTS_MAX),
      }));
  }

  const chunks: (typeof parsed)[] = [];
  for (let index = 0; index < parsed.length; index += SUMMIT_FOCUS_POINTS_MAX) {
    chunks.push(parsed.slice(index, index + SUMMIT_FOCUS_POINTS_MAX));
  }

  return chunks.slice(0, SUMMIT_CMS_CARD_MAX).map((rows, index) => ({
    id: ensureItemId(undefined),
    sortOrder: index,
    heading: readTrimmed(rows[0]?.topicHeading) || `Topic ${index + 1}`,
    points: rows
      .map((row, pointIndex) => ({
        id: ensureItemId(row.source.id as string | undefined),
        sortOrder: pointIndex,
        text: row.bullet.text,
      }))
      .filter((point) => readTrimmed(point.text)),
  }));
}

function focusCardFromInput(
  card: unknown,
  index: number,
): SummitFocusAreaRow {
  const source = (card ?? {}) as Record<string, unknown>;
  let points = normalizeFocusPointsFromCard(source);
  if (points.length === 0) {
    let cardHeading = readTrimmed(
      source.heading ?? source.title ?? source.label,
    );
    let cardDescription = readTrimmed(source.description);
    const legacyText = readTrimmed(source.text ?? source.point);
    if (!cardDescription && legacyText) {
      const parsed = splitLegacyCardText(legacyText, cardHeading || undefined);
      cardHeading = cardHeading || parsed.heading;
      cardDescription = parsed.description;
    }
    const fallbackText = cardDescription || cardHeading || legacyText;
    if (fallbackText) {
      points = [
        {
          id: ensureItemId(undefined),
          sortOrder: 0,
          text: fallbackText,
        },
      ];
    }
  }
  return {
    id: ensureItemId(source.id as string | undefined),
    sortOrder:
      typeof source.sortOrder === 'number' ? source.sortOrder : index,
    heading: readTrimmed(source.heading ?? source.title ?? source.label),
    points,
  };
}

/** Parse legacy agenda HTML into plain-text bullet rows. */
export function parseAgendaHtmlToTexts(html: string): string[] {
  const raw = String(html ?? '').trim();
  if (!raw) {
    return [];
  }

  const liMatches = [...raw.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  if (liMatches.length > 0) {
    return liMatches
      .map((match) => stripHtml(match[1]))
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const pMatches = [...raw.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  if (pMatches.length > 0) {
    return pMatches
      .map((match) => stripHtml(match[1]))
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const plain = stripHtml(raw);
  if (!plain) {
    return [];
  }
  return plain
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function stripHtml(html: string): string {
  return String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapStoredCardRow(
  item: {
    id?: string;
    sortOrder?: number;
    heading?: string;
    description?: string;
    text?: string;
  },
  index: number,
): SummitCardRow {
  const legacyText = readTrimmed(item.text);
  const heading = readTrimmed(item.heading);
  const description = readTrimmed(item.description);
  return {
    id: ensureItemId(item.id),
    sortOrder: item.sortOrder ?? index,
    heading,
    description: description || legacyText,
  };
}

export function mapHighlightsFromDoc(doc: SummitDocument): SummitCardRow[] {
  const rows = sortSummitItems(doc.highlights ?? []).map(mapStoredCardRow);
  return rows.slice(0, SUMMIT_CMS_CARD_MAX);
}

export function mapEventOutcomesFromDoc(doc: SummitDocument): SummitCardRow[] {
  const rows = sortSummitItems(doc.eventOutcomes ?? []).map(mapStoredCardRow);
  return rows.slice(0, SUMMIT_CMS_CARD_MAX);
}

export function mapFocusedAreasFromDoc(doc: SummitDocument): SummitFocusAreaRow[] {
  const stored = sortSummitItems(doc.focusedAreas ?? []);
  if (stored.length > 0) {
    return stored.slice(0, SUMMIT_CMS_CARD_MAX).map((card, index) => ({
      id: ensureItemId(card.id),
      sortOrder: card.sortOrder ?? index,
      heading: readTrimmed(card.heading),
      points: sortSummitItems(card.points ?? [])
        .slice(0, SUMMIT_FOCUS_POINTS_MAX)
        .map((point, pointIndex) => ({
          id: ensureItemId(point.id),
          sortOrder: point.sortOrder ?? pointIndex,
          text: readTrimmed(point.text),
        })),
    }));
  }

  const legacy = sortSummitItems(doc.areaPoints ?? []);
  return legacy.slice(0, SUMMIT_CMS_CARD_MAX).map((point, index) => ({
    id: ensureItemId(point.id),
    sortOrder: point.sortOrder ?? index,
    heading: '',
    points: [
      {
        id: new Types.ObjectId().toString(),
        sortOrder: 0,
        text: readTrimmed(point.text),
      },
    ],
  }));
}

function combineCardText(heading: string, description: string): string {
  if (heading && description) {
    return `${heading} — ${description}`;
  }
  return heading || description;
}

function agendaPointRowFromStored(
  item: {
    id?: string;
    sortOrder?: number;
    heading?: string;
    description?: string;
    text?: string;
  },
  index: number,
): SummitAgendaPointRow {
  const legacyText = readTrimmed(item.text);
  const heading = readTrimmed(item.heading);
  const description = readTrimmed(item.description) || legacyText;
  return {
    id: ensureItemId(item.id),
    sortOrder: item.sortOrder ?? index,
    heading,
    description,
    text: combineCardText(heading, description),
  };
}

export function mapAgendaFromDoc(doc: SummitDocument): {
  title: string;
  points: SummitAgendaPointRow[];
} {
  const legacyAgendaTitle = readTrimmed(
    doc.agendaTitle ??
      doc.agenda?.title ??
      (doc as SummitDocument & { agendaTitleLegacy?: string }).agendaTitleLegacy,
  );
  const title = legacyAgendaTitle || "GreenPro's Core Agenda";

  const stored = sortSummitItems(doc.agendaPoints ?? []);
  if (stored.length > 0) {
    return {
      title,
      points: stored.map((point, index) =>
        agendaPointRowFromStored(point, index),
      ),
    };
  }

  const parsed = parseAgendaHtmlToTexts(doc.agenda?.content ?? '');
  return {
    title,
    points: parsed.map((text, index) => ({
      id: new Types.ObjectId().toString(),
      sortOrder: index,
      heading: '',
      description: text,
      text,
    })),
  };
}

export function normalizeHighlightsSection(body: Record<string, unknown>): {
  title: string;
  items: SummitCardRow[];
} {
  const errors: Record<string, string> = {};
  const rawItems = extractNestedArray(body.highlights, ['items', 'points']);
  const items = rawItems
    .map((item, index) => cardRowFromInput(item, index))
    // Drop empty / half-filled draft cards from other tabs so basic-only saves work.
    .filter((item) => isCompleteCardRow(item));

  if (items.length > SUMMIT_CMS_CARD_MAX) {
    errors['highlights.max'] = `Maximum ${SUMMIT_CMS_CARD_MAX} highlights are allowed.`;
  }

  const sorted = sortSummitItems(items).slice(0, SUMMIT_CMS_CARD_MAX);
  for (const item of sorted) {
    validateCmsFieldMax(item.heading, `highlight.${item.id}.heading`, errors);
    validateCmsFieldMax(
      item.description,
      `highlight.${item.id}.description`,
      errors,
    );
  }

  const rawTitle = readTrimmed(
    body.highlightsTitle ??
      body.highlights_title ??
      (isPlainObject(body.highlights) ? body.highlights.title : undefined),
  );
  validateSectionTitle(rawTitle, 'highlights.title', sorted.length > 0, errors);

  if (Object.keys(errors).length > 0) {
    throwSummitFieldErrors(errors);
  }

  return { title: rawTitle, items: sorted };
}

export function normalizeEventOutcomesSection(body: Record<string, unknown>): {
  title: string;
  items: SummitCardRow[];
} {
  const errors: Record<string, string> = {};
  const rawItems = extractNestedArray(body.eventOutcomes, ['items', 'points']);
  const items = rawItems
    .map((item, index) => cardRowFromInput(item, index))
    .filter((item) => isCompleteCardRow(item));

  if (items.length > SUMMIT_CMS_CARD_MAX) {
    errors['event-outcomes.max'] =
      `Maximum ${SUMMIT_CMS_CARD_MAX} event outcomes are allowed.`;
  }

  const sorted = sortSummitItems(items).slice(0, SUMMIT_CMS_CARD_MAX);
  for (const item of sorted) {
    validateCmsFieldMax(item.heading, `outcome.${item.id}.heading`, errors);
    validateCmsFieldMax(
      item.description,
      `outcome.${item.id}.description`,
      errors,
    );
  }

  const rawTitle = readTrimmed(
    body.eventOutcomesTitle ??
      body.event_outcomes_title ??
      (isPlainObject(body.eventOutcomes)
        ? body.eventOutcomes.title
        : undefined),
  );
  validateSectionTitle(
    rawTitle,
    'event-outcomes.title',
    sorted.length > 0,
    errors,
  );

  if (Object.keys(errors).length > 0) {
    throwSummitFieldErrors(errors);
  }

  return { title: rawTitle, items: sorted };
}

export function normalizeFocusedAreaSection(body: Record<string, unknown>): {
  title: string;
  cards: SummitFocusAreaRow[];
} {
  const errors: Record<string, string> = {};
  const legacyFlat = extractNestedArray(
    body.areaPoints ?? body.focusedAreaPoints ?? body.focused_area_points,
    [],
  );
  let rawCards = extractNestedArray(
    body.focusedAreas ??
      body.focused_areas ??
      body.focusedArea ??
      body.focused_area,
    ['items', 'cards', 'points'],
  );

  const areaPointsLookLikeCards = legacyFlat.some((entry) => {
    if (!isPlainObject(entry)) return false;
    return (
      extractNestedArray(entry.points, ['items']).length > 0 ||
      extractNestedArray(entry.items, []).length > 0
    );
  });

  if (!rawCards.length && legacyFlat.length) {
    // Admin CMS sends topic cards under `areaPoints` (heading + nested points).
    // Treat those as cards; only use the flat-bullet regrouper for legacy rows.
    rawCards = areaPointsLookLikeCards
      ? legacyFlat
      : (reconstructFocusedAreaCardsFromAreaPoints(legacyFlat) as unknown[]);
  } else if (
    rawCards.length > SUMMIT_CMS_CARD_MAX &&
    shouldRegroupFlatAreaPoints(rawCards)
  ) {
    rawCards = reconstructFocusedAreaCardsFromAreaPoints(rawCards) as unknown[];
  }

  const cards = rawCards
    .map((card, index) => focusCardFromInput(card, index))
    .map((card) => {
      const points = sortSummitItems(card.points ?? []).filter((point) =>
        hasCmsFieldContent(readTrimmed(point.text)),
      );
      return { ...card, points };
    })
    // Drop empty / half-filled draft topic cards from other tabs.
    .filter(
      (card) =>
        hasCmsFieldContent(card.heading) && (card.points?.length ?? 0) > 0,
    );

  if (cards.length > SUMMIT_CMS_CARD_MAX) {
    errors['focused-area.max'] =
      `Maximum ${SUMMIT_CMS_CARD_MAX} focused-area cards are allowed.`;
  }

  const sorted = sortSummitItems(cards).slice(0, SUMMIT_CMS_CARD_MAX);
  for (const card of sorted) {
    validateCmsFieldMax(card.heading, `focus-card.${card.id}.heading`, errors);
    if (card.points.length > SUMMIT_FOCUS_POINTS_MAX) {
      errors[`focus-card.${card.id}.points.max`] =
        `Maximum ${SUMMIT_FOCUS_POINTS_MAX} points are allowed per topic card.`;
    }
    card.points = card.points.slice(0, SUMMIT_FOCUS_POINTS_MAX);
    for (const point of card.points) {
      validateCmsFieldMax(point.text, `focus-point.${point.id}.text`, errors);
    }
  }

  const rawTitle = readTrimmed(
    body.focusedAreaTitle ??
      body.focused_area_title ??
      (isPlainObject(body.focusedArea) ? body.focusedArea.title : undefined) ??
      (isPlainObject(body.focused_area) ? body.focused_area.title : undefined),
  );
  validateSectionTitle(
    rawTitle,
    'focused-area.title',
    sorted.length > 0,
    errors,
  );

  if (Object.keys(errors).length > 0) {
    throwSummitFieldErrors(errors);
  }

  return { title: rawTitle, cards: sorted };
}

export function normalizeAgendaSectionInput(body: Record<string, unknown>): {
  title: string;
  points: SummitAgendaPointRow[];
} {
  const errors: Record<string, string> = {};
  const rawPoints = extractNestedArray(
    body.agendaPoints ??
      (Array.isArray(body.agenda) ? body.agenda : undefined) ??
      (isPlainObject(body.agenda) ? body.agenda.points : undefined) ??
      (isPlainObject(body.agenda) ? body.agenda.items : undefined),
    ['items', 'points'],
  );

  let pointsSource = rawPoints;
  let fromLegacyHtml = false;
  if (
    !pointsSource.length &&
    isPlainObject(body.agenda) &&
    String(body.agenda.content ?? '').trim()
  ) {
    pointsSource = parseAgendaHtmlToTexts(String(body.agenda.content)).map(
      (text) => ({ text }),
    );
    fromLegacyHtml = true;
  }

  const legacyTextOnlyIds = new Set<string>();
  const points: SummitAgendaPointRow[] = pointsSource
    .map((point, index) => {
      const row = cardRowFromInput(point, index);
      const source = (point ?? {}) as Record<string, unknown>;
      const isLegacyTextOnly =
        !readTrimmed(source.heading ?? source.title ?? source.label) &&
        readTrimmed(source.text ?? source.point).length > 0 &&
        source.description === undefined;
      if (fromLegacyHtml || isLegacyTextOnly) {
        legacyTextOnlyIds.add(row.id);
      }
      return {
        ...row,
        text: combineCardText(row.heading, row.description),
      };
    })
    // Drop empty / incomplete draft agenda rows from other tabs.
    .filter((point) => {
      if (legacyTextOnlyIds.has(point.id)) {
        return hasCmsFieldContent(point.description);
      }
      return isCompleteCardRow(point);
    });

  const sorted = sortSummitItems(points);

  for (const point of sorted) {
    if (!legacyTextOnlyIds.has(point.id)) {
      validateCmsFieldMax(
        point.heading,
        `agenda-point.${point.id}.heading`,
        errors,
      );
    }
    validateCmsFieldMax(
      point.description,
      `agenda-point.${point.id}.description`,
      errors,
    );
  }

  const rawTitle = readTrimmed(
    body.agendaTitle ??
      body.agenda_title ??
      (isPlainObject(body.agenda) ? body.agenda.title : undefined),
  );
  validateSectionTitle(rawTitle, 'agenda.title', sorted.length > 0, errors);

  if (Object.keys(errors).length > 0) {
    throwSummitFieldErrors(errors);
  }

  return { title: rawTitle, points: sorted };
}
