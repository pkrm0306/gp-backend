import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLogService } from './audit-log.service';
import { AUDIT_ACTION } from './audit-actions';
import { AuditLog } from './schemas/audit-log.schema';

describe('AuditLogService', () => {
  let service: AuditLogService;
  const createMock = jest.fn().mockResolvedValue({ _id: 'x' });

  beforeEach(async () => {
    createMock.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        {
          provide: getModelToken(AuditLog.name),
          useValue: { create: createMock },
        },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
  });

  it('inserts audit document on record()', async () => {
    await service.record({
      action: AUDIT_ACTION.HTTP_MUTATION,
      outcome: 'success',
      http_method: 'POST',
      route: '/test',
      status_code: 200,
    });
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock.mock.calls[0][0].action).toBe(AUDIT_ACTION.HTTP_MUTATION);
  });

  it('does not throw when create fails', async () => {
    createMock.mockRejectedValueOnce(new Error('db down'));
    await expect(
      service.record({
        action: AUDIT_ACTION.AUTH_LOGIN,
        outcome: 'failure',
      }),
    ).resolves.toBeUndefined();
  });
});
