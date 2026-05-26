import {
  shouldReplaceRawMaterialsTableBeforeInsert,
} from '../common/raw-materials/raw-materials-upload.util';

describe('hazardous products replace handshake', () => {
  it('replaces when replaceTable is true', () => {
    expect(
      shouldReplaceRawMaterialsTableBeforeInsert({ replaceTable: 'true' }),
    ).toBe(true);
  });

  it('replaces when rowIndex is 0', () => {
    expect(
      shouldReplaceRawMaterialsTableBeforeInsert({
        rowIndex: '0',
        totalRows: '3',
      }),
    ).toBe(true);
  });

  it('does not replace when rowIndex > 0', () => {
    expect(
      shouldReplaceRawMaterialsTableBeforeInsert({
        rowIndex: '1',
        totalRows: '3',
      }),
    ).toBe(false);
  });

  it('replaces legacy single POST without handshake fields', () => {
    expect(shouldReplaceRawMaterialsTableBeforeInsert({ urnNo: 'URN-1' })).toBe(
      true,
    );
  });
});
