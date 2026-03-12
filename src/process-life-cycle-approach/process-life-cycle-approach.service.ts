import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
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
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProcessLifeCycleApproachService {
  constructor(
    @InjectModel(ProcessLifeCycleApproach.name)
    private processLifeCycleApproachModel: Model<ProcessLifeCycleApproachDocument>,
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
        throw new BadRequestException(`File data not available for ${fileType}`);
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
    lifeCycleAssesmentReportsFile?: Express.Multer.File,
    lifeCycleImplementationDocumentsFile?: Express.Multer.File,
  ): Promise<ProcessLifeCycleApproachDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Declare file paths outside try block for cleanup in catch
    let lcaReportsFullPath: string | undefined;
    let lcaImplementationFullPath: string | undefined;

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get next process life cycle approach ID
      const processLifeCycleApproachId = await this.sequenceHelper.getProcessLifeCycleApproachId();

      // Get current date
      const now = new Date();

      // Handle file uploads and set flags
      let lifeCycleAssesmentReports = 0;
      let lcaReportsFilePath: string | undefined;

      if (lifeCycleAssesmentReportsFile) {
        lcaReportsFilePath = this.saveFileToUrnFolder(
          lifeCycleAssesmentReportsFile,
          createProcessLifeCycleApproachDto.urnNo,
          'lca_reports',
        );
        lcaReportsFullPath = path.join('uploads', lcaReportsFilePath);
        lifeCycleAssesmentReports = 1;
      }

      let lifeCycleImplementationDocuments = 0;
      let lcaImplementationFilePath: string | undefined;

      if (lifeCycleImplementationDocumentsFile) {
        lcaImplementationFilePath = this.saveFileToUrnFolder(
          lifeCycleImplementationDocumentsFile,
          createProcessLifeCycleApproachDto.urnNo,
          'lca_implementation',
        );
        lcaImplementationFullPath = path.join('uploads', lcaImplementationFilePath);
        lifeCycleImplementationDocuments = 1;
      }

      // Create process life cycle approach data
      const processLifeCycleApproachData = {
        processLifeCycleApproachId,
        vendorId: vendorObjectId,
        urnNo: createProcessLifeCycleApproachDto.urnNo,
        lifeCycleAssesmentReports,
        lifeCycleImplementationDetails: createProcessLifeCycleApproachDto.lifeCycleImplementationDetails || '',
        lifeCycleImplementationDocuments,
        processLifeCycleApproachStatus: createProcessLifeCycleApproachDto.processLifeCycleApproachStatus || 0,
        createdDate: now,
        updatedDate: now,
      };

      const processLifeCycleApproach = new this.processLifeCycleApproachModel(processLifeCycleApproachData);
      const savedProcessLifeCycleApproach = await processLifeCycleApproach.save({ session });

      // Insert uploaded documents into all_product_documents (master table)
      if (lcaReportsFilePath && lifeCycleAssesmentReportsFile) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const documentLink = `uploads/${lcaReportsFilePath}`;

        const documentData = {
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessLifeCycleApproachDto.urnNo,
          eoiNo: '',
          documentForm: 'process_life_cycle_approach',
          documentFormSubsection: 'life_cycle_assesment_reports',
          formPrimaryId: processLifeCycleApproachId,
          documentName: path.basename(lcaReportsFilePath),
          documentOriginalName: lifeCycleAssesmentReportsFile.originalname,
          documentLink,
          createdDate: now,
          updatedDate: now,
        };

        await this.allProductDocumentModel.create([documentData], { session });
      }

      if (lcaImplementationFilePath && lifeCycleImplementationDocumentsFile) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const documentLink = `uploads/${lcaImplementationFilePath}`;

        const documentData = {
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessLifeCycleApproachDto.urnNo,
          eoiNo: '',
          documentForm: 'process_life_cycle_approach',
          documentFormSubsection: 'life_cycle_implementation_documents',
          formPrimaryId: processLifeCycleApproachId,
          documentName: path.basename(lcaImplementationFilePath),
          documentOriginalName: lifeCycleImplementationDocumentsFile.originalname,
          documentLink,
          createdDate: now,
          updatedDate: now,
        };

        await this.allProductDocumentModel.create([documentData], { session });
      }

      await session.commitTransaction();
      session.endSession();

      return savedProcessLifeCycleApproach;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      // Clean up uploaded files if transaction fails (files were moved to URN folder)
      try {
        if (lcaReportsFullPath && fs.existsSync(lcaReportsFullPath)) {
          fs.unlinkSync(lcaReportsFullPath);
        }
        if (lcaImplementationFullPath && fs.existsSync(lcaImplementationFullPath)) {
          fs.unlinkSync(lcaImplementationFullPath);
        }
      } catch (cleanupError: any) {
        console.error('[Process Life Cycle Approach] File cleanup error:', cleanupError);
      }

      console.error('[Process Life Cycle Approach] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process life cycle approach record.',
      );
    }
  }
}
