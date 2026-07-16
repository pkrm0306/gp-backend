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
exports.VendorProposalApprovalDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var VendorProposalApprovalDto = function () {
    var _a;
    var _paymentType_decorators;
    var _paymentType_initializers = [];
    var _paymentType_extraInitializers = [];
    var _vendorProposalApprovalStatus_decorators;
    var _vendorProposalApprovalStatus_initializers = [];
    var _vendorProposalApprovalStatus_extraInitializers = [];
    var _proposalRejectionRemarks_decorators;
    var _proposalRejectionRemarks_initializers = [];
    var _proposalRejectionRemarks_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VendorProposalApprovalDto() {
                this.paymentType = __runInitializers(this, _paymentType_initializers, void 0);
                this.vendorProposalApprovalStatus = (__runInitializers(this, _paymentType_extraInitializers), __runInitializers(this, _vendorProposalApprovalStatus_initializers, void 0));
                this.proposalRejectionRemarks = (__runInitializers(this, _vendorProposalApprovalStatus_extraInitializers), __runInitializers(this, _proposalRejectionRemarks_initializers, void 0));
                __runInitializers(this, _proposalRejectionRemarks_extraInitializers);
            }
            return VendorProposalApprovalDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentType_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Payment type (registration required for proposal approval)',
                    example: 'registration',
                    enum: ['registration', 'certification'],
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsIn)(['registration', 'certification'])];
            _vendorProposalApprovalStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: '1 = approve, 2 = reject (0 = pending is server-only)',
                    example: 1,
                    enum: [1, 2],
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsIn)([1, 2])];
            _proposalRejectionRemarks_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Optional reason when rejecting (max 500 characters)',
                    example: 'Quote does not match agreed scope',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _paymentType_decorators, { kind: "field", name: "paymentType", static: false, private: false, access: { has: function (obj) { return "paymentType" in obj; }, get: function (obj) { return obj.paymentType; }, set: function (obj, value) { obj.paymentType = value; } }, metadata: _metadata }, _paymentType_initializers, _paymentType_extraInitializers);
            __esDecorate(null, null, _vendorProposalApprovalStatus_decorators, { kind: "field", name: "vendorProposalApprovalStatus", static: false, private: false, access: { has: function (obj) { return "vendorProposalApprovalStatus" in obj; }, get: function (obj) { return obj.vendorProposalApprovalStatus; }, set: function (obj, value) { obj.vendorProposalApprovalStatus = value; } }, metadata: _metadata }, _vendorProposalApprovalStatus_initializers, _vendorProposalApprovalStatus_extraInitializers);
            __esDecorate(null, null, _proposalRejectionRemarks_decorators, { kind: "field", name: "proposalRejectionRemarks", static: false, private: false, access: { has: function (obj) { return "proposalRejectionRemarks" in obj; }, get: function (obj) { return obj.proposalRejectionRemarks; }, set: function (obj, value) { obj.proposalRejectionRemarks = value; } }, metadata: _metadata }, _proposalRejectionRemarks_initializers, _proposalRejectionRemarks_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VendorProposalApprovalDto = VendorProposalApprovalDto;
