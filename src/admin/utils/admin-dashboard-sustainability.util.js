"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUSTAINABILITY_CONTRIBUTION_DEFS = void 0;
exports.clampPercent = clampPercent;
exports.roundContributionPercent = roundContributionPercent;
exports.averagePositivePercent = averagePositivePercent;
exports.maxRecycledPercentFromRmcRow = maxRecycledPercentFromRmcRow;
exports.renewableCarbonScore = renewableCarbonScore;
exports.SUSTAINABILITY_CONTRIBUTION_DEFS = [
    { key: 'energySaved', label: 'Energy Saved', order: 1, color: '#22C55E' },
    { key: 'waterSaved', label: 'Water Saved', order: 2, color: '#3B82F6' },
    { key: 'recyclability', label: 'Recyclability', order: 3, color: '#8B5CF6' },
    { key: 'carbonOffset', label: 'Carbon Offset', order: 4, color: '#4ADE80' },
];
function clampPercent(value) {
    if (!Number.isFinite(value))
        return 0;
    return Math.max(0, Math.min(100, value));
}
function roundContributionPercent(value) {
    return Math.round(clampPercent(value));
}
/** Average of positive numeric samples; returns 0 when empty. */
function averagePositivePercent(samples) {
    var valid = samples
        .map(function (v) { return Number(v); })
        .filter(function (v) { return Number.isFinite(v) && v > 0; });
    if (!valid.length)
        return 0;
    var total = valid.reduce(function (sum, v) { return sum + v; }, 0);
    return roundContributionPercent(total / valid.length);
}
function maxRecycledPercentFromRmcRow(row) {
    var keys = [
        'percentYear1Recycled',
        'percentYear2Recycled',
        'percentYear3Recycled',
        'percentYear4Recycled',
        'percentYear1SubsititutionRecycled',
        'percentYear2SubsititutionRecycled',
        'percentYear3SubsititutionRecycled',
        'percentYear4SubsititutionRecycled',
    ];
    var values = keys
        .map(function (key) { return Number(row[key]); })
        .filter(function (v) { return Number.isFinite(v) && v > 0; });
    if (!values.length)
        return null;
    return Math.max.apply(Math, values);
}
function renewableCarbonScore(row) {
    if (row.renewableEnergyUtilization === 'yes') {
        return 100;
    }
    var renewableFields = [
        row.reSolarPhotovoltaic,
        row.reWind,
        row.reBiomass,
        row.reSolarThermal,
        row.reOthers,
        row.offsiteRenewablePower,
    ]
        .map(function (v) { return Number(v); })
        .filter(function (v) { return Number.isFinite(v) && v > 0; });
    if (!renewableFields.length)
        return null;
    var total = renewableFields.reduce(function (sum, v) { return sum + v; }, 0);
    return clampPercent(Math.min(100, total));
}
