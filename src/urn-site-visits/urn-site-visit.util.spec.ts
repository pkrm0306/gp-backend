import { formatSiteVisitRecord } from './urn-site-visit.util';

describe('formatSiteVisitRecord', () => {
  it('omits postal code from API payload', () => {
    const formatted = formatSiteVisitRecord({
      _id: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      name: 'Plant A',
      addressLine1: 'Kadiri',
      addressLine2: '',
      city: 'Kadiri',
      state: 'Andhra Pradesh',
      postalCode: '515591',
      country: 'India',
      isDeleted: false,
    });

    expect(formatted).not.toHaveProperty('postalCode');
    expect(formatted).not.toHaveProperty('postal_code');
    expect(formatted.city).toBe('Kadiri');
    expect(formatted.country).toBe('India');
  });
});
