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
exports.ProcessRenewManufacturingSchema = exports.ProcessRenewManufacturing = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ProcessRenewManufacturing = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'process_renew_manufacturing', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _processRenewManufacturingId_decorators;
    var _processRenewManufacturingId_initializers = [];
    var _processRenewManufacturingId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _energyConservationSupportingDocuments_decorators;
    var _energyConservationSupportingDocuments_initializers = [];
    var _energyConservationSupportingDocuments_extraInitializers = [];
    var _portableWaterDemand_decorators;
    var _portableWaterDemand_initializers = [];
    var _portableWaterDemand_extraInitializers = [];
    var _rainWaterHarvesting_decorators;
    var _rainWaterHarvesting_initializers = [];
    var _rainWaterHarvesting_extraInitializers = [];
    var _beyondTheFenceInitiatives_decorators;
    var _beyondTheFenceInitiatives_initializers = [];
    var _beyondTheFenceInitiatives_extraInitializers = [];
    var _totalEnergyConsumption_decorators;
    var _totalEnergyConsumption_initializers = [];
    var _totalEnergyConsumption_extraInitializers = [];
    var _energyConsumptionDocuments_decorators;
    var _energyConsumptionDocuments_initializers = [];
    var _energyConsumptionDocuments_extraInitializers = [];
    var _processManufacturingStatus_decorators;
    var _processManufacturingStatus_initializers = [];
    var _processManufacturingStatus_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var ProcessRenewManufacturing = _classThis = /** @class */ (function () {
        function ProcessRenewManufacturing_1() {
            this.processRenewManufacturingId = __runInitializers(this, _processRenewManufacturingId_initializers, void 0);
            this.vendorId = (__runInitializers(this, _processRenewManufacturingId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.urnNo = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.renewalCycleId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
            this.energyConservationSupportingDocuments = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _energyConservationSupportingDocuments_initializers, void 0));
            this.portableWaterDemand = (__runInitializers(this, _energyConservationSupportingDocuments_extraInitializers), __runInitializers(this, _portableWaterDemand_initializers, void 0));
            this.rainWaterHarvesting = (__runInitializers(this, _portableWaterDemand_extraInitializers), __runInitializers(this, _rainWaterHarvesting_initializers, void 0));
            this.beyondTheFenceInitiatives = (__runInitializers(this, _rainWaterHarvesting_extraInitializers), __runInitializers(this, _beyondTheFenceInitiatives_initializers, void 0));
            this.totalEnergyConsumption = (__runInitializers(this, _beyondTheFenceInitiatives_extraInitializers), __runInitializers(this, _totalEnergyConsumption_initializers, void 0));
            this.energyConsumptionDocuments = (__runInitializers(this, _totalEnergyConsumption_extraInitializers), __runInitializers(this, _energyConsumptionDocuments_initializers, void 0));
            this.processManufacturingStatus = (__runInitializers(this, _energyConsumptionDocuments_extraInitializers), __runInitializers(this, _processManufacturingStatus_initializers, void 0));
            this.createdDate = (__runInitializers(this, _processManufacturingStatus_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return ProcessRenewManufacturing_1;
    }());
    __setFunctionName(_classThis, "ProcessRenewManufacturing");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processRenewManufacturingId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Manufacturer', required: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _renewalCycleId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'RenewalCycle' })];
        _energyConservationSupportingDocuments_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 0 })];
        _portableWaterDemand_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _rainWaterHarvesting_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _beyondTheFenceInitiatives_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _totalEnergyConsumption_decorators = [(0, mongoose_1.Prop)({ required: false, type: Number })];
        _energyConsumptionDocuments_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 0 })];
        _processManufacturingStatus_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number, default: 0 })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _processRenewManufacturingId_decorators, { kind: "field", name: "processRenewManufacturingId", static: false, private: false, access: { has: function (obj) { return "processRenewManufacturingId" in obj; }, get: function (obj) { return obj.processRenewManufacturingId; }, set: function (obj, value) { obj.processRenewManufacturingId = value; } }, metadata: _metadata }, _processRenewManufacturingId_initializers, _processRenewManufacturingId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
        __esDecorate(null, null, _energyConservationSupportingDocuments_decorators, { kind: "field", name: "energyConservationSupportingDocuments", static: false, private: false, access: { has: function (obj) { return "energyConservationSupportingDocuments" in obj; }, get: function (obj) { return obj.energyConservationSupportingDocuments; }, set: function (obj, value) { obj.energyConservationSupportingDocuments = value; } }, metadata: _metadata }, _energyConservationSupportingDocuments_initializers, _energyConservationSupportingDocuments_extraInitializers);
        __esDecorate(null, null, _portableWaterDemand_decorators, { kind: "field", name: "portableWaterDemand", static: false, private: false, access: { has: function (obj) { return "portableWaterDemand" in obj; }, get: function (obj) { return obj.portableWaterDemand; }, set: function (obj, value) { obj.portableWaterDemand = value; } }, metadata: _metadata }, _portableWaterDemand_initializers, _portableWaterDemand_extraInitializers);
        __esDecorate(null, null, _rainWaterHarvesting_decorators, { kind: "field", name: "rainWaterHarvesting", static: false, private: false, access: { has: function (obj) { return "rainWaterHarvesting" in obj; }, get: function (obj) { return obj.rainWaterHarvesting; }, set: function (obj, value) { obj.rainWaterHarvesting = value; } }, metadata: _metadata }, _rainWaterHarvesting_initializers, _rainWaterHarvesting_extraInitializers);
        __esDecorate(null, null, _beyondTheFenceInitiatives_decorators, { kind: "field", name: "beyondTheFenceInitiatives", static: false, private: false, access: { has: function (obj) { return "beyondTheFenceInitiatives" in obj; }, get: function (obj) { return obj.beyondTheFenceInitiatives; }, set: function (obj, value) { obj.beyondTheFenceInitiatives = value; } }, metadata: _metadata }, _beyondTheFenceInitiatives_initializers, _beyondTheFenceInitiatives_extraInitializers);
        __esDecorate(null, null, _totalEnergyConsumption_decorators, { kind: "field", name: "totalEnergyConsumption", static: false, private: false, access: { has: function (obj) { return "totalEnergyConsumption" in obj; }, get: function (obj) { return obj.totalEnergyConsumption; }, set: function (obj, value) { obj.totalEnergyConsumption = value; } }, metadata: _metadata }, _totalEnergyConsumption_initializers, _totalEnergyConsumption_extraInitializers);
        __esDecorate(null, null, _energyConsumptionDocuments_decorators, { kind: "field", name: "energyConsumptionDocuments", static: false, private: false, access: { has: function (obj) { return "energyConsumptionDocuments" in obj; }, get: function (obj) { return obj.energyConsumptionDocuments; }, set: function (obj, value) { obj.energyConsumptionDocuments = value; } }, metadata: _metadata }, _energyConsumptionDocuments_initializers, _energyConsumptionDocuments_extraInitializers);
        __esDecorate(null, null, _processManufacturingStatus_decorators, { kind: "field", name: "processManufacturingStatus", static: false, private: false, access: { has: function (obj) { return "processManufacturingStatus" in obj; }, get: function (obj) { return obj.processManufacturingStatus; }, set: function (obj, value) { obj.processManufacturingStatus = value; } }, metadata: _metadata }, _processManufacturingStatus_initializers, _processManufacturingStatus_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcessRenewManufacturing = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcessRenewManufacturing = _classThis;
}();
exports.ProcessRenewManufacturing = ProcessRenewManufacturing;
exports.ProcessRenewManufacturingSchema = mongoose_1.SchemaFactory.createForClass(ProcessRenewManufacturing);
exports.ProcessRenewManufacturingSchema.index({ urnNo: 1, renewalCycleId: 1 }, { unique: true, name: 'uniq_process_renew_manufacturing_urn_cycle' });
