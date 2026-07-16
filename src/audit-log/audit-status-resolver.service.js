"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditStatusResolver = void 0;
var common_1 = require("@nestjs/common");
var URN_STATUS_LABELS = {
    0: 'Proposal Pending',
    1: 'Registration Payment Pending',
    2: 'Approve Registration Payment Pending',
    3: 'Process Form In Progress',
    4: 'Check Process Forms',
    5: 'Vendor Response Pending',
    6: 'Final Verification Pending',
    7: 'Certificate Payment Pending',
    8: 'Approve Certificate Fee',
    9: 'Payment Rejected',
    11: 'Certification Fee Approved',
    12: 'Renewal Payment Pending',
    13: 'Renewal Payment Verification Pending',
    14: 'Renewal Payment Approved',
    15: 'Renewal Forms Review Pending',
    16: 'Renewal Vendor Response Pending',
    17: 'Renewal Final Verification Pending',
};
var PAYMENT_STATUS_LABELS = {
    0: 'Payment Pending',
    1: 'Paid',
    2: 'Payment Approve',
    3: 'Payment Rejected',
};
var PRODUCT_STATUS_LABELS = {
    0: 'Pending',
    1: 'Submitted',
    2: 'Certified',
    3: 'Rejected',
    4: 'Expired',
};
var PRODUCT_RENEW_STATUS_LABELS = {
    0: 'Not Renewed',
    1: 'Renewal In Progress',
    2: 'Renewed',
};
var PROPOSAL_STATUS_LABELS = {
    0: 'Proposal Pending',
    1: 'Proposal Approved',
    2: 'Proposal Rejected',
};
var WORKFLOW_STATUS_LABELS = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
};
var PROCESS_WORKFLOW_STATUS_LABELS = {
    0: 'Pending',
    1: 'In Progress',
    2: 'Completed',
    3: 'Rejected',
};
var URN_STATUS_KEYS = new Set(['updatestatusto', 'urnstatus']);
var PAYMENT_STATUS_KEYS = new Set(['paymentstatus']);
var PRODUCT_STATUS_KEYS = new Set(['productstatus']);
var PRODUCT_RENEW_STATUS_KEYS = new Set(['productrenewstatus']);
var PROPOSAL_STATUS_KEYS = new Set([
    'vendorproposalapprovalstatus',
    'proposalstatus',
    'proposalapprovalstatus',
]);
var WORKFLOW_STATUS_KEYS = new Set([
    'reviewstatus',
    'workflowstatus',
    'tabreviewstatus',
    'sectionreviewstatus',
]);
var AuditStatusResolver = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuditStatusResolver = _classThis = /** @class */ (function () {
        function AuditStatusResolver_1() {
        }
        AuditStatusResolver_1.prototype.resolve = function (key, value) {
            var normalizedKey = this.normalizeKey(key);
            if (URN_STATUS_KEYS.has(normalizedKey)) {
                return this.labelFromMap(URN_STATUS_LABELS, value);
            }
            if (PAYMENT_STATUS_KEYS.has(normalizedKey)) {
                return this.labelFromMap(PAYMENT_STATUS_LABELS, value);
            }
            if (PRODUCT_STATUS_KEYS.has(normalizedKey)) {
                return this.labelFromMap(PRODUCT_STATUS_LABELS, value);
            }
            if (PRODUCT_RENEW_STATUS_KEYS.has(normalizedKey)) {
                return this.labelFromMap(PRODUCT_RENEW_STATUS_LABELS, value);
            }
            if (PROPOSAL_STATUS_KEYS.has(normalizedKey)) {
                return this.labelFromMap(PROPOSAL_STATUS_LABELS, value);
            }
            if (WORKFLOW_STATUS_KEYS.has(normalizedKey)) {
                return this.labelFromMap(WORKFLOW_STATUS_LABELS, value);
            }
            if (this.isProcessWorkflowStatusKey(normalizedKey)) {
                return this.labelFromMap(PROCESS_WORKFLOW_STATUS_LABELS, value);
            }
            return undefined;
        };
        AuditStatusResolver_1.prototype.normalizeKey = function (key) {
            return key.replace(/\[\]$/g, '').toLowerCase();
        };
        AuditStatusResolver_1.prototype.isProcessWorkflowStatusKey = function (key) {
            return (key.endsWith('status') &&
                (key.startsWith('process') ||
                    key.startsWith('rawmaterials') ||
                    key.startsWith('productperformance') ||
                    key.startsWith('productstewardship')));
        };
        AuditStatusResolver_1.prototype.labelFromMap = function (labels, value) {
            var status = typeof value === 'number'
                ? value
                : typeof value === 'string' && value.trim() !== ''
                    ? Number(value)
                    : NaN;
            if (!Number.isInteger(status)) {
                return undefined;
            }
            return labels[status];
        };
        return AuditStatusResolver_1;
    }());
    __setFunctionName(_classThis, "AuditStatusResolver");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditStatusResolver = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditStatusResolver = _classThis;
}();
exports.AuditStatusResolver = AuditStatusResolver;
