import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import {
  ProcessLifeCycleApproach,
  ProcessLifeCycleApproachDocument,
} from './schemas/process-life-cycle-approach.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { CreateProcessLifeCycleApproachDto } from './dto/create-process-life-cycle-approach.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';
import { DocumentVersioningService } from '../documents/document-versioning.service';
import {
  trackProductDocumentBatch,
  trackProductDocumentDeleteBatch,
} from '../documents/helpers/product-document-version.integration';

@Injectable()
export class ProcessLifeCycleApproachService implements OnModuleInit {
  constructor(
    @InjectModel(ProcessLifeCycleApproach.name)
    private processLifeCycleApproachModel: Model<ProcessLifeCycleApproachDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
    private readonly documentVersioningService: DocumentVersioningService,
  ) {}

  async onModuleInit() {
    const shouldSyncIndexes =
      String(process.env.SYNC_INDEXES_ON_BOOT || 'false').toLowerCase() ===
      'true';
    if (!shouldSyncIndexes) return;
    try {
      await this.processLifeCycleApproachModel.syncIndexes();
    } catch (error) {
      console.error(
        '[process-life-cycle-approach] syncIndexes failed (check duplicates):',
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
    fileType: 'lca_reports' | 'lca_implementation',
  ): Promise<{ fileUrl: string; fileName: string }> {
    const uploaded = await uploadFile(file, `urns/${urnNo}`);
    return { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName };
  }

  /**
   * Create process life cycle approach with file uploads
   */
  async createProcessLifeCycleApproach(
    createProcessLifeCycleApproachDto: CreateProcessLifeCycleApproachDto,
    vendorId: string,
    lifeCycleAssesmentReportsFiles?: Express.Multer.File[],
    lifeCycleImplementationDocumentsFiles?: Express.Multer.File[],
  ): Promise<ProcessLifeCycleApproachDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    let createdFileFullPaths: string[] = [];
    let oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get current date
      const now = new Date();
      const existingLifeCycle = await this.processLifeCycleApproachModel
        .findOne({ urnNo: createProcessLifeCycleApproachDto.urnNo })
        .session(session);
      const processLifeCycleApproachId =
        existingLifeCycle?.processLifeCycleApproachId ??
        (await this.sequenceHelper.getProcessLifeCycleApproachId());
      const lcaReportsFiles = Array.isArray(lifeCycleAssesmentReportsFiles)
        ? lifeCycleAssesmentReportsFiles
        : [];
      const lcaImplementationFiles = Array.isArray(
        lifeCycleImplementationDocumentsFiles,
      )
        ? lifeCycleImplementationDocumentsFiles
        : [];

      // Handle file uploads and set flags
      let lifeCycleAssesmentReports =
        existingLifeCycle?.lifeCycleAssesmentReports ?? 0;
      const lcaReportsFilePaths: string[] = [];
      const lcaReportsStoredNames: string[] = [];

      if (lcaReportsFiles.length > 0) {
        for (const lifeCycleAssesmentReportsFile of lcaReportsFiles) {
          const lcaReportsFilePath = await this.saveFileToUrnFolder(
            lifeCycleAssesmentReportsFile,
            createProcessLifeCycleApproachDto.urnNo,
            'lca_reports',
          );
          lcaReportsFilePaths.push(lcaReportsFilePath.fileUrl);
          lcaReportsStoredNames.push(lcaReportsFilePath.fileName);
        }
        lifeCycleAssesmentReports = 1;
      }

      let lifeCycleImplementationDocuments =
        existingLifeCycle?.lifeCycleImplementationDocuments ?? 0;
      const lcaImplementationFilePaths: string[] = [];
      const lcaImplementationStoredNames: string[] = [];

      if (lcaImplementationFiles.length > 0) {
        for (const lifeCycleImplementationDocumentsFile of lcaImplementationFiles) {
          const lcaImplementationFilePath = await this.saveFileToUrnFolder(
            lifeCycleImplementationDocumentsFile,
            createProcessLifeCycleApproachDto.urnNo,
            'lca_implementation',
          );
          lcaImplementationFilePaths.push(lcaImplementationFilePath.fileUrl);
          lcaImplementationStoredNames.push(lcaImplementationFilePath.fileName);
        }
        lifeCycleImplementationDocuments = 1;
      }

      if (lcaReportsFiles.length > 0 || lcaImplementationFiles.length > 0) {
        const existingDocs = await this.allProductDocumentModel
          .find({
            urnNo: createProcessLifeCycleApproachDto.urnNo,
            documentForm: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
            isDeleted: { $ne: true },
          })
          .session(session);
        oldFileLinksToDeleteAfterCommit = existingDocs
          .map((d) => d.documentLink)
          .filter(Boolean);
        if (existingDocs.length) {
          await this.allProductDocumentModel.updateMany(
            { _id: { $in: existingDocs.map((d) => d._id) } },
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
            versioning: this.documentVersioningService,
            urnNo: createProcessLifeCycleApproachDto.urnNo,
            sectionKey: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
            userId: vendorObjectId,
            docs: existingDocs,
            session,
          });
        }
      }

      // Create process life cycle approach data
      const processLifeCycleApproachData = {
        vendorId: vendorObjectId,
        urnNo: createProcessLifeCycleApproachDto.urnNo,
        lifeCycleAssesmentReports,
        lifeCycleImplementationDetails:
          createProcessLifeCycleApproachDto.lifeCycleImplementationDetails ||
          '',
        lifeCycleImplementationDocuments,
        processLifeCycleApproachStatus:
          createProcessLifeCycleApproachDto.processLifeCycleApproachStatus || 0,
        updatedDate: now,
      };
      const savedProcessLifeCycleApproach =
        await this.processLifeCycleApproachModel
          .findOneAndUpdate(
            { urnNo: createProcessLifeCycleApproachDto.urnNo },
            {
              $set: processLifeCycleApproachData,
              $setOnInsert: { processLifeCycleApproachId, createdDate: now },
            },
            { upsert: true, new: true, session },
          )
          .exec();

      // Insert uploaded documents into all_product_documents (master table)
      const docsToInsert = [];
      for (let i = 0; i < lcaReportsFilePaths.length; i++) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        docsToInsert.push({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessLifeCycleApproachDto.urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
          documentFormSubsection: 'life_cycle_assesment_reports',
          formPrimaryId: savedProcessLifeCycleApproach.processLifeCycleApproachId,
          documentName: lcaReportsStoredNames[i],
          documentOriginalName: lcaReportsFiles[i].originalname,
          documentLink: lcaReportsFilePaths[i],
          createdDate: now,
          updatedDate: now,
        });
      }
      for (let i = 0; i < lcaImplementationFilePaths.length; i++) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        docsToInsert.push({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessLifeCycleApproachDto.urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
          documentFormSubsection: 'life_cycle_implementation_documents',
          formPrimaryId: savedProcessLifeCycleApproach.processLifeCycleApproachId,
          documentName: lcaImplementationStoredNames[i],
          documentOriginalName: lcaImplementationFiles[i].originalname,
          documentLink: lcaImplementationFilePaths[i],
          createdDate: now,
          updatedDate: now,
        });
      }
      if (docsToInsert.length) {
        const insertedDocs = await this.allProductDocumentModel.insertMany(
          docsToInsert,
          { session },
        );
        await trackProductDocumentBatch({
          versioning: this.documentVersioningService,
          urnNo: createProcessLifeCycleApproachDto.urnNo,
          sectionKey: DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
          userId: vendorObjectId,
          docs: insertedDocs,
          action: 'added',
          session,
        });
      }

      await session.commitTransaction();
      session.endSession();

      for (const fileLink of oldFileLinksToDeleteAfterCommit) {
        const normalizedPath = String(fileLink).replace(/\\/g, '/');
        if (normalizedPath && fs.existsSync(normalizedPath)) {
          try {
            fs.unlinkSync(normalizedPath);
          } catch {
            // Ignore post-commit cleanup issues
          }
        }
      }

      return savedProcessLifeCycleApproach;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      // Clean up uploaded files if transaction fails (files were moved to URN folder)
      try {
        for (const fullPath of createdFileFullPaths) {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      } catch (cleanupError: any) {
        console.error(
          '[Process Life Cycle Approach] File cleanup error:',
          cleanupError,
        );
      }

      console.error('[Process Life Cycle Approach] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process life cycle approach record.',
      );
    }
  }
}
