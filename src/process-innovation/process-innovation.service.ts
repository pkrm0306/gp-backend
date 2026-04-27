import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
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

@Injectable()
export class ProcessInnovationService {
  constructor(
    @InjectModel(ProcessInnovation.name)
    private processInnovationModel: Model<ProcessInnovationDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
  ) {}

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
    fileType: 'innovation_implementation',
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
   * Create process innovation with file upload
   */
  async createProcessInnovation(
    createProcessInnovationDto: CreateProcessInnovationDto,
    vendorId: string,
    innovationImplementationDocumentsFile?: Express.Multer.File,
  ): Promise<ProcessInnovationDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Declare file path outside try block for cleanup in catch
    let innovationImplementationDocumentsFullPath: string | undefined;

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get next process innovation ID
      const processInnovationId =
        await this.sequenceHelper.getProcessInnovationId();

      // Get current date
      const now = new Date();

      // Handle file upload and set flag
      let innovationImplementationDocuments = 0;
      let innovationImplementationDocumentsFilePath: string | undefined;

      if (innovationImplementationDocumentsFile) {
        innovationImplementationDocumentsFilePath = this.saveFileToUrnFolder(
          innovationImplementationDocumentsFile,
          createProcessInnovationDto.urnNo,
          'innovation_implementation',
        );
        innovationImplementationDocumentsFullPath = path.join(
          'uploads',
          innovationImplementationDocumentsFilePath,
        );
        innovationImplementationDocuments = 1;
      }

      // Create process innovation data
      const processInnovationData = {
        processInnovationId,
        vendorId: vendorObjectId,
        urnNo: createProcessInnovationDto.urnNo,
        innovationImplementationDetails:
          createProcessInnovationDto.innovationImplementationDetails || '',
        innovationImplementationDocuments,
        processInnovationStatus:
          createProcessInnovationDto.processInnovationStatus || 0,
        createdDate: now,
        updatedDate: now,
      };

      const processInnovation = new this.processInnovationModel(
        processInnovationData,
      );
      const savedProcessInnovation = await processInnovation.save({ session });

      // Insert uploaded document into all_product_documents (master table)
      if (
        innovationImplementationDocumentsFilePath &&
        innovationImplementationDocumentsFile
      ) {
        const productDocumentId =
          await this.sequenceHelper.getProductDocumentId();
        const documentLink = `uploads/${innovationImplementationDocumentsFilePath}`;

        const documentData = {
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessInnovationDto.urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.PROCESS_INNOVATION,
          documentFormSubsection: 'innovation_implementation_documents',
          formPrimaryId: processInnovationId,
          documentName: path.basename(
            innovationImplementationDocumentsFilePath,
          ),
          documentOriginalName:
            innovationImplementationDocumentsFile.originalname,
          documentLink,
          createdDate: now,
          updatedDate: now,
        };

        await this.allProductDocumentModel.create([documentData], { session });
      }

      await session.commitTransaction();
      session.endSession();

      return savedProcessInnovation;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      // Clean up uploaded file if transaction fails (file was moved to URN folder)
      try {
        if (
          innovationImplementationDocumentsFullPath &&
          fs.existsSync(innovationImplementationDocumentsFullPath)
        ) {
          fs.unlinkSync(innovationImplementationDocumentsFullPath);
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
