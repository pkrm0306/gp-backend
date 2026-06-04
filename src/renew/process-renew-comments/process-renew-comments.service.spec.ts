import { BadRequestException } from '@nestjs/common';
import { ProcessRenewCommentsService } from './process-renew-comments.service';

describe('ProcessRenewCommentsService admin section validation', () => {
  const service = Object.create(ProcessRenewCommentsService.prototype) as ProcessRenewCommentsService;

  it('rejects POST with no section field', () => {
    expect(() =>
      (service as any).pickSingleAdminSectionField({
        urnNo: 'URN-1',
        renewalCycleId: 'abc',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects POST with multiple section fields', () => {
    expect(() =>
      (service as any).pickSingleAdminSectionField({
        urnNo: 'URN-1',
        productPerformance: 'a',
        wasteManagement: 'b',
      }),
    ).toThrow(/Only one process comment section field/);
  });

  it('accepts legacy manfacturingProcess field name', () => {
    const patch = (service as any).pickSingleAdminSectionField({
      urnNo: 'URN-1',
      manfacturingProcess: '<p>ok</p>',
    });
    expect(patch).toEqual({ manfacturingProcess: '<p>ok</p>' });
  });
});

