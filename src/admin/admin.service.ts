import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Manufacturer, ManufacturerDocument } from '../manufacturers/schemas/manufacturer.schema';
import { Vendor, VendorDocument } from '../vendors/schemas/vendor.schema';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { VendorUser, VendorUserDocument } from '../vendor-users/schemas/vendor-user.schema';
import { Banner, BannerDocument } from '../banners/schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import * as crypto from 'crypto';
import {
  NewsletterSubscriber,
  NewsletterSubscriberDocument,
} from '../website/schemas/newsletter-subscriber.schema';
import {
  ContactMessage,
  ContactMessageDocument,
} from '../website/schemas/contact-message.schema';

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
    @InjectModel(Banner.name)
    private bannerModel: Model<BannerDocument>,
    @InjectModel(NewsletterSubscriber.name)
    private newsletterSubscriberModel: Model<NewsletterSubscriberDocument>,
    @InjectModel(ContactMessage.name)
    private contactMessageModel: Model<ContactMessageDocument>,
  ) {}

  async createTeamMember(
    vendorId: string,
    data: {
      name: string;
      designation?: string;
      email: string;
      mobile: string;
      imagePath?: string;
      facebookUrl?: string;
      twitterUrl?: string;
      linkedinUrl?: string;
    },
  ) {
    let vendorObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
    } catch {
      throw new BadRequestException('Invalid vendor ID format');
    }

    const existingActive = await this.vendorUserModel
      .findOne({
        vendorId: vendorObjectId,
        status: { $ne: 2 },
        type: 'partner',
        $or: [{ email: data.email }, { phone: data.mobile }],
      })
      .select('_id email phone')
      .lean()
      .exec();

    if (existingActive) {
      if (existingActive.email === data.email) {
        throw new ConflictException('Email already exists for this vendor');
      }
      if (existingActive.phone === data.mobile) {
        throw new ConflictException('Phone number already exists for this vendor');
      }
      throw new ConflictException('Team member already exists');
    }

    const password = crypto.randomBytes(8).toString('hex');

    const teamMember: Partial<VendorUser> = {
      vendorId: vendorObjectId,
      type: 'partner',
      status: 1,
      isVerified: true,
      name: data.name,
      ...(data.designation !== undefined && data.designation !== ''
        ? { designation: data.designation }
        : {}),
      email: data.email,
      phone: data.mobile,
      image: data.imagePath,
      facebookUrl: data.facebookUrl,
      twitterUrl: data.twitterUrl,
      linkedinUrl: data.linkedinUrl,
      password,
    };

    const created = new this.vendorUserModel(teamMember);
    const saved = await created.save();

    // Never return password hash/plaintext
    const obj: any = saved.toObject();
    delete obj.password;
    delete obj.otp;
    return obj;
  }

  /**
   * Team members for the admin table: non-deleted partners (status !== 2).
   * status 1 = active, 0 = inactive (matches partner toggle).
   */
  async listTeamMembers(vendorId: string) {
    let vendorObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
    } catch {
      throw new BadRequestException('Invalid vendor ID format');
    }

    const members = await this.vendorUserModel
      .find({
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
        type: 'partner',
        status: { $ne: 2 },
      })
      // Newest team members first (do not change to ascending).
      .sort({ createdAt: -1, _id: -1 })
      .select('name designation email phone status')
      .lean()
      .exec();

    return members.map((m, index) => ({
      s_no: index + 1,
      id: String(m._id),
      name: m.name,
      designation: m.designation ?? '',
      email: m.email,
      mobile: m.phone,
      is_active: m.status === 1,
    }));
  }

  /**
   * Partial, case-insensitive match on name and/or email (non-deleted partners only).
   * When both filters are set, both must match (AND).
   */
  async searchTeamMembers(
    vendorId: string,
    filters: { name?: string; email?: string },
  ) {
    const name = filters.name?.trim();
    const email = filters.email?.trim();
    if (!name && !email) {
      throw new BadRequestException('Provide a name and/or email to search');
    }

    let vendorObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
    } catch {
      throw new BadRequestException('Invalid vendor ID format');
    }

    const query: Record<string, unknown> = {
      $or: [{ vendorId: vendorObjectId }, { vendorId }],
      type: 'partner',
      status: { $ne: 2 },
    };
    if (name) {
      query.name = new RegExp(escapeRegex(name), 'i');
    }
    if (email) {
      query.email = new RegExp(escapeRegex(email), 'i');
    }

    const members = await this.vendorUserModel
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .select('name designation email phone status')
      .lean()
      .exec();

    return members.map((m, index) => ({
      s_no: index + 1,
      id: String(m._id),
      name: m.name,
      designation: m.designation ?? '',
      email: m.email,
      mobile: m.phone,
      is_active: m.status === 1,
    }));
  }

  /** Single team member for view modal (non-deleted partner, same vendor). */
  async getTeamMemberById(vendorId: string, memberId: string) {
    let vendorObjectId: Types.ObjectId;
    let memberObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      memberObjectId = new Types.ObjectId(memberId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const member = await this.vendorUserModel
      .findOne({
        _id: memberObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
        type: 'partner',
        status: { $ne: 2 },
      })
      .select('name designation email phone status image facebookUrl twitterUrl linkedinUrl')
      .lean()
      .exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const st = member.status ?? 0;
    return {
      id: String(member._id),
      name: member.name,
      designation: member.designation ?? '',
      email: member.email,
      mobile: member.phone,
      status: st === 1 ? 'Active' : 'Inactive',
      image: member.image ?? null,
      facebookUrl: member.facebookUrl ?? '',
      twitterUrl: member.twitterUrl ?? '',
      linkedinUrl: member.linkedinUrl ?? '',
    };
  }

  async createBanner(vendorId: string, dto: CreateBannerDto) {
    let vendorObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
    } catch {
      throw new BadRequestException('Invalid vendor ID format');
    }

    const created = new this.bannerModel({
      vendorId: vendorObjectId,
      imageUrl: dto.imageUrl.trim(),
      targetUrl: dto.targetUrl.trim(),
      heading: dto.heading.trim(),
      description: dto.description.trim(),
    });
    const saved = await created.save();
    const o = saved.toObject();
    const st = o.status ?? 1;
    return {
      id: String(o._id),
      imageUrl: o.imageUrl,
      targetUrl: o.targetUrl,
      heading: o.heading,
      description: o.description,
      is_active: st === 1,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };
  }

  /**
   * Banners for the vendor admin grid: image, heading, full description (UI clamps ~3 lines), toggle state.
   */
  async listBanners(vendorId: string) {
    let vendorObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
    } catch {
      throw new BadRequestException('Invalid vendor ID format');
    }

    const rows = await this.bannerModel
      .find({
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
      })
      .sort({ createdAt: -1, _id: -1 })
      .select('imageUrl targetUrl heading description status')
      .lean()
      .exec();

    return rows.map((b, index) => {
      const st = b.status ?? 1;
      return {
        s_no: index + 1,
        id: String(b._id),
        imageUrl: b.imageUrl,
        targetUrl: b.targetUrl,
        heading: b.heading,
        description: b.description,
        is_active: st === 1,
      };
    });
  }

  /** Single banner for the View modal (image URL, heading, description). */
  async getBannerById(vendorId: string, bannerId: string) {
    let vendorObjectId: Types.ObjectId;
    let bannerObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const b = await this.bannerModel
      .findOne({
        _id: bannerObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
      })
      .select('imageUrl heading description')
      .lean()
      .exec();

    if (!b) {
      throw new NotFoundException('Banner not found');
    }

    return {
      id: String(b._id),
      imageUrl: b.imageUrl,
      heading: b.heading,
      description: b.description,
    };
  }

  /** Permanently removes a banner that belongs to the vendor. */
  async deleteBanner(vendorId: string, bannerId: string) {
    let vendorObjectId: Types.ObjectId;
    let bannerObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const res = await this.bannerModel
      .deleteOne({
        _id: bannerObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
      })
      .exec();

    if (res.deletedCount === 0) {
      throw new NotFoundException('Banner not found');
    }

    return { id: bannerId };
  }

  async updateTeamMember(
    vendorId: string,
    data: {
      id: string;
      name: string;
      designation?: string;
      email: string;
      mobile: string;
      imagePath?: string;
      facebookUrl?: string;
      twitterUrl?: string;
      linkedinUrl?: string;
    },
  ) {
    let vendorObjectId: Types.ObjectId;
    let memberObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      memberObjectId = new Types.ObjectId(data.id);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const member = await this.vendorUserModel
      .findOne({
        _id: memberObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
        type: 'partner',
        status: { $ne: 2 },
      })
      .exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const existingOther = await this.vendorUserModel
      .findOne({
        $and: [
          {
            $or: [{ vendorId: vendorObjectId }, { vendorId }],
          },
          { _id: { $ne: memberObjectId } },
          { status: { $ne: 2 } },
          { type: 'partner' },
          { $or: [{ email: data.email }, { phone: data.mobile }] },
        ],
      })
      .select('_id email phone')
      .lean()
      .exec();

    if (existingOther) {
      if (existingOther.email === data.email) {
        throw new ConflictException('Email already exists for this vendor');
      }
      if (existingOther.phone === data.mobile) {
        throw new ConflictException('Phone number already exists for this vendor');
      }
      throw new ConflictException('Team member already exists');
    }

    const $set: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      phone: data.mobile,
      updatedAt: new Date(),
    };

    if (data.designation !== undefined && data.designation !== '') {
      $set.designation = data.designation;
    }

    if (data.facebookUrl !== undefined) {
      $set.facebookUrl = data.facebookUrl;
    }
    if (data.twitterUrl !== undefined) {
      $set.twitterUrl = data.twitterUrl;
    }
    if (data.linkedinUrl !== undefined) {
      $set.linkedinUrl = data.linkedinUrl;
    }
    if (data.imagePath !== undefined) {
      $set.image = data.imagePath;
    }

    const updatePayload: Record<string, unknown> = { $set };
    if (data.designation !== undefined && data.designation === '') {
      updatePayload.$unset = { designation: '' };
    }

    const updated = await this.vendorUserModel
      .findByIdAndUpdate(memberObjectId, updatePayload, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Team member not found');
    }

    const obj: any = updated.toObject();
    delete obj.password;
    delete obj.otp;
    return obj;
  }

  /** Soft delete: status 2 (same as partners). */
  async deleteTeamMember(vendorId: string, teamMemberId: string) {
    let vendorObjectId: Types.ObjectId;
    let memberObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      memberObjectId = new Types.ObjectId(teamMemberId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const member = await this.vendorUserModel
      .findOne({
        _id: memberObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
        type: 'partner',
        status: { $ne: 2 },
      })
      .exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const updated = await this.vendorUserModel
      .findByIdAndUpdate(
        memberObjectId,
        { status: 2, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Team member not found');
    }

    const obj: any = updated.toObject();
    delete obj.password;
    delete obj.otp;
    return obj;
  }

  /** Permanently deletes a newsletter subscriber by document id. */
  async deleteNewsletterSubscriber(subscriberId: string) {
    const raw = String(subscriberId ?? '').trim();
    if (!raw) {
      throw new BadRequestException('Subscriber id is required');
    }

    // Preferred: delete by MongoDB _id
    if (Types.ObjectId.isValid(raw)) {
      const res = await this.newsletterSubscriberModel
        .deleteOne({ _id: new Types.ObjectId(raw) })
        .exec();

      if (res.deletedCount === 0) {
        throw new NotFoundException('Subscriber not found');
      }

      return { id: raw };
    }

    // Backward-compatible fallback: allow deleting by S.No (1-based index in list)
    const asNumber = Number.parseInt(raw, 10);
    if (!Number.isFinite(asNumber) || asNumber <= 0) {
      throw new BadRequestException(
        'Invalid subscriber id. Provide MongoDB _id or S.No (e.g. "1")',
      );
    }

    const idx = asNumber - 1;
    const ids = await this.newsletterSubscriberModel
      .find({}, { _id: 1 })
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    const target = ids?.[idx]?._id ? String(ids[idx]._id) : null;
    if (!target) {
      throw new NotFoundException('Subscriber not found');
    }

    const res = await this.newsletterSubscriberModel
      .deleteOne({ _id: new Types.ObjectId(target) })
      .exec();

    if (res.deletedCount === 0) {
      throw new NotFoundException('Subscriber not found');
    }

    return { id: target };
  }

  private async resolveNewsletterSubscriberId(identifier: string): Promise<string> {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Subscriber id is required');

    if (Types.ObjectId.isValid(raw)) return raw;

    const asNumber = Number.parseInt(raw, 10);
    if (!Number.isFinite(asNumber) || asNumber <= 0) {
      throw new BadRequestException(
        'Invalid subscriber id. Provide MongoDB _id or S.No (e.g. "1")',
      );
    }

    const idx = asNumber - 1;
    const ids = await this.newsletterSubscriberModel
      .find({}, { _id: 1 })
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    const target = ids?.[idx]?._id ? String(ids[idx]._id) : null;
    if (!target) throw new NotFoundException('Subscriber not found');
    return target;
  }

  /**
   * Set or toggle a newsletter subscriber's status.
   *
   * - When `status` is provided: sets explicitly (active/inactive)
   * - When `status` is omitted: toggles (1 ↔ 0)
   */
  async setOrToggleNewsletterSubscriberStatus(identifier: string, status?: string) {
    const targetId = await this.resolveNewsletterSubscriberId(identifier);

    const desired = status !== undefined ? String(status).trim().toLowerCase() : undefined;
    let newStatus: number | null = null;

    if (desired === undefined || desired === '') {
      const current = await this.newsletterSubscriberModel
        .findById(new Types.ObjectId(targetId))
        .select('status')
        .lean()
        .exec();
      if (!current) throw new NotFoundException('Subscriber not found');

      const cur = Number(current.status) === 1 ? 1 : 0;
      newStatus = cur === 1 ? 0 : 1;
    } else {
      if (desired === 'active' || desired === '1') newStatus = 1;
      if (desired === 'inactive' || desired === '0') newStatus = 0;
      if (newStatus === null) {
        throw new BadRequestException('Invalid status. Use "active" or "inactive"');
      }
    }

    const updated = await this.newsletterSubscriberModel
      .findByIdAndUpdate(
        new Types.ObjectId(targetId),
        { $set: { status: newStatus, updatedAt: new Date() } },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated) throw new NotFoundException('Subscriber not found');

    return {
      id: targetId,
      status: Number(updated.status) === 1 ? 'active' : 'inactive',
    };
  }

  /**
   * Contact messages list for admin table.
   *
   * Sample Mongo (Mongoose) query:
   *   this.contactMessageModel.find({}, { name: 1, email: 1, phoneNumber: 1 })
   *     .sort({ createdAt: -1 })
   *     .lean()
   *     .exec();
   */
  async listContactMessages() {
    const rows = await this.contactMessageModel
      .find({})
      .select('name email phoneNumber createdAt')
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    return (rows ?? []).map((r, idx) => ({
      s_no: idx + 1,
      id: String(r._id),
      name: String(r.name ?? ''),
      email: String(r.email ?? ''),
      phoneNo: String((r as any).phoneNumber ?? ''),
    }));
  }

  /** Single contact message for admin "view" modal/page. */
  async getContactMessageById(id: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid contact id');
    }

    const msg = await this.contactMessageModel
      .findById(objectId)
      .select('name email phoneNumber message')
      .lean()
      .exec();

    if (!msg) {
      throw new NotFoundException('Contact message not found');
    }

    return {
      id: String(msg._id),
      name: String(msg.name ?? ''),
      email: String(msg.email ?? ''),
      phone: String((msg as any).phoneNumber ?? ''),
      message: String((msg as any).message ?? ''),
    };
  }

  /**
   * Toggle active flag for a team member (partner): status 1 ↔ 0.
   * Same semantics as partners PATCH /partners/status; excludes soft-deleted (2).
   */
  async updateTeamMemberStatus(vendorId: string, teamMemberId: string) {
    let vendorObjectId: Types.ObjectId;
    let memberObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      memberObjectId = new Types.ObjectId(teamMemberId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const member = await this.vendorUserModel
      .findOne({
        _id: memberObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
        type: 'partner',
        status: { $ne: 2 },
      })
      .exec();

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    const current = member.status;
    let newStatus: number;
    if (current === 1) {
      newStatus = 0;
    } else if (current === 0) {
      newStatus = 1;
    } else {
      throw new BadRequestException(`Invalid team member status: ${current}`);
    }

    const updated = await this.vendorUserModel
      .findByIdAndUpdate(
        memberObjectId,
        { status: newStatus, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Team member not found');
    }

    const obj: any = updated.toObject();
    delete obj.password;
    delete obj.otp;
    return obj;
  }

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
