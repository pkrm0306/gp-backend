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
