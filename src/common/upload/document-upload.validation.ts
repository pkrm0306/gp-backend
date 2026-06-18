import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const STANDARD_DOCUMENT_VALIDATION_MESSAGE =
  'Only PDF and Excel (.pdf, .xls, .xlsx) files are allowed';

export const STANDARD_DOCUMENT_EXTENSIONS = new Set(['.pdf', '.xls', '.xlsx']);

export const STANDARD_DOCUMENT_MIMES = new Set([
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

const UNTRUSTED_MIMES_ALLOWED_WITH_EXTENSION = new Set([
  'application/octet-stream',
  'binary/octet-stream',
  '',
]);

const BLOCKED_DOCUMENT_MIMES = new Set([
  'application/javascript',
  'text/javascript',
  'application/x-javascript',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip',
  'multipart/x-zip',
  'application/x-msdownload',
]);

export function standardDocumentExtension(
  originalname?: string | null,
): string {
  return extname(String(originalname ?? '')).toLowerCase();
}

function mimeMatchesExtension(ext: string, mime: string): boolean {
  if (UNTRUSTED_MIMES_ALLOWED_WITH_EXTENSION.has(mime)) {
    return true;
  }
  if (ext === '.pdf') {
    return mime === 'application/pdf';
  }
  if (ext === '.xlsx') {
    return (
      mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  }
  if (ext === '.xls') {
    return mime === 'application/vnd.ms-excel';
  }
  if (!ext) {
    return STANDARD_DOCUMENT_MIMES.has(mime);
  }
  return false;
}

export function isAllowedStandardDocumentFile(
  file: Pick<Express.Multer.File, 'mimetype' | 'originalname'>,
): boolean {
  const ext = standardDocumentExtension(file.originalname);
  const mime = String(file.mimetype ?? '').toLowerCase();

  if (BLOCKED_DOCUMENT_MIMES.has(mime)) {
    return false;
  }

  const extAllowed = STANDARD_DOCUMENT_EXTENSIONS.has(ext);
  const mimeAllowed = STANDARD_DOCUMENT_MIMES.has(mime);

  if (ext && !extAllowed) {
    return false;
  }

  if (!ext && !mimeAllowed) {
    return false;
  }

  if (ext && !mimeMatchesExtension(ext, mime)) {
    return false;
  }

  if (mimeAllowed || UNTRUSTED_MIMES_ALLOWED_WITH_EXTENSION.has(mime)) {
    return extAllowed || !ext;
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
