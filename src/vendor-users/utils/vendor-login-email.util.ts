const ZERO_WIDTH_CHARS = /[\u200B-\u200D\uFEFF]/g;

/** Normalize login identifier: trim, lowercase, strip zero-width characters. */
export function normalizeLoginEmail(raw: unknown): string {
  return String(raw ?? '')
    .replace(ZERO_WIDTH_CHARS, '')
    .trim()
    .toLowerCase();
}

export function splitLoginEmail(email: string): { local: string; domain: string } | null {
  const normalized = normalizeLoginEmail(email);
  const at = normalized.indexOf('@');
  if (at <= 0 || at === normalized.length - 1) {
    return null;
  }
  return {
    local: normalized.slice(0, at),
    domain: normalized.slice(at + 1),
  };
}

/** Levenshtein distance for short domain typo checks at login. */
export function editDistance(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(0),
  );
  for (let i = 0; i < rows; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j < cols; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[rows - 1][cols - 1];
}

const KNOWN_DOMAIN_TYPOS: Record<string, string> = {
  'gmil.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
};

/** True when submitted domain is likely a typo of the registered domain. */
export function isLikelyEmailDomainTypo(
  submittedDomain: string,
  registeredDomain: string,
): boolean {
  const submitted = normalizeLoginEmail(submittedDomain);
  const registered = normalizeLoginEmail(registeredDomain);
  if (!submitted || !registered) {
    return false;
  }
  if (submitted === registered) {
    return true;
  }
  if (KNOWN_DOMAIN_TYPOS[submitted] === registered) {
    return true;
  }
  return editDistance(submitted, registered) <= 2;
}
