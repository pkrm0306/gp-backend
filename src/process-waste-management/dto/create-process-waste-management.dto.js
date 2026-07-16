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
exports.CreateProcessWasteManagementDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateProcessWasteManagementDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _wmImplementationDetails_decorators;
    var _wmImplementationDetails_initializers = [];
    var _wmImplementationDetails_extraInitializers = [];
    var _processWasteManagementStatus_decorators;
    var _processWasteManagementStatus_initializers = [];
    var _processWasteManagementStatus_extraInitializers = [];
    var _wmSupportingDocumentsFileName_decorators;
    var _wmSupportingDocumentsFileName_initializers = [];
    var _wmSupportingDocumentsFileName_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProcessWasteManagementDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.wmImplementationDetails = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _wmImplementationDetails_initializers, void 0));
                this.processWasteManagementStatus = (__runInitializers(this, _wmImplementationDetails_extraInitializers), __runInitializers(this, _processWasteManagementStatus_initializers, void 0));
                this.wmSupportingDocumentsFileName = (__runInitializers(this, _processWasteManagementStatus_extraInitializers), __runInitializers(this, _wmSupportingDocumentsFileName_initializers, void 0));
                __runInitializers(this, _wmSupportingDocumentsFileName_extraInitializers);
            }
            return CreateProcessWasteManagementDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _wmImplementationDetails_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Waste management implementation details (text)',
                    example: 'Implementation details for waste management',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _processWasteManagementStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Process waste management status (0=Pending, 1=Completed)',
                    example: 0,
                    required: false,
                    enum: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1])];
            _wmSupportingDocumentsFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Waste management supporting documents display name (required if uploading wmSupportingDocumentsFile)',
                    example: 'Waste Management Supporting Documents - March 2026',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _wmImplementationDetails_decorators, { kind: "field", name: "wmImplementationDetails", static: false, private: false, access: { has: function (obj) { return "wmImplementationDetails" in obj; }, get: function (obj) { return obj.wmImplementationDetails; }, set: function (obj, value) { obj.wmImplementationDetails = value; } }, metadata: _metadata }, _wmImplementationDetails_initializers, _wmImplementationDetails_extraInitializers);
            __esDecorate(null, null, _processWasteManagementStatus_decorators, { kind: "field", name: "processWasteManagementStatus", static: false, private: false, access: { has: function (obj) { return "processWasteManagementStatus" in obj; }, get: function (obj) { return obj.processWasteManagementStatus; }, set: function (obj, value) { obj.processWasteManagementStatus = value; } }, metadata: _metadata }, _processWasteManagementStatus_initializers, _processWasteManagementStatus_extraInitializers);
            __esDecorate(null, null, _wmSupportingDocumentsFileName_decorators, { kind: "field", name: "wmSupportingDocumentsFileName", static: false, private: false, access: { has: function (obj) { return "wmSupportingDocumentsFileName" in obj; }, get: function (obj) { return obj.wmSupportingDocumentsFileName; }, set: function (obj, value) { obj.wmSupportingDocumentsFileName = value; } }, metadata: _metadata }, _wmSupportingDocumentsFileName_initializers, _wmSupportingDocumentsFileName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProcessWasteManagementDto = CreateProcessWasteManagementDto;
