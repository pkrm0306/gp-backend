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
exports.RawMaterialsGreenSupplySchema = exports.RawMaterialsGreenSupply = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var RawMaterialsGreenSupply = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'raw_materials_green_supply', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _rawMaterialsGreenSupplyId_decorators;
    var _rawMaterialsGreenSupplyId_initializers = [];
    var _rawMaterialsGreenSupplyId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _awarenessAndEducation_decorators;
    var _awarenessAndEducation_initializers = [];
    var _awarenessAndEducation_extraInitializers = [];
    var _measuresImplemented_decorators;
    var _measuresImplemented_initializers = [];
    var _measuresImplemented_extraInitializers = [];
    var _createdDate_decorators;
    var _createdDate_initializers = [];
    var _createdDate_extraInitializers = [];
    var _updatedDate_decorators;
    var _updatedDate_initializers = [];
    var _updatedDate_extraInitializers = [];
    var RawMaterialsGreenSupply = _classThis = /** @class */ (function () {
        function RawMaterialsGreenSupply_1() {
            this.rawMaterialsGreenSupplyId = __runInitializers(this, _rawMaterialsGreenSupplyId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _rawMaterialsGreenSupplyId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.vendorId = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.awarenessAndEducation = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _awarenessAndEducation_initializers, void 0));
            this.measuresImplemented = (__runInitializers(this, _awarenessAndEducation_extraInitializers), __runInitializers(this, _measuresImplemented_initializers, void 0));
            this.createdDate = (__runInitializers(this, _measuresImplemented_extraInitializers), __runInitializers(this, _createdDate_initializers, void 0));
            this.updatedDate = (__runInitializers(this, _createdDate_extraInitializers), __runInitializers(this, _updatedDate_initializers, void 0));
            __runInitializers(this, _updatedDate_extraInitializers);
        }
        return RawMaterialsGreenSupply_1;
    }());
    __setFunctionName(_classThis, "RawMaterialsGreenSupply");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _rawMaterialsGreenSupplyId_decorators = [(0, mongoose_1.Prop)({ required: true, unique: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _awarenessAndEducation_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _measuresImplemented_decorators = [(0, mongoose_1.Prop)({ required: false })];
        _createdDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedDate_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _rawMaterialsGreenSupplyId_decorators, { kind: "field", name: "rawMaterialsGreenSupplyId", static: false, private: false, access: { has: function (obj) { return "rawMaterialsGreenSupplyId" in obj; }, get: function (obj) { return obj.rawMaterialsGreenSupplyId; }, set: function (obj, value) { obj.rawMaterialsGreenSupplyId = value; } }, metadata: _metadata }, _rawMaterialsGreenSupplyId_initializers, _rawMaterialsGreenSupplyId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _awarenessAndEducation_decorators, { kind: "field", name: "awarenessAndEducation", static: false, private: false, access: { has: function (obj) { return "awarenessAndEducation" in obj; }, get: function (obj) { return obj.awarenessAndEducation; }, set: function (obj, value) { obj.awarenessAndEducation = value; } }, metadata: _metadata }, _awarenessAndEducation_initializers, _awarenessAndEducation_extraInitializers);
        __esDecorate(null, null, _measuresImplemented_decorators, { kind: "field", name: "measuresImplemented", static: false, private: false, access: { has: function (obj) { return "measuresImplemented" in obj; }, get: function (obj) { return obj.measuresImplemented; }, set: function (obj, value) { obj.measuresImplemented = value; } }, metadata: _metadata }, _measuresImplemented_initializers, _measuresImplemented_extraInitializers);
        __esDecorate(null, null, _createdDate_decorators, { kind: "field", name: "createdDate", static: false, private: false, access: { has: function (obj) { return "createdDate" in obj; }, get: function (obj) { return obj.createdDate; }, set: function (obj, value) { obj.createdDate = value; } }, metadata: _metadata }, _createdDate_initializers, _createdDate_extraInitializers);
        __esDecorate(null, null, _updatedDate_decorators, { kind: "field", name: "updatedDate", static: false, private: false, access: { has: function (obj) { return "updatedDate" in obj; }, get: function (obj) { return obj.updatedDate; }, set: function (obj, value) { obj.updatedDate = value; } }, metadata: _metadata }, _updatedDate_initializers, _updatedDate_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RawMaterialsGreenSupply = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RawMaterialsGreenSupply = _classThis;
}();
exports.RawMaterialsGreenSupply = RawMaterialsGreenSupply;
exports.RawMaterialsGreenSupplySchema = mongoose_1.SchemaFactory.createForClass(RawMaterialsGreenSupply);
