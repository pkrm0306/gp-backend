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

@Injectable()
export class ProcessLifeCycleApproachService implements OnModuleInit {
  constructor(
    @InjectModel(ProcessLifeCycleApproach.name)
    private processLifeCycleApproachModel: Model<ProcessLifeCycleApproachDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
  ) {}

  async onModuleInit() {
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

  /**
   * Ensure URN folder exists, create if it doesn't
   */
  private ensureUrnFolder(urnNo: string): string {
    const urnFolderPath = path.join('uploads', 'urns', urnNo);

    if (!fs.existsSync(urnFolderPath)) {
      fs.mkdirSync(urnFolderPath, { recursive: true });
    }

    return urnFolderPath;
  }

  /**
   * Save file to URN-specific folder
   */
  private saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
    fileType: 'lca_reports' | 'lca_implementation',
  ): string {
    const urnFolderPath = this.ensureUrnFolder(urnNo);
    const fileExt = path.extname(file.originalname);
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e9);
    const fileName = `${fileType}-${timestamp}-${randomSuffix}${fileExt}`;
    const filePath = path.join(urnFolderPath, fileName);

    // Copy file from temp location to URN folder (file.path is the temp location)
    if (file.path && fs.existsSync(file.path)) {
      fs.copyFileSync(file.path, filePath);
      // Optionally remove temp file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        // Ignore if temp file doesn't exist or can't be deleted
      }
    } else {
      // If file.path doesn't exist, write buffer directly
      if (file.buffer) {
        fs.writeFileSync(filePath, file.buffer);
      } else {
        throw new BadRequestException(
          `File data not available for ${fileType}`,
        );
      }
    }

    // Return relative path from uploads folder
    return path.join('urns', urnNo, fileName).replace(/\\/g, '/');
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

      if (lcaReportsFiles.length > 0) {
        for (const lifeCycleAssesmentReportsFile of lcaReportsFiles) {
          const lcaReportsFilePath = this.saveFileToUrnFolder(
            lifeCycleAssesmentReportsFile,
            createProcessLifeCycleApproachDto.urnNo,
            'lca_reports',
          );
          lcaReportsFilePaths.push(lcaReportsFilePath);
          createdFileFullPaths.push(path.join('uploads', lcaReportsFilePath));
        }
        lifeCycleAssesmentReports = 1;
      }

      let lifeCycleImplementationDocuments =
        existingLifeCycle?.lifeCycleImplementationDocuments ?? 0;
      const lcaImplementationFilePaths: string[] = [];

      if (lcaImplementationFiles.length > 0) {
        for (const lifeCycleImplementationDocumentsFile of lcaImplementationFiles) {
          const lcaImplementationFilePath = this.saveFileToUrnFolder(
            lifeCycleImplementationDocumentsFile,
            createProcessLifeCycleApproachDto.urnNo,
            'lca_implementation',
          );
          lcaImplementationFilePaths.push(lcaImplementationFilePath);
          createdFileFullPaths.push(path.join('uploads', lcaImplementationFilePath));
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
          documentName: path.basename(lcaReportsFilePaths[i]),
          documentOriginalName: lcaReportsFiles[i].originalname,
          documentLink: `uploads/${lcaReportsFilePaths[i]}`,
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
          documentName: path.basename(lcaImplementationFilePaths[i]),
          documentOriginalName: lcaImplementationFiles[i].originalname,
          documentLink: `uploads/${lcaImplementationFilePaths[i]}`,
          createdDate: now,
          updatedDate: now,
        });
      }
      if (docsToInsert.length) {
        await this.allProductDocumentModel.insertMany(docsToInsert, { session });
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
