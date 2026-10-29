import { existsSync, statSync } from 'fs';
import { extname, join } from 'path';
import { diskStorage, memoryStorage, Options } from 'multer';
import type { Express } from 'express';
import { GALLERY_MAX_IMAGES } from '../../gallery/schemas/gallery.schema';

const GALLERY_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

/** Multipart field names for gallery images. */
export const GALLERY_IMAGE_FILE_FIELD_NAMES = [
  'image',
  'image[]',
  'images',
  'eventImage',
  'event_image',
] as const;

/** Multipart field names for gallery videos. */
export const GALLERY_VIDEO_FILE_FIELD_NAMES = [
  'video',
  'video[]',
  'videos',
  'galleryVideo',
  'gallery_video',
] as const;

export const GALLERY_VIDEO_ALLOWED_MIMES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const GALLERY_VIDEO_ALLOWED_EXTS = new Set(['mp4', 'webm', 'mov', 'm4v']);

/** Same cap as banner videos (50MB). */
export const GALLERY_VIDEO_MAX_BYTES = 50 * 1024 * 1024;

const galleryImageFieldSet = new Set<string>(GALLERY_IMAGE_FILE_FIELD_NAMES);
const galleryVideoFieldSet = new Set<string>(GALLERY_VIDEO_FILE_FIELD_NAMES);

function isUsableMulterFile(file?: Express.Multer.File | null): boolean {
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

/** True when a usable Multer file looks like an allowed gallery video. */
export function isGalleryVideoLikeFile(
  file?: Express.Multer.File | null,
): boolean {
  if (!isUsableMulterFile(file)) return false;
  const mime = String(file?.mimetype ?? '').toLowerCase();
  const ext = file?.originalname?.split('.').pop()?.toLowerCase() ?? '';
  if (mime.startsWith('video/')) {
    return (
      GALLERY_VIDEO_ALLOWED_MIMES.has(mime) || GALLERY_VIDEO_ALLOWED_EXTS.has(ext)
    );
  }
  return GALLERY_VIDEO_ALLOWED_EXTS.has(ext);
}

function isGalleryImageLikeFile(file?: Express.Multer.File | null): boolean {
  if (!isUsableMulterFile(file)) return false;
  if (isGalleryVideoLikeFile(file)) return false;
  const mime = String(file?.mimetype ?? '').toLowerCase();
  return GALLERY_IMAGE_MIMES.has(mime) || mime.startsWith('image/');
}

function collectFilesByFields(
  files: Record<string, Express.Multer.File[]> | null | undefined,
  fieldNames: readonly string[],
): Express.Multer.File[] {
  if (!files || typeof files !== 'object') return [];
  const out: Express.Multer.File[] = [];
  for (const name of fieldNames) {
    const list = files[name];
    if (!Array.isArray(list)) continue;
    for (const f of list) {
      if (f) out.push(f);
    }
  }
  return out;
}

/**
 * Collect image uploads from known image fields (skips video-like payloads
 * so a video sent as `image` is not treated as an image).
 */
export function pickGalleryImageFiles(
  files?: Record<string, Express.Multer.File[]> | null,
): Express.Multer.File[] {
  return collectFilesByFields(files, GALLERY_IMAGE_FILE_FIELD_NAMES).filter(
    isGalleryImageLikeFile,
  );
}

/**
 * Collect video uploads from known video fields, plus videos sent under image
 * field names so the admin UI can upload either media type on `image`.
 */
export function pickGalleryVideoFiles(
  files?: Record<string, Express.Multer.File[]> | null,
): Express.Multer.File[] {
  const fromVideoFields = collectFilesByFields(
    files,
    GALLERY_VIDEO_FILE_FIELD_NAMES,
  ).filter(isGalleryVideoLikeFile);
  const fromImageFields = collectFilesByFields(
    files,
    GALLERY_IMAGE_FILE_FIELD_NAMES,
  ).filter(isGalleryVideoLikeFile);
  return [...fromVideoFields, ...fromImageFields];
}

function isOkGalleryVideo(file: Express.Multer.File): boolean {
  const mime = String(file.mimetype ?? '').toLowerCase();
  const ext = extname(file.originalname || '')
    .toLowerCase()
    .replace(/^\./, '');
  return (
    GALLERY_VIDEO_ALLOWED_MIMES.has(mime) ||
    ((!mime || mime === 'application/octet-stream') &&
      GALLERY_VIDEO_ALLOWED_EXTS.has(ext)) ||
    (mime.startsWith('video/') && GALLERY_VIDEO_ALLOWED_EXTS.has(ext))
  );
}

/**
 * Memory storage for gallery create/edit — images + videos via shared
 * `uploadFile()` helper (local uploads/gallery or S3).
 */
export function galleryMediaMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: GALLERY_VIDEO_MAX_BYTES },
    fileFilter: (_req, file, cb) => {
      if (!file?.originalname) {
        cb(null, true);
        return;
      }
      const mime = String(file.mimetype ?? '').toLowerCase();
      if (galleryImageFieldSet.has(file.fieldname)) {
        if (GALLERY_IMAGE_MIMES.has(mime) || mime.startsWith('image/')) {
          cb(null, true);
          return;
        }
        cb(null, isOkGalleryVideo(file));
        return;
      }
      if (galleryVideoFieldSet.has(file.fieldname)) {
        cb(null, isOkGalleryVideo(file));
        return;
      }
      cb(null, false);
    },
  };
}

/** Disk Multer config (legacy local events/ path) — images + videos. */
export function galleryImageDiskMulterOptions(): Options {
  return {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'events'),
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname || '');
        const prefix = galleryVideoFieldSet.has(file.fieldname)
          ? 'event-video'
          : 'event';
        cb(null, `${prefix}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (!file?.originalname) {
        cb(null, true);
        return;
      }
      const mime = String(file.mimetype ?? '').toLowerCase();
      if (galleryImageFieldSet.has(file.fieldname)) {
        if (GALLERY_IMAGE_MIMES.has(mime) || mime.startsWith('image/')) {
          cb(null, true);
          return;
        }
        cb(null, isOkGalleryVideo(file));
        return;
      }
      if (galleryVideoFieldSet.has(file.fieldname)) {
        cb(null, isOkGalleryVideo(file));
        return;
      }
      cb(null, false);
    },
    limits: { fileSize: GALLERY_VIDEO_MAX_BYTES },
  };
}

/** Multipart field list for gallery image + video uploads. */
export const GALLERY_MEDIA_MULTIPART_FIELDS = [
  ...GALLERY_IMAGE_FILE_FIELD_NAMES.map((name) => ({
    name,
    maxCount: GALLERY_MAX_IMAGES,
  })),
  ...GALLERY_VIDEO_FILE_FIELD_NAMES.map((name) => ({
    name,
    maxCount: GALLERY_MAX_IMAGES,
  })),
];
