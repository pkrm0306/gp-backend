import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import {
  VendorUser,
  VendorUserDocument,
} from '../../vendor-users/schemas/vendor-user.schema';
import {
  buildPhoneFieldMatchClauses,
  normalizePhoneDigits,
} from '../utils/phone-lookup.util';

export const GLOBAL_PHONE_UNAVAILABLE_MESSAGE = 'Phone number already exists';
export const ADMIN_MOBILE_UNAVAILABLE_MESSAGE = 'Mobile Number already exists';

export type AssertGlobalPhoneAvailableOptions = {
  excludeUserId?: Types.ObjectId | string;
  excludeManufacturerId?: Types.ObjectId | string;
  session?: ClientSession;
  /** Override default conflict message (e.g. admin team-member forms). */
  conflictMessage?: string;
};

@Injectable()
export class GlobalPhoneUniquenessService {
  constructor(
    @InjectModel(VendorUser.name)
    private readonly vendorUserModel: Model<VendorUserDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
  ) {}

  /**
   * Ensures **phone** is not used by any active portal user (admin, vendor, staff, partner)
   * or any manufacturer's **vendor_phone**.
   */
  async assertPhoneAvailable(
    phone: string,
    options: AssertGlobalPhoneAvailableOptions = {},
  ): Promise<void> {
    const digits = normalizePhoneDigits(phone);
    if (digits.length < 7) {
      return;
    }

    const {
      excludeUserId,
      excludeManufacturerId,
      session,
      conflictMessage = GLOBAL_PHONE_UNAVAILABLE_MESSAGE,
    } = options;

    const excludeUserOid = this.toObjectId(excludeUserId);
    const excludeMfgOid = this.toObjectId(excludeManufacturerId);

    const userClauses = buildPhoneFieldMatchClauses('phone', phone);
    if (userClauses.length) {
      const userFilter: Record<string, unknown> = {
        status: { $ne: 2 },
        $or: userClauses,
      };
      if (excludeUserOid) {
        userFilter._id = { $ne: excludeUserOid };
      }

      const userQuery = this.vendorUserModel
        .findOne(userFilter)
        .select('_id type phone')
        .lean();
      if (session) userQuery.session(session);
      if (await userQuery.exec()) {
        throw new ConflictException(conflictMessage);
      }
    }

    const mfgClauses = buildPhoneFieldMatchClauses('vendor_phone', phone);
    if (mfgClauses.length) {
      const mfgFilter: Record<string, unknown> = {
        $and: [
          { $or: mfgClauses },
          {
            $or: [
              { accountDeletedAt: { $exists: false } },
              { accountDeletedAt: null },
            ],
          },
        ],
      };
      if (excludeMfgOid) {
        mfgFilter._id = { $ne: excludeMfgOid };
      }

      const mfgQuery = this.manufacturerModel
        .findOne(mfgFilter)
        .select('_id vendor_phone')
        .lean();
      if (session) mfgQuery.session(session);
      if (await mfgQuery.exec()) {
        throw new ConflictException(conflictMessage);
      }
    }
  }

  async isPhoneAvailable(
    phone: string,
    options: AssertGlobalPhoneAvailableOptions = {},
  ): Promise<boolean> {
    try {
      await this.assertPhoneAvailable(phone, options);
      return true;
    } catch (e) {
      if (e instanceof ConflictException) {
        return false;
      }
      throw e;
    }
  }

  private toObjectId(
    id: Types.ObjectId | string | undefined,
  ): Types.ObjectId | undefined {
    if (!id) return undefined;
    if (id instanceof Types.ObjectId) return id;
    const s = String(id).trim();
    return Types.ObjectId.isValid(s) ? new Types.ObjectId(s) : undefined;
  }
}
