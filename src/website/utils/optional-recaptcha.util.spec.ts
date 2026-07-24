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

  it('extractOptionalRecaptchaToken prefers recaptchaToken in body', () => {
    expect(
      extractOptionalRecaptchaToken(
        {},
        { recaptchaToken: 'preferred', captchaToken: 'legacy' },
      ),
    ).toBe('preferred');
  });

  it('manufacturer inquiry requires recaptcha on the payload', () => {
    expect(isManufacturerInquiryRecaptchaRequired()).toBe(true);
  });
});
