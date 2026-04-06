import { memoryStorage } from 'multer';
import { Options } from 'multer';

const ALLOWED_MIMES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Memory storage for S3 or local upload via `uploadFile()` helper.
 * Allowed: PDF, JPG, PNG — max 10MB.
 */
export function universalMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: MAX_BYTES },
    fileFilter: (req, file, cb) => {
      if (ALLOWED_MIMES.has(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  };
}
