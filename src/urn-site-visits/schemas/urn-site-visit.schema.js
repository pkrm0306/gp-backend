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
exports.UrnSiteVisitSchema = exports.UrnSiteVisit = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var UrnSiteVisit = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            collection: 'urn_site_visits',
            timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _addressLine1_decorators;
    var _addressLine1_initializers = [];
    var _addressLine1_extraInitializers = [];
    var _addressLine2_decorators;
    var _addressLine2_initializers = [];
    var _addressLine2_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _postalCode_decorators;
    var _postalCode_initializers = [];
    var _postalCode_extraInitializers = [];
    var _country_decorators;
    var _country_initializers = [];
    var _country_extraInitializers = [];
    var _auditType_decorators;
    var _auditType_initializers = [];
    var _auditType_extraInitializers = [];
    var _auditConductedOn_decorators;
    var _auditConductedOn_initializers = [];
    var _auditConductedOn_extraInitializers = [];
    var _conductedBy_decorators;
    var _conductedBy_initializers = [];
    var _conductedBy_extraInitializers = [];
    var _createdBy_decorators;
    var _createdBy_initializers = [];
    var _createdBy_extraInitializers = [];
    var _updatedBy_decorators;
    var _updatedBy_initializers = [];
    var _updatedBy_extraInitializers = [];
    var _isDeleted_decorators;
    var _isDeleted_initializers = [];
    var _isDeleted_extraInitializers = [];
    var UrnSiteVisit = _classThis = /** @class */ (function () {
        function UrnSiteVisit_1() {
            this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
            this.name = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.addressLine1 = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _addressLine1_initializers, void 0));
            this.addressLine2 = (__runInitializers(this, _addressLine1_extraInitializers), __runInitializers(this, _addressLine2_initializers, void 0));
            this.city = (__runInitializers(this, _addressLine2_extraInitializers), __runInitializers(this, _city_initializers, void 0));
            this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
            /** @deprecated Not collected — kept for legacy DB rows only; omitted from API responses. */
            this.postalCode = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
            /** Country name (free text; align with admin country dropdown labels). */
            this.country = (__runInitializers(this, _postalCode_extraInitializers), __runInitializers(this, _country_initializers, void 0));
            this.auditType = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _auditType_initializers, void 0));
            this.auditConductedOn = (__runInitializers(this, _auditType_extraInitializers), __runInitializers(this, _auditConductedOn_initializers, void 0));
            this.conductedBy = (__runInitializers(this, _auditConductedOn_extraInitializers), __runInitializers(this, _conductedBy_initializers, void 0));
            this.createdBy = (__runInitializers(this, _conductedBy_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.isDeleted = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _isDeleted_initializers, void 0));
            __runInitializers(this, _isDeleted_extraInitializers);
        }
        return UrnSiteVisit_1;
    }());
    __setFunctionName(_classThis, "UrnSiteVisit");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true, index: true })];
        _name_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _addressLine1_decorators = [(0, mongoose_1.Prop)({ required: true, default: '' })];
        _addressLine2_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _city_decorators = [(0, mongoose_1.Prop)({ required: true, default: '' })];
        _state_decorators = [(0, mongoose_1.Prop)({ required: true, default: '' })];
        _postalCode_decorators = [(0, mongoose_1.Prop)({ default: '' })];
        _country_decorators = [(0, mongoose_1.Prop)({ required: true, default: '' })];
        _auditType_decorators = [(0, mongoose_1.Prop)({ type: String, default: null })];
        _auditConductedOn_decorators = [(0, mongoose_1.Prop)({ type: Date, default: null })];
        _conductedBy_decorators = [(0, mongoose_1.Prop)({ type: String, default: null })];
        _createdBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null })];
        _updatedBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null })];
        _isDeleted_decorators = [(0, mongoose_1.Prop)({ default: false, index: true })];
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _addressLine1_decorators, { kind: "field", name: "addressLine1", static: false, private: false, access: { has: function (obj) { return "addressLine1" in obj; }, get: function (obj) { return obj.addressLine1; }, set: function (obj, value) { obj.addressLine1 = value; } }, metadata: _metadata }, _addressLine1_initializers, _addressLine1_extraInitializers);
        __esDecorate(null, null, _addressLine2_decorators, { kind: "field", name: "addressLine2", static: false, private: false, access: { has: function (obj) { return "addressLine2" in obj; }, get: function (obj) { return obj.addressLine2; }, set: function (obj, value) { obj.addressLine2 = value; } }, metadata: _metadata }, _addressLine2_initializers, _addressLine2_extraInitializers);
        __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
        __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
        __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: function (obj) { return "postalCode" in obj; }, get: function (obj) { return obj.postalCode; }, set: function (obj, value) { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
        __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: function (obj) { return "country" in obj; }, get: function (obj) { return obj.country; }, set: function (obj, value) { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
        __esDecorate(null, null, _auditType_decorators, { kind: "field", name: "auditType", static: false, private: false, access: { has: function (obj) { return "auditType" in obj; }, get: function (obj) { return obj.auditType; }, set: function (obj, value) { obj.auditType = value; } }, metadata: _metadata }, _auditType_initializers, _auditType_extraInitializers);
        __esDecorate(null, null, _auditConductedOn_decorators, { kind: "field", name: "auditConductedOn", static: false, private: false, access: { has: function (obj) { return "auditConductedOn" in obj; }, get: function (obj) { return obj.auditConductedOn; }, set: function (obj, value) { obj.auditConductedOn = value; } }, metadata: _metadata }, _auditConductedOn_initializers, _auditConductedOn_extraInitializers);
        __esDecorate(null, null, _conductedBy_decorators, { kind: "field", name: "conductedBy", static: false, private: false, access: { has: function (obj) { return "conductedBy" in obj; }, get: function (obj) { return obj.conductedBy; }, set: function (obj, value) { obj.conductedBy = value; } }, metadata: _metadata }, _conductedBy_initializers, _conductedBy_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: function (obj) { return "createdBy" in obj; }, get: function (obj) { return obj.createdBy; }, set: function (obj, value) { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: function (obj) { return "updatedBy" in obj; }, get: function (obj) { return obj.updatedBy; }, set: function (obj, value) { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _isDeleted_decorators, { kind: "field", name: "isDeleted", static: false, private: false, access: { has: function (obj) { return "isDeleted" in obj; }, get: function (obj) { return obj.isDeleted; }, set: function (obj, value) { obj.isDeleted = value; } }, metadata: _metadata }, _isDeleted_initializers, _isDeleted_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UrnSiteVisit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UrnSiteVisit = _classThis;
}();
exports.UrnSiteVisit = UrnSiteVisit;
exports.UrnSiteVisitSchema = mongoose_1.SchemaFactory.createForClass(UrnSiteVisit);
exports.UrnSiteVisitSchema.index({ urnNo: 1, createdAt: -1 });
exports.UrnSiteVisitSchema.index({ urnNo: 1, isDeleted: 1 });
exports.UrnSiteVisitSchema.index({ urnNo: 1, name: 1 });
