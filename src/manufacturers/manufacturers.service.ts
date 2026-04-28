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
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ListManufacturersQueryDto } from './dto/list-manufacturers-query.dto';

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
      vendor_status: manufacturer.vendor_status ?? 0,
      createdAt: manufacturer.createdAt,
      updatedAt: manufacturer.updatedAt,
    };
  }

  async editProfile(userId: string, updateDto: UpdateProfileDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const vendorUser = await this.vendorUsersService.findById(userId);
      if (!vendorUser) {
        throw new NotFoundException('Vendor user not found');
      }

      const manufacturer = await this.manufacturerModel
        .findById(vendorUser.manufacturerId.toString())
        .exec();
      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }

      if (updateDto.gst) {
        const gstExists = await this.manufacturerModel
          .findOne({
            _id: { $ne: manufacturer._id },
            vendor_gst: updateDto.gst,
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
            _id: { $ne: manufacturer._id },
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
      if (updateDto.gst !== undefined) {
        updateData.vendor_gst = updateDto.gst;
      }
      if (updateDto.email) {
        updateData.vendor_email = updateDto.email;
      }
      if (updateDto.mobile) {
        updateData.vendor_phone = updateDto.mobile;
      }

      if (Object.keys(updateData).length > 0) {
        await this.update(manufacturer._id.toString(), updateData, session);
      }

      await session.commitTransaction();
      return this.findById(manufacturer._id.toString());
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
