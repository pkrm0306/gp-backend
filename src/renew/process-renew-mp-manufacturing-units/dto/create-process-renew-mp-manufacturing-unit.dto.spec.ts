import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProcessRenewMpManufacturingUnitDto } from './create-process-renew-mp-manufacturing-unit.dto';

describe('CreateProcessRenewMpManufacturingUnitDto', () => {
  it('accepts renewalCycleId on renew MP unit POST body', async () => {
    const dto = plainToInstance(CreateProcessRenewMpManufacturingUnitDto, {
      urnNo: 'URN-20260605052433',
      unitName: 'Plant A',
      renewalCycleId: '6a1edd713ec5008b997aca94',
    });

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors).toHaveLength(0);
    expect(dto.renewalCycleId).toBe('6a1edd713ec5008b997aca94');
  });
});
