"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_design_strategies_validation_1 = require("./product-design-strategies.validation");
describe('product-design-strategies.validation', function () {
    it('allows empty or whitespace-only strategies', function () {
        expect((0, product_design_strategies_validation_1.getProductDesignStrategiesValidationError)('')).toBeNull();
        expect((0, product_design_strategies_validation_1.getProductDesignStrategiesValidationError)('   ')).toBeNull();
        expect((0, product_design_strategies_validation_1.getProductDesignStrategiesValidationError)(undefined)).toBeNull();
        expect(function () { return (0, product_design_strategies_validation_1.assertProductDesignStrategiesValid)(''); }).not.toThrow();
    });
    it('enforces min length when strategies text is provided', function () {
        expect((0, product_design_strategies_validation_1.getProductDesignStrategiesValidationError)('short')).toMatch(new RegExp("at least ".concat(product_design_strategies_validation_1.PRODUCT_DESIGN_STRATEGIES_MIN), 'i'));
    });
    it('enforces max length when strategies text is provided', function () {
        var tooLong = 'a'.repeat(product_design_strategies_validation_1.PRODUCT_DESIGN_STRATEGIES_MAX + 1);
        expect((0, product_design_strategies_validation_1.getProductDesignStrategiesValidationError)(tooLong)).toMatch(new RegExp("".concat(product_design_strategies_validation_1.PRODUCT_DESIGN_STRATEGIES_MAX), 'i'));
    });
    it('rejects HTML and script content', function () {
        expect((0, product_design_strategies_validation_1.getProductDesignStrategiesValidationError)('<b>bold strategy text long enough</b>')).toMatch(/HTML/i);
        expect((0, product_design_strategies_validation_1.getProductDesignStrategiesValidationError)('Valid prefix javascript:alert(1) with enough characters here')).toMatch(/Script|unsafe/i);
    });
    it('accepts valid strategies text', function () {
        expect((0, product_design_strategies_validation_1.getProductDesignStrategiesValidationError)('Valid organization-level eco-vision strategy with enough detail.')).toBeNull();
    });
    it('assertProductDesignStrategiesValid throws BadRequestException', function () {
        expect(function () { return (0, product_design_strategies_validation_1.assertProductDesignStrategiesValid)('tiny'); }).toThrow(/Strategies must be at least/i);
    });
});
