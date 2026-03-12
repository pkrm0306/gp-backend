import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
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
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProcessWasteManagementService {
  constructor(
    @InjectModel(ProcessWasteManagement.name)
    private processWasteManagementModel: Model<ProcessWasteManagementDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
  ) {}

  /**
   * Safely convert string to ObjectId with validation
   */
  private toObjectId(id: string | Types.ObjectId, fieldName: string): Types.ObjectId {
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
    fileType: 'waste_management_supporting',
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
        throw new BadRequestException(`File data not available for ${fileType}`);
      }
    }

    // Return relative path from uploads folder
    return path.join('urns', urnNo, fileName).replace(/\\/g, '/');
  }

  /**
   * Create process waste management with file upload
   */
  async createProcessWasteManagement(
    createProcessWasteManagementDto: CreateProcessWasteManagementDto,
    vendorId: string,
    wmSupportingDocumentsFile?: Express.Multer.File,
  ): Promise<ProcessWasteManagementDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Declare file path outside try block for cleanup in catch
    let wmSupportingDocumentsFullPath: string | undefined;

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get next process waste management ID
      const processWasteManagementId = await this.sequenceHelper.getProcessWasteManagementId();

      // Get current date
      const now = new Date();

      // Handle file upload and set flag
      let wmSupportingDocuments = 0;
      let wmSupportingDocumentsFilePath: string | undefined;

      if (wmSupportingDocumentsFile) {
        wmSupportingDocumentsFilePath = this.saveFileToUrnFolder(
          wmSupportingDocumentsFile,
          createProcessWasteManagementDto.urnNo,
          'waste_management_supporting',
        );
        wmSupportingDocumentsFullPath = path.join('uploads', wmSupportingDocumentsFilePath);
        wmSupportingDocuments = 1;
      }

      // Create process waste management data
      const processWasteManagementData = {
        processWasteManagementId,
        vendorId: vendorObjectId,
        urnNo: createProcessWasteManagementDto.urnNo,
        wmImplementationDetails: createProcessWasteManagementDto.wmImplementationDetails || '',
        wmSupportingDocuments,
        processWasteManagementStatus: createProcessWasteManagementDto.processWasteManagementStatus || 0,
        createdDate: now,
        updatedDate: now,
      };

      const processWasteManagement = new this.processWasteManagementModel(processWasteManagementData);
      const savedProcessWasteManagement = await processWasteManagement.save({ session });

      // Insert uploaded document into all_product_documents (master table)
      if (wmSupportingDocumentsFilePath && wmSupportingDocumentsFile) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const documentLink = `uploads/${wmSupportingDocumentsFilePath}`;

        const documentData = {
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessWasteManagementDto.urnNo,
          eoiNo: '',
          documentForm: 'process_waste_management',
          documentFormSubsection: 'wm_supporting_documents',
          formPrimaryId: processWasteManagementId,
          documentName: path.basename(wmSupportingDocumentsFilePath),
          documentOriginalName: wmSupportingDocumentsFile.originalname,
          documentLink,
          createdDate: now,
          updatedDate: now,
        };

        await this.allProductDocumentModel.create([documentData], { session });
      }

      await session.commitTransaction();
      session.endSession();

      return savedProcessWasteManagement;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      // Clean up uploaded file if transaction fails (file was moved to URN folder)
      try {
        if (wmSupportingDocumentsFullPath && fs.existsSync(wmSupportingDocumentsFullPath)) {
          fs.unlinkSync(wmSupportingDocumentsFullPath);
        }
      } catch (cleanupError: any) {
        console.error('[Process Waste Management] File cleanup error:', cleanupError);
      }

      console.error('[Process Waste Management] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process waste management record.',
      );
    }
  }
}
