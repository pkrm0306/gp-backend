import { GetObjectCommand } from '@aws-sdk/client-s3';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  getS3Bucket,
  getS3Client,
  isS3Configured,
} from '../config/s3.config';
import { normalizeUploadsRelativePath } from './upload-file.util';

/** Read a file from local `uploads/` or S3 using a stored document link or relative path. */
export async function readUploadedFileBuffer(
  input?: string | null,
): Promise<Buffer | null> {
  const relativePath = normalizeUploadsRelativePath(String(input ?? ''));
  if (!relativePath) {
    return null;
  }

  if (isS3Configured()) {
    try {
      const client = getS3Client();
      const response = await client.send(
        new GetObjectCommand({
          Bucket: getS3Bucket(),
          Key: `uploads/${relativePath}`,
        }),
      );
      const bytes = await response.Body?.transformToByteArray();
      return bytes?.length ? Buffer.from(bytes) : null;
    } catch {
      return null;
    }
  }

  const fullPath = join(process.cwd(), 'uploads', relativePath);
  if (!existsSync(fullPath)) {
    return null;
  }
  return readFileSync(fullPath);
}
