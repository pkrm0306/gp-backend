/**
 * Manufacturer initials + internal ID (gpInternalId) helpers.
 * Initials: 2-letter candidates from the manufacturer name (unchanged).
 * New internal IDs: `GPSC-<suffix>` (000–999 zero-padded, then 1000–9999).
 * Legacy stored ids remain `GP<INI>-###` and are never rewritten.
 */

const LETTER = /[A-Za-z]/;

function letterChar(ch: string | undefined): string | null {
  if (!ch || !LETTER.test(ch)) return null;
  return ch.toUpperCase();
}

/** Collapse whitespace; trim. */
export function normalizeManufacturerName(name: string): string {
  return String(name ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Split display name into word tokens (letters/digits grouped; skip pure punctuation).
 */
export function tokenizeManufacturerName(normalizedName: string): string[] {
  const s = normalizeManufacturerName(normalizedName);
  if (!s) return [];
  return s.match(/[A-Za-z0-9]+/g) ?? [];
}

/**
 * Ordered 2-letter uppercase candidates: first letter of word1 fixed;
 * second letter cycles through word2, then rest of word1, then further words' first letters, then A–Z.
 */
export function generateInitial(manufacturerName: string): readonly string[] {
  const name = normalizeManufacturerName(manufacturerName);
  const words = tokenizeManufacturerName(name);
  const out: string[] = [];

  if (words.length === 0) {
    return out;
  }

  const w1 = words[0];
  const c1 = letterChar(w1[0]);
  if (!c1) {
    return out;
  }

  const push = (second: string | null) => {
    if (!second) return;
    const pair = `${c1}${second}`;
    if (pair.length === 2 && !out.includes(pair)) {
      out.push(pair);
    }
  };

  if (words.length >= 2) {
    const w2 = words[1];
    for (let i = 0; i < w2.length; i++) {
      push(letterChar(w2[i]));
    }
  }

  for (let j = 1; j < w1.length; j++) {
    push(letterChar(w1[j]));
  }

  for (let wi = 2; wi < words.length; wi++) {
    const wx = words[wi];
    const fc = letterChar(wx[0]);
    push(fc);
  }

  for (let code = 'A'.charCodeAt(0); code <= 'Z'.charCodeAt(0); code++) {
    push(String.fromCharCode(code));
  }

  return out;
}

/**
 * Numeric suffix from a **GPSC-** manufacturer id only (`GPSC-000` … `GPSC-9999`).
 * Legacy `GPXX-###` ids are ignored so the GPSC sequence stays consecutive.
 */
export function parseGpscNumericSuffix(
  gpInternalId: string | undefined,
): number | null {
  const id = String(gpInternalId ?? '').trim().toUpperCase();
  const m = /^GPSC-(\d{1,4})$/.exec(id);
  if (!m) {
    return null;
  }
  const v = Number.parseInt(m[1], 10);
  if (!Number.isFinite(v) || v < 0 || v > 9999) {
    return null;
  }
  return v;
}

/**
 * Numeric suffix after the last `-` in a `GP..` internal id: **1–999** (three-digit form)
 * or **1000–9999** (four-digit form). Returns `null` if not parseable.
 * Prefer {@link parseGpscNumericSuffix} when allocating new GPSC ids.
 */
export function parseGpInternalNumericSuffix(
  gpInternalId: string | undefined,
): number | null {
  const gpsc = parseGpscNumericSuffix(gpInternalId);
  if (gpsc != null) {
    return gpsc;
  }
  const id = String(gpInternalId ?? '').trim().toUpperCase();
  const m = /-(\d{3,4})$/.exec(id);
  if (!m) {
    return null;
  }
  const digits = m[1];
  const v = parseInt(digits, 10);
  if (!Number.isFinite(v)) {
    return null;
  }
  if (digits.length === 3) {
    if (v >= 1 && v <= 999) {
      return v;
    }
    return null;
  }
  if (digits.length === 4) {
    if (v >= 1000 && v <= 9999) {
      return v;
    }
    if (v >= 1 && v <= 999) {
      return v;
    }
    return null;
  }
  return null;
}

/**
 * Builds `GPSC-<suffix>` for newly verified manufacturers.
 * Initials are stored separately and are not part of this id.
 */
export function generateInternalId(
  _manufacturerInitial: string,
  suffixNumber: number,
): string {
  if (!Number.isInteger(suffixNumber)) {
    throw new Error(
      'generateInternalId: suffixNumber must be an integer from 0 to 9999',
    );
  }
  if (suffixNumber >= 0 && suffixNumber <= 999) {
    const n = String(suffixNumber).padStart(3, '0');
    return `GPSC-${n}`;
  }
  if (suffixNumber >= 1000 && suffixNumber <= 9999) {
    return `GPSC-${suffixNumber}`;
  }
  throw new Error(
    'generateInternalId: suffixNumber must be between 0 and 9999 (use 000–999 then 1000–9999)',
  );
}

/** True if existing stored id is already a canonical GPSC id. */
export function internalIdMatchesInitial(
  gpInternalId: string | undefined,
  _manufacturerInitial: string,
): boolean {
  const id = String(gpInternalId ?? '').trim().toUpperCase();
  const re = /^GPSC-(?:\d{3}|[1-9]\d{3})$/;
  if (!re.test(id)) {
    return false;
  }
  const n = parseGpscNumericSuffix(id);
  if (n == null) {
    return false;
  }
  return id === generateInternalId('SC', n);
}
