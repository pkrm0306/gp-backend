import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  ProcessRenewInnovation,
  ProcessRenewInnovationDocument,
} from '../schemas/process-renew-innovation.schema';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentDocument,
} from '../schemas/all-renew-product-document.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
} from '../schemas/renewal-cycle.schema';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import { SequenceHelper } from '../../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';
import { uploadFile } from '../../utils/upload-file.util';
import { DocumentVersioningService } from '../../documents/document-versioning.service';
import {
  assertRenewProcessEditable,
  renewOwnershipFields,
  renewUploadPath,
} from '../helpers/renew-common.util';
import { buildRenewProcessHeaderFilter } from '../helpers/renew-cycle-scope.util';
import {
  applyRenewSectionDocumentKeepList,
  buildRenewSectionDocMigrationFilter,
  insertRenewSectionDocuments,
} from '../helpers/renew-section-documents.util';
import { deleteUploadedFileByDocumentLink } from '../../utils/upload-file.util';
import * as path from 'path';

export interface UpsertRenewInnovationInput {
  urnNo: string;
  renewalCycleId?: string;
  innovationImplementationDetails?: string;
  processInnovationStatus?: number;
  existingDocumentIds?: string[];
}

@Injectable()
export class ProcessRenewInnovationService {
  constructor(
    @InjectModel(ProcessRenewInnovation.name)
    private readonly renewInnovationModel: Model<ProcessRenewInnovationDocument>,
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
    input: UpsertRenewInnovationInput,
    files?: Express.Multer.File[],
  ) {
    const { cycle, context, urnStatus } = await assertRenewProcessEditable(
      this.productModel,
      this.renewalCycleModel,
      input.urnNo,
      input.renewalCycleId,
    );
    const ownership = renewOwnershipFields(context);
    const renewalCycleObjectId = cycle._id;
    const headerFilter = buildRenewProcessHeaderFilter(ownership.urnNo, cycle);

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const now = new Date();
      const trimmedUrn = ownership.urnNo;

      const existing = await this.renewInnovationModel
        .findOne(headerFilter)
        .session(session);
      const processRenewInnovationId =
        existing?.processRenewInnovationId ??
        (await this.sequenceHelper.getProcessRenewInnovationId());

      let innovationImplementationDocuments =
        existing?.innovationImplementationDocuments ?? 0;
      const uploadedFiles = Array.isArray(files) ? files : [];
      const filePaths: string[] = [];

      for (const file of uploadedFiles) {
        const uploaded = await uploadFile(file, renewUploadPath(trimmedUrn));
        filePaths.push(uploaded.fileUrl);
      }
      if (filePaths.length > 0) {
        innovationImplementationDocuments = 1;
      }

      const oldFileLinksToDeleteAfterCommit =
        await applyRenewSectionDocumentKeepList({
          renewDocumentModel: this.renewDocumentModel,
          documentVersioningService: this.documentVersioningService,
          urnNo: trimmedUrn,
          vendorObjectId: ownership.vendorId,
          renewalCycleObjectId,
          cycleNo: Number(cycle.cycleNo ?? 1),
          sectionKey: DocumentSectionKey.PROCESS_INNOVATION,
          existingDocumentIds: input.existingDocumentIds,
          urnStatus,
          now,
          session,
        });

      const saved = await this.renewInnovationModel
        .findOneAndUpdate(
          headerFilter,
          {
            $set: {
              vendorId: ownership.vendorId,
              manufacturerId: ownership.manufacturerId,
              renewalCycleId: renewalCycleObjectId,
              innovationImplementationDetails:
                input.innovationImplementationDetails ?? '',
              innovationImplementationDocuments,
              processInnovationStatus: input.processInnovationStatus ?? 0,
              updatedDate: now,
            },
            $setOnInsert: {
              processRenewInnovationId,
              urnNo: trimmedUrn,
              createdDate: now,
            },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      const newDocRows = [];
      for (let i = 0; i < filePaths.length; i++) {
        newDocRows.push({
          productDocumentId: await this.sequenceHelper.getRenewProductDocumentId(),
          documentFormSubsection: 'innovation_implementation_documents',
          documentName: path.basename(filePaths[i]),
          documentOriginalName: uploadedFiles[i].originalname,
          documentLink: filePaths[i],
          eoiNo: '',
          documentTag: 'tech' as const,
        });
      }

      await insertRenewSectionDocuments({
        renewDocumentModel: this.renewDocumentModel,
        documentVersioningService: this.documentVersioningService,
        urnNo: trimmedUrn,
        vendorObjectId: ownership.vendorId,
        manufacturerObjectId: ownership.manufacturerId,
        renewalCycleObjectId,
        sectionKey: DocumentSectionKey.PROCESS_INNOVATION,
        formPrimaryId: saved!.processRenewInnovationId,
        urnStatus,
        now,
        session,
        rows: newDocRows,
        slotKeyMode: 'subsectionTag',
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
        error.message || 'Failed to save renew innovation',
      );
    }
  }

  async getByUrn(urnNo: string, renewalCycleId?: string) {
    const trimmedUrn = urnNo.trim();
    let cycle = null;
    if (renewalCycleId?.trim()) {
      cycle = await this.renewalCycleModel.findById(renewalCycleId.trim()).exec();
    } else {
      cycle = await this.renewalCycleModel
        .findOne({ urnNo: trimmedUrn, status: 'in_progress' })
        .sort({ cycleNo: -1 })
        .exec();
    }
    const headerFilter = buildRenewProcessHeaderFilter(trimmedUrn, cycle);
    const header = await this.renewInnovationModel
      .findOne(headerFilter)
      .lean()
      .exec();
    const docFilter =
      cycle?._id != null
        ? buildRenewSectionDocMigrationFilter(
            trimmedUrn,
            cycle._id,
            DocumentSectionKey.PROCESS_INNOVATION,
            Number(cycle.cycleNo ?? 1) > 1,
          )
        : {
            urnNo: trimmedUrn,
            documentForm: DocumentSectionKey.PROCESS_INNOVATION,
            isDeleted: { $ne: true },
          };
    const documents = await this.renewDocumentModel.find(docFilter).lean().exec();
    return { header, documents };
  }
}
