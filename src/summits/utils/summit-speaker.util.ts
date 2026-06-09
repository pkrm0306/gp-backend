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
