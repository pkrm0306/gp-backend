import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Manufacturer, ManufacturerDocument } from '../manufacturers/schemas/manufacturer.schema';
import { Vendor, VendorDocument } from '../vendors/schemas/vendor.schema';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
  ) {}

  async updateManufacturer(
    id: string,
    updateDto: UpdateManufacturerDto,
    imagePath?: string,
  ) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const updateData: any = {
        manufacturerName: updateDto.manufacturerName,
        gpInternalId: updateDto.gpInternalId,
        manufacturerInitial: updateDto.manufacturerInitial,
        updatedAt: new Date(),
      };

      if (imagePath) {
        updateData.manufacturerImage = imagePath;
      }

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
      throw new BadRequestException(error.message || 'Failed to update manufacturer');
    }
  }

  async updateManufacturerStatus(id: string) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const manufacturer = await this.manufacturerModel.findById(manufacturerId).exec();

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }

      const currentStatus = manufacturer.manufacturerStatus;
      const newStatus = currentStatus === 1 ? 2 : 1;

      const updatedManufacturer = await this.manufacturerModel
        .findByIdAndUpdate(
          manufacturerId,
          {
            manufacturerStatus: newStatus,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      return updatedManufacturer;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid manufacturer ID format');
      }
      throw new BadRequestException(error.message || 'Failed to update manufacturer status');
    }
  }

  async updateVendorStatus(id: string) {
    try {
      const vendorId = new Types.ObjectId(id);
      const vendor = await this.vendorModel.findById(vendorId).exec();

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      const currentStatus = vendor.vendorStatus;
      let newStatus: number;

      if (currentStatus === 0) {
        newStatus = 1;
      } else if (currentStatus === 1) {
        newStatus = 0;
      } else {
        throw new BadRequestException(`Invalid vendor status: ${currentStatus}`);
      }

      const updatedVendor = await this.vendorModel
        .findByIdAndUpdate(
          vendorId,
          {
            vendorStatus: newStatus,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      return updatedVendor;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid vendor ID format');
      }
      throw new BadRequestException(error.message || 'Failed to update vendor status');
    }
  }
}
