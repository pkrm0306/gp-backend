import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
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
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';

@Injectable()
export class ProcessInnovationService implements OnModuleInit {
  constructor(
    @InjectModel(ProcessInnovation.name)
    private processInnovationModel: Model<ProcessInnovationDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
  ) {}

  async onModuleInit() {
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
  ): Promise<ProcessInnovationDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    let createdFileFullPaths: string[] = [];
    let oldFileLinksToDeleteAfterCommit: string[] = [];

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

      if (uploadedInnovationFiles.length > 0) {
        const existingDocs = await this.allProductDocumentModel
          .find({
            urnNo: createProcessInnovationDto.urnNo,
            documentForm: DocumentSectionKey.PROCESS_INNOVATION,
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
        const docsToInsert = [];
        for (let i = 0; i < innovationImplementationDocumentsFilePaths.length; i++) {
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProcessInnovationDto.urnNo,
            eoiNo: '',
            documentForm: DocumentSectionKey.PROCESS_INNOVATION,
            documentFormSubsection: 'innovation_implementation_documents',
            formPrimaryId: savedProcessInnovation.processInnovationId,
            documentName: path.basename(
              innovationImplementationDocumentsFilePaths[i],
            ),
            documentOriginalName: uploadedInnovationFiles[i].originalname,
            documentLink: innovationImplementationDocumentsFilePaths[i],
            createdDate: now,
            updatedDate: now,
          });
        }
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

      return savedProcessInnovation;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

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
}
