import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types, ClientSession } from 'mongoose';
import {
  ProcessManufacturing,
  ProcessManufacturingDocument,
} from './schemas/process-manufacturing.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { CreateProcessManufacturingDto } from './dto/create-process-manufacturing.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProcessManufacturingService {
  constructor(
    @InjectModel(ProcessManufacturing.name)
    private processManufacturingModel: Model<ProcessManufacturingDocument>,
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
    fileType: 'energy_conservation' | 'energy_consumption',
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
   * Create process manufacturing with file uploads
   */
  async createProcessManufacturing(
    createProcessManufacturingDto: CreateProcessManufacturingDto,
    vendorId: string,
    energyConservationSupportingDocumentsFile?: Express.Multer.File,
    energyConsumptionDocumentsFile?: Express.Multer.File,
  ): Promise<ProcessManufacturingDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Declare file paths outside try block for cleanup in catch
    let energyConservationFullPath: string | undefined;
    let energyConsumptionFullPath: string | undefined;

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get next process manufacturing ID
      const processManufacturingId = await this.sequenceHelper.getProcessManufacturingId();

      // Get current date
      const now = new Date();

      // Handle file uploads and set flags
      let energyConservationSupportingDocuments = 0;
      let energyConservationFilePath: string | undefined;
      let energyConservationFileName = '';

      if (energyConservationSupportingDocumentsFile) {
        energyConservationFilePath = this.saveFileToUrnFolder(
          energyConservationSupportingDocumentsFile,
          createProcessManufacturingDto.urnNo,
          'energy_conservation',
        );
        energyConservationFullPath = path.join('uploads', energyConservationFilePath);
        energyConservationSupportingDocuments = 1;
        energyConservationFileName =
          createProcessManufacturingDto.energyConservationSupportingDocumentsFileName ||
          path.basename(energyConservationFilePath);
      }

      let energyConsumptionDocuments = 0;
      let energyConsumptionFilePath: string | undefined;
      let energyConsumptionFileName = '';

      if (energyConsumptionDocumentsFile) {
        energyConsumptionFilePath = this.saveFileToUrnFolder(
          energyConsumptionDocumentsFile,
          createProcessManufacturingDto.urnNo,
          'energy_consumption',
        );
        energyConsumptionFullPath = path.join('uploads', energyConsumptionFilePath);
        energyConsumptionDocuments = 1;
        energyConsumptionFileName =
          createProcessManufacturingDto.energyConsumptionDocumentsFileName ||
          path.basename(energyConsumptionFilePath);
      }

      // Create process manufacturing data
      const processManufacturingData = {
        processManufacturingId,
        vendorId: vendorObjectId,
        urnNo: createProcessManufacturingDto.urnNo,
        energyConservationSupportingDocuments,
        portableWaterDemand: createProcessManufacturingDto.portableWaterDemand || '',
        rainWaterHarvesting: createProcessManufacturingDto.rainWaterHarvesting || '',
        beyondTheFenceInitiatives: createProcessManufacturingDto.beyondTheFenceInitiatives || '',
        totalEnergyConsumption: createProcessManufacturingDto.totalEnergyConsumption || null,
        energyConsumptionDocuments,
        processManufacturingStatus: createProcessManufacturingDto.processManufacturingStatus || 0,
        createdDate: now,
        updatedDate: now,
      };

      const processManufacturing = new this.processManufacturingModel(processManufacturingData);
      const savedProcessManufacturing = await processManufacturing.save({ session });

      // Insert uploaded documents into all_product_documents (master table)
      if (energyConservationFilePath && energyConservationSupportingDocumentsFile) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const documentLink = `uploads/${energyConservationFilePath}`;

        const documentData = {
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessManufacturingDto.urnNo,
          eoiNo: '',
          documentForm: 'process_manufacturing',
          documentFormSubsection: 'energy_conservation_supporting_documents',
          formPrimaryId: processManufacturingId,
          documentName: path.basename(energyConservationFilePath),
          documentOriginalName: energyConservationSupportingDocumentsFile.originalname,
          documentLink,
          createdDate: now,
          updatedDate: now,
        };

        await this.allProductDocumentModel.create([documentData], { session });
      }

      if (energyConsumptionFilePath && energyConsumptionDocumentsFile) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        const documentLink = `uploads/${energyConsumptionFilePath}`;

        const documentData = {
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessManufacturingDto.urnNo,
          eoiNo: '',
          documentForm: 'process_manufacturing',
          documentFormSubsection: 'energy_consumption_documents',
          formPrimaryId: processManufacturingId,
          documentName: path.basename(energyConsumptionFilePath),
          documentOriginalName: energyConsumptionDocumentsFile.originalname,
          documentLink,
          createdDate: now,
          updatedDate: now,
        };

        await this.allProductDocumentModel.create([documentData], { session });
      }

      await session.commitTransaction();
      session.endSession();

      return savedProcessManufacturing;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      // Clean up uploaded files if transaction fails (files were moved to URN folder)
      try {
        if (energyConservationFullPath && fs.existsSync(energyConservationFullPath)) {
          fs.unlinkSync(energyConservationFullPath);
        }
        if (energyConsumptionFullPath && fs.existsSync(energyConsumptionFullPath)) {
          fs.unlinkSync(energyConsumptionFullPath);
        }
      } catch (cleanupError: any) {
        console.error('[Process Manufacturing] File cleanup error:', cleanupError);
      }

      console.error('[Process Manufacturing] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process manufacturing record.',
      );
    }
  }
}
