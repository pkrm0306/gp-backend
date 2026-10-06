import { ClientSession, Model, Types } from 'mongoose';
import {
  partitionLiveDocumentsForDesiredState,
  type DocumentIdKeepRefs,
  type DesiredStateDocRef,
} from './desired-document-state.sync';
import { trackProductDocumentDeleteBatch } from './product-document-version.integration';
import { DocumentVersioningService } from '../document-versioning.service';

export type CertificationDesiredStateDoc = DesiredStateDocRef & {
  _id: Types.ObjectId;
  documentFormSubsection?: string | null;
  isDeleted?: boolean;
};

/**
 * Soft-delete live certification documents that are not in the DesiredState keep set.
 * keepRefs === null → retain all (legacy omit / text-only).
 * keepRefs provided (incl. empty) → remove unlisted from the live set.
 */
export async function softDeleteUnkeptCertificationDocuments(params: {
  documentModel: Model<any>;
  versioning: DocumentVersioningService;
  urnNo: string;
  sectionKey: string;
  vendorObjectId: Types.ObjectId;
  now: Date;
  /** Optional — omit for non-transactional raw-materials sync paths. */
  session?: ClientSession;
  liveDocs: CertificationDesiredStateDoc[];
  keepRefs: DocumentIdKeepRefs | null;
  historyHidden?: boolean;
}): Promise<{
  retainIds: Types.ObjectId[];
  removeIds: Types.ObjectId[];
  oldFileLinks: string[];
  remove: CertificationDesiredStateDoc[];
}> {
  const {
    documentModel,
    versioning,
    urnNo,
    sectionKey,
    vendorObjectId,
    now,
    session,
    liveDocs,
    keepRefs,
    historyHidden = true,
  } = params;

  const part = partitionLiveDocumentsForDesiredState(liveDocs, keepRefs);

  if (part.removeIds.length) {
    await documentModel.updateMany(
      { _id: { $in: part.removeIds } },
      {
        $set: {
          isDeleted: true,
          ...(historyHidden ? { historyHidden: true } : {}),
          deletedAt: now,
          deletedBy: vendorObjectId,
          updatedDate: now,
        },
      },
      session ? { session } : undefined,
    );
    await trackProductDocumentDeleteBatch({
      versioning,
      urnNo,
      sectionKey,
      userId: vendorObjectId,
      docs: part.remove as Array<{
        _id: Types.ObjectId;
        productDocumentId: number;
        documentFormSubsection?: string | null;
        documentLink?: string | null;
      }>,
      slotKeyMode: 'subsection',
      ...(session ? { session } : {}),
    });
  }

  return {
    retainIds: part.retainIds,
    removeIds: part.removeIds,
    oldFileLinks: part.oldFileLinks,
    remove: part.remove as CertificationDesiredStateDoc[],
  };
}

export function resolveDesiredDocumentIdRefs(ids: string[]): DocumentIdKeepRefs {
  const objectIds: Types.ObjectId[] = [];
  const productDocumentIds: number[] = [];
  for (const raw of ids) {
    const value = String(raw).trim();
    if (!value) continue;
    if (Types.ObjectId.isValid(value) && /^[a-fA-F0-9]{24}$/.test(value)) {
      objectIds.push(new Types.ObjectId(value));
      continue;
    }
    const numericId = Number(value);
    if (Number.isFinite(numericId)) {
      productDocumentIds.push(numericId);
    }
  }
  return { objectIds, productDocumentIds };
}
