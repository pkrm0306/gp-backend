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
exports.CronEmailLogSchema = exports.CronEmailLog = exports.CRON_JOB_TYPES = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
exports.CRON_JOB_TYPES = [
    'before2month',
    'weeklyMail',
    'deactivationMail',
];
var CronEmailLog = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'cron_email_logs', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _eoiNo_decorators;
    var _eoiNo_initializers = [];
    var _eoiNo_extraInitializers = [];
    var _jobType_decorators;
    var _jobType_initializers = [];
    var _jobType_extraInitializers = [];
    var _notifyDate_decorators;
    var _notifyDate_initializers = [];
    var _notifyDate_extraInitializers = [];
    var _vendorId_decorators;
    var _vendorId_initializers = [];
    var _vendorId_extraInitializers = [];
    var _renewCycleNo_decorators;
    var _renewCycleNo_initializers = [];
    var _renewCycleNo_extraInitializers = [];
    var _urnStatus_decorators;
    var _urnStatus_initializers = [];
    var _urnStatus_extraInitializers = [];
    var _productRenewStatus_decorators;
    var _productRenewStatus_initializers = [];
    var _productRenewStatus_extraInitializers = [];
    var _renewalCycleId_decorators;
    var _renewalCycleId_initializers = [];
    var _renewalCycleId_extraInitializers = [];
    var _sentAt_decorators;
    var _sentAt_initializers = [];
    var _sentAt_extraInitializers = [];
    var CronEmailLog = _classThis = /** @class */ (function () {
        function CronEmailLog_1() {
            this.productId = __runInitializers(this, _productId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.eoiNo = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _eoiNo_initializers, void 0));
            this.jobType = (__runInitializers(this, _eoiNo_extraInitializers), __runInitializers(this, _jobType_initializers, void 0));
            this.notifyDate = (__runInitializers(this, _jobType_extraInitializers), __runInitializers(this, _notifyDate_initializers, void 0));
            this.vendorId = (__runInitializers(this, _notifyDate_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.renewCycleNo = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _renewCycleNo_initializers, void 0));
            this.urnStatus = (__runInitializers(this, _renewCycleNo_extraInitializers), __runInitializers(this, _urnStatus_initializers, void 0));
            this.productRenewStatus = (__runInitializers(this, _urnStatus_extraInitializers), __runInitializers(this, _productRenewStatus_initializers, void 0));
            this.renewalCycleId = (__runInitializers(this, _productRenewStatus_extraInitializers), __runInitializers(this, _renewalCycleId_initializers, void 0));
            this.sentAt = (__runInitializers(this, _renewalCycleId_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
            __runInitializers(this, _sentAt_extraInitializers);
        }
        return CronEmailLog_1;
    }());
    __setFunctionName(_classThis, "CronEmailLog");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _productId_decorators = [(0, mongoose_1.Prop)({ required: true, type: Number })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _eoiNo_decorators = [(0, mongoose_1.Prop)()];
        _jobType_decorators = [(0, mongoose_1.Prop)({ required: true, enum: exports.CRON_JOB_TYPES })];
        _notifyDate_decorators = [(0, mongoose_1.Prop)()];
        _vendorId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', required: true })];
        _renewCycleNo_decorators = [(0, mongoose_1.Prop)()];
        _urnStatus_decorators = [(0, mongoose_1.Prop)()];
        _productRenewStatus_decorators = [(0, mongoose_1.Prop)()];
        _renewalCycleId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId })];
        _sentAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _eoiNo_decorators, { kind: "field", name: "eoiNo", static: false, private: false, access: { has: function (obj) { return "eoiNo" in obj; }, get: function (obj) { return obj.eoiNo; }, set: function (obj, value) { obj.eoiNo = value; } }, metadata: _metadata }, _eoiNo_initializers, _eoiNo_extraInitializers);
        __esDecorate(null, null, _jobType_decorators, { kind: "field", name: "jobType", static: false, private: false, access: { has: function (obj) { return "jobType" in obj; }, get: function (obj) { return obj.jobType; }, set: function (obj, value) { obj.jobType = value; } }, metadata: _metadata }, _jobType_initializers, _jobType_extraInitializers);
        __esDecorate(null, null, _notifyDate_decorators, { kind: "field", name: "notifyDate", static: false, private: false, access: { has: function (obj) { return "notifyDate" in obj; }, get: function (obj) { return obj.notifyDate; }, set: function (obj, value) { obj.notifyDate = value; } }, metadata: _metadata }, _notifyDate_initializers, _notifyDate_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: function (obj) { return "vendorId" in obj; }, get: function (obj) { return obj.vendorId; }, set: function (obj, value) { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _renewCycleNo_decorators, { kind: "field", name: "renewCycleNo", static: false, private: false, access: { has: function (obj) { return "renewCycleNo" in obj; }, get: function (obj) { return obj.renewCycleNo; }, set: function (obj, value) { obj.renewCycleNo = value; } }, metadata: _metadata }, _renewCycleNo_initializers, _renewCycleNo_extraInitializers);
        __esDecorate(null, null, _urnStatus_decorators, { kind: "field", name: "urnStatus", static: false, private: false, access: { has: function (obj) { return "urnStatus" in obj; }, get: function (obj) { return obj.urnStatus; }, set: function (obj, value) { obj.urnStatus = value; } }, metadata: _metadata }, _urnStatus_initializers, _urnStatus_extraInitializers);
        __esDecorate(null, null, _productRenewStatus_decorators, { kind: "field", name: "productRenewStatus", static: false, private: false, access: { has: function (obj) { return "productRenewStatus" in obj; }, get: function (obj) { return obj.productRenewStatus; }, set: function (obj, value) { obj.productRenewStatus = value; } }, metadata: _metadata }, _productRenewStatus_initializers, _productRenewStatus_extraInitializers);
        __esDecorate(null, null, _renewalCycleId_decorators, { kind: "field", name: "renewalCycleId", static: false, private: false, access: { has: function (obj) { return "renewalCycleId" in obj; }, get: function (obj) { return obj.renewalCycleId; }, set: function (obj, value) { obj.renewalCycleId = value; } }, metadata: _metadata }, _renewalCycleId_initializers, _renewalCycleId_extraInitializers);
        __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: function (obj) { return "sentAt" in obj; }, get: function (obj) { return obj.sentAt; }, set: function (obj, value) { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CronEmailLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CronEmailLog = _classThis;
}();
exports.CronEmailLog = CronEmailLog;
exports.CronEmailLogSchema = mongoose_1.SchemaFactory.createForClass(CronEmailLog);
exports.CronEmailLogSchema.index({ productId: 1, jobType: 1, notifyDate: 1 }, { unique: true, name: 'uniq_cron_email_log_product_job_date' });
