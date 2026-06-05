import {
  extractOptionalRecaptchaToken,
  isManufacturerInquiryRecaptchaRequired,
} from './optional-recaptcha.util';

describe('optional-recaptcha.util', () => {
  it('extractOptionalRecaptchaToken reads header first', () => {
    expect(
      extractOptionalRecaptchaToken(
        { 'x-recaptcha-token': 'header-token' },
        { captchaToken: 'body-token' },
      ),
    ).toBe('header-token');
  });

  it('extractOptionalRecaptchaToken reads body aliases', () => {
    expect(
      extractOptionalRecaptchaToken({}, { captchaToken: 'body-token' }),
    ).toBe('body-token');
  });

  it('manufacturer inquiry never requires recaptcha', () => {
    expect(isManufacturerInquiryRecaptchaRequired()).toBe(false);
  });
});
