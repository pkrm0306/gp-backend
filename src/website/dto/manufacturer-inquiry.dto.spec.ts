import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ManufacturerInquiryDto } from './manufacturer-inquiry.dto';

describe('ManufacturerInquiryDto', () => {
  it('accepts name, email, countryCode, and phone without message', async () => {
    const dto = plainToInstance(ManufacturerInquiryDto, {
      manufacturerId: '680c9ccbe5fce6d879ec4aa1',
      name: 'Meghana',
      email: 'rmeghana184@gmail.com',
      countryCode: '+91',
      phoneNumber: '9876543213',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('requires countryCode when phone is local digits', async () => {
    const dto = plainToInstance(ManufacturerInquiryDto, {
      manufacturerId: '680c9ccbe5fce6d879ec4aa1',
      name: 'Meghana',
      email: 'rmeghana184@gmail.com',
      phoneNumber: '9876543213',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'countryCode')).toBe(true);
  });

  it('accepts optional captcha fields in body without validating them', async () => {
    const dto = plainToInstance(ManufacturerInquiryDto, {
      manufacturerId: '680c9ccbe5fce6d879ec4aa1',
      name: 'Meghana',
      email: 'rmeghana184@gmail.com',
      countryCode: '+91',
      phoneNumber: '9876543213',
      captchaToken: '03AFcWeA...',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects when message is provided but shorter than 5 characters', async () => {
    const dto = plainToInstance(ManufacturerInquiryDto, {
      manufacturerId: '680c9ccbe5fce6d879ec4aa1',
      name: 'Meghana',
      email: 'rmeghana184@gmail.com',
      countryCode: '91',
      phone: '9876543213',
      message: 'hi',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'message')).toBe(true);
  });
});
