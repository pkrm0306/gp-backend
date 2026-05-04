import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import {
  VendorUser,
  VendorUserDocument,
} from '../vendor-users/schemas/vendor-user.schema';
import { Banner, BannerDocument } from '../banners/schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import * as crypto from 'crypto';
import { ListTeamMembersQueryDto } from './dto/list-team-members-query.dto';
import { Event, EventDocument } from '../events/schemas/event.schema';
import {
  EventIdCounter,
  EventIdCounterDocument,
  EVENT_ID_COUNTER_KEY,
} from '../events/schemas/event-id-counter.schema';
import { EmailService } from '../common/services/email.service';
import {
  ContactReplyThread,
  ContactReplyThreadDocument,
} from './schemas/contact-reply-thread.schema';
import {
  NewsletterSubscriber,
  NewsletterSubscriberDocument,
} from '../website/schemas/newsletter-subscriber.schema';
import {
  ContactMessage,
  ContactMessageDocument,
} from '../website/schemas/contact-message.schema';
import {
  Notification,
  NotificationDocument,
} from '../common/schemas/notification.schema';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
import * as bcrypt from 'bcryptjs';

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(input: string): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const DEFAULT_EVENT_REGISTRATION_LINK =
  'https://cam.mycii.in/OR/OnlineRegistrationLogin.html?EventId=E000069218';
