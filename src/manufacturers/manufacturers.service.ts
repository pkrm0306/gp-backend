import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Connection } from 'mongoose';
import { Manufacturer, ManufacturerDocument } from './schemas/manufacturer.schema';
import { VendorUsersService } from '../vendor-users/vendor-users.service';
import { UpdateProfileDto } from './dto/update-manufacturer-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectConnection() private connection: Connection,
    private vendorUsersService: VendorUsersService,
  ) {}

  async create(data: Partial<Manufacturer>, session?: ClientSession): Promise<ManufacturerDocument> {
    const manufacturer = new this.manufacturerModel(data);
    if (session) {
      return manufacturer.save({ session });
    }
    return manufacturer.save();
  }

  async findById(id: string): Promise<ManufacturerDocument | null> {
    return this.manufacturerModel.findById(id).exec();
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
      throw new BadRequestException('New password and confirm password do not match');
    }

    const user = await this.vendorUsersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isCurrentPasswordValid = await this.vendorUsersService.comparePassword(
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
}
