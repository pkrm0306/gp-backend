import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
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
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
  };
}

describe('AdminService Banner Functionality', () => {
  let service: AdminService;

  const bannerModel: any = jest.fn();
  bannerModel.exists = jest.fn();
  bannerModel.find = jest.fn();
  bannerModel.findOne = jest.fn();
  bannerModel.findByIdAndUpdate = jest.fn();
  bannerModel.findOneAndUpdate = jest.fn();
  bannerModel.deleteOne = jest.fn();

  const vendorId = new Types.ObjectId().toString();
  const bannerId = new Types.ObjectId().toString();

  beforeEach(async () => {
    jest.clearAllMocks();

    bannerModel.mockImplementation((doc: any) => ({
      save: jest.fn().mockResolvedValue({
        toObject: () => ({
          _id: new Types.ObjectId(),
          ...doc,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
      }),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getModelToken(Manufacturer.name), useValue: {} },
        { provide: getModelToken(VendorUser.name), useValue: {} },
        { provide: getModelToken(Banner.name), useValue: bannerModel },
        { provide: getModelToken(Event.name), useValue: {} },
        { provide: getModelToken(EventIdCounter.name), useValue: {} },
        { provide: getModelToken(NewsletterSubscriber.name), useValue: {} },
        { provide: getModelToken(ContactMessage.name), useValue: {} },
        { provide: getModelToken(ContactReplyThread.name), useValue: {} },
        { provide: getModelToken(Notification.name), useValue: {} },
        { provide: getModelToken(Article.name), useValue: {} },
        { provide: EmailService, useValue: {} },
        { provide: RbacService, useValue: {} },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('creates banner with unique sequence number', async () => {
    bannerModel.exists.mockReturnValue(queryMock(null));

    const result = await service.createBanner(vendorId, {
      imageUrl: '/uploads/banners/home.jpg',
      title: 'Home Banner',
      sequenceNumber: 1,
      description: 'Banner description',
      status: 'active',
    } as any);

    expect(bannerModel.exists).toHaveBeenCalled();
    expect(result.title).toBe('Home Banner');
    expect(result.sequenceNumber).toBe(1);
    expect(result.status).toBe('active');
    expect(result.is_active).toBe(true);
    expect(result.imageUrl).toContain('/uploads/');
  });

  it('rejects duplicate sequence number on create', async () => {
    bannerModel.exists.mockReturnValue(queryMock({ _id: new Types.ObjectId() }));

    await expect(
      service.createBanner(vendorId, {
        imageUrl: '/uploads/banners/home.jpg',
        title: 'Home Banner',
        sequenceNumber: 1,
        description: 'Banner description',
      } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('lists banners with transformed output', async () => {
    bannerModel.find.mockReturnValue(
      queryMock([
        {
          _id: new Types.ObjectId(),
          imageUrl: '/uploads/banners/a.jpg',
          banner_image: 'banners/a.jpg',
          heading: 'A',
          sequenceNumber: 2,
          description: 'Desc A',
          status: 1,
        },
      ]),
    );

    const rows = await service.listBanners(vendorId);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      title: 'A',
      sequenceNumber: 2,
      status: 'active',
      is_active: true,
    });
    expect(rows[0].imageUrl).toContain('/uploads/');
  });

  it('gets a single banner by id', async () => {
    bannerModel.findOne.mockReturnValue(
      queryMock({
        _id: new Types.ObjectId(),
        imageUrl: '/uploads/banners/a.jpg',
        banner_image: 'banners/a.jpg',
        heading: 'A',
        sequenceNumber: 2,
        description: 'Desc A',
        status: 0,
      }),
    );

    const row = await service.getBannerById(vendorId, bannerId);
    expect(row.title).toBe('A');
    expect(row.status).toBe('inactive');
  });

  it('throws not found when banner id does not exist', async () => {
    bannerModel.findOne.mockReturnValue(queryMock(null));

    await expect(service.getBannerById(vendorId, bannerId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates banner with unique sequence number', async () => {
    bannerModel.findOne.mockReturnValueOnce(queryMock({ _id: new Types.ObjectId() }));
    bannerModel.exists.mockReturnValueOnce(queryMock(null));
    bannerModel.findByIdAndUpdate.mockReturnValue(
      queryMock({
        _id: new Types.ObjectId(),
        imageUrl: '/uploads/banners/updated.jpg',
        banner_image: 'banners/updated.jpg',
        heading: 'Updated',
        sequenceNumber: 4,
        description: 'Updated desc',
        status: 0,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      }),
    );

    const updated = await service.updateBanner(vendorId, bannerId, {
      imageUrl: '/uploads/banners/updated.jpg',
      title: 'Updated',
      sequenceNumber: 4,
      description: 'Updated desc',
      status: 'inactive',
    });

    expect(updated.title).toBe('Updated');
    expect(updated.status).toBe('inactive');
    expect(updated.sequenceNumber).toBe(4);
  });

  it('rejects duplicate sequence number on update', async () => {
    bannerModel.findOne.mockReturnValueOnce(queryMock({ _id: new Types.ObjectId() }));
    bannerModel.exists.mockReturnValueOnce(queryMock({ _id: new Types.ObjectId() }));

    await expect(
      service.updateBanner(vendorId, bannerId, {
        title: 'Updated',
        sequenceNumber: 1,
        description: 'Updated desc',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('sets explicit banner status', async () => {
    bannerModel.findOne.mockReturnValue(queryMock({ _id: new Types.ObjectId(), status: 1 }));
    bannerModel.findByIdAndUpdate.mockReturnValue(
      queryMock({ _id: new Types.ObjectId(), status: 0 }),
    );

    const data = await service.setOrToggleBannerStatus(vendorId, bannerId, 'inactive');
    expect(data.status).toBe('inactive');
    expect(data.is_active).toBe(false);
  });

  it('toggles banner status when status is omitted', async () => {
    bannerModel.findOne.mockReturnValue(queryMock({ _id: new Types.ObjectId(), status: 0 }));
    bannerModel.findByIdAndUpdate.mockReturnValue(
      queryMock({ _id: new Types.ObjectId(), status: 1 }),
    );

    const data = await service.setOrToggleBannerStatus(vendorId, bannerId);
    expect(data.status).toBe('active');
    expect(data.is_active).toBe(true);
  });

  it('deletes banner by id', async () => {
    bannerModel.deleteOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    });

    await expect(service.deleteBanner(vendorId, bannerId)).resolves.toEqual({
      id: bannerId,
    });
  });

  it('throws invalid vendor id on create', async () => {
    await expect(
      service.createBanner('invalid-id', {
        imageUrl: '/uploads/banners/home.jpg',
        title: 'x',
        sequenceNumber: 1,
        description: 'y',
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

