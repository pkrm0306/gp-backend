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
exports.CreateProcessLifeCycleApproachDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateProcessLifeCycleApproachDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _lifeCycleImplementationDetails_decorators;
    var _lifeCycleImplementationDetails_initializers = [];
    var _lifeCycleImplementationDetails_extraInitializers = [];
    var _processLifeCycleApproachStatus_decorators;
    var _processLifeCycleApproachStatus_initializers = [];
    var _processLifeCycleApproachStatus_extraInitializers = [];
    var _lifeCycleAssesmentReportsFileName_decorators;
    var _lifeCycleAssesmentReportsFileName_initializers = [];
    var _lifeCycleAssesmentReportsFileName_extraInitializers = [];
    var _lifeCycleImplementationDocumentsFileName_decorators;
    var _lifeCycleImplementationDocumentsFileName_initializers = [];
    var _lifeCycleImplementationDocumentsFileName_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProcessLifeCycleApproachDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.lifeCycleImplementationDetails = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _lifeCycleImplementationDetails_initializers, void 0));
                this.processLifeCycleApproachStatus = (__runInitializers(this, _lifeCycleImplementationDetails_extraInitializers), __runInitializers(this, _processLifeCycleApproachStatus_initializers, void 0));
                this.lifeCycleAssesmentReportsFileName = (__runInitializers(this, _processLifeCycleApproachStatus_extraInitializers), __runInitializers(this, _lifeCycleAssesmentReportsFileName_initializers, void 0));
                this.lifeCycleImplementationDocumentsFileName = (__runInitializers(this, _lifeCycleAssesmentReportsFileName_extraInitializers), __runInitializers(this, _lifeCycleImplementationDocumentsFileName_initializers, void 0));
                __runInitializers(this, _lifeCycleImplementationDocumentsFileName_extraInitializers);
            }
            return CreateProcessLifeCycleApproachDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _lifeCycleImplementationDetails_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Life cycle implementation details (text)',
                    example: 'Implementation details for life cycle approach',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _processLifeCycleApproachStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Process life cycle approach status (0=Pending, 1=Completed)',
                    example: 0,
                    required: false,
                    enum: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1])];
            _lifeCycleAssesmentReportsFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Life cycle assessment reports display name (required if uploading lifeCycleAssesmentReportsFile)',
                    example: 'Life Cycle Assessment Reports - March 2026',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _lifeCycleImplementationDocumentsFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Life cycle implementation documents display name (required if uploading lifeCycleImplementationDocumentsFile)',
                    example: 'Life Cycle Implementation Documents - March 2026',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _lifeCycleImplementationDetails_decorators, { kind: "field", name: "lifeCycleImplementationDetails", static: false, private: false, access: { has: function (obj) { return "lifeCycleImplementationDetails" in obj; }, get: function (obj) { return obj.lifeCycleImplementationDetails; }, set: function (obj, value) { obj.lifeCycleImplementationDetails = value; } }, metadata: _metadata }, _lifeCycleImplementationDetails_initializers, _lifeCycleImplementationDetails_extraInitializers);
            __esDecorate(null, null, _processLifeCycleApproachStatus_decorators, { kind: "field", name: "processLifeCycleApproachStatus", static: false, private: false, access: { has: function (obj) { return "processLifeCycleApproachStatus" in obj; }, get: function (obj) { return obj.processLifeCycleApproachStatus; }, set: function (obj, value) { obj.processLifeCycleApproachStatus = value; } }, metadata: _metadata }, _processLifeCycleApproachStatus_initializers, _processLifeCycleApproachStatus_extraInitializers);
            __esDecorate(null, null, _lifeCycleAssesmentReportsFileName_decorators, { kind: "field", name: "lifeCycleAssesmentReportsFileName", static: false, private: false, access: { has: function (obj) { return "lifeCycleAssesmentReportsFileName" in obj; }, get: function (obj) { return obj.lifeCycleAssesmentReportsFileName; }, set: function (obj, value) { obj.lifeCycleAssesmentReportsFileName = value; } }, metadata: _metadata }, _lifeCycleAssesmentReportsFileName_initializers, _lifeCycleAssesmentReportsFileName_extraInitializers);
            __esDecorate(null, null, _lifeCycleImplementationDocumentsFileName_decorators, { kind: "field", name: "lifeCycleImplementationDocumentsFileName", static: false, private: false, access: { has: function (obj) { return "lifeCycleImplementationDocumentsFileName" in obj; }, get: function (obj) { return obj.lifeCycleImplementationDocumentsFileName; }, set: function (obj, value) { obj.lifeCycleImplementationDocumentsFileName = value; } }, metadata: _metadata }, _lifeCycleImplementationDocumentsFileName_initializers, _lifeCycleImplementationDocumentsFileName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProcessLifeCycleApproachDto = CreateProcessLifeCycleApproachDto;
