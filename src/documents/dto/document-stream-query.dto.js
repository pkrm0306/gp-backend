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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentStreamQueryDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var document_version_constants_1 = require("../constants/document-version.constants");
var DocumentStreamQueryDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _processType_decorators;
    var _processType_initializers = [];
    var _processType_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _sectionKey_decorators;
    var _sectionKey_initializers = [];
    var _sectionKey_extraInitializers = [];
    var _subsectionKey_decorators;
    var _subsectionKey_initializers = [];
    var _subsectionKey_extraInitializers = [];
    var _slotKey_decorators;
    var _slotKey_initializers = [];
    var _slotKey_extraInitializers = [];
    var _anchorProductDocumentId_decorators;
    var _anchorProductDocumentId_initializers = [];
    var _anchorProductDocumentId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DocumentStreamQueryDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.processType = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _processType_initializers, void 0));
                this.renewalCycleId = (__runInitializers(this, _processType_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
                this.sectionKey = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _sectionKey_initializers, void 0));
                this.subsectionKey = (__runInitializers(this, _sectionKey_extraInitializers), __runInitializers(this, _subsectionKey_initializers, void 0));
                this.slotKey = (__runInitializers(this, _subsectionKey_extraInitializers), __runInitializers(this, _slotKey_initializers, void 0));
                this.anchorProductDocumentId = (__runInitializers(this, _slotKey_extraInitializers), __runInitializers(this, _anchorProductDocumentId_initializers, void 0));
                __runInitializers(this, _anchorProductDocumentId_extraInitializers);
            }
            return DocumentStreamQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({ example: 'URN-20260305124230' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _processType_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: document_version_constants_1.DOCUMENT_PROCESS_TYPE_VALUES, default: 'initial' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(__spreadArray([], document_version_constants_1.DOCUMENT_PROCESS_TYPE_VALUES, true))];
            _renewalCycleId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Renewal cycle ObjectId when processType is renewal' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sectionKey_decorators = [(0, swagger_1.ApiProperty)({ example: 'product_design' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _subsectionKey_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'supporting_documents' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _slotKey_decorators = [(0, swagger_1.ApiProperty)({ example: '1001', description: 'Logical slot key for the document stream' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _anchorProductDocumentId_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Renew MP/WM: productDocumentId for per-file history scoping and legacy stream fallback',
                }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsInt)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _processType_decorators, { kind: "field", name: "processType", static: false, private: false, access: { has: function (obj) { return "processType" in obj; }, get: function (obj) { return obj.processType; }, set: function (obj, value) { obj.processType = value; } }, metadata: _metadata }, _processType_initializers, _processType_extraInitializers);
            __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
            __esDecorate(null, null, _sectionKey_decorators, { kind: "field", name: "sectionKey", static: false, private: false, access: { has: function (obj) { return "sectionKey" in obj; }, get: function (obj) { return obj.sectionKey; }, set: function (obj, value) { obj.sectionKey = value; } }, metadata: _metadata }, _sectionKey_initializers, _sectionKey_extraInitializers);
            __esDecorate(null, null, _subsectionKey_decorators, { kind: "field", name: "subsectionKey", static: false, private: false, access: { has: function (obj) { return "subsectionKey" in obj; }, get: function (obj) { return obj.subsectionKey; }, set: function (obj, value) { obj.subsectionKey = value; } }, metadata: _metadata }, _subsectionKey_initializers, _subsectionKey_extraInitializers);
            __esDecorate(null, null, _slotKey_decorators, { kind: "field", name: "slotKey", static: false, private: false, access: { has: function (obj) { return "slotKey" in obj; }, get: function (obj) { return obj.slotKey; }, set: function (obj, value) { obj.slotKey = value; } }, metadata: _metadata }, _slotKey_initializers, _slotKey_extraInitializers);
            __esDecorate(null, null, _anchorProductDocumentId_decorators, { kind: "field", name: "anchorProductDocumentId", static: false, private: false, access: { has: function (obj) { return "anchorProductDocumentId" in obj; }, get: function (obj) { return obj.anchorProductDocumentId; }, set: function (obj, value) { obj.anchorProductDocumentId = value; } }, metadata: _metadata }, _anchorProductDocumentId_initializers, _anchorProductDocumentId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DocumentStreamQueryDto = DocumentStreamQueryDto;
