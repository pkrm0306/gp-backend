import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
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
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProcessManufacturingService implements OnModuleInit {
  constructor(
    @InjectModel(ProcessManufacturing.name)
    private processManufacturingModel: Model<ProcessManufacturingDocument>,
    @InjectModel(AllProductDocument.name)
    private allProductDocumentModel: Model<AllProductDocumentDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
  ) {}

  async onModuleInit() {
    try {
      await this.processManufacturingModel.syncIndexes();
    } catch (error) {
      console.error(
        '[process-manufacturing] syncIndexes failed (check duplicates):',
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
        throw new BadRequestException(
          `File data not available for ${fileType}`,
        );
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
    energyConservationSupportingDocumentsFiles?: Express.Multer.File[],
    energyConsumptionDocumentsFiles?: Express.Multer.File[],
  ): Promise<ProcessManufacturingDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Track file paths for cleanup/replacement
    let createdFileFullPaths: string[] = [];
    let oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get current date
      const now = new Date();
      const existingManufacturing = await this.processManufacturingModel
        .findOne({ urnNo: createProcessManufacturingDto.urnNo })
        .session(session);
      const processManufacturingId =
        existingManufacturing?.processManufacturingId ??
        (await this.sequenceHelper.getProcessManufacturingId());
      const energyConservationFiles = Array.isArray(
        energyConservationSupportingDocumentsFiles,
      )
        ? energyConservationSupportingDocumentsFiles
        : [];
      const energyConsumptionFiles = Array.isArray(energyConsumptionDocumentsFiles)
        ? energyConsumptionDocumentsFiles
        : [];

      // Handle file uploads and set flags
      let energyConservationSupportingDocuments =
        existingManufacturing?.energyConservationSupportingDocuments ?? 0;
      const energyConservationFilePaths: string[] = [];
      if (energyConservationFiles.length > 0) {
        for (const energyConservationSupportingDocumentsFile of energyConservationFiles) {
          const energyConservationFilePath = this.saveFileToUrnFolder(
            energyConservationSupportingDocumentsFile,
            createProcessManufacturingDto.urnNo,
            'energy_conservation',
          );
          energyConservationFilePaths.push(energyConservationFilePath);
          createdFileFullPaths.push(path.join('uploads', energyConservationFilePath));
        }
        energyConservationSupportingDocuments = 1;
      }

      let energyConsumptionDocuments =
        existingManufacturing?.energyConsumptionDocuments ?? 0;
      const energyConsumptionFilePaths: string[] = [];
      if (energyConsumptionFiles.length > 0) {
        for (const energyConsumptionDocumentsFile of energyConsumptionFiles) {
          const energyConsumptionFilePath = this.saveFileToUrnFolder(
            energyConsumptionDocumentsFile,
            createProcessManufacturingDto.urnNo,
            'energy_consumption',
          );
          energyConsumptionFilePaths.push(energyConsumptionFilePath);
          createdFileFullPaths.push(path.join('uploads', energyConsumptionFilePath));
        }
        energyConsumptionDocuments = 1;
      }

      if (energyConservationFiles.length > 0 || energyConsumptionFiles.length > 0) {
        const existingDocs = await this.allProductDocumentModel
          .find({
            urnNo: createProcessManufacturingDto.urnNo,
            documentForm: DocumentSectionKey.PROCESS_MANUFACTURING,
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

      // Create process manufacturing data
      const processManufacturingData = {
        vendorId: vendorObjectId,
        urnNo: createProcessManufacturingDto.urnNo,
        energyConservationSupportingDocuments,
        portableWaterDemand:
          createProcessManufacturingDto.portableWaterDemand || '',
        rainWaterHarvesting:
          createProcessManufacturingDto.rainWaterHarvesting || '',
        beyondTheFenceInitiatives:
          createProcessManufacturingDto.beyondTheFenceInitiatives || '',
        totalEnergyConsumption:
          createProcessManufacturingDto.totalEnergyConsumption || null,
        energyConsumptionDocuments,
        processManufacturingStatus:
          createProcessManufacturingDto.processManufacturingStatus || 0,
        updatedDate: now,
      };
      const savedProcessManufacturing = await this.processManufacturingModel
        .findOneAndUpdate(
          { urnNo: createProcessManufacturingDto.urnNo },
          {
            $set: processManufacturingData,
            $setOnInsert: { processManufacturingId, createdDate: now },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      // Insert uploaded documents into all_product_documents (master table)
      const docsToInsert = [];
      for (let i = 0; i < energyConservationFilePaths.length; i++) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        docsToInsert.push({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessManufacturingDto.urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.PROCESS_MANUFACTURING,
          documentFormSubsection: 'energy_conservation_supporting_documents',
          formPrimaryId: savedProcessManufacturing.processManufacturingId,
          documentName: path.basename(energyConservationFilePaths[i]),
          documentOriginalName: energyConservationFiles[i].originalname,
          documentLink: `uploads/${energyConservationFilePaths[i]}`,
          createdDate: now,
          updatedDate: now,
        });
      }
      for (let i = 0; i < energyConsumptionFilePaths.length; i++) {
        const productDocumentId = await this.sequenceHelper.getProductDocumentId();
        docsToInsert.push({
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProcessManufacturingDto.urnNo,
          eoiNo: '',
          documentForm: DocumentSectionKey.PROCESS_MANUFACTURING,
          documentFormSubsection: 'energy_consumption_documents',
          formPrimaryId: savedProcessManufacturing.processManufacturingId,
          documentName: path.basename(energyConsumptionFilePaths[i]),
          documentOriginalName: energyConsumptionFiles[i].originalname,
          documentLink: `uploads/${energyConsumptionFilePaths[i]}`,
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

      return savedProcessManufacturing;
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
          '[Process Manufacturing] File cleanup error:',
          cleanupError,
        );
      }

      console.error('[Process Manufacturing] Create error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create process manufacturing record.',
      );
    }
  }
}
