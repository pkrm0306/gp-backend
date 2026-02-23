import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, ClientSession, Connection, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { ProductPlant, ProductPlantDocument } from './schemas/product-plant.schema';
import { RegisterProductDto, BulkRegisterProductDto } from './dto/register-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SequenceHelper } from './helpers/sequence.helper';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { VendorsService } from '../vendors/vendors.service';
import { CountriesService } from '../countries/countries.service';
import { StatesService } from '../states/states.service';

@Injectable()
export class ProductRegistrationService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private productPlantModel: Model<ProductPlantDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
    private manufacturersService: ManufacturersService,
    private vendorsService: VendorsService,
    private countriesService: CountriesService,
    private statesService: StatesService,
  ) {}

  /**
   * Safely convert string to ObjectId with validation
   */
  private toObjectId(id: string | Types.ObjectId, fieldName: string): Types.ObjectId {
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
  private async validateState(stateId: string, countryId: string): Promise<void> {
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
   * Generate unique EOI: "GP" + manufacturer_initial + 3-digit internal_id + 3-digit sequence
   * Format: GPMN012006
   * - internal_id: Extract number from gpInternalId, pad to 3 digits (e.g., "GP-12" → "012")
   * - sequence: Count existing products for manufacturer + 1, pad to 3 digits
   * No retries needed - deterministic generation
   */
  private async generateEOI(
    manufacturerId: string,
    session?: ClientSession,
  ): Promise<string> {
    const useSession = session && session.inTransaction() ? session : undefined;
    
    // Count existing products for this manufacturer
    const manufacturerObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
    const existingProductCount = await this.productModel
      .countDocuments(
        { manufacturerId: manufacturerObjectId },
        { session: useSession },
      )
      .exec();

    // Calculate next sequence number (existing count + 1)
    const sequence = existingProductCount + 1;
    
    return this.generateEOIWithCount(manufacturerId, sequence, session);
  }

  /**
   * Generate EOI with a specific sequence number
   * Used for bulk registration where we need to control the sequence
   */
  private async generateEOIWithCount(
    manufacturerId: string,
    sequence: number,
    session?: ClientSession,
  ): Promise<string> {
    // Get manufacturer details
    const manufacturer = await this.manufacturersService.findById(manufacturerId);
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
      console.warn(`No internal ID pattern found in gpInternalId: ${gpInternalId}, using '000'`);
      internalId = '000';
    }

    // Pad sequence to 3 digits
    const paddedSequence = sequence.toString().padStart(3, '0');

    // Generate EOI: GP + manufacturer_initial + 3-digit internal_id + 3-digit sequence
    const eoiNo = `GP${manufacturerInitial}${internalId}${paddedSequence}`;

    return eoiNo;
  }

  /**
   * Register a single product
   * Deterministic URN and EOI generation - no retries needed
   */
  async registerProduct(
    registerProductDto: RegisterProductDto,
    vendorId: string,
    manufacturerId: string,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      console.log('[Product Registration] Starting registration...');
      console.log('[Product Registration] Manufacturer ID:', manufacturerId);
      console.log('[Product Registration] Vendor ID:', vendorId);
      
      // Validate manufacturer ID
      const manufacturerObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Generate URN: "URN-" + YmdHis format (deterministic, no retries)
      const urnNo = this.generateURN();
      console.log('[Product Registration] Generated URN:', urnNo);

      // Generate EOI: "GP" + manufacturer_initial + 3-digit internal_id + 3-digit sequence
      console.log('[Product Registration] Generating EOI...');
      const eoiNo = await this.generateEOI(manufacturerId, session);
      console.log('[Product Registration] Generated EOI:', eoiNo);

      // Get next product ID
      const productId = await this.sequenceHelper.getProductId();

      // Get current date
      const now = new Date();

      // Validate and convert category ID
      const categoryObjectId = this.toObjectId(registerProductDto.categoryId, 'categoryId');

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
        const plantCountryObjectId = this.toObjectId(plantDto.countryId, 'countryId');
        await this.validateCountry(plantDto.countryId);

        // Validate and convert plant state ID
        const plantStateObjectId = this.toObjectId(plantDto.stateId, 'stateId');
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

        return {
          ...savedProduct.toObject(),
          plants: plants.map((p) => p.toObject()),
        };
      } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        // For validation errors, throw immediately with detailed message
        if (error instanceof NotFoundException || error instanceof BadRequestException) {
          console.error('Validation error:', error.message);
          throw error;
        }
        
        // Log the actual error for debugging
        console.error('Product registration error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);
        
        // Check for specific error types
        if (error.name === 'CastError' || error.message?.includes('Cast to ObjectId')) {
          throw new BadRequestException(`Invalid ID format provided: ${error.message}`);
        }
        
        // Return more detailed error message
        const errorMessage = error.message || 'Failed to register product';
        console.error('Throwing InternalServerErrorException with message:', errorMessage);
        throw new InternalServerErrorException(
          `${errorMessage}. Check server logs for details.`,
        );
      }
  }

  /**
   * Register multiple products (bulk)
   * Deterministic URN and EOI generation - no retries needed
   */
  async registerBulkProducts(
    bulkRegisterProductDto: BulkRegisterProductDto,
    vendorId: string,
    manufacturerId: string,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Validate manufacturer ID
      const manufacturerObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      const results = [];

      // Get initial product count for sequential EOI generation
      let currentProductCount = await this.productModel
        .countDocuments(
          { manufacturerId: manufacturerObjectId },
          { session },
        )
        .exec();

      for (let i = 0; i < bulkRegisterProductDto.products.length; i++) {
        const registerProductDto = bulkRegisterProductDto.products[i];
        
        // Generate URN: "URN-" + YmdHis format (deterministic, no retries)
        const urnNo = this.generateURN();

        // Generate EOI: Increment count for each product in bulk
        currentProductCount += 1;
        const eoiNo = await this.generateEOIWithCount(manufacturerId, currentProductCount, session);

        // Get next product ID
        const productId = await this.sequenceHelper.getProductId();

        // Get current date
        const now = new Date();

        // Validate and convert category ID
        const categoryObjectId = this.toObjectId(registerProductDto.categoryId, 'categoryId');

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
          const plantCountryObjectId = this.toObjectId(plantDto.countryId, 'countryId');
          await this.validateCountry(plantDto.countryId);

          // Validate and convert plant state ID
          const plantStateObjectId = this.toObjectId(plantDto.stateId, 'stateId');
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

      return results;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

        // For validation errors, throw immediately
        if (error instanceof NotFoundException || error instanceof BadRequestException) {
          throw error;
        }
        
        // Log the actual error for debugging
        console.error('Bulk product registration error:', error);
        console.error('Error stack:', error.stack);
        
        // Check for specific error types
        if (error.name === 'CastError' || error.message?.includes('Cast to ObjectId')) {
          throw new BadRequestException('Invalid ID format provided');
        }
        
        throw new InternalServerErrorException(
          error.message || 'Failed to register products. Please check the logs for details.',
        );
      }
  }

  /**
   * Update a product
   * If productName changes, regenerate URN and EOI
   */
  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
  ) {
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

      // Update product
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(
          productObjectId,
          updateData,
          { new: true, session },
        )
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException('Product not found after update');
      }

      await session.commitTransaction();
      session.endSession();

      return updatedProduct.toObject();
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      // Log the actual error for debugging
      console.error('Product update error:', error);
      console.error('Error stack:', error.stack);

      // Check for specific error types
      if (error.name === 'CastError' || error.message?.includes('Cast to ObjectId')) {
        throw new BadRequestException('Invalid product ID format');
      }

      throw new InternalServerErrorException(
        error.message || 'Failed to update product. Please check the logs for details.',
      );
    }
  }
}
