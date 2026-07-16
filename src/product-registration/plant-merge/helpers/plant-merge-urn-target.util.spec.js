"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var plant_merge_urn_target_util_1 = require("./plant-merge-urn-target.util");
describe('plant-merge-urn-target.util', function () {
    var manufacturerId = new mongoose_1.Types.ObjectId();
    var categoryId = new mongoose_1.Types.ObjectId();
    it('normalizes product name by trimming whitespace', function () {
        expect((0, plant_merge_urn_target_util_1.normalizeProductNameKey)('  Cement Board  ')).toBe('Cement Board');
    });
    it('picks the oldest certified product on a different URN', function () {
        var source = {
            _id: new mongoose_1.Types.ObjectId(),
            productId: 1,
            productName: 'Cement Board',
            eoiNo: 'GP001',
            urnNo: 'URN-SOURCE',
            manufacturerId: manufacturerId,
            categoryId: categoryId,
            productStatus: 2,
            certifiedDate: new Date('2024-06-01'),
            createdDate: new Date('2024-01-01'),
        };
        var target = (0, plant_merge_urn_target_util_1.findOldestMatchingCertifiedTarget)(source, [
            {
                urnNo: 'URN-NEWER',
                eoiNo: 'GP010',
                productName: 'Cement Board',
                manufacturerId: manufacturerId,
                categoryId: categoryId,
                certifiedDate: new Date('2024-05-01'),
                createdDate: new Date('2024-02-01'),
            },
            {
                urnNo: 'URN-OLDEST',
                eoiNo: 'GP002',
                productName: 'Cement Board',
                manufacturerId: manufacturerId,
                categoryId: categoryId,
                certifiedDate: new Date('2023-01-01'),
                createdDate: new Date('2023-01-01'),
            },
        ], 'URN-SOURCE');
        expect(target === null || target === void 0 ? void 0 : target.urnNo).toBe('URN-OLDEST');
        expect(target === null || target === void 0 ? void 0 : target.eoiNo).toBe('GP002');
    });
    it('ignores targets that are not older than source', function () {
        var source = {
            _id: new mongoose_1.Types.ObjectId(),
            productId: 1,
            productName: 'Tile',
            eoiNo: 'GP001',
            urnNo: 'URN-SOURCE',
            manufacturerId: manufacturerId,
            categoryId: categoryId,
            productStatus: 2,
            certifiedDate: new Date('2020-01-01'),
            createdDate: new Date('2020-01-01'),
        };
        var target = (0, plant_merge_urn_target_util_1.findOldestMatchingCertifiedTarget)(source, [
            {
                urnNo: 'URN-NEWER',
                eoiNo: 'GP099',
                productName: 'Tile',
                manufacturerId: manufacturerId,
                categoryId: categoryId,
                certifiedDate: new Date('2024-01-01'),
                createdDate: new Date('2024-01-01'),
            },
        ], 'URN-SOURCE');
        expect(target).toBeNull();
    });
    it('ignores products on the source URN', function () {
        var source = {
            _id: new mongoose_1.Types.ObjectId(),
            productId: 1,
            productName: 'Tile',
            eoiNo: 'GP001',
            urnNo: 'URN-SOURCE',
            manufacturerId: manufacturerId,
            categoryId: categoryId,
            productStatus: 2,
            createdDate: new Date('2024-01-01'),
        };
        var target = (0, plant_merge_urn_target_util_1.findOldestMatchingCertifiedTarget)(source, [
            {
                urnNo: 'URN-SOURCE',
                eoiNo: 'GP099',
                productName: 'Tile',
                manufacturerId: manufacturerId,
                categoryId: categoryId,
                createdDate: new Date('2020-01-01'),
            },
        ], 'URN-SOURCE');
        expect(target).toBeNull();
    });
    it('sorts by createdDate when certifiedDate is missing', function () {
        expect((0, plant_merge_urn_target_util_1.compareCertifiedProductAge)({ createdDate: new Date('2020-01-01') }, { createdDate: new Date('2021-01-01') })).toBeLessThan(0);
    });
    it('returns null for brand-new source when only newer certified matches exist', function () {
        var source = {
            _id: new mongoose_1.Types.ObjectId(),
            productId: 1,
            productName: 'New Product',
            eoiNo: 'GP001',
            urnNo: 'URN-SOURCE',
            manufacturerId: manufacturerId,
            categoryId: categoryId,
            productStatus: 2,
            certifiedDate: new Date('2025-01-01'),
            createdDate: new Date('2025-01-01'),
        };
        var target = (0, plant_merge_urn_target_util_1.findOldestMatchingCertifiedTarget)(source, [
            {
                urnNo: 'URN-OTHER',
                eoiNo: 'GP050',
                productName: 'New Product',
                manufacturerId: manufacturerId,
                categoryId: categoryId,
                certifiedDate: new Date('2025-06-01'),
                createdDate: new Date('2025-06-01'),
            },
        ], 'URN-SOURCE');
        expect(target).toBeNull();
    });
    it('detects newer-only matches for brand-new source products', function () {
        var source = {
            _id: new mongoose_1.Types.ObjectId(),
            productId: 2,
            productName: 'New Product',
            eoiNo: 'GP001',
            urnNo: 'URN-SOURCE',
            manufacturerId: manufacturerId,
            categoryId: categoryId,
            productStatus: 2,
            certifiedDate: new Date('2025-01-01'),
            createdDate: new Date('2025-01-01'),
        };
        expect((0, plant_merge_urn_target_util_1.hasNewerMatchingCertifiedCandidate)(source, [
            {
                urnNo: 'URN-OTHER',
                eoiNo: 'GP050',
                productName: 'New Product',
                manufacturerId: manufacturerId,
                categoryId: categoryId,
                certifiedDate: new Date('2025-06-01'),
                createdDate: new Date('2025-06-01'),
            },
        ], 'URN-SOURCE')).toBe(true);
    });
});
