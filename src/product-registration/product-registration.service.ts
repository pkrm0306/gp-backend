import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, ClientSession, Connection, Types } from 'mongoose';
import { createHash, randomUUID } from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import ExcelJS from 'exceljs';
import { Product, ProductDocument } from './schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from './schemas/product-plant.schema';
import {
  RegisterProductDto,
  BulkRegisterProductDto,
} from './dto/register-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateUrnStatusDto } from './dto/update-urn-status.dto';
import { AdminUpdateUrnStatusDto } from './dto/admin-update-urn-status.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { AdminListProductsDto } from './dto/admin-list-products.dto';
import { AdminProductsExportDto } from './dto/admin-products-export.dto';
import { SequenceHelper } from './helpers/sequence.helper';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { CountriesService } from '../countries/countries.service';
import { StatesService } from '../states/states.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';

type AdminExportJobStatus = 'queued' | 'processing' | 'completed' | 'failed';
type AdminExportJob = {
  jobId: string;
  status: AdminExportJobStatus;
  progress: number;
  format: 'xlsx' | 'csv';
  includeSheets: Array<'urn_summary' | 'eoi_details'>;
  filtersHash: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
  fileUrl?: string;
  fileName?: string;
  rowCount?: number;
  error?: string;
  requestedBy?: string;
};

