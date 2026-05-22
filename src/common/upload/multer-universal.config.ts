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

function certificationMultipartFileFilter(
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void {
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
}

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

const STANDARD_DOC_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);

/**
 * Standards create/update (`file` field). Memory buffer → shared `uploadFile()` in
 * `src/utils/upload-file.util.ts` (local `uploads/standards/` or S3).
 */
export function standardsDocumentMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: TEN_MB },
    fileFilter: (_req, file, cb) => {
      if (!file?.originalname) {
        cb(null, true);
        return;
      }
      const ext = extname(file.originalname || '').toLowerCase();
      if (
        UNIVERSAL_MIMES.has(file.mimetype) ||
        STANDARD_DOC_EXTENSIONS.has(ext)
      ) {
        cb(null, true);
        return;
      }
      cb(
        new BadRequestException(
          'Standard document must be PDF, JPG, or PNG (max 10MB).',
        ) as unknown as null,
        false,
      );
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
    fileFilter: certificationMultipartFileFilter,
  };
}

/** Product performance — multiple test report files per request (max 20). */
export function productPerformanceMultipartMemoryMulterOptions(
  maxFiles = 20,
): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: TEN_MB, files: maxFiles },
    fileFilter: certificationMultipartFileFilter,
  };
}

const PRODUCT_DESIGN_SUPPORTING_FIELD_NAMES = new Set([
  'supportingDesignFile',
  'supportingDocumentFile',
  'supportingDocumentFiles',
  'supportingDocuments',
  'productDesignSupportingDocument',
  'supporting_document',
  'supporting_documents',
]);

const SUPPORTING_DESIGN_EXTENSIONS = new Set(['.pdf', '.xls', '.xlsx']);
const SUPPORTING_DESIGN_MIMES = new Set([
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

function productDesignMultipartFileFilter(
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void {
  if (!file) {
    cb(null, true);
    return;
  }
  const field = String(file.fieldname ?? '');
  if (PRODUCT_DESIGN_SUPPORTING_FIELD_NAMES.has(field)) {
    const fileExt = extname(file.originalname || '').toLowerCase();
    if (
      SUPPORTING_DESIGN_MIMES.has(file.mimetype) ||
      SUPPORTING_DESIGN_EXTENSIONS.has(fileExt)
    ) {
      cb(null, true);
      return;
    }
    cb(
      new BadRequestException(
        'Invalid supporting document type. Only PDF and Excel (.pdf, .xls, .xlsx) files are allowed.',
      ) as unknown as null,
      false,
    );
    return;
  }
  certificationMultipartFileFilter(_req, file, cb);
}

/** Product design — eco vision (broad types) + supporting (PDF/Excel only), max 40 parts. */
export function productDesignMultipartMemoryMulterOptions(
  maxFiles = 40,
): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: TEN_MB, files: maxFiles },
    fileFilter: productDesignMultipartFileFilter,
  };
}

/**
 * Waste management supporting documents — same types as certification, but much
 * larger default per-file limit (large PDFs / directories). 413 from Multer was
 * caused by the 10MB certification cap.
 *
 * Set **WM_SUPPORTING_DOCS_MAX_FILE_MB** (megabytes) to override; default **1024** (1 GB).
 */
export function wasteManagementMultipartMemoryMulterOptions(): Options {
  const raw = process.env.WM_SUPPORTING_DOCS_MAX_FILE_MB;
  let maxMb = 1024;
  if (raw !== undefined && raw !== '') {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) {
      maxMb = n;
    }
  }
  return {
    storage: memoryStorage(),
    limits: { fileSize: maxMb * 1024 * 1024 },
    fileFilter: certificationMultipartFileFilter,
  };
}
