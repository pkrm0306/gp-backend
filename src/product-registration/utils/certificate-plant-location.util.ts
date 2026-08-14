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

/** Known MongoDB _id for the India country document (production). */
export const INDIA_COUNTRY_MONGO_ID = '6998547b14999ba875c7d70c';

export function isIndiaCountry(
  country?: string | null,
  countryId?: string | null,
): boolean {
  if (countryId) {
    return String(countryId).trim() === INDIA_COUNTRY_MONGO_ID;
  }
  if (!country) return true;
  const trimmed = country.trim().toLowerCase();
  if (!trimmed) return true;
  if (trimmed === 'india' || trimmed === 'in' || trimmed === 'ind') return true;
  if (KNOWN_NON_INDIA_STATE_TO_COUNTRY[trimmed]) return false;
  return false;
}

export function resolveCertificateRegionName(
  country?: string | null,
  state?: string | null,
  countryId?: string | null,
): string {
  const countryStr = String(country ?? '').trim();
  const stateStr = String(state ?? '').trim();

  if (!isIndiaCountry(countryStr || undefined, countryId)) {
    if (countryStr) return countryStr;
    if (stateStr && KNOWN_NON_INDIA_STATE_TO_COUNTRY[stateStr.toLowerCase()]) {
      return KNOWN_NON_INDIA_STATE_TO_COUNTRY[stateStr.toLowerCase()];
    }
    return countryStr;
  }

  if (stateStr && KNOWN_NON_INDIA_STATE_TO_COUNTRY[stateStr.toLowerCase()]) {
    return KNOWN_NON_INDIA_STATE_TO_COUNTRY[stateStr.toLowerCase()];
  }

  return stateStr || countryStr;
}

/**
 * Certificate plant location line used in "Manufactured by X at {location} ...".
 * Prefer structured fields; legacy plantLocation only when structured fields are empty.
 * Non-Indian addresses display country name instead of state name.
 */
export function formatCertificatePlantLocation(input: {
  additionalPlantInfo?: string | null;
  city?: string | null;
  stateName?: string | null;
  plantLocation?: string | null;
  countryName?: string | null;
  countryId?: string | null;
}): string {
  const additional = String(input.additionalPlantInfo ?? '').trim();
  const city = String(input.city ?? '').trim();
  const state = String(input.stateName ?? '').trim();
  const country = String(input.countryName ?? '').trim();
  const legacy = String(input.plantLocation ?? '').trim();
  const countryId = String(input.countryId ?? '').trim() || undefined;

  const region = resolveCertificateRegionName(country, state, countryId);
  const isNonIndia = !isIndiaCountry(country || undefined, countryId);
  const locality =
    city ||
    (isNonIndia && state && region && state.toLowerCase() !== region.toLowerCase()
      ? state
      : '');

  const structured = [additional, locality, region].filter(Boolean);
  let parts = structured.length > 0 ? structured : legacy ? [legacy] : [];

  if (structured.length === 0 && legacy) {
    const effectiveCountry =
      country || (state && KNOWN_NON_INDIA_STATE_TO_COUNTRY[state.toLowerCase()]);
    if (effectiveCountry && !isIndiaCountry(effectiveCountry, countryId)) {
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

  const unique: string[] = [];
  for (const part of parts) {
    const prev = unique[unique.length - 1];
    if (prev && prev.toLowerCase() === part.toLowerCase()) continue;
    unique.push(part);
  }
  return unique.join(', ');
}

/**
 * Final location string for certificate PDF routes.
 * Skips legacy state→country replacement when location already includes the country.
 */
export function finalizeCertificatePreviewLocation(
  locationRaw: string,
  options: { countryName?: string; stateName?: string; countryId?: string },
): string {
  const countryName = String(options.countryName ?? '').trim();
  const stateName = String(options.stateName ?? '').trim();
  const countryId = options.countryId;
  const location = String(locationRaw ?? '').trim();
  if (!location) return location;

  const effectiveCountry =
    countryName || (stateName && KNOWN_NON_INDIA_STATE_TO_COUNTRY[stateName.toLowerCase()]);

  if (
    effectiveCountry &&
    !isIndiaCountry(effectiveCountry, countryId) &&
    location.toLowerCase().includes(effectiveCountry.toLowerCase())
  ) {
    return location;
  }

  if (!isIndiaCountry(effectiveCountry || undefined, countryId) && effectiveCountry) {
    if (stateName && location.toLowerCase().includes(stateName.toLowerCase())) {
      const escapedState = stateName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedState}\\b`, 'gi');
      return location.replace(regex, effectiveCountry);
    }

    let replaced = false;
    for (const [nonIndiaState, countryForState] of Object.entries(
      KNOWN_NON_INDIA_STATE_TO_COUNTRY,
    )) {
      if (location.toLowerCase().includes(nonIndiaState)) {
        const escaped = nonIndiaState.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        return location.replace(regex, String(countryForState));
      }
    }
    if (!location.toLowerCase().includes(effectiveCountry.toLowerCase())) {
      return `${location}, ${effectiveCountry}`;
    }
    return location;
  }

  for (const [nonIndiaState, countryForState] of Object.entries(
    KNOWN_NON_INDIA_STATE_TO_COUNTRY,
  )) {
    if (location.toLowerCase().includes(nonIndiaState)) {
      const escaped = nonIndiaState.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      return location.replace(regex, String(countryForState));
    }
  }

  return location;
}
