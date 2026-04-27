import { Options } from 'multer';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

function ensureManufacturerUploadDir(): string {
  const dir = join(process.cwd(), 'uploads', 'manufacturers');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function manufacturerImageMulterOptions(): Options {
  return {
    storage: diskStorage({
      destination: (_req, _file, cb) => cb(null, ensureManufacturerUploadDir()),
      filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `manufacturer-${unique}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: MAX_IMAGE_BYTES },
    fileFilter: (_req, file, cb) => {
      cb(null, ALLOWED_MIMES.has(file.mimetype));
    },
  };
}
