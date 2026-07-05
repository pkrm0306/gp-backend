import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import {
  getCloudFrontBaseUrl,
  getS3Bucket,
  getS3Client,
  getS3Region,
  isS3Configured,
  preferDirectS3PublicUrl,
} from '../config/s3.config';

export type UploadResult = {
  storage: 'local' | 's3';
  /** Public URL or path served by the app (local: /uploads/...) */
  fileUrl: string;
  /** Final stored file name only */
  fileName: string;
  /** Relative path under project uploads/ for local delete, e.g. standards/1710933_x.pdf */
  relativePath: string;
  /** Full S3 object key when storage === 's3' */
  s3Key?: string;
};

function safeBaseName(original: string): string {
  return (
    basename(original || 'file').replace(/[^a-zA-Z0-9._-]/g, '_') || 'file'
  );
}

function normalizeFolder(folderName: string): string {
  return folderName.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function buildS3PublicUrl(bucket: string, region: string, key: string): string {
  const encodedKey = key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
}

export function buildPublicFileUrl(bucket: string, region: string, key: string): string {
  const encodedKey = key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  if (!preferDirectS3PublicUrl()) {
    const cloudFrontBase = getCloudFrontBaseUrl();
    if (cloudFrontBase) {
      return `${cloudFrontBase.replace(/\/+$/, '')}/${encodedKey}`;
    }
  }
  return buildS3PublicUrl(bucket, region, key);
}

/** Extract `uploads/...` object key from a public S3 or CloudFront URL. */
export function extractUploadsKeyFromAbsoluteUrl(url: string): string | null {
  try {
    const pathname = decodeURIComponent(new URL(url).pathname).replace(
      /^\/+/,
      '',
    );
    return pathname.startsWith('uploads/') ? pathname : null;
  } catch {
    return null;
  }
}

/**
 * Resolve a stored upload path or URL to the public URL clients should use.
 * When S3 + CloudFront are configured, returns a CloudFront URL (unless
 * `AWS_S3_USE_DIRECT_PUBLIC_URL=true`). Rewrites legacy S3 URLs and `/uploads/...` paths.
 */
export function resolveStoredUploadUrl(stored?: string | null): string {
  const raw = String(stored ?? '').trim();
  if (!raw) {
    return '';
  }

  if (!isS3Configured()) {
    return raw;
  }

  const bucket = getS3Bucket();
  const region = getS3Region();

  if (/^https?:\/\//i.test(raw)) {
    const key = extractUploadsKeyFromAbsoluteUrl(raw);
    if (key) {
      return buildPublicFileUrl(bucket, region, key);
    }
    return raw;
  }

  const rel = normalizeUploadsRelativePath(raw);
  if (rel) {
    const key = rel.startsWith('uploads/') ? rel : `uploads/${rel}`;
    return buildPublicFileUrl(bucket, region, key);
  }

  return raw;
}

/**
 * Resolve a stored upload path to the URL public website clients should load.
 * Prefers CloudFront/S3 when configured; otherwise builds an absolute URL from
 * `localBaseUrl` or `API_BASE_URL`, or returns a root-relative `/uploads/...` path.
 */
export function resolvePublicUploadUrl(
  stored?: string | null,
  localBaseUrl?: string,
): string | null {
  const raw = String(stored ?? '').trim();
  if (!raw || raw.toLowerCase() === 'string') {
    return null;
  }

  const resolved = resolveStoredUploadUrl(raw);
  const candidate = resolved || raw;

  if (/^https?:\/\//i.test(candidate)) {
    return candidate;
  }

  const pathPart = candidate.replace(/^\/+/, '');
  const underUploads = pathPart.startsWith('uploads/')
    ? pathPart
    : `uploads/${pathPart}`;
  const segments = underUploads.split('/').map((s) => encodeURIComponent(s));
  const base =
    String(localBaseUrl ?? process.env.API_BASE_URL ?? '')
      .trim()
      .replace(/\/$/, '');
  if (base) {
    return `${base}/${segments.join('/')}`;
  }
  return `/${segments.join('/')}`;
}

/**
 * Upload a Multer **memory** file to S3 (if configured) or to `uploads/{folderName}/`.
 */
export async function uploadFile(
  file: Express.Multer.File,
  folderName: string,
): Promise<UploadResult> {
  const fileBuffer =
    file?.buffer && file.buffer.length > 0
      ? file.buffer
      : file?.path && existsSync(file.path)
        ? readFileSync(file.path)
        : null;
  if (!fileBuffer) {
    throw new Error('uploadFile requires file buffer or valid file.path');
  }

  const folder = normalizeFolder(folderName);
  const baseName = `${Date.now()}_${safeBaseName(file.originalname)}`;

  if (isS3Configured()) {
    const client = getS3Client();
    const bucket = getS3Bucket();
    const region = getS3Region();
    const key = `uploads/${folder}/${baseName}`;

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: file.mimetype || 'application/octet-stream',
      }),
    );

    return {
      storage: 's3',
      fileName: baseName,
      relativePath: `${folder}/${baseName}`,
      fileUrl: buildPublicFileUrl(bucket, region, key),
      s3Key: key,
    };
  }

  const dir = join(process.cwd(), 'uploads', folder);
  mkdirSync(dir, { recursive: true });
  const dest = join(dir, baseName);
  writeFileSync(dest, fileBuffer);
  const relativePath = `${folder}/${baseName}`;
  if (file?.path && existsSync(file.path)) {
    try {
      unlinkSync(file.path);
    } catch {
      /* ignore */
    }
  }

  return {
    storage: 'local',
    fileName: baseName,
    relativePath,
    fileUrl: `/uploads/${relativePath.split('/').map(encodeURIComponent).join('/')}`,
  };
}

