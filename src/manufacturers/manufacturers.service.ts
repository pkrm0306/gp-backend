import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Connection, Types } from 'mongoose';
import {
  Manufacturer,
  ManufacturerDocument,
} from './schemas/manufacturer.schema';
import { VendorContactSlot } from './schemas/vendor-contact-slot.schema';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import {
  VendorUser,
  VendorUserDocument,
} from '../vendor-users/schemas/vendor-user.schema';
import { VendorUsersService } from '../vendor-users/vendor-users.service';
import { UpdateProfileDto } from './dto/update-manufacturer-profile.dto';
import { UpdateVendorContactsDto } from './dto/update-vendor-contacts.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ListManufacturersQueryDto } from './dto/list-manufacturers-query.dto';
import {
  resolveManufacturerScopeFilter,
  resolveVendorStatusFilter,
} from './utils/list-manufacturers-query.util';
import { uploadFile } from '../utils/upload-file.util';
import { ManufacturerIdGenerationService } from './manufacturer-id-generation.service';
import { normalizeManufacturerName } from './manufacturer-identifier.util';
import ExcelJS from 'exceljs';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Case-insensitive exact match allowing flexible whitespace between tokens. */
function companyNameExactRegex(normalizedName: string): RegExp {
  const parts = normalizeManufacturerName(normalizedName)
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegex);
  if (parts.length === 0) {
    return /^$/;
  }
  return new RegExp(`^${parts.join('\\s+')}$`, 'i');
}

