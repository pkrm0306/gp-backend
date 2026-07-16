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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchUrnTabReviewDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var urn_tab_review_constants_1 = require("../constants/urn-tab-review.constants");
var PatchUrnTabReviewDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _tabKey_decorators;
    var _tabKey_initializers = [];
    var _tabKey_extraInitializers = [];
    var _stepId_decorators;
    var _stepId_initializers = [];
    var _stepId_extraInitializers = [];
    var _decision_decorators;
    var _decision_initializers = [];
    var _decision_extraInitializers = [];
    var _rejectionRemarks_decorators;
    var _rejectionRemarks_initializers = [];
    var _rejectionRemarks_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PatchUrnTabReviewDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.tabKey = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _tabKey_initializers, void 0));
                this.stepId = (__runInitializers(this, _tabKey_extraInitializers), __runInitializers(this, _stepId_initializers, void 0));
                this.decision = (__runInitializers(this, _stepId_extraInitializers), __runInitializers(this, _decision_initializers, void 0));
                this.rejectionRemarks = (__runInitializers(this, _decision_extraInitializers), __runInitializers(this, _rejectionRemarks_initializers, void 0));
                this.renewalCycleId = (__runInitializers(this, _rejectionRemarks_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
                __runInitializers(this, _renewalCycleId_extraInitializers);
            }
            return PatchUrnTabReviewDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260326162423' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _tabKey_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'raw-materials',
                    description: 'Process tab key or `raw-materials`. Process keys: ' +
                        urn_tab_review_constants_1.PROCESS_TAB_REVIEW_KEYS.join(', '),
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _stepId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 7,
                    description: 'Required for `raw-materials` (1–15). Omit or null for process tabs.',
                }), (0, class_validator_1.ValidateIf)(function (o) { return o.tabKey === 'raw-materials'; }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(15)];
            _decision_decorators = [(0, swagger_1.ApiProperty)({ enum: ['approved', 'rejected'] }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsIn)(['approved', 'rejected'])];
            _rejectionRemarks_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Required when decision is rejected',
                }), (0, class_validator_1.ValidateIf)(function (o) { return o.decision === 'rejected'; }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _renewalCycleId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Active renewal cycle id (required for renewal URNs)',
                    example: '6a1edd713ec5008b997aca94',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _tabKey_decorators, { kind: "field", name: "tabKey", static: false, private: false, access: { has: function (obj) { return "tabKey" in obj; }, get: function (obj) { return obj.tabKey; }, set: function (obj, value) { obj.tabKey = value; } }, metadata: _metadata }, _tabKey_initializers, _tabKey_extraInitializers);
            __esDecorate(null, null, _stepId_decorators, { kind: "field", name: "stepId", static: false, private: false, access: { has: function (obj) { return "stepId" in obj; }, get: function (obj) { return obj.stepId; }, set: function (obj, value) { obj.stepId = value; } }, metadata: _metadata }, _stepId_initializers, _stepId_extraInitializers);
            __esDecorate(null, null, _decision_decorators, { kind: "field", name: "decision", static: false, private: false, access: { has: function (obj) { return "decision" in obj; }, get: function (obj) { return obj.decision; }, set: function (obj, value) { obj.decision = value; } }, metadata: _metadata }, _decision_initializers, _decision_extraInitializers);
            __esDecorate(null, null, _rejectionRemarks_decorators, { kind: "field", name: "rejectionRemarks", static: false, private: false, access: { has: function (obj) { return "rejectionRemarks" in obj; }, get: function (obj) { return obj.rejectionRemarks; }, set: function (obj, value) { obj.rejectionRemarks = value; } }, metadata: _metadata }, _rejectionRemarks_initializers, _rejectionRemarks_extraInitializers);
            __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PatchUrnTabReviewDto = PatchUrnTabReviewDto;
