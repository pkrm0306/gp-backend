jest.mock('archiver', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { StreamableFile } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController Event Registrations', () => {
  let controller: AdminController;

  const adminServiceMock = {
    listEventRegistrations: jest.fn(),
    exportEventRegistrationsCsv: jest.fn(),
    countEventRegistrationsByEventSlug: jest.fn(),
    getEventRegistrationById: jest.fn(),
    updateEventRegistration: jest.fn(),
  } as unknown as jest.Mocked<AdminService>;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AdminController(
      adminServiceMock,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  it('lists event registrations with pagination meta', async () => {
    adminServiceMock.listEventRegistrations.mockResolvedValue({
      data: [{ id: 'r1', referenceCode: 'GP-00001' }],
      totalCount: 1,
      currentPage: 1,
      totalPages: 1,
      page: 1,
      limit: 20,
    } as any);

    const res = await controller.listEventRegistrations({ page: 1, limit: 20 });
    expect(adminServiceMock.listEventRegistrations).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
    });
    expect(res.message).toBe('Event registrations retrieved successfully');
    expect(res.totalCount).toBe(1);
    expect(res.data).toHaveLength(1);
  });

  it('exports CSV as StreamableFile', async () => {
    adminServiceMock.exportEventRegistrationsCsv.mockResolvedValue({
      buffer: Buffer.from('referenceCode\nGP-00001'),
      fileName: 'event-registrations-2026-10-26.csv',
    });

    const res = await controller.exportEventRegistrations({});
    expect(res).toBeInstanceOf(StreamableFile);
  });

  it('returns registration detail', async () => {
    adminServiceMock.getEventRegistrationById.mockResolvedValue({
      id: 'r1',
      referenceCode: 'GP-00001',
    } as any);

    const res = await controller.getEventRegistration('r1');
    expect(adminServiceMock.getEventRegistrationById).toHaveBeenCalledWith(
      'r1',
    );
    expect(res.data.referenceCode).toBe('GP-00001');
  });

  it('updates registration status', async () => {
    adminServiceMock.updateEventRegistration.mockResolvedValue({
      id: 'r1',
      status: 'confirmed',
    } as any);

    const res = await controller.updateEventRegistration('r1', {
      status: 'confirmed',
      adminNotes: 'Seat held',
    });
    expect(adminServiceMock.updateEventRegistration).toHaveBeenCalledWith(
      'r1',
      { status: 'confirmed', adminNotes: 'Seat held' },
    );
    expect(res.message).toBe('Event registration updated successfully');
  });
});
