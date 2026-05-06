import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import {
  getCloudFrontBaseUrl,
  getS3Bucket,
  getS3Client,
  getS3Region,
  isS3Configured,
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

function buildPublicFileUrl(bucket: string, region: string, key: string): string {
  const encodedKey = key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  const cloudFrontBase = getCloudFrontBaseUrl();
  if (cloudFrontBase) {
    return `${cloudFrontBase.replace(/\/+$/, '')}/${encodedKey}`;
  }
  return buildS3PublicUrl(bucket, region, key);
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
