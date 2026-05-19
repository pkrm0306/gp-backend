export function normalizeNumberArray(value: unknown): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const source = Array.isArray(value) ? value : String(value).split(',');
  const parsed = source
    .map((v) => Number(String(v).trim()))
    .filter((v) => Number.isFinite(v));
  return parsed.length > 0 ? parsed : undefined;
}

/** UI labels from verified-manufacturers status multiselect. */
export function normalizeStatusLabels(
  value: unknown,
): Array<'active' | 'inactive'> | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const source = Array.isArray(value) ? value : String(value).split(',');
  const out = new Set<'active' | 'inactive'>();
  for (const raw of source) {
    const v = String(raw).trim().toLowerCase();
    if (v === 'active' || v === '1' || v === 'on') {
      out.add('active');
    } else if (v === 'inactive' || v === '0' || v === 'off' || v === '2') {
      out.add('inactive');
    }
  }
  return out.size > 0 ? [...out] : undefined;
}

/**
 * Mongo filter for vendor Active/Inactive (matches list `statusToggle`: On iff vendor_status === 1).
 * Inactive uses `$ne: 1` so rows with vendor_status 0, 2, null, or missing are included.
 */
type VendorStatusQuery = {
  vendor_status?: number;
  vendor_status_list?: number[];
  status?: Array<'active' | 'inactive'>;
};

type ScopeQuery = {
  scope?: 'verified' | 'unverified' | 'all';
  manufacturerStatus?: number;
};

export function resolveVendorStatusFilter(
  query: VendorStatusQuery,
): Record<string, unknown> | null {
  const labels = query.status;
  if (labels?.length) {
    const wantsActive = labels.includes('active');
    const wantsInactive = labels.includes('inactive');
    if (wantsActive && wantsInactive) {
      return null;
    }
    if (wantsActive) {
      return { vendor_status: 1 };
    }
    if (wantsInactive) {
      return { vendor_status: { $ne: 1 } };
    }
  }

  const fromNumeric =
    query.vendor_status_list?.length
      ? query.vendor_status_list
      : query.vendor_status !== undefined
        ? [query.vendor_status]
        : undefined;

  if (!fromNumeric?.length) {
    return null;
  }
  const codes = fromNumeric.filter((n) => [0, 1, 2].includes(n));
  if (!codes.length) {
    return null;
  }
  if (codes.length === 1) {
    return { vendor_status: codes[0] };
  }
  return { vendor_status: { $in: codes } };
}

export function resolveManufacturerScopeFilter(
  query: ScopeQuery,
): Record<string, unknown> | null {
  const scope = query.scope ?? 'all';
  if (scope === 'verified') {
    return { manufacturerStatus: 1 };
  }
  if (scope === 'unverified') {
    return { manufacturerStatus: { $in: [0, 2] } };
  }
  if (query.manufacturerStatus !== undefined) {
    return { manufacturerStatus: query.manufacturerStatus };
  }
  return null;
}
