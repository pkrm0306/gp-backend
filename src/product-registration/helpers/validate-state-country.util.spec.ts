import { BadRequestException } from '@nestjs/common';
import { assertStateBelongsToCountry } from './validate-state-country.util';

describe('assertStateBelongsToCountry', () => {
  it('accepts legacy country_id match when countryId ObjectId differs', async () => {
    const statesService = {
      findById: jest.fn().mockResolvedValue({
        country_id: 91,
      }),
    };
    const countriesService = {
      findById: jest.fn().mockResolvedValue({
        id: 91,
        countryName: 'India',
      }),
    };

    await expect(
      assertStateBelongsToCountry(
        statesService as never,
        countriesService as never,
        '6998559514999ba875c7dec7',
        '6998547b14999ba875c7d70c',
      ),
    ).resolves.toBeUndefined();
  });

  it('accepts country_code match', async () => {
    const statesService = {
      findById: jest.fn().mockResolvedValue({
        country_code: 'IN',
      }),
    };
    const countriesService = {
      findById: jest.fn().mockResolvedValue({
        country_code: 'IN',
      }),
    };

    await expect(
      assertStateBelongsToCountry(
        statesService as never,
        countriesService as never,
        'state1',
        'country1',
      ),
    ).resolves.toBeUndefined();
  });

  it('rejects when no linkage matches', async () => {
    const statesService = {
      findById: jest.fn().mockResolvedValue({ country_id: 1 }),
    };
    const countriesService = {
      findById: jest.fn().mockResolvedValue({ id: 2 }),
    };

    await expect(
      assertStateBelongsToCountry(
        statesService as never,
        countriesService as never,
        'state1',
        'country1',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
