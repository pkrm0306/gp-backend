import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AdminService } from './admin.service';
import { Manufacturer } from '../manufacturers/schemas/manufacturer.schema';
import { VendorUser } from '../vendor-users/schemas/vendor-user.schema';
import { Banner } from '../banners/schemas/banner.schema';
import { Event } from '../events/schemas/event.schema';
import { EventIdCounter } from '../events/schemas/event-id-counter.schema';
import { NewsletterSubscriber } from '../website/schemas/newsletter-subscriber.schema';
import { ContactMessage } from '../website/schemas/contact-message.schema';
import { ContactReplyThread } from './schemas/contact-reply-thread.schema';
import { Notification } from '../common/schemas/notification.schema';
import { Article } from '../articles/schemas/article.schema';
import { EmailService } from '../common/services/email.service';
import { RbacService } from '../rbac/rbac.service';

function queryMock<T>(result: T) {
  return {
    sort: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
  };
}

describe('AdminService Event Functionality', () => {
  let service: AdminService;

  const eventModel: any = jest.fn();
  eventModel.find = jest.fn();
  eventModel.findById = jest.fn();
  eventModel.findByIdAndUpdate = jest.fn();
  eventModel.findOne = jest.fn();
  eventModel.findOneAndUpdate = jest.fn();
  eventModel.deleteOne = jest.fn();

  const eventCounterModel = {
    findOneAndUpdate: jest.fn(),
  };
  const notificationModel = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    eventModel.mockImplementation((doc: any) => ({
      save: jest.fn().mockResolvedValue({
        toObject: () => ({
          _id: new Types.ObjectId(),
          ...doc,
        }),
      }),
    }));
    eventCounterModel.findOneAndUpdate.mockReturnValue(
      queryMock({
        seq: 9,
      }),
    );
    notificationModel.create.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getModelToken(Manufacturer.name), useValue: {} },
        { provide: getModelToken(VendorUser.name), useValue: {} },
        { provide: getModelToken(Banner.name), useValue: {} },
        { provide: getModelToken(Event.name), useValue: eventModel },
        { provide: getModelToken(EventIdCounter.name), useValue: eventCounterModel },
        { provide: getModelToken(NewsletterSubscriber.name), useValue: {} },
        { provide: getModelToken(ContactMessage.name), useValue: {} },
        { provide: getModelToken(ContactReplyThread.name), useValue: {} },
        { provide: getModelToken(Notification.name), useValue: notificationModel },
        { provide: getModelToken(Article.name), useValue: {} },
        { provide: EmailService, useValue: {} },
        { provide: RbacService, useValue: {} },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('creates event successfully', async () => {
    const result = await service.createEvent({
      eventName: 'Green Summit',
      eventDate: new Date('2026-05-10T00:00:00.000Z'),
      eventDescription: 'Event description',
      eventStatus: 1,
    });

    expect(result.eventName).toBe('Green Summit');
    expect(result.eventId).toBe(9);
    expect(notificationModel.create).not.toHaveBeenCalled();
  });

  it('updates event by object id', async () => {
    eventModel.findByIdAndUpdate.mockReturnValue(
      queryMock({
        _id: new Types.ObjectId(),
        eventName: 'Updated Event',
        eventStatus: 0,
      }),
    );

    const id = new Types.ObjectId().toString();
    const result = await service.updateEvent(id, {
      eventName: 'Updated Event',
      eventStatus: 0,
    });

    expect(eventModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(result.eventName).toBe('Updated Event');
    expect(notificationModel.create).not.toHaveBeenCalled();
  });

  it('throws bad request for invalid event id during update', async () => {
    await expect(
      service.updateEvent('invalid-id', { eventName: 'x' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists events with transformed response', async () => {
    eventModel.find.mockReturnValue(
      queryMock([
        {
          _id: new Types.ObjectId(),
          eventId: 10,
          eventName: 'Event A',
          eventDescription: 'Desc',
          eventDate: new Date('2026-06-01T00:00:00.000Z'),
          eventStartTime: '10:00 AM',
          eventLocation: 'Chennai',
          eventStatus: 1,
          eventImage: '/uploads/events/a.jpg',
          event_image: 'events/a.jpg',
        },
      ]),
    );

    const rows = await service.listEvents();
    expect(rows).toHaveLength(1);
    expect(rows[0].eventName).toBe('Event A');
    expect(rows[0].is_active).toBe(true);
    expect(rows[0].dateTime).toContain('2026-06-01');
  });

  it('gets event by object id', async () => {
    eventModel.findById.mockReturnValue(
      queryMock({
        _id: new Types.ObjectId(),
        eventName: 'Event A',
        eventStatus: 1,
      }),
    );
    const id = new Types.ObjectId().toString();
    const event = await service.getEventById(id);
    expect(event.eventName).toBe('Event A');
  });

  it('throws not found when get event missing', async () => {
    eventModel.findById.mockReturnValue(queryMock(null));
    const id = new Types.ObjectId().toString();
    await expect(service.getEventById(id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes event successfully', async () => {
    eventModel.deleteOne.mockReturnValue(
      queryMock({
        deletedCount: 1,
      }),
    );
    const id = new Types.ObjectId().toString();
    await expect(service.deleteEvent(id)).resolves.toEqual({ id });
    expect(notificationModel.create).not.toHaveBeenCalled();
  });

  it('toggles event status when omitted', async () => {
    eventModel.findOne.mockReturnValue(queryMock({ eventStatus: 1 }));
    eventModel.findOneAndUpdate.mockReturnValue(
      queryMock({
        _id: new Types.ObjectId(),
        eventId: 10,
        eventStatus: 0,
      }),
    );
    const id = new Types.ObjectId().toString();
    const result = await service.setOrToggleEventStatus(id);
    expect(result.status).toBe('inactive');
    expect(result.is_active).toBe(false);
  });

  it('sets event status explicitly', async () => {
    eventModel.findOneAndUpdate.mockReturnValue(
      queryMock({
        _id: new Types.ObjectId(),
        eventId: 11,
        eventStatus: 1,
      }),
    );
    const id = new Types.ObjectId().toString();
    const result = await service.setOrToggleEventStatus(id, 1);
    expect(result.status).toBe('active');
    expect(result.is_active).toBe(true);
  });
});

