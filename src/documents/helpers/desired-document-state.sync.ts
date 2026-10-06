import { Types } from 'mongoose';

/**
 * DesiredState document sync: keepDocumentIds + new uploads.
 * Never wipe the live set merely because uploads are present.
 */

export type DocumentIdKeepRefs = {
  objectIds: Types.ObjectId[];
  productDocumentIds: number[];
};

export type DesiredStateDocRef = {
  _id?: Types.ObjectId;
  productDocumentId?: number;
  documentLink?: string | null;
};

export type DesiredStatePartition<T extends DesiredStateDocRef> = {
  retain: T[];
  remove: T[];
  retainIds: Types.ObjectId[];
  removeIds: Types.ObjectId[];
  oldFileLinks: string[];
};

export function docMatchesDesiredKeepRefs(
  doc: DesiredStateDocRef,
  refs: DocumentIdKeepRefs,
): boolean {
  if (
    doc._id &&
    refs.objectIds.some((id) => id.equals(doc._id as Types.ObjectId))
  ) {
    return true;
  }
  return (
    doc.productDocumentId !== undefined &&
    refs.productDocumentIds.includes(doc.productDocumentId)
  );
}

/**
 * Partition live docs for DesiredState sync.
 *
 * - keepRefs === null → retain all (omit keep list; append-only / text-only save)
 * - keepRefs provided → retain only matching IDs; remove the rest
 * - uploadedFilesLength is ignored for retention (must not force supersede)
 */
export function partitionLiveDocumentsForDesiredState<T extends DesiredStateDocRef>(
  liveDocs: T[],
  keepRefs: DocumentIdKeepRefs | null,
): DesiredStatePartition<T> {
  const retain: T[] = [];
  const remove: T[] = [];
  const retainIds: Types.ObjectId[] = [];
  const removeIds: Types.ObjectId[] = [];
  const oldFileLinks: string[] = [];

  for (const doc of liveDocs) {
    const shouldRetain =
      keepRefs === null || docMatchesDesiredKeepRefs(doc, keepRefs);
    if (shouldRetain) {
      retain.push(doc);
      if (doc._id) retainIds.push(doc._id as Types.ObjectId);
    } else {
      remove.push(doc);
      if (doc._id) removeIds.push(doc._id as Types.ObjectId);
      if (doc.documentLink) oldFileLinks.push(doc.documentLink);
    }
  }

  return { retain, remove, retainIds, removeIds, oldFileLinks };
}
