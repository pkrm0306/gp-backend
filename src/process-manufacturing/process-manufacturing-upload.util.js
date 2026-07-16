"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENERGY_CONSUMPTION_UPLOAD_FIELD_NAMES = exports.ENERGY_CONSERVATION_UPLOAD_FIELD_NAMES = exports.PROCESS_MANUFACTURING_EMPTY_FORM_MESSAGE = void 0;
exports.collectProcessManufacturingUploadFiles = collectProcessManufacturingUploadFiles;
exports.hasAtLeastOneProcessManufacturingFieldFilled = hasAtLeastOneProcessManufacturingFieldFilled;
exports.hasAtLeastOneProcessManufacturingContent = hasAtLeastOneProcessManufacturingContent;
exports.assertAtLeastOneProcessManufacturingField = assertAtLeastOneProcessManufacturingField;
var common_1 = require("@nestjs/common");
/** Vendor empty-form copy (shared with product design / raw materials). */
exports.PROCESS_MANUFACTURING_EMPTY_FORM_MESSAGE = 'Please fill in at least one field in the form before continuing.';
exports.ENERGY_CONSERVATION_UPLOAD_FIELD_NAMES = new Set([
    'energyConservationSupportingDocumentsFile',
    'energyConservationSupportingDocuments',
    'energyConservationSupportingDocument',
    'energyConservationSupportingDocumentFile',
    'energy_conservation_supporting_documents',
    'energyConservationFile',
    'energyConservationFiles',
]);
exports.ENERGY_CONSUMPTION_UPLOAD_FIELD_NAMES = new Set([
    'energyConsumptionDocumentsFile',
    'energyConsumptionDocuments',
    'energyConsumptionDocument',
    'energyConsumptionDocumentFile',
    'energy_consumption_documents',
    'energyConsumptionFile',
    'energyConsumptionFiles',
]);
function isValidUploadPart(file) {
    var _a, _b, _c;
    return Boolean((file === null || file === void 0 ? void 0 : file.originalname) ||
        ((_a = file === null || file === void 0 ? void 0 : file.size) !== null && _a !== void 0 ? _a : 0) > 0 ||
        ((_c = (_b = file === null || file === void 0 ? void 0 : file.buffer) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0);
}
function hasTrimmedText(value) {
    return String(value !== null && value !== void 0 ? value : '').trim() !== '';
}
function collectProcessManufacturingUploadFiles(files) {
    var _a;
    var energyConservationFiles = [];
    var energyConsumptionFiles = [];
    var legacyFiles = [];
    for (var _i = 0, _b = files !== null && files !== void 0 ? files : []; _i < _b.length; _i++) {
        var file = _b[_i];
        if (!isValidUploadPart(file))
            continue;
        var field = String((_a = file.fieldname) !== null && _a !== void 0 ? _a : 'files');
        if (exports.ENERGY_CONSERVATION_UPLOAD_FIELD_NAMES.has(field)) {
            energyConservationFiles.push(file);
        }
        else if (exports.ENERGY_CONSUMPTION_UPLOAD_FIELD_NAMES.has(field)) {
            energyConsumptionFiles.push(file);
        }
        else if (field === 'files') {
            legacyFiles.push(file);
        }
    }
    if (energyConservationFiles.length === 0 &&
        energyConsumptionFiles.length === 0 &&
        legacyFiles.length > 0) {
        energyConservationFiles.push.apply(energyConservationFiles, legacyFiles);
    }
    return { energyConservationFiles: energyConservationFiles, energyConsumptionFiles: energyConsumptionFiles };
}
function hasAtLeastOneProcessManufacturingFieldFilled(params) {
    if (params.energyConservationFiles.length > 0) {
        return true;
    }
    if (params.energyConsumptionFiles.length > 0) {
        return true;
    }
    if (hasTrimmedText(params.portableWaterDemand)) {
        return true;
    }
    if (hasTrimmedText(params.rainWaterHarvesting)) {
        return true;
    }
    if (hasTrimmedText(params.beyondTheFenceInitiatives)) {
        return true;
    }
    return params.totalEnergyConsumption !== undefined &&
        params.totalEnergyConsumption !== null
        ? true
        : false;
}
function hasAtLeastOneProcessManufacturingContent(params) {
    var _a;
    if (hasAtLeastOneProcessManufacturingFieldFilled({
        portableWaterDemand: params.portableWaterDemand,
        rainWaterHarvesting: params.rainWaterHarvesting,
        beyondTheFenceInitiatives: params.beyondTheFenceInitiatives,
        totalEnergyConsumption: params.totalEnergyConsumption,
        energyConservationFiles: params.energyConservationFiles,
        energyConsumptionFiles: params.energyConsumptionFiles,
    })) {
        return true;
    }
    return ((_a = params.retainedDocumentCount) !== null && _a !== void 0 ? _a : 0) > 0;
}
function assertAtLeastOneProcessManufacturingField(params) {
    if (!hasAtLeastOneProcessManufacturingContent({
        portableWaterDemand: params.portableWaterDemand,
        rainWaterHarvesting: params.rainWaterHarvesting,
        beyondTheFenceInitiatives: params.beyondTheFenceInitiatives,
        totalEnergyConsumption: params.totalEnergyConsumption,
        energyConservationFiles: params.energyConservationFiles,
        energyConsumptionFiles: params.energyConsumptionFiles,
        retainedDocumentCount: params.retainedDocumentCount,
    })) {
        throw new common_1.BadRequestException(exports.PROCESS_MANUFACTURING_EMPTY_FORM_MESSAGE);
    }
}
