/**
 * Merge sector id inputs from multipart / JSON bodies (admin multiselect).
 * Accepts: **sectors** (array or JSON string), repeated **sectors[]**, **sector_ids** / **sectorIds**,
 * optional legacy single **sector**.
 */

export function mergeSectorIdsFromFormObject(obj: unknown): number[] {
  if (!obj || typeof obj !== 'object') {
    return [];
  }
  const o = obj as Record<string, unknown>;
  const out: number[] = [];
  const seen = new Set<number>();

  const pushId = (n: number) => {
    if (!Number.isInteger(n) || n < 1) return;
    if (seen.has(n)) return;
    seen.add(n);
    out.push(n);
  };

  const parseOne = (v: unknown): void => {
    if (v === '' || v === null || v === undefined) return;
    if (typeof v === 'number' && Number.isInteger(v)) {
      pushId(v);
      return;
    }
    const n = parseInt(String(v).trim(), 10);
    if (Number.isFinite(n) && Number.isInteger(n) && n >= 1) {
      pushId(n);
    }
  };

  const consumeArrayLike = (raw: unknown): void => {
    if (raw === undefined || raw === null) return;
    if (Array.isArray(raw)) {
      for (const x of raw) parseOne(x);
      return;
    }
    const s = String(raw).trim();
    if (!s) return;
    if (s.startsWith('[')) {
      try {
        const arr = JSON.parse(s) as unknown;
        if (Array.isArray(arr)) {
          for (const x of arr) parseOne(x);
        }
      } catch {
        /* ignore */
      }
      return;
    }
    for (const part of s
      .split(/[\s,;]+/)
      .map((p) => p.trim())
      .filter(Boolean)) {
      parseOne(part);
    }
  };

  consumeArrayLike(o.sectors);
  consumeArrayLike(o['sectors[]']);
  consumeArrayLike(o.sector_ids);
  consumeArrayLike(o['sector_ids[]']);
  consumeArrayLike(o.sectorIds);
  consumeArrayLike(o['sectorIds[]']);

  if (o.sector !== undefined && o.sector !== null && o.sector !== '') {
    parseOne(
      typeof o.sector === 'number'
        ? o.sector
        : parseInt(String(o.sector).trim(), 10),
    );
  }

  if (o.sector_id !== undefined && o.sector_id !== null && o.sector_id !== '') {
    parseOne(
      typeof o.sector_id === 'number'
        ? o.sector_id
        : parseInt(String(o.sector_id).trim(), 10),
    );
  }

  return out;
}

const SECTOR_ASSIGNMENT_BODY_KEYS = [
  'sector',
  'sector_id',
  'sectors',
  'sectors[]',
  'sector_ids',
  'sector_ids[]',
  'sectorIds',
  'sectorIds[]',
  /** Legacy admin multipart aliases (same numeric ids as sectors). */
  'category_id',
  'category_ids',
  'category_ids[]',
  'categoryIds',
  'categoryIds[]',
] as const;

/** True if the multipart body explicitly includes any sector assignment field. */
export function hasExplicitSectorAssignmentFields(
  body?: Record<string, unknown>,
): boolean {
  if (!body || typeof body !== 'object') {
    return false;
  }
  return SECTOR_ASSIGNMENT_BODY_KEYS.some((k) =>
    Object.prototype.hasOwnProperty.call(body, k),
  );
}
