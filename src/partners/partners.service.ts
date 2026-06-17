import {

  Injectable,

  BadRequestException,

  NotFoundException,

  ConflictException,

  Logger,

} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import {

  VendorUser,

  VendorUserDocument,

} from '../vendor-users/schemas/vendor-user.schema';

import { CreatePartnerDto } from './dto/create-partner.dto';

import { UpdatePartnerDto } from './dto/update-partner.dto';

import { UpdatePartnerStatusDto } from './dto/update-partner-status.dto';

import * as bcrypt from 'bcryptjs';
import { GlobalPhoneUniquenessService } from '../common/services/global-phone-uniqueness.service';
import { buildPhoneFieldMatchClauses } from '../common/utils/phone-lookup.util';
import {
  resolvePartnerCountryCode,
  resolvePartnerPhone,
  type PartnerPhoneFields,
} from './utils/partner-phone.util';
import { EmailService } from '../common/services/email.service';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';



@Injectable()

export class PartnersService {

  private readonly logger = new Logger(PartnersService.name);

  constructor(

    @InjectModel(VendorUser.name)

    private vendorUserModel: Model<VendorUserDocument>,

    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,

    private readonly globalPhoneUniqueness: GlobalPhoneUniquenessService,

    private readonly emailService: EmailService,

    private readonly configService: ConfigService,

  ) {}



  private toManufacturerObjectId(vendorId: string): Types.ObjectId {

    try {

      return new Types.ObjectId(vendorId);

    } catch {

      throw new BadRequestException('Invalid vendor ID format');

    }

  }



  private manufacturerScopeFilter(manufacturerObjectId: Types.ObjectId) {

    return {

      $or: [

        { manufacturerId: manufacturerObjectId },

        { vendorId: manufacturerObjectId },

      ],

    };

  }



  private resolvePhone(dto: PartnerPhoneFields): string {
    return resolvePartnerPhone(dto);
  }

  private resolveCountryCode(dto: PartnerPhoneFields): string | undefined {
    return resolvePartnerCountryCode(dto);
  }

  private buildPartnerPhoneMatch(phone: string): Record<string, unknown>[] {
    return buildPhoneFieldMatchClauses('phone', phone);
  }



  private assertPasswordsMatch(password: string, confirmPassword: string): void {

    if (password !== confirmPassword) {

      throw new BadRequestException('Password and confirm password do not match');

    }

  }

  private scheduleAdminTeamMemberRegisteredEmail(
    manufacturerId: string,
    params: {
      memberName: string;
      memberEmail: string;
      memberPhone: string;
      password: string;
    },
  ): void {
    const adminEmail =
      this.configService.get<string>('SMTP_ADMIN_ALERT_EMAIL')?.trim() ||
      this.configService.get<string>('ADMIN_ALERT_EMAIL')?.trim();

    this.emailService.sendInBackground(async () => {
      const manufacturer = await this.manufacturerModel
        .findById(manufacturerId)
        .select('manufacturerName vendor_name')
        .lean()
        .exec();

      const manufacturerName =
        String(manufacturer?.manufacturerName ?? '').trim() ||
        String(manufacturer?.vendor_name ?? '').trim() ||
        undefined;

      await this.emailService.sendVendorTeamMemberCredentialsEmail(
        params.memberEmail,
        {
          memberName: params.memberName,
          password: params.password,
          manufacturerName,
          loginUrl: this.resolveVendorPortalLoginUrl(),
        },
      );

      if (!adminEmail) {
        this.logger.warn(
          'Admin alert email not configured (SMTP_ADMIN_ALERT_EMAIL / ADMIN_ALERT_EMAIL); skipped admin team member notification',
        );
        return;
      }

      await this.emailService.sendVendorTeamMemberRegisteredAdminEmail(
        adminEmail,
        {
          manufacturerName,
          memberName: params.memberName,
          memberEmail: params.memberEmail,
          memberPhone: params.memberPhone,
          password: params.password,
        },
      );
    });
  }

  private resolveVendorPortalLoginUrl(): string | undefined {
    const explicit =
      this.configService.get<string>('VENDOR_PORTAL_URL')?.trim() ||
      this.configService.get<string>('VENDOR_LOGIN_URL')?.trim();
    if (explicit) {
      return explicit.replace(/\/$/, '');
    }
    const frontend = this.configService.get<string>('FRONTEND_URL')?.trim();
    if (frontend) {
      return `${frontend.replace(/\/$/, '')}/vendor/login`;
    }
    return undefined;
  }



  async findAll(vendorId: string) {

    try {

      const manufacturerObjectId = this.toManufacturerObjectId(vendorId);



      const partners = await this.vendorUserModel

        .find({

          ...this.manufacturerScopeFilter(manufacturerObjectId),

          type: 'partner',

          status: { $ne: 2 },

        })

        .sort({ createdAt: -1, _id: -1 })

        .exec();



      return partners;

    } catch (error: any) {

      if (error instanceof BadRequestException) {

        throw error;

      }

      throw new BadRequestException(

        error.message || 'Error retrieving partners',

      );

    }

  }



