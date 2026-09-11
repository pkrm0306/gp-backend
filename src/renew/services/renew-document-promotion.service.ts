import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { DocumentVersioningService } from '../../documents/document-versioning.service';
import {
  buildAllProductDocumentTrackInput,
} from '../../documents/helpers/document-version.helper';
import {
  certificationSlotKey,
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
import {
  RenewalCycle,
  RenewalCycleDocument,
} from '../schemas/renewal-cycle.schema';
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
  productDocumentId: number;
}): string {
  return certificationStreamSlotKeyForDocument({
    documentForm: String(doc.documentForm),
    documentFormSubsection: doc.documentFormSubsection ?? null,
    documentTag: doc.documentTag ?? null,
    productDocumentId: doc.productDocumentId,
  });
}

function normalizeFilePath(value: string | null | undefined): string {
  return String(value ?? '').trim().replace(/\\/g, '/').toLowerCase();
}

/**
 * On renewal completion, copy renew uploads into all_product_documents and
 * point canonical (initial) version streams at each promoted file.
 * Promotes ALL non-deleted renew docs. Stamps versions as processType "renewal".
 */
@Injectable()
export class RenewDocumentPromotionService {
  private readonly logger = new Logger(RenewDocumentPromotionService.name);

  constructor(
    @InjectModel(AllRenewProductDocument.name)
    private readonly renewDocumentModel: Model<AllRenewProductDocumentDocument>,
    @InjectModel(AllProductDocument.name)
    private readonly allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly documentVersioningService: DocumentVersioningService,
  ) {}

  private async softDeleteLegacyCertificationDocsInSlot(
    trimmedUrn: string,
    doc: {
      documentForm: string;
      documentFormSubsection?: string | null;
      documentTag?: string | null;
      productDocumentId: number;
    },
    renewalCycleObjectId: Types.ObjectId,
    userObjectId: Types.ObjectId,
    now: Date,
    session?: ClientSession,
  ): Promise<void> {
    const targetSlot = renewDocSlotKey(doc);

    const query = this.allProductDocumentModel.find({
      urnNo: trimmedUrn,
      documentForm: doc.documentForm,
      isDeleted: { $ne: true },
    });
    if (session) {
      query.session(session);
    }
    const legacyDocs = await query.lean().exec();

    const vendorDeletedLinks = await this.renewDocumentModel
      .find({
        urnNo: trimmedUrn,
        documentForm: doc.documentForm,
        renewalCycleId: renewalCycleObjectId,
        isDeleted: true,
      })
      .select('documentLink')
      .lean()
      .exec();
    const vendorDeletedPaths = new Set(
      vendorDeletedLinks.map((d) => normalizeFilePath(d.documentLink)).filter(Boolean),
    );

    const idsToDelete = legacyDocs
      .filter((existing) => {
        if (Number(existing.productDocumentId) === Number(doc.productDocumentId)) {
          return false;
        }
        const existingSlot = certificationStreamSlotKeyForDocument({
          documentForm: String(existing.documentForm),
          documentFormSubsection: existing.documentFormSubsection ?? null,
          documentTag: existing.documentTag ?? null,
          productDocumentId: Number(existing.productDocumentId),
        });
        if (existingSlot !== targetSlot) return false;
        const existingPath = normalizeFilePath(existing.documentLink as string | undefined);
        return existingPath ? vendorDeletedPaths.has(existingPath) : false;
      })
      .map((row) => row._id);

    if (!idsToDelete.length) {
      return;
    }

    await this.allProductDocumentModel.updateMany(
      { _id: { $in: idsToDelete } },
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
  }

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

    const cycle = await this.renewalCycleModel
      .findById(cycleObjectId)
      .select('cycleNo')
      .lean()
      .exec();
    const cycleNo = Number(cycle?.cycleNo ?? 1);

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

    let promoted = 0;
    for (const doc of eligibleDocs) {
      try {
        const sectionKey = String(doc.documentForm);

        await this.softDeleteLegacyCertificationDocsInSlot(
          trimmedUrn,
          doc,
          cycleObjectId,
          userObjectId,
          now,
          session,
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

        const slotKey = certificationSlotKey(
          sectionKey,
          promotedSubsection ?? null,
          doc.documentTag ?? null,
        );

        const normalizedPath = normalizeFilePath(doc.documentLink);
        const existingVersion = normalizedPath
          ? await this.documentVersioningService.findVersionByFilePath(
              trimmedUrn,
              sectionKey,
              promotedSubsection ?? null,
              slotKey,
              normalizedPath,
              session,
            )
          : null;

        if (!existingVersion) {
          await this.documentVersioningService.trackDocumentVersionChange(
            buildAllProductDocumentTrackInput({
              urnNo: trimmedUrn,
              sectionKey,
              subsectionKey: promotedSubsection ?? null,
              slotKey,
              action: 'replaced',
              documentId: promotedDocId,
              productDocumentId: doc.productDocumentId,
              filePath: doc.documentLink ?? null,
              originalName: doc.documentOriginalName ?? null,
              storedName: doc.documentName ?? null,
              userId: userObjectId,
              processType: 'renewal',
              renewalCycleId: cycleObjectId,
              renewalCycleNo: cycleNo,
              session,
            }),
          );
        } else {
          await this.documentVersioningService.markVersionAsCurrent(
            existingVersion._id as Types.ObjectId,
            trimmedUrn,
            sectionKey,
            promotedSubsection ?? null,
            slotKey,
            session,
          );
        }
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
