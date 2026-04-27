import { mkdirSync } from 'fs';
import { join, extname } from 'path';
import { diskStorage, Options } from 'multer';

const allowedMimes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

export function categoryImageMulterOptions(): Options {
  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dir = join(process.cwd(), 'uploads', 'categories');
        mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        const ext = extname(file.originalname) || '.jpg';
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  };
}
