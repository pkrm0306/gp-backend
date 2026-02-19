import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VendorUser, VendorUserDocument } from '../vendor-users/schemas/vendor-user.schema';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { UpdatePartnerStatusDto } from './dto/update-partner-status.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PartnersService {
  constructor(
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
  ) {}

  async findAll(vendorId: string) {
    try {
      let vendorObjectId: Types.ObjectId;
      try {
        vendorObjectId = new Types.ObjectId(vendorId);
      } catch (error) {
        throw new BadRequestException('Invalid vendor ID format');
      }

      const partners = await this.vendorUserModel
        .find({
          $or: [
            { vendorId: vendorObjectId },
            { vendorId: vendorId },
          ],
          type: 'partner',
          status: { $ne: 2 },
        })
        .sort({ name: 1 })
        .exec();

      return partners;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Error retrieving partners');
    }
  }

  async findOne(id: string, vendorId: string): Promise<VendorUserDocument | null> {
    try {
      let vendorObjectId: Types.ObjectId;
      let partnerId: Types.ObjectId;
      
      try {
        vendorObjectId = new Types.ObjectId(vendorId);
        partnerId = new Types.ObjectId(id);
      } catch (error) {
        throw new BadRequestException('Invalid ID format');
      }

      const partner = await this.vendorUserModel
        .findOne({
          _id: partnerId,
          $or: [
            { vendorId: vendorObjectId },
            { vendorId: vendorId },
          ],
          type: 'partner',
        })
        .exec();

      if (!partner) {
        throw new NotFoundException('Partner not found');
      }

      return partner;
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid ID format');
    }
  }

  async create(vendorId: string, createPartnerDto: CreatePartnerDto) {
    try {
      const vendorObjectId = new Types.ObjectId(vendorId);
      
      const existingActivePartner = await this.vendorUserModel
        .findOne({
          vendorId: vendorObjectId,
          status: { $ne: 2 },
          $or: [{ email: createPartnerDto.email }, { phone: createPartnerDto.phone }],
        })
        .exec();

      if (existingActivePartner) {
        if (existingActivePartner.email === createPartnerDto.email) {
          throw new ConflictException('Email already exists for this vendor');
        }
        if (existingActivePartner.phone === createPartnerDto.phone) {
          throw new ConflictException('Phone number already exists for this vendor');
        }
      }

      const softDeletedPartner = await this.vendorUserModel
        .findOne({
          email: createPartnerDto.email,
          status: 2,
          type: 'partner',
        })
        .exec();

      if (softDeletedPartner) {
        if (softDeletedPartner.vendorId.toString() !== vendorId) {
          throw new ConflictException('Email already exists for another vendor');
        }
        const hashedPassword = await bcrypt.hash(createPartnerDto.password, 10);
        softDeletedPartner.name = createPartnerDto.name;
        softDeletedPartner.phone = createPartnerDto.phone;
        softDeletedPartner.password = hashedPassword;
        softDeletedPartner.status = 1;
        softDeletedPartner.isVerified = false;
        softDeletedPartner.updatedAt = new Date();
        return await softDeletedPartner.save();
      }

      const partnerData: Partial<VendorUser> = {
        vendorId: vendorObjectId,
        name: createPartnerDto.name,
        email: createPartnerDto.email,
        phone: createPartnerDto.phone,
        type: 'partner',
        status: 1,
        isVerified: false,
      };

      partnerData.password = await bcrypt.hash(createPartnerDto.password, 10);

      const partner = new this.vendorUserModel(partnerData);
      return await partner.save();
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || 'field';
        const softDeletedPartner = await this.vendorUserModel
          .findOne({
            [field]: error.keyValue?.[field],
            status: 2,
            type: 'partner',
          })
          .exec();

        if (softDeletedPartner && softDeletedPartner.vendorId.toString() === vendorId) {
          const hashedPassword = await bcrypt.hash(createPartnerDto.password, 10);
          softDeletedPartner.name = createPartnerDto.name;
          softDeletedPartner.email = createPartnerDto.email;
          softDeletedPartner.phone = createPartnerDto.phone;
          softDeletedPartner.password = hashedPassword;
          softDeletedPartner.status = 1;
          softDeletedPartner.isVerified = false;
          softDeletedPartner.updatedAt = new Date();
          return await softDeletedPartner.save();
        }
        throw new ConflictException(`${field} already exists`);
      }
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(
        error.message || 'Invalid vendor ID or data. Please check your input.',
      );
    }
  }

  async update(id: string, vendorId: string, updatePartnerDto: UpdatePartnerDto) {
    const partner = await this.findOne(id, vendorId);

    if (updatePartnerDto.email || updatePartnerDto.phone) {
      try {
        let vendorObjectId: Types.ObjectId;
        let partnerId: Types.ObjectId;
        
        try {
          vendorObjectId = new Types.ObjectId(vendorId);
          partnerId = new Types.ObjectId(id);
        } catch (error) {
          throw new BadRequestException('Invalid ID format');
        }

        const emailPhoneConditions = [];
        if (updatePartnerDto.email) {
          emailPhoneConditions.push({ email: updatePartnerDto.email });
        }
        if (updatePartnerDto.phone) {
          emailPhoneConditions.push({ phone: updatePartnerDto.phone });
        }

        const existingPartner = await this.vendorUserModel
          .findOne({
            $and: [
              {
                $or: [
                  { vendorId: vendorObjectId },
                  { vendorId: vendorId },
                ],
              },
              {
                _id: { $ne: partnerId },
              },
              {
                status: { $ne: 2 },
              },
              ...(emailPhoneConditions.length > 0 ? [{ $or: emailPhoneConditions }] : []),
            ],
          })
          .exec();

        if (existingPartner) {
          if (updatePartnerDto.email && existingPartner.email === updatePartnerDto.email) {
            throw new ConflictException('Email already exists for this vendor');
          }
          if (updatePartnerDto.phone && existingPartner.phone === updatePartnerDto.phone) {
            throw new ConflictException('Phone number already exists for this vendor');
          }
        }
      } catch (error: any) {
        if (error instanceof ConflictException || error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException('Invalid ID format');
      }
    }

    const updateData: Partial<VendorUser> = {
      updatedAt: new Date(),
    };

    if (updatePartnerDto.name) {
      updateData.name = updatePartnerDto.name;
    }

    if (updatePartnerDto.email) {
      updateData.email = updatePartnerDto.email;
    }

    if (updatePartnerDto.phone) {
      updateData.phone = updatePartnerDto.phone;
    }

    if (updatePartnerDto.password && updatePartnerDto.password.trim() !== '') {
      updateData.password = await bcrypt.hash(updatePartnerDto.password, 10);
    }

    try {
      const partnerId = new Types.ObjectId(id);
      const updatedPartner = await this.vendorUserModel
        .findByIdAndUpdate(partnerId, updateData, { new: true })
        .exec();
      
      if (!updatedPartner) {
        throw new NotFoundException('Partner not found');
      }
      
      return updatedPartner;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid partner ID');
    }
  }

  async updateStatus(vendorId: string, updateStatusDto: UpdatePartnerStatusDto) {
    const partner = await this.findOne(updateStatusDto.partnerId, vendorId);

    if (partner.status !== updateStatusDto.currentStatus) {
      throw new BadRequestException(
        `Partner current status is ${partner.status}, not ${updateStatusDto.currentStatus}`,
      );
    }

    const newStatus = updateStatusDto.currentStatus === 1 ? 0 : 1;

    try {
      const partnerId = new Types.ObjectId(updateStatusDto.partnerId);
      return this.vendorUserModel
        .findByIdAndUpdate(
          partnerId,
          {
            status: newStatus,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new BadRequestException('Invalid partner ID');
    }
  }

  async remove(id: string, vendorId: string) {
    const partner = await this.findOne(id, vendorId);

    try {
      const partnerId = new Types.ObjectId(id);
      return this.vendorUserModel
        .findByIdAndUpdate(
          partnerId,
          {
            status: 2,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new BadRequestException('Invalid partner ID');
    }
  }
}
