import { BadRequestException } from '@nestjs/common';
import { memoryStorage, Options } from 'multer';
import { extname } from 'path';

const TEN_MB = 10 * 1024 * 1024;
const FIVE_MB = 5 * 1024 * 1024;

const UNIVERSAL_MIMES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

const ADMIN_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const CERTIFICATION_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]);

const CERTIFICATION_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
]);

/**
 * Memory storage for S3 or local upload via `uploadFile()` helper.
 * Allowed: PDF, JPG, PNG — max 10MB.
 */
export function universalMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: TEN_MB },
    fileFilter: (_req, file, cb) => {
      if (UNIVERSAL_MIMES.has(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  };
}

/** Admin/CMS images (banners, events, gallery, team members, manufacturers). */
export function adminImageMemoryMulterOptions(maxBytes = FIVE_MB): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: maxBytes },
    fileFilter: (_req, file, cb) => {
      if (!file?.originalname) {
        cb(null, true);
        return;
      }
      if (ADMIN_IMAGE_MIMES.has(file.mimetype) || file.mimetype?.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  };
}

/** Admin articles: image fields + PDF on `pdf` / `file`. */
export function adminArticleMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: FIVE_MB },
    fileFilter: (_req, file, cb) => {
      if (!file?.originalname) {
        cb(null, true);
        return;
      }
      if (file.fieldname === 'pdf' || file.fieldname === 'file') {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only PDF files are allowed for file/pdf field',
            ) as unknown as null,
            false,
          );
        }
        return;
      }
      if (ADMIN_IMAGE_MIMES.has(file.mimetype) || file.mimetype?.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  };
}

/** Certification / URN multipart uploads (images, PDF, Office docs). */
export function certificationMultipartMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: TEN_MB },
    fileFilter: (_req, file, cb) => {
      if (!file) {
        cb(null, true);
        return;
      }
      const fileExt = extname(file.originalname || '').toLowerCase();
      if (
        CERTIFICATION_MIMES.has(file.mimetype) ||
        CERTIFICATION_EXTENSIONS.has(fileExt)
      ) {
        cb(null, true);
        return;
      }
      cb(
        new BadRequestException(
          'Invalid file type. Only PNG, JPEG, PDF, Word (.doc, .docx), and Excel (.xls, .xlsx) files are allowed.',
        ) as unknown as null,
        false,
      );
    },
  };
}
