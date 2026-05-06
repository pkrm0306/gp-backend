import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import {
  ProcessProductStewardship,
  ProcessProductStewardshipDocument,
} from './schemas/process-product-stewardship.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { CreateProcessProductStewardshipDto } from './dto/create-process-product-stewardship.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';

@Injectable()
export class ProcessProductStewardshipService implements OnModuleInit {
  constructor(
    @InjectModel(ProcessProductStewardship.name)
    private processProductStewardshipModel: Model<ProcessProductStewardshipDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
  ) {}

  async onModuleInit() {
    try {
      await this.processProductStewardshipModel.syncIndexes();
    } catch (error) {
      console.error(
        '[process-product-stewardship] syncIndexes failed (check duplicates):',
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
    fileType: 'sea_supporting' | 'qm_supporting' | 'epr_supporting',
  ): Promise<string> {
    return (await uploadFile(file, `urns/${urnNo}`)).fileUrl;
  }

  /**
   * Create process product stewardship with file uploads
   */
  async createProcessProductStewardship(
    createProcessProductStewardshipDto: CreateProcessProductStewardshipDto,
    vendorId: string,
    seaSupportingDocumentsFiles?: Express.Multer.File[],
    qmSupportingDocumentsFiles?: Express.Multer.File[],
    eprSupportingDocumentsFiles?: Express.Multer.File[],
  ): Promise<ProcessProductStewardshipDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Track new and replaced files for cleanup
    let createdFileFullPaths: string[] = [];
    let oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get current date
      const now = new Date();
      const existingStewardship = await this.processProductStewardshipModel
        .findOne({
          urnNo: createProcessProductStewardshipDto.urnNo,
        })
        .session(session);
      const processProductStewardshipId =
        existingStewardship?.processProductStewardshipId ??
        (await this.sequenceHelper.getProcessProductStewardshipId());

      const seaFiles = Array.isArray(seaSupportingDocumentsFiles)
        ? seaSupportingDocumentsFiles
        : [];
      const qmFiles = Array.isArray(qmSupportingDocumentsFiles)
        ? qmSupportingDocumentsFiles
        : [];
      const eprFiles = Array.isArray(eprSupportingDocumentsFiles)
        ? eprSupportingDocumentsFiles
        : [];

      // Handle file uploads and set flags
      let seaSupportingDocuments = existingStewardship?.seaSupportingDocuments ?? 0;
      const seaFilePaths: string[] = [];

      if (seaFiles.length > 0) {
        for (const seaSupportingDocumentsFile of seaFiles) {
          const seaFilePath = await this.saveFileToUrnFolder(
            seaSupportingDocumentsFile,
            createProcessProductStewardshipDto.urnNo,
            'sea_supporting',
          );
          seaFilePaths.push(seaFilePath);
          createdFileFullPaths.push(path.join('uploads', seaFilePath));
        }
        seaSupportingDocuments = 1;
      }

      let qmSupportingDocuments = existingStewardship?.qmSupportingDocuments ?? 0;
      const qmFilePaths: string[] = [];

      if (qmFiles.length > 0) {
        for (const qmSupportingDocumentsFile of qmFiles) {
          const qmFilePath = await this.saveFileToUrnFolder(
            qmSupportingDocumentsFile,
            createProcessProductStewardshipDto.urnNo,
            'qm_supporting',
          );
          qmFilePaths.push(qmFilePath);
          createdFileFullPaths.push(path.join('uploads', qmFilePath));
        }
        qmSupportingDocuments = 1;
      }

      let eprSupportingDocuments = existingStewardship?.eprSupportingDocuments ?? 0;
      const eprFilePaths: string[] = [];

      if (eprFiles.length > 0) {
        for (const eprSupportingDocumentsFile of eprFiles) {
          const eprFilePath = await this.saveFileToUrnFolder(
            eprSupportingDocumentsFile,
            createProcessProductStewardshipDto.urnNo,
            'epr_supporting',
          );
          eprFilePaths.push(eprFilePath);
          createdFileFullPaths.push(path.join('uploads', eprFilePath));
        }
        eprSupportingDocuments = 1;
      }

      // Replace existing docs when any stewardship file is re-uploaded
      if (
        seaFiles.length > 0 ||
        qmFiles.length > 0 ||
        eprFiles.length > 0
      ) {
        const existingDocs = await this.allProductDocumentModel
          .find({
            urnNo: createProcessProductStewardshipDto.urnNo,
            documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
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

      const processProductStewardshipData = {
        vendorId: vendorObjectId,
        urnNo: createProcessProductStewardshipDto.urnNo,
        seaSupportingDocuments,
        qualityManagementDetails:
          createProcessProductStewardshipDto.qualityManagementDetails || '',
        qmSupportingDocuments,
        eprImplementedDetails:
          createProcessProductStewardshipDto.eprImplementedDetails || '',
        eprGreenPackagingDetails:
          createProcessProductStewardshipDto.eprGreenPackagingDetails || '',
        eprSupportingDocuments,
        productStewardshipStatus:
          createProcessProductStewardshipDto.productStewardshipStatus || 0,
        updatedDate: now,
      };

      const savedProcessProductStewardship =
        await this.processProductStewardshipModel
          .findOneAndUpdate(
            { urnNo: createProcessProductStewardshipDto.urnNo },
            {
              $set: processProductStewardshipData,
              $setOnInsert: {
                processProductStewardshipId,
                createdDate: now,
              },
            },
            { upsert: true, new: true, session },
          )
          .exec();

      // Insert uploaded documents into all_product_documents (master table)
      if (seaFilePaths.length > 0) {
        const docsToInsert = [];
        for (let i = 0; i < seaFilePaths.length; i++) {
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProcessProductStewardshipDto.urnNo,
            eoiNo: '',
            documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
            documentFormSubsection: 'sea_supporting_documents',
            formPrimaryId:
              savedProcessProductStewardship.processProductStewardshipId,
            documentName: path.basename(seaFilePaths[i]),
            documentOriginalName: seaFiles[i].originalname,
            documentLink: seaFilePaths[i],
            createdDate: now,
            updatedDate: now,
          });
        }
        await this.allProductDocumentModel.insertMany(docsToInsert, { session });
      }

      if (qmFilePaths.length > 0) {
        const docsToInsert = [];
        for (let i = 0; i < qmFilePaths.length; i++) {
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProcessProductStewardshipDto.urnNo,
            eoiNo: '',
            documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
            documentFormSubsection: 'qm_supporting_documents',
            formPrimaryId:
              savedProcessProductStewardship.processProductStewardshipId,
            documentName: path.basename(qmFilePaths[i]),
            documentOriginalName: qmFiles[i].originalname,
            documentLink: qmFilePaths[i],
            createdDate: now,
            updatedDate: now,
          });
        }
        await this.allProductDocumentModel.insertMany(docsToInsert, { session });
      }

      if (eprFilePaths.length > 0) {
        const docsToInsert = [];
        for (let i = 0; i < eprFilePaths.length; i++) {
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProcessProductStewardshipDto.urnNo,
            eoiNo: '',
            documentForm: DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
            documentFormSubsection: 'epr_supporting_documents',
            formPrimaryId:
              savedProcessProductStewardship.processProductStewardshipId,
            documentName: path.basename(eprFilePaths[i]),
            documentOriginalName: eprFiles[i].originalname,
            documentLink: eprFilePaths[i],
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
            // Ignore cleanup issues after successful commit
          }
        }
      }

      return savedProcessProductStewardship;
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
          '[Process Product Stewardship] File cleanup error:',
          cleanupError,
        );
      }

      console.error('[Process Product Stewardship] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process product stewardship record.',
      );
    }
  }
}
