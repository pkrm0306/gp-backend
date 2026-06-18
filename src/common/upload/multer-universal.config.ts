import { BadRequestException } from '@nestjs/common';
import { memoryStorage, Options } from 'multer';
import {
  isAllowedStandardDocumentFile,
  standardDocumentMulterFileFilter,
  STANDARD_DOCUMENT_VALIDATION_MESSAGE,
} from './document-upload.validation';

const TEN_MB = 10 * 1024 * 1024;
const FIVE_MB = 5 * 1024 * 1024;

const ADMIN_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

/**
 * Memory storage for S3 or local upload via `uploadFile()` helper.
 * Allowed: standard document types — max 10MB.
 */
export function universalMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: TEN_MB },
    fileFilter: standardDocumentMulterFileFilter,
  };
}

/**
 * Standards create/update (`file` field). Memory buffer → shared `uploadFile()` in
 * `src/utils/upload-file.util.ts` (local `uploads/standards/` or S3).
 */
export function standardsDocumentMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: TEN_MB },
    fileFilter: standardDocumentMulterFileFilter,
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

/** Admin articles: image fields + standard documents on `pdf` / `file`. */
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
        if (isAllowedStandardDocumentFile(file)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              STANDARD_DOCUMENT_VALIDATION_MESSAGE,
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

/** Certification / URN multipart document uploads. */
export function certificationMultipartMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: TEN_MB },
    fileFilter: standardDocumentMulterFileFilter,
  };
}

/** Product performance — test report files. */
export function productPerformanceMultipartMemoryMulterOptions(
  maxFiles = 20,
): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: TEN_MB, files: maxFiles },
    fileFilter: standardDocumentMulterFileFilter,
  };
}

/** Raw Materials steps — all upload fields, 10MB (vendor supporting docs). */
export function rawMaterialsMultipartMemoryMulterOptions(
  maxFiles = 20,
): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: TEN_MB, files: maxFiles },
    fileFilter: standardDocumentMulterFileFilter,
  };
}

/** Product design — PDF and Excel only, max 40 parts. */
function productDesignMultipartFileFilter(
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void {
  standardDocumentMulterFileFilter(_req, file, cb);
}

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
    fileFilter: standardDocumentMulterFileFilter,
  };
}

const FIFTY_MB = 50 * 1024 * 1024;

function assessmentReportFileFilter(
  _req: unknown,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void {
  if (!file) {
    cb(null, true);
    return;
  }
  const name = String(file.originalname ?? '').trim();
  if (!name || name.endsWith('/') || name.endsWith('\\')) {
    cb(
      new BadRequestException(
        'Folder uploads are not allowed for assessment reports.',
      ) as unknown as null,
      false,
    );
    return;
  }
  if (!isAllowedStandardDocumentFile(file)) {
    cb(
      new BadRequestException(
        STANDARD_DOCUMENT_VALIDATION_MESSAGE,
      ) as unknown as null,
      false,
    );
    return;
  }
  cb(null, true);
}

/** Admin URN assessment report — standard document types, max 50MB. */
export function assessmentReportMemoryMulterOptions(): Options {
  return {
    storage: memoryStorage(),
    limits: { fileSize: FIFTY_MB },
    fileFilter: assessmentReportFileFilter,
  };
}
