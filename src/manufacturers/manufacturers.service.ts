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
import { uploadFile } from '../utils/upload-file.util';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

  async findById(id: string): Promise<ManufacturerDocument | null> {
    return this.manufacturerModel.findById(id).exec();
  }

  async findByVendorEmail(email: string): Promise<ManufacturerDocument | null> {
    return this.manufacturerModel.findOne({ vendor_email: email }).exec();
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
   * Resolve vendor-facing profile using login auth user id -> vendor_users.manufacturerId -> manufacturers doc.
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

    return {
      _id: manufacturer._id,
      manufacturerName: manufacturer.manufacturerName,
      gpInternalId: manufacturer.gpInternalId ?? null,
      manufacturerInitial: manufacturer.manufacturerInitial ?? null,
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

  async uploadVendorProfileBranding(
    authUser: { userId: string; manufacturerId?: string; vendorId?: string },
    files?: {
      gst?: Express.Multer.File[];
      companyLogo?: Express.Multer.File[];
      pan?: Express.Multer.File[];
    },
  ) {
    const gstFile = files?.gst?.[0];
    const logoFile = files?.companyLogo?.[0];
    const panFile = files?.pan?.[0];
    if (!gstFile && !logoFile && !panFile) {
      throw new BadRequestException(
        'Send at least one file: **gst** (PDF), **companyLogo** (image), and/or **pan** (PDF or JPEG).',
      );
    }
    const dto: UpdateProfileDto = {};
    if (gstFile) {
      dto.gst = (await uploadFile(gstFile, 'manufacturers')).fileUrl;
    }
    if (logoFile) {
      dto.companyLogo = (await uploadFile(logoFile, 'manufacturers')).fileUrl;
    }
    if (panFile) {
      dto.pan = (await uploadFile(panFile, 'manufacturers')).fileUrl;
    }
    return this.editProfile(authUser, dto);
  }

  async editProfile(
    authUser:
      | string
      | { userId: string; manufacturerId?: string; vendorId?: string },
    updateDto: UpdateProfileDto,
  ) {
    const userId = typeof authUser === 'string' ? authUser : authUser.userId;
    const { gstNumberToApply, gstPdfToApply } =
      this.partitionGstAndPdfFromUpdateDto(updateDto);
    const rawPanForBranding =
      updateDto.pan !== undefined ? String(updateDto.pan).trim() : '';
    const brandingAttempted =
      updateDto.companyLogo !== undefined ||
      gstPdfToApply !== undefined ||
      (updateDto.pan !== undefined && rawPanForBranding !== '');

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
        const vendorOnlyGst =
          gstNumberToApply ||
          (updateDto.gst !== undefined &&
          !this.looksLikeVendorAssetUrl(String(updateDto.gst))
            ? String(updateDto.gst).trim()
            : '');
        return {
          companyName: updateDto.companyName ?? '',
          name: updateDto.name ?? vendorUser?.name ?? '',
          designation: updateDto.designation ?? vendorUser?.designation ?? '',
          gst: vendorOnlyGst,
          gstPdf: '',
          companyLogo: '',
          pan: '',
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
        updateData.companyLogo = String(updateDto.companyLogo).trim();
      }
      if (updateDto.pan !== undefined) {
        const rawPan = String(updateDto.pan).trim();
        if (!rawPan) {
          updateData.vendorPanDocument = '';
        } else if (this.looksLikeVendorAssetUrl(rawPan)) {
          updateData.vendorPanDocument = rawPan;
        } else {
          throw new BadRequestException(
            'pan must be a document URL path (e.g. /uploads/manufacturers/...) or https://...',
          );
        }
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
   * Updates core manufacturer fields (name, GP internal id, initial). Same rules as admin manufacturer update.
   */
  async updateManufacturerDetails(
    id: string,
    dto: UpdateManufacturerDto,
    imagePath?: string,
  ) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const updateData = {
        manufacturerName: dto.manufacturerName,
        gpInternalId: dto.gpInternalId,
        manufacturerInitial: dto.manufacturerInitial,
        ...(dto.vendor_name !== undefined
          ? { vendor_name: dto.vendor_name }
          : {}),
        ...(dto.vendor_email !== undefined
          ? { vendor_email: dto.vendor_email }
          : {}),
        ...(dto.vendor_phone !== undefined
          ? { vendor_phone: dto.vendor_phone }
          : {}),
        ...(imagePath ? { manufacturerImage: imagePath } : {}),
        updatedAt: new Date(),
      };

      const manufacturer = await this.manufacturerModel
        .findByIdAndUpdate(manufacturerId, updateData, { new: true })
        .exec();

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }

      return manufacturer;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
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
        this.productModel.countDocuments({ manufacturerId }).exec(),
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
    if (query.manufacturerStatus !== undefined) {
      parts.push({ manufacturerStatus: query.manufacturerStatus });
    }
    if (query.vendor_status !== undefined) {
      parts.push({ vendor_status: query.vendor_status });
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
        return {
          _id: m._id,
          manufacturerName: m.manufacturerName,
          gpInternalId: m.gpInternalId ?? null,
          manufacturerInitial: m.manufacturerInitial ?? null,
          manufacturerImage: m.manufacturerImage ?? null,
          manufacturerStatus: m.manufacturerStatus ?? 0,
          vendor_name: m.vendor_name ?? '',
          vendor_email: m.vendor_email ?? '',
          vendor_phone: m.vendor_phone ?? '',
          vendor_status: m.vendor_status ?? 0,
          manufacturer_product_count: counts.manufacturer_product_count,
          manufacturer_vendor_count: counts.manufacturer_vendor_count,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
        };
      }),
    );

    return {
      message: 'Manufacturers retrieved successfully',
      data,
      total,
      page,
      limit,
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
    return { _id: id };
  }
}
