import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { Options } from 'multer';

const MAX_BYTES = 15 * 1024 * 1024;

/** GST certificate and PAN document: **PDF or JPEG only** (by MIME and/or file extension). */
const GST_OR_PAN_MIMES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
]);
const LOGO_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

function originalNameLooksPdfOrJpeg(
  originalname: string | undefined,
): boolean {
  const n = String(originalname ?? '').toLowerCase();
  return /\.(pdf|jpe?g)$/i.test(n);
}

function isGstOrPanPdfOrJpeg(
  file: Pick<Express.Multer.File, 'mimetype' | 'originalname'>,
): boolean {
  const m = String(file.mimetype ?? '').toLowerCase();
  if (GST_OR_PAN_MIMES.has(m)) {
    return true;
  }
  if (
    m === 'application/octet-stream' ||
    m === 'binary/octet-stream' ||
    m === ''
  ) {
    return originalNameLooksPdfOrJpeg(file.originalname);
  }
  return false;
}

/**
 * Memory storage so buffers are passed to shared **uploadFile()** in `upload-file.util.ts` (S3 or local).
 * Fields: **gst** / **gstDocument** (PDF or JPEG only), **companyLogo** (images), **pan** / **panDocument** (PDF or JPEG only).
 */
export function vendorProfileBrandingMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: MAX_BYTES },
    fileFilter: (_req, file, cb) => {
      if (file.fieldname === 'gst' || file.fieldname === 'gstDocument') {
        if (isGstOrPanPdfOrJpeg(file)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'GST certificate must be a PDF or JPEG file (.pdf, .jpg, .jpeg).',
            ),
          );
        }
        return;
      }
      if (file.fieldname === 'companyLogo') {
        if (LOGO_MIMES.has(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Company logo must be an image (jpeg, png, gif, or webp).',
            ),
          );
        }
        return;
      }
      if (file.fieldname === 'pan' || file.fieldname === 'panDocument') {
        if (isGstOrPanPdfOrJpeg(file)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'PAN document must be a PDF or JPEG file (.pdf, .jpg, .jpeg).',
            ),
          );
        }
        return;
      }
      cb(new BadRequestException(`Unexpected file field: ${file.fieldname}`));
    },
  };
}
