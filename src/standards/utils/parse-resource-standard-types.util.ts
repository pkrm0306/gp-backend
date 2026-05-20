/** Parse standard-type filter from query (single, comma-list, or array). */
export function normalizeResourceStandardTypeList(
  value: unknown,
): string[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  let source: unknown[];
  if (Array.isArray(value)) {
    source = value;
  } else {
    const s = String(value).trim();
    if (s.startsWith('[')) {
      try {
        const parsed = JSON.parse(s) as unknown;
        source = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        source = s.split(',');
      }
    } else {
      source = s.split(',');
    }
  }
  const out = source
    .map((v) => String(v).trim())
    .filter((v) => v.length > 0);
  return out.length > 0 ? out : undefined;
}

export function mergeResourceStandardTypeFilters(input: {
  resource_standard_type?: string;
  resource_standard_types?: string[];
}): string[] {
  const merged: string[] = [];
  const seen = new Set<string>();
  const add = (raw?: string) => {
    const t = String(raw ?? '').trim();
    if (!t) return;
    const key = t.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(t);
  };
  for (const t of input.resource_standard_types ?? []) {
    add(t);
  }
  add(input.resource_standard_type);
  return merged;
}
