/** Known MongoDB _id for the India country document (production). */
export const INDIA_COUNTRY_MONGO_ID = '6998547b14999ba875c7d70c';

export const KNOWN_NON_INDIA_STATE_TO_COUNTRY: Record<string, string> = {
  'new south wales': 'Australia',
  queensland: 'Australia',
  victoria: 'Australia',
  tasmania: 'Australia',
  'western australia': 'Australia',
  'south australia': 'Australia',
  'australian capital territory': 'Australia',
  'northern territory': 'Australia',
  bavaria: 'Germany',
  california: 'United States',
  texas: 'United States',
  'new york': 'United States',
  florida: 'United States',
  ontario: 'Canada',
  quebec: 'Canada',
  dubai: 'United Arab Emirates',
  'abu dhabi': 'United Arab Emirates',
};

/**
 * Returns true when the plant/product belongs to India.
 * If `countryId` (MongoDB ObjectId string) is supplied it is compared directly
 * with the known India Mongo ID — no string guessing needed.
 * Falls back to the country name string when `countryId` is absent.
 */
export function isIndiaCountry(country?: string | null, countryId?: string | null): boolean {
  // ID-first: most reliable
  if (countryId) {
    return String(countryId).trim() === INDIA_COUNTRY_MONGO_ID;
  }
  // Name-based fallback
  if (!country) return true;
  const trimmed = country.trim().toLowerCase();
  if (!trimmed) return true;
  if (trimmed === 'india' || trimmed === 'in' || trimmed === 'ind') return true;
  if (KNOWN_NON_INDIA_STATE_TO_COUNTRY[trimmed]) return false;
  return false;
}

/**
 * Resolves the location region text for certificates.
 * - India   → state name
 * - Non-India → country name
 * Pass `countryId` (MongoDB ObjectId string) for accurate ID-based detection.
 */
export function resolveCertificateRegionName(
  country?: string | null,
  state?: string | null,
  countryId?: string | null,
): string {
  const countryStr = String(country ?? '').trim();
  const stateStr = String(state ?? '').trim();

  if (!isIndiaCountry(countryStr || null, countryId)) {
    // Non-India: prefer explicit country name, then look up via state
    if (countryStr) return countryStr;
    if (stateStr && KNOWN_NON_INDIA_STATE_TO_COUNTRY[stateStr.toLowerCase()]) {
      return KNOWN_NON_INDIA_STATE_TO_COUNTRY[stateStr.toLowerCase()];
    }
    return countryStr;
  }

  // India: show state; fall back to country if state missing
  if (stateStr && KNOWN_NON_INDIA_STATE_TO_COUNTRY[stateStr.toLowerCase()]) {
    // State name actually belongs to a non-Indian country (data inconsistency guard)
    return KNOWN_NON_INDIA_STATE_TO_COUNTRY[stateStr.toLowerCase()];
  }
  return stateStr || countryStr;
}

/**
 * Certificate plant location line used in "Manufactured by X at {location} ...".
 * Prefer structured fields; legacy plantLocation only when structured fields are empty.
 * Non-Indian addresses display Country Name instead of State Name.
 * Pass `countryId` (MongoDB ObjectId string) for accurate ID-based detection.
 */
export function formatCertificatePlantLocation(input: {
  additionalPlantInfo?: string | null;
  city?: string | null;
  stateName?: string | null;
  plantLocation?: string | null;
  countryName?: string | null;
  /** MongoDB ObjectId string of the plant's country — preferred over countryName for India detection. */
  countryId?: string | null;
}): string {
  const additional = String(input.additionalPlantInfo ?? '').trim();
  const city = String(input.city ?? '').trim();
  const state = String(input.stateName ?? '').trim();
  const country = String(input.countryName ?? '').trim();
  const legacy = String(input.plantLocation ?? '').trim();
  const countryId = String(input.countryId ?? '').trim() || null;

  const region = resolveCertificateRegionName(country, state, countryId);

  const structured = [additional, city, region].filter(Boolean);
  let parts = structured.length > 0 ? structured : legacy ? [legacy] : [];

  if (structured.length === 0 && legacy) {
    const isIndia = isIndiaCountry(country || null, countryId);
    const effectiveCountry =
      country || (state && KNOWN_NON_INDIA_STATE_TO_COUNTRY[state.toLowerCase()]);
    if (!isIndia && effectiveCountry) {
      if (state && legacy.toLowerCase().includes(state.toLowerCase())) {
        const escapedState = state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedState}\\b`, 'gi');
        parts = [legacy.replace(regex, effectiveCountry)];
      } else {
        let replaced = false;
        for (const [nonIndiaState, countryForState] of Object.entries(
          KNOWN_NON_INDIA_STATE_TO_COUNTRY,
        )) {
          if (legacy.toLowerCase().includes(nonIndiaState)) {
            const escaped = nonIndiaState.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
            parts = [legacy.replace(regex, countryForState)];
            replaced = true;
            break;
          }
        }
        if (
          !replaced &&
          !legacy.toLowerCase().includes(effectiveCountry.toLowerCase())
        ) {
          parts = [`${legacy}, ${effectiveCountry}`];
        }
      }
    }
  }

  // Ensure any part containing a known non-Indian state name replaces it with Country Name
  // (only applies when this is not an India plant)
  const isIndia = isIndiaCountry(country || null, countryId);
  if (!isIndia) {
    parts = parts.map((part) => {
      let s = part;
      for (const [nonIndiaState, countryForState] of Object.entries(
        KNOWN_NON_INDIA_STATE_TO_COUNTRY,
      )) {
        if (s.toLowerCase().includes(nonIndiaState)) {
          const escaped = nonIndiaState.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
          s = s.replace(regex, countryForState);
          break;
        }
      }
      return s;
    });
  }

  const unique: string[] = [];
  for (const part of parts) {
    const prev = unique[unique.length - 1];
    if (prev && prev.toLowerCase() === part.toLowerCase()) continue;
    unique.push(part);
  }
  return unique.join(', ');
}
