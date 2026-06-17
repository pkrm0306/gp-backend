import { BadRequestException } from '@nestjs/common';

/** Vendor empty-form copy (shared with product design / raw materials). */
export const PROCESS_MANUFACTURING_EMPTY_FORM_MESSAGE =
  'Please fill in at least one field in the form before continuing.';

export const ENERGY_CONSERVATION_UPLOAD_FIELD_NAMES = new Set([
  'energyConservationSupportingDocumentsFile',
  'energyConservationSupportingDocuments',
  'energyConservationSupportingDocument',
  'energyConservationSupportingDocumentFile',
  'energy_conservation_supporting_documents',
  'energyConservationFile',
  'energyConservationFiles',
]);

export const ENERGY_CONSUMPTION_UPLOAD_FIELD_NAMES = new Set([
  'energyConsumptionDocumentsFile',
  'energyConsumptionDocuments',
  'energyConsumptionDocument',
  'energyConsumptionDocumentFile',
  'energy_consumption_documents',
  'energyConsumptionFile',
  'energyConsumptionFiles',
]);

function isValidUploadPart(file: Express.Multer.File): boolean {
  return Boolean(
    file?.originalname ||
      (file?.size ?? 0) > 0 ||
      (file?.buffer?.length ?? 0) > 0,
  );
}

function hasTrimmedText(value: unknown): boolean {
  return String(value ?? '').trim() !== '';
}

export function collectProcessManufacturingUploadFiles(
  files?: Express.Multer.File[],
): {
  energyConservationFiles: Express.Multer.File[];
  energyConsumptionFiles: Express.Multer.File[];
} {
  const energyConservationFiles: Express.Multer.File[] = [];
  const energyConsumptionFiles: Express.Multer.File[] = [];
  const legacyFiles: Express.Multer.File[] = [];

  for (const file of files ?? []) {
    if (!isValidUploadPart(file)) continue;
    const field = String(file.fieldname ?? 'files');
    if (ENERGY_CONSERVATION_UPLOAD_FIELD_NAMES.has(field)) {
      energyConservationFiles.push(file);
    } else if (ENERGY_CONSUMPTION_UPLOAD_FIELD_NAMES.has(field)) {
      energyConsumptionFiles.push(file);
    } else if (field === 'files') {
      legacyFiles.push(file);
    }
  }

  if (
    energyConservationFiles.length === 0 &&
    energyConsumptionFiles.length === 0 &&
    legacyFiles.length > 0
  ) {
    energyConservationFiles.push(...legacyFiles);
  }

  return { energyConservationFiles, energyConsumptionFiles };
}

export function hasAtLeastOneProcessManufacturingFieldFilled(params: {
  portableWaterDemand?: string;
  rainWaterHarvesting?: string;
  beyondTheFenceInitiatives?: string;
  totalEnergyConsumption?: number | null;
  energyConservationFiles: Express.Multer.File[];
  energyConsumptionFiles: Express.Multer.File[];
}): boolean {
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

export function hasAtLeastOneProcessManufacturingContent(params: {
  portableWaterDemand?: string;
  rainWaterHarvesting?: string;
  beyondTheFenceInitiatives?: string;
  totalEnergyConsumption?: number | null;
  energyConservationFiles: Express.Multer.File[];
  energyConsumptionFiles: Express.Multer.File[];
  retainedDocumentCount?: number;
}): boolean {
  if (
    hasAtLeastOneProcessManufacturingFieldFilled({
      portableWaterDemand: params.portableWaterDemand,
      rainWaterHarvesting: params.rainWaterHarvesting,
      beyondTheFenceInitiatives: params.beyondTheFenceInitiatives,
      totalEnergyConsumption: params.totalEnergyConsumption,
      energyConservationFiles: params.energyConservationFiles,
      energyConsumptionFiles: params.energyConsumptionFiles,
    })
  ) {
    return true;
  }
  return (params.retainedDocumentCount ?? 0) > 0;
}

export function assertAtLeastOneProcessManufacturingField(params: {
  portableWaterDemand?: string;
  rainWaterHarvesting?: string;
  beyondTheFenceInitiatives?: string;
  totalEnergyConsumption?: number | null;
  energyConservationFiles: Express.Multer.File[];
  energyConsumptionFiles: Express.Multer.File[];
  retainedDocumentCount?: number;
}): void {
  if (
    !hasAtLeastOneProcessManufacturingContent({
      portableWaterDemand: params.portableWaterDemand,
      rainWaterHarvesting: params.rainWaterHarvesting,
      beyondTheFenceInitiatives: params.beyondTheFenceInitiatives,
      totalEnergyConsumption: params.totalEnergyConsumption,
      energyConservationFiles: params.energyConservationFiles,
      energyConsumptionFiles: params.energyConsumptionFiles,
      retainedDocumentCount: params.retainedDocumentCount,
    })
  ) {
    throw new BadRequestException(PROCESS_MANUFACTURING_EMPTY_FORM_MESSAGE);
  }
}
