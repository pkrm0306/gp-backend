import { diskStorage, Options } from 'multer';
import { extname, join } from 'path';

const GALLERY_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

/** Gallery multipart uploads — no per-file size cap (Multer default when limits omitted). */
export function galleryImageDiskMulterOptions(): Options {
  return {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'events'),
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname || '');
        cb(null, `event-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (!file?.originalname) {
        cb(null, true);
        return;
      }
      cb(null, GALLERY_IMAGE_MIMES.has(file.mimetype));
    },
  };
}
