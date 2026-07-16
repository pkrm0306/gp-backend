"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process_manufacturing_upload_util_1 = require("./process-manufacturing-upload.util");
describe('process manufacturing upload util', function () {
    it('collects conservation and consumption files by field name', function () {
        var files = [
            {
                fieldname: 'energyConservationSupportingDocumentsFile',
                originalname: 'a.pdf',
            },
            {
                fieldname: 'energyConsumptionDocumentsFile',
                originalname: 'b.pdf',
            },
        ];
        var collected = (0, process_manufacturing_upload_util_1.collectProcessManufacturingUploadFiles)(files);
        expect(collected.energyConservationFiles).toHaveLength(1);
        expect(collected.energyConsumptionFiles).toHaveLength(1);
    });
    it('blocks empty manufacturing save', function () {
        expect(function () {
            return (0, process_manufacturing_upload_util_1.assertAtLeastOneProcessManufacturingField)({
                portableWaterDemand: '',
                rainWaterHarvesting: '',
                beyondTheFenceInitiatives: '',
                totalEnergyConsumption: undefined,
                energyConservationFiles: [],
                energyConsumptionFiles: [],
                retainedDocumentCount: 0,
            });
        }).toThrow(process_manufacturing_upload_util_1.PROCESS_MANUFACTURING_EMPTY_FORM_MESSAGE);
    });
    it('allows save with one text field', function () {
        expect((0, process_manufacturing_upload_util_1.hasAtLeastOneProcessManufacturingContent)({
            portableWaterDemand: 'Water plan',
            energyConservationFiles: [],
            energyConsumptionFiles: [],
        })).toBe(true);
    });
    it('allows save with explicit zero total energy consumption', function () {
        expect((0, process_manufacturing_upload_util_1.hasAtLeastOneProcessManufacturingContent)({
            totalEnergyConsumption: 0,
            energyConservationFiles: [],
            energyConsumptionFiles: [],
        })).toBe(true);
    });
    it('allows save with uploaded document only', function () {
        expect((0, process_manufacturing_upload_util_1.hasAtLeastOneProcessManufacturingContent)({
            energyConservationFiles: [
                { originalname: 'doc.pdf' },
            ],
            energyConsumptionFiles: [],
        })).toBe(true);
    });
    it('allows save when retained documents exist on URN', function () {
        expect((0, process_manufacturing_upload_util_1.hasAtLeastOneProcessManufacturingContent)({
            energyConservationFiles: [],
            energyConsumptionFiles: [],
            retainedDocumentCount: 2,
        })).toBe(true);
    });
});
