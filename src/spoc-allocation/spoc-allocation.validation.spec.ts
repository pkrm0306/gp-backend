import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AssignSpocDto, ReassignSpocDto } from './dto/assign-spoc.dto';
import { throwSpocValidationError } from './validation/spoc-allocation.validation';

describe('SPOC DTO + validation framework', () => {
  it('throwSpocValidationError uses VALIDATION_ERROR shape for HttpExceptionFilter', () => {
    try {
      throwSpocValidationError('Product must not be Certified', {
        productId: 'Product must not be Certified',
      });
      fail('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      const body = (err as BadRequestException).getResponse() as Record<
        string,
        unknown
      >;
      expect(body.code).toBe('VALIDATION_ERROR');
      expect(body.message).toBe('Product must not be Certified');
      expect(body.fieldErrors).toEqual({
        productId: 'Product must not be Certified',
      });
      expect(body.issues).toEqual([
        { field: 'productId', message: 'Product must not be Certified' },
      ]);
    }
  });

  it('AssignSpocDto rejects invalid spocId via class-validator', async () => {
    const dto = plainToInstance(AssignSpocDto, {
      productId: 1,
      spocId: 'not-an-object-id',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'spocId')).toBe(true);
  });

  it('AssignSpocDto accepts valid payload', async () => {
    const dto = plainToInstance(AssignSpocDto, {
      productId: 12,
      spocId: '507f1f77bcf86cd799439022',
      urn: 'URN-1',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('ReassignSpocDto requires spocId (productId comes from path)', async () => {
    const dto = plainToInstance(ReassignSpocDto, {});
    const errors = await validate(dto);
    const props = errors.map((e) => e.property);
    expect(props).toEqual(expect.arrayContaining(['spocId']));
    expect(props).not.toContain('productId');
  });
});

