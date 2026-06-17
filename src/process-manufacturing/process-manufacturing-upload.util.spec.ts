import {
  assertAtLeastOneProcessManufacturingField,
  collectProcessManufacturingUploadFiles,
  hasAtLeastOneProcessManufacturingContent,
  PROCESS_MANUFACTURING_EMPTY_FORM_MESSAGE,
} from './process-manufacturing-upload.util';

describe('process manufacturing upload util', () => {
  it('collects conservation and consumption files by field name', () => {
    const files = [
      {
        fieldname: 'energyConservationSupportingDocumentsFile',
        originalname: 'a.pdf',
      },
      {
        fieldname: 'energyConsumptionDocumentsFile',
        originalname: 'b.pdf',
      },
    ] as Express.Multer.File[];

    const collected = collectProcessManufacturingUploadFiles(files);
    expect(collected.energyConservationFiles).toHaveLength(1);
    expect(collected.energyConsumptionFiles).toHaveLength(1);
  });

  it('blocks empty manufacturing save', () => {
    expect(() =>
      assertAtLeastOneProcessManufacturingField({
        portableWaterDemand: '',
        rainWaterHarvesting: '',
        beyondTheFenceInitiatives: '',
        totalEnergyConsumption: undefined,
        energyConservationFiles: [],
        energyConsumptionFiles: [],
        retainedDocumentCount: 0,
      }),
    ).toThrow(PROCESS_MANUFACTURING_EMPTY_FORM_MESSAGE);
  });

  it('allows save with one text field', () => {
    expect(
      hasAtLeastOneProcessManufacturingContent({
        portableWaterDemand: 'Water plan',
        energyConservationFiles: [],
        energyConsumptionFiles: [],
      }),
    ).toBe(true);
  });

  it('allows save with explicit zero total energy consumption', () => {
    expect(
      hasAtLeastOneProcessManufacturingContent({
        totalEnergyConsumption: 0,
        energyConservationFiles: [],
        energyConsumptionFiles: [],
      }),
    ).toBe(true);
  });

  it('allows save with uploaded document only', () => {
    expect(
      hasAtLeastOneProcessManufacturingContent({
        energyConservationFiles: [
          { originalname: 'doc.pdf' } as Express.Multer.File,
        ],
        energyConsumptionFiles: [],
      }),
    ).toBe(true);
  });

  it('allows save when retained documents exist on URN', () => {
    expect(
      hasAtLeastOneProcessManufacturingContent({
        energyConservationFiles: [],
        energyConsumptionFiles: [],
        retainedDocumentCount: 2,
      }),
    ).toBe(true);
  });
});
