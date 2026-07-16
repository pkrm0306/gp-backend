"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var raw_materials_upload_util_1 = require("./raw-materials-upload.util");
var raw_materials_upload_util_2 = require("./raw-materials-upload.util");
var ROW_KEYS = [
    'location',
    'enhancementOfMinesLife',
    'topsoilConservation',
    'waterTableManagement',
    'restorationOfSpentMines',
    'greenBeltDevelopmentAndBioDiversity',
];
describe('reduce environmental units resolve', function () {
    it('treats explicit units[] as full snapshot (may be empty)', function () {
        expect((0, raw_materials_upload_util_1.hasExplicitReduceEnvironmentalArray)({ urnNo: 'U', units: '[]' })).toBe(true);
        expect((0, raw_materials_upload_util_1.resolveReduceEnvironmentalUnits)({ units: '[]' }, ROW_KEYS)).toEqual([]);
    });
    it('falls back to top-level fields when units array is empty', function () {
        var rows = (0, raw_materials_upload_util_1.resolveReduceEnvironmentalUnits)({
            units: '[]',
            enhancementOfMinesLife: 'Mine life plan',
        }, ROW_KEYS);
        expect(rows).toHaveLength(1);
        expect(rows[0].enhancementOfMinesLife).toBe('Mine life plan');
    });
    it('accepts snake_case mine row fields', function () {
        var rows = (0, raw_materials_upload_util_1.resolveReduceEnvironmentalUnits)({
            units: JSON.stringify([{ topsoil_conservation: 'Conserved topsoil' }]),
        }, ROW_KEYS);
        expect(rows).toHaveLength(1);
        expect(rows[0].topsoilConservation).toBe('Conserved topsoil');
    });
    it('allows partial save with document label or any one mine column', function () {
        expect((0, raw_materials_upload_util_1.hasAnyMeaningfulReduceEnvironmentalSavePayload)({
            urnNo: 'URN-1',
            units: '[]',
            waterTableManagement: 'x',
        })).toBe(true);
        expect((0, raw_materials_upload_util_1.hasAnyMeaningfulReduceEnvironmentalSavePayload)({
            urnNo: 'URN-1',
            reduceEnvironmentalFileName: 'supporting-doc.pdf',
        })).toBe(true);
        expect(function () {
            return (0, raw_materials_upload_util_1.assertAtLeastOneRawMaterialsField)({
                body: {
                    urnNo: 'URN-1',
                    units: '[]',
                    restorationOfSpentMines: 'Plan',
                },
            });
        }).not.toThrow();
        expect(function () {
            return (0, raw_materials_upload_util_1.assertAtLeastOneRawMaterialsField)({ body: { urnNo: 'URN-1' } });
        }).toThrow(raw_materials_upload_util_2.RAW_MATERIALS_AT_LEAST_ONE_MESSAGE);
    });
    it('parses units JSON array with multiple mines', function () {
        var units = JSON.stringify([
            { location: 'Mine A', topsoilConservation: 'x' },
            { location: 'Mine B' },
        ]);
        expect((0, raw_materials_upload_util_1.resolveReduceEnvironmentalUnits)({ units: units }, ROW_KEYS)).toHaveLength(2);
    });
    it('prefers units over mines when both sent', function () {
        var units = JSON.stringify([{ location: 'From units' }]);
        var mines = JSON.stringify([{ location: 'From mines' }]);
        var rows = (0, raw_materials_upload_util_1.resolveReduceEnvironmentalUnits)({ units: units, mines: mines }, ROW_KEYS);
        expect(rows[0].location).toBe('From units');
    });
    it('legacy flat row when no array', function () {
        var rows = (0, raw_materials_upload_util_1.resolveReduceEnvironmentalUnits)({ location: 'Solo mine', enhancementOfMinesLife: 'a' }, ROW_KEYS);
        expect(rows).toHaveLength(1);
        expect(rows[0].location).toBe('Solo mine');
    });
    it('replaceTable on first legacy row', function () {
        expect((0, raw_materials_upload_util_1.shouldReplaceRawMaterialsTableBeforeInsert)({ replaceTable: 'true' })).toBe(true);
        expect((0, raw_materials_upload_util_1.shouldReplaceRawMaterialsTableBeforeInsert)({ rowIndex: '0', totalRows: '3' })).toBe(true);
        expect((0, raw_materials_upload_util_1.shouldReplaceRawMaterialsTableBeforeInsert)({ rowIndex: '1', totalRows: '3' })).toBe(false);
    });
});
