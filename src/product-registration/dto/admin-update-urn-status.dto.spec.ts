import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AdminUpdateUrnStatusDto } from './admin-update-urn-status.dto';

describe('AdminUpdateUrnStatusDto', () => {
  it('accepts renewal urn status 14 (regression for >11)', () => {
    const dto = plainToInstance(AdminUpdateUrnStatusDto, {
      urnNo: 'URN-TEST-1',
      updateStatusType: 'urn_status',
      updateStatusTo: 14,
    });

    const errors = validateSync(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects out-of-range urn status 18 with new bound', () => {
    const dto = plainToInstance(AdminUpdateUrnStatusDto, {
      urnNo: 'URN-TEST-1',
      updateStatusType: 'urn_status',
      updateStatusTo: 18,
    });

    const errors = validateSync(dto);
    const messages = errors
      .flatMap((err) => Object.values(err.constraints ?? {}))
      .join(' | ');

    expect(messages).toContain('must not be greater than 17');
    expect(messages).not.toContain('must not be greater than 11');
  });
});

