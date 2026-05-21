import { existsSync, statSync } from 'fs';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import type { Express } from 'express';

/** Form / multipart field names clients may use for the banner binary. */
export const BANNER_IMAGE_FILE_FIELD_NAMES = [
  'image',
  'bannerImage',
  'banner_image',
  'file',
] as const;

export type BannerImageSource = 'binary_upload' | 'manual_url';

/**
 * True when Multer actually received a non-empty image file (disk or memory).
 * Avoids treating an empty multipart part as an upload.
 */
export function isUsableMulterImageFile(
  file?: Express.Multer.File | null,
): boolean {
  if (!file) return false;
  if (typeof file.size === 'number' && file.size > 0) return true;
  if (file.buffer && file.buffer.length > 0) return true;
  if (file.path) {
    try {
      if (!existsSync(file.path)) return false;
      return statSync(file.path).size > 0;
    } catch {
      return false;
    }
  }
  return false;
}

/** First usable file among known field names (from FileFieldsInterceptor). */
export function pickBannerImageFile(
  files?: Record<string, Express.Multer.File[]> | null,
): Express.Multer.File | undefined {
  if (!files || typeof files !== 'object') return undefined;
  for (const name of BANNER_IMAGE_FILE_FIELD_NAMES) {
    const f = files[name]?.[0];
    if (isUsableMulterImageFile(f)) return f;
  }
  return undefined;
}

/** Shared Multer config for vendor banner create / edit (multipart). */
export function createBannerDiskMulterOptions() {
  return {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'banners'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname || '');
        cb(null, `banner-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file?.originalname) {
        cb(null, true);
        return;
      }
      cb(
        null,
        typeof file.mimetype === 'string' && file.mimetype.startsWith('image/'),
      );
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  };
}
