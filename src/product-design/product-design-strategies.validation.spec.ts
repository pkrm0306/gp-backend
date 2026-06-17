import {
  assertProductDesignStrategiesValid,
  getProductDesignStrategiesValidationError,
  PRODUCT_DESIGN_STRATEGIES_MAX,
  PRODUCT_DESIGN_STRATEGIES_MIN,
} from './product-design-strategies.validation';

describe('product-design-strategies.validation', () => {
  it('allows empty or whitespace-only strategies', () => {
    expect(getProductDesignStrategiesValidationError('')).toBeNull();
    expect(getProductDesignStrategiesValidationError('   ')).toBeNull();
    expect(getProductDesignStrategiesValidationError(undefined)).toBeNull();
    expect(() => assertProductDesignStrategiesValid('')).not.toThrow();
  });

  it('enforces min length when strategies text is provided', () => {
    expect(getProductDesignStrategiesValidationError('short')).toMatch(
      new RegExp(`at least ${PRODUCT_DESIGN_STRATEGIES_MIN}`, 'i'),
    );
  });

  it('enforces max length when strategies text is provided', () => {
    const tooLong = 'a'.repeat(PRODUCT_DESIGN_STRATEGIES_MAX + 1);
    expect(getProductDesignStrategiesValidationError(tooLong)).toMatch(
      new RegExp(`${PRODUCT_DESIGN_STRATEGIES_MAX}`, 'i'),
    );
  });

  it('rejects HTML and script content', () => {
    expect(
      getProductDesignStrategiesValidationError(
        '<b>bold strategy text long enough</b>',
      ),
    ).toMatch(/HTML/i);
    expect(
      getProductDesignStrategiesValidationError(
        'Valid prefix javascript:alert(1) with enough characters here',
      ),
    ).toMatch(/Script|unsafe/i);
  });

  it('accepts valid strategies text', () => {
    expect(
      getProductDesignStrategiesValidationError(
        'Valid organization-level eco-vision strategy with enough detail.',
      ),
    ).toBeNull();
  });

  it('assertProductDesignStrategiesValid throws BadRequestException', () => {
    expect(() => assertProductDesignStrategiesValid('tiny')).toThrow(
      /Strategies must be at least/i,
    );
  });
});
