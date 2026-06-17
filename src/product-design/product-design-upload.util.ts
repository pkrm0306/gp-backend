import {
  assertStandardDocumentFileTypes,
  isAllowedStandardDocumentFile,
  STANDARD_DOCUMENT_EXTENSIONS,
  STANDARD_DOCUMENT_MIMES,
  STANDARD_DOCUMENT_VALIDATION_MESSAGE,
} from '../common/upload/document-upload.validation';
import {
  hasPartialMeasureBenefitRow,
  normalizeMeasureBenefitRow,
} from '../common/form-partial-field.util';

/** Multipart field names for eco vision uploads (repeat per file). */
export const PRODUCT_DESIGN_ECO_VISION_FIELD_NAMES = new Set([
  'ecoVisionFile',
  'ecoVisionFiles',
  'eco_vision',
  'ecoVision',
  'eco_vision_upload',
  'ecoVisionUpload',
  'ecoVisionDocument',
  'ecoVisionDocuments',
  'document',
  'documents',
  'documentFile',
  'documentFiles',
  'file',
  'upload',
]);

/** Multipart field names for product design supporting document uploads. */
export const PRODUCT_DESIGN_SUPPORTING_FIELD_NAMES = new Set([
  'supportingDesignFile',
  'supportingDocumentFile',
  'supportingDocumentFiles',
  'supportingDocuments',
  'productDesignSupportingDocument',
  'supporting_document',
  'supporting_documents',
  'supportingDesignDocuments',
  'supportingDesignDocument',
]);

export const ECO_VISION_SUBSECTION = 'eco_vision_upload';
export const SUPPORTING_SUBSECTION = 'supporting_documents';

/** Supporting design uploads: standard document types (PDF, images, Word). */
export const SUPPORTING_DESIGN_ALLOWED_EXTENSIONS = STANDARD_DOCUMENT_EXTENSIONS;

export const SUPPORTING_DESIGN_ALLOWED_MIMES = STANDARD_DOCUMENT_MIMES;

export function isAllowedSupportingDesignFile(
  file: Express.Multer.File,
): boolean {
  return isAllowedStandardDocumentFile(file);
}

export function assertSupportingDesignFileTypes(
  files: Express.Multer.File[],
): void {
  assertStandardDocumentFileTypes(files);
}

export { STANDARD_DOCUMENT_VALIDATION_MESSAGE as SUPPORTING_DESIGN_VALIDATION_MESSAGE };

/** Exact copy for vendor toast / API 400 (productDesignFormFilled.ts). */
export const PRODUCT_DESIGN_EMPTY_FORM_MESSAGE =
  'Please fill in at least one field in the form before continuing.';

function hasAnyValidMultipartUpload(files?: Express.Multer.File[]): boolean {
  return (files ?? []).some((file) => isValidUploadPart(file));
}

export function hasAtLeastOneProductDesignFieldFilled(params: {
  strategies?: string;
  measuresAndBenefits?: Array<{
    measuresImplemented?: string;
    benefitsAchieved?: string;
  }>;
  ecoVisionFiles: Express.Multer.File[];
  supportingDocumentFiles: Express.Multer.File[];
  /** Any multipart file part — document-only saves must not fail when field names differ. */
  allUploadFiles?: Express.Multer.File[];
}): boolean {
  if (hasAnyValidMultipartUpload(params.allUploadFiles)) {
    return true;
  }
  if (params.ecoVisionFiles.length > 0) {
    return true;
  }
  if (params.supportingDocumentFiles.length > 0) {
    return true;
  }
  if (String(params.strategies ?? '').trim()) {
    return true;
  }
  const rows = params.measuresAndBenefits ?? [];
  return rows.some((row) =>
    hasPartialMeasureBenefitRow(row as Record<string, unknown>),
  );
}

export { normalizeMeasureBenefitRow, normalizeMeasureBenefitRows } from '../common/form-partial-field.util';

