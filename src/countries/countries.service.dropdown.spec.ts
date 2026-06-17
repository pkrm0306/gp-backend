import { CountriesService } from './countries.service';

describe('CountriesService.buildDropdownOptions', () => {
  const service = new CountriesService(
    {
      find: () => ({
        sort: () => ({
          lean: () => ({
            exec: async () => [
              { _id: 'b', countryName: 'Brazil' },
              { _id: 'a', country_name: 'India' },
              { _id: 'c', name: 'United States' },
            ],
          }),
        }),
      }),
    } as never,
    { get: () => undefined } as never,
    { buildKey: () => 'k', get: async () => null, set: async () => {} } as never,
  );

  it('returns all countries sorted A–Z with value/label pairs', async () => {
    const options = await service.buildDropdownOptions();
    expect(options).toEqual([
      { value: 'b', label: 'Brazil' },
      { value: 'a', label: 'India' },
      { value: 'c', label: 'United States' },
    ]);
  });
});
