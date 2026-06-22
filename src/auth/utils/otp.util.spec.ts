import { generateVendorRegistrationOtp } from './otp.util';

describe('generateVendorRegistrationOtp', () => {
  const config = (env: string, fixed?: string) =>
    ({
      get: (key: string) => {
        if (key === 'VENDOR_REGISTRATION_OTP_FIXED') return fixed ?? '';
        if (key === 'NODE_ENV') return env;
        return '';
      },
    }) as any;

  it('uses fixed OTP when VENDOR_REGISTRATION_OTP_FIXED is set', () => {
    expect(generateVendorRegistrationOtp(config('production', '999888'))).toBe(
      '999888',
    );
  });

  it('uses 123456 in development', () => {
    expect(generateVendorRegistrationOtp(config('development'))).toBe('123456');
  });

  it('generates a 6-digit OTP in production', () => {
    const otp = generateVendorRegistrationOtp(config('production'));
    expect(otp).toMatch(/^\d{6}$/);
  });
});
