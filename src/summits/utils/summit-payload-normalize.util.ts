import {
  normalizeSpeakerKeyPoint,
  normalizeSpeakerTags,
} from './summit-speaker.util';

/** Strip removed banner fields (title, subtitle) from client payloads. */
export function normalizeSummitBannersInput(raw: unknown): unknown {
  if (!Array.isArray(raw)) return raw;
  return raw.map((item) => {
    if (!item || typeof item !== 'object') return item;
    const row = item as Record<string, unknown>;
    const { title: _t, subtitle: _s, ...rest } = row;
    return rest;
  });
}

function speakerTagArraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

/** Keep speaker key point text and tag pills as separate persisted fields. */
export function normalizeSummitSpeakersInput(raw: unknown): unknown {
  if (!Array.isArray(raw)) return raw;
  return raw.map((item) => {
    if (!item || typeof item !== 'object') return item;
    const row = item as Record<string, unknown>;
    const { keyPoints, keyPoint, tags, image, imageUrl, photo, photoUrl, ...rest } = row;
    const normalizedTags = normalizeSpeakerTags(tags);
    let normalizedKeyPoint = normalizeSpeakerKeyPoint(keyPoint);

    if (!normalizedKeyPoint && keyPoints !== undefined) {
      const legacyKeyPoints = normalizeSpeakerTags(keyPoints);
      if (legacyKeyPoints.length === 1) {
        const candidate = normalizeSpeakerKeyPoint(legacyKeyPoints[0]);
        if (
          candidate !== normalizedTags.join(' ') &&
          !speakerTagArraysEqual(legacyKeyPoints, normalizedTags)
        ) {
          normalizedKeyPoint = candidate;
        }
      } else if (
        legacyKeyPoints.length > 1 &&
        !speakerTagArraysEqual(legacyKeyPoints, normalizedTags)
      ) {
        normalizedKeyPoint = normalizeSpeakerKeyPoint(legacyKeyPoints[0]);
      }
    }

    if (
      normalizedKeyPoint &&
      normalizedTags.length > 0 &&
      (normalizedKeyPoint === normalizedTags.join(' ') ||
        speakerTagArraysEqual(normalizeSpeakerTags([normalizedKeyPoint]), normalizedTags))
    ) {
      normalizedKeyPoint = '';
    }

    return {
      ...rest,
      imageUrl: String(imageUrl ?? image ?? photoUrl ?? photo ?? '').trim(),
      keyPoint: normalizedKeyPoint,
      tags: normalizedTags,
    };
  });
}

/** Top-level PATCH body cleanup before validation. */
export function normalizeSummitPatchPayload(body: unknown): unknown {
  if (!body || typeof body !== 'object') return body;
  const payload = { ...(body as Record<string, unknown>) };
  if (payload.banners !== undefined) {
    payload.banners = normalizeSummitBannersInput(payload.banners);
  }
  if (payload.speakers !== undefined) {
    payload.speakers = normalizeSummitSpeakersInput(payload.speakers);
  }
  return payload;
}
