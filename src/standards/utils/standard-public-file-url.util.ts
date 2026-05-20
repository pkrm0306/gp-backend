/**
 * Canonical browser path for a standard document stored via uploadFile() (`uploads/standards/...`).
 */
export function resolveStandardPublicFileUrl(input: {
  filename?: string | null;
  file_url?: string | null;
  storage_type?: string | null;
}): string | undefined {
  const storage = String(input.storage_type ?? '').toLowerCase();
  const fileUrl = String(input.file_url ?? '').trim();
  const filename = String(input.filename ?? '').trim();

  if (fileUrl && /^https?:\/\//i.test(fileUrl)) {
    return fileUrl;
  }
  if (storage === 's3' && fileUrl) {
    return fileUrl;
  }

  const rel = normalizeStandardRelativePath(filename || fileUrl);
  if (!rel) {
    return undefined;
  }

  return `/uploads/${rel.split('/').map(encodeURIComponent).join('/')}`;
}

/** Relative path under `uploads/` (e.g. `standards/1700_file.pdf`). */
export function normalizeStandardRelativePath(raw: string): string {
  let path = String(raw ?? '').trim().replace(/^\/+/, '');
  if (!path) return '';

  if (path.startsWith('uploads/')) {
    path = path.slice('uploads/'.length);
  }

  if (!path.startsWith('standards/')) {
    path = `standards/${path}`;
  }

  return path;
}
