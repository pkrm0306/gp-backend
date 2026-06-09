import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  Category,
  CategoryDocument,
} from '../categories/schemas/category.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import {
  RegisterProductDto,
  BulkRegisterProductDto,
} from './dto/register-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateUrnStatusDto } from './dto/update-urn-status.dto';
import { AdminUpdateUrnStatusDto } from './dto/admin-update-urn-status.dto';
import { ListProductsDto } from './dto/list-products.dto';
import { AdminListProductsDto } from './dto/admin-list-products.dto';
import { AdminListProductsFilterOptionsDto } from './dto/admin-list-products-filter-options.dto';
import { AdminProductsExportDto } from './dto/admin-products-export.dto';
import { SequenceHelper } from './helpers/sequence.helper';
import { computeNotifyDates } from './helpers/certification-dates.util';
import { formatAdminCertifiedProductPatchResponse } from './helpers/format-admin-certified-product-patch.util';
import { EoiNumberService } from './services/eoi-number.service';
import {
  matchActiveProductPlants,
  matchActiveProducts,
} from './constants/active-product.filter';
import { matchExpiredProducts } from './constants/expired-product.filter';
import { matchWebsitePublicCertifiedProducts } from './constants/website-public-product.filter';
import { AdminRenewValidityDto } from './dto/admin-renew-validity.dto';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { CountriesService } from '../countries/countries.service';
import { StatesService } from '../states/states.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import {
  activityLifecycleName,
  activityLifecycleResponsibility,
  ActivityLifecycleOwner,
  nextActivityLifecycleStatus,
} from '../activity-log/activity-lifecycle.constants';
import { formatPaymentRecords } from '../payments/payment-proposal.util';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { enrichUrnDetailRowsWithSharedProcessData } from './utils/consolidate-urn-detail-items.util';
import {
  filterFormaldehydeStyleProductsForVendorDisplay,
  filterHazardousProductsForVendorDisplay,
} from '../common/raw-materials/raw-materials-hazardous-display.util';
import { urnLookupMatchExpr } from './utils/urn-lookup-match.util';
import { RedisService } from '../common/redis/redis.service';
import { UrnSiteVisitsService } from '../urn-site-visits/urn-site-visits.service';
import { LifecycleNotificationService } from '../notifications/lifecycle-notification.service';
import { UrnTabReviewService } from './urn-tab-review.service';
import { AdminPatchCertifiedProductDto } from './dto/admin-patch-certified-product.dto';
import { VendorPatchCertifiedProductDto } from './dto/vendor-patch-certified-product.dto';
import { VendorProductChangeRequestDto } from './dto/vendor-product-change-request.dto';
import {
  normalizeProductNameForComparison,
  PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
  productNameEqualsFilter,
} from './helpers/product-name-uniqueness.util';
import { enrichMpManufacturingUnitCalculations } from '../process-mp-manufacturing-units/utils/mp-energy-consumption-calculations.util';
import { enrichWmManufacturingUnitCalculations } from '../process-wm-manufacturing-units/utils/wm-waste-disposal-calculations.util';
import { AdminUpdateProductChangeRequestDto } from './dto/admin-update-product-change-request.dto';
import { AdminUpdateCertifiedProductPassportDto } from './dto/admin-update-certified-product-passport.dto';
import {
  deleteUploadedFileByDocumentLink,
  resolveStoredUploadUrl,
  uploadCertifiedProductImage,
  uploadUrnAssessmentReport,
} from '../utils/upload-file.util';
import { ZohoDealsService } from '../zoho/services/zoho-deals.service';
import { EmailService } from '../common/services/email.service';
import {
  VendorProductChangeRequest,
  VendorProductChangeRequestDocument,
} from './schemas/vendor-product-change-request.schema';
import { PRODUCT_STATUS_CERTIFIED } from '../renew/constants/product-status.constants';
import { RENEWAL_URN_STATUS } from '../renew/constants/renewal-urn-status.constants';
import {
  getRenewalUrnStatusLabel,
  isRenewalUrnStatus,
} from '../renew/constants/renewal-urn-status.constants';

