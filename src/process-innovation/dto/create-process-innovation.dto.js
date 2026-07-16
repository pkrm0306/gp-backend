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
exports.CreateProcessInnovationDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateProcessInnovationDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _innovationImplementationDetails_decorators;
    var _innovationImplementationDetails_initializers = [];
    var _innovationImplementationDetails_extraInitializers = [];
    var _processInnovationStatus_decorators;
    var _processInnovationStatus_initializers = [];
    var _processInnovationStatus_extraInitializers = [];
    var _innovationImplementationDocumentsFileName_decorators;
    var _innovationImplementationDocumentsFileName_initializers = [];
    var _innovationImplementationDocumentsFileName_extraInitializers = [];
    var _innovationDocumentTags_decorators;
    var _innovationDocumentTags_initializers = [];
    var _innovationDocumentTags_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProcessInnovationDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.innovationImplementationDetails = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _innovationImplementationDetails_initializers, void 0));
                this.processInnovationStatus = (__runInitializers(this, _innovationImplementationDetails_extraInitializers), __runInitializers(this, _processInnovationStatus_initializers, void 0));
                this.innovationImplementationDocumentsFileName = (__runInitializers(this, _processInnovationStatus_extraInitializers), __runInitializers(this, _innovationImplementationDocumentsFileName_initializers, void 0));
                /**
                 * Set by the controller after parsing multipart field `innovationDocumentTags`
                 * (JSON string or comma-separated), one value per file in upload order.
                 */
                this.innovationDocumentTags = (__runInitializers(this, _innovationImplementationDocumentsFileName_extraInitializers), __runInitializers(this, _innovationDocumentTags_initializers, void 0));
                __runInitializers(this, _innovationDocumentTags_extraInitializers);
            }
            return CreateProcessInnovationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _innovationImplementationDetails_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Innovation implementation details (text)',
                    example: 'Innovation implementation details',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _processInnovationStatus_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Process innovation status (0=Pending, 1=Completed)',
                    example: 0,
                    required: false,
                    enum: [0, 1],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1])];
            _innovationImplementationDocumentsFileName_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Innovation implementation documents display name (required if uploading innovationImplementationDocumentsFile)',
                    example: 'Innovation Implementation Documents - March 2026',
                    required: false,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _innovationDocumentTags_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Per-file tag: tech | process | social (same order as files). Set from body `innovationDocumentTags` JSON string.',
                    isArray: true,
                    enum: ['tech', 'process', 'social'],
                })];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _innovationImplementationDetails_decorators, { kind: "field", name: "innovationImplementationDetails", static: false, private: false, access: { has: function (obj) { return "innovationImplementationDetails" in obj; }, get: function (obj) { return obj.innovationImplementationDetails; }, set: function (obj, value) { obj.innovationImplementationDetails = value; } }, metadata: _metadata }, _innovationImplementationDetails_initializers, _innovationImplementationDetails_extraInitializers);
            __esDecorate(null, null, _processInnovationStatus_decorators, { kind: "field", name: "processInnovationStatus", static: false, private: false, access: { has: function (obj) { return "processInnovationStatus" in obj; }, get: function (obj) { return obj.processInnovationStatus; }, set: function (obj, value) { obj.processInnovationStatus = value; } }, metadata: _metadata }, _processInnovationStatus_initializers, _processInnovationStatus_extraInitializers);
            __esDecorate(null, null, _innovationImplementationDocumentsFileName_decorators, { kind: "field", name: "innovationImplementationDocumentsFileName", static: false, private: false, access: { has: function (obj) { return "innovationImplementationDocumentsFileName" in obj; }, get: function (obj) { return obj.innovationImplementationDocumentsFileName; }, set: function (obj, value) { obj.innovationImplementationDocumentsFileName = value; } }, metadata: _metadata }, _innovationImplementationDocumentsFileName_initializers, _innovationImplementationDocumentsFileName_extraInitializers);
            __esDecorate(null, null, _innovationDocumentTags_decorators, { kind: "field", name: "innovationDocumentTags", static: false, private: false, access: { has: function (obj) { return "innovationDocumentTags" in obj; }, get: function (obj) { return obj.innovationDocumentTags; }, set: function (obj, value) { obj.innovationDocumentTags = value; } }, metadata: _metadata }, _innovationDocumentTags_initializers, _innovationDocumentTags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProcessInnovationDto = CreateProcessInnovationDto;
