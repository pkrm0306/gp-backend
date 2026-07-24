import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  pickRecaptchaToken,
  RecaptchaService,
  RecaptchaUnreachableError,
} from './recaptcha.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RecaptchaService', () => {
  const configService = {
    get: jest.fn((key: string) =>
      key === 'RECAPTCHA_SECRET_KEY' ? 'test-secret' : undefined,
    ),
  } as unknown as ConfigService;

  let service: RecaptchaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RecaptchaService(configService);
  });

  it('pickRecaptchaToken prefers recaptchaToken', () => {
    expect(
      pickRecaptchaToken({
        recaptchaToken: 'a',
        captchaToken: 'b',
      }),
    ).toBe('a');
  });

  it('verifyRecaptcha returns true when Google success is true', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
    await expect(service.verifyRecaptcha('token')).resolves.toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      'secret=test-secret&response=token',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );
  });

  it('verifyRecaptcha returns false when Google success is false', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: false, 'error-codes': ['invalid-input-response'] },
    });
    await expect(service.verifyRecaptcha('bad')).resolves.toBe(false);
  });

  it('verifyRecaptcha throws when secret is missing', async () => {
    const missingSecret = new RecaptchaService({
      get: () => undefined,
    } as unknown as ConfigService);
    await expect(missingSecret.verifyRecaptcha('token')).rejects.toThrow(
      /RECAPTCHA_SECRET_KEY/,
    );
  });

  it('verifyRecaptcha throws RecaptchaUnreachableError on network failure', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    await expect(service.verifyRecaptcha('token')).rejects.toBeInstanceOf(
      RecaptchaUnreachableError,
    );
  });

  it('assertRecaptchaToken throws 400 when token missing', async () => {
    await expect(service.assertRecaptchaToken('')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('assertRecaptchaToken throws 403 when Google rejects token', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: false } });
    await expect(service.assertRecaptchaToken('bad')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('assertRecaptchaToken throws 500 when Google is unreachable', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('timeout'));
    await expect(service.assertRecaptchaToken('token')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
