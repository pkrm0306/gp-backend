"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renew_plant_state_util_1 = require("./renew-plant-state.util");
describe('renew plant state response mapping', function () {
    it('uses stateName from source data for State aliases', function () {
        var plant = (0, renew_plant_state_util_1.withRenewPlantStateAliases)({
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
    it('preserves existing State values when already present', function () {
        expect((0, renew_plant_state_util_1.resolveRenewPlantState)({
            stateName: 'Tamil Nadu',
            State: 'Karnataka',
        })).toBe('Karnataka');
    });
    it('maps arrays without changing existing plant fields', function () {
        var plants = (0, renew_plant_state_util_1.withRenewPlantsStateAliases)([
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
