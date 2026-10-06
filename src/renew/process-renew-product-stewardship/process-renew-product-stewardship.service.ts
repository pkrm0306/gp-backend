import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  ProcessRenewProductStewardship,
  ProcessRenewProductStewardshipDocument,
} from '../schemas/process-renew-product-stewardship.schema';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentDocument,
} from '../schemas/all-renew-product-document.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
  RenewalCycleStatus,
} from '../schemas/renewal-cycle.schema';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import { SequenceHelper } from '../../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';
import {
  deleteUploadedFileByDocumentLink,
  uploadFile,
} from '../../utils/upload-file.util';
import { DocumentVersioningService } from '../../documents/document-versioning.service';
import {
  applyRenewSectionDocumentKeepList,
  insertRenewSectionDocuments,
} from '../helpers/renew-section-documents.util';
import {
  assertRenewProcessEditable,
  renewOwnershipFields,
  renewUploadPath,
} from '../helpers/renew-common.util';
import { buildRenewProcessHeaderFilter } from '../helpers/renew-cycle-scope.util';
import * as path from 'path';

const SEA_SUBSECTION = 'sea_supporting_documents';
const QM_SUBSECTION = 'qm_supporting_documents';
const EPR_SUBSECTION = 'epr_supporting_documents';

export interface UpsertRenewStewardshipInput {
  urnNo: string;
  renewalCycleId?: string;
  qualityManagementDetails?: string;
  eprImplementedDetails?: string;
  eprGreenPackagingDetails?: string;
  productStewardshipStatus?: number;
  /** DesiredState keep list for SEA (omit = retain all SEA docs). */
  existingSeaDocumentIds?: string[];
  /** DesiredState keep list for QM (omit = retain all QM docs). */
  existingQmDocumentIds?: string[];
  /** DesiredState keep list for EPR (omit = retain all EPR docs). */
  existingEprDocumentIds?: string[];
}

@Injectable()
export class ProcessRenewProductStewardshipService {
  constructor(
    @InjectModel(ProcessRenewProductStewardship.name)
    private readonly renewStewardshipModel: Model<ProcessRenewProductStewardshipDocument>,
    @InjectModel(AllRenewProductDocument.name)
    private readonly renewDocumentModel: Model<AllRenewProductDocumentDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly sequenceHelper: SequenceHelper,
    private readonly documentVersioningService: DocumentVersioningService,
  ) {}

  async upsert(
    input: UpsertRenewStewardshipInput,
    seaFiles?: Express.Multer.File[],
    qmFiles?: Express.Multer.File[],
    eprFiles?: Express.Multer.File[],
  ) {
    const { cycle, context, urnStatus } = await assertRenewProcessEditable(
      this.productModel,
      this.renewalCycleModel,
      input.urnNo,
      input.renewalCycleId,
    );
    const ownership = renewOwnershipFields(context);

    const session = await this.connection.startSession();
    session.startTransaction();
    const oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      const now = new Date();
      const trimmedUrn = ownership.urnNo;
      const renewalCycleObjectId = cycle._id;
      const cycleNo = Number(cycle.cycleNo ?? 1);
      const headerFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycle);

      const existing = await this.renewStewardshipModel
        .findOne(headerFilter)
        .session(session);
      const processRenewProductStewardshipId =
        existing?.processRenewProductStewardshipId ??
        (await this.sequenceHelper.getProcessRenewProductStewardshipId());

      const keepParams = {
        renewDocumentModel: this.renewDocumentModel,
        documentVersioningService: this.documentVersioningService,
        urnNo: trimmedUrn,
        vendorObjectId: ownership.vendorId,
        renewalCycleObjectId,
        cycleNo,
        sectionKey: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
        urnStatus,
        now,
        session,
      };

      // Independent DesiredState per slot — SEA save must not affect QM/EPR.
      oldFileLinksToDeleteAfterCommit.push(
        ...(await applyRenewSectionDocumentKeepList({
          ...keepParams,
          existingDocumentIds: input.existingSeaDocumentIds,
          subsectionFilter: SEA_SUBSECTION,
        })),
        ...(await applyRenewSectionDocumentKeepList({
          ...keepParams,
          existingDocumentIds: input.existingQmDocumentIds,
          subsectionFilter: QM_SUBSECTION,
        })),
        ...(await applyRenewSectionDocumentKeepList({
          ...keepParams,
          existingDocumentIds: input.existingEprDocumentIds,
          subsectionFilter: EPR_SUBSECTION,
        })),
      );

      const liveAfterKeep = await this.renewDocumentModel
        .find({
          urnNo: trimmedUrn,
          renewalCycleId: renewalCycleObjectId,
          documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
          isDeleted: { $ne: true },
        })
        .session(session);

