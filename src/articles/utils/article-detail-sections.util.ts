import { BadRequestException } from '@nestjs/common';

export const ARTICLE_WHATS_INSIDE_MAX = 20;
export const ARTICLE_WHATS_INSIDE_ITEM_MAX = 50;
export const ARTICLE_KEY_POINTS_MAX = 12;
export const ARTICLE_KEY_POINT_HEADING_MAX = 80;
export const ARTICLE_KEY_POINT_DESCRIPTION_MAX = 400;
export const ARTICLE_WHO_ITS_FOR_MAX = 20;
export const ARTICLE_WHO_ITS_FOR_ITEM_MAX = 100;
export const ARTICLE_TAGS_MAX = 20;
export const ARTICLE_TAG_ITEM_MAX = 40;

export type ArticleKeyPointRow = {
  heading: string;
  description: string;
};

function readTrim(value: unknown): string {
  return String(value ?? '').trim();
}

function parseArrayRaw(raw: unknown, fieldName: string): unknown[] {
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
      throw new BadRequestException(`${fieldName} must be a valid JSON array`);
    }
  }
  if (Array.isArray(raw)) {
    return raw;
  }
  if (typeof raw === 'object') {
    return [raw];
  }
  throw new BadRequestException(`${fieldName} must be an array`);
}

function normalizeStringList(
  raw: unknown,
  options: {
    fieldName: string;
    maxItems: number;
    maxItemLength: number;
  },
): string[] {
  const items = parseArrayRaw(raw, options.fieldName);
  const errors: Record<string, string> = {};
  const out: string[] = [];

  items.forEach((item, index) => {
    const text =
      typeof item === 'string' || typeof item === 'number'
        ? readTrim(item)
        : readTrim(
            (item as Record<string, unknown>)?.text ??
              (item as Record<string, unknown>)?.label ??
              (item as Record<string, unknown>)?.value,
          );
    if (!text) {
      return;
    }
    if (text.length > options.maxItemLength) {
      errors[`${options.fieldName}[${index}]`] =
        `Maximum ${options.maxItemLength} characters are allowed.`;
    }
    out.push(text);
  });

  if (out.length > options.maxItems) {
    errors[`${options.fieldName}.max`] =
      `Maximum ${options.maxItems} items are allowed.`;
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

/** Validate and normalize "What's inside" bullets (max 50 chars each). */
export function normalizeWhatsInsideInput(
  raw: unknown,
): string[] | undefined {
  if (raw === undefined) return undefined;
  return normalizeStringList(raw, {
    fieldName: 'whatsInside',
    maxItems: ARTICLE_WHATS_INSIDE_MAX,
    maxItemLength: ARTICLE_WHATS_INSIDE_ITEM_MAX,
  });
}

/** Validate and normalize key points (heading + description). */
export function normalizeKeyPointsInput(
  raw: unknown,
): ArticleKeyPointRow[] | undefined {
  if (raw === undefined) return undefined;
  const items = parseArrayRaw(raw, 'keyPoints');
  const errors: Record<string, string> = {};
  const out: ArticleKeyPointRow[] = [];

  items.forEach((item, index) => {
    const rec = (item ?? {}) as Record<string, unknown>;
    const heading = readTrim(
      rec.heading ?? rec.title ?? rec.label ?? rec.name,
    );
    const description = readTrim(
      rec.description ?? rec.text ?? rec.body ?? rec.detail,
    );
    const prefix = `keyPoints[${index}]`;

    if (!heading && !description) {
      return;
    }

    if (!heading) {
      errors[`${prefix}.heading`] = 'Key point heading is required.';
    } else if (heading.length > ARTICLE_KEY_POINT_HEADING_MAX) {
      errors[`${prefix}.heading`] =
        `Maximum ${ARTICLE_KEY_POINT_HEADING_MAX} characters are allowed.`;
    }

    if (!description) {
      errors[`${prefix}.description`] = 'Key point description is required.';
    } else if (description.length > ARTICLE_KEY_POINT_DESCRIPTION_MAX) {
      errors[`${prefix}.description`] =
        `Maximum ${ARTICLE_KEY_POINT_DESCRIPTION_MAX} characters are allowed.`;
    }

    out.push({ heading, description });
  });

  if (out.length > ARTICLE_KEY_POINTS_MAX) {
    errors['keyPoints.max'] =
      `Maximum ${ARTICLE_KEY_POINTS_MAX} key points are allowed.`;
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

/** Validate and normalize "Who it's for" audience list. */
export function normalizeWhoItsForInput(
  raw: unknown,
): string[] | undefined {
  if (raw === undefined) return undefined;
  return normalizeStringList(raw, {
    fieldName: 'whoItsFor',
    maxItems: ARTICLE_WHO_ITS_FOR_MAX,
    maxItemLength: ARTICLE_WHO_ITS_FOR_ITEM_MAX,
  });
}

/** Validate and normalize tags. */
export function normalizeTagsInput(raw: unknown): string[] | undefined {
  if (raw === undefined) return undefined;
  return normalizeStringList(raw, {
    fieldName: 'tags',
    maxItems: ARTICLE_TAGS_MAX,
    maxItemLength: ARTICLE_TAG_ITEM_MAX,
  });
}

export function mapWhatsInsideFromDoc(doc: {
  whatsInside?: string[];
}): string[] {
  return Array.isArray(doc.whatsInside)
    ? doc.whatsInside.map((v) => readTrim(v)).filter(Boolean)
    : [];
}

export function mapKeyPointsFromDoc(doc: {
  keyPoints?: Array<{ heading?: string; description?: string }>;
}): ArticleKeyPointRow[] {
  return Array.isArray(doc.keyPoints)
    ? doc.keyPoints
        .map((item) => ({
          heading: readTrim(item?.heading),
          description: readTrim(item?.description),
        }))
        .filter((item) => item.heading || item.description)
    : [];
}

export function mapWhoItsForFromDoc(doc: { whoItsFor?: string[] }): string[] {
  return Array.isArray(doc.whoItsFor)
    ? doc.whoItsFor.map((v) => readTrim(v)).filter(Boolean)
    : [];
}

export function mapTagsFromDoc(doc: { tags?: string[] }): string[] {
  return Array.isArray(doc.tags)
    ? doc.tags.map((v) => readTrim(v)).filter(Boolean)
    : [];
}