const DEFAULT_EVENT_BROCHURE_LINK =
  'https://www.linkedin.com/posts/cii-greenpro-ecolabelling_greenpro-summit-2025-brochure-03062025-activity-7335663123154014208-2ScV?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB-BYukBl9XKRWqUfyykOlftYFSgtIQGafI';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Manufacturer.name)
    private manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
    @InjectModel(Banner.name)
    private bannerModel: Model<BannerDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(EventIdCounter.name)
    private eventCounterModel: Model<EventIdCounterDocument>,
    @InjectModel(NewsletterSubscriber.name)
    private newsletterSubscriberModel: Model<NewsletterSubscriberDocument>,
    @InjectModel(ContactMessage.name)
    private contactMessageModel: Model<ContactMessageDocument>,
    @InjectModel(ContactReplyThread.name)
    private contactReplyThreadModel: Model<ContactReplyThreadDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly emailService: EmailService,
  ) {}

  private resolveEventImagePath(eventImage?: string | null): string {
    const raw = String(eventImage ?? '').trim();
    if (!raw) return '';
    if (raw.startsWith('/uploads/')) {
      return raw.replace(/^\/uploads\//, '');
    }
    if (raw.startsWith('uploads/')) {
      return raw.replace(/^uploads\//, '');
    }
    return raw;
  }

  private resolveBannerImagePath(imageUrl?: string | null): string {
    const raw = String(imageUrl ?? '').trim();
    if (!raw) return '';
    if (raw.startsWith('/uploads/')) {
      return raw.replace(/^\/uploads\//, '');
    }
    if (raw.startsWith('uploads/')) {
      return raw.replace(/^uploads\//, '');
    }
    return raw;
  }

  private async createNotification(input: {
    title: string;
    message: string;
    type?: string;
    source?: string;
    referenceType?: string;
    referenceId?: string;
    actorName?: string;
  }) {
    await this.notificationModel.create({
      title: input.title,
      message: input.message,
      type: input.type ?? 'info',
      source: input.source ?? 'admin',
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      actorName: input.actorName,
    });
  }

  private async nextEventId(): Promise<number> {
    const doc = await this.eventCounterModel
      .findOneAndUpdate(
        { _id: EVENT_ID_COUNTER_KEY },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      )
      .exec();
    if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
      throw new Error('Failed to allocate event id');
    }
    return doc.seq;
  }

  private formatEventResponse(event: any) {
    if (!event) return event;
    const obj = typeof event.toObject === 'function' ? event.toObject() : event;
    const id = obj?._id
      ? String(obj._id)
      : obj?.id
        ? String(obj.id)
        : undefined;
    const { _id, __v, ...rest } = obj ?? {};
    return {
      ...rest,
      event_image:
        (rest as any)?.event_image ??
        this.resolveEventImagePath((rest as any)?.eventImage),
      registrationLink:
        (rest as any)?.registrationLink ?? DEFAULT_EVENT_REGISTRATION_LINK,
      brochureLink: (rest as any)?.brochureLink ?? DEFAULT_EVENT_BROCHURE_LINK,
      ...(id ? { id } : {}),
    };
  }

  async createEvent(payload: {
    eventName: string;
    eventDate: Date;
    eventStartTime?: string;
    eventEndTime?: string;
    eventLocation?: string;
    eventDescription?: string;
    contactPersonName?: string;
    contactPersonDesignation?: string;
    contactPersonEmail?: string;
    contactPersonPhone?: string;
    eventImage?: string;
    registrationLink?: string;
    brochureLink?: string;
  }) {
    const eventId = await this.nextEventId();
    const now = new Date();

    const doc = new this.eventModel({
      eventId,
      eventName: payload.eventName,
      eventImage: payload.eventImage,
      event_image: this.resolveEventImagePath(payload.eventImage),
      eventDescription: payload.eventDescription,
      eventDate: payload.eventDate,
      eventStartTime: payload.eventStartTime,
      eventEndTime: payload.eventEndTime,
      eventLocation: payload.eventLocation,
      contactPersonName: payload.contactPersonName,
      contactPersonDesignation: payload.contactPersonDesignation,
      contactPersonEmail: payload.contactPersonEmail,
      contactPersonPhone: payload.contactPersonPhone,
      registrationLink: payload.registrationLink,
      brochureLink: payload.brochureLink,
      eventStatus: 1,
      createdDate: now,
      updatedDate: now,
    });

    const saved = await doc.save();
    await this.createNotification({
      title: 'Event created',
      message: `Event "${payload.eventName}" was created.`,
      type: 'success',
      source: 'admin',
      referenceType: 'event',
      referenceId: String((saved as any)._id),
    });
    return this.formatEventResponse(saved);
  }

  async updateEvent(
    identifier: string,
    payload: {
      eventName?: string;
      eventDate?: Date;
      eventStartTime?: string;
      eventEndTime?: string;
      eventLocation?: string;
      eventDescription?: string;
      contactPersonName?: string;
      contactPersonDesignation?: string;
      contactPersonEmail?: string;
      contactPersonPhone?: string;
      eventImage?: string;
      registrationLink?: string;
      brochureLink?: string;
    },
  ) {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Event id is required');

    const $set: Record<string, unknown> = { updatedDate: new Date() };
    if (
      payload.eventName !== undefined &&
      String(payload.eventName).trim() !== ''
    )
      $set.eventName = payload.eventName;
    if (payload.eventDate !== undefined) $set.eventDate = payload.eventDate;
    if (
      payload.eventStartTime !== undefined &&
      String(payload.eventStartTime).trim() !== ''
    )
      $set.eventStartTime = payload.eventStartTime;
    if (
      payload.eventEndTime !== undefined &&
      String(payload.eventEndTime).trim() !== ''
    )
      $set.eventEndTime = payload.eventEndTime;
    if (
      payload.eventLocation !== undefined &&
      String(payload.eventLocation).trim() !== ''
    )
      $set.eventLocation = payload.eventLocation;
    if (
      payload.eventDescription !== undefined &&
      String(payload.eventDescription).trim() !== ''
    )
      $set.eventDescription = payload.eventDescription;
    if (
      payload.contactPersonName !== undefined &&
      String(payload.contactPersonName).trim() !== ''
    )
      $set.contactPersonName = payload.contactPersonName;
    if (
      payload.contactPersonDesignation !== undefined &&
      String(payload.contactPersonDesignation).trim() !== ''
    )
      $set.contactPersonDesignation = payload.contactPersonDesignation;
    if (
      payload.contactPersonEmail !== undefined &&
      String(payload.contactPersonEmail).trim() !== ''
    )
      $set.contactPersonEmail = payload.contactPersonEmail;
    if (
      payload.contactPersonPhone !== undefined &&
      String(payload.contactPersonPhone).trim() !== ''
    )
      $set.contactPersonPhone = payload.contactPersonPhone;
    if (payload.eventImage !== undefined) {
      $set.eventImage = payload.eventImage;
      $set.event_image = this.resolveEventImagePath(payload.eventImage);
    }
    if (
      payload.registrationLink !== undefined &&
      String(payload.registrationLink).trim() !== ''
    )
      $set.registrationLink = payload.registrationLink;
    if (
      payload.brochureLink !== undefined &&
      String(payload.brochureLink).trim() !== ''
    )
      $set.brochureLink = payload.brochureLink;

    let updated: any = null;
    if (Types.ObjectId.isValid(raw)) {
      updated = await this.eventModel
        .findByIdAndUpdate(new Types.ObjectId(raw), { $set }, { new: true })
        .lean()
        .exec();
    } else {
      const asNumber = Number.parseInt(raw, 10);
      if (!Number.isFinite(asNumber) || asNumber <= 0) {
        throw new BadRequestException(
          'Invalid event id (expected Mongo _id or numeric eventId)',
        );
      }
      updated = await this.eventModel
        .findOneAndUpdate({ eventId: asNumber }, { $set }, { new: true })
        .lean()
        .exec();
    }

    if (!updated) {
      throw new NotFoundException('Event not found');
    }

    await this.createNotification({
      title: 'Event updated',
      message: `Event "${String((updated as any).eventName ?? '')}" was updated.`,
      type: 'info',
      source: 'admin',
      referenceType: 'event',
      referenceId: String((updated as any)._id),
    });

    return this.formatEventResponse(updated);
  }

  async listEvents() {
    const rows = await this.eventModel
      .find({})
      .sort({ createdDate: -1, _id: -1 })
      .select(
        'eventName eventImage event_image eventDate eventStartTime eventLocation eventStatus createdDate updatedDate eventId registrationLink brochureLink',
      )
      .lean()
      .exec();

    return (rows ?? []).map((e: any, idx: number) => {
      const datePart =
        e?.eventDate instanceof Date
          ? e.eventDate.toISOString().slice(0, 10)
          : e?.eventDate
            ? new Date(e.eventDate).toISOString().slice(0, 10)
            : '';
      const timePart = String(e?.eventStartTime ?? '').trim();

      return {
        s_no: idx + 1,
        id: String(e._id),
        eventId: typeof e.eventId === 'number' ? e.eventId : undefined,
        image: e.eventImage ?? null,
        event_image: e.event_image ?? this.resolveEventImagePath(e.eventImage),
        eventName: String(e.eventName ?? ''),
        dateTime: [datePart, timePart].filter(Boolean).join(' '),
        location: String(e.eventLocation ?? ''),
        is_active: Number(e.eventStatus) === 1,
        registrationLink: e.registrationLink ?? DEFAULT_EVENT_REGISTRATION_LINK,
        brochureLink: e.brochureLink ?? DEFAULT_EVENT_BROCHURE_LINK,
      };
    });
  }

  async getEventById(identifier: string) {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Event id is required');

    let event: any = null;
    if (Types.ObjectId.isValid(raw)) {
      event = await this.eventModel
        .findById(new Types.ObjectId(raw))
        .lean()
        .exec();
    } else {
      const asNumber = Number.parseInt(raw, 10);
      if (!Number.isFinite(asNumber) || asNumber <= 0) {
        throw new BadRequestException(
          'Invalid event id (expected Mongo _id or numeric eventId)',
        );
      }
      event = await this.eventModel
        .findOne({ eventId: asNumber })
        .lean()
        .exec();
    }

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.formatEventResponse(event);
  }

  async deleteEvent(identifier: string) {
    const raw = String(identifier ?? '').trim();
    if (!raw) throw new BadRequestException('Event id is required');

    let res: { deletedCount?: number } | null = null;
    if (Types.ObjectId.isValid(raw)) {
      res = await this.eventModel
        .deleteOne({ _id: new Types.ObjectId(raw) })
        .exec();
    } else {
      const asNumber = Number.parseInt(raw, 10);
      if (!Number.isFinite(asNumber) || asNumber <= 0) {
        throw new BadRequestException(
          'Invalid event id (expected Mongo _id or numeric eventId)',
        );
      }
      res = await this.eventModel.deleteOne({ eventId: asNumber }).exec();
    }

    if (!res || res.deletedCount === 0) {
      throw new NotFoundException('Event not found');
    }

    await this.createNotification({
      title: 'Event deleted',
      message: `Event (${raw}) was deleted.`,
      type: 'warning',
      source: 'admin',
      referenceType: 'event',
      referenceId: raw,
    });

    return { id: raw };
  }

  async replyToCustomerViaManufacturer(payload: {
    email: string;
    userMessage: string;
    replyMessage: string;
  }) {
    const brand = 'GreenPro';
    const subject = `Reply from ${brand}`;
    const cleanReply = String(payload.replyMessage ?? '').trim();
    const apiBase = String(process.env.API_BASE_URL ?? '')
      .trim()
      .replace(/\/+$/, '');
    const logoUrl = String(
      process.env.GREENPRO_LOGO_URL ??
        (apiBase ? `${apiBase}/uploads/greenpro-logo.svg` : ''),
    ).trim();
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; padding: 20px;">
          <div style="padding: 0 0 14px 0; border-bottom: 1px solid #e5e7eb;">
            ${
              logoUrl
                ? `<img src="${escapeHtml(logoUrl)}" alt="${brand}" style="display:block; max-height:48px; width:auto; margin:0 0 10px 0;" />`
                : `<div style="font-size: 20px; font-weight: 800; color: #16a34a;">${brand}</div>`
            }
            <div style="font-size: 14px; font-weight: 600; color: #111827;">Support</div>
          </div>

          <div style="padding: 16px 0 0 0;">
            <p style="margin: 0 0 12px 0;">Hello,</p>
            <p style="margin: 0 0 12px 0;">Please find our response below.</p>
            <div style="white-space: pre-wrap; margin: 0 0 16px 0;">${escapeHtml(cleanReply)}</div>

            <p style="margin: 0;">Regards,<br />${brand} Support Team</p>
            <p style="margin: 12px 0 0 0; font-size: 12px; color: #6b7280;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </body>
      </html>
    `;

    const textBody = `Hello,\n\nPlease find our response below.\n\n${cleanReply}\n\nRegards,\n${brand} Support Team`;

    await this.emailService.sendEmail(
      payload.email,
      subject,
      htmlBody,
      textBody,
    );

    return { to: payload.email, subject };
  }

  async sendContactReply(contactMessageId: string, replyMessage: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(contactMessageId);
    } catch {
      throw new BadRequestException('Invalid contact message id');
    }

    const contact = await this.contactMessageModel
      .findById(objectId)
      .select('name email phoneNumber subject message createdAt')
      .lean()
      .exec();

    if (!contact) {
      throw new NotFoundException('Contact message not found');
    }

    const to = String((contact as any).email ?? '')
      .trim()
      .toLowerCase();
    if (!to) {
      throw new BadRequestException('Contact message has no email');
    }

    const subject = `Reply to your inquiry${(contact as any).subject ? `: ${String((contact as any).subject).trim()}` : ''}`;
    const name = String((contact as any).name ?? '').trim();
    const greeting = name ? `Hi ${name},` : 'Hello,';
    const cleanReply = String(replyMessage ?? '').trim();
    const apiBase = String(process.env.API_BASE_URL ?? '')
      .trim()
      .replace(/\/+$/, '');
    const logoUrl = String(
      process.env.GREENPRO_LOGO_URL ??
        (apiBase ? `${apiBase}/uploads/greenpro-logo.svg` : ''),
    ).trim();

    const htmlBody = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${escapeHtml(subject)}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 640px; margin: 0 auto; padding: 20px;">
          <div style="padding: 0 0 14px 0; border-bottom: 1px solid #e5e7eb;">
            ${
              logoUrl
                ? `<img src="${escapeHtml(logoUrl)}" alt="GreenPro" style="display:block; max-height:48px; width:auto; margin:0 0 10px 0;" />`
                : `<div style="font-size: 20px; font-weight: 800; color: #16a34a;">GreenPro</div>`
            }
            <div style="font-size: 14px; font-weight: 600; color: #111827;">Support</div>
          </div>

          <div style="padding: 16px 0 0 0;">
            <p style="margin: 0 0 12px 0;">${escapeHtml(greeting)}</p>
            <p style="margin: 0 0 12px 0;">Thank you for contacting us. Please find our response below.</p>
            <div style="white-space: pre-wrap; margin: 0 0 16px 0;">${escapeHtml(cleanReply)}</div>

            <p style="margin: 0;">Regards,<br />GreenPro Support Team</p>
            <p style="margin: 12px 0 0 0; font-size: 12px; color: #6b7280;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </body>
      </html>
    `;

    const textBody = `${greeting}\n\nThank you for contacting us. Please find our response below.\n\n${cleanReply}\n\nRegards,\nGreenPro Support Team`;

    await this.emailService.sendEmail(to, subject, htmlBody, textBody);

    const entry = {
      adminReply: replyMessage,
      repliedAt: new Date(),
    };

    await this.contactReplyThreadModel
      .updateOne(
        { contactMessageId: objectId },
        {
          $setOnInsert: { contactMessageId: objectId, email: to },
          $push: { conversations: entry },
        },
        { upsert: true },
      )
      .exec();

    await this.createNotification({
      title: 'Contact replied',
      message: `Admin replied to contact ${to}.`,
      type: 'info',
      source: 'admin',
      referenceType: 'contact',
      referenceId: String(objectId),
    });

    return { sent: true };
  }

  async getContactReplyHistory(contactMessageId: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(contactMessageId);
    } catch {
      throw new BadRequestException('Invalid contact message id');
    }

    const thread = await this.contactReplyThreadModel
      .findOne({ contactMessageId: objectId })
      .lean()
      .exec();

    if (!thread) {
      return { contactMessageId, email: null, conversations: [] };
    }

    return {
      contactMessageId: String((thread as any).contactMessageId),
      email: String((thread as any).email ?? ''),
      conversations: ((thread as any).conversations ?? []).map((c: any) => ({
        adminReply: String(c?.adminReply ?? ''),
        repliedAt: c?.repliedAt ?? null,
      })),
    };
  }

  async listNotifications(query: ListNotificationsQueryDto) {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 20);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;
    const skip = (safePage - 1) * safeLimit;

    const now = new Date();
    const where: Record<string, unknown> = {};
    switch (query?.range) {
      case 'today': {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        where.createdAt = { $gte: start };
        break;
      }
      case 'week': {
        const start = new Date(now);
        start.setDate(now.getDate() - 7);
        where.createdAt = { $gte: start };
        break;
      }
      case '30d': {
        const start = new Date(now);
        start.setDate(now.getDate() - 30);
        where.createdAt = { $gte: start };
        break;
      }
      case '90d': {
        const start = new Date(now);
        start.setDate(now.getDate() - 90);
        where.createdAt = { $gte: start };
        break;
      }
      default:
        break;
    }

    const [totalCount, rows] = await Promise.all([
      this.notificationModel.countDocuments(where).exec(),
      this.notificationModel
        .find(where)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),
    ]);

    return {
      data: (rows ?? []).map((n: any) => ({
        id: String(n._id),
        title: String(n.title ?? ''),
        message: String(n.message ?? ''),
        type: String(n.type ?? 'info'),
        source: String(n.source ?? 'system'),
        referenceType: n.referenceType ?? null,
        referenceId: n.referenceId ?? null,
        actorName: n.actorName ?? null,
        createdAt: n.createdAt ?? null,
      })),
      totalCount,
      currentPage: safePage,
      totalPages: Math.max(1, Math.ceil(totalCount / safeLimit)),
    };
  }

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
        $and: [
          // Support both the new canonical field (`manufacturerId`) and legacy alias (`vendorId`)
          {
            $or: [
              { manufacturerId: vendorObjectId },
              { vendorId: vendorObjectId },
            ],
          },
          { status: { $ne: 2 } },
          { type: 'staff' },
          { $or: [{ email: data.email }, { phone: data.mobile }] },
        ],
      })
      .select('_id email phone')
      .lean()
      .exec();

    if (existingActive) {
      if (existingActive.email === data.email) {
        throw new ConflictException('Email already exists for this vendor');
      }
      if (existingActive.phone === data.mobile) {
        throw new ConflictException(
          'Phone number already exists for this vendor',
        );
      }
      throw new ConflictException('Team member already exists');
    }

    const password = crypto.randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);

    const teamMember: Partial<VendorUser> = {
      // Canonical + legacy alias (some modules still query vendorId)
      manufacturerId: vendorObjectId,
      vendorId: vendorObjectId,
      type: 'staff',
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
      password: passwordHash,
    };

    const created = new this.vendorUserModel(teamMember);
    let saved: any;
    try {
      saved = await created.save();
    } catch (e: any) {
      // Handle unique index conflicts (e.g. VendorUser.email is globally unique in schema)
      if (e?.code === 11000) {
        const key = Object.keys(e?.keyPattern ?? e?.keyValue ?? {})[0];
        if (key === 'email') {
          throw new ConflictException('Email already exists');
        }
        if (key === 'phone') {
          throw new ConflictException('Phone number already exists');
        }
        throw new ConflictException('Duplicate record');
      }
      throw e;
    }

    // Never return password hash/plaintext
    const obj: any = saved.toObject();
    delete obj.password;
    delete obj.otp;

    // Best-effort credential mail for team member onboarding.
    try {
      await this.emailService.sendStaffCredentialsEmail(
        String(data.email || '').trim().toLowerCase(),
        password,
        data.name,
      );
    } catch (error) {
      this.logger.warn(
        `Team member created but credentials email failed for ${String(data.email || '').trim().toLowerCase()}: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

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
        $or: [
          { manufacturerId: vendorObjectId },
          { vendorId: vendorObjectId },
          { vendorId },
        ],
        type: 'staff',
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

  async listTeamMembersPaginated(
    vendorId: string,
    query: ListTeamMembersQueryDto,
  ) {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
    const perPage = Number.isFinite(limit) && limit > 0 ? limit : 10;
    const skip = (currentPage - 1) * perPage;

    let vendorObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
    } catch {
      throw new BadRequestException('Invalid vendor ID format');
    }

    const mongoQuery: Record<string, unknown> = {
      $or: [
        { manufacturerId: vendorObjectId },
        { vendorId: vendorObjectId },
        { vendorId },
      ],
      type: 'staff',
      status: { $ne: 2 },
    };

    const rawStatus = query?.status?.trim().toLowerCase();
    if (rawStatus) {
      if (rawStatus === 'active' || rawStatus === '1') mongoQuery.status = 1;
      if (rawStatus === 'inactive' || rawStatus === '0') mongoQuery.status = 0;
    }

    const designation = query?.designation?.trim();
    if (designation) {
      mongoQuery.designation = new RegExp(`^${escapeRegex(designation)}$`, 'i');
    }

    const [totalCount, members] = await Promise.all([
      this.vendorUserModel.countDocuments(mongoQuery).exec(),
      this.vendorUserModel
        .find(mongoQuery)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(perPage)
        .select('name designation email phone status')
        .lean()
        .exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
    const data = (members ?? []).map((m, index) => ({
      s_no: skip + index + 1,
      id: String(m._id),
      name: m.name,
      designation: m.designation ?? '',
      email: m.email,
      mobile: m.phone,
      is_active: m.status === 1,
    }));

    return {
      data,
      totalCount,
      currentPage,
      totalPages,
    };
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
      $or: [
        { manufacturerId: vendorObjectId },
        { vendorId: vendorObjectId },
        { vendorId },
      ],
      type: 'staff',
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
        $or: [
          { manufacturerId: vendorObjectId },
          { vendorId: vendorObjectId },
          { vendorId },
        ],
        type: 'staff',
        status: { $ne: 2 },
      })
      .select(
        'name designation email phone status image facebookUrl twitterUrl linkedinUrl',
      )
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
      banner_image: this.resolveBannerImagePath(dto.imageUrl),
      imageUrl: dto.imageUrl.trim(),
      targetUrl: (dto.targetUrl ?? '').trim(),
      heading: dto.heading.trim(),
      description: dto.description.trim(),
    });
    const saved = await created.save();
    const o = saved.toObject();
    const st = o.status ?? 1;
    return {
      id: String(o._id),
      banner_image: o.banner_image ?? this.resolveBannerImagePath(o.imageUrl),
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
      .select('banner_image imageUrl targetUrl heading description status')
      .lean()
      .exec();

    return rows.map((b, index) => {
      const st = b.status ?? 1;
      return {
        s_no: index + 1,
        id: String(b._id),
        banner_image: b.banner_image ?? this.resolveBannerImagePath(b.imageUrl),
        imageUrl: b.imageUrl,
        targetUrl: b.targetUrl,
        heading: b.heading,
        description: b.description,
        is_active: st === 1,
      };
    });
  }

  /** Public banner list for website (active only, newest first). */
  async listPublicBanners() {
    const rows = await this.bannerModel
      .find({ status: 1 })
      .sort({ createdAt: -1, _id: -1 })
      .select('banner_image imageUrl targetUrl heading description status')
      .lean()
      .exec();

    return rows.map((b, index) => ({
      s_no: index + 1,
      id: String(b._id),
      banner_image: b.banner_image ?? this.resolveBannerImagePath(b.imageUrl),
      imageUrl: b.imageUrl,
      targetUrl: b.targetUrl,
      heading: b.heading,
      description: b.description,
      is_active: (b.status ?? 1) === 1,
    }));
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
      .select('banner_image imageUrl targetUrl heading description')
      .lean()
      .exec();

    if (!b) {
      throw new NotFoundException('Banner not found');
    }

    return {
      id: String(b._id),
      banner_image: b.banner_image ?? this.resolveBannerImagePath(b.imageUrl),
      imageUrl: b.imageUrl,
      targetUrl: b.targetUrl ?? '',
      heading: b.heading,
      description: b.description,
    };
  }

  /** Updates a banner that belongs to the vendor. */
  async updateBanner(
    vendorId: string,
    bannerId: string,
    payload: {
      imageUrl?: string;
      targetUrl?: string;
      heading: string;
      description: string;
    },
  ) {
    let vendorObjectId: Types.ObjectId;
    let bannerObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const existing = await this.bannerModel
      .findOne({
        _id: bannerObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
      })
      .select('_id')
      .lean()
      .exec();

    if (!existing) {
      throw new NotFoundException('Banner not found');
    }

    const $set: Record<string, unknown> = {
      heading: payload.heading.trim(),
      description: payload.description.trim(),
      updatedAt: new Date(),
    };
    if (payload.imageUrl !== undefined) {
      $set.imageUrl = payload.imageUrl.trim();
      $set.banner_image = this.resolveBannerImagePath(payload.imageUrl);
    }
    if (payload.targetUrl !== undefined) {
      $set.targetUrl = payload.targetUrl.trim();
    }

    const updated = await this.bannerModel
      .findByIdAndUpdate(bannerObjectId, { $set }, { new: true })
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Banner not found');
    }

    const st = updated.status ?? 1;
    return {
      id: String(updated._id),
      banner_image:
        (updated as any).banner_image ??
        this.resolveBannerImagePath(updated.imageUrl),
      imageUrl: updated.imageUrl,
      targetUrl: updated.targetUrl ?? '',
      heading: updated.heading,
      description: updated.description,
      is_active: st === 1,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
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

  /**
   * Set or toggle a banner's status (vendor-scoped).
   *
   * - When `status` is provided: sets explicitly (active/inactive)
   * - When `status` is omitted: toggles (1 ↔ 0)
   */
  async setOrToggleBannerStatus(
    vendorId: string,
    bannerId: string,
    status?: string,
  ) {
    let vendorObjectId: Types.ObjectId;
    let bannerObjectId: Types.ObjectId;
    try {
      vendorObjectId = new Types.ObjectId(vendorId);
      bannerObjectId = new Types.ObjectId(bannerId);
    } catch {
      throw new BadRequestException('Invalid ID format');
    }

    const existing = await this.bannerModel
      .findOne({
        _id: bannerObjectId,
        $or: [{ vendorId: vendorObjectId }, { vendorId }],
      })
      .select('status')
      .lean()
      .exec();

    if (!existing) {
      throw new NotFoundException('Banner not found');
    }

    const desired =
      status !== undefined ? String(status).trim().toLowerCase() : undefined;
    let newStatus: number | null = null;

    if (desired === undefined || desired === '') {
      const cur = Number(existing.status) === 1 ? 1 : 0;
      newStatus = cur === 1 ? 0 : 1;
    } else {
      if (desired === 'active' || desired === '1') newStatus = 1;
      if (desired === 'inactive' || desired === '0') newStatus = 0;
      if (newStatus === null) {
        throw new BadRequestException(
          'Invalid status. Use "active" or "inactive"',
        );
      }
    }

    const updated = await this.bannerModel
      .findByIdAndUpdate(
        bannerObjectId,
        { $set: { status: newStatus, updatedAt: new Date() } },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Banner not found');
    }

    return {
      id: String(updated._id),
      status: Number(updated.status) === 1 ? 'active' : 'inactive',
      is_active: Number(updated.status) === 1,
    };
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
        $or: [
          { manufacturerId: vendorObjectId },
          { vendorId: vendorObjectId },
          { vendorId },
        ],
        type: 'staff',
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
            $or: [
              { manufacturerId: vendorObjectId },
              { vendorId: vendorObjectId },
              { vendorId },
            ],
          },
          { _id: { $ne: memberObjectId } },
          { status: { $ne: 2 } },
          { type: 'staff' },
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
        throw new ConflictException(
          'Phone number already exists for this vendor',
        );
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
        $or: [
          { manufacturerId: vendorObjectId },
          { vendorId: vendorObjectId },
          { vendorId },
        ],
        type: 'staff',
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

  private async resolveNewsletterSubscriberId(
    identifier: string,
  ): Promise<string> {
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
  async setOrToggleNewsletterSubscriberStatus(
    identifier: string,
    status?: string,
  ) {
    const targetId = await this.resolveNewsletterSubscriberId(identifier);

    const desired =
      status !== undefined ? String(status).trim().toLowerCase() : undefined;
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
        throw new BadRequestException(
          'Invalid status. Use "active" or "inactive"',
        );
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
      .select('name email phoneNumber message createdAt')
      .sort({ createdAt: -1, _id: -1 })
      .lean()
      .exec();

    return (rows ?? []).map((r, idx) => ({
      s_no: idx + 1,
      id: String(r._id),
      name: String(r.name ?? ''),
      email: String(r.email ?? ''),
      phoneNo: String((r as any).phoneNumber ?? ''),
      message:
        typeof (r as any).message === 'string'
          ? String((r as any).message).trim()
          : '',
      createdAt: (r as any).createdAt ?? null,
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

  /** Permanently deletes a contact message by MongoDB id. */
  async deleteContactMessage(id: string) {
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(id);
    } catch {
      throw new BadRequestException('Invalid contact id');
    }

    const res = await this.contactMessageModel
      .deleteOne({ _id: objectId })
      .exec();
    if (res.deletedCount === 0) {
      throw new NotFoundException('Contact message not found');
    }
    return { id };
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
        $or: [
          { manufacturerId: vendorObjectId },
          { vendorId: vendorObjectId },
          { vendorId },
        ],
        type: 'staff',
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
      throw new BadRequestException(
        error.message || 'Failed to update manufacturer',
      );
    }
  }

  async updateManufacturerStatus(id: string) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const manufacturer = await this.manufacturerModel
        .findById(manufacturerId)
        .exec();

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
      throw new BadRequestException(
        error.message || 'Failed to update manufacturer status',
      );
    }
  }

  async updateVendorStatus(id: string) {
    try {
      const manufacturerId = new Types.ObjectId(id);
      const manufacturer = await this.manufacturerModel
        .findById(manufacturerId)
        .exec();

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }

      const currentStatus = manufacturer.vendor_status;
      let newStatus: number;

      if (currentStatus === 0) {
        newStatus = 1;
      } else if (currentStatus === 1) {
        newStatus = 0;
      } else {
        throw new BadRequestException(
          `Invalid vendor status: ${currentStatus}`,
        );
      }

      const updatedVendor = await this.manufacturerModel
        .findByIdAndUpdate(
          manufacturerId,
          {
            vendor_status: newStatus,
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
        throw new BadRequestException('Invalid manufacturer ID format');
      }
      throw new BadRequestException(
        error.message || 'Failed to update vendor status',
      );
    }
  }
}
