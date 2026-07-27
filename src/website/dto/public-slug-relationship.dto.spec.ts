import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PublicCategoryManufacturersDto } from './public-category-manufacturers.dto';
import { PublicManufacturerCategoriesDto } from './public-manufacturer-categories.dto';

describe('public slug relationship DTOs', () => {
  it('accepts categorySlug alone', async () => {
    const dto = plainToInstance(PublicCategoryManufacturersDto, {
      categorySlug: 'cement',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('accepts categoryId alone', async () => {
    const dto = plainToInstance(PublicCategoryManufacturersDto, {
      categoryId: '6996ddcf14999ba875c7d691',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects empty category body', async () => {
    const dto = plainToInstance(PublicCategoryManufacturersDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('accepts manufacturerSlug alone', async () => {
    const dto = plainToInstance(PublicManufacturerCategoriesDto, {
      manufacturerSlug: 'asian-paints',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid manufacturerSlug', async () => {
    const dto = plainToInstance(PublicManufacturerCategoriesDto, {
      manufacturerSlug: 'Bad Slug',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
