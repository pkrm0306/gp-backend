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
import { trackProductDocumentBatch } from '../../documents/helpers/product-document-version.integration';
import {
  assertRenewProcessEditable,
  renewOwnershipFields,
  renewUploadPath,
} from '../helpers/renew-common.util';
import * as path from 'path';

export interface UpsertRenewInnovationInput {
  urnNo: string;
  innovationImplementationDetails?: string;
  processInnovationStatus?: number;
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
    const { cycle, context } = await assertRenewProcessEditable(
      this.productModel,
      this.renewalCycleModel,
      input.urnNo,
    );
    const ownership = renewOwnershipFields(context);

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const now = new Date();
      const trimmedUrn = ownership.urnNo;

      const existing = await this.renewInnovationModel
        .findOne({ urnNo: trimmedUrn })
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

      const saved = await this.renewInnovationModel
        .findOneAndUpdate(
          { urnNo: trimmedUrn },
          {
            $set: {
              vendorId: ownership.vendorId,
              manufacturerId: ownership.manufacturerId,
              innovationImplementationDetails:
                input.innovationImplementationDetails ?? '',
              innovationImplementationDocuments,
              processInnovationStatus: input.processInnovationStatus ?? 0,
              updatedDate: now,
            },
            $setOnInsert: {
              processRenewInnovationId,
              createdDate: now,
            },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      if (filePaths.length > 0) {
        const docsToInsert = [];
        for (let i = 0; i < filePaths.length; i++) {
          docsToInsert.push({
            productDocumentId: await this.sequenceHelper.getRenewProductDocumentId(),
            vendorId: ownership.vendorId,
            manufacturerId: ownership.manufacturerId,
            urnNo: trimmedUrn,
            eoiNo: '',
            documentForm: DocumentSectionKey.PROCESS_INNOVATION,
            documentFormSubsection: 'innovation_implementation_documents',
            formPrimaryId: saved!.processRenewInnovationId,
            documentName: path.basename(filePaths[i]),
            documentOriginalName: uploadedFiles[i].originalname,
            documentLink: filePaths[i],
            documentTag: 'tech' as const,
            createdDate: now,
            updatedDate: now,
          });
        }
        const inserted = await this.renewDocumentModel.insertMany(docsToInsert, {
          session,
        });
        await trackProductDocumentBatch({
          versioning: this.documentVersioningService,
          urnNo: trimmedUrn,
          sectionKey: DocumentSectionKey.PROCESS_INNOVATION,
          userId: ownership.vendorId,
          docs: inserted,
          processType: 'renewal',
          renewalCycleId: cycle._id,
          session,
        });
      }

      await session.commitTransaction();
      session.endSession();
      return saved;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw new InternalServerErrorException(
        error.message || 'Failed to save renew innovation',
      );
    }
  }

  async getByUrn(urnNo: string) {
    const trimmedUrn = urnNo.trim();
    const header = await this.renewInnovationModel
      .findOne({ urnNo: trimmedUrn })
      .lean()
      .exec();
    const documents = await this.renewDocumentModel
      .find({
        urnNo: trimmedUrn,
        documentForm: DocumentSectionKey.PROCESS_INNOVATION,
        isDeleted: { $ne: true },
      })
      .lean()
      .exec();

    return { header, documents };
  }
}
