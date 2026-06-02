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

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AdminController(adminServiceMock, {} as any, {} as any);
  });

  it('creates event successfully with required fields', async () => {
    adminServiceMock.createEvent.mockResolvedValue({ id: 'e1', eventName: 'Event 1' } as any);

    const res = await controller.createEvent({
      eventName: 'Event 1',
      eventDate: '2026-05-15',
    });

    expect(adminServiceMock.createEvent).toHaveBeenCalledTimes(1);
    expect(res.message).toBe('Event created successfully');
  });

  it('throws when create event date is invalid', async () => {
    await expect(
      controller.createEvent({
        eventName: 'Event 1',
        eventDate: 'not-a-date',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
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
    adminServiceMock.setOrToggleEventStatus.mockResolvedValue({
      id: 'e1',
      status: 'active',
      is_active: true,
    } as any);

    const res = await controller.updateGalleryStatus('e1', { status: 'active' });
    expect(adminServiceMock.setOrToggleEventStatus).toHaveBeenCalledWith('e1', 1, 'gallery');
    expect(res.message).toBe('Gallery status updated successfully');
  });

  it('deletes event successfully', async () => {
    adminServiceMock.deleteEvent.mockResolvedValue({ id: 'e1' } as any);
    const res = await controller.deleteEvent('e1');
    expect(adminServiceMock.deleteEvent).toHaveBeenCalledWith('e1', 'event');
    expect(res.message).toBe('Event deleted successfully');
  });
});

