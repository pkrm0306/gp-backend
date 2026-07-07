import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE =
  'Only PDF, JPG, and PNG (.pdf, .jpg, .jpeg, .png) files are allowed';

export const VENDOR_PROFILE_DOCUMENT_EXTENSIONS = new Set([
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
]);

export const VENDOR_PROFILE_DOCUMENT_MIMES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
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

export function vendorProfileDocumentExtension(
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
  if (ext === '.jpg' || ext === '.jpeg') {
    return (
      mime === 'image/jpeg' || mime === 'image/jpg' || mime === 'image/pjpeg'
    );
  }
  if (ext === '.png') {
    return mime === 'image/png';
  }
  if (!ext) {
    return VENDOR_PROFILE_DOCUMENT_MIMES.has(mime);
  }
  return false;
}

export function isAllowedVendorProfileDocumentFile(
  file: Pick<Express.Multer.File, 'mimetype' | 'originalname'>,
): boolean {
  const ext = vendorProfileDocumentExtension(file.originalname);
  const mime = String(file.mimetype ?? '').toLowerCase();

  if (BLOCKED_DOCUMENT_MIMES.has(mime)) {
    return false;
  }

  const extAllowed = VENDOR_PROFILE_DOCUMENT_EXTENSIONS.has(ext);
  const mimeAllowed = VENDOR_PROFILE_DOCUMENT_MIMES.has(mime);

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

export function assertVendorProfileDocumentFileTypes(
  files: Express.Multer.File[],
): void {
  for (const file of files) {
    if (!isAllowedVendorProfileDocumentFile(file)) {
      throw new BadRequestException(VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE);
    }
  }
}
