import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
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
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProcessProductStewardshipService {
  constructor(
    @InjectModel(ProcessProductStewardship.name)
    private processProductStewardshipModel: Model<ProcessProductStewardshipDocument>,
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
    fileType: 'sea_supporting' | 'qm_supporting' | 'epr_supporting',
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
   * Create process product stewardship with file uploads
   */
  async createProcessProductStewardship(
    createProcessProductStewardshipDto: CreateProcessProductStewardshipDto,
    vendorId: string,
    seaSupportingDocumentsFile?: Express.Multer.File,
    qmSupportingDocumentsFile?: Express.Multer.File,
    eprSupportingDocumentsFile?: Express.Multer.File,
  ): Promise<ProcessProductStewardshipDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Declare file paths outside try block for cleanup in catch
    let seaFullPath: string | undefined;
    let qmFullPath: string | undefined;
    let eprFullPath: string | undefined;

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get next process product stewardship ID
      const processProductStewardshipId = await this.sequenceHelper.getProcessProductStewardshipId();

      // Get current date
      const now = new Date();

      // Handle file uploads and set flags
      let seaSupportingDocuments = 0;
      let seaFilePath: string | undefined;

      if (seaSupportingDocumentsFile) {
        seaFilePath = this.saveFileToUrnFolder(
          seaSupportingDocumentsFile,
          createProcessProductStewardshipDto.urnNo,
          'sea_supporting',
        );
        seaFullPath = path.join('uploads', seaFilePath);
        seaSupportingDocuments = 1;
      }

      let qmSupportingDocuments = 0;
      let qmFilePath: string | undefined;

      if (qmSupportingDocumentsFile) {
        qmFilePath = this.saveFileToUrnFolder(
          qmSupportingDocumentsFile,
          createProcessProductStewardshipDto.urnNo,
          'qm_supporting',
        );
        qmFullPath = path.join('uploads', qmFilePath);
        qmSupportingDocuments = 1;
      }

      let eprSupportingDocuments = 0;
      let eprFilePath: string | undefined;

      if (eprSupportingDocumentsFile) {
        eprFilePath = this.saveFileToUrnFolder(
          eprSupportingDocumentsFile,
          createProcessProductStewardshipDto.urnNo,
          'epr_supporting',
        );
        eprFullPath = path.join('uploads', eprFilePath);
        eprSupportingDocuments = 1;
      }

      // Create process product stewardship data
      const processProductStewardshipData = {
        processProductStewardshipId,
        vendorId: vendorObjectId,
        urnNo: createProcessProductStewardshipDto.urnNo,
        seaSupportingDocuments,
        qualityManagementDetails: createProcessProductStewardshipDto.qualityManagementDetails || '',
        qmSupportingDocuments,
        eprImplementedDetails: createProcessProductStewardshipDto.eprImplementedDetails || '',
        eprGreenPackagingDetails: createProcessProductStewardshipDto.eprGreenPackagingDetails || '',
        eprSupportingDocuments,
        productStewardshipStatus: createProcessProductStewardshipDto.productStewardshipStatus || 0,
        createdDate: now,
        updatedDate: now,
      };

      const processProductStewardship = new this.processProductStewardshipModel(processProductStewardshipData);
      const savedProcessProductStewardship = await processProductStewardship.save({ session });

      // Insert uploaded documents into all_product_documents (master table)
      if (seaFilePath && seaSupportingDocumentsFile) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const documentLink = `uploads/${seaFilePath}`;

        const documentData = {
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessProductStewardshipDto.urnNo,
          eoiNo: '',
          documentForm: 'process_product_stewardship',
          documentFormSubsection: 'sea_supporting_documents',
          formPrimaryId: processProductStewardshipId,
          documentName: path.basename(seaFilePath),
          documentOriginalName: seaSupportingDocumentsFile.originalname,
          documentLink,
          createdDate: now,
          updatedDate: now,
        };

        await this.allProductDocumentModel.create([documentData], { session });
      }

      if (qmFilePath && qmSupportingDocumentsFile) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const documentLink = `uploads/${qmFilePath}`;

        const documentData = {
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessProductStewardshipDto.urnNo,
          eoiNo: '',
          documentForm: 'process_product_stewardship',
          documentFormSubsection: 'qm_supporting_documents',
          formPrimaryId: processProductStewardshipId,
          documentName: path.basename(qmFilePath),
          documentOriginalName: qmSupportingDocumentsFile.originalname,
          documentLink,
          createdDate: now,
          updatedDate: now,
        };

        await this.allProductDocumentModel.create([documentData], { session });
      }

      if (eprFilePath && eprSupportingDocumentsFile) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const documentLink = `uploads/${eprFilePath}`;

        const documentData = {
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessProductStewardshipDto.urnNo,
          eoiNo: '',
          documentForm: 'process_product_stewardship',
          documentFormSubsection: 'epr_supporting_documents',
          formPrimaryId: processProductStewardshipId,
          documentName: path.basename(eprFilePath),
          documentOriginalName: eprSupportingDocumentsFile.originalname,
          documentLink,
          createdDate: now,
          updatedDate: now,
        };

        await this.allProductDocumentModel.create([documentData], { session });
      }

      await session.commitTransaction();
      session.endSession();

      return savedProcessProductStewardship;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      // Clean up uploaded files if transaction fails (files were moved to URN folder)
      try {
        if (seaFullPath && fs.existsSync(seaFullPath)) {
          fs.unlinkSync(seaFullPath);
        }
        if (qmFullPath && fs.existsSync(qmFullPath)) {
          fs.unlinkSync(qmFullPath);
        }
        if (eprFullPath && fs.existsSync(eprFullPath)) {
          fs.unlinkSync(eprFullPath);
        }
      } catch (cleanupError: any) {
        console.error('[Process Product Stewardship] File cleanup error:', cleanupError);
      }

      console.error('[Process Product Stewardship] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process product stewardship record.',
      );
    }
  }
}
