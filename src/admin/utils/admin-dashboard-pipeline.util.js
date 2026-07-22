"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_URN_PIPELINE_STEPS = void 0;
exports.mapUrnStatusToPipelineStep = mapUrnStatusToPipelineStep;
exports.buildUrnPipelineChart = buildUrnPipelineChart;
/**
 * Admin dashboard certification pipeline (6 steps) — labels match the admin UI stepper.
 * Counts EOI/product rows (not distinct URNs):
 * - Stages 1–5: productStatus in {0,1} grouped by urnStatus buckets
 * - Stage 6 (Certified): active certified EOIs
 */
exports.ADMIN_URN_PIPELINE_STEPS = [
    {
        key: 'eoi_submitted',
        label: 'EOI Submitted',
        order: 1,
        urnStatuses: [0],
    },
    {
        key: 'registration_payment_done',
        label: 'Registration Payment Done',
        order: 2,
        urnStatuses: [1, 2],
    },
    {
        key: 'process_form_in_progress',
        label: 'Process Form In Progress',
        order: 3,
        urnStatuses: [3, 4, 5],
    },
    {
        key: 'form_verification_done',
        label: 'Form Verification Done',
        order: 4,
        urnStatuses: [6],
    },
    {
        key: 'certification_fee_pending',
        label: 'Certification Fee Pending',
        order: 5,
        urnStatuses: [7, 8, 9, 10],
    },
    {
        key: 'certified',
        label: 'Certified',
        order: 6,
        urnStatuses: [11],
    },
];
var URN_STATUS_TO_PIPELINE = new Map();
for (var _i = 0, ADMIN_URN_PIPELINE_STEPS_1 = exports.ADMIN_URN_PIPELINE_STEPS; _i < ADMIN_URN_PIPELINE_STEPS_1.length; _i++) {
    var step = ADMIN_URN_PIPELINE_STEPS_1[_i];
    for (var _a = 0, _b = step.urnStatuses; _a < _b.length; _a++) {
        var status_1 = _b[_a];
        URN_STATUS_TO_PIPELINE.set(status_1, step.key);
    }
}
function mapUrnStatusToPipelineStep(urnStatus) {
    var _a;
    return (_a = URN_STATUS_TO_PIPELINE.get(urnStatus)) !== null && _a !== void 0 ? _a : null;
}
function buildUrnPipelineChart(byUrnStatus) {
    var _a, _b;
    var counts = new Map();
    for (var _i = 0, ADMIN_URN_PIPELINE_STEPS_2 = exports.ADMIN_URN_PIPELINE_STEPS; _i < ADMIN_URN_PIPELINE_STEPS_2.length; _i++) {
        var step = ADMIN_URN_PIPELINE_STEPS_2[_i];
        counts.set(step.key, 0);
    }
    for (var _c = 0, byUrnStatus_1 = byUrnStatus; _c < byUrnStatus_1.length; _c++) {
        var row = byUrnStatus_1[_c];
        var stepKey = mapUrnStatusToPipelineStep(row.status);
        if (!stepKey)
            continue;
        counts.set(stepKey, ((_a = counts.get(stepKey)) !== null && _a !== void 0 ? _a : 0) + ((_b = row.count) !== null && _b !== void 0 ? _b : 0));
    }
    return exports.ADMIN_URN_PIPELINE_STEPS.map(function (step) {
        var _a;
        return ({
            key: step.key,
            label: step.label,
            order: step.order,
            count: (_a = counts.get(step.key)) !== null && _a !== void 0 ? _a : 0,
        });
    });
}
