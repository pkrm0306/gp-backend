import {
  hasExplicitReduceEnvironmentalArray,
  resolveReduceEnvironmentalUnits,
  shouldReplaceRawMaterialsTableBeforeInsert,
} from './raw-materials-upload.util';

const ROW_KEYS = [
  'location',
  'enhancementOfMinesLife',
  'topsoilConservation',
  'waterTableManagement',
  'restorationOfSpentMines',
  'greenBeltDevelopmentAndBioDiversity',
];

describe('reduce environmental units resolve', () => {
  it('treats explicit units[] as full snapshot (may be empty)', () => {
    expect(
      hasExplicitReduceEnvironmentalArray({ urnNo: 'U', units: '[]' }),
    ).toBe(true);
    expect(resolveReduceEnvironmentalUnits({ units: '[]' }, ROW_KEYS)).toEqual(
      [],
    );
  });

  it('parses units JSON array with multiple mines', () => {
    const units = JSON.stringify([
      { location: 'Mine A', topsoilConservation: 'x' },
      { location: 'Mine B' },
    ]);
    expect(resolveReduceEnvironmentalUnits({ units }, ROW_KEYS)).toHaveLength(2);
  });

  it('prefers units over mines when both sent', () => {
    const units = JSON.stringify([{ location: 'From units' }]);
    const mines = JSON.stringify([{ location: 'From mines' }]);
    const rows = resolveReduceEnvironmentalUnits({ units, mines }, ROW_KEYS);
    expect(rows[0].location).toBe('From units');
  });

  it('legacy flat row when no array', () => {
    const rows = resolveReduceEnvironmentalUnits(
      { location: 'Solo mine', enhancementOfMinesLife: 'a' },
      ROW_KEYS,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].location).toBe('Solo mine');
  });

  it('replaceTable on first legacy row', () => {
    expect(
      shouldReplaceRawMaterialsTableBeforeInsert({ replaceTable: 'true' }),
    ).toBe(true);
    expect(
      shouldReplaceRawMaterialsTableBeforeInsert({ rowIndex: '0', totalRows: '3' }),
    ).toBe(true);
    expect(
      shouldReplaceRawMaterialsTableBeforeInsert({ rowIndex: '1', totalRows: '3' }),
    ).toBe(false);
  });
});
