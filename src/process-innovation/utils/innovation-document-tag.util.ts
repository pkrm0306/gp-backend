export type InnovationDocumentTag = 'tech' | 'process' | 'social';

const ALLOWED = new Set<string>(['tech', 'process', 'social']);

export function normalizeInnovationDocumentTag(
  value: unknown,
): InnovationDocumentTag {
  const s = String(value ?? '')
    .trim()
    .toLowerCase();
  if (ALLOWED.has(s)) return s as InnovationDocumentTag;
  return 'tech';
}

/**
 * One tag per uploaded file, in the same order as `innovationImplementationDocumentsFile` parts.
 * Accepts JSON array string in multipart (`["tech","process"]`) or comma-separated values.
 * Missing entries default to **tech**.
 */
export function parseInnovationDocumentTagsForUpload(
  raw: unknown,
  fileCount: number,
): InnovationDocumentTag[] {
  if (fileCount <= 0) return [];
  let arr: unknown[] = [];
  if (typeof raw === 'string' && raw.trim() !== '') {
    const trimmed = raw.trim();
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      arr = Array.isArray(parsed)
        ? parsed
        : trimmed.split(',').map((x) => x.trim());
    } catch {
      arr = trimmed.split(',').map((x) => x.trim());
    }
  } else if (Array.isArray(raw)) {
    arr = raw;
  }
  const out: InnovationDocumentTag[] = [];
  for (let i = 0; i < fileCount; i++) {
    out.push(normalizeInnovationDocumentTag(arr[i]));
  }
  return out;
}
