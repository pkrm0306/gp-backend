import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { DocumentVersioningService } from '../../documents/document-versioning.service';
import {
  buildAllProductDocumentTrackInput,
} from '../../documents/helpers/document-version.helper';
import {
  certificationStreamSlotKeyForDocument,
  normalizeCertificationSubsection,
} from '../../documents/helpers/certification-document-version.util';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../../product-design/schemas/all-product-document.schema';
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

function renewDocSlotKey(doc: {
  documentForm: string;
  documentFormSubsection?: string | null;
  documentTag?: string | null;
}): string {
  const subsection =
    normalizeCertificationSubsection(
      String(doc.documentForm),
      doc.documentFormSubsection ?? null,
    ) ?? doc.documentFormSubsection ?? '';
  return `${doc.documentForm}|${subsection}|${doc.documentTag ?? ''}`;
}

/**
 * On renewal completion, copy renew uploads into all_product_documents and
 * point initial-process version streams at the latest file per subsection slot.
 */
@Injectable()
export class RenewDocumentPromotionService {
  private readonly logger = new Logger(RenewDocumentPromotionService.name);

  constructor(
    @InjectModel(AllRenewProductDocument.name)
    private readonly renewDocumentModel: Model<AllRenewProductDocumentDocument>,
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
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
    const userObjectId =
      userId instanceof Types.ObjectId ? userId : new Types.ObjectId(String(userId));
    const now = new Date();

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
      const key = renewDocSlotKey(doc);
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
        const sectionKey = String(doc.documentForm);
        const slotFilter: Record<string, unknown> = {
          urnNo: trimmedUrn,
          documentForm: doc.documentForm,
          isDeleted: { $ne: true },
          productDocumentId: { $ne: doc.productDocumentId },
        };
        const slotSubsection =
          normalizeCertificationSubsection(
            sectionKey,
            doc.documentFormSubsection ?? null,
          ) ?? doc.documentFormSubsection;
        if (slotSubsection) {
          slotFilter.documentFormSubsection = slotSubsection;
        }
        if (doc.documentTag) {
          slotFilter.documentTag = doc.documentTag;
        }

        await this.allProductDocumentModel.updateMany(
          slotFilter,
          {
            $set: {
              isDeleted: true,
              deletedAt: now,
              deletedBy: userObjectId,
              updatedDate: now,
            },
          },
          session ? { session } : {},
        );

        const existingProductDocQuery = this.allProductDocumentModel.findOne({
          productDocumentId: doc.productDocumentId,
        });
        if (session) {
          existingProductDocQuery.session(session);
        }
        const existingProductDoc = await existingProductDocQuery.exec();

        const promotedSubsection =
          normalizeCertificationSubsection(
            String(doc.documentForm),
            doc.documentFormSubsection ?? null,
          ) ?? doc.documentFormSubsection;

        const productDocPayload = {
          productDocumentId: doc.productDocumentId,
          vendorId: doc.vendorId as Types.ObjectId,
          urnNo: trimmedUrn,
          eoiNo: doc.eoiNo,
          documentForm: doc.documentForm,
          documentFormSubsection: promotedSubsection,
          formPrimaryId: doc.formPrimaryId,
          documentName: doc.documentName,
          documentOriginalName: doc.documentOriginalName,
          documentLink: doc.documentLink,
          documentTag: doc.documentTag,
          createdDate: doc.createdDate ?? now,
          updatedDate: now,
          isDeleted: false,
          deletedAt: undefined,
          deletedBy: undefined,
        };

        let promotedDocId: Types.ObjectId;
        if (existingProductDoc) {
          await this.allProductDocumentModel.updateOne(
            { _id: existingProductDoc._id },
            { $set: productDocPayload },
            session ? { session } : {},
          );
          promotedDocId = existingProductDoc._id as Types.ObjectId;
        } else {
          const inserted = await this.allProductDocumentModel.create(
            [productDocPayload],
            session ? { session } : {},
          );
          promotedDocId = inserted[0]._id as Types.ObjectId;
        }

        const slotKey = certificationStreamSlotKeyForDocument({
          documentForm: sectionKey,
          documentFormSubsection: slotSubsection ?? null,
          documentTag: doc.documentTag ?? null,
          productDocumentId: doc.productDocumentId,
        });

        await this.documentVersioningService.trackDocumentVersionChange(
          buildAllProductDocumentTrackInput({
            urnNo: trimmedUrn,
            sectionKey,
            subsectionKey: slotSubsection ?? null,
            slotKey,
            action: 'replaced',
            documentId: promotedDocId,
            productDocumentId: doc.productDocumentId,
            filePath: doc.documentLink ?? null,
            originalName: doc.documentOriginalName ?? null,
            storedName: doc.documentName ?? null,
            userId: userObjectId,
            processType: 'initial',
            renewalCycleId: null,
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
