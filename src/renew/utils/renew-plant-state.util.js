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
exports.resolveRenewPlantState = resolveRenewPlantState;
exports.withRenewPlantStateAliases = withRenewPlantStateAliases;
exports.withRenewPlantsStateAliases = withRenewPlantsStateAliases;
function resolveRenewPlantState(plant) {
    var _a, _b, _c, _d;
    return ((_d = (_c = (_b = (_a = plant.State) !== null && _a !== void 0 ? _a : plant.state) !== null && _b !== void 0 ? _b : plant.stateName) !== null && _c !== void 0 ? _c : plant.state_name) !== null && _d !== void 0 ? _d : null);
}
function withRenewPlantStateAliases(plant) {
    var state = resolveRenewPlantState(plant);
    return __assign(__assign({}, plant), { state: state, State: state });
}
function withRenewPlantsStateAliases(plants) {
    return plants.map(function (plant) { return withRenewPlantStateAliases(plant); });
}
