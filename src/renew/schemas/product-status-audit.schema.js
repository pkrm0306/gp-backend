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
exports.ProductStatusAuditSchema = exports.ProductStatusAudit = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var ProductStatusAudit = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'product_status_audits', timestamps: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _fromStatus_decorators;
    var _fromStatus_initializers = [];
    var _fromStatus_extraInitializers = [];
    var _toStatus_decorators;
    var _toStatus_initializers = [];
    var _toStatus_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    var _changedBy_decorators;
    var _changedBy_initializers = [];
    var _changedBy_extraInitializers = [];
    var _changedAt_decorators;
    var _changedAt_initializers = [];
    var _changedAt_extraInitializers = [];
    var ProductStatusAudit = _classThis = /** @class */ (function () {
        function ProductStatusAudit_1() {
            this.productId = __runInitializers(this, _productId_initializers, void 0);
            this.urnNo = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _urnNo_initializers, void 0));
            this.fromStatus = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _fromStatus_initializers, void 0));
            this.toStatus = (__runInitializers(this, _fromStatus_extraInitializers), __runInitializers(this, _toStatus_initializers, void 0));
            this.reason = (__runInitializers(this, _toStatus_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.changedBy = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _changedBy_initializers, void 0));
            this.changedAt = (__runInitializers(this, _changedBy_extraInitializers), __runInitializers(this, _changedAt_initializers, void 0));
            __runInitializers(this, _changedAt_extraInitializers);
        }
        return ProductStatusAudit_1;
    }());
    __setFunctionName(_classThis, "ProductStatusAudit");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _productId_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true })];
        _urnNo_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _fromStatus_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _toStatus_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _reason_decorators = [(0, mongoose_1.Prop)()];
        _changedBy_decorators = [(0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true })];
        _changedAt_decorators = [(0, mongoose_1.Prop)({ required: true })];
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
        __esDecorate(null, null, _fromStatus_decorators, { kind: "field", name: "fromStatus", static: false, private: false, access: { has: function (obj) { return "fromStatus" in obj; }, get: function (obj) { return obj.fromStatus; }, set: function (obj, value) { obj.fromStatus = value; } }, metadata: _metadata }, _fromStatus_initializers, _fromStatus_extraInitializers);
        __esDecorate(null, null, _toStatus_decorators, { kind: "field", name: "toStatus", static: false, private: false, access: { has: function (obj) { return "toStatus" in obj; }, get: function (obj) { return obj.toStatus; }, set: function (obj, value) { obj.toStatus = value; } }, metadata: _metadata }, _toStatus_initializers, _toStatus_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _changedBy_decorators, { kind: "field", name: "changedBy", static: false, private: false, access: { has: function (obj) { return "changedBy" in obj; }, get: function (obj) { return obj.changedBy; }, set: function (obj, value) { obj.changedBy = value; } }, metadata: _metadata }, _changedBy_initializers, _changedBy_extraInitializers);
        __esDecorate(null, null, _changedAt_decorators, { kind: "field", name: "changedAt", static: false, private: false, access: { has: function (obj) { return "changedAt" in obj; }, get: function (obj) { return obj.changedAt; }, set: function (obj, value) { obj.changedAt = value; } }, metadata: _metadata }, _changedAt_initializers, _changedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductStatusAudit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductStatusAudit = _classThis;
}();
exports.ProductStatusAudit = ProductStatusAudit;
exports.ProductStatusAuditSchema = mongoose_1.SchemaFactory.createForClass(ProductStatusAudit);
exports.ProductStatusAuditSchema.index({ productId: 1, changedAt: -1 });
exports.ProductStatusAuditSchema.index({ urnNo: 1, changedAt: -1 });