export type GetProductDetailsByUrnOptions = {
  /** Only certified EOIs (renewal flows). Excludes rejected and other statuses. */
  renewEligibleOnly?: boolean;
  /** Join states + countries on each product_plants row. */
  enrichPlantsWithGeo?: boolean;
};

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
  private readonly logger = new Logger(ProductRegistrationService.name);
  private readonly exportJobs = new Map<string, AdminExportJob>();
  private readonly exportDir = join(process.cwd(), 'uploads', 'exports');
  private readonly exportTtlMs = 24 * 60 * 60 * 1000;
  private readonly exportMaxRows = 200000;

  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private productPlantModel: Model<ProductPlantDocument>,
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(VendorProductChangeRequest.name)
    private vendorProductChangeRequestModel: Model<VendorProductChangeRequestDocument>,
    @InjectConnection() private connection: Connection,
    private sequenceHelper: SequenceHelper,
    private eoiNumberService: EoiNumberService,
    private manufacturersService: ManufacturersService,
    private countriesService: CountriesService,
    private statesService: StatesService,
    private activityLogService: ActivityLogService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly urnSiteVisitsService: UrnSiteVisitsService,
    private readonly lifecycleNotification: LifecycleNotificationService,
    private readonly urnTabReviewService: UrnTabReviewService,
    private readonly zohoDealsService: ZohoDealsService,
    private readonly emailService: EmailService,
  ) {}

  private async syncUrnProductsToZohoDeal(
    urnNo: string,
    manufacturerId: Types.ObjectId | string,
  ): Promise<void> {
    const normalizedUrn = String(urnNo ?? '').trim();
    if (!normalizedUrn) return;

    const products = await this.productModel
      .find(matchActiveProducts({ urnNo: normalizedUrn }))
      .select('productName productDetails')
      .sort({ createdDate: 1, productId: 1 })
      .lean()
      .exec();

    await this.zohoDealsService.syncDealProducts({
      manufacturerId: manufacturerId.toString(),
      urnNo: normalizedUrn,
      products: products.map((product) => ({
        productName: String(product.productName ?? '').trim(),
        productDetail: String(product.productDetails ?? '').trim(),
      })),
    });
  }

  private async syncDocumentReviewedStatusToZohoDeal(
    urnNo: string,
    manufacturerId: Types.ObjectId | string,
  ): Promise<void> {
    await this.zohoDealsService.updateDealStatus({
      manufacturerId: manufacturerId.toString(),
      status: 'Document Reviewed',
    });
  }

  private getProductListCacheTtlSeconds(): number {
    const ttl = parseInt(
      this.configService.get<string>('PRODUCT_LIST_CACHE_TTL_SECONDS') ||
        this.configService.get<string>('CACHE_TTL_SECONDS') ||
        '60',
      10,
    );
    return Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
  }

  private resolveVendorListProductStatuses(
    dto: ListProductsDto,
  ): number[] | null {
    const fromList =
      Array.isArray(dto.productStatusList) && dto.productStatusList.length > 0
        ? dto.productStatusList
        : Array.isArray(dto.product_status_list) &&
            dto.product_status_list.length > 0
          ? dto.product_status_list
          : null;
    if (fromList) {
      return fromList;
    }
    const single = dto.productStatus ?? dto.status;
    if (
      single !== undefined &&
      single !== null &&
      Number.isFinite(Number(single))
    ) {
      return [Number(single)];
    }
    return null;
  }

  /**
   * Plant state **name** substring filter for vendor EOI list: `state_name`, or `state` when not an ObjectId.
   */
  private resolveVendorListPlantStateNameSearch(
    dto: ListProductsDto,
  ): string | undefined {
    const explicit = dto.state_name != null ? String(dto.state_name).trim() : '';
    if (explicit) {
      return explicit;
    }
    const st = dto.state != null ? String(dto.state).trim() : '';
    if (st && !/^[a-fA-F0-9]{24}$/.test(st)) {
      return st;
    }
    return undefined;
  }

  /**
   * Product ids for this vendor whose plants match country / state name / city filters.
   * Returns `null` when no location filters are set.
   */
  private async findVendorProductIdsByPlantLocationFilters(
    manufacturerId: string,
    dto: ListProductsDto,
  ): Promise<Types.ObjectId[] | null> {
    const countryId = dto.countryId?.trim();
    const stateSearch = this.resolveVendorListPlantStateNameSearch(dto);
    const citySearch = dto.city?.trim();
    if (!countryId && !stateSearch && !citySearch) {
      return null;
    }

    const vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
    const plantMatch: Record<string, unknown> = {
      vendorId: vendorObjectId,
      ...matchActiveProductPlants(),
    };
    if (countryId) {
      plantMatch.countryId = this.toObjectId(countryId, 'countryId');
    }

    const pipeline: any[] = [
      { $match: plantMatch },
      {
        $lookup: {
          from: 'states',
          localField: 'stateId',
          foreignField: '_id',
          as: 'st',
        },
      },
      {
        $unwind: {
          path: '$st',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          stateName: {
            $ifNull: [
              '$st.stateName',
              { $ifNull: ['$st.state_name', '$st.name'] },
            ],
          },
        },
      },
    ];

    const postMatchParts: Record<string, unknown>[] = [];
    if (stateSearch) {
      postMatchParts.push({
        stateName: new RegExp(this.escapeRegexLiteral(stateSearch), 'i'),
      });
    }
    if (citySearch) {
      postMatchParts.push({
        city: new RegExp(this.escapeRegexLiteral(citySearch), 'i'),
      });
    }
    if (postMatchParts.length > 0) {
      pipeline.push({
        $match:
          postMatchParts.length === 1
            ? postMatchParts[0]
            : { $and: postMatchParts },
      });
    }

    pipeline.push({ $group: { _id: '$productId' } });

    const rows = await this.productPlantModel.aggregate(pipeline).exec();
    return rows.map((row) => row._id as Types.ObjectId);
  }

  /**
   * Countries dropdown + UI hints for vendor uncertified (EOI) list location filters.
   */
  async vendorGetUncertifiedListFilterOptions() {
    const countries = await this.countriesService.findAllForFilterOptions();
    const countryOptions = (countries ?? []).map((country) => {
      const c = country as {
        _id?: Types.ObjectId;
        countryName?: string;
        country_name?: string;
        name?: string;
      };
      const label =
        String(c.countryName ?? c.country_name ?? c.name ?? '').trim() ||
        'Country';
      return {
        value: String(c._id),
        label,
      };
    });

    return {
      message: 'Filter options retrieved successfully',
      data: {
        countries: countryOptions,
        filterControls: {
          countryId: {
            type: 'dropdown',
            label: 'Country',
            queryParam: 'countryId',
            optionsKey: 'countries',
          },
          state: {
            type: 'text',
            label: 'State',
            queryParam: 'state',
            placeholder: 'Search by state name',
          },
          city: {
            type: 'text',
            label: 'City',
            queryParam: 'city',
            placeholder: 'Search by city',
          },
        },
      },
    };
  }

  private buildVendorProductListCacheKey(
    listProductsDto: ListProductsDto,
    manufacturerId: string,
  ): string {
    const resolvedForKey = this.resolveVendorListProductStatuses(listProductsDto);
    const normalized = {
      manufacturerId,
      page: listProductsDto.page ?? 1,
      limit: listProductsDto.limit ?? 10,
      search: String(listProductsDto.search || '').trim().toLowerCase(),
      productStatuses:
        resolvedForKey === null
          ? 'default_0_1'
          : [...resolvedForKey].sort((a, b) => a - b),
      categoryId: listProductsDto.categoryId ?? null,
      dateFrom: listProductsDto.dateFrom ?? null,
      dateTo: listProductsDto.dateTo ?? null,
      countryId: listProductsDto.countryId ?? null,
      state: String(
        this.resolveVendorListPlantStateNameSearch(listProductsDto) || '',
      )
        .trim()
        .toLowerCase(),
      city: String(listProductsDto.city || '')
        .trim()
        .toLowerCase(),
      sort: listProductsDto.sort === 'asc' ? 'asc' : 'desc',
      v: 5,
    };
    return this.redisService.buildKey(
      'products',
      'list',
      'vendor',
      JSON.stringify(normalized),
    );
  }

  private buildAdminProductListCacheKey(dto: AdminListProductsDto): string {
    const resolvedStatus = (() => {
      for (const c of [dto.status, dto.productStatus, dto.product_status]) {
        if (Array.isArray(c) && c.length > 0) {
          return [...c].sort((a, b) => a - b);
        }
      }
      return [];
    })();
    const normalized = {
      page: dto.page ?? 1,
      limit: dto.limit ?? 10,
      order: (dto.order ?? dto.sortOrder) === 'asc' ? 'asc' : 'desc',
      sortBy: dto.sortBy ?? 'createdDate',
      groupBy: dto.groupBy ?? 'manufacturer',
      search: String(dto.search || '').trim().toLowerCase(),
      product_type: dto.product_type ?? null,
      categoryId: dto.categoryId ?? null,
      categoryIds: this.resolveAdminListCategoryIds(dto)?.join(',') ?? null,
      manufacturerId: dto.manufacturerId ?? null,
      manufacturerIds: this.resolveAdminListManufacturerIds(dto)?.join(',') ?? null,
      manufacturerNames:
        this.resolveAdminListManufacturerNames(dto)?.join('|') ?? null,
      countryId: this.resolveAdminListCountryId(dto) ?? null,
      stateId: this.resolveAdminListPlantStateObjectId(dto) ?? null,
      stateIds: this.resolveAdminListPlantStateObjectIds(dto)?.join(',') ?? null,
      stateNames: this.resolveAdminListPlantStateNames(dto)?.join('|') ?? null,
      state_name: String(dto.state_name || '').trim().toLowerCase(),
      stateLegacy: (() => {
        const s = dto.state != null ? String(dto.state).trim() : '';
        if (!s || /^[a-fA-F0-9]{24}$/.test(s)) return null;
        return s.toLowerCase();
      })(),
      city: String(dto.city || '').trim().toLowerCase(),
      cities: this.resolveAdminListCities(dto)?.join('|') ?? null,
      from: dto.from ?? dto.fromDate ?? null,
      to: dto.to ?? dto.toDate ?? null,
      validTillYear: dto.validTillYear ?? null,
      validTillYears:
        this.resolveAdminListValidTillYears(dto)?.join(',') ?? null,
      sectorIds: this.resolveAdminListSectorIds(dto)?.join(',') ?? null,
      status: resolvedStatus,
      v: 11,
    };
    return this.redisService.buildKey(
      'products',
      'list',
      'admin',
      JSON.stringify(normalized),
    );
  }

  private async invalidateProductListingsCache(): Promise<void> {
    await Promise.all([
      this.redisService.deleteByPattern(this.redisService.buildKey('products', 'list', 'vendor', '*')),
      this.redisService.deleteByPattern(this.redisService.buildKey('products', 'list', 'admin', '*')),
    ]).catch((error) => {
      this.logger.warn(
        `Failed to invalidate product listing caches: ${(error as Error)?.message || 'unknown error'}`,
      );
    });
  }

  private toMongoIdString(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    return String(value);
  }

  /** Multipart form flags (`1`, `true`, `yes`, `on`) sent as strings. */
  private multipartTruthy(value: unknown): boolean {
    const v = String(value ?? '').trim().toLowerCase();
    return v === '1' || v === 'true' || v === 'yes' || v === 'on';
  }

  private normalizeUrnForCompare(urn: string): string {
    return String(urn ?? '')
      .trim()
      .replace(/\/+$/g, '');
  }

  private urnValuesMatch(stored: string | undefined, provided: string): boolean {
    const normalizedStored = this.normalizeUrnForCompare(stored ?? '');
    const normalizedProvided = this.normalizeUrnForCompare(provided);
    if (!normalizedStored || !normalizedProvided) {
      return false;
    }
    return (
      normalizedStored === normalizedProvided ||
      `${normalizedStored}/` === normalizedProvided ||
      normalizedStored === `${normalizedProvided}/`
    );
  }

  /** Plant state Mongo id: `stateId` wins, else `state` when it is a 24-char hex id. */
  private resolveAdminListPlantStateObjectId(
    dto: AdminListProductsDto,
  ): string | undefined {
    for (const raw of [dto.stateId, dto.state] as const) {
      const s = raw != null ? String(raw).trim() : '';
      if (s && /^[a-fA-F0-9]{24}$/.test(s)) {
        return s;
      }
    }
    return undefined;
  }

  /**
   * Plant state **name** substring filter: explicit `state_name`, or `state` when it is not an ObjectId.
   */
  private resolveAdminListPlantStateNameSearch(dto: AdminListProductsDto): string | undefined {
    const explicit = dto.state_name != null ? String(dto.state_name).trim() : '';
    if (explicit) return explicit;
    const st = dto.state != null ? String(dto.state).trim() : '';
    if (st && !/^[a-fA-F0-9]{24}$/.test(st)) {
      return st;
    }
    return undefined;
  }

  private escapeRegexLiteral(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private resolveAdminListCategoryIds(dto: AdminListProductsDto): string[] | null {
    const multi = dto.categoryIds ?? dto.category_ids;
    if (Array.isArray(multi) && multi.length > 0) {
      return multi;
    }
    if (dto.categoryId) {
      return [dto.categoryId];
    }
    return null;
  }

  private resolveAdminListManufacturerIds(
    dto: AdminListProductsDto,
  ): string[] | null {
    const multi = dto.manufacturerIds ?? dto.manufacturer_ids;
    if (Array.isArray(multi) && multi.length > 0) {
      return multi;
    }
    if (dto.manufacturerId) {
      return [dto.manufacturerId];
    }
    return null;
  }

  private resolveAdminListManufacturerNames(
    dto: AdminListProductsDto,
  ): string[] | null {
    const multi = dto.manufacturerNames ?? dto.manufacturer_names;
    if (!Array.isArray(multi) || multi.length === 0) {
      return null;
    }
    const names = multi.map((n) => String(n).trim()).filter((n) => n.length > 0);
    return names.length > 0 ? names : null;
  }

  private resolveAdminListPlantStateObjectIds(
    dto: AdminListProductsDto,
  ): string[] | null {
    const multi = dto.stateIds ?? dto.state_ids;
    if (Array.isArray(multi) && multi.length > 0) {
      return multi;
    }
    const single = this.resolveAdminListPlantStateObjectId(dto);
    return single ? [single] : null;
  }

  private resolveAdminListPlantStateNames(
    dto: AdminListProductsDto,
  ): string[] | null {
    const multi = dto.stateNames ?? dto.state_names;
    if (Array.isArray(multi) && multi.length > 0) {
      const names = multi.map((n) => String(n).trim()).filter((n) => n.length > 0);
      return names.length > 0 ? names : null;
    }
    const single = this.resolveAdminListPlantStateNameSearch(dto);
    return single ? [single] : null;
  }

  private resolveAdminListCountryId(
    dto: AdminListProductsDto,
  ): string | undefined {
    const raw = dto.countryId ?? dto.country_id;
    const s = raw != null ? String(raw).trim() : '';
    return s || undefined;
  }

  private resolveAdminListCities(dto: AdminListProductsDto): string[] | null {
    if (Array.isArray(dto.cities) && dto.cities.length > 0) {
      const cities = dto.cities
        .map((c) => String(c).trim())
        .filter((c) => c.length > 0);
      return cities.length > 0 ? cities : null;
    }
    const city = String(dto.city ?? dto.city_name ?? '').trim();
    if (city) {
      return [city];
    }
    return null;
  }

  private resolveAdminListValidTillYears(dto: AdminListProductsDto): number[] | null {
    const multi = dto.validTillYears ?? dto.valid_till_years;
    if (Array.isArray(multi) && multi.length > 0) {
      const years = [...new Set(multi.map((y) => Number(y)).filter((y) => Number.isFinite(y)))];
      return years.length > 0 ? years : null;
    }
    if (dto.validTillYear !== undefined) {
      return [dto.validTillYear];
    }
    return null;
  }

  /** Resolves sector filter from list DTO (multi list wins over single id). */
  private resolveAdminListSectorIds(dto: AdminListProductsDto): number[] | null {
    const multi = dto.sectorIds ?? dto.sector_ids;
    if (Array.isArray(multi) && multi.length > 0) {
      const uniq = [...new Set(multi.map((n) => Number(n)).filter((n) => Number.isFinite(n)))];
      return uniq.length > 0 ? uniq : null;
    }
    const single = dto.sectorId ?? dto.sector_id;
    if (single === undefined || single === null) {
      return null;
    }
    const n = Number(single);
    return Number.isFinite(n) ? [n] : null;
  }

  /** Admin list EOI row — flat fields only; product description is `productDetails` (string). */
  private formatAdminListEoiEntry(e: Record<string, unknown>) {
    const plants = Array.isArray(e?.plants) ? (e.plants as Record<string, unknown>[]) : [];
    const mongoId = this.toMongoIdString(e?._id);
    const urnNo =
      e?.urnNo !== undefined && e?.urnNo !== null ? String(e.urnNo) : undefined;

    const productStatus = Number(e?.productStatus ?? 0);
    const urnWorkflowStatus = Number(e?.urnStatus ?? 0);
    const statusLabel = this.mapVendorProductStatusLabel(
      productStatus,
      e?.validtillDate as Date | string | null | undefined,
    );
    const sectorRaw = e?.sector;
    const sectorNum =
      sectorRaw === null || sectorRaw === undefined || sectorRaw === ''
        ? null
        : Number(sectorRaw);
    const sectorNameRaw = e?.sectorName;

    return {
      _id: mongoId,
      productMongoId: mongoId,
      productId: e?.productId,
      eoiNo: e?.eoiNo,
      urnNo,
      urn_number: urnNo,
      productName: e?.productName,
      productDetails: e?.productDetails ?? null,
      categoryName: e?.categoryName,
      manufacturerName: e?.manufacturerName,
      sector: sectorNum != null && Number.isFinite(sectorNum) ? sectorNum : null,
      sectorName:
        sectorNameRaw != null && String(sectorNameRaw).trim() !== ''
          ? String(sectorNameRaw).trim()
          : null,
      /** EOI lifecycle code on `products.productStatus` (this is what list `status` filters). */
      productStatus,
      /** URN workflow step from `products.urnStatus` (separate from EOI productStatus). */
      urnWorkflowStatus,
      createdDate: e?.createdDate,
      plantDetails: plants.map((p) => ({
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
      })),
      statusLabel,
      categoryId: this.toMongoIdString(e?.categoryId),
      productImage:
        e?.productImage != null && String(e.productImage).trim() !== ''
          ? String(e.productImage).trim()
          : null,
      validtillDate: e?.validtillDate ?? null,
      validTill: e?.validtillDate ?? null,
      validTillDate: e?.validtillDate ?? null,
      valid_till_date: e?.validtillDate ?? null,
    };
  }

  /**
   * URN rollup from child EOI productStatus codes.
   * Returns numeric status code (0..4):
   * 0 Pending, 1 Submitted, 2 Certified, 3 Rejected, 4 Expired
   */
  private deriveAdminUrnStatus(codes: number[]): 0 | 1 | 2 | 3 | 4 {
    if (codes.includes(3)) return 3;
    if (codes.includes(4)) return 4;
    if (codes.includes(2)) return 2;
    if (codes.includes(1)) return 1;
    return 0;
  }

  private mapUrnRollupStatusLabel(
    status: 0 | 1 | 2 | 3 | 4,
  ): 'Pending' | 'Submitted' | 'Certified' | 'Rejected' | 'Expired' {
    switch (status) {
      case 1:
        return 'Submitted';
      case 2:
        return 'Certified';
      case 3:
        return 'Rejected';
      case 4:
        return 'Expired';
      default:
        return 'Pending';
    }
  }

  private resolveAdminListStatusFilter(dto: AdminListProductsDto): number[] {
    for (const c of [dto.status, dto.productStatus, dto.product_status]) {
      if (Array.isArray(c) && c.length > 0) {
        return c.map((s) => Number(s)).filter((s) => Number.isFinite(s));
      }
    }
    return [];
  }

  private isAdminRejectedOnlyListFilter(dto: AdminListProductsDto): boolean {
    const statuses = this.resolveAdminListStatusFilter(dto);
    const regularStatuses = statuses.filter((s) => s !== 4);
    return regularStatuses.length === 1 && regularStatuses[0] === 3;
  }

  private async enrichAdminRejectedListUrns(
    grouped: Array<{ urns?: Array<Record<string, unknown>> }>,
  ): Promise<void> {
    const urnNos = [
      ...new Set(
        grouped.flatMap((m) =>
          (m.urns ?? [])
            .map((u) => String(u.urnNo ?? u.urn_number ?? '').trim())
            .filter(Boolean),
        ),
      ),
    ];
    if (!urnNos.length) {
      return;
    }

    const [certifiedRows, rejectedRows] = await Promise.all([
      this.productModel
        .aggregate<{ _id: string; count: number }>([
          {
            $match: {
              urnNo: { $in: urnNos },
              productStatus: 2,
              ...matchActiveProducts(),
            },
          },
          { $group: { _id: '$urnNo', count: { $sum: 1 } } },
        ])
        .exec(),
      this.productModel
        .aggregate<{ _id: string; count: number }>([
          {
            $match: {
              urnNo: { $in: urnNos },
              productStatus: 3,
              ...matchActiveProducts(),
            },
          },
          { $group: { _id: '$urnNo', count: { $sum: 1 } } },
        ])
        .exec(),
    ]);

    const certifiedByUrn = new Map(
      certifiedRows.map((row) => [row._id, row.count] as const),
    );
    const rejectedByUrn = new Map(
      rejectedRows.map((row) => [row._id, row.count] as const),
    );

    for (const manufacturer of grouped) {
      for (const urn of manufacturer.urns ?? []) {
        const urnNo = String(urn.urnNo ?? urn.urn_number ?? '').trim();
        const certifiedProductCount = certifiedByUrn.get(urnNo) ?? 0;
        const rejectedProductCount =
          rejectedByUrn.get(urnNo) ??
          (Array.isArray(urn.eois) ? urn.eois.length : Number(urn.totalEoi ?? 0));
        const hasCertifiedProducts = certifiedProductCount > 0;
        urn.hasCertifiedProducts = hasCertifiedProducts;
        urn.certifiedProductCount = certifiedProductCount;
        urn.rejectedProductCount = rejectedProductCount;
        urn.allowedTargets = hasCertifiedProducts
          ? ['certified']
          : ['uncertified', 'certified'];
      }
    }
  }

  private formatAdminListUrnGroup(urn: {
    urnNo: string;
    createdDate: Date;
    totalEoi: number;
    statusCodes: number[];
    eoiDocs: Record<string, unknown>[];
  }) {
    const eoiSummaryStatusCode = this.deriveAdminUrnStatus(urn.statusCodes ?? []);
    const eoiSummaryStatusLabel = this.mapUrnRollupStatusLabel(
      eoiSummaryStatusCode,
    );
    const eois = (urn.eoiDocs ?? []).map((e) =>
      this.formatAdminListEoiEntry(e ?? {}),
    );
    return {
      urn_number: urn.urnNo,
      urnNo: urn.urnNo,
      total_eoi: urn.totalEoi,
      totalEoi: urn.totalEoi,
      /** Rollup from child EOI `productStatus` codes — not manufacturer / vendor status. */
      eoiSummaryStatus: eoiSummaryStatusLabel,
      eoiSummaryStatusCode,
      eoiSummaryStatusLabel,
      /** @deprecated Same as `eoiSummaryStatus`; name is misleading (not DB `urnStatus`). */
      urnStatus: eoiSummaryStatusLabel,
      urnStatusCode: eoiSummaryStatusCode,
      urnStatusLabel: eoiSummaryStatusLabel,
      status: eoiSummaryStatusLabel,
      statusCode: eoiSummaryStatusCode,
      statusLabel: eoiSummaryStatusLabel,
      created_at: urn.createdDate,
      createdDate: urn.createdDate,
      eois,
    };
  }

  private formatRenewAdminListUrnGroup(urn: {
    urnNo: string;
    createdDate: Date;
    totalEoi: number;
    urn_status: number;
    eoiDocs: Record<string, unknown>[];
  }) {
    const workflowStatus = Number(urn.urn_status ?? 0);
    const urnStatusLabel = isRenewalUrnStatus(workflowStatus)
      ? getRenewalUrnStatusLabel(workflowStatus)
      : `URN status ${workflowStatus}`;
    const eois = (urn.eoiDocs ?? []).map((e) =>
      this.formatAdminListEoiEntry(e ?? {}),
    );
    return {
      urn_number: urn.urnNo,
      urnNo: urn.urnNo,
      total_eoi: urn.totalEoi,
      totalEoi: urn.totalEoi,
      urnStatus: workflowStatus,
      urn_status: workflowStatus,
      urnStatusCode: workflowStatus,
      urnStatusLabel,
      status: urnStatusLabel,
      statusCode: workflowStatus,
      statusLabel: urnStatusLabel,
      created_at: urn.createdDate,
      createdDate: urn.createdDate,
      eois,
    };
  }

  private formatRenewAdminListManufacturerGroup(m: {
    manufacturer_id: Types.ObjectId | string;
    manufacturerName?: string;
    manufacturer_name?: string;
    vendor_email?: string;
    vendor_phone?: string;
    total_urns: number;
    total_eois: number;
    urns: Array<{
      urnNo: string;
      createdDate: Date;
      totalEoi: number;
      urn_status: number;
      eoiDocs: Record<string, unknown>[];
    }>;
  }) {
    const manufacturerName = String(
      m.manufacturerName ?? m.manufacturer_name ?? '',
    ).trim() || 'Unknown Manufacturer';
    const email = String(m.vendor_email ?? '').trim();
    const phone = String(m.vendor_phone ?? '').trim();
    const urns = (m.urns ?? [])
      .map((u) => this.formatRenewAdminListUrnGroup(u))
      .sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
      );
    return {
      manufacturer_id: String(m.manufacturer_id),
      manufacturerName,
      manufacturer_name: manufacturerName,
      vendor_email: email,
      vendor_phone: phone,
      email,
      phone,
      total_urns: m.total_urns ?? 0,
      total_eois: m.total_eois ?? 0,
      urns,
    };
  }

  private formatAdminListManufacturerGroup(m: {
    manufacturer_id: Types.ObjectId | string;
    manufacturerName?: string;
    manufacturer_name?: string;
    vendor_email?: string;
    vendor_phone?: string;
    total_urns: number;
    total_eois: number;
    urns: Array<{
      urnNo: string;
      createdDate: Date;
      totalEoi: number;
      statusCodes: number[];
      eoiDocs: Record<string, unknown>[];
    }>;
  }) {
    const urns = (m.urns ?? [])
      .map((u) => this.formatAdminListUrnGroup(u))
      .sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
      );
    const manufacturerName = String(
      m.manufacturerName ?? m.manufacturer_name ?? '',
    ).trim();
    const email = String(m.vendor_email ?? '').trim();
    const phone = String(m.vendor_phone ?? '').trim();
    return {
      manufacturer_id: String(m.manufacturer_id),
      manufacturerName,
      /** @deprecated Use manufacturerName — kept for older admin clients */
      manufacturer_name: manufacturerName,
      vendor_email: email,
      vendor_phone: phone,
      email,
      phone,
      total_urns: m.total_urns ?? 0,
      total_eois: m.total_eois ?? 0,
      urns,
    };
  }

  private mapProductDetailsVendorContactSlot(
    slot?: Record<string, unknown> | null,
  ) {
    if (!slot) {
      return {
        name: '',
        email_id: '',
        phone_number: '',
        designation: '',
      };
    }
    return {
      name: String(slot.name ?? '').trim(),
      email_id: String(slot.email_id ?? '').trim(),
      phone_number: String(slot.phone_number ?? '').trim(),
      designation: String(slot.designation ?? '').trim(),
    };
  }

  /**
   * Manufacturer + vendor org profile for URN product details (admin / vendor).
   * Vendor contact fields live on the manufacturers collection.
   */
  private formatCategoryForUrnDetails(
    category: Record<string, unknown> | null | undefined,
  ): Record<string, unknown> | null {
    if (!category) {
      return null;
    }
    const name =
      category.categoryName ?? category.category_name ?? null;
    return {
      _id: category._id,
      categoryId: category._id,
      categoryName: name,
      category_name: name,
      sector: category.sector ?? null,
    };
  }

  private formatProductDetailsPlants(
    plants: Array<Record<string, unknown>> | undefined,
  ): Array<Record<string, unknown>> {
    return (plants ?? []).map((p) => {
      const stateDoc = Array.isArray(p.state)
        ? (p.state[0] as Record<string, unknown> | undefined)
        : (p.state as Record<string, unknown> | undefined);
      const countryDoc = Array.isArray(p.country)
        ? (p.country[0] as Record<string, unknown> | undefined)
        : (p.country as Record<string, unknown> | undefined);
      return {
        _id: p._id,
        productPlantId: p.productPlantId,
        productId: p.productId,
        vendorId: p.vendorId,
        categoryId: p.categoryId,
        manufacturerId: p.manufacturerId,
        urnNo: p.urnNo,
        eoiNo: p.eoiNo,
        plantName: p.plantName,
        plantLocation: p.plantLocation,
        countryId: p.countryId,
        stateId: p.stateId,
        city: p.city,
        plantStatus: p.plantStatus,
        stateName:
          stateDoc?.stateName ??
          stateDoc?.name ??
          p.stateName ??
          null,
        countryName:
          countryDoc?.countryName ??
          countryDoc?.name ??
          p.countryName ??
          null,
        createdDate: p.createdDate,
      };
    });
  }

  private buildProductPlantsLookupStage(options: {
    enrichPlantsWithGeo: boolean;
    /** When true, also match plants by urnNo (renew details fallback). */
    matchPlantsByUrn?: boolean;
  }): Record<string, unknown> {
    const { enrichPlantsWithGeo, matchPlantsByUrn = false } = options;
    const productMatchExpr = matchPlantsByUrn
      ? {
          $or: [
            { $eq: ['$productId', '$$productId'] },
            { $eq: ['$urnNo', '$$urnNo'] },
          ],
        }
      : { $eq: ['$productId', '$$productId'] };

    const plantMatchStages: Record<string, unknown>[] = [
      {
        $match: {
          $expr: {
            $and: [productMatchExpr, { $ne: ['$is_deleted', true] }],
          },
        },
      },
      { $sort: { createdDate: 1 } },
    ];

    if (enrichPlantsWithGeo) {
      plantMatchStages.push(
        {
          $lookup: {
            from: 'states',
            localField: 'stateId',
            foreignField: '_id',
            as: 'state',
          },
        },
        {
          $lookup: {
            from: 'countries',
            localField: 'countryId',
            foreignField: '_id',
            as: 'country',
          },
        },
      );
    }

    return {
      $lookup: {
        from: 'product_plants',
        let: { productId: '$_id', urnNo: '$urnNo' },
        pipeline: plantMatchStages,
        as: 'plants',
      },
    };
  }

  /** Active product_plants for a URN with states/countries (admin renew / quick view). */
  async listProductPlantsWithGeoForUrn(
    urnNo: string,
  ): Promise<Array<Record<string, unknown>>> {
    const trimmed = urnNo.trim();
    if (!trimmed) {
      return [];
    }

    const rows = await this.productPlantModel
      .aggregate([
        { $match: matchActiveProductPlants({ urnNo: trimmed }) },
        {
          $lookup: {
            from: 'states',
            localField: 'stateId',
            foreignField: '_id',
            as: 'state',
          },
        },
        {
          $lookup: {
            from: 'countries',
            localField: 'countryId',
            foreignField: '_id',
            as: 'country',
          },
        },
        { $sort: { createdDate: 1 } },
      ])
      .exec();

    return this.formatProductDetailsPlants(
      rows as Array<Record<string, unknown>>,
    );
  }

  /**
   * Manufacturer + plants for a URN (used when aggregation rows are missing joins).
   */
  async getManufacturerAndPlantsForUrn(urnNo: string): Promise<{
    manufacturer: Record<string, unknown> | null;
    manufacturing_details: Record<string, unknown> | null;
    plants: Array<Record<string, unknown>>;
  }> {
    const trimmed = urnNo.trim();
    const plants = await this.listProductPlantsWithGeoForUrn(trimmed);

    const product = await this.productModel
      .findOne(matchActiveProducts({ urnNo: trimmed }))
      .select('manufacturerId')
      .lean()
      .exec();

    const manufacturerId = product?.manufacturerId;
    let manufacturer: Record<string, unknown> | null = null;
    if (manufacturerId) {
      const doc = await this.manufacturerModel.findById(manufacturerId).lean().exec();
      manufacturer = this.formatProductDetailsManufacturer(
        doc as Record<string, unknown> | null,
      );
    }

    return {
      manufacturer,
      manufacturing_details: manufacturer,
      plants,
    };
  }

  /**
   * Ensures renew/cert URN detail rows include joined manufacturer and product_plants.
   */
  async enrichUrnDetailRowsWithManufacturerAndPlants(
    urnNo: string,
    rows: Array<Record<string, unknown>>,
  ): Promise<Array<Record<string, unknown>>> {
    if (!rows.length) {
      return rows;
    }

    const trimmedUrn = urnNo.trim();
    const urnPlants = trimmedUrn
      ? await this.listProductPlantsWithGeoForUrn(trimmedUrn)
      : [];

    let sharedManufacturer: Record<string, unknown> | null = null;
    for (const row of rows) {
      const formatted = this.formatProductDetailsManufacturer(
        row.manufacturer as Record<string, unknown> | null | undefined,
      );
      if (formatted?.manufacturerName) {
        sharedManufacturer = formatted;
        break;
      }
    }

    if (!sharedManufacturer) {
      const urnBundle = await this.getManufacturerAndPlantsForUrn(trimmedUrn);
      sharedManufacturer = urnBundle.manufacturer;
    }

    return rows.map((row) => {
      const pd = row.product_details as Record<string, unknown> | undefined;
      const productOid = pd?._id ?? row._id;
      const eoiNo = pd?.eoiNo ?? row.eoiNo;
      const existingPlants = row.plants as Array<Record<string, unknown>> | undefined;

      let plants =
        Array.isArray(existingPlants) && existingPlants.length > 0
          ? existingPlants
          : urnPlants.filter((plant) => {
              if (productOid && String(plant.productId) === String(productOid)) {
                return true;
              }
              if (eoiNo && String(plant.eoiNo) === String(eoiNo)) {
                return true;
              }
              return false;
            });

      if (plants.length === 0 && rows.length === 1) {
        plants = urnPlants;
      }

      const rowManufacturer = this.formatProductDetailsManufacturer(
        row.manufacturer as Record<string, unknown> | null | undefined,
      );
      const manufacturer =
        rowManufacturer?.manufacturerName != null &&
        String(rowManufacturer.manufacturerName).trim() !== ''
          ? rowManufacturer
          : sharedManufacturer;

      return {
        ...row,
        manufacturer: manufacturer ?? null,
        manufacturing_details: manufacturer ?? row.manufacturing_details ?? null,
        plants,
        plant_details: plants,
      };
    });
  }

  private formatProductDetailsManufacturer(
    manufacturer: Record<string, unknown> | null | undefined,
  ) {
    if (!manufacturer) {
      return null;
    }

    const technicalContact = this.mapProductDetailsVendorContactSlot(
      manufacturer.technicalContact as Record<string, unknown> | undefined,
    );
    const marketingContact = this.mapProductDetailsVendorContactSlot(
      manufacturer.marketingContact as Record<string, unknown> | undefined,
    );

    const vendor_details = {
      companyName: String(manufacturer.manufacturerName ?? '').trim(),
      name: String(manufacturer.vendor_name ?? '').trim(),
      designation: String(manufacturer.vendor_designation ?? '').trim(),
      email: String(manufacturer.vendor_email ?? '').trim(),
      vendor_email: String(manufacturer.vendor_email ?? '').trim(),
      phone: String(manufacturer.vendor_phone ?? '').trim(),
      vendor_phone: String(manufacturer.vendor_phone ?? '').trim(),
      mobile: String(manufacturer.vendor_phone ?? '').trim(),
      website: String(manufacturer.vendor_website ?? '').trim(),
      vendor_website: String(manufacturer.vendor_website ?? '').trim(),
      gst: String(manufacturer.vendor_gst ?? '').trim(),
      vendor_gst: String(manufacturer.vendor_gst ?? '').trim(),
      gstPdf: manufacturer.vendorGstPdf ?? null,
      companyLogo: manufacturer.companyLogo ?? null,
      companySize: String(manufacturer.companySize ?? '').trim(),
      panNumber: manufacturer.vendorPan ?? null,
      pan: manufacturer.vendorPanDocument ?? null,
      vendor_status: manufacturer.vendor_status ?? 0,
      technicalContact,
      marketingContact,
    };

    return {
      _id: manufacturer._id,
      manufacturerName: manufacturer.manufacturerName ?? '',
      gpInternalId: manufacturer.gpInternalId ?? null,
      manufacturerInitial: manufacturer.manufacturerInitial ?? null,
      manufacturerStatus: manufacturer.manufacturerStatus ?? 0,
      manufacturerImage: manufacturer.manufacturerImage ?? null,
      companyLogo: manufacturer.companyLogo ?? null,
      companySize: manufacturer.companySize ?? '',
      vendor_name: manufacturer.vendor_name ?? '',
      vendor_email: manufacturer.vendor_email ?? '',
      vendor_phone: manufacturer.vendor_phone ?? '',
      vendor_website: manufacturer.vendor_website ?? '',
      vendor_designation: manufacturer.vendor_designation ?? '',
      vendor_gst: manufacturer.vendor_gst ?? '',
      vendorGstPdf: manufacturer.vendorGstPdf ?? null,
      gstPdf: manufacturer.vendorGstPdf ?? null,
      vendor_status: manufacturer.vendor_status ?? 0,
      vendorPan: manufacturer.vendorPan ?? null,
      vendorPanDocument: manufacturer.vendorPanDocument ?? null,
      panNumber: manufacturer.vendorPan ?? null,
      pan: manufacturer.vendorPanDocument ?? null,
      technicalContact,
      marketingContact,
      createdAt: manufacturer.createdAt ?? null,
      updatedAt: manufacturer.updatedAt ?? null,
      vendor_details,
    };
  }

  private formatProductPerformanceForUrnDetails(
    raw: Record<string, unknown> | null | undefined,
    testReportRows: Array<Record<string, unknown>> = [],
  ): Record<string, unknown> | null {
    if (!raw && testReportRows.length === 0) {
      return null;
    }

    const testReports =
      testReportRows.length > 0
        ? testReportRows.map((r) => ({
            _id: r._id,
            productPerformanceTestReportId: r.productPerformanceTestReportId,
            productName: String(r.productName ?? ''),
            testReportFileName: String(r.testReportFileName ?? ''),
          }))
        : Array.isArray(raw?.testReports)
          ? (raw.testReports as Array<Record<string, unknown>>).map((row) => ({
              _id: row._id,
              productPerformanceTestReportId: row.productPerformanceTestReportId,
              productName: String(row.productName ?? ''),
              testReportFileName: String(row.testReportFileName ?? ''),
            }))
          : [];

    return {
      _id: raw?._id,
      processProductPerformanceId: raw?.processProductPerformanceId,
      urnNo: raw?.urnNo,
      vendorId: raw?.vendorId,
      testReportFiles: raw?.testReportFiles ?? 0,
      testReports,
      renewalType: raw?.renewalType ?? 0,
      productPerformanceStatus: raw?.productPerformanceStatus ?? 0,
      createdDate: raw?.createdDate,
      updatedDate: raw?.updatedDate,
    };
  }

  private formatProductDesignForUrnDetails(
    raw: Record<string, unknown> | null | undefined,
    measureRows: Array<Record<string, unknown>> = [],
  ): Record<string, unknown> | null {
    if (!raw && measureRows.length === 0) {
      return null;
    }

    const strategiesText = String(
      raw?.statergies ?? raw?.strategies ?? '',
    ).trim();

    const measuresAndBenefits =
      measureRows.length > 0
        ? measureRows.map((m) => ({
            _id: m._id,
            productDesignMeasureId: m.productDesignMeasureId,
            measuresImplemented: String(m.measures ?? m.measuresImplemented ?? ''),
            benefitsAchieved: String(m.benefits ?? m.benefitsAchieved ?? ''),
          }))
        : Array.isArray(raw?.measuresAndBenefits)
          ? (raw.measuresAndBenefits as Array<Record<string, unknown>>).map(
              (row) => ({
                measuresImplemented: String(row.measuresImplemented ?? ''),
                benefitsAchieved: String(row.benefitsAchieved ?? ''),
                _id: row._id,
                productDesignMeasureId: row.productDesignMeasureId,
              }),
            )
          : [];

    return {
      _id: raw?._id,
      productDesignId: raw?.productDesignId,
      urnNo: raw?.urnNo,
      ecoVisionUpload: raw?.ecoVisionUpload ?? 0,
      statergies: strategiesText,
      strategies: strategiesText,
      productDesignSupportingDocument:
        raw?.productDesignSupportingDocument ?? 0,
      productDesignStatus: raw?.productDesignStatus ?? 0,
      measuresAndBenefits,
      createdDate: raw?.createdDate,
      updatedDate: raw?.updatedDate,
    };
  }

  private formatProductDetailsVendor(
    manufacturer: Record<string, unknown> | null | undefined,
    vendorFromCollection: Record<string, unknown> | null | undefined,
  ) {
    if (vendorFromCollection) {
      return {
        _id: vendorFromCollection._id,
        vendorName: vendorFromCollection.vendorName,
        vendorEmail: vendorFromCollection.vendorEmail,
        vendorPhone: vendorFromCollection.vendorPhone,
        vendorDesignation: vendorFromCollection.vendorDesignation,
        vendorGst: vendorFromCollection.vendorGst,
        vendorStatus: vendorFromCollection.vendorStatus,
      };
    }
    if (!manufacturer) {
      return null;
    }
    return {
      _id: manufacturer._id,
      vendorName:
        manufacturer.vendor_name ?? manufacturer.manufacturerName ?? '',
      vendorEmail: manufacturer.vendor_email ?? '',
      vendorPhone: manufacturer.vendor_phone ?? '',
      vendorDesignation: manufacturer.vendor_designation ?? '',
      vendorGst: manufacturer.vendor_gst ?? '',
      vendorStatus: manufacturer.vendor_status ?? 0,
      vendor_details: this.formatProductDetailsManufacturer(manufacturer)
        ?.vendor_details,
    };
  }

  /** Flatten manufacturer-grouped or legacy URN-grouped list rows for export. */
  private flattenAdminListForExport(data: any[]): {
    urnRows: any[];
    eoiRows: any[];
  } {
    const urnRows: any[] = [];
    const eoiRows: any[] = [];

    for (const item of data ?? []) {
      if (item?.manufacturer_id && Array.isArray(item.urns)) {
        const groupManufacturerName =
          item.manufacturerName ?? item.manufacturer_name ?? '';
        const groupVendorEmail = String(item.vendor_email ?? item.email ?? '').trim();
        const groupVendorPhone = String(item.vendor_phone ?? item.phone ?? '').trim();
        for (const u of item.urns) {
          urnRows.push({
            ...u,
            manufacturerName: groupManufacturerName,
            vendor_email: groupVendorEmail,
            vendor_phone: groupVendorPhone,
            email: groupVendorEmail,
            phone: groupVendorPhone,
          });
          for (const e of u.eois ?? []) {
            eoiRows.push({
              ...e,
              urnNo: e.urnNo ?? u.urnNo ?? u.urn_number,
              manufacturerName: e.manufacturerName ?? groupManufacturerName,
              vendor_email: groupVendorEmail,
              vendor_phone: groupVendorPhone,
              email: groupVendorEmail,
              phone: groupVendorPhone,
            });
          }
        }
        continue;
      }
      if (item?.urnNo) {
        urnRows.push(item);
        for (const e of item.eois ?? []) {
          eoiRows.push({
            ...e,
            urnNo: e.urnNo ?? item.urnNo,
            manufacturerName: e.manufacturerName ?? '',
          });
        }
      }
    }

    return { urnRows, eoiRows };
  }

  /** Vendor EOI list — productStatus labels for uncertified / lifecycle UI. */
  private mapVendorProductStatusLabel(
    productStatus: number,
    validtillDate?: Date | string | null,
  ): 'Pending' | 'Submitted' | 'Certified' | 'Rejected' | 'Expired' {
    const now = new Date();
    if (productStatus === 4) {
      return 'Expired';
    }
    if (productStatus === 2 && validtillDate) {
      const vt = new Date(validtillDate);
      if (!Number.isNaN(vt.getTime()) && vt < now) {
        return 'Expired';
      }
    }
    switch (productStatus) {
      case 1:
        return 'Submitted';
      case 2:
        return 'Certified';
      case 3:
        return 'Rejected';
      default:
        return 'Pending';
    }
  }

  /** Vendor URN row rollup from child productStatus codes (returns numeric 0..4). */
  private deriveVendorUrnStatus(codes: number[]): 0 | 1 | 2 | 3 | 4 {
    if (codes.includes(3)) return 3;
    if (codes.includes(4)) return 4;
    if (codes.includes(2)) return 2;
    if (codes.includes(1)) return 1;
    return 0;
  }

  private formatVendorListEoiEntry(e: Record<string, unknown>) {
    const productStatus = Number(e?.productStatus ?? 0);
    const sectorRaw = e?.sector;
    const sectorNum =
      sectorRaw === null || sectorRaw === undefined || sectorRaw === ''
        ? null
        : Number(sectorRaw);
    return {
      _id: e?._id,
      eoiNo: e?.eoiNo,
      productName: e?.productName,
      categoryName: e?.categoryName ?? null,
      productStatus,
      statusLabel: this.mapVendorProductStatusLabel(
        productStatus,
        e?.validtillDate as Date | string | null | undefined,
      ),
      validtillDate: e?.validtillDate ?? null,
      validTill: e?.validtillDate ?? null,
      createdDate: e?.createdDate,
      hpUnits: Number(e?.plantCount ?? 0),
      plantCount: Number(e?.plantCount ?? 0),
      /** First plant (by createdDate) — manufacturing location for this EOI. */
      city: e?.city != null && String(e.city).trim() !== '' ? String(e.city).trim() : null,
      stateName:
        e?.stateName != null && String(e.stateName).trim() !== ''
          ? String(e.stateName).trim()
          : null,
      /** Category sector id + resolved label from `sectors` collection. */
      sector: sectorNum != null && Number.isFinite(sectorNum) ? sectorNum : null,
      sectorName:
        e?.sectorName != null && String(e.sectorName).trim() !== ''
          ? String(e.sectorName).trim()
          : null,
    };
  }

  /**
   * Vendor uncertified EOI list — filters on **`products.productStatus`** (EOI list status), not manufacturer/vendor status.
   * When `statuses` is omitted or empty, defaults to **Pending (0) + Submitted (1)** only.
   * Code **4** = expired (`productStatus` 4 discontinued, or `productStatus` 2 with `validtillDate` in the past).
   * Explicit **2** alone (no 4) = active certified only (`validtillDate` null or not yet passed).
   */
  private buildVendorListProductStatusMatch(
    statuses: number[] | null | undefined,
  ): Record<string, unknown> {
    const now = new Date();
    const explicit = Array.isArray(statuses) && statuses.length > 0;
    const effective = explicit ? statuses! : [0, 1];

    const includeExpired = effective.includes(4);
    const regularStatuses = effective.filter((s) => s !== 4);

    /** Certified (2) without expired (4): active certificates only. */
    if (
      explicit &&
      regularStatuses.length === 1 &&
      regularStatuses[0] === 2 &&
      !includeExpired
    ) {
      return {
        productStatus: 2,
        $or: [
          { validtillDate: null },
          { validtillDate: { $exists: false } },
          { validtillDate: { $gte: now } },
        ],
      };
    }

    if (includeExpired && regularStatuses.length > 0) {
      return {
        $or: [
          { productStatus: { $in: regularStatuses } },
          matchExpiredProducts(now),
        ],
      };
    }
    if (includeExpired) {
      return matchExpiredProducts(now);
    }
    if (regularStatuses.length === 1) {
      return { productStatus: regularStatuses[0] };
    }
    return { productStatus: { $in: regularStatuses } };
  }

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

  /** Set a date field only when a non-empty ISO value was provided. */
  private applyOptionalDateField(
    target: Record<string, unknown>,
    field: string,
    value?: string,
  ): void {
    if (value === undefined || value === null || String(value).trim() === '') {
      return;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`Invalid date for ${field}`);
    }
    target[field] = parsed;
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
   * Activity log labels and responsibility owners are shared with payments and dashboard progress.
   */
  private getActivityName(urnStatus: number): string {
    return activityLifecycleName(urnStatus);
  }

  /** Next timeline step id from the canonical activity lifecycle. */
  private getNextActivityIdForLog(currentStatus: number): number {
    return nextActivityLifecycleStatus(currentStatus);
  }

  /** Responsibility owner by status for activity timeline rows. */
  private getResponsibilityForStatus(status: number): ActivityLifecycleOwner {
    return activityLifecycleResponsibility(status);
  }

  /**
   * Get next activity name based on current urnStatus
   */
  private getNextActivityName(urnStatus: number): string {
    return this.getActivityName(this.getNextActivityIdForLog(urnStatus));
  }

  /**
   * Vendor panel compatibility: "submit for review" actions should always move URN to 4.
   * Some clients still send stale updateStatusTo values; normalize here to avoid wrong stage transitions.
   */
  private resolveVendorRequestedUrnStatus(
    updateStatusType: string | undefined,
    updateStatusTo: number,
  ): number {
    const type = String(updateStatusType ?? '')
      .trim()
      .toLowerCase();
    if (
      type === 'submit_for_review' ||
      type === 'submit-for-review' ||
      type === 'process_form_submit' ||
      type === 'process-form-submit' ||
      type === 'process_form_submitted'
    ) {
      return 4;
    }
    return updateStatusTo;
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
    return this.eoiNumberService.generateNextEoiNo(manufacturerId, session);
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
    return this.eoiNumberService.buildEoiNo(
      manufacturerId,
      manufacturerProductCount,
      session,
    );
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
        // urnStatus is 0 (Product Registration), next step is 1 (Product Approve/Reject)
        try {
          await this.activityLogService.logActivity({
            vendor_id: manufacturerId,
            manufacturer_id: manufacturerId,
            urn_no: urnNo,
            activities_id: 0, // Current urnStatus
            activity: this.getActivityName(0), // "Product Registration"
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

        await this.invalidateProductListingsCache();
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

        const initialMaxActiveSequence =
          await this.eoiNumberService.getMaxActiveSequenceSuffix(
            manufacturerObjectId,
            session,
          );

        console.log(
          '[Bulk Product Registration] Initial max active EOI sequence:',
          initialMaxActiveSequence,
        );

        const results = [];

        // Process each product in the bulk upload
        for (let i = 0; i < bulkRegisterProductDto.products.length; i++) {
          const registerProductDto = bulkRegisterProductDto.products[i];

          const manufacturerProductCount = initialMaxActiveSequence + i + 1;

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
        // urnStatus is 0 (Product Registration), next step is 1 (Product Approve/Reject)
        try {
          await this.activityLogService.logActivity({
            vendor_id: manufacturerId,
            manufacturer_id: manufacturerId,
            urn_no: urnNo,
            activities_id: 0, // Current urnStatus
            activity: this.getActivityName(0), // "Product Registration"
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
        await this.invalidateProductListingsCache();
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
   * Update an existing product in place (admin EOI edit).
   * URN and EOI are immutable — body urnNo/eoiNo must match the document.
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

      if (
        !this.urnValuesMatch(existingProduct.urnNo, updateProductDto.urnNo)
      ) {
        throw new BadRequestException(
          'urnNo does not match this product',
        );
      }

      const providedEoi = String(updateProductDto.eoiNo ?? '').trim();
      const storedEoi = String(existingProduct.eoiNo ?? '').trim();
      if (!providedEoi || providedEoi !== storedEoi) {
        throw new BadRequestException(
          'eoiNo does not match this product',
        );
      }

      const previousUrnStatus = existingProduct.urnStatus;

      const nextProductName = normalizeProductNameForComparison(
        updateProductDto.productName,
      );
      const storedProductName = normalizeProductNameForComparison(
        existingProduct.productName,
      );
      if (
        nextProductName &&
        nextProductName.localeCompare(storedProductName, undefined, {
          sensitivity: 'accent',
        }) !== 0
      ) {
        await this.assertProductNameIsUnique(
          nextProductName,
          productObjectId,
          'productName',
        );
      }

      const updateData: any = {
        updatedDate: new Date(),
        productName: updateProductDto.productName,
        productDetails: updateProductDto.productDetails,
      };

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

      this.applyOptionalDateField(
        updateData,
        'certifiedDate',
        updateProductDto.certifiedDate,
      );
      this.applyOptionalDateField(
        updateData,
        'validtillDate',
        updateProductDto.validtillDate,
      );

      let syncValidityToUrn = false;
      if (updateProductDto.validtillDate !== undefined) {
        const newValidTill = updateData.validtillDate as Date | undefined;
        if (newValidTill) {
          const previous = existingProduct.validtillDate
            ? new Date(existingProduct.validtillDate).getTime()
            : null;
          const nextTime = newValidTill.getTime();
          if (previous !== nextTime) {
            const notify = computeNotifyDates(newValidTill);
            updateData.firstNotifyDate = notify.firstNotifyDate;
            updateData.secondNotifyDate = notify.secondNotifyDate;
            updateData.thirdNotifyDate = notify.thirdNotifyDate;
            syncValidityToUrn = true;
          }
        }
      } else {
        this.applyOptionalDateField(
          updateData,
          'firstNotifyDate',
          updateProductDto.firstNotifyDate,
        );
        this.applyOptionalDateField(
          updateData,
          'secondNotifyDate',
          updateProductDto.secondNotifyDate,
        );
        this.applyOptionalDateField(
          updateData,
          'thirdNotifyDate',
          updateProductDto.thirdNotifyDate,
        );
      }
      this.applyOptionalDateField(
        updateData,
        'renewedDate',
        updateProductDto.renewedDate,
      );

      if (updateProductDto.categoryId !== undefined) {
        const categoryObjectId = this.toObjectId(
          updateProductDto.categoryId,
          'categoryId',
        );
        const categoryExists = await this.categoryModel
          .findById(categoryObjectId)
          .session(session)
          .select('_id')
          .lean()
          .exec();
        if (!categoryExists) {
          throw new BadRequestException('Category not found');
        }
        updateData.categoryId = categoryObjectId;
      }

      // Update product
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(productObjectId, updateData, { new: true, session })
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException('Product not found after update');
      }

      if (updateProductDto.categoryId !== undefined) {
        await this.productPlantModel
          .updateMany(
            matchActiveProductPlants({ productId: productObjectId }),
            {
              $set: {
                categoryId: updateData.categoryId,
              },
            },
            { session },
          )
          .exec();
      }

      if (syncValidityToUrn) {
        const urnNo = String(existingProduct.urnNo ?? '').trim();
        if (urnNo) {
          await this.productModel
            .updateMany(
              matchActiveProducts({
                urnNo,
                productStatus: 2,
              }),
              {
                $set: {
                  validtillDate: updateData.validtillDate,
                  firstNotifyDate: updateData.firstNotifyDate,
                  secondNotifyDate: updateData.secondNotifyDate,
                  thirdNotifyDate: updateData.thirdNotifyDate,
                  updatedDate: new Date(),
                },
              },
              { session },
            )
            .exec();
        }
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

      await this.invalidateProductListingsCache();
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
   * Admin: edit a certified product (productStatus === 2 only).
   * Updates name, description, category, valid till, and optional image; reuses updateProduct transaction logic.
   */
  private buildUrnAssessmentReportDocumentPayload(
    assessmentReportUrl: string,
    documentOriginalName?: string,
  ) {
    const link = String(assessmentReportUrl ?? '').trim();
    const originalName =
      String(documentOriginalName ?? '').trim() ||
      link.replace(/\\/g, '/').split('/').filter(Boolean).pop() ||
      'Assessment report';
    return {
      documentForm: 'certification_admin',
      documentFormSubsection: 'assessment_report',
      documentLink: link,
      documentOriginalName: originalName,
    };
  }

  async adminUploadUrnAssessmentReport(
    urnNo: string,
    file: Express.Multer.File,
  ): Promise<{
    urnNo: string;
    assessmentReportUrl: string;
    assessmentReportFileName: string;
    assessmentReport: {
      documentForm: string;
      documentFormSubsection: string;
      documentLink: string;
      documentOriginalName: string;
    };
    urnAssessmentReport: {
      documentForm: string;
      documentFormSubsection: string;
      documentLink: string;
      documentOriginalName: string;
    };
  }> {
    const trimmedUrn = String(urnNo ?? '').trim();
    if (!trimmedUrn) {
      throw new BadRequestException('URN number is required');
    }

    const products = await this.productModel
      .find(matchActiveProducts({ urnNo: trimmedUrn }))
      .select('_id urnStatus assessmentReportUrl')
      .lean()
      .exec();

    if (!products.length) {
      throw new NotFoundException('No products found for this URN');
    }

    const urnStatus = Math.max(
      ...products.map((row) => Number(row.urnStatus ?? 0)),
    );
    if (urnStatus < 11) {
      throw new BadRequestException(
        'Assessment report can only be uploaded after certification is complete',
      );
    }

    const uploaded = await uploadUrnAssessmentReport(file, trimmedUrn);
    const assessmentReportUrl =
      resolveStoredUploadUrl(uploaded.fileUrl) || uploaded.fileUrl;

    const previousUrl = String(
      products.find((row) => row.assessmentReportUrl)?.assessmentReportUrl ??
        '',
    ).trim();
    if (previousUrl && previousUrl !== assessmentReportUrl) {
      await deleteUploadedFileByDocumentLink(previousUrl);
    }

    await this.productModel
      .updateMany(matchActiveProducts({ urnNo: trimmedUrn }), {
        $set: {
          assessmentReportUrl,
          updatedDate: new Date(),
        },
      })
      .exec();

    const assessmentReport = this.buildUrnAssessmentReportDocumentPayload(
      assessmentReportUrl,
      String(file.originalname ?? '').trim() || uploaded.fileName,
    );

    await this.invalidateProductListingsCache();

    return {
      urnNo: trimmedUrn,
      assessmentReportUrl,
      assessmentReportFileName: uploaded.fileName,
      assessmentReport,
      urnAssessmentReport: assessmentReport,
    };
  }

  async adminPatchCertifiedProduct(
    productId: string,
    dto: AdminPatchCertifiedProductDto,
    imageFile?: Express.Multer.File,
  ) {
    const productObjectId = this.toObjectId(productId, 'productId');
    const existing = await this.productModel
      .findById(productObjectId)
      .select('productStatus urnNo eoiNo')
      .lean()
      .exec();

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    if (Number(existing.productStatus) !== 2) {
      throw new BadRequestException(
        'Only certified products (productStatus 2) can be edited from the admin certified list',
      );
    }

    const existingImage = String(
      (await this.productModel
        .findById(productObjectId)
        .select('productImage')
        .lean()
        .exec())?.productImage ?? '',
    ).trim();

    const removeImage =
      this.multipartTruthy(dto.remove_image) ||
      this.multipartTruthy(dto.delete_image);

    let productImage: string | undefined;
    if (imageFile) {
      const uploaded = await uploadCertifiedProductImage(imageFile);
      productImage = uploaded.fileUrl;
      if (existingImage && existingImage !== productImage) {
        await deleteUploadedFileByDocumentLink(existingImage);
      }
    } else if (removeImage) {
      productImage = '';
      if (existingImage) {
        await deleteUploadedFileByDocumentLink(existingImage);
      }
    }

    const validTillRaw = dto.validtillDate ?? dto.validTillDate;
    const updateDto: UpdateProductDto = {
      productName: dto.productName.trim(),
      productDetails: dto.productDetails,
      urnNo: String(dto.urnNo).trim(),
      eoiNo: String(dto.eoiNo).trim(),
      categoryId: dto.categoryId,
      validtillDate: validTillRaw,
      ...(productImage !== undefined ? { productImage } : {}),
    };

    await this.updateProduct(productId, updateDto);

    const row = await this.productModel
      .findById(productObjectId)
      .select(
        '_id urnNo eoiNo productName productDetails categoryId productImage productStatus validtillDate updatedDate',
      )
      .lean()
      .exec();

    if (!row) {
      throw new NotFoundException('Product not found after update');
    }

    return formatAdminCertifiedProductPatchResponse(
      row as Record<string, unknown>,
      (value) => this.toMongoIdString(value),
    );
  }

  async adminUpdateCertifiedProductPassport(
    productId: string,
    dto: AdminUpdateCertifiedProductPassportDto,
  ) {
    const productObjectId = this.toObjectId(productId, 'productId');
    const passport = String(dto.passport ?? '');
    const nonWhitespaceLength = passport.replace(/\s+/g, '').length;

    if (nonWhitespaceLength === 0) {
      throw new BadRequestException(
        'Passport content is required (whitespace-only content is not allowed)',
      );
    }

    const updated = await this.productModel
      .findOneAndUpdate(
        matchActiveProducts({
          _id: productObjectId,
          productStatus: 2,
        }),
        {
          $set: {
            productPassport: passport,
            updatedDate: new Date(),
          },
        },
        { new: true },
      )
      .select(
        '_id urnNo eoiNo productName productStatus productPassport updatedDate',
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException(
        'Certified product not found. Passport is allowed only for certified products',
      );
    }

    await this.invalidateProductListingsCache();

    return {
      _id: this.toMongoIdString(updated._id),
      urnNo: String(updated.urnNo ?? ''),
      eoiNo: String(updated.eoiNo ?? ''),
      productName: String(updated.productName ?? ''),
      productStatus: Number(updated.productStatus ?? 0),
      passport: String(updated.productPassport ?? ''),
      nonWhitespaceLength,
      updatedDate: updated.updatedDate ?? null,
    };
  }

  async getPublicCertifiedProductPassport(productId: string) {
    const productObjectId = this.toObjectId(productId, 'productId');
    const row = await this.productModel
      .findOne(
        matchActiveProducts({
          _id: productObjectId,
          productStatus: 2,
        }),
      )
      .select(
        '_id urnNo eoiNo productName productImage validtillDate productPassport productStatus',
      )
      .lean()
      .exec();

    if (!row) {
      throw new NotFoundException('Certified product not found');
    }

    const productImageRaw = row.productImage ? String(row.productImage).trim() : '';
    const productImage = productImageRaw
      ? resolveStoredUploadUrl(productImageRaw) || productImageRaw
      : null;

    return {
      _id: this.toMongoIdString(row._id),
      urnNo: String(row.urnNo ?? ''),
      eoiNo: String(row.eoiNo ?? ''),
      productName: String(row.productName ?? ''),
      productImage,
      productImageUrl: productImage,
      validtillDate: row.validtillDate ?? null,
      passport: String(row.productPassport ?? ''),
      productStatus: Number(row.productStatus ?? 0),
    };
  }

  /**
   * Map a state row to its parent country Mongo _id (supports legacy country_id / country_code / country_name).
   */
  private resolveCountryMongoIdForState(
    state: Record<string, unknown>,
    countryMongoIds: Set<string>,
    countryByNumericId: Map<number, string>,
    countryByCode: Map<string, string>,
    countryByName: Map<string, string>,
  ): string | null {
    const objectIdRaw = state.countryId;
    if (objectIdRaw) {
      const key = String(objectIdRaw);
      if (countryMongoIds.has(key)) {
        return key;
      }
    }

    const numericCountryId = Number(state.country_id);
    if (Number.isFinite(numericCountryId) && countryByNumericId.has(numericCountryId)) {
      return countryByNumericId.get(numericCountryId) ?? null;
    }

    const code = String(state.country_code ?? '')
      .trim()
      .toUpperCase();
    if (code && countryByCode.has(code)) {
      return countryByCode.get(code) ?? null;
    }

    const countryName = String(state.country_name ?? '')
      .trim()
      .toLowerCase();
    if (countryName && countryByName.has(countryName)) {
      return countryByName.get(countryName) ?? null;
    }

    return null;
  }

  /**
   * Public website filter panel: active categories + country/state tree (from DB).
   */
  async getPublicCertifiedWebsiteFilterOptions() {
    const categoryIdsWithProducts = await this.productModel
      .distinct('categoryId', matchWebsitePublicCertifiedProducts())
      .exec();

    const categories =
      categoryIdsWithProducts.length > 0
        ? await this.categoryModel
            .find({
              _id: { $in: categoryIdsWithProducts },
              category_status: 1,
            })
            .select('_id category_name')
            .sort({ category_name: 1 })
            .lean()
            .exec()
        : [];

    const categoryOptions = categories.map((c) => ({
      id: String(c._id),
      label: String((c as { category_name?: string }).category_name ?? '').trim() ||
        'Category',
    }));

    const [countries, states] = await Promise.all([
      this.countriesService.findAllForFilterOptions(),
      this.statesService.findAllForFilterOptions(),
    ]);

    const countryMongoIds = new Set<string>();
    const countryByNumericId = new Map<number, string>();
    const countryByCode = new Map<string, string>();
    const countryByName = new Map<string, string>();

    for (const country of countries ?? []) {
      const c = country as {
        _id?: Types.ObjectId;
        id?: number;
        countryName?: string;
        country_name?: string;
        name?: string;
        countryCode?: string;
        country_code?: string;
        iso2?: string;
        iso3?: string;
      };
      const mongoId = String(c._id);
      countryMongoIds.add(mongoId);

      if (c.id != null && Number.isFinite(Number(c.id))) {
        countryByNumericId.set(Number(c.id), mongoId);
      }

      const codes = [c.countryCode, c.country_code, c.iso2, c.iso3]
        .map((v) => String(v ?? '').trim().toUpperCase())
        .filter(Boolean);
      for (const code of codes) {
        countryByCode.set(code, mongoId);
      }

      const names = [c.countryName, c.country_name, c.name]
        .map((v) => String(v ?? '').trim().toLowerCase())
        .filter(Boolean);
      for (const name of names) {
        countryByName.set(name, mongoId);
      }
    }

    const statesByCountry = new Map<string, Array<{ id: string; label: string }>>();
    for (const countryId of countryMongoIds) {
      statesByCountry.set(countryId, []);
    }

    let statesLinked = 0;
    let statesUnmapped = 0;

    for (const state of states ?? []) {
      const s = state as Record<string, unknown>;
      const stateLabel = String(
        s.stateName ?? s.state_name ?? s.name ?? '',
      ).trim();
      if (!stateLabel) {
        statesUnmapped++;
        continue;
      }

      const countryKey = this.resolveCountryMongoIdForState(
        s,
        countryMongoIds,
        countryByNumericId,
        countryByCode,
        countryByName,
      );
      if (!countryKey) {
        statesUnmapped++;
        continue;
      }

      statesLinked++;
      const bucket = statesByCountry.get(countryKey) ?? [];
      bucket.push({ id: String(s._id), label: stateLabel });
      statesByCountry.set(countryKey, bucket);
    }

    for (const [, list] of statesByCountry) {
      list.sort((a, b) => a.label.localeCompare(b.label));
    }

    const countryStateTree = (countries ?? [])
      .map((country) => {
        const c = country as {
          _id?: Types.ObjectId;
          countryName?: string;
          country_name?: string;
          name?: string;
        };
        const id = String(c._id);
        const label = String(
          c.countryName ?? c.country_name ?? c.name ?? '',
        ).trim();
        return {
          id,
          label,
          type: 'country' as const,
          children: (statesByCountry.get(id) ?? []).map((state) => ({
            id: state.id,
            label: state.label,
            type: 'state' as const,
            parentId: id,
          })),
        };
      })
      .filter((c) => c.label.length > 0)
      .sort((a, b) => a.label.localeCompare(b.label));

    const countriesWithStates = countryStateTree.filter(
      (c) => c.children.length > 0,
    ).length;

    return {
      categories: categoryOptions,
      countryStateTree,
      totals: {
        countries: countryStateTree.length,
        countriesWithStates,
        statesInDatabase: (states ?? []).length,
        statesLinked,
        statesUnmapped,
      },
    };
  }

  /**
   * Typeahead for public certified product search bar (min 2 chars).
   */
  async searchPublicCertifiedProducts(q: string, limit = 15) {
    const term = String(q ?? '').trim();
    if (term.length < 2) {
      return [];
    }

    const rx = new RegExp(this.escapeRegexLiteral(term), 'i');
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 30) : 15;

    const rows = await this.productModel
      .aggregate([
        {
          $match: {
            ...matchActiveProducts(),
            productStatus: 2,
            $or: [
              { productName: rx },
              { eoiNo: rx },
              { urnNo: rx },
            ],
          },
        },
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
          $match: {
            $or: [
              { productName: rx },
              { eoiNo: rx },
              { urnNo: rx },
              { 'manufacturer.manufacturerName': rx },
            ],
          },
        },
        { $sort: { productName: 1 } },
        { $limit: safeLimit },
        {
          $project: {
            _id: 0,
            id: { $toString: '$_id' },
            productId: 1,
            productName: 1,
            eoiNo: 1,
            urnNo: 1,
            productImage: {
              $ifNull: ['$productImage', '$product_image'],
            },
            categoryImage: {
              $ifNull: ['$category.category_image', '$category.categoryImage'],
            },
          },
        },
      ])
      .exec();

    return rows ?? [];
  }

  /**
   * Product ids that have at least one active plant matching country / state / city filters.
   * Returns null when no location filter is set; [] when filter is set but nothing matches.
   */
  private async findAdminListProductIdsByPlantLocation(
    dto: AdminListProductsDto,
  ): Promise<Types.ObjectId[] | null> {
    const countryId = this.resolveAdminListCountryId(dto);
    const stateIds = this.resolveAdminListPlantStateObjectIds(dto);
    const cities = this.resolveAdminListCities(dto);
    const hasCountry = Boolean(countryId);
    const hasStates = Boolean(stateIds && stateIds.length > 0);
    const hasCities = Boolean(cities && cities.length > 0);
    if (!hasCountry && !hasStates && !hasCities) {
      return null;
    }

    const plantMatch: Record<string, unknown> = {
      ...matchActiveProductPlants(),
    };
    if (hasStates) {
      plantMatch.stateId = {
        $in: stateIds!.map((id) => this.toObjectId(id, 'stateId')),
      };
    }
    if (hasCountry) {
      plantMatch.countryId = this.toObjectId(countryId!, 'countryId');
    }
    if (hasCities) {
      if (cities!.length === 1) {
        plantMatch.city = new RegExp(
          this.escapeRegexLiteral(cities![0]),
          'i',
        );
      } else {
        plantMatch.$or = cities!.map((city) => ({
          city: new RegExp(this.escapeRegexLiteral(city), 'i'),
        }));
      }
    }

    const productIds = await this.productPlantModel
      .distinct('productId', plantMatch)
      .exec();
    if (!productIds.length) {
      return [];
    }

    const statuses = (() => {
      for (const c of [dto.status, dto.productStatus, dto.product_status]) {
        if (Array.isArray(c) && c.length > 0) {
          return c;
        }
      }
      return [];
    })();

    const productQuery: Record<string, unknown> = {
      _id: { $in: productIds },
      ...matchActiveProducts(),
    };

    if (statuses.length > 0) {
      const now = new Date();
      const includeExpired = statuses.includes(4);
      const regularStatuses = statuses.filter((s) => s !== 4);
      if (includeExpired && regularStatuses.length > 0) {
        productQuery.$or = [
          { productStatus: { $in: regularStatuses } },
          {
            productStatus: 2,
            validtillDate: { $exists: true, $ne: null, $lt: now },
          },
        ];
      } else if (includeExpired) {
        productQuery.productStatus = 2;
        productQuery.validtillDate = { $exists: true, $ne: null, $lt: now };
      } else if (regularStatuses.length === 1) {
        productQuery.productStatus = regularStatuses[0];
      } else {
        productQuery.productStatus = { $in: regularStatuses };
      }
    }

    const rows = await this.productModel
      .find(productQuery)
      .select('_id')
      .lean()
      .exec();

    return rows.map((row) => row._id as Types.ObjectId);
  }

  /** Certified-only alias used by the public website product grid. */
  private async findCertifiedProductIdsByPlantLocation(
    dto: AdminListProductsDto,
  ): Promise<Types.ObjectId[] | null> {
    return this.findAdminListProductIdsByPlantLocation({
      ...dto,
      status: [2],
    });
  }

  /**
   * Flat certified product cards for public website grid (not URN/manufacturer groups).
   */
  async listPublicCertifiedProductsFlat(
    dto: AdminListProductsDto,
    productId?: string,
  ) {
    const listDto: AdminListProductsDto = {
      ...dto,
      status: [2],
    };
    const locationProductIds =
      await this.findCertifiedProductIdsByPlantLocation(listDto);
    if (locationProductIds !== null && locationProductIds.length === 0) {
      const page = listDto.page ?? 1;
      const limit = listDto.limit ?? 10;
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const { page, limit, skip, sortOrder, rowBase, urnSortField } =
      this.buildAdminListRowBase(listDto, locationProductIds);

    let pipeline: any[] = [...rowBase];
    const trimmedProductId = String(productId ?? '').trim();
    if (trimmedProductId) {
      pipeline = [
        {
          $match: {
            _id: this.toObjectId(trimmedProductId, 'productId'),
          },
        },
        ...pipeline,
      ];
    }

    const sortField = urnSortField;
    const dataPipeline: any[] = [
      ...pipeline,
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          productId: 1,
          eoiNo: 1,
          urnNo: 1,
          productName: 1,
          productDetails: 1,
          productImage: {
            $ifNull: ['$productImage', '$product_image'],
          },
          categoryImage: {
            $ifNull: ['$category.category_image', '$category.categoryImage'],
          },
          validtillDate: 1,
          categoryId: { $toString: '$categoryId' },
          categoryName: {
            $ifNull: ['$category.categoryName', '$category.category_name'],
          },
          manufacturerName: '$manufacturer.manufacturerName',
          sectorName: '$_adminSectorDoc.name',
          plants: 1,
        },
      },
    ];

    const facetResult = await this.productModel
      .aggregate([
        {
          $facet: {
            data: dataPipeline,
            total: [...pipeline, { $count: 'count' }],
          },
        },
      ])
      .exec();

    const payload = facetResult[0] ?? { data: [], total: [] };
    const total = payload.total?.[0]?.count ?? 0;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

    return {
      data: payload.data ?? [],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async vendorPatchCertifiedProduct(
    productId: string,
    dto: VendorPatchCertifiedProductDto,
    manufacturerId: string,
    imageFile?: Express.Multer.File,
  ) {
    const productObjectId = this.toObjectId(productId, 'productId');
    const vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');

    const existing = await this.productModel
      .findOne({
        _id: productObjectId,
        vendorId: vendorObjectId,
      })
      .select('_id productStatus')
      .lean()
      .exec();

    if (!existing) {
      throw new NotFoundException(
        'Certified product not found for this vendor',
      );
    }

    if (Number(existing.productStatus) !== 2) {
      throw new BadRequestException(
        'Only certified products (productStatus 2) can be edited from vendor certified list',
      );
    }

    const existingImage = String(
      (await this.productModel
        .findOne({
          _id: productObjectId,
          vendorId: vendorObjectId,
        })
        .select('productImage')
        .lean()
        .exec())?.productImage ?? '',
    ).trim();

    let productImage: string | undefined;
    if (imageFile) {
      const uploaded = await uploadCertifiedProductImage(imageFile);
      productImage = uploaded.fileUrl;
      if (existingImage && existingImage !== productImage) {
        await deleteUploadedFileByDocumentLink(existingImage);
      }
    }

    const productName =
      dto.productName !== undefined
        ? normalizeProductNameForComparison(dto.productName)
        : undefined;
    const productDetails = dto.productDetails;
    const hasAnyField =
      productName !== undefined ||
      productDetails !== undefined ||
      productImage !== undefined;
    if (!hasAnyField) {
      throw new BadRequestException(
        'At least one field is required: productName, productDetails, or productImage',
      );
    }

    if (productName) {
      await this.assertProductNameIsUnique(
        productName,
        productObjectId,
        'productName',
      );
    }

    const updatePayload: Record<string, unknown> = {
      updatedDate: new Date(),
    };
    if (productName !== undefined) {
      updatePayload.productName = productName;
    }
    if (productDetails !== undefined) {
      updatePayload.productDetails = productDetails;
    }
    if (productImage !== undefined) {
      updatePayload.productImage = productImage;
    }

    const updated = await this.productModel
      .findOneAndUpdate(
        {
          _id: productObjectId,
          vendorId: vendorObjectId,
          productStatus: 2,
        },
        { $set: updatePayload },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(
        'Certified product not found for this vendor',
      );
    }

    await this.invalidateProductListingsCache();
    return updated.toObject();
  }

  async vendorSubmitProductChangeRequest(
    manufacturerId: string,
    dto: VendorProductChangeRequestDto,
  ) {
    const vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
    const productObjectId = this.toObjectId(dto.productId, 'productId');

    const product = await this.productModel
      .findOne(
        matchActiveProducts({
          _id: productObjectId,
          vendorId: vendorObjectId,
          productStatus: 2,
        }),
      )
      .select('_id urnNo eoiNo productName vendorId manufacturerId productStatus')
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException(
        'Certified product not found for this vendor',
      );
    }

    const currentName = normalizeProductNameForComparison(dto.currentName);
    const requestedName = normalizeProductNameForComparison(dto.requestedName);
    const reason = String(dto.reason ?? '').trim();
    const fieldErrors: Record<string, string> = {};
    if (!requestedName) {
      fieldErrors.requestedName = 'New Product Name is required.';
    }
    if (!reason) {
      fieldErrors.reason = 'Reason is required.';
    }
    if (!currentName) {
      fieldErrors.currentName = 'Current product name is required.';
    }
    if (Object.keys(fieldErrors).length > 0) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Please complete all required fields.',
        fieldErrors,
      });
    }
    if (
      requestedName.localeCompare(currentName, undefined, {
        sensitivity: 'accent',
      }) === 0
    ) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Requested name must be different from current name',
        fieldErrors: {
          requestedName: 'Requested name must be different from current name',
        },
      });
    }

    await this.assertProductNameIsUnique(
      requestedName,
      productObjectId,
      'requestedName',
    );

    const normalizedStoredName = String(product.productName ?? '').trim();
    if (normalizedStoredName && normalizedStoredName !== currentName) {
      throw new BadRequestException(
        'Current name does not match latest product name. Refresh and try again.',
      );
    }

    const existingPending = await this.vendorProductChangeRequestModel
      .findOne({
        vendorId: vendorObjectId,
        productId: productObjectId,
        status: 'pending',
      })
      .select('_id')
      .lean()
      .exec();
    if (existingPending) {
      throw new BadRequestException(
        'A pending request already exists for this product.',
      );
    }

    const now = new Date();
    const created = await this.vendorProductChangeRequestModel.create({
      productId: productObjectId,
      vendorId: vendorObjectId,
      manufacturerId: vendorObjectId,
      urnNo: String(dto.urnNo ?? product.urnNo ?? '').trim() || product.urnNo,
      eoiNo: String(dto.eoiNo ?? product.eoiNo ?? '').trim() || product.eoiNo,
      currentName,
      requestedName,
      reason,
      status: 'pending',
      createdDate: now,
      updatedDate: now,
    });

    return this.mapProductChangeRequest(created.toObject());
  }

  async vendorListProductChangeRequests(manufacturerId: string) {
    const vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
    const rows = await this.vendorProductChangeRequestModel
      .find({ vendorId: vendorObjectId })
      .sort({ createdDate: -1 })
      .lean()
      .exec();
    return rows.map((row) => this.mapProductChangeRequest(row));
  }

  async adminListProductChangeRequests(status?: string) {
    const match: Record<string, unknown> = {};
    const normalizedStatus = String(status ?? '')
      .trim()
      .toLowerCase();
    if (
      normalizedStatus === 'pending' ||
      normalizedStatus === 'approved' ||
      normalizedStatus === 'rejected'
    ) {
      match.status = normalizedStatus;
    }

    const rows = await this.vendorProductChangeRequestModel
      .find(match)
      .sort({ createdDate: -1 })
      .lean()
      .exec();

    return rows.map((row) => this.mapProductChangeRequest(row));
  }

  async adminUpdateProductChangeRequestStatus(
    requestId: string,
    dto: AdminUpdateProductChangeRequestDto,
    adminUserId: string,
  ) {
    const requestObjectId = this.toObjectId(requestId, 'requestId');
    const reviewerObjectId = this.toObjectId(adminUserId, 'adminUserId');
    const now = new Date();

    const existing = await this.vendorProductChangeRequestModel
      .findById(requestObjectId)
      .lean()
      .exec();
    if (!existing) {
      throw new NotFoundException('Request not found');
    }

    const nextStatus = dto.status;
    const remarksRaw = dto.adminRemarks?.trim();
    if (nextStatus === 'rejected' && !remarksRaw) {
      throw new BadRequestException(
        'adminRemarks is required when rejecting a request',
      );
    }

    const updated = await this.vendorProductChangeRequestModel
      .findByIdAndUpdate(
        requestObjectId,
        {
          $set: {
            status: nextStatus,
            adminRemarks: nextStatus === 'rejected' ? remarksRaw ?? null : null,
            reviewedBy: reviewerObjectId,
            reviewedAt: now,
            updatedDate: now,
          },
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Request not found');
    }

    const manufacturer = await this.manufacturerModel
      .findById(updated.manufacturerId)
      .select('manufacturerName vendor_email')
      .lean()
      .exec();

    const vendorEmail = String(manufacturer?.vendor_email ?? '').trim();
    const manufacturerName = String(
      manufacturer?.manufacturerName ?? 'Vendor',
    ).trim();

    if (nextStatus === 'approved') {
      const approvedName = normalizeProductNameForComparison(
        updated.requestedName,
      );
      await this.assertProductNameIsUnique(
        approvedName,
        updated.productId as Types.ObjectId,
        'requestedName',
      );

      await this.productModel
        .findOneAndUpdate(
          matchActiveProducts({
            _id: updated.productId,
            productStatus: 2,
          }),
          {
            $set: {
              productName: approvedName,
              updatedDate: now,
            },
          },
          { new: false },
        )
        .exec();
      await this.invalidateProductListingsCache();

      this.sendProductChangeDecisionEmail({
        email: vendorEmail,
        manufacturerName,
        urnNo: String(updated.urnNo ?? ''),
        eoiNo: String(updated.eoiNo ?? ''),
        currentName: String(updated.currentName ?? ''),
        requestedName: String(updated.requestedName ?? ''),
        decision: 'approved',
      });
    } else if (nextStatus === 'rejected') {
      this.sendProductChangeDecisionEmail({
        email: vendorEmail,
        manufacturerName,
        urnNo: String(updated.urnNo ?? ''),
        eoiNo: String(updated.eoiNo ?? ''),
        currentName: String(updated.currentName ?? ''),
        requestedName: String(updated.requestedName ?? ''),
        decision: 'rejected',
        remarks: remarksRaw ?? '',
      });
    }

    return this.mapProductChangeRequest(updated);
  }

  private sendProductChangeDecisionEmail(params: {
    email: string;
    manufacturerName: string;
    urnNo: string;
    eoiNo: string;
    currentName: string;
    requestedName: string;
    decision: 'approved' | 'rejected';
    remarks?: string;
  }): void {
    const to = String(params.email ?? '').trim();
    if (!to) {
      return;
    }

    const decisionLabel =
      params.decision === 'approved' ? 'Approved' : 'Rejected';
    const subject = `GreenPro — Product Name Change Request ${decisionLabel}`;

    const remarksBlock =
      params.decision === 'rejected'
        ? `<p><strong>Admin Remarks:</strong> ${this.escapeHtml(
            params.remarks || '',
          )}</p>`
        : '';

    const nameResultBlock =
      params.decision === 'approved'
        ? `<p><strong>Updated Product Name:</strong> ${this.escapeHtml(
            params.requestedName,
          )}</p>`
        : `<p><strong>Product Name (unchanged):</strong> ${this.escapeHtml(
            params.currentName,
          )}</p>`;

    const html = `
      <p>Dear ${this.escapeHtml(params.manufacturerName || 'Vendor')},</p>
      <p>Your product name change request has been <strong>${decisionLabel}</strong>.</p>
      <p><strong>URN:</strong> ${this.escapeHtml(params.urnNo)}</p>
      <p><strong>EOI No:</strong> ${this.escapeHtml(params.eoiNo)}</p>
      <p><strong>Current Name:</strong> ${this.escapeHtml(params.currentName)}</p>
      <p><strong>Requested Name:</strong> ${this.escapeHtml(params.requestedName)}</p>
      ${nameResultBlock}
      ${remarksBlock}
      <p>Regards,<br/>GreenPro Admin</p>
    `;

    const text = [
      `Dear ${params.manufacturerName || 'Vendor'},`,
      `Your product name change request has been ${decisionLabel}.`,
      `URN: ${params.urnNo}`,
      `EOI No: ${params.eoiNo}`,
      `Current Name: ${params.currentName}`,
      `Requested Name: ${params.requestedName}`,
      params.decision === 'approved'
        ? `Updated Product Name: ${params.requestedName}`
        : `Product Name (unchanged): ${params.currentName}`,
      params.decision === 'rejected' ? `Admin Remarks: ${params.remarks || ''}` : '',
      'Regards, GreenPro Admin',
    ]
      .filter(Boolean)
      .join('\n');

    this.emailService.sendInBackground(() =>
      this.emailService.sendEmail(to, subject, html, text),
    );
  }

  private escapeHtml(input: string): string {
    return String(input ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  getVendorProductChangeRequestFormMeta() {
    return {
      fields: [
        {
          key: 'requestedName',
          label: 'New Product Name',
          required: true,
          maxLength: 500,
        },
        {
          key: 'reason',
          label: 'Reason',
          required: true,
          maxLength: 2000,
        },
      ],
      validationMessages: {
        requestedNameRequired: 'New Product Name is required.',
        reasonRequired: 'Reason is required.',
        productNameExists: PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
      },
      display: {
        productNameWrapCss:
          'word-break: break-word; white-space: normal; overflow-wrap: anywhere;',
        modalSuggestedMaxWidth: 'min(520px, 92vw)',
      },
    };
  }

  /**
   * Ensures product name is unique among active products and pending change requests.
   */
  private async assertProductNameIsUnique(
    productName: string,
    excludeProductId?: Types.ObjectId,
    fieldKey: 'requestedName' | 'productName' = 'requestedName',
  ): Promise<void> {
    const nameFilter = productNameEqualsFilter(productName);
    if (!nameFilter) {
      return;
    }

    const productQuery: Record<string, unknown> = {
      ...matchActiveProducts(),
      productName: nameFilter,
    };
    if (excludeProductId) {
      productQuery._id = { $ne: excludeProductId };
    }

    const conflictingProduct = await this.productModel
      .findOne(productQuery)
      .select('_id productName')
      .lean()
      .exec();

    if (conflictingProduct) {
      throw new BadRequestException({
        code: 'PRODUCT_NAME_EXISTS',
        message: PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
        fieldErrors: {
          [fieldKey]: PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
        },
      });
    }

    const pendingQuery: Record<string, unknown> = {
      status: 'pending',
      requestedName: nameFilter,
    };
    if (excludeProductId) {
      pendingQuery.productId = { $ne: excludeProductId };
    }

    const conflictingPending = await this.vendorProductChangeRequestModel
      .findOne(pendingQuery)
      .select('_id')
      .lean()
      .exec();

    if (conflictingPending) {
      throw new BadRequestException({
        code: 'PRODUCT_NAME_EXISTS',
        message: PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
        fieldErrors: {
          [fieldKey]: PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
        },
      });
    }
  }

  private mapProductChangeRequest(row: any) {
    const currentName = String(row?.currentName ?? '');
    const requestedName = String(row?.requestedName ?? '');
    return {
      _id: row?._id,
      requestId: row?._id != null ? String(row._id) : undefined,
      productId: row?.productId,
      vendorId: row?.vendorId,
      manufacturerId: row?.manufacturerId,
      urnNo: row?.urnNo,
      eoiNo: row?.eoiNo,
      currentName,
      requestedName,
      currentNameDisplay: currentName,
      requestedNameDisplay: requestedName,
      reason: row?.reason,
      status: row?.status,
      adminRemarks: row?.adminRemarks ?? null,
      reviewedBy: row?.reviewedBy ?? null,
      reviewedAt: row?.reviewedAt ?? null,
      createdDate: row?.createdDate,
      updatedDate: row?.updatedDate,
    };
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

      // Find one product for validation, timeline context and response shape
      const existingProduct = await this.productModel
        .findOne({
          vendorId: vendorObjectId,
          urnNo: updateUrnStatusDto.urnNo,
          ...matchActiveProducts(),
        })
        .session(session)
        .exec();

      if (!existingProduct) {
        throw new NotFoundException(
          `Product not found with manufacturerId: ${manufacturerId} and urnNo: ${updateUrnStatusDto.urnNo}`,
        );
      }

      const previousUrnStatus = Number(existingProduct.urnStatus ?? 0);
      const nextUrnStatus = this.resolveVendorRequestedUrnStatus(
        updateUrnStatusDto.updateStatusType,
        updateUrnStatusDto.updateStatusTo,
      );

      if (nextUrnStatus === 1 && previousUrnStatus >= 3) {
        throw new BadRequestException(
          'Invalid URN transition: cannot move back to Registration Payment from current stage',
        );
      }

      // Update all products under the URN for this authenticated vendor
      const now = new Date();
      await this.productModel
        .updateMany(
          matchActiveProducts({
            vendorId: vendorObjectId,
            urnNo: updateUrnStatusDto.urnNo,
          }),
          {
            $set: {
              urnStatus: nextUrnStatus,
              ...(updateUrnStatusDto.productStatus !== undefined
                ? { productStatus: updateUrnStatusDto.productStatus }
                : {}),
              updatedDate: now,
            },
          },
          { session },
        )
        .exec();

      const updatedProduct = await this.productModel
        .findOne({
          vendorId: vendorObjectId,
          urnNo: updateUrnStatusDto.urnNo,
          ...matchActiveProducts(),
        })
        .session(session)
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
        nextUrnStatus,
      );
      await this.syncUrnProductsToZohoDeal(
        updateUrnStatusDto.urnNo,
        existingProduct.manufacturerId,
      ).catch((error: any) => {
        this.logger.warn(
          `[Update URN Status] Zoho deal product sync failed for ${updateUrnStatusDto.urnNo}: ${
            error?.message || error
          }`,
        );
      });

      if (previousUrnStatus !== 4 && nextUrnStatus === 4) {
        this.urnTabReviewService
          .ensurePendingReviewsForUrn(updateUrnStatusDto.urnNo.trim())
          .catch((err) =>
            this.logger.warn(
              `[Update URN Status] Tab review init failed: ${(err as Error).message}`,
            ),
          );
        this.lifecycleNotification
          .notifyUrnSubmittedForReview({
            manufacturerId: manufacturerId.toString(),
            urnNo: updateUrnStatusDto.urnNo.trim(),
            productName: existingProduct.productName,
          })
          .catch((err) =>
            this.logger.warn(
              `[Update URN Status] Submit-for-review notification failed: ${
                (err as Error)?.message
              }`,
            ),
          );
      }

      await this.invalidateProductListingsCache();
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
      const sampleUrnStatus = Number(products[0].urnStatus ?? 0);
      const targetsRenewBand =
        dto.updateStatusTo >= RENEWAL_URN_STATUS.PAYMENT_PENDING &&
        dto.updateStatusTo <= RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING;
      const inRenewBand =
        sampleUrnStatus >= RENEWAL_URN_STATUS.PAYMENT_PENDING &&
        sampleUrnStatus <= RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING;
      if (targetsRenewBand || inRenewBand) {
        throw new BadRequestException(
          'Renewal URN statuses (12–17) must use PATCH /renew/urn-status with renewalCycleId. ' +
            'Do not use PATCH /api/admin/products/urn-status for renewal completion.',
        );
      }
    }

    if (dto.updateStatusType === 'urn_status') {
      if (dto.updateStatusTo < 0 || dto.updateStatusTo > 17) {
        throw new BadRequestException(
          'updateStatusTo must be between 0 and 17 for urn_status',
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
    const previousUrnStatus = Number(products[0].urnStatus ?? 0);
    const sampleProductName = String(products[0].productName ?? '').trim();

    const setDoc: Record<string, unknown> = { updatedDate: now };
    const updateFilter: Record<string, unknown> = { urnNo };
    if (dto.updateStatusType === 'urn_status') {
      setDoc.urnStatus = dto.updateStatusTo;
      // Resend to vendor (5): keep product active so vendor forms stay editable with prior data.
      if (dto.updateStatusTo === 5) {
        setDoc.productStatus = 1;
      }
    } else {
      setDoc.productStatus = dto.updateStatusTo;
      // Certification transition safety: only Submitted (1) rows can become Certified (2).
      // Rejected (3) rows must remain rejected.
      if (dto.updateStatusTo === 2) {
        updateFilter.productStatus = 1;
      }
    }

    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      await this.productModel
        .updateMany(updateFilter, { $set: setDoc }, { session })
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
      await this.syncUrnProductsToZohoDeal(urnNo, manufacturerId).catch(
        (error: any) => {
          this.logger.warn(
            `[Admin URN Status] Zoho deal product sync failed for ${urnNo}: ${
              error?.message || error
            }`,
          );
        },
      );
      if (dto.updateStatusTo === 6) {
        await this.syncDocumentReviewedStatusToZohoDeal(
          urnNo,
          manufacturerId,
        ).catch((error: any) => {
          this.logger.warn(
            `[Admin URN Status] Zoho deal status update failed for ${urnNo}: ${
              error?.message || error
            }`,
          );
        });
      }

      if (dto.updateStatusTo === 4 && previousUrnStatus !== 4) {
        this.urnTabReviewService
          .ensurePendingReviewsForUrn(urnNo)
          .catch((err) =>
            this.logger.warn(
              `[Admin URN Status] Tab review init failed: ${(err as Error).message}`,
            ),
          );
      }

      if (
        dto.updateStatusTo === 2 &&
        previousUrnStatus < 2 &&
        previousUrnStatus !== dto.updateStatusTo
      ) {
        this.lifecycleNotification
          .notifyUrnInitialApproved({
            manufacturerId: manufacturerId.toString(),
            urnNo,
            productName: sampleProductName || urnNo,
            approvedBy: 'GreenPro Admin',
          })
          .catch((err) =>
            this.logger.warn(
              `[Admin URN Status] Initial approval notification failed: ${
                (err as Error)?.message
              }`,
            ),
          );
      }

      await this.invalidateProductListingsCache();
      return { urnNo, urnStatus: dto.updateStatusTo };
    }
    await this.invalidateProductListingsCache();
    return { urnNo, productStatus: dto.updateStatusTo };
  }

  async adminUpdateRenewValidity(dto: AdminRenewValidityDto): Promise<{
    urnNo: string;
    updatedCount: number;
    validTillDate: string;
    productIds?: string[];
    preview?: boolean;
  }> {
    const urnNo = String(dto.urnNo ?? '').trim();
    if (!urnNo) {
      throw new BadRequestException('urnNo is required');
    }

    const parsed = new Date(dto.validTillDate);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(
        'validTillDate must be a valid date (YYYY-MM-DD or ISO)',
      );
    }

    // Normalize to YYYY-MM-DD for response and UTC start-of-day for persistence.
    const normalizedDate = parsed.toISOString().slice(0, 10);
    const validTillDate = new Date(`${normalizedDate}T00:00:00.000Z`);

    const products = await this.productModel
      .find(matchActiveProducts({ urnNo }))
      .select('_id')
      .lean()
      .exec();

    if (!products.length) {
      throw new NotFoundException(`No product found for URN: ${urnNo}`);
    }

    const productIds = products.map((p) => String(p._id));
    const preview = Boolean(dto.preview);

    if (preview) {
      return {
        urnNo,
        updatedCount: productIds.length,
        validTillDate: normalizedDate,
        productIds,
        preview: true,
      };
    }

    const updateResult = await this.productModel
      .updateMany(
        matchActiveProducts({ urnNo }),
        {
          $set: {
            validtillDate: validTillDate,
            updatedDate: new Date(),
          },
        },
      )
      .exec();

    await this.invalidateProductListingsCache();

    return {
      urnNo,
      updatedCount: Number(updateResult.modifiedCount ?? 0),
      validTillDate: normalizedDate,
    };
  }

  /**
   * Vendor EOI list grouped by URN (paginate/sort URNs, not flat products).
   * Status filters apply to **`products.productStatus`** (EOI list status: Pending, Submitted, etc.), not manufacturer/vendor status.
   * **Default** (no `productStatus` / `productStatusList`): **Pending (0) + Submitted (1)** only.
   * Use `productStatusList=0,1` explicitly or a single `productStatus` / `status` to override. `4` includes expired certified rows (`productStatus` 2 past validtill).
   */
  async listProducts(listProductsDto: ListProductsDto, manufacturerId: string) {
    try {
      const cacheKey = this.buildVendorProductListCacheKey(
        listProductsDto,
        manufacturerId,
      );
      try {
        const cached = await this.redisService.get<{
          data: any[];
          pagination: {
            page: number;
            limit: number;
            totalCount: number;
            totalPages: number;
          };
        }>(cacheKey);
        if (cached && Array.isArray(cached.data) && cached.pagination) {
          return cached;
        }
      } catch (error) {
        this.logger.warn(
          `Product vendor list cache read failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      }

      const {
        page = 1,
        limit = 10,
        search,
        sort = 'desc',
        categoryId,
        dateFrom,
        dateTo,
      } = listProductsDto;

      const resolvedStatuses = this.resolveVendorListProductStatuses(listProductsDto);
      const statusMatch = this.buildVendorListProductStatusMatch(resolvedStatuses);

      const skip = (page - 1) * limit;
      const sortOrder = sort === 'asc' ? 1 : -1;
      const vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');

      const nativeMatch: Record<string, unknown> = {
        vendorId: vendorObjectId,
        ...matchActiveProducts(),
      };
      if (categoryId) {
        nativeMatch.categoryId = this.toObjectId(categoryId, 'categoryId');
      }
      if (dateFrom || dateTo) {
        const createdRange: Record<string, Date> = {};
        if (dateFrom) {
          createdRange.$gte = new Date(dateFrom);
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          createdRange.$lte = to;
        }
        nativeMatch.createdDate = createdRange;
      }

      const locationProductIds =
        await this.findVendorProductIdsByPlantLocationFilters(
          manufacturerId,
          listProductsDto,
        );
      if (locationProductIds !== null) {
        if (locationProductIds.length === 0) {
          const emptyResponse = {
            data: [],
            pagination: {
              page,
              limit,
              totalCount: 0,
              totalPages: 0,
            },
          };
          this.redisService
            .set(cacheKey, emptyResponse, this.getProductListCacheTtlSeconds())
            .catch((error) => {
              this.logger.warn(
                `Product vendor list cache write failed: ${(error as Error)?.message || 'unknown error'}`,
              );
            });
          return emptyResponse;
        }
        nativeMatch._id = { $in: locationProductIds };
      }

      const basePipeline: any[] = [{ $match: nativeMatch }];
      if (statusMatch) {
        basePipeline.push({ $match: statusMatch });
      }

      basePipeline.push(
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
      );

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(
          search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        );
        basePipeline.push({
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

      const rowBase: any[] = [...basePipeline];

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
        { $sort: { createdDate: sortOrder } },
      ];

      const eoiLookupMatchStages: any[] = [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$urnNo', '$$urnNo'] },
                { $eq: ['$vendorId', vendorObjectId] },
              ],
            },
            ...matchActiveProducts(),
          },
        },
      ];
      if (statusMatch) {
        eoiLookupMatchStages.push({ $match: statusMatch });
      }
      if (categoryId) {
        eoiLookupMatchStages.push({
          $match: {
            categoryId: this.toObjectId(categoryId, 'categoryId'),
          },
        });
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
              ...eoiLookupMatchStages,
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
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$productId', '$$pid'] },
                        is_deleted: { $ne: true },
                      },
                    },
                    { $sort: { createdDate: 1 } },
                    { $limit: 1 },
                    {
                      $lookup: {
                        from: 'states',
                        localField: 'stateId',
                        foreignField: '_id',
                        as: 'st',
                      },
                    },
                    {
                      $unwind: {
                        path: '$st',
                        preserveNullAndEmptyArrays: true,
                      },
                    },
                    {
                      $project: {
                        _id: 0,
                        city: 1,
                        stateName: {
                          $ifNull: ['$st.stateName', '$st.name'],
                        },
                      },
                    },
                  ],
                  as: 'primaryPlant',
                },
              },
              {
                $unwind: {
                  path: '$primaryPlant',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: 'sectors',
                  let: { sectorId: '$category.sector' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $ne: ['$$sectorId', null] },
                            { $eq: ['$id', '$$sectorId'] },
                          ],
                        },
                      },
                    },
                    { $limit: 1 },
                    { $project: { _id: 0, name: 1 } },
                  ],
                  as: 'sectorDoc',
                },
              },
              {
                $unwind: {
                  path: '$sectorDoc',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  _id: 1,
                  eoiNo: 1,
                  productName: 1,
                  productStatus: 1,
                  validtillDate: 1,
                  createdDate: 1,
                  plantCount: 1,
                  categoryName: {
                    $ifNull: [
                      '$category.categoryName',
                      '$category.category_name',
                    ],
                  },
                  sector: '$category.sector',
                  sectorName: '$sectorDoc.name',
                  city: '$primaryPlant.city',
                  stateName: '$primaryPlant.stateName',
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
              totalCount: totalUrnPipeline,
            },
          },
        ])
        .exec();

      const payload = facetResult[0] ?? { data: [], totalCount: [] };
      const totalCount = payload.totalCount?.[0]?.count ?? 0;
      const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 0;

      const grouped = (payload.data ?? []).map((u: Record<string, unknown>) => {
        const urnStatusCode = this.deriveVendorUrnStatus(
          Array.isArray(u.statusCodes) ? (u.statusCodes as number[]) : [],
        );
        const urnStatusLabel = this.mapUrnRollupStatusLabel(urnStatusCode);
        return {
          urnNo: u.urnNo,
          createdDate: u.createdDate,
          urnStatus: urnStatusLabel,
          urnStatusCode,
          urnStatusLabel,
          totalEoi: Number(u.totalEoi ?? 0),
          eois: Array.isArray(u.eois)
            ? (u.eois as Record<string, unknown>[]).map((e) =>
                this.formatVendorListEoiEntry(e ?? {}),
              )
            : [],
        };
      });

      const response = {
        data: grouped,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      };

      this.redisService
        .set(cacheKey, response, this.getProductListCacheTtlSeconds())
        .catch((error) => {
          this.logger.warn(
            `Product vendor list cache write failed: ${(error as Error)?.message || 'unknown error'}`,
          );
        });
      return response;
    } catch (error: any) {
      this.logger.error(
        `[List Products] ${error?.message || 'unknown error'}`,
        error?.stack,
      );
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch EOI list',
      );
    }
  }

  /**
   * Admin renew products list — manufacturer-grouped with names (certified EOIs only).
   */
  async adminListRenewProducts(): Promise<{
    data: Array<Record<string, unknown>>;
    total: number;
  }> {
    const currentDate = new Date();
    const thresholdDate = new Date(currentDate);
    thresholdDate.setDate(thresholdDate.getDate() + 60);

    const renewMatch = {
      productStatus: PRODUCT_STATUS_CERTIFIED,
      ...matchActiveProducts(),
      $or: [
        {
          validtillDate: {
            $exists: true,
            $ne: null,
            $lt: thresholdDate,
          },
        },
        { urnStatus: { $gte: 12, $lte: 17 } },
      ],
    };

    const pipeline: any[] = [
      { $match: renewMatch },
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
          from: 'sectors',
          let: { sid: '$category.sector' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $ne: ['$$sid', null] }, { $eq: ['$id', '$$sid'] }],
                },
              },
            },
            { $limit: 1 },
            { $project: { _id: 0, name: 1 } },
          ],
          as: '_adminSectorDoc',
        },
      },
      {
        $unwind: {
          path: '$_adminSectorDoc',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          manufacturerId: 1,
          urnNo: 1,
          createdDate: 1,
          productStatus: 1,
          urnStatus: 1,
          _id: 1,
          productId: 1,
          eoiNo: 1,
          productName: 1,
          productDetails: 1,
          validtillDate: 1,
          categoryId: 1,
          productImage: 1,
          categoryName: {
            $ifNull: ['$category.categoryName', '$category.category_name'],
          },
          sector: '$category.sector',
          sectorName: '$_adminSectorDoc.name',
          manufacturerName: {
            $ifNull: [
              '$manufacturer.manufacturerName',
              {
                $ifNull: [
                  '$manufacturer.companyName',
                  '$manufacturer.vendor_name',
                ],
              },
            ],
          },
          vendor_email: {
            $ifNull: ['$manufacturer.vendor_email', ''],
          },
          vendor_phone: {
            $ifNull: ['$manufacturer.vendor_phone', ''],
          },
          plants: { $literal: [] },
        },
      },
      {
        $group: {
          _id: { manufacturerId: '$manufacturerId', urnNo: '$urnNo' },
          manufacturer_id: { $first: '$manufacturerId' },
          manufacturerName: { $first: '$manufacturerName' },
          vendor_email: { $first: '$vendor_email' },
          vendor_phone: { $first: '$vendor_phone' },
          urnNo: { $first: '$urnNo' },
          createdDate: { $min: '$createdDate' },
          urn_status: { $first: '$urnStatus' },
          totalEoi: { $sum: 1 },
          eoiDocs: {
            $push: {
              _id: '$_id',
              productId: '$productId',
              eoiNo: '$eoiNo',
              urnNo: '$urnNo',
              productName: '$productName',
              productDetails: '$productDetails',
              productStatus: '$productStatus',
              urnStatus: '$urnStatus',
              validtillDate: '$validtillDate',
              categoryId: '$categoryId',
              productImage: '$productImage',
              createdDate: '$createdDate',
              categoryName: '$categoryName',
              sector: '$sector',
              sectorName: '$sectorName',
              manufacturerName: '$manufacturerName',
              plants: '$plants',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.manufacturerId',
          manufacturer_id: { $first: '$manufacturer_id' },
          manufacturerName: { $first: '$manufacturerName' },
          vendor_email: { $first: '$vendor_email' },
          vendor_phone: { $first: '$vendor_phone' },
          total_urns: { $sum: 1 },
          total_eois: { $sum: '$totalEoi' },
          sortKey: { $max: '$createdDate' },
          urns: {
            $push: {
              urnNo: '$urnNo',
              createdDate: '$createdDate',
              totalEoi: '$totalEoi',
              urn_status: '$urn_status',
              eoiDocs: '$eoiDocs',
            },
          },
        },
      },
      { $sort: { sortKey: 1 } },
    ];

    const rows = await this.productModel.aggregate(pipeline).exec();
    const data = rows.map((m) => this.formatRenewAdminListManufacturerGroup(m));
    return { data, total: data.length };
  }

  /**
   * List products eligible for renewal
   * Conditions:
   * - product_status = 2 (Certified)
   * - manufacturer_id = logged-in manufacturer
   * - validtill_date < (current_date + 60 days)
   */
  async getRenewList(manufacturerId: string) {
    try {
      const manufacturerObjectId = this.toObjectId(
        manufacturerId,
        'manufacturerId',
      );

      // Calculate date threshold: current date + 60 days
      const currentDate = new Date();
      const thresholdDate = new Date(currentDate);
      thresholdDate.setDate(thresholdDate.getDate() + 60);

      // Aggregation pipeline
      const pipeline: any[] = [];

      // Stage 1: $match - Filter by manufacturerId, productStatus = 2, and validtillDate < threshold
      pipeline.push({
        $match: {
          manufacturerId: manufacturerObjectId,
          productStatus: 2, // Certified only — rejected (3) and other statuses excluded
          validtillDate: {
            $exists: true,
            $ne: null,
            $lt: thresholdDate, // validtillDate < (current_date + 60 days)
          },
          ...matchActiveProducts(),
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
          product_details: { $ifNull: ['$productDetails', ''] },
          productDetails: { $ifNull: ['$productDetails', ''] },
          unit_count: { $ifNull: ['$plantCount', 0] },
          plantCount: { $ifNull: ['$plantCount', 0] },
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
   * Certified EOIs only — categories + product_plants (with geo) for renew URN details.
   */
  async getRenewProductDetailsByUrn(urnNo: string) {
    return this.getProductDetailsByUrn(urnNo, {
      renewEligibleOnly: true,
      enrichPlantsWithGeo: true,
    });
  }

  /**
   * Get complete product details by URN number
   * Includes related data from categories, manufacturers, vendors, product_plants, and payment_details
   */
  async getProductDetailsByUrn(
    urnNo: string,
    options?: GetProductDetailsByUrnOptions,
  ) {
    try {
      if (!urnNo || urnNo.trim() === '') {
        throw new BadRequestException('URN number is required');
      }

      const renewEligibleOnly = options?.renewEligibleOnly === true;
      const enrichPlantsWithGeo = options?.enrichPlantsWithGeo === true;

      // Aggregation pipeline
      const pipeline: any[] = [];

      // Stage 1: $match - Filter by urnNo (active products; optional certified-only for renew)
      pipeline.push({
        $match: {
          urnNo: urnNo.trim(),
          ...(renewEligibleOnly
            ? {
                ...matchActiveProducts(),
                productStatus: PRODUCT_STATUS_CERTIFIED,
              }
            : matchActiveProducts()),
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

      // Stage 5: $lookup - Join product_plants (optional states/countries for renew details)
      pipeline.push(
        this.buildProductPlantsLookupStage({
          enrichPlantsWithGeo,
          matchPlantsByUrn: enrichPlantsWithGeo,
        }),
      );

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

      // Stage 7: $lookup - Join with process_product_design (urn + vendor — one row per vendor)
      pipeline.push({
        $lookup: {
          from: 'process_product_design',
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
            { $sort: { updatedDate: -1, createdDate: -1 } },
            { $limit: 1 },
          ],
          as: 'product_design',
        },
      });

      // Stage 8: $lookup - Join with process_pd_measures (urn + vendor)
      pipeline.push({
        $lookup: {
          from: 'process_pd_measures',
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
            { $sort: { productDesignMeasureId: 1 } },
          ],
          as: 'product_design_measures',
        },
      });

      // Stage 9: $lookup - Join with all_product_documents (product_design, urn + vendor)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo', vendorId: '$vendorId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $eq: ['$vendorId', '$$vendorId'] },
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

      // Stage 10: $lookup - Join with process_product_performance (urn + vendor)
      pipeline.push({
        $lookup: {
          from: 'process_product_performance',
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
            { $sort: { updatedDate: -1, createdDate: -1 } },
            { $limit: 1 },
          ],
          as: 'product_performance',
        },
      });

      // Stage 10b: $lookup - Join with process_pp_test_reports (urn + vendor)
      pipeline.push({
        $lookup: {
          from: 'process_pp_test_reports',
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
            { $sort: { productPerformanceTestReportId: 1 } },
          ],
          as: 'product_performance_test_reports',
        },
      });

      // Stage 11: $lookup - Join with all_product_documents (product_performance, urn + vendor)
      pipeline.push({
        $lookup: {
          from: 'all_product_documents',
          let: { urnNo: '$urnNo', vendorId: '$vendorId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $eq: ['$vendorId', '$$vendorId'] },
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
                $expr: urnLookupMatchExpr(),
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

      // Stage 23A: $lookup - Join stakeholder education/awareness programme rows
      pipeline.push({
        $lookup: {
          from: 'process_ps_stakeholder_edu_awarness',
          let: { urnNo: '$urnNo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$urnNo', '$$urnNo'] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { createdDate: 1 } },
          ],
          as: 'process_ps_stakeholder_edu_awarness',
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

      // Stage 26: $lookup - all non-deleted vendor documents for this URN (Quick View / admin full list)
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
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $sort: { productDocumentId: -1 } },
          ],
          as: 'all_urn_product_documents',
        },
      });

      // Stage 27: $lookup - Join with process_comments collection (by urn_no)
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

      // Stage 28: $project - Format the response structure
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
          product_performance_test_reports: 1,
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
          process_ps_stakeholder_edu_awarness: 1,
          process_innovation: {
            $cond: {
              if: { $gt: [{ $size: '$process_innovation' }, 0] },
              then: { $arrayElemAt: ['$process_innovation', 0] },
              else: null,
            },
          },
          process_innovation_documents: 1,
          all_urn_product_documents: 1,
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
      const formattedResults = results.map((product) => {
        const manufacturerDetails = this.formatProductDetailsManufacturer(
          product.manufacturer as Record<string, unknown> | null,
        );
        const assessmentReportUrl = String(product.assessmentReportUrl ?? '').trim();
        const urnAssessmentReport = assessmentReportUrl
          ? this.buildUrnAssessmentReportDocumentPayload(assessmentReportUrl)
          : null;
        return {
        ...(urnAssessmentReport
          ? {
              urn_assessment_report: urnAssessmentReport,
              urnAssessmentReport,
            }
          : {}),
        product_details: {
          _id: product._id,
          productId: product.productId,
          eoiNo: product.eoiNo,
          urnNo: product.urnNo,
          productName: product.productName,
          productImage: product.productImage,
          plantCount: product.plantCount,
          categoryId: product.categoryId ?? product.category?._id ?? null,
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
        category: this.formatCategoryForUrnDetails(
          product.category as Record<string, unknown> | null,
        ),
        manufacturer: manufacturerDetails,
        /** Admin UI section label — same payload as manufacturer (includes vendor_details). */
        manufacturing_details: manufacturerDetails,
        vendor: this.formatProductDetailsVendor(
          product.manufacturer as Record<string, unknown> | null,
          product.vendor as Record<string, unknown> | null,
        ),
        plants: this.formatProductDetailsPlants(
          product.plants as Array<Record<string, unknown>> | undefined,
        ),
        payments: formatPaymentRecords(
          (product.payments as Record<string, unknown>[]) || [],
        ),
        product_design_measures: (product.product_design_measures || []).map(
          (m) => ({
            _id: m._id,
            productDesignMeasureId: m.productDesignMeasureId,
            urnNo: m.urnNo,
            productDesignId: m.productDesignId,
            measures: m.measures,
            benefits: m.benefits,
            measuresImplemented: m.measures,
            benefitsAchieved: m.benefits,
            createdDate: m.createdDate,
            updatedDate: m.updatedDate,
          }),
        ),
        product_design: this.formatProductDesignForUrnDetails(
          product.product_design as Record<string, unknown> | null,
          (product.product_design_measures || []) as Array<
            Record<string, unknown>
          >,
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
        product_performance_test_reports: (
          product.product_performance_test_reports || []
        ).map((r) => ({
          _id: r._id,
          productPerformanceTestReportId: r.productPerformanceTestReportId,
          urnNo: r.urnNo,
          productName: r.productName,
          testReportFileName: r.testReportFileName,
          createdDate: r.createdDate,
          updatedDate: r.updatedDate,
        })),
        product_performance: this.formatProductPerformanceForUrnDetails(
          product.product_performance as Record<string, unknown> | null,
          (product.product_performance_test_reports || []) as Array<
            Record<string, unknown>
          >,
        ),
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
        raw_materials_hazardous_products: filterHazardousProductsForVendorDisplay(
          product.raw_materials_hazardous_products || [],
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
          filterFormaldehydeStyleProductsForVendorDisplay(
            product.raw_materials_elimination_of_formaldehyde || [],
          ),
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
          filterFormaldehydeStyleProductsForVendorDisplay(
            product.raw_materials_elimination_of_prohibited_flame_solvents_products ||
              [],
          ),
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
        raw_materials_reduce_enviromental:
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
        ).map((u) =>
          enrichMpManufacturingUnitCalculations({
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
          calculateBulkStec: u.calculateBulkStec,
          calculateBulkSecMultipled: u.calculateBulkSecMultipled,
          calculateBulkSwcMultipled: u.calculateBulkSwcMultipled,
          calculateBulkTecMultipled: u.calculateBulkTecMultipled,
          calculateBulkStecMultipled: u.calculateBulkStecMultipled,
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
        ).map((u) =>
          enrichWmManufacturingUnitCalculations({
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
            wmImplementationDetailsWmUnits: u.wmImplementationDetailsWmUnits,
            createdDate: u.createdDate,
            updatedDate: u.updatedDate,
          }),
        ),
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
              programmeDetails: (
                product.process_ps_stakeholder_edu_awarness || []
              ).map((row: any) => ({
                _id: row._id,
                programmeDetails: row.seaProgramDetails ?? '',
                numberOfPrograms: row.seaNoOfPrograms ?? '',
                seaSupportingDocuments: Number(row.seaSupportingDocuments ?? 0),
                productStewardshipStatus: Number(
                  row.productStewardshipStatus ?? 0,
                ),
                createdDate: row.createdDate,
                updatedDate: row.updatedDate,
              })),
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
        process_ps_stakeholder_edu_awarness: (
          product.process_ps_stakeholder_edu_awarness || []
        ).map((row: any) => ({
          _id: row._id,
          vendorId: row.vendorId,
          urnNo: row.urnNo,
          processProductStewardshipId: row.processProductStewardshipId,
          seaProgramDetails: row.seaProgramDetails,
          seaNoOfPrograms: row.seaNoOfPrograms,
          seaSupportingDocuments: row.seaSupportingDocuments,
          productStewardshipStatus: row.productStewardshipStatus,
          createdDate: row.createdDate,
          updatedDate: row.updatedDate,
          isDeleted: row.isDeleted,
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
          documentTag: d.documentTag,
          createdDate: d.createdDate,
          updatedDate: d.updatedDate,
        })),
        all_urn_product_documents: (product.all_urn_product_documents || []).map(
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
            documentTag: d.documentTag,
            createdDate: d.createdDate,
            updatedDate: d.updatedDate,
          }),
        ),
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
      };
      });

      const siteVisits = await this.urnSiteVisitsService.findAllByUrnForEmbed(
        urnNo.trim(),
      );

      return enrichUrnDetailRowsWithSharedProcessData(
        formattedResults.map((row) => ({
          ...row,
          siteVisits,
        })),
      );
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

  /**
   * Dropdown values for admin certified (or other) product list filters.
   * Categories: all active categories. Other fields: distinct values from products in scope.
   */
  async adminGetProductListFilterOptions(dto: AdminListProductsFilterOptionsDto) {
    const statuses = (() => {
      for (const c of [dto.status, dto.productStatus, dto.product_status]) {
        if (Array.isArray(c) && c.length > 0) {
          return c;
        }
      }
      return [2];
    })();

    const categories = await this.categoryModel
      .find({ category_status: 1 })
      .select('_id category_name category_name_normalized')
      .sort({ category_name: 1 })
      .lean()
      .exec();

    const categoryOptions = categories.map((c) => ({
      value: String(c._id),
      label: String(c.category_name ?? '').trim() || 'Category',
    }));

    const productMatch: Record<string, unknown> = {
      ...matchActiveProducts(),
      productStatus: statuses.length === 1 ? statuses[0] : { $in: statuses },
    };

    const [manufacturerRows, yearRows] = await Promise.all([
      this.productModel
        .aggregate([
          { $match: productMatch },
          {
            $lookup: {
              from: 'manufacturers',
              localField: 'manufacturerId',
              foreignField: '_id',
              as: 'manufacturer',
            },
          },
          { $unwind: '$manufacturer' },
          {
            $group: {
              _id: '$manufacturerId',
              label: { $first: '$manufacturer.manufacturerName' },
            },
          },
          { $match: { label: { $type: 'string', $ne: '' } } },
          { $sort: { label: 1 } },
          {
            $project: {
              _id: 0,
              value: { $toString: '$_id' },
              label: 1,
            },
          },
        ])
        .exec(),
      this.productModel
        .aggregate([
          {
            $match: {
              ...productMatch,
              validtillDate: { $exists: true, $ne: null },
            },
          },
          {
            $project: {
              year: { $year: '$validtillDate' },
            },
          },
          { $group: { _id: '$year' } },
          { $sort: { _id: -1 } },
        ])
        .exec(),
    ]);

    const currentYear = new Date().getUTCFullYear();
    const validTillYearOptions = yearRows
      .map((row) => Number(row._id))
      .filter((y) => Number.isFinite(y) && y <= currentYear)
      .map((y) => ({
        value: String(y),
        label: String(y),
      }));

    return {
      message: 'Filter options retrieved successfully',
      data: {
        categories: categoryOptions,
        manufacturers: manufacturerRows as Array<{ value: string; label: string }>,
        validTillYears: validTillYearOptions,
        filterControls: {
          city: {
            type: 'text',
            label: 'City',
            queryParam: 'city',
            placeholder: 'Search by city',
          },
        },
      },
    };
  }

  async adminListProducts(dto: AdminListProductsDto) {
    const groupBy = dto.groupBy ?? 'manufacturer';
    if (groupBy === 'urn') {
      return this.adminListProductsGroupedByUrn(dto);
    }
    return this.adminListProductsGroupedByManufacturer(dto);
  }

  private buildAdminListRowBase(
    dto: AdminListProductsDto,
    locationProductIds: Types.ObjectId[] | null = null,
  ): {
    page: number;
    limit: number;
    skip: number;
    sortOrder: 1 | -1;
    now: Date;
    rowBase: any[];
    statusMatch: Record<string, unknown> | null;
    urnSortField: string;
    manufacturerSortField: string;
  } {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;
    const sortOrder = (dto.order ?? dto.sortOrder) === 'asc' ? 1 : -1;
    const now = new Date();

    const urnSortFieldMap: Record<string, string> = {
      createdDate: 'createdDate',
      createdAt: 'createdDate',
      validTill: 'validtillDate',
      productName: 'productName',
      eoiNo: 'eoiNo',
      urnNo: 'urnNo',
    };
    const urnSortField =
      urnSortFieldMap[dto.sortBy ?? 'createdDate'] ?? 'createdDate';

    const manufacturerSortFieldMap: Record<string, string> = {
      createdDate: 'sortKey',
      createdAt: 'sortKey',
      manufacturerName: 'manufacturerName',
      validTill: 'sortKey',
      productName: 'sortKey',
      eoiNo: 'sortKey',
      urnNo: 'sortKey',
    };
    const manufacturerSortField =
      manufacturerSortFieldMap[dto.sortBy ?? 'createdDate'] ?? 'sortKey';

    const nativeMatch: Record<string, unknown> = {
      ...matchActiveProducts(),
    };
    if (locationProductIds != null) {
      nativeMatch._id = { $in: locationProductIds };
    }
    if (dto.product_type !== undefined) {
      nativeMatch.productType = dto.product_type;
    }
    const categoryIds = this.resolveAdminListCategoryIds(dto);
    if (categoryIds && categoryIds.length > 0) {
      nativeMatch.categoryId = {
        $in: categoryIds.map((id) => this.toObjectId(id, 'categoryId')),
      };
    }
    const manufacturerIds = this.resolveAdminListManufacturerIds(dto);
    if (manufacturerIds && manufacturerIds.length > 0) {
      nativeMatch.manufacturerId = {
        $in: manufacturerIds.map((id) =>
          this.toObjectId(id, 'manufacturerId'),
        ),
      };
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
    const validTillYears = this.resolveAdminListValidTillYears(dto);
    if (validTillYears && validTillYears.length > 0) {
      const yearRanges = validTillYears.map((y) => ({
        validtillDate: {
          $gte: new Date(Date.UTC(y, 0, 1, 0, 0, 0, 0)),
          $lte: new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999)),
        },
      }));
      if (yearRanges.length === 1) {
        nativeMatch.validtillDate = yearRanges[0].validtillDate;
      } else {
        nativeMatch.$or = yearRanges;
      }
    }

    const basePipeline: any[] = [];
    if (Object.keys(nativeMatch).length > 0) {
      basePipeline.push({ $match: nativeMatch });
    }

    const sectorFilterIds = this.resolveAdminListSectorIds(dto);

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
    );
    if (sectorFilterIds && sectorFilterIds.length > 0) {
      basePipeline.push({
        $match: { 'category.sector': { $in: sectorFilterIds } },
      });
    }
    basePipeline.push(
      {
        $lookup: {
          from: 'product_plants',
          let: { pid: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$productId', '$$pid'] },
                ...matchActiveProductPlants(),
              },
            },
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
                eoiNo: 1,
                urnNo: 1,
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
        $lookup: {
          from: 'sectors',
          let: { sid: '$category.sector' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $ne: ['$$sid', null] }, { $eq: ['$id', '$$sid'] }],
                },
              },
            },
            { $limit: 1 },
            { $project: { _id: 0, name: 1 } },
          ],
          as: '_adminSectorDoc',
        },
      },
      {
        $unwind: {
          path: '$_adminSectorDoc',
          preserveNullAndEmptyArrays: true,
        },
      },
    );

    const manufacturerNames = this.resolveAdminListManufacturerNames(dto);
    if (manufacturerNames && manufacturerNames.length > 0) {
      const escaped = manufacturerNames.map(
        (name) => new RegExp(`^${this.escapeRegexLiteral(name)}$`, 'i'),
      );
      basePipeline.push({
        $match: {
          'manufacturer.manufacturerName':
            escaped.length === 1 ? escaped[0] : { $in: escaped },
        },
      });
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
            { 'manufacturer.vendor_name': rx },
            { 'manufacturer.vendor_email': rx },
            { 'manufacturer.vendor_phone': rx },
          ],
        },
      });
    }

    const statuses = (() => {
      for (const c of [dto.status, dto.productStatus, dto.product_status]) {
        if (Array.isArray(c) && c.length > 0) {
          return c;
        }
      }
      return [];
    })();
    const includeExpired = statuses.includes(4);
    const regularStatuses = statuses.filter((s) => s !== 4);

    let statusMatch: Record<string, unknown> | null = null;
    if (statuses.length > 0) {
      if (includeExpired && regularStatuses.length > 0) {
        statusMatch = {
          $or: [
            { productStatus: { $in: regularStatuses } },
            matchExpiredProducts(now),
          ],
        };
      } else if (includeExpired) {
        statusMatch = matchExpiredProducts(now);
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

    return {
      page,
      limit,
      skip,
      sortOrder,
      now,
      rowBase,
      statusMatch,
      urnSortField,
      manufacturerSortField,
    };
  }

  private async adminListProductsGroupedByManufacturer(
    dto: AdminListProductsDto,
  ) {
    const cacheKey = this.buildAdminProductListCacheKey(dto);
    try {
      const cached = await this.redisService.get<{
        message: string;
        data: any[];
        total: number;
        page: number;
        limit: number;
        statusCounts: Record<string, number>;
      }>(cacheKey);
      if (cached && Array.isArray(cached.data)) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Product admin list cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const locationProductIds =
      await this.findAdminListProductIdsByPlantLocation(dto);
    if (locationProductIds !== null && locationProductIds.length === 0) {
      return {
        message: 'Products listed successfully',
        data: [],
        total: 0,
        page,
        limit,
        statusCounts: {},
      };
    }

    const {
      skip,
      sortOrder,
      now,
      rowBase,
      manufacturerSortField,
    } = this.buildAdminListRowBase(dto, locationProductIds);

    const manufacturerGroupPipeline: any[] = [
      ...rowBase,
      {
        $project: {
          manufacturerId: 1,
          urnNo: 1,
          createdDate: 1,
          productStatus: 1,
          urnStatus: 1,
          _id: 1,
          productId: 1,
          eoiNo: 1,
          productName: 1,
          productDetails: 1,
          validtillDate: 1,
          categoryId: 1,
          productImage: 1,
          categoryName: {
            $ifNull: ['$category.categoryName', '$category.category_name'],
          },
          sector: '$category.sector',
          sectorName: '$_adminSectorDoc.name',
          manufacturerName: '$manufacturer.manufacturerName',
          vendor_email: {
            $ifNull: ['$manufacturer.vendor_email', ''],
          },
          vendor_phone: {
            $ifNull: ['$manufacturer.vendor_phone', ''],
          },
          plants: 1,
        },
      },
      {
        $group: {
          _id: { manufacturerId: '$manufacturerId', urnNo: '$urnNo' },
          manufacturer_id: { $first: '$manufacturerId' },
          manufacturerName: { $first: '$manufacturerName' },
          vendor_email: { $first: '$vendor_email' },
          vendor_phone: { $first: '$vendor_phone' },
          urnNo: { $first: '$urnNo' },
          createdDate: { $min: '$createdDate' },
          totalEoi: { $sum: 1 },
          statusCodes: { $addToSet: '$productStatus' },
          eoiDocs: {
            $push: {
              _id: '$_id',
              productId: '$productId',
              eoiNo: '$eoiNo',
              urnNo: '$urnNo',
              productName: '$productName',
              productDetails: '$productDetails',
              productStatus: '$productStatus',
              urnStatus: '$urnStatus',
              validtillDate: '$validtillDate',
              categoryId: '$categoryId',
              productImage: '$productImage',
              createdDate: '$createdDate',
              categoryName: '$categoryName',
              sector: '$sector',
              sectorName: '$sectorName',
              manufacturerName: '$manufacturerName',
              plants: '$plants',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.manufacturerId',
          manufacturer_id: { $first: '$manufacturer_id' },
          manufacturerName: { $first: '$manufacturerName' },
          vendor_email: { $first: '$vendor_email' },
          vendor_phone: { $first: '$vendor_phone' },
          total_urns: { $sum: 1 },
          total_eois: { $sum: '$totalEoi' },
          sortKey: { $max: '$createdDate' },
          urns: {
            $push: {
              urnNo: '$urnNo',
              createdDate: '$createdDate',
              totalEoi: '$totalEoi',
              statusCodes: '$statusCodes',
              eoiDocs: '$eoiDocs',
            },
          },
        },
      },
      { $sort: { [manufacturerSortField]: sortOrder } },
    ];

    const facetResult = await this.productModel
      .aggregate([
        {
          $facet: {
            data: [
              ...manufacturerGroupPipeline,
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  _id: 0,
                  manufacturer_id: 1,
                  manufacturerName: 1,
                  vendor_email: 1,
                  vendor_phone: 1,
                  total_urns: 1,
                  total_eois: 1,
                  urns: 1,
                },
              },
            ],
            total: [...manufacturerGroupPipeline, { $count: 'count' }],
            byStatus: [
              ...rowBase,
              { $group: { _id: '$productStatus', count: { $sum: 1 } } },
            ],
            expired: [
              ...rowBase,
              { $match: matchExpiredProducts(now) },
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

    let grouped = (payload.data ?? []).map((m: any) =>
      this.formatAdminListManufacturerGroup(m),
    );
    if (this.isAdminRejectedOnlyListFilter(dto)) {
      await this.enrichAdminRejectedListUrns(grouped);
    }

    const response = {
      message: 'Products listed successfully',
      data: grouped,
      total,
      page,
      limit,
      statusCounts,
    };
    this.redisService
      .set(cacheKey, response, this.getProductListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Product admin list cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return response;
  }

  private async adminListProductsGroupedByUrn(dto: AdminListProductsDto) {
    const cacheKey = this.buildAdminProductListCacheKey(dto);
    try {
      const cached = await this.redisService.get<{
        message: string;
        data: any[];
        total: number;
        page: number;
        limit: number;
        statusCounts: Record<string, number>;
      }>(cacheKey);
      if (cached && Array.isArray(cached.data)) {
        return cached;
      }
    } catch (error) {
      this.logger.warn(
        `Product admin list cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const locationProductIds =
      await this.findAdminListProductIdsByPlantLocation(dto);
    if (locationProductIds !== null && locationProductIds.length === 0) {
      return {
        message: 'Products listed successfully',
        data: [],
        total: 0,
        page,
        limit,
        statusCounts: {},
      };
    }

    const {
      skip,
      sortOrder,
      now,
      rowBase,
      statusMatch,
      urnSortField,
    } = this.buildAdminListRowBase(dto, locationProductIds);
    const sortField = urnSortField;
    const sectorFilterIds = this.resolveAdminListSectorIds(dto);

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
      {
        $match: {
          $expr: { $eq: ['$urnNo', '$$urnNo'] },
          ...matchActiveProducts(),
        },
      },
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
            ...(sectorFilterIds && sectorFilterIds.length > 0
              ? [{ $match: { 'category.sector': { $in: sectorFilterIds } } }]
              : []),
            {
              $lookup: {
                from: 'product_plants',
                let: { productId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$productId', '$$productId'] },
                      ...matchActiveProductPlants(),
                    },
                  },
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
                      eoiNo: 1,
                      urnNo: 1,
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
              $lookup: {
                from: 'sectors',
                let: { sid: '$category.sector' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $ne: ['$$sid', null] },
                          { $eq: ['$id', '$$sid'] },
                        ],
                      },
                    },
                  },
                  { $limit: 1 },
                  { $project: { _id: 0, name: 1 } },
                ],
                as: '_adminSectorDoc',
              },
            },
            {
              $unwind: {
                path: '$_adminSectorDoc',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                productId: 1,
                eoiNo: 1,
                urnNo: 1,
                productName: 1,
                productDetails: 1,
                productStatus: 1,
                urnStatus: 1,
                validtillDate: 1,
                categoryId: 1,
                productImage: 1,
                createdDate: 1,
                categoryName: {
                  $ifNull: [
                    '$category.categoryName',
                    '$category.category_name',
                  ],
                },
                manufacturerName: '$manufacturer.manufacturerName',
                sector: '$category.sector',
                sectorName: '$_adminSectorDoc.name',
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
              { $match: matchExpiredProducts(now) },
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

    const grouped = (payload.data ?? []).map((u: any) => {
      const eoiSummaryStatus = this.deriveAdminUrnStatus(
        Array.isArray(u.statusCodes) ? u.statusCodes : [],
      );
      return {
        urnNo: u.urnNo,
        createdDate: u.createdDate,
        eoiSummaryStatus,
        urnStatus: eoiSummaryStatus,
        totalEoi: u.totalEoi ?? 0,
        eois: Array.isArray(u.eois)
          ? u.eois.map((e: any) => this.formatAdminListEoiEntry(e ?? {}))
          : [],
      };
    });

    const response = {
      message: 'Products listed successfully',
      data: grouped,
      total,
      page,
      limit,
      statusCounts,
    };
    this.redisService
      .set(cacheKey, response, this.getProductListCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `Product admin list cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return response;
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
        {
          $match: matchWebsitePublicCertifiedProducts({
            categoryId: categoryObjectId,
          }),
        },
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
        {
          $match: matchWebsitePublicCertifiedProducts({
            manufacturerId: manufacturerObjectId,
          }),
        },
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
          $match: { 'category.category_status': 1 },
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
    let totalGroups = 0;
    const listRows: any[] = [];

    while (true) {
      const batch = await this.adminListProducts({
        ...dto,
        page,
        limit: batchSize,
      } as AdminListProductsDto);

      if (totalGroups === 0) {
        totalGroups = batch.total ?? 0;
      }
      listRows.push(...(batch.data ?? []));
      if (listRows.length >= totalGroups || (batch.data ?? []).length === 0) {
        break;
      }
      page += 1;
    }

    const { eoiRows } = this.flattenAdminListForExport(listRows);

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Products Export');
    ws.columns = [
      { header: 'Manufacturer Name', key: 'manufacturerName', width: 30 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'URN No', key: 'urnNo', width: 28 },
      { header: 'EOI No', key: 'eoiNo', width: 24 },
      { header: 'Product Name', key: 'productName', width: 32 },
      { header: 'Category Name', key: 'categoryName', width: 24 },
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
      const listRows: any[] = [];

      while (true) {
        const batch = await this.adminListProducts({
          ...dto,
          page,
          limit: pageSize,
        } as AdminListProductsDto);

        if (total === 0) {
          total = batch.total ?? 0;
        }
        listRows.push(...(batch.data ?? []));
        if (listRows.length >= total || (batch.data ?? []).length === 0) {
          break;
        }
        page += 1;
        job.progress = Math.min(
          70,
          10 + Math.floor((listRows.length / Math.max(total, 1)) * 60),
        );
        job.updatedAt = new Date();
      }

      const { urnRows, eoiRows } = this.flattenAdminListForExport(listRows);

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
          'Manufacturer Name',
          'Email',
          'Phone',
          'URN',
          'EOI Number',
          'Product ID',
          'Product Name',
          'Category Name',
          'Product Status',
          'Status Label',
          'Created Date',
        ];
        const lines = [header.join(',')];
        for (const row of eoiRows) {
          lines.push(
            [
              row.manufacturerName,
              row.email ?? row.vendor_email ?? '',
              row.phone ?? row.vendor_phone ?? '',
              row.urnNo,
              row.eoiNo,
              row.productId,
              row.productName,
              row.categoryName,
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
            { header: 'Manufacturer Name', key: 'manufacturerName', width: 28 },
            { header: 'Email', key: 'email', width: 28 },
            { header: 'Phone', key: 'phone', width: 18 },
            { header: 'URN', key: 'urnNo', width: 28 },
            { header: 'Created Date', key: 'createdDate', width: 24 },
            { header: 'URN Status', key: 'urnStatus', width: 16 },
            { header: 'Total EOI', key: 'totalEoi', width: 12 },
          ];
          urnRows.forEach((u, idx) => {
            ws1.addRow({
              sno: idx + 1,
              manufacturerName: u.manufacturerName ?? '',
              email: u.email ?? u.vendor_email ?? '',
              phone: u.phone ?? u.vendor_phone ?? '',
              urnNo: u.urnNo ?? u.urn_number,
              createdDate: u.createdDate ?? u.created_at,
              urnStatus: u.urnStatus ?? u.status,
              totalEoi: u.totalEoi ?? u.total_eoi,
            });
          });
        }

        if (job.includeSheets.includes('eoi_details')) {
          const ws2 = workbook.addWorksheet('EOI Details');
          ws2.columns = [
            { header: 'Manufacturer Name', key: 'manufacturerName', width: 28 },
            { header: 'Email', key: 'email', width: 28 },
            { header: 'Phone', key: 'phone', width: 18 },
            { header: 'URN', key: 'urnNo', width: 28 },
            { header: 'EOI Number', key: 'eoiNo', width: 20 },
            { header: 'Product ID', key: 'productId', width: 12 },
            { header: 'Product Name', key: 'productName', width: 30 },
            { header: 'Category Name', key: 'categoryName', width: 24 },
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
