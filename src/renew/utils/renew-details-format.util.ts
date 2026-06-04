import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';

type DocRow = Record<string, unknown>;

/** Mongo filter for renew uploads on a URN. */
export function buildRenewDocumentsQueryFilter(
  urnNo: string,
  renewalCycleId?: unknown,
  options?: { strictCycleOnly?: boolean },
): Record<string, unknown> {
  const trimmed = urnNo.trim();
  const base: Record<string, unknown> = {
    urnNo: trimmed,
    isDeleted: { $ne: true },
  };
  if (renewalCycleId == null || String(renewalCycleId).trim() === '') {
    return base;
  }
  if (options?.strictCycleOnly) {
    return { ...base, renewalCycleId };
  }
  return {
    ...base,
    $or: [
      { renewalCycleId },
      { renewalCycleId: null },
      { renewalCycleId: { $exists: false } },
    ],
  };
}

export function dedupeRenewDocuments(
  sources: Array<DocRow | null | undefined>,
): DocRow[] {
  const seen = new Set<string>();
  const out: DocRow[] = [];
  for (const source of sources) {
    if (!source) continue;
    const id = String(
      source.productDocumentId ?? source._id ?? source.documentLink ?? '',
    );
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(mapRenewDocument(source));
  }
  return out;
}

/** Merge DB rows + section-specific arrays into one list for quick-view / details. */
export function mergeRenewDocumentSources(
  ...groups: Array<Array<DocRow | Record<string, unknown>> | undefined>
): DocRow[] {
  const flat: DocRow[] = [];
  for (const group of groups) {
    if (!Array.isArray(group)) continue;
    for (const entry of group) {
      if (entry && typeof entry === 'object') {
        flat.push(entry as DocRow);
      }
    }
  }
  return dedupeRenewDocuments(flat);
}

