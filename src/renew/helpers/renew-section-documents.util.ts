import { ForbiddenException } from '@nestjs/common';
import { ClientSession, Model, Types } from 'mongoose';
import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentDocument,
} from '../schemas/all-renew-product-document.schema';
import { DocumentVersioningService } from '../../documents/document-versioning.service';
import {
  trackProductDocumentBatch,
  trackProductDocumentDeleteBatch,
} from '../../documents/helpers/product-document-version.integration';

export function resolveRenewDocumentIdRefs(ids: string[]): {
  objectIds: Types.ObjectId[];
  productDocumentIds: number[];
} {
  const objectIds: Types.ObjectId[] = [];
  const productDocumentIds: number[] = [];
  for (const raw of ids) {
    const value = String(raw).trim();
    if (!value) continue;
    if (Types.ObjectId.isValid(value)) {
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

export function renewDocumentMatchesIdRefs(
  doc: { _id?: Types.ObjectId; productDocumentId?: number },
  refs: { objectIds: Types.ObjectId[]; productDocumentIds: number[] },
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

export function buildRenewSectionDocMigrationFilter(
  urnNo: string,
  renewalCycleObjectId: Types.ObjectId,
  sectionKey: DocumentSectionKey,
  strictCycleOnly: boolean,
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    urnNo: urnNo.trim(),
    documentForm: sectionKey,
    isDeleted: { $ne: true },
  };
  if (strictCycleOnly) {
    return { ...base, renewalCycleId: renewalCycleObjectId };
  }
  return {
    ...base,
    $or: [
      { renewalCycleId: renewalCycleObjectId },
      { renewalCycleId: null },
      { renewalCycleId: { $exists: false } },
    ],
  };
}

export function assertRenewDocumentMatchesCycle(
  document: { renewalCycleId?: Types.ObjectId | null },
  requestedCycleId: Types.ObjectId,
  cycleNo: number,
): void {
  const docCycle = document.renewalCycleId;
  if (!docCycle) {
    if (cycleNo > 1) {
      throw new ForbiddenException('renewalCycleId does not match document cycle');
    }
    return;
  }
  if (!docCycle.equals(requestedCycleId)) {
    throw new ForbiddenException('renewalCycleId does not match document cycle');
  }
}

export async function applyRenewSectionDocumentKeepList(params: {
  renewDocumentModel: Model<AllRenewProductDocumentDocument>;
  documentVersioningService: DocumentVersioningService;
  urnNo: string;
  vendorObjectId: Types.ObjectId;
  renewalCycleObjectId: Types.ObjectId;
  cycleNo: number;
  sectionKey: DocumentSectionKey;
  existingDocumentIds?: string[];
  now: Date;
  session: ClientSession;
}): Promise<string[]> {
  const {
    renewDocumentModel,
    documentVersioningService,
    urnNo,
    vendorObjectId,
    renewalCycleObjectId,
    cycleNo,
    sectionKey,
    existingDocumentIds,
    now,
    session,
  } = params;

  if (existingDocumentIds === undefined) {
    return [];
  }

  const keepRefs = resolveRenewDocumentIdRefs(existingDocumentIds);
  const baseFilter = buildRenewSectionDocMigrationFilter(
    urnNo,
    renewalCycleObjectId,
    sectionKey,
    cycleNo > 1,
  );

  const existingDocs = await renewDocumentModel.find(baseFilter).session(session);
  const deleteIds: Types.ObjectId[] = [];
  const docsToDelete: AllRenewProductDocumentDocument[] = [];
  const oldFileLinksToDeleteAfterCommit: string[] = [];

  for (const doc of existingDocs) {
    if (renewDocumentMatchesIdRefs(doc, keepRefs)) {
      await renewDocumentModel.updateOne(
        { _id: doc._id },
        {
          $set: {
            renewalCycleId: renewalCycleObjectId,
            updatedDate: now,
          },
        },
        { session },
      );
      continue;
    }
    deleteIds.push(doc._id as Types.ObjectId);
    docsToDelete.push(doc);
    if (doc.documentLink) {
      oldFileLinksToDeleteAfterCommit.push(doc.documentLink);
    }
  }

  if (deleteIds.length) {
    await renewDocumentModel.updateMany(
      { _id: { $in: deleteIds } },
      {
        $set: {
          isDeleted: true,
          deletedAt: now,
          deletedBy: vendorObjectId,
          updatedDate: now,
        },
      },
      { session },
    );
    await trackProductDocumentDeleteBatch({
      versioning: documentVersioningService,
      urnNo,
      sectionKey,
      userId: vendorObjectId,
      docs: docsToDelete,
      processType: 'renewal',
      renewalCycleId: renewalCycleObjectId,
      session,
    });
  }

  return oldFileLinksToDeleteAfterCommit;
}

export async function insertRenewSectionDocuments(params: {
  renewDocumentModel: Model<AllRenewProductDocumentDocument>;
  documentVersioningService: DocumentVersioningService;
  urnNo: string;
  vendorObjectId: Types.ObjectId;
  manufacturerObjectId: Types.ObjectId;
  renewalCycleObjectId: Types.ObjectId;
  sectionKey: DocumentSectionKey;
  formPrimaryId: number;
  now: Date;
  session: ClientSession;
  rows: Array<{
    productDocumentId: number;
    documentFormSubsection: string;
    documentName: string;
    documentOriginalName: string;
    documentLink: string;
    eoiNo?: string;
    documentTag?: 'tech' | 'process' | 'social';
  }>;
}): Promise<void> {
  const {
    renewDocumentModel,
    documentVersioningService,
    urnNo,
    vendorObjectId,
    manufacturerObjectId,
    renewalCycleObjectId,
    sectionKey,
    formPrimaryId,
    now,
    session,
    rows,
  } = params;

  if (!rows.length) {
    return;
  }

  const docsToInsert = rows.map((row) => ({
    productDocumentId: row.productDocumentId,
    vendorId: vendorObjectId,
    manufacturerId: manufacturerObjectId,
    urnNo,
    renewalCycleId: renewalCycleObjectId,
    eoiNo: row.eoiNo,
    documentForm: sectionKey,
    documentFormSubsection: row.documentFormSubsection,
    formPrimaryId,
    documentName: row.documentName,
    documentOriginalName: row.documentOriginalName,
    documentLink: row.documentLink,
    documentTag: row.documentTag,
    createdDate: now,
    updatedDate: now,
  }));

  const inserted = await renewDocumentModel.insertMany(docsToInsert, { session });
  await trackProductDocumentBatch({
    versioning: documentVersioningService,
    urnNo,
    sectionKey,
    userId: vendorObjectId,
    docs: inserted,
    processType: 'renewal',
    renewalCycleId: renewalCycleObjectId,
    session,
  });
}
