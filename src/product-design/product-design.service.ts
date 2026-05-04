import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  OnModuleInit,
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
export class ProductDesignService implements OnModuleInit {
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

  async onModuleInit() {
    try {
      await this.productDesignModel.syncIndexes();
      await this.pdMeasureModel.syncIndexes();
    } catch (error) {
      console.error(
        '[product-design] syncIndexes failed (check existing duplicates):',
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
   * Normalize and deduplicate measures rows from multipart payload.
   * This prevents duplicate inserts when clients accidentally append
   * the same measures for each uploaded file.
   */
  private normalizeUniqueMeasures(
    rows?: Array<{ measuresImplemented?: string; benefitsAchieved?: string }>,
  ): Array<{
    measuresImplemented: string;
    benefitsAchieved: string;
    normalizedMeasures: string;
    normalizedBenefits: string;
  }> {
    if (!Array.isArray(rows) || rows.length === 0) return [];

    const seen = new Set<string>();
    const unique: Array<{
      measuresImplemented: string;
      benefitsAchieved: string;
      normalizedMeasures: string;
      normalizedBenefits: string;
    }> = [];

    for (const row of rows) {
      const measuresImplemented = String(row?.measuresImplemented ?? '').trim();
      const benefitsAchieved = String(row?.benefitsAchieved ?? '').trim();
      const normalizedMeasures = measuresImplemented.toLowerCase();
      const normalizedBenefits = benefitsAchieved.toLowerCase();

      // Skip fully empty rows
      if (!measuresImplemented && !benefitsAchieved) continue;

      const key = `${normalizedMeasures}__${normalizedBenefits}`;
      if (seen.has(key)) continue;
      seen.add(key);

      unique.push({
        measuresImplemented,
        benefitsAchieved,
        normalizedMeasures,
        normalizedBenefits,
      });
    }

    return unique;
  }

  private async upsertMeasuresByUrn(params: {
    urnNo: string;
    vendorObjectId: Types.ObjectId;
    effectiveProductDesignId: number;
    normalizedMeasures: Array<{
      measuresImplemented: string;
      benefitsAchieved: string;
      normalizedMeasures: string;
      normalizedBenefits: string;
    }>;
    now: Date;
    session: ClientSession;
  }): Promise<{ inserted: number; skipped: number }> {
    const {
      urnNo,
      vendorObjectId,
      effectiveProductDesignId,
      normalizedMeasures,
      now,
      session,
    } = params;
    if (!normalizedMeasures.length) {
      return { inserted: 0, skipped: 0 };
    }

    const existingRows = await this.pdMeasureModel
      .find({ urnNo }, { normalizedMeasures: 1, normalizedBenefits: 1 })
      .session(session);
    const existingKeys = new Set(
      existingRows.map(
        (row) => `${row.normalizedMeasures}__${row.normalizedBenefits}`,
      ),
    );

    const measureDocs = [];
    for (const row of normalizedMeasures) {
      const key = `${row.normalizedMeasures}__${row.normalizedBenefits}`;
      if (existingKeys.has(key)) continue;

      existingKeys.add(key);
      const productDesignMeasureId =
        await this.sequenceHelper.getProductDesignMeasureId();
      measureDocs.push({
        productDesignMeasureId,
        urnNo,
        vendorId: vendorObjectId,
        productDesignId: effectiveProductDesignId,
        measures: row.measuresImplemented,
        benefits: row.benefitsAchieved,
        normalizedMeasures: row.normalizedMeasures,
        normalizedBenefits: row.normalizedBenefits,
        createdDate: now,
        updatedDate: now,
      });
    }

    if (measureDocs.length) {
      await this.pdMeasureModel.insertMany(measureDocs, { session });
    }

    return {
      inserted: measureDocs.length,
      skipped: normalizedMeasures.length - measureDocs.length,
    };
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
    files?: Express.Multer.File[],
  ): Promise<{
    productDesign: ProductDesignDocument;
    measureStats: { inserted: number; skipped: number };
  }> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Track new files created in this request for rollback cleanup
    let createdFileFullPaths: string[] = [];
    // Track old files to delete only after successful commit
    let oldFileLinksToDeleteAfterCommit: string[] = [];

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get current date
      const now = new Date();
      const normalizedMeasures = this.normalizeUniqueMeasures(
        createProductDesignDto.measuresAndBenefits,
      );
      const uploadedFiles = Array.isArray(files) ? files : [];
      const hasNewUploads = uploadedFiles.length > 0;

      // Fetch EOI no (optional) for master document table
      const productRow = await this.connection
        .collection('products')
        .findOne(
          { urnNo: createProductDesignDto.urnNo, vendorId: vendorObjectId },
          { projection: { eoiNo: 1 } },
        );
      const eoiNo: string | undefined = productRow?.eoiNo;
      const existingProductDesign = await this.productDesignModel
        .findOne({
          urnNo: createProductDesignDto.urnNo,
          vendorId: vendorObjectId,
        })
        .sort({ updatedDate: -1, createdDate: -1, _id: -1 })
        .session(session);

      const productDesignId = await this.sequenceHelper.getProductDesignId();

      // Handle file uploads:
      // - first file -> eco_vision_upload
      // - remaining files -> supporting_documents
      const ecoVisionFile = uploadedFiles[0];
      const supportingDocumentFiles = uploadedFiles.slice(1);

      // Handle file uploads and set flags
      let ecoVisionUpload = existingProductDesign?.ecoVisionUpload ?? 0;
      let ecoVisionFilePath: string | undefined;
      if (ecoVisionFile) {
        ecoVisionFilePath = this.saveFileToUrnFolder(
          ecoVisionFile,
          createProductDesignDto.urnNo,
          'eco_vision',
        );
        createdFileFullPaths.push(path.join('uploads', ecoVisionFilePath));
        ecoVisionUpload = 1;
      }

      let productDesignSupportingDocument =
        existingProductDesign?.productDesignSupportingDocument ?? 0;
      const supportingDocumentFilePaths: string[] = [];
      if (supportingDocumentFiles.length > 0) {
        for (const supportingDocumentFile of supportingDocumentFiles) {
          const supportingDocumentFilePath = this.saveFileToUrnFolder(
            supportingDocumentFile,
            createProductDesignDto.urnNo,
            'supporting_document',
          );
          supportingDocumentFilePaths.push(supportingDocumentFilePath);
          createdFileFullPaths.push(path.join('uploads', supportingDocumentFilePath));
        }
        productDesignSupportingDocument = 1;
      }
      if (hasNewUploads && supportingDocumentFiles.length === 0) {
        // First uploaded file is eco vision; if no remaining files, supporting docs are replaced with none.
        productDesignSupportingDocument = 0;
      }

      // Replace doc entries when new files are uploaded
      if (hasNewUploads) {
        const existingDocs = await this.allProductDocumentModel
          .find({
            vendorId: vendorObjectId,
            urnNo: createProductDesignDto.urnNo,
            documentForm: DocumentSectionKey.PRODUCT_DESIGN,
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

      // Replace master product-design record: remove existing rows, then create fresh.
      await this.productDesignModel.deleteMany(
        {
          urnNo: createProductDesignDto.urnNo,
        },
        { session },
      );

      const productDesignData = {
        productDesignId,
        urnNo: createProductDesignDto.urnNo,
        vendorId: vendorObjectId,
        ecoVisionUpload,
        statergies: createProductDesignDto.statergies,
        productDesignSupportingDocument,
        productDesignStatus: createProductDesignDto.productDesignStatus || 0,
        measuresAndBenefits: normalizedMeasures,
        createdDate: now,
        updatedDate: now,
      };

      const createdProductDesign = new this.productDesignModel(productDesignData);
      const savedProductDesign = await createdProductDesign.save({ session });

      if (!savedProductDesign) {
        throw new InternalServerErrorException(
          'Failed to save product design record',
        );
      }

      const effectiveProductDesignId = savedProductDesign.productDesignId;

      // Idempotent measure upsert by normalized pair per URN.
      // Existing normalized pairs are skipped; only new pairs are inserted.
      const measureStats = await this.upsertMeasuresByUrn({
        urnNo: createProductDesignDto.urnNo,
        vendorObjectId,
        effectiveProductDesignId,
        normalizedMeasures,
        now,
        session,
      });

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
      if (supportingDocumentFilePaths.length > 0) {
        for (let i = 0; i < supportingDocumentFilePaths.length; i++) {
          docRows.push({
            subsection: 'supporting_documents',
            filePath: `uploads/${supportingDocumentFilePaths[i]}`,
            originalName: supportingDocumentFiles[i].originalname,
          });
        }
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
            formPrimaryId: effectiveProductDesignId,
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

      // Delete replaced files only after successful DB commit
      for (const fileLink of oldFileLinksToDeleteAfterCommit) {
        const normalizedPath = String(fileLink).replace(/\\/g, '/');
        if (normalizedPath && fs.existsSync(normalizedPath)) {
          try {
            fs.unlinkSync(normalizedPath);
          } catch {
            // Ignore file cleanup issues after successful commit
          }
        }
      }

      return {
        productDesign: savedProductDesign,
        measureStats,
      };
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
