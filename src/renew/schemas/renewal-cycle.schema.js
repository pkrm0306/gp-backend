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
exports.RenewalCycleSchema = exports.RenewalCycle = exports.RenewalCycleStatus = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var RenewalCycleStatus;
(function (RenewalCycleStatus) {
    RenewalCycleStatus["IN_PROGRESS"] = "in_progress";
    RenewalCycleStatus["COMPLETED"] = "completed";
    RenewalCycleStatus["CANCELLED"] = "cancelled";
})(RenewalCycleStatus || (exports.RenewalCycleStatus = RenewalCycleStatus = {}));
var RenewalCycle = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'renewal_cycles', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _cycleNo_decorators;
    var _cycleNo_initializers = [];
    var _cycleNo_extraInitializers = [];
    var _paymentId_decorators;
    var _paymentId_initializers = [];
    var _paymentId_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _manufacturerId_decorators;
    var _manufacturerId_initializers = [];
    var _manufacturerId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _urnStatusAtStart_decorators;
    var _urnStatusAtStart_initializers = [];
    var _urnStatusAtStart_extraInitializers = [];
    var _startedAt_decorators;
    var _startedAt_initializers = [];
    var _startedAt_extraInitializers = [];
    var _completedAt_decorators;
    var _completedAt_initializers = [];
    var _completedAt_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _createdBy_decorators;
    var _createdBy_initializers = [];
    var _createdBy_extraInitializers = [];
    var _updatedBy_decorators;
    var _updatedBy_initializers = [];
    var _updatedBy_extraInitializers = [];
    var RenewalCycle = _classThis = /** @class */ (function () {
        function RenewalCycle_1() {
            this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
            this.cycleNo = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _cycleNo_initializers, void 0));
            this.paymentId = (__runInitializers(this, _cycleNo_extraInitializers), __runInitializers(this, _paymentId_initializers, void 0));
            this.vendorId = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.status = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.urnStatusAtStart = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _urnStatusAtStart_initializers, void 0));
            this.startedAt = (__runInitializers(this, _urnStatusAtStart_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.createdBy = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            __runInitializers(this, _updatedBy_extraInitializers);
        }
        return RenewalCycle_1;
    }());
    __setFunctionName(_classThis, "RenewalCycle");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true, index: true })];
        _cycleNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _paymentId_decorators = [(0, mongoose_1.Prop)()];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _manufacturerId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Manufacturer', required: true })];
        _status_decorators = [(0, mongoose_1.Prop)({
                required: true,
                enum: Object.values(RenewalCycleStatus),
                default: RenewalCycleStatus.IN_PROGRESS,
            })];
        _urnStatusAtStart_decorators = [(0, mongoose_1.Prop)()];
        _startedAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _completedAt_decorators = [(0, mongoose_1.Prop)()];
        _createdAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _updatedAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _createdBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        _updatedBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true })];
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _cycleNo_decorators, { kind: "field", name: "cycleNo", static: false, private: false, access: { has: function (obj) { return "cycleNo" in obj; }, get: function (obj) { return obj.cycleNo; }, set: function (obj, value) { obj.cycleNo = value; } }, metadata: _metadata }, _cycleNo_initializers, _cycleNo_extraInitializers);
        __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: function (obj) { return "paymentId" in obj; }, get: function (obj) { return obj.paymentId; }, set: function (obj, value) { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: function (obj) { return "manufacturerId" in obj; }, get: function (obj) { return obj.manufacturerId; }, set: function (obj, value) { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _urnStatusAtStart_decorators, { kind: "field", name: "urnStatusAtStart", static: false, private: false, access: { has: function (obj) { return "urnStatusAtStart" in obj; }, get: function (obj) { return obj.urnStatusAtStart; }, set: function (obj, value) { obj.urnStatusAtStart = value; } }, metadata: _metadata }, _urnStatusAtStart_initializers, _urnStatusAtStart_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: function (obj) { return "startedAt" in obj; }, get: function (obj) { return obj.startedAt; }, set: function (obj, value) { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: function (obj) { return "completedAt" in obj; }, get: function (obj) { return obj.completedAt; }, set: function (obj, value) { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: function (obj) { return "createdBy" in obj; }, get: function (obj) { return obj.createdBy; }, set: function (obj, value) { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: function (obj) { return "updatedBy" in obj; }, get: function (obj) { return obj.updatedBy; }, set: function (obj, value) { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewalCycle = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewalCycle = _classThis;
}();
exports.RenewalCycle = RenewalCycle;
exports.RenewalCycleSchema = mongoose_1.SchemaFactory.createForClass(RenewalCycle);
exports.RenewalCycleSchema.index({ urnNo: 1, cycleNo: 1 }, { unique: true, name: 'uniq_renewal_cycle_urn_cycle' });
exports.RenewalCycleSchema.index({ urnNo: 1, status: 1 }, { name: 'idx_renewal_cycle_urn_status' });
