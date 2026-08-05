import {
  ConflictException,
  Injectable,
  Logger,
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
  /** Extra vendor/admin user rows to ignore (e.g. all users for one manufacturer). */
  excludeUserIds?: Array<Types.ObjectId | string>;
  excludeManufacturerId?: Types.ObjectId | string;
  session?: ClientSession;
  /** Override default conflict message (e.g. admin team-member forms). */
  conflictMessage?: string;
};

type LeanVendorUserPhoneHit = {
  _id: Types.ObjectId;
  type?: string;
  phone?: string;
  manufacturerId?: Types.ObjectId;
  vendorId?: Types.ObjectId;
  status?: number;
};

@Injectable()
export class GlobalPhoneUniquenessService {
  private readonly logger = new Logger(GlobalPhoneUniquenessService.name);

  constructor(
    @InjectModel(VendorUser.name)
    private readonly vendorUserModel: Model<VendorUserDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
  ) {}

  /**
   * Ensures **phone** is not used by any active portal user (admin, vendor, staff, partner)
   * or any manufacturer's **vendor_phone**.
   *
   * Stale vendor/partner `users.phone` values that no longer match their manufacturer's
   * current `vendor_phone` (left behind after admin phone edits) do **not** block reuse —
   * they are healed to match the manufacturer.
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
      excludeUserIds,
      excludeManufacturerId,
      session,
      conflictMessage = GLOBAL_PHONE_UNAVAILABLE_MESSAGE,
    } = options;

    const excludedUserIds = this.collectExcludedUserIds(
      excludeUserId,
      excludeUserIds,
    );
    const excludeMfgOid = this.toObjectId(excludeManufacturerId);

    const userClauses = buildPhoneFieldMatchClauses('phone', phone);
    if (userClauses.length) {
      const userFilter: Record<string, unknown> = {
        status: { $ne: 2 },
        $or: userClauses,
      };
      if (excludedUserIds.length === 1) {
        userFilter._id = { $ne: excludedUserIds[0] };
      } else if (excludedUserIds.length > 1) {
        userFilter._id = { $nin: excludedUserIds };
      }

      const userQuery = this.vendorUserModel
        .find(userFilter)
        .select('_id type phone manufacturerId vendorId status')
        .limit(50)
        .lean();
      if (session) userQuery.session(session);
      const hits = (await userQuery.exec()) as LeanVendorUserPhoneHit[];

      if (hits.length > 0) {
        const realConflict = await this.hasRealUserPhoneConflict(
          hits,
          digits,
          session,
        );
        if (realConflict) {
          throw new ConflictException(conflictMessage);
        }
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

  /**
   * Returns true if any hit is a live occupation of this phone number.
   * Stale vendor user phones are healed (synced to manufacturer) and ignored.
   */
  private async hasRealUserPhoneConflict(
    hits: LeanVendorUserPhoneHit[],
    requestedDigits: string,
    session?: ClientSession,
  ): Promise<boolean> {
    const requestedKey = this.phoneMatchKey(requestedDigits);

    for (const user of hits) {
      const type = String(user.type ?? '').toLowerCase();

      // Platform accounts always hold the global phone slot.
      if (type === 'admin' || type === 'staff') {
        return true;
      }

      const mfgOid =
        this.toObjectId(user.manufacturerId) ?? this.toObjectId(user.vendorId);

      // Orphan portal user still holds the phone → treat as taken.
      if (!mfgOid) {
        return true;
      }

      const mfgQuery = this.manufacturerModel
        .findById(mfgOid)
        .select('_id vendor_phone accountDeletedAt')
        .lean();
      if (session) mfgQuery.session(session);
      const mfg = await mfgQuery.exec();

      // Soft-deleted manufacturer / missing row → free (do not block).
      if (!mfg || mfg.accountDeletedAt) {
        continue;
      }

      const mfgPhone = String(mfg.vendor_phone ?? '').trim();
      const mfgKey = this.phoneMatchKey(normalizePhoneDigits(mfgPhone));
      const userKey = this.phoneMatchKey(
        normalizePhoneDigits(String(user.phone ?? '')),
      );

      // Live match: manufacturer still advertises this phone.
      if (mfgKey && mfgKey === requestedKey) {
        return true;
      }

      // User still has the requested phone but manufacturer moved away → heal.
      if (userKey === requestedKey && mfgPhone) {
        try {
          const heal = this.vendorUserModel.updateOne(
            { _id: user._id },
            { $set: { phone: mfgPhone, updatedAt: new Date() } },
          );
          if (session) heal.session(session);
          await heal.exec();
          this.logger.warn(
            `Healed stale phone on user ${String(user._id)} → manufacturer ${String(mfgOid)} current phone`,
          );
        } catch (err) {
          this.logger.warn(
            `Failed healing stale phone on user ${String(user._id)}: ${(err as Error).message}`,
          );
          // If heal fails, still do not treat as conflict once manufacturer released it.
        }
        continue;
      }

      // User phone matches requested digits and manufacturer has empty phone — block.
      if (userKey === requestedKey) {
        return true;
      }
    }

    return false;
  }

  /** Last-10 / full digits key for equivalence of +91 vs local formats. */
  private phoneMatchKey(digits: string): string {
    const d = String(digits ?? '').replace(/\D/g, '');
    if (!d) return '';
    return d.length >= 10 ? d.slice(-10) : d;
  }

  private collectExcludedUserIds(
    excludeUserId?: Types.ObjectId | string,
    excludeUserIds?: Array<Types.ObjectId | string>,
  ): Types.ObjectId[] {
    const out: Types.ObjectId[] = [];
    const seen = new Set<string>();
    const push = (id: Types.ObjectId | string | undefined) => {
      const oid = this.toObjectId(id);
      if (!oid) return;
      const key = oid.toString();
      if (seen.has(key)) return;
      seen.add(key);
      out.push(oid);
    };
    push(excludeUserId);
    for (const id of excludeUserIds ?? []) {
      push(id);
    }
    return out;
  }

  private toObjectId(
    id: Types.ObjectId | string | undefined | null,
  ): Types.ObjectId | undefined {
    if (!id) return undefined;
    if (id instanceof Types.ObjectId) return id;
    const s = String(id).trim();
    return Types.ObjectId.isValid(s) ? new Types.ObjectId(s) : undefined;
  }
}
