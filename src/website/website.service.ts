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
  ) {}

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
}

