import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { VendorUser, VendorUserDocument } from './schemas/vendor-user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VendorUsersService {
  constructor(
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
  ) {}

  async create(data: Partial<VendorUser>, session?: ClientSession): Promise<VendorUserDocument> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const vendorUser = new this.vendorUserModel(data);
    if (session) {
      return vendorUser.save({ session });
    }
    return vendorUser.save();
  }

  async findByEmail(email: string): Promise<VendorUserDocument | null> {
    return this.vendorUserModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<VendorUserDocument | null> {
    return this.vendorUserModel.findById(id).exec();
  }

  async update(id: string, data: Partial<VendorUser>): Promise<VendorUserDocument | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.vendorUserModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async verifyOtp(email: string, otp: string): Promise<VendorUserDocument | null> {
    const user = await this.findByEmail(email);
    if (!user || user.otp !== otp) {
      return null;
    }
    user.isVerified = true;
    user.otp = undefined;
    return user.save();
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
