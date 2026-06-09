import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../schemas/product-plant.schema';
import {
  Category,
  CategoryDocument,
} from '../../categories/schemas/category.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import { matchActiveProductPlants, matchActiveProducts } from '../constants/active-product.filter';
import { AdminAddProductToUrnDto } from '../dto/admin-add-product-to-urn.dto';
import { EoiNumberService } from './eoi-number.service';
import { SequenceHelper } from '../helpers/sequence.helper';
import { CountriesService } from '../../countries/countries.service';
import { StatesService } from '../../states/states.service';
import { evaluateUrnAddProductEligibility } from '../helpers/admin-add-product-to-urn.util';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { AUDIT_ACTION } from '../../audit-log/audit-actions';
import {
  AUDIT_ACTION_TYPE,
  AUDIT_MODULE,
} from '../../audit-log/audit-friendlies';
import { invalidateProductListingsCache } from '../helpers/invalidate-product-listings-cache.util';
import { RedisService } from '../../common/redis/redis.service';
import { PlantDto } from '../dto/plant.dto';
import { assertStateBelongsToCountry } from '../helpers/validate-state-country.util';

@Injectable()
export class AdminAddProductToUrnService {
  private readonly logger = new Logger(AdminAddProductToUrnService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private readonly productPlantModel: Model<ProductPlantDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly eoiNumberService: EoiNumberService,
    private readonly sequenceHelper: SequenceHelper,
    private readonly countriesService: CountriesService,
    private readonly statesService: StatesService,
    private readonly auditLogService: AuditLogService,
    private readonly redisService: RedisService,
  ) {}

  async getAddProductContext(urnNo: string) {
    const trimmedUrn = urnNo.trim();
    const bundle = await this.loadUrnBundle(trimmedUrn);
    const eligibility = evaluateUrnAddProductEligibility({
      urnStatus: bundle.urnStatus,
      siblingProductStatuses: bundle.siblings.map((s) => Number(s.productStatus)),
    });
    const suggestedPlants = await this.loadSuggestedPlants(
      bundle.siblings[0]._id as Types.ObjectId,
    );

    return {
      success: true,
      urnNo: trimmedUrn,
      categoryId: String(bundle.categoryId),
      categoryName: bundle.categoryName,
      manufacturerId: String(bundle.manufacturerId),
      manufacturerName: bundle.manufacturerName,
      vendorId: String(bundle.vendorId),
      urnStatus: bundle.urnStatus,
      existingEoiCount: bundle.existingEoiCount,
      activeEoiCount: bundle.siblings.length,
      siblingProductStatuses: bundle.siblings.map((s) => Number(s.productStatus)),
      defaultProductStatus: eligibility.defaultProductStatus,
      canAddProduct: eligibility.canAddProduct,
      blockReason: eligibility.blockReason,
      suggestedPlants,
    };
  }

  async addProductToUrn(
    urnNo: string,
    dto: AdminAddProductToUrnDto,
    adminUserId: string,
  ) {
    const trimmedUrn = urnNo.trim();
    if (!dto.plants?.length) {
      throw new BadRequestException('At least one plant is required');
    }

    const bundle = await this.loadUrnBundle(trimmedUrn);
    const eligibility = evaluateUrnAddProductEligibility({
      urnStatus: bundle.urnStatus,
      siblingProductStatuses: bundle.siblings.map((s) => Number(s.productStatus)),
    });

    if (!eligibility.canAddProduct) {
      throw new BadRequestException(
        eligibility.blockReason ?? 'URN is not eligible for new products',
      );
    }

    const urnCategoryId = String(bundle.categoryId);
    if (dto.categoryId?.trim() && dto.categoryId.trim() !== urnCategoryId) {
      throw new BadRequestException('Category must match the URN category');
    }

    const urnStatusBefore = bundle.urnStatus;
    const manufacturerId = String(bundle.manufacturerId);
    const adminObjectId = new Types.ObjectId(adminUserId);
    const now = new Date();

    let created: {
      productObjectId: Types.ObjectId;
      numericProductId: number;
      eoiNo: string;
      productStatus: number;
    };

    try {
      await this.runInTransaction(async (session) => {
        const assignment = await this.eoiNumberService.assignNextActiveEoiNo(
          manufacturerId,
          session,
        );

        const numericProductId = await this.sequenceHelper.getProductId();
        const productData = {
          productId: numericProductId,
          categoryId: bundle.categoryId,
          vendorId: bundle.vendorId,
          manufacturerId: bundle.manufacturerId,
          eoiNo: assignment.eoiNo,
          eoiSequence: assignment.eoiSequence,
          urnNo: trimmedUrn,
          productName: dto.productName.trim(),
          productImage: dto.productImage?.trim() || undefined,
          plantCount: dto.plants.length,
          productDetails: dto.productDetails.trim(),
          productType: 0,
          productStatus: eligibility.defaultProductStatus,
          productRenewStatus: bundle.siblings[0].productRenewStatus ?? 0,
          urnStatus: urnStatusBefore,
          addedByAdminId: adminObjectId,
          createdDate: now,
          updatedDate: now,
        };

        const [savedProduct] = await this.productModel.create([productData], {
          session,
        });

        await this.createPlantsForProduct(
          savedProduct._id as Types.ObjectId,
          assignment.eoiNo,
          trimmedUrn,
          bundle,
          dto.plants,
          now,
          session,
        );

        created = {
          productObjectId: savedProduct._id as Types.ObjectId,
          numericProductId,
          eoiNo: assignment.eoiNo,
          productStatus: eligibility.defaultProductStatus,
        };
      });
    } catch (error) {
      if (this.isDuplicateEoiError(error)) {
        throw new ConflictException(
          'Could not assign EOI number; retry',
        );
      }
      throw error;
    }

    await invalidateProductListingsCache(this.redisService, this.logger);

    await this.auditLogService.record({
      occurred_at: now,
      action: AUDIT_ACTION.ADMIN_ADD_PRODUCT_TO_URN,
      outcome: 'success',
      module: AUDIT_MODULE.PRODUCT,
      action_type: AUDIT_ACTION_TYPE.CREATE,
      entity_name: created!.eoiNo,
      description: 'Admin added product to existing URN',
      performed_by: { user_id: adminUserId },
      new_values: {
        urnNo: trimmedUrn,
        productId: String(created!.productObjectId),
        eoiNo: created!.eoiNo,
        categoryId: urnCategoryId,
        productStatus: created!.productStatus,
        manufacturerId,
        adminUserId,
      },
      http_method: 'POST',
      route: `/api/admin/products/urn/${trimmedUrn}/add-product`,
      status_code: 201,
    });

    return {
      success: true,
      urnNo: trimmedUrn,
      productId: String(created!.productObjectId),
      eoiNo: created!.eoiNo,
      productStatus: created!.productStatus,
      categoryId: urnCategoryId,
      categoryName: bundle.categoryName,
      urnStatus: urnStatusBefore,
      message: 'Product added to URN.',
    };
  }

