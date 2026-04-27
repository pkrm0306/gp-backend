import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types, ClientSession } from 'mongoose';
import {
  ProductDesign,
  ProductDesignDocument,
} from './schemas/product-design.schema';
import { PdMeasure, PdMeasureDocument } from './schemas/pd-measure.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from './schemas/all-product-document.schema';
import { CreateProductDesignDto } from './dto/create-product-design.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductDesignService {
  constructor(
    @InjectModel(ProductDesign.name)
    private productDesignModel: Model<ProductDesignDocument>,
    @InjectModel(PdMeasure.name)
    private pdMeasureModel: Model<PdMeasureDocument>,
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
    fileType: 'eco_vision' | 'supporting_document',
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
   * Create product design with file uploads
   */
  async createProductDesign(
    createProductDesignDto: CreateProductDesignDto,
    vendorId: string,
    ecoVisionFile?: Express.Multer.File,
    supportingDocumentFile?: Express.Multer.File,
  ): Promise<ProductDesignDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Declare file paths outside try block for cleanup in catch
    let ecoVisionFullPath: string | undefined;
    let supportingDocumentFullPath: string | undefined;

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get next product design ID
      const productDesignId = await this.sequenceHelper.getProductDesignId();

      // Get current date
      const now = new Date();

      // Fetch EOI no (optional) for master document table
      const productRow = await this.connection
        .collection('products')
        .findOne(
          { urnNo: createProductDesignDto.urnNo, vendorId: vendorObjectId },
          { projection: { eoiNo: 1 } },
        );
      const eoiNo: string | undefined = productRow?.eoiNo;

      // Handle file uploads and set flags
      let ecoVisionUpload = 0;
      let ecoVisionFilePath: string | undefined;
      if (ecoVisionFile) {
        ecoVisionFilePath = this.saveFileToUrnFolder(
          ecoVisionFile,
          createProductDesignDto.urnNo,
          'eco_vision',
        );
        ecoVisionFullPath = path.join('uploads', ecoVisionFilePath);
        ecoVisionUpload = 1;
      }

      let productDesignSupportingDocument = 0;
      let supportingDocumentFilePath: string | undefined;
      if (supportingDocumentFile) {
        supportingDocumentFilePath = this.saveFileToUrnFolder(
          supportingDocumentFile,
          createProductDesignDto.urnNo,
          'supporting_document',
        );
        supportingDocumentFullPath = path.join(
          'uploads',
          supportingDocumentFilePath,
        );
        productDesignSupportingDocument = 1;
      }

      // Create product design data
      const productDesignData = {
        productDesignId,
        urnNo: createProductDesignDto.urnNo,
        vendorId: vendorObjectId,
        ecoVisionUpload,
        statergies: createProductDesignDto.statergies,
        productDesignSupportingDocument,
        productDesignStatus: createProductDesignDto.productDesignStatus || 0,
        measuresAndBenefits: createProductDesignDto.measuresAndBenefits || [],
        createdDate: now,
        updatedDate: now,
      };

      const productDesign = new this.productDesignModel(productDesignData);
      const savedProductDesign = await productDesign.save({ session });

      // Insert measures into process_pd_measures
      if (createProductDesignDto.measuresAndBenefits?.length) {
        const measureDocs = [];
        for (const row of createProductDesignDto.measuresAndBenefits) {
          const productDesignMeasureId =
            await this.sequenceHelper.getProductDesignMeasureId();
          measureDocs.push({
            productDesignMeasureId,
            urnNo: createProductDesignDto.urnNo,
            vendorId: vendorObjectId,
            productDesignId,
            measures: row.measuresImplemented,
            benefits: row.benefitsAchieved,
            createdDate: now,
            updatedDate: now,
          });
        }
        if (measureDocs.length) {
          await this.pdMeasureModel.insertMany(measureDocs, { session });
        }
      }

      // Insert uploaded documents into all_product_documents (master table)
      const docRows: Array<{
        subsection: string;
        filePath: string;
        originalName: string;
      }> = [];

      if (ecoVisionFilePath && ecoVisionFile) {
        docRows.push({
          subsection: 'eco_vision_upload',
          filePath: `uploads/${ecoVisionFilePath}`,
          originalName: ecoVisionFile.originalname,
        });
      }
      if (supportingDocumentFilePath && supportingDocumentFile) {
        docRows.push({
          subsection: 'supporting_documents',
          filePath: `uploads/${supportingDocumentFilePath}`,
          originalName: supportingDocumentFile.originalname,
        });
      }

      if (docRows.length) {
        const docsToInsert = [];
        for (const d of docRows) {
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProductDesignDto.urnNo,
            eoiNo,
            documentForm: DocumentSectionKey.PRODUCT_DESIGN,
            documentFormSubsection: d.subsection,
            formPrimaryId: productDesignId,
            documentName: path.basename(d.filePath),
            documentOriginalName: d.originalName,
            documentLink: d.filePath,
            createdDate: now,
            updatedDate: now,
          });
        }
        await this.allProductDocumentModel.insertMany(docsToInsert, {
          session,
        });
      }

      await session.commitTransaction();
      session.endSession();

      return savedProductDesign;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      // Clean up uploaded files if transaction fails (files were moved to URN folder)
      try {
        if (ecoVisionFullPath && fs.existsSync(ecoVisionFullPath)) {
          fs.unlinkSync(ecoVisionFullPath);
        }
        if (
          supportingDocumentFullPath &&
          fs.existsSync(supportingDocumentFullPath)
        ) {
          fs.unlinkSync(supportingDocumentFullPath);
        }
      } catch (cleanupError) {
        // Ignore cleanup errors
        console.warn('File cleanup error:', cleanupError);
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        console.error('Validation error:', error.message);
        throw error;
      }

      // Log the actual error for debugging
      console.error('Product design creation error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error stack:', error.stack);

      // Check for specific error types
      if (
        error.name === 'CastError' ||
        error.message?.includes('Cast to ObjectId')
      ) {
        throw new BadRequestException(
          `Invalid ID format provided: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        error.message ||
          'Failed to create product design. Please check the logs for details.',
      );
    }
  }
}
