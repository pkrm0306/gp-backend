"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var eoi_sequence_helper_1 = require("./eoi-sequence.helper");
describe('eoi-sequence.helper', function () {
    describe('parseEoiSequenceSuffix', function () {
        it('parses last 3 digits', function () {
            expect((0, eoi_sequence_helper_1.parseEoiSequenceSuffix)('GPPMI003004')).toBe(4);
            expect((0, eoi_sequence_helper_1.parseEoiSequenceSuffix)('GPPMI003001')).toBe(1);
        });
        it('returns null for invalid suffix', function () {
            expect((0, eoi_sequence_helper_1.parseEoiSequenceSuffix)('GPPMI00X')).toBeNull();
            expect((0, eoi_sequence_helper_1.parseEoiSequenceSuffix)('')).toBeNull();
        });
    });
    describe('compareProductsForResequence', function () {
        it('orders by sequence suffix', function () {
            var products = [
                { eoiNo: 'GPPMI003003', createdDate: new Date('2024-01-03') },
                { eoiNo: 'GPPMI003001', createdDate: new Date('2024-01-01') },
                { eoiNo: 'GPPMI003002', createdDate: new Date('2024-01-02') },
            ];
            var sorted = __spreadArray([], products, true).sort(eoi_sequence_helper_1.compareProductsForResequence);
            expect(sorted.map(function (p) { return p.eoiNo; })).toEqual([
                'GPPMI003001',
                'GPPMI003002',
                'GPPMI003003',
            ]);
        });
    });
    describe('findDuplicateEoiSequenceSuffixes', function () {
        it('detects duplicate suffixes', function () {
            var dupes = (0, eoi_sequence_helper_1.findDuplicateEoiSequenceSuffixes)([
                { eoiNo: 'GPPMI003002' },
                { eoiNo: 'GPPMI003002' },
                { eoiNo: 'GPPMI003001' },
            ]);
            expect(dupes).toEqual([2]);
        });
    });
});
