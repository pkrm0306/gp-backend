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

  it('rejects empty section comment values', () => {
    expect(() =>
      (service as any).buildCommentUpdateData(
        {
          urnNo: 'URN-1',
          productPerformance: '<p></p>',
        },
        {
          vendorId: '507f1f77bcf86cd799439011' as any,
          manufacturerId: '507f1f77bcf86cd799439012' as any,
        },
        '507f1f77bcf86cd799439013' as any,
        new Date(),
      ),
    ).toThrow(/Comments are required/);
  });
});

