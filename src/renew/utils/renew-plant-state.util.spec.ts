import {
  resolveRenewPlantState,
  withRenewPlantStateAliases,
  withRenewPlantsStateAliases,
} from './renew-plant-state.util';

describe('renew plant state response mapping', () => {
  it('uses stateName from source data for State aliases', () => {
    const plant = withRenewPlantStateAliases({
      plantName: 'Unit 1',
      stateName: 'Tamil Nadu',
    });

    expect(plant).toMatchObject({
      plantName: 'Unit 1',
      stateName: 'Tamil Nadu',
      state: 'Tamil Nadu',
      State: 'Tamil Nadu',
    });
  });

  it('preserves existing State values when already present', () => {
    expect(
      resolveRenewPlantState({
        stateName: 'Tamil Nadu',
        State: 'Karnataka',
      }),
    ).toBe('Karnataka');
  });

  it('maps arrays without changing existing plant fields', () => {
    const plants = withRenewPlantsStateAliases([
      {
        productPlantId: 1,
        plantName: 'Unit 1',
        plantLocation: 'Chennai',
        stateName: 'Tamil Nadu',
      },
    ]);

    expect(plants).toEqual([
      {
        productPlantId: 1,
        plantName: 'Unit 1',
        plantLocation: 'Chennai',
        stateName: 'Tamil Nadu',
        state: 'Tamil Nadu',
        State: 'Tamil Nadu',
      },
    ]);
  });
});
