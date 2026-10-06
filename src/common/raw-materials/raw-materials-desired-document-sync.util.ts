import { Model, Types } from 'mongoose';
import { DocumentVersioningService } from '../../documents/document-versioning.service';
import {
  resolveDesiredDocumentIdRefs,
  softDeleteUnkeptCertificationDocuments,
  type CertificationDesiredStateDoc,
} from '../../documents/helpers/desired-document-state.apply';

/**
 * Soft-delete unkept supporting docs for a raw-materials documentForm
 * (and optional subsection) when existingDocumentIds is provided.
 * Omit keep list → retain all (legacy).
 */
export async function softDeleteUnkeptRawMaterialsSupportingDocuments(params: {
  documentModel: Model<any>;
  versioning: DocumentVersioningService;
  urnNo: string;
  vendorObjectId: Types.ObjectId;
  sectionKey: string;
  documentForm: string | { $in: string[] };
  existingDocumentIds?: string[];
  documentFormSubsection?: string | string[];
  now?: Date;
}): Promise<{ oldFileLinks: string[] }> {
  const {
    documentModel,
    versioning,
    urnNo,
    vendorObjectId,
    sectionKey,
    documentForm,
    existingDocumentIds,
    documentFormSubsection,
    now = new Date(),
  } = params;

  if (existingDocumentIds === undefined) {
    return { oldFileLinks: [] };
  }

  const query: Record<string, unknown> = {
    vendorId: vendorObjectId,
    urnNo,
    documentForm,
    isDeleted: { $ne: true },
  };
  if (documentFormSubsection !== undefined) {
    query.documentFormSubsection = Array.isArray(documentFormSubsection)
      ? { $in: documentFormSubsection }
      : documentFormSubsection;
  }

  const liveDocs = (await documentModel.find(query).exec()) as CertificationDesiredStateDoc[];
  const sync = await softDeleteUnkeptCertificationDocuments({
    documentModel,
    versioning,
    urnNo,
    sectionKey,
    vendorObjectId,
    now,
    liveDocs,
    keepRefs: resolveDesiredDocumentIdRefs(existingDocumentIds),
  });
  return { oldFileLinks: sync.oldFileLinks };
}

export function filterUploadFilesByFieldNames(
  uploadedFiles: Express.Multer.File[] | undefined,
  fieldNames: string[],
): Express.Multer.File[] {
  if (!uploadedFiles?.length) return [];
  const allowed = new Set(fieldNames.map((n) => n.toLowerCase()));
  const matched = uploadedFiles.filter((f) =>
    allowed.has(String(f.fieldname ?? '').toLowerCase()),
  );
  return matched.length > 0 ? matched : uploadedFiles;
}
