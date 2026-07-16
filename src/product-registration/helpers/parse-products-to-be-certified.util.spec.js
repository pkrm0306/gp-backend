"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var parse_products_to_be_certified_util_1 = require("./parse-products-to-be-certified.util");
describe('parseProductsToBeCertified', function () {
    it('parses JSON array of product ids', function () {
        var result = (0, parse_products_to_be_certified_util_1.parseProductsToBeCertified)('[101, 102]');
        expect(result.productIds).toEqual([101, 102]);
        expect(result.mongoIds).toHaveLength(0);
    });
    it('parses comma-separated ids', function () {
        var result = (0, parse_products_to_be_certified_util_1.parseProductsToBeCertified)('5, 7, 7');
        expect(result.productIds).toEqual([5, 7]);
    });
    it('parses ObjectId strings', function () {
        var id = new mongoose_1.Types.ObjectId();
        var result = (0, parse_products_to_be_certified_util_1.parseProductsToBeCertified)(JSON.stringify([id.toString()]));
        expect(result.mongoIds).toHaveLength(1);
        expect(result.mongoIds[0].toString()).toBe(id.toString());
    });
    it('returns empty for blank input', function () {
        expect((0, parse_products_to_be_certified_util_1.parseProductsToBeCertified)('')).toEqual({
            productIds: [],
            mongoIds: [],
        });
    });
    it('does not resolve product names as IDs', function () {
        var ids = (0, parse_products_to_be_certified_util_1.resolveProductIdsFromCertifiedField)('test pikk', [
            { productId: 42 },
            { productId: 43 },
        ]);
        expect(ids).toEqual([]);
    });
    it('formats product id array for API storage', function () {
        expect((0, parse_products_to_be_certified_util_1.formatProductsToBeCertified)([42, 42, 7])).toBe('[42,7]');
    });
    it('reports validation error for free text', function () {
        expect((0, parse_products_to_be_certified_util_1.getProductsToBeCertifiedValidationError)('test plkk')).toContain('productId');
    });
    it('normalizes storage to JSON productId array', function () {
        expect((0, parse_products_to_be_certified_util_1.normalizeProductsToBeCertifiedStorage)('101, 102')).toBe('[101,102]');
    });
});
