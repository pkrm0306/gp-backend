import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import {
  ProcessManufacturing,
  ProcessManufacturingDocument,
} from './schemas/process-manufacturing.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { CreateProcessManufacturingDto } from './dto/create-process-manufacturing.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import {
  deleteUploadedFile,
  uploadFile,
  UploadResult,
} from '../utils/upload-file.util';
import { ProductDocumentUploadNotificationHelper } from '../notifications/helpers/product-document-upload-notification.helper';
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import {
  isVendorResubmitCycle,
  trackInsertedCertificationDocuments,
} from '../documents/helpers/certification-document-version.util';
import { assertVendorCanEditUrn } from '../common/vendor/vendor-urn-edit.util';

@Injectable()
export class ProcessManufacturingService implements OnModuleInit {
  constructor(
    @InjectModel(ProcessManufacturing.name)
    private processManufacturingModel: Model<ProcessManufacturingDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
    private readonly documentUploadNotification: ProductDocumentUploadNotificationHelper,
    private readonly documentVersioningService: DocumentVersioningService,
  ) {}

  async onModuleInit() {
    const shouldSyncIndexes =
      String(process.env.SYNC_INDEXES_ON_BOOT || 'false').toLowerCase() ===
      'true';
    if (!shouldSyncIndexes) return;
    try {
      await this.processManufacturingModel.syncIndexes();
    } catch (error) {
      console.error(
        '[process-manufacturing] syncIndexes failed (check duplicates):',
        error,
      );
    }
  }

  /**
   * Safely convert string to ObjectId with validation
   */
  private toObjectId(
    id: string | Types.ObjectId,
    fieldName: string,
  ): Types.ObjectId {
    if (id instanceof Types.ObjectId) {
      return id;
    }
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  private async saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
  ): Promise<UploadResult> {
    return uploadFile(file, `urns/${urnNo}`);
  }

  private async rollbackCreatedUploads(uploads: UploadResult[]): Promise<void> {
    for (const upload of uploads) {
      await deleteUploadedFile({
        storage_type: upload.storage,
        s3_key: upload.s3Key,
        relativePath: upload.relativePath,
      });
    }
  }