/** Certified product images — stored under `uploads/products/` with public CDN URL when configured. */
export async function uploadCertifiedProductImage(
  file: Express.Multer.File,
): Promise<UploadResult> {
  const uploaded = await uploadFile(file, 'products');
  const fileUrl = resolveStoredUploadUrl(uploaded.fileUrl) || uploaded.fileUrl;
  return { ...uploaded, fileUrl };
}

/** Admin assessment report for a certified URN — stored under `uploads/urns/{urnNo}/assessment-reports/`. */
export async function uploadUrnAssessmentReport(
  file: Express.Multer.File,
  urnNo: string,
): Promise<UploadResult> {
  const safeUrn = String(urnNo ?? '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const uploaded = await uploadFile(file, `urns/${safeUrn}/assessment-reports`);
  const fileUrl = resolveStoredUploadUrl(uploaded.fileUrl) || uploaded.fileUrl;
  return { ...uploaded, fileUrl };
}

/**
 * Remove file from S3 or local disk based on stored metadata.
 */
export async function deleteUploadedFile(params: {
  storage_type: 'local' | 's3';
  s3_key?: string | null;
  /** Local relative path under uploads/, e.g. standards/xxx.pdf */
  relativePath: string;
}): Promise<void> {
  const { storage_type, s3_key, relativePath } = params;

  if (storage_type === 's3' && s3_key) {
    if (!isS3Configured()) {
      return;
    }
    try {
      const client = getS3Client();
      await client.send(
        new DeleteObjectCommand({
          Bucket: getS3Bucket(),
          Key: s3_key,
        }),
      );
    } catch {
      /* ignore */
    }
    return;
  }

  const rel = relativePath.replace(/^\/+/, '');
  const full = join(process.cwd(), 'uploads', rel);
  try {
    if (existsSync(full)) {
      unlinkSync(full);
    }
  } catch {
    /* ignore */
  }
}

/** Strip `/uploads/` prefix and decode URI segments for local/S3 relative paths. */
export function normalizeUploadsRelativePath(input: string): string {
  let value = String(input ?? '').trim().replace(/\\/g, '/');
  if (!value) {
    return '';
  }
  if (/^https?:\/\//i.test(value)) {
    try {
      value = decodeURIComponent(new URL(value).pathname);
    } catch {
      return '';
    }
  }
  value = value.replace(/^\/+/, '');
  if (value.startsWith('uploads/')) {
    value = value.slice('uploads/'.length);
  }
  return value
    .split('/')
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join('/');
}

/**
 * Infer delete metadata from a value stored in `all_product_documents.documentLink`.
 */
export function deleteMetaFromDocumentLink(documentLink: string): {
  storage_type: 'local' | 's3';
  s3_key?: string;
  relativePath: string;
} | null {
  const raw = String(documentLink ?? '').trim();
  if (!raw) {
    return null;
  }

  const relativePath = normalizeUploadsRelativePath(raw);
  if (!relativePath) {
    return null;
  }

  if (/^https?:\/\//i.test(raw) && isS3Configured()) {
    return {
      storage_type: 's3',
      s3_key: `uploads/${relativePath}`,
      relativePath,
    };
  }

  return {
    storage_type: 'local',
    relativePath,
  };
}

/** Delete a certification/product document file from S3 or local disk. */
export async function deleteUploadedFileByDocumentLink(
  documentLink?: string | null,
): Promise<void> {
  const meta = documentLink
    ? deleteMetaFromDocumentLink(documentLink)
    : null;
  if (!meta) {
    return;
  }
  await deleteUploadedFile({
    storage_type: meta.storage_type,
    s3_key: meta.s3_key,
    relativePath: meta.relativePath,
  });
}
