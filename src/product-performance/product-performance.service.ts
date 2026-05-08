import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import {
  ProductPerformance,
  ProductPerformanceDocument,
} from './schemas/product-performance.schema';
import {
  AllProductDocument,
  AllProductDocumentDocument,
} from '../product-design/schemas/all-product-document.schema';
import { CreateProductPerformanceDto } from './dto/create-product-performance.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../utils/upload-file.util';

@Injectable()
export class ProductPerformanceService implements OnModuleInit {
  constructor(
    @InjectModel(ProductPerformance.name)
    private productPerformanceModel: Model<ProductPerformanceDocument>,
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
      await this.productPerformanceModel.syncIndexes();
    } catch (error) {
      console.error(
        '[product-performance] syncIndexes failed (check existing duplicates):',
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

  private normalizeText(value?: string): string {
    return String(value ?? '').trim().toLowerCase();
  }

  private async saveFileToUrnFolder(
    file: Express.Multer.File,
    urnNo: string,
    fileType: 'test_report',
  ): Promise<{ fileUrl: string; fileName: string }> {
    const uploaded = await uploadFile(file, `urns/${urnNo}`);
    return { fileUrl: uploaded.fileUrl, fileName: uploaded.fileName };
  }

  /**
   * Create product performance with file uploads
   */
  async createProductPerformance(
    createProductPerformanceDto: CreateProductPerformanceDto,
    vendorId: string,
    testReportFilesInput?: Express.Multer.File[],
  ): Promise<ProductPerformanceDocument> {
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
      const normalizedProductName = this.normalizeText(
        createProductPerformanceDto.productName,
      );
      const normalizedTestReportFileName = this.normalizeText(
        createProductPerformanceDto.testReportFileName,
      );

      const existingProductPerformance = await this.productPerformanceModel
        .findOne({
          urnNo: createProductPerformanceDto.urnNo,
          normalizedProductName,
          normalizedTestReportFileName,
        })
        .session(session);

      const processProductPerformanceId =
        existingProductPerformance?.processProductPerformanceId ??
        (await this.sequenceHelper.getProductPerformanceId());

      const uploadedTestReportFiles = Array.isArray(testReportFilesInput)
        ? testReportFilesInput
        : [];

      // Handle file uploads and set flags
      let testReportFiles = existingProductPerformance?.testReportFiles ?? 0;
      const testReportFilePaths: string[] = [];
      const testReportStoredNames: string[] = [];
      let storedFileName = existingProductPerformance?.testReportFileName ?? '';

      if (uploadedTestReportFiles.length > 0) {
        for (const testReportFile of uploadedTestReportFiles) {
          const testReportFilePath = await this.saveFileToUrnFolder(
            testReportFile,
            createProductPerformanceDto.urnNo,
            'test_report',
          );
          testReportFilePaths.push(testReportFilePath.fileUrl);
          testReportStoredNames.push(testReportFilePath.fileName);
        }
        testReportFiles = 1;
        storedFileName = testReportStoredNames[0] || storedFileName;
      }

      // Replace existing performance docs on re-upload
      if (uploadedTestReportFiles.length > 0) {
        const existingDocs = await this.allProductDocumentModel
          .find({
            urnNo: createProductPerformanceDto.urnNo,
            documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE,
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

      const productPerformanceData = {
        urnNo: createProductPerformanceDto.urnNo,
        vendorId: vendorObjectId,
        eoiNo: createProductPerformanceDto.eoiNo || '',
        productName: createProductPerformanceDto.productName || '',
        normalizedProductName,
        // Store user-provided display name when present; fallback to stored filename if file exists
        testReportFileName:
          createProductPerformanceDto.testReportFileName?.trim() ||
          storedFileName ||
          '',
        normalizedTestReportFileName,
        testReportFiles,
        renewalType: createProductPerformanceDto.renewalType || 0,
        productPerformanceStatus:
          createProductPerformanceDto.productPerformanceStatus || 0,
        updatedDate: now,
      };

      const savedProductPerformance = await this.productPerformanceModel
        .findOneAndUpdate(
          {
            urnNo: createProductPerformanceDto.urnNo,
            normalizedProductName,
            normalizedTestReportFileName,
          },
          {
            $set: productPerformanceData,
            $setOnInsert: {
              processProductPerformanceId,
              createdDate: now,
            },
          },
          { upsert: true, new: true, session },
        )
        .exec();

      // Insert uploaded document into all_product_documents (master table)
      if (testReportFilePaths.length > 0) {
        const docsToInsert = [];
        for (let i = 0; i < testReportFilePaths.length; i++) {
          const productDocumentId =
            await this.sequenceHelper.getProductDocumentId();
          const documentLink = testReportFilePaths[i];
          docsToInsert.push({
            productDocumentId,
            vendorId: vendorObjectId,
            urnNo: createProductPerformanceDto.urnNo,
            eoiNo: createProductPerformanceDto.eoiNo || '',
            documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE,
            documentFormSubsection: 'test_report_files',
            formPrimaryId: savedProductPerformance.processProductPerformanceId,
            documentName: testReportStoredNames[i] || storedFileName,
            documentOriginalName: uploadedTestReportFiles[i].originalname,
            documentLink,
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

      return savedProductPerformance;
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
      console.error('Product performance creation error:', error);
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
          'Failed to create product performance. Please check the logs for details.',
      );
    }
  }
}