  /**
   * Create process manufacturing with file uploads
   */
  async createProcessManufacturing(
    createProcessManufacturingDto: CreateProcessManufacturingDto,
    vendorId: string,
    energyConservationSupportingDocumentsFiles?: Express.Multer.File[],
    energyConsumptionDocumentsFiles?: Express.Multer.File[],
  ): Promise<ProcessManufacturingDocument> {
    await assertVendorCanEditUrn(
      this.productModel,
      vendorId,
      createProcessManufacturingDto.urnNo,
    );
    const session = await this.connection.startSession();
    session.startTransaction();

    const createdUploads: UploadResult[] = [];

    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
      const now = new Date();
      const existingManufacturing = await this.processManufacturingModel
        .findOne({ urnNo: createProcessManufacturingDto.urnNo })
        .session(session);
      const processManufacturingId =
        existingManufacturing?.processManufacturingId ??
        (await this.sequenceHelper.getProcessManufacturingId());
      const energyConservationFiles = Array.isArray(
        energyConservationSupportingDocumentsFiles,
      )
        ? energyConservationSupportingDocumentsFiles
        : [];
      const energyConsumptionFiles = Array.isArray(energyConsumptionDocumentsFiles)
        ? energyConsumptionDocumentsFiles
        : [];

      const conservationDisplayName =
        createProcessManufacturingDto.energyConservationSupportingDocumentsFileName?.trim() ||
        '';
      const consumptionDisplayName =
        createProcessManufacturingDto.energyConsumptionDocumentsFileName?.trim() ||
        '';

      let energyConservationSupportingDocuments =
        existingManufacturing?.energyConservationSupportingDocuments ?? null;
      const energyConservationUploads: UploadResult[] = [];
      if (energyConservationFiles.length > 0) {
        for (const energyConservationSupportingDocumentsFile of energyConservationFiles) {
          const uploaded = await this.saveFileToUrnFolder(
            energyConservationSupportingDocumentsFile,
            createProcessManufacturingDto.urnNo,
          );
          energyConservationUploads.push(uploaded);
          createdUploads.push(uploaded);
        }
        energyConservationSupportingDocuments = 1;
      }

      let energyConsumptionDocuments =
        existingManufacturing?.energyConsumptionDocuments ?? null;
      const energyConsumptionUploads: UploadResult[] = [];
      if (energyConsumptionFiles.length > 0) {
        for (const energyConsumptionDocumentsFile of energyConsumptionFiles) {
          const uploaded = await this.saveFileToUrnFolder(
            energyConsumptionDocumentsFile,
            createProcessManufacturingDto.urnNo,
          );
          energyConsumptionUploads.push(uploaded);
          createdUploads.push(uploaded);
        }
        energyConsumptionDocuments = 1;
      }

      // Do not soft-delete existing all_product_documents rows here. Vendors add
      // documents incrementally; removing every PROCESS_MANUFACTURING doc on each
      // upload left only the latest batch visible and deleted prior files from disk.

      const processManufacturingData = {
        vendorId: vendorObjectId,
        urnNo: createProcessManufacturingDto.urnNo,
        energyConservationSupportingDocuments,
        portableWaterDemand:
          createProcessManufacturingDto.portableWaterDemand || '',
        rainWaterHarvesting:
          createProcessManufacturingDto.rainWaterHarvesting || '',
        beyondTheFenceInitiatives:
          createProcessManufacturingDto.beyondTheFenceInitiatives || '',
        totalEnergyConsumption:
          createProcessManufacturingDto.totalEnergyConsumption || null,
        energyConsumptionDocuments,
        processManufacturingStatus:
          createProcessManufacturingDto.processManufacturingStatus || 0,
        updatedDate: now,
      };
      const savedProcessManufacturing = await this.processManufacturingModel
        .findOneAndUpdate(
          { urnNo: createProcessManufacturingDto.urnNo },
          {
            $set: processManufacturingData,
            $setOnInsert: { processManufacturingId, createdDate: now },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      const docsToInsert = [];
      for (let i = 0; i < energyConservationUploads.length; i++) {
        const uploaded = energyConservationUploads[i];
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        docsToInsert.push({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessManufacturingDto.urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.PROCESS_MANUFACTURING,
          documentFormSubsection: 'energy_conservation_supporting_documents',
          formPrimaryId: savedProcessManufacturing.processManufacturingId,
          documentName:
            conservationDisplayName || uploaded.fileName,
          documentOriginalName: energyConservationFiles[i].originalname,
          documentLink: uploaded.fileUrl,
          createdDate: now,
          updatedDate: now,
        });
      }
      for (let i = 0; i < energyConsumptionUploads.length; i++) {
        const uploaded = energyConsumptionUploads[i];
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        docsToInsert.push({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessManufacturingDto.urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.PROCESS_MANUFACTURING,
          documentFormSubsection: 'energy_consumption_documents',
          formPrimaryId: savedProcessManufacturing.processManufacturingId,
          documentName: consumptionDisplayName || uploaded.fileName,
          documentOriginalName: energyConsumptionFiles[i].originalname,
          documentLink: uploaded.fileUrl, 
          createdDate: now,
          updatedDate: now,
        });
      }
      if (docsToInsert.length) {
        const isResubmitCycle = await isVendorResubmitCycle(
          this.productModel,
          createProcessManufacturingDto.urnNo,
          session,
        );
        const insertedDocs = await this.allProductDocumentModel.insertMany(
          docsToInsert,
          { session },
        );
        await trackInsertedCertificationDocuments({
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo: createProcessManufacturingDto.urnNo,
          sectionKey: DocumentSectionKey.PROCESS_MANUFACTURING,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          insertedDocs,
          isResubmitCycle,
          session,
          filesByIndex: [...energyConservationFiles, ...energyConsumptionFiles],
        });
      }

      await session.commitTransaction();
      session.endSession();

      this.documentUploadNotification.notifyAfterDocumentsUploaded(
        vendorId,
        docsToInsert.length,
        createProcessManufacturingDto.urnNo,
      );

      return savedProcessManufacturing;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      await this.rollbackCreatedUploads(createdUploads).catch((cleanupError) => {
        console.error(
          '[Process Manufacturing] File cleanup error:',
          cleanupError,
        );
      });

      console.error('[Process Manufacturing] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process manufacturing record.',
      );
    }
  }
}