/**
 * Vendor “≥ 1 field” rule including persisted documents after existing*DocumentIds.
 */
export function hasAtLeastOneProductDesignContent(params: {
  strategies?: string;
  measuresAndBenefits?: Array<{
    measuresImplemented?: string;
    benefitsAchieved?: string;
  }>;
  ecoVisionFiles: Express.Multer.File[];
  supportingDocumentFiles: Express.Multer.File[];
  allUploadFiles?: Express.Multer.File[];
  retainedEcoVisionDocumentCount?: number;
  retainedSupportingDocumentCount?: number;
}): boolean {
  if (
    hasAtLeastOneProductDesignFieldFilled({
      strategies: params.strategies,
      measuresAndBenefits: params.measuresAndBenefits,
      ecoVisionFiles: params.ecoVisionFiles,
      supportingDocumentFiles: params.supportingDocumentFiles,
      allUploadFiles: params.allUploadFiles,
    })
  ) {
    return true;
  }
  if ((params.retainedEcoVisionDocumentCount ?? 0) > 0) {
    return true;
  }
  if ((params.retainedSupportingDocumentCount ?? 0) > 0) {
    return true;
  }
  return false;
}

function isValidUploadPart(file: Express.Multer.File): boolean {
  return Boolean(
    file?.originalname ||
      (file?.size ?? 0) > 0 ||
      (file?.buffer?.length ?? 0) > 0,
  );
}

export function parseMultipartJsonIdArray(
  value: unknown,
): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map((id) => String(id).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return [];
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((id) => String(id).trim()).filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  }
  return [];
}

export function parseMultipartNonNegativeInt(
  value: unknown,
): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const n = parseInt(String(value), 10);
  if (!Number.isFinite(n) || n < 0) {
    return undefined;
  }
  return n;
}

export type CollectProductDesignUploadOptions = {
  ecoVisionFilesCount?: number;
  supportingDesignFilesCount?: number;
};

/**
 * Split multipart files by field name.
 * Legacy `files`: first `ecoVisionFilesCount` → eco vision, remainder → supporting.
 * Legacy `files` without counts: all parts → eco vision.
 */
export function collectProductDesignUploadFiles(
  files?: Express.Multer.File[],
  options?: CollectProductDesignUploadOptions,
): {
  ecoVisionFiles: Express.Multer.File[];
  supportingDocumentFiles: Express.Multer.File[];
} {
  const ecoVisionFiles: Express.Multer.File[] = [];
  const supportingDocumentFiles: Express.Multer.File[] = [];
  const legacyFiles: Express.Multer.File[] = [];

  for (const file of files ?? []) {
    if (!isValidUploadPart(file)) continue;
    const field = String(file.fieldname ?? 'files');
    if (PRODUCT_DESIGN_ECO_VISION_FIELD_NAMES.has(field)) {
      ecoVisionFiles.push(file);
    } else if (PRODUCT_DESIGN_SUPPORTING_FIELD_NAMES.has(field)) {
      supportingDocumentFiles.push(file);
    } else if (field === 'files') {
      legacyFiles.push(file);
    }
  }

  const hasExplicit =
    ecoVisionFiles.length > 0 || supportingDocumentFiles.length > 0;

  if (!hasExplicit && legacyFiles.length > 0) {
    const ecoCount = options?.ecoVisionFilesCount;
    const supportingCount = options?.supportingDesignFilesCount;

    if (ecoCount !== undefined || supportingCount !== undefined) {
      const ecoN = Math.min(ecoCount ?? 0, legacyFiles.length);
      ecoVisionFiles.push(...legacyFiles.slice(0, ecoN));
      supportingDocumentFiles.push(...legacyFiles.slice(ecoN));
    } else {
      ecoVisionFiles.push(...legacyFiles);
    }
  }

  return { ecoVisionFiles, supportingDocumentFiles };
}

