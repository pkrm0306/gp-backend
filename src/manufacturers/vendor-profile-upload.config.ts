import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { Options } from 'multer';
import {
  isAllowedStandardDocumentFile,
  STANDARD_DOCUMENT_VALIDATION_MESSAGE,
} from '../common/upload/document-upload.validation';

const MAX_BYTES = 15 * 1024 * 1024;

const LOGO_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

/**
 * Memory storage so buffers are passed to shared **uploadFile()** in `upload-file.util.ts` (S3 or local).
 * Fields: **gst** / **gstDocument** (standard documents), **companyLogo** (images), **pan** / **panDocument** (standard documents).
 */
export function vendorProfileBrandingMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: MAX_BYTES },
    fileFilter: (_req, file, cb) => {
      if (file.fieldname === 'gst' || file.fieldname === 'gstDocument') {
        if (isAllowedStandardDocumentFile(file)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(STANDARD_DOCUMENT_VALIDATION_MESSAGE));
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
        if (isAllowedStandardDocumentFile(file)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(STANDARD_DOCUMENT_VALIDATION_MESSAGE));
        }
        return;
      }
      cb(new BadRequestException(`Unexpected file field: ${file.fieldname}`));
    },
  };
}
