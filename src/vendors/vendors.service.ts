import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, ClientSession, Connection } from 'mongoose';
import { Vendor, VendorDocument } from './schemas/vendor.schema';
import { VendorUsersService } from '../vendor-users/vendor-users.service';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { UpdateProfileDto } from './dto/update-vendor.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
    @InjectConnection() private connection: Connection,
    private vendorUsersService: VendorUsersService,
    private manufacturersService: ManufacturersService,
  ) {}

  async create(data: Partial<Vendor>, session?: ClientSession): Promise<VendorDocument> {
    const vendor = new this.vendorModel(data);
    if (session) {
      return vendor.save({ session });
    }
    return vendor.save();
  }

  async findById(id: string): Promise<VendorDocument | null> {
    return this.vendorModel.findById(id).populate('manufacturerId').exec();
  }

  async update(
    id: string,
    data: Partial<Vendor>,
    session?: ClientSession,
  ): Promise<VendorDocument | null> {
    const options = session ? { session, new: true } : { new: true };
    return this.vendorModel.findByIdAndUpdate(id, data, options).exec();
  }

  async getProfile(vendorId: string) {
    const vendor = await this.findById(vendorId);
    if (!vendor) {
      throw new BadRequestException('Vendor not found');
    }
    return vendor;
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const vendorUser = await this.vendorUsersService.findById(userId);
      if (!vendorUser) {
        throw new NotFoundException('Vendor user not found');
      }

      const vendor = await this.vendorModel
        .findById(vendorUser.vendorId.toString())
        .exec();
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      const manufacturerId = vendor.manufacturerId.toString();

      const updateData: any = {};

      if (updateDto.companyName) {
        await this.manufacturersService.update(
          manufacturerId,
          { manufacturerName: updateDto.companyName },
          session,
        );
      }

      if (updateDto.name) {
        updateData.vendorName = updateDto.name;
      }

      if (updateDto.designation !== undefined) {
        updateData.vendorDesignation = updateDto.designation;
      }

      if (updateDto.gst !== undefined) {
        updateData.vendorGst = updateDto.gst;
      }

      if (updateDto.email) {
        updateData.vendorEmail = updateDto.email;
      }

      if (updateDto.mobile) {
        updateData.vendorPhone = updateDto.mobile;
      }

      if (Object.keys(updateData).length > 0) {
        await this.update(vendor._id.toString(), updateData, session);
      }

      await session.commitTransaction();

      const updatedVendor = await this.findById(vendor._id.toString());
      return updatedVendor;
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
