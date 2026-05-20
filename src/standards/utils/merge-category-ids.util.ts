/**
 * Merge category id inputs from multipart / JSON bodies (admin parity).
 * Accepts: category_ids (array or JSON string), categoryIds (JSON array string or comma list),
 * legacy category_id (single). Order preserved, duplicates removed (first occurrence wins).
 */
export function mergeCategoryIdsFromFormObject(obj: unknown): number[] {
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
    for (const part of s.split(/[\s,;]+/).map((p) => p.trim()).filter(Boolean)) {
      parseOne(part);
    }
  };

  consumeArrayLike(o.category_ids);
  consumeArrayLike((o as Record<string, unknown>)['category_ids[]']);
  consumeArrayLike(o.categoryIds);
  consumeArrayLike((o as Record<string, unknown>)['categoryIds[]']);

  if (o.category_id !== undefined && o.category_id !== null && o.category_id !== '') {
    parseOne(
      typeof o.category_id === 'number'
        ? o.category_id
        : parseInt(String(o.category_id).trim(), 10),
    );
  }

  return out;
}

/**
 * True when the body sends **only** category assignment fields (misuse).
 * Admin UI may send `category_ids` as a legacy alias alongside `sectors` — ignore in that case.
 */
export function hasExplicitCategoryIdFields(
  body: Record<string, unknown> | undefined,
): boolean {
  if (!body || mergeCategoryIdsFromFormObject(body).length === 0) {
    return false;
  }
  const keys = Object.keys(body);
  const hasSectorAlias = keys.some((k) =>
    /^(sectors(\[\])?|sector_ids(\[\])?|sectorIds(\[\])?|sector_id|sector)$/i.test(
      k,
    ),
  );
  return !hasSectorAlias;
}