export function mapRenewDocument(doc: DocRow): DocRow {
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

export function formatRenewProductPerformance(
  header: DocRow | null | undefined,
  testReportRows: DocRow[],
): DocRow | null {
  const resolvedRows = resolveRenewPerformanceTestReportRows(
    header,
    testReportRows,
  );

  if (!header && resolvedRows.length === 0) {
    return null;
  }

  const testReports = resolvedRows.map((r) => ({
    _id: r._id,
    productPerformanceTestReportId:
      r.processRenewProductPerformanceTestReportId ??
      r.productPerformanceTestReportId,
    productName: String(r.productName ?? ''),
    testReportFileName: String(r.testReportFileName ?? ''),
    eoiNo: r.eoiNo,
  }));

  return {
    _id: header?._id,
    processProductPerformanceId:
      header?.processRenewProductPerformanceId ?? header?.processProductPerformanceId,
    urnNo: header?.urnNo,
    vendorId: header?.vendorId,
    manufacturerId: header?.manufacturerId,
    renewalCycleId: header?.renewalCycleId,
    testReportFiles: Math.max(
      Number(header?.testReportFiles ?? 0),
      testReports.length,
    ),
    testReports,
    renewalType: header?.renewalType ?? 0,
    productPerformanceStatus: header?.productPerformanceStatus ?? 0,
    createdDate: header?.createdDate,
    updatedDate: header?.updatedDate,
  };
}

/** Child table first; fall back to embedded header.testReports (legacy saves). */
export function resolveRenewPerformanceTestReportRows(
  header: DocRow | null | undefined,
  childRows: DocRow[],
): DocRow[] {
  if (childRows.length > 0) {
    return childRows;
  }

  const embedded = Array.isArray(header?.testReports)
    ? (header.testReports as DocRow[])
    : [];
  if (embedded.length === 0) {
    return [];
  }

  return embedded
    .map((entry, index) => {
      const productName = String(entry.productName ?? '').trim();
      const testReportFileName = String(entry.testReportFileName ?? '').trim();
      if (!productName && !testReportFileName) {
        return null;
      }
      return {
        _id: entry._id,
        processRenewProductPerformanceTestReportId:
          entry.processRenewProductPerformanceTestReportId ??
          entry.productPerformanceTestReportId ??
          index + 1,
        productPerformanceTestReportId:
          entry.processRenewProductPerformanceTestReportId ??
          entry.productPerformanceTestReportId ??
          index + 1,
        urnNo: header?.urnNo,
        eoiNo: entry.eoiNo ? String(entry.eoiNo).trim() : undefined,
        productName,
        testReportFileName,
        createdDate: entry.createdDate ?? header?.createdDate,
        updatedDate: entry.updatedDate ?? header?.updatedDate,
      };
    })
    .filter((row) => row !== null) as DocRow[];
}

export function formatRenewManufacturing(
  raw: DocRow | null | undefined,
): DocRow | null {
  if (!raw) {
    return null;
  }
  return {
    _id: raw._id,
    processManufacturingId:
      raw.processRenewManufacturingId ?? raw.processManufacturingId,
    vendorId: raw.vendorId,
    manufacturerId: raw.manufacturerId,
    urnNo: raw.urnNo,
    energyConservationSupportingDocuments:
      raw.energyConservationSupportingDocuments,
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

export function formatRenewWasteManagement(
  raw: DocRow | null | undefined,
): DocRow | null {
  if (!raw) {
    return null;
  }
  return {
    _id: raw._id,
    processWasteManagementId:
      raw.processRenewWasteManagementId ?? raw.processWasteManagementId,
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

export function formatRenewInnovation(
  raw: DocRow | null | undefined,
): DocRow | null {
  if (!raw) {
    return null;
  }
  return {
    _id: raw._id,
    processInnovationId: raw.processRenewInnovationId ?? raw.processInnovationId,
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

export function formatRenewProductStewardship(
  raw: DocRow | null | undefined,
  stakeholderRows: DocRow[] = [],
): DocRow | null {
  if (!raw && stakeholderRows.length === 0) {
    return null;
  }
  return {
    _id: raw?._id,
    processProductStewardshipId:
      raw?.processRenewProductStewardshipId ?? raw?.processProductStewardshipId,
    vendorId: raw?.vendorId,
    manufacturerId: raw?.manufacturerId,
    urnNo: raw?.urnNo,
    seaSupportingDocuments: raw?.seaSupportingDocuments ?? 0,
    qualityManagementDetails: raw?.qualityManagementDetails,
    qmSupportingDocuments: raw?.qmSupportingDocuments ?? 0,
    eprImplementedDetails: raw?.eprImplementedDetails,
    eprGreenPackagingDetails: raw?.eprGreenPackagingDetails,
    eprSupportingDocuments: raw?.eprSupportingDocuments ?? 0,
    productStewardshipStatus: raw?.productStewardshipStatus ?? 0,
    programmeDetails: stakeholderRows.map((row) => ({
      _id: row._id,
      programmeDetails: row.seaProgramDetails ?? '',
      numberOfPrograms: row.seaNoOfPrograms ?? '',
      seaSupportingDocuments: Number(row.seaSupportingDocuments ?? 0),
      productStewardshipStatus: Number(row.productStewardshipStatus ?? 0),
      createdDate: row.createdDate,
      updatedDate: row.updatedDate,
    })),
    createdDate: raw?.createdDate,
    updatedDate: raw?.updatedDate,
  };
}

export function formatRenewComments(
  raw: DocRow | null | undefined,
): DocRow | null {
  if (!raw) {
    return null;
  }
  return {
    ...raw,
    _id: raw._id,
    processCommentsId: raw.processRenewCommentsId ?? raw.processCommentsId,
    urnNo: raw.urnNo,
    vendorId: raw.vendorId,
    manufacturerId: raw.manufacturerId,
    updatedDate: raw.updatedDate,
  };
}

/** Cert-details shape for renew MP units (GET /renew/details). */
export function formatRenewMpManufacturingUnitForDetails(raw: DocRow): DocRow {
  const unitId =
    raw.processRenewMpManufacturingUnitId ?? raw.processMpManufacturingUnitId;
  return {
    _id: raw._id,
    processMpManufacturingUnitId: unitId,
    processRenewMpManufacturingUnitId: raw.processRenewMpManufacturingUnitId ?? unitId,
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
export function formatRenewWmManufacturingUnitForDetails(raw: DocRow): DocRow {
  const unitId =
    raw.processRenewWmManufacturingUnitId ?? raw.processWmManufacturingUnitId;
  const wasteId =
    raw.processRenewWasteManagementId ?? raw.processWasteManagementId;
  return {
    _id: raw._id,
    processWmManufacturingUnitId: unitId,
    processRenewWmManufacturingUnitId: raw.processRenewWmManufacturingUnitId ?? unitId,
    vendorId: raw.vendorId,
    manufacturerId: raw.manufacturerId,
    urnNo: raw.urnNo,
    processWasteManagementId: wasteId,
    processRenewWasteManagementId: raw.processRenewWasteManagementId ?? wasteId,
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
export function mapRenewMpManufacturingUnit(raw: DocRow): DocRow {
  return formatRenewMpManufacturingUnitForDetails(raw);
}

/** @deprecated use formatRenewWmManufacturingUnitForDetails */
export function mapRenewWmManufacturingUnit(raw: DocRow): DocRow {
  return formatRenewWmManufacturingUnitForDetails(raw);
}

export function filterRenewDocuments(
  documents: DocRow[],
  documentForm: string,
): DocRow[] {
  return documents
    .filter((d) => d.documentForm === documentForm)
    .map((d) => mapRenewDocument(d));
}

/** Cert-shaped process sections cleared on renew details (out of renew scope). */
export const RENEW_CLEARED_CERT_SECTIONS: Record<string, unknown> = {
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

export function buildManufacturingSection(
  header: DocRow | null | undefined,
  allDocuments: DocRow[],
) {
  return {
    process_manufacturing: formatRenewManufacturing(header),
    process_manufacturing_documents: filterRenewDocuments(
      allDocuments,
      DocumentSectionKey.PROCESS_MANUFACTURING,
    ),
  };
}

export function buildInnovationSection(
  header: DocRow | null | undefined,
  allDocuments: DocRow[],
) {
  return {
    process_innovation: formatRenewInnovation(header),
    process_innovation_documents: filterRenewDocuments(
      allDocuments,
      DocumentSectionKey.PROCESS_INNOVATION,
    ),
  };
}

export function buildWasteSection(
  header: DocRow | null | undefined,
  allDocuments: DocRow[],
) {
  return {
    process_waste_management: formatRenewWasteManagement(header),
    process_waste_management_documents: filterRenewDocuments(
      allDocuments,
      DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
    ),
  };
}

export function buildStewardshipSection(
  header: DocRow | null | undefined,
  stakeholderRows: DocRow[],
  allDocuments: DocRow[],
) {
  return {
    process_product_stewardship: formatRenewProductStewardship(
      header,
      stakeholderRows,
    ),
    process_ps_stakeholder_edu_awarness: stakeholderRows.map((row) => ({
      _id: row._id,
      seaProgramDetails: row.seaProgramDetails,
      seaNoOfPrograms: row.seaNoOfPrograms,
      seaSupportingDocuments: row.seaSupportingDocuments,
      productStewardshipStatus: row.productStewardshipStatus,
      createdDate: row.createdDate,
      updatedDate: row.updatedDate,
    })),
    process_product_stewardship_documents: filterRenewDocuments(
      allDocuments,
      DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
    ),
  };
}

export function buildPerformanceSection(
  header: DocRow | null | undefined,
  testReportRows: DocRow[],
  allDocuments: DocRow[],
  renewalCycleId?: unknown,
) {
  const resolvedRows = resolveRenewPerformanceTestReportRows(
    header,
    testReportRows,
  );
  const performanceDocuments = filterRenewDocuments(
    allDocuments,
    DocumentSectionKey.PRODUCT_PERFORMANCE,
  ).filter((doc) => {
    if (!renewalCycleId) {
      return true;
    }
    const docCycle = doc.renewalCycleId;
    if (docCycle == null) {
      return true;
    }
    return String(docCycle) === String(renewalCycleId);
  });

  return {
    product_performance: formatRenewProductPerformance(header, testReportRows),
    product_performance_test_reports: resolvedRows.map((r) => ({
      _id: r._id,
      productPerformanceTestReportId:
        r.processRenewProductPerformanceTestReportId ??
        r.productPerformanceTestReportId,
      urnNo: r.urnNo ?? header?.urnNo,
      eoiNo: r.eoiNo,
      productName: r.productName,
      testReportFileName: r.testReportFileName,
      createdDate: r.createdDate,
      updatedDate: r.updatedDate,
    })),
    product_performance_documents: performanceDocuments,
  };
}
