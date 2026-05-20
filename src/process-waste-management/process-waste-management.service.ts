import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import {
  ProcessWasteManagement,
  ProcessWasteManagementDocument,
} from './schemas/process-waste-management.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { CreateProcessWasteManagementDto } from './dto/create-process-waste-management.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';

@Injectable()
export class ProcessWasteManagementService implements OnModuleInit {
  constructor(
    @InjectModel(ProcessWasteManagement.name)
    private processWasteManagementModel: Model<ProcessWasteManagementDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
  ) {}

  async onModuleInit() {
    const shouldSyncIndexes =
      String(process.env.SYNC_INDEXES_ON_BOOT || 'false').toLowerCase() ===
      'true';
    if (!shouldSyncIndexes) return;
    try {
      await this.processWasteManagementModel.syncIndexes();
    } catch (error) {
      console.error(
        '[process-waste-management] syncIndexes failed (check duplicates):',
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
    fileType: 'waste_management_supporting',
  ): Promise<string> {
    return (await uploadFile(file, `urns/${urnNo}`)).fileUrl;
  }

  /**
   * Create process waste management with file upload
   */
  async createProcessWasteManagement(
    createProcessWasteManagementDto: CreateProcessWasteManagementDto,
    vendorId: string,
    wmSupportingDocumentsFiles?: Express.Multer.File[],
  ): Promise<ProcessWasteManagementDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    let createdFileFullPaths: string[] = [];

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get current date
      const now = new Date();
      const existingWasteManagement = await this.processWasteManagementModel
        .findOne({ urnNo: createProcessWasteManagementDto.urnNo })
        .session(session);
      const processWasteManagementId =
        existingWasteManagement?.processWasteManagementId ??
        (await this.sequenceHelper.getProcessWasteManagementId());
      const uploadedWmFiles = Array.isArray(wmSupportingDocumentsFiles)
        ? wmSupportingDocumentsFiles
        : [];

      // Handle file upload and set flag
      let wmSupportingDocuments =
        existingWasteManagement?.wmSupportingDocuments ?? 0;
      const wmSupportingDocumentsFilePaths: string[] = [];

      if (uploadedWmFiles.length > 0) {
        for (const wmSupportingDocumentsFile of uploadedWmFiles) {
          const wmSupportingDocumentsFilePath = await this.saveFileToUrnFolder(
            wmSupportingDocumentsFile,
            createProcessWasteManagementDto.urnNo,
            'waste_management_supporting',
          );
          wmSupportingDocumentsFilePaths.push(wmSupportingDocumentsFilePath);
          createdFileFullPaths.push(
            path.join('uploads', wmSupportingDocumentsFilePath),
          );
        }
        wmSupportingDocuments = 1;
      }

      // Append-only document rows (same behaviour as process-manufacturing):
      // do not soft-delete existing PROCESS_WASTE_MANAGEMENT all_product_documents
      // on each upload — vendors add files incrementally.

      // Create process waste management data
      const processWasteManagementData = {
        vendorId: vendorObjectId,
        urnNo: createProcessWasteManagementDto.urnNo,
        wmImplementationDetails:
          createProcessWasteManagementDto.wmImplementationDetails || '',
        wmSupportingDocuments,
        processWasteManagementStatus:
          createProcessWasteManagementDto.processWasteManagementStatus || 0,
        updatedDate: now,
      };
      const savedProcessWasteManagement = await this.processWasteManagementModel
        .findOneAndUpdate(
          { urnNo: createProcessWasteManagementDto.urnNo },
          {
            $set: processWasteManagementData,
            $setOnInsert: { processWasteManagementId, createdDate: now },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      // Insert uploaded document into all_product_documents (master table)
      if (wmSupportingDocumentsFilePaths.length > 0) {
        const docsToInsert = [];
        for (let i = 0; i < wmSupportingDocumentsFilePaths.length; i++) {
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProcessWasteManagementDto.urnNo,
            eoiNo: '',
            documentForm: DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
            documentFormSubsection: 'wm_supporting_documents',
            formPrimaryId: savedProcessWasteManagement.processWasteManagementId,
            documentName: path.basename(wmSupportingDocumentsFilePaths[i]),
            documentOriginalName: uploadedWmFiles[i].originalname,
            documentLink: wmSupportingDocumentsFilePaths[i],
            createdDate: now,
            updatedDate: now,
          });
        }
        await this.allProductDocumentModel.insertMany(docsToInsert, { session });
      }

      await session.commitTransaction();
      session.endSession();

      return savedProcessWasteManagement;
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
        console.error(
          '[Process Waste Management] File cleanup error:',
          cleanupError,
        );
      }

      console.error('[Process Waste Management] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process waste management record.',
      );
    }
  }
}
