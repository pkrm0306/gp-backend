import {
  coerceRawMaterialsNumeric,
  computeRawMaterialsYeardata3,
  filterMeaningfulRows,
  isMeaningfulFieldValue,
  mapRawMaterialsStandardGridUnitForSave,
  parseRawMaterialsUnitNumericInput,
  RAW_MATERIALS_AT_LEAST_ONE_MESSAGE,
  RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS,
  assertAtLeastOneRawMaterialsField,
  hasAnyMeaningfulRawMaterialsSavePayload,
  resolveRawMaterialsProductsPayload,
  withRawMaterialsNumericFields,
} from './raw-materials-upload.util';

describe('raw materials numeric zero handling', () => {
  it('treats numeric zero as meaningful for unit grid fields', () => {
    expect(isMeaningfulFieldValue(0, 'yeardata1')).toBe(true);
    expect(isMeaningfulFieldValue('0', 'year')).toBe(true);
    expect(isMeaningfulFieldValue(0)).toBe(true);
  });

  it('keeps rows that only contain explicit numeric zeros', () => {
    const rows = filterMeaningfulRows(
      [{ yeardata1: 0, yeardata2: '0' }],
      ['unitName', 'year', 'yeardata1', 'yeardata2'],
    );
    expect(rows).toHaveLength(1);
  });

  it('parses omitted fields as null and explicit zero as 0', () => {
    expect(parseRawMaterialsUnitNumericInput(undefined)).toBeNull();
    expect(parseRawMaterialsUnitNumericInput('')).toBeNull();
    expect(parseRawMaterialsUnitNumericInput(0)).toBe(0);
    expect(parseRawMaterialsUnitNumericInput('0')).toBe(0);
  });

  it('maps only provided unit fields on save', () => {
    const mapped = mapRawMaterialsStandardGridUnitForSave({
      unitName: 'Unit A',
      yeardata1: 0,
    });
    expect(mapped.yeardata1).toBe(0);
    expect(mapped.year).toBeNull();
    expect(mapped.unit1).toBeNull();
    expect(mapped.yeardata2).toBeNull();
    expect(mapped.yeardata3).toBeNull();
  });

  it('omits unset numeric fields from responses but keeps explicit zero', () => {
    const formatted = withRawMaterialsNumericFields(
      { unitName: 'Unit A', yeardata1: 0 } as Record<string, unknown>,
      RAW_MATERIALS_STANDARD_GRID_NUMERIC_KEYS,
    );
    expect(formatted.yeardata1).toBe(0);
    expect(formatted.yeardata2).toBeNull();
    expect(formatted.year).toBeNull();
  });

  it('preserves explicit zero through numeric coercion', () => {
    expect(coerceRawMaterialsNumeric(0)).toBe(0);
    expect(coerceRawMaterialsNumeric('0')).toBe(0);
  });

  it('computes yeardata3 only when both operands are provided', () => {
    expect(computeRawMaterialsYeardata3(null, 5)).toBeNull();
    expect(computeRawMaterialsYeardata3(10, null)).toBeNull();
    expect(computeRawMaterialsYeardata3(10, 5)).toBe(50);
    expect(computeRawMaterialsYeardata3(0, 5)).toBe(0);
  });

  it('allows save when any one product-table column is filled', () => {
    expect(() =>
      assertAtLeastOneRawMaterialsField({
        rows: [{ productsTestReportFileName: 'report-a.pdf' }],
      }),
    ).not.toThrow();
    expect(() =>
      assertAtLeastOneRawMaterialsField({
        body: { productsName: 'Widget' },
      }),
    ).not.toThrow();
    expect(() =>
      assertAtLeastOneRawMaterialsField({
        files: [{ originalname: 'doc.pdf' } as Express.Multer.File],
      }),
    ).not.toThrow();
    expect(() => assertAtLeastOneRawMaterialsField({})).toThrow(
      RAW_MATERIALS_AT_LEAST_ONE_MESSAGE,
    );
  });

  it('resolves legacy top-level product fields when products array is empty', () => {
    const rows = resolveRawMaterialsProductsPayload({
      urnNo: 'URN-1',
      products: '[]',
      productsTestReport: 'report-a.pdf',
    });
    expect(rows).toHaveLength(1);
    expect(
      hasAnyMeaningfulRawMaterialsSavePayload({
        urnNo: 'URN-1',
        products: '[]',
        productsTestReport: 'report-a.pdf',
      }),
    ).toBe(true);
  });

  it('treats prohibitedFlameSolventsFileName as a partial product row field', () => {
    expect(
      hasAnyMeaningfulRawMaterialsSavePayload({
        urnNo: 'URN-1',
        products: '[]',
        prohibitedFlameSolventsFileName: 'report-a.pdf',
      }),
    ).toBe(true);
  });
});