@Injectable()
export class ProductRegistrationService {
  private readonly exportJobs = new Map<string, AdminExportJob>();
  private readonly exportDir = join(process.cwd(), 'uploads', 'exports');
  private readonly exportTtlMs = 24 * 60 * 60 * 1000;
  private readonly exportMaxRows = 200000;

  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private productPlantModel: Model<ProductPlantDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
    private manufacturersService: ManufacturersService,
    private countriesService: CountriesService,
    private statesService: StatesService,
    private activityLogService: ActivityLogService,
  ) {}

  private ensureExportDir() {
    if (!existsSync(this.exportDir)) {
      mkdirSync(this.exportDir, { recursive: true });
    }
  }

  private buildPublicFileUrl(fileName: string): string {
    const fromEnv = (process.env.API_BASE_URL ?? '').trim().replace(/\/+$/, '');
    const rel = `/uploads/exports/${fileName}`;
    return fromEnv ? `${fromEnv}${rel}` : rel;
  }

  private cleanupExpiredExportJobs() {
    const now = Date.now();
    for (const [jobId, job] of this.exportJobs.entries()) {
      if (job.expiresAt && job.expiresAt.getTime() < now) {
        this.exportJobs.delete(jobId);
      }
    }
  }

  /**
   * Safely convert string to ObjectId with validation
   */
  private toObjectId(
    id: string | Types.ObjectId,
    fieldName: string,
  ): Types.ObjectId {
    if (!id) {
      throw new BadRequestException(`${fieldName} is required`);
    }

    // If already an ObjectId, return it
    if (id instanceof Types.ObjectId) {
      return id;
    }

    // Convert to string and validate
    const idString = String(id).trim();

    // Check if it's a valid 24-character hex string
    if (!/^[0-9a-fA-F]{24}$/.test(idString)) {
      throw new BadRequestException(
        `Invalid ${fieldName} format. Must be a valid 24-character MongoDB ObjectId.`,
      );
    }

    try {
      return new Types.ObjectId(idString);
    } catch (error) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${idString}`);
    }
  }

  /**
   * Validate country exists
   */
  private async validateCountry(countryId: string): Promise<void> {
    const country = await this.countriesService.findById(countryId);
    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }
  }

  /**
   * Validate state exists and belongs to country
   */
  private async validateState(
    stateId: string,
    countryId: string,
  ): Promise<void> {
    const state = await this.statesService.findById(stateId);
    if (!state) {
      throw new NotFoundException(`State with ID ${stateId} not found`);
    }

    // Get country to check its properties
    const country = await this.countriesService.findById(countryId);
    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    // Check if state belongs to the country using multiple methods:
    // 1. Check countryId (ObjectId) if it exists
    if (state.countryId && state.countryId.toString() === countryId) {
      return; // Valid match
    }

    // 2. Check country_id (integer) if it exists and country has id field
    if (state.country_id && country.id && state.country_id === country.id) {
      return; // Valid match
    }

    // 3. Check country_code if both exist
    const stateCountryCode = (state as any).country_code;
    const countryCode = (country as any).country_code || country.countryCode;
    if (stateCountryCode && countryCode && stateCountryCode === countryCode) {
      return; // Valid match
    }

    // If none of the checks passed, state doesn't belong to country
    throw new BadRequestException(
      `State with ID ${stateId} does not belong to country with ID ${countryId}`,
    );
  }

  /**
   * Map urnStatus to activity name
   * Certification Flow Status Mapping (activity log labels):
   * 0  Proposal Pending
   * 1  Registration Payment
   * 2  Approve Registration Fee
   * 3  Process Form In Progress
   * 4  Process Form Submitted
   * 5  Vendor Response
   * 6  Final Verification
   * 7  Certificate Payment
   * 8  Approve Certificate Fee
   * 9  Payment Rejected
   * 10 Approved Certificate Fee
   * 11 Certificate Published
   *
   * Next-step display: after 4 (or 5) next is 6; after 8 (or 9) next is 10.
   */
  private getActivityName(urnStatus: number): string {
    const activityMap: { [key: number]: string } = {
      0: 'Proposal Pending',
      1: 'Registration Payment',
      2: 'Approve Registration Fee',
      3: 'Process Form In Progress',
      4: 'Process Form Submitted',
      5: 'Vendor Response',
      6: 'Final Verification',
      7: 'Certificate Payment',
      8: 'Approve Certificate Fee',
      9: 'Payment Rejected',
      10: 'Approved Certificate Fee',
      11: 'Certificate Published',
    };
    return activityMap[urnStatus] || 'Unknown Activity';
  }

  /** Next timeline step id: skips 5 after 4, and 9 after 8 (resend paths use 5 / 9). */
  private getNextActivityIdForLog(currentStatus: number): number {
    if (currentStatus >= 11) return 11;
    if (currentStatus === 4) return 6;
    if (currentStatus === 8) return 10;
    return Math.min(currentStatus + 1, 11);
  }

  /** Responsibility owner by status for activity timeline rows. */
  private getResponsibilityForStatus(status: number): 'Admin' | 'Vendor' {
    switch (status) {
      case 0:
      case 2:
      case 6:
      case 8:
      case 9:
      case 10:
      case 11:
        return 'Admin';
      default:
        return 'Vendor';
    }
  }

  /**
   * Get next activity name based on current urnStatus
   */
  private getNextActivityName(urnStatus: number): string {
    return this.getActivityName(this.getNextActivityIdForLog(urnStatus));
  }

  /**
   * Persists one timeline row when `products.urnStatus` advances to `newUrnStatus`.
   * Errors are swallowed so the primary DB operation still succeeds.
   */
  private async tryLogUrnLifecycleStep(
    vendorId: string | Types.ObjectId,
    manufacturerId: string | Types.ObjectId,
    urnNo: string,
    newUrnStatus: number,
  ): Promise<void> {
    try {
      const responsibility = this.getResponsibilityForStatus(newUrnStatus);
      const nextActivityId = this.getNextActivityIdForLog(newUrnStatus);
      const nextResponsibility =
        this.getResponsibilityForStatus(nextActivityId);
      await this.activityLogService.logActivity({
        vendor_id:
          vendorId instanceof Types.ObjectId ? vendorId.toString() : vendorId,
        manufacturer_id:
          manufacturerId instanceof Types.ObjectId
            ? manufacturerId.toString()
            : manufacturerId,
        urn_no: urnNo,
        activities_id: newUrnStatus,
        activity: this.getActivityName(newUrnStatus),
        activity_status: newUrnStatus,
        responsibility,
        next_responsibility: nextResponsibility,
        next_acitivities_id: nextActivityId,
        next_activity:
          nextActivityId <= 11
            ? this.getActivityName(nextActivityId)
            : this.getActivityName(11),
        status: 1,
      });
    } catch (err) {
      console.error('[Activity Log] tryLogUrnLifecycleStep failed:', err);
    }
  }

  /**
   * Generate URN: "URN-" + timestamp in YYYYMMDDHHmmss format
   * Always unique - no validation, no retries needed
   * Example: URN-20260219153022
   */
  private generateURN(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `URN-${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  /**
   * Generate unique EOI: "GP" + manufacturer_initial + 3-digit internal_id + 3-digit manufacturer_product_count
   * Format: GPAB012006
   * - manufacturer_initial: e.g., "AB"
   * - internal_id: Extract number from gpInternalId, pad to 3 digits (e.g., "GP-12" → "012")
   * - manufacturer_product_count: Count existing products for manufacturer + 1, pad to 3 digits (e.g., 6 → "006")
   * Uses manufacturer-specific count only, not global count
   */
  private async generateEOI(
    manufacturerId: string,
    session?: ClientSession,
  ): Promise<string> {
    const useSession = session && session.inTransaction() ? session : undefined;

    // Count existing products for THIS manufacturer only (not global)
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const existingProductCount = await this.productModel
      .countDocuments(
        { manufacturerId: manufacturerObjectId },
        { session: useSession },
      )
      .exec();

    // Calculate next sequence number (existing count + 1)
    const manufacturerProductCount = existingProductCount + 1;

    return await this.generateEOIWithCount(
      manufacturerId,
      manufacturerProductCount,
      session,
    );
  }

  /**
   * Generate EOI with a specific manufacturer product count
   * Format: "GP" + manufacturer_initial + left-pad internal_id to 3 digits + left-pad manufacturer_product_count to 3 digits
   * Example: GPAB012006 (where AB is manufacturer_initial, 012 is internal_id, 006 is manufacturer_product_count)
   * Used for bulk registration where we need to control the sequence
   */
  private async generateEOIWithCount(
    manufacturerId: string,
    manufacturerProductCount: number,
    session?: ClientSession,
  ): Promise<string> {
    // Get manufacturer details
    const manufacturer =
      await this.manufacturersService.findById(manufacturerId);
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    // Get manufacturer initial
    const manufacturerInitial = manufacturer.manufacturerInitial;
    if (!manufacturerInitial || manufacturerInitial.trim() === '') {
      throw new BadRequestException(
        `Manufacturer ${manufacturerId} does not have manufacturerInitial set. Please update the manufacturer record with manufacturerInitial field.`,
      );
    }

    // Extract internal_id from gpInternalId
    // Examples: "GP-12" → "012", "GPSC-312" → "312"
    const gpInternalId = manufacturer.gpInternalId;
    if (!gpInternalId || gpInternalId.trim() === '') {
      throw new BadRequestException(
        `Manufacturer ${manufacturerId} does not have gpInternalId set. Please update the manufacturer record with gpInternalId field (format: "GP-12" or "GPSC-312").`,
      );
    }

    const internalIdMatch = gpInternalId.match(/-(\d+)$/);
    let internalId: string;

    if (internalIdMatch) {
      // Extract the number after the hyphen and pad to 3 digits
      const internalIdNum = internalIdMatch[1];
      internalId = internalIdNum.padStart(3, '0');
    } else {
      // Fallback if no match found
      console.warn(
        `No internal ID pattern found in gpInternalId: ${gpInternalId}, using '000'`,
      );
      internalId = '000';
    }

    // Pad manufacturer_product_count to 3 digits
    const paddedManufacturerProductCount = manufacturerProductCount
      .toString()
      .padStart(3, '0');

    // Generate EOI: GP + manufacturer_initial + 3-digit internal_id + 3-digit manufacturer_product_count
    // Example: GPAB012006
    const eoiNo = `GP${manufacturerInitial}${internalId}${paddedManufacturerProductCount}`;

    return eoiNo;
  }

  /**
   * Register a single product
   * Deterministic URN and EOI generation - no retries needed
   */
  async registerProduct(
    registerProductDto: RegisterProductDto,
    manufacturerId: string,
  ) {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      const session = await this.connection.startSession();
      session.startTransaction();

      try {
        console.log(
          '[Product Registration] Starting registration (attempt ' +
            (retryCount + 1) +
            ')...',
        );
        console.log('[Product Registration] Manufacturer ID:', manufacturerId);
        console.log(
          '[Product Registration] Auth manufacturer ID:',
          manufacturerId,
        );

        // Validate manufacturer ID
        const manufacturerObjectId = this.toObjectId(
          manufacturerId,
          'manufacturerId',
        );
        const vendorObjectId = this.toObjectId(
          manufacturerId,
          'manufacturerId',
        );

        // Generate URN: "URN-" + YmdHis format
        const urnNo = this.generateURN();
        console.log('[Product Registration] Generated URN:', urnNo);

        // Generate EOI: Based on manufacturer-specific product count only
        // Format: GP + manufacturer_initial + left-pad internal_id to 3 digits + left-pad manufacturer_product_count to 3 digits
        console.log('[Product Registration] Generating EOI...');
        const eoiNo = await this.generateEOI(manufacturerId, session);
        console.log('[Product Registration] Generated EOI:', eoiNo);

        // Get next product ID
        const productId = await this.sequenceHelper.getProductId();

        // Get current date
        const now = new Date();

        // Validate and convert category ID
        const categoryObjectId = this.toObjectId(
          registerProductDto.categoryId,
          'categoryId',
        );

        // Create product data with URN and EOI
        const productData = {
          productId,
          categoryId: categoryObjectId,
          vendorId: vendorObjectId,
          manufacturerId: manufacturerObjectId,
          eoiNo,
          urnNo,
          productName: registerProductDto.productName,
          productImage: registerProductDto.productImage,
          plantCount: registerProductDto.plants.length,
          productDetails: registerProductDto.productDetails,
          productType: registerProductDto.productType || 0,
          productStatus: 0,
          productRenewStatus: 0,
          urnStatus: 0,
          createdDate: now,
          updatedDate: now,
        };

        const product = new this.productModel(productData);
        const savedProduct = await product.save({ session });

        // Insert plants
        const plants = [];
        for (const plantDto of registerProductDto.plants) {
          const productPlantId = await this.sequenceHelper.getProductPlantId();

          // Validate and convert plant country ID
          const plantCountryObjectId = this.toObjectId(
            plantDto.countryId,
            'countryId',
          );
          await this.validateCountry(plantDto.countryId);

          // Validate and convert plant state ID
          const plantStateObjectId = this.toObjectId(
            plantDto.stateId,
            'stateId',
          );
          await this.validateState(plantDto.stateId, plantDto.countryId);

          const plantData = {
            productPlantId,
            productId: savedProduct._id,
            vendorId: vendorObjectId,
            categoryId: categoryObjectId,
            manufacturerId: manufacturerObjectId,
            countryId: plantCountryObjectId,
            stateId: plantStateObjectId,
            urnNo,
            eoiNo,
            plantName: plantDto.plantName,
            plantLocation: plantDto.plantLocation,
            city: plantDto.city,
            plantStatus: 1,
            createdDate: now,
          };

          const plant = new this.productPlantModel(plantData);
          const savedPlant = await plant.save({ session });
          plants.push(savedPlant);
        }

        await session.commitTransaction();
        session.endSession();

        // Log activity after successful product registration
        // urnStatus is 0 (Proposal Pending), next step is 1 (Registration Payment)
        try {
          await this.activityLogService.logActivity({
            vendor_id: manufacturerId,
            manufacturer_id: manufacturerId,
            urn_no: urnNo,
            activities_id: 0, // Current urnStatus
            activity: this.getActivityName(0), // "Proposal Pending"
            activity_status: 0,
            responsibility: this.getResponsibilityForStatus(0),
            next_responsibility: this.getResponsibilityForStatus(1),
            next_acitivities_id: 1,
            next_activity: this.getNextActivityName(0),
            status: 1,
          });
        } catch (activityLogError: any) {
          // Log error but don't fail the product registration
          console.error(
            '[Product Registration] Failed to log activity:',
            activityLogError,
          );
        }

        return {
          ...savedProduct.toObject(),
          plants: plants.map((p) => p.toObject()),
        };
      } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        // For validation errors, throw immediately with detailed message
        if (
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          console.error('Validation error:', error.message);
          throw error;
        }

        // Check for duplicate key error (11000) - retry with new URN/EOI
        if (
          error.code === 11000 ||
          (error.name === 'MongoServerError' &&
            error.message?.includes('duplicate'))
        ) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.warn(
              `[Product Registration] Duplicate URN/EOI detected. Retry ${retryCount}/${maxRetries}...`,
            );
            // Wait a bit before retry (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, 100 * retryCount),
            );
            continue; // Retry the while loop
          } else {
            throw new InternalServerErrorException(
              'Failed to register product after multiple attempts due to duplicate URN or EOI. Please try again.',
            );
          }
        }

        // Log the actual error for debugging
        console.error('Product registration error:', error);
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

        // Return more detailed error message
        const errorMessage = error.message || 'Failed to register product';
        console.error(
          'Throwing InternalServerErrorException with message:',
          errorMessage,
        );
        throw new InternalServerErrorException(
          `${errorMessage}. Check server logs for details.`,
        );
      }
    }

    // Should never reach here, but just in case
    throw new InternalServerErrorException(
      'Failed to register product after all retry attempts.',
    );
  }

  /**
   * Register multiple products (bulk)
   * - ONE URN for all products in the bulk upload
   * - Individual EOI per product based on manufacturer-specific count
   */
  async registerBulkProducts(
    bulkRegisterProductDto: BulkRegisterProductDto,
    manufacturerId: string,
  ) {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      const session = await this.connection.startSession();
      session.startTransaction();

      try {
        console.log(
          '[Bulk Product Registration] Starting bulk registration (attempt ' +
            (retryCount + 1) +
            ')...',
        );
        console.log(
          '[Bulk Product Registration] Manufacturer ID:',
          manufacturerId,
        );
        console.log(
          '[Bulk Product Registration] Auth manufacturer ID:',
          manufacturerId,
        );
        console.log(
          '[Bulk Product Registration] Number of products:',
          bulkRegisterProductDto.products.length,
        );

        // Validate manufacturer ID
        const manufacturerObjectId = this.toObjectId(
          manufacturerId,
          'manufacturerId',
        );
        const vendorObjectId = this.toObjectId(
          manufacturerId,
          'manufacturerId',
        );

        // Generate ONE URN for all products in bulk
        const urnNo = this.generateURN();
        console.log(
          '[Bulk Product Registration] Generated single URN for all products:',
          urnNo,
        );

        // Get initial manufacturer-specific product count (before inserting any products)
        const initialManufacturerProductCount = await this.productModel
          .countDocuments({ manufacturerId: manufacturerObjectId }, { session })
          .exec();

        console.log(
          '[Bulk Product Registration] Initial manufacturer product count:',
          initialManufacturerProductCount,
        );

        const results = [];

        // Process each product in the bulk upload
        for (let i = 0; i < bulkRegisterProductDto.products.length; i++) {
          const registerProductDto = bulkRegisterProductDto.products[i];

          // Calculate manufacturer_product_count for this product
          // Start from initial count + 1, then increment for each subsequent product
          const manufacturerProductCount =
            initialManufacturerProductCount + i + 1;

          // Generate EOI: Individual EOI per product using manufacturer-specific count
          const eoiNo = await this.generateEOIWithCount(
            manufacturerId,
            manufacturerProductCount,
            session,
          );
          console.log(
            `[Bulk Product Registration] Product ${i + 1}/${bulkRegisterProductDto.products.length} - EOI: ${eoiNo}, Manufacturer Product Count: ${manufacturerProductCount}`,
          );

          // Get next product ID
          const productId = await this.sequenceHelper.getProductId();

          // Get current date
          const now = new Date();

          // Validate and convert category ID
          const categoryObjectId = this.toObjectId(
            registerProductDto.categoryId,
            'categoryId',
          );

          // Create product data with URN and EOI
          const productData = {
            productId,
            categoryId: categoryObjectId,
            vendorId: vendorObjectId,
            manufacturerId: manufacturerObjectId,
            eoiNo,
            urnNo,
            productName: registerProductDto.productName,
            productImage: registerProductDto.productImage,
            plantCount: registerProductDto.plants.length,
            productDetails: registerProductDto.productDetails,
            productType: registerProductDto.productType || 0,
            productStatus: 0,
            productRenewStatus: 0,
            urnStatus: 0,
            createdDate: now,
            updatedDate: now,
          };

          const product = new this.productModel(productData);
          const savedProduct = await product.save({ session });

          // Insert plants
          const plants = [];
          for (const plantDto of registerProductDto.plants) {
            const productPlantId =
              await this.sequenceHelper.getProductPlantId();

            // Validate and convert plant country ID
            const plantCountryObjectId = this.toObjectId(
              plantDto.countryId,
              'countryId',
            );
            await this.validateCountry(plantDto.countryId);

            // Validate and convert plant state ID
            const plantStateObjectId = this.toObjectId(
              plantDto.stateId,
              'stateId',
            );
            await this.validateState(plantDto.stateId, plantDto.countryId);

            const plantData = {
              productPlantId,
              productId: savedProduct._id,
              vendorId: vendorObjectId,
              categoryId: categoryObjectId,
              manufacturerId: manufacturerObjectId,
              countryId: plantCountryObjectId,
              stateId: plantStateObjectId,
              urnNo,
              eoiNo,
              plantName: plantDto.plantName,
              plantLocation: plantDto.plantLocation,
              city: plantDto.city,
              plantStatus: 1,
              createdDate: now,
            };

            const plant = new this.productPlantModel(plantData);
            const savedPlant = await plant.save({ session });
            plants.push(savedPlant);
          }

          results.push({
            ...savedProduct.toObject(),
            plants: plants.map((p) => p.toObject()),
          });
        }

        await session.commitTransaction();
        session.endSession();

        // Log activity after successful bulk product registration
        // urnStatus is 0 (Proposal Pending), next step is 1 (Registration Payment)
        try {
          await this.activityLogService.logActivity({
            vendor_id: manufacturerId,
            manufacturer_id: manufacturerId,
            urn_no: urnNo,
            activities_id: 0, // Current urnStatus
            activity: this.getActivityName(0), // "Proposal Pending"
            activity_status: 0,
            responsibility: this.getResponsibilityForStatus(0),
            next_responsibility: this.getResponsibilityForStatus(1),
            next_acitivities_id: 1,
            next_activity: this.getNextActivityName(0),
            status: 1,
          });
        } catch (activityLogError: any) {
          // Log error but don't fail the bulk product registration
          console.error(
            '[Bulk Product Registration] Failed to log activity:',
            activityLogError,
          );
        }

        console.log(
          '[Bulk Product Registration] Successfully registered',
          results.length,
          'products',
        );
        return results;
      } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        // For validation errors, throw immediately
        if (
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        ) {
          console.error('Validation error:', error.message);
          throw error;
        }

        // Check for duplicate key error (11000) - retry with new URN/EOI
        if (
          error.code === 11000 ||
          (error.name === 'MongoServerError' &&
            error.message?.includes('duplicate'))
        ) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.warn(
              `[Bulk Product Registration] Duplicate URN/EOI detected. Retry ${retryCount}/${maxRetries}...`,
            );
            // Wait a bit before retry (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, 100 * retryCount),
            );
            continue; // Retry the while loop
          } else {
            throw new InternalServerErrorException(
              'Failed to register bulk products after multiple attempts due to duplicate URN or EOI. Please try again.',
            );
          }
        }

        // Log the actual error for debugging
        console.error('Bulk product registration error:', error);
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

        // Return more detailed error message
        const errorMessage =
          error.message || 'Failed to register bulk products';
        console.error(
          'Throwing InternalServerErrorException with message:',
          errorMessage,
        );
        throw new InternalServerErrorException(
          `${errorMessage}. Check server logs for details.`,
        );
      }
    }

    // Should never reach here, but just in case
    throw new InternalServerErrorException(
      'Failed to register bulk products after all retry attempts.',
    );
  }

  /**
   * Update a product
   * If productName changes, regenerate URN and EOI
   */
  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Convert productId to ObjectId
      const productObjectId = this.toObjectId(productId, 'productId');

      // Fetch existing product
      const existingProduct = await this.productModel
        .findById(productObjectId)
        .session(session)
        .exec();

      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }

      const previousUrnStatus = existingProduct.urnStatus;

      // Check if productName has changed
      const productNameChanged =
        updateProductDto.productName !== undefined &&
        updateProductDto.productName !== existingProduct.productName;

      const updateData: any = {
        updatedDate: new Date(),
      };

      // If productName changed, regenerate URN and EOI
      if (productNameChanged) {
        // Get manufacturer ID from existing product
        const manufacturerId = existingProduct.manufacturerId.toString();

        // Generate new URN: "URN-" + YmdHis format
        const newUrnNo = this.generateURN();

        // Generate new EOI: "GP" + manufacturer_initial + 3-digit internal_id + 3-digit sequence
        const newEoiNo = await this.generateEOI(manufacturerId, session);

        updateData.urnNo = newUrnNo;
        updateData.eoiNo = newEoiNo;
      }

      // Update other fields if provided
      if (updateProductDto.productName !== undefined) {
        updateData.productName = updateProductDto.productName;
      }

      if (updateProductDto.productImage !== undefined) {
        updateData.productImage = updateProductDto.productImage;
      }

      if (updateProductDto.productDetails !== undefined) {
        updateData.productDetails = updateProductDto.productDetails;
      }

      if (updateProductDto.productType !== undefined) {
        updateData.productType = updateProductDto.productType;
      }

      if (updateProductDto.productStatus !== undefined) {
        updateData.productStatus = updateProductDto.productStatus;
      }

      if (updateProductDto.productRenewStatus !== undefined) {
        updateData.productRenewStatus = updateProductDto.productRenewStatus;
      }

      if (updateProductDto.urnStatus !== undefined) {
        updateData.urnStatus = updateProductDto.urnStatus;
      }

      if (updateProductDto.assessmentReportUrl !== undefined) {
        updateData.assessmentReportUrl = updateProductDto.assessmentReportUrl;
      }

      if (updateProductDto.rejectedDetails !== undefined) {
        updateData.rejectedDetails = updateProductDto.rejectedDetails;
      }

      if (updateProductDto.certifiedDate !== undefined) {
        updateData.certifiedDate = new Date(updateProductDto.certifiedDate);
      }

      if (updateProductDto.validtillDate !== undefined) {
        updateData.validtillDate = new Date(updateProductDto.validtillDate);
      }

      if (updateProductDto.firstNotifyDate !== undefined) {
        updateData.firstNotifyDate = new Date(updateProductDto.firstNotifyDate);
      }

      if (updateProductDto.secondNotifyDate !== undefined) {
        updateData.secondNotifyDate = new Date(
          updateProductDto.secondNotifyDate,
        );
      }

      if (updateProductDto.thirdNotifyDate !== undefined) {
        updateData.thirdNotifyDate = new Date(updateProductDto.thirdNotifyDate);
      }

      if (updateProductDto.renewedDate !== undefined) {
        updateData.renewedDate = new Date(updateProductDto.renewedDate);
      }

      // Update product
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(productObjectId, updateData, { new: true, session })
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException('Product not found after update');
      }

      await session.commitTransaction();
      session.endSession();

      if (
        updateProductDto.urnStatus !== undefined &&
        updatedProduct.urnStatus !== previousUrnStatus
      ) {
        await this.tryLogUrnLifecycleStep(
          existingProduct.vendorId,
          existingProduct.manufacturerId,
          updatedProduct.urnNo,
          updatedProduct.urnStatus,
        );
      }

      return updatedProduct.toObject();
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Log the actual error for debugging
      console.error('Product update error:', error);
      console.error('Error stack:', error.stack);

      // Check for specific error types
      if (
        error.name === 'CastError' ||
        error.message?.includes('Cast to ObjectId')
      ) {
        throw new BadRequestException('Invalid product ID format');
      }

      throw new InternalServerErrorException(
        error.message ||
          'Failed to update product. Please check the logs for details.',
      );
    }
  }

  /**
   * Update URN status for a product
   * Updates products table where vendorId and urnNo match, sets urnStatus to updateStatusTo
   * Also logs activity for the status change
   */
  async updateUrnStatus(
    updateUrnStatusDto: UpdateUrnStatusDto,
    manufacturerId: string,
  ): Promise<ProductDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Resolve from authenticated manufacturer
      const vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');

      // Find product by authenticated manufacturer(vendor alias) and urnNo
      const existingProduct = await this.productModel
        .findOne({
          vendorId: vendorObjectId,
          urnNo: updateUrnStatusDto.urnNo,
        })
        .session(session)
        .exec();

      if (!existingProduct) {
        throw new NotFoundException(
          `Product not found with manufacturerId: ${manufacturerId} and urnNo: ${updateUrnStatusDto.urnNo}`,
        );
      }

      // Update urnStatus
      const updatedProduct = await this.productModel
        .findOneAndUpdate(
          {
            vendorId: vendorObjectId,
            urnNo: updateUrnStatusDto.urnNo,
          },
          {
            $set: {
              urnStatus: updateUrnStatusDto.updateStatusTo,
              updatedDate: new Date(),
            },
          },
          { new: true, session },
        )
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException('Product not found after update');
      }

      await session.commitTransaction();
      session.endSession();

      await this.tryLogUrnLifecycleStep(
        vendorObjectId,
        existingProduct.manufacturerId,
        updateUrnStatusDto.urnNo,
        updateUrnStatusDto.updateStatusTo,
      );

      return updatedProduct;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('[Update URN Status] Error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to update URN status',
      );
    }
  }

  /**
   * Admin path: update either `urnStatus` or `productStatus` for all products under one URN.
   * `updateStatusType`: `urn_status` | `product_status`.
   */
  async adminUpdateUrnStatus(
    dto: AdminUpdateUrnStatusDto,
  ): Promise<{ urnNo: string; urnStatus?: number; productStatus?: number }> {
    const urnNo = dto.urnNo.trim();
    if (!urnNo) {
      throw new BadRequestException('urnNo is required');
    }

    const products = await this.productModel.find({ urnNo }).lean().exec();
    if (!products.length) {
      throw new NotFoundException(`No product found for URN: ${urnNo}`);
    }
    if (dto.updateStatusType === 'urn_status') {
      if (dto.updateStatusTo < 0 || dto.updateStatusTo > 11) {
        throw new BadRequestException(
          'updateStatusTo must be between 0 and 11 for urn_status',
        );
      }
    } else if (dto.updateStatusType === 'product_status') {
      if (dto.updateStatusTo < 0 || dto.updateStatusTo > 3) {
        throw new BadRequestException(
          'updateStatusTo must be between 0 and 3 for product_status',
        );
      }
    }

    const now = new Date();
    const vendorId = products[0].vendorId;
    const manufacturerId = products[0].manufacturerId;

    const setDoc: Record<string, unknown> = { updatedDate: now };
    if (dto.updateStatusType === 'urn_status') {
      setDoc.urnStatus = dto.updateStatusTo;
    } else {
      setDoc.productStatus = dto.updateStatusTo;
    }

    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      await this.productModel
        .updateMany({ urnNo }, { $set: setDoc }, { session })
        .exec();
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    if (dto.updateStatusType === 'urn_status') {
      await this.tryLogUrnLifecycleStep(
        vendorId,
        manufacturerId,
        urnNo,
        dto.updateStatusTo,
      );
      return { urnNo, urnStatus: dto.updateStatusTo };
    }
    return { urnNo, productStatus: dto.updateStatusTo };
  }

  /**
   * List all products with pagination, search, filtering, and sorting
   * Filtered by vendorId from authenticated user
   */
  async listProducts(listProductsDto: ListProductsDto, manufacturerId: string) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        productStatus,
        status,
        sort = 'desc',
      } = listProductsDto;

      const skip = (page - 1) * limit;
      const sortOrder = sort === 'asc' ? 1 : -1;

      // Resolve vendor alias using authenticated manufacturerId
      const vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');

      // Build initial match conditions
      const initialMatchConditions: any = {
        vendorId: vendorObjectId, // Always filter by vendorId
      };

      // Status filter
      const normalizedProductStatus = productStatus ?? status;
      if (
        normalizedProductStatus !== undefined &&
        normalizedProductStatus !== null
      ) {
        initialMatchConditions.productStatus = normalizedProductStatus;
      }

      // Aggregation pipeline
      const pipeline: any[] = [];

      // Stage 1: Initial $match for status (before lookup to optimize)
      if (Object.keys(initialMatchConditions).length > 0) {
        pipeline.push({ $match: initialMatchConditions });
      }

      // Stage 2: $lookup category by categoryId
      // Convert categoryId to ObjectId for proper matching
      pipeline.push({
        $lookup: {
          from: 'categories',
          let: { categoryId: '$categoryId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$categoryId'],
                },
              },
            },
          ],
          as: 'category',
        },
      });

      // Stage 3: $unwind category (convert array to object)
      pipeline.push({
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      });

      // Stage 4: $match for global search (after lookup to include category name)
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(
          search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        );
        pipeline.push({
          $match: {
            $or: [
              { productName: searchRegex },
              { eoiNo: searchRegex },
              { urnNo: searchRegex },
              { 'category.categoryName': searchRegex },
              { 'category.category_name': searchRegex },
            ],
          },
        });
      }

      // Stage 5: $project formatted result
      // Check both camelCase (categoryName) and snake_case (category_name) field names
      pipeline.push({
        $project: {
          eoiNo: 1,
          urnNo: 1,
          productName: 1,
          productDetails: 1,
          addedOn: '$createdDate',
          category: {
            _id: { $ifNull: ['$category._id', null] },
            categoryName: {
              $cond: {
                if: { $ne: ['$category', null] },
                then: {
                  $ifNull: [
                    '$category.categoryName',
                    { $ifNull: ['$category.category_name', null] },
                  ],
                },
                else: null,
              },
            },
            categoryCode: {
              $cond: {
                if: { $ne: ['$category', null] },
                then: {
                  $ifNull: [
                    '$category.categoryCode',
                    { $ifNull: ['$category.category_code', null] },
                  ],
                },
                else: null,
              },
            },
          },
          hpUnits: '$plantCount',
          status: '$productStatus',
        },
      });

      // Stage 6: Sort by created_date
      pipeline.push({
        $sort: { addedOn: sortOrder },
      });

      // Stage 7: Use $facet for pagination and total count
      pipeline.push({
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      });

      // Execute aggregation
      const result = await this.productModel.aggregate(pipeline).exec();

      // Extract data and total count
      const data = result[0]?.data || [];
      const totalCount = result[0]?.totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      // Debug: Log first result to check category data
      if (data.length > 0 && !data[0].category?.categoryName) {
        console.log(
          '[List Products] Category lookup debug - First product category:',
          JSON.stringify(data[0].category, null, 2),
        );
        console.log(
          '[List Products] Category ID from product:',
          data[0].category?._id,
        );
      }

      return {
        data,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      };
    } catch (error: any) {
      console.error('[List Products] Error:', error);
      console.error('[List Products] Error stack:', error.stack);
      throw new InternalServerErrorException(
        error.message ||
          'Failed to list products. Please check the logs for details.',
      );
    }
  }

  /**
   * List products eligible for renewal
   * Conditions:
   * - product_status = 2 (Certified)
   * - vendor_id = logged-in vendor
   * - validtill_date < (current_date + 60 days)
   */
  async getRenewList(manufacturerId: string) {
    try {
      // Resolve vendor alias using authenticated manufacturerId
      const vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');

      // Calculate date threshold: current date + 60 days
      const currentDate = new Date();
      const thresholdDate = new Date(currentDate);
      thresholdDate.setDate(thresholdDate.getDate() + 60);

      // Aggregation pipeline
      const pipeline: any[] = [];

      // Stage 1: $match - Filter by vendorId, productStatus = 2, and validtillDate < threshold
      pipeline.push({
        $match: {
          vendorId: vendorObjectId,
          productStatus: 2, // Certified
          validtillDate: {
            $exists: true,
            $ne: null,
            $lt: thresholdDate, // validtillDate < (current_date + 60 days)
          },
        },
      });

      // Stage 2: $lookup category by categoryId
      pipeline.push({
        $lookup: {
          from: 'categories',
          let: { categoryId: '$categoryId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$categoryId'],
                },
              },
            },
          ],
          as: 'category',
        },
      });

      // Stage 3: $unwind category (convert array to object)
      pipeline.push({
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      });

      // Stage 4: Sort by createdDate DESC (before projection to use original field name)
      pipeline.push({
        $sort: { createdDate: -1 },
      });

      // Stage 5: $project - Select only required fields with snake_case naming
      pipeline.push({
        $project: {
          _id: 0,
          product_id: '$productId',
          eoi_no: '$eoiNo',
          urn_no: '$urnNo',
          product_name: '$productName',
          category_name: {
            $cond: {
              if: { $ne: ['$category', null] },
              then: {
                $ifNull: [
                  '$category.categoryName',
                  { $ifNull: ['$category.category_name', null] },
                ],
              },
              else: null,
            },
          },
          validtill_date: '$validtillDate',
          product_status: '$productStatus',
          created_date: '$createdDate',
        },
      });

      // Execute aggregation
      const data = await this.productModel.aggregate(pipeline).exec();

      return data;
    } catch (error: any) {
      console.error('[Get Renew List] Error:', error);
      console.error('[Get Renew List] Error stack:', error.stack);
      throw new InternalServerErrorException(
        error.message ||
          'Failed to get renew list. Please check the logs for details.',
      );
    }
  }

  /**
   * Get complete product details by URN number
   * Includes related data from categories, manufacturers, vendors, product_plants, and payment_details
   */
  async getProductDetailsByUrn(urnNo: string) {
    try {
      if (!urnNo || urnNo.trim() === '') {
        throw new BadRequestException('URN number is required');
      }

      // Aggregation pipeline
      const pipeline: any[] = [];

      // Stage 1: $match - Filter by urnNo
      pipeline.push({
        $match: {
          urnNo: urnNo.trim(),
        },
      });

      // Stage 2: $lookup - Join with categories collection
      pipeline.push({
        $lookup: {
          from: 'categories',
          let: { categoryId: '$categoryId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$categoryId'],
                },
              },
            },
          ],
          as: 'category',
        },
      });

      // Stage 3: $lookup - Join with manufacturers collection
      pipeline.push({
        $lookup: {
          from: 'manufacturers',
          let: { manufacturerId: '$manufacturerId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$manufacturerId'],
                },
              },
            },
          ],
          as: 'manufacturer',
        },
      });

      // Stage 4: $lookup - Join with vendors collection
      pipeline.push({
        $lookup: {
          from: 'vendors',
          let: { vendorId: '$vendorId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$vendorId'],
                },
              },
            },
          ],
          as: 'vendor',
        },
      });

      // Stage 5: $lookup - Join with product_plants collection
      pipeline.push({
        $lookup: {
          from: 'product_plants',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$productId', '$$productId'],
                },
              },
            },
          ],
          as: 'plants',
        },
      });

      // Stage 6: $lookup - Join with payment_details collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'payment_details',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
          ],
          as: 'payments',
        },
      });

      // Stage 7: $lookup - Join with process_product_design collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_product_design',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
          ],
          as: 'product_design',
        },
      });

      // Stage 8: $lookup - Join with process_pd_measures collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_pd_measures',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
            { $sort: { productDesignMeasureId: 1 } },
          ],
          as: 'product_design_measures',
        },
      });

      // Stage 9: $lookup - Join with all_product_documents (only product_design docs for this urn)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $eq: ['$documentForm', DocumentSectionKey.PRODUCT_DESIGN] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { productDocumentId: -1 } },
          ],
          as: 'product_design_documents',
        },
      });

      // Stage 10: $lookup - Join with process_product_performance collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_product_performance',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
          ],
          as: 'product_performance',
        },
      });

      // Stage 11: $lookup - Join with all_product_documents (only product_performance docs for this urn)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $eq: ['$documentForm', DocumentSectionKey.PRODUCT_PERFORMANCE] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { productDocumentId: -1 } },
          ],
          as: 'product_performance_documents',
        },
      });

      // Stage 12: $lookup - Join with raw_materials_hazardous_products collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'raw_materials_hazardous_products',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
            { $sort: { createdDate: 1 } },
          ],
          as: 'raw_materials_hazardous_products',
        },
      });

      // Stage 13: $lookup - Join with all_product_documents (only raw_materials_hazardous_products docs for this urn)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $eq: ['$documentForm', DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { productDocumentId: -1 } },
          ],
          as: 'raw_materials_hazardous_products_documents',
        },
      });

      // Stage 13A+: $lookup - Join raw-materials collections (by urn_no + vendor_id)
      const rawMaterialsCollections = [
        'raw_materials_additives',
        'raw_materials_elimination_of_formaldehyde',
        'raw_materials_elimination_of_prohibited_flame',
        'raw_materials_elimination_of_prohibited_flame_solvents',
        'raw_materials_elimination_of_prohibited_flame_solvents_products',
        'raw_materials_green_supply',
        'raw_materials_hazardous',
        'raw_materials_optimization_of_raw_mix',
        'raw_materials_rapidly_renewable_materials',
        'raw_materials_recovery',
        'raw_materials_recycled_content',
        'raw_materials_reduce_environmental',
        'raw_materials_regional_materials',
        'raw_materials_utilization',
        'raw_materials_utilization_manufacturing_units',
        'raw_materials_utilization_rmc',
      ];

      for (const collectionName of rawMaterialsCollections) {
        pipeline.push({
          $lookup: {
            from: collectionName,
            let: { urnNo: '$urnNo', vendorId: '$vendorId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$urnNo', '$$urnNo'] },
                      { $eq: ['$vendorId', '$$vendorId'] },
                    ],
                  },
                },
              },
              { $sort: { createdDate: 1 } },
            ],
            as: collectionName,
          },
        });
      }

      // Stage 13B: $lookup - Join with all_product_documents (bucket for raw-materials section docs)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    {
                      $in: [
                        '$documentForm',
                        [
                          DocumentSectionKey.RAW_MATERIALS_RECYCLED_CONTENT,
                          DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
                          DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS,
                          DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
                          DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY,
                          DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
                          DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
                          DocumentSectionKey.RAW_MATERIALS_ALTERNATIVE_RAW_MATERIALS,
                          DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION,
                          DocumentSectionKey.RAW_MATERIALS_ADDITIVES,
                          DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
                          DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
                          DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL,
                          DocumentSectionKey.RAW_MATERIALS_RECOVERY,
                          DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
                          DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES,
                        ],
                      ],
                    },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { productDocumentId: -1 } },
          ],
          as: 'raw_materials_documents_bucket',
        },
      });

      // Stage 14: $lookup - Join with process_manufacturing collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_manufacturing',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
          ],
          as: 'process_manufacturing',
        },
      });

      // Stage 15: $lookup - Join with all_product_documents (only process_manufacturing docs for this urn)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $eq: ['$documentForm', DocumentSectionKey.PROCESS_MANUFACTURING] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { productDocumentId: -1 } },
          ],
          as: 'process_manufacturing_documents',
        },
      });

      // Stage 16: $lookup - Join with process_mp_manufacturing_units collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_mp_manufacturing_units',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
            { $sort: { processMpManufacturingUnitId: 1 } },
          ],
          as: 'process_mp_manufacturing_units',
        },
      });

      // Stage 17: $lookup - Join with process_waste_management collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_waste_management',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
          ],
          as: 'process_waste_management',
        },
      });

      // Stage 18: $lookup - Join with all_product_documents (only process_waste_management docs for this urn)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $eq: ['$documentForm', DocumentSectionKey.PROCESS_WASTE_MANAGEMENT] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { productDocumentId: -1 } },
          ],
          as: 'process_waste_management_documents',
        },
      });

      // Stage 19: $lookup - Join with process_wm_manufacturing_units collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_wm_manufacturing_units',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
            { $sort: { processWmManufacturingUnitId: 1 } },
          ],
          as: 'process_wm_manufacturing_units',
        },
      });

      // Stage 20: $lookup - Join with process_life_cycle_approach collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_life_cycle_approach',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
          ],
          as: 'process_life_cycle_approach',
        },
      });

      // Stage 21: $lookup - Join with all_product_documents (only process_life_cycle_approach docs for this urn)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $eq: ['$documentForm', DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { productDocumentId: -1 } },
          ],
          as: 'process_life_cycle_approach_documents',
        },
      });

      // Stage 22: $lookup - Join with process_product_stewardship collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_product_stewardship',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
          ],
          as: 'process_product_stewardship',
        },
      });

      // Stage 23: $lookup - Join with all_product_documents (only process_product_stewardship docs for this urn)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $eq: ['$documentForm', DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { productDocumentId: -1 } },
          ],
          as: 'process_product_stewardship_documents',
        },
      });

      // Stage 24: $lookup - Join with process_innovation collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_innovation',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$urnNo', '$$urnNo'],
                },
              },
            },
          ],
          as: 'process_innovation',
        },
      });

      // Stage 25: $lookup - Join with all_product_documents (only process_innovation docs for this urn)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $eq: ['$documentForm', DocumentSectionKey.PROCESS_INNOVATION] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { productDocumentId: -1 } },
          ],
          as: 'process_innovation_documents',
        },
      });

      // Stage 26: $lookup - Join with process_comments collection (by urn_no)
      pipeline.push({
        $lookup: {
          from: 'process_comments',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    { $rtrim: { input: { $toString: '$urnNo' }, chars: '/' } },
                    { $rtrim: { input: { $toString: '$$urnNo' }, chars: '/' } },
                  ],
                },
              },
            },
            { $sort: { processCommentsId: -1 } },
          ],
          as: 'process_comments',
        },
      });

      // Stage 27: $project - Format the response structure
      pipeline.push({
        $project: {
          _id: 1,
          productId: 1,
          eoiNo: 1,
          urnNo: 1,
          productName: 1,
          productImage: 1,
          plantCount: 1,
          productDetails: 1,
          productType: 1,
          productStatus: 1,
          productRenewStatus: 1,
          renewedDate: 1,
          urnStatus: 1,
          assessmentReportUrl: 1,
          rejectedDetails: 1,
          certifiedDate: 1,
          validtillDate: 1,
          firstNotifyDate: 1,
          secondNotifyDate: 1,
          thirdNotifyDate: 1,
          createdDate: 1,
          updatedDate: 1,
          category: {
            $cond: {
              if: { $gt: [{ $size: '$category' }, 0] },
              then: { $arrayElemAt: ['$category', 0] },
              else: null,
            },
          },
          manufacturer: {
            $cond: {
              if: { $gt: [{ $size: '$manufacturer' }, 0] },
              then: { $arrayElemAt: ['$manufacturer', 0] },
              else: null,
            },
          },
          vendor: {
            $cond: {
              if: { $gt: [{ $size: '$vendor' }, 0] },
              then: { $arrayElemAt: ['$vendor', 0] },
              else: null,
            },
          },
          plants: 1,
          payments: 1,
          product_design: {
            $cond: {
              if: { $gt: [{ $size: '$product_design' }, 0] },
              then: { $arrayElemAt: ['$product_design', 0] },
              else: null,
            },
          },
          product_design_measures: 1,
          product_design_documents: 1,
          product_performance: {
            $cond: {
              if: { $gt: [{ $size: '$product_performance' }, 0] },
              then: { $arrayElemAt: ['$product_performance', 0] },
              else: null,
            },
          },
          product_performance_documents: 1,
          raw_materials_hazardous_products: 1,
          raw_materials_hazardous_products_documents: 1,
          raw_materials_additives: 1,
          raw_materials_additives_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: ['$$doc.documentForm', DocumentSectionKey.RAW_MATERIALS_ADDITIVES],
              },
            },
          },
          raw_materials_alternative_raw_materials_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: [
                  '$$doc.documentForm',
                  DocumentSectionKey.RAW_MATERIALS_ALTERNATIVE_RAW_MATERIALS,
                ],
              },
            },
          },
          raw_materials_elimination_of_formaldehyde: 1,
          raw_materials_elimination_of_formaldehyde_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: ['$$doc.documentForm', DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE],
              },
            },
          },
          raw_materials_elimination_of_prohibited_flame: 1,
          raw_materials_elimination_of_prohibited_flame_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: ['$$doc.documentForm', DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME],
              },
            },
          },
          raw_materials_elimination_of_prohibited_flame_solvents: 1,
          raw_materials_elimination_of_prohibited_flame_solvents_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: [
                  '$$doc.documentForm',
                  DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
                ],
              },
            },
          },
          raw_materials_elimination_of_prohibited_flame_solvents_products: 1,
          raw_materials_green_supply: 1,
          raw_materials_green_supply_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: ['$$doc.documentForm', DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY],
              },
            },
          },
          raw_materials_hazardous: 1,
          raw_materials_optimization_of_raw_mix: 1,
          raw_materials_raw_mix_optimization_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: [
                  '$$doc.documentForm',
                  DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION,
                ],
              },
            },
          },
          raw_materials_rapidly_renewable_materials: 1,
          raw_materials_rapidly_renewable_materials_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: ['$$doc.documentForm', DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS],
              },
            },
          },
          raw_materials_recovery: 1,
          raw_materials_recovery_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: ['$$doc.documentForm', DocumentSectionKey.RAW_MATERIALS_RECOVERY],
              },
            },
          },
          raw_materials_elimination_of_ozone_depleting_global_warming_substances_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: [
                  '$$doc.documentForm',
                  DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES,
                ],
              },
            },
          },
          raw_materials_recycled_content: 1,
          raw_materials_recycled_content_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: ['$$doc.documentForm', DocumentSectionKey.RAW_MATERIALS_RECYCLED_CONTENT],
              },
            },
          },
          raw_materials_reduce_environmental: 1,
          raw_materials_reduce_environmental_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $in: [
                  '$$doc.documentForm',
                  [
                    DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
                    DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL,
                  ],
                ],
              },
            },
          },
          raw_materials_rmc_alternative_raw_materials_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: [
                  '$$doc.documentForm',
                  DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
                ],
              },
            },
          },
          raw_materials_regional_materials: 1,
          raw_materials_regional_materials_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: ['$$doc.documentForm', DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS],
              },
            },
          },
          raw_materials_utilization: 1,
          raw_materials_utilization_documents: {
            $filter: {
              input: '$raw_materials_documents_bucket',
              as: 'doc',
              cond: {
                $eq: ['$$doc.documentForm', DocumentSectionKey.RAW_MATERIALS_UTILIZATION],
              },
            },
          },
          raw_materials_utilization_manufacturing_units: 1,
          raw_materials_utilization_rmc: 1,
          process_manufacturing: {
            $cond: {
              if: { $gt: [{ $size: '$process_manufacturing' }, 0] },
              then: { $arrayElemAt: ['$process_manufacturing', 0] },
              else: null,
            },
          },
          process_manufacturing_documents: 1,
          process_mp_manufacturing_units: 1,
          process_waste_management: {
            $cond: {
              if: { $gt: [{ $size: '$process_waste_management' }, 0] },
              then: { $arrayElemAt: ['$process_waste_management', 0] },
              else: null,
            },
          },
          process_waste_management_documents: 1,
          process_wm_manufacturing_units: 1,
          process_life_cycle_approach: {
            $cond: {
              if: { $gt: [{ $size: '$process_life_cycle_approach' }, 0] },
              then: { $arrayElemAt: ['$process_life_cycle_approach', 0] },
              else: null,
            },
          },
          process_life_cycle_approach_documents: 1,
          process_product_stewardship: {
            $cond: {
              if: { $gt: [{ $size: '$process_product_stewardship' }, 0] },
              then: { $arrayElemAt: ['$process_product_stewardship', 0] },
              else: null,
            },
          },
          process_product_stewardship_documents: 1,
          process_innovation: {
            $cond: {
              if: { $gt: [{ $size: '$process_innovation' }, 0] },
              then: { $arrayElemAt: ['$process_innovation', 0] },
              else: null,
            },
          },
          process_innovation_documents: 1,
          process_comments: {
            $cond: {
              if: { $gt: [{ $size: '$process_comments' }, 0] },
              then: { $arrayElemAt: ['$process_comments', 0] },
              else: null,
            },
          },
        },
      });

      // Execute aggregation
      const results = await this.productModel.aggregate(pipeline).exec();

      if (results.length === 0) {
        throw new NotFoundException(`No products found with URN: ${urnNo}`);
      }

      // Format response structure
      const formattedResults = results.map((product) => ({
        product_details: {
          _id: product._id,
          productId: product.productId,
          eoiNo: product.eoiNo,
          urnNo: product.urnNo,
          productName: product.productName,
          productImage: product.productImage,
          plantCount: product.plantCount,
          productDetails: product.productDetails,
          productType: product.productType,
          productStatus: product.productStatus,
          productRenewStatus: product.productRenewStatus,
          renewedDate: product.renewedDate,
          urnStatus: product.urnStatus,
          assessmentReportUrl: product.assessmentReportUrl,
          rejectedDetails: product.rejectedDetails,
          certifiedDate: product.certifiedDate,
          validtillDate: product.validtillDate,
          firstNotifyDate: product.firstNotifyDate,
          secondNotifyDate: product.secondNotifyDate,
          thirdNotifyDate: product.thirdNotifyDate,
          createdDate: product.createdDate,
          updatedDate: product.updatedDate,
        },
        category: product.category || null,
        manufacturer: product.manufacturer
          ? {
              _id: product.manufacturer._id,
              manufacturerName: product.manufacturer.manufacturerName,
              gpInternalId: product.manufacturer.gpInternalId,
              manufacturerInitial: product.manufacturer.manufacturerInitial,
              manufacturerStatus: product.manufacturer.manufacturerStatus,
              manufacturerImage: product.manufacturer.manufacturerImage,
            }
          : null,
        vendor: product.vendor
          ? {
              _id: product.vendor._id,
              vendorName: product.vendor.vendorName,
              vendorEmail: product.vendor.vendorEmail,
              vendorPhone: product.vendor.vendorPhone,
              vendorDesignation: product.vendor.vendorDesignation,
              vendorGst: product.vendor.vendorGst,
              vendorStatus: product.vendor.vendorStatus,
            }
          : null,
        plants: product.plants || [],
        payments: product.payments || [],
        product_design: product.product_design
          ? {
              _id: product.product_design._id,
              productDesignId: product.product_design.productDesignId,
              urnNo: product.product_design.urnNo,
              ecoVisionUpload: product.product_design.ecoVisionUpload,
              statergies: product.product_design.statergies,
              productDesignSupportingDocument:
                product.product_design.productDesignSupportingDocument,
              productDesignStatus: product.product_design.productDesignStatus,
              measuresAndBenefits:
                product.product_design.measuresAndBenefits || [],
              createdDate: product.product_design.createdDate,
              updatedDate: product.product_design.updatedDate,
            }
          : null,
        product_design_measures: (product.product_design_measures || []).map(
          (m) => ({
            _id: m._id,
            productDesignMeasureId: m.productDesignMeasureId,
            urnNo: m.urnNo,
            productDesignId: m.productDesignId,
            measures: m.measures,
            benefits: m.benefits,
            createdDate: m.createdDate,
            updatedDate: m.updatedDate,
          }),
        ),
        product_design_documents: (product.product_design_documents || []).map(
          (d) => ({
            _id: d._id,
            productDocumentId: d.productDocumentId,
            vendorId: d.vendorId,
            urnNo: d.urnNo,
            eoiNo: d.eoiNo,
            documentForm: d.documentForm,
            documentFormSubsection: d.documentFormSubsection,
            formPrimaryId: d.formPrimaryId,
            documentName: d.documentName,
            documentOriginalName: d.documentOriginalName,
            documentLink: d.documentLink,
            createdDate: d.createdDate,
            updatedDate: d.updatedDate,
          }),
        ),
        product_performance: product.product_performance
          ? {
              _id: product.product_performance._id,
              processProductPerformanceId:
                product.product_performance.processProductPerformanceId,
              urnNo: product.product_performance.urnNo,
              vendorId: product.product_performance.vendorId,
              eoiNo: product.product_performance.eoiNo,
              productName: product.product_performance.productName,
              testReportFileName:
                product.product_performance.testReportFileName,
              testReportFiles: product.product_performance.testReportFiles,
              renewalType: product.product_performance.renewalType,
              productPerformanceStatus:
                product.product_performance.productPerformanceStatus,
              createdDate: product.product_performance.createdDate,
              updatedDate: product.product_performance.updatedDate,
            }
          : null,
        product_performance_documents: (
          product.product_performance_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_hazardous_products: (
          product.raw_materials_hazardous_products || []
        ).map((r) => ({
          _id: r._id,
          rawMaterialsHazardousProductsId: r.rawMaterialsHazardousProductsId,
          urnNo: r.urnNo,
          vendorId: r.vendorId,
          productsName: r.productsName,
          productsTestReport: r.productsTestReport,
          createdDate: r.createdDate,
          updatedDate: r.updatedDate,
        })),
        raw_materials_hazardous_products_documents: (
          product.raw_materials_hazardous_products_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_additives: product.raw_materials_additives || [],
        raw_materials_additives_documents: (product.raw_materials_additives_documents || []).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_alternative_raw_materials_documents: (
          product.raw_materials_alternative_raw_materials_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_elimination_of_formaldehyde:
          product.raw_materials_elimination_of_formaldehyde || [],
        raw_materials_elimination_of_formaldehyde_documents: (
          product.raw_materials_elimination_of_formaldehyde_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_elimination_of_prohibited_flame:
          product.raw_materials_elimination_of_prohibited_flame || [],
        raw_materials_elimination_of_prohibited_flame_documents: (
          product.raw_materials_elimination_of_prohibited_flame_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_elimination_of_prohibited_flame_solvents:
          product.raw_materials_elimination_of_prohibited_flame_solvents || [],
        raw_materials_elimination_of_prohibited_flame_solvents_documents: (
          product.raw_materials_elimination_of_prohibited_flame_solvents_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_elimination_of_prohibited_flame_solvents_products:
          product.raw_materials_elimination_of_prohibited_flame_solvents_products ||
          [],
        raw_materials_green_supply: product.raw_materials_green_supply || [],
        raw_materials_green_supply_documents: (
          product.raw_materials_green_supply_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_hazardous: product.raw_materials_hazardous || [],
        raw_materials_optimization_of_raw_mix:
          product.raw_materials_optimization_of_raw_mix || [],
        raw_materials_raw_mix_optimization_documents: (
          product.raw_materials_raw_mix_optimization_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_rapidly_renewable_materials:
          product.raw_materials_rapidly_renewable_materials || [],
        raw_materials_rapidly_renewable_materials_documents: (
          product.raw_materials_rapidly_renewable_materials_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_recovery: product.raw_materials_recovery || [],
        raw_materials_recovery_documents: (
          product.raw_materials_recovery_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_elimination_of_ozone_depleting_global_warming_substances_documents: (
          product.raw_materials_elimination_of_ozone_depleting_global_warming_substances_documents ||
          []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_recycled_content: product.raw_materials_recycled_content || [],
        raw_materials_recycled_content_documents: (
          product.raw_materials_recycled_content_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_reduce_environmental:
          product.raw_materials_reduce_environmental || [],
        raw_materials_reduce_environmental_documents: (
          product.raw_materials_reduce_environmental_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_reduce_enviromental_documents: (
          product.raw_materials_reduce_environmental_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_rmc_alternative_raw_materials_documents: (
          product.raw_materials_rmc_alternative_raw_materials_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_regional_materials:
          product.raw_materials_regional_materials || [],
        raw_materials_regional_materials_documents: (
          product.raw_materials_regional_materials_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_utilization: product.raw_materials_utilization || [],
        raw_materials_utilization_documents: (product.raw_materials_utilization_documents || []).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        raw_materials_utilization_manufacturing_units:
          product.raw_materials_utilization_manufacturing_units || [],
        raw_materials_utilization_rmc: (product.raw_materials_utilization_rmc || []).map((r) => {
          const row: any = { ...r };
          for (const mat of ['Iron', 'Steel', 'Copper', 'Recycled', 'Aggregate']) {
            for (const yr of [1, 2, 3, 4]) {
              const canonical = `percentYear${yr}Subsititution${mat}`;
              const legacy = `percentYear${yr}Subsitution${mat}`;
              if (row[legacy] === undefined && row[canonical] !== undefined) {
                row[legacy] = row[canonical];
              }
            }
          }
          for (const yr of [1, 2, 3, 4]) {
            const canonical = `plantYear${yr}PercentSubstitution`;
            const legacy = `plantYear${yr}PercentSubsitution`;
            if (row[legacy] === undefined && row[canonical] !== undefined) {
              row[legacy] = row[canonical];
            }
          }
          return row;
        }),
        process_manufacturing: product.process_manufacturing
          ? {
              _id: product.process_manufacturing._id,
              processManufacturingId:
                product.process_manufacturing.processManufacturingId,
              vendorId: product.process_manufacturing.vendorId,
              urnNo: product.process_manufacturing.urnNo,
              energyConservationSupportingDocuments:
                product.process_manufacturing
                  .energyConservationSupportingDocuments,
              portableWaterDemand:
                product.process_manufacturing.portableWaterDemand,
              rainWaterHarvesting:
                product.process_manufacturing.rainWaterHarvesting,
              beyondTheFenceInitiatives:
                product.process_manufacturing.beyondTheFenceInitiatives,
              totalEnergyConsumption:
                product.process_manufacturing.totalEnergyConsumption,
              energyConsumptionDocuments:
                product.process_manufacturing.energyConsumptionDocuments,
              processManufacturingStatus:
                product.process_manufacturing.processManufacturingStatus,
              createdDate: product.process_manufacturing.createdDate,
              updatedDate: product.process_manufacturing.updatedDate,
            }
          : null,
        process_manufacturing_documents: (
          product.process_manufacturing_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        process_mp_manufacturing_units: (
          product.process_mp_manufacturing_units || []
        ).map((u) => ({
          _id: u._id,
          processMpManufacturingUnitId: u.processMpManufacturingUnitId,
          vendorId: u.vendorId,
          urnNo: u.urnNo,
          unitName: u.unitName,
          renewableEnergyUtilization: u.renewableEnergyUtilization,
          ecdYear1: u.ecdYear1,
          ecdYear2: u.ecdYear2,
          ecdYear3: u.ecdYear3,
          ecdProductionUnit: u.ecdProductionUnit,
          ecdProductionYear1: u.ecdProductionYear1,
          ecdProductionYear2: u.ecdProductionYear2,
          ecdProductionYear3: u.ecdProductionYear3,
          ecdElectricUnit: u.ecdElectricUnit,
          ecdElectricYear1: u.ecdElectricYear1,
          ecdElectricYear2: u.ecdElectricYear2,
          ecdElectricYear3: u.ecdElectricYear3,
          ecdThermalUnitFuel1: u.ecdThermalUnitFuel1,
          ecdThermalUnitFuel2: u.ecdThermalUnitFuel2,
          ecdThermalUnitFuel3: u.ecdThermalUnitFuel3,
          ecdThermalFuel1Year1: u.ecdThermalFuel1Year1,
          ecdThermalFuel1Year2: u.ecdThermalFuel1Year2,
          ecdThermalFuel1Year3: u.ecdThermalFuel1Year3,
          ecdThermalFuel2Year1: u.ecdThermalFuel2Year1,
          ecdThermalFuel2Year2: u.ecdThermalFuel2Year2,
          ecdThermalFuel2Year3: u.ecdThermalFuel2Year3,
          ecdThermalFuel3Year1: u.ecdThermalFuel3Year1,
          ecdThermalFuel3Year2: u.ecdThermalFuel3Year2,
          ecdThermalFuel3Year3: u.ecdThermalFuel3Year3,
          ecdCalorificFuel1Year1: u.ecdCalorificFuel1Year1,
          ecdCalorificFuel1Year2: u.ecdCalorificFuel1Year2,
          ecdCalorificFuel1Year3: u.ecdCalorificFuel1Year3,
          ecdCalorificFuel2Year1: u.ecdCalorificFuel2Year1,
          ecdCalorificFuel2Year2: u.ecdCalorificFuel2Year2,
          ecdCalorificFuel2Year3: u.ecdCalorificFuel2Year3,
          ecdCalorificFuel3Year1: u.ecdCalorificFuel3Year1,
          ecdCalorificFuel3Year2: u.ecdCalorificFuel3Year2,
          ecdCalorificFuel3Year3: u.ecdCalorificFuel3Year3,
          ecdTextareaNewUnits: u.ecdTextareaNewUnits,
          wcdYear1: u.wcdYear1,
          wcdYear2: u.wcdYear2,
          wcdYear3: u.wcdYear3,
          wcdProductionUnit: u.wcdProductionUnit,
          wcdWaterUnit: u.wcdWaterUnit,
          wcdProductionYear1: u.wcdProductionYear1,
          wcdProductionYear2: u.wcdProductionYear2,
          wcdProductionYear3: u.wcdProductionYear3,
          wcdWaterYear1: u.wcdWaterYear1,
          wcdWaterYear2: u.wcdWaterYear2,
          wcdWaterYear3: u.wcdWaterYear3,
          reYear: u.reYear,
          reSolarPhotovoltaic: u.reSolarPhotovoltaic,
          reWind: u.reWind,
          reBiomass: u.reBiomass,
          reSolarThermal: u.reSolarThermal,
          reOthersUnit: u.reOthersUnit,
          reOthers: u.reOthers,
          offsiteRenewablePower: u.offsiteRenewablePower,
          processMpManufacturingUnitStatus: u.processMpManufacturingUnitStatus,
          calculateBulkSec: u.calculateBulkSec,
          calculateBulkSwc: u.calculateBulkSwc,
          calculateBulkSecMultipled: u.calculateBulkSecMultipled,
          calculateBulkSwcMultipled: u.calculateBulkSwcMultipled,
          measuresImplementedMpUnits: u.measuresImplementedMpUnits,
          detailsOfRainWaterHarvestingMpUnits:
            u.detailsOfRainWaterHarvestingMpUnits,
          createdDate: u.createdDate,
          updatedDate: u.updatedDate,
        })),
        process_waste_management: product.process_waste_management
          ? {
              _id: product.process_waste_management._id,
              processWasteManagementId:
                product.process_waste_management.processWasteManagementId,
              vendorId: product.process_waste_management.vendorId,
              urnNo: product.process_waste_management.urnNo,
              wmImplementationDetails:
                product.process_waste_management.wmImplementationDetails,
              wmSupportingDocuments:
                product.process_waste_management.wmSupportingDocuments,
              processWasteManagementStatus:
                product.process_waste_management.processWasteManagementStatus,
              createdDate: product.process_waste_management.createdDate,
              updatedDate: product.process_waste_management.updatedDate,
            }
          : null,
        process_waste_management_documents: (
          product.process_waste_management_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        process_wm_manufacturing_units: (
          product.process_wm_manufacturing_units || []
        ).map((u) => ({
          _id: u._id,
          processWmManufacturingUnitId: u.processWmManufacturingUnitId,
          vendorId: u.vendorId,
          urnNo: u.urnNo,
          processWasteManagementId: u.processWasteManagementId,
          unitName: u.unitName,
          hazardousWasteYear1: u.hazardousWasteYear1,
          hazardousWasteYear2: u.hazardousWasteYear2,
          hazardousWasteYear3: u.hazardousWasteYear3,
          hazardousWasteProductionUnit: u.hazardousWasteProductionUnit,
          hazardousWasteQuantityUnit: u.hazardousWasteQuantityUnit,
          hazardousWasteProductionYear1: u.hazardousWasteProductionYear1,
          hazardousWasteProductionYear2: u.hazardousWasteProductionYear2,
          hazardousWasteProductionYear3: u.hazardousWasteProductionYear3,
          hazardousWasteQuantityYear1: u.hazardousWasteQuantityYear1,
          hazardousWasteQuantityYear2: u.hazardousWasteQuantityYear2,
          hazardousWasteQuantityYear3: u.hazardousWasteQuantityYear3,
          nonHazardousWasteYear1: u.nonHazardousWasteYear1,
          nonHazardousWasteYear2: u.nonHazardousWasteYear2,
          nonHazardousWasteYear3: u.nonHazardousWasteYear3,
          nonHazardousWasteProductionUnit: u.nonHazardousWasteProductionUnit,
          nonHazardousWasteWaterUnit: u.nonHazardousWasteWaterUnit,
          nonHazardousWasteProductionYear1: u.nonHazardousWasteProductionYear1,
          nonHazardousWasteProductionYear2: u.nonHazardousWasteProductionYear2,
          nonHazardousWasteProductionYear3: u.nonHazardousWasteProductionYear3,
          nonHazardousWasteWaterYear1: u.nonHazardousWasteWaterYear1,
          nonHazardousWasteWaterYear2: u.nonHazardousWasteWaterYear2,
          nonHazardousWasteWaterYear3: u.nonHazardousWasteWaterYear3,
          calculateBulkRshwd: u.calculateBulkRshwd,
          calculateBulkRsnhwd: u.calculateBulkRsnhwd,
          calculateBulkRshwdMultipled: u.calculateBulkRshwdMultipled,
          calculateBulkRsnhwdMultipled: u.calculateBulkRsnhwdMultipled,
          wmImplementationDetailsWmUnits: u.wmImplementationDetailsWmUnits,
          createdDate: u.createdDate,
          updatedDate: u.updatedDate,
        })),
        process_life_cycle_approach: product.process_life_cycle_approach
          ? {
              _id: product.process_life_cycle_approach._id,
              processLifeCycleApproachId:
                product.process_life_cycle_approach.processLifeCycleApproachId,
              vendorId: product.process_life_cycle_approach.vendorId,
              urnNo: product.process_life_cycle_approach.urnNo,
              lifeCycleAssesmentReports:
                product.process_life_cycle_approach.lifeCycleAssesmentReports,
              lifeCycleImplementationDetails:
                product.process_life_cycle_approach
                  .lifeCycleImplementationDetails,
              lifeCycleImplementationDocuments:
                product.process_life_cycle_approach
                  .lifeCycleImplementationDocuments,
              processLifeCycleApproachStatus:
                product.process_life_cycle_approach
                  .processLifeCycleApproachStatus,
              createdDate: product.process_life_cycle_approach.createdDate,
              updatedDate: product.process_life_cycle_approach.updatedDate,
            }
          : null,
        process_life_cycle_approach_documents: (
          product.process_life_cycle_approach_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        process_product_stewardship: product.process_product_stewardship
          ? {
              _id: product.process_product_stewardship._id,
              processProductStewardshipId:
                product.process_product_stewardship.processProductStewardshipId,
              vendorId: product.process_product_stewardship.vendorId,
              urnNo: product.process_product_stewardship.urnNo,
              seaSupportingDocuments:
                product.process_product_stewardship.seaSupportingDocuments,
              qualityManagementDetails:
                product.process_product_stewardship.qualityManagementDetails,
              qmSupportingDocuments:
                product.process_product_stewardship.qmSupportingDocuments,
              eprImplementedDetails:
                product.process_product_stewardship.eprImplementedDetails,
              eprGreenPackagingDetails:
                product.process_product_stewardship.eprGreenPackagingDetails,
              eprSupportingDocuments:
                product.process_product_stewardship.eprSupportingDocuments,
              productStewardshipStatus:
                product.process_product_stewardship.productStewardshipStatus,
              createdDate: product.process_product_stewardship.createdDate,
              updatedDate: product.process_product_stewardship.updatedDate,
            }
          : null,
        process_product_stewardship_documents: (
          product.process_product_stewardship_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        process_innovation: product.process_innovation
          ? {
              _id: product.process_innovation._id,
              processInnovationId:
                product.process_innovation.processInnovationId,
              vendorId: product.process_innovation.vendorId,
              urnNo: product.process_innovation.urnNo,
              innovationImplementationDetails:
                product.process_innovation.innovationImplementationDetails,
              innovationImplementationDocuments:
                product.process_innovation.innovationImplementationDocuments,
              processInnovationStatus:
                product.process_innovation.processInnovationStatus,
              createdDate: product.process_innovation.createdDate,
              updatedDate: product.process_innovation.updatedDate,
            }
          : null,
        process_innovation_documents: (
          product.process_innovation_documents || []
        ).map((d) => ({
          _id: d._id,
          productDocumentId: d.productDocumentId,
          vendorId: d.vendorId,
          urnNo: d.urnNo,
          eoiNo: d.eoiNo,
          documentForm: d.documentForm,
          documentFormSubsection: d.documentFormSubsection,
          formPrimaryId: d.formPrimaryId,
          documentName: d.documentName,
          documentOriginalName: d.documentOriginalName,
          documentLink: d.documentLink,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        process_comments: product.process_comments
          ? {
              ...product.process_comments,
              _id: product.process_comments._id,
              processCommentsId: product.process_comments.processCommentsId,
              urnNo: product.process_comments.urnNo,
              vendorId: product.process_comments.vendorId,
              adminProcessComments:
                product.process_comments.adminProcessComments ??
                product.process_comments.adminComments ??
                product.process_comments.admin_comment ??
                product.process_comments.admin_comments ??
                null,
              vendorProcessComments:
                product.process_comments.vendorProcessComments ??
                product.process_comments.vendorComments ??
                product.process_comments.vendor_comment ??
                product.process_comments.vendor_comments ??
                null,
              productDesign: product.process_comments.productDesign,
              productPerformance: product.process_comments.productPerformance,
              manfacturingProcess: product.process_comments.manfacturingProcess,
              wasteManagement: product.process_comments.wasteManagement,
              lifeCycleApproach: product.process_comments.lifeCycleApproach,
              productStewardship: product.process_comments.productStewardship,
              productInnovation: product.process_comments.productInnovation,
              rawMaterials31: product.process_comments.rawMaterials31,
              rawMaterials32: product.process_comments.rawMaterials32,
              rawMaterials33: product.process_comments.rawMaterials33,
              rawMaterials34: product.process_comments.rawMaterials34,
              rawMaterials35: product.process_comments.rawMaterials35,
              rawMaterials36: product.process_comments.rawMaterials36,
              rawMaterials37: product.process_comments.rawMaterials37,
              rawMaterials38: product.process_comments.rawMaterials38,
              rawMaterials39: product.process_comments.rawMaterials39,
              rawMaterials310: product.process_comments.rawMaterials310,
              rawMaterials311: product.process_comments.rawMaterials311,
              rawMaterials312: product.process_comments.rawMaterials312,
              rawMaterials313: product.process_comments.rawMaterials313,
              rawMaterials314: product.process_comments.rawMaterials314,
              rawMaterials315: product.process_comments.rawMaterials315,
              updatedDate: product.process_comments.updatedDate,
            }
          : null,
      }));

      return formattedResults;
    } catch (error: any) {
      console.error('[Get Product Details by URN] Error:', error);
      console.error('[Get Product Details by URN] Error stack:', error.stack);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message ||
          'Failed to get product details. Please check the logs for details.',
      );
    }
  }

  async adminListProducts(dto: AdminListProductsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;
    const sortOrder = (dto.order ?? dto.sortOrder) === 'asc' ? 1 : -1;
    const now = new Date();

    const sortFieldMap: Record<string, string> = {
      createdDate: 'createdDate',
      createdAt: 'createdDate',
      validTill: 'validtillDate',
      productName: 'productName',
      eoiNo: 'eoiNo',
      urnNo: 'urnNo',
    };
    const sortField =
      sortFieldMap[dto.sortBy ?? 'createdDate'] ?? 'createdDate';

    const nativeMatch: Record<string, unknown> = {};
    if (dto.product_type !== undefined) {
      nativeMatch.productType = dto.product_type;
    }
    if (dto.categoryId) {
      nativeMatch.categoryId = this.toObjectId(dto.categoryId, 'categoryId');
    }
    if (dto.manufacturerId) {
      nativeMatch.manufacturerId = this.toObjectId(
        dto.manufacturerId,
        'manufacturerId',
      );
    }
    const createdFrom = dto.from ?? dto.fromDate;
    const createdTo = dto.to ?? dto.toDate;
    if (createdFrom || createdTo) {
      const createdRange: Record<string, Date> = {};
      if (createdFrom) {
        createdRange.$gte = new Date(createdFrom);
      }
      if (createdTo) {
        const to = new Date(createdTo);
        to.setHours(23, 59, 59, 999);
        createdRange.$lte = to;
      }
      nativeMatch.createdDate = createdRange;
    }
    if (dto.validTillYear !== undefined) {
      const y = dto.validTillYear;
      nativeMatch.validtillDate = {
        $gte: new Date(Date.UTC(y, 0, 1, 0, 0, 0, 0)),
        $lte: new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999)),
      };
    }

    const basePipeline: any[] = [];
    if (Object.keys(nativeMatch).length > 0) {
      basePipeline.push({ $match: nativeMatch });
    }

    basePipeline.push(
      {
        $lookup: {
          from: 'manufacturers',
          localField: 'manufacturerId',
          foreignField: '_id',
          as: 'manufacturer',
        },
      },
      {
        $unwind: {
          path: '$manufacturer',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'product_plants',
          let: { pid: '$_id' },
          pipeline: [{ $match: { $expr: { $eq: ['$productId', '$$pid'] } } }],
          as: 'plants',
        },
      },
    );

    if (dto.stateId || dto.city) {
      const plantMatch: Record<string, unknown> = {};
      if (dto.stateId) {
        plantMatch.stateId = this.toObjectId(dto.stateId, 'stateId');
      }
      if (dto.city && dto.city.trim() !== '') {
        plantMatch.city = new RegExp(
          dto.city.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        );
      }
      basePipeline.push({ $match: { plants: { $elemMatch: plantMatch } } });
    }

    if (dto.search && dto.search.trim() !== '') {
      const rx = new RegExp(
        dto.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i',
      );
      basePipeline.push({
        $match: {
          $or: [
            { eoiNo: rx },
            { urnNo: rx },
            { productName: rx },
            { 'manufacturer.manufacturerName': rx },
            { 'manufacturer.vendor_email': rx },
            { 'manufacturer.vendor_phone': rx },
          ],
        },
      });
    }

    const statuses = Array.isArray(dto.status) ? dto.status : [];
    const includeExpired = statuses.includes(4);
    const regularStatuses = statuses.filter((s) => s !== 4);

    let statusMatch: Record<string, unknown> | null = null;
    if (statuses.length > 0) {
      if (includeExpired && regularStatuses.length > 0) {
        statusMatch = {
          $or: [
            { productStatus: { $in: regularStatuses } },
            {
              productStatus: 2,
              validtillDate: { $exists: true, $ne: null, $lt: now },
            },
          ],
        };
      } else if (includeExpired) {
        statusMatch = {
          productStatus: 2,
          validtillDate: { $exists: true, $ne: null, $lt: now },
        };
      } else if (regularStatuses.length === 1) {
        statusMatch = { productStatus: regularStatuses[0] };
      } else {
        statusMatch = { productStatus: { $in: regularStatuses } };
      }
    }

    const rowBase: any[] = [...basePipeline];
    if (statusMatch) {
      rowBase.push({ $match: statusMatch });
    }

    const urnSummaryPipeline: any[] = [
      ...rowBase,
      {
        $group: {
          _id: '$urnNo',
          urnNo: { $first: '$urnNo' },
          createdDate: { $min: '$createdDate' },
          totalEoi: { $sum: 1 },
          statusCodes: { $addToSet: '$productStatus' },
        },
      },
      { $sort: { [sortField]: sortOrder } },
    ];

    const eoiLookupPipeline: any[] = [
      { $match: { $expr: { $eq: ['$urnNo', '$$urnNo'] } } },
    ];
    if (statusMatch) {
      eoiLookupPipeline.push({ $match: statusMatch });
    }

    const urnDataPipeline = [
      ...urnSummaryPipeline,
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          let: { urnNo: '$urnNo' },
          pipeline: [
            ...eoiLookupPipeline,
            {
              $lookup: {
                from: 'manufacturers',
                localField: 'manufacturerId',
                foreignField: '_id',
                as: 'manufacturer',
              },
            },
            {
              $unwind: {
                path: '$manufacturer',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category',
              },
            },
            {
              $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: 'product_plants',
                let: { productId: '$_id' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$productId', '$$productId'] } } },
                  {
                    $lookup: {
                      from: 'states',
                      localField: 'stateId',
                      foreignField: '_id',
                      as: 'state',
                    },
                  },
                  {
                    $unwind: {
                      path: '$state',
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      productPlantId: 1,
                      productId: 1,
                      plantName: 1,
                      plantLocation: 1,
                      countryId: 1,
                      stateId: 1,
                      city: 1,
                      plantStatus: 1,
                      createdDate: 1,
                      stateName: {
                        $ifNull: [
                          '$state.stateName',
                          { $ifNull: ['$state.state_name', '$state.name'] },
                        ],
                      },
                    },
                  },
                ],
                as: 'plants',
              },
            },
            {
              $project: {
                _id: 1,
                productId: 1,
                eoiNo: 1,
                urnNo: 1,
                productName: 1,
                categoryName: {
                  $ifNull: [
                    '$category.categoryName',
                    '$category.category_name',
                  ],
                },
                manufacturerName: '$manufacturer.manufacturerName',
                productStatus: 1,
                createdDate: 1,
                plants: 1,
              },
            },
            { $sort: { createdDate: -1 } },
          ],
          as: 'eois',
        },
      },
      {
        $project: {
          _id: 0,
          urnNo: 1,
          createdDate: 1,
          totalEoi: 1,
          statusCodes: 1,
          eois: 1,
        },
      },
    ];

    const totalUrnPipeline = [...urnSummaryPipeline, { $count: 'count' }];

    const facetResult = await this.productModel
      .aggregate([
        {
          $facet: {
            data: urnDataPipeline,
            total: totalUrnPipeline,
            byStatus: [
              ...rowBase,
              { $group: { _id: '$productStatus', count: { $sum: 1 } } },
            ],
            expired: [
              ...rowBase,
              {
                $match: {
                  productStatus: 2,
                  validtillDate: { $exists: true, $ne: null, $lt: now },
                },
              },
              { $count: 'count' },
            ],
          },
        },
      ])
      .exec();

    const payload = facetResult[0] ?? {
      data: [],
      total: [],
      byStatus: [],
      expired: [],
    };
    const total = payload.total?.[0]?.count ?? 0;

    const statusCounts: Record<string, number> = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: payload.expired?.[0]?.count ?? 0,
    };
    for (const row of payload.byStatus ?? []) {
      if (row?._id !== undefined && row?._id !== null) {
        statusCounts[String(row._id)] = row.count ?? 0;
      }
    }

    const mapProductStatusLabel = (
      code: number,
    ): 'Pending' | 'Approved' | 'Rejected' => {
      if (code === 3) return 'Rejected';
      if (code === 2) return 'Approved';
      return 'Pending';
    };
    const deriveUrnStatus = (
      codes: number[],
    ): 'Active' | 'Pending' | 'Inactive' => {
      if (codes.includes(3)) return 'Inactive';
      if (codes.includes(2)) return 'Active';
      return 'Pending';
    };

    const grouped = (payload.data ?? []).map((u: any) => ({
      urnNo: u.urnNo,
      createdDate: u.createdDate,
      urnStatus: deriveUrnStatus(
        Array.isArray(u.statusCodes) ? u.statusCodes : [],
      ),
      totalEoi: u.totalEoi ?? 0,
      eois: Array.isArray(u.eois)
        ? u.eois.map((e: any) => {
            const { plants, ...eoi } = e ?? {};
            return {
              ...eoi,
              plantDetails: Array.isArray(plants)
                ? plants.map((p: any) => ({
                    _id: p?._id,
                    productPlantId: p?.productPlantId,
                    productId: p?.productId,
                    plantName: p?.plantName,
                    plantLocation: p?.plantLocation,
                    countryId: p?.countryId,
                    stateId: p?.stateId,
                    stateName: p?.stateName ?? null,
                    city: p?.city,
                    plantStatus: p?.plantStatus,
                    createdDate: p?.createdDate,
                  }))
                : [],
              statusLabel: mapProductStatusLabel(Number(e.productStatus ?? 0)),
            };
          })
        : [],
    }));

    return {
      message: 'Products listed successfully',
      data: grouped,
      total,
      page,
      limit,
      statusCounts,
    };
  }

  async getManufacturersByCategory(categoryId: string) {
    const categoryObjectId = this.toObjectId(categoryId, 'categoryId');
    const apiBaseUrl = (process.env.API_BASE_URL ?? '')
      .trim()
      .replace(/\/+$/, '');
    const toImageUrl = (path?: string | null): string | null => {
      if (!path) return null;
      if (/^https?:\/\//i.test(path)) return path;
      if (path.startsWith('/')) {
        return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
      }
      return apiBaseUrl ? `${apiBaseUrl}/${path}` : `/${path}`;
    };

    const rows = await this.productModel
      .aggregate([
        { $match: { categoryId: categoryObjectId } },
        {
          $group: {
            _id: '$manufacturerId',
            productCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'manufacturers',
            localField: '_id',
            foreignField: '_id',
            as: 'manufacturer',
          },
        },
        {
          $unwind: {
            path: '$manufacturer',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            _id: '$manufacturer._id',
            manufacturerName: '$manufacturer.manufacturerName',
            gpInternalId: '$manufacturer.gpInternalId',
            manufacturerInitial: '$manufacturer.manufacturerInitial',
            manufacturerImage: {
              $ifNull: ['$manufacturer.manufacturerImage', null],
            },
            manufacturerStatus: '$manufacturer.manufacturerStatus',
            vendor_status: '$manufacturer.vendor_status',
            vendor_name: '$manufacturer.vendor_name',
            vendor_email: '$manufacturer.vendor_email',
            vendor_phone: '$manufacturer.vendor_phone',
            productCount: 1,
          },
        },
        { $sort: { manufacturerName: 1 } },
      ])
      .exec();

    const data = rows.map((row: any) => ({
      ...row,
      manufacturerImageUrl: toImageUrl(row.manufacturerImage),
    }));

    return {
      categoryId,
      total: data.length,
      data,
    };
  }

  async getCategoriesByManufacturer(manufacturerId: string) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const apiBaseUrl = (process.env.API_BASE_URL ?? '')
      .trim()
      .replace(/\/+$/, '');
    const toImageUrl = (path?: string | null): string | null => {
      if (!path) return null;
      if (/^https?:\/\//i.test(path)) return path;
      if (path.startsWith('/')) {
        return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
      }
      return apiBaseUrl ? `${apiBaseUrl}/${path}` : `/${path}`;
    };

    const rows = await this.productModel
      .aggregate([
        { $match: { manufacturerId: manufacturerObjectId } },
        {
          $group: {
            _id: '$categoryId',
            productCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            _id: '$category._id',
            category_id: '$category.category_id',
            category_name: '$category.category_name',
            category_image: '$category.category_image',
            category_status: '$category.category_status',
            sector: '$category.sector',
            productCount: 1,
          },
        },
        { $sort: { category_name: 1 } },
      ])
      .exec();

    const data = rows.map((row: any) => ({
      ...row,
      category_image_url: toImageUrl(row.category_image),
    }));

    return {
      manufacturerId,
      total: data.length,
      data,
    };
  }

  async exportAdminProductsXlsx(
    dto: AdminListProductsDto,
  ): Promise<{ buffer: Buffer; fileName: string }> {
    const batchSize = 500;
    let page = 1;
    let totalUrn = 0;
    const urnRows: any[] = [];

    while (true) {
      const batch = await this.adminListProducts({
        ...dto,
        page,
        limit: batchSize,
      } as AdminListProductsDto);

      if (totalUrn === 0) {
        totalUrn = batch.total ?? 0;
      }
      urnRows.push(...(batch.data ?? []));
      if (urnRows.length >= totalUrn || (batch.data ?? []).length === 0) {
        break;
      }
      page += 1;
    }

    const mapStatusLabel = (
      code: number,
    ): 'Pending' | 'Approved' | 'Rejected' => {
      if (code === 3) return 'Rejected';
      if (code === 2) return 'Approved';
      return 'Pending';
    };

    const eoiRows = urnRows.flatMap((u) =>
      (u.eois ?? []).map((e: any) => ({
        urnNo: e.urnNo ?? u.urnNo ?? '',
        eoiNo: e.eoiNo ?? '',
        productName: e.productName ?? '',
        categoryName: e.categoryName ?? '',
        manufacturerName: e.manufacturerName ?? '',
        statusLabel:
          e.statusLabel ?? mapStatusLabel(Number(e.productStatus ?? 0)),
        createdDate: e.createdDate ?? u.createdDate ?? null,
      })),
    );

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Products Export');
    ws.columns = [
      { header: 'URN No', key: 'urnNo', width: 28 },
      { header: 'EOI No', key: 'eoiNo', width: 24 },
      { header: 'Product Name', key: 'productName', width: 32 },
      { header: 'Category Name', key: 'categoryName', width: 24 },
      { header: 'Manufacturer Name', key: 'manufacturerName', width: 30 },
      { header: 'Product Status Label', key: 'statusLabel', width: 20 },
      { header: 'Created Date', key: 'createdDate', width: 24 },
    ];
    eoiRows.forEach((r) => ws.addRow(r));

    const raw = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.isBuffer(raw) ? raw : Buffer.from(raw as ArrayBuffer);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return {
      buffer,
      fileName: `admin-products-export-${stamp}.xlsx`,
    };
  }

  async createAdminProductsExportJob(
    dto: AdminProductsExportDto,
    requestedBy?: string,
  ) {
    this.cleanupExpiredExportJobs();

    const format = dto.format ?? 'xlsx';
    const includeSheets = dto.includeSheets?.length
      ? dto.includeSheets
      : (['urn_summary', 'eoi_details'] as Array<
          'urn_summary' | 'eoi_details'
        >);

    const filtersForHash = {
      ...dto,
      page: undefined,
      limit: undefined,
      format,
      includeSheets,
    };
    const filtersHash = createHash('sha256')
      .update(JSON.stringify(filtersForHash))
      .digest('hex')
      .slice(0, 16);

    const now = new Date();
    const jobId = `exp_${Date.now()}_${randomUUID().slice(0, 8)}`;
    const job: AdminExportJob = {
      jobId,
      status: 'queued',
      progress: 0,
      format,
      includeSheets,
      filtersHash,
      createdAt: now,
      updatedAt: now,
      expiresAt: null,
      requestedBy,
    };
    this.exportJobs.set(jobId, job);

    setImmediate(() => {
      void this.runAdminProductsExportJob(jobId, dto);
    });

    return {
      jobId,
      status: 'queued',
    };
  }

  getAdminProductsExportJob(jobId: string) {
    this.cleanupExpiredExportJobs();
    const job = this.exportJobs.get(jobId);
    if (!job) {
      throw new NotFoundException('Export job not found');
    }
    return {
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      fileUrl: job.fileUrl,
      fileName: job.fileName,
      expiresAt: job.expiresAt,
      error: job.error,
      rowCount: job.rowCount,
      updatedAt: job.updatedAt,
      createdAt: job.createdAt,
    };
  }

  private async runAdminProductsExportJob(
    jobId: string,
    dto: AdminProductsExportDto,
  ) {
    const job = this.exportJobs.get(jobId);
    if (!job) return;

    try {
      this.ensureExportDir();
      job.status = 'processing';
      job.progress = 5;
      job.updatedAt = new Date();

      const pageSize = 500;
      let page = 1;
      let total = 0;
      const urnRows: any[] = [];

      while (true) {
        const batch = await this.adminListProducts({
          ...dto,
          page,
          limit: pageSize,
        } as AdminListProductsDto);

        if (total === 0) {
          total = batch.total ?? 0;
        }
        urnRows.push(...(batch.data ?? []));
        if (urnRows.length >= total || (batch.data ?? []).length === 0) {
          break;
        }
        page += 1;
        job.progress = Math.min(
          70,
          10 + Math.floor((urnRows.length / Math.max(total, 1)) * 60),
        );
        job.updatedAt = new Date();
      }

      const eoiRows = urnRows.flatMap((u) =>
        (u.eois ?? []).map((e: any) => ({
          urnNo: u.urnNo,
          eoiNo: e.eoiNo,
          productId: e.productId,
          productName: e.productName,
          categoryName: e.categoryName,
          manufacturerName: e.manufacturerName,
          productStatus: e.productStatus,
          statusLabel: e.statusLabel,
          createdDate: e.createdDate,
        })),
      );

      if (eoiRows.length > this.exportMaxRows) {
        throw new BadRequestException(
          `Export exceeds maximum allowed rows (${this.exportMaxRows}). Narrow down filters and try again.`,
        );
      }

      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const ext = job.format === 'csv' ? 'csv' : 'xlsx';
      const fileName = `products_export_${jobId}_${stamp}.${ext}`;
      const filePath = join(this.exportDir, fileName);

      if (job.format === 'csv') {
        const esc = (v: unknown) => {
          const s = v === null || v === undefined ? '' : String(v);
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const header = [
          'URN',
          'EOI Number',
          'Product ID',
          'Product Name',
          'Category Name',
          'Manufacturer Name',
          'Product Status',
          'Status Label',
          'Created Date',
        ];
        const lines = [header.join(',')];
        for (const row of eoiRows) {
          lines.push(
            [
              row.urnNo,
              row.eoiNo,
              row.productId,
              row.productName,
              row.categoryName,
              row.manufacturerName,
              row.productStatus,
              row.statusLabel,
              row.createdDate,
            ]
              .map(esc)
              .join(','),
          );
        }
        writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf-8');
      } else {
        const workbook = new ExcelJS.Workbook();

        if (job.includeSheets.includes('urn_summary')) {
          const ws1 = workbook.addWorksheet('URN Summary');
          ws1.columns = [
            { header: 'S.No', key: 'sno', width: 8 },
            { header: 'URN', key: 'urnNo', width: 28 },
            { header: 'Created Date', key: 'createdDate', width: 24 },
            { header: 'URN Status', key: 'urnStatus', width: 16 },
            { header: 'Total EOI', key: 'totalEoi', width: 12 },
          ];
          urnRows.forEach((u, idx) => {
            ws1.addRow({
              sno: idx + 1,
              urnNo: u.urnNo,
              createdDate: u.createdDate,
              urnStatus: u.urnStatus,
              totalEoi: u.totalEoi,
            });
          });
        }

        if (job.includeSheets.includes('eoi_details')) {
          const ws2 = workbook.addWorksheet('EOI Details');
          ws2.columns = [
            { header: 'URN', key: 'urnNo', width: 28 },
            { header: 'EOI Number', key: 'eoiNo', width: 20 },
            { header: 'Product ID', key: 'productId', width: 12 },
            { header: 'Product Name', key: 'productName', width: 30 },
            { header: 'Category Name', key: 'categoryName', width: 24 },
            { header: 'Manufacturer Name', key: 'manufacturerName', width: 28 },
            { header: 'Product Status', key: 'productStatus', width: 14 },
            { header: 'Status Label', key: 'statusLabel', width: 14 },
            { header: 'Created Date', key: 'createdDate', width: 24 },
          ];
          eoiRows.forEach((row) => ws2.addRow(row));
        }

        await workbook.xlsx.writeFile(filePath);
      }

      job.status = 'completed';
      job.progress = 100;
      job.fileName = fileName;
      job.fileUrl = this.buildPublicFileUrl(fileName);
      job.rowCount = eoiRows.length;
      job.updatedAt = new Date();
      job.expiresAt = new Date(Date.now() + this.exportTtlMs);

      // Audit trail for export execution
      console.log(
        '[AdminProductsExport]',
        JSON.stringify({
          jobId: job.jobId,
          requestedBy: job.requestedBy ?? null,
          format: job.format,
          includeSheets: job.includeSheets,
          filtersHash: job.filtersHash,
          rowCount: job.rowCount,
          createdAt: job.createdAt,
          completedAt: job.updatedAt,
        }),
      );
    } catch (error: any) {
      job.status = 'failed';
      job.progress = 100;
      job.error = error?.message || 'Export failed';
      job.updatedAt = new Date();
      job.expiresAt = new Date(Date.now() + this.exportTtlMs);
    }
  }
}
