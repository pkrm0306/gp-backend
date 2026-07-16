"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RENEW_CLEARED_CERT_SECTIONS = void 0;
exports.buildRenewDocumentsQueryFilter = buildRenewDocumentsQueryFilter;
exports.dedupeRenewDocuments = dedupeRenewDocuments;
exports.mergeRenewDocumentSources = mergeRenewDocumentSources;
exports.mapRenewDocument = mapRenewDocument;
exports.formatRenewProductPerformance = formatRenewProductPerformance;
exports.resolveRenewPerformanceTestReportRows = resolveRenewPerformanceTestReportRows;
exports.formatRenewManufacturing = formatRenewManufacturing;
exports.formatRenewWasteManagement = formatRenewWasteManagement;
exports.formatRenewInnovation = formatRenewInnovation;
exports.formatRenewProductStewardship = formatRenewProductStewardship;
exports.formatRenewComments = formatRenewComments;
exports.formatRenewMpManufacturingUnitForDetails = formatRenewMpManufacturingUnitForDetails;
exports.formatRenewWmManufacturingUnitForDetails = formatRenewWmManufacturingUnitForDetails;
exports.mapRenewMpManufacturingUnit = mapRenewMpManufacturingUnit;
exports.mapRenewWmManufacturingUnit = mapRenewWmManufacturingUnit;
exports.filterRenewDocuments = filterRenewDocuments;
exports.buildManufacturingSection = buildManufacturingSection;
exports.buildInnovationSection = buildInnovationSection;
exports.buildWasteSection = buildWasteSection;
exports.buildStewardshipSection = buildStewardshipSection;
exports.spreadProductPerformanceToDetailRows = spreadProductPerformanceToDetailRows;
exports.buildPerformanceSection = buildPerformanceSection;
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
/** Mongo filter for renew uploads on a URN. */
function buildRenewDocumentsQueryFilter(urnNo, renewalCycleId, options) {
    var trimmed = urnNo.trim();
    var base = {
        urnNo: trimmed,
        isDeleted: { $ne: true },
    };
    if (renewalCycleId == null || String(renewalCycleId).trim() === '') {
        return base;
    }
    if (options === null || options === void 0 ? void 0 : options.strictCycleOnly) {
        return __assign(__assign({}, base), { renewalCycleId: renewalCycleId });
    }
    return __assign(__assign({}, base), { $or: [
            { renewalCycleId: renewalCycleId },
            { renewalCycleId: null },
            { renewalCycleId: { $exists: false } },
        ] });
}
function dedupeRenewDocuments(sources) {
    var _a, _b, _c;
    var seen = new Set();
    var out = [];
    for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var source = sources_1[_i];
        if (!source)
            continue;
        var id = String((_c = (_b = (_a = source.productDocumentId) !== null && _a !== void 0 ? _a : source._id) !== null && _b !== void 0 ? _b : source.documentLink) !== null && _c !== void 0 ? _c : '');
        if (!id || seen.has(id))
            continue;
        seen.add(id);
        out.push(mapRenewDocument(source));
    }
    return out;
}
/** Merge DB rows + section-specific arrays into one list for quick-view / details. */
function mergeRenewDocumentSources() {
    var groups = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        groups[_i] = arguments[_i];
    }
    var flat = [];
    for (var _a = 0, groups_1 = groups; _a < groups_1.length; _a++) {
        var group = groups_1[_a];
        if (!Array.isArray(group))
            continue;
        for (var _b = 0, group_1 = group; _b < group_1.length; _b++) {
            var entry = group_1[_b];
            if (entry && typeof entry === 'object') {
                flat.push(entry);
            }
        }
    }
    return dedupeRenewDocuments(flat);
}
function mapRenewDocument(doc) {
    return {
        _id: doc._id,
        productDocumentId: doc.productDocumentId,
        vendorId: doc.vendorId,
        manufacturerId: doc.manufacturerId,
        urnNo: doc.urnNo,
        eoiNo: doc.eoiNo,
        renewalCycleId: doc.renewalCycleId,
        documentForm: doc.documentForm,
        documentFormSubsection: doc.documentFormSubsection,
        formPrimaryId: doc.formPrimaryId,
        documentName: doc.documentName,
        documentOriginalName: doc.documentOriginalName,
        documentLink: doc.documentLink,
        documentTag: doc.documentTag,
        createdDate: doc.createdDate,
        updatedDate: doc.updatedDate,
    };
}
function formatRenewProductPerformance(header, testReportRows) {
    var _a, _b, _c, _d;
    var resolvedRows = resolveRenewPerformanceTestReportRows(header, testReportRows);
    if (!header && resolvedRows.length === 0) {
        return null;
    }
    var testReports = resolvedRows.map(function (r) {
        var _a, _b, _c;
        return ({
            _id: r._id,
            productPerformanceTestReportId: (_a = r.processRenewProductPerformanceTestReportId) !== null && _a !== void 0 ? _a : r.productPerformanceTestReportId,
            productName: String((_b = r.productName) !== null && _b !== void 0 ? _b : ''),
            testReportFileName: String((_c = r.testReportFileName) !== null && _c !== void 0 ? _c : ''),
            eoiNo: r.eoiNo,
        });
    });
    return {
        _id: header === null || header === void 0 ? void 0 : header._id,
        processProductPerformanceId: (_a = header === null || header === void 0 ? void 0 : header.processRenewProductPerformanceId) !== null && _a !== void 0 ? _a : header === null || header === void 0 ? void 0 : header.processProductPerformanceId,
        urnNo: header === null || header === void 0 ? void 0 : header.urnNo,
        vendorId: header === null || header === void 0 ? void 0 : header.vendorId,
        manufacturerId: header === null || header === void 0 ? void 0 : header.manufacturerId,
        renewalCycleId: header === null || header === void 0 ? void 0 : header.renewalCycleId,
        testReportFiles: Math.max(Number((_b = header === null || header === void 0 ? void 0 : header.testReportFiles) !== null && _b !== void 0 ? _b : 0), testReports.length),
        testReports: testReports,
        renewalType: (_c = header === null || header === void 0 ? void 0 : header.renewalType) !== null && _c !== void 0 ? _c : 0,
        productPerformanceStatus: (_d = header === null || header === void 0 ? void 0 : header.productPerformanceStatus) !== null && _d !== void 0 ? _d : 0,
        createdDate: header === null || header === void 0 ? void 0 : header.createdDate,
        updatedDate: header === null || header === void 0 ? void 0 : header.updatedDate,
    };
}
/** Child table first; fall back to embedded header.testReports (legacy saves). */
function resolveRenewPerformanceTestReportRows(header, childRows) {
    if (childRows.length > 0) {
        return childRows;
    }
    var embedded = Array.isArray(header === null || header === void 0 ? void 0 : header.testReports)
        ? header.testReports
        : [];
    if (embedded.length === 0) {
        return [];
    }
    return embedded
        .map(function (entry, index) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var productName = String((_a = entry.productName) !== null && _a !== void 0 ? _a : '').trim();
        var testReportFileName = String((_b = entry.testReportFileName) !== null && _b !== void 0 ? _b : '').trim();
        if (!productName && !testReportFileName) {
            return null;
        }
        return {
            _id: entry._id,
            processRenewProductPerformanceTestReportId: (_d = (_c = entry.processRenewProductPerformanceTestReportId) !== null && _c !== void 0 ? _c : entry.productPerformanceTestReportId) !== null && _d !== void 0 ? _d : index + 1,
            productPerformanceTestReportId: (_f = (_e = entry.processRenewProductPerformanceTestReportId) !== null && _e !== void 0 ? _e : entry.productPerformanceTestReportId) !== null && _f !== void 0 ? _f : index + 1,
            urnNo: header === null || header === void 0 ? void 0 : header.urnNo,
            eoiNo: entry.eoiNo ? String(entry.eoiNo).trim() : undefined,
            productName: productName,
            testReportFileName: testReportFileName,
            createdDate: (_g = entry.createdDate) !== null && _g !== void 0 ? _g : header === null || header === void 0 ? void 0 : header.createdDate,
            updatedDate: (_h = entry.updatedDate) !== null && _h !== void 0 ? _h : header === null || header === void 0 ? void 0 : header.updatedDate,
        };
    })
        .filter(function (row) { return row !== null; });
}
function formatRenewManufacturing(raw) {
    var _a;
    if (!raw) {
        return null;
    }
    return {
        _id: raw._id,
        processManufacturingId: (_a = raw.processRenewManufacturingId) !== null && _a !== void 0 ? _a : raw.processManufacturingId,
        vendorId: raw.vendorId,
        manufacturerId: raw.manufacturerId,
        urnNo: raw.urnNo,
        energyConservationSupportingDocuments: raw.energyConservationSupportingDocuments,
        portableWaterDemand: raw.portableWaterDemand,
        rainWaterHarvesting: raw.rainWaterHarvesting,
        beyondTheFenceInitiatives: raw.beyondTheFenceInitiatives,
        totalEnergyConsumption: raw.totalEnergyConsumption,
        energyConsumptionDocuments: raw.energyConsumptionDocuments,
        processManufacturingStatus: raw.processManufacturingStatus,
        createdDate: raw.createdDate,
        updatedDate: raw.updatedDate,
    };
}
function formatRenewWasteManagement(raw) {
    var _a;
    if (!raw) {
        return null;
    }
    return {
        _id: raw._id,
        processWasteManagementId: (_a = raw.processRenewWasteManagementId) !== null && _a !== void 0 ? _a : raw.processWasteManagementId,
        vendorId: raw.vendorId,
        manufacturerId: raw.manufacturerId,
        urnNo: raw.urnNo,
        wmImplementationDetails: raw.wmImplementationDetails,
        wmSupportingDocuments: raw.wmSupportingDocuments,
        processWasteManagementStatus: raw.processWasteManagementStatus,
        createdDate: raw.createdDate,
        updatedDate: raw.updatedDate,
    };
}
function formatRenewInnovation(raw) {
    var _a;
    if (!raw) {
        return null;
    }
    return {
        _id: raw._id,
        processInnovationId: (_a = raw.processRenewInnovationId) !== null && _a !== void 0 ? _a : raw.processInnovationId,
        vendorId: raw.vendorId,
        manufacturerId: raw.manufacturerId,
        urnNo: raw.urnNo,
        innovationImplementationDetails: raw.innovationImplementationDetails,
        innovationImplementationDocuments: raw.innovationImplementationDocuments,
        processInnovationStatus: raw.processInnovationStatus,
        createdDate: raw.createdDate,
        updatedDate: raw.updatedDate,
    };
}
function formatRenewProductStewardship(raw, stakeholderRows) {
    var _a, _b, _c, _d, _e;
    if (stakeholderRows === void 0) { stakeholderRows = []; }
    if (!raw && stakeholderRows.length === 0) {
        return null;
    }
    return {
        _id: raw === null || raw === void 0 ? void 0 : raw._id,
        processProductStewardshipId: (_a = raw === null || raw === void 0 ? void 0 : raw.processRenewProductStewardshipId) !== null && _a !== void 0 ? _a : raw === null || raw === void 0 ? void 0 : raw.processProductStewardshipId,
        vendorId: raw === null || raw === void 0 ? void 0 : raw.vendorId,
        manufacturerId: raw === null || raw === void 0 ? void 0 : raw.manufacturerId,
        urnNo: raw === null || raw === void 0 ? void 0 : raw.urnNo,
        seaSupportingDocuments: (_b = raw === null || raw === void 0 ? void 0 : raw.seaSupportingDocuments) !== null && _b !== void 0 ? _b : 0,
        qualityManagementDetails: raw === null || raw === void 0 ? void 0 : raw.qualityManagementDetails,
        qmSupportingDocuments: (_c = raw === null || raw === void 0 ? void 0 : raw.qmSupportingDocuments) !== null && _c !== void 0 ? _c : 0,
        eprImplementedDetails: raw === null || raw === void 0 ? void 0 : raw.eprImplementedDetails,
        eprGreenPackagingDetails: raw === null || raw === void 0 ? void 0 : raw.eprGreenPackagingDetails,
        eprSupportingDocuments: (_d = raw === null || raw === void 0 ? void 0 : raw.eprSupportingDocuments) !== null && _d !== void 0 ? _d : 0,
        productStewardshipStatus: (_e = raw === null || raw === void 0 ? void 0 : raw.productStewardshipStatus) !== null && _e !== void 0 ? _e : 0,
        programmeDetails: stakeholderRows.map(function (row) {
            var _a, _b, _c, _d;
            return ({
                _id: row._id,
                programmeDetails: (_a = row.seaProgramDetails) !== null && _a !== void 0 ? _a : '',
                numberOfPrograms: (_b = row.seaNoOfPrograms) !== null && _b !== void 0 ? _b : '',
                seaSupportingDocuments: Number((_c = row.seaSupportingDocuments) !== null && _c !== void 0 ? _c : 0),
                productStewardshipStatus: Number((_d = row.productStewardshipStatus) !== null && _d !== void 0 ? _d : 0),
                createdDate: row.createdDate,
                updatedDate: row.updatedDate,
            });
        }),
        createdDate: raw === null || raw === void 0 ? void 0 : raw.createdDate,
        updatedDate: raw === null || raw === void 0 ? void 0 : raw.updatedDate,
    };
}
function formatRenewComments(raw) {
    var _a;
    if (!raw) {
        return null;
    }
    return __assign(__assign({}, raw), { _id: raw._id, processCommentsId: (_a = raw.processRenewCommentsId) !== null && _a !== void 0 ? _a : raw.processCommentsId, urnNo: raw.urnNo, vendorId: raw.vendorId, manufacturerId: raw.manufacturerId, updatedDate: raw.updatedDate });
}
/** Cert-details shape for renew MP units (GET /renew/details). */
function formatRenewMpManufacturingUnitForDetails(raw) {
    var _a, _b;
    var unitId = (_a = raw.processRenewMpManufacturingUnitId) !== null && _a !== void 0 ? _a : raw.processMpManufacturingUnitId;
    return {
        _id: raw._id,
        processMpManufacturingUnitId: unitId,
        processRenewMpManufacturingUnitId: (_b = raw.processRenewMpManufacturingUnitId) !== null && _b !== void 0 ? _b : unitId,
        vendorId: raw.vendorId,
        manufacturerId: raw.manufacturerId,
        urnNo: raw.urnNo,
        unitName: raw.unitName,
        renewableEnergyUtilization: raw.renewableEnergyUtilization,
        ecdYear1: raw.ecdYear1,
        ecdYear2: raw.ecdYear2,
        ecdYear3: raw.ecdYear3,
        ecdProductionUnit: raw.ecdProductionUnit,
        ecdProductionYear1: raw.ecdProductionYear1,
        ecdProductionYear2: raw.ecdProductionYear2,
        ecdProductionYear3: raw.ecdProductionYear3,
        ecdElectricUnit: raw.ecdElectricUnit,
        ecdElectricYear1: raw.ecdElectricYear1,
        ecdElectricYear2: raw.ecdElectricYear2,
        ecdElectricYear3: raw.ecdElectricYear3,
        ecdThermalUnitFuel1: raw.ecdThermalUnitFuel1,
        ecdThermalUnitFuel2: raw.ecdThermalUnitFuel2,
        ecdThermalUnitFuel3: raw.ecdThermalUnitFuel3,
        ecdThermalFuel1Year1: raw.ecdThermalFuel1Year1,
        ecdThermalFuel1Year2: raw.ecdThermalFuel1Year2,
        ecdThermalFuel1Year3: raw.ecdThermalFuel1Year3,
        ecdThermalFuel2Year1: raw.ecdThermalFuel2Year1,
        ecdThermalFuel2Year2: raw.ecdThermalFuel2Year2,
        ecdThermalFuel2Year3: raw.ecdThermalFuel2Year3,
        ecdThermalFuel3Year1: raw.ecdThermalFuel3Year1,
        ecdThermalFuel3Year2: raw.ecdThermalFuel3Year2,
        ecdThermalFuel3Year3: raw.ecdThermalFuel3Year3,
        ecdCalorificFuel1Year1: raw.ecdCalorificFuel1Year1,
        ecdCalorificFuel1Year2: raw.ecdCalorificFuel1Year2,
        ecdCalorificFuel1Year3: raw.ecdCalorificFuel1Year3,
        ecdCalorificFuel2Year1: raw.ecdCalorificFuel2Year1,
        ecdCalorificFuel2Year2: raw.ecdCalorificFuel2Year2,
        ecdCalorificFuel2Year3: raw.ecdCalorificFuel2Year3,
        ecdCalorificFuel3Year1: raw.ecdCalorificFuel3Year1,
        ecdCalorificFuel3Year2: raw.ecdCalorificFuel3Year2,
        ecdCalorificFuel3Year3: raw.ecdCalorificFuel3Year3,
        ecdTextareaNewUnits: raw.ecdTextareaNewUnits,
        wcdYear1: raw.wcdYear1,
        wcdYear2: raw.wcdYear2,
        wcdYear3: raw.wcdYear3,
        wcdProductionUnit: raw.wcdProductionUnit,
        wcdWaterUnit: raw.wcdWaterUnit,
        wcdProductionYear1: raw.wcdProductionYear1,
        wcdProductionYear2: raw.wcdProductionYear2,
        wcdProductionYear3: raw.wcdProductionYear3,
        wcdWaterYear1: raw.wcdWaterYear1,
        wcdWaterYear2: raw.wcdWaterYear2,
        wcdWaterYear3: raw.wcdWaterYear3,
        reYear: raw.reYear,
        reSolarPhotovoltaic: raw.reSolarPhotovoltaic,
        reWind: raw.reWind,
        reBiomass: raw.reBiomass,
        reSolarThermal: raw.reSolarThermal,
        reOthersUnit: raw.reOthersUnit,
        reOthers: raw.reOthers,
        offsiteRenewablePower: raw.offsiteRenewablePower,
        processMpManufacturingUnitStatus: raw.processMpManufacturingUnitStatus,
        calculateBulkSec: raw.calculateBulkSec,
        calculateBulkSwc: raw.calculateBulkSwc,
        calculateBulkSecMultipled: raw.calculateBulkSecMultipled,
        calculateBulkSwcMultipled: raw.calculateBulkSwcMultipled,
        measuresImplementedMpUnits: raw.measuresImplementedMpUnits,
        detailsOfRainWaterHarvestingMpUnits: raw.detailsOfRainWaterHarvestingMpUnits,
        createdDate: raw.createdDate,
        updatedDate: raw.updatedDate,
    };
}
/** Cert-details shape for renew WM units (GET /renew/details). */
function formatRenewWmManufacturingUnitForDetails(raw) {
    var _a, _b, _c, _d;
    var unitId = (_a = raw.processRenewWmManufacturingUnitId) !== null && _a !== void 0 ? _a : raw.processWmManufacturingUnitId;
    var wasteId = (_b = raw.processRenewWasteManagementId) !== null && _b !== void 0 ? _b : raw.processWasteManagementId;
    return {
        _id: raw._id,
        processWmManufacturingUnitId: unitId,
        processRenewWmManufacturingUnitId: (_c = raw.processRenewWmManufacturingUnitId) !== null && _c !== void 0 ? _c : unitId,
        vendorId: raw.vendorId,
        manufacturerId: raw.manufacturerId,
        urnNo: raw.urnNo,
        processWasteManagementId: wasteId,
        processRenewWasteManagementId: (_d = raw.processRenewWasteManagementId) !== null && _d !== void 0 ? _d : wasteId,
        unitName: raw.unitName,
        hazardousWasteYear1: raw.hazardousWasteYear1,
        hazardousWasteYear2: raw.hazardousWasteYear2,
        hazardousWasteYear3: raw.hazardousWasteYear3,
        hazardousWasteProductionUnit: raw.hazardousWasteProductionUnit,
        hazardousWasteQuantityUnit: raw.hazardousWasteQuantityUnit,
        hazardousWasteProductionYear1: raw.hazardousWasteProductionYear1,
        hazardousWasteProductionYear2: raw.hazardousWasteProductionYear2,
        hazardousWasteProductionYear3: raw.hazardousWasteProductionYear3,
        hazardousWasteQuantityYear1: raw.hazardousWasteQuantityYear1,
        hazardousWasteQuantityYear2: raw.hazardousWasteQuantityYear2,
        hazardousWasteQuantityYear3: raw.hazardousWasteQuantityYear3,
        nonHazardousWasteYear1: raw.nonHazardousWasteYear1,
        nonHazardousWasteYear2: raw.nonHazardousWasteYear2,
        nonHazardousWasteYear3: raw.nonHazardousWasteYear3,
        nonHazardousWasteProductionUnit: raw.nonHazardousWasteProductionUnit,
        nonHazardousWasteWaterUnit: raw.nonHazardousWasteWaterUnit,
        nonHazardousWasteProductionYear1: raw.nonHazardousWasteProductionYear1,
        nonHazardousWasteProductionYear2: raw.nonHazardousWasteProductionYear2,
        nonHazardousWasteProductionYear3: raw.nonHazardousWasteProductionYear3,
        nonHazardousWasteWaterYear1: raw.nonHazardousWasteWaterYear1,
        nonHazardousWasteWaterYear2: raw.nonHazardousWasteWaterYear2,
        nonHazardousWasteWaterYear3: raw.nonHazardousWasteWaterYear3,
        calculateBulkRshwd: raw.calculateBulkRshwd,
        calculateBulkRsnhwd: raw.calculateBulkRsnhwd,
        calculateBulkRshwdMultipled: raw.calculateBulkRshwdMultipled,
        calculateBulkRsnhwdMultipled: raw.calculateBulkRsnhwdMultipled,
        wmImplementationDetailsWmUnits: raw.wmImplementationDetailsWmUnits,
        createdDate: raw.createdDate,
        updatedDate: raw.updatedDate,
    };
}
/** @deprecated use formatRenewMpManufacturingUnitForDetails */
function mapRenewMpManufacturingUnit(raw) {
    return formatRenewMpManufacturingUnitForDetails(raw);
}
/** @deprecated use formatRenewWmManufacturingUnitForDetails */
function mapRenewWmManufacturingUnit(raw) {
    return formatRenewWmManufacturingUnitForDetails(raw);
}
function filterRenewDocuments(documents, documentForm) {
    return documents
        .filter(function (d) { return d.documentForm === documentForm; })
        .map(function (d) { return mapRenewDocument(d); });
}
/** Cert-shaped process sections cleared on renew details (out of renew scope). */
exports.RENEW_CLEARED_CERT_SECTIONS = {
    product_design: null,
    product_design_measures: [],
    product_design_documents: [],
    product_performance: null,
    product_performance_test_reports: [],
    product_performance_documents: [],
    process_manufacturing: null,
    process_manufacturing_documents: [],
    process_mp_manufacturing_units: [],
    process_waste_management: null,
    process_waste_management_documents: [],
    process_wm_manufacturing_units: [],
    process_life_cycle_approach: null,
    process_life_cycle_approach_documents: [],
    process_product_stewardship: null,
    process_ps_stakeholder_edu_awarness: [],
    process_product_stewardship_documents: [],
    process_innovation: null,
    process_innovation_documents: [],
    process_comments: null,
    raw_materials_hazardous_products: [],
    raw_materials_hazardous_products_documents: [],
    raw_materials_additives: [],
    raw_materials_additives_documents: [],
    raw_materials_alternative_raw_materials_documents: [],
    raw_materials_elimination_of_formaldehyde: [],
    raw_materials_elimination_of_formaldehyde_documents: [],
    raw_materials_elimination_of_prohibited_flame: [],
    raw_materials_elimination_of_prohibited_flame_documents: [],
    raw_materials_elimination_of_prohibited_flame_solvents: [],
    raw_materials_elimination_of_prohibited_flame_solvents_documents: [],
    raw_materials_elimination_of_prohibited_flame_solvents_products: [],
    raw_materials_green_supply: [],
    raw_materials_green_supply_documents: [],
    raw_materials_hazardous: [],
    raw_materials_optimization_of_raw_mix: [],
    raw_materials_raw_mix_optimization_documents: [],
    raw_materials_rapidly_renewable_materials: [],
    raw_materials_recycled_content: [],
    raw_materials_regional_materials: [],
    raw_materials_recovery: [],
    raw_materials_reduce_environmental: [],
    raw_materials_reduce_environmental_documents: [],
    raw_materials_utilization: [],
    raw_materials_utilization_documents: [],
    raw_materials_utilization_manufacturing_units: [],
    raw_materials_utilization_rmc: [],
    /** Initial-cert uploads — replaced by renew bundle `all_renew_product_documents`. */
    all_urn_product_documents: [],
};
function buildManufacturingSection(header, allDocuments) {
    return {
        process_manufacturing: formatRenewManufacturing(header),
        process_manufacturing_documents: filterRenewDocuments(allDocuments, document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING),
    };
}
function buildInnovationSection(header, allDocuments) {
    return {
        process_innovation: formatRenewInnovation(header),
        process_innovation_documents: filterRenewDocuments(allDocuments, document_section_key_constants_1.DocumentSectionKey.PROCESS_INNOVATION),
    };
}
function buildWasteSection(header, allDocuments) {
    return {
        process_waste_management: formatRenewWasteManagement(header),
        process_waste_management_documents: filterRenewDocuments(allDocuments, document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT),
    };
}
function buildStewardshipSection(header, stakeholderRows, allDocuments) {
    return {
        process_product_stewardship: formatRenewProductStewardship(header, stakeholderRows),
        process_ps_stakeholder_edu_awarness: stakeholderRows.map(function (row) { return ({
            _id: row._id,
            seaProgramDetails: row.seaProgramDetails,
            seaNoOfPrograms: row.seaNoOfPrograms,
            seaSupportingDocuments: row.seaSupportingDocuments,
            productStewardshipStatus: row.productStewardshipStatus,
            createdDate: row.createdDate,
            updatedDate: row.updatedDate,
        }); }),
        process_product_stewardship_documents: filterRenewDocuments(allDocuments, document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP),
    };
}
/** Mirror cert details: each EOI row gets product_performance with cycle-scoped testReports. */
function spreadProductPerformanceToDetailRows(rows, performance) {
    var _a, _b, _c;
    if (!performance) {
        return;
    }
    var allReports = Array.isArray(performance.testReports)
        ? performance.testReports
        : [];
    var _loop_1 = function (row) {
        var details = row.product_details;
        var eoiNo = String((_b = (_a = details === null || details === void 0 ? void 0 : details.eoiNo) !== null && _a !== void 0 ? _a : row.eoiNo) !== null && _b !== void 0 ? _b : '').trim();
        var testReports = eoiNo && allReports.length > 0
            ? allReports.filter(function (entry) {
                return !entry.eoiNo || String(entry.eoiNo).trim() === eoiNo;
            })
            : allReports;
        row.product_performance = __assign(__assign({}, performance), { testReports: testReports, testReportFiles: Math.max(Number((_c = performance.testReportFiles) !== null && _c !== void 0 ? _c : 0), testReports.length) });
        row.product_performance_test_reports = testReports.map(function (entry, index) {
            var _a, _b, _c;
            return ({
                _id: entry._id,
                productPerformanceTestReportId: (_b = (_a = entry.processRenewProductPerformanceTestReportId) !== null && _a !== void 0 ? _a : entry.productPerformanceTestReportId) !== null && _b !== void 0 ? _b : index + 1,
                urnNo: (_c = entry.urnNo) !== null && _c !== void 0 ? _c : performance.urnNo,
                eoiNo: entry.eoiNo,
                productName: entry.productName,
                testReportFileName: entry.testReportFileName,
                createdDate: entry.createdDate,
                updatedDate: entry.updatedDate,
            });
        });
    };
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        _loop_1(row);
    }
}
function buildPerformanceSection(header, testReportRows, allDocuments, renewalCycleId) {
    var resolvedRows = resolveRenewPerformanceTestReportRows(header, testReportRows);
    var performanceDocuments = filterRenewDocuments(allDocuments, document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE).filter(function (doc) {
        if (!renewalCycleId) {
            return true;
        }
        var docCycle = doc.renewalCycleId;
        if (docCycle == null) {
            return true;
        }
        return String(docCycle) === String(renewalCycleId);
    });
    return {
        product_performance: formatRenewProductPerformance(header, testReportRows),
        product_performance_test_reports: resolvedRows.map(function (r) {
            var _a, _b;
            return ({
                _id: r._id,
                productPerformanceTestReportId: (_a = r.processRenewProductPerformanceTestReportId) !== null && _a !== void 0 ? _a : r.productPerformanceTestReportId,
                urnNo: (_b = r.urnNo) !== null && _b !== void 0 ? _b : header === null || header === void 0 ? void 0 : header.urnNo,
                eoiNo: r.eoiNo,
                productName: r.productName,
                testReportFileName: r.testReportFileName,
                createdDate: r.createdDate,
                updatedDate: r.updatedDate,
            });
        }),
        product_performance_documents: performanceDocuments,
    };
}
