import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const STANDARD_DOCUMENT_VALIDATION_MESSAGE =
  'Only PDF, JPG, JPEG, PNG, DOC, and DOCX files are allowed';

export const STANDARD_DOCUMENT_EXTENSIONS = new Set([
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.doc',
  '.docx',
]);

export const STANDARD_DOCUMENT_MIMES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const UNTRUSTED_MIMES_ALLOWED_WITH_EXTENSION = new Set([
  'application/octet-stream',
  'binary/octet-stream',
  '',
]);

const BLOCKED_DOCUMENT_EXTENSIONS = new Set([
  '.xlsx',
  '.xls',
  '.csv',
  '.zip',
  '.zipx',
  '.rar',
  '.exe',
  '.js',
]);

const BLOCKED_DOCUMENT_MIMES = new Set([
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'application/csv',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip',
  'multipart/x-zip',
  'application/x-rar-compressed',
  'application/vnd.rar',
  'application/x-msdownload',
  'application/javascript',
  'text/javascript',
  'application/x-javascript',
]);

export function standardDocumentExtension(
  originalname?: string | null,
): string {
  return extname(String(originalname ?? '')).toLowerCase();
}

export function isAllowedStandardDocumentFile(
  file: Pick<Express.Multer.File, 'mimetype' | 'originalname'>,
): boolean {
  const ext = standardDocumentExtension(file.originalname);
  const mime = String(file.mimetype ?? '').toLowerCase();

  if (BLOCKED_DOCUMENT_EXTENSIONS.has(ext) || BLOCKED_DOCUMENT_MIMES.has(mime)) {
    return false;
  }

  const extAllowed = STANDARD_DOCUMENT_EXTENSIONS.has(ext);
  const mimeAllowed = STANDARD_DOCUMENT_MIMES.has(mime);
  const untrustedMime = UNTRUSTED_MIMES_ALLOWED_WITH_EXTENSION.has(mime);

  if (ext && !extAllowed) {
    return false;
  }

  if (mimeAllowed) {
    return extAllowed || !ext;
  }

  if (untrustedMime && extAllowed) {
    return true;
  }

  return false;
}

export function assertStandardDocumentFileTypes(
  files: Express.Multer.File[],
): void {
  for (const file of files) {
    if (!isAllowedStandardDocumentFile(file)) {
      throw new BadRequestException(STANDARD_DOCUMENT_VALIDATION_MESSAGE);
    }
  }
}

export function standardDocumentMulterFileFilter(
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void {
  if (!file) {
    cb(null, true);
    return;
  }
  if (isAllowedStandardDocumentFile(file)) {
    cb(null, true);
    return;
  }
  cb(
    new BadRequestException(
      STANDARD_DOCUMENT_VALIDATION_MESSAGE,
    ) as unknown as null,
    false,
  );
}
