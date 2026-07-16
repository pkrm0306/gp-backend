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
exports.RespondGrievanceDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var grievance_schema_1 = require("../schemas/grievance.schema");
var RespondGrievanceDto = function () {
    var _a;
    var _adminResponse_decorators;
    var _adminResponse_initializers = [];
    var _adminResponse_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RespondGrievanceDto() {
                this.adminResponse = __runInitializers(this, _adminResponse_initializers, void 0);
                this.status = (__runInitializers(this, _adminResponse_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return RespondGrievanceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _adminResponse_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'We have reviewed your request and taken appropriate action.',
                    description: 'Required for the first response. Optional when closing an already responded grievance.',
                }), (0, class_validator_1.ValidateIf)(function (o) { return o.status === grievance_schema_1.GrievanceStatus.Responded; }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'adminResponse is required' }), (0, class_validator_1.IsOptional)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({
                    enum: [grievance_schema_1.GrievanceStatus.Responded, grievance_schema_1.GrievanceStatus.Closed],
                    example: grievance_schema_1.GrievanceStatus.Responded,
                    description: 'Set to Responded or Closed when submitting a response',
                }), (0, class_validator_1.IsIn)([grievance_schema_1.GrievanceStatus.Responded, grievance_schema_1.GrievanceStatus.Closed], {
                    message: 'status must be Responded or Closed',
                })];
            __esDecorate(null, null, _adminResponse_decorators, { kind: "field", name: "adminResponse", static: false, private: false, access: { has: function (obj) { return "adminResponse" in obj; }, get: function (obj) { return obj.adminResponse; }, set: function (obj, value) { obj.adminResponse = value; } }, metadata: _metadata }, _adminResponse_initializers, _adminResponse_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RespondGrievanceDto = RespondGrievanceDto;
