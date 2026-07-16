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
exports.CreateGrievanceDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateGrievanceDto = function () {
    var _a;
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _attachment_decorators;
    var _attachment_initializers = [];
    var _attachment_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateGrievanceDto() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                this.subject = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
                this.description = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.attachment = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _attachment_initializers, void 0));
                __runInitializers(this, _attachment_extraInitializers);
            }
            return CreateGrievanceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, swagger_1.ApiProperty)({ example: 'Data access request' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _subject_decorators = [(0, swagger_1.ApiProperty)({ example: 'Unauthorized data processing request' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Details of the grievance under DPDP Act.',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _attachment_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'uploads/grievances/evidence.pdf',
                    description: 'Optional attachment path or URL',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _attachment_decorators, { kind: "field", name: "attachment", static: false, private: false, access: { has: function (obj) { return "attachment" in obj; }, get: function (obj) { return obj.attachment; }, set: function (obj, value) { obj.attachment = value; } }, metadata: _metadata }, _attachment_initializers, _attachment_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateGrievanceDto = CreateGrievanceDto;
