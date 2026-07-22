"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyProductStatusBreakdown = emptyProductStatusBreakdown;
exports.buildProductStatusBreakdownFromCounts = buildProductStatusBreakdownFromCounts;
function emptyProductStatusBreakdown() {
    return {
        totals: {
            certified: 0,
            uncertified: 0,
            expired: 0,
            renewed: 0,
            rejected: 0,
            total: 0,
        },
        chart: [
            { key: 'certified', label: 'Certified', count: 0 },
            { key: 'uncertified', label: 'Uncertified', count: 0 },
            { key: 'expired', label: 'Expired', count: 0 },
            { key: 'renewed', label: 'Renewal pending', count: 0 },
        ],
    };
}
function buildProductStatusBreakdownFromCounts(input) {
    var total = input.certified +
        input.uncertified +
        input.expired +
        input.renewed +
        input.rejected;
    return {
        totals: {
            certified: input.certified,
            uncertified: input.uncertified,
            expired: input.expired,
            renewed: input.renewed,
            rejected: input.rejected,
            total: total,
        },
        chart: [
            { key: 'certified', label: 'Certified', count: input.certified },
            { key: 'uncertified', label: 'Uncertified', count: input.uncertified },
            { key: 'expired', label: 'Expired', count: input.expired },
            { key: 'renewed', label: 'Renewal pending', count: input.renewed },
        ],
    };
}
