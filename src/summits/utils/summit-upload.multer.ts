import { BadRequestException } from '@nestjs/common';
import { memoryStorage, type Options } from 'multer';
import { extname } from 'path';
import {
  SUMMIT_IMAGE_MAX_BYTES,
  SUMMIT_PDF_MAX_BYTES,
} from '../constants/summit.constants';

const IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

export function summitUploadMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: SUMMIT_PDF_MAX_BYTES },
    fileFilter: (_req, file, cb) => {
      const ext = extname(file?.originalname ?? '').toLowerCase();
      const isPdf =
        file.mimetype === 'application/pdf' || ext === '.pdf';
      const isImage =
        IMAGE_MIMES.has(file.mimetype) ||
        IMAGE_EXT.has(ext) ||
        file.mimetype?.startsWith('image/');

      if (isPdf || isImage) {
        cb(null, true);
        return;
      }
      cb(
        new BadRequestException(
          'Allowed: JPEG, PNG, WebP, GIF, or PDF',
        ) as unknown as null,
        false,
      );
    },
  };
}

export function summitUploadMaxBytes(isPdf: boolean): number {
  return isPdf ? SUMMIT_PDF_MAX_BYTES : SUMMIT_IMAGE_MAX_BYTES;
}
