import {

  CATEGORY_CHANGE_CERTIFIED_MESSAGE,

  CATEGORY_CHANGE_LOCKED_MESSAGE,

  CATEGORY_CHANGE_RENEWAL_MESSAGE,

} from '../constants/category-change.constants';

import {

  isProductCategoryEditable,
  isProductCategoryEditableForUrn,
  maxUrnStatusForCategoryLock,
  resolveCategoryChangeBlockReason,
  stepsToPurgeOnCategoryChange,
  retainedRawMaterialStepsOnCategoryChange,
  addedRawMaterialStepsOnCategoryChange,
  visibleStepsForCategory,
  formatCategoryWithRawMaterialVisibility,
} from './category-change.util';



describe('category-change.util', () => {

  it('allows category edit before final review submission', () => {

    expect(

      isProductCategoryEditable({ productStatus: 1, urnStatus: 5 }),

    ).toBe(true);

    expect(resolveCategoryChangeBlockReason({ productStatus: 1, urnStatus: 5 })).toBeNull();

  });



  it('blocks category edit after final review submission (urnStatus >= 6)', () => {

    expect(

      isProductCategoryEditable({ productStatus: 1, urnStatus: 6 }),

    ).toBe(false);

    expect(resolveCategoryChangeBlockReason({ productStatus: 1, urnStatus: 6 })).toBe(

      CATEGORY_CHANGE_LOCKED_MESSAGE,

    );

  });

  it('allows category edit during admin review before final submit (urnStatus 4-5)', () => {
    expect(isProductCategoryEditable({ productStatus: 1, urnStatus: 4 })).toBe(true);
    expect(isProductCategoryEditable({ productStatus: 1, urnStatus: 5 })).toBe(true);
  });

  it('locks category for entire URN once admin final submit is recorded (urnStatus 6)', () => {
    expect(
      isProductCategoryEditableForUrn({
        productStatus: 1,
        urnStatuses: [4, 6],
      }),
    ).toBe(false);
    expect(maxUrnStatusForCategoryLock([4, 6])).toBe(6);
  });



  it('blocks category edit for certified products', () => {

    expect(

      isProductCategoryEditable({ productStatus: 2, urnStatus: 11 }),

    ).toBe(false);

    expect(resolveCategoryChangeBlockReason({ productStatus: 2, urnStatus: 11 })).toBe(

      CATEGORY_CHANGE_CERTIFIED_MESSAGE,

    );

  });



  it('blocks category edit during renewal workflow', () => {

    expect(

      isProductCategoryEditable({ productStatus: 1, urnStatus: 12 }),

    ).toBe(false);

    expect(resolveCategoryChangeBlockReason({ productStatus: 1, urnStatus: 12 })).toBe(

      CATEGORY_CHANGE_RENEWAL_MESSAGE,

    );

  });



  it('purges only raw material steps removed by the new category', () => {
    expect(
      stepsToPurgeOnCategoryChange('1,2,3', '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15'),
    ).toEqual([]);

    expect(
      stepsToPurgeOnCategoryChange('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15', '1,2'),
    ).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });

  it('retains overlapping raw material steps when category expands', () => {
    expect(
      retainedRawMaterialStepsOnCategoryChange(
        '1,2,3',
        '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
      ),
    ).toEqual([1, 2, 3]);

    expect(
      addedRawMaterialStepsOnCategoryChange(
        '1,2,3',
        '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
      ),
    ).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });



  it('parses visible steps from category CSV', () => {

    expect(visibleStepsForCategory('1,2,5')).toEqual([1, 2, 5]);

    expect(visibleStepsForCategory('')).toHaveLength(15);

  });

  it('formats category payload with raw material visibility for vendor UI', () => {
    const formatted = formatCategoryWithRawMaterialVisibility({
      _id: 'cat1',
      category_name: 'Cement',
      category_raw_material_forms: '1,2',
      sector: 3,
    });
    expect(formatted).toMatchObject({
      categoryName: 'Cement',
      category_raw_material_forms: '1,2',
      visibleRawMaterialSteps: [1, 2],
      sector: 3,
    });
  });

});


