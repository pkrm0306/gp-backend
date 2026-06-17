import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import {
  ProcessInnovation,
  ProcessInnovationDocument,
} from './schemas/process-innovation.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { CreateProcessInnovationDto } from './dto/create-process-innovation.dto';
import { PatchInnovationDocumentTagDto } from './dto/patch-innovation-document-tag.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { Product, ProductDocument } from '../product-registration/schemas/product.schema';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import type { InnovationDocumentTag } from './utils/innovation-document-tag.util';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';
import { ProductDocumentUploadNotificationHelper } from '../notifications/helpers/product-document-upload-notification.helper';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import {
  isVendorResubmitCycle,
  trackInsertedCertificationDocuments,
} from '../documents/helpers/certification-document-version.util';
import { assertVendorCanEditUrn } from '../common/vendor/vendor-urn-edit.util';

@Injectable()
export class ProcessInnovationService implements OnModuleInit {
  constructor(
    @InjectModel(ProcessInnovation.name)
    private processInnovationModel: Model<ProcessInnovationDocument>,
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
      await this.processInnovationModel.syncIndexes();
    } catch (error) {
      console.error(
        '[process-innovation] syncIndexes failed (check duplicates):',
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
    fileType: 'innovation_implementation',
  ): Promise<string> {
    return (await uploadFile(file, `urns/${urnNo}`)).fileUrl;
  }

  /**
   * Create process innovation with file upload
   */
  async createProcessInnovation(
    createProcessInnovationDto: CreateProcessInnovationDto,
    vendorId: string,
    innovationImplementationDocumentsFiles?: Express.Multer.File[],
    innovationDocumentTags?: InnovationDocumentTag[],
  ): Promise<ProcessInnovationDocument> {
    await assertVendorCanEditUrn(
      this.productModel,
      vendorId,
      createProcessInnovationDto.urnNo,
    );
    const session = await this.connection.startSession();
    session.startTransaction();

    let createdFileFullPaths: string[] = [];

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get current date
      const now = new Date();
      const existingInnovation = await this.processInnovationModel
        .findOne({ urnNo: createProcessInnovationDto.urnNo })
        .session(session);
      const processInnovationId =
        existingInnovation?.processInnovationId ??
        (await this.sequenceHelper.getProcessInnovationId());
      const uploadedInnovationFiles = Array.isArray(
        innovationImplementationDocumentsFiles,
      )
        ? innovationImplementationDocumentsFiles
        : [];

      // Handle file upload and set flag
      let innovationImplementationDocuments =
        existingInnovation?.innovationImplementationDocuments ?? 0;
      const innovationImplementationDocumentsFilePaths: string[] = [];

      if (uploadedInnovationFiles.length > 0) {
        for (const innovationImplementationDocumentsFile of uploadedInnovationFiles) {
          const innovationImplementationDocumentsFilePath =
            await this.saveFileToUrnFolder(
              innovationImplementationDocumentsFile,
              createProcessInnovationDto.urnNo,
              'innovation_implementation',
            );
          innovationImplementationDocumentsFilePaths.push(
            innovationImplementationDocumentsFilePath,
          );
          createdFileFullPaths.push(
            path.join('uploads', innovationImplementationDocumentsFilePath),
          );
        }
        innovationImplementationDocuments = 1;
      }

      const INNOVATION_DOCS_SUBSECTION = 'innovation_implementation_documents';

      // Create process innovation data
      const processInnovationData = {
        vendorId: vendorObjectId,
        urnNo: createProcessInnovationDto.urnNo,
        innovationImplementationDetails:
          createProcessInnovationDto.innovationImplementationDetails || '',
        innovationImplementationDocuments,
        processInnovationStatus:
          createProcessInnovationDto.processInnovationStatus || 0,
        updatedDate: now,
      };
      const savedProcessInnovation = await this.processInnovationModel
        .findOneAndUpdate(
          { urnNo: createProcessInnovationDto.urnNo },
          {
            $set: processInnovationData,
            $setOnInsert: { processInnovationId, createdDate: now },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      // Insert uploaded document into all_product_documents (master table)
      if (innovationImplementationDocumentsFilePaths.length > 0) {
        const tags = innovationDocumentTags ?? [];
        const docsToInsert = [];
        const isResubmitCycle = await isVendorResubmitCycle(
          this.productModel,
          createProcessInnovationDto.urnNo,
          session,
        );

        for (let i = 0; i < innovationImplementationDocumentsFilePaths.length; i++) {
          const tag = tags[i] ?? 'tech';
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProcessInnovationDto.urnNo,
            eoiNo: '',
            documentForm: DocumentSectionKey.PROCESS_INNOVATION,
            documentFormSubsection: INNOVATION_DOCS_SUBSECTION,
            formPrimaryId: savedProcessInnovation.processInnovationId,
            documentName: path.basename(
              innovationImplementationDocumentsFilePaths[i],
            ),
            documentOriginalName: uploadedInnovationFiles[i].originalname,
            documentLink: innovationImplementationDocumentsFilePaths[i],
            documentTag: tag,
            createdDate: now,
            updatedDate: now,
          });
        }

        const insertedDocs = await this.allProductDocumentModel.insertMany(
          docsToInsert,
          { session },
        );

        await trackInsertedCertificationDocuments({
          versioning: this.documentVersioningService,
          documentModel: this.allProductDocumentModel,
          urnNo: createProcessInnovationDto.urnNo,
          sectionKey: DocumentSectionKey.PROCESS_INNOVATION,
          userId: vendorObjectId,
          vendorId: vendorObjectId,
          insertedDocs,
          isResubmitCycle,
          session,
          filesByIndex: uploadedInnovationFiles,
        });
      }

      await session.commitTransaction();
      session.endSession();

      this.documentUploadNotification.notifyAfterDocumentsUploaded(
        vendorId,
        innovationImplementationDocumentsFilePaths.length,
        createProcessInnovationDto.urnNo,
      );

      return savedProcessInnovation;
    } catch (error: any) {
      const isUrnDuplicate =
        Number(error?.code) === 11000 &&
        (error?.keyPattern?.urnNo === 1 || error?.keyValue?.urnNo);

      await session.abortTransaction();
      session.endSession();

      // Concurrent requests can race on unique urnNo upsert.
      // Treat duplicate urnNo as idempotent update instead of failing with 500.
      if (isUrnDuplicate) {
        const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
        const now = new Date();
        const recovered = await this.processInnovationModel
          .findOneAndUpdate(
            { urnNo: createProcessInnovationDto.urnNo },
            {
              $set: {
                vendorId: vendorObjectId,
                urnNo: createProcessInnovationDto.urnNo,
                innovationImplementationDetails:
                  createProcessInnovationDto.innovationImplementationDetails ||
                  '',
                processInnovationStatus:
                  createProcessInnovationDto.processInnovationStatus || 0,
                updatedDate: now,
              },
            },
            { new: true },
          )
          .exec();
        if (recovered) {
          return recovered;
        }
      }

      // Clean up uploaded file if transaction fails (file was moved to URN folder)
      try {
        for (const fullPath of createdFileFullPaths) {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      } catch (cleanupError: any) {
        console.error('[Process Innovation] File cleanup error:', cleanupError);
      }

      console.error('[Process Innovation] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process innovation record.',
      );
    }
  }

  async patchInnovationDocumentTag(
    dto: PatchInnovationDocumentTagDto,
    vendorId: string,
  ) {
    const vendorObjectId = this.toObjectId(vendorId, 'vendorId');
    const urnNo = dto.urnNo.trim();
    const updated = await this.allProductDocumentModel
      .findOneAndUpdate(
        {
          productDocumentId: dto.productDocumentId,
          urnNo,
          vendorId: vendorObjectId,
          documentForm: DocumentSectionKey.PROCESS_INNOVATION,
          isDeleted: { $ne: true },
        },
        {
          $set: {
            documentTag: dto.documentTag,
            updatedDate: new Date(),
          },
        },
        { new: true },
      )
      .exec();
    if (!updated) {
      throw new NotFoundException(
        `Innovation document ${dto.productDocumentId} not found for URN ${urnNo}`,
      );
    }
    return updated;
  }
}
