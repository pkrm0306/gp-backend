import { BadRequestException } from '@nestjs/common';

export const EVENT_BROCHURES_MAX = 20;
export const EVENT_BROCHURE_HEADING_MAX = 200;
export const EVENT_BROCHURE_LINK_MAX = 2048;

export type EventBrochureRow = {
  heading: string;
  link: string;
};

function readTrim(value: unknown): string {
  return String(value ?? '').trim();
}

function parseBrochuresRaw(raw: unknown): unknown[] {
  if (raw === undefined || raw === null) {
    return [];
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && typeof parsed === 'object') {
        return [parsed];
      }
      throw new Error('invalid');
    } catch {
      throw new BadRequestException('brochures must be a valid JSON array');
    }
  }
  if (Array.isArray(raw)) {
    return raw;
  }
  if (typeof raw === 'object') {
    return [raw];
  }
  throw new BadRequestException('brochures must be an array');
}

/** Validate and normalize brochures from admin create/update payloads. */
export function normalizeEventBrochuresInput(raw: unknown): EventBrochureRow[] {
  const items = parseBrochuresRaw(raw);
  const errors: Record<string, string> = {};
  const out: EventBrochureRow[] = [];

  items.forEach((item, index) => {
    const rec = (item ?? {}) as Record<string, unknown>;
    const heading = readTrim(rec.heading ?? rec.title ?? rec.name);
    const link = readTrim(
      rec.link ?? rec.url ?? rec.brochureLink ?? rec.brochure_link,
    );
    const prefix = `brochures[${index}]`;

    if (!heading && !link) {
      return;
    }

    if (!heading) {
      errors[`${prefix}.heading`] = 'Brochure heading is required.';
    } else if (heading.length > EVENT_BROCHURE_HEADING_MAX) {
      errors[`${prefix}.heading`] =
        `Maximum ${EVENT_BROCHURE_HEADING_MAX} characters are allowed.`;
    }

    if (!link) {
      errors[`${prefix}.link`] = 'Brochure link is required.';
    } else if (link.length > EVENT_BROCHURE_LINK_MAX) {
      errors[`${prefix}.link`] =
        `Maximum ${EVENT_BROCHURE_LINK_MAX} characters are allowed.`;
    }

    out.push({ heading, link });
  });

  if (out.length > EVENT_BROCHURES_MAX) {
    errors['brochures.max'] =
      `Maximum ${EVENT_BROCHURES_MAX} brochures are allowed.`;
  }

  if (Object.keys(errors).length > 0) {
    throw new BadRequestException({
      message: 'Validation failed',
      fieldErrors: errors,
      errors,
    });
  }

  return out;
}

/** Read brochures from stored event doc, migrating legacy single `brochureLink`. */
export function mapEventBrochuresFromDoc(doc: {
  brochures?: Array<{ heading?: string; link?: string }>;
  brochureLink?: string;
}): EventBrochureRow[] {
  const stored = Array.isArray(doc.brochures) ? doc.brochures : [];
  const rows = stored
    .map((item) => ({
      heading: readTrim(item.heading),
      link: readTrim(item.link),
    }))
    .filter((item) => item.heading || item.link);

  if (rows.length > 0) {
    return rows;
  }

  const legacyLink = readTrim(doc.brochureLink);
  if (legacyLink) {
    return [{ heading: 'Brochure', link: legacyLink }];
  }

  return [];
}

export function primaryEventBrochureLink(
  brochures: EventBrochureRow[],
): string | undefined {
  const first = brochures.find((item) => readTrim(item.link));
  return first ? readTrim(first.link) : undefined;
}
