import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  NewsletterSubscriber,
  NewsletterSubscriberDocument,
} from './schemas/newsletter-subscriber.schema';
import { NewsletterSubscribeDto } from './dto/newsletter-subscribe.dto';
import { ContactSubmitDto } from './dto/contact-submit.dto';
import { ContactMessage, ContactMessageDocument } from './schemas/contact-message.schema';
import { Event, EventDocument } from '../events/schemas/event.schema';
import { VendorUser, VendorUserDocument } from '../vendor-users/schemas/vendor-user.schema';
import { ManufacturerInquiryDto } from './dto/manufacturer-inquiry.dto';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { EmailService } from '../common/services/email.service';
import {
  Notification,
  NotificationDocument,
} from '../common/schemas/notification.schema';

function buildSubscribedFor(dto: NewsletterSubscribeDto): string[] {
  const prefs: string[] = [];
  if (dto.greenProducts) prefs.push('Green Products');
  if (dto.events) prefs.push('Events');
  if (prefs.length === 0) prefs.push('Newsletter');
  return prefs;
}

function formatDateYYYYMMDD(value: unknown): string {
  const d = value instanceof Date ? value : value ? new Date(value as any) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

@Injectable()
export class WebsiteService {
  constructor(
    @InjectModel(NewsletterSubscriber.name)
    private subscriberModel: Model<NewsletterSubscriberDocument>,
    @InjectModel(ContactMessage.name)
    private contactMessageModel: Model<ContactMessageDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private manufacturersService: ManufacturersService,
    private emailService: EmailService,
  ) {}

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
      source: input.source ?? 'website',
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      actorName: input.actorName,
    });
  }

  async subscribeNewsletter(dto: NewsletterSubscribeDto) {
    const email = dto.email.trim().toLowerCase();
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const greenProducts = Boolean(dto.greenProducts);
    const events = Boolean(dto.events);
    const subscribedFor = buildSubscribedFor(dto);

    const saved = await this.subscriberModel
      .findOneAndUpdate(
        { email },
        {
          $set: {
            email,
            subscribedFor,
            status: 1,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true, new: true }
      )
      .lean()
      .exec();

    // Shape response like your admin table rows
    const createdAt = saved?.createdAt ? new Date(saved.createdAt) : new Date();
    const createdDate = createdAt.toISOString().slice(0, 10); // YYYY-MM-DD (UI can format)

    await this.createNotification({
      title: 'New subscriber added',
      message: `${email} subscribed to newsletter.`,
      type: 'success',
      source: 'website',
      referenceType: 'newsletter',
      referenceId: String((saved as any)?._id ?? ''),
      actorName: email,
    });

    return {
      email: saved.email,
      greenProducts,
      events,
      createdDate,
      is_active: true,
    };
  }

  /**
   * Admin list endpoint backing `GET /api/website/newsletter`.
   *
   * Sample Mongo (Mongoose) query used:
   *   this.subscriberModel.find({}, { email: 1, subscribedFor: 1, status: 1, createdAt: 1 })
   *     .sort({ createdAt: -1 })
   *     .lean()
   *     .exec();
   */
  async getNewsletterSubscribers() {
    try {
      const rows = await this.subscriberModel
        .find(
          {},
          {
            email: 1,
            subscribedFor: 1,
            status: 1,
            createdAt: 1,
          },
        )
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const data = (rows ?? []).map((r, idx) => ({
        id: idx + 1, // S.No for the table
        email: String(r.email ?? ''),
        subscribedFor: Array.isArray(r.subscribedFor) && r.subscribedFor.length > 0
          ? r.subscribedFor.join(', ')
          : 'Newsletter',
        createdAt: formatDateYYYYMMDD(r.createdAt),
        status: Number(r.status) === 1 ? 'active' : 'inactive',
      }));

      return data;
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.message || 'Failed to fetch newsletter subscriptions',
      );
    }
  }

  /**
   * Stores a website "Contact Us" form submission.
   *
   * Sample Mongo (Mongoose) insert:
   *   const doc = new this.contactMessageModel(payload);
   *   await doc.save();
   */
  async submitContact(dto: ContactSubmitDto) {
    try {
      const phoneNumber = (dto.phoneNumber ?? dto.phone ?? '').trim();
      if (!phoneNumber) {
        throw new BadRequestException('Phone number is required');
      }
      const payload: Partial<ContactMessage> = {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phoneNumber,
        subject: dto.subject?.trim() || 'General',
        message: dto.message.trim(),
      };

      const created = new this.contactMessageModel(payload);
      const saved = await created.save();

      await this.createNotification({
        title: 'New website inquiry',
        message: `${payload.name} submitted a contact inquiry.`,
        type: 'info',
        source: 'website',
        referenceType: 'contact',
        referenceId: String((saved as any)._id),
        actorName: payload.name,
      });

      return {
        id: String((saved as any)._id),
        name: (saved as any).name,
        email: (saved as any).email,
        phoneNumber: (saved as any).phoneNumber,
        subject: (saved as any).subject,
        message: (saved as any).message,
        createdAt: (saved as any).createdAt,
      };
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.message || 'Failed to submit contact message',
      );
    }
  }

  /**
   * Public event status toggle for the website events page.
   *
   * - Accepts Mongo `_id` OR numeric `eventId`
   * - If status is missing/invalid, treats it as active by default (1)
   * - Toggles: 1 ↔ 0
   */
  async toggleWebsiteEventStatus(identifier: string) {
    const raw = String(identifier ?? '').trim();
    if (!raw) {
      throw new BadRequestException('Event id is required');
    }

    const findQuery: Record<string, any> = {};
    if (Types.ObjectId.isValid(raw)) {
      findQuery._id = new Types.ObjectId(raw);
    } else {
      const asNumber = Number.parseInt(raw, 10);
      if (!Number.isFinite(asNumber) || asNumber <= 0) {
        throw new BadRequestException(
          'Invalid event id (expected Mongo _id or numeric eventId)',
        );
      }
      findQuery.eventId = asNumber;
    }

    const current = await this.eventModel
      .findOne(findQuery)
      .select('eventStatus')
      .lean()
      .exec();

    if (!current) {
      throw new NotFoundException('Event not found');
    }

    const cur = Number((current as any).eventStatus);
    const normalized = cur === 0 || cur === 1 ? cur : 1; // default active
    const next = normalized === 1 ? 0 : 1;

    const updated = await this.eventModel
      .findOneAndUpdate(
        findQuery,
        { $set: { eventStatus: next, updatedDate: new Date() } },
        { new: true },
      )
      .select('eventStatus eventId')
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException('Event not found');
    }

    return {
      id: String((updated as any)._id),
      eventId: (updated as any).eventId,
      status: Number((updated as any).eventStatus) === 1 ? 'active' : 'inactive',
    };
  }

  /**
   * Public website team members list.
   * Pulls active partners from VendorUser (type=partner, status=1).
   */
  async listWebsiteTeamMembers() {
    const rows = await this.vendorUserModel
      .find({ type: 'partner', status: 1 })
      .sort({ createdAt: -1, _id: -1 })
      .select('name designation email phone image facebookUrl twitterUrl linkedinUrl')
      .lean()
      .exec();

    return (rows ?? []).map((m: any, idx: number) => ({
      s_no: idx + 1,
      id: String(m._id),
      name: String(m.name ?? ''),
      designation: String(m.designation ?? ''),
      email: String(m.email ?? ''),
      mobile: String(m.phone ?? ''),
      image: m.image ?? null,
      facebookUrl: String(m.facebookUrl ?? ''),
      twitterUrl: String(m.twitterUrl ?? ''),
      linkedinUrl: String(m.linkedinUrl ?? ''),
    }));
  }

  /**
   * Sends an email to the customer with manufacturer details included.
   * Uses `manufacturerId` to fetch manufacturer details.
   */
  async submitManufacturerInquiry(dto: ManufacturerInquiryDto) {
    const manufacturer = await this.manufacturersService.findById(dto.manufacturerId);
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    const manufacturerName = (manufacturer.manufacturerName ?? '').toString().trim();
    const vendorName = (manufacturer.vendor_name ?? '').toString().trim();
    let vendorEmail = (manufacturer.vendor_email ?? '').toString().trim();
    let vendorPhone = (manufacturer.vendor_phone ?? '').toString().trim();
    // Website is intentionally not included in the customer email template.

    // Fallback: if manufacturer doc doesn't have vendor email/phone, pick it from the vendor user record.
    if (!vendorEmail || !vendorPhone) {
      const vendorUser = await this.vendorUserModel
        .findOne({
          manufacturerId: new Types.ObjectId(String(manufacturer._id)),
          type: 'vendor',
          status: { $ne: 2 },
        })
        .select('email phone')
        .lean()
        .exec();
      if (!vendorEmail) vendorEmail = String((vendorUser as any)?.email ?? '').trim();
      if (!vendorPhone) vendorPhone = String((vendorUser as any)?.phone ?? '').trim();
    }

    const subject =
      dto.subject && String(dto.subject).trim()
        ? String(dto.subject).trim()
        : `Your inquiry to ${manufacturerName || 'GreenPro Manufacturer'}`;

    const safe = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const htmlBody = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Inquiry Received</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 640px; margin: 0 auto; padding: 20px;">
          <div style="background:#16a34a; color:#fff; padding:16px 20px; border-radius:8px 8px 0 0;">
            <h2 style="margin:0;">Thanks, we received your message</h2>
          </div>
          <div style="border:1px solid #e5e7eb; border-top:0; padding:20px; border-radius:0 0 8px 8px;">
            <p style="margin-top:0;">Hi ${safe(dto.name)},</p>
            <p>We’ve recorded your inquiry and included the manufacturer details below for your reference.</p>

            <h3 style="margin:18px 0 8px;">Your Message</h3>
            <div style="background:#f9fafb; padding:14px; border-radius:8px; border:1px solid #e5e7eb;">
              <p style="margin:0;"><strong>Contact:</strong> ${safe(dto.contact)}</p>
              <p style="margin:8px 0 0; white-space:pre-wrap;">${safe(dto.message || '')}</p>
            </div>

            <h3 style="margin:18px 0 8px;">Manufacturer Details</h3>
            <div style="background:#fff; padding:14px; border-radius:8px; border:1px solid #e5e7eb;">
              <p style="margin:0;"><strong>Name:</strong> ${safe(manufacturerName || vendorName || 'N/A')}</p>
              <p style="margin:8px 0 0;"><strong>Email:</strong> ${safe(vendorEmail || 'N/A')}</p>
              <p style="margin:8px 0 0;"><strong>Phone:</strong> ${safe(vendorPhone || 'N/A')}</p>
            </div>

            <p style="margin:18px 0 0; color:#6b7280; font-size:12px;">
              This email was generated automatically by GreenPro.
            </p>
          </div>
        </body>
      </html>
    `;

    await this.emailService.sendEmail(dto.email, subject, htmlBody);

    await this.createNotification({
      title: 'New manufacturer inquiry',
      message: `${dto.name} submitted an inquiry for ${manufacturerName || 'a manufacturer'}.`,
      type: 'info',
      source: 'website',
      referenceType: 'manufacturer_inquiry',
      referenceId: String(dto.manufacturerId),
      actorName: dto.name,
    });

    return { sent: true, subject };
  }
}

