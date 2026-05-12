import { S3Client } from '@aws-sdk/client-s3';

let client: S3Client | null = null;

/**
 * All four must be set to use S3; otherwise uploads fall back to local disk.
 */
export function isS3Configured(): boolean {
  const key = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secret = process.env.AWS_SECRET_ACCESS_KEY?.trim();
  const region = process.env.AWS_REGION?.trim();
  const bucket = process.env.AWS_S3_BUCKET?.trim();
  return !!(key && secret && region && bucket);
}

export function getS3Client(): S3Client {
  if (!isS3Configured()) {
    throw new Error('S3 is not configured (missing AWS env vars)');
  }
  if (!client) {
    client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

export function getS3Bucket(): string {
  return process.env.AWS_S3_BUCKET!.trim();
}

export function getS3Region(): string {
  return process.env.AWS_REGION!.trim();
}

export function getCloudFrontBaseUrl(): string | null {
  const raw = process.env.AWS_CLOUDFRONT_URL?.trim();
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return parsed.origin;
    }

    // If a file path is provided (e.g. /dummy.png), drop the file part.
    const last = segments[segments.length - 1];
    const looksLikeFile = /\.[a-zA-Z0-9]+$/.test(last);
    const kept = looksLikeFile ? segments.slice(0, -1) : segments;
    const path = kept.length > 0 ? `/${kept.join('/')}` : '';
    return `${parsed.origin}${path}`;
  } catch {
    return null;
  }
}

/**
 * When `true`, public file URLs use the S3 virtual-hosted–style URL
 * (`https://{bucket}.s3.{region}.amazonaws.com/...`) even if `AWS_CLOUDFRONT_URL` is set.
 * CloudFront still serves the same objects from S3; this only changes the URL string stored/returned.
 */
export function preferDirectS3PublicUrl(): boolean {
  const v = process.env.AWS_S3_USE_DIRECT_PUBLIC_URL?.trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}
