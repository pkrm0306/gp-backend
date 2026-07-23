import { formatCertificatePlantLocation } from './certificate-plant-location.util';

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
});