function csvEscape(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** List / CSV: 0 inactive/pending, 1 verified, 2 unverified */
function manufacturerStatusLabel(status: number): string {
  switch (status) {
    case 0:
      return 'Inactive / pending';
    case 1:
      return 'Verified';
    case 2:
      return 'Unverified';
    default:
      return `Unknown (${status})`;
  }
}

/** List / CSV: 0 unverified, 1 active, 2 inactive */
function vendorStatusLabel(status: number): string {
  switch (status) {
    case 0:
      return 'Unverified';
    case 1:
      return 'Active';
    case 2:
      return 'Inactive';
    default:
      return `Unknown (${status})`;
  }
}

/** Multipart fields for vendor profile branding; stored via shared `uploadFile()` in `upload-file.util`. */
type VendorProfileBrandingMulterFiles = {
  gst?: Express.Multer.File[];
  gstDocument?: Express.Multer.File[];
  companyLogo?: Express.Multer.File[];
  pan?: Express.Multer.File[];
  panDocument?: Express.Multer.File[];
};

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
    @InjectConnection() private connection: Connection,
    private vendorUsersService: VendorUsersService,
    private readonly manufacturerIdGeneration: ManufacturerIdGenerationService,
  ) {}

  async create(
    data: Partial<Manufacturer>,
    session?: ClientSession,
  ): Promise<ManufacturerDocument> {
    const manufacturer = new this.manufacturerModel(data);
    if (session) {
      return manufacturer.save({ session });
    }
    return manufacturer.save();
  }

  /**
   * Persists **gpInternalId** + **manufacturerInitial** for a not-yet-verified manufacturer,
   * using the same rules as {@link updateManufacturerDetails} for unverified rows.
   * Used after self-service vendor registration so admin unverified listings show IDs immediately.
   */
  async assignAutoGpIdentifiersForUnverifiedManufacturer(
    manufacturerId: string,
    displayName: string,
    session: ClientSession,
  ): Promise<void> {
    const oid = new Types.ObjectId(manufacturerId);
    const existing = await this.manufacturerModel
      .findById(oid)
      .session(session)
      .exec();
    if (!existing) {
      throw new NotFoundException('Manufacturer not found');
    }
    if ((existing.manufacturerStatus ?? 0) === 1) {
      return;
    }
    const nameForGen =
      String(displayName ?? '').trim() ||
      String(existing.manufacturerName ?? '').trim();
    if (!nameForGen) {
      throw new BadRequestException(
        'Manufacturer name is required for GP id allocation',
      );
    }

    const auto =
      await this.manufacturerIdGeneration.resolveAutoIdentifiersForUnverified(
        nameForGen,
        existing._id,
        {
          manufacturerName: existing.manufacturerName,
          manufacturerInitial: existing.manufacturerInitial,
          gpInternalId: existing.gpInternalId,
        },
        session,
      );

    try {
      const dupInitial = await this.manufacturerModel
        .findOne({
          manufacturerInitial: auto.manufacturerInitial,
          _id: { $ne: existing._id },
        })
        .session(session)
        .select('_id')
        .lean()
        .exec();
      if (dupInitial) {
        throw new ConflictException(
          'manufacturerInitial already exists on another manufacturer',
        );
      }
      const dupGp = await this.manufacturerModel
        .findOne({
          gpInternalId: auto.gpInternalId,
          _id: { $ne: existing._id },
        })
        .session(session)
        .select('_id')
        .lean()
        .exec();
      if (dupGp) {
        throw new ConflictException(
          'gpInternalId already exists on another manufacturer',
        );
      }

      await this.manufacturerModel
        .findByIdAndUpdate(
          oid,
          {
            manufacturerInitial: auto.manufacturerInitial,
            gpInternalId: auto.gpInternalId,
            updatedAt: new Date(),
          },
          { session, new: true },
        )
        .exec();
    } catch (e) {
      await this.manufacturerIdGeneration.reconcileSequentialStateFromManufacturers(
        session,
      );
      throw e;
    }
  }

  async findById(id: string): Promise<ManufacturerDocument | null> {
    return this.manufacturerModel.findById(id).exec();
  }

  async findByVendorEmail(email: string): Promise<ManufacturerDocument | null> {
    const normalized = String(email ?? '').trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    const exact = await this.manufacturerModel
      .findOne({ vendor_email: normalized })
      .exec();
    if (exact) {
      return exact;
    }
    return this.manufacturerModel
      .findOne({
        vendor_email: {
          $regex: new RegExp(`^${escapeRegex(normalized)}$`, 'i'),
        },
      })
      .exec();
  }

  async findByVendorPhone(
    phone: string,
  ): Promise<ManufacturerDocument | null> {
    const normalized = String(phone ?? '').trim();
    if (!normalized) {
      return null;
    }
    return this.manufacturerModel.findOne({ vendor_phone: normalized }).exec();
  }

  async findByCompanyName(
    companyName: string,
  ): Promise<ManufacturerDocument | null> {
    const normalized = normalizeManufacturerName(companyName);
    if (!normalized) {
      return null;
    }
    return this.manufacturerModel
      .findOne({
        manufacturerName: { $regex: companyNameExactRegex(normalized) },
      })
      .exec();
  }

  async update(
    id: string,
    data: Partial<Manufacturer>,
    session?: ClientSession,
  ): Promise<ManufacturerDocument | null> {
    const options = session ? { session, new: true } : { new: true };
    return this.manufacturerModel.findByIdAndUpdate(id, data, options).exec();
  }

  async getProfile(manufacturerId: string) {
    const manufacturer = await this.findById(manufacturerId);
    if (!manufacturer) {
      throw new BadRequestException('Manufacturer not found');
    }
    return manufacturer;
  }

  /**
   * Resolve vendor-facing profile using login auth user id -> users.manufacturerId -> manufacturers doc.
   */
  async getVendorDetailsByAuthUserId(userId: string) {
    const vendorUser = await this.vendorUsersService.findById(userId);
    if (!vendorUser) {
      throw new NotFoundException('Vendor user not found');
    }

    const manufacturerId =
      vendorUser.manufacturerId?.toString() || vendorUser.vendorId?.toString();
    if (!manufacturerId) {
      throw new NotFoundException('Manufacturer mapping not found for user');
    }

    const manufacturer = await this.manufacturerModel
      .findById(manufacturerId)
      .lean()
      .exec();
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    const showGpIdentifiers = Boolean(vendorUser.isVerified);

    return {
      _id: manufacturer._id,
      manufacturerName: manufacturer.manufacturerName,
      gpInternalId: showGpIdentifiers
        ? (manufacturer.gpInternalId ?? null)
        : null,
      manufacturerInitial: showGpIdentifiers
        ? (manufacturer.manufacturerInitial ?? null)
        : null,
      manufacturerImage: manufacturer.manufacturerImage ?? null,
      manufacturerStatus: manufacturer.manufacturerStatus ?? 0,
      vendor_name: manufacturer.vendor_name ?? '',
      vendor_email: manufacturer.vendor_email ?? '',
      vendor_phone: manufacturer.vendor_phone ?? '',
      vendor_website: manufacturer.vendor_website ?? '',
      vendor_designation: manufacturer.vendor_designation ?? '',
      vendor_gst: manufacturer.vendor_gst ?? '',
      gstPdf: manufacturer.vendorGstPdf ?? '',
      companyLogo: manufacturer.companyLogo ?? '',
      vendor_status: manufacturer.vendor_status ?? 0,
      companySize: manufacturer.companySize ?? '',
      pan: manufacturer.vendorPanDocument ?? '',
      panNumber: manufacturer.vendorPan ?? '',
      technicalContact: this.mapVendorContactSlot(
        manufacturer.technicalContact as VendorContactSlot | undefined,
      ),
      marketingContact: this.mapVendorContactSlot(
        manufacturer.marketingContact as VendorContactSlot | undefined,
      ),
      createdAt: manufacturer.createdAt,
      updatedAt: manufacturer.updatedAt,
    };
  }

  private toProfilePayloadShape(manufacturer: ManufacturerDocument | Manufacturer) {
    return {
      companyName: manufacturer.manufacturerName ?? '',
      name: manufacturer.vendor_name ?? '',
      designation: manufacturer.vendor_designation ?? '',
      gst: manufacturer.vendor_gst ?? '',
      gstPdf: manufacturer.vendorGstPdf ?? '',
      companyLogo: manufacturer.companyLogo ?? '',
      pan: manufacturer.vendorPanDocument ?? '',
      panNumber: manufacturer.vendorPan ?? '',
      email: manufacturer.vendor_email ?? '',
      mobile: manufacturer.vendor_phone ?? '',
    };
  }

  private emptyVendorContactSlot() {
    return {
      name: '',
      email_id: '',
      phone_number: '',
      designation: '',
    };
  }

  private mapVendorContactSlot(
    slot?: VendorContactSlot | Record<string, unknown> | null,
  ) {
    if (!slot) {
      return this.emptyVendorContactSlot();
    }
    const s = slot as Record<string, unknown>;
    return {
      name: String(s.name ?? '').trim(),
      email_id: String(s.email_id ?? '').trim(),
      phone_number: String(s.phone_number ?? '').trim(),
      designation: String(s.designation ?? '').trim(),
    };
  }

  private looksLikeVendorAssetUrl(value: string): boolean {
    const t = String(value ?? '').trim();
    if (!t) return false;
    return t.startsWith('/') || /^https?:\/\//i.test(t);
  }

  private normalizeIndianPan(value: string): string {
    return String(value ?? '').trim().toUpperCase();
  }

  private normalizeIndianGstin(value: string): string {
    return String(value ?? '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '');
  }

  /** GST / tax id text for storage — trim, uppercase, no format checks. */
  private normalizeGstNumberForStorage(raw: string): string {
    return this.normalizeIndianGstin(raw).slice(0, 64);
  }

  private partitionGstAndPdfFromUpdateDto(updateDto: UpdateProfileDto): {
    gstNumberToApply: string;
    gstPdfToApply?: string;
  } {
    const rawGst =
      updateDto.gst !== undefined ? String(updateDto.gst).trim() : '';
    const rawGstNumber =
      updateDto.gstNumber !== undefined
        ? String(updateDto.gstNumber).trim()
        : '';
    let gstNumberToApply = rawGstNumber;
    let gstPdfToApply: string | undefined;
    if (rawGst && this.looksLikeVendorAssetUrl(rawGst)) {
      gstPdfToApply = rawGst;
    } else if (rawGst) {
      gstNumberToApply = gstNumberToApply || rawGst;
    }
    return { gstNumberToApply, gstPdfToApply };
  }

  private async resolveManufacturerForVendorProfile(
    authUser:
      | string
      | { userId: string; manufacturerId?: string; vendorId?: string },
  ): Promise<{
    resolvedManufacturer: ManufacturerDocument | null;
    vendorUser: VendorUserDocument | null;
  }> {
    const userId = typeof authUser === 'string' ? authUser : authUser.userId;
    const manufacturerIdFromToken =
      typeof authUser === 'string'
        ? ''
        : String(authUser.manufacturerId || authUser.vendorId || '').trim();

    const manufacturerFromToken =
      manufacturerIdFromToken && Types.ObjectId.isValid(manufacturerIdFromToken)
        ? await this.manufacturerModel.findById(manufacturerIdFromToken).exec()
        : null;

    const vendorUser = await this.vendorUsersService.findById(userId);

    const mappedManufacturerId =
      vendorUser?.manufacturerId?.toString() ||
      vendorUser?.vendorId?.toString() ||
      '';

    const manufacturer = mappedManufacturerId
      ? await this.manufacturerModel.findById(mappedManufacturerId).exec()
      : null;

    const fallbackManufacturer =
      !manufacturer && Types.ObjectId.isValid(userId)
        ? await this.manufacturerModel.findById(userId).exec()
        : null;

    const fallbackByContact =
      !manufacturer &&
      !fallbackManufacturer &&
      vendorUser &&
      (vendorUser.email || vendorUser.phone)
        ? await this.manufacturerModel
            .findOne({
              $or: [
                ...(vendorUser.email
                  ? [{ vendor_email: String(vendorUser.email).trim() }]
                  : []),
                ...(vendorUser.phone
                  ? [{ vendor_phone: String(vendorUser.phone).trim() }]
                  : []),
              ],
            })
            .exec()
        : null;

    const resolvedManufacturer =
      manufacturerFromToken ||
      manufacturer ||
      fallbackManufacturer ||
      fallbackByContact;

    return { resolvedManufacturer, vendorUser };
  }

  /**
   * Many clients send both `pan` and `panDocument` (or `gst` + `gstDocument`); the first slot
   * is often an empty file part. Prefer **document** field names, then any slice with bytes.
   */
  private pickVendorProfileUploadSlice(
    files: VendorProfileBrandingMulterFiles | undefined,
    fieldOrder: (keyof VendorProfileBrandingMulterFiles)[],
  ): Express.Multer.File | undefined {
    if (!files) {
      return undefined;
    }
    const slices = fieldOrder
      .map((k) => files[k]?.[0])
      .filter((f): f is Express.Multer.File => !!f);
    const withBytes = slices.find((f) => this.multerFileByteLength(f) > 0);
    if (withBytes) {
      return withBytes;
    }
    return slices[0];
  }

  /** Multer file groups for vendor GST logo / PAN (field aliases supported). */
  private vendorProfileBrandingMulterFiles(files?: VendorProfileBrandingMulterFiles) {
    return {
      gstFile: this.pickVendorProfileUploadSlice(files, [
        'gstDocument',
        'gst',
      ]),
      logoFile: files?.companyLogo?.[0],
      panFile: this.pickVendorProfileUploadSlice(files, [
        'panDocument',
        'pan',
      ]),
    };
  }

  private multerFileByteLength(file: Express.Multer.File): number {
    if (typeof file.size === 'number' && file.size > 0) {
      return file.size;
    }
    return file.buffer?.length ?? 0;
  }

  /**
   * Multipart text fields sometimes land on `req.body` but not on the validated DTO.
   * Fills only keys that are missing or blank on `dto` from `raw` (never overwrites non-empty values).
   */
  mergeVendorProfileDtoFromRawBody(
    dto: UpdateProfileDto,
    raw?: Record<string, unknown>,
  ): UpdateProfileDto {
    if (!raw || typeof raw !== 'object') {
      return dto;
    }
    const out = { ...dto } as UpdateProfileDto & Record<string, unknown>;
    const isBlank = (v: unknown) =>
      v === undefined ||
      v === null ||
      (typeof v === 'string' && v.trim() === '');

    const readRaw = (key: string): string | undefined => {
      const rawVal = raw[key];
      if (rawVal === undefined || rawVal === null) {
        return undefined;
      }
      if (Array.isArray(rawVal)) {
        const first = rawVal[0];
        return typeof first === 'string' ? first.trim() : String(first ?? '').trim();
      }
      return typeof rawVal === 'string' ? rawVal.trim() : String(rawVal).trim();
    };

    const fill = (key: keyof UpdateProfileDto) => {
      if (!isBlank(out[key])) {
        return;
      }
      const s = readRaw(key as string);
      if (s === undefined || s === '') {
        return;
      }
      out[key] = s as never;
    };

    (
      [
        'companyName',
        'name',
        'designation',
        'gst',
        'companyLogo',
        'pan',
        'email',
        'mobile',
      ] as (keyof UpdateProfileDto)[]
    ).forEach(fill);

    return out as UpdateProfileDto;
  }

  /**
   * Persists vendor branding files only through the shared `uploadFile()` helper
   * in `upload-file.util` (`uploads/manufacturers/` locally or S3 when configured).
   */
  private async uploadVendorBrandingMulterFile(
    file: Express.Multer.File,
    label: string,
  ): Promise<string> {
    if (this.multerFileByteLength(file) <= 0) {
      throw new BadRequestException(
        `${label} file is empty or unreadable. Pick the file again in the browser (replayed curl without binary body will not upload).`,
      );
    }
    try {
      return (await uploadFile(file, 'manufacturers')).fileUrl;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('requires file buffer')) {
        throw new BadRequestException(
          `${label} could not be read or is empty. Re-select the file and retry.`,
        );
      }
      throw e;
    }
  }

  private async vendorBrandingFileUrlsFromUploadFile(
    files?: VendorProfileBrandingMulterFiles,
  ): Promise<Partial<Pick<UpdateProfileDto, 'gst' | 'companyLogo' | 'pan'>>> {
    const { gstFile, logoFile, panFile } =
      this.vendorProfileBrandingMulterFiles(files);
    const out: Partial<Pick<UpdateProfileDto, 'gst' | 'companyLogo' | 'pan'>> = {};
    if (gstFile) {
      out.gst = await this.uploadVendorBrandingMulterFile(
        gstFile,
        'GST certificate',
      );
    }
    if (logoFile) {
      out.companyLogo = await this.uploadVendorBrandingMulterFile(
        logoFile,
        'Company logo',
      );
    }
    if (panFile) {
      out.pan = await this.uploadVendorBrandingMulterFile(panFile, 'PAN document');
    }
    return out;
  }

  async uploadVendorProfileBranding(
    authUser: { userId: string; manufacturerId?: string; vendorId?: string },
    files?: VendorProfileBrandingMulterFiles,
  ) {
    const dto = await this.vendorBrandingFileUrlsFromUploadFile(files);
    if (!dto.gst && !dto.companyLogo && !dto.pan) {
      throw new BadRequestException(
        'Send at least one file: **gst** / **gstDocument** (PDF or JPEG only), **companyLogo** (image), and/or **pan** / **panDocument** (PDF or JPEG only).',
      );
    }
    return this.editProfile(authUser, dto as UpdateProfileDto);
  }

  /**
   * Same as {@link editProfile} but merges optional multipart files into the DTO
   * (used by PATCH /api/vendor/profile with multipart). Field aliases: **gstDocument** → gst, **panDocument** → pan.
   * Files are stored only via the shared `uploadFile()` helper (`upload-file.util`).
   */
  async editProfileWithOptionalBrandingFiles(
    authUser: { userId: string; manufacturerId?: string; vendorId?: string },
    updateDto: UpdateProfileDto,
    files?: VendorProfileBrandingMulterFiles,
    rawBody?: Record<string, unknown>,
  ) {
    const mergedText = this.mergeVendorProfileDtoFromRawBody(updateDto, rawBody);
    const fromFiles = await this.vendorBrandingFileUrlsFromUploadFile(files);
    return this.editProfile(authUser, { ...mergedText, ...fromFiles });
  }

  async editProfile(
    authUser:
      | string
      | { userId: string; manufacturerId?: string; vendorId?: string },
    updateDto: UpdateProfileDto,
  ) {
    const userId = typeof authUser === 'string' ? authUser : authUser.userId;
    const { gstNumberToApply: rawGstinFromPartition, gstPdfToApply } =
      this.partitionGstAndPdfFromUpdateDto(updateDto);
    const gstNumberToApply = this.normalizeGstNumberForStorage(
      rawGstinFromPartition,
    );

    const rawPanField =
      updateDto.pan !== undefined ? String(updateDto.pan).trim() : '';
    const rawPanNumberOnly =
      updateDto.panNumber !== undefined
        ? String(updateDto.panNumber).trim()
        : '';

    let panNumberToApply = '';
    if (rawPanNumberOnly) {
      panNumberToApply = this.normalizeIndianPan(rawPanNumberOnly).slice(0, 64);
    }

    let panDocUrlToApply: string | undefined;

    if (rawPanField) {
      if (this.looksLikeVendorAssetUrl(rawPanField)) {
        panDocUrlToApply = rawPanField;
      } else if (rawPanField && !panNumberToApply) {
        panNumberToApply = this.normalizeIndianPan(rawPanField).slice(0, 64);
      }
    }

    const brandingAttempted =
      updateDto.companyLogo !== undefined ||
      gstPdfToApply !== undefined ||
      panDocUrlToApply !== undefined;

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { resolvedManufacturer, vendorUser } =
        await this.resolveManufacturerForVendorProfile(authUser);

      if (!resolvedManufacturer) {
        if (brandingAttempted) {
          throw new BadRequestException(
            'Company logo, GST certificate, and PAN document require a linked manufacturer profile.',
          );
        }
        const vendorUserUpdate: Partial<VendorUser> = {};
        if (updateDto.name !== undefined) {
          vendorUserUpdate.name = updateDto.name;
        }
        if (updateDto.designation !== undefined) {
          vendorUserUpdate.designation = updateDto.designation;
        }
        if (updateDto.email !== undefined) {
          vendorUserUpdate.email = updateDto.email;
        }
        if (updateDto.mobile !== undefined) {
          vendorUserUpdate.phone = updateDto.mobile;
        }

        if (Object.keys(vendorUserUpdate).length > 0) {
          await this.vendorUserModel
            .findByIdAndUpdate(userId, vendorUserUpdate, { new: true, session })
            .exec();
        }

        await session.commitTransaction();
        const vendorOnlyGst = gstNumberToApply || '';
        return {
          companyName: updateDto.companyName ?? '',
          name: updateDto.name ?? vendorUser?.name ?? '',
          designation: updateDto.designation ?? vendorUser?.designation ?? '',
          gst: vendorOnlyGst,
          gstPdf: '',
          companyLogo: '',
          pan: '',
          panNumber: panNumberToApply || '',
          email: updateDto.email ?? vendorUser?.email ?? '',
          mobile: updateDto.mobile ?? vendorUser?.phone ?? '',
        };
      }

      if (gstNumberToApply) {
        const gstExists = await this.manufacturerModel
          .findOne({
            _id: { $ne: resolvedManufacturer._id },
            vendor_gst: gstNumberToApply,
          })
          .select('_id')
          .lean()
          .exec();
        if (gstExists) {
          throw new BadRequestException(
            'GST number already exists. Please change it.',
          );
        }
      }

      if (panNumberToApply) {
        const panExists = await this.manufacturerModel
          .findOne({
            _id: { $ne: resolvedManufacturer._id },
            vendorPan: panNumberToApply,
          })
          .select('_id')
          .lean()
          .exec();
        if (panExists) {
          throw new BadRequestException(
            'PAN number already exists for another vendor.',
          );
        }
      }

      if (updateDto.mobile) {
        const phoneExists = await this.manufacturerModel
          .findOne({
            _id: { $ne: resolvedManufacturer._id },
            vendor_phone: updateDto.mobile,
          })
          .select('_id')
          .lean()
          .exec();
        if (phoneExists) {
          throw new BadRequestException(
            'Phone number already exists. Please change it.',
          );
        }
      }

      const updateData: Partial<Manufacturer> = {};
      if (updateDto.companyName) {
        updateData.manufacturerName = updateDto.companyName;
      }
      if (updateDto.name) {
        updateData.vendor_name = updateDto.name;
      }
      if (updateDto.designation !== undefined) {
        updateData.vendor_designation = updateDto.designation;
      }
      if (gstNumberToApply) {
        updateData.vendor_gst = gstNumberToApply;
      }
      if (gstPdfToApply !== undefined) {
        updateData.vendorGstPdf = gstPdfToApply;
      }
      if (updateDto.companyLogo !== undefined) {
        const logo = String(updateDto.companyLogo).trim();
        if (logo) {
          updateData.companyLogo = logo;
        }
      }
      if (panNumberToApply) {
        updateData.vendorPan = panNumberToApply;
      }
      if (panDocUrlToApply !== undefined) {
        updateData.vendorPanDocument = panDocUrlToApply;
      }
      if (updateDto.email) {
        updateData.vendor_email = updateDto.email;
      }
      if (updateDto.mobile) {
        updateData.vendor_phone = updateDto.mobile;
      }

      if (Object.keys(updateData).length > 0) {
        await this.update(
          resolvedManufacturer._id.toString(),
          updateData,
          session,
        );
      }

      const vendorUserSelfPatch: Partial<VendorUser> = {};
      if (updateDto.name !== undefined && String(updateDto.name).trim()) {
        vendorUserSelfPatch.name = String(updateDto.name).trim();
      }
      if (updateDto.designation !== undefined) {
        vendorUserSelfPatch.designation = String(updateDto.designation).trim();
      }
      if (updateDto.email !== undefined && String(updateDto.email).trim()) {
        vendorUserSelfPatch.email = String(updateDto.email).trim().toLowerCase();
      }
      if (updateDto.mobile !== undefined && String(updateDto.mobile).trim()) {
        vendorUserSelfPatch.phone = String(updateDto.mobile).trim();
      }
      if (Object.keys(vendorUserSelfPatch).length > 0) {
        try {
          await this.vendorUserModel
            .findByIdAndUpdate(userId, vendorUserSelfPatch, {
              new: true,
              session,
            })
            .exec();
        } catch (e: unknown) {
          const code = (e as { code?: number })?.code;
          if (code === 11000) {
            throw new BadRequestException(
              'Email or phone is already used by another account for this organization.',
            );
          }
          throw e;
        }
      }

      await session.commitTransaction();
      const updated = await this.findById(resolvedManufacturer._id.toString());
      if (!updated) {
        throw new NotFoundException('Manufacturer not found');
      }
      return this.toProfilePayloadShape(updated);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getVendorContactsByAuthUserId(userId: string) {
    const { resolvedManufacturer } =
      await this.resolveManufacturerForVendorProfile(userId);
    if (!resolvedManufacturer) {
      return {
        technicalContact: this.emptyVendorContactSlot(),
        marketingContact: this.emptyVendorContactSlot(),
      };
    }
    return {
      technicalContact: this.mapVendorContactSlot(
        resolvedManufacturer.technicalContact,
      ),
      marketingContact: this.mapVendorContactSlot(
        resolvedManufacturer.marketingContact,
      ),
    };
  }

  async updateVendorContacts(
    authUser: { userId: string; manufacturerId?: string; vendorId?: string },
    dto: UpdateVendorContactsDto,
  ) {
    const { resolvedManufacturer } =
      await this.resolveManufacturerForVendorProfile(authUser);
    if (!resolvedManufacturer) {
      throw new BadRequestException(
        'Vendor contacts require a linked manufacturer profile.',
      );
    }

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.update(
        resolvedManufacturer._id.toString(),
        {
          technicalContact: {
            name: dto.technicalContact.name.trim(),
            email_id: dto.technicalContact.email_id.trim().toLowerCase(),
            phone_number: dto.technicalContact.phone_number.trim(),
            designation: dto.technicalContact.designation.trim(),
          },
          marketingContact: {
            name: dto.marketingContact.name.trim(),
            email_id: dto.marketingContact.email_id.trim().toLowerCase(),
            phone_number: dto.marketingContact.phone_number.trim(),
            designation: dto.marketingContact.designation.trim(),
          },
        } as Partial<Manufacturer>,
        session,
      );
      await session.commitTransaction();
      const updated = await this.findById(resolvedManufacturer._id.toString());
      if (!updated) {
        throw new NotFoundException('Manufacturer not found');
      }
      return {
        technicalContact: this.mapVendorContactSlot(updated.technicalContact),
        marketingContact: this.mapVendorContactSlot(updated.marketingContact),
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    const user = await this.vendorUsersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isCurrentPasswordValid =
      await this.vendorUsersService.comparePassword(
        changePasswordDto.currentPassword,
        user.password,
      );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.vendorUsersService.update(userId, {
      password: changePasswordDto.newPassword,
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * Updates core manufacturer fields. Unverified rows: **manufacturerInitial** and **gpInternalId**
   * are always server-generated from **manufacturerName** (client values ignored). Verified rows:
   * optional manual **gpInternalId** / **manufacturerInitial** when provided.
   */
  async updateManufacturerDetails(
    id: string,
    dto: UpdateManufacturerDto,
    imagePath?: string,
  ) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      return await this.manufacturerIdGeneration.withTransaction(
        async (session) => {
          const existing = await this.manufacturerModel
            .findById(manufacturerId)
            .session(session)
            .exec();
          if (!existing) {
            throw new NotFoundException('Manufacturer not found');
          }

          const isUnverified = (existing.manufacturerStatus ?? 0) !== 1;
          const updateData: Record<string, unknown> = {
            manufacturerName: dto.manufacturerName,
            updatedAt: new Date(),
          };
          if (dto.vendor_name !== undefined) {
            updateData.vendor_name = dto.vendor_name;
          }
          if (dto.vendor_email !== undefined) {
            updateData.vendor_email = dto.vendor_email;
          }
          if (dto.vendor_phone !== undefined) {
            updateData.vendor_phone = dto.vendor_phone;
          }
          if (imagePath) {
            updateData.manufacturerImage = imagePath;
          }

          if (isUnverified) {
            const auto =
              await this.manufacturerIdGeneration.resolveAutoIdentifiersForUnverified(
                dto.manufacturerName,
                existing._id,
                {
                  manufacturerName: existing.manufacturerName,
                  manufacturerInitial: existing.manufacturerInitial,
                  gpInternalId: existing.gpInternalId,
                },
                session,
              );
            updateData.manufacturerInitial = auto.manufacturerInitial;
            updateData.gpInternalId = auto.gpInternalId;
          } else {
            const rawGp =
              dto.gpInternalId !== undefined
                ? String(dto.gpInternalId).trim()
                : '';
            const rawIni =
              dto.manufacturerInitial !== undefined
                ? String(dto.manufacturerInitial).trim()
                : '';
            if (rawGp) {
              updateData.gpInternalId = rawGp.toUpperCase();
            }
            if (rawIni) {
              updateData.manufacturerInitial = rawIni.toUpperCase();
            }
          }

          if (updateData.manufacturerInitial !== undefined) {
            const dupInitial = await this.manufacturerModel
              .findOne({
                manufacturerInitial: updateData.manufacturerInitial,
                _id: { $ne: existing._id },
              })
              .session(session)
              .select('_id')
              .lean()
              .exec();
            if (dupInitial) {
              throw new ConflictException(
                'manufacturerInitial already exists on another manufacturer',
              );
            }
          }
          if (updateData.gpInternalId !== undefined) {
            const dupGp = await this.manufacturerModel
              .findOne({
                gpInternalId: updateData.gpInternalId,
                _id: { $ne: existing._id },
              })
              .session(session)
              .select('_id')
              .lean()
              .exec();
            if (dupGp) {
              throw new ConflictException(
                'gpInternalId already exists on another manufacturer',
              );
            }
          }

          const manufacturer = await this.manufacturerModel
            .findByIdAndUpdate(manufacturerId, updateData, {
              new: true,
              session,
            })
            .exec();
          if (!manufacturer) {
            throw new NotFoundException('Manufacturer not found');
          }
          return manufacturer;
        },
      );
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException(
          'Duplicate manufacturer identifier (initial or internal id)',
        );
      }
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid manufacturer ID format');
      }
      throw new BadRequestException(
        error.message || 'Failed to update manufacturer',
      );
    }
  }

  /** Verifies an unverified manufacturer (confirm action). */
  async verifyManufacturer(id: string) {
    const manufacturerId = new Types.ObjectId(id);
    const manufacturer = await this.manufacturerModel
      .findById(manufacturerId)
      .exec();
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    const updated = await this.manufacturerModel
      .findByIdAndUpdate(
        manufacturerId,
        {
          manufacturerStatus: 1,
          vendor_status: 1,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
    return updated;
  }

  private assertCoreFieldsPresentForActivation(
    manufacturer: ManufacturerDocument,
  ) {
    const gpInternalId = (manufacturer.gpInternalId ?? '').toString().trim();
    const manufacturerInitial = (manufacturer.manufacturerInitial ?? '')
      .toString()
      .trim();
    if (!gpInternalId || !manufacturerInitial) {
      throw new ConflictException(
        'Cannot activate manufacturer. Please fill gpInternalId and manufacturerInitial first.',
      );
    }
  }

  /**
   * Toggles vendor active/inactive for verified manufacturer.
   * Keeps manufacturerStatus pinned at 1.
   */
  async toggleManufacturerStatus(id: string) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const manufacturer = await this.manufacturerModel
        .findById(manufacturerId)
        .exec();

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      const currentVendor = manufacturer.vendor_status ?? 0;
      const newVendor = currentVendor === 1 ? 0 : 1;
      if (newVendor === 1) {
        this.assertCoreFieldsPresentForActivation(manufacturer);
      }

      const updated = await this.manufacturerModel
        .findByIdAndUpdate(
          manufacturerId,
          {
            manufacturerStatus: 1,
            vendor_status: newVendor,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      return updated;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid manufacturer ID format');
      }
      throw new BadRequestException(
        error.message || 'Failed to update manufacturer status',
      );
    }
  }

  /**
   * Lightweight vendor_status update for verified manufacturer.
   * Ensures manufacturerStatus stays 1 and rejects toggling for unverified manufacturers.
   */
  async setVendorStatusForVerified(id: string, vendor_status: 0 | 1) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const manufacturer = await this.manufacturerModel
        .findById(manufacturerId)
        .exec();

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      if ((manufacturer.manufacturerStatus ?? 0) !== 1) {
        throw new ConflictException(
          'Only verified manufacturers can be toggled',
        );
      }
      if (vendor_status === 1) {
        this.assertCoreFieldsPresentForActivation(manufacturer);
      }

      const updated = await this.manufacturerModel
        .findByIdAndUpdate(
          manufacturerId,
          {
            manufacturerStatus: 1,
            vendor_status,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      return updated;
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid manufacturer ID format');
      }
      throw new BadRequestException(
        error.message || 'Failed to update vendor status',
      );
    }
  }

  private async countForManufacturer(manufacturerId: Types.ObjectId) {
    const [manufacturer_product_count, manufacturer_vendor_count] =
      await Promise.all([
        this.productModel
          .countDocuments({
            manufacturerId,
            $or: [
              { is_deleted: { $ne: true } },
              { is_deleted: { $exists: false } },
            ],
          })
          .exec(),
        this.vendorUserModel
          .countDocuments({
            manufacturerId,
            type: 'vendor',
            status: { $ne: 2 },
          })
          .exec(),
      ]);
    return { manufacturer_product_count, manufacturer_vendor_count };
  }

  private buildListFilter(
    query: ListManufacturersQueryDto,
  ): Record<string, unknown> {
    const parts: Record<string, unknown>[] = [];

    if (query.search !== undefined && query.search.trim() !== '') {
      const rx = new RegExp(escapeRegex(query.search.trim()), 'i');
      parts.push({
        $or: [
          { manufacturerName: rx },
          { vendor_name: rx },
          { vendor_email: rx },
          { gpInternalId: rx },
        ],
      });
    }
    const scopeFilter = resolveManufacturerScopeFilter(query);
    if (scopeFilter) {
      parts.push(scopeFilter);
    }

    const vendorStatusFilter = resolveVendorStatusFilter(query);
    if (vendorStatusFilter) {
      parts.push(vendorStatusFilter);
    }
    if (
      query.manufacturerName !== undefined &&
      query.manufacturerName.trim() !== ''
    ) {
      parts.push({
        manufacturerName: new RegExp(
          escapeRegex(query.manufacturerName.trim()),
          'i',
        ),
      });
    }
    if (query.gpInternalId !== undefined && query.gpInternalId.trim() !== '') {
      parts.push({
        gpInternalId: new RegExp(escapeRegex(query.gpInternalId.trim()), 'i'),
      });
    }
    if (
      query.manufacturerInitial !== undefined &&
      query.manufacturerInitial.trim() !== ''
    ) {
      parts.push({
        manufacturerInitial: new RegExp(
          escapeRegex(query.manufacturerInitial.trim()),
          'i',
        ),
      });
    }

    if (parts.length === 0) {
      return {};
    }
    if (parts.length === 1) {
      return parts[0];
    }
    return { $and: parts };
  }

  /** One row for CSV/XLSX: mirrors admin grid Initial + Status (toggle = vendor active). */
  private async buildManufacturerExportRows(
    query: ListManufacturersQueryDto,
  ): Promise<
    Array<{
      _id: string;
      manufacturerName: string;
      gpInternalId: string;
      initial: string;
      manufacturerStatus: number;
      manufacturerStatusLabel: string;
      vendor_status: number;
      vendorStatusLabel: string;
      /** Admin UI vendor toggle: On only when vendor_status === 1 */
      statusToggle: 'On' | 'Off';
      vendor_name: string;
      vendor_email: string;
      vendor_phone: string;
      manufacturer_product_count: number;
      manufacturer_vendor_count: number;
      createdAt: Date | undefined;
      updatedAt: Date | undefined;
    }>
  > {
    const sortBy = query.sortBy ?? 'createdAt';
    const order = query.order ?? 'desc';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    let rawRows: Record<string, unknown>[];
    if (query.id) {
      if (!Types.ObjectId.isValid(query.id)) {
        throw new BadRequestException('Invalid manufacturer ID format');
      }
      const doc = await this.manufacturerModel
        .findById(query.id)
        .lean()
        .exec();
      rawRows = doc ? [doc as Record<string, unknown>] : [];
    } else {
      const filter = this.buildListFilter(query);
      rawRows = (await this.manufacturerModel
        .find(filter)
        .sort(sort)
        .lean()
        .exec()) as Record<string, unknown>[];
    }

    return Promise.all(
      rawRows.map(async (raw) => {
        const mid = new Types.ObjectId(String(raw._id));
        const counts = await this.countForManufacturer(mid);
        const ini = String(raw.manufacturerInitial ?? '').trim();
        const mSt = Number(raw.manufacturerStatus ?? 0);
        const vSt = Number(raw.vendor_status ?? 0);
        return {
          _id: String(raw._id),
          manufacturerName: String(raw.manufacturerName ?? ''),
          gpInternalId: String(raw.gpInternalId ?? ''),
          initial: ini,
          manufacturerStatus: mSt,
          manufacturerStatusLabel: manufacturerStatusLabel(mSt),
          vendor_status: vSt,
          vendorStatusLabel: vendorStatusLabel(vSt),
          statusToggle: vSt === 1 ? ('On' as const) : ('Off' as const),
          vendor_name: String(raw.vendor_name ?? ''),
          vendor_email: String(raw.vendor_email ?? ''),
          vendor_phone: String(raw.vendor_phone ?? ''),
          manufacturer_product_count: counts.manufacturer_product_count,
          manufacturer_vendor_count: counts.manufacturer_vendor_count,
          createdAt: raw.createdAt as Date | undefined,
          updatedAt: raw.updatedAt as Date | undefined,
        };
      }),
    );
  }

  /**
   * Full export (no pagination cap): same filters/sort as the listing.
   * Columns match the admin Excel layout, including **Initial** and **Status** (On/Off = vendor active).
   */
  async buildCsvExport(query: ListManufacturersQueryDto): Promise<string> {
    const rows = await this.buildManufacturerExportRows(query);

    const header = [
      'S.No',
      'Manufacturer Name',
      'GP Internal ID',
      'Vendor Name',
      'Vendor Email',
      'Vendor Phone',
      'Initial',
      'Status',
      'Manufacturer Verification',
      'Vendor Status Detail',
      'Product Count',
      'Vendor User Count',
      'MongoDB _id',
      'Created At',
      'Updated At',
    ];

    const lines: string[] = [header.join(',')];

    rows.forEach((r, idx) => {
      const row = [
        idx + 1,
        r.manufacturerName,
        r.gpInternalId,
        r.vendor_name,
        r.vendor_email,
        r.vendor_phone,
        r.initial,
        r.statusToggle,
        r.manufacturerStatusLabel,
        r.vendorStatusLabel,
        r.manufacturer_product_count,
        r.manufacturer_vendor_count,
        r._id,
        r.createdAt ? new Date(r.createdAt).toISOString() : '',
        r.updatedAt ? new Date(r.updatedAt).toISOString() : '',
      ]
        .map(csvEscape)
        .join(',');
      lines.push(row);
    });

    return lines.join('\r\n');
  }

  /** Same data as CSV, as `.xlsx` for Excel (includes Initial + Status columns). */
  async buildXlsxExport(
    query: ListManufacturersQueryDto,
  ): Promise<{ buffer: Buffer; fileName: string }> {
    const rows = await this.buildManufacturerExportRows(query);
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Manufacturers');

    ws.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Manufacturer Name', key: 'manufacturerName', width: 28 },
      { header: 'GP Internal ID', key: 'gpInternalId', width: 18 },
      { header: 'Vendor Name', key: 'vendor_name', width: 24 },
      { header: 'Vendor Email', key: 'vendor_email', width: 34 },
      { header: 'Vendor Phone', key: 'vendor_phone', width: 18 },
      { header: 'Initial', key: 'initial', width: 14 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Manufacturer Verification', key: 'mfgVerify', width: 22 },
      { header: 'Vendor Status Detail', key: 'vendorDetail', width: 18 },
      { header: 'Created At', key: 'createdAt', width: 26 },
    ];

    rows.forEach((r, i) => {
      ws.addRow({
        sno: i + 1,
        manufacturerName: r.manufacturerName,
        gpInternalId: r.gpInternalId,
        vendor_name: r.vendor_name,
        vendor_email: r.vendor_email,
        vendor_phone: r.vendor_phone,
        initial: r.initial,
        status: r.statusToggle,
        mfgVerify: r.manufacturerStatusLabel,
        vendorDetail: r.vendorStatusLabel,
        createdAt: r.createdAt
          ? new Date(r.createdAt).toISOString()
          : '',
      });
    });

    const raw = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.isBuffer(raw) ? raw : Buffer.from(raw as ArrayBuffer);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return {
      buffer,
      fileName: `manufacturers-export-${stamp}.xlsx`,
    };
  }

  async findAllPaginated(query: ListManufacturersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? 'createdAt';
    const order = query.order ?? 'desc';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const filter = this.buildListFilter(query);
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      this.manufacturerModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.manufacturerModel.countDocuments(filter).exec(),
    ]);

    const data = await Promise.all(
      rows.map(async (m) => {
        const mid = new Types.ObjectId(String(m._id));
        const counts = await this.countForManufacturer(mid);
        const iniRaw = String(m.manufacturerInitial ?? '').trim();
        const manufacturerInitial = iniRaw ? iniRaw : null;
        const mSt = Number(m.manufacturerStatus ?? 0);
        const vSt = Number(m.vendor_status ?? 0);
        return {
          _id: m._id,
          manufacturerName: m.manufacturerName,
          gpInternalId: m.gpInternalId ?? null,
          manufacturerInitial,
          /** Alias for grids/exports that key the column as `initial` */
          initial: manufacturerInitial,
          manufacturerImage: m.manufacturerImage ?? null,
          manufacturerStatus: mSt,
          manufacturerStatusLabel: manufacturerStatusLabel(mSt),
          vendor_name: m.vendor_name ?? '',
          vendor_email: m.vendor_email ?? '',
          vendor_phone: m.vendor_phone ?? '',
          vendor_status: vSt,
          vendorStatusLabel: vendorStatusLabel(vSt),
          /** Same as Excel export Status column: On when vendor_status === 1 */
          statusToggle: vSt === 1 ? ('On' as const) : ('Off' as const),
          manufacturer_product_count: counts.manufacturer_product_count,
          manufacturer_vendor_count: counts.manufacturer_vendor_count,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
        };
      }),
    );

    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

    return {
      message: 'Manufacturers retrieved successfully',
      data,
      total,
      totalCount: total,
      page,
      limit,
      totalPages,
      currentPage: page,
    };
  }

  /** Delete verified manufacturer only when both counts are zero. */
  async deleteManufacturerWithConstraint(id: string) {
    const manufacturerId = new Types.ObjectId(id);
    const manufacturer = await this.manufacturerModel
      .findById(manufacturerId)
      .exec();
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }
    if (manufacturer.manufacturerStatus !== 1) {
      throw new BadRequestException(
        'Use unverified delete endpoint for unverified manufacturer',
      );
    }
    const counts = await this.countForManufacturer(manufacturerId);
    if (
      counts.manufacturer_product_count > 0 ||
      counts.manufacturer_vendor_count > 0
    ) {
      throw new ConflictException(
        'Delete blocked: manufacturer_product_count and manufacturer_vendor_count must be 0',
      );
    }
    await this.manufacturerModel.deleteOne({ _id: manufacturerId }).exec();
    await this.manufacturerIdGeneration.enqueueReclaimedSuffixFromGpInternalId(
      manufacturer.gpInternalId,
    );
    return { _id: id };
  }

  /** Dedicated endpoint: delete only if unverified. */
  async deleteUnverifiedById(id: string) {
    const manufacturerId = new Types.ObjectId(id);
    const manufacturer = await this.manufacturerModel
      .findById(manufacturerId)
      .exec();
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }
    if (manufacturer.manufacturerStatus === 1) {
      throw new BadRequestException(
        'Only unverified manufacturer can be deleted from this endpoint',
      );
    }
    await this.manufacturerModel.deleteOne({ _id: manufacturerId }).exec();
    await this.manufacturerIdGeneration.enqueueReclaimedSuffixFromGpInternalId(
      manufacturer.gpInternalId,
    );
    return { _id: id };
  }
}
