import { memoryStorage } from 'multer';
import { Options } from 'multer';

const MAX_BYTES = 15 * 1024 * 1024;

const GST_MIMES = new Set(['application/pdf']);
const LOGO_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);
/** PAN card: PDF or JPEG only */
const PAN_MIMES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
]);

/**
 * Memory storage so files can be passed to shared {@link uploadFile} (S3 or local).
 * Fields: **gst** (PDF), **companyLogo** (image), **pan** (PDF or JPEG).
 */
export function vendorProfileBrandingMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: MAX_BYTES },
    fileFilter: (_req, file, cb) => {
      const done = cb as (err: Error | null, accept?: boolean) => void;
      if (file.fieldname === 'gst') {
        if (GST_MIMES.has(file.mimetype)) {
          done(null, true);
        } else {
          done(new Error('GST upload must be a PDF file'), false);
        }
        return;
      }
      if (file.fieldname === 'companyLogo') {
        if (LOGO_MIMES.has(file.mimetype)) {
          done(null, true);
        } else {
          done(
            new Error(
              'Company logo must be an image (jpeg, png, gif, or webp)',
            ),
            false,
          );
        }
        return;
      }
      if (file.fieldname === 'pan') {
        if (PAN_MIMES.has(file.mimetype)) {
          done(null, true);
        } else {
          done(
            new Error('PAN document must be a PDF or JPEG file'),
            false,
          );
        }
        return;
      }
      done(new Error(`Unexpected file field: ${file.fieldname}`), false);
    },
  };
}
