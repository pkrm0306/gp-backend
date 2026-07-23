import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import {
  ProductPlant,
  ProductPlantDocument,
} from '../product-registration/schemas/product-plant.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import {
  Country,
  CountryDocument,
} from '../countries/schemas/country.schema';
import { StatesService } from '../states/states.service';
import { VendorCertificateService } from '../product-registration/services/vendor-certificate.service';
import { matchActiveProducts } from '../product-registration/constants/active-product.filter';
import { UpdateCertificateCorrectionDto } from './dto/update-certificate-correction.dto';

const CERTIFIED_PRODUCT_STATUS = 2;

@Injectable()
export class CertificateCorrectionService {
  private readonly logger = new Logger(CertificateCorrectionService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductPlant.name)
    private readonly productPlantModel: Model<ProductPlantDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
    private readonly statesService: StatesService,
    private readonly vendorCertificateService: VendorCertificateService,
  ) {}

  async getMeta() {
    const indiaCountryId = await this.resolveIndiaCountryId();
    const stateRows = await this.statesService.findAll(
      indiaCountryId ?? undefined,
    );

    const states = (stateRows ?? [])
      .map((row) => {
        const r = row as {
          _id?: { toString(): string };
          name?: string;
          stateName?: string;
          state_name?: string;
        };
        const id = String(r._id ?? '').trim();
        const name = String(
          r.name ?? r.stateName ?? r.state_name ?? '',
        ).trim();
        if (!id || !name) return null;
        return { id, name };
      })
      .filter((s): s is { id: string; name: string } => s != null)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      );

    const manufacturers = await this.manufacturerModel
      .find({
        $or: [
          { accountDeletedAt: null },
          { accountDeletedAt: { $exists: false } },
        ],
      })
      .select('_id manufacturerName')
      .sort({ manufacturerName: 1 })
      .lean()
      .exec();

    return {
      states,
      manufacturers: manufacturers.map((m) => ({
        manufacturer_id: String(m._id),
        manufacturer_name: String(m.manufacturerName ?? '').trim() || 'Manufacturer',
      })),
    };
  }

  async getByEoi(eoiNo: string) {
    const trimmed = String(eoiNo ?? '').trim();
    if (!trimmed) {
      throw new BadRequestException('EOI number is required');
    }

    const product = await this.findCertifiedProductByEoi(trimmed).lean().exec();

    if (!product) {
      throw new NotFoundException('EOI number not found!');
    }

    const plants = await this.productPlantModel
      .find({
        productId: product._id,
        $or: [{ is_deleted: false }, { is_deleted: { $exists: false } }],
        mergedIntoPlantId: null,
      })
      .sort({ createdDate: 1, productPlantId: 1 })
      .lean()
      .exec();

    if (!plants.length) {
      throw new NotFoundException('EOI number not found!');
    }

    return {
      eoi_no: String(product.eoiNo ?? ''),
      product_name: String(product.productName ?? ''),
      manufacturer_id: String(product.manufacturerId ?? ''),
      validtill_date: this.formatDateOnly(product.validtillDate),
      plants: plants.map((p) => ({
        product_plant_id: Number(p.productPlantId),
        manufacturer_id: String(p.manufacturerId ?? product.manufacturerId ?? ''),
        state: String(p.stateId ?? ''),
        city: String(p.city ?? ''),
        additional_plant_info: String(p.additionalPlantInfo ?? ''),
      })),
    };
  }

  async update(dto: UpdateCertificateCorrectionDto) {
    const eoi = String(dto.eoi ?? '').trim();
    const neweoiInput = String(dto.neweoi ?? '').trim();
    const neweoi = neweoiInput || eoi;
    const productName = String(dto.product ?? '').trim();
    const manufacturerId = String(dto.manufacturer ?? '').trim();
    const validDate = String(dto.valid_date ?? '').trim();

    if (!eoi || !productName || !manufacturerId || !validDate) {
      throw new BadRequestException('Missing required fields');
    }
    if (!Types.ObjectId.isValid(manufacturerId)) {
      throw new BadRequestException('Invalid manufacturer id');
    }

    const validTillDate = this.parseDateOnly(validDate);
    if (!validTillDate) {
      throw new BadRequestException('Invalid valid_date');
    }

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const product = await this.findCertifiedProductByEoi(eoi)
        .session(session)
        .exec();

      if (!product) {
        throw new NotFoundException('EOI number not found!');
      }

      const currentManufacturerId = String(product.manufacturerId ?? '');
      if (currentManufacturerId !== manufacturerId) {
        throw new BadRequestException(
          'Manufacturer cannot be changed from certificate correction',
        );
      }

      if (neweoi !== eoi) {
        const conflict = await this.productModel
          .findOne(
            matchActiveProducts({
              eoiNo: neweoi,
              _id: { $ne: product._id },
            }),
          )
          .session(session)
          .lean()
          .exec();
        if (conflict) {
          throw new BadRequestException('New EOI number already exists!');
        }
      }

      const plantIds = dto.plants.map((p) => Number(p.product_plant_id));
      const existingPlants = await this.productPlantModel
        .find({
          productId: product._id,
          productPlantId: { $in: plantIds },
          $or: [{ is_deleted: false }, { is_deleted: { $exists: false } }],
        })
        .session(session)
        .exec();

      if (existingPlants.length !== dto.plants.length) {
        throw new BadRequestException(
          'One or more plants do not belong to this product',
        );
      }

      const now = new Date();
      product.eoiNo = neweoi;
      product.productName = productName;
      product.validtillDate = validTillDate;
      product.updatedDate = now;
      await product.save({ session });

      const plantByNumericId = new Map(
        existingPlants.map((p) => [Number(p.productPlantId), p]),
      );

      for (const plantDto of dto.plants) {
        const plant = plantByNumericId.get(Number(plantDto.product_plant_id));
        if (!plant) {
          throw new BadRequestException(
            `Plant ${plantDto.product_plant_id} not found`,
          );
        }
        if (!Types.ObjectId.isValid(plantDto.state)) {
          throw new BadRequestException('Invalid state id');
        }
        if (!plant.countryId) {
          throw new BadRequestException(
            `Plant ${plantDto.product_plant_id} is missing country`,
          );
        }

        plant.eoiNo = neweoi;
        plant.manufacturerId = product.manufacturerId;
        plant.stateId = new Types.ObjectId(plantDto.state);
        plant.city = String(plantDto.city ?? '').trim();
        const info = String(plantDto.additional_plant_info ?? '').trim();
        plant.additionalPlantInfo = info || undefined;
        await plant.save({ session });
      }

      await session.commitTransaction();

      return {
        message: 'Product certificate data updated successfully.',
        previewUrl: `/api/admin/certificate-correction/preview/${encodeURIComponent(neweoi)}`,
      };
    } catch (err) {
      await session.abortTransaction();
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      this.logger.error(
        `Certificate correction failed: ${(err as Error)?.message ?? err}`,
        (err as Error)?.stack,
      );
      throw new InternalServerErrorException(
        'Product certificate data updating failed!',
      );
    } finally {
      session.endSession();
    }
  }

  async previewPdf(eoiNo: string) {
    return this.vendorCertificateService.regenerateCertificatePdfByEoiNo(eoiNo);
  }

  /** Prefer certified row when duplicate active products share the same EOI. */
  private findCertifiedProductByEoi(eoiNo: string) {
    return this.productModel
      .findOne(
        matchActiveProducts({
          eoiNo: String(eoiNo ?? '').trim(),
          productStatus: CERTIFIED_PRODUCT_STATUS,
        }),
      )
      .sort({ certifiedDate: -1, updatedDate: -1 });
  }

  private async resolveIndiaCountryId(): Promise<string | null> {
    const india = await this.countryModel
      .findOne({
        $or: [
          { countryName: /^india$/i },
          { country_name: /^india$/i },
          { name: /^india$/i },
          { countryCode: /^IN$/i },
          { country_code: /^IN$/i },
          { iso2: /^IN$/i },
        ],
      })
      .select('_id')
      .lean()
      .exec();
    return india?._id ? String(india._id) : null;
  }

  private formatDateOnly(value: unknown): string {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(d.getTime())) return '';
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private parseDateOnly(value: string): Date | null {
    const trimmed = String(value ?? '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
    const d = new Date(`${trimmed}T00:00:00.000Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
}