  async findOne(

    id: string,

    vendorId: string,

  ): Promise<VendorUserDocument | null> {

    try {

      const manufacturerObjectId = this.toManufacturerObjectId(vendorId);

      const partnerId = new Types.ObjectId(id);



      const partner = await this.vendorUserModel

        .findOne({

          _id: partnerId,

          ...this.manufacturerScopeFilter(manufacturerObjectId),

          type: 'partner',

        })

        .exec();



      if (!partner) {

        throw new NotFoundException('Partner not found');

      }



      return partner;

    } catch (error: any) {

      if (

        error instanceof NotFoundException ||

        error instanceof BadRequestException

      ) {

        throw error;

      }

      throw new BadRequestException('Invalid ID format');

    }

  }



  async create(vendorId: string, createPartnerDto: CreatePartnerDto) {

    try {

      this.assertPasswordsMatch(

        createPartnerDto.password,

        createPartnerDto.confirmPassword,

      );



      const manufacturerObjectId = this.toManufacturerObjectId(vendorId);

      const phone = this.resolvePhone(createPartnerDto);
      const countryCode = this.resolveCountryCode(createPartnerDto);

      const email = createPartnerDto.email.trim().toLowerCase();



      await this.globalPhoneUniqueness.assertPhoneAvailable(phone);



      const scope = this.manufacturerScopeFilter(manufacturerObjectId);



      const phoneMatch = this.buildPartnerPhoneMatch(phone);

      const existingActivePartner = await this.vendorUserModel

        .findOne({

          ...scope,

          status: { $ne: 2 },

          $or: [{ email }, ...phoneMatch],

        })

        .exec();



      if (existingActivePartner) {

        if (existingActivePartner.email === email) {

          throw new ConflictException('Email already exists for this vendor');

        }

        throw new ConflictException(

          'Phone number already exists for this vendor',

        );

      }



      const softDeletedPartner = await this.vendorUserModel

        .findOne({

          email,

          status: 2,

          type: 'partner',

        })

        .exec();



      if (softDeletedPartner) {

        const ownerId =

          softDeletedPartner.manufacturerId?.toString() ||

          softDeletedPartner.vendorId?.toString();

        if (ownerId !== vendorId) {

          throw new ConflictException(

            'Email already exists for another vendor',

          );

        }

        const hashedPassword = await bcrypt.hash(createPartnerDto.password, 10);

        softDeletedPartner.manufacturerId = manufacturerObjectId;

        softDeletedPartner.vendorId = manufacturerObjectId;

        softDeletedPartner.name = createPartnerDto.name.trim();

        softDeletedPartner.phone = phone;

        if (countryCode) {
          softDeletedPartner.countryCode = countryCode;
        }

        softDeletedPartner.password = hashedPassword;

        softDeletedPartner.status = 1;

        softDeletedPartner.isVerified = true;

        softDeletedPartner.updatedAt = new Date();

        const restored = await softDeletedPartner.save();
        this.scheduleAdminTeamMemberRegisteredEmail(vendorId, {
          memberName: createPartnerDto.name.trim(),
          memberEmail: email,
          memberPhone: phone,
          password: createPartnerDto.password,
        });
        return restored;

      }



      const partnerData: Partial<VendorUser> = {

        manufacturerId: manufacturerObjectId,

        vendorId: manufacturerObjectId,

        name: createPartnerDto.name.trim(),

        email,

        phone,

        ...(countryCode ? { countryCode } : {}),

        type: 'partner',

        status: 1,

        isVerified: true,

        password: await bcrypt.hash(createPartnerDto.password, 10),

      };



      const partner = new this.vendorUserModel(partnerData);

      const created = await partner.save();
      this.scheduleAdminTeamMemberRegisteredEmail(vendorId, {
        memberName: createPartnerDto.name.trim(),
        memberEmail: email,
        memberPhone: phone,
        password: createPartnerDto.password,
      });
      return created;

    } catch (error: any) {

      if (

        error instanceof ConflictException ||

        error instanceof BadRequestException

      ) {

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



        const ownerId =

          softDeletedPartner?.manufacturerId?.toString() ||

          softDeletedPartner?.vendorId?.toString();



        if (softDeletedPartner && ownerId === vendorId) {

          const hashedPassword = await bcrypt.hash(

            createPartnerDto.password,

            10,

          );

          softDeletedPartner.manufacturerId =

            this.toManufacturerObjectId(vendorId);

          softDeletedPartner.vendorId = this.toManufacturerObjectId(vendorId);

          softDeletedPartner.name = createPartnerDto.name.trim();

          softDeletedPartner.email = createPartnerDto.email

            .trim()

            .toLowerCase();

          softDeletedPartner.phone = this.resolvePhone(createPartnerDto);

          const restoredCountryCode = this.resolveCountryCode(createPartnerDto);
          if (restoredCountryCode) {
            softDeletedPartner.countryCode = restoredCountryCode;
          }

          softDeletedPartner.password = hashedPassword;

          softDeletedPartner.status = 1;

          softDeletedPartner.isVerified = true;

          softDeletedPartner.updatedAt = new Date();

          const restoredDuplicate = await softDeletedPartner.save();
          this.scheduleAdminTeamMemberRegisteredEmail(vendorId, {
            memberName: createPartnerDto.name.trim(),
            memberEmail: createPartnerDto.email.trim().toLowerCase(),
            memberPhone: this.resolvePhone(createPartnerDto),
            password: createPartnerDto.password,
          });
          return restoredDuplicate;

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



  async update(

    id: string,

    vendorId: string,

    updatePartnerDto: UpdatePartnerDto,

  ) {

    const partner = await this.findOne(id, vendorId);



    if (updatePartnerDto.password?.trim()) {

      this.assertPasswordsMatch(

        updatePartnerDto.password,

        String(updatePartnerDto.confirmPassword ?? ''),

      );

    }



    const phoneFieldsTouched =
      updatePartnerDto.phone !== undefined ||
      updatePartnerDto.mobile !== undefined ||
      updatePartnerDto.countryCode !== undefined ||
      updatePartnerDto.country_code !== undefined ||
      updatePartnerDto.dialCode !== undefined ||
      updatePartnerDto.dial_code !== undefined;

    const resolvedPhone = phoneFieldsTouched
      ? this.resolvePhone({
          phone: updatePartnerDto.phone ?? updatePartnerDto.mobile ?? partner.phone,
          mobile: updatePartnerDto.mobile,
          countryCode:
            updatePartnerDto.countryCode ??
            updatePartnerDto.country_code ??
            partner.countryCode,
          country_code: updatePartnerDto.country_code,
          dialCode: updatePartnerDto.dialCode,
          dial_code: updatePartnerDto.dial_code,
        })
      : undefined;

    const resolvedCountryCode = phoneFieldsTouched
      ? this.resolveCountryCode({
          countryCode:
            updatePartnerDto.countryCode ??
            updatePartnerDto.country_code ??
            partner.countryCode,
          country_code: updatePartnerDto.country_code,
          dialCode: updatePartnerDto.dialCode,
          dial_code: updatePartnerDto.dial_code,
        })
      : undefined;



    if (updatePartnerDto.email || resolvedPhone) {

      try {

        const manufacturerObjectId = this.toManufacturerObjectId(vendorId);

        const partnerId = new Types.ObjectId(id);



        if (resolvedPhone) {

          await this.globalPhoneUniqueness.assertPhoneAvailable(resolvedPhone, {

            excludeUserId: partnerId,

          });

        }



        const emailPhoneConditions: Record<string, unknown>[] = [];

        if (updatePartnerDto.email) {

          emailPhoneConditions.push({

            email: updatePartnerDto.email.trim().toLowerCase(),

          });

        }

        if (resolvedPhone) {

          emailPhoneConditions.push(...this.buildPartnerPhoneMatch(resolvedPhone));

        }



        const existingPartner = await this.vendorUserModel

          .findOne({

            $and: [

              this.manufacturerScopeFilter(manufacturerObjectId),

              { _id: { $ne: partnerId } },

              { status: { $ne: 2 } },

              ...(emailPhoneConditions.length > 0

                ? [{ $or: emailPhoneConditions }]

                : []),

            ],

          })

          .exec();



        if (existingPartner) {

          const nextEmail = updatePartnerDto.email?.trim().toLowerCase();

          if (nextEmail && existingPartner.email === nextEmail) {

            throw new ConflictException('Email already exists for this vendor');

          }

          throw new ConflictException(

            'Phone number already exists for this vendor',

          );

        }

      } catch (error: any) {

        if (

          error instanceof ConflictException ||

          error instanceof BadRequestException

        ) {

          throw error;

        }

        throw new BadRequestException('Invalid ID format');

      }

    }



    const updateData: Partial<VendorUser> = {

      updatedAt: new Date(),

      manufacturerId: partner.manufacturerId ?? this.toManufacturerObjectId(vendorId),

      vendorId: partner.vendorId ?? this.toManufacturerObjectId(vendorId),

    };



    if (updatePartnerDto.name) {

      updateData.name = updatePartnerDto.name.trim();

    }



    if (updatePartnerDto.email) {

      updateData.email = updatePartnerDto.email.trim().toLowerCase();

    }



    if (resolvedPhone) {

      updateData.phone = resolvedPhone;

    }

    if (resolvedCountryCode) {

      updateData.countryCode = resolvedCountryCode;

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



  async updateStatus(

    vendorId: string,

    updateStatusDto: UpdatePartnerStatusDto,

  ) {

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

}


