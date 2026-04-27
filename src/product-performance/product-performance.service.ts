import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
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

@Injectable()
export class ProductPerformanceService {
  constructor(
    @InjectModel(ProductPerformance.name)
    private productPerformanceModel: Model<ProductPerformanceDocument>,
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
    fileType: 'test_report',
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
   * Create product performance with file uploads
   */
  async createProductPerformance(
    createProductPerformanceDto: CreateProductPerformanceDto,
    vendorId: string,
    testReportFile?: Express.Multer.File,
  ): Promise<ProductPerformanceDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    // Declare file paths outside try block for cleanup in catch
    let testReportFullPath: string | undefined;

    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get next product performance ID
      const processProductPerformanceId =
        await this.sequenceHelper.getProductPerformanceId();

      // Get current date
      const now = new Date();

      // Handle file uploads and set flags
      let testReportFiles = 0;
      let testReportFilePath: string | undefined;
      let storedFileName = '';

      if (testReportFile) {
        testReportFilePath = this.saveFileToUrnFolder(
          testReportFile,
          createProductPerformanceDto.urnNo,
          'test_report',
        );
        testReportFullPath = path.join('uploads', testReportFilePath);
        testReportFiles = 1;
        storedFileName = path.basename(testReportFilePath);
      }

      // Create product performance data
      const productPerformanceData = {
        processProductPerformanceId,
        urnNo: createProductPerformanceDto.urnNo,
        vendorId: vendorObjectId,
        eoiNo: createProductPerformanceDto.eoiNo || '',
        productName: createProductPerformanceDto.productName || '',
        // Store user-provided display name when present; fallback to stored filename if file exists
        testReportFileName:
          createProductPerformanceDto.testReportFileName?.trim() ||
          '' ||
          storedFileName ||
          '',
        testReportFiles,
        renewalType: createProductPerformanceDto.renewalType || 0,
        productPerformanceStatus:
          createProductPerformanceDto.productPerformanceStatus || 0,
        createdDate: now,
        updatedDate: now,
      };

      const productPerformance = new this.productPerformanceModel(
        productPerformanceData,
      );
      const savedProductPerformance = await productPerformance.save({
        session,
      });

      // Insert uploaded document into all_product_documents (master table)
      if (testReportFilePath && testReportFile) {
        const productDocumentId =
          await this.sequenceHelper.getProductDocumentId();
        const documentLink = `uploads/${testReportFilePath}`;

        const documentData = {
          productDocumentId,
          vendorId: vendorObjectId,
          urnNo: createProductPerformanceDto.urnNo,
          eoiNo: createProductPerformanceDto.eoiNo || '',
          documentForm: DocumentSectionKey.PRODUCT_PERFORMANCE,
          documentFormSubsection: 'test_report_files',
          formPrimaryId: processProductPerformanceId,
          documentName: path.basename(testReportFilePath),
          documentOriginalName: testReportFile.originalname,
          documentLink,
          createdDate: now,
          updatedDate: now,
        };

        await this.allProductDocumentModel.create([documentData], { session });
      }

      await session.commitTransaction();
      session.endSession();

      return savedProductPerformance;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      // Clean up uploaded files if transaction fails (files were moved to URN folder)
      try {
        if (testReportFullPath && fs.existsSync(testReportFullPath)) {
          fs.unlinkSync(testReportFullPath);
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
