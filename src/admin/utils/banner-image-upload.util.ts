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

/** Multipart field names for banner video (system upload only). */
export const BANNER_VIDEO_FILE_FIELD_NAMES = [
  'video',
  'bannerVideo',
  'banner_video',
] as const;

export const BANNER_VIDEO_ALLOWED_MIMES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

export const BANNER_VIDEO_MAX_BYTES = 50 * 1024 * 1024;

export type BannerImageSource = 'binary_upload' | 'manual_url';
export type BannerVideoSource = 'binary_upload';

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

/** True when Multer received a non-empty video file. */
export function isUsableMulterVideoFile(
  file?: Express.Multer.File | null,
): boolean {
  return isUsableMulterImageFile(file);
}

const BANNER_VIDEO_ALLOWED_EXTS = new Set(['mp4', 'webm', 'mov', 'm4v']);

/** True when a usable Multer file looks like an allowed banner video. */
export function isBannerVideoLikeFile(
  file?: Express.Multer.File | null,
): boolean {
  if (!isUsableMulterVideoFile(file)) return false;
  const mime = String(file?.mimetype ?? '').toLowerCase();
  const ext = file?.originalname?.split('.').pop()?.toLowerCase() ?? '';
  if (mime.startsWith('video/')) {
    return BANNER_VIDEO_ALLOWED_MIMES.has(mime) || BANNER_VIDEO_ALLOWED_EXTS.has(ext);
  }
  return BANNER_VIDEO_ALLOWED_EXTS.has(ext);
}

/** First usable image among known field names (skips video-like payloads). */
export function pickBannerImageFile(
  files?: Record<string, Express.Multer.File[]> | null,
): Express.Multer.File | undefined {
  if (!files || typeof files !== 'object') return undefined;
  for (const name of BANNER_IMAGE_FILE_FIELD_NAMES) {
    const f = files[name]?.[0];
    if (!isUsableMulterImageFile(f)) continue;
    if (isBannerVideoLikeFile(f)) continue;
    return f;
  }
  return undefined;
}

/**
 * First usable video among known video fields, or a video sent under an image
 * field name (`image` / `file` / …) so clients can upload either media type.
 */
export function pickBannerVideoFile(
  files?: Record<string, Express.Multer.File[]> | null,
): Express.Multer.File | undefined {
  if (!files || typeof files !== 'object') return undefined;
  for (const name of BANNER_VIDEO_FILE_FIELD_NAMES) {
    const f = files[name]?.[0];
    if (isBannerVideoLikeFile(f)) return f;
  }
  for (const name of BANNER_IMAGE_FILE_FIELD_NAMES) {
    const f = files[name]?.[0];
    if (isBannerVideoLikeFile(f)) return f;
  }
  return undefined;
}

const bannerImageFieldSet = new Set<string>(BANNER_IMAGE_FILE_FIELD_NAMES);
const bannerVideoFieldSet = new Set<string>(BANNER_VIDEO_FILE_FIELD_NAMES);

/** Shared Multer config for vendor banner create / edit (image + optional video). */
export function createBannerDiskMulterOptions() {
  return {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'banners'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname || '');
        const prefix = bannerVideoFieldSet.has(file.fieldname)
          ? 'banner-video'
          : 'banner';
        cb(null, `${prefix}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file?.originalname) {
        cb(null, true);
        return;
      }
      const mime = String(file.mimetype ?? '').toLowerCase();
      const ext = extname(file.originalname || '').toLowerCase().replace(/^\./, '');
      const okVideo =
        BANNER_VIDEO_ALLOWED_MIMES.has(mime) ||
        ((!mime || mime === 'application/octet-stream') &&
          BANNER_VIDEO_ALLOWED_EXTS.has(ext)) ||
        (mime.startsWith('video/') && BANNER_VIDEO_ALLOWED_EXTS.has(ext));
      if (bannerImageFieldSet.has(file.fieldname)) {
        // Accept images, or videos sent on the same field names as images.
        if (mime.startsWith('image/')) {
          cb(null, true);
          return;
        }
        cb(null, okVideo);
        return;
      }
      if (bannerVideoFieldSet.has(file.fieldname)) {
        cb(null, okVideo);
        return;
      }
      cb(null, false);
    },
    limits: { fileSize: BANNER_VIDEO_MAX_BYTES },
  };
}

/** Multipart field list for banner image + video uploads. */
export const BANNER_MEDIA_MULTIPART_FIELDS = [
  ...BANNER_IMAGE_FILE_FIELD_NAMES.map((name) => ({ name, maxCount: 1 })),
  ...BANNER_VIDEO_FILE_FIELD_NAMES.map((name) => ({ name, maxCount: 1 })),
];
