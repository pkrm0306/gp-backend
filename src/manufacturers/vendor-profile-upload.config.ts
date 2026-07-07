import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { Options } from 'multer';
import {
  isAllowedVendorProfileDocumentFile,
  VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE,
} from '../common/upload/vendor-profile-document.validation';

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
 * Fields: **gst** / **gstDocument** (PDF or image), **companyLogo** (images), **pan** / **panDocument** (PDF or image).
 */
export function vendorProfileBrandingMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: MAX_BYTES },
    fileFilter: (_req, file, cb) => {
      if (file.fieldname === 'gst' || file.fieldname === 'gstDocument') {
        if (isAllowedVendorProfileDocumentFile(file)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE));
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
        if (isAllowedVendorProfileDocumentFile(file)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE));
        }
        return;
      }
      cb(new BadRequestException(`Unexpected file field: ${file.fieldname}`));
    },
  };
}
