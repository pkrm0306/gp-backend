import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { DocumentVersioningService } from '../../documents/document-versioning.service';
import {
  buildAllProductDocumentTrackInput,
  slotKeyFromProductDocumentId,
} from '../../documents/helpers/document-version.helper';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentDocument,
} from '../schemas/all-renew-product-document.schema';
import { toRenewObjectId } from '../helpers/renew-common.util';
import {
  fetchRenewCertifiedEoiSet,
  filterRenewRowsByCertifiedEoi,
} from '../helpers/renew-eligible-product.util';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';

/**
 * On renewal completion, ensure doc streams for the cycle point at the latest
 * renew upload per (section, subsection, slot) so history/main views show current files.
 */
@Injectable()
export class RenewDocumentPromotionService {
  private readonly logger = new Logger(RenewDocumentPromotionService.name);

  constructor(
    @InjectModel(AllRenewProductDocument.name)
    private readonly renewDocumentModel: Model<AllRenewProductDocumentDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly documentVersioningService: DocumentVersioningService,
  ) {}

  async promoteRenewDocumentsForCompletedCycle(
    urnNo: string,
    renewalCycleId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<number> {
    const trimmedUrn = urnNo.trim();
    const cycleObjectId = toRenewObjectId(renewalCycleId, 'renewalCycleId');

    const query = this.renewDocumentModel.find({
      urnNo: trimmedUrn,
      renewalCycleId: cycleObjectId,
      isDeleted: { $ne: true },
    });
    if (session) {
      query.session(session);
    }
    const docs = await query.lean().exec();
    const certifiedEoiNos = await fetchRenewCertifiedEoiSet(this.productModel, trimmedUrn);
    const eligibleDocs = filterRenewRowsByCertifiedEoi(docs, certifiedEoiNos);

    const latestBySlot = new Map<string, (typeof eligibleDocs)[number]>();
    for (const doc of eligibleDocs) {
      const key = `${doc.documentForm}|${doc.documentFormSubsection ?? ''}|${doc.productDocumentId}`;
      const existing = latestBySlot.get(key);
      const docUpdated = new Date(doc.updatedDate ?? doc.createdDate ?? 0).getTime();
      const existingUpdated = existing
        ? new Date(existing.updatedDate ?? existing.createdDate ?? 0).getTime()
        : -1;
      if (!existing || docUpdated >= existingUpdated) {
        latestBySlot.set(key, doc);
      }
    }

    let promoted = 0;
    for (const doc of latestBySlot.values()) {
      try {
        await this.documentVersioningService.trackDocumentVersionChange(
          buildAllProductDocumentTrackInput({
            urnNo: trimmedUrn,
            sectionKey: String(doc.documentForm),
            subsectionKey: doc.documentFormSubsection ?? null,
            slotKey: slotKeyFromProductDocumentId(doc.productDocumentId),
            action: 'replaced',
            documentId: doc._id as Types.ObjectId,
            productDocumentId: doc.productDocumentId,
            filePath: doc.documentLink ?? null,
            originalName: doc.documentOriginalName ?? null,
            storedName: doc.documentName ?? null,
            userId,
            processType: 'renewal',
            renewalCycleId: cycleObjectId,
            session,
          }),
        );
        promoted += 1;
      } catch (error) {
        this.logger.warn(
          `Renew document promotion skipped for URN ${trimmedUrn} productDocumentId ${doc.productDocumentId}`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    return promoted;
  }
}