      let seaSupportingDocuments = liveAfterKeep.some(
        (d) => String(d.documentFormSubsection ?? '') === SEA_SUBSECTION,
      )
        ? 1
        : 0;
      let qmSupportingDocuments = liveAfterKeep.some(
        (d) => String(d.documentFormSubsection ?? '') === QM_SUBSECTION,
      )
        ? 1
        : 0;
      let eprSupportingDocuments = liveAfterKeep.some(
        (d) => String(d.documentFormSubsection ?? '') === EPR_SUBSECTION,
      )
        ? 1
        : 0;

      const newDocRows: Array<{
        productDocumentId: number;
        documentFormSubsection: string;
        documentName: string;
        documentOriginalName: string;
        documentLink: string;
      }> = [];

      const fileGroups = [
        {
          files: seaFiles,
          subsection: SEA_SUBSECTION,
          flag: () => {
            seaSupportingDocuments = 1;
          },
        },
        {
          files: qmFiles,
          subsection: QM_SUBSECTION,
          flag: () => {
            qmSupportingDocuments = 1;
          },
        },
        {
          files: eprFiles,
          subsection: EPR_SUBSECTION,
          flag: () => {
            eprSupportingDocuments = 1;
          },
        },
      ];

      for (const group of fileGroups) {
        const uploadList = Array.isArray(group.files) ? group.files : [];
        if (uploadList.length > 0) group.flag();
        for (const file of uploadList) {
          const uploaded = await uploadFile(file, renewUploadPath(trimmedUrn));
          newDocRows.push({
            productDocumentId:
              await this.sequenceHelper.getRenewProductDocumentId(),
            documentFormSubsection: group.subsection,
            documentName: path.basename(uploaded.fileUrl),
            documentOriginalName: file.originalname,
            documentLink: uploaded.fileUrl,
          });
        }
      }

      const saved = await this.renewStewardshipModel
        .findOneAndUpdate(
          headerFilter,
          {
            $set: {
              vendorId: ownership.vendorId,
              manufacturerId: ownership.manufacturerId,
              renewalCycleId: renewalCycleObjectId,
              qualityManagementDetails: input.qualityManagementDetails ?? '',
              eprImplementedDetails: input.eprImplementedDetails ?? '',
              eprGreenPackagingDetails: input.eprGreenPackagingDetails ?? '',
              seaSupportingDocuments,
              qmSupportingDocuments,
              eprSupportingDocuments,
              productStewardshipStatus: input.productStewardshipStatus ?? 0,
              updatedDate: now,
            },
            $setOnInsert: {
              processRenewProductStewardshipId,
              urnNo: trimmedUrn,
              createdDate: now,
            },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      await insertRenewSectionDocuments({
        renewDocumentModel: this.renewDocumentModel,
        documentVersioningService: this.documentVersioningService,
        urnNo: trimmedUrn,
        vendorObjectId: ownership.vendorId,
        manufacturerObjectId: ownership.manufacturerId,
        renewalCycleObjectId,
        cycleNo,
        sectionKey: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
        formPrimaryId: processRenewProductStewardshipId,
        urnStatus,
        now,
        session,
        rows: newDocRows,
        slotKeyMode: 'subsection',
      });

      await session.commitTransaction();
      session.endSession();

      for (const link of oldFileLinksToDeleteAfterCommit) {
        await deleteUploadedFileByDocumentLink(link).catch(() => undefined);
      }

      return saved;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw new InternalServerErrorException(
        error.message || 'Failed to save renew product stewardship',
      );
    }
  }

  async getByUrn(urnNo: string, renewalCycleId?: string) {
    const trimmedUrn = urnNo.trim();
    const cycle = renewalCycleId?.trim()
      ? await this.renewalCycleModel.findById(renewalCycleId.trim()).exec()
      : await this.renewalCycleModel
          .findOne({ urnNo: trimmedUrn, status: RenewalCycleStatus.IN_PROGRESS })
          .sort({ cycleNo: -1 })
          .exec();

    const headerFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycle);
    const header = await this.renewStewardshipModel
      .findOne(headerFilter)
      .lean()
      .exec();

    const documentFilter = cycle?._id
      ? {
          urnNo: trimmedUrn,
          renewalCycleId: cycle._id,
          documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
          isDeleted: { $ne: true },
        }
      : {
          urnNo: trimmedUrn,
          documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
          isDeleted: { $ne: true },
        };

    const documents = await this.renewDocumentModel
      .find(documentFilter)
      .lean()
      .exec();

    return { header, documents };
  }
}
