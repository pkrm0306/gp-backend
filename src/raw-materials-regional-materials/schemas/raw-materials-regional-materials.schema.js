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
exports.RawMaterialsRegionalMaterialsSchema = exports.RawMaterialsRegionalMaterials = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var raw_materials_schema_props_1 = require("../../common/raw-materials/raw-materials-schema.props");
var RawMaterialsRegionalMaterials = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'raw_materials_regional_materials', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _rawMaterialsRegionalMaterialsId_decorators;
    var _rawMaterialsRegionalMaterialsId_initializers = [];
    var _rawMaterialsRegionalMaterialsId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _unitName_decorators;
    var _unitName_initializers = [];
    var _unitName_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _unit1_decorators;
    var _unit1_initializers = [];
    var _unit1_extraInitializers = [];
    var _yeardata1_decorators;
    var _yeardata1_initializers = [];
    var _yeardata1_extraInitializers = [];
    var _unit2_decorators;
    var _unit2_initializers = [];
    var _unit2_extraInitializers = [];
    var _yeardata2_decorators;
    var _yeardata2_initializers = [];
    var _yeardata2_extraInitializers = [];
    var _yeardata3_decorators;
    var _yeardata3_initializers = [];
    var _yeardata3_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var RawMaterialsRegionalMaterials = _classThis = /** @class */ (function () {
        function RawMaterialsRegionalMaterials_1() {
            this.rawMaterialsRegionalMaterialsId = __runInitializers(this, _rawMaterialsRegionalMaterialsId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _rawMaterialsRegionalMaterialsId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.vendorId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            // @Prop({ required: true })
            this.unitName = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _unitName_initializers, void 0));
            // @Prop({ required: true })
            this.year = (__runInitializers(this, _unitName_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            // @Prop({ required: true })
            this.unit1 = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _unit1_initializers, void 0));
            // @Prop({ required: true })
            this.yeardata1 = (__runInitializers(this, _unit1_extraInitializers), __runInitializers(this, _yeardata1_initializers, void 0));
            // @Prop({ required: true })
            this.unit2 = (__runInitializers(this, _yeardata1_extraInitializers), __runInitializers(this, _unit2_initializers, void 0));
            // @Prop({ required: true })
            this.yeardata2 = (__runInitializers(this, _unit2_extraInitializers), __runInitializers(this, _yeardata2_initializers, void 0));
            // @Prop({ required: true })
            this.yeardata3 = (__runInitializers(this, _yeardata2_extraInitializers), __runInitializers(this, _yeardata3_initializers, void 0));
            this.createdDate = (__runInitializers(this, _yeardata3_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return RawMaterialsRegionalMaterials_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsRegionalMaterials");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _rawMaterialsRegionalMaterialsId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _unitName_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _year_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _unit1_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _yeardata1_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _unit2_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _yeardata2_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _yeardata3_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _rawMaterialsRegionalMaterialsId_decorators, { kind: "field", name: "rawMaterialsRegionalMaterialsId", static: false, private: false, access: { has: function (obj) { return "rawMaterialsRegionalMaterialsId" in obj; }, get: function (obj) { return obj.rawMaterialsRegionalMaterialsId; }, set: function (obj, value) { obj.rawMaterialsRegionalMaterialsId = value; } }, metadata: _metadata }, _rawMaterialsRegionalMaterialsId_initializers, _rawMaterialsRegionalMaterialsId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _unitName_decorators, { kind: "field", name: "unitName", static: false, private: false, access: { has: function (obj) { return "unitName" in obj; }, get: function (obj) { return obj.unitName; }, set: function (obj, value) { obj.unitName = value; } }, metadata: _metadata }, _unitName_initializers, _unitName_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _unit1_decorators, { kind: "field", name: "unit1", static: false, private: false, access: { has: function (obj) { return "unit1" in obj; }, get: function (obj) { return obj.unit1; }, set: function (obj, value) { obj.unit1 = value; } }, metadata: _metadata }, _unit1_initializers, _unit1_extraInitializers);
        __esDecorate(null, null, _yeardata1_decorators, { kind: "field", name: "yeardata1", static: false, private: false, access: { has: function (obj) { return "yeardata1" in obj; }, get: function (obj) { return obj.yeardata1; }, set: function (obj, value) { obj.yeardata1 = value; } }, metadata: _metadata }, _yeardata1_initializers, _yeardata1_extraInitializers);
        __esDecorate(null, null, _unit2_decorators, { kind: "field", name: "unit2", static: false, private: false, access: { has: function (obj) { return "unit2" in obj; }, get: function (obj) { return obj.unit2; }, set: function (obj, value) { obj.unit2 = value; } }, metadata: _metadata }, _unit2_initializers, _unit2_extraInitializers);
        __esDecorate(null, null, _yeardata2_decorators, { kind: "field", name: "yeardata2", static: false, private: false, access: { has: function (obj) { return "yeardata2" in obj; }, get: function (obj) { return obj.yeardata2; }, set: function (obj, value) { obj.yeardata2 = value; } }, metadata: _metadata }, _yeardata2_initializers, _yeardata2_extraInitializers);
        __esDecorate(null, null, _yeardata3_decorators, { kind: "field", name: "yeardata3", static: false, private: false, access: { has: function (obj) { return "yeardata3" in obj; }, get: function (obj) { return obj.yeardata3; }, set: function (obj, value) { obj.yeardata3 = value; } }, metadata: _metadata }, _yeardata3_initializers, _yeardata3_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsRegionalMaterials = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsRegionalMaterials = _classThis;
}();
exports.RawMaterialsRegionalMaterials = RawMaterialsRegionalMaterials;
exports.RawMaterialsRegionalMaterialsSchema = mongoose_1.SchemaFactory.createForClass(RawMaterialsRegionalMaterials);
