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
exports.RawMaterialsReduceEnvironmentalSchema = exports.RawMaterialsReduceEnvironmental = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var raw_materials_schema_props_1 = require("../../common/raw-materials/raw-materials-schema.props");
var RawMaterialsReduceEnvironmental = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'raw_materials_reduce_environmental', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _rawMaterialsReduceEnvironmentalId_decorators;
    var _rawMaterialsReduceEnvironmentalId_initializers = [];
    var _rawMaterialsReduceEnvironmentalId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _enhancementOfMinesLife_decorators;
    var _enhancementOfMinesLife_initializers = [];
    var _enhancementOfMinesLife_extraInitializers = [];
    var _topsoilConservation_decorators;
    var _topsoilConservation_initializers = [];
    var _topsoilConservation_extraInitializers = [];
    var _waterTableManagement_decorators;
    var _waterTableManagement_initializers = [];
    var _waterTableManagement_extraInitializers = [];
    var _restorationOfSpentMines_decorators;
    var _restorationOfSpentMines_initializers = [];
    var _restorationOfSpentMines_extraInitializers = [];
    var _greenBeltDevelopmentAndBioDiversity_decorators;
    var _greenBeltDevelopmentAndBioDiversity_initializers = [];
    var _greenBeltDevelopmentAndBioDiversity_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var RawMaterialsReduceEnvironmental = _classThis = /** @class */ (function () {
        function RawMaterialsReduceEnvironmental_1() {
            this.rawMaterialsReduceEnvironmentalId = __runInitializers(this, _rawMaterialsReduceEnvironmentalId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _rawMaterialsReduceEnvironmentalId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.vendorId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            // @Prop({ required: true })
            this.location = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            // @Prop({ required: true })
            this.enhancementOfMinesLife = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _enhancementOfMinesLife_initializers, void 0));
            // @Prop({ required: true })
            this.topsoilConservation = (__runInitializers(this, _enhancementOfMinesLife_extraInitializers), __runInitializers(this, _topsoilConservation_initializers, void 0));
            // @Prop({ required: true })
            this.waterTableManagement = (__runInitializers(this, _topsoilConservation_extraInitializers), __runInitializers(this, _waterTableManagement_initializers, void 0));
            // @Prop({ required: true })
            this.restorationOfSpentMines = (__runInitializers(this, _waterTableManagement_extraInitializers), __runInitializers(this, _restorationOfSpentMines_initializers, void 0));
            // @Prop({ required: true })
            this.greenBeltDevelopmentAndBioDiversity = (__runInitializers(this, _restorationOfSpentMines_extraInitializers), __runInitializers(this, _greenBeltDevelopmentAndBioDiversity_initializers, void 0));
            this.createdDate = (__runInitializers(this, _greenBeltDevelopmentAndBioDiversity_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return RawMaterialsReduceEnvironmental_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsReduceEnvironmental");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _rawMaterialsReduceEnvironmentalId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _location_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _enhancementOfMinesLife_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _topsoilConservation_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _waterTableManagement_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _restorationOfSpentMines_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _greenBeltDevelopmentAndBioDiversity_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _rawMaterialsReduceEnvironmentalId_decorators, { kind: "field", name: "rawMaterialsReduceEnvironmentalId", static: false, private: false, access: { has: function (obj) { return "rawMaterialsReduceEnvironmentalId" in obj; }, get: function (obj) { return obj.rawMaterialsReduceEnvironmentalId; }, set: function (obj, value) { obj.rawMaterialsReduceEnvironmentalId = value; } }, metadata: _metadata }, _rawMaterialsReduceEnvironmentalId_initializers, _rawMaterialsReduceEnvironmentalId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _enhancementOfMinesLife_decorators, { kind: "field", name: "enhancementOfMinesLife", static: false, private: false, access: { has: function (obj) { return "enhancementOfMinesLife" in obj; }, get: function (obj) { return obj.enhancementOfMinesLife; }, set: function (obj, value) { obj.enhancementOfMinesLife = value; } }, metadata: _metadata }, _enhancementOfMinesLife_initializers, _enhancementOfMinesLife_extraInitializers);
        __esDecorate(null, null, _topsoilConservation_decorators, { kind: "field", name: "topsoilConservation", static: false, private: false, access: { has: function (obj) { return "topsoilConservation" in obj; }, get: function (obj) { return obj.topsoilConservation; }, set: function (obj, value) { obj.topsoilConservation = value; } }, metadata: _metadata }, _topsoilConservation_initializers, _topsoilConservation_extraInitializers);
        __esDecorate(null, null, _waterTableManagement_decorators, { kind: "field", name: "waterTableManagement", static: false, private: false, access: { has: function (obj) { return "waterTableManagement" in obj; }, get: function (obj) { return obj.waterTableManagement; }, set: function (obj, value) { obj.waterTableManagement = value; } }, metadata: _metadata }, _waterTableManagement_initializers, _waterTableManagement_extraInitializers);
        __esDecorate(null, null, _restorationOfSpentMines_decorators, { kind: "field", name: "restorationOfSpentMines", static: false, private: false, access: { has: function (obj) { return "restorationOfSpentMines" in obj; }, get: function (obj) { return obj.restorationOfSpentMines; }, set: function (obj, value) { obj.restorationOfSpentMines = value; } }, metadata: _metadata }, _restorationOfSpentMines_initializers, _restorationOfSpentMines_extraInitializers);
        __esDecorate(null, null, _greenBeltDevelopmentAndBioDiversity_decorators, { kind: "field", name: "greenBeltDevelopmentAndBioDiversity", static: false, private: false, access: { has: function (obj) { return "greenBeltDevelopmentAndBioDiversity" in obj; }, get: function (obj) { return obj.greenBeltDevelopmentAndBioDiversity; }, set: function (obj, value) { obj.greenBeltDevelopmentAndBioDiversity = value; } }, metadata: _metadata }, _greenBeltDevelopmentAndBioDiversity_initializers, _greenBeltDevelopmentAndBioDiversity_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsReduceEnvironmental = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsReduceEnvironmental = _classThis;
}();
exports.RawMaterialsReduceEnvironmental = RawMaterialsReduceEnvironmental;
exports.RawMaterialsReduceEnvironmentalSchema = mongoose_1.SchemaFactory.createForClass(RawMaterialsReduceEnvironmental);