  private async loadUrnBundle(urnNo: string) {
    const siblings = await this.productModel
      .find({ urnNo, ...matchActiveProducts() })
      .sort({ createdDate: 1, productId: 1 })
      .lean()
      .exec();

    if (!siblings.length) {
      throw new NotFoundException(`No products found for URN ${urnNo}`);
    }

    const existingEoiCount = await this.productModel
      .countDocuments({ urnNo })
      .exec();

    const first = siblings[0];
    const categoryId = first.categoryId as Types.ObjectId;
    const manufacturerId = first.manufacturerId as Types.ObjectId;
    const vendorId = first.vendorId as Types.ObjectId;
    const urnStatus = Number(first.urnStatus ?? 0);

    const [category, manufacturer] = await Promise.all([
      this.categoryModel.findById(categoryId).lean().exec(),
      this.manufacturerModel.findById(manufacturerId).lean().exec(),
    ]);

    const categoryName =
      (category as { categoryName?: string; category_name?: string } | null)
        ?.categoryName ??
      (category as { category_name?: string } | null)?.category_name ??
      null;
    const manufacturerName =
      (manufacturer as { manufacturerName?: string } | null)?.manufacturerName ??
      null;

    return {
      siblings,
      existingEoiCount,
      categoryId,
      categoryName,
      manufacturerId,
      manufacturerName,
      vendorId,
      urnStatus,
    };
  }

  private async loadSuggestedPlants(productObjectId: Types.ObjectId) {
    const plants = await this.productPlantModel
      .find(matchActiveProductPlants({ productId: productObjectId }))
      .select('plantName plantLocation countryId stateId city')
      .limit(5)
      .lean()
      .exec();

    return plants.map((plant) => ({
      plantName: plant.plantName,
      plantLocation: plant.plantLocation,
      countryId: String(plant.countryId),
      stateId: String(plant.stateId),
      city: plant.city,
    }));
  }

  private async createPlantsForProduct(
    productObjectId: Types.ObjectId,
    eoiNo: string,
    urnNo: string,
    bundle: {
      categoryId: Types.ObjectId;
      vendorId: Types.ObjectId;
      manufacturerId: Types.ObjectId;
    },
    plants: PlantDto[],
    now: Date,
    session: ClientSession,
  ): Promise<void> {
    for (const plantDto of plants) {
      await this.validateCountry(plantDto.countryId);
      await this.validateState(plantDto.stateId, plantDto.countryId);

      const productPlantId = await this.sequenceHelper.getProductPlantId();
      await this.productPlantModel.create(
        [
          {
            productPlantId,
            productId: productObjectId,
            vendorId: bundle.vendorId,
            categoryId: bundle.categoryId,
            manufacturerId: bundle.manufacturerId,
            countryId: new Types.ObjectId(plantDto.countryId),
            stateId: new Types.ObjectId(plantDto.stateId),
            urnNo,
            eoiNo,
            plantName: plantDto.plantName.trim(),
            plantLocation: plantDto.plantLocation.trim(),
            city: plantDto.city.trim(),
            plantStatus: 1,
            createdDate: now,
          },
        ],
        { session },
      );
    }
  }

  private async validateCountry(countryId: string): Promise<void> {
    const country = await this.countriesService.findById(countryId);
    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }
  }

  private async validateState(stateId: string, countryId: string): Promise<void> {
    await assertStateBelongsToCountry(
      this.statesService,
      this.countriesService,
      stateId,
      countryId,
    );
  }

  private async runInTransaction(
    operation: (session: ClientSession) => Promise<void>,
  ): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await operation(session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private isDuplicateEoiError(error: unknown): boolean {
    const code = (error as { code?: number })?.code;
    return code === 11000;
  }
}
