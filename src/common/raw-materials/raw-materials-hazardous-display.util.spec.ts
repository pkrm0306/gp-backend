import {
  filterHazardousProductsForVendorDisplay,
  isHazardousProductRowForVendorDisplay,
} from './raw-materials-hazardous-display.util';

describe('raw-materials-hazardous-display.util', () => {
  it('includes row with only productsTestReport', () => {
    expect(
      isHazardousProductRowForVendorDisplay({
        productsName: '',
        productsTestReport: 'report-a.pdf',
      }),
    ).toBe(true);
  });

  it('includes row with only productsName', () => {
    expect(
      isHazardousProductRowForVendorDisplay({
        productsName: 'Widget',
        productsTestReport: '',
      }),
    ).toBe(true);
  });

  it('excludes fully empty row', () => {
    expect(
      isHazardousProductRowForVendorDisplay({
        productsName: '',
        productsTestReport: '',
      }),
    ).toBe(false);
  });

  it('filters empty rows from list', () => {
    const filtered = filterHazardousProductsForVendorDisplay([
      { productsName: 'A', productsTestReport: '' },
      { productsName: '', productsTestReport: '' },
    ]);
    expect(filtered).toHaveLength(1);
  });
});
