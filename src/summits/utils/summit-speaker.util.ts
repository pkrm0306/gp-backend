/** Max characters for speaker key point plain text (admin form). */
export const SUMMIT_SPEAKER_KEY_POINT_MAX_LENGTH = 75;

/** Normalize speaker tag chips from array or comma-separated string. */
export function normalizeSpeakerTags(raw: unknown): string[] {
  if (raw === undefined || raw === null) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((t) => String(t).trim())
      .filter((t) => t.length > 0);
  }
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }
  return [];
}

export function normalizeSpeakerKeyPoint(raw: unknown): string {
  return String(raw ?? '')
    .trim()
    .slice(0, SUMMIT_SPEAKER_KEY_POINT_MAX_LENGTH);
}

/** Split legacy combined `sub` into designation + organisation. */
export function splitSpeakerSubField(sub: string): {
  designation: string;
  organisation: string;
} {
  const trimmed = String(sub ?? '').trim();
  if (!trimmed) return { designation: '', organisation: '' };

  const doubleSpace = trimmed.match(/\s{2,}/);
  if (doubleSpace?.index != null && doubleSpace.index > 0) {
    return {
      designation: trimmed.slice(0, doubleSpace.index).trim(),
      organisation: trimmed.slice(doubleSpace.index).replace(/\s+/g, ' ').trim(),
    };
  }

  const newline = trimmed.indexOf('\n');
  if (newline >= 0) {
    return {
      designation: trimmed.slice(0, newline).trim(),
      organisation: trimmed.slice(newline + 1).replace(/\s+/g, ' ').trim(),
    };
  }

  return { designation: trimmed, organisation: '' };
}

export function resolveSpeakerDesignationAndOrganisation(item: {
  designation?: unknown;
  organisation?: unknown;
  organization?: unknown;
  sub?: unknown;
}): { designation: string; organisation: string } {
  let designation = String(item.designation ?? '').trim();
  let organisation = String(
    item.organisation ?? item.organization ?? '',
  ).trim();
  const sub = String(item.sub ?? '').trim();

  if (!designation && !organisation && sub) {
    const split = splitSpeakerSubField(sub);
    designation = split.designation;
    organisation = split.organisation;
  } else if (!designation && sub) {
    designation = sub;
  }

  return { designation, organisation };
}
