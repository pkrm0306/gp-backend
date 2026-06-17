import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AdminListProductsDto } from './admin-list-products.dto';

describe('AdminListProductsDto category & building filters', () => {
  it('accepts category_id for uncertified list filter', async () => {
    const dto = plainToInstance(AdminListProductsDto, {
      status: [0, 1],
      category_id: '507f1f77bcf86cd799439011',
      page: 1,
      limit: 10,
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(errors).toEqual([]);
    expect(dto.category_id).toBe('507f1f77bcf86cd799439011');
  });

  it('accepts category_ids multiselect', async () => {
    const dto = plainToInstance(AdminListProductsDto, {
      status: [0, 1],
      category_ids: [
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
      ],
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(errors).toEqual([]);
    expect(dto.category_ids).toHaveLength(2);
  });

  it('accepts building_ids multiselect for sector filter', async () => {
    const dto = plainToInstance(AdminListProductsDto, {
      status: [0, 1],
      building_ids: [1, 2],
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(errors).toEqual([]);
    expect(dto.building_ids).toEqual([1, 2]);
  });

  it('accepts valid_till month+year alias for certified list filter', async () => {
    const dto = plainToInstance(AdminListProductsDto, {
      status: [2],
      valid_till: '2026-12',
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(errors).toEqual([]);
    expect(dto.valid_till).toBe('2026-12');
  });

  it('normalizes legacy YYYY-MM-DD to YYYY-MM on valid_till_date', async () => {
    const dto = plainToInstance(AdminListProductsDto, {
      status: [2],
      valid_till_date: '2026-12-31',
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(errors).toEqual([]);
    expect(dto.valid_till_date).toBe('2026-12');
  });

  it('accepts validTillMonthYear and validtillDate aliases', async () => {
    const dto = plainToInstance(AdminListProductsDto, {
      status: [2],
      validTillMonthYear: '2026-12',
      validtillDate: '2026-12',
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(errors).toEqual([]);
    expect(dto.validTillMonthYear).toBe('2026-12');
    expect(dto.validtillDate).toBe('2026-12');
  });

  it('accepts valid_till_month with valid_till_year for certified list filter', async () => {
    const dto = plainToInstance(AdminListProductsDto, {
      status: [2],
      valid_till_month: 12,
      valid_till_year: 2026,
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(errors).toEqual([]);
    expect(dto.valid_till_month).toBe(12);
    expect(dto.valid_till_year).toBe(2026);
  });

  it('accepts validTillMonth with validTillYear for certified list filter', async () => {
    const dto = plainToInstance(AdminListProductsDto, {
      status: [2],
      validTillMonth: 12,
      validTillYear: 2026,
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    expect(errors).toEqual([]);
    expect(dto.validTillMonth).toBe(12);
    expect(dto.validTillYear).toBe(2026);
  });
});
