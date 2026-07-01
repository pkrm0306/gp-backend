import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VendorUsersService } from '../../vendor-users/vendor-users.service';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import { NotificationRecipient } from '../interfaces/notification.types';

export type ResolvedVendorRecipient = NotificationRecipient & {
  vendorName?: string;
  companyName?: string;
};

@Injectable()
export class NotificationRecipientService {
  constructor(
    private readonly vendorUsersService: VendorUsersService,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
  ) {}

  async resolveByManufacturerId(
    manufacturerId: string,
  ): Promise<ResolvedVendorRecipient | null> {
    if (!manufacturerId?.trim() || !Types.ObjectId.isValid(manufacturerId)) {
      return null;
    }

    const manufacturer = await this.manufacturerModel
      .findById(manufacturerId.trim())
      .exec();
    if (!manufacturer) {
      return null;
    }

    const companyName =
      String(manufacturer.manufacturerName ?? '').trim() ||
      String(manufacturer.vendor_name ?? '').trim();
    const vendorEmail = String(manufacturer.vendor_email ?? '')
      .trim()
      .toLowerCase();

    let user = await this.vendorUsersService.findPrimaryLoginUserForManufacturer(
      manufacturerId,
    );
    if (!user && vendorEmail) {
      user = await this.vendorUsersService.findByEmail(vendorEmail);
    }

    const vendorName =
      String(user?.name ?? '').trim() ||
      String(manufacturer.vendor_name ?? '').trim() ||
      companyName;

    const email =
      String(user?.email ?? '')
        .trim()
        .toLowerCase() || vendorEmail;

    if (!email) {
      return null;
    }

    return {
      userId: user?._id?.toString(),
      email,
      vendorName,
      companyName,
    };
  }

  async resolveByVendorUserId(
    userId: string,
  ): Promise<ResolvedVendorRecipient | null> {
    if (!userId?.trim() || !Types.ObjectId.isValid(userId)) {
      return null;
    }
    const user = await this.vendorUsersService.findById(userId.trim());
    if (!user) {
      return null;
    }
    const manufacturerId =
      user.manufacturerId?.toString() || user.vendorId?.toString();
    const base = manufacturerId
      ? await this.resolveByManufacturerId(manufacturerId)
      : null;
    return {
      userId: user._id.toString(),
      email: user.email?.trim().toLowerCase(),
      vendorName: base?.vendorName || user.name,
      companyName: base?.companyName,
    };
  }
}
