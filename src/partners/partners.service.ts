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
import * as crypto from 'crypto';
import { GlobalPhoneUniquenessService } from '../common/services/global-phone-uniqueness.service';
import { buildPhoneFieldMatchClauses } from '../common/utils/phone-lookup.util';
import {
  resolvePartnerCountryCode,
  resolvePartnerPhone,
  type PartnerPhoneFields,
} from './utils/partner-phone.util';
import { EmailService } from '../common/services/email.service';
import { resolveAdminAlertTo } from '../notifications/utils/notification-recipient-groups.util';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';

export type ProfileContactPortalSeed = {
  name: string;
  email: string;
  phone: string;
  /** 1 = Active portal access (default), 0 = Inactive / restricted. */
  status?: 0 | 1;
};



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
    const adminEmail = resolveAdminAlertTo(this.configService);

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



      return partners.map((p) => this.toPartnerClientPayload(p));

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



  /** New partners / contact persons default to Active (1) so portal access is not restricted. */
  private resolveCreateStatus(dto: CreatePartnerDto): 0 | 1 {
    return dto.status === 0 ? 0 : 1;
  }

  /**
   * Soft-deleted rows (esp. legacy staff) still occupy the global unique `email` index.
   * Reclaim them as Active partners so profile-contact / team-member portal logins work.
   */
  private async findReclaimableSoftDeletedByEmail(
    email: string,
  ): Promise<VendorUserDocument | null> {
    return this.vendorUserModel
      .findOne({
        email,
        status: 2,
      })
      .exec();
  }

  private assertSoftDeletedEmailCanBecomePartner(
    softDeleted: VendorUserDocument,
    vendorId: string,
  ): void {
    const type = String(softDeleted.type ?? '')
      .trim()
      .toLowerCase();
    const ownerId =
      softDeleted.manufacturerId?.toString() || softDeleted.vendorId?.toString();

    // Soft-deleted platform accounts (or unscoped rows) can be reused for vendor portal login.
    if (type === 'staff' || type === 'admin' || !ownerId) {
      return;
    }

    // Soft-deleted partner/vendor belonging to another manufacturer stays blocked.
    if (ownerId !== vendorId) {
      throw new ConflictException('Email already exists for another vendor');
    }
  }

  private async restoreSoftDeletedAsPartner(
    softDeleted: VendorUserDocument,
    vendorId: string,
    params: {
      name: string;
      email: string;
      phone: string;
      countryCode?: string;
      password: string;
      status: 0 | 1;
    },
  ): Promise<VendorUserDocument> {
    this.assertSoftDeletedEmailCanBecomePartner(softDeleted, vendorId);
    const manufacturerObjectId = this.toManufacturerObjectId(vendorId);
    const hashedPassword = await bcrypt.hash(params.password, 10);

    const updated = await this.vendorUserModel
      .findByIdAndUpdate(
        softDeleted._id,
        {
          $set: {
            manufacturerId: manufacturerObjectId,
            vendorId: manufacturerObjectId,
            name: params.name,
            email: params.email,
            phone: params.phone,
            ...(params.countryCode ? { countryCode: params.countryCode } : {}),
            password: hashedPassword,
            type: 'partner',
            status: params.status,
            isVerified: true,
            updatedAt: new Date(),
          },
          // Drop staff/website-team fields that unique indexes / validation still key on.
          $unset: {
            team: 1,
            businessVertical: 1,
            displayOrder: 1,
            sector_ids: 1,
            sector_id: 1,
            category_ids: 1,
            category_id: 1,
            image: 1,
            designation: 1,
            showOnWebsite: 1,
          },
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) {
      throw new BadRequestException(
        `Could not restore portal login for ${params.email}`,
      );
    }
    return updated;
  }

  private toPartnerClientPayload(partner: VendorUserDocument | Record<string, unknown>) {
    const obj =
      typeof (partner as VendorUserDocument).toObject === 'function'
        ? (partner as VendorUserDocument).toObject()
        : { ...(partner as Record<string, unknown>) };
    const statusNum = Number((obj as { status?: unknown }).status);
    const status = statusNum === 2 ? 2 : statusNum === 1 ? 1 : 0;
    const { password: _password, otp: _otp, ...safe } = obj as Record<
      string,
      unknown
    > & { password?: unknown; otp?: unknown };
    return {
      ...safe,
      id: String((obj as { _id?: unknown })._id ?? ''),
      mobile: String((obj as { phone?: unknown }).phone ?? ''),
      status,
      currentStatus: status,
      is_active: status === 1,
    };
  }

  async create(vendorId: string, createPartnerDto: CreatePartnerDto) {
    const createStatus = this.resolveCreateStatus(createPartnerDto);

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



      const softDeletedUser = await this.findReclaimableSoftDeletedByEmail(email);

      if (softDeletedUser) {
        const restored = await this.restoreSoftDeletedAsPartner(
          softDeletedUser,
          vendorId,
          {
            name: createPartnerDto.name.trim(),
            email,
            phone,
            countryCode,
            password: createPartnerDto.password,
            status: createStatus,
          },
        );
        this.scheduleAdminTeamMemberRegisteredEmail(vendorId, {
          memberName: createPartnerDto.name.trim(),
          memberEmail: email,
          memberPhone: phone,
          password: createPartnerDto.password,
        });
        return this.toPartnerClientPayload(restored);
      }



      const partnerData: Partial<VendorUser> = {

        manufacturerId: manufacturerObjectId,

        vendorId: manufacturerObjectId,

        name: createPartnerDto.name.trim(),

        email,

        phone,

        ...(countryCode ? { countryCode } : {}),

        type: 'partner',

        status: createStatus,

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
      return this.toPartnerClientPayload(created);

    } catch (error: any) {

      if (

        error instanceof ConflictException ||

        error instanceof BadRequestException

      ) {

        throw error;

      }

      if (error.code === 11000) {

        const field = Object.keys(error.keyPattern || {})[0] || 'field';
        const conflictValue = error.keyValue?.[field];
        const softDeletedUser =
          field === 'email' && conflictValue
            ? await this.findReclaimableSoftDeletedByEmail(
                String(conflictValue).trim().toLowerCase(),
              )
            : await this.vendorUserModel
                .findOne({
                  [field]: conflictValue,
                  status: 2,
                })
                .exec();

        if (softDeletedUser) {
          try {
            const restoredDuplicate = await this.restoreSoftDeletedAsPartner(
              softDeletedUser,
              vendorId,
              {
                name: createPartnerDto.name.trim(),
                email: createPartnerDto.email.trim().toLowerCase(),
                phone: this.resolvePhone(createPartnerDto),
                countryCode: this.resolveCountryCode(createPartnerDto),
                password: createPartnerDto.password,
                status: createStatus,
              },
            );
            this.scheduleAdminTeamMemberRegisteredEmail(vendorId, {
              memberName: createPartnerDto.name.trim(),
              memberEmail: createPartnerDto.email.trim().toLowerCase(),
              memberPhone: this.resolvePhone(createPartnerDto),
              password: createPartnerDto.password,
            });
            return this.toPartnerClientPayload(restoredDuplicate);
          } catch (restoreError) {
            if (restoreError instanceof ConflictException) {
              throw restoreError;
            }
          }
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

      const updated = await this.vendorUserModel

        .findByIdAndUpdate(

          partnerId,

          {

            status: newStatus,

            updatedAt: new Date(),

          },

          { new: true },

        )

        .exec();
      if (!updated) {
        throw new NotFoundException('Partner not found');
      }
      return this.toPartnerClientPayload(updated);

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid partner ID');

    }

  }

  /**
   * When vendor profile technical/marketing contacts are saved, ensure each email
   * has an Active partner login (portal access) and credentials are emailed for new accounts.
   * Skips the manufacturer owner email. Existing partners are updated (name/phone) but not
   * forced active if the vendor already deactivated them.
   *
   * Phone collisions with the owner / other team members are common for contacts — if the
   * real phone cannot be stored uniquely, a stable synthetic phone is used so **email login**
   * still works.
   */
  async ensurePortalAccessForProfileContacts(
    vendorId: string,
    contacts: ProfileContactPortalSeed[],
    options?: { ownerEmail?: string; preferredPassword?: string },
  ): Promise<{ created: number; updated: number }> {
    const result = { created: 0, updated: 0 };
    const ownerEmail = String(options?.ownerEmail ?? '')
      .trim()
      .toLowerCase();
    const preferredPassword = String(options?.preferredPassword ?? '').trim();
    const manufacturerObjectId = this.toManufacturerObjectId(vendorId);
    const scope = this.manufacturerScopeFilter(manufacturerObjectId);

    const byEmail = new Map<string, ProfileContactPortalSeed>();
    for (const raw of contacts) {
      const email = String(raw.email ?? '')
        .trim()
        .toLowerCase();
      const name = String(raw.name ?? '').trim() || email.split('@')[0] || 'Contact';
      const phone = String(raw.phone ?? '').trim();
      const status: 0 | 1 = raw.status === 0 ? 0 : 1;
      if (!email) continue;
      if (ownerEmail && email === ownerEmail) continue;
      const prev = byEmail.get(email);
      if (!prev) {
        byEmail.set(email, { name, email, phone, status });
        continue;
      }
      byEmail.set(email, {
        email,
        name: prev.name || name,
        phone: prev.phone || phone,
        // If either role is inactive, keep inactive (restrict portal access).
        status: prev.status === 0 || status === 0 ? 0 : 1,
      });
    }

    for (const contact of byEmail.values()) {
      try {
        const wantActive = contact.status !== 0;
        const existing = await this.vendorUserModel
          .findOne({
            ...scope,
            status: { $ne: 2 },
            email: contact.email,
            type: { $in: ['partner', 'vendor'] },
          })
          .exec();

        if (existing) {
          // Owner vendor row matched by contact email — do not deactivate owner login.
          if (existing.type === 'vendor') {
            continue;
          }
          let dirty = false;
          if (contact.name && existing.name !== contact.name) {
            existing.name = contact.name;
            dirty = true;
          }
          const desiredStatus = wantActive ? 1 : 0;
          if (Number(existing.status) !== desiredStatus) {
            existing.status = desiredStatus;
            dirty = true;
          }
          if (dirty) {
            existing.updatedAt = new Date();
            await existing.save();
            result.updated += 1;
          }
          continue;
        }

        const password =
          preferredPassword.length >= 6
            ? preferredPassword
            : this.generateProfileContactPassword();

        const createStatus: 0 | 1 = wantActive ? 1 : 0;
        const phoneCandidates = this.buildContactPhoneCandidates(contact);
        let created = false;
        let lastError: unknown;
        for (const phone of phoneCandidates) {
          try {
            await this.create(vendorId, {
              name: contact.name,
              email: contact.email,
              mobile: phone,
              phone,
              password,
              confirmPassword: password,
              status: createStatus,
              currentStatus: createStatus,
            });
            created = true;
            result.created += 1;
            break;
          } catch (error) {
            lastError = error;
            const msg = String((error as Error)?.message ?? '').toLowerCase();
            const phoneConflict =
              error instanceof ConflictException &&
              (msg.includes('phone') || msg.includes('mobile'));
            if (!phoneConflict) {
              throw error;
            }
          }
        }

        if (!created) {
          throw lastError instanceof Error
            ? lastError
            : new BadRequestException(
                `Could not create portal login for ${contact.email}`,
              );
        }
      } catch (error) {
        this.logger.warn(
          `Could not ensure portal access for profile contact ${contact.email}: ${(error as Error)?.message || 'unknown error'}`,
        );
      }
    }

    return result;
  }

  /** Prefer real contact phone; fall back to a stable unique synthetic so email login can be created. */
  private buildContactPhoneCandidates(contact: ProfileContactPortalSeed): string[] {
    const out: string[] = [];
    const raw = String(contact.phone ?? '').trim();
    if (raw) {
      try {
        out.push(this.resolvePhone({ phone: raw, mobile: raw }));
      } catch {
        /* use synthetic below */
      }
    }
    out.push(this.syntheticUniquePhoneForEmail(contact.email));
    return Array.from(new Set(out));
  }

  private syntheticUniquePhoneForEmail(email: string): string {
    const hash = crypto
      .createHash('sha256')
      .update(String(email ?? '').trim().toLowerCase())
      .digest('hex');
    const digits = hash.replace(/\D/g, '').slice(0, 10).padEnd(10, '0');
    return `+1555${digits}`;
  }

  private generateProfileContactPassword(): string {
    const stamp = crypto.randomBytes(4).toString('hex');
    return `Gp@${stamp}9A`;
  }

}


