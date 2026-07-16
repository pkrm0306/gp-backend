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
exports.PlantDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var PlantDto = function () {
    var _a;
    var _plantName_decorators;
    var _plantName_initializers = [];
    var _plantName_extraInitializers = [];
    var _plantLocation_decorators;
    var _plantLocation_initializers = [];
    var _plantLocation_extraInitializers = [];
    var _countryId_decorators;
    var _countryId_initializers = [];
    var _countryId_extraInitializers = [];
    var _stateId_decorators;
    var _stateId_initializers = [];
    var _stateId_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PlantDto() {
                this.plantName = __runInitializers(this, _plantName_initializers, void 0);
                this.plantLocation = (__runInitializers(this, _plantName_extraInitializers), __runInitializers(this, _plantLocation_initializers, void 0));
                this.countryId = (__runInitializers(this, _plantLocation_extraInitializers), __runInitializers(this, _countryId_initializers, void 0));
                this.stateId = (__runInitializers(this, _countryId_extraInitializers), __runInitializers(this, _stateId_initializers, void 0));
                this.city = (__runInitializers(this, _stateId_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                __runInitializers(this, _city_extraInitializers);
            }
            return PlantDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _plantName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plant name', example: 'Plant A' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _plantLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plant location', example: 'Industrial Area' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _countryId_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Country ID',
                    example: '507f1f77bcf86cd799439013',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsMongoId)()];
            _stateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'State ID', example: '6996dcda14999ba875c7d646' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsMongoId)()];
            _city_decorators = [(0, swagger_1.ApiProperty)({ description: 'City', example: 'Mumbai' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _plantName_decorators, { kind: "field", name: "plantName", static: false, private: false, access: { has: function (obj) { return "plantName" in obj; }, get: function (obj) { return obj.plantName; }, set: function (obj, value) { obj.plantName = value; } }, metadata: _metadata }, _plantName_initializers, _plantName_extraInitializers);
            __esDecorate(null, null, _plantLocation_decorators, { kind: "field", name: "plantLocation", static: false, private: false, access: { has: function (obj) { return "plantLocation" in obj; }, get: function (obj) { return obj.plantLocation; }, set: function (obj, value) { obj.plantLocation = value; } }, metadata: _metadata }, _plantLocation_initializers, _plantLocation_extraInitializers);
            __esDecorate(null, null, _countryId_decorators, { kind: "field", name: "countryId", static: false, private: false, access: { has: function (obj) { return "countryId" in obj; }, get: function (obj) { return obj.countryId; }, set: function (obj, value) { obj.countryId = value; } }, metadata: _metadata }, _countryId_initializers, _countryId_extraInitializers);
            __esDecorate(null, null, _stateId_decorators, { kind: "field", name: "stateId", static: false, private: false, access: { has: function (obj) { return "stateId" in obj; }, get: function (obj) { return obj.stateId; }, set: function (obj, value) { obj.stateId = value; } }, metadata: _metadata }, _stateId_initializers, _stateId_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PlantDto = PlantDto;
