import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AuditLogAdminController } from './audit-log-admin.controller';
import { AuditLogService } from './audit-log.service';

describe('AuditLogAdminController detail integration', () => {
  let controller: AuditLogAdminController;
  const findById = jest.fn();
  const list = jest.fn();
  const filterOptions = jest.fn();

  beforeEach(async () => {
    findById.mockReset();
    list.mockReset();
    filterOptions.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditLogAdminController],
      providers: [
        {
          provide: AuditLogService,
          useValue: { findById, list, filterOptions },
        },
      ],
    }).compile();

    controller = module.get(AuditLogAdminController);
  });

  it('returns a consistent JSON-safe detail DTO when snapshots are missing', async () => {
    const id = new Types.ObjectId().toString();
    findById.mockResolvedValue({
      _id: id,
      occurred_at: new Date('2026-06-09T05:30:00.000Z'),
      action: 'HTTP_MUTATION',
      outcome: 'success',
      module: 'product',
      action_type: 'create',
      description: 'Product / process data created',
      performed_by: { name: 'Admin User' },
      route: '/products',
      http_method: 'POST',
      status_code: 201,
    });

    const response = await controller.detail(id);

    expect(response).toMatchObject({
      success: true,
      message: 'Audit log detail retrieved',
      data: {
        id,
        action: 'HTTP_MUTATION',
        outcome: 'success',
        module: 'product',
        module_display: 'Product',
        action_type: 'create',
        action_display: 'create',
        old_values: null,
        new_values: null,
        changes: null,
        metadata: null,
        user_display: 'Admin User',
      },
    });
    expect(() => JSON.stringify(response)).not.toThrow();
  });

  it('returns active audit filter options with pagination metadata', async () => {
    filterOptions.mockResolvedValue({
      modules: [{ value: 'product', label: 'Product', count: 5 }],
      action_types: [{ value: 'update', label: 'update', count: 5 }],
      actions: [{ value: 'HTTP_MUTATION', label: 'HTTP_MUTATION', count: 5 }],
      users: [{ value: 'Admin User', label: 'Admin User', count: 5 }],
      pagination: {
        page: 1,
        limit: 20,
        totalCount: 1,
        totalPages: 1,
      },
      from: new Date('2026-06-01T00:00:00.000Z'),
      to: new Date('2026-06-09T00:00:00.000Z'),
    });

    const response = await controller.filters({ page: 1, limit: 20 });

    expect(filterOptions).toHaveBeenCalledWith({ page: 1, limit: 20 });
    expect(response).toEqual({
      success: true,
      message: 'Audit filter options retrieved',
      data: {
        modules: [{ value: 'product', label: 'Product', count: 5 }],
        action_types: [{ value: 'update', label: 'update', count: 5 }],
        actions: [{ value: 'HTTP_MUTATION', label: 'HTTP_MUTATION', count: 5 }],
        users: [{ value: 'Admin User', label: 'Admin User', count: 5 }],
      },
      pagination: {
        page: 1,
        limit: 20,
        totalCount: 1,
        totalPages: 1,
      },
      meta: {
        page: 1,
        limit: 20,
        totalCount: 1,
        totalPages: 1,
        from: '2026-06-01T00:00:00.000Z',
        to: '2026-06-09T00:00:00.000Z',
      },
    });
  });

  it('rejects invalid audit detail ids', async () => {
    await expect(controller.detail('not-an-object-id')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(findById).not.toHaveBeenCalled();
  });

  it('returns not found when the audit detail record is missing', async () => {
    const id = new Types.ObjectId().toString();
    findById.mockResolvedValue(null);

    await expect(controller.detail(id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
