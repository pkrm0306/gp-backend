import {
  finalizeCertificatePreviewLocation,
  formatCertificatePlantLocation,
  INDIA_COUNTRY_MONGO_ID,
  isIndiaCountry,
} from './certificate-plant-location.util';

describe('formatCertificatePlantLocation', () => {
  it('puts additional plant info before city and state', () => {
    expect(
      formatCertificatePlantLocation({
        additionalPlantInfo: 'Unit 2',
        city: 'Mumbai',
        stateName: 'Maharashtra',
      }),
    ).toBe('Unit 2, Mumbai, Maharashtra');
  });

  it('omits empty additional info', () => {
    expect(
      formatCertificatePlantLocation({
        city: 'Mumbai',
        stateName: 'Maharashtra',
      }),
    ).toBe('Mumbai, Maharashtra');
  });

  it('keeps city when state missing', () => {
    expect(
      formatCertificatePlantLocation({
        city: 'Mumbai',
      }),
    ).toBe('Mumbai');
  });

  it('does not prefer plantLocation over city/state', () => {
    expect(
      formatCertificatePlantLocation({
        plantLocation: 'Legacy Only',
        city: 'Mumbai',
        stateName: 'Maharashtra',
      }),
    ).toBe('Mumbai, Maharashtra');
  });

  it('falls back to plantLocation when structured fields empty', () => {
    expect(
      formatCertificatePlantLocation({
        plantLocation: 'Legacy Plant Yard',
      }),
    ).toBe('Legacy Plant Yard');
  });

  it('dedupes identical consecutive parts', () => {
    expect(
      formatCertificatePlantLocation({
        additionalPlantInfo: 'Mumbai',
        city: 'Mumbai',
        stateName: 'Maharashtra',
      }),
    ).toBe('Mumbai, Maharashtra');
  });

  it('formats Unit A, Pune, Maharashtra style locations', () => {
    expect(
      formatCertificatePlantLocation({
        additionalPlantInfo: 'Unit A',
        city: 'Pune',
        stateName: 'Maharashtra',
      }),
    ).toBe('Unit A, Pune, Maharashtra');
  });

  it('shows city and country for international plants, not street address', () => {
    expect(
      formatCertificatePlantLocation({
        plantLocation: 'test address',
        city: 'Carlow',
        stateName: 'Carlow',
        countryName: 'Ireland',
        countryId: '6998547b14999ba875c7d71a',
      }),
    ).toBe('Carlow, Ireland');
  });

  it('uses state as locality when city missing on non-India plants', () => {
    expect(
      formatCertificatePlantLocation({
        plantLocation: 'test address',
        stateName: 'Carlow',
        countryName: 'Ireland',
        countryId: '6998547b14999ba875c7d71a',
      }),
    ).toBe('Carlow, Ireland');
  });
});

describe('finalizeCertificatePreviewLocation', () => {
  it('does not replace city when location already includes country', () => {
    expect(
      finalizeCertificatePreviewLocation('carlow, Ireland', {
        countryName: 'Ireland',
        stateName: 'Carlow',
        countryId: '6998547b14999ba875c7d71a',
      }),
    ).toBe('carlow, Ireland');
  });

  it('still replaces state in legacy location strings without country', () => {
    expect(
      finalizeCertificatePreviewLocation('Munich, Bavaria', {
        countryName: 'Germany',
        stateName: 'Bavaria',
      }),
    ).toBe('Munich, Germany');
  });
});

describe('isIndiaCountry', () => {
  it('detects India by Mongo country id', () => {
    expect(isIndiaCountry(undefined, INDIA_COUNTRY_MONGO_ID)).toBe(true);
    expect(isIndiaCountry('Ireland', '6998547b14999ba875c7d71a')).toBe(false);
  });
});
