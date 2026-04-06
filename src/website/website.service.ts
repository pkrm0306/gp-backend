import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NewsletterSubscriber,
  NewsletterSubscriberDocument,
} from './schemas/newsletter-subscriber.schema';
import { NewsletterSubscribeDto } from './dto/newsletter-subscribe.dto';
import { ContactSubmitDto } from './dto/contact-submit.dto';
import { ContactMessage, ContactMessageDocument } from './schemas/contact-message.schema';

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
      };
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.message || 'Failed to submit contact message',
      );
    }
  }
}

