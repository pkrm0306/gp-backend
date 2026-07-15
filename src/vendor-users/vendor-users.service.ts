import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Types } from 'mongoose';
import { createHash } from 'crypto';
import { VendorUser, VendorUserDocument } from './schemas/vendor-user.schema';
import * as bcrypt from 'bcryptjs';
import { assertVendorUserManufacturerRules } from './utils/vendor-user-manufacturer-rules.util';
import {
  isLikelyEmailDomainTypo,
  normalizeLoginEmail,
  splitLoginEmail,
} from './utils/vendor-login-email.util';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class VendorUsersService {
  constructor(
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
  ) {}

  async create(
    data: Partial<VendorUser>,
    session?: ClientSession,
  ): Promise<VendorUserDocument> {
    assertVendorUserManufacturerRules({
      type: data.type,
      manufacturerId: data.manufacturerId,
      vendorId: data.vendorId,
    });
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
    const normalized = normalizeLoginEmail(email);
    if (!normalized) {
      return null;
    }
    const exact = await this.vendorUserModel
      .findOne({ email: normalized, status: { $ne: 2 } })
      .exec();
    if (exact) {
      return exact;
    }
    return this.vendorUserModel
      .findOne({
        email: { $regex: new RegExp(`^${escapeRegex(normalized)}$`, 'i') },
        status: { $ne: 2 },
      })
      .exec();
  }

  /**
   * Login lookup: exact email first, then a single likely typo match (e.g. gmil.com → gmail.com).
   */
  async findLoginUserByEmail(email: string): Promise<VendorUserDocument | null> {
    const normalized = normalizeLoginEmail(email);
    if (!normalized) {
      return null;
    }

    const exact = await this.findByEmail(normalized);
    if (exact) {
      return exact;
    }

    const parts = splitLoginEmail(normalized);
    if (!parts) {
      return null;
    }

    const candidates = await this.vendorUserModel
      .find({
        email: { $regex: new RegExp(`^${escapeRegex(parts.local)}@`, 'i') },
        status: { $ne: 2 },
      })
      .limit(10)
      .exec();

    const typoMatches = candidates.filter((candidate) => {
      const candidateDomain = splitLoginEmail(candidate.email)?.domain;
      return (
        candidateDomain &&
        isLikelyEmailDomainTypo(parts.domain, candidateDomain)
      );
    });

    if (typoMatches.length === 1) {
      return typoMatches[0];
    }

    return null;
  }

  /**
   * First vendor/partner login row for a manufacturer (by `manufacturerId` or legacy `vendorId`).
   * Used when login email matches **manufacturer.vendor_email** but not **vendor_users.email** (legacy data).
   */
  async findPrimaryLoginUserForManufacturer(
    manufacturerId: string,
  ): Promise<VendorUserDocument | null> {
    if (!Types.ObjectId.isValid(manufacturerId)) {
      return null;
    }
    const mid = new Types.ObjectId(manufacturerId);
    const rows = await this.vendorUserModel
      .find({
        $or: [{ manufacturerId: mid }, { vendorId: mid }],
        type: { $in: ['vendor', 'partner'] },
      })
      .sort({ createdAt: 1 })
      .limit(1)
      .exec();
    return rows[0] ?? null;
  }

  async findById(id: string): Promise<VendorUserDocument | null> {
    return this.vendorUserModel.findById(id).exec();
  }

  async update(
    id: string,
    data: Partial<VendorUser>,
  ): Promise<VendorUserDocument | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.vendorUserModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<VendorUserDocument | null> {
    const user = await this.findByEmail(email);
    if (!user || user.otp !== otp) {
      return null;
    }
    user.isVerified = true;
    user.otp = undefined;
    return user.save();
  }

  /**
   * Verify a plaintext password against the stored hash.
   * Supports bcrypt (current) and legacy MySQL MD5 hashes from migration.
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const stored = String(hashedPassword ?? '').trim();
    const plain = String(password ?? '');
    if (!stored || plain === '') {
      return false;
    }

    if (this.isBcryptHash(stored)) {
      return bcrypt.compare(plain, stored);
    }

    if (this.isMd5Hash(stored)) {
      return this.md5Hex(plain) === stored.toLowerCase();
    }

    return false;
  }

  /**
   * After a successful login with a legacy MD5 password, re-hash to bcrypt
   * so subsequent logins use the modern hash without forcing a password change.
   */
  async upgradeLegacyPasswordIfNeeded(
    userId: string,
    plainPassword: string,
    currentHash: string,
  ): Promise<boolean> {
    if (!this.isMd5Hash(String(currentHash ?? '').trim())) {
      return false;
    }
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    await this.vendorUserModel
      .findByIdAndUpdate(userId, {
        $set: { password: passwordHash },
        $unset: { legacyPasswordHash: 1, legacyPasswordAlgo: 1 },
      })
      .exec();
    return true;
  }

  private isBcryptHash(value: string): boolean {
    return /^\$2[aby]?\$\d{2}\$/.test(value);
  }

  private isMd5Hash(value: string): boolean {
    return /^[a-f0-9]{32}$/i.test(value);
  }

  private md5Hex(value: string): string {
    return createHash('md5').update(value, 'utf8').digest('hex');
  }
}
