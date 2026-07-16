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
exports.RawMaterialsAdditivesSchema = exports.RawMaterialsAdditives = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var raw_materials_schema_props_1 = require("../../common/raw-materials/raw-materials-schema.props");
var RawMaterialsAdditives = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'raw_materials_additives', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _rawMaterialsAdditivesId_decorators;
    var _rawMaterialsAdditivesId_initializers = [];
    var _rawMaterialsAdditivesId_extraInitializers = [];
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
    var _year1_decorators;
    var _year1_initializers = [];
    var _year1_extraInitializers = [];
    var _year1a_decorators;
    var _year1a_initializers = [];
    var _year1a_extraInitializers = [];
    var _year1b_decorators;
    var _year1b_initializers = [];
    var _year1b_extraInitializers = [];
    var _year1c_decorators;
    var _year1c_initializers = [];
    var _year1c_extraInitializers = [];
    var _year2_decorators;
    var _year2_initializers = [];
    var _year2_extraInitializers = [];
    var _year2a_decorators;
    var _year2a_initializers = [];
    var _year2a_extraInitializers = [];
    var _year2b_decorators;
    var _year2b_initializers = [];
    var _year2b_extraInitializers = [];
    var _year2c_decorators;
    var _year2c_initializers = [];
    var _year2c_extraInitializers = [];
    var _year3_decorators;
    var _year3_initializers = [];
    var _year3_extraInitializers = [];
    var _year3a_decorators;
    var _year3a_initializers = [];
    var _year3a_extraInitializers = [];
    var _year3b_decorators;
    var _year3b_initializers = [];
    var _year3b_extraInitializers = [];
    var _year3c_decorators;
    var _year3c_initializers = [];
    var _year3c_extraInitializers = [];
    var _psc_decorators;
    var _psc_initializers = [];
    var _psc_extraInitializers = [];
    var _coc_decorators;
    var _coc_initializers = [];
    var _coc_extraInitializers = [];
    var _percentcoc_decorators;
    var _percentcoc_initializers = [];
    var _percentcoc_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var RawMaterialsAdditives = _classThis = /** @class */ (function () {
        function RawMaterialsAdditives_1() {
            this.rawMaterialsAdditivesId = __runInitializers(this, _rawMaterialsAdditivesId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _rawMaterialsAdditivesId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.vendorId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            // @Prop({ required: true })
            this.unitName = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _unitName_initializers, void 0));
            // @Prop({ required: false })
            this.year = (__runInitializers(this, _unitName_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            // @Prop({ required: true })
            this.year1 = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _year1_initializers, void 0));
            // @Prop({ required: true })
            this.year1a = (__runInitializers(this, _year1_extraInitializers), __runInitializers(this, _year1a_initializers, void 0));
            // @Prop({ required: true })
            this.year1b = (__runInitializers(this, _year1a_extraInitializers), __runInitializers(this, _year1b_initializers, void 0));
            // @Prop({ required: true })
            this.year1c = (__runInitializers(this, _year1b_extraInitializers), __runInitializers(this, _year1c_initializers, void 0));
            // @Prop({ required: true })
            this.year2 = (__runInitializers(this, _year1c_extraInitializers), __runInitializers(this, _year2_initializers, void 0));
            // @Prop({ required: true })
            this.year2a = (__runInitializers(this, _year2_extraInitializers), __runInitializers(this, _year2a_initializers, void 0));
            // @Prop({ required: true })
            this.year2b = (__runInitializers(this, _year2a_extraInitializers), __runInitializers(this, _year2b_initializers, void 0));
            // @Prop({ required: true })
            this.year2c = (__runInitializers(this, _year2b_extraInitializers), __runInitializers(this, _year2c_initializers, void 0));
            // @Prop({ required: true })
            this.year3 = (__runInitializers(this, _year2c_extraInitializers), __runInitializers(this, _year3_initializers, void 0));
            // @Prop({ required: true })
            this.year3a = (__runInitializers(this, _year3_extraInitializers), __runInitializers(this, _year3a_initializers, void 0));
            // @Prop({ required: true })
            this.year3b = (__runInitializers(this, _year3a_extraInitializers), __runInitializers(this, _year3b_initializers, void 0));
            // @Prop({ required: true })
            this.year3c = (__runInitializers(this, _year3b_extraInitializers), __runInitializers(this, _year3c_initializers, void 0));
            // @Prop({ required: true })
            this.psc = (__runInitializers(this, _year3c_extraInitializers), __runInitializers(this, _psc_initializers, void 0));
            // @Prop({ required: true })
            this.coc = (__runInitializers(this, _psc_extraInitializers), __runInitializers(this, _coc_initializers, void 0));
            // @Prop({ required: true })
            this.percentcoc = (__runInitializers(this, _coc_extraInitializers), __runInitializers(this, _percentcoc_initializers, void 0));
            this.createdDate = (__runInitializers(this, _percentcoc_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return RawMaterialsAdditives_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsAdditives");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _rawMaterialsAdditivesId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _unitName_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _year_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year1_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year1a_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year1b_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year1c_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year2_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year2a_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year2b_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year2c_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year3_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year3a_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year3b_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _year3c_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_NUMBER)];
        _psc_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _coc_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _percentcoc_decorators = [(0, mongoose_1.Prop)(raw_materials_schema_props_1.RM_PARTIAL_TEXT)];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _rawMaterialsAdditivesId_decorators, { kind: "field", name: "rawMaterialsAdditivesId", static: false, private: false, access: { has: function (obj) { return "rawMaterialsAdditivesId" in obj; }, get: function (obj) { return obj.rawMaterialsAdditivesId; }, set: function (obj, value) { obj.rawMaterialsAdditivesId = value; } }, metadata: _metadata }, _rawMaterialsAdditivesId_initializers, _rawMaterialsAdditivesId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _unitName_decorators, { kind: "field", name: "unitName", static: false, private: false, access: { has: function (obj) { return "unitName" in obj; }, get: function (obj) { return obj.unitName; }, set: function (obj, value) { obj.unitName = value; } }, metadata: _metadata }, _unitName_initializers, _unitName_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _year1_decorators, { kind: "field", name: "year1", static: false, private: false, access: { has: function (obj) { return "year1" in obj; }, get: function (obj) { return obj.year1; }, set: function (obj, value) { obj.year1 = value; } }, metadata: _metadata }, _year1_initializers, _year1_extraInitializers);
        __esDecorate(null, null, _year1a_decorators, { kind: "field", name: "year1a", static: false, private: false, access: { has: function (obj) { return "year1a" in obj; }, get: function (obj) { return obj.year1a; }, set: function (obj, value) { obj.year1a = value; } }, metadata: _metadata }, _year1a_initializers, _year1a_extraInitializers);
        __esDecorate(null, null, _year1b_decorators, { kind: "field", name: "year1b", static: false, private: false, access: { has: function (obj) { return "year1b" in obj; }, get: function (obj) { return obj.year1b; }, set: function (obj, value) { obj.year1b = value; } }, metadata: _metadata }, _year1b_initializers, _year1b_extraInitializers);
        __esDecorate(null, null, _year1c_decorators, { kind: "field", name: "year1c", static: false, private: false, access: { has: function (obj) { return "year1c" in obj; }, get: function (obj) { return obj.year1c; }, set: function (obj, value) { obj.year1c = value; } }, metadata: _metadata }, _year1c_initializers, _year1c_extraInitializers);
        __esDecorate(null, null, _year2_decorators, { kind: "field", name: "year2", static: false, private: false, access: { has: function (obj) { return "year2" in obj; }, get: function (obj) { return obj.year2; }, set: function (obj, value) { obj.year2 = value; } }, metadata: _metadata }, _year2_initializers, _year2_extraInitializers);
        __esDecorate(null, null, _year2a_decorators, { kind: "field", name: "year2a", static: false, private: false, access: { has: function (obj) { return "year2a" in obj; }, get: function (obj) { return obj.year2a; }, set: function (obj, value) { obj.year2a = value; } }, metadata: _metadata }, _year2a_initializers, _year2a_extraInitializers);
        __esDecorate(null, null, _year2b_decorators, { kind: "field", name: "year2b", static: false, private: false, access: { has: function (obj) { return "year2b" in obj; }, get: function (obj) { return obj.year2b; }, set: function (obj, value) { obj.year2b = value; } }, metadata: _metadata }, _year2b_initializers, _year2b_extraInitializers);
        __esDecorate(null, null, _year2c_decorators, { kind: "field", name: "year2c", static: false, private: false, access: { has: function (obj) { return "year2c" in obj; }, get: function (obj) { return obj.year2c; }, set: function (obj, value) { obj.year2c = value; } }, metadata: _metadata }, _year2c_initializers, _year2c_extraInitializers);
        __esDecorate(null, null, _year3_decorators, { kind: "field", name: "year3", static: false, private: false, access: { has: function (obj) { return "year3" in obj; }, get: function (obj) { return obj.year3; }, set: function (obj, value) { obj.year3 = value; } }, metadata: _metadata }, _year3_initializers, _year3_extraInitializers);
        __esDecorate(null, null, _year3a_decorators, { kind: "field", name: "year3a", static: false, private: false, access: { has: function (obj) { return "year3a" in obj; }, get: function (obj) { return obj.year3a; }, set: function (obj, value) { obj.year3a = value; } }, metadata: _metadata }, _year3a_initializers, _year3a_extraInitializers);
        __esDecorate(null, null, _year3b_decorators, { kind: "field", name: "year3b", static: false, private: false, access: { has: function (obj) { return "year3b" in obj; }, get: function (obj) { return obj.year3b; }, set: function (obj, value) { obj.year3b = value; } }, metadata: _metadata }, _year3b_initializers, _year3b_extraInitializers);
        __esDecorate(null, null, _year3c_decorators, { kind: "field", name: "year3c", static: false, private: false, access: { has: function (obj) { return "year3c" in obj; }, get: function (obj) { return obj.year3c; }, set: function (obj, value) { obj.year3c = value; } }, metadata: _metadata }, _year3c_initializers, _year3c_extraInitializers);
        __esDecorate(null, null, _psc_decorators, { kind: "field", name: "psc", static: false, private: false, access: { has: function (obj) { return "psc" in obj; }, get: function (obj) { return obj.psc; }, set: function (obj, value) { obj.psc = value; } }, metadata: _metadata }, _psc_initializers, _psc_extraInitializers);
        __esDecorate(null, null, _coc_decorators, { kind: "field", name: "coc", static: false, private: false, access: { has: function (obj) { return "coc" in obj; }, get: function (obj) { return obj.coc; }, set: function (obj, value) { obj.coc = value; } }, metadata: _metadata }, _coc_initializers, _coc_extraInitializers);
        __esDecorate(null, null, _percentcoc_decorators, { kind: "field", name: "percentcoc", static: false, private: false, access: { has: function (obj) { return "percentcoc" in obj; }, get: function (obj) { return obj.percentcoc; }, set: function (obj, value) { obj.percentcoc = value; } }, metadata: _metadata }, _percentcoc_initializers, _percentcoc_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsAdditives = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsAdditives = _classThis;
}();
exports.RawMaterialsAdditives = RawMaterialsAdditives;
exports.RawMaterialsAdditivesSchema = mongoose_1.SchemaFactory.createForClass(RawMaterialsAdditives);
