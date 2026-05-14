/**
 * Manufacturer initials + internal ID (gpInternalId) helpers.
 * Internal ID format: `GP<INITIAL>-<suffix>` where suffix is:
 * - **001–999** (always three digits, zero-padded), then
 * - **1000–9999** (four digits, no leading zeros) after every value 1–999 is in use.
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
 * Numeric suffix after the last `-` in a `GP..` internal id: **1–999** (three-digit form)
 * or **1000–9999** (four-digit form). Returns `null` if not parseable.
 */
export function parseGpInternalNumericSuffix(
  gpInternalId: string | undefined,
): number | null {
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
 * Builds `GP<INITIAL>-<suffix>`: **001–999** zero-padded; **1000–9999** as plain digits.
 */
export function generateInternalId(
  manufacturerInitial: string,
  suffixNumber: number,
): string {
  const ini = String(manufacturerInitial ?? '').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(ini)) {
    throw new Error(
      'generateInternalId: manufacturerInitial must be exactly 2 letters',
    );
  }
  if (!Number.isInteger(suffixNumber)) {
    throw new Error(
      'generateInternalId: suffixNumber must be an integer from 1 to 9999',
    );
  }
  if (suffixNumber >= 1 && suffixNumber <= 999) {
    const n = String(suffixNumber).padStart(3, '0');
    return `GP${ini}-${n}`;
  }
  if (suffixNumber >= 1000 && suffixNumber <= 9999) {
    return `GP${ini}-${suffixNumber}`;
  }
  throw new Error(
    'generateInternalId: suffixNumber must be between 1 and 9999 (use 001–999 then 1000–9999)',
  );
}

/** True if existing stored id already matches GP<initial>-(###|####) for the resolved initial. */
export function internalIdMatchesInitial(
  gpInternalId: string | undefined,
  manufacturerInitial: string,
): boolean {
  const id = String(gpInternalId ?? '').trim().toUpperCase();
  const ini = String(manufacturerInitial ?? '').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(ini)) {
    return false;
  }
  const escaped = ini.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^GP${escaped}-(?:\\d{3}|[1-9]\\d{3})$`);
  if (!re.test(id)) {
    return false;
  }
  const n = parseGpInternalNumericSuffix(id);
  if (n == null) {
    return false;
  }
  return id === generateInternalId(ini, n);
}
