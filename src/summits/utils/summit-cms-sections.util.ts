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

function validateRequiredField(
  value: string,
  fieldKey: string,
  label: string,
  errors: Record<string, string>,
): void {
  if (!value) {
    errors[fieldKey] = `${label} is required.`;
    return;
  }
  if (value.length < SUMMIT_CMS_FIELD_MIN) {
    errors[fieldKey] = `Minimum ${SUMMIT_CMS_FIELD_MIN} characters are required.`;
    return;
  }
  if (value.length > SUMMIT_CMS_FIELD_MAX) {
    errors[fieldKey] = `Maximum ${SUMMIT_CMS_FIELD_MAX} characters are allowed.`;
  }
}

function cardRowFromInput(
  item: unknown,
  index: number,
): { id: string; sortOrder: number; heading: string; description: string } {
  const source = (item ?? {}) as Record<string, unknown>;
  const legacyText = readTrimmed(source.text ?? source.point);
  const heading = readTrimmed(source.heading ?? source.title ?? source.label);
  const description = readTrimmed(source.description ?? source.text ?? source.point);
  return {
    id: ensureItemId(source.id as string | undefined),
    sortOrder:
      typeof source.sortOrder === 'number' ? source.sortOrder : index,
    heading,
    description: description || legacyText,
  };
}

function pointRowFromInput(
  item: unknown,
  index: number,
): SummitFocusPointRow {
  const source = (item ?? {}) as Record<string, unknown>;
  return {
    id: ensureItemId(source.id as string | undefined),
    sortOrder:
      typeof source.sortOrder === 'number' ? source.sortOrder : index,
    text: readTrimmed(
      source.text ?? source.point ?? source.description ?? source.label,
    ),
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
      points: stored.map((point, index) => ({
        id: ensureItemId(point.id),
        sortOrder: point.sortOrder ?? index,
        text: readTrimmed(point.text),
      })),
    };
  }

  const parsed = parseAgendaHtmlToTexts(doc.agenda?.content ?? '');
  return {
    title,
    points: parsed.map((text, index) => ({
      id: new Types.ObjectId().toString(),
      sortOrder: index,
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
  const items = rawItems.map((item, index) => cardRowFromInput(item, index));

  if (items.length > SUMMIT_CMS_CARD_MAX) {
    errors['highlights.max'] = `Maximum ${SUMMIT_CMS_CARD_MAX} highlights are allowed.`;
  }

  const sorted = sortSummitItems(items).slice(0, SUMMIT_CMS_CARD_MAX);
  for (const item of sorted) {
    validateRequiredField(
      item.heading,
      `highlight.${item.id}.heading`,
      'Highlight heading',
      errors,
    );
    validateRequiredField(
      item.description,
      `highlight.${item.id}.description`,
      'Highlight description',
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
  const items = rawItems.map((item, index) => cardRowFromInput(item, index));

  if (items.length > SUMMIT_CMS_CARD_MAX) {
    errors['event-outcomes.max'] =
      `Maximum ${SUMMIT_CMS_CARD_MAX} event outcomes are allowed.`;
  }

  const sorted = sortSummitItems(items).slice(0, SUMMIT_CMS_CARD_MAX);
  for (const item of sorted) {
    validateRequiredField(
      item.heading,
      `outcome.${item.id}.heading`,
      'Outcome heading',
      errors,
    );
    validateRequiredField(
      item.description,
      `outcome.${item.id}.description`,
      'Outcome description',
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
  let rawCards = extractNestedArray(
    body.focusedAreas ??
      body.focused_areas ??
      body.focusedArea ??
      body.focused_area,
    ['items', 'cards', 'points'],
  );

  if (!rawCards.length) {
    const legacyFlat = extractNestedArray(
      body.areaPoints ?? body.focusedAreaPoints ?? body.focused_area_points,
      [],
    );
    if (legacyFlat.length) {
      rawCards = legacyFlat.map((point, index) => {
        const text = readTrimmed(
          (point as Record<string, unknown>)?.text ??
            (point as Record<string, unknown>)?.point,
        );
        return {
          id: ensureItemId((point as Record<string, unknown>)?.id as string),
          sortOrder:
            typeof (point as Record<string, unknown>)?.sortOrder === 'number'
              ? ((point as Record<string, unknown>).sortOrder as number)
              : index,
          heading: text.slice(0, SUMMIT_CMS_FIELD_MAX) || `Topic ${index + 1}`,
          points: [{ text }],
        };
      });
    }
  }

  const cards = rawCards.map((card, index) => {
    const source = (card ?? {}) as Record<string, unknown>;
    const rawPoints = extractNestedArray(source.points, ['items']);
    return {
      id: ensureItemId(source.id as string | undefined),
      sortOrder:
        typeof source.sortOrder === 'number' ? source.sortOrder : index,
      heading: readTrimmed(source.heading ?? source.title ?? source.label),
      points: rawPoints.map((point, pointIndex) =>
        pointRowFromInput(point, pointIndex),
      ),
    };
  });

  if (cards.length > SUMMIT_CMS_CARD_MAX) {
    errors['focused-area.max'] =
      `Maximum ${SUMMIT_CMS_CARD_MAX} focused-area cards are allowed.`;
  }

  const sorted = sortSummitItems(cards).slice(0, SUMMIT_CMS_CARD_MAX);
  for (const card of sorted) {
    validateRequiredField(
      card.heading,
      `focus-card.${card.id}.heading`,
      'Topic heading',
      errors,
    );

    if (card.points.length === 0) {
      errors[`focus-card.${card.id}.points.min`] =
        'At least 1 point is required per topic card.';
    }
    if (card.points.length > SUMMIT_FOCUS_POINTS_MAX) {
      errors[`focus-card.${card.id}.points.max`] =
        `Maximum ${SUMMIT_FOCUS_POINTS_MAX} points are allowed per topic card.`;
    }

    const sortedPoints = sortSummitItems(card.points).slice(
      0,
      SUMMIT_FOCUS_POINTS_MAX,
    );
    for (const point of sortedPoints) {
      validateRequiredField(
        point.text,
        `focus-point.${point.id}.text`,
        'Point text',
        errors,
      );
    }
    card.points = sortedPoints;
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
      (isPlainObject(body.agenda) ? body.agenda.points : undefined) ??
      (isPlainObject(body.agenda) ? body.agenda.items : undefined),
    ['items', 'points'],
  );

  let pointsSource = rawPoints;
  if (
    !pointsSource.length &&
    isPlainObject(body.agenda) &&
    String(body.agenda.content ?? '').trim()
  ) {
    pointsSource = parseAgendaHtmlToTexts(String(body.agenda.content)).map(
      (text) => ({ text }),
    );
  }

  const points = pointsSource.map((point, index) =>
    pointRowFromInput(point, index),
  );
  const sorted = sortSummitItems(points);

  for (const point of sorted) {
    validateRequiredField(
      point.text,
      `agenda-point.${point.id}.text`,
      'Agenda point',
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
