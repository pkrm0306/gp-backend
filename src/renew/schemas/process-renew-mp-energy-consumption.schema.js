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
exports.ProcessRenewMpEnergyConsumptionSchema = exports.ProcessRenewMpEnergyConsumption = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ProcessRenewMpEnergyConsumption = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            collection: 'process_renew_mp_energy_consumption',
            timestamps: false,
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _processRenewMpEnergyConsumptionId_decorators;
    var _processRenewMpEnergyConsumptionId_initializers = [];
    var _processRenewMpEnergyConsumptionId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _processRenewManufacturingId_decorators;
    var _processRenewManufacturingId_initializers = [];
    var _processRenewManufacturingId_extraInitializers = [];
    var _energyConservationProject_decorators;
    var _energyConservationProject_initializers = [];
    var _energyConservationProject_extraInitializers = [];
    var _annualEnergySavings_decorators;
    var _annualEnergySavings_initializers = [];
    var _annualEnergySavings_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var ProcessRenewMpEnergyConsumption = _classThis = /** @class */ (function () {
        function ProcessRenewMpEnergyConsumption_1() {
            this.processRenewMpEnergyConsumptionId = __runInitializers(this, _processRenewMpEnergyConsumptionId_initializers, void 0);
            this.vendorId = (__runInitializers(this, _processRenewMpEnergyConsumptionId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.urnNo = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.processRenewManufacturingId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _processRenewManufacturingId_initializers, void 0));
            this.energyConservationProject = (__runInitializers(this, _processRenewManufacturingId_extraInitializers), __runInitializers(this, _energyConservationProject_initializers, void 0));
            this.annualEnergySavings = (__runInitializers(this, _energyConservationProject_extraInitializers), __runInitializers(this, _annualEnergySavings_initializers, void 0));
            this.createdDate = (__runInitializers(this, _annualEnergySavings_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return ProcessRenewMpEnergyConsumption_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewMpEnergyConsumption");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processRenewMpEnergyConsumptionId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Manufacturer', required: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true, index: true })];
        _processRenewManufacturingId_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number })];
        _energyConservationProject_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _annualEnergySavings_decorators = [(0, mongoose_1.Prop)({ required: false, type: Number })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _processRenewMpEnergyConsumptionId_decorators, { kind: "field", name: "processRenewMpEnergyConsumptionId", static: false, private: false, access: { has: function (obj) { return "processRenewMpEnergyConsumptionId" in obj; }, get: function (obj) { return obj.processRenewMpEnergyConsumptionId; }, set: function (obj, value) { obj.processRenewMpEnergyConsumptionId = value; } }, metadata: _metadata }, _processRenewMpEnergyConsumptionId_initializers, _processRenewMpEnergyConsumptionId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _processRenewManufacturingId_decorators, { kind: "field", name: "processRenewManufacturingId", static: false, private: false, access: { has: function (obj) { return "processRenewManufacturingId" in obj; }, get: function (obj) { return obj.processRenewManufacturingId; }, set: function (obj, value) { obj.processRenewManufacturingId = value; } }, metadata: _metadata }, _processRenewManufacturingId_initializers, _processRenewManufacturingId_extraInitializers);
        __esDecorate(null, null, _energyConservationProject_decorators, { kind: "field", name: "energyConservationProject", static: false, private: false, access: { has: function (obj) { return "energyConservationProject" in obj; }, get: function (obj) { return obj.energyConservationProject; }, set: function (obj, value) { obj.energyConservationProject = value; } }, metadata: _metadata }, _energyConservationProject_initializers, _energyConservationProject_extraInitializers);
        __esDecorate(null, null, _annualEnergySavings_decorators, { kind: "field", name: "annualEnergySavings", static: false, private: false, access: { has: function (obj) { return "annualEnergySavings" in obj; }, get: function (obj) { return obj.annualEnergySavings; }, set: function (obj, value) { obj.annualEnergySavings = value; } }, metadata: _metadata }, _annualEnergySavings_initializers, _annualEnergySavings_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewMpEnergyConsumption = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewMpEnergyConsumption = _classThis;
}();
exports.ProcessRenewMpEnergyConsumption = ProcessRenewMpEnergyConsumption;
exports.ProcessRenewMpEnergyConsumptionSchema = mongoose_1.SchemaFactory.createForClass(ProcessRenewMpEnergyConsumption);
