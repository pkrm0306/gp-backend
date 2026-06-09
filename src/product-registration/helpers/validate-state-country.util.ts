import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CountriesService } from '../../countries/countries.service';
import { StatesService } from '../../states/states.service';

/**
 * Ensure state exists and belongs to country — matches vendor registration checks
 * (ObjectId countryId, legacy country_id integer, or country_code).
 */
export async function assertStateBelongsToCountry(
  statesService: StatesService,
  countriesService: CountriesService,
  stateId: string,
  countryId: string,
): Promise<void> {
  const state = await statesService.findById(stateId);
  if (!state) {
    throw new NotFoundException(`State with ID ${stateId} not found`);
  }

  const country = await countriesService.findById(countryId);
  if (!country) {
    throw new NotFoundException(`Country with ID ${countryId} not found`);
  }

  if (state.countryId && state.countryId.toString() === countryId) {
    return;
  }

  if (state.country_id && country.id && state.country_id === country.id) {
    return;
  }

  const stateCountryCode = (state as { country_code?: string }).country_code;
  const countryCode =
    (country as { country_code?: string }).country_code ?? country.countryCode;
  if (stateCountryCode && countryCode && stateCountryCode === countryCode) {
    return;
  }

  throw new BadRequestException(
    `State with ID ${stateId} does not belong to country with ID ${countryId}`,
  );
}
