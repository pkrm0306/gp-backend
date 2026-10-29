import { BadRequestException } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController Event Endpoints', () => {
  let controller: AdminController;

  const adminServiceMock = {
    createEvent: jest.fn(),
    updateEvent: jest.fn(),
    listEventsPaginated: jest.fn(),
    getEventById: jest.fn(),
    setOrToggleEventStatus: jest.fn(),
    deleteEvent: jest.fn(),
  } as unknown as jest.Mocked<AdminService>;

  const galleryServiceMock = {
    setOrToggleGalleryStatus: jest.fn(),
    createGallery: jest.fn(),
    updateGallery: jest.fn(),
    listGalleryPaginated: jest.fn(),
    getGalleryById: jest.fn(),
    deleteGallery: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AdminController(
      adminServiceMock,
      galleryServiceMock as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  it('creates event successfully with required fields', async () => {
    adminServiceMock.createEvent.mockResolvedValue({ id: 'e1', eventName: 'Event 1' } as any);

    const res = await controller.createEvent({
      eventName: 'Event 1',
      eventDate: '2026-05-15',
      programmeAtAGlance: JSON.stringify([
        { time: '09:00 AM', description: 'Registration and welcome' },
      ]),
    });

    expect(adminServiceMock.createEvent).toHaveBeenCalledTimes(1);
    expect(adminServiceMock.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'Event 1',
        programmeAtAGlance: [
          { day: 1, time: '09:00 AM', description: 'Registration and welcome' },
        ],
      }),
    );
    expect(res.message).toBe('Event created successfully');
  });

  it('creates event with format multiselect (inperson and online)', async () => {
    adminServiceMock.createEvent.mockResolvedValue({
      id: 'e1',
      eventName: 'Hybrid Event',
      format: ['inperson', 'online'],
    } as any);

    const res = await controller.createEvent({
      eventName: 'Hybrid Event',
      eventDate: '2026-05-15',
      format: JSON.stringify(['inperson', 'online']),
      programmeAtAGlance: JSON.stringify([
        { time: '09:00 AM', description: 'Registration' },
      ]),
    });

    expect(adminServiceMock.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'Hybrid Event',
        format: ['inperson', 'online'],
      }),
    );
    expect(res.message).toBe('Event created successfully');
  });

  it('rejects invalid format values on create', async () => {
    await expect(
      controller.createEvent({
        eventName: 'Event 1',
        eventDate: '2026-05-15',
        format: JSON.stringify(['hybrid']),
        programmeAtAGlance: JSON.stringify([
          { time: '09:00 AM', description: 'Day 1' },
        ]),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when create event date is invalid', async () => {
    await expect(
      controller.createEvent({
        eventName: 'Event 1',
        eventDate: 'not-a-date',
        programmeAtAGlance: JSON.stringify([
          { time: '09:00 AM', description: 'Day 1' },
        ]),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('allows any number of programme entries on multi-day create', async () => {
    adminServiceMock.createEvent.mockResolvedValue({
      id: 'e1',
      eventName: 'Event 1',
    } as any);

    const res = await controller.createEvent({
      eventName: 'Event 1',
      eventStartDate: '2026-05-15',
      eventEndDate: '2026-05-16',
      programmeAtAGlance: JSON.stringify([
        { day: 1, time: '09:00 AM', description: 'Registration' },
        { day: 1, time: '10:00 AM', description: 'Keynote' },
        { day: 2, time: '09:30 AM', description: 'Workshops' },
      ]),
    });

    expect(adminServiceMock.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        programmeAtAGlance: [
          { day: 1, time: '09:00 AM', description: 'Registration' },
          { day: 1, time: '10:00 AM', description: 'Keynote' },
          { day: 2, time: '09:30 AM', description: 'Workshops' },
        ],
      }),
    );
    expect(res.message).toBe('Event created successfully');
  });

  it('expands nested day/items programme payload on create', async () => {
    adminServiceMock.createEvent.mockResolvedValue({
      id: 'e1',
      eventName: 'Event 1',
    } as any);

    await controller.createEvent({
      eventName: 'Event 1',
      eventStartDate: '2026-05-15',
      eventEndDate: '2026-05-16',
      programmeAtAGlance: JSON.stringify([
        {
          day: 1,
          items: [{ time: '09:00', description: 'Registration' }],
        },
        {
          day: 2,
          items: [{ time: '10:00', description: 'Workshops' }],
        },
      ]),
    });

    expect(adminServiceMock.createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        programmeAtAGlance: [
          { day: 1, time: '09:00', description: 'Registration' },
          { day: 2, time: '10:00', description: 'Workshops' },
        ],
      }),
    );
  });

  it('edits event successfully', async () => {
    adminServiceMock.updateEvent.mockResolvedValue({ id: 'e1', eventName: 'Updated' } as any);

    const res = await controller.editEvent('e1', {
      eventName: 'Updated',
      eventDate: '2026-05-20',
      status: 'inactive',
    });

    expect(adminServiceMock.updateEvent).toHaveBeenCalledTimes(1);
    expect(res.message).toBe('Event updated successfully');
  });

  it('edits event format multiselect', async () => {
    adminServiceMock.updateEvent.mockResolvedValue({
      id: 'e1',
      format: ['online'],
    } as any);

    const res = await controller.editEvent('e1', {
      format: ['online'],
    });

    expect(adminServiceMock.updateEvent).toHaveBeenCalledWith(
      'e1',
      expect.objectContaining({ format: ['online'] }),
    );
    expect(res.message).toBe('Event updated successfully');
  });

  it('lists events successfully', async () => {
    adminServiceMock.listEventsPaginated.mockResolvedValue({
      data: [{ id: 'e1' }],
      pagination: { page: 1, limit: 10, perPage: 10, total: 1, totalPages: 1 },
    } as any);
    const res = await controller.listEvents();
    expect(adminServiceMock.listEventsPaginated).toHaveBeenCalledWith(1, 10, {
      activeOnly: true,
    });
    expect(res.message).toBe('Events retrieved successfully');
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.pagination).toBeDefined();
  });

  it('gets event by id successfully', async () => {
    adminServiceMock.getEventById.mockResolvedValue({ id: 'e1' } as any);
    const res = await controller.getEventById('e1');
    expect(adminServiceMock.getEventById).toHaveBeenCalledWith('e1', 'event');
    expect(res.message).toBe('Event retrieved successfully');
  });

  it('updates gallery status by parsing active/inactive', async () => {
    galleryServiceMock.setOrToggleGalleryStatus.mockResolvedValue({
      id: 'g1',
      status: 'active',
      is_active: true,
    });

    const res = await controller.updateGalleryStatus('g1', { status: 'active' });
    expect(galleryServiceMock.setOrToggleGalleryStatus).toHaveBeenCalledWith('g1', 1);
    expect(res.message).toBe('Gallery status updated successfully');
  });

  it('deletes event successfully', async () => {
    adminServiceMock.deleteEvent.mockResolvedValue({ id: 'e1' } as any);
    const res = await controller.deleteEvent('e1');
    expect(adminServiceMock.deleteEvent).toHaveBeenCalledWith('e1', 'event');
    expect(res.message).toBe('Event deleted successfully');
  });

  it('keeps only the first 10 event images when more are received', () => {
    const items = Array.from({ length: 15 }, (_, i) => `img-${i}`);
    expect((controller as any).takeFirstEventImages(items)).toEqual(
      items.slice(0, 10),
    );
  });

  it('does not double-count image and eventImage field aliases', () => {
    const mk = (name: string) =>
      ({ originalname: name, buffer: Buffer.from(name) }) as Express.Multer.File;
    const files = Array.from({ length: 10 }, (_, i) => mk(`img-${i}.jpg`));
    const collected = (controller as any).collectEventImageFiles({
      image: files,
      eventImage: [files[0]],
    });
    expect(collected).toHaveLength(10);
  });

  it('falls back to eventImage only when multi-image fields are empty', () => {
    const file = {
      originalname: 'legacy.jpg',
      buffer: Buffer.from('x'),
    } as Express.Multer.File;
    const collected = (controller as any).collectEventImageFiles({
      eventImage: [file],
    });
    expect(collected).toHaveLength(1);
    expect(collected[0]).toBe(file);
  });
});

