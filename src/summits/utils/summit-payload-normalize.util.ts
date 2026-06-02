import { normalizeSpeakerTags } from './summit-speaker.util';

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

/** Map frontend `keyPoints` → `tags`; strip unknown speaker keys. */
export function normalizeSummitSpeakersInput(raw: unknown): unknown {
  if (!Array.isArray(raw)) return raw;
  return raw.map((item) => {
    if (!item || typeof item !== 'object') return item;
    const row = item as Record<string, unknown>;
    const { keyPoints, tags, ...rest } = row;
    return {
      ...rest,
      tags: normalizeSpeakerTags(tags ?? keyPoints),
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
